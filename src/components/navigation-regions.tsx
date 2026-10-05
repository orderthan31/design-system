import React, {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Dialog, type DialogProps } from "./organisms";
import { Button } from "./atoms";
import { Tabs, Menu, Tooltip } from "./navigation";
import "./navigation-regions.css";

export function NavigationRegionsGallery() {
  const id = useId();
  const destinations = [
    { id: "intro", label: "살펴보기" },
    { id: "parts", label: "구성 요소" },
    { id: "guide", label: "사용 안내" },
  ];
  const [selected, setSelected] = useState("intro");
  const [local, setLocal] = useState("start");
  const [drawer, setDrawer] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [nestedSheet, setNestedSheet] = useState(false);
  const [message, setMessage] = useState(
    "항목을 선택하거나 상세 영역을 열어 보세요.",
  );
  const currentLabel = destinations.find((item) => item.id === selected)!.label;
  const groups = [
    {
      id: "basics",
      label: "기본 안내",
      items: [
        { id: "start", label: "시작하기" },
        { id: "structure", label: "영역 구성" },
      ],
    },
    {
      id: "more",
      label: "더 살펴보기",
      items: [{ id: "keyboard", label: "키보드 사용" }],
    },
  ];
  function applySelection() {
    setMessage("선택 적용됨");
    setSheet(false);
    setNestedSheet(false);
  }
  const sheetBody = (
    <>
      <p>화면 아래에서 간단한 선택을 확인합니다.</p>
      <Button onClick={applySelection}>선택 적용</Button>
    </>
  );
  return (
    <section className="nr-gallery" aria-labelledby={`${id}-heading`}>
      <header className="nr-gallery-heading">
        <div>
          <p className="nr-eyebrow">탐색과 상세 영역</p>
          <h2 id={`${id}-heading`}>어디에 있는지, 무엇을 할 수 있는지</h2>
        </div>
        <Tooltip
          label="탐색 도움말"
          text="선택한 항목은 현재 위치에 표시됩니다."
        />
      </header>
      <div className="nr-preview">
        <GNB
          label="주요 탐색"
          items={destinations}
          selectedId={selected}
          onSelect={setSelected}
        />
        <div className="nr-workspace">
          <LNB
            groups={groups}
            selectedId={local}
            onSelect={(value) => {
              setLocal(value);
              setMessage(
                `${groups.flatMap((group) => group.items).find((item) => item.id === value)!.label} 선택됨`,
              );
            }}
          />
          <div className="nr-content" id={`${id}-content`}>
            <Breadcrumb
              items={[
                { label: "안내", href: `#${id}-heading` },
                { label: currentLabel },
              ]}
            />
            <h3>{currentLabel}</h3>
            <Tabs
              label="영역 예시"
              items={[
                {
                  label: "미리보기",
                  content: (
                    <div className="nr-demo-body">
                      <div className="nr-actions">
                        <Button onClick={() => setDrawer(true)}>
                          측면 영역 열기
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setSheet(true)}
                        >
                          하단 영역 열기
                        </Button>
                        <Popover label="추가 안내" title="탐색 안내">
                          <p>현재 화면을 떠나지 않고 안내를 확인합니다.</p>
                          <Menu
                            label="안내 작업"
                            items={["안내 표시", "안내 접기"]}
                            onSelect={(value) => setMessage(`${value} 선택됨`)}
                          />
                        </Popover>
                      </div>
                    </div>
                  ),
                },
                {
                  label: "사용 방법",
                  content: (
                    <div className="nr-demo-body">
                      <p>
                        방향키로 탭을 이동하고 Escape로 열린 영역을 닫을 수
                        있습니다.
                      </p>
                      <p>
                        측면과 하단 영역은 배경 스크롤을 잠그며, 작은 안내는
                        다른 작업을 막지 않습니다.
                      </p>
                    </div>
                  ),
                },
              ]}
            />
            <p className="nr-status" role="status">
              {message}
            </p>
          </div>
        </div>
      </div>
      <Drawer
        open={drawer}
        title="측면 상세"
        onClose={() => {
          setDrawer(false);
          setNestedSheet(false);
        }}
        footer={
          <Button
            variant="secondary"
            onClick={() => {
              setDrawer(false);
              setNestedSheet(false);
            }}
          >
            상세 닫기
          </Button>
        }
      >
        <Tabs
          label="상세 보기"
          items={[
            {
              label: "내용",
              content: (
                <div className="nr-demo-body">
                  <p>현재 화면 옆에서 추가 정보를 살펴봅니다.</p>
                  <Button onClick={() => setNestedSheet(true)}>
                    하단 영역 열기
                  </Button>
                </div>
              ),
            },
            {
              label: "도움말",
              content: (
                <div className="nr-demo-body">
                  <Tooltip
                    label="상세 도움말"
                    text="하단 영역을 닫아도 측면 영역은 유지됩니다."
                  />
                </div>
              ),
            },
          ]}
        />
        <BottomSheet
          open={nestedSheet}
          title="하단 선택"
          onClose={() => setNestedSheet(false)}
        >
          {sheetBody}
        </BottomSheet>
      </Drawer>
      <BottomSheet
        open={sheet}
        title="하단 선택"
        onClose={() => setSheet(false)}
      >
        {sheetBody}
      </BottomSheet>
    </section>
  );
}

export type PopoverProps = {
  label: string;
  title: string;
  children: React.ReactNode;
};
export function Popover({ label, title, children }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        close();
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        close();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div
      className="nr-popover"
      ref={root}
      onKeyDown={(event) => {
        if (open && event.key === "Escape" && !event.defaultPrevented) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
      }}
    >
      <button
        type="button"
        className="button secondary"
        ref={trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {label}
      </button>
      {open && (
        <div
          className="nr-popover-panel"
          id={id}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${id}-title`}
        >
          <h3 id={`${id}-title`}>{title}</h3>
          {children}
        </div>
      )}
    </div>
  );
}

export type ModalRegionProps = DialogProps;
function ModalRegion({kind,...props}: ModalRegionProps & {kind:"drawer"|"sheet"}) {
  return props.open ? <div className={`nr-modal nr-${kind}`}><Dialog {...props}/></div> : null;
}
export function Drawer(props: ModalRegionProps) {
  return <ModalRegion {...props} kind="drawer" />;
}
export function BottomSheet(props: ModalRegionProps) {
  return <ModalRegion {...props} kind="sheet" />;
}

export type BreadcrumbItem = { label: string; href?: string };
export function Breadcrumb({
  items,
  label = "현재 위치",
}: {
  items: BreadcrumbItem[];
  label?: string;
}) {
  return (
    <nav className="nr-breadcrumb" aria-label={label}>
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export type NavigationItem = { id: string; label: string; disabled?: boolean };
export type NavigationProps = {
  items: NavigationItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  label?: string;
};
export type NavigationGroup = {
  id: string;
  label: string;
  items: NavigationItem[];
};
export function LNB({
  groups,
  selectedId,
  onSelect,
  label = "영역 탐색",
}: Omit<NavigationProps, "items"> & { groups: NavigationGroup[] }) {
  const [expanded, setExpanded] = useState(true);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const id = useId();
  return (
    <nav className="nr-lnb" aria-label={label}>
      <Button
        variant="secondary"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded(!expanded)}
      >
        {label} {expanded ? "접기" : "펼치기"}
      </Button>
      <div id={id} hidden={!expanded}>
        {groups.map((group) => (
          <section key={group.id}>
            <Button
              variant="quiet"
              aria-expanded={!collapsed.includes(group.id)}
              aria-controls={`${id}-${group.id}`}
              onClick={() =>
                setCollapsed((current) =>
                  current.includes(group.id)
                    ? current.filter((value) => value !== group.id)
                    : [...current, group.id],
                )
              }
            >
              {group.label}
            </Button>
            <ul id={`${id}-${group.id}`} hidden={collapsed.includes(group.id)}>
              {group.items.map((item) => (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    disabled={item.disabled}
                    aria-current={selectedId === item.id ? "page" : undefined}
                    onClick={() => onSelect(item.id)}
                  >
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  );
}

export function GNB({
  items,
  selectedId,
  onSelect,
  label = "전체 탐색",
}: NavigationProps) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <nav className="nr-gnb" aria-label={label} data-expanded={expanded}>
      <Button
        variant="secondary"
        className="nr-mobile-toggle"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded(!expanded)}
      >
        {label} {expanded ? "접기" : "펼치기"}
      </Button>
      <ul id={id}>
        {items.map((item) => (
          <li key={item.id}>
            <Button
              variant="ghost"
              disabled={item.disabled}
              aria-current={selectedId === item.id ? "page" : undefined}
              onClick={() => {
                onSelect(item.id);
                setExpanded(false);
              }}
            >
              {item.label}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

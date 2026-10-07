import React, { useId, useState } from "react";
import { Button } from "./button";
import { Tabs, Menu, Tooltip } from "./navigation";
import "./navigation-regions.css";
import { Popover } from "./popover";
export { Popover } from "./popover";
import { Drawer } from "./drawer";
export { Drawer } from "./drawer";
import { BottomSheet } from "./bottom-sheet";
export { BottomSheet } from "./bottom-sheet";
import { Breadcrumb } from "./breadcrumb";
export { Breadcrumb } from "./breadcrumb";
import { GNB } from "./gnb";
export { GNB } from "./gnb";
import { LNB } from "./lnb";
export { LNB } from "./lnb";
export type { PopoverProps } from "./popover";
export type { ModalRegionProps } from "./modal-region";
export type { BreadcrumbItem } from "./breadcrumb";
export type { NavigationItem, NavigationProps, NavigationGroup } from "./navigation-types";
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

import React, { useId, useState } from "react";
import { Button, Input } from "../components/atoms";
import { ActionGroup } from "../components/composition";
import { RadioGroup } from "../components/form-controls";
import { BottomSheet, Drawer } from "../components/navigation-regions";
import { Menu, Tooltip } from "../components/navigation";
import { Confirm, Dialog } from "../components/organisms";

type Demo = "notice" | "choice" | "input" | "scroll" | "work";
export function OverlayDetail({ kind }: { kind: "bottom-sheet" | "dialog" }) {
  const id = useId();
  const [demo, setDemo] = useState<Demo | null>(null);
  const [desktop, setDesktop] = useState(false);
  const [status, setStatus] = useState("아직 적용 전");
  const [choice, setChoice] = useState("간단히");
  const [draft, setDraft] = useState(choice);
  const [name, setName] = useState("");
  const [draftName, setDraftName] = useState(name);
  const [child, setChild] = useState<"confirm" | "drawer" | null>(null);
  const Surface = kind === "bottom-sheet" && !desktop ? BottomSheet : Dialog;
  function show(next: Demo) {
    setDesktop(window.matchMedia?.("(min-width: 641px)").matches ?? false);
    setDraft(choice);
    setDraftName(name);
    setDemo(next);
  }
  const close = () => {
    setChild(null);
    setDemo(null);
  };
  function apply() {
    if (demo === "choice") {
      setChoice(draft);
      setStatus(`옵션: ${draft}`);
    }
    if (demo === "input") {
      if (!draftName.trim()) return;
      setName(draftName.trim());
      setStatus(`이름: ${draftName.trim()}`);
    }
    if (demo === "notice") setStatus("안내 확인됨");
    if (demo === "scroll") setStatus("긴 안내 확인됨");
    if (demo === "work") setStatus("작업 확인됨");
    close();
  }
  const title =
    demo === "notice"
      ? "간단한 안내"
      : demo === "choice"
        ? "옵션 선택"
        : demo === "input"
          ? "이름 입력"
          : demo === "work"
            ? "작업 안내"
            : "긴 안내";
  const source = `import { useState } from "react";
import { BottomSheet, Dialog, Button, ActionGroup, RadioGroup } from "./src/index";
// 저장소 루트 기준. 소비 앱은 core.css와 default-theme.css를 한 번 로드해요.

export function Example() {
  const [open, setOpen] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [value, setValue] = useState("간단히");
  const [draft, setDraft] = useState(value);
  const close = () => setOpen(false);
  const props = {
    open, title: "옵션 선택", onClose: close,
    children: <RadioGroup label="보기 방식" value={draft} onValueChange={setDraft}
      options={[{ value: "간단히", label: "간단히" }, { value: "자세히", label: "자세히" }]} />,
    footer: <ActionGroup>
      <Button variant="secondary" onClick={close}>취소</Button>
      <Button onClick={() => { setValue(draft); close(); }}>적용</Button>
    </ActionGroup>,
  };
  return <>
    <Button onClick={() => {
      setDraft(value);
      setDesktop(window.matchMedia("(min-width: 641px)").matches);
      setOpen(true);
    }}>옵션 선택</Button>
    <p role="status">옵션: {value}</p>
    ${kind === "bottom-sheet" ? "{desktop ? <Dialog {...props} /> : <BottomSheet {...props} />}" : "<Dialog {...props} />"}
  </>;
}`;
  return (
    <section
      className="nr-gallery"
      aria-label={kind === "bottom-sheet" ? "BottomSheet 상세" : "Dialog 상세"}
    >
      <section id={`${id}-demo`} aria-label="라이브 예시">
        <h2>예시</h2>
        <p className="help">
          {kind === "bottom-sheet"
            ? "작은 화면은 하단 시트, PC는 중앙 Dialog. 열 때 화면 크기를 확인해요."
            : "제목·본문·하단 동작을 실제 Dialog로 확인해요."}
        </p>
        <ActionGroup label="예시 열기">
          <Button onClick={() => show("notice")}>안내 열기</Button>
          <Button variant="secondary" onClick={() => show("choice")}>
            옵션 선택
          </Button>
          <Button variant="secondary" onClick={() => show("input")}>
            이름 입력
          </Button>
          <Button variant="secondary" onClick={() => show("scroll")}>
            긴 내용
          </Button>
          {kind === "dialog" && (
            <Button variant="secondary" onClick={() => show("work")}>
              작업 열기
            </Button>
          )}
        </ActionGroup>
        <p role="status">{status}</p>
        {demo && (
          <Surface
            open
            title={title}
            onClose={close}
            footer={
              <ActionGroup label="예시 동작">
                {(demo === "choice" || demo === "input") && (
                  <Button variant="secondary" onClick={close}>
                    취소
                  </Button>
                )}
                <Button
                  onClick={apply}
                  disabled={demo === "input" && !draftName.trim()}
                >
                  {demo === "choice"
                    ? "적용"
                    : demo === "input"
                      ? "저장"
                      : demo === "scroll"
                        ? "읽음"
                        : "확인"}
                </Button>
              </ActionGroup>
            }
          >
            {demo === "notice" && <p>현재 화면에서 안내를 확인해요.</p>}
            {demo === "choice" && (
              <RadioGroup
                label="보기 방식"
                options={[
                  { value: "간단히", label: "간단히" },
                  { value: "자세히", label: "자세히" },
                ]}
                value={draft}
                onValueChange={setDraft}
              />
            )}
            {demo === "input" && (
              <div className="field">
                <label htmlFor={`${id}-name`}>이름 (필수)</label>
                <Input
                  id={`${id}-name`}
                  required
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  aria-describedby={`${id}-hint`}
                />
                <p id={`${id}-hint`} className="help">
                  공백만 입력할 수 없어요. 저장 전에는 반영되지 않아요.
                </p>
              </div>
            )}
            {demo === "work" && (
              <>
                <p>현재 항목의 작업을 확인해요.</p>
                <ActionGroup label="본문 작업">
                  <Menu
                    label="작업 메뉴"
                    items={["복제", "보관"]}
                    onSelect={(value) => setStatus(`${value} 완료`)}
                  />
                  <Tooltip label="도움말" text="먼저 열린 도움말만 닫혀요." />
                  <Button
                    variant="destructive"
                    onClick={() => setChild("confirm")}
                  >
                    삭제 확인
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setChild("drawer")}
                  >
                    측면 열기
                  </Button>
                </ActionGroup>
                {child === "confirm" && (
                  <Confirm
                    open
                    title="삭제할까요?"
                    onClose={() => setChild(null)}
                    onConfirm={() => {
                      setStatus("예시 삭제됨");
                      setChild(null);
                    }}
                  >
                    <p>
                      이 예시의 상태만 바뀌어요. 실제 데이터는 삭제하지 않아요.
                    </p>
                  </Confirm>
                )}
                {child === "drawer" && (
                  <Drawer
                    open
                    title="측면 상세"
                    onClose={() => setChild(null)}
                    footer={
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setStatus("측면 확인됨");
                          setChild(null);
                        }}
                      >
                        완료
                      </Button>
                    }
                  >
                    <p>부모 대화상자를 유지한 채 추가 정보를 확인해요.</p>
                  </Drawer>
                )}
              </>
            )}
            {demo === "scroll" && (
              <div
                role="region"
                aria-label="안내 내용"
                tabIndex={0}
                style={{
                  maxHeight: "45dvh",
                  overflowY: "auto",
                  overscrollBehavior: "contain",
                }}
              >
                <ol>
                  {Array.from({ length: 12 }, (_, index) => (
                    <li key={index}>
                      <h3>안내 {index + 1}</h3>
                      <p>
                        본문은 이 영역에서 스크롤해요. 내용을 확인한 뒤 아래의
                        읽음을 눌러 주세요.
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </Surface>
        )}
      </section>
      <details>
        <summary>코드</summary>
        <pre className="code">
          <code>{source}</code>
        </pre>
        <p className="help">
          공개 진입점은 src/index.ts예요. Confirm·Drawer·Menu·Tooltip·Input도
          같은 경로에서 가져와요.
        </p>
      </details>
      <details>
        <summary>Props</summary>
        <table>
          <caption>
            DialogProps · BottomSheet와 Drawer는 ModalRegionProps = DialogProps
          </caption>
          <thead>
            <tr>
              <th scope="col">이름</th>
              <th scope="col">타입</th>
              <th scope="col">필수 / 기본값</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">open</th>
              <td>boolean</td>
              <td>필수 · 기본값 없음</td>
            </tr>
            <tr>
              <th scope="row">title</th>
              <td>string</td>
              <td>필수 · 기본값 없음</td>
            </tr>
            <tr>
              <th scope="row">children</th>
              <td>React.ReactNode</td>
              <td>필수 · 기본값 없음</td>
            </tr>
            <tr>
              <th scope="row">onClose</th>
              <td>() =&gt; void</td>
              <td>필수 · 부모가 open을 false로 바꿔요</td>
            </tr>
            <tr>
              <th scope="row">footer</th>
              <td>React.ReactNode</td>
              <td>선택 · 기본값 없음</td>
            </tr>
          </tbody>
        </table>
        <ul>
          <li>
            Confirm: Omit&lt;DialogProps, "footer"&gt; + onConfirm: () =&gt;
            void (필수), loading = false. 취소·확인 버튼을 제공해요. 확인 후
            닫기는 소비자가 처리해요.
          </li>
          <li>
            ActionGroup: children 필수, label = "동작". Button: variant =
            "primary", size = "medium", loading = false, type = "button".
          </li>
          <li>
            RadioGroup: label: string, options: ChoiceOption[] 필수. value?:
            string, defaultValue = "", onValueChange?: (value: string) =&gt;
            void.
          </li>
          <li>
            Input: 네이티브 input 속성 + loading = false, busyLabel = "입력 확인
            중…". label은 별도로 연결해요.
          </li>
          <li>
            Menu: label = "작업 메뉴", items = ["복제", "보관"], onSelect?:
            (value: string) =&gt; void. Tooltip: label·text: string 필수.
          </li>
        </ul>
      </details>
      <details>
        <summary>구성</summary>
        <p>
          <code>
            {kind === "bottom-sheet"
              ? "화면 → BottomSheet(작은 화면) / Dialog(PC) → 제목 + 본문(RadioGroup / Input / 스크롤) + footer(ActionGroup → Button)"
              : "화면 → Dialog → 제목 + 본문(Menu / Tooltip / Input) + footer(ActionGroup → Button)"}
          </code>
        </p>
        <p>
          <code>
            Dialog → Confirm / Drawer → Dialog의 공통 포커스·스크롤 소유권
          </code>
        </p>
        <p className="help">
          제목·본문은 필수예요. 단일 확인은 CTA 하나, 선택·입력은 취소와 적용을
          함께 둬요.
        </p>
      </details>
      <details>
        <summary>접근성·주의</summary>
        <ul>
          <li>
            title은 접근 가능한 이름이에요. 필수 입력은 label·required·설명을
            연결하고, 공백만 있는 값은 저장하지 않아요.
          </li>
          <li>
            초안과 적용값을 분리해요. 취소는 반영하지 않아요. 닫기와 Escape도
            적용하지 않아요.
          </li>
          <li>
            삭제 등 위험한 작업은 결과를 설명하고 Confirm에서 명시적으로
            확인해요. 이 예시는 메모리 상태만 바꿔요.
          </li>
          <li>
            기존 Dialog가 모달·포커스·배경 스크롤을 관리해요. 깊게 열린 자식부터
            Escape를 처리하고, 부모를 유지해요. Menu·Tooltip도 첫 Escape를
            소비해요.
          </li>
          <li>
            닫으면 연결된 열기 버튼으로 포커스를 돌려요. 마지막 모달이 닫힐 때
            기존 overflow 값과 !important 우선순위를 복원해요.
          </li>
          <li>
            긴 본문만 스크롤하고 하단 동작은 바깥에 둬요. 작은 화면·키보드·확대
            환경에서 입력과 CTA 가림을 확인해요.
          </li>
        </ul>
        <p>
          <a href={`#${id}-demo`}>라이브 회귀 예시</a> ·{" "}
          <code>tests/overlay-detail.test.tsx</code> ·{" "}
          <code>tests/modal-ownership.test.tsx</code>
        </p>
        <p className="help">
          jsdom은 native modality를 인증하지 않아요. 실제 top layer·배경
          inert·Tab 이동·모바일 배치는 Chromium 회귀 확인이 필요해요.
        </p>
      </details>
    </section>
  );
}

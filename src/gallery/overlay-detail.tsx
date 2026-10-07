import {GalleryDocs} from './workbench';
import {CodeBlock} from './code-block';
import '../examples.css';
import './playground.css';
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
                className="example-overlay-scroll"
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
      <GalleryDocs>
        <summary>코드</summary>
        <CodeBlock source={source}/>

      </GalleryDocs>
      <GalleryDocs>
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
          <li>Confirm에는 open·title·children·onClose와 onConfirm을 지정합니다. loading의 기본값은 false입니다. 취소와 확인 버튼을 제공하며 작업 완료 후 open을 갱신하세요.</li>
          <li>ActionGroup에 관련 버튼을 넣습니다. Button의 기본값은 variant=primary, size=medium, loading=false, type=button입니다.</li>
          <li>RadioGroup의 label과 options로 선택을 구성합니다. value/onValueChange로 관리하거나 defaultValue로 초기값을 지정하세요.</li>
          <li>Input에는 input 속성을 전달하고 라벨을 연결하세요. loading의 기본값은 false, busyLabel은 입력 확인 중…입니다.</li>
          <li>Menu에는 작업 목록과 onSelect를 지정합니다. Tooltip에는 버튼의 label과 설명 text를 넣습니다.</li>
        </ul>
      </GalleryDocs>
      <GalleryDocs>
        <summary>구성</summary>
        <p><code>{kind === 'bottom-sheet' ? 'BottomSheet → 제목 + 본문 + footer' : 'Dialog → 제목 + 본문 + footer'}</code></p>
        <p>내용 확인은 Dialog, 중요한 실행 전 확인은 Confirm, 옆에서 상세 내용을 보는 경우에는 Drawer를 선택하세요.</p>
        <p>대화상자의 목적을 title에 적고 children에 내용을 넣습니다. 입력과 선택이 있으면 취소와 적용 버튼을 함께 배치하세요.</p>
      </GalleryDocs>
      <GalleryDocs>
        <summary>접근성·주의</summary>
        <ul>
          <li>title은 대화상자의 접근 가능한 이름입니다. 입력에는 label·required와 필요한 도움말을 지정하세요.</li>
          <li>편집 중인 값과 적용한 값을 구분하세요. 취소와 Escape로 닫을 때는 변경을 적용하지 않습니다.</li>
          <li>삭제 등 되돌리기 어려운 동작은 결과를 설명하고 Confirm으로 실행 여부를 확인하세요.</li>
          <li>대화상자 안에서 Menu나 Tooltip을 열면 Escape로 해당 내용을 먼저 닫습니다. 중첩 대화상자는 가장 안쪽부터 닫습니다.</li>
          <li>닫을 때 열기 버튼으로 초점을 돌려줍니다. 마지막 대화상자를 닫으면 배경을 다시 사용할 수 있습니다.</li>
          <li>본문이 길면 내용 영역을 스크롤합니다. 작은 화면이나 확대 상태에서도 입력과 하단 버튼을 사용할 수 있게 배치하세요.</li>
        </ul>


      </GalleryDocs>
    </section>
  );
}

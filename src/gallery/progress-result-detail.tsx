import {GalleryDocs} from './workbench';
import {CodeBlock} from './code-block';
import './playground.css';
import React from "react";
import { Button } from "../components/atoms";
import { Progress } from "../components/primitives";
import { ProgressStepper, Result } from "../components/progress-result";

export interface ProgressResultDetailProps { kind: "progress-stepper" | "result" }
const steps = ["정보 입력", "내용 확인", "신청 완료"];

export function ProgressResultDetail({ kind }: ProgressResultDetailProps) {
  const [step, setStep] = React.useState(0);
  const [outcome, setOutcome] = React.useState<"error" | "success" | "empty" | "added">("error");
  const [message, setMessage] = React.useState("아직 결과를 확인하지 않았습니다.");
  const isProgress = kind === "progress-stepper";
  return <section className="ds-progress-result-detail" aria-label={isProgress ? "단계 진행 상세" : "결과 상세"}>
    <h2>{isProgress ? "단계 진행" : "결과"}</h2>
    <p>{isProgress ? "신청 흐름의 현재 위치를 표시합니다. 단계 자체는 이동 버튼이 아닙니다." : "성공·오류·빈 결과·안내를 조합합니다. 아래 동작은 서버 없이 메모리에서만 결과를 바꿉니다."}</p>
    {isProgress ? <>
      <ProgressStepper steps={steps} currentStep={step} label="신청 단계" />
      <div className="ds-result-actions">
        <Button variant="secondary" disabled={step === 0} onClick={() => setStep(value => Math.max(0, value - 1))}>이전 단계</Button>
        <Button disabled={step === steps.length - 1} onClick={() => setStep(value => Math.min(steps.length - 1, value + 1))}>다음 단계</Button>
        <Button variant="quiet" onClick={() => setStep(0)}>처음부터</Button>
      </div>
      <p role="status">{step + 1} / {steps.length} 단계: {steps[step]}</p>
      <Progress label="완료한 단계 비율" value={step / steps.length * 100} />
      <p>현재 단계 이전의 항목만 완료입니다. 마지막 단계에 도달해도 전체 완료를 의미하지 않습니다.</p>
    </> : <>
      <div className="ds-result-actions">
        <Button variant="secondary" onClick={() => { setOutcome("error"); setMessage("재시도할 수 있습니다."); }}>오류 다시 보기</Button>
        <Button variant="secondary" onClick={() => { setOutcome("empty"); setMessage("등록된 샘플 항목이 없습니다."); }}>빈 결과 보기</Button>
      </div>
      {outcome === "error" ? <Result variant="error" heading="신청 결과를 불러오지 못했습니다" guidance="입력 내용은 유지됩니다. 연결을 확인한 뒤 다시 시도해 주세요." actions={<Button onClick={() => { setOutcome("success"); setMessage("신청 번호 DEMO-001을 다시 불러왔습니다."); }}>다시 시도</Button>}><p>일시적인 연결 오류를 재현한 메모리 데모입니다. 실제 저장·전송은 하지 않습니다.</p></Result>
      : outcome === "empty" ? <Result variant="empty" heading="등록된 항목이 없습니다" actions={<Button onClick={() => { setOutcome("added"); setMessage("샘플 항목 1개를 추가했습니다."); }}>샘플 항목 추가</Button>}><p>처음 사용할 때는 항목을 추가하거나 검색 조건을 바꿔 보세요.</p></Result>
      : <Result variant="success" heading={outcome === "added" ? "샘플 항목을 추가했습니다" : "다시 불러왔습니다"} actions={<Button onClick={() => setMessage("신청 번호 DEMO-001의 결과를 확인했습니다.")}>결과 확인</Button>}><p>신청 번호 DEMO-001 · 검토 대기</p></Result>}
      <p role="status">{message}</p>
      <Result variant="info" heading="데모 이용 안내"><p>실제 서비스에서는 성공 여부를 서버 응답으로 판단하고, 파괴적 동작은 별도의 확인과 위험 안내를 제공하세요.</p></Result>
      <Result variant="info" heading="사용할 수 없는 동작 예시" actions={<><Button disabled>권한 필요</Button><Button loading>처리 중</Button></>}><p>비활성 버튼과 처리 중인 버튼은 동작하지 않습니다.</p></Result>
    </>}
    <GalleryDocs><summary>가져오기</summary><CodeBlock source={`import { ${isProgress ? "ProgressStepper" : "Result"} } from "./src/components/progress-result";\nimport { Button } from "./src/components/atoms";\nimport "./src/core.css";\nimport "./src/components/progress-result.css";\n// 앱 루트의 .ds-core 안에서 사용합니다.`}/></GalleryDocs>
    <GalleryDocs><summary>사용 코드</summary><CodeBlock source={isProgress
      ? `const [step, setStep] = useState(0);\n<ProgressStepper steps={["정보 입력", "내용 확인", "신청 완료"]} currentStep={step} />\n<Button disabled={step >= 2} onClick={() => setStep(s => Math.min(2, s + 1))}>다음 단계</Button>`
      : `const [retried, setRetried] = useState(false);\nretried ? <Result variant="success" heading="완료">결과를 불러왔습니다.</Result> :\n<Result variant="error" heading="불러오기 실패" guidance="연결을 확인한 뒤 다시 시도해 주세요."\n  actions={<Button onClick={() => setRetried(true)}>다시 시도</Button>}>입력 내용은 유지됩니다.</Result>`}/></GalleryDocs>
    <GalleryDocs><summary>API</summary>{isProgress
      ? <dl><dt>steps: readonly string[]</dt><dd>표시 순서의 텍스트 레이블. 빈 배열은 목록 대신 빈 상태를 표시합니다.</dd><dt>currentStep: number</dt><dd>0부터 시작하는 정수. 0 이상 steps.length 미만만 유효합니다. 음수·범위 밖·소수·NaN·Infinity는 모든 단계를 대기로 표시하고 오류 안내를 제공합니다. 전체 완료 sentinel은 없습니다.</dd><dt>label?: string</dt><dd>목록 이름. 기본값은 진행 단계입니다.</dd></dl>
      : <dl><dt>variant</dt><dd>success | error | empty | info. 필수 상태.</dd><dt>heading / children / actions</dt><dd>ReactNode 제목·필수 내용·선택 독립 동작 슬롯. 제목에는 제목 요소를 다시 넣지 않습니다.</dd><dt>headingLevel?: 2 | 3 | 4</dt><dd>기본값 3. 화면의 제목 계층에 맞춥니다.</dd><dt>guidance: string</dt><dd>error에서 필수 복구 안내. 나머지에서는 선택. 빈 오류 안내는 안전한 기본 안내로 대체됩니다.</dd></dl>}</GalleryDocs>
    <GalleryDocs><summary>조합</summary><p>{isProgress ? "단계는 ProgressStepper, 연속 백분율은 기존 Progress, 수량 변경은 NumberInput/Stepper의 책임입니다. 이 컴포넌트는 순서 목록이며 수치 입력이나 탐색 메뉴가 아닙니다." : "기존 Alert·Icon을 재사용하고 actions에 기존 Button을 조합합니다. EmptyState는 기본 액션을 항상 만들고 ErrorState는 재시도만 고정하므로 자유 슬롯과 비활성/로딩 조합에 직접 사용하지 않습니다. FeedbackTemplate은 고정된 템플릿 제목/구조가 필요한 화면용이며 Result는 제목 계층과 범용 결과 슬롯을 제공합니다."}</p></GalleryDocs>
    <GalleryDocs><summary>접근성</summary><p>{isProgress ? "ol/li 순서와 완료·진행 중·대기 텍스트를 함께 제공합니다. aria-current=step은 유효한 현재 항목 하나에만 지정합니다. 정적 단계에 탭 순서나 클릭 동작을 추가하지 않습니다. 변경 알림은 호출자가 별도 status로 제공합니다." : "제목 ID로 영역을 이름 짓고 상태 아이콘은 장식으로 숨깁니다. 오류는 Alert의 alert, 다른 상태는 status를 사용합니다. actions를 버튼으로 감싸지 않습니다. 슬롯 내부의 유효한 HTML과 동작 책임은 호출자에게 있습니다. Button은 기본 type=button이며 loading에서 실행을 막고 disabled를 유지합니다. 위험 안내를 색상만으로 전달하지 마세요."}</p><p>스타일은 .ds-core 범위에서 토큰 전경/배경을 사용하고 320px 폭을 고려해 줄바꿈합니다. jsdom 검사만으로 실제 브라우저 레이아웃·대비 검증을 완료했다고 주장하지 않습니다.</p></GalleryDocs>
  </section>;
}

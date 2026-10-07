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
    <p>{isProgress ? "여러 단계로 진행되는 신청에서 현재 위치를 확인합니다. 다음 단계 버튼으로 진행 위치를 바꿔 보세요." : "다시 시도, 항목 추가와 같은 다음 동작을 결과 메시지에 함께 배치합니다. 아래 버튼으로 상태별 예제를 확인하세요."}</p>
    {isProgress ? <>
      <ProgressStepper steps={steps} currentStep={step} label="신청 단계" />
      <div className="ds-result-actions">
        <Button variant="secondary" disabled={step === 0} onClick={() => setStep(value => Math.max(0, value - 1))}>이전 단계</Button>
        <Button disabled={step === steps.length - 1} onClick={() => setStep(value => Math.min(steps.length - 1, value + 1))}>다음 단계</Button>
        <Button variant="quiet" onClick={() => setStep(0)}>처음부터</Button>
      </div>
      <p role="status">{step + 1} / {steps.length} 단계: {steps[step]}</p>
      <Progress label="완료한 단계 비율" value={step / steps.length * 100} />
      <p>현재 위치 이전의 단계는 완료로 표시합니다. 전체 작업을 마친 뒤에는 별도의 결과 안내를 보여주세요.</p>
    </> : <>
      <div className="ds-result-actions">
        <Button variant="secondary" onClick={() => { setOutcome("error"); setMessage("재시도할 수 있습니다."); }}>오류 다시 보기</Button>
        <Button variant="secondary" onClick={() => { setOutcome("empty"); setMessage("등록된 샘플 항목이 없습니다."); }}>빈 결과 보기</Button>
      </div>
      {outcome === "error" ? <Result variant="error" heading="신청 결과를 불러오지 못했습니다" guidance="입력 내용은 유지됩니다. 연결을 확인한 뒤 다시 시도해 주세요." actions={<Button onClick={() => { setOutcome("success"); setMessage("신청 번호 DEMO-001을 다시 불러왔습니다."); }}>다시 시도</Button>}><p>연결을 확인한 뒤 다시 시도해 주세요. 입력한 내용은 유지됩니다.</p></Result>
      : outcome === "empty" ? <Result variant="empty" heading="등록된 항목이 없습니다" actions={<Button onClick={() => { setOutcome("added"); setMessage("샘플 항목 1개를 추가했습니다."); }}>샘플 항목 추가</Button>}><p>처음 사용할 때는 항목을 추가하거나 검색 조건을 바꿔 보세요.</p></Result>
      : <Result variant="success" heading={outcome === "added" ? "샘플 항목을 추가했습니다" : "다시 불러왔습니다"} actions={<Button onClick={() => setMessage("신청 번호 DEMO-001의 결과를 확인했습니다.")}>결과 확인</Button>}><p>신청 번호 DEMO-001 · 검토 대기</p></Result>}
      <p role="status">{message}</p>
      <Result variant="info" heading="결과 안내 구성"><p>처리 결과와 다음 행동을 함께 안내하세요. 삭제처럼 되돌리기 어려운 작업은 실행 전에 확인을 받으세요.</p></Result>
      <Result variant="info" heading="사용할 수 없는 동작 예시" actions={<><Button disabled>권한 필요</Button><Button loading>처리 중</Button></>}><p>비활성 버튼과 처리 중인 버튼은 동작하지 않습니다.</p></Result>
    </>}
    <GalleryDocs><summary>가져오기</summary><CodeBlock source={`import { ${isProgress ? "ProgressStepper" : "Result"} } from "./src/components/progress-result";\nimport { Button } from "./src/components/atoms";\nimport "./src/core.css";\nimport "./src/components/progress-result.css";\n// 앱 루트의 .ds-core 안에서 사용합니다.`}/></GalleryDocs>
    <GalleryDocs><summary>사용 코드</summary><CodeBlock source={isProgress
      ? `const [step, setStep] = useState(0);\n<ProgressStepper steps={["정보 입력", "내용 확인", "신청 완료"]} currentStep={step} />\n<Button disabled={step >= 2} onClick={() => setStep(s => Math.min(2, s + 1))}>다음 단계</Button>`
      : `const [retried, setRetried] = useState(false);\nretried ? <Result variant="success" heading="완료">결과를 불러왔습니다.</Result> :\n<Result variant="error" heading="불러오기 실패" guidance="연결을 확인한 뒤 다시 시도해 주세요."\n  actions={<Button onClick={() => setRetried(true)}>다시 시도</Button>}>입력 내용은 유지됩니다.</Result>`}/></GalleryDocs>
    <GalleryDocs><summary>API</summary>{isProgress
      ? <dl><dt>steps: readonly string[]</dt><dd>표시 순서의 텍스트 레이블. 빈 배열은 목록 대신 빈 상태를 표시합니다.</dd><dt>currentStep: number</dt><dd>0부터 시작하는 정수. 0 이상 steps.length 미만만 유효합니다. 음수·범위 밖·소수·NaN·Infinity는 모든 단계를 대기로 표시하고 오류 안내를 제공합니다. 작업을 마쳤을 때는 결과 안내를 따로 표시하세요.</dd><dt>label?: string</dt><dd>목록 이름. 기본값은 진행 단계입니다.</dd></dl>
      : <dl><dt>variant</dt><dd>success | error | empty | info. 필수 상태.</dd><dt>heading / children / actions</dt><dd>ReactNode 제목·필수 내용·선택 독립 동작 슬롯. 제목에는 제목 요소를 다시 넣지 않습니다.</dd><dt>headingLevel?: 2 | 3 | 4</dt><dd>기본값 3. 화면의 제목 계층에 맞춥니다.</dd><dt>guidance: string</dt><dd>error에서 필수 복구 안내. 나머지에서는 선택. 빈 오류 안내는 안전한 기본 안내로 대체됩니다.</dd></dl>}</GalleryDocs>
    <GalleryDocs><summary>조합</summary><p>{isProgress?'순서가 있는 신청 흐름에는 ProgressStepper를, 완료 비율에는 Progress를 사용하세요. 단계 이동 버튼은 별도로 구성합니다.':'결과에 맞는 variant와 heading을 선택하고 children에 이유와 다음 행동을 적으세요. actions에 버튼을 넣고 error에서는 guidance에 복구 방법을 안내합니다.'}</p></GalleryDocs>
    <GalleryDocs><summary>접근성</summary><p>{isProgress?'단계는 순서 목록으로 표시하고 현재 항목에는 진행 중 상태를 안내합니다. 진행 위치가 바뀌면 currentStep을 갱신하세요.':'headingLevel을 화면의 제목 계층에 맞추고 위험한 동작에는 확인과 복구 방법을 제공하세요. 버튼별 disabled와 loading으로 상태를 구분합니다.'}</p><p>긴 내용은 줄바꿈합니다. 상태를 색만으로 구분하지 말고 제목과 설명에 함께 적으세요.</p></GalleryDocs>
  </section>;
}

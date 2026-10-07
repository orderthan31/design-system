import React from 'react';
import {ProgressStepper,Input,Textarea,Select} from '../index';
import {GalleryControls,GalleryDocs} from './workbench';
import {CodeBlock} from './code-block';
export function StepperComponentDetail({kind}:{kind:'progress-stepper'|'result'}) {
 const [step,setStep]=React.useState(0);
 const [label,setLabel]=React.useState('신청 단계');
 const [text,setText]=React.useState('정보 입력\n내용 확인\n신청 완료');
 const steps=text.split('\n').filter(value=>value.trim());
 const source=`import {ProgressStepper} from './src';\nimport './src/core.css';\nexport function Example(){return <div className="ds-core"><ProgressStepper steps={${JSON.stringify(steps)}} currentStep={${step}} label={${JSON.stringify(label)}}/></div>;}`;
 return <section className="connected-detail stack" data-stepper-detail={kind}>
  <div data-stepper-preview><ProgressStepper steps={steps} currentStep={step} label={label}/></div>
  <GalleryControls className="form-detail-controls">
   <label className="field"><span>label</span><Input aria-label="진행 단계 이름 설정" value={label} onChange={e=>setLabel(e.currentTarget.value)}/></label>
   <label className="field"><span>steps · 한 줄에 한 단계</span><Textarea aria-label="단계 목록 설정" value={text} onChange={e=>setText(e.currentTarget.value)}/></label>
   <label className="field"><span>currentStep · 0부터 시작</span><Select aria-label="현재 단계 설정" value={step} onChange={e=>setStep(Number(e.currentTarget.value))}>{[...new Set([-1,0,1,2,steps.length,step])].map(n=><option key={n} value={n}>{n}{n<0||n>=steps.length?' · 범위 밖':''}</option>)}</Select></label>
  </GalleryControls>
  <CodeBlock source={source}/>
  <GalleryDocs><summary>진행 위치와 상태</summary><p>steps 순서대로 단계 이름을 표시하고 currentStep 이전은 완료, 해당 위치는 진행 중, 이후는 대기로 안내합니다. currentStep은 0부터 시작하는 정수입니다. 범위 밖 값은 모두 대기로 표시하고 오류를 안내하며, 빈 steps는 빈 상태를 보여줍니다.</p><p>ProgressStepper는 단계 이동을 처리하지 않습니다. 실제 신청 화면에서는 입력 검증과 이동 동작을 별도로 연결해 currentStep을 갱신하세요. 비율이나 처리 결과는 이 예제에 섞지 않습니다.</p></GalleryDocs>
 </section>;
}

import {GalleryDocs} from './workbench';
import {CodeBlock} from './code-block';
import './playground.css';
import React from "react";
import {Button} from "../components/button";
import {Checkbox} from "../components/checkbox";
import {
  Slider,
  Rating,
  type SliderProps,
  type RatingProps,
} from "../components/range-selection";

export type RangeSelectionDetailProps = { kind: "slider" | "rating" };

/** Route and heading ownership stay with the gallery shell. */
export function RangeSelectionDetail({ kind }: RangeSelectionDetailProps) {
  const [volume, setVolume] = React.useState(40);
  const [score, setScore] = React.useState(0);
  const [disabled, setDisabled] = React.useState(false);
  const [submitted, setSubmitted] = React.useState<string | null>(null);
  const isSlider = kind === "slider";
  const title = isSlider ? "Slider" : "Rating";
  const rows = isSlider ? sliderRows : ratingRows;
  const slider: SliderProps = {
    label: "음량",
    name: "volume",
    min: 0,
    max: 100,
    step: 5,
    value: volume,
    onValueChange: setVolume,
  };
  const rating: RatingProps = {
    label: "만족도",
    name: "score",
    required: true,
    value: score,
    onValueChange: setScore,
    clearable: true,
  };

  return (
    <div className="rs-detail">
      <section aria-label={`${title} 데모`}>
        <h2>직접 사용하기</h2>
        <p>
          {isSlider
            ? "이 예제는 음량을 0~100 범위에서 5 단위로 조절합니다. 값을 바꾸고 폼에 제출해 보세요."
            : "1~5점 중 하나를 선택하세요. 이 예제에서는 지우기를 켜 두었습니다. 필수 평가를 지웠다면 다시 점수를 선택해 주세요."}
        </p>
        <Checkbox label="데모 비활성화" checked={disabled} onChange={event=>setDisabled(event.currentTarget.checked)}/>
        <form
          className="rs-demo-form"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setSubmitted(
              String(data.get(isSlider ? "volume" : "score") ?? "선택 없음"),
            );
          }}
        >
          <fieldset className="rs-rating" disabled={disabled}>
            <legend>폼 예제</legend>
            {isSlider ? <Slider {...slider} /> : <Rating {...rating} />}
            <p>현재 값: {isSlider ? volume : `${score}점`}</p>
            <Button type="submit" variant="secondary">
              폼 값 확인
            </Button>
          </fieldset>
          {submitted !== null && <p role="status">제출 값: {submitted}</p>}
        </form>
      </section>
      <section aria-label={`${title} 비활성 상태`}>
        <h2>비활성 상태</h2>
        {isSlider ? (
          <Slider label="비활성 음량" defaultValue={40} disabled />
        ) : (
          <Rating label="비활성 만족도" defaultValue={4} disabled clearable />
        )}
        <p>
          직접 disabled를 지정하거나 상위 fieldset을 비활성화하면 조작과 폼
          전송에서 제외됩니다.
        </p>
      </section>
      <section aria-label={`${title} 비제어 초기화`}>
        <h2>초기화</h2>
        <form aria-label="비제어 초기화">
          {isSlider ? <Slider label="초기 음량" name="reset-volume" defaultValue={20} step={5}/> : <Rating label="초기 별점" name="reset-score" defaultValue={2} required clearable/>}
          <Button type="reset" variant="secondary">초기값 복원</Button>
        </form>
      </section>
      <GalleryDocs>
        <summary>사용 코드</summary>
        <CodeBlock source={(isSlider ? sliderCode.replace("useState(40)",`useState(${volume})`) : ratingCode.replace("useState(0)",`useState(${score})`)).replace('<fieldset disabled={false}>',`<fieldset disabled={${disabled}}>`) }/>
      </GalleryDocs>
      <GalleryDocs>
        <summary>속성</summary>
        <div className="rs-api">
          <table>
            <caption>{title} 공개 속성</caption>
            <thead>
              <tr>
                <th scope="col">속성</th>
                <th scope="col">타입</th>
                <th scope="col">기본값 / 계약</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([name, type, fallback]) => (
                <tr key={name}>
                  <th scope="row">
                    <code>{name}</code>
                  </th>
                  <td>
                    <code>{type}</code>
                  </td>
                  <td>{fallback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GalleryDocs>
      <GalleryDocs>
        <summary>조합과 접근성</summary>
        <ul>

          <li>{isSlider?'방향키·Home·End로 값을 조절할 수 있습니다. 단위는 라벨이나 주변 설명에 적으세요. 브라우저마다 키 동작이 다를 수 있습니다.':'Tab으로 그룹에 들어가 방향키로 점수를 이동하고 Space로 선택합니다. 각 점수의 이름과 선택 상태를 함께 안내합니다.'}</li>
          <li>value/onValueChange로 값을 관리하거나 defaultValue로 초기값을 지정하세요. 사용 중 제어형과 비제어형을 바꾸지 마세요.</li>
          <li>{isSlider?'min과 max에는 유한한 숫자를 지정하고 min을 max 이하로 설정하세요. step은 양수 또는 any입니다. 값은 범위와 단위에 맞아야 하며 잘못된 설정에는 RangeError가 발생합니다. 범위를 바꿀 때 현재 값도 맞춰 주세요.':'점수는 0~5의 정수입니다. 0은 미선택을 뜻하며 폼에 점수를 제출하지 않습니다. 잘못된 점수에는 RangeError가 발생합니다. required를 지정하면 점수를 선택해야 합니다.'}</li>
          <li>{isSlider?'Slider는 항상 숫자 값을 갖습니다. 정확한 허용 범위와 단위를 지정하고 저장 전에도 값을 확인하세요.':'clearable을 켜면 지우기 버튼을 표시하고 누르면 0으로 돌아갑니다. required인 상태에서는 다시 점수를 선택해야 합니다. 비활성화한 입력은 지우기도 제한합니다.'}</li>
          <li>폼에 제출할 이름을 name에 지정하세요. 각 Rating에는 다른 name을 사용합니다. form으로 외부 폼 id에 연결할 수 있습니다.</li>
          <li>form.reset의 기본 동작 뒤 비제어 입력은 초기값, 제어 입력은 최신 value로 맞춥니다. 취소된 reset은 값을 유지하며 reset은 변경 콜백을 호출하지 않습니다. 제어 입력을 초기값으로 되돌리려면 앱의 value를 갱신하세요.</li>
          <li>좁은 공간에서는 점수 행이 줄바꿈하며 Slider는 가용 너비에 맞춰집니다. 브라우저의 기본 입력 동작을 사용합니다.</li>
        </ul>
      </GalleryDocs>
    </div>
  );
}

const commonRows = [
  ["label", "string", "필수: 보이는 한국어 라벨"],
  ["id", "string", "useId()로 인스턴스별 생성"],
  ["name / form", "string", "폼 필드 이름 / 연결할 폼 id"],
  ["value / defaultValue", "number", "제어 값 / 비제어 초기값"],
  ["onValueChange", "(value: number) => void", "숫자 변경 콜백"],
  ["disabled", "boolean", "false; 상위 fieldset도 네이티브 적용"],
];
const sliderRows = [
  ...commonRows,
  ["min / max", "number", "0 / 100; 유한한 숫자, min ≤ max"],
  ["step", "number | 'any'", "1; 양수 또는 any"],
  ["초기값", "number", "defaultValue 생략 시 min"],
];
const ratingRows = [
  ...commonRows,
  ["초기값 / 점수", "number", "0; 미선택=0, 점수=1~5 정수"],
  ["required", "boolean", "false; 선택 없으면 네이티브 검증 실패"],
  ["clearable", "boolean", "false; 지우면 0 전달"],
  ["clearLabel", "string", "`${label} 지우기`"],
];
const sliderCode = `import { useState } from 'react';
import { Slider, type SliderProps } from './src/gyeol/components/slider';
import { Button } from './src/gyeol/components/button';

export function Example() {
  const [volume, setVolume] = useState(40);
  const [result, setResult] = useState('');
  const props: SliderProps = {
    label: '음량', name: 'volume', min: 0, max: 100, step: 5,
    value: volume, onValueChange: setVolume,
  };
  return <div className="ds-core">
    <form onSubmit={event => {
      event.preventDefault();
      setResult(String(new FormData(event.currentTarget).get('volume')));
    }}>
      <fieldset disabled={false}>
      <legend>폼 예제</legend>
      <Slider {...props} />
      <p>현재 값: {volume}</p>
      <Button type="submit" variant="secondary">폼 값 확인</Button>
      </fieldset>
      <p role="status">제출 값: {result}</p>
    </form>
    <Slider label="비활성 음량" defaultValue={40} disabled />
  </div>;
}`;
const ratingCode = `import { useState } from 'react';
import { Rating, type RatingProps } from './src/gyeol/components/rating';
import { Button } from './src/gyeol/components/button';

export function Example() {
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const props: RatingProps = {
    label: '만족도', name: 'score', required: true, clearable: true,
    value: score, onValueChange: setScore,
  };
  return <div className="ds-core">
    <form onSubmit={event => {
      event.preventDefault();
      setResult(String(new FormData(event.currentTarget).get('score')));
    }}>
      <fieldset disabled={false}>
      <legend>폼 예제</legend>
      <Rating {...props} />
      <p>현재 값: {score}점</p>
      <Button type="submit" variant="secondary">폼 값 확인</Button>
      </fieldset>
      <p role="status">제출 값: {result}</p>
    </form>
    <Rating label="비활성 만족도" defaultValue={4} disabled clearable />
  </div>;
}`;

import {GalleryDocs} from './workbench';
import {CodeBlock} from './code-block';
import './playground.css';
import React from "react";
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
            ? "0~100 사이의 음량을 5 단위로 조절합니다. 숫자 변경과 실제 폼 값을 확인해 보세요."
            : "1~5점 중 하나를 선택하세요. 별은 장식이며 각 점수는 라디오 선택입니다. 지우면 필수 선택이 다시 필요합니다."}
        </p>
        <label>
          <input
            type="checkbox"
            checked={disabled}
            onChange={(event) => setDisabled(event.currentTarget.checked)}
          />{" "}
          데모 비활성화
        </label>
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
            <button type="submit" className="rs-action">
              폼 값 확인
            </button>
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
          <button type="reset" className="rs-action">초기값 복원</button>
        </form>
      </section>
      <GalleryDocs>
        <summary>사용 코드</summary>
        <CodeBlock source={isSlider ? sliderCode : ratingCode}/>
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
          <li>
            코드는 프로젝트 루트 기준 경로입니다. core.css를 한 번 불러오고
            .ds-core 안에서 사용하세요. 컴포넌트 파일이 자체 CSS를 가져옵니다.
            Pretendard와 기존 테마 역할 변수를 그대로 사용합니다.
          </li>
          <li>
            {isSlider
              ? 'label은 input type="range"의 이름입니다. 브라우저가 방향키·Home·End·터치 조작을 제공합니다. 이동 키의 세부 동작은 브라우저마다 다를 수 있습니다. 단위는 라벨이나 주변 설명에 명확히 적어 주세요.'
              : "fieldset의 legend는 그룹 이름이며 1점~5점은 보이는 라디오 라벨입니다. Tab으로 그룹에 진입하고 방향키로 점수를 이동하며 Space로 선택합니다. 별 모양은 aria-hidden 장식이고 선택한 점수까지 별이 채워지고 native checked 값이 현재 선택을 전달합니다. 사각 테두리나 색상만으로 선택을 표현하지 않습니다."}
          </li>
          <li>
            value를 전달하면 제어 모드이며 onValueChange에서 소유자가 갱신해야
            합니다. 거절한 변경은 남지 않습니다. defaultValue는 초기값만
            설정합니다. 부모가 다시 렌더링해도 입력 노드와 비제어 편집 값을
            유지합니다. 제어/비제어 모드는 중간에 바꾸지 마세요.
          </li>
          <li>
            {isSlider
              ? "min·max는 유한한 숫자이고 min ≤ max여야 합니다. step은 유한한 양수 또는 any입니다. value/defaultValue는 유한하며 범위 안에 있어야 하고 숫자 step은 min 기준 단위와 맞아야 합니다(부동소수점 단위 오차 허용치 1e-8). 계약 위반은 렌더 중 RangeError로 즉시 알립니다. 자동으로 범위를 잘라 저장하지 않습니다. 범위를 동적으로 바꿀 때 현재 값도 함께 맞춰 주세요."
              : "점수는 0~5 정수입니다. 0은 미선택으로 폼 데이터에 점수가 없습니다. 비유한·소수·범위 밖 값은 렌더 중 RangeError입니다. required는 최소 한 라디오 선택을 요구하며 브라우저의 폼 검증을 사용합니다."}
          </li>
          <li>
            {isSlider
              ? "range에는 항상 숫자 값이 있으므로 required/빈 값 API를 제공하지 않습니다. 양 끝 값과 숫자 형식은 네이티브 range 제약을 유지합니다. DOM을 통해 단위에 맞지 않는 변경이 전달되어도 콜백을 호출하지 않습니다."
              : 'clearable을 명시해야 지우기 버튼이 나타납니다. type="button"으로 폼을 제출하지 않으며 0을 전달합니다. required 상태에서 지운 뒤에는 다시 점수를 선택해야 합니다. disabled 또는 상위 fieldset 비활성 상태에서는 지우기도 차단됩니다. 버튼을 다른 버튼 안에 넣지 마세요.'}
          </li>
          <li>
            폼의 name은 서비스가 지정합니다. Rating은 name을 생략하면
            인스턴스마다 고유한 라디오 그룹 이름을 생성합니다. 서로 다른
            Rating에 같은 name을 지정하면 네이티브 라디오가 같은 그룹으로
            동작하므로 피하세요. form은 외부 폼 id와 연결합니다.
          </li>
          <li>
            컴포넌트는 네이티브 form.reset 기본 동작 뒤 microtask에서
            비제어 초기값 또는 최신 제어 value로 DOM·폼 값을 동기화합니다.
            취소된 reset은 편집 값을 유지하며 reset 자체는 변경 콜백을 호출하지 않습니다.
            제어 초기화가 필요하면 소유자가 value를 초기값으로 갱신하세요.
            서버 요청·저장은 이 데모에 없으며
            서버에서도 값과 허용 범위를 검증해야 합니다.
          </li>
          <li>
            320px 폭에서는 점수 행이 줄바꿈되고 입력은 가용 폭에 맞춰집니다.
            사용 코드와 속성 표는 필요한 경우 내부에서 가로 스크롤됩니다.
            브라우저별 range 모양과 비활성 라디오 모양은 네이티브 렌더링을
            사용합니다.
          </li>
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
import { Slider, type SliderProps } from './src/components/range-selection';
import './src/core.css';

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
      <Slider {...props} />
      <p>현재 값: {volume}</p>
      <button type="submit">폼 값 확인</button>
      <button type="button" onClick={() => setVolume(40)}>초기값 복원</button>
      <p role="status">제출 값: {result}</p>
    </form>
    <Slider label="비활성 음량" defaultValue={40} disabled />
  </div>;
}`;
const ratingCode = `import { useState } from 'react';
import { Rating, type RatingProps } from './src/components/range-selection';
import './src/core.css';

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
      <Rating {...props} />
      <p>현재 값: {score}점</p>
      <button type="submit">폼 값 확인</button>
      <p role="status">제출 값: {result}</p>
    </form>
    <Rating label="비활성 만족도" defaultValue={4} disabled clearable />
  </div>;
}`;

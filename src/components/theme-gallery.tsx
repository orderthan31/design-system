import React, { useId, useState } from 'react';
import { Button } from './atoms';
import { FormField } from './molecules';
import { themes, assessTheme, compositeColor, type ThemeId } from '../themes';
import '../theme-roles.css';
import './theme-gallery.css';

/** Interactive example only: no document/global mutation or consuming-app policy. */
export function ThemeGallery() {
  const [selection, setSelection] = useState<ThemeId | 'baseline'>('indigo');
  const selectId = useId();
  const theme = themes.find(item => item.id === selection);
  return (
    <section className="stack" aria-label="테마 라이브러리" lang="ko">
      <h2>테마 교체</h2>

      <div className="wrap">
        <label htmlFor={selectId}>미리보기 테마</label>
        <select id={selectId} className="control ds-theme-select" value={selection}
          onChange={event => setSelection(event.target.value as ThemeId | 'baseline')}>
          <option value="baseline">기본 코어</option>
          {themes.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <Button variant="secondary" onClick={() => setSelection('baseline')}>기본 코어로 복원</Button>
      </div>
      <p role="status" aria-live="polite">{theme?.label ?? '기본 코어'} 미리보기가 활성화되었습니다. 변경은 아래 미리보기에만 적용됩니다.</p>
      <section aria-label="범위 한정 테마 미리보기" data-ds-theme={theme?.id} className="stack ds-theme-preview">
        <h3>Form</h3>
        <div className="stack ds-theme-form">
          <FormField label="표시 이름" />
          <div className="wrap">
            <Button>기본 작업</Button><Button variant="secondary">보조 작업</Button>
            <Button variant="ghost">고스트 작업</Button><Button variant="destructive">삭제 작업</Button>
          </div>
        </div>
        {theme && <>
          <div className="wrap">
            <p className="ds-theme-status ds-theme-info">정보</p>
            <p className="ds-theme-status ds-theme-warning">주의</p>
            <p className="ds-theme-status ds-theme-inverse">반전 배경</p>
          </div>
          <div className="ds-theme-scrim-surface">
            <div aria-hidden="true" className="ds-theme-scrim" />
          </div>
          <details><summary>스크림</summary><p>합성 색상: {compositeColor(theme.roles.scrim, theme.roles.surface)}. 텍스트 배치의 대비 검증과는 별개입니다.</p></details>
        </>}
      </section>
      {theme ? <details><summary>대비 계약</summary><div className="ds-theme-table-scroll">
        <table aria-label="다시 계산한 명암비 조합" className="ds-theme-table">
          <caption>{theme.label}: 현재 불투명 색상 조합의 계산 결과입니다. 앱 전체의 접근성 적합성을 의미하지 않습니다.</caption>
          <thead><tr><th scope="col">허용 조합</th><th scope="col">용도</th><th scope="col">명암비</th><th scope="col">최소 기준</th></tr></thead>
          <tbody>{assessTheme(theme).map((row, index) => <tr key={index}>
            <th scope="row" className="ds-theme-pair"><span lang="en">{row.foreground} / {row.background}</span></th>
            <td>{row.kind === 'text' ? '텍스트' : '비텍스트'}</td><td>{row.ratio.toFixed(2)}</td><td>{row.threshold}:1</td>
          </tr>)}</tbody>
        </table>
      </div></details> : <p>복원한 기본 코어에는 교체 테마의 명암비 검증 결과를 적용하지 않습니다.</p>}
    </section>
  );
}

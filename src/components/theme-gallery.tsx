import React, { useId, useState } from 'react';
import { Button } from './atoms';
import { FormField } from './molecules';
import { themes, themeVariables, assessTheme, compositeColor, type ThemeId } from '../themes';
import '../theme-roles.css';

/** Interactive example only: no document/global mutation or consuming-app policy. */
export function ThemeGallery() {
  const [selection, setSelection] = useState<ThemeId | 'baseline'>('indigo');
  const selectId = useId();
  const theme = themes.find(item => item.id === selection);
  return (
    <section className="stack" aria-label="테마 라이브러리" lang="ko">
      <h2>테마 교체</h2>
      <p>라이트 팔레트는 이 미리보기 안의 의미 색상만 교체합니다. 코어 토큰과 Pretendard는 그대로 유지합니다.</p>
      <div className="wrap">
        <label htmlFor={selectId}>미리보기 테마</label>
        <select id={selectId} className="control" style={{width: 'auto', maxWidth: '100%'}} value={selection}
          onChange={event => setSelection(event.target.value as ThemeId | 'baseline')}>
          <option value="baseline">기본 코어</option>
          {themes.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <Button variant="secondary" onClick={() => setSelection('baseline')}>기본 코어로 복원</Button>
      </div>
      <p role="status" aria-live="polite">{theme?.label ?? '기본 코어'} 미리보기가 활성화되었습니다. 변경은 아래 미리보기에만 적용됩니다.</p>
      <section aria-label="범위 한정 테마 미리보기" data-ds-theme={theme?.id} className="stack"
        style={{...(theme ? themeVariables(theme) : {}), background: 'var(--color-bg-canvas)', color: 'var(--color-text-primary)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', minWidth: 0} as React.CSSProperties}>
        <h3>재사용 입력 폼과 작업 버튼</h3>
        <div className="stack" style={{background: 'var(--color-bg-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)'}}>
          <FormField label="표시 이름" description="레이블과 설명이 실제로 연결된 공통 입력 필드입니다." />
          <div className="wrap">
            <Button>기본 작업</Button><Button variant="secondary">보조 작업</Button>
            <Button variant="ghost">고스트 작업</Button><Button variant="destructive">삭제 작업</Button>
          </div>
        </div>
        {theme && <>
          <div className="wrap">
            <p style={{background: 'var(--color-info-surface)', color: 'var(--color-info-text)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)'}}>정보</p>
            <p style={{background: 'var(--color-warning-surface)', color: 'var(--color-warning-text)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)'}}>주의</p>
            <p style={{background: 'var(--color-inverse-surface)', color: 'var(--color-inverse-text)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)'}}>반전 배경</p>
          </div>
          <div style={{background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)'}}>
            <div aria-hidden="true" style={{background: 'var(--color-scrim)', height: 48, borderRadius: 'var(--radius-md)'}} />
          </div>
          <p>스크림 합성 결과: {compositeColor(theme.roles.scrim, theme.roles.surface)} (배경 {theme.roles.surface}). 장식용 어둡게 처리한 예시이며, 모든 명암비나 텍스트 배치를 허용하는 검증 결과가 아닙니다.</p>
        </>}
      </section>
      {theme ? <div style={{maxWidth: '100%', overflowX: 'auto'}}>
        <table aria-label="다시 계산한 명암비 조합" style={{width: '100%', fontSize: 'var(--font-size-caption)', borderCollapse: 'collapse'}}>
          <caption>{theme.label}: 현재 불투명 색상 조합의 계산 결과입니다. 앱 전체의 접근성 적합성을 의미하지 않습니다.</caption>
          <thead><tr><th scope="col">허용 조합</th><th scope="col">용도</th><th scope="col">명암비</th><th scope="col">최소 기준</th></tr></thead>
          <tbody>{assessTheme(theme).map((row, index) => <tr key={index}>
            <th scope="row" style={{textAlign: 'left', overflowWrap: 'anywhere'}}><span lang="en">{row.foreground} / {row.background}</span></th>
            <td>{row.kind === 'text' ? '텍스트' : '비텍스트'}</td><td>{row.ratio.toFixed(2)}</td><td>{row.threshold}:1</td>
          </tr>)}</tbody>
        </table>
      </div> : <p>복원한 기본 코어에는 교체 테마의 명암비 검증 결과를 적용하지 않습니다.</p>}
    </section>
  );
}

import {GalleryDocs} from './workbench';
import {CodeBlock} from './code-block';
import './playground.css';
import React from 'react';
import { TextField } from '../components/text-field';
import { PasswordInput } from '../components/form-controls';
import { Icon } from '../components/icons';
import { Button } from '../components/atoms';

export function InputDetail() {
  const [email, setEmail] = React.useState('');
  const [result, setResult] = React.useState<'valid' | 'invalid' | null>(null);
  const successId = React.useId();
  const [checking, setChecking] = React.useState(false);
  return <div className="input-detail">
    <section aria-label="입력 유형" className="input-detail-section">
      <h2>유형</h2>
      <div className="input-detail-grid">
        <TextField label="이름" required placeholder="이름 입력" autoComplete="name" />
        <TextField label="이메일" type="email" placeholder="name@example.kr" autoComplete="email" />
        <TextField label="전화번호" type="tel" placeholder="010-1234-5678" autoComplete="tel" />
        <TextField label="웹사이트" type="url" placeholder="https://example.kr" />
        <TextField label="검색어" type="search" placeholder="검색어 입력" />
        <PasswordInput label="비밀번호" autoComplete="new-password" placeholder="비밀번호 입력" />
      </div>
    </section>
    <section aria-label="입력 상태" className="input-detail-section">
      <h2>상태</h2>
      <div className="input-detail-grid">
        <TextField label="도움말" description="2~20자로 입력해 주세요." placeholder="표시 이름" />
        <TextField label="형식 오류" defaultValue="잘못된 주소" error="이메일 형식을 확인해 주세요." />
        <TextField label="비활성" defaultValue="입력할 수 없어요" disabled clearable />
        <TextField label="읽기 전용" defaultValue="저장된 값" readOnly clearable />
        <TextField label="닉네임" defaultValue="디자이너" loading={checking} busyLabel="닉네임 확인 중…"
          trailingAction={<Button variant="secondary" aria-pressed={checking} onClick={() => setChecking(!checking)}>{checking ? '확인 종료' : '확인 시작'}</Button>} />
      </div>
    </section>
    <section aria-label="입력 장식과 동작" className="input-detail-section">
      <h2>장식과 동작</h2>
      <div className="input-detail-grid">
        <TextField label="빠른 검색" prefix={<Icon name="search" />} placeholder="문서 검색" defaultValue="디자인" clearable clearLabel="검색 지우기" />
        <TextField label="금액" prefix="₩" suffix="원" inputMode="numeric" defaultValue="12000" />
        <div className="input-detail-example">
          <TextField label="검증 이메일" type="email" value={email}
            onChange={event => { setEmail(event.currentTarget.value); setResult(null); }}
            clearable clearLabel="검증 이메일 지우기"
            error={result === 'invalid' ? '이메일 형식을 확인해 주세요.' : undefined}
            aria-describedby={result === 'valid' ? successId : undefined}
            trailingAction={<Button variant="secondary" onClick={() => setResult(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'valid' : 'invalid')}>검증</Button>} />
          {result === 'valid' && <p className="help" role="status" id={successId}>이메일 형식이 올바릅니다.</p>}
        </div>
      </div>
    </section>
    <GalleryDocs><summary>사용 코드</summary><CodeBlock source={`import { useState } from 'react';
import { TextField, type TextFieldProps } from './components/text-field';
import { Button } from './components/atoms';
import { Icon } from './components/icons';
import { PasswordInput } from './components/form-controls';
import './core.css';

export function Example() {
  const [value, setValue] = useState('');
  const field: TextFieldProps = {
    label: '검색', value, clearable: true,
    onChange: event => setValue(event.currentTarget.value),
  };
  return <div className="ds-core">
    <TextField {...field} prefix={<Icon name="search" />}
      trailingAction={<Button type="button"
        onClick={() => window.alert(value)}>검색</Button>} />
    <TextField label="이름" required description="표시할 이름"
      defaultValue="홍길동" />
    <TextField label="금액" prefix="₩" suffix="원"
      inputMode="numeric" defaultValue="12000" />
    <PasswordInput label="비밀번호" hint="8자 이상 입력해 주세요."
      autoComplete="new-password" />
  </div>;
}`}/></GalleryDocs>
    <GalleryDocs><summary>속성</summary>
      <div className="input-detail-table">
        <table>
          <caption>TextField 속성</caption>
          <thead><tr><th scope="col">속성</th><th scope="col">타입</th><th scope="col">기본값</th></tr></thead>
          <tbody>
            {[
              ['label', 'string (필수)', '없음'],
              ['description / error', 'string', 'undefined'],
              ['prefix / suffix / trailingAction', 'React.ReactNode', 'undefined'],
              ['clearable', 'boolean', 'false'],
              ['clearLabel', 'string', '입력 지우기'],
              ['loading', 'boolean', 'false'],
              ['busyLabel', 'string', '입력 확인 중…'],
              ['required / disabled / readOnly', 'boolean', 'false (네이티브)'],
              ['value / defaultValue', 'InputProps["value"]', 'undefined'],
              ['onChange', 'React.ChangeEventHandler<HTMLInputElement>', 'undefined'],
              ['type', 'React.HTMLInputTypeAttribute', 'text (브라우저)'],
              ['id', 'string', 'FormField의 useId()'],
              ['name / placeholder / autoComplete / pattern', 'string', 'undefined'],
              ['className', 'string (입력 요소에 적용)', 'undefined'],
              ['aria-describedby', 'string (외부 ID와 도움말·오류·확인 상태 병합)', 'undefined'],
              ['aria-invalid', 'InputProps["aria-invalid"] (error가 있으면 true)', 'undefined'],
              ['기타 입력 속성', 'Omit<InputProps, "prefix" | "children">', '네이티브 기본값'],
            ].map(([name, type, fallback]) => <tr key={name}><th scope="row"><code>{name}</code></th><td><code>{type}</code></td><td><code>{fallback}</code></td></tr>)}
          </tbody>
        </table>
      </div>
    </GalleryDocs>
    <GalleryDocs><summary>조합과 접근성</summary>
      <ul>
        <li>FormField의 라벨·필수 표시·도움말·오류 연결을 유지하고 내부 Input에 전달합니다. 오류는 role="alert", 확인 상태는 role="status"로 표시합니다.</li>
        <li>앞뒤 슬롯은 네이티브 속성이 아닌 형제 요소입니다. 장식 아이콘은 Icon을 사용하고 의미 있는 단위는 description에도 설명해 주세요. 슬롯이 입력의 접근 가능한 이름이나 설명에 자동 포함되지는 않습니다.</li>
        <li>지우기는 type="button"이며 onChange에 빈 값을 전달하고 입력 초점을 복원합니다. 비활성·읽기 전용 입력은 지울 수 없습니다. 빈 입력에서도 지우기 버튼은 유지됩니다.</li>
        <li>value를 전달하면 소유자가 onChange에서 값을 갱신해야 합니다. 소유자가 거절한 변경은 유지되지 않습니다. defaultValue는 비제어 초기값이며 이후 편집은 네이티브 입력에 남습니다. 제어 모드는 도중에 바꾸지 마세요.</li>
        <li>loading은 입력을 잠그지 않습니다. 이 예시의 확인 시작·종료는 상태 전환 데모이며 서버 요청이 아닙니다. 비동기 결과의 취소·순서·오래된 값 처리는 소유자 책임입니다.</li>
        <li>후행 동작의 이름, type="button", disabled·readOnly 처리와 서비스 로직은 슬롯 소유자 책임입니다. 컴포넌트는 임의 슬롯의 동작을 변경하지 않습니다.</li>
        <li>이메일 데모는 간단한 형식 확인만 하며 주소 존재나 소유권을 확인하지 않습니다. 서버 검증, 폼 제출, 고유한 id·name, 자동 완성, 입력 목적별 type·inputMode·pattern은 소유자가 지정합니다.</li>
        <li>텍스트 계열 입력에 사용합니다. 체크박스·라디오·파일 선택은 전용 컴포넌트를 사용하세요. 공개 Input이 ref를 전달하지 않아 TextField도 입력 ref API를 제공하지 않습니다. 공통 스타일은 .ds-core 안에서 적용됩니다.</li>
      </ul>
    </GalleryDocs>
  </div>;
}

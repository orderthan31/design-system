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
          <TextField label="이메일 형식 확인" type="email" value={email}
            onChange={event => { setEmail(event.currentTarget.value); setResult(null); }}
            clearable clearLabel="이메일 입력 지우기"
            error={result === 'invalid' ? '이메일 형식을 확인해 주세요.' : undefined}
            aria-describedby={result === 'valid' ? successId : undefined}
            trailingAction={<Button variant="secondary" onClick={() => setResult(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'valid' : 'invalid')}>형식 확인</Button>} />
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
        <li>라벨과 필수 표시, 도움말, 오류를 함께 보여줍니다. error에는 사용자가 수정할 내용을 적으세요.</li>
        <li>prefix와 suffix에 아이콘이나 단위를 넣을 수 있습니다. 중요한 단위는 description에도 설명하세요.</li>
        <li>clearable을 켜면 지우기 버튼을 표시합니다. 누르면 onChange에 빈 값을 전달하고 입력으로 초점을 돌려줍니다. disabled와 readOnly에서는 지우기를 제한합니다.</li>
        <li>value를 전달하면 onChange에서 값을 갱신하세요. defaultValue는 초기값에 사용합니다. 사용 중 제어형과 비제어형을 바꾸지 마세요.</li>
        <li>loading은 진행 상태를 안내하며 입력 편집을 유지합니다. 편집을 잠가야 한다면 readOnly 또는 disabled를 함께 지정하세요.</li>
        <li>동작 슬롯의 버튼에는 이름과 type=button을 지정하고 입력 상태에 맞춰 disabled를 설정하세요.</li>
        <li>이메일 형식 확인과 주소 인증을 구분하세요. 입력 목적에 맞춰 autoComplete·type·inputMode·pattern을 지정하고 각 필드에 고유한 id·name을 사용하세요.</li>
        <li>텍스트 계열 입력에 사용합니다. 선택에는 Checkbox나 RadioGroup을, 파일에는 FileInput을 사용하세요.</li>
      </ul>
    </GalleryDocs>
  </div>;
}

import React, { useEffect, useState } from "react";
import { Button, Input } from "./components/atoms";
import {
  Badge,
  Checkbox,
  IconButton,
  Progress,
  Select,
  Skeleton,
  Separator,
  Textarea,
  type Tone,
} from "./components/primitives";
import { FormField } from "./components/molecules";
import { Alert, EmptyState } from "./components/feedback";
import { Tabs, Menu, Tooltip } from "./components/navigation";
import { Dialog, Confirm } from "./components/organisms";
import { CompositionExample } from "./components/composition";
import { StateGallery } from "./components/state-gallery";
import { ThemeGallery } from "./components/theme-gallery";
import {
  FormTemplate,
  ListTemplate,
  FeedbackTemplate,
} from "./components/templates";
import core from "./generated/core.json";
import contracts from "./generated/components.json";
import { resolveTokens } from "./tokens";
import longText from "./long-text.json";
export const pages = [
  "Overview",
  "Foundations",
  "Atoms",
  "Molecules",
  "Organisms",
  "Templates",
] as const;
type Page = (typeof pages)[number];
const pageLabels: Record<Page, string> = { Overview: "개요", Foundations: "기초 (Foundations)", Atoms: "아톰 (Atoms)", Molecules: "몰리큘 (Molecules)", Organisms: "오가니즘 (Organisms)", Templates: "템플릿 (Templates)" };
const toneLabels: Record<Tone, string> = { neutral: "기본", running: "진행 중", success: "완료", review: "검토", error: "오류" };
type Language = keyof typeof longText;
const families = {
  Atoms: [
    "Button",
    "IconButton",
    "Input",
    "Textarea",
    "Select",
    "Checkbox",
    "Badge",
    "Progress",
    "Skeleton",
    "Separator",
  ],
  Molecules: ["FormField", "Alert", "EmptyState", "Menu", "Tabs", "Tooltip"],
  Organisms: ["Dialog", "Confirm"],
};
const descriptions: Record<string, string> = {
  Button: "결과가 분명한 동작입니다. 처리 중에도 레이블을 읽을 수 있습니다.",
  IconButton: "접근 가능한 이름이 명확한 작은 동작 버튼입니다.",
  Input: "브라우저 기본 텍스트 입력입니다. 읽기 전용 내용도 선택할 수 있습니다.",
  Textarea: "글자 크기를 줄이지 않고 줄바꿈하는 여러 줄 입력입니다.",
  Select: "플랫폼의 익숙한 키보드 동작을 따르는 기본 선택 컨트롤입니다.",
  Checkbox: "선택·미선택·일부 선택 상태를 레이블과 함께 제공합니다.",
  Badge: "상태를 간결하게 표시하며, 의미는 항상 텍스트로 전달합니다.",
  Progress: "진행률이 있는 작업과 대기 작업을 읽을 수 있는 레이블로 표시합니다.",
  Skeleton:
    "로딩 안내를 제공하는 비대화형 자리 표시자입니다.",
  Separator: "관련 콘텐츠 사이의 의미 있는 경계입니다.",
  FormField:
    "레이블·입력·도움말·오류를 연결한 하나의 필드입니다.",
  Alert: "Badge와 콘텐츠 슬롯을 조합한 인라인 안내입니다.",
  EmptyState: "내용에 맞춰 늘어나는 설명과 재사용 가능한 주요 동작입니다.",
  Menu: "방향키·Home·End·Escape로 조작하는 동작 목록입니다.",
  Tabs: "키보드 초점 이동과 자동 활성화를 지원하는 관련 보기입니다.",
  Tooltip:
    "마우스 올림과 초점에 추가 정보를 제공합니다. 접근 가능한 이름을 대신하지 않습니다.",
  Dialog:
    "제목·본문·IconButton·동작 슬롯을 조합한 기본 모달 대화상자입니다.",
  Confirm:
    "Dialog와 재사용 가능한 Button으로 명확한 결정을 돕습니다.",
};
const snippets: Record<string, string> = {
  Button: "<Button loading={saving} onClick={save}>변경 사항 저장</Button>",
  IconButton: '<IconButton label="Close" onClick={close}>×</IconButton>',
  Input: '<Input aria-label="이름" placeholder="이름을 입력하세요" />',
  Textarea: '<Textarea aria-label="메모" rows={4} />',
  Select: '<Select aria-label="분류"><option>일반</option></Select>',
  Checkbox: '<Checkbox label="Include details" mixed={false} />',
  Badge: '<Badge tone="success">Saved</Badge>',
  Progress: '<Progress label="완료율" value={65} />',
  Skeleton: '<Skeleton label="Loading content" />',
  Separator: "<Separator />",
  FormField:
    '<FormField label="이름" description="Public label" error={error} />',
  Alert: '<Alert title="안내" tone="running">Message</Alert>',
  EmptyState:
    '<EmptyState title="No items" onAction={add}>Start here.</EmptyState>',
  Menu: '<Menu label="Options" items={["Duplicate", "Archive"]} onSelect={select} />',
  Tabs: '<Tabs items={[{label: "미리보기", content: preview}, {label: "코드", content: code}]} />',
  Tooltip: '<Tooltip label="Help" text="Additional context" />',
  Dialog:
    '<Dialog open={open} title="Review" onClose={close} footer={actions}>{body}</Dialog>',
  Confirm:
    '<Confirm open={open} title="Confirm change" onClose={close} onConfirm={confirm}>{body}</Confirm>',
};
function Demo({ name }: { name: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("ko");
  const [value, setValue] = useState(65);
  const [tone, setTone] = useState<Tone>("running");
  function save() {
    setBusy(true);
    setMessage("");
    setTimeout(() => {
      setBusy(false);
      setMessage("변경 사항을 저장했습니다.");
    }, 900);
  }
  const langControl = (
    <label className="inline-label">
      언어{" "}
      <Select
        aria-label="예시 언어"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
      >
        <option value="ko">한국어 · KO</option>
        <option value="en">English · EN</option>
        <option value="ja">日本語 · JA</option>
      </Select>
    </label>
  );
  let example: React.ReactNode;
  switch (name) {
    case "Button":
      example = (
        <>
          <div className="wrap">
            <Button onClick={save} loading={busy}>
              변경 사항 저장
            </Button>
            <Button
              variant="secondary"
              onClick={() => setMessage("보조 동작을 선택했습니다.")}
            >
              보조 동작
            </Button>
            <Button
              variant="quiet"
              onClick={() => setMessage("간결한 동작을 선택했습니다.")}
            >
              간결한 동작
            </Button>
            <Button disabled>사용 불가</Button>
          </div>
          <p className="help">
            유효한 선택이 있어야 사용할 수 있습니다. 처리 중인 동작도
            초점을 받을 수 있습니다.
          </p>
          <div className="wrap">
            <Button
              variant="destructive"
              onClick={() =>
                setMessage("삭제 동작 예시입니다. 데이터는 변경되지 않았습니다.")
              }
            >
              항목 삭제
            </Button>
            <Button size="small" variant="secondary">
              작게
            </Button>
            <Button size="large">크게</Button>
          </div>
        </>
      );
      break;
    case "IconButton":
      example = (
        <div className="wrap">
          <IconButton
            label="항목 추가"
            onClick={() => setMessage("항목을 추가했습니다.")}
          >
            ＋
          </IconButton>
          <IconButton
            label="추가 정보"
            onClick={() => setMessage("정보를 선택했습니다.")}
          >
            ⓘ
          </IconButton>
          <IconButton label="사용할 수 없는 동작" disabled>
            ×
          </IconButton>
        </div>
      );
      break;
    case "Input":
      example = (
        <div className="demo-fields">
          <FormField
            label="편집 가능한 입력"
            description="직접 값을 입력해 보세요."
            placeholder="이름을 입력하세요"
          />
          <FormField
            label="읽기 전용 입력"
            defaultValue="이 값은 선택할 수 있습니다"
            readOnly
          />
          <FormField
            label="비활성 입력"
            defaultValue="사용 불가"
            disabled
            description="사용 불가 until access is granted."
          />
        </div>
      );
      break;
    case "Textarea":
      example = (
        <FormField
          label="메모"
          description="여러 줄 내용도 읽기 쉽게 유지됩니다."
        >
          <Textarea
            rows={4}
            defaultValue="A common language for every interface.\n함께 만드는 일관된 경험."
          />
        </FormField>
      );
      break;
    case "Select":
      example = (
        <FormField label="분류" description="방향키로 선택하세요.">
          <Select defaultValue="general">
            <option value="general">일반</option>
            <option value="other">기타</option>
          </Select>
        </FormField>
      );
      break;
    case "Checkbox":
      example = (
        <div className="stack">
          <Checkbox label="추가 정보 포함" />
          <Checkbox label="기본 선택" defaultChecked />
          <Checkbox label="일부 항목 선택" mixed />
          <Checkbox label="사용할 수 없는 선택" disabled />
          <p className="help">예시가 잠겨 있는 동안 사용할 수 없습니다.</p>
        </div>
      );
      break;
    case "Badge":
      example = (
        <div className="wrap">
          {(["neutral", "running", "success", "review", "error"] as Tone[]).map(
            (t) => (
              <Badge key={t} tone={t}>
                {toneLabels[t]}
              </Badge>
            ),
          )}
        </div>
      );
      break;
    case "Progress":
      example = (
        <div className="stack">
          <Progress label="완료율" value={value} />
          <label className="inline-label">
            진행률 조절{" "}
            <input
              aria-label="진행률 조절"
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />
          </label>
          <Progress label="결과 대기 중" />
        </div>
      );
      break;
    case "Skeleton":
      example = (
        <div className="stack">
          <Skeleton label="콘텐츠 로딩 중" />
          <p className="help">
            콘텐츠 로딩 중 — 자리 표시자는 초점을 받지 않습니다.
          </p>
        </div>
      );
      break;
    case "Separator":
      example = (
        <div>
          <p>첫 번째 그룹</p>
          <Separator />
          <p>두 번째 그룹</p>
        </div>
      );
      break;
    case "FormField":
      example = (
        <div className="demo-fields">
          <FormField
            label="표시 이름"
            description="명확하고 구체적인 이름을 사용하세요."
            required
          />
          <FormField
            label="오류가 있는 이름"
            description="입력한 내용은 유지됩니다."
            error="두 글자 이상 입력하세요."
            defaultValue="A"
          />
        </div>
      );
      break;
    case "Alert":
      example = (
        <div className="stack">
          <label className="inline-label">
            상태{" "}
            <Select
              aria-label="안내 상태"
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
            >
              {["running", "success", "review", "error", "neutral"].map((t) => (
                <option key={t} value={t}>{toneLabels[t as Tone]}</option>
              ))}
            </Select>
          </label>
          <Alert
            title={tone === "error" ? "조치 필요" : "안내"}
            tone={tone}
          >
            입력한 정보는 유지됩니다. 계속하기 전에 안내를 확인하세요.
          </Alert>
          {langControl}
          <Alert title="긴 텍스트 예시" tone="running">
            <p lang={language} data-long-text={language}>
              {longText[language]}
            </p>
          </Alert>
        </div>
      );
      break;
    case "EmptyState":
      example = (
        <div className="stack">
          {langControl}
          <EmptyState
            title="새롭게 시작하기"
            action="첫 항목 추가"
            onAction={save}
            loading={busy}
          >
            <p lang={language} data-long-text={language}>
              {longText[language]}
            </p>
          </EmptyState>
        </div>
      );
      break;
    case "Menu":
      example = (
        <Menu label="옵션" items={["복제", "보관"]} onSelect={(v) => setMessage(`${v} 동작을 선택했습니다. 데이터는 변경되지 않았습니다.`)} />
      );
      break;
    case "Tabs":
      example = (
        <Tabs
          label="예시 보기"
          items={[
            {
              label: "미리보기",
              content: <p>조합한 구성 요소의 실제 미리보기입니다.</p>,
            },
            {
              label: "코드",
              content: (
                <pre>
                  <code>{"<Tabs items={views} />"}</code>
                </pre>
              ),
            },
            {
              label: "사용법",
              content: (
                <p>방향키·Home·End로 보기 사이를 이동하세요.</p>
              ),
            },
          ]}
        />
      );
      break;
    case "Tooltip":
      example = (
        <Tooltip
          label="간격 안내"
          text="기준 4px 간격 척도를 사용하세요."
        />
      );
      break;
    case "Dialog":
      example = (
        <div className="stack">
          {langControl}
          <div>
            <Button onClick={() => setOpen(true)}>대화상자 열기</Button>
          </div>
          <Dialog
            open={open}
            title="정보 확인"
            onClose={() => setOpen(false)}
            footer={
              <Button
                onClick={() => {
                  setOpen(false);
                  setMessage("확인을 마쳤습니다.");
                }}
              >
                계속
              </Button>
            }
          >
            <p lang={language} data-long-text={language}>
              {longText[language]}
            </p>
          </Dialog>
        </div>
      );
      break;
    case "Confirm":
      example = (
        <>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            확인 창 열기
          </Button>
          <Confirm
            open={open}
            title="변경 사항을 적용할까요?"
            onClose={() => setOpen(false)}
            onConfirm={() => {
              setOpen(false);
              setMessage("변경 사항을 확인했습니다.");
            }}
          >
            <p>
              범용 확인 창 예시입니다. 제품 데이터는
              변경되지 않습니다.
            </p>
          </Confirm>
        </>
      );
      break;
    default:
      example = null;
  }
  return (
    <>
      <div className="demo" data-demo={name}>
        {example}
      </div>
      {message && (
        <p role="status" className="result">
          {message}
        </p>
      )}
    </>
  );
}
function ComponentCard({ name, index }: { name: string; index: number }) {
  const [view, setView] = useState("Preview");
  const historical = (contracts as Record<string, { states: string[] }>)[name];
  return (
    <article className="component-card" id={name.toLowerCase()}>
      <div className="card-title">
        <div>
          <span className="eyebrow">
            컴포넌트 {String(index + 1).padStart(2, "0")}
          </span>
          <h2>{name}</h2>
          <p>{descriptions[name]}</p>
        </div>
        <span className="component-tag">React</span>
      </div>
      <div className="view-switch" aria-label={`${name} 문서 보기`}>
        {["Preview", "Code", "Contract"].map((v) => (
          <button key={v} aria-pressed={view === v} onClick={() => setView(v)}>
            {{ Preview: "미리보기", Code: "코드", Contract: "계약" }[v]}
          </button>
        ))}
      </div>
      {view === "Preview" ? (
        <Demo name={name} />
      ) : view === "Code" ? (
        <pre className="code">
          <code>{snippets[name]}</code>
        </pre>
      ) : (
        <div className="contract">
          <p>
            <strong>기준 상태 계약</strong> (원본 유지, 실행 시
            통과를 보장하지 않음)
          </p>
          <div className="wrap">
            {historical.states.map((s) => (
              <span className="state-chip" key={s}>
                {s}
              </span>
            ))}
          </div>
          <p>
            텍스트는 줄바꿈하고 컨테이너는 늘어납니다. 초점은 처리 중·오류·선택
            상태와 독립적입니다. 범위별 예외는
            원본 계약에서 확인하세요.
          </p>
          <a href="/source/contracts/components.json">
            원본 계약 보기 ↗
          </a>
        </div>
      )}
    </article>
  );
}
function Overview({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <>
      <div className="hero">
        <span className="eyebrow">공유 디자인 시스템 / 0.1</span>
        <h1>
          함께 쓰는 언어.
          <br />
          <span>더 넓은 조합의 가능성.</span>
        </h1>
        <p>
          작은 화면부터 넓은 작업 공간까지 일관된 경험을 만드는
          기초와 조합 가능한 컴포넌트를 제공합니다.
        </p>
        <div className="wrap">
          <Button onClick={() => navigate("Atoms")}>
            컴포넌트 둘러보기 <span aria-hidden="true">→</span>
          </Button>
          <Button variant="secondary" onClick={() => navigate("Foundations")}>
            기초 살펴보기
          </Button>
        </div>
        <div className="hero-meta">
          <span>React + TypeScript</span>
          <span>Pretendard</span>
          <span>PC 및 모바일</span>
        </div>
      </div>
      <div className="stats">
        <div>
          <strong>107</strong>
          <span>기준 토큰</span>
        </div>
        <div>
          <strong>18</strong>
          <span>컴포넌트 계열</span>
        </div>
        <div>
          <strong>3</strong>
          <span>범용 템플릿</span>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <span className="eyebrow">구성의 기초</span>
          <h2>작은 요소, 단단한 연결.</h2>
        </div>
        <span className="help">기초 → 조합 → 레이아웃</span>
      </div>
      <div className="overview-grid">
        <article className="feature-card">
          <span className="feature-icon" aria-hidden="true">
            ◈
          </span>
          <h3>기초부터 시작하기</h3>
          <p>
            색상·글꼴·간격·크기의 단일 원본입니다. 기본값 →
            의미 역할 → 컴포넌트 별칭을 추적할 수 있습니다.
          </p>
          <div className="mini-palette">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <button className="text-link" onClick={() => navigate("Foundations")}>
            토큰 살펴보기 →
          </button>
        </article>
        <article className="feature-card">
          <span className="feature-icon" aria-hidden="true">
            ▦
          </span>
          <h3>복제 대신 조합하기</h3>
          <p>
            아톰을 필드·피드백·대화상자로 조합합니다. 정적인 이미지가 아니라
            실제 React 컴포넌트입니다.
          </p>
          <div className="wrap miniature">
            <Badge tone="success">조합 준비 완료</Badge>
            <Badge>재사용 가능</Badge>
          </div>
          <button className="text-link" onClick={() => navigate("Molecules")}>
            조합 살펴보기 →
          </button>
        </article>
        <article className="feature-card">
          <span className="feature-icon" aria-hidden="true">
            ▤
          </span>
          <h3>콘텐츠를 위한 공간</h3>
          <p>
            교체 가능한 슬롯과 반응형 배치를 갖춘
            범용 폼·목록·피드백 레이아웃입니다.
          </p>
          <div className="mini-layout" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <button className="text-link" onClick={() => navigate("Templates")}>
            템플릿 미리보기 →
          </button>
        </article>
      </div>
      <div className="section-heading">
        <div>
          <span className="eyebrow">직접 사용하기</span>
          <h2>믿을 수 있는 기본값과 유용한 세부 기능.</h2>
        </div>
        <Badge tone="running">대화형 미리보기</Badge>
      </div>
      <div className="overview-practice">
        <div>
          <h3>실제 콘텐츠를 위한 설계</h3>
          <p>
            읽기 쉬운 레이블, 명확한 로딩 상태, 누르기 편한 주요 동작을 제공합니다.
            모든 예시는 같은 컴포넌트를 사용합니다.
          </p>
          <ul className="check-list">
            <li>주요 동작 48px · 일반 컨트롤 44px</li>
            <li>키보드로 조작하는 대화상자·메뉴·탭</li>
            <li>한국어·영어·일본어 긴 텍스트 예시</li>
          </ul>
        </div>
        <div className="practice-preview">
          <FormField
            label="표시 이름"
            description="바로 재사용할 수 있는 공통 필드입니다."
            defaultValue="공통 기초"
          />
          <div className="wrap">
            <Button>변경 사항 저장</Button>
            <Badge tone="success">준비 완료</Badge>
          </div>
        </div>
      </div>
      <div className="note">
        <strong>특정 제품에 종속되지 않는 공통 요소.</strong>
        <p>
          범용 UI 구성 요소를 제공합니다. 제품별 작업 흐름·
          권한·모바일 기능 동등성은 이 라이브러리의 범위가 아닙니다.
        </p>
      </div>
    </>
  );
}
function Foundations() {
  const [layer, setLayer] = useState<"primitive" | "semantic" | "component">(
    "semantic",
  );
  const [query, setQuery] = useState("");
  const resolved = resolveTokens(core);
  const entries = Object.entries(core[layer]).filter(([key]) =>
    key.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        title="기초 (Foundations)"
        eyebrow="01 / 단일 기준 원본"
        text="추적 가능한 토큰 체계입니다. 기본 토큰은 값을, 의미 역할은 의도를 나타내며, 컴포넌트 별칭은 이를 UI와 연결합니다."
      />
      <div className="foundation-grid">
        <article className="feature-card">
          <span className="eyebrow">타이포그래피</span>
          <h2 className="type-sample">Aa 가나</h2>
          <h3>Pretendard</h3>
          <p>본문 400 · 레이블 500 · 제목 600 · 강조 700</p>
          <p className="help">
            원본 WOFF2·라이선스·출처를 유지합니다. 일본어
            대체 글꼴은 별도로 검증하지 않았습니다.
          </p>
          <a href="/source/fonts/LICENSE">글꼴 라이선스 ↗</a>
        </article>
        <article className="feature-card">
          <span className="eyebrow">크기와 간격</span>
          <div className="geometry">
            <div>48</div>
            <div>44</div>
            <div>8</div>
          </div>
          <h3>편안한 기본 크기</h3>
          <p>
            주요 동작 48px · 컨트롤 44px · 모서리 8px. 긴 내용도
            글자를 강제로 줄이지 않고 표시합니다.
          </p>
          <p className="help">
            4px 간격 척도로 명확하고 일관된 리듬을 만듭니다.
          </p>
        </article>
      </div>
      <ThemeGallery />
      <div className="section-heading">
        <div>
          <span className="eyebrow">기본값 → 의미 역할 → 컴포넌트</span>
          <h2>토큰 탐색기</h2>
        </div>
        <a href="/source/tokens/resolved.json">해석된 JSON ↗</a>
      </div>
      <div className="token-tools">
        <div className="segmented">
          {(["primitive", "semantic", "component"] as const).map((l) => (
            <button
              aria-pressed={layer === l}
              key={l}
              onClick={() => setLayer(l)}
            >
              {{ primitive: "기본값", semantic: "의미 역할", component: "컴포넌트" }[l]} <span>{Object.keys(core[l]).length}</span>
            </button>
          ))}
        </div>
        <Input
          aria-label="토큰 검색"
          placeholder="토큰 검색…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="token-table">
        <div className="token-row token-table-head">
          <span>토큰 / 의도</span>
          <span>원본 → 해석된 값</span>
        </div>
        {entries.map(([key, token]) => (
          <div className="token-row" key={key}>
            <code>{key}</code>
            <div>
              {token.$type === "color" && (
                <span
                  className="swatch"
                  style={{ background: resolved[key] }}
                />
              )}
              <span>
                <code>{String(token.$value)}</code>
                <small>{resolved[key]}</small>
              </span>
            </div>
          </div>
        ))}
      </div>
      {entries.length === 0 && (
        <p role="status">검색과 일치하는 토큰이 없습니다.</p>
      )}
      <div className="note">
        <strong>전체 통과 선언이 아닌 사용 계약.</strong>
        <p>
          원본 명암 대비 허용 목록과 금지 조합을 유지합니다.
          수치 근거는 애플리케이션 접근성 인증이 아닙니다.
          테마를 교체하면 다시 평가해야 합니다.
        </p>
        <div className="wrap">
          <a href="/source/tokens/core.json">기준 원본 ↗</a>
          <a href="/source/contracts/color-pairs.json">명암 대비 허용 목록 ↗</a>
          <a href="/source/contracts/components.json">기준 계약 ↗</a>
        </div>
      </div>
    </>
  );
}
function PageHeader({
  title,
  text,
  eyebrow,
}: {
  title: string;
  text: string;
  eyebrow: string;
}) {
  return (
    <header className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </header>
  );
}
function TemplatePreviews() {
  const [viewport, setViewport] = useState("PC");
  const [kind, setKind] = useState("Form");
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState("");
  return (
    <>
      <PageHeader
        title="템플릿 (Templates)"
        eyebrow="05 / 조합을 위한 공간"
        text="제품 화면이 아닌 범용 레이아웃입니다. 공통 코어를 바꾸지 않고 제목·필드·콘텐츠·동작 슬롯을 교체하세요."
      />
      <div className="section-heading">
        <div>
          <h2>템플릿 미리보기</h2>
          <p className="help">
            같은 React 조합을 두 가지 미리보기 너비로 확인합니다.
          </p>
        </div>
      </div>
      <div className="template-controls">
        <div className="segmented" aria-label="템플릿 종류">
          {["Form", "List", "Feedback"].map((t) => (
            <button
              key={t}
              aria-pressed={kind === t}
              onClick={() => setKind(t)}
            >
              {{ Form: "폼", List: "목록", Feedback: "피드백", PC: "PC", Mobile: "모바일" }[t]}
            </button>
          ))}
        </div>
        <div className="segmented" aria-label="미리보기 화면 크기">
          {["PC", "Mobile"].map((t) => (
            <button
              key={t}
              aria-pressed={viewport === t}
              onClick={() => setViewport(t)}
            >
              {{ Form: "폼", List: "목록", Feedback: "피드백", PC: "PC", Mobile: "모바일" }[t]}
            </button>
          ))}
        </div>
      </div>
      <div className="preview-stage">
        <div
          className={`preview-frame ${viewport.toLowerCase()}`}
          data-viewport={viewport}
        >
          <div className="frame-bar">
            <span className="frame-dots" aria-hidden="true">
              ● ● ●
            </span>
            <span>
              범용 {{ Form: "폼", List: "목록", Feedback: "피드백" }[kind]} ·{" "}
              {viewport === "PC" ? "반응형 데스크톱" : "390px 모바일"}
            </span>
          </div>
          <div className="frame-content">
            {kind === "Form" ? (
              <FormTemplate
                title="시작하기 좋은 공간"
                fields={
                  <>
                    <FormField
                      label="이름"
                      description="구체적인 이름을 사용하세요."
                      required
                    />
                    <FormField label="분류">
                      <Select>
                        <option>일반</option>
                        <option>기타</option>
                      </Select>
                    </FormField>
                    <FormField label="설명">
                      <Textarea rows={3} placeholder="설명을 추가하세요…" />
                    </FormField>
                    <Checkbox label="추가 정보 포함" />
                    {saved && (
                      <Alert title="저장 완료" tone="success">
                        이 미리보기의 예시 상태를 로컬에 저장했습니다.
                      </Alert>
                    )}
                  </>
                }
                actions={
                  <>
                    <Button onClick={() => setSaved(true)}>변경 사항 저장</Button>
                    <Button variant="secondary" onClick={() => setSaved(false)}>
                      상태 초기화
                    </Button>
                  </>
                }
                aside={
                  <>
                    <h4>보조 콘텐츠</h4>
                    <p>
                      교체 가능한 보조 슬롯입니다. 작은 화면에서는
                      폼 아래로 이동합니다.
                    </p>
                    <Badge>선택 슬롯</Badge>
                  </>
                }
              />
            ) : kind === "List" ? (
              <ListTemplate
                title="정돈된 목록"
                toolbar={
                  <>
                    <Input
                      aria-label="예시 목록 검색"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      placeholder="항목 검색…"
                    />
                    <Menu label="목록 옵션" items={["복제", "보관"]} />
                  </>
                }
                rows={
                  <>
                    {["첫 번째 항목", "두 번째 항목", "세 번째 항목"]
                      .filter((t) =>
                        t.toLowerCase().includes(filter.toLowerCase()),
                      )
                      .map((t, i) => (
                        <div className="list-row" key={t}>
                          <Checkbox label={t} />
                          <Badge tone={i === 0 ? "success" : "neutral"}>
                            {i === 0 ? "준비 완료" : "초안"}
                          </Badge>
                        </div>
                      ))}
                  </>
                }
                footer={
                  <p className="help">
                    범용 행 · 교체 가능한 콘텐츠 및 도구 모음 슬롯
                  </p>
                }
              />
            ) : (
              <FeedbackTemplate
                title="다음 단계를 명확하게"
                status={
                  <Alert title="안내" tone="running">
                    명확한 상태와 읽기 쉬운 안내입니다.
                  </Alert>
                }
                content={
                  <EmptyState
                    title="아직 항목이 없습니다"
                    action="항목 추가"
                    onAction={() => setSaved(true)}
                  >
                    <p>
                      제품별 작업 흐름 대신
                      유용한 설명을 넣는 슬롯입니다.
                    </p>
                  </EmptyState>
                }
                actions={
                  saved && <Badge tone="success">예시 동작을 선택했습니다</Badge>
                }
              />
            )}
          </div>
        </div>
      </div>
      <div className="composition-map">
        <span>템플릿 슬롯</span>
        <span>→</span>
        <span>FormField / Alert / EmptyState</span>
        <span>→</span>
        <span>Input / Badge / Button</span>
      </div>
      <pre className="code">
        <code>
          {kind === "Form"
            ? "<FormTemplate title={title} fields={fields} actions={actions} aside={help} />"
            : kind === "List"
              ? "<ListTemplate title={title} toolbar={toolbar} rows={rows} footer={summary} />"
              : "<FeedbackTemplate title={title} status={status} content={content} actions={actions} />"}
        </code>
      </pre>
      <div className="section-heading">
        <div>
          <span className="eyebrow">조합 구조 살펴보기</span>
          <h2>재사용 가능한 섹션과 실제 슬롯.</h2>
        </div>
      </div>
      <CompositionExample />
    </>
  );
}
function pageFromHash(hash: string): Page | undefined {
  try {
    const page = decodeURIComponent(hash.slice(1));
    return pages.includes(page as Page) ? (page as Page) : undefined;
  } catch {
    return undefined;
  }
}
export function App() {
  const [page, setPage] = useState<Page>(
    () => pageFromHash(window.location.hash) ?? "Overview",
  );
  const [navOpen, setNavOpen] = useState(false);
  function navigate(p: Page) {
    setPage(p);
    window.location.hash = p;
    setNavOpen(false);
    window.scrollTo?.({ top: 0, behavior: "instant" });
  }
  useEffect(() => {
    function sync() {
      const p = pageFromHash(window.location.hash);
      if (p) setPage(p);
    }
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const group =
    page === "Atoms" || page === "Molecules" || page === "Organisms"
      ? families[page]
      : null;
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>
      <aside className={`sidebar ${navOpen ? "is-open" : ""}`}>
        <a
          className="brand"
          href="#Overview"
          onClick={(e) => {
            e.preventDefault();
            navigate("Overview");
          }}
        >
          <span className="brand-mark" aria-hidden="true">
            c
          </span>
          <span>
            common<span className="brand-sub">디자인 시스템</span>
          </span>
        </a>
        <div className="sidebar-label">문서</div>
        <nav aria-label="문서 탐색">
          {pages.map((p, i) => (
            <a
              key={p}
              href={`#${p}`}
              aria-current={page === p ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigate(p);
              }}
            >
              <span className="nav-symbol" aria-hidden="true">
                {["◈", "◐", "▦", "◇", "▤", "▥"][i]}
              </span>
              {pageLabels[p]}
              {p in families && (
                <span className="nav-count">
                  {families[p as keyof typeof families].length}
                </span>
              )}
            </a>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="status-dot" /> 공통 코어{" "}
          <p>
            범용성을 위한 설계.
            <br />
            조합을 기본으로.
          </p>
          <span className="sidebar-version">v0.1 · React + TypeScript</span>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="탐색 메뉴 열기 또는 닫기"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(!navOpen)}
          >
            ☰
          </button>
          <span className="breadcrumb">
            문서 <span>/</span> <strong>{pageLabels[page]}</strong>
          </span>
          <a className="source-link" href="/source/tokens/core.json">
            원본 토큰 <span aria-hidden="true">↗</span>
          </a>
        </header>
        <main id="main" tabIndex={-1}>
          {page === "Overview" ? (
            <Overview navigate={navigate} />
          ) : page === "Foundations" ? (
            <Foundations />
          ) : page === "Templates" ? (
            <TemplatePreviews />
          ) : (
            <>
              <PageHeader
                title={pageLabels[page]}
                eyebrow={`${page === "Atoms" ? "02" : page === "Molecules" ? "03" : "04"} / ${page === "Atoms" ? "재사용 기본 요소" : page === "Molecules" ? "의미 있는 조합" : "조합된 상호작용"}`}
                text={
                  page === "Atoms"
                    ? "목적이 명확한 재사용 컨트롤과 시각 요소입니다. 실제 예시·코드·기준 상태 계약을 확인하세요."
                    : page === "Molecules"
                      ? "작지만 목적이 분명한 조합입니다. 재사용 아톰과 기본 의미 구조로 필드·피드백·탐색을 구성합니다."
                      : "집중해서 결정할 수 있는 큰 조합입니다. 기본 모달 동작에 재사용 필드·피드백·동작 슬롯을 결합합니다."
                }
              />
              <div className="component-index">
                {group?.map((n) => (
                  <a key={n} href={`#${n.toLowerCase()}`}>
                    {n}
                  </a>
                ))}
              </div>
              {group?.map((n, i) => (
                <ComponentCard key={n} name={n} index={i} />
              ))}
            </>
          )}
          {page === "Atoms" && <StateGallery />}
          <footer className="page-footer">
            <span>common / 공유 디자인 시스템</span>
            <span>하나의 원본에서 시작해 자유롭게 조합합니다.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

import {Shell,Container,Stack} from './index';
import {ComponentWorkbench,GalleryDocs,VariantExamples} from './gallery/workbench';
import './gallery/shell.css';
import React, { useEffect, useState, useRef } from "react";
import { Playground, hasPlayground } from "./gallery/playground";
import { CodeBlock } from "./gallery/code-block";
import { CommonControlsComparison } from "./gallery/common-controls";
import { Overview } from "./gallery/overview";
import { ConnectedDetail, hasConnectedDetail } from "./gallery/connected-detail";
import { FormInputDetail, hasFormInputDetail } from "./gallery/form-input-detail";
import { SelectionDetail, hasSelectionDetail } from "./gallery/selection-detail";
import { FeedbackDetail, hasFeedbackDetail } from "./gallery/feedback-detail";
import { ExtendedInputDetail, hasExtendedInputDetail } from "./gallery/extended-input-detail";
import { NavigationDetail, hasNavigationDetail } from "./gallery/navigation-detail";
import { RegionOverlayDetail, hasRegionOverlayDetail } from "./gallery/region-overlay-detail";
import { DataDetail, hasDataDetail } from "./gallery/data-detail";
import { LayoutDetail, hasLayoutDetail } from "./gallery/layout-detail";
import { SlotTemplateDetail, hasSlotTemplateDetail } from "./gallery/slot-template-detail";
import { WorkspaceDetail, hasWorkspaceDetail } from "./gallery/workspace-detail";
import { IconDetail, hasIconDetail } from "./gallery/icon-detail";
import { ChartDetail, hasChartDetail } from "./gallery/chart-detail";
import { NativeInputDetail, hasNativeInputDetail } from "./gallery/native-input-detail";
import { GalleryNavigation } from "./gallery/navigation";
import { BottomCTADetail } from "./gallery/bottom-cta-detail";
import { RangeSelectionDetail } from "./gallery/range-selection-detail";
import { ProgressResultDetail } from "./gallery/progress-result-detail";
import { SegmentedDetail } from "./gallery/segmented-detail";
import { InputDetail } from "./gallery/input-detail";
import { ListDetail } from "./gallery/list-detail";
import { OverlayDetail } from "./gallery/overlay-detail";
import { galleryRegistry, componentHash, resolveGalleryHash, type GalleryRoute } from "./gallery/registry";
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

import { StateGallery } from "./components/state-gallery";
import { ThemeGallery } from "./components/theme-gallery";

import { IconGallery } from "./components/icons";
import { FeedbackGallery } from "./components/feedback-controls";
import { FormControlsGallery } from "./components/form-controls";
import { DateControlsGallery } from "./components/date-controls";
import { DataDisplayGallery } from "./components/data-display";
import { NavigationRegionsGallery } from "./components/navigation-regions";

import core from "./generated/core.json";
import contracts from "./generated/components.json";
import { resolveTokens } from "./tokens";
import longText from "./long-text.json";
export const pages = ['Overview','Foundations'] as const;
type Page=(typeof pages)[number];
const pageLabels:Record<Page,string>={Overview:'Overview',Foundations:'Foundations'};
const toneLabels: Record<Tone, string> = {
  neutral: "기본",
  running: "진행 중",
  success: "완료",
  review: "검토",
  error: "오류",
};
type Language = keyof typeof longText;
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
            유효한 선택이 있어야 사용할 수 있습니다. 처리 중인 동작도 초점을
            받을 수 있습니다.
          </p>
          <div className="wrap">
            <Button
              variant="destructive"
              onClick={() =>
                setMessage(
                  "삭제 동작 예시입니다. 데이터는 변경되지 않았습니다.",
                )
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
          <FormField label="편집 가능한 입력" placeholder="이름을 입력하세요" />
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
        <FormField label="메모">
          <Textarea
            rows={4}
            defaultValue="A common language for every interface.\n함께 만드는 일관된 경험."
          />
        </FormField>
      );
      break;
    case "Select":
      example = (
        <FormField label="분류">
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
          <FormField label="표시 이름" required />
          <FormField
            label="오류가 있는 이름"
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
                <option key={t} value={t}>
                  {toneLabels[t as Tone]}
                </option>
              ))}
            </Select>
          </label>
          <Alert title={tone === "error" ? "조치 필요" : "안내"} tone={tone}>
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
        <Menu
          label="옵션"
          items={["복제", "보관"]}
          onSelect={(v) =>
            setMessage(
              `${v} 동작을 선택했습니다. 데이터는 변경되지 않았습니다.`,
            )
          }
        />
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
                <CodeBlock source={"<Tabs items={views} />"}/>
              ),
            },
            {
              label: "사용법",
              content: <p>방향키·Home·End로 보기 사이를 이동하세요.</p>,
            },
          ]}
        />
      );
      break;
    case "Tooltip":
      example = (
        <Tooltip label="간격 안내" text="기준 4px 간격 척도를 사용하세요." />
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
            <p>범용 확인 창 예시입니다. 제품 데이터는 변경되지 않습니다.</p>
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
function StateContract({name}:{name:string}) {
  const historical=(contracts as Record<string,{states:string[]}>)[name];
  if(!historical)return null;
  return <GalleryDocs className="contract"><summary>기준 상태 계약</summary><p>원본 상태 계약이며 현재 구현의 전체 검증 통과를 의미하지 않습니다.</p><div className="wrap">{historical.states.map(state=><span className="state-chip" key={state}>{state}</span>)}</div><p>텍스트는 줄바꿈하고 컨테이너는 늘어납니다. 초점은 처리 중·오류·선택 상태와 독립적입니다. 범위별 예외는 원본 계약에서 확인하세요.</p><a href="/source/contracts/components.json">원본 계약 보기 ↗</a></GalleryDocs>;
}
function RelatedExamples({name}:{name:string}) {
  const examples=name==='Button'?<StateGallery/>:name==='FormField'?<FormControlsGallery/>:name==='Alert'?<FeedbackGallery/>:name==='DatePicker'?<DateControlsGallery/>:name==='DataTable'?<DataDisplayGallery/>:name==='Dialog'?<NavigationRegionsGallery/>:null;
  return examples?<GalleryDocs><summary>관련 상태 · 조합 예제</summary>{examples}</GalleryDocs>:null;
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
      <PageHeader title="Foundations" eyebrow="" />
      <div className="foundation-grid">
        <article className="feature-card">
          <span className="eyebrow">타이포그래피</span>
          <h2 className="type-sample">Aa 가나</h2>
          <h3>Pretendard</h3>
          <p>본문 400 · 레이블 500 · 제목 600 · 강조 700</p>

          <a href="/source/fonts/LICENSE">글꼴 라이선스 ↗</a>
        </article>
        <article className="feature-card">
          <span className="eyebrow">크기와 간격</span>
          <div className="geometry">
            <div>48</div>
            <div>44</div>
            <div>10</div>
          </div>
          <h3>Controls</h3>
<p>주요 버튼 48px · 입력 44px · 버튼·입력 모서리 10px</p>
        </article>
      </div>
      <ThemeGallery />
      <IconGallery />
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
              {
                {
                  primitive: "기본값",
                  semantic: "의미 역할",
                  component: "컴포넌트",
                }[l]
              }{" "}
              <span>{Object.keys(core[l]).length}</span>
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
      <details className="note"><summary>토큰 · 대비 문서</summary>
        <strong>사용 계약</strong>
        <p>
          원본 명암 대비 허용 목록과 금지 조합을 유지합니다. 수치 근거는
          애플리케이션 접근성 인증이 아닙니다. 테마를 교체하면 다시 평가해야
          합니다.
        </p>
        <div className="wrap">
          <a href="/source/tokens/core.json">기준 원본 ↗</a>
          <a href="/source/contracts/color-pairs.json">
            명암 대비 허용 목록 ↗
          </a>
          <a href="/source/contracts/components.json">기준 계약 ↗</a>
        </div>
      </details>
    </>
  );
}
function PageHeader({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <header className="page-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
    </header>
  );
}
function CanonicalDetail({name}:{name:string}) {const entry={name};return <>              {hasNativeInputDetail(entry.name) ? <NativeInputDetail name={entry.name}/> : hasChartDetail(entry.name) ? <ChartDetail/> : hasIconDetail(entry.name) ? <IconDetail name={entry.name}/> : hasWorkspaceDetail(entry.name) ? <WorkspaceDetail name={entry.name}/> : hasSlotTemplateDetail(entry.name) ? <SlotTemplateDetail name={entry.name}/> : hasLayoutDetail(entry.name) ? <LayoutDetail name={entry.name}/> : hasDataDetail(entry.name) ? <DataDetail name={entry.name}/> : hasRegionOverlayDetail(entry.name) ? <RegionOverlayDetail name={entry.name}/> : hasNavigationDetail(entry.name) ? <NavigationDetail name={entry.name}/> : hasExtendedInputDetail(entry.name) ? <ExtendedInputDetail name={entry.name}/> : hasFeedbackDetail(entry.name) ? <FeedbackDetail name={entry.name}/> : hasSelectionDetail(entry.name) ? <SelectionDetail name={entry.name}/> : hasFormInputDetail(entry.name) ? <FormInputDetail name={entry.name}/> : hasConnectedDetail(entry.name) ? <ConnectedDetail name={entry.name}/> : entry.name==="BottomCTA" ? <BottomCTADetail/> : ["Slider","Rating"].includes(entry.name) ? <RangeSelectionDetail kind={entry.name==="Slider"?"slider":"rating"}/> : ["ProgressStepper","Result"].includes(entry.name) ? <ProgressResultDetail kind={entry.name==="ProgressStepper"?"progress-stepper":"result"}/> : entry.name==="SegmentedControl" ? <SegmentedDetail/> : entry.name==="TextField" ? <InputDetail/> : ["ListRow","ListHeader","ListFooter"].includes(entry.name) ? <ListDetail/> : ["BottomSheet","Dialog"].includes(entry.name) ? <OverlayDetail kind={entry.name==="BottomSheet"?"bottom-sheet":"dialog"}/> : <>
                {!hasPlayground(entry.name) && <Demo name={entry.name}/>}
                {!hasPlayground(entry.name) && <GalleryDocs><summary>코드 · API · 접근성</summary>{snippets[entry.name] && <CodeBlock source={snippets[entry.name]}/>}</GalleryDocs>}
              </>}</>; }

export function App() {
  const [route, setRoute] = useState<GalleryRoute>(() => resolveGalleryHash(window.location.hash));
  const [navOpen, setNavOpen] = useState(false);
  const pendingHeadingFocus = useRef(false);
  const entry = route.kind === "component" ? galleryRegistry.find(item => item.id === route.id) : undefined;
  const page:Page = route.kind === "page" ? route.page : "Overview";
  function navigateHash(hash:string) {
    pendingHeadingFocus.current = true;
    setRoute(resolveGalleryHash(hash));
    if(window.location.hash !== hash) window.location.hash = hash;
    setNavOpen(false);
    window.scrollTo?.({ top: 0, behavior: "instant" });
  }
  function navigate(p:Page) { navigateHash(`#${p}`); }
  useEffect(() => {
    function sync() {
      const next = resolveGalleryHash(window.location.hash);
      // Preserve the existing live-fragment contract: reject invalid changes without replacing the current view.
      // An invalid direct entry still resolves to Overview in the initial state.
      if(next.kind === "page" && next.invalid)return;
      // History events only read the URL: never push/replace from this handler.
      setRoute(previous => {
        if(JSON.stringify(previous)===JSON.stringify(next))return previous;
        pendingHeadingFocus.current=true;
        return next;
      });
      setNavOpen(false);
    }
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    if(navOpen || !pendingHeadingFocus.current)return;
    // Run after Dialog's layout cleanup restores its opener; selection wins afterwards.
    const frame=requestAnimationFrame(()=>{
      const heading=document.querySelector<HTMLElement>("#main h1");
      if(heading){heading.tabIndex=-1;heading.focus();}
      pendingHeadingFocus.current=false;
    });
    return ()=>cancelAnimationFrame(frame);
  }, [route,navOpen]);
  const navigation=<GalleryNavigation selected={entry?.id} onNavigate={navigateHash}/>;
  const header=<div className="gallery-header"><Container><div className="gallery-header-row"><span className="gallery-menu-button"><Button variant="quiet" aria-label="컴포넌트 탐색 열기" aria-expanded={navOpen} onClick={()=>setNavOpen(true)}>☰</Button></span><span className="gallery-header-brand">common</span><span className="gallery-header-current">{entry?.name??pageLabels[page]}</span><a href="/source/tokens/core.json">Tokens ↗</a></div></Container></div>;
  return <div className="gallery-app ds-core"><a className="skip-link" href="#main">본문으로 건너뛰기</a>
    <Shell mainAs="div" navigation={navigation} header={header}>
      {navOpen&&<Dialog open title="컴포넌트 탐색" onClose={()=>setNavOpen(false)}><GalleryNavigation selected={entry?.id} onNavigate={navigateHash}/></Dialog>}
      <main id="main" tabIndex={-1}><Container><Stack>
          {entry ? (
            <section className="component-detail" key={entry.id}>
              <PageHeader title={entry.name} eyebrow=""/><ComponentWorkbench>
              {hasPlayground(entry.name) && <Playground name={entry.name}/> }
              {entry.name === "Button" && <VariantExamples><CommonControlsComparison/></VariantExamples>}
              {hasPlayground(entry.name)?<VariantExamples><CanonicalDetail name={entry.name}/></VariantExamples>:<CanonicalDetail name={entry.name}/>}


              <StateContract name={entry.name}/>
              <RelatedExamples name={entry.name}/></ComponentWorkbench>
            </section>
          ) : page === "Overview" ? (
            <Overview navigate={navigate} />
          ) : page === "Foundations" ? (
            <Foundations />
          ) : null}
          <footer className="page-footer">
            <span>common / 공유 디자인 시스템</span>

          </footer>
      </Stack></Container></main>
    </Shell>
  </div>;
}

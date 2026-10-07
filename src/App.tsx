import {Shell,Container,Stack} from './index';
import './gallery/shell.css';
import React, { useEffect, useState, useRef } from "react";
import { Playground, hasPlayground } from "./gallery/playground";
import { Overview } from "./gallery/overview";
import { ConnectedDetail, hasConnectedDetail } from "./gallery/connected-detail";
import { FormInputDetail, hasFormInputDetail } from "./gallery/form-input-detail";
import { SelectionDetail, hasSelectionDetail } from "./gallery/selection-detail";
import {NativeNavigationDetail,hasNativeNavigationDetail} from "./gallery/native-navigation-detail";
import { FeedbackDetail, hasFeedbackDetail } from "./gallery/feedback-detail";
import { ExtendedInputDetail, hasExtendedInputDetail } from "./gallery/extended-input-detail";
import { NavigationDetail, hasNavigationDetail } from "./gallery/navigation-detail";
import { RegionOverlayDetail, hasRegionOverlayDetail } from "./gallery/region-overlay-detail";
import { DataDetail, hasDataDetail } from "./gallery/data-detail";
import { LayoutDetail, hasLayoutDetail } from "./gallery/layout-detail";
import { IconDetail, hasIconDetail } from "./gallery/icon-detail";
import { ChartDetail, hasChartDetail } from "./gallery/chart-detail";
import { NativeInputDetail, hasNativeInputDetail } from "./gallery/native-input-detail";
import { GalleryNavigation } from "./gallery/navigation";
import { BottomCTADetail } from "./gallery/bottom-cta-detail";
import {StepperComponentDetail} from "./gallery/stepper-component-detail";
import { ListComponentDetail } from "./gallery/list-component-detail";
import {ModalComponentDetail} from "./gallery/modal-component-detail";
import { galleryRegistry, componentHash, resolveGalleryHash, type GalleryRoute } from "./gallery/registry";
import {ComponentWorkbench} from "./gallery/workbench";
import { Button, Input, Select, Dialog } from "./index";
import { ThemeGallery } from "./components/theme-gallery";
import { IconGallery } from "./components/icons";
import core from "./generated/core.json";
import { resolveTokens } from "./tokens";

export const pages = ['Overview','Foundations'] as const;
type Page=(typeof pages)[number];
const pageLabels:Record<Page,string>={Overview:'Overview',Foundations:'Foundations'};
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
            <div>44</div>
            <div>8</div>
            <div>14</div>
          </div>
          <h3>Controls</h3>
<p>기본 버튼·입력 44px · 모서리 8px · 컨트롤 글자 14px</p>
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
function CanonicalDetail({name}:{name:string}) {
 if(hasPlayground(name))return <Playground name={name}/>;
 if(hasNativeInputDetail(name))return <NativeInputDetail name={name}/>;
 if(hasChartDetail(name))return <ChartDetail/>;
 if(hasIconDetail(name))return <IconDetail name={name}/>;
 if(hasLayoutDetail(name))return <LayoutDetail name={name}/>;
 if(hasDataDetail(name))return <DataDetail name={name}/>;
 if(hasRegionOverlayDetail(name))return <RegionOverlayDetail name={name}/>;
 if(hasNativeNavigationDetail(name))return <NativeNavigationDetail name={name}/>;
 if(hasNavigationDetail(name))return <NavigationDetail name={name}/>;
 if(hasExtendedInputDetail(name))return <ExtendedInputDetail name={name}/>;
 if(hasFeedbackDetail(name))return <FeedbackDetail name={name}/>;
 if(hasSelectionDetail(name))return <SelectionDetail name={name}/>;
 if(hasFormInputDetail(name))return <FormInputDetail name={name}/>;
 if(hasConnectedDetail(name))return <ConnectedDetail name={name}/>;
 if(name==='BottomCTA')return <BottomCTADetail/>;
 if(name==='ProgressStepper')return <StepperComponentDetail kind="progress-stepper"/>;
 if(name==='ListRow'||name==='ListHeader'||name==='ListFooter')return <ListComponentDetail name={name}/>;
 if(name==='BottomSheet'||name==='Dialog'||name==='Confirm')return <ModalComponentDetail kind={name==='BottomSheet'?'bottom-sheet':name==='Confirm'?'confirm':'dialog'}/>;
 return <p role="alert">시연을 불러오지 못했습니다.</p>;
}

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
  const header=<div className="gallery-header"><Container><div className="gallery-header-row"><span className="gallery-menu-button"><Button variant="quiet" aria-label="컴포넌트 탐색 열기" aria-expanded={navOpen} onClick={()=>setNavOpen(true)}>☰</Button></span><span className="gallery-header-brand">Gyeol Design</span><span className="gallery-header-current">{entry?.name??pageLabels[page]}</span><a href="/source/tokens/core.json">Tokens ↗</a></div></Container></div>;
  return <div className="gallery-app ds-core"><a className="skip-link" href="#main">본문으로 건너뛰기</a>
    <Shell mainAs="div" navigation={navigation} header={header}>
      {navOpen&&<Dialog open title="컴포넌트 탐색" onClose={()=>setNavOpen(false)}><GalleryNavigation selected={entry?.id} onNavigate={navigateHash}/></Dialog>}
      <main id="main" tabIndex={-1}><Container><Stack>
          {entry ? (
            <section className="component-detail" key={entry.id}>
              <PageHeader title={entry.name} eyebrow=""/><ComponentWorkbench name={entry.name}>
              <CanonicalDetail name={entry.name}/>



              </ComponentWorkbench>
            </section>
          ) : page === "Overview" ? (
            <Overview navigate={navigate} />
          ) : page === "Foundations" ? (
            <Foundations />
          ) : null}

      </Stack></Container></main>
    </Shell>
  </div>;
}

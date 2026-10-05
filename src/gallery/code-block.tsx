import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';

const formatter = () => Promise.all([
  import('prettier/standalone'), import('prettier/plugins/typescript'), import('prettier/plugins/estree'),
]);
function tokens(nodes: string | Prism.Token | (string | Prism.Token)[]): React.ReactNode {
  if (typeof nodes === 'string') return nodes;
  if (Array.isArray(nodes)) return nodes.map((node, index) => <React.Fragment key={index}>{tokens(node)}</React.Fragment>);
  return <span className={`token ${nodes.type}`}>{tokens(nodes.content)}</span>;
}

/** Gallery-only: source is displayed as escaped React text, never executed. */
export function CodeBlock({source}: {source: string}) {
  const [formatted, setFormatted] = React.useState({input: '', text: '', failed: false});
  const [copy, setCopy] = React.useState({input: '', message: ''});
  const activeSource = React.useRef(source);
  activeSource.current = source;
  React.useEffect(() => {
    let cancelled = false;
    formatter().then(async ([prettier, typescript, estree]) => {
      const text = await prettier.format(source, {parser:'typescript', plugins:[typescript, estree.default], printWidth:80, tabWidth:2, singleQuote:true});
      if (!cancelled) setFormatted({input:source, text:text.trimEnd(), failed:false});
    }).catch(() => {if (!cancelled) setFormatted({input:source,text:source,failed:true});});
    return () => {cancelled = true;};
  }, [source]);
  const text = formatted.input === source ? formatted.text : source;
  const highlighted = React.useMemo(() => tokens(Prism.tokenize(text, Prism.languages.tsx)), [text]);
  async function copyCurrent() {
    const input = source;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        // HTTP preview fallback: keep existing focus and selection intact.
        const previous = document.activeElement as HTMLElement | null;
        const selection = window.getSelection();
        const ranges = selection ? Array.from({length:selection.rangeCount}, (_,i) => selection.getRangeAt(i).cloneRange()) : [];
        const field = document.createElement('textarea');
        field.value = text; field.setAttribute('readonly',''); field.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.append(field);
        let success = false;
        try {field.select(); success = document.execCommand('copy');}
        finally {field.remove(); previous?.focus({preventScroll:true}); if(selection){selection.removeAllRanges();ranges.forEach(range=>selection.addRange(range));}}
        if (!success) throw Error('Copy declined');
      }
      if (activeSource.current === input) setCopy({input,message:'복사했어요.'});
    } catch {
      if (activeSource.current === input) setCopy({input,message:'복사하지 못했어요. 코드를 선택해 복사해 주세요.'});
    }
  }
  return <div className="gallery-code-block">
    <div className="gallery-code-toolbar"><span>TSX</span><button type="button" onClick={copyCurrent}>코드 복사</button></div>
    <pre tabIndex={0} aria-label="사용 코드" data-formatted={formatted.input===source&&!formatted.failed}><code>{highlighted}</code></pre>
    <span className="gallery-code-status" role="status">{copy.input===source?copy.message:''}</span>
    {formatted.input===source&&formatted.failed&&<small>포맷하지 못해 원문을 표시해요.</small>}
  </div>;
}

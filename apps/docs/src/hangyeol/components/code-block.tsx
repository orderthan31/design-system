import './code-block.css';
import '../primitives/visually-hidden.css';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { Button } from '../primitives/button';
import { codeLanguage, formattedCode } from '../lib/code-format';

// React owns token spans. Never let Prism's automatic DOM scanner replace them.
Prism.manual = true;

function tokenNodes(tokens: Array<string | Prism.Token>): ReactNode {
  return tokens.map((token, index) => {
    if (typeof token === 'string') return token;
    const content =
      typeof token.content === 'string'
        ? token.content
        : tokenNodes(
            Array.isArray(token.content) ? token.content : [token.content],
          );
    const aliases =
      typeof token.alias === 'string' ? [token.alias] : (token.alias ?? []);
    return (
      <span className={['token', token.type, ...aliases].join(' ')} key={index}>
        {content}
      </span>
    );
  });
}

export function CodeBlock({
  children,
  language = 'React',
}: {
  children: string;
  language?: string;
}) {
  const grammarName = codeLanguage(language);
  const key = `${grammarName}\0${children}`;
  const currentKey = useRef(key);
  currentKey.current = key;
  const id = useId();
  const [result, setResult] = useState<{
    key: string;
    code: string;
    failed: boolean;
  }>();
  const [copy, setCopy] = useState<{
    key: string;
    status: 'copied' | 'failed';
  }>();
  useEffect(() => {
    let active = true;
    void formattedCode(children, grammarName).then(
      (code) => {
        if (active) setResult({ key, code, failed: false });
      },
      () => {
        if (active) setResult({ key, code: children, failed: true });
      },
    );
    return () => {
      active = false;
    };
  }, [children, grammarName, key]);
  const ready = result?.key === key;
  const code = ready ? result.code : children;
  const highlighted = useMemo(() => {
    const grammar = Prism.languages[grammarName];
    return grammar ? tokenNodes(Prism.tokenize(code, grammar)) : code;
  }, [code, grammarName]);
  const copyStatus = copy?.key === key ? copy.status : undefined;
  const status =
    copyStatus === 'failed'
      ? '자동 복사를 사용할 수 없습니다. 코드를 선택해서 복사하세요.'
      : copyStatus === 'copied'
        ? '코드를 복사했습니다.'
        : '';
  return (
    <div className="hangyeol-code">
      <div className="hangyeol-code-toolbar">
        <span id={id}>{language}</span>
        <Button
          variant="quiet"
          size="small"
          disabled={!ready}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              if (currentKey.current === key)
                setCopy({ key, status: 'copied' });
            } catch {
              if (currentKey.current === key)
                setCopy({ key, status: 'failed' });
            }
          }}
        >
          {copyStatus === 'copied' ? '복사됨' : '코드 복사'}
        </Button>
      </div>
      <pre tabIndex={0} aria-labelledby={id} aria-busy={!ready}>
        <code className={`language-${grammarName}`}>{highlighted}</code>
      </pre>
      <p className="hangyeol-visually-hidden" role="status">
        {status}
      </p>
      {copyStatus === 'failed' && <p className="text-g-small">{status}</p>}
      {ready && result.failed && (
        <p className="text-g-small text-g-soft">
          코드 형식을 정리하지 못했습니다. 원본 코드를 표시합니다.
        </p>
      )}
    </div>
  );
}

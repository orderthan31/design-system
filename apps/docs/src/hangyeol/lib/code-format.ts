import type { Options } from 'prettier';

export type CodeLanguage = 'tsx' | 'css' | 'bash' | 'json' | 'text';

export function codeLanguage(label: string): CodeLanguage {
  switch (label.toLowerCase()) {
    case 'react':
    case 'tsx':
    case 'jsx':
    case 'typescript':
    case 'javascript':
      return 'tsx';
    case 'css':
      return 'css';
    case 'shell':
    case 'bash':
    case 'sh':
      return 'bash';
    case 'json':
      return 'json';
    default:
      return 'text';
  }
}

// Load only the parser needed by the visible example, not with the Docs shell.
async function loadPlugins(language: CodeLanguage) {
  if (language === 'css') {
    const postcss = await import('prettier/plugins/postcss');
    return [postcss.default];
  }
  const [parser, estree] = await Promise.all([
    language === 'json'
      ? import('prettier/plugins/babel')
      : import('prettier/plugins/typescript'),
    import('prettier/plugins/estree'),
  ]);
  return [parser.default, estree.default];
}

const options: Options = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: 'all',
  endOfLine: 'lf',
};

function unwrapFragment(source: string): string {
  const start = source.indexOf('<>') + 2;
  const end = source.lastIndexOf('</>');
  const lines = source
    .slice(start, end)
    .replace(/^\n|\n\s*$/g, '')
    .split('\n');
  const indentation = Math.min(
    ...lines
      .filter((line) => line.trim())
      .map((line) => line.match(/^ */)![0].length),
  );
  return lines
    .map((line) => line.slice(indentation))
    .join('\n')
    .trim();
}

async function formatCode(
  source: string,
  language: CodeLanguage,
): Promise<string> {
  // Prettier has no built-in Shell parser. Commands remain byte-for-byte intact.
  if (language === 'bash' || language === 'text' || !source.trim())
    return source;
  const [prettier, plugins] = await Promise.all([
    import('prettier/standalone'),
    loadPlugins(language),
  ]);
  const parser = language === 'tsx' ? 'typescript' : language;
  if (language === 'tsx' && source.trimStart().startsWith('<')) {
    // Documentation snippets may contain adjacent JSX roots, not a full module.
    const wrapped = await prettier.format(
      `const example = (<>\n${source}\n</>);`,
      {
        ...options,
        parser,
        plugins,
      },
    );
    return unwrapFragment(wrapped);
  }
  return (
    await prettier.format(source, { ...options, parser, plugins })
  ).trimEnd();
}

// Reopening a tab should not reparse its unchanged source. Bound editable examples.
const cache = new Map<string, Promise<string>>();
export function formattedCode(
  source: string,
  language: CodeLanguage,
): Promise<string> {
  const key = `${language}\0${source}`;
  const previous = cache.get(key);
  if (previous) return previous;
  const result = formatCode(source, language);
  cache.set(key, result);
  if (cache.size > 80) cache.delete(cache.keys().next().value!);
  void result.catch(() => {
    if (cache.get(key) === result) cache.delete(key);
  });
  return result;
}

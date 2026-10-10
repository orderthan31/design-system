import { useThemeScope } from './gyeol/foundation/theme';

export function BrandCI({ intro = false, decorative = false }: { intro?: boolean; decorative?: boolean }) {
  const { mode } = useThemeScope();
  return <span className={intro ? 'docs-brand-mark docs-brand-mark-intro' : 'docs-brand-mark'} data-ci-mode={mode} role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : '한결디자인 — HANGYEOL DESIGN'}>
    <span className="docs-brand-symbol"/>
    <span className="docs-brand-wordmark"/>
  </span>;
}

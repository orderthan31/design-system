import { BrandMark } from './hangyeol/components/brand-mark';
import type { CSSProperties } from 'react';

export function BrandCI({ intro = false, decorative = false }: { intro?: boolean; decorative?: boolean }) {
  return <BrandMark style={{ '--hangyeol-brand-width': intro ? 'min(313px, 100%)' : '176px' } as CSSProperties} decorative={decorative} label="한결디자인 — HANGYEOL DESIGN" symbolUrl="/brand/hangyeol-ci-symbol.svg" wordmarkUrl="/brand/hangyeol-ci-wordmark.svg"/>;
}

/** The route inventory is independent of the filtered docs menu. */
export const docsPages = [
 'Overview', 'TaskExample', 'Foundations', 'Button', 'Input', 'TextField',
 'Select', 'Tabs', 'Dialog', 'Layout', 'List', 'FormSection', 'ListPanel',
 'Customization', 'Behavior',
] as const;
export type DocsPage = typeof docsPages[number];

/** Case-sensitive valid pages only. Empty, unknown or malformed hashes use Overview. */
export function parsePageHash(hash:string):DocsPage {
 if (!hash.startsWith('#')) return 'Overview';
 try {
  const decoded = decodeURIComponent(hash.slice(1));
  return docsPages.find(page => page === decoded) ?? 'Overview';
 } catch {
  return 'Overview';
 }
}
export function pageHref(page:DocsPage):`#${DocsPage}` {
 return `#${page}`;
}

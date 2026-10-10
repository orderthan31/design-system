import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { createRef } from 'react';
import { Moon, Sun, Check } from 'lucide-react';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { Icon as CanonicalIcon } from '../../src/ui/primitives/icon';
import { Icon as InstalledIcon } from '../../../../apps/docs/src/hangyeol/primitives/icon';

afterEach(cleanup);
for (const [owner, Icon] of [['canonical', CanonicalIcon], ['installed', InstalledIcon]] as const) {
  describe(`${owner} Icon theme boundary`, () => {
    for (const [name, Glyph] of [['moon', Moon], ['sun', Sun]] as const) {
      it(`${name} preserves Lucide geometry and decorative 20px dimensions`, () => {
        const ref = createRef<SVGSVGElement>();
        const { container } = render(<><Icon ref={ref} name={name} size="medium" width={20} height={20} data-theme-glyph={name}/><Glyph size={20} aria-hidden="true"/></>);
        const [actual, previous] = container.querySelectorAll('svg');
        expect(ref.current).toBe(actual);
        expect(actual.innerHTML).toBe(previous.innerHTML);
        for (const attribute of ['width', 'height', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'aria-hidden']) {
          expect(actual.getAttribute(attribute), attribute).toBe(previous.getAttribute(attribute));
        }
        expect(actual.getAttribute('class')).toContain('h-5 w-5');
        expect(actual.getAttribute('data-theme-glyph')).toBe(name);
        expect(actual.getAttribute('focusable')).toBe('false');
        expect(actual.hasAttribute('role')).toBe(false);
      });
    }
    it('retains existing glyph defaults, size variants and accessible native props', () => {
      const { container, rerender } = render(<><Icon name="check"/><Check/></>);
      const [actual, previous] = container.querySelectorAll('svg');
      expect(actual.innerHTML).toBe(previous.innerHTML);
      expect(actual.getAttribute('width')).toBe('24');
      expect(actual.getAttribute('class')).toContain('h-5 w-5');
      for (const [size, classes] of [['small', 'h-4 w-4'], ['large', 'h-6 w-6']] as const) {
        rerender(<Icon name="check" size={size} label="완료" width={18} height={19} strokeWidth={3} className="custom"/>);
        const svg = container.querySelector('svg')!;
        expect(svg.getAttribute('class')).toContain(classes);
        expect(svg.getAttribute('class')).toContain('custom');
        expect(svg.getAttribute('aria-label')).toBe('완료');
        expect(svg.getAttribute('role')).toBe('img');
        expect(svg.hasAttribute('aria-hidden')).toBe(false);
        expect(svg.getAttribute('width')).toBe('18');
        expect(svg.getAttribute('height')).toBe('19');
        expect(svg.getAttribute('stroke-width')).toBe('3');
      }
    });
  });
}

// A closed external-import boundary prevents renamed/namespace UI imports too.
function externalImports(source: string) {
  const ast = ts.createSourceFile('docs.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const violations: string[] = [];
  function visit(node: ts.Node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const name = node.moduleSpecifier.text;
      // The foundation documentation reads token CSS as text, not as a UI component.
      const rawTokenData = name === 'tailwindcss/theme.css?raw';
      if (!name.startsWith('.') && !['react', 'react-dom/client'].includes(name) && !rawTokenData) violations.push(name);
    }
    if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === 'require'))) {
      violations.push(node.getText(ast));
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return violations;
}
it('authored Docs only imports local owners and React runtime, never external UI', () => {
  const root = path.resolve('apps/docs/src');
  function check(directory: string) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === 'hangyeol') continue;
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) check(file);
      else if (/\.tsx?$/.test(entry.name)) expect(externalImports(fs.readFileSync(file, 'utf8')), file).toEqual([]);
    }
  }
  check(root);
  const source = fs.readFileSync(path.join(root, 'docs-app.tsx'), 'utf8');
  expect(source).toContain("import { Icon } from './hangyeol/primitives/icon'");
  expect(source).toContain("<Icon name={mode==='light'?'moon':'sun'} size=\"medium\" width={20} height={20}/>");
});
it('AST import guard rejects arbitrary external UI, aliases, namespaces and reexports', () => {
  for (const source of ["import { Moon as Glyph } from 'lucide-react';", "import * as Glyphs from 'lucide-react';", "import Button from 'other-ui';", "export { Icon } from '@vendor/ui';", "const Glyph = import('lucide-react');", "const Glyph = require('other-ui');"]) {
    expect(externalImports(source).length).toBeGreaterThan(0);
  }
  expect(externalImports("import { useState } from 'react'; import { Icon } from './hangyeol/primitives/icon';")).toEqual([]);
});

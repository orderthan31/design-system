import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {expect, test, vi} from 'vitest';
import {Tabs, Menu, Tooltip} from '../src/components/navigation';

for (const activation of ['click', 'Enter', 'Space'] as const) {
  for (const control of ['tab', 'menu trigger', 'menu item', 'tooltip'] as const) {
    test(`${control} ${activation} does not submit its enclosing form`, async () => {
      const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
      const select = vi.fn();
      render(<form onSubmit={submit}>
        <Tabs items={[{label: 'Preview', content: 'Preview panel'}, {label: 'Code', content: 'Code panel'}]}/>
        <Menu label="Options" items={['Archive']} onSelect={select}/>
        <Tooltip label="Help" text="Helpful detail"/>
      </form>);
      let target: HTMLElement;
      if (control === 'tab') target = screen.getByRole('tab', {name: 'Code'});
      else if (control === 'tooltip') target = screen.getByRole('button', {name: 'Help'});
      else {
        target = screen.getByRole('button', {name: 'Options'});
        if (control === 'menu item') {
          target.focus();
          await userEvent.keyboard('{ArrowDown}');
          target = screen.getByRole('menuitem', {name: 'Archive'});
        }
      }
      if (activation === 'click') await userEvent.click(target);
      else {
        target.focus();
        await userEvent.keyboard(activation === 'Enter' ? '{Enter}' : ' ');
      }
      expect(submit).not.toHaveBeenCalled();
      expect(target).toHaveAttribute('type', 'button');
      if (control === 'tab') expect(screen.getByRole('tabpanel')).toHaveTextContent('Code panel');
      if (control === 'menu trigger') expect(screen.getByRole('menu')).toBeVisible();
      if (control === 'menu item') expect(select).toHaveBeenCalledWith('Archive');
      if (control === 'tooltip') expect(screen.getByRole('tooltip')).toBeVisible();
    });
  }
}

import React from 'react';import {render,screen,fireEvent} from '@testing-library/react';import {test,expect} from 'vitest';import {Input} from '../src/components/atoms';
test('busy input preserves readable value and associates visible status',()=>{render(<Input aria-label="Lookup" defaultValue="Existing content" loading busyLabel="Checking entry…"/>);const input=screen.getByRole('textbox',{name:'Lookup'});expect(input).toHaveAttribute('aria-busy','true');expect(input).not.toBeDisabled();expect(input).toHaveValue('Existing content');expect(screen.getByRole('status')).toHaveTextContent('Checking entry…');expect(input).toHaveAccessibleDescription('Checking entry…');});

test('loading transitions retain the uncontrolled input node, edits, focus and selection', () => {
  const props = { 'aria-label': 'Lookup', defaultValue: 'Original', 'aria-describedby': 'existing-help', busyLabel: 'Checking entry…' };
  const {rerender} = render(<><span id="existing-help">Existing help</span><Input {...props}/></>);
  const input = screen.getByRole('textbox', {name: 'Lookup'}) as HTMLInputElement;
  input.focus();
  fireEvent.change(input, {target: {value: 'User edited'}});
  input.setSelectionRange(2, 5);
  for (const loading of [true, false, true, false]) {
    rerender(<><span id="existing-help">Existing help</span><Input {...props} loading={loading}/></>);
    expect(screen.getByRole('textbox', {name: 'Lookup'})).toBe(input);
    expect(input).toHaveValue('User edited');
    expect(input).toHaveFocus();
    expect([input.selectionStart, input.selectionEnd]).toEqual([2, 5]);
    expect(input).not.toBeDisabled();
    expect(input).toHaveAccessibleDescription(loading ? 'Existing help Checking entry…' : 'Existing help');
    if (loading) {
      expect(input).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByRole('status')).toHaveTextContent('Checking entry…');
    } else {
      expect(input).not.toHaveAttribute('aria-busy');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    }
  }
});
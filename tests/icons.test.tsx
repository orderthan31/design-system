import React from 'react';
import {render,screen} from '@testing-library/react';
import {expect,test} from 'vitest';
import {Icon,IconAction,iconNames} from '../src/components/icons';

test('selected icon subset is typed, decorative by default and sized with currentColor',()=>{
 render(<Icon name="search" size={20} strokeWidth={1.5} data-testid="icon"/>);
 const icon=screen.getByTestId('icon');expect(icon.tagName.toLowerCase()).toBe('svg');expect(icon).toHaveAttribute('aria-hidden','true');expect(icon).toHaveAttribute('width','20');expect(icon).toHaveAttribute('stroke','currentColor');expect(icon).toHaveAttribute('stroke-width','1.5');
 expect(new Set(iconNames).size).toBe(iconNames.length);expect(iconNames).toContain('calendar');expect(iconNames).toContain('play');
});
test('named icon action reuses actual Button and does not submit its consumer form',()=>{
 render(<form><IconAction name="close" label="닫기"/></form>);
 const button=screen.getByRole('button',{name:'닫기'});expect(button).toHaveAttribute('type','button');expect(button).toHaveClass('button','icon-button');expect(button.querySelector('svg')).toHaveAttribute('aria-hidden','true');
});

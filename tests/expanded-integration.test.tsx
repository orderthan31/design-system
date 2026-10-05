import React from 'react';
import {test,expect} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
test('demo headers remove explanatory descriptions while required errors remain',()=>{window.location.hash='Atoms';const {container}=render(<App/>);expect(container.querySelector('.page-heading p')).toBeNull();expect(container.querySelector('.card-title p')).toBeNull();expect(screen.getByText('예시가 잠겨 있는 동안 사용할 수 없습니다.')).toBeVisible();});
test('overview is demo-first rather than repeated narrative cards',()=>{window.location.hash='Overview';const {container}=render(<App/>);expect(container.querySelector('.hero p')).toBeNull();expect(container.querySelector('.feature-card')).toBeNull();});
test('template list menu performs a real local copy and archive',()=>{window.location.hash='Templates';render(<App/>);fireEvent.click(screen.getByRole('button',{name:'목록'}));fireEvent.click(screen.getByRole('button',{name:'목록 옵션'}));fireEvent.click(screen.getByRole('menuitem',{name:'첫 항목 복제'}));expect(screen.getByRole('checkbox',{name:'복제 항목 4'})).toBeVisible();fireEvent.click(screen.getByRole('button',{name:'목록 옵션'}));fireEvent.click(screen.getByRole('menuitem',{name:'첫 항목 보관'}));expect(screen.queryByRole('checkbox',{name:'첫 번째 항목'})).toBeNull();});
import * as core from '../src/index';
import {App} from '../src/App';
test('expanded reusable APIs are public exports independent of App',()=>{
 for(const name of ['DesktopWorkspaceTemplate','MobileWorkspaceTemplate','WorkspaceTemplatesGallery','Icon','IconAction','Accordion','Collapse','Toast','DatePicker','DateRangePicker','MonthPicker','TimeInput','DateTimeInput','Table','DataTable','Pagination','List','ListItem','PasswordInput','NumberInput','Stepper','CurrencyInput','PhoneInput','EmailInput','Combobox','Autocomplete','MultiSelect','RadioGroup','CheckboxGroup','Switch','FileInput','AddressField','GNB','LNB','Breadcrumb','Drawer','BottomSheet','Popover']) expect((core as Record<string,unknown>)[name],name).toBeTypeOf('function');
});
test.each([['Foundations','아이콘'],['Molecules','확장 폼 컨트롤'],['Molecules','상태와 펼침'],['Organisms','기간 선택'],['Templates','작업 공간 템플릿']])('%s contains real extended galleries', (page,name)=>{
 window.location.hash=page;render(<App/>);expect(screen.getByRole('region',{name})).toBeInTheDocument();
});

import React from 'react';
import {test,expect} from 'vitest';
import {render,screen} from '@testing-library/react';
test('demo headers remove explanatory descriptions while required errors remain',()=>{window.location.hash='Atoms';const {container}=render(<App/>);expect(container.querySelector('.page-heading p')).toBeNull();expect(container.querySelector('.card-title p')).toBeNull();expect(screen.getByText('예시가 잠겨 있는 동안 사용할 수 없습니다.')).toBeVisible();});
test('overview is demo-first rather than repeated narrative cards',()=>{window.location.hash='Overview';const {container}=render(<App/>);expect(container.querySelector('.hero p')).toBeNull();expect(container.querySelector('.feature-card')).toBeNull();});
import * as core from '../src/index';
import {App} from '../src/App';
test('expanded reusable APIs are public exports independent of App',()=>{
 for(const name of ['Icon','IconAction','Accordion','Collapse','Toast','DatePicker','DateRangePicker','MonthPicker','TimeInput','DateTimeInput','Table','DataTable','Pagination','List','ListItem','PasswordInput','NumberInput','Stepper','CurrencyInput','PhoneInput','EmailInput','Combobox','Autocomplete','MultiSelect','RadioGroup','CheckboxGroup','Switch','FileInput','AddressField','GNB','LNB','Breadcrumb','Drawer','BottomSheet','Popover']) expect((core as Record<string,unknown>)[name],name).toBeTypeOf('function');
});
test.each([['Foundations','아이콘'],['Molecules','확장 폼 컨트롤'],['Molecules','상태와 펼침'],['Organisms','기간 선택']])('%s contains real extended galleries', (page,name)=>{
 window.location.hash=page;render(<App/>);expect(screen.getByRole('region',{name})).toBeInTheDocument();
});

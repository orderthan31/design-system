import React from 'react';
import './content-primitives.css';

export type GridListProps<T> = {
  items: readonly T[];
  renderItem: (item:T, index:number) => React.ReactNode;
  getKey: (item:T) => React.Key;
  columns?: 1 | 2 | 3 | 4;
  label: string;
  empty?: React.ReactNode;
  className?: string;
};
export function GridList<T>({items,renderItem,getKey,columns=3,label,empty='표시할 항목이 없어요.',className=''}:GridListProps<T>) {
  if(!Number.isInteger(columns)||columns<1||columns>4) throw new RangeError('GridList columns must be 1–4');
  return <div className={`ds-grid-list ${className}`} data-columns={columns} style={{'--ds-grid-list-columns':columns} as React.CSSProperties}>
    {items.length ? <ul aria-label={label}>{items.map((item,index)=><li key={getKey(item)}>{renderItem(item,index)}</li>)}</ul> : <p>{empty}</p>}
  </div>;
}
export type HighlightProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> & {
  text:string;
  query:string;
  caseSensitive?:boolean;
};
export function Highlight({text,query,caseSensitive=false,className='',...props}:HighlightProps) {
  const nodes:React.ReactNode[]=[];
  if(query){
    const expression=new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),caseSensitive?'g':'gi');
    let start=0;
    for(const match of text.matchAll(expression)){
      const index=match.index;
      nodes.push(text.slice(start,index),<mark key={index}>{match[0]}</mark>);
      start=index+match[0].length;
    }
    nodes.push(text.slice(start));
  } else nodes.push(text);
  return <span {...props} className={`ds-highlight ${className}`}>{nodes}</span>;
}
export type BubbleProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?:'neutral'|'info';
  align?:'start'|'end';
};
/** Nonmodal content, not a tooltip/live region/chat service. */
export function Bubble({tone='neutral',align='start',className='',children,...props}:BubbleProps) {
  return <div {...props} className={`ds-bubble ${className}`} data-tone={tone} data-align={align}>{children}</div>;
}

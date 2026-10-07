import React from "react";
import "./grid-list.css";
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
  return <div className={`ds-grid-list ${className}`} data-columns={columns}>
    {items.length ? <ul aria-label={label}>{items.map((item,index)=><li key={getKey(item)}>{renderItem(item,index)}</li>)}</ul> : <p>{empty}</p>}
  </div>;
}

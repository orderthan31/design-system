import { type ReactNode, type Key } from 'react';
import { cn } from '../lib/cn';
const columnClasses={1:'grid-cols-1',2:'grid-cols-1 sm:grid-cols-2',3:'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',4:'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'};
export type GridListProps<T>={items:T[];getKey:(item:T)=>Key;renderItem:(item:T,index:number)=>ReactNode;columns?:1|2|3|4;loading?:boolean;loadingContent?:ReactNode;emptyContent?:ReactNode;label:string;className?:string};
export function GridList<T>({items,getKey,renderItem,columns=2,loading=false,loadingContent='불러오고 있어요.',emptyContent='표시할 항목이 없어요.',label,className}:GridListProps<T>){if(loading)return <div role="status" aria-busy="true">{loadingContent}</div>;if(items.length===0)return <div role="status">{emptyContent}</div>;
 return <ul aria-label={label} className={cn('grid min-w-0 gap-4',columnClasses[columns],className)}>{items.map((item,index)=><li key={getKey(item)} className="min-w-0 rounded-g-panel bg-g-muted p-4">{renderItem(item,index)}</li>)}</ul>;
}

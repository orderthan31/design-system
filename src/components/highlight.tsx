import React from "react";
import "./highlight.css";
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

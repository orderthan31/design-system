import React from "react";
import "./bubble.css";
export type BubbleProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?:'neutral'|'info';
  align?:'start'|'end';
};

export function Bubble({tone='neutral',align='start',className='',children,...props}:BubbleProps) {
  return <div {...props} className={`ds-bubble ${className}`} data-tone={tone} data-align={align}>{children}</div>;
}

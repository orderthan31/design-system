import React from 'react';
import {componentGuides} from './product-guides';

export function UsageGuide({name}:{name:string}) {
 const guide=componentGuides[name];
 if(!guide)return null;
 return <section className="gallery-usage-guide" data-component-docs={name}>
  <h2>사용법</h2>
  <p>{guide.summary} {guide.use}</p>
  <h3>주요 속성</h3><p>{guide.props}</p>
  <h3>사용할 때 알아둘 점</h3>
  <ul>{guide.tips.map(tip=><li key={tip}>{tip}</li>)}</ul>
 </section>;
}

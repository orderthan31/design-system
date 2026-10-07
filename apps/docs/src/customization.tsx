import { Button } from './gyeol/primitives/button';
// Sole consumer appearance exception: explicitly demonstrates the public merge contract.
export function Customization(){return <div className="flex flex-wrap gap-4"><Button data-testid="standard-override" className="px-8 py-3 rounded-none bg-red-600 text-xl text-white">Standard utilities</Button><Button data-testid="semantic-override" className="px-g-control py-g-control rounded-g-panel bg-g-muted text-g-caption text-g-ink">Semantic utilities</Button></div>;}

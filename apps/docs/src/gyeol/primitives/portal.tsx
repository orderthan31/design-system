import { createContext, useContext } from 'react';
// Dialog content provides an in-modal portal destination for Select.
export const PortalContext=createContext<HTMLElement|null>(null);
export function usePortalContainer(){return useContext(PortalContext);}

import React from "react";
export function useValue(
  value: string | undefined,
  defaultValue: string,
  onChange?: (value: string) => void,
) {
  const [local, setLocal] = React.useState(defaultValue);
  const current = value ?? local;
  const [draft, setDraft] = React.useState(current);
  React.useEffect(() => setDraft(current), [current]);
  return {
    draft,
    setDraft,
    commit: (next: string) => {
      setDraft(value ?? next);
      if (value === undefined) setLocal(next);
      onChange?.(next);
    },
  };
}

export function useInputValidity(
  draft: string,
  message: string,
  required: boolean | undefined,
  onValidityChange?: (valid: boolean) => void,
) {
  const root = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    root.current
      ?.querySelector<HTMLInputElement>("input")
      ?.setCustomValidity(message);
  }, [message]);
  const valid = !message && !(required && !draft);
  React.useEffect(() => {
    onValidityChange?.(valid);
  }, [valid, onValidityChange]);
  return root;
}

export function usePickerDismiss(root:React.RefObject<HTMLDivElement|null>,open:boolean,setOpen:React.Dispatch<React.SetStateAction<boolean>>,locked:boolean|undefined) {
 React.useEffect(()=>{if(locked)setOpen(false);},[locked,setOpen]);
 React.useEffect(()=>{
  if(!open)return;
  const outside=(event:Event)=>{if(event.target instanceof Node&&!root.current?.contains(event.target))setOpen(false);};
  document.addEventListener('pointerdown',outside,true);document.addEventListener('focusin',outside);
  return()=>{document.removeEventListener('pointerdown',outside,true);document.removeEventListener('focusin',outside);};
 },[open,root,setOpen]);
}

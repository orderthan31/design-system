// Native visibility/selection logic retained from form-controls.tsx.
import React from "react";
import * as Toggle from "@radix-ui/react-toggle";
import { Eye, EyeOff } from "lucide-react";
import { Field, described, type TextControlProps } from "./field-frame";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
function PasswordIcon({visible}:{visible:boolean}) {const Component=visible?EyeOff:Eye;return <Component size={20} strokeWidth={1.75} aria-hidden="true" focusable="false"/>;}
export type { PasswordInputProps } from "./field-frame";
export function PasswordInput({
  label, hint, error, id: supplied, ...props
}: TextControlProps) {
  const generated = React.useId(), id = supplied ?? generated;
  const [visible, setVisible] = React.useState(false);
  const composing = React.useRef(false);
  const busy = props['aria-busy'] === true || props['aria-busy'] === 'true';
  const restore = React.useRef<{input:HTMLInputElement;start:number|null;end:number|null;direction:"forward"|"backward"|"none"|null;focused:boolean}|null>(null);
  React.useLayoutEffect(()=>{
    const saved=restore.current;restore.current=null;
    if(!saved||!saved.input.isConnected)return;
    if(saved.focused)saved.input.focus({preventScroll:true});
    if(saved.start!==null&&saved.end!==null)saved.input.setSelectionRange(saved.start,saved.end,saved.direction??'none');
  },[visible]);
  return (
    <Field {...props} label={label} id={id} hint={hint} error={error}>
      <InputGroup>
        <InputGroupInput
          {...props} id={id} type={visible ? "text" : "password"}
          aria-invalid={error?true:props["aria-invalid"]} aria-describedby={[props["aria-describedby"],described(id,hint,error)].filter(Boolean).join(" ")||undefined}
          onCompositionStart={event=>{composing.current=true;props.onCompositionStart?.(event);}}
          onCompositionEnd={event=>{composing.current=false;props.onCompositionEnd?.(event);}}
        />
        <InputGroupAddon>
          <Toggle.Root
            data-part="trigger" data-slot="password-trigger" className="ds-input-group-toggle" type="button" pressed={visible}
            disabled={props.disabled} aria-busy={busy||undefined} aria-disabled={busy||props.disabled||undefined} aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
            onPointerDown={event=>{if(event.button===0&&document.activeElement?.id===id)event.preventDefault();}}
            onPressedChange={next=>{
              if(composing.current||busy)return;
              const input=document.getElementById(id);
              if(input instanceof HTMLInputElement)restore.current={input,start:input.selectionStart,end:input.selectionEnd,direction:input.selectionDirection,focused:document.activeElement===input};
              setVisible(next);
            }}
          >
            <PasswordIcon visible={visible}/>
          </Toggle.Root>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

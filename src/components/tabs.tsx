import React,{useId,useRef,useState} from "react";
import "./tabs.css";
export function Tabs({
  items,
  label = "보기 전환",
}: {
  items: { label: string; content: React.ReactNode }[];
  label?: string;
}) {
  const [active, setActive] = useState(0);
  // Removed active content falls back to the existing first-view default.
  if (active !== 0 && active >= items.length) setActive(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="tabs">
      <div role="tablist" aria-label={label}>
        {items.map((item, i) => (
          <button type="button"
            key={item.label}
            ref={(e) => {
              refs.current[i] = e;
            }}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              const n =
                e.key === "ArrowRight"
                  ? (i + 1) % items.length
                  : e.key === "ArrowLeft"
                    ? (i + items.length - 1) % items.length
                    : e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? items.length - 1
                        : -1;
              if (n >= 0) {
                e.preventDefault();
                setActive(n);
                refs.current[n]?.focus();
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={item.label}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={active !== i}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

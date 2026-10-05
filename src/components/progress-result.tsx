import React from "react";
import { Icon, type IconName } from "./icons";
import { Alert } from "./feedback";

export type ResultVariant = "success" | "error" | "empty" | "info";
type ResultBaseProps = {
  heading: React.ReactNode;
  headingLevel?: 2 | 3 | 4;
  children: React.ReactNode;
  /** Independent controls; never wrapped in another interactive element. */
  actions?: React.ReactNode;
};
export type ResultProps = ResultBaseProps & (
  | { variant: "error"; guidance: string }
  | { variant: Exclude<ResultVariant, "error">; guidance?: string }
);

const resultStates: Record<ResultVariant, { label: string; icon: IconName }> = {
  success: { label: "완료", icon: "check" },
  error: { label: "오류", icon: "warning" },
  empty: { label: "결과 없음", icon: "search" },
  info: { label: "안내", icon: "info" },
};

export function Result({ variant, heading, headingLevel = 3, children, actions, guidance }: ResultProps) {
  const headingId = React.useId();
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  const state = resultStates[variant];
  const recovery = guidance?.trim() || (variant === "error" ? "입력 내용을 확인한 뒤 다시 시도해 주세요. 문제가 계속되면 담당자에게 문의해 주세요." : undefined);
  return <section className="ds-result" data-variant={variant} aria-labelledby={headingId}>
    <Heading id={headingId}>{heading}</Heading>
    <Alert title={state.label} tone={variant === "error" ? "error" : variant === "success" ? "success" : "neutral"}>
      <Icon name={state.icon} />
      {recovery && <p>{recovery}</p>}
    </Alert>
    <div className="ds-result-content">{children}</div>
    {actions != null && <div className="ds-result-actions">{actions}</div>}
  </section>;
}

export interface ProgressStepperProps {
  steps: readonly string[];
  /** Zero-based current step. */
  currentStep: number;
  label?: string;
}

export function ProgressStepper({ steps, currentStep, label = "진행 단계" }: ProgressStepperProps) {
  const valid = Number.isInteger(currentStep) && currentStep >= 0 && currentStep < steps.length;
  if (!steps.length) return <p className="ds-progress-step-message">표시할 단계가 없습니다.</p>;
  return <><ol className="ds-progress-stepper" aria-label={label}>
    {steps.map((step, index) => {
      const state = !valid ? "pending" : index < currentStep ? "completed" : index === currentStep ? "current" : "pending";
      return <li key={index} data-state={state} aria-current={state === "current" ? "step" : undefined}>
        <span className="ds-progress-step-marker" aria-hidden="true">{state === "completed" ? <Icon name="check" /> : index + 1}</span>
        <span className="ds-progress-step-label">{step}<span className="ds-progress-step-state">{state === "completed" ? "완료" : state === "current" ? "진행 중" : "대기"}</span></span>
      </li>;
    })}
  </ol>{!valid && <p className="ds-progress-step-message">현재 단계를 확인해 주세요.</p>}</>;
}

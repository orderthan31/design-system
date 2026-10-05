import React from "react";
export function FormTemplate({
  title,
  fields,
  actions,
  aside,
}: {
  title: string;
  fields: React.ReactNode;
  actions: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="template form-template">
      <header>
        <span className="eyebrow">폼 템플릿</span>
        <h3>{title}</h3>
      </header>
      <div className="template-columns">
        <div className="template-fields">
          {fields}
          <div className="template-actions">{actions}</div>
        </div>
        {aside && <aside className="template-aside">{aside}</aside>}
      </div>
    </section>
  );
}
export function ListTemplate({
  title,
  toolbar,
  rows,
  footer,
}: {
  title: string;
  toolbar?: React.ReactNode;
  rows: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="template list-template">
      <header>
        <span className="eyebrow">목록 템플릿</span>
        <h3>{title}</h3>
      </header>
      <div className="template-toolbar">{toolbar}</div>
      <div className="template-rows">{rows}</div>
      {footer && <footer>{footer}</footer>}
    </section>
  );
}
export function FeedbackTemplate({
  title,
  status,
  content,
  actions,
}: {
  title: string;
  status: React.ReactNode;
  content: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="template feedback-template">
      <header>
        <span className="eyebrow">피드백 템플릿</span>
        <h3>{title}</h3>
      </header>
      {status}
      <div className="template-content">{content}</div>
      {actions && <div className="template-actions">{actions}</div>}
    </section>
  );
}

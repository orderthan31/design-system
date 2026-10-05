import React, { useId, useState } from "react";
import { Button, Input } from "./atoms";
import { FormField } from "./molecules";
import { Container, Stack, Grid } from "./layout";
import "./layout.css";
export function ActionGroup({
  children,
  label = "동작",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div role="group" aria-label={label} className="ds-actions">
      {children}
    </div>
  );
}
export function SearchField(
  props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
) {
  return <Input {...props} type="search" />;
}
export function FormSection({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="ds-section">
      <h3 id={id}>{title}</h3>
      <Stack>{children}</Stack>
      {actions && <ActionGroup>{actions}</ActionGroup>}
    </section>
  );
}
export function ListPanel({
  title,
  toolbar,
  children,
}: {
  title: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="ds-section">
      <h3 id={id}>{title}</h3>
      {toolbar}
      <Stack>{children}</Stack>
    </section>
  );
}
export function DetailTemplate({
  title,
  summary,
  content,
  actions,
}: {
  title: string;
  summary: React.ReactNode;
  content: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id}>
      <h3 id={id}>{title}</h3>
      <Grid>
        <aside>{summary}</aside>
        <div>{content}</div>
      </Grid>
      {actions && <ActionGroup>{actions}</ActionGroup>}
    </section>
  );
}
export function CompositionExample() {
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <Container>
      <p className="help">
        템플릿 → Container/Grid → FormSection/ListPanel →
        FormField/SearchField/ActionGroup → Input/Button. 공통 슬롯이며
        제품별 정책을 포함하지 않습니다.
      </p>
      <Grid>
        <FormSection
          title="공통 폼 섹션"
          actions={
            <>
              <Button onClick={() => setSaved(true)}>예시 저장</Button>
              <Button variant="ghost" onClick={() => setSaved(false)}>
                예시 초기화
              </Button>
            </>
          }
        >
          <FormField
            label="표시 이름"
            description="재사용 가능한 범용 레이블입니다."
          />
          {saved && <p role="status">예시를 메모리에만 저장했습니다.</p>}
        </FormSection>
        <ListPanel
          title="공통 목록 패널"
          toolbar={
            <SearchField
              aria-label="항목 검색"
              placeholder="예시 항목 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          }
        >
          {["첫 번째 항목", "두 번째 항목"]
            .filter((v) => v.toLowerCase().includes(query.toLowerCase()))
            .map((v) => (
              <p key={v}>{v}</p>
            ))}
        </ListPanel>
      </Grid>
      <DetailTemplate
        title="범용 상세"
        summary={<p>선택 정보</p>}
        content={
          <FormSection title="상세 내용">
            <FormField label="상세 레이블" />
          </FormSection>
        }
        actions={<Button variant="secondary">목록으로 돌아가기</Button>}
      />
    </Container>
  );
}

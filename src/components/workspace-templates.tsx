import React from "react";
import "./workspace-templates.css";
import { Container, Stack, Grid, Shell } from "./layout";
import { ActionGroup, SearchField } from "./composition";
import { Button } from "./atoms";
import { Icon } from "./icons";
import { ListTemplate } from "./templates";
import { DataTable, List, ListItem, type DataTableProps } from "./data-display";
import {
  GNB,
  LNB,
  Breadcrumb,
  BottomSheet,
  type NavigationProps,
  type NavigationGroup,
  type BreadcrumbItem,
} from "./navigation-regions";

export type WorkspaceTemplatesGalleryProps = { title?: string };
type DemoItem = {
  id: string;
  name: string;
  group: string;
  order: number;
  applied: boolean;
};
const demoRows: DemoItem[] = Array.from({ length: 8 }, (_, index) => ({
  id: `item-${index + 1}`,
  name: `항목 ${String(index + 1).padStart(2, "0")}`,
  group: index % 2 ? "둘째 묶음" : "첫째 묶음",
  order: index + 1,
  applied: false,
}));
const demoKey = (row: DemoItem) => row.id;
const demoColumns = [
  {
    id: "name",
    header: "이름",
    value: (row: DemoItem) => row.name,
    sortable: true,
  },
  { id: "group", header: "묶음", value: (row: DemoItem) => row.group },
  {
    id: "order",
    header: "순서",
    value: (row: DemoItem) => row.order,
    sortable: true,
  },
  {
    id: "applied",
    header: "적용",
    value: (row: DemoItem) => (row.applied ? "적용됨" : "미적용"),
  },
];
const demoDestinations = [
  { id: "all", label: "전체 항목" },
  { id: "applied", label: "적용한 항목" },
];

export function WorkspaceTemplatesGallery({
  title = "작업 공간 템플릿",
}: WorkspaceTemplatesGalleryProps) {
  const [data, setData] = React.useState(demoRows);
  const [desktopView, setDesktopView] = React.useState("all");
  const [localView, setLocalView] = React.useState("all");
  const [mobileView, setMobileView] = React.useState("all");
  const [selectedKeys, setSelectedKeys] = React.useState<React.Key[]>([]);
  const [message, setMessage] = React.useState("");
  const apply = (items: DemoItem[]) => {
    const keys = new Set(items.map(demoKey));
    setData((current) =>
      current.map((row) =>
        keys.has(row.id) ? { ...row, applied: true } : row,
      ),
    );
    setMessage(`${items.length}개 적용됨`);
  };
  const desktopRows = data.filter(
    (row) => (desktopView === "all" && localView === "all") || row.applied,
  );
  const mobileRows = data.filter((row) => mobileView === "all" || row.applied);
  return (
    <section className="wt-gallery" aria-label={title}>
      <div className="wt-title">
        <h2>{title}</h2>
        <Button
          variant="secondary"
          onClick={() => {
            setData(demoRows);
            setDesktopView("all");
            setLocalView("all");
            setMobileView("all");
            setSelectedKeys([]);
            setMessage("예시 초기화됨");
          }}
        >
          예시 초기화
        </Button>
      </div>
      <DesktopWorkspaceTemplate
        title="PC 작업 공간"
        navigation={{
          items: [
            { id: "all", label: "전체 보기" },
            { id: "applied", label: "적용 보기" },
          ],
          selectedId: desktopView,
          onSelect: setDesktopView,
        }}
        localNavigation={{
          groups: [{ id: "items", label: "항목", items: demoDestinations }],
          selectedId: localView,
          onSelect: setLocalView,
        }}
        breadcrumbs={[
          { label: "작업 공간" },
          { label: desktopView === "all" ? "전체 보기" : "적용 보기" },
        ]}
        table={{
          caption: "항목 데이터",
          rows: desktopRows,
          columns: demoColumns,
          rowKey: demoKey,
          initialPageSize: 3,
          filter: {
            label: "묶음 필터",
            value: (row) => row.group,
            options: ["첫째 묶음", "둘째 묶음"],
          },
          bulkAction: { label: "선택 적용", onAction: apply },
        }}
        aside={
          <Stack>
            <h3>요약</h3>
            <p>전체 {data.length}개</p>
            <p>적용 {data.filter((row) => row.applied).length}개</p>
          </Stack>
        }
      />
      <MobileWorkspaceTemplate
        title="모바일 작업 공간"
        navigation={{
          items: demoDestinations,
          selectedId: mobileView,
          onSelect: setMobileView,
        }}
        rows={mobileRows}
        rowKey={demoKey}
        itemTitle={(row) => row.name}
        itemDescription={(row) =>
          `${row.group} · ${row.applied ? "적용됨" : "미적용"}`
        }
        searchText={(row) => `${row.name} ${row.group}`}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        selectedAction={{ label: "선택 적용", onAction: apply }}
        renderDetail={(row) => (
          <Stack>
            <p>{row.group}</p>
            <p>순서 {row.order}</p>
            <p>{row.applied ? "적용됨" : "미적용"}</p>
          </Stack>
        )}
        onApply={(row) => apply([row])}
        footer={<p>총 {mobileRows.length}개</p>}
      />
      <p role="status">{message}</p>
    </section>
  );
}

export type MobileWorkspaceTemplateProps<T> = {
  title: string;
  navigation: NavigationProps;
  rows: readonly T[];
  rowKey: (row: T) => React.Key;
  itemTitle: (row: T) => string;
  itemDescription?: (row: T) => React.ReactNode;
  searchText?: (row: T) => string;
  selectedKeys: readonly React.Key[];
  onSelectionChange: (keys: React.Key[]) => void;
  selectedAction: { label: string; onAction: (rows: T[]) => void };
  renderDetail: (row: T) => React.ReactNode;
  onApply: (row: T) => void;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
};

export function MobileWorkspaceTemplate<T>({
  title,
  navigation,
  rows,
  rowKey,
  itemTitle,
  itemDescription,
  searchText = itemTitle,
  selectedKeys,
  onSelectionChange,
  selectedAction,
  renderDetail,
  onApply,
  headerActions,
  footer,
}: MobileWorkspaceTemplateProps<T>) {
  const [query, setQuery] = React.useState("");
  const [detailKey, setDetailKey] = React.useState<React.Key | null>(null);
  const detail = rows.find((row) => rowKey(row) === detailKey);
  const selectedRows = rows.filter((row) => selectedKeys.includes(rowKey(row)));
  const visible = rows.filter((row) =>
    searchText(row)
      .toLocaleLowerCase("ko")
      .includes(query.trim().toLocaleLowerCase("ko")),
  );
  return (
    <section className="wt-workspace wt-mobile" aria-label={title}>
      <Container>
        <Stack>
          <header className="wt-heading">
            <div className="wt-title">
              <h2>{title}</h2>
              {headerActions && (
                <ActionGroup label="화면 작업">{headerActions}</ActionGroup>
              )}
            </div>
          </header>
          <GNB {...navigation} />
          <ListTemplate
            title="항목 목록"
            toolbar={
              <Stack>
                <label className="wt-search">
                  <span>
                    <Icon name="search" /> 항목 검색
                  </span>
                  <SearchField
                    aria-label="항목 검색"
                    placeholder="이름 검색"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
                <ActionGroup label="선택 작업">
                  <span role="status">{selectedRows.length}개 선택됨</span>
                  <Button
                    variant="secondary"
                    disabled={!selectedRows.length}
                    onClick={() => {
                      selectedAction.onAction(selectedRows);
                      onSelectionChange([]);
                    }}
                  >
                    {selectedAction.label}
                  </Button>
                </ActionGroup>
              </Stack>
            }
            rows={
              <>
                {!visible.length && (
                  <p role="status">
                    {query
                      ? "검색 결과가 없습니다."
                      : "표시할 항목이 없습니다."}
                  </p>
                )}
                <List label="항목 목록">
                  {visible.map((row) => (
                    <ListItem
                      key={rowKey(row)}
                      title={itemTitle(row)}
                      description={itemDescription?.(row)}
                      thumbnail={<Icon name="file" />}
                      selected={selectedKeys.includes(rowKey(row))}
                      onSelectionChange={(selected) =>
                        onSelectionChange(
                          selected
                            ? [
                                ...selectedKeys.filter(
                                  (key) => key !== rowKey(row),
                                ),
                                rowKey(row),
                              ]
                            : selectedKeys.filter((key) => key !== rowKey(row)),
                        )
                      }
                      action={{
                        label: `${itemTitle(row)} 상세`,
                        onClick: () => setDetailKey(rowKey(row)),
                      }}
                    />
                  ))}
                </List>
              </>
            }
            footer={footer}
          />
        </Stack>
      </Container>
      <BottomSheet
        open={detail !== undefined}
        title={detail ? itemTitle(detail) : "항목 상세"}
        onClose={() => setDetailKey(null)}
        footer={
          detail && (
            <ActionGroup label="상세 작업">
              <Button variant="secondary" onClick={() => setDetailKey(null)}>
                취소
              </Button>
              <Button
                onClick={() => {
                  onApply(detail);
                  setDetailKey(null);
                }}
              >
                <Icon name="check" /> 적용
              </Button>
            </ActionGroup>
          )
        }
      >
        {detail && renderDetail(detail)}
      </BottomSheet>
    </section>
  );
}

export type DesktopWorkspaceTemplateProps<T> = {
  title: string;
  navigation: NavigationProps;
  localNavigation: Omit<NavigationProps, "items"> & {
    groups: NavigationGroup[];
  };
  breadcrumbs?: BreadcrumbItem[];
  table: DataTableProps<T>;
  headerActions?: React.ReactNode;
  aside?: React.ReactNode;
  footer?: React.ReactNode;
};

export function DesktopWorkspaceTemplate<T>({
  title,
  navigation,
  localNavigation,
  breadcrumbs,
  table,
  headerActions,
  aside,
  footer,
}: DesktopWorkspaceTemplateProps<T>) {
  return (
    <section className="wt-workspace wt-desktop" aria-label={title}>
      <Container>
        <GNB {...navigation} />
        <Shell
          mainAs="div"
          navigation={<LNB {...localNavigation} />}
          header={
            <Stack className="wt-heading">
              {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
              <div className="wt-title">
                <h2>{title}</h2>
                {headerActions && (
                  <ActionGroup label="화면 작업">{headerActions}</ActionGroup>
                )}
              </div>
            </Stack>
          }
        >
          <Grid className={aside ? "wt-content wt-with-aside" : "wt-content"}>
            <ListTemplate
              title={table.caption}
              rows={<DataTable {...table} />}
              footer={footer}
            />
            {aside && <aside className="wt-aside">{aside}</aside>}
          </Grid>
        </Shell>
      </Container>
    </section>
  );
}

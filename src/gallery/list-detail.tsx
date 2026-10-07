import {GalleryDocs} from './workbench';
import {CodeBlock} from './code-block';
import './playground.css';
import React from "react";
import { Button, Input } from "../components/atoms";
import { List } from "../components/data-display";
import { Icon } from "../components/icons";
import { Stack } from "../components/layout";
import { Select } from "../components/primitives";
import { ListRow, ListHeader, ListFooter } from "../components/list-row";

const initialItems = [
  {
    id: "screen",
    title: "화면 검토",
    description:
      "작은 화면에서도 긴 한국어 설명이 잘리지 않고 자연스럽게 여러 줄로 이어지는지 확인합니다. 선택과 개별 동작은 서로 독립적입니다.",
    selected: true,
    disabled: false,
    category: "검토",
  },
  {
    id: "document",
    title: "문서 정리",
    description: "조합 예시를 정리합니다.",
    selected: false,
    disabled: false,
    category: "문서",
  },
  {
    id: "locked",
    title: "잠긴 항목",
    description: "선택과 동작을 사용할 수 없습니다.",
    selected: false,
    disabled: true,
    category: "검토",
  },
  {
    id: "notice",
    title: "안내",
    description: "오른쪽에는 메타데이터도 넣을 수 있습니다.",
    selected: false,
    disabled: false,
    category: "문서",
  },
];

export function ListDetail() {
  const [items, setItems] = React.useState(
    initialItems.map((item) => ({ ...item, completed: false })),
  );
  const [status, setStatus] = React.useState("항목을 선택해 주세요.");
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("전체");
  const visibleItems = items.filter(
    (item) =>
      (category === "전체" || item.category === category) &&
      `${item.title} ${item.description}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  const selectedCount = items.filter(
    (item) => item.selected && !item.disabled,
  ).length;
  return (
    <section className="ds-list-detail" aria-label="목록 행 상세">
      <Stack>
        <ListHeader title="검토 목록" description="메모리 데모">
          <div className="ds-list-detail-tools">
            <label>
              항목 검색
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <label>
              분류
              <Select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>전체</option>
                <option>검토</option>
                <option>문서</option>
              </Select>
            </label>
          </div>
        </ListHeader>
        <List label="검토 항목">
          {visibleItems.map((item) => (
            <ListRow
              key={item.id}
              title={item.title}
              description={item.description}
              leading={
                <Icon name={item.id === "document" ? "file" : "check"} />
              }
              selected={item.selected}
              disabled={item.disabled}
              onSelectionChange={(selected) =>
                setItems((current) =>
                  current.map((row) =>
                    row.id === item.id && !row.disabled
                      ? { ...row, selected }
                      : row,
                  ),
                )
              }
              trailing={
                <>
                  <span>
                    {item.completed
                      ? "완료"
                      : item.id === "screen"
                        ? "오늘"
                        : item.category}
                  </span>
                  {item.id === "notice" && (
                    <Button
                      variant="quiet"
                      size="small"
                      disabled={item.disabled}
                      onClick={() => {
                        if (!item.disabled) setStatus("안내를 확인했습니다.");
                      }}
                    >
                      안내 확인
                    </Button>
                  )}
                </>
              }
              action={
                item.id === "notice"
                  ? undefined
                  : {
                      label: `${item.title} 열기`,
                      onClick: () =>
                        setStatus(`${item.title} 항목을 열었습니다.`),
                    }
              }
              content={
                item.id === "document" ? (
                  <span className="help">초안</span>
                ) : undefined
              }
            />
          ))}
        </List>
        {visibleItems.length === 0 && <p>검색 결과 없음</p>}
        <ListFooter
          actions={
            <Button
              disabled={selectedCount === 0}
              onClick={() => {
                if (!selectedCount) return;
                setItems((current) =>
                  current.map((item) =>
                    item.selected && !item.disabled
                      ? { ...item, completed: true, selected: false }
                      : item,
                  ),
                );
                setStatus(`${selectedCount}개 항목을 완료했습니다.`);
              }}
            >
              선택 완료
            </Button>
          }
        >
          <span>{selectedCount}개 선택</span>
        </ListFooter>
        <p role="status">{status}</p>
        <GalleryDocs>
          <summary>가져오기</summary>
          <CodeBlock source={'import { List, ListRow, ListHeader, ListFooter } from "./src/index";\nimport "./src/core.css";'}/>

        </GalleryDocs>
        <GalleryDocs>
          <summary>속성</summary>
          <p>ListRow에는 필수 title과 description·leading·content·trailing을 넣습니다. selected/onSelectionChange로 선택을 관리하고 disabled로 선택과 action을 제한합니다. action에는 label과 onClick을 지정합니다.</p>
          <p>ListHeader에는 title과 description·children·actions를 넣습니다. ListFooter에는 children과 actions를 넣습니다. 슬롯에는 ReactNode를 사용할 수 있습니다.</p>
        </GalleryDocs>
        <GalleryDocs>
          <summary>타입</summary>
          <p>ListRowProps·ListHeaderProps·ListFooterProps를 사용해 속성 객체의 타입을 지정할 수 있습니다.</p>
          <CodeBlock source={"onSelectionChange?: (selected: boolean) => void;\naction?: { label: string; onClick: () => void };"}/>
        </GalleryDocs>
        <GalleryDocs>
          <summary>기본값</summary>
          <p>ListRow의 selected와 disabled 기본값은 false입니다. onSelectionChange를 지정하면 선택 체크박스를 표시합니다.</p>
        </GalleryDocs>
        <GalleryDocs>
          <summary>조합</summary>
          <p>ListHeader, List, ListFooter 순서로 배치하고 List 안에 ListRow를 넣습니다. leading은 아이콘, content는 추가 내용, trailing은 메타데이터나 독립 버튼에 사용합니다.</p>
          <p>단순한 제목·설명·이미지 목록에는 ListItem을, 앞뒤 슬롯과 비활성 선택이 필요한 항목에는 ListRow를 사용하세요.</p>
          <CodeBlock source={'<ListRow title="항목" leading={<Icon name="file" />}\n  trailing={<span>초안</span>}\n  selected={selected} onSelectionChange={setSelected}\n  action={{ label: "열기", onClick: open }} />'}/>
        </GalleryDocs>
        <GalleryDocs>
          <summary>접근성</summary>
          <p>List의 ul 안에 ListRow를 배치합니다. 체크박스와 버튼을 키보드로 조작할 수 있습니다. 장식 아이콘의 의미는 텍스트로 전달하고 독립 버튼에는 이름을 지정하세요.</p>
          <p>selected를 관리할 때 onSelectionChange에서 값을 갱신하세요. 슬롯에 넣은 버튼에도 이름과 disabled를 지정하세요. 버튼 안에 버튼을 중첩하지 마세요.</p>
          <p>긴 설명은 줄바꿈하고 좁은 화면에서는 오른쪽 동작을 다음 줄로 배치합니다.</p>
        </GalleryDocs>
      </Stack>
    </section>
  );
}

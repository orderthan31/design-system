export type NavigationItem = { id: string; label: string; disabled?: boolean };

export type NavigationProps = {
  items: NavigationItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  label?: string;
};

export type NavigationGroup = {
  id: string;
  label: string;
  items: NavigationItem[];
};

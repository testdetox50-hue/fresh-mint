import { useCallback, useMemo, useReducer } from "react";
export type CartStatus = "draft" | "active" | "archived";

export interface CartItem {
  id: number;
  title: string;
  status: CartStatus;
  score: number;
}
export interface CartCardProps {
  heading?: string;
  initialItems?: CartItem[];
  onSelect?: (item: CartItem) => void;
}
type Action =
  | { type: "add"; item: CartItem }
  | { type: "remove"; id: number }
  | { type: "cycle"; id: number }
  | { type: "filter"; status: CartStatus | "all" };
interface State {
  items: CartItem[];
  filter: CartStatus | "all";
  nextId: number;
}
const ORDER: CartStatus[] = ["draft", "active", "archived"];
const LIMIT = 6;

function nextStatus(current: CartStatus): CartStatus {
  const index = ORDER.indexOf(current);
  return ORDER[(index + 1) % ORDER.length];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add":
      if (state.items.length >= LIMIT) return state;
      return { ...state, items: [...state.items, action.item], nextId: state.nextId + 1 };
    case "remove":
      return { ...state, items: state.items.filter((it) => it.id !== action.id) };
    case "cycle":
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.id ? { ...it, status: nextStatus(it.status) } : it,
        ),
      };
    case "filter":
      return { ...state, filter: action.status };
  }
}

export function CartCard({ heading = "Cart Card", initialItems = [], onSelect }: CartCardProps) {
  const [state, dispatch] = useReducer(reducer, {
    items: initialItems,
    filter: "all",
    nextId: initialItems.length + 1,
  });


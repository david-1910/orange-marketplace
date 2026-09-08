import { useCallback, useMemo, useState } from 'react';

export interface CartSelection {
  selectedIds: string[];
  setSelected: (productId: string, isSelected: boolean) => void;
  toggleAll: (isSelected: boolean) => void;
}

interface SelectionState {
  /** Состав корзины, под который посчитаны исключения. */
  signature: string;
  /** Позиции со снятой галочкой. */
  excludedIds: string[];
}

/**
 * Какие позиции корзины отмечены галочками.
 *
 * Состояние страничное и эфемерное: после перезагрузки выбор никому
 * не нужен, поэтому в zustand с persist он не едет. Живёт в model
 * страницы, а не в ui, чтобы разметка не тащила логику.
 *
 * Храним исключения, а не выбранные: по умолчанию отмечено всё, и
 * товар, добавленный в корзину уже после открытия страницы, сразу
 * приходит с галочкой — синхронизировать список руками не нужно.
 *
 * Состав корзины меняется снаружи (крестик в строке, степпер на нуле),
 * поэтому исключения нужно подчищать от исчезнувших позиций — иначе
 * повторно добавленный товар пришёл бы без галочки. Делается это
 * корректировкой состояния прямо во время рендера, а не в useEffect:
 * эффект здесь дал бы лишний проход рендера, и правило
 * react-hooks/set-state-in-effect справедливо на него ругается.
 */
export const useCartSelection = (productIds: string[]): CartSelection => {
  const signature = productIds.join('|');

  const [state, setState] = useState<SelectionState>({
    signature,
    excludedIds: [],
  });

  if (state.signature !== signature) {
    setState({
      signature,
      excludedIds: state.excludedIds.filter((id) => productIds.includes(id)),
    });
  }

  const selectedIds = useMemo(
    () => productIds.filter((id) => !state.excludedIds.includes(id)),
    [productIds, state.excludedIds],
  );

  const setSelected = useCallback((productId: string, isSelected: boolean) => {
    setState((current) => ({
      ...current,
      excludedIds: isSelected
        ? current.excludedIds.filter((id) => id !== productId)
        : current.excludedIds.includes(productId)
          ? current.excludedIds
          : [...current.excludedIds, productId],
    }));
  }, []);

  const toggleAll = useCallback(
    (isSelected: boolean) =>
      setState((current) => ({
        ...current,
        excludedIds: isSelected ? [] : productIds,
      })),
    [productIds],
  );

  return { selectedIds, setSelected, toggleAll };
};

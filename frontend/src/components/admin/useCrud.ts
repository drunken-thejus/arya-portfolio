"use client";

import { useCallback, useEffect, useState } from "react";

interface CrudApi<T> {
  list: () => Promise<T[]>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: number, data: Partial<T>) => Promise<T>;
  remove: (id: number) => Promise<unknown>;
}

/** Generic list + create/update/delete state machine for admin collections. */
export function useCrud<T extends { id: number }>(crud: CrudApi<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    crud
      .list()
      .then(setItems)
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    async (data: Partial<T>, id?: number) => {
      if (id) await crud.update(id, data);
      else await crud.create(data);
      refresh();
    },
    [crud, refresh]
  );

  const remove = useCallback(
    async (id: number) => {
      await crud.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    [crud]
  );

  return { items, loading, error, refresh, save, remove };
}

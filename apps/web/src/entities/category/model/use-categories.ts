'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CategoryDto } from '@expense-tracker/shared';

import { categoryApi } from '../api/category-api';

export function useCategories(token: string | null) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    categoryApi
      .list(token)
      .then((list) => {
        if (!cancelled) setCategories(list);
      })
      .catch(() => {
        // Названия категорий — вспомогательные данные: при ошибке список остаётся пустым.
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const byId = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  return { categories, byId };
}

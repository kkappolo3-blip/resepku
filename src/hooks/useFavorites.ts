import { useEffect, useState, useCallback } from "react";
import type { Recipe } from "@/components/RecipeCard";

const FAV_KEY = "resepku.favorites.v1";

const recipeId = (r: Recipe) => r.title.trim().toLowerCase();

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const persist = (list: Recipe[]) => {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch { /* ignore */ }
  };

  const isFavorite = useCallback(
    (r: Recipe) => favorites.some(f => recipeId(f) === recipeId(r)),
    [favorites]
  );

  const toggleFavorite = useCallback((r: Recipe) => {
    setFavorites(prev => {
      const exists = prev.some(f => recipeId(f) === recipeId(r));
      const next = exists ? prev.filter(f => recipeId(f) !== recipeId(r)) : [r, ...prev];
      persist(next);
      return next;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    try { localStorage.removeItem(FAV_KEY); } catch { /* ignore */ }
  }, []);

  return { favorites, isFavorite, toggleFavorite, clearFavorites };
};

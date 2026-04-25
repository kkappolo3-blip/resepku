import { useState, useEffect, KeyboardEvent } from "react";
import { Sparkles, Plus, ChefHat, Loader2, UtensilsCrossed, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IngredientChip } from "@/components/IngredientChip";
import { RecipeCard, type Recipe } from "@/components/RecipeCard";
import { useFavorites } from "@/hooks/useFavorites";

const SUGGESTED = ["Telur", "Ayam", "Bawang merah", "Bawang putih", "Cabai", "Tomat", "Tahu", "Tempe", "Nasi", "Mie instan", "Kecap manis", "Santan"];
const HISTORY_KEY = "resepku.ingredient.history.v1";
const MAX_HISTORY = 24;

const Index = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const { favorites, isFavorite, toggleFavorite, clearFavorites } = useFavorites();

  const handleToggleFavorite = (r: Recipe) => {
    const wasFav = isFavorite(r);
    toggleFavorite(r);
    toast.success(wasFav ? "Dihapus dari favorit" : "Disimpan ke favorit ❤️");
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const pushHistory = (item: string) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.toLowerCase() !== item.toLowerCase());
      const next = [item, ...filtered].slice(0, MAX_HISTORY);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const addIngredient = (raw: string) => {
    const v = raw.trim();
    if (!v) return;
    if (ingredients.some(i => i.toLowerCase() === v.toLowerCase())) {
      toast.info(`"${v}" sudah ditambahkan`);
      return;
    }
    setIngredients(prev => [...prev, v]);
    pushHistory(v);
    setInput("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient(input);
    } else if (e.key === "Backspace" && !input && ingredients.length) {
      setIngredients(prev => prev.slice(0, -1));
    }
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      toast.error("Tambahkan minimal 1 bahan dulu ya");
      return;
    }
    setLoading(true);
    setRecipes([]);
    try {
      const { data, error } = await supabase.functions.invoke("generate-recipes", {
        body: { ingredients },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const list: Recipe[] = (data?.recipes ?? []).sort((a: Recipe, b: Recipe) => b.matchPercent - a.matchPercent);
      setRecipes(list);
      if (list.length === 0) toast.info("Tidak ada resep ditemukan, coba tambah bahan lain.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Terjadi kesalahan";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-warm">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-[0.07]" aria-hidden />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" aria-hidden />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} aria-hidden />

        <div className="container relative mx-auto px-4 pt-10 pb-8 max-w-3xl">
          <div className="flex items-center gap-2 text-primary">
            <UtensilsCrossed className="h-5 w-5" />
            <span className="font-display text-lg font-bold tracking-tight">Resepku</span>
          </div>

          <h1 className="mt-8 font-display text-4xl sm:text-5xl font-bold leading-[1.05] text-foreground">
            Punya bahan apa <span className="text-primary">di dapur?</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl">
            Ketik bahan yang kamu punya. AI akan memberi ide masakan yang bisa kamu buat sekarang juga — lengkap dengan langkahnya.
          </p>
        </div>
      </section>

      {/* Input card */}
      <section className="container mx-auto px-4 max-w-3xl">
        <div className="rounded-3xl bg-card p-5 sm:p-6 shadow-warm border border-border/50">
          <label className="text-sm font-semibold text-foreground">Bahan yang kamu punya</label>

          <div className="mt-3 flex gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-2xl border border-input bg-background px-4 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-smooth">
              <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="contoh: telur, ayam, bawang…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
              />
            </div>
            <button
              onClick={() => addIngredient(input)}
              className="rounded-2xl bg-foreground px-4 text-sm font-semibold text-background transition-smooth hover:bg-foreground/85"
            >
              Tambah
            </button>
          </div>

          {ingredients.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {ingredients.map((b, i) => (
                <IngredientChip key={`${b}-${i}`} label={b} onRemove={() => setIngredients(prev => prev.filter((_, idx) => idx !== i))} />
              ))}
            </div>
          )}

          {ingredients.length === 0 && (() => {
            const lowerHistory = history.map(h => h.toLowerCase());
            const merged = [
              ...history,
              ...SUGGESTED.filter(s => !lowerHistory.includes(s.toLowerCase())),
            ];
            return (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Saran cepat{history.length > 0 ? " (riwayat kamu di depan)" : ""}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {merged.map((s, i) => {
                    const isHistory = i < history.length;
                    return (
                      <button
                        key={`${s}-${i}`}
                        onClick={() => addIngredient(s)}
                        className={
                          isHistory
                            ? "rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary font-medium transition-smooth hover:bg-primary hover:text-primary-foreground"
                            : "rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/80 transition-smooth hover:bg-primary hover:text-primary-foreground hover:border-primary"
                        }
                      >
                        + {s}
                      </button>
                    );
                  })}
                </div>
                {history.length > 0 && (
                  <button
                    onClick={() => {
                      setHistory([]);
                      try { localStorage.removeItem(HISTORY_KEY); } catch { /* ignore */ }
                    }}
                    className="mt-2 text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2"
                  >
                    Hapus riwayat
                  </button>
                )}
              </div>
            );
          })()}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-hero px-5 py-3.5 font-semibold text-primary-foreground shadow-warm transition-smooth hover:shadow-glow hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Mencari resep…
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" /> Cari resep yang bisa dibuat
              </>
            )}
          </button>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 max-w-3xl py-10">
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-muted/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/60 to-transparent bg-[length:200%_100%] animate-shimmer" />
              </div>
            ))}
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <>
            <div className="mb-5 flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold">Saran resep ({recipes.length})</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {recipes.map((r, i) => (
                <RecipeCard
                  key={i}
                  recipe={r}
                  index={i}
                  isFavorite={isFavorite(r)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </>
        )}

        {favorites.length > 0 && (
          <div className="mt-12">
            <div className="mb-5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary fill-current" />
                <h2 className="font-display text-2xl font-bold">Resep favorit ({favorites.length})</h2>
              </div>
              <button
                onClick={() => {
                  clearFavorites();
                  toast.success("Semua favorit dihapus");
                }}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                Hapus semua
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {favorites.map((r, i) => (
                <RecipeCard
                  key={`fav-${i}`}
                  recipe={r}
                  index={i}
                  isFavorite
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && recipes.length === 0 && ingredients.length === 0 && favorites.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <span className="text-6xl block mb-4 animate-float">🍳</span>
            <p className="text-sm">Mulai dengan menambahkan bahan di atas</p>
          </div>
        )}
      </section>

      <footer className="container mx-auto px-4 max-w-3xl pb-10 text-center text-xs text-muted-foreground">
        Dibuat dengan ❤️ oleh <span className="font-semibold text-foreground">Gibikey Studio</span> — bumbu dapur dasar (garam, gula, minyak, bawang) dianggap selalu tersedia.
      </footer>
    </main>
  );
};

export default Index;

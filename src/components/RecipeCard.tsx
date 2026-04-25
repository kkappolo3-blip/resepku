import { useState } from "react";
import { Clock, Users, ChefHat, ChevronDown, Check, ShoppingBasket, Share2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface Recipe {
  title: string;
  emoji: string;
  description: string;
  cookTime: string;
  difficulty: string;
  servings: string;
  matchPercent: number;
  usedIngredients: string[];
  missingIngredients: string[];
  steps: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: (recipe: Recipe) => void;
}

export const RecipeCard = ({ recipe, index, isFavorite, onToggleFavorite }: RecipeCardProps) => {
  const [open, setOpen] = useState(false);

  const matchColor =
    recipe.matchPercent >= 90 ? "bg-secondary text-secondary-foreground"
      : recipe.matchPercent >= 70 ? "bg-accent/20 text-accent-foreground"
      : "bg-muted text-muted-foreground";

  const buildShareText = () => {
    const lines = [
      `${recipe.emoji} *${recipe.title}*`,
      "",
      recipe.description,
      "",
      `⏱️ ${recipe.cookTime}  •  👨‍🍳 ${recipe.difficulty}  •  🍽️ ${recipe.servings}`,
      "",
      "*Bahan:*",
      ...recipe.usedIngredients.map(b => `• ${b}`),
    ];
    if (recipe.missingIngredients.length > 0) {
      lines.push("", "*Perlu beli:*", ...recipe.missingIngredients.map(b => `• ${b}`));
    }
    lines.push("", "*Langkah:*", ...recipe.steps.map((s, i) => `${i + 1}. ${s}`));
    lines.push("", "_Dibagikan dari Resepku — by Gibikey Studio_");
    return lines.join("\n");
  };

  const shareToWhatsApp = async () => {
    const text = buildShareText();
    // Try native Web Share API first (best on mobile, avoids iframe blocks)
    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.title, text });
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
      }
    }
    // Fallback: open wa.me in top-level window (escapes iframe)
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    try {
      const w = window.open("", "_blank", "noopener,noreferrer");
      if (w) {
        w.opener = null;
        w.location.href = url;
        return;
      }
    } catch { /* ignore */ }
    // Final fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Resep disalin! Tempel di WhatsApp ya.");
    } catch {
      toast.error("Gagal membuka WhatsApp. Coba buka di tab baru.");
    }
  };

  return (
    <article
      className="group overflow-hidden rounded-2xl bg-gradient-card shadow-soft transition-smooth hover:shadow-warm hover:-translate-y-1 active:scale-[0.99] animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="text-3xl sm:text-4xl leading-none transition-smooth group-hover:scale-110 group-hover:rotate-6 inline-block shrink-0">
              {recipe.emoji}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-base sm:text-xl font-bold text-foreground leading-tight break-words">{recipe.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-0.5">{recipe.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] sm:text-xs font-bold", matchColor)}>
              {recipe.matchPercent}%
            </span>
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(recipe)}
                aria-label={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
                aria-pressed={isFavorite}
                className={cn(
                  "rounded-full p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center transition-smooth active:scale-95",
                  isFavorite
                    ? "bg-primary/15 text-primary hover:bg-primary/25"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {recipe.cookTime}</span>
          <span className="inline-flex items-center gap-1"><ChefHat className="h-3.5 w-3.5" /> {recipe.difficulty}</span>
          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {recipe.servings}</span>
        </div>

        {recipe.missingIngredients.length > 0 && (
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-1.5 text-xs">
            <ShoppingBasket className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground">Perlu beli:</span>
            <span className="text-muted-foreground">{recipe.missingIngredients.join(", ")}</span>
          </div>
        )}

        <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() => setOpen(o => !o)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-3 min-h-[44px] text-sm font-semibold text-primary transition-smooth hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
          >
            {open ? "Sembunyikan resep" : "Lihat resep lengkap"}
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </button>
          <button
            onClick={shareToWhatsApp}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-3 min-h-[44px] text-sm font-semibold text-white transition-smooth hover:opacity-90 active:scale-[0.98]"
            aria-label="Bagikan resep ke WhatsApp"
          >
            <Share2 className="h-4 w-4" />
            Bagikan ke WhatsApp
          </button>
        </div>

        {open && (
          <div className="mt-5 space-y-4 animate-fade-in-up">
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">Bahan yang dipakai</h4>
              <ul className="grid grid-cols-2 gap-1.5 text-sm text-muted-foreground">
                {recipe.usedIngredients.map((b, i) => (
                  <li key={i} className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">Langkah memasak</h4>
              <ol className="space-y-2.5">
                {recipe.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-foreground/90">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

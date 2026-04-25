import { useState } from "react";
import { Clock, Users, ChefHat, ChevronDown, Check, ShoppingBasket, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

export const RecipeCard = ({ recipe, index }: { recipe: Recipe; index: number }) => {
  const [open, setOpen] = useState(false);

  const matchColor =
    recipe.matchPercent >= 90 ? "bg-secondary text-secondary-foreground"
      : recipe.matchPercent >= 70 ? "bg-accent/20 text-accent-foreground"
      : "bg-muted text-muted-foreground";

  const shareToWhatsApp = () => {
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
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className="group overflow-hidden rounded-2xl bg-gradient-card shadow-soft transition-smooth hover:shadow-warm hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl leading-none transition-smooth group-hover:scale-110 group-hover:rotate-6 inline-block">
              {recipe.emoji}
            </span>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">{recipe.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{recipe.description}</p>
            </div>
          </div>
          <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-bold", matchColor)}>
            {recipe.matchPercent}%
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {recipe.cookTime}</span>
          <span className="inline-flex items-center gap-1"><ChefHat className="h-3.5 w-3.5" /> {recipe.difficulty}</span>
          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {recipe.servings}</span>
        </div>

        {recipe.missingIngredients.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
            <ShoppingBasket className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-foreground">Perlu beli:</span>
            <span className="text-muted-foreground">{recipe.missingIngredients.join(", ")}</span>
          </div>
        )}

        <button
          onClick={() => setOpen(o => !o)}
          className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2.5 text-sm font-semibold text-primary transition-smooth hover:bg-primary hover:text-primary-foreground"
        >
          {open ? "Sembunyikan resep" : "Lihat resep lengkap"}
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>

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

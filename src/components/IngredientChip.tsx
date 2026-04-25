import { X } from "lucide-react";

interface Props {
  label: string;
  onRemove: () => void;
}

export const IngredientChip = ({ label, onRemove }: Props) => (
  <span className="group inline-flex items-center gap-1 rounded-full bg-secondary pl-3.5 pr-1.5 py-1.5 text-sm font-medium text-secondary-foreground shadow-soft transition-smooth hover:shadow-warm animate-fade-in-up">
    {label}
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Hapus ${label}`}
      className="rounded-full p-1.5 min-h-[28px] min-w-[28px] flex items-center justify-center text-secondary-foreground/60 transition-smooth hover:bg-primary hover:text-primary-foreground active:scale-90"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  </span>
);

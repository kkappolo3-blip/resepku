import { X } from "lucide-react";

interface Props {
  label: string;
  onRemove: () => void;
}

export const IngredientChip = ({ label, onRemove }: Props) => (
  <span className="group inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium text-secondary-foreground shadow-soft transition-smooth hover:shadow-warm animate-fade-in-up">
    {label}
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Hapus ${label}`}
      className="rounded-full p-0.5 text-secondary-foreground/60 transition-smooth hover:bg-primary hover:text-primary-foreground"
    >
      <X className="h-3 w-3" />
    </button>
  </span>
);

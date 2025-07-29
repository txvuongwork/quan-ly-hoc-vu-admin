import { Label, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import {
  type FieldError,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";

interface TextAreaFieldProps<TFormData extends FieldValues> {
  label: string;
  name: Path<TFormData>;
  placeholder?: string;
  register: UseFormRegister<TFormData>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
}

export const TextAreaField = <TFormData extends FieldValues>({
  label,
  name,
  placeholder,
  register,
  error,
  required = true,
  disabled = false,
  className = "",
  description,
  rows = 4,
  cols,
  maxLength,
  resize = "vertical",
}: TextAreaFieldProps<TFormData>) => {
  const resizeClass = {
    none: "resize-none",
    both: "resize",
    horizontal: "resize-x",
    vertical: "resize-y",
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {description && <p className="text-xs text-gray-500">{description}</p>}

      <div className="relative">
        <Textarea
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          cols={cols}
          maxLength={maxLength}
          className={cn(
            "transition-all duration-200",
            resizeClass[resize],
            disabled ? "opacity-50 cursor-not-allowed" : ""
          )}
          {...register(name)}
        />
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-sm">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <span className="text-red-600">{error.message}</span>
        </div>
      )}
    </div>
  );
};

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import {
  type FieldError,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";

interface FormFieldProps<TFormData extends FieldValues> {
  label: string;
  name: Path<TFormData>;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  register: UseFormRegister<TFormData>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export const FormField = <TFormData extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  required = true,
  disabled = false,
  className = "",
  description,
}: FormFieldProps<TFormData>) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {description && <p className="text-xs text-gray-500">{description}</p>}

      <div className="relative">
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "transition-all duration-200",
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

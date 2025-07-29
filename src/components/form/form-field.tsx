import {
  Input,
  FormControl,
  FormDescription,
  FormField as FormFieldBase,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import { Label } from "@/components/ui";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import {
  type Control,
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
  min?: number;
  max?: number;
  numericOnly?: boolean; // Chỉ cho phép nhập số
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
  min,
  max,
  numericOnly = false,
}: FormFieldProps<TFormData>) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!numericOnly && type !== "number") return;

    if (
      [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(e.key)
    ) {
      return;
    }

    if (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!numericOnly && type !== "number") return;

    const paste = e.clipboardData.getData("text");
    if (!/^\d*$/.test(paste)) {
      e.preventDefault();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
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
          min={min}
          max={max}
          className={cn(
            "transition-all duration-200",
            disabled ? "opacity-50 cursor-not-allowed" : ""
          )}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
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

interface ControlledFormFieldProps<TFormData extends FieldValues> {
  label: string;
  name: Path<TFormData>;
  control: Control<TFormData>;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  min?: number;
  max?: number;
  numericOnly?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const ControlledFormField = <TFormData extends FieldValues>({
  label,
  name,
  control,
  type = "text",
  placeholder,
  required = true,
  disabled = false,
  className = "",
  description,
  min,
  max,
  numericOnly = false,
  inputProps,
}: ControlledFormFieldProps<TFormData>) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!numericOnly && type !== "number") return;

    if (
      [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(e.key)
    ) {
      return;
    }

    if (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!numericOnly && type !== "number") return;

    const paste = e.clipboardData.getData("text");
    if (!/^\d*$/.test(paste)) {
      e.preventDefault();
    }
  };

  return (
    <FormFieldBase
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2 h-fit", className)}>
          <FormLabel className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>

          {description && (
            <FormDescription className="text-xs text-gray-500">
              {description}
            </FormDescription>
          )}

          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              min={min}
              max={max}
              className={cn(
                "transition-all duration-200",
                disabled ? "opacity-50 cursor-not-allowed" : ""
              )}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              {...field}
              {...inputProps}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { TSelectOption } from "@/types";
import { AlertCircle } from "lucide-react";
import {
  type FieldError,
  type FieldValues,
  type Path,
  type Control,
  Controller,
} from "react-hook-form";

interface SelectFieldProps<TFormData extends FieldValues> {
  label: string;
  name: Path<TFormData>;
  placeholder?: string;
  options: TSelectOption[];
  control: Control<TFormData>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export const SelectField = <TFormData extends FieldValues>({
  label,
  name,
  placeholder = "Chọn một tùy chọn...",
  options,
  control,
  error,
  required = true,
  disabled = false,
  className = "",
}: SelectFieldProps<TFormData>) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div className="relative w-full">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(
                  "transition-all duration-200 w-full",
                  disabled ? "opacity-50 cursor-not-allowed" : "",
                  error ? "border-red-500 focus:border-red-500" : ""
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.length > 0 ? (
                  options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty-item" disabled>
                    Không có dữ liệu
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
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

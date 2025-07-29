import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import {
  type Control,
  Controller,
  type FieldError,
  type FieldValues,
  type Path,
} from "react-hook-form";

interface DatePickerFieldProps<TFormData extends FieldValues> {
  label: string;
  name: Path<TFormData>;
  placeholder?: string;
  control: Control<TFormData>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  minDate?: Date;
  maxDate?: Date;
  showYearMonthDropdown?: boolean;
}

export const DatePickerField = <TFormData extends FieldValues>({
  label,
  name,
  placeholder = "Chọn ngày...",
  control,
  error,
  required = true,
  disabled = false,
  className = "",
  description,
  minDate,
  maxDate,
  showYearMonthDropdown = false,
}: DatePickerFieldProps<TFormData>) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {description && <p className="text-xs text-gray-500">{description}</p>}

      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={name}
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "w-full justify-start text-left font-normal transition-all duration-200",
                    !field.value && "text-muted-foreground",
                    disabled ? "opacity-50 cursor-not-allowed" : "",
                    error ? "border-red-500 focus:border-red-500" : ""
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(new Date(field.value), "dd/MM/yyyy", { locale: vi })
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      // Format to ISO string for consistent handling
                      field.onChange(date.toISOString());
                    } else {
                      field.onChange(null);
                    }
                  }}
                  disabled={(date) => {
                    if (disabled) return true;
                    if (minDate && date < minDate) return true;
                    if (maxDate && date > maxDate) return true;
                    return false;
                  }}
                  locale={vi}
                  captionLayout={showYearMonthDropdown ? "dropdown" : "label"}
                  startMonth={new Date(1900, 0)}
                  endMonth={new Date(new Date().getFullYear() + 10, 11)}
                />
              </PopoverContent>
            </Popover>
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

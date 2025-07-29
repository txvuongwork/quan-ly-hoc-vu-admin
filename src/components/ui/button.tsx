import React, { type FunctionComponent } from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

interface LoaderButtonProps {
  title: string;
  size?: number;
}

const LoaderButton: FunctionComponent<LoaderButtonProps> = ({
  title,
  size,
}) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader size={size || 16} className="animate-spin" />
      <span>{title}</span>
    </div>
  );
};

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, LoaderButton };

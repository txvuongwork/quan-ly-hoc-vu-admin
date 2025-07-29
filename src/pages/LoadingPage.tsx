import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import type { FunctionComponent } from "react";

interface LoadingPageProps {
  className?: string;
  type?: "global" | "page";
}

export const LoadingPage: FunctionComponent<LoadingPageProps> = ({
  className,
  type = "global",
}) => {
  return (
    <div
      className={cn(
        "w-full flex items-center justify-center",
        type === "global" ? "h-screen" : "h-[70vh]",
        className
      )}
    >
      <Loader size={40} className="animate-spin" />
    </div>
  );
};

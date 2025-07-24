import { Loader } from "lucide-react";
import type { FunctionComponent } from "react";

export const LoadingPage: FunctionComponent = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader size={40} className="animate-spin" />
    </div>
  );
};

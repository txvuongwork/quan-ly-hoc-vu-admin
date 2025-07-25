import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  RefreshCw,
  Wifi,
  Server,
  ShieldAlert,
  Clock,
} from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string | number;
  onRetry?: () => void;
  retryText?: string;
  variant?: "network" | "server" | "permission" | "timeout" | "general";
  className?: string;
}

const errorVariants = {
  network: {
    icon: Wifi,
    title: "Lỗi kết nối mạng",
    message:
      "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
    borderColor: "border-blue-200",
  },
  server: {
    icon: Server,
    title: "Lỗi máy chủ",
    message: "Máy chủ đang gặp sự cố. Vui lòng thử lại sau ít phút.",
    gradient: "from-red-500/20 to-rose-500/20",
    iconColor: "text-red-500",
    borderColor: "border-red-200",
  },
  permission: {
    icon: ShieldAlert,
    title: "Không có quyền truy cập",
    message:
      "Bạn không có quyền thực hiện thao tác này. Vui lòng liên hệ quản trị viên.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
    borderColor: "border-amber-200",
  },
  timeout: {
    icon: Clock,
    title: "Hết thời gian chờ",
    message: "Yêu cầu mất quá nhiều thời gian để thực hiện. Vui lòng thử lại.",
    gradient: "from-purple-500/20 to-indigo-500/20",
    iconColor: "text-purple-500",
    borderColor: "border-purple-200",
  },
  general: {
    icon: AlertTriangle,
    title: "Có lỗi xảy ra",
    message:
      "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
    gradient: "from-gray-500/20 to-slate-500/20",
    iconColor: "text-gray-500",
    borderColor: "border-gray-200",
  },
};

export function ErrorState({
  title,
  message,
  errorCode,
  onRetry,
  retryText = "Thử lại",
  variant = "general",
  className = "",
}: ErrorStateProps) {
  const config = errorVariants[variant];
  const IconComponent = config.icon;

  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Card className={`w-full max-w-md ${config.borderColor} shadow-lg`}>
        <CardContent className="p-8">
          <div
            className={`rounded-full w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${config.gradient} flex items-center justify-center border-2 ${config.borderColor}`}
          >
            <IconComponent className={`w-10 h-10 ${config.iconColor}`} />
          </div>

          <div className="text-center space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {displayTitle}
              </h3>
              <p className="text-gray-600 leading-relaxed">{displayMessage}</p>
              {errorCode && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Mã lỗi: {errorCode}
                  </span>
                </div>
              )}
            </div>

            {onRetry && (
              <div className="pt-2">
                <Button
                  onClick={onRetry}
                  className="group transition-all duration-200 hover:scale-105"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  {retryText}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Usage examples:
/*
// Network error
<ErrorState 
  variant="network" 
  onRetry={() => refetch()} 
/>

// Server error with custom message
<ErrorState 
  variant="server"
  title="Lỗi tải dữ liệu môn học"
  message="Không thể tải danh sách môn học. Vui lòng thử lại."
  errorCode="500"
  onRetry={() => refetch()}
  retryText="Tải lại dữ liệu"
/>

// Permission error
<ErrorState 
  variant="permission"
  message="Chỉ có quản trị viên mới có thể thực hiện thao tác này."
/>

// Timeout error
<ErrorState 
  variant="timeout"
  onRetry={() => refetch()}
/>

// Custom error
<ErrorState 
  title="Không thể xóa môn học"
  message="Môn học này đang được sử dụng trong các lớp học khác."
  errorCode="CONSTRAINT_VIOLATION"
  onRetry={() => handleRetry()}
  retryText="Thử phương án khác"
/>
*/

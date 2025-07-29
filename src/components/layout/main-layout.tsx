import { useGetProfile } from "@/api/authenticationApi";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  //   DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { ACCESS_TOKEN_KEY, ROUTES } from "@/constants";
import { EUserRole } from "@/enums";
import { cn } from "@/lib/utils";
import { LoadingPage } from "@/pages/LoadingPage";
import { useQueryClient } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  LogOut,
  School,
  //   Settings,
  UserCheck,
  Users,
} from "lucide-react";
import { type FunctionComponent } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "sonner";

export const MainLayout: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data: profileResponse, isFetching: isFetchingProfile } =
    useGetProfile();

  const isActivePath = (path: string) => {
    const currentPath = location.pathname;

    // Exact match
    if (currentPath === path) {
      return true;
    }

    // For dashboard paths, only exact match
    if (path === ROUTES.APP.HOME) {
      return false;
    }

    // For other paths, check if current path starts with the path + "/"
    return currentPath.startsWith(path + "/");
  };

  if (isFetchingProfile) {
    return <LoadingPage />;
  }

  if (!profileResponse || !profileResponse.ok) {
    toast.error("Vui lòng đăng nhập để tiếp tục");
    return <Navigate to={ROUTES.AUTH.LOGIN} />;
  }

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    queryClient.invalidateQueries();
    navigate(ROUTES.AUTH.LOGIN);
  };

  const currentUser = profileResponse.body;

  const getNavigationItems = () => {
    if (currentUser.role === EUserRole.ADMIN) {
      return [
        {
          title: "Quản lý ngành học",
          icon: GraduationCap,
          href: ROUTES.ADMIN.MAJOR.ROOT,
        },
        {
          title: "Quản lý môn học",
          icon: BookOpen,
          href: ROUTES.ADMIN.SUBJECTS.ROOT,
        },
        {
          title: "Quản lý lớp học",
          icon: School,
          href: ROUTES.ADMIN.CLASSES.ROOT,
        },
      ];
    }

    return [
      {
        title: "Tổng quan",
        icon: School,
        href: ROUTES.APP.HOME,
      },
      {
        title: "Quản lý sinh viên",
        icon: Users,
        href: "/students",
      },
      {
        title: "Quản lý giảng viên",
        icon: GraduationCap,
        href: "/teachers",
      },
      {
        title: "Quản lý môn học",
        icon: BookOpen,
        href: "/subjects",
      },
      {
        title: "Quản lý lớp học",
        icon: School,
        href: "/classes",
      },
      {
        title: "Quản lý học kỳ",
        icon: Calendar,
        href: "/semesters",
      },
      {
        title: "Đăng ký học",
        icon: ClipboardList,
        href: "/enrollments",
      },
      {
        title: "Điểm danh",
        icon: UserCheck,
        href: "/attendance",
      },
      {
        title: "Quản lý điểm",
        icon: Award,
        href: "/grades",
      },
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Student Management System
              </h1>
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-3 px-3 py-6 hover:bg-gray-100"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                    {currentUser.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {currentUser.fullName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSeparator /> */}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2 text-red-600" />
                <span className="text-red-600 hover:text-red-600">
                  Đăng xuất
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex pt-16">
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "w-full flex items-center space-x-3 border px-3 py-2.5 rounded-lg transition-colors group text-left cursor-pointer",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive
                        ? "text-blue-600"
                        : "text-gray-500 group-hover:text-gray-700"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        isActive ? "text-blue-700" : "text-gray-900"
                      )}
                    >
                      {item.title}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 ml-64">
          <div className="overflow-y-auto">
            <div className="p-6">{<Outlet />}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

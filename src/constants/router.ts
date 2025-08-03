export const ROUTES = {
  APP: {
    ROOT: "/",
    HOME: "/",
    REGISTER_CLASS: "/register-class",
    USER_ATTENDANCE_SESSIONS: "/attendance-sessions/:classId",
  },
  ADMIN: {
    ROOT: "/admin",
    SEMESTERS: {
      ROOT: "/admin/semesters",
      CREATE: "/admin/semesters/create",
      EDIT: "/admin/semesters/:id",
    },
    SUBJECTS: {
      ROOT: "/admin/subjects",
      CREATE: "/admin/subjects/create",
      EDIT: "/admin/subjects/:id",
    },
    MAJOR: {
      ROOT: "/admin/majors",
      CREATE: "/admin/majors/create",
      EDIT: "/admin/majors/:id",
    },
    CLASSES: {
      ROOT: "/admin/classes",
      CREATE: "/admin/classes/create",
      EDIT: "/admin/classes/:id",
    },
  },
  TEACHER: {
    ROOT: "/teacher",
    DASHBOARD: "/teacher",
    CLASSES: {
      ROOT: "/teacher/classes",
      DETAIL: "/teacher/classes/:id",
      ATTENDANCE_SESSIONS: {
        ROOT: "/teacher/classes/:id/attendance-sessions",
        DETAIL: "/teacher/classes/:id/attendance-sessions/:sessionId",
      },
    },
  },
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
  },
};

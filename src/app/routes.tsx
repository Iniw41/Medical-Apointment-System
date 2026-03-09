import { createBrowserRouter } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { AdminDashboard } from "./components/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/student",
    Component: StudentDashboard,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
]);

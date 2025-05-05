import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import LandingPage from "../components/LandingPage/LandingPage";
import Dashboard from "../components/Dashboard/Dashboard";
import NoteEditor from "../components/NoteEditor/NoteEditor";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "notes/:noteId",
        element: (
          <ProtectedRoute>
            <NoteEditor />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

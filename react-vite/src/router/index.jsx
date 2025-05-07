import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import LandingPage from "../components/LandingPage/LandingPage";
import Dashboard from "../components/Dashboard/Dashboard";
import NoteEditor from "../components/NoteEditor/NoteEditor";
import NoteList from "../components/NoteList/NoteList";
import NotebookList from "../components/NotebookList/NotebookList";
import TaskList from "../components/TaskList/TaskList"; // <-- Only if this file exists

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
        path: "notes",
        element: (
          <ProtectedRoute>
            <NoteList />
          </ProtectedRoute>
        ),
      },
      {
        path: "notebooks",
        element: (
          <ProtectedRoute>
            <NotebookList />
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
      {
        path: "tasks",
        element: (
          <ProtectedRoute>
            <TaskList />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);



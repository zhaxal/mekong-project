import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

import "./index.css";

import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import MapPage from "./pages/MapPage";
import AdminPage from "./pages/admin/AdminPage";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import SecuredRoute from "./components/SecuredRoute";
import FieldCreation from "./pages/admin/FieldCreation";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <MapPage />
      </>
    ),
  },
  {
    path: "/admin",
    element: (
      <>
        <Header />
        <SecuredRoute>
          <AdminPage />
        </SecuredRoute>
      </>
    ),
  },
  {
    path: "/admin/field-creation",
    element: (
      <>
        <Header />
        <SecuredRoute>
          <FieldCreation />
        </SecuredRoute>
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Header />
        <LoginPage />
      </>
    ),
  },
]);

function Header() {
  return (
    <header className="text-center py-4 bg-green-700 text-white">
      <Link to="/" className="text-2xl font-bold">
        Mekong Project
      </Link>
    </header>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <div className="flex flex-col h-screen ">
        {/* Under Construction Warning */}
        <div className="flex flex-row justify-center items-center text-center py-2 bg-yellow-500 text-black">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
          <p className="text-lg font-semibold">Under Construction</p>
        </div>

        <RouterProvider router={router} />

        {/* Footer */}
        <footer className="text-center py-4 bg-gray-800 text-white">
          <p>Niigata University</p>
        </footer>
      </div>
    </AuthProvider>
  </StrictMode>
);

// client/src/layouts/MainLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useUser } from "../store/user-store";

export default function MainLayout() {
  const navigate = useNavigate();
  const logout = useUser((s) => s.logout);

  const handleLogout = () => {
    logout();                            
    localStorage.removeItem("accessToken"); 
    delete api.defaults.headers.Authorization;
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold">Task Management</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition-colors px-3 py-1.5 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Outlet /> 
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} Task Management
        </div>
      </footer>
    </div>
  );
}

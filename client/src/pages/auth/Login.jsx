import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../services/api";
import { useUser } from "../../store/user-store";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useUser((s) => s.setAuth);

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        password: form.password,
      };
      const res = await api.post("/api/auth/login", payload);
      const { token, user } = res.data;

      localStorage.setItem("accessToken", token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setAuth({ user, token });

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        timer: 1200,
        showConfirmButton: false,
        position: "top",
        backdrop: false,
      });

      navigate("/tasks", { replace: true });
    } catch (error) {
      setErr(error?.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // ❗ ไม่มีกริด/hero ที่นี่แล้ว ปล่อยให้ PublicLayout จัดการ
  return (
    <>
      <div className="text-right text-sm mb-6">
        Don’t have an account?{" "}
        <Link to="/register" className="text-indigo-600 hover:underline">
          Sign Up
        </Link>
      </div>

      <h2 className="text-2xl font-extrabold mb-6">
        Sign in to{" "}
        <span className="tracking-wider">
          <span className="text-black/70">WHAT </span>
          <span className="text-blue-600">TO </span>
          <span className="text-rose-500">DO?</span>
        </span>
      </h2>

      {err && (
        <div className="mb-4 rounded-lg bg-rose-50 text-rose-700 px-4 py-2 text-sm border border-rose-200">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold mb-2">
            <span className="inline-flex items-center gap-2">
              <Mail className="w-4 h-4" /> USERNAME
            </span>
          </label>
          <input
            name="username"
            value={form.username}
            onChange={onChange}
            className="w-full rounded-xl p-3 outline-none border bg-gray-50 focus:ring"
            placeholder="yourname"
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2">
            <span className="inline-flex items-center gap-2">
              <Lock className="w-4 h-4" /> PASSWORD
            </span>
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            className="w-full rounded-xl p-3 outline-none border bg-gray-50 focus:ring"
            placeholder="********"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          {loading ? "Signing in..." : "SIGN IN"}
        </button>
      </form>
    </>
  );
}

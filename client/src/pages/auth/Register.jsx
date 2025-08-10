// client/src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const username = form.username.trim();
    const email = form.email.trim();

    if (!username || !email || !form.password) return toast.error("กรอกข้อมูลให้ครบ");
    if (!form.agree) return toast.error("กรุณายอมรับข้อกำหนด");

    try {
      setLoading(true);
      await api.post("/api/auth/register", {
        username,
        email,
        password: form.password,
      });
      toast.success("สมัครสมาชิกสำเร็จ");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "สมัครไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // ❗ ไม่มี hero/กริดแล้ว ปล่อยให้ PublicLayout จัดการ
  return (
    <>
      <div className="text-right text-sm mb-6">
        Already a member?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Sign In
        </Link>
      </div>

      <h2 className="text-2xl font-extrabold mb-6">
        Sign up to{" "}
        <span className="tracking-wider">
          <span className="text-black/70">WHAT </span>
          <span className="text-blue-600">TO </span>
          <span className="text-rose-500">DO?</span>
        </span>
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold mb-2">USERNAME</label>
          <input
            name="username"
            value={form.username}
            onChange={onChange}
            className="w-full border rounded-lg p-3 outline-none focus:ring bg-gray-50"
            placeholder="yourname"
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2">EMAIL</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="w-full border rounded-lg p-3 outline-none focus:ring bg-gray-50"
            placeholder="you@email.com"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-2">PASSWORD</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            className="w-full border rounded-lg p-3 outline-none focus:ring bg-gray-50"
            placeholder="6+ characters"
            autoComplete="new-password"
            required
          />
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={onChange}
            className="mt-1"
          />
          <span className="text-gray-600">
            Creating an account means you’re okay with our{" "}
            <a className="text-indigo-600 hover:underline">Terms of Service</a>,{" "}
            <a className="text-indigo-600 hover:underline">Privacy Policy</a>, and default{" "}
            <a className="text-indigo-600 hover:underline">Notification Settings</a>.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading || !form.agree}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl disabled:opacity-60"
        >
          {loading ? "Creating..." : "CREATE ACCOUNT"}
        </button>
      </form>
    </>
  );
}

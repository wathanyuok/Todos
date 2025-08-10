// client/src/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* ซ้าย = รูปอย่างเดียว (ขนาดพอดี ไม่ล้น) */}
      <section className="hidden lg:flex items-center justify-center bg-[#f6d78f]">
        <div className="px-10">
          <img
            src="/hero.png"
            alt=""
            className="
              block
              max-w-[560px]   /* กว้างสุด ~560px */
              max-h-[80vh]    /* สูงสุด 80% ของความสูงหน้าจอ */
              w-auto h-auto   /* รักษาอัตราส่วน */
              object-contain
              rounded-xl shadow-md
            "
          />
        </div>
      </section>

      {/* ขวา = ฟอร์ม */}
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-[520px]">
          <Outlet />
        </div>
      </section>
    </div>
  );
}

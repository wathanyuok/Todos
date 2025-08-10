// client/src/components/TaskModal.jsx
import { useEffect, useState } from "react";

export default function TaskModal({ open, onClose, initial, onSubmit }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || "");
      setDate(initial?.dueDate ? initial.dueDate.slice(0, 10) : "");
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!title || !date) return;
    // แปลงเป็น ISO ปลอดภัย (กัน server ล้มเพราะ parse date)
    const dueDate = new Date(`${date}T00:00:00`).toISOString();
    onSubmit({ title, dueDate });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center w-full">
            <div className="text-xs tracking-widest font-bold text-gray-500">
              {initial ? "WHAT TO DO?" : "WHAT TO DO?"}
            </div>
            <div className="text-xl font-extrabold">{initial ? "EDIT TO DO" : "NEW TO DO"}</div>
          </div>
        </div>

        <label className="block text-xs font-semibold mb-1">TASK NAME</label>
        <input
          className="w-full border rounded-md px-3 py-2 mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task name"
        />

        <label className="block text-xs font-semibold mb-1">DUE DATE</label>
        <input
          type="date"
          className="w-full border rounded-md px-3 py-2 mb-6"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full rounded-md py-2 font-semibold"
          style={{ background: "#ff4f87", color: "#fff" }}
        >
          {initial ? "SAVE CHANGES" : "ADD WHAT TO DO"}
        </button>

        <button onClick={onClose} className="w-full mt-2 py-2 rounded-md border">
          Cancel
        </button>
      </div>
    </div>
  );
}

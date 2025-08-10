import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import TaskModal from "../../components/TaskModal";

function toISODate(val) {
  if (!val) return null;
  if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return val;
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return new Date(`${val}T00:00:00`).toISOString();
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function formatDue(d) {
  const dt = new Date(d);
  return dt
    .toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}
function isOverdue(due, done) {
  if (done) return false;
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(due); d.setHours(0,0,0,0);
  return d < today;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openNew, setOpenNew] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/tasks");
      setTasks(Array.isArray(res.data) ? res.data : res.data.tasks || []);
    } catch (err) {
      console.error("fetchTasks error:", err);
    } finally {
      setLoading(false);
    }
  };

  // รับค่าจาก Modal -> แปลง date เป็น ISO ก่อนส่ง
  const handleAdd = async ({ title, dueDate }) => {
    try {
      const iso = toISODate(dueDate);
      if (!iso) return alert("Invalid date");
      await api.post("/api/tasks", { title, dueDate: iso });
      setOpenNew(false);
      fetchTasks();
    } catch (err) {
      console.error("addTask error:", err);
      alert(err?.response?.data?.message || "Add task failed");
    }
  };

  const handleSaveEdit = async (payload) => {
    try {
      const body = { ...payload };
      if (body.dueDate) {
        const iso = toISODate(body.dueDate);
        if (!iso) return alert("Invalid date");
        body.dueDate = iso;
      }
      await api.put(`/api/tasks/${editTask.id}`, body);
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      console.error("editTask error:", err);
      alert(err?.response?.data?.message || "Edit task failed");
    }
  };

  const toggleDone = async (task) => {
    try {
      await api.patch(`/api/tasks/${task.id}`, { done: !task.done });
      fetchTasks();
    } catch (err) { console.error("toggle error:", err); }
  };

  const removeTask = async (task) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/api/tasks/${task.id}`);
      fetchTasks();
    } catch (err) { console.error("delete error:", err); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const pending = useMemo(
    () => tasks.filter(t => !t.done).sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate)),
    [tasks]
  );
  const complete = useMemo(
    () => tasks.filter(t => t.done).sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate)),
    [tasks]
  );

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ปุ่มใหญ่ด้านบน */}
      <button
        onClick={() => setOpenNew(true)}
        className="w-full py-3 rounded-md font-semibold mb-6"
        style={{ background: "#ff4f87", color: "#fff" }}
      >
        + NEW TO DO
      </button>

      {/* WHAT TO DO */}
      <section className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="text-xs tracking-widest font-bold text-gray-500 mb-3">WHAT TO DO</div>
        <ul className="divide-y">
          {pending.map((t) => (
            <li key={t.id} className="flex items-center py-3">
              <input type="checkbox" className="mr-3 h-4 w-4" checked={false} onChange={()=>toggleDone(t)} />
              <div className="flex-1">
                <div className="text-sm font-semibold">{t.title}</div>
              </div>
              <div className="text-xs mr-4">
                <span className={isOverdue(t.dueDate, t.done) ? "text-red-600 font-bold" : "text-gray-600"}>
                  {formatDue(t.dueDate)}
                </span>
                {isOverdue(t.dueDate, t.done) && (
                  <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">OVERDUE</span>
                )}
              </div>
              <button onClick={()=>setEditTask(t)} className="text-pink-600 px-2" title="Edit">✏️</button>
              <button onClick={()=>removeTask(t)} className="text-red-600 px-2" title="Delete">🗑️</button>
            </li>
          ))}
          {pending.length === 0 && <li className="py-6 text-sm text-gray-500">No pending tasks</li>}
        </ul>
      </section>

      {/* COMPLETE */}
      <section className="bg-white rounded-xl shadow p-4">
        <div className="text-xs tracking-widest font-bold text-gray-500 mb-3">COMPLETE</div>
        <ul className="divide-y">
          {complete.map((t) => (
            <li key={t.id} className="flex items-center py-3">
              <input type="checkbox" className="mr-3 h-4 w-4" checked onChange={()=>toggleDone(t)} />
              <div className="flex-1">
                <div className="text-sm line-through text-gray-500">{t.title}</div>
              </div>
              <div className="text-xs mr-4 text-gray-500">{formatDue(t.dueDate)}</div>
              <button onClick={()=>setEditTask(t)} className="text-pink-600 px-2" title="Edit">✏️</button>
              <button onClick={()=>removeTask(t)} className="text-red-600 px-2" title="Delete">🗑️</button>
            </li>
          ))}
          {complete.length === 0 && <li className="py-6 text-sm text-gray-500">No completed tasks</li>}
        </ul>
      </section>

      {/* Modals */}
      <TaskModal open={openNew} onClose={()=>setOpenNew(false)} onSubmit={handleAdd} />
      <TaskModal
        open={!!editTask}
        initial={editTask}
        onClose={()=>setEditTask(null)}
        onSubmit={(payload)=>handleSaveEdit(payload)}
      />
    </div>
  );
}

export default function PrivateLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Task Management</h1>
        <button
          className="bg-red-500 px-3 py-1 rounded"
          onClick={() => {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 bg-gray-50">
        {children}
      </main>
    </div>
  );
}

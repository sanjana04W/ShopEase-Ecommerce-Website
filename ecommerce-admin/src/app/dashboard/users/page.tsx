"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, LogOut, Home, Users, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  addresses?: any[];
  createdAt: string;
}

export default function UsersManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/users");
      setUsers(data.users || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const loadToast = toast.loading("Logging out...");
      await axios.post("/api/auth/logout");
      toast.dismiss(loadToast);
      toast.success("Successfully logged out");
      router.push("/login");
    } catch {
      toast.error("Logout failed.");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-12">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="glassmorphism sticky top-0 z-50 border-b border-glass-border/30 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 group">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              ShopEase
            </span>
          </Link>
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-slate-800/50"
          >
            <Home size={15} />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors bg-red-500/5 hover:bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/15"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 mt-10 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Users size={28} className="text-indigo-500" />
              <span>User Management</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
              View and manage registered users on the platform.
            </p>
          </div>
          <div className="text-xs font-semibold text-indigo-600 bg-indigo-500/10 border border-indigo-500/15 px-3 py-1.5 rounded-xl self-start">
            Total Users: {users.length}
          </div>
        </div>

        {loading ? (
          <div className="glassmorphism rounded-2xl p-12 text-center border border-glass-border/20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
              Fetching users...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="glassmorphism rounded-2xl p-12 text-center border border-glass-border/20 flex flex-col items-center justify-center gap-3">
            <Users className="w-10 h-10 text-gray-400" />
            <p className="text-base text-gray-800 dark:text-gray-200 font-bold">No Users Found</p>
          </div>
        ) : (
          <div className="glassmorphism rounded-2xl border border-glass-border/20 overflow-hidden shadow-xl animate-scale-in">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100/50 dark:bg-slate-900/40 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold border-b border-glass-border/20">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Addresses</th>
                    <th className="px-6 py-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50 dark:divide-slate-800/40">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 transition-colors duration-200 group">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          u.role === 'admin' 
                            ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20' 
                            : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">
                        {u.addresses?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-gray-400 dark:text-gray-500 font-medium">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

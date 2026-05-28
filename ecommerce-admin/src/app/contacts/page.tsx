"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, LogOut, Home, Trash2, Eye, User, Mail, Phone, Calendar, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Contact {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const loadToast = toast.loading("Deleting message...");
      const res = await fetch("/api/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      toast.dismiss(loadToast);
      if (!res.ok) throw new Error();

      toast.success("Message deleted successfully");
      setSelected(null);
      fetchContacts();
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const handleLogout = async () => {
    try {
      const loadToast = toast.loading("Logging out...");
      await fetch("/api/auth/logout", { method: "POST" });
      toast.dismiss(loadToast);
      toast.success("Successfully logged out");
      router.push("/login");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  // Helper to generate elegant color combinations for sender initials
  const getAvatarStyle = (name: string) => {
    const code = name.charCodeAt(0) % 5;
    const styles = [
      "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    ];
    return styles[code];
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-12">
      {/* Decorative gradient background blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="glassmorphism sticky top-0 z-50 border-b border-glass-border/30 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 group">
            <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12 text-indigo-500" />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-350">
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
            className="flex items-center gap-1 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white/40 dark:bg-slate-900/30 px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-slate-800/50"
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
              <MessageSquare size={28} className="text-indigo-500" />
              <span>Contact Messages</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
              Read and address support submissions, inquiries, and customer feedback.
            </p>
          </div>
          <div className="text-xs font-semibold text-indigo-600 bg-indigo-500/10 border border-indigo-500/15 px-3 py-1.5 rounded-xl self-start">
            Total Messages: {contacts.length}
          </div>
        </div>

        {loading ? (
          <div className="glassmorphism rounded-2xl p-12 text-center border border-glass-border/20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
              Fetching records from database...
            </p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="glassmorphism rounded-2xl p-12 text-center border border-glass-border/20 flex flex-col items-center justify-center gap-3 animate-scale-in">
            <AlertCircle className="w-10 h-10 text-gray-400" />
            <p className="text-base text-gray-800 dark:text-gray-200 font-bold">No Messages Recieved</p>
            <p className="text-sm text-gray-400 max-w-sm">
              Your inbox is clean! When visitors submit contact forms on the main store, they will appear here.
            </p>
          </div>
        ) : (
          <div className="glassmorphism rounded-2xl border border-glass-border/20 overflow-hidden shadow-xl animate-scale-in">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100/50 dark:bg-slate-900/40 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold border-b border-glass-border/20">
                  <tr>
                    <th className="px-6 py-4">Sender</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Received Date</th>
                    <th className="px-6 py-4 text-center">Action Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50 dark:divide-slate-800/40">
                  {contacts.map((c) => (
                    <tr key={c._id} className="hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 transition-colors duration-200 group">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarStyle(c.fullName)}`}>
                          {c.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[150px]">{c.fullName}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                        <a href={`mailto:${c.email}`} className="hover:text-indigo-500 transition-colors">
                          {c.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium truncate max-w-[200px]">
                        {c.subject}
                      </td>
                      <td className="px-6 py-4 text-gray-400 dark:text-gray-500 font-medium">
                        {new Date(c.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelected(c)}
                            title="View Message Details"
                            className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-sm hover:shadow-indigo-500/20 active:scale-95 flex items-center justify-center"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            title="Delete Message"
                            className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-500/20 active:scale-95 flex items-center justify-center"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Message Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="glassmorphism rounded-2xl shadow-2xl border border-glass-border/40 w-full max-w-xl p-6 md:p-8 animate-scale-in relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800/40 pb-4 mb-6">
              <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <MessageSquare size={20} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Inquiry Details
              </h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <User className="text-gray-400 shrink-0 mt-0.5" size={17} />
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sender Name</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{selected.fullName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="text-gray-400 shrink-0 mt-0.5" size={17} />
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Received On</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {new Date(selected.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="text-gray-400 shrink-0 mt-0.5" size={17} />
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</span>
                    <a href={`mailto:${selected.email}`} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline break-all">
                      {selected.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="text-gray-400 shrink-0 mt-0.5" size={17} />
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</span>
                    <a href={`tel:${selected.phone}`} className="text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-indigo-500 hover:underline">
                      {selected.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-slate-800/40 pt-4 mt-2">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Subject</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                  {selected.subject}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Message Body</span>
                <div className="bg-white/50 dark:bg-black/30 border border-gray-200/50 dark:border-slate-800/50 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200 font-medium leading-relaxed max-h-[160px] overflow-y-auto custom-scrollbar-styling shadow-inner">
                  {selected.message}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 border-t border-gray-100 dark:border-slate-800/40 pt-4">
              <button
                onClick={() => handleDelete(selected._id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 shadow-md hover:shadow-red-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete message</span>
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800/60 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-slate-700/80 active:scale-95 transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
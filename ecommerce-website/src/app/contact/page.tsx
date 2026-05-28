import ContactForm from "@/components/ui/ContactForm";
import { Mail, Phone, MapPin, Clock, Sparkles } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 space-y-16 animate-fade-in">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Support Hub
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Get in <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">Touch</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          Have an inquiry, custom request, or some feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Info cards */}
        <div className="space-y-6">
          {[
            { icon: <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />, title: "Support Email", value: "support@shopease.com", desc: "Response in under 2 hours" },
            { icon: <Phone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />, title: "Hotline Phone", value: "011 744 4444", desc: "Mon-Fri, 9am - 6pm EST" },
            { icon: <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />, title: "Headquarters Address", value: "High Level Road, Kandy", desc: "Visit our craft showroom" },
            { icon: <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />, title: "Showroom Hours", value: "Mon–Fri, 9am – 6pm EST", desc: "Weekends closed" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="premium-card flex gap-5 items-start bg-white/70 dark:bg-slate-900/40 rounded-3xl p-5 border border-slate-100/50 dark:border-slate-800/50 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-slate-900 dark:text-white text-base">{item.title}</p>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{item.value}</p>
                <p className="text-slate-400 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2 premium-card bg-white/70 dark:bg-slate-900/40 border border-slate-100/50 dark:border-slate-800/50 rounded-3xl shadow-sm p-8 lg:p-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Send us a message
            </h2>
            <p className="text-slate-400 text-xs">Fill out the quick support ticket below and our developers will contact you.</p>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
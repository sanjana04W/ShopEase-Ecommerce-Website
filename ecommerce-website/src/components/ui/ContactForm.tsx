'use client';

import { useState } from 'react';
import Button from './Button';
import { ContactFormData } from '@/types';

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({ fullName: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ fullName: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

const inputClass = 'w-full border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-950/40 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';
  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1'>Full Name <span className='text-red-500'>*</span></label>
          <input type='text' name='fullName' value={form.fullName} onChange={handleChange} required placeholder='John Doe' className={inputClass} />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1'>Email Address <span className='text-red-500'>*</span></label>
          <input type='email' name='email' value={form.email} onChange={handleChange} required placeholder='john@example.com' className={inputClass} />
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1'>Phone Number</label>
          <input type='tel' name='phone' value={form.phone} onChange={handleChange} placeholder='+94' className={inputClass} />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1'>Subject <span className='text-red-500'>*</span></label>
          <input type='text' name='subject' value={form.subject} onChange={handleChange} required placeholder='Order issue, feedback...' className={inputClass} />
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1'>Message <span className='text-red-500'>*</span></label>
        <textarea name='message' value={form.message} onChange={handleChange} required rows={5} placeholder='Write your message here...' className={inputClass} />
      </div>
      {status === 'success' && <p className='text-green-600 text-sm font-medium'> Message sent successfully!</p>}
      {status === 'error' && <p className='text-red-500 text-sm font-medium'>? Something went wrong. Please try again.</p>}
      <Button type='submit' isLoading={status === 'loading'} className='w-full'>Send Message</Button>
    </form>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const inputCls = "w-full px-4 py-3 bg-surface-2 border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 font-body text-sm focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all duration-200 outline-none";

const ContactForm = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://formspree.io/f/mpwrpyez', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(t('form.errorMsg'));
      }
    } catch {
      setError(t('form.errorMsg'));
    } finally {
      setLoading(false);
    }
  };

  const valid = form.name && form.email && form.subject && form.message;

  return (
    <div className="rounded-2xl bg-surface border border-white/[0.07] p-4 sm:p-7">
      <h2 className="font-display font-bold text-white text-2xl mb-6">{t('form.title')}</h2>

      {success && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="mb-5 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-3"
        >
          <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-emerald-400 font-body text-sm font-medium">{t('form.successMsg')}</p>
        </motion.div>
      )}

      {error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="mb-5 p-4 bg-red-500/10 border border-red-500/25 rounded-xl flex items-center gap-3"
        >
          <svg className="w-5 h-5 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-400 font-body text-sm">{error}</p>
        </motion.div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium font-body text-zinc-300 mb-2">
            {t('form.name')} <span className="text-emerald-500">*</span>
          </label>
          <input type="text" id="name" name="name" value={form.name} onChange={onChange} required
            placeholder={t('form.namePlaceholder')} className={inputCls} />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium font-body text-zinc-300 mb-2">
            {t('form.email')} <span className="text-emerald-500">*</span>
          </label>
          <input type="email" id="email" name="email" value={form.email} onChange={onChange} required
            placeholder={t('form.emailPlaceholder')} className={inputCls} />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium font-body text-zinc-300 mb-2">
            {t('form.subject')} <span className="text-emerald-500">*</span>
          </label>
          <input type="text" id="subject" name="subject" value={form.subject} onChange={onChange} required
            placeholder={t('form.subjectPlaceholder')} className={inputCls} />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium font-body text-zinc-300 mb-2">
            {t('form.message')} <span className="text-emerald-500">*</span>
          </label>
          <textarea id="message" name="message" value={form.message} onChange={onChange} required rows={5}
            placeholder={t('form.messagePlaceholder')} className={`${inputCls} resize-none`} />
        </div>

        <motion.button
          type="submit"
          disabled={!valid || loading}
          whileHover={valid && !loading ? { scale: 1.02 } : {}}
          whileTap={valid && !loading ? { scale: 0.98 } : {}}
          className={`w-full py-3 px-6 rounded-xl font-semibold font-body text-sm transition-all duration-200 cursor-pointer ${
            valid && !loading
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
              : 'bg-white/[0.04] text-zinc-600 cursor-not-allowed border border-white/[0.06]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              {t('form.sending')}
            </span>
          ) : t('form.submit')}
        </motion.button>
      </form>

      <p className="mt-5 text-xs text-zinc-700 font-body text-center">
        {t('form.secure')}
      </p>
    </div>
  );
};

export default ContactForm;

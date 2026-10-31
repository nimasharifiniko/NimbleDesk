'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type Language = 'fa' | 'en';

const translations = {
    fa: {
        dir: 'rtl' as const,
        title: 'ایجاد حساب کاربری',
        subtitle: 'برای شروع، اطلاعات زیر را تکمیل کنید',
        name: 'نام کامل',
        namePlaceholder: 'مثلاً: علی رضایی',
        email: 'ایمیل',
        password: 'رمز عبور',
        passwordPlaceholder: 'حداقل ۸ کاراکتر',
        continueBtn: 'ادامه',
        haveAccount: 'قبلاً ثبت‌نام کرده‌اید؟',
        login: 'ورود',
        terms: 'با ادامه، شما قوانین و مقررات ما را می‌پذیرید.',
        langToggle: 'English',
        brand: 'دستیار هوشمند',
    },
    en: {
        dir: 'ltr' as const,
        title: 'Create your account',
        subtitle: 'Fill in the details below to get started',
        name: 'Full name',
        namePlaceholder: 'e.g. John Doe',
        email: 'Email',
        password: 'Password',
        passwordPlaceholder: 'At least 8 characters',
        continueBtn: 'Continue',
        haveAccount: 'Already have an account?',
        login: 'Log in',
        terms: 'By continuing, you agree to our Terms & Conditions.',
        langToggle: 'فارسی',
        brand: 'AI Front Desk',
    },
};

/* ---------- آیکون‌های SVG داخلی ---------- */
const GlobeIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const ArrowIcon = ({ flip, className = 'w-4 h-4' }: { flip: boolean; className?: string }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
    >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const BotIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4M8 15h.01M16 15h.01" />
    </svg>
);
/* ------------------------------------------- */

export default function SignupPage() {
    const router = useRouter();
    const [lang, setLang] = useState<Language>('fa');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const t = translations[lang];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) newErrors.name = lang === 'fa' ? 'نام الزامی است' : 'Name is required';
        if (!formData.email.trim()) newErrors.email = lang === 'fa' ? 'ایمیل الزامی است' : 'Email is required';
        if (formData.password.length < 8)
            newErrors.password = lang === 'fa' ? 'رمز عبور باید حداقل ۸ کاراکتر باشد' : 'Password must be at least 8 characters';

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            // ذخیره توکن/کاربر دمو در localStorage تا داشبورد کاربر را "لاگین‌شده" تشخیص دهد
            if (typeof window !== 'undefined') {
                localStorage.setItem(
                    'nimble_user',
                    JSON.stringify({ name: formData.name, email: formData.email })
                );
            }
            router.push('/onboarding');
        }
    };

    return (
        <div dir={t.dir} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-10">
            {/* نورهای محو سبز در پس‌زمینه (Ambient Glow) */}
            <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-green-500/20 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px]" />
            <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-lime-500/10 blur-[100px]" />

            <div className="relative z-10 w-full max-w-md">
                {/* هدر: لوگو برند + سوئیچر زبان */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-green-500/40 bg-green-500/10 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.25)]">
                            <BotIcon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-bold text-white">{t.brand}</span>
                    </div>

                    <button
                        onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
                        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200 backdrop-blur-xl transition hover:bg-white/10"
                    >
                        <GlobeIcon className="h-3.5 w-3.5 text-green-400" />
                        {t.langToggle}
                    </button>
                </div>

                {/* کارت شیشه‌ای اصلی */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-2xl">
                    <h1 className="text-center text-2xl font-bold text-white">{t.title}</h1>
                    <p className="mt-2 text-center text-sm text-gray-400">{t.subtitle}</p>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-300">{t.name}</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder={t.namePlaceholder}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none backdrop-blur-xl transition focus:border-green-400/60 focus:shadow-[0_0_15px_rgba(74,222,128,0.25)]"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-300">{t.email}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                placeholder="example@email.com"
                                dir="ltr"
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none backdrop-blur-xl transition focus:border-green-400/60 focus:shadow-[0_0_15px_rgba(74,222,128,0.25)]"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-300">{t.password}</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                                placeholder={t.passwordPlaceholder}
                                dir="ltr"
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none backdrop-blur-xl transition focus:border-green-400/60 focus:shadow-[0_0_15px_rgba(74,222,128,0.25)]"
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-green-400 px-4 py-3 text-sm font-bold text-black shadow-[0_0_25px_rgba(74,222,128,0.4)] transition hover:bg-green-300 hover:shadow-[0_0_30px_rgba(74,222,128,0.55)]"
                        >
                            {t.continueBtn}
                            <ArrowIcon flip={t.dir === 'rtl'} />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-gray-500">{t.terms}</p>

                    <p className="mt-4 text-center text-sm text-gray-400">
                        {t.haveAccount}{' '}
                        <a href="/login" className="font-semibold text-green-400 transition hover:text-green-300">
                            {t.login}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
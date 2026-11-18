import React, {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {ArrowRight, Clock, Globe, MessageCircle, Search} from 'lucide-react';
import {copy, Lang} from '../i18n';
import {PromoOffer} from '../types';
import {PWAInstallButton} from './PWAInstallButton';

interface HeroSectionProps {
  lang: Lang;
  onToggleLang: () => void;
  promo: PromoOffer;
  counters: {
    learnersTrained: number;
    coursesOffered: number;
    documentsPrinted: number;
    partnerInstitutions: number;
  };
  whatsappUrl: string;
  onNavigate: (view: 'home' | 'programs' | 'printing' | 'institutions' | 'admissions' | 'stories' | 'admin', hash?: string) => void;
}

const ROTATING_PHRASES = {
  en: [
    'Learn Practical Digital Skills.',
    'Grow Through Focused Tuition.',
    'Create Audio, Video & Design.',
    'Build Your Future in Ngama.',
  ],
  sw: [
    'Jifunze Ujuzi wa Kompyuta.',
    'Kua Kupitia Masomo ya Ziada.',
    'Buni Maudhui na Ubunifu Bora.',
    'Jenga Mustakabali Wako Ngama.',
  ],
};

function useAnimatedCounter(target: number, durationMs = 1100): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let rafId = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, durationMs]);
  return val;
}

function useCountdown(targetISO: string) {
  const [remaining, setRemaining] = useState({days: 14, hours: 0, mins: 0, secs: 0});

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, new Date(targetISO).getTime() - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setRemaining({days, hours, mins, secs});
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetISO]);

  return remaining;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onToggleLang,
  promo,
  counters,
  whatsappUrl,
  onNavigate,
}) => {
  const t = copy[lang];
  const phrases = ROTATING_PHRASES[lang];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  const countdown = useCountdown(promo.targetDateISO);
  const cLearners = useAnimatedCounter(counters.learnersTrained);
  const cCourses = useAnimatedCounter(counters.coursesOffered);
  const cPrinted = useAnimatedCounter(counters.documentsPrinted);
  const cPartners = useAnimatedCounter(counters.partnerInstitutions);

  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3400);
    return () => clearInterval(id);
  }, [phrases.length]);

  const showcaseSlides = [
    {
      src: '/assets/aistudio/Ebenezer_Technology_Logo_on_Cream_Texture_9898ff89.png',
      alt: 'Ebenezer Technology and Skills Centre Official Brand Logo',
      caption: 'Ebenezer Technology & Skills Centre · Ngama',
      cover: false,
    },
    {
      src: '/assets/photos/computer-training.jpg',
      alt: 'Learner working at a laptop during Introduction to Computers training',
      caption: 'Introduction to Computers · 6 Weeks · KSh 5,000',
      cover: true,
    },
    {
      src: '/assets/photos/content-creation.jpg',
      alt: 'Creator recording podcast audio with headphones and studio microphone',
      caption: 'Content Creation & Media · 8 Weeks · KSh 10,000',
      cover: true,
    },
    {
      src: '/assets/photos/printing-design.jpg',
      alt: 'Printer and printed promotional materials and designs',
      caption: 'Printing & Graphic Design · Ngama Centre',
      cover: true,
    },
  ];

  return (
    <section className="relative bg-[#071E4B] text-white overflow-hidden">
      {/* Subtle geometric architectural grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(245, 130, 32, 0.35), transparent 45%), radial-gradient(circle at 15% 85%, rgba(242, 183, 5, 0.2), transparent 40%)',
        }}
        aria-hidden="true"
      />

      {/* Utility Strip: Promo Countdown + Language Toggle + PWA Install */}
      <div className="relative border-b border-white/10 bg-[#051638]/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {promo.active ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-100">
              <span className="font-semibold text-[#F2B705]">{promo.badgeText}:</span>
              <span>{promo.headline}</span>
              <span className="inline-flex items-center gap-1.5 font-mono tabular-nums text-xs text-white/90">
                <Clock className="w-3.5 h-3.5 text-[#F58220]" aria-hidden="true" />
                {countdown.days}d {String(countdown.hours).padStart(2, '0')}h{' '}
                {String(countdown.mins).padStart(2, '0')}m {String(countdown.secs).padStart(2, '0')}s
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-300">{t.heroLocation}</span>
          )}

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onToggleLang}
              aria-label="Switch language between English and Kiswahili"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#F2B705]" aria-hidden="true" />
              <span>{lang === 'en' ? 'Kiswahili' : 'English'}</span>
            </button>
            <PWAInstallButton compact />
          </div>
        </div>
      </div>

      {/* Main Hero 2-Column Split */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <p className="text-xs sm:text-sm font-medium tracking-wide text-[#F2B705]">
                {t.heroLocation}
              </p>

              <h1
                className="font-display font-extrabold tracking-tight text-white text-balance leading-[1.08]"
                style={{fontSize: 'clamp(2.15rem, 4.2vw, 3.6rem)'}}
              >
                Ebenezer Technology &amp; Skills Centre
              </h1>

              {/* Rotating headline */}
              <div className="min-h-[3.25rem] sm:min-h-[2.75rem] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${lang}-${phraseIndex}`}
                    initial={{opacity: 0, y: 8}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -8}}
                    transition={{duration: 0.28, ease: [0.16, 1, 0.3, 1]}}
                    className="text-xl sm:text-2xl font-semibold text-[#F58220]"
                  >
                    {phrases[phraseIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
                Practical 4-seat computer training, CBC/KJSEA/KCSE tuition, adult &amp; youth reading classes, audio-video content creation, and reliable printing &amp; graphic design for individuals, schools, churches, NGOs, and businesses.
              </p>

              <p className="text-sm italic font-medium text-[#F2B705]">
                “{t.tagline}” &nbsp;·&nbsp; {t.signoff}
              </p>
            </div>

            {/* Primary & Secondary Action Row */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-3.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm sm:text-base font-bold text-[#052E16] hover:bg-[#1FB857] transition-colors whitespace-nowrap shrink-0 shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  <span>{t.heroChatWhatsapp} · 0714 490545</span>
                </a>

                <button
                  type="button"
                  onClick={() => onNavigate('admissions')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F58220] px-6 py-3.5 text-sm sm:text-base font-bold text-[#071E4B] hover:bg-[#E06D0B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{t.heroEnrolNow}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-300">
                <a
                  href="#course-quiz"
                  className="inline-flex items-center gap-1.5 hover:text-white underline underline-offset-4 decoration-[#F58220]/70"
                >
                  <span>{t.heroFindCourse}</span>
                </a>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => onNavigate('printing', 'track-order')}
                  className="inline-flex items-center gap-1.5 hover:text-white underline underline-offset-4 decoration-[#F2B705]/70 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.heroTrackOrder}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Media Column: Official Logo & Cropped Service Photos */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-white/15 bg-[#0A2A66]/70 p-4">
            <div className="relative flex-1 min-h-[260px] sm:min-h-[320px] overflow-hidden rounded-xl bg-[#FAF7F2] group">
              <img
                src={showcaseSlides[showcaseIndex].src}
                alt={showcaseSlides[showcaseIndex].alt}
                referrerPolicy="no-referrer"
                className={`w-full h-full max-h-[360px] mx-auto transition-transform duration-300 group-hover:scale-105 ${
                  showcaseSlides[showcaseIndex].cover ? 'object-cover object-top' : 'object-contain'
                }`}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-200 truncate">
                {showcaseSlides[showcaseIndex].caption}
              </p>
              <div className="flex items-center gap-1.5 shrink-0">
                {showcaseSlides.map((slide, idx) => (
                  <button
                    key={slide.src}
                    type="button"
                    onClick={() => setShowcaseIndex(idx)}
                    aria-label={`View centre showcase slide ${idx + 1}`}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      showcaseIndex === idx
                        ? 'bg-[#F58220] text-[#071E4B] font-bold'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Four Pillars + Live Animated Counters Row */}
        <div className="mt-10 pt-8 border-t border-white/15 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-xl border border-white/12 bg-white/5 p-4">
            <p className="text-xs font-medium text-[#F2B705]">{t.pillars[0]}</p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-white">
              {cLearners}+
            </p>
            <p className="mt-0.5 text-xs text-slate-300">Learners trained &amp; mentored</p>
          </div>
          <div className="rounded-xl border border-white/12 bg-white/5 p-4">
            <p className="text-xs font-medium text-[#F2B705]">{t.pillars[1]}</p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-white">
              {cCourses}
            </p>
            <p className="mt-0.5 text-xs text-slate-300">Active courses &amp; tracks</p>
          </div>
          <div className="rounded-xl border border-white/12 bg-white/5 p-4">
            <p className="text-xs font-medium text-[#F2B705]">{t.pillars[2]}</p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-white">
              {cPrinted.toLocaleString()}+
            </p>
            <p className="mt-0.5 text-xs text-slate-300">Documents, CVs &amp; programmes printed</p>
          </div>
          <div className="rounded-xl border border-white/12 bg-white/5 p-4">
            <p className="text-xs font-medium text-[#F2B705]">{t.pillars[3]}</p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-white">
              {cPartners}+
            </p>
            <p className="mt-0.5 text-xs text-slate-300">Schools, churches &amp; NGOs served</p>
          </div>
        </div>
      </div>
    </section>
  );
};

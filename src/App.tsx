import React, {useCallback, useEffect, useState} from 'react';
import {Menu, MessageCircle, X} from 'lucide-react';
import {copy, Lang} from './i18n';
import {PublicSiteData, ServiceCategory, TestimonialItem} from './types';
import {BrandMark} from './components/BrandMark';
import {HeroSection} from './components/HeroSection';
import {ServiceCardsSection} from './components/ServiceCardsSection';
import {CourseQuizAndTour} from './components/CourseQuizAndTour';
import {ProgramsAndBookingView} from './components/ProgramsAndBookingView';
import {PrintingAndTrackingView} from './components/PrintingAndTrackingView';
import {InstitutionsAndKitView} from './components/InstitutionsAndKitView';
import {AdmissionFormView} from './components/AdmissionFormView';
import {StoriesAndLeadsSection} from './components/StoriesAndLeadsSection';
import {AdminDashboardView} from './components/AdminDashboardView';
import {OfflineIndicator} from './components/PWAInstallButton';

type ActiveView = 'home' | 'programs' | 'printing' | 'institutions' | 'admissions' | 'stories' | 'admin';

const FALLBACK_DATA: PublicSiteData = {
  courses: [
    {
      id: 'comp-intro',
      category: 'computer',
      title: 'Introduction to Computers',
      level: 'Beginner to Advanced',
      duration: '6 Weeks',
      schedule: 'Mon–Fri · 4-Seat Practical Lab',
      fee: 'KSh 5,000',
      highlights: [
        'MS Word formatting & documents',
        'MS Excel spreadsheets & formulas',
        'MS PowerPoint presentations',
        'MS Access databases',
        'Internet & Online Security',
      ],
      active: true,
    },
    {
      id: 'tuit-kcse',
      category: 'tuition',
      title: 'Secondary School Tuition & KCSE Preparation',
      level: 'Form 1–4',
      duration: 'Monthly',
      schedule: '',
      fee: 'KSh 2,500 / month',
      highlights: ['KCSE exam technique', 'Sciences, Maths & English', 'Structured revision'],
      active: true,
    },
  ],
  promo: {
    headline: 'School-Holiday & New Intake Registration Open',
    subtext: 'Limited 4-seat computer lab slots · Claim a Free First Lesson or Free CV Check.',
    targetDateISO: new Date(Date.now() + 14 * 86400000).toISOString(),
    badgeText: 'Next Intake',
    active: true,
  },
  testimonials: [],
  gallery: [],
  articles: [],
  settings: {
    phoneDisplay: '0714 490545',
    whatsappIntl: '254714490545',
    email: 'ebenezerskilscentre@gmail.com',
    locationLine: 'Ngama, Kajiado County · Near the Kenya–Tanzania Border',
    hoursWeekdays: 'Mon–Fri: 8:00 AM – 7:00 PM',
    hoursSaturday: 'Saturday: 9:00 AM – 5:00 PM',
    mpesaPaybillOrTill: 'Confirm Till / Paybill via 0714 490545 before payment',
    mpesaAccountName: 'Ebenezer Technology & Skills Centre',
    googleReviewsUrl: 'https://www.google.com/search?q=Ebenezer+Technology+and+Skills+Centre+Ngama+Kajiado',
    whatsappChannelUrl: 'https://wa.me/254714490545',
  },
  counters: {
    learnersTrained: 186,
    coursesOffered: 12,
    documentsPrinted: 4380,
    partnerInstitutions: 28,
  },
};

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [view, setView] = useState<ActiveView>(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view') as ActiveView | null;
    if (v && ['home', 'programs', 'printing', 'institutions', 'admissions', 'stories', 'admin'].includes(v)) {
      return v;
    }
    return 'home';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteData, setSiteData] = useState<PublicSiteData>(FALLBACK_DATA);
  const [programFilter, setProgramFilter] = useState<ServiceCategory | 'all'>('all');
  const [preselectedCourse, setPreselectedCourse] = useState('');

  const loadPublicData = useCallback(async () => {
    try {
      const res = await fetch('/api/public-data');
      if (res.ok) {
        const json: PublicSiteData = await res.json();
        setSiteData(json);
      }
    } catch {
      // Keep cached / fallback data cleanly when offline
    }
  }, []);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  const navigate = (nextView: ActiveView, anchorId?: string) => {
    setView(nextView);
    setMobileMenuOpen(false);
    const url = new URL(window.location.href);
    if (nextView === 'home') {
      url.searchParams.delete('view');
    } else {
      url.searchParams.set('view', nextView);
    }
    window.history.replaceState({}, '', url.toString());

    setTimeout(() => {
      if (anchorId) {
        document.getElementById(anchorId)?.scrollIntoView({behavior: 'smooth'});
      } else {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    }, 50);
  };

  const t = copy[lang];

  const getContextWhatsappMessage = () => {
    switch (view) {
      case 'programs':
        return 'Hello Ebenezer, I am looking at your Training Programmes and would like to book a seat or ask about fees.';
      case 'printing':
        return 'Hello Ebenezer, I would like a printing or design quotation from your Ngama centre.';
      case 'institutions':
        return 'Hello Ebenezer, I am enquiring on behalf of a school, church, NGO or business regarding institutional services.';
      case 'admissions':
        return 'Hello Ebenezer, I need help completing the Admission & Registration Form.';
      default:
        return 'Hello Ebenezer Technology and Skills Centre! I would like to enquire about courses or printing services.';
    }
  };

  const whatsappUrl = `https://wa.me/${siteData.settings.whatsappIntl}?text=${encodeURIComponent(
    getContextWhatsappMessage()
  )}`;

  const handleReviewAdded = (item: TestimonialItem) => {
    setSiteData((prev) => ({
      ...prev,
      testimonials: [item, ...prev.testimonials],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#0F172A]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#0A2A66]/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BrandMark size={30} />
            <span className="font-display text-lg font-extrabold tracking-tight text-[#0A2A66]">
              EBENEZER
            </span>
          </button>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700" aria-label="Primary Navigation">
            <button
              type="button"
              onClick={() => navigate('programs')}
              className={`hover:text-[#0A2A66] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'programs' ? 'text-[#0A2A66] font-bold underline' : ''
              }`}
            >
              {t.navPrograms}
            </button>
            <button
              type="button"
              onClick={() => navigate('printing')}
              className={`hover:text-[#0A2A66] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'printing' ? 'text-[#0A2A66] font-bold underline' : ''
              }`}
            >
              {t.navPrinting}
            </button>
            <button
              type="button"
              onClick={() => navigate('institutions')}
              className={`hover:text-[#0A2A66] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'institutions' ? 'text-[#0A2A66] font-bold underline' : ''
              }`}
            >
              {t.navInstitutions}
            </button>
            <button
              type="button"
              onClick={() => navigate('stories')}
              className={`hover:text-[#0A2A66] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'stories' ? 'text-[#0A2A66] font-bold underline' : ''
              }`}
            >
              {t.navGallery}
            </button>
            <button
              type="button"
              onClick={() => navigate('admin')}
              className={`hover:text-[#0A2A66] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'admin' ? 'text-[#0A2A66] font-bold underline' : ''
              }`}
            >
              {t.navAdmin}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate('admissions')}
              className="px-4 py-2 rounded-lg bg-[#F58220] text-xs sm:text-sm font-bold text-[#071E4B] hover:bg-[#E06D0B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.primaryCta}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-lg border border-slate-200 text-[#0A2A66] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
            {(
              [
                ['home', 'Home'],
                ['programs', t.navPrograms],
                ['printing', t.navPrinting],
                ['institutions', t.navInstitutions],
                ['admissions', t.navAdmissions],
                ['stories', t.navGallery],
                ['admin', t.navAdmin],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => navigate(id)}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer ${
                  view === id ? 'bg-[#0A2A66] text-white' : 'text-[#0A2A66] hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        {view === 'home' && (
          <>
            <HeroSection
              lang={lang}
              onToggleLang={() => setLang((l) => (l === 'en' ? 'sw' : 'en'))}
              promo={siteData.promo}
              counters={siteData.counters}
              whatsappUrl={whatsappUrl}
              onNavigate={navigate}
            />

            <ServiceCardsSection
              whatsappIntl={siteData.settings.whatsappIntl}
              onSelectService={(category, targetView) => {
                if (targetView === 'programs') {
                  setProgramFilter(category);
                  navigate('programs');
                } else {
                  navigate(targetView);
                }
              }}
            />

            <CourseQuizAndTour
              lang={lang}
              whatsappIntl={siteData.settings.whatsappIntl}
              onEnrolRecommended={(courseTitle) => {
                setPreselectedCourse(courseTitle);
                navigate('admissions');
              }}
            />

            <div className="mt-14">
              <StoriesAndLeadsSection
                lang={lang}
                testimonials={siteData.testimonials}
                gallery={siteData.gallery}
                articles={siteData.articles}
                settings={siteData.settings}
                onReviewAdded={handleReviewAdded}
                showFullGalleryAndBlog={true}
              />
            </div>
          </>
        )}

        {view === 'programs' && (
          <ProgramsAndBookingView
            courses={siteData.courses}
            initialCategory={programFilter}
            whatsappIntl={siteData.settings.whatsappIntl}
            onEnrolCourse={(title) => {
              setPreselectedCourse(title);
              navigate('admissions');
            }}
          />
        )}

        {view === 'printing' && <PrintingAndTrackingView settings={siteData.settings} />}

        {view === 'institutions' && (
          <InstitutionsAndKitView
            settings={siteData.settings}
            onGoToQuote={() => navigate('printing')}
          />
        )}

        {view === 'admissions' && (
          <AdmissionFormView
            settings={siteData.settings}
            preselectedCourse={preselectedCourse}
          />
        )}

        {view === 'stories' && (
          <div className="py-10">
            <StoriesAndLeadsSection
              lang={lang}
              testimonials={siteData.testimonials}
              gallery={siteData.gallery}
              articles={siteData.articles}
              settings={siteData.settings}
              onReviewAdded={handleReviewAdded}
              showFullGalleryAndBlog={true}
            />
          </div>
        )}

        {view === 'admin' && <AdminDashboardView onDataMutated={loadPublicData} />}
      </main>

      {/* Quiet, Complete Footer */}
      <footer className="bg-[#071E4B] text-slate-200 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <BrandMark size={28} darkBg />
              <span className="font-display font-bold text-white tracking-tight">
                Ebenezer Technology &amp; Skills Centre
              </span>
            </div>
            <p className="text-xs text-[#F2B705] italic">{t.tagline} · {t.signoff}</p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Serving Ngama, Illasit, Kimana, Loitokitok, Tarakea &amp; neighbouring Kenyan–Tanzanian communities with practical skills and reliable printing.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2 text-xs">
            <p className="font-bold text-white">Quick Links</p>
            <div className="grid grid-cols-2 gap-1.5">
              <button type="button" onClick={() => navigate('programs')} className="text-left hover:text-white cursor-pointer">
                Computer &amp; Tuition
              </button>
              <button type="button" onClick={() => navigate('printing')} className="text-left hover:text-white cursor-pointer">
                Print Quotes &amp; Tracking
              </button>
              <button type="button" onClick={() => navigate('institutions')} className="text-left hover:text-white cursor-pointer">
                Institutional Pack
              </button>
              <button type="button" onClick={() => navigate('admissions')} className="text-left hover:text-white cursor-pointer">
                Online Admission
              </button>
              <button type="button" onClick={() => navigate('stories')} className="text-left hover:text-white cursor-pointer">
                Gallery &amp; Guides
              </button>
              <button type="button" onClick={() => navigate('admin')} className="text-left hover:text-white cursor-pointer">
                Staff Admin Panel
              </button>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs">
            <p className="font-bold text-white">Contact &amp; Channels</p>
            <p>Call / WhatsApp: {siteData.settings.phoneDisplay}</p>
            <p>Email: {siteData.settings.email}</p>
            <p className="text-slate-400">Facebook · TikTok · YouTube · Instagram (@ebenezer_ngama)</p>
            <p className="text-[11px] text-slate-400 pt-1">
              Kenya Data Protection Act compliant · Minor safety consent enforced.
            </p>
          </div>
        </div>
      </footer>

      {/* Compact Sticky WhatsApp Button (respects <=15% mobile height cap) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Ebenezer on WhatsApp"
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 h-11 text-xs sm:text-sm font-bold text-[#052E16] shadow-lg hover:bg-[#1FB857] transition-colors"
      >
        <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>WhatsApp Desk</span>
      </a>

      <OfflineIndicator />
    </div>
  );
}

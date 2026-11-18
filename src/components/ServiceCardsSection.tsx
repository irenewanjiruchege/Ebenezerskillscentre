import React, {useState} from 'react';
import {
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  MessageCircle,
  Monitor,
  Printer,
  Video,
} from 'lucide-react';
import {ServiceCategory} from '../types';

interface ServiceCardSpec {
  id: ServiceCategory;
  title: string;
  subtitle: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  icon: React.ReactNode;
  photoUrl?: string;
  photoAlt?: string;
  feeNote: string;
  summary: string;
  details: string[];
  actionLabel: string;
  targetView: 'programs' | 'printing' | 'admissions';
  whatsappMsg: string;
}

interface ServiceCardsSectionProps {
  whatsappIntl: string;
  onSelectService: (category: ServiceCategory, targetView: 'programs' | 'printing' | 'admissions') => void;
}

export const ServiceCardsSection: React.FC<ServiceCardsSectionProps> = ({
  whatsappIntl,
  onSelectService,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>('computer');

  const services: ServiceCardSpec[] = [
    {
      id: 'computer',
      title: '01. Introduction to Computers',
      subtitle: '6 Weeks · 4-Seat Practical Lab',
      accentBg: 'bg-[#1D4ED8]',
      accentText: 'text-[#1D4ED8]',
      accentBorder: 'border-[#1D4ED8]/25',
      icon: <Monitor className="w-5 h-5 text-white" aria-hidden="true" />,
      photoUrl: '/assets/photos/computer-training.jpg',
      photoAlt: 'Young man practising on a laptop at Ebenezer Computer Training',
      feeNote: 'KSh 5,000 · 6 Weeks',
      summary: 'Hands-on training covering MS Word, MS Excel, MS PowerPoint and MS Access, plus Internet and Online Security.',
      details: [
        'MS Word document formatting, letters & professional CVs',
        'MS Excel spreadsheets, formulas & practical budgets',
        'MS PowerPoint presentations & MS Access databases',
        'Internet skills, email, eCitizen & Online Security',
      ],
      actionLabel: 'View Course & Book Seat',
      targetView: 'programs',
      whatsappMsg: 'Hello Ebenezer, I would like to enrol in Introduction to Computers (6 weeks, KSh 5,000).',
    },
    {
      id: 'tuition',
      title: '02. Student Tuition',
      subtitle: 'CBC · Primary · JSS · Secondary · KCSE',
      accentBg: 'bg-[#15803D]',
      accentText: 'text-[#15803D]',
      accentBorder: 'border-[#15803D]/25',
      icon: <GraduationCap className="w-5 h-5 text-white" aria-hidden="true" />,
      photoUrl: '/assets/photos/student-tuition.jpg',
      photoAlt: 'Schoolgirl writing during focused student tuition',
      feeNote: 'From KSh 1,500 / mo',
      summary: 'Homework support, guided revision, and exam coaching for KPSEA, KJSEA, and KCSE candidates.',
      details: [
        'CBC Primary & KPSEA foundational revision (KSh 1,500/month)',
        'Junior Secondary (JSS) & KJSEA subject support (KSh 2,000/month)',
        'Secondary tuition & KCSE past-paper preparation (KSh 2,500/month)',
        'Daily drop-in homework supervision available (KSh 200/session)',
      ],
      actionLabel: 'Explore Tuition',
      targetView: 'programs',
      whatsappMsg: 'Hello Ebenezer, I want to enrol a student for CBC/JSS/KCSE Tuition.',
    },
    {
      id: 'reading',
      title: '03. Reading & English Classes',
      subtitle: 'Children, Youth & Adult Learners',
      accentBg: 'bg-[#6D28D9]',
      accentText: 'text-[#6D28D9]',
      accentBorder: 'border-[#6D28D9]/25',
      icon: <BookOpen className="w-5 h-5 text-white" aria-hidden="true" />,
      photoUrl: '/assets/photos/reading-classes.jpg',
      photoAlt: 'Young woman smiling while reading an open book',
      feeNote: 'From KSh 1,500 / mo',
      summary: 'Build reading fluency, comprehension, spoken English, and everyday communication confidence.',
      details: [
        'Phonics, reading aloud, and comprehension for school learners',
        'Supportive adult English lessons for work, business & travel',
        'Practice reading official letters, mobile messages, and forms',
        'Private or quiet small-group pace with patient tutors',
      ],
      actionLabel: 'See English Schedule',
      targetView: 'programs',
      whatsappMsg: 'Hello Ebenezer, I am interested in Reading & English Classes.',
    },
    {
      id: 'content',
      title: '04. Content Creation',
      subtitle: '2 Months (8 Weeks) · Practical Media Track',
      accentBg: 'bg-[#EA580C]',
      accentText: 'text-[#EA580C]',
      accentBorder: 'border-[#EA580C]/25',
      icon: <Video className="w-5 h-5 text-white" aria-hidden="true" />,
      photoUrl: '/assets/photos/content-creation.jpg',
      photoAlt: 'Young creator wearing headphones with studio microphone',
      feeNote: 'KSh 10,000 · 8 Weeks',
      summary: 'Week-by-week practical course: channel setup, phone shooting, CapCut video editing, Audacity podcasting, Canva design, growth & final project.',
      details: [
        'Weeks 1–2: YouTube/TikTok/FB/IG setup & phone shooting practicals',
        'Weeks 3–4: CapCut video editing, captions, thumbnails & 5-min YouTube edit',
        'Weeks 5–6: Audacity podcasting episode & Canva brand kit design',
        'Weeks 7–8: 30-day growth calendar, monetisation, channel launch & certificate',
      ],
      actionLabel: 'View 8-Week Syllabus',
      targetView: 'programs',
      whatsappMsg: 'Hello Ebenezer, tell me more about the 8-week Content Creation course (KSh 10,000).',
    },
    {
      id: 'printing',
      title: '05. Printing & Design',
      subtitle: 'Direct Centre Desk + Partner Specialised Jobs',
      accentBg: 'bg-[#0F766E]',
      accentText: 'text-[#0F766E]',
      accentBorder: 'border-[#0F766E]/25',
      icon: <Printer className="w-5 h-5 text-white" aria-hidden="true" />,
      photoUrl: '/assets/photos/printing-design.jpg',
      photoAlt: 'Printer and printed promotional materials and layouts',
      feeNote: 'Quote in 5 Steps',
      summary: 'Photocopying, CVs, church & funeral programmes, flyers, and partner-arranged banners & booklets.',
      details: [
        'Direct at Centre: A4 photocopying, typing, CVs, letters & basic flyers',
        'Church, wedding & funeral programmes formatted cleanly on tight deadlines',
        'Arranged by order through partners: Banners, bulk colour, business cards & binding',
        'Track your order live from Received → In design → Printing → Ready',
      ],
      actionLabel: 'Request Print Quote',
      targetView: 'printing',
      whatsappMsg: 'Hello Ebenezer, I would like a printing or design quotation.',
    },
    {
      id: 'enterprise',
      title: '06. Enterprise & Youth',
      subtitle: 'Ngama Youth Online-Earning & Business Support',
      accentBg: 'bg-[#0A2A66]',
      accentText: 'text-[#0A2A66]',
      accentBorder: 'border-[#0A2A66]/25',
      icon: <Briefcase className="w-5 h-5 text-white" aria-hidden="true" />,
      feeNote: 'From KSh 3,500',
      summary: 'Practical Virtual Assistant workflows, freelance readiness, and digital setup for small shops.',
      details: [
        '4-week Ngama Youth Online-Earning & Virtual Assistant track',
        'Spreadsheet bookkeeping, invoice templates & WhatsApp Business setup',
        'Real-world portfolio tasks and online safety / scam protection',
        'Cross-border trade & community group document support',
      ],
      actionLabel: 'Join Youth Track',
      targetView: 'programs',
      whatsappMsg: 'Hello Ebenezer, I want information on the Youth Online-Earning & Enterprise programme.',
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[#F58220]">Colour-Coded Services</p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[#0A2A66] text-balance">
            One Place. Practical Training &amp; Reliable Printing.
          </h2>
        </div>
        <p className="text-sm text-slate-600 max-w-md">
          Tap any service card below to inspect exact courses, deliverables, fees, or start a WhatsApp enquiry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((svc) => {
          const isOpen = expandedId === svc.id;
          return (
            <div
              key={svc.id}
              className={`group rounded-2xl border bg-white p-5 transition-colors flex flex-col justify-between ${
                isOpen ? `${svc.accentBorder} shadow-sm` : 'border-[#0A2A66]/10 hover:border-[#0A2A66]/25'
              }`}
            >
              <div>
                {svc.photoUrl && (
                  <div className="mb-4 overflow-hidden rounded-xl bg-slate-100 aspect-[16/10]">
                    <img
                      src={svc.photoUrl}
                      alt={svc.photoAlt || svc.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : svc.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <span
                      className={`mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${svc.accentBg}`}
                    >
                      {svc.icon}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#0A2A66] leading-snug">
                        {svc.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">{svc.subtitle}</p>
                    </div>
                  </div>
                  <span className="p-1 text-slate-400 shrink-0" aria-hidden="true">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <span className={`font-semibold tabular-nums ${svc.accentText}`}>{svc.feeNote}</span>
                  <span>Ngama Centre · On-site &amp; Assisted</span>
                </div>

                <p className="mt-2.5 text-sm text-slate-700 leading-relaxed">{svc.summary}</p>

                {isOpen && (
                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs sm:text-sm text-slate-700">
                    {svc.details.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${svc.accentBg}`} aria-hidden="true" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectService(svc.id, svc.targetView)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 whitespace-nowrap cursor-pointer ${svc.accentBg}`}
                >
                  {svc.actionLabel}
                </button>
                <a
                  href={`https://wa.me/${whatsappIntl}?text=${encodeURIComponent(svc.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#15803D]" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

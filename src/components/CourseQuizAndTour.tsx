import React, {useState} from 'react';
import {ArrowRight, CheckCircle2, Compass, MessageCircle, MoveHorizontal, RotateCcw} from 'lucide-react';
import {copy, Lang} from '../i18n';

interface CourseQuizAndTourProps {
  lang: Lang;
  whatsappIntl: string;
  onEnrolRecommended: (courseTitle: string) => void;
}

const TOUR_ZONES = [
  {
    id: 'reception',
    label: '01. Reception & Print Desk',
    capacity: 'Walk-in Document & Quotation Counter',
    equipment: 'High-speed A4 copier/printer, scanner, CV & form formatting workstation, order tracking ledger.',
    summary:
      'Submit documents for typing, photocopying, CV formatting, or drop off specifications for specialised partner banners and bulk colour runs.',
  },
  {
    id: 'lab',
    label: '02. 4-Seat Practical Training Lab',
    capacity: 'Maximum 4 Learners per Session',
    equipment: '4 dedicated desktop/laptop stations with MS Office, internet access, and direct instructor visibility.',
    summary:
      'Small capacity is intentional: every learner has their own computer screen and receives personal step-by-step guidance rather than sharing in a crowded room.',
  },
  {
    id: 'studio',
    label: '03. Content & Reading Corner',
    capacity: '1–3 Learners / Creator Session',
    equipment: 'Condenser podcast microphone, camera tripod stand, acoustic quiet desk, and graded reading shelves.',
    summary:
      'Used for YouTube & podcast recording classes, adult English conversation practice, and focused CBC/KJSEA/KCSE tutoring.',
  },
  {
    id: 'waiting',
    label: '04. Parent & Client Waiting Area',
    capacity: 'Comfortable Seating · Ngama Centre',
    equipment: 'Benches, printed brochure display, M-Pesa payment guide, and proof review table.',
    summary:
      'Parents can wait comfortably while students finish tuition or reading sessions, and institutional clients can inspect print proofs before final production.',
  },
];

export const CourseQuizAndTour: React.FC<CourseQuizAndTourProps> = ({
  lang,
  whatsappIntl,
  onEnrolRecommended,
}) => {
  const t = copy[lang];

  // 4-question Quiz State
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    ageGroup: '',
    goal: '',
    time: '',
    budget: '',
  });

  // Virtual Tour State
  const [activeZoneId, setActiveZoneId] = useState('lab');
  const activeZone = TOUR_ZONES.find((z) => z.id === activeZoneId) || TOUR_ZONES[1];

  // Before/After Slider State
  const [sliderPos, setSliderPos] = useState(52);
  const [beforeAfterTab, setBeforeAfterTab] = useState<'cv' | 'programme'>('cv');

  const quizQuestions = [
    {
      key: 'ageGroup' as const,
      question: '1. Who is the training for?',
      options: ['Primary / JSS Student', 'Secondary / KCSE Candidate', 'Youth / School Leaver', 'Adult / Working Professional'],
    },
    {
      key: 'goal' as const,
      question: '2. What is the main goal?',
      options: [
        'Learn Computers, Word & Excel',
        'Improve School Grades / Exams',
        'Speak & Read English Confidently',
        'Start YouTube, Podcast or Earn Online',
      ],
    },
    {
      key: 'time' as const,
      question: '3. Which schedule fits best?',
      options: ['Morning (8:30 AM – 11:30 AM)', 'Afternoon (1:30 PM – 4:30 PM)', 'Evening / After School', 'Weekends / School Holidays'],
    },
    {
      key: 'budget' as const,
      question: '4. Preferred fee range?',
      options: ['Up to KSh 2,500 / month', 'KSh 3,500 – 5,000', 'KSh 10,000 (2-Month Media Track)', 'Need Flexible / Custom Plan'],
    },
  ];

  const getRecommendation = () => {
    if (answers.goal.includes('School Grades') || answers.ageGroup.includes('Primary') || answers.ageGroup.includes('KCSE')) {
      return {
        title: answers.ageGroup.includes('Primary')
          ? 'Primary & CBC / JSS Tuition & Reading'
          : 'Secondary Tuition & KCSE Exam Preparation',
        fee: 'KSh 1,500 – 2,500 / month',
        schedule: answers.time || 'Flexible',
        why: 'Focused small-group coaching aligned with CBC, KPSEA, KJSEA, and KCSE revision.',
      };
    }
    if (answers.goal.includes('English')) {
      return {
        title: 'Reading & Adult English Confidence Classes',
        fee: 'KSh 1,500 – 2,000 / month',
        schedule: answers.time || 'Flexible',
        why: 'Supportive comprehension and spoken English lessons tailored to your pace.',
      };
    }
    if (answers.goal.includes('YouTube') || answers.goal.includes('Earn Online')) {
      const isMedia = answers.goal.includes('YouTube') || answers.budget.includes('10,000');
      return {
        title: isMedia
          ? 'Content Creation & Digital Media (8 Weeks)'
          : 'Ngama Youth Online-Earning & Virtual Assistant Track',
        fee: isMedia ? 'KSh 10,000 (2 Months / 8 Weeks)' : 'KSh 3,500 (4 Weeks)',
        schedule: answers.time || 'Practical 4-Seat Lab',
        why: isMedia
          ? 'Hands-on filming, CapCut, Audacity podcasting, Canva, growth & final channel launch.'
          : 'Hands-on virtual assistant skills and online client readiness in our Ngama lab.',
      };
    }
    return {
      title: 'Introduction to Computers',
      fee: 'KSh 5,000 (6 Weeks)',
      schedule: answers.time || 'Morning or Afternoon',
      why: 'Covers MS Word, MS Excel, MS PowerPoint, MS Access, plus Internet and Online Security in our 4-seat lab.',
    };
  };

  const quizDone = step >= 4;
  const rec = getRecommendation();
  const whatsappQuizMsg = `Hello Ebenezer, I took the Course Quiz:\n• Learner: ${answers.ageGroup}\n• Goal: ${answers.goal}\n• Time: ${answers.time}\n• Budget: ${answers.budget}\nRecommended: ${rec.title} (${rec.fee}). Please share next intake dates.`;

  return (
    <div className="space-y-14">
      {/* 1. 4-Question Course Finder Quiz */}
      <section id="course-quiz" className="bg-[#0A2A66] text-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-semibold tracking-wide text-[#F2B705]">4-Question Matcher</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-balance">{t.quizTitle}</h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">{t.quizSubtitle}</p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-300 tabular-nums">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    step > i ? 'bg-[#F58220]' : step === i ? 'bg-[#F2B705]' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-white/15 bg-[#071E4B] p-6 sm:p-8">
            {!quizDone ? (
              <div>
                <p className="text-xs text-[#F2B705] font-medium tabular-nums">
                  Question {step + 1} of 4
                </p>
                <h3 className="mt-1 text-xl font-bold text-white">{quizQuestions[step].question}</h3>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quizQuestions[step].options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        const key = quizQuestions[step].key;
                        setAnswers((prev) => ({...prev, [key]: opt}));
                        setStep((s) => s + 1);
                      }}
                      className="text-left rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm font-medium text-white hover:border-[#F58220] hover:bg-[#F58220]/15 transition-colors cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className="mt-5 text-xs text-slate-300 hover:text-white underline cursor-pointer"
                  >
                    Back to previous question
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F2B705]">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    Recommended Programme
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(0);
                      setAnswers({ageGroup: '', goal: '', time: '', budget: ''});
                    }}
                    className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    Retake
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-white">{rec.title}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#F58220] font-semibold tabular-nums">
                  <span>{rec.fee}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-200 font-normal">{rec.schedule}</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{rec.why}</p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/${whatsappIntl}?text=${encodeURIComponent(whatsappQuizMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-[#052E16] hover:bg-[#1FB857] transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Send Result to WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onEnrolRecommended(rec.title)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#F58220] px-5 py-3 text-sm font-bold text-[#071E4B] hover:bg-[#E06D0B] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Enrol Online Now</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Interactive Floor Plan Virtual Tour + Before/After Print Slider */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-14">
        {/* Virtual Tour */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F58220]">
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>Interactive Floor Plan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2A66] text-balance">{t.tourTitle}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{t.tourSubtitle}</p>

            <div className="rounded-2xl border border-[#0A2A66]/12 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                <span className="font-semibold text-[#F58220]">{activeZone.capacity}</span>
                <span>Ngama Facility</span>
              </div>
              <h3 className="text-xl font-bold text-[#0A2A66]">{activeZone.label}</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{activeZone.summary}</p>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                <span className="font-semibold text-[#0A2A66]">Equipment &amp; Setup: </span>
                {activeZone.equipment}
              </div>
            </div>
          </div>

          {/* Clickable SVG Architectural Floor Plan */}
          <div className="lg:col-span-7 rounded-2xl border border-[#0A2A66]/12 bg-white p-4 sm:p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {TOUR_ZONES.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setActiveZoneId(z.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    activeZoneId === z.id
                      ? 'bg-[#0A2A66] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>

            <svg
              viewBox="0 0 640 340"
              className="w-full h-auto rounded-xl border border-slate-200 bg-[#FAF7F2]"
              role="img"
              aria-label="Interactive floor plan of Ebenezer Technology and Skills Centre"
            >
              {/* Outer Walls */}
              <rect x="16" y="16" width="608" height="308" rx="8" fill="#FFFFFF" stroke="#0A2A66" strokeWidth="4" />

              {/* Zone 1: Reception & Print Desk */}
              <g onClick={() => setActiveZoneId('reception')} className="cursor-pointer">
                <rect
                  x="26"
                  y="26"
                  width="270"
                  height="140"
                  rx="6"
                  fill={activeZoneId === 'reception' ? '#0F766E' : '#F1F5F9'}
                  fillOpacity={activeZoneId === 'reception' ? '0.16' : '1'}
                  stroke={activeZoneId === 'reception' ? '#0F766E' : '#CBD5E1'}
                  strokeWidth="2"
                />
                <text x="42" y="54" fill="#0A2A66" fontSize="14" fontWeight="700">
                  01. Reception &amp; Print Desk
                </text>
                <text x="42" y="76" fill="#475569" fontSize="11">
                  A4 Copier · Scanner · Quotation Desk
                </text>
                <rect x="44" y="100" width="110" height="38" rx="4" fill="#0A2A66" fillOpacity="0.12" />
                <text x="54" y="123" fill="#0A2A66" fontSize="10" fontWeight="600">
                  Service Counter
                </text>
              </g>

              {/* Zone 2: 4-Seat Training Lab */}
              <g onClick={() => setActiveZoneId('lab')} className="cursor-pointer">
                <rect
                  x="310"
                  y="26"
                  width="304"
                  height="180"
                  rx="6"
                  fill={activeZoneId === 'lab' ? '#1D4ED8' : '#F1F5F9'}
                  fillOpacity={activeZoneId === 'lab' ? '0.14' : '1'}
                  stroke={activeZoneId === 'lab' ? '#1D4ED8' : '#CBD5E1'}
                  strokeWidth="2"
                />
                <text x="328" y="54" fill="#0A2A66" fontSize="14" fontWeight="700">
                  02. 4-Seat Practical Training Lab
                </text>
                <text x="328" y="76" fill="#475569" fontSize="11">
                  1 Computer per Learner · Instructor Desk
                </text>
                {[0, 1, 2, 3].map((seat) => (
                  <g key={seat} transform={`translate(${332 + seat * 68}, 98)`}>
                    <rect width="54" height="44" rx="4" fill="#1D4ED8" fillOpacity="0.18" stroke="#1D4ED8" strokeWidth="1.5" />
                    <text x="11" y="26" fill="#0A2A66" fontSize="10" fontWeight="700">
                      PC {seat + 1}
                    </text>
                  </g>
                ))}
                <rect x="405" y="160" width="120" height="28" rx="4" fill="#F58220" fillOpacity="0.25" />
                <text x="424" y="178" fill="#0A2A66" fontSize="10" fontWeight="700">
                  Instructor Station
                </text>
              </g>

              {/* Zone 4: Waiting Area */}
              <g onClick={() => setActiveZoneId('waiting')} className="cursor-pointer">
                <rect
                  x="26"
                  y="180"
                  width="270"
                  height="134"
                  rx="6"
                  fill={activeZoneId === 'waiting' ? '#F58220' : '#F1F5F9'}
                  fillOpacity={activeZoneId === 'waiting' ? '0.16' : '1'}
                  stroke={activeZoneId === 'waiting' ? '#F58220' : '#CBD5E1'}
                  strokeWidth="2"
                />
                <text x="42" y="210" fill="#0A2A66" fontSize="14" fontWeight="700">
                  04. Client &amp; Parent Waiting Area
                </text>
                <text x="42" y="232" fill="#475569" fontSize="11">
                  Main Entrance · Proof Review Table
                </text>
                <rect x="44" y="255" width="90" height="22" rx="4" fill="#0A2A66" fillOpacity="0.12" />
                <rect x="150" y="255" width="90" height="22" rx="4" fill="#0A2A66" fillOpacity="0.12" />
              </g>

              {/* Zone 3: Content & Reading Corner */}
              <g onClick={() => setActiveZoneId('studio')} className="cursor-pointer">
                <rect
                  x="310"
                  y="218"
                  width="304"
                  height="96"
                  rx="6"
                  fill={activeZoneId === 'studio' ? '#EA580C' : '#F1F5F9'}
                  fillOpacity={activeZoneId === 'studio' ? '0.16' : '1'}
                  stroke={activeZoneId === 'studio' ? '#EA580C' : '#CBD5E1'}
                  strokeWidth="2"
                />
                <text x="328" y="246" fill="#0A2A66" fontSize="14" fontWeight="700">
                  03. Content Studio &amp; Reading Desk
                </text>
                <text x="328" y="268" fill="#475569" fontSize="11">
                  Podcast Mic · Camera Stand · CBC &amp; English Books
                </text>
              </g>

              {/* Entrance Label */}
              <rect x="120" y="314" width="84" height="14" rx="2" fill="#F58220" />
              <text x="132" y="324" fill="#FFFFFF" fontSize="9" fontWeight="700">
                ENTRANCE
              </text>
            </svg>
          </div>
        </div>

        {/* Before / After Print & Document Comparison Slider */}
        <div className="rounded-2xl border border-[#0A2A66]/12 bg-white p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-[#0F766E]">Design &amp; Formatting Quality</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[#0A2A66] text-balance">
                {t.beforeAfterTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{t.beforeAfterSubtitle}</p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setBeforeAfterTab('cv')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  beforeAfterTab === 'cv' ? 'bg-white text-[#0A2A66] shadow-sm' : 'text-slate-600'
                }`}
              >
                Job CV Makeover
              </button>
              <button
                type="button"
                onClick={() => setBeforeAfterTab('programme')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  beforeAfterTab === 'programme' ? 'bg-white text-[#0A2A66] shadow-sm' : 'text-slate-600'
                }`}
              >
                Event Programme Layout
              </button>
            </div>
          </div>

          <div className="relative h-[300px] sm:h-[340px] w-full overflow-hidden rounded-xl border border-slate-200 select-none bg-slate-50">
            {/* AFTER (Finished Ebenezer Layout - Full Layer) */}
            <div className="absolute inset-0 bg-[#FAF7F2] p-6 sm:p-8 flex flex-col justify-between">
              <div className="border-b-2 border-[#0A2A66] pb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#F58220]">
                    {beforeAfterTab === 'cv' ? 'CURRICULUM VITAE · PRINT-READY' : 'SUNDAY THANKSGIVING & HARVEST PROGRAMME'}
                  </p>
                  <h4 className="text-lg sm:text-xl font-bold text-[#0A2A66]">
                    {beforeAfterTab === 'cv' ? 'Mary Naserian Leshao' : 'Ngama Community Fellowship · Order of Service'}
                  </h4>
                </div>
                <span className="text-xs font-mono text-[#0F766E] font-semibold">AFTER · EBENEZER</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700 my-auto">
                <div className="space-y-1.5">
                  <p className="font-bold text-[#0A2A66]">
                    {beforeAfterTab === 'cv' ? 'Core Competencies' : 'Morning Worship (9:00 AM – 11:30 AM)'}
                  </p>
                  <p>• {beforeAfterTab === 'cv' ? 'MS Word, Excel & Record Keeping' : 'Opening Prayer & Praise Choir'}</p>
                  <p>• {beforeAfterTab === 'cv' ? 'Customer Care & Cash Handling' : 'Scripture Reading & Youth Presentation'}</p>
                  <p>• {beforeAfterTab === 'cv' ? 'Bilingual: English, Kiswahili & Maa' : 'Sermon & Community Announcements'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="font-bold text-[#0A2A66]">
                    {beforeAfterTab === 'cv' ? 'Work & Community History' : 'Printing Specifications'}
                  </p>
                  <p>• {beforeAfterTab === 'cv' ? 'Sales Assistant, Illasit Hardware (2024–2026)' : 'A5 Folded · 130gsm Gloss Paper'}</p>
                  <p>• {beforeAfterTab === 'cv' ? 'Volunteer Secretary, Ngama Youth Group' : 'Full-Colour Cover & Crisp Typography'}</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 border-t border-slate-200 pt-2 flex justify-between">
                <span>Formatted &amp; Checked at Ebenezer Ngama</span>
                <span className="font-semibold text-[#0A2A66]">Clean Margins · PDF &amp; Print Copy</span>
              </div>
            </div>

            {/* BEFORE (Clipped Left Layer) */}
            <div
              className="absolute inset-0 bg-[#FEFCE8] p-6 sm:p-8 flex flex-col justify-between border-r-2 border-[#F58220]"
              style={{clipPath: `inset(0 ${100 - sliderPos}% 0 0)`}}
            >
              <div className="flex items-center justify-between border-b border-dashed border-slate-400 pb-2">
                <span className="font-mono text-xs text-slate-500">BEFORE · RAW HANDWRITTEN / UNFORMATTED DRAFT</span>
              </div>
              <div className="font-mono text-xs sm:text-sm text-slate-600 space-y-2 my-auto leading-relaxed">
                <p>
                  {beforeAfterTab === 'cv'
                    ? 'name: mary leshao... phone 07xx... i finished school 2023 and worked in shop in illasit...'
                    : 'program sunday... 1. pray 2. songs 3. choir 4. preach... please type fast need 100 copies...'}
                </p>
                <p className="text-slate-400">
                  [Uneven spacing, missing headings, spelling typos, unaligned phone numbers &amp; margins]
                </p>
              </div>
              <div className="font-mono text-xs text-slate-400">Draft brought on paper or WhatsApp voice note</div>
            </div>

            {/* Slider Handle */}
            <div
              className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-[#F58220]"
              style={{left: `${sliderPos}%`}}
            >
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#0A2A66] text-white shadow-md flex items-center justify-center border-2 border-[#F58220]">
                <MoveHorizontal className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>

            <input
              type="range"
              min={10}
              max={90}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Drag to compare before and after document design"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

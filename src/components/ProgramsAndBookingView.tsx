import React, {useEffect, useState} from 'react';
import {Calendar, CheckCircle2, Clock, MessageCircle, Users} from 'lucide-react';
import {CourseItem, ServiceCategory} from '../types';

interface ProgramsAndBookingViewProps {
  courses: CourseItem[];
  initialCategory?: ServiceCategory | 'all';
  whatsappIntl: string;
  onEnrolCourse: (courseTitle: string) => void;
}

interface AvailabilitySlot {
  session: 'Morning' | 'Afternoon' | 'Evening';
  capacity: number;
  booked: number;
  remaining: number;
}

const CATEGORY_META: Record<
  Exclude<ServiceCategory, 'printing'> | 'all',
  {label: string; accent: string; badgeBg: string; note?: string; photoUrl?: string; photoAlt?: string}
> = {
  all: {label: 'All Programmes', accent: 'text-[#0A2A66]', badgeBg: 'bg-[#0A2A66]'},
  computer: {
    label: 'Computer Training',
    accent: 'text-[#1D4ED8]',
    badgeBg: 'bg-[#1D4ED8]',
    note: 'Introduction to Computers (6 Weeks · KSh 5,000) — covers MS Word, MS Excel, MS PowerPoint, MS Access, plus Internet and Online Security.',
    photoUrl: '/assets/photos/computer-training.jpg',
    photoAlt: 'Young man working at a laptop during Computer Training',
  },
  tuition: {
    label: 'Student Tuition',
    accent: 'text-[#15803D]',
    badgeBg: 'bg-[#15803D]',
    note: 'Aligned with Kenya’s current CBC (Primary / KPSEA), JSS (KJSEA), Secondary & KCSE exam pathways.',
    photoUrl: '/assets/photos/student-tuition.jpg',
    photoAlt: 'Schoolgirl writing during focused Student Tuition',
  },
  reading: {
    label: 'Reading & English',
    accent: 'text-[#6D28D9]',
    badgeBg: 'bg-[#6D28D9]',
    note: 'Phonics, comprehension, spoken confidence, and supportive adult English lessons.',
    photoUrl: '/assets/photos/reading-classes.jpg',
    photoAlt: 'Young woman reading a book during Reading & English classes',
  },
  content: {
    label: 'Content Creation',
    accent: 'text-[#EA580C]',
    badgeBg: 'bg-[#EA580C]',
    note: '2-Month (8-Week) Practical Media Course · KSh 10,000 · From channel setup and phone filming to CapCut, Audacity, Canva, growth & certificate.',
    photoUrl: '/assets/photos/content-creation.jpg',
    photoAlt: 'Young creator wearing headphones with studio microphone for Content Creation',
  },
  enterprise: {
    label: 'Enterprise & Youth',
    accent: 'text-[#0A2A66]',
    badgeBg: 'bg-[#0A2A66]',
    note: 'Ngama Youth Online-Earning Track, Virtual Assistant basics & small-business digital setup.',
  },
};

const CATEGORY_PHOTOS: Record<string, {url: string; alt: string}> = {
  computer: {
    url: '/assets/photos/computer-training.jpg',
    alt: 'Young man at laptop in Computer Training',
  },
  tuition: {
    url: '/assets/photos/student-tuition.jpg',
    alt: 'Schoolgirl writing during Student Tuition',
  },
  reading: {
    url: '/assets/photos/reading-classes.jpg',
    alt: 'Young woman reading a book',
  },
  content: {
    url: '/assets/photos/content-creation.jpg',
    alt: 'Young man with headphones and microphone recording content',
  },
};

export const ProgramsAndBookingView: React.FC<ProgramsAndBookingViewProps> = ({
  courses,
  initialCategory = 'all',
  whatsappIntl,
  onEnrolCourse,
}) => {
  const safeInit = initialCategory === 'printing' ? 'all' : initialCategory;
  const [filter, setFilter] = useState<Exclude<ServiceCategory, 'printing'> | 'all'>(safeInit);

  // 4-Seat Booking Calendar State
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSession, setSelectedSession] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
  const [learnerName, setLearnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('Introduction to Computers (6 Weeks)');
  const [bookingMsg, setBookingMsg] = useState<{type: 'ok' | 'err'; text: string} | null>(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  useEffect(() => {
    setFilter(initialCategory === 'printing' ? 'all' : initialCategory);
  }, [initialCategory]);

  const fetchAvailability = async (date: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/bookings?date=${encodeURIComponent(date)}`);
      if (res.ok) {
        const data = await res.json();
        setAvailability(data.availability || []);
      }
    } catch {
      setAvailability([
        {session: 'Morning', capacity: 4, booked: 1, remaining: 3},
        {session: 'Afternoon', capacity: 4, booked: 0, remaining: 4},
        {session: 'Evening', capacity: 4, booked: 0, remaining: 4},
      ]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchAvailability(selectedDate);
  }, [selectedDate]);

  const handleBookSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingMsg(null);
    if (!learnerName.trim() || phone.trim().length < 7) {
      setBookingMsg({type: 'err', text: 'Enter your full name and a valid phone/WhatsApp number.'});
      return;
    }
    setSubmittingBooking(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          date: selectedDate,
          session: selectedSession,
          learnerName: learnerName.trim(),
          phone: phone.trim(),
          topic,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBookingMsg({type: 'err', text: data.error || 'Could not reserve seat.'});
      } else {
        setBookingMsg({
          type: 'ok',
          text: `Seat reserved for ${data.booking.learnerName} on ${data.booking.date} (${data.booking.session} session).`,
        });
        setLearnerName('');
        setPhone('');
        fetchAvailability(selectedDate);
      }
    } catch {
      setBookingMsg({type: 'err', text: 'Network unavailable. Please call or WhatsApp 0714 490545 to hold your seat.'});
    } finally {
      setSubmittingBooking(false);
    }
  };

  const filteredCourses = courses.filter((c) => (filter === 'all' ? true : c.category === filter));
  const activeMeta = CATEGORY_META[filter];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 space-y-14">
      {/* Header & Filter Bar */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className={activeMeta.photoUrl ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <p className="text-xs font-semibold tracking-wide text-[#F58220]">Courses, Tuition &amp; Fee Guide</p>
            <h2 className="mt-1 text-3xl sm:text-4xl font-bold text-[#0A2A66] text-balance">
              {filter === 'all' ? 'Training Programmes & Schedules' : activeMeta.label}
            </h2>
            {activeMeta.note && <p className="mt-2 text-sm text-slate-600 max-w-2xl">{activeMeta.note}</p>}
          </div>

          {activeMeta.photoUrl && (
            <div className="lg:col-span-5">
              <div className="group overflow-hidden rounded-2xl border border-[#0A2A66]/12 bg-white aspect-[16/10] shadow-sm">
                <img
                  src={activeMeta.photoUrl}
                  alt={activeMeta.photoAlt || activeMeta.label}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          )}
        </div>

        {/* Segmented Filter Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-[#0A2A66]/10 rounded-xl w-fit">
          {(Object.keys(CATEGORY_META) as Array<keyof typeof CATEGORY_META>).map((key) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active ? `${CATEGORY_META[key].badgeBg} text-white` : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {CATEGORY_META[key].label}
              </button>
            );
          })}
        </div>

        {/* Courses Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const meta = CATEGORY_META[course.category as Exclude<ServiceCategory, 'printing'>] || CATEGORY_META.all;
            const cardPhoto = CATEGORY_PHOTOS[course.category];
            const hasSyllabus = Boolean(course.syllabus && course.syllabus.length > 0);

            return (
              <article
                key={course.id}
                className={`group rounded-2xl border border-[#0A2A66]/12 bg-white p-6 flex flex-col justify-between ${
                  hasSyllabus ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
              >
                <div>
                  {cardPhoto && !hasSyllabus && filter === 'all' && (
                    <div className="mb-4 overflow-hidden rounded-xl bg-slate-100 aspect-[16/10]">
                      <img
                        src={cardPhoto.url}
                        alt={cardPhoto.alt}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span className={`font-semibold ${meta.accent}`}>{meta.label}</span>
                        <span>{course.level}</span>
                      </div>

                      <h3 className="mt-2 font-display text-lg sm:text-xl font-bold text-[#0A2A66] leading-snug">
                        {course.title}
                      </h3>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 border-y border-slate-100 py-2.5 tabular-nums">
                        <span className="font-bold text-sm text-[#0A2A66]">{course.fee}</span>
                        <span aria-hidden="true">·</span>
                        <span>{course.duration}</span>
                        {course.schedule && course.schedule.trim().length > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{course.schedule}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {hasSyllabus && cardPhoto && (
                      <div className="lg:w-72 shrink-0 overflow-hidden rounded-xl bg-slate-100 aspect-[16/10]">
                        <img
                          src={cardPhoto.url}
                          alt={cardPhoto.alt}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                  </div>

                  {hasSyllabus && course.syllabus ? (
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.syllabus.map((w) => (
                        <div
                          key={w.week}
                          className="rounded-xl border border-[#EA580C]/20 bg-[#FAF7F2] p-4 space-y-1.5"
                        >
                          <p className="text-xs font-bold text-[#EA580C]">{w.week}</p>
                          <p className="text-xs sm:text-sm text-[#0A2A66] font-medium leading-snug">{w.topic}</p>
                          <p className="text-xs text-slate-700">
                            <span className="font-semibold text-[#0A2A66]">Practical: </span>
                            {w.practical}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="mt-3.5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                      {course.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${meta.badgeBg}`} aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onEnrolCourse(`${course.title} (${course.duration} · ${course.fee})`)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer ${meta.badgeBg}`}
                  >
                    Enrol in Course
                  </button>
                  <a
                    href={`https://wa.me/${whatsappIntl}?text=${encodeURIComponent(
                      `Hello Ebenezer, I want to join "${course.title}" (${course.duration}, ${course.fee}). Please share the next start date.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#15803D]" aria-hidden="true" />
                    <span>Ask Fee / Slot</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* 4-Seat Lab Class Booking Calendar */}
      <section className="rounded-2xl border border-[#0A2A66]/12 bg-white p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1D4ED8]">
              <Users className="w-4 h-4" aria-hidden="true" />
              <span>4-Seat Lab Capacity</span>
            </div>
            <h3 className="text-2xl font-bold text-[#0A2A66] text-balance">
              Book a Practical Seat in Advance
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our Ngama training room has <strong>4 dedicated computer stations</strong> so no learner shares a screen. Check live seat availability for your preferred date and reserve a free first lesson or practice slot.
            </p>

            <div>
              <label htmlFor="booking-date" className="block text-xs font-semibold text-[#0A2A66] mb-1.5">
                Select Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="booking-date"
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 text-sm text-[#0A2A66] focus:border-[#0A2A66] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[#0A2A66]">
                {loadingSlots ? 'Checking lab seats...' : `Available Seats on ${selectedDate}`}
              </p>
              {availability.map((slot) => {
                const isSelected = selectedSession === slot.session;
                const isFull = slot.remaining === 0;
                const timeLabel =
                  slot.session === 'Morning'
                    ? '08:30 AM – 11:30 AM'
                    : slot.session === 'Afternoon'
                      ? '01:30 PM – 04:30 PM'
                      : '05:00 PM – 07:00 PM';
                return (
                  <button
                    key={slot.session}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedSession(slot.session)}
                    className={`w-full flex items-center justify-between rounded-xl border p-3.5 text-left transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSelected
                        ? 'border-[#0A2A66] bg-[#0A2A66]/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-[#0A2A66]">{slot.session} Session</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>{timeLabel}</span>
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        isFull ? 'text-red-600' : 'text-[#15803D]'
                      }`}
                    >
                      {isFull ? 'Full (0/4)' : `${slot.remaining} of 4 seats free`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleBookSeat} className="lg:col-span-7 rounded-xl bg-[#FAF7F2] border border-[#0A2A66]/10 p-5 sm:p-6 space-y-4">
            <h4 className="text-lg font-bold text-[#0A2A66]">
              Reserve {selectedSession} Seat · {selectedDate}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bk-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Learner Full Name *
                </label>
                <input
                  id="bk-name"
                  type="text"
                  required
                  value={learnerName}
                  onChange={(e) => setLearnerName(e.target.value)}
                  placeholder="e.g., Faith Naserian"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-[#0A2A66] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="bk-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  id="bk-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., 0714 490545"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-[#0A2A66] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bk-topic" className="block text-xs font-semibold text-slate-700 mb-1">
                What would you like to focus on?
              </label>
              <select
                id="bk-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-[#0A2A66] focus:outline-none"
              >
                <option value="Introduction to Computers (6 Weeks)">Introduction to Computers (6 Weeks · KSh 5,000)</option>
                <option value="Free Trial Computer Lesson">Free First Computer Lesson (Trial)</option>
                <option value="Student Tuition / Revision">CBC / JSS / KCSE Tuition Session</option>
                <option value="Reading & English Class">Reading &amp; English Practice</option>
                <option value="Content Creation (8 Weeks)">Content Creation &amp; Digital Media (8 Weeks · KSh 10,000)</option>
                <option value="Youth Online-Earning Track">Youth Online-Earning &amp; VA Practice</option>
              </select>
            </div>

            {bookingMsg && (
              <div
                role="status"
                className={`rounded-lg p-3 text-xs font-medium flex items-start gap-2 ${
                  bookingMsg.type === 'ok'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {bookingMsg.type === 'ok' && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />}
                <span>{bookingMsg.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submittingBooking}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0A2A66] text-sm font-bold text-white hover:bg-[#071E4B] transition-colors disabled:opacity-60 cursor-pointer"
            >
              {submittingBooking ? 'Reserving Seat...' : 'Confirm Lab Seat'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

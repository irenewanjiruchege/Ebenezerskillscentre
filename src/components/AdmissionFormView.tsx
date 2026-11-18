import React, {useEffect, useState} from 'react';
import {CheckCircle2, MessageCircle, Printer, ShieldCheck} from 'lucide-react';
import {AdmissionRecord, CentreSettings} from '../types';

interface AdmissionFormViewProps {
  settings: CentreSettings;
  preselectedCourse?: string;
}

const PROGRAMME_OPTIONS = [
  'Introduction to Computers — 6 Weeks (KSh 5,000)',
  'Student Tuition — CBC (Primary)',
  'Student Tuition — JSS (Junior Secondary)',
  'Student Tuition — Secondary / KCSE',
  'Reading & Comprehension Classes',
  'Adult English & Speaking Classes',
  'Content Creation & Digital Media — 2 Months / 8 Weeks (KSh 10,000)',
  'Design & Printing Training',
  'Enterprise & Ngama Youth Online-Earning Track',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AdmissionFormView: React.FC<AdmissionFormViewProps> = ({
  settings,
  preselectedCourse = '',
}) => {
  const [form, setForm] = useState({
    intakeTerm: 'Current Intake 2026',
    fullName: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    idOrBirthCert: '',
    phone: '',
    email: '',
    address: '',
    townArea: 'Ngama',
    schoolOrOccupation: '',
    highestLevel: '',
    programmes: preselectedCourse ? [preselectedCourse] : ([] as string[]),
    specificCourse: preselectedCourse,
    preferredStartDate: new Date().toISOString().slice(0, 10),
    preferredDays: ['Mon', 'Wed', 'Fri'] as string[],
    preferredTime: 'Morning' as 'Morning' | 'Afternoon' | 'Evening',
    trainingMode: 'Group' as 'Individual' | 'Group' | 'Holiday/Short Course',
    expectedDuration: '6 Weeks',
    isMinor: false,
    guardianName: '',
    guardianRelationship: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianAddress: '',
    guardianAltContact: '',
    declarationAccepted: false,
    privacyAccepted: false,
  });

  useEffect(() => {
    if (preselectedCourse) {
      setForm((prev) => ({
        ...prev,
        specificCourse: preselectedCourse,
        programmes: prev.programmes.includes(preselectedCourse)
          ? prev.programmes
          : [...prev.programmes, preselectedCourse],
      }));
    }
  }, [preselectedCourse]);

  // Auto-detect minor if DOB indicates under 18
  useEffect(() => {
    if (!form.dateOfBirth) return;
    const dob = new Date(form.dateOfBirth);
    if (isNaN(dob.getTime())) return;
    const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 18 && !form.isMinor) {
      setForm((prev) => ({...prev, isMinor: true}));
    }
  }, [form.dateOfBirth, form.isMinor]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState<AdmissionRecord | null>(null);

  const toggleProgramme = (item: string) => {
    setForm((prev) => ({
      ...prev,
      programmes: prev.programmes.includes(item)
        ? prev.programmes.filter((p) => p !== item)
        : [...prev.programmes, item],
    }));
  };

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter((d) => d !== day)
        : [...prev.preferredDays, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.fullName.trim() || form.phone.trim().length < 7) {
      setErrorMsg('Please enter the learner full name and a valid phone/WhatsApp number.');
      return;
    }
    if (form.programmes.length === 0) {
      setErrorMsg('Select at least one programme or service in Section 2.');
      return;
    }
    if (form.isMinor && (!form.guardianName.trim() || form.guardianPhone.trim().length < 7)) {
      setErrorMsg('Parent/Guardian name and phone number are required for learners under 18.');
      return;
    }
    if (!form.declarationAccepted || !form.privacyAccepted) {
      setErrorMsg('Please confirm the declaration and Kenya Data Protection Act privacy notice.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Submission failed.');
      } else {
        setSubmitted(data.admission);
      }
    } catch {
      setErrorMsg('Network error. Please submit directly via WhatsApp 0714 490545.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const waText = `Hello Ebenezer, I have submitted Online Admission Form ${submitted.admissionNo}.\n• Learner: ${submitted.fullName}\n• Phone: ${submitted.phone}\n• Programmes: ${submitted.programmes.join(', ')}\n• Preferred Time: ${submitted.preferredTime} (${submitted.trainingMode}).`;
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            <span>Admission &amp; Registration Received</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2A66]">
            Admission No: <span className="font-mono text-[#F58220]">{submitted.admissionNo}</span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Thank you, <strong>{submitted.fullName}</strong>. Your registration has been logged at the Ebenezer Ngama office dashboard. Send a one-tap WhatsApp confirmation below so our administrator confirms your start date and seat.
          </p>

          <div className="rounded-xl bg-[#FAF7F2] border border-slate-200 p-4 text-xs sm:text-sm space-y-1.5">
            <p>
              <strong>Programmes:</strong> {submitted.programmes.join(', ')}
            </p>
            <p>
              <strong>Preference:</strong> {submitted.preferredTime} · {submitted.trainingMode} ·{' '}
              {submitted.preferredDays.join(', ')}
            </p>
            <p>
              <strong>Town / Area:</strong> {submitted.townArea}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`https://wa.me/${settings.whatsappIntl}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-[#052E16] hover:bg-[#1FB857]"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Confirm on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-[#0A2A66] hover:bg-slate-50 cursor-pointer"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={() => setSubmitted(null)}
              className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-[#0A2A66] cursor-pointer"
            >
              Register Another Learner
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#0A2A66]/15 pb-5">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[#F58220]">Online Registration</p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[#0A2A66]">
            Admission &amp; Registration Form
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Official digital registration form for Ebenezer Technology &amp; Skills Centre, Ngama. Takes under 3 minutes.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Student / Learner Details */}
        <section className="rounded-2xl border border-[#0A2A66]/12 bg-white p-6 space-y-4">
          <h3 className="text-base font-bold text-white bg-[#0A2A66] px-4 py-2 rounded-lg">
            1. Student / Learner Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({...form, fullName: e.target.value})}
                placeholder="First, Middle and Surname"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => setForm({...form, dateOfBirth: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <div className="flex items-center gap-4 py-2 text-sm">
                {(['Male', 'Female', 'Other'] as const).map((g) => (
                  <label key={g} className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={form.gender === g}
                      onChange={() => setForm({...form, gender: g})}
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                placeholder="07xx xxx xxx"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ID / Birth Certificate No.</label>
              <input
                type="text"
                value={form.idOrBirthCert}
                onChange={(e) => setForm({...form, idOrBirthCert: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email (optional)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Town / Area</label>
              <input
                type="text"
                value={form.townArea}
                onChange={(e) => setForm({...form, townArea: e.target.value})}
                placeholder="Ngama / Illasit / Kimana / Loitokitok / Tarakea"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">School / Institution / Occupation</label>
              <input
                type="text"
                value={form.schoolOrOccupation}
                onChange={(e) => setForm({...form, schoolOrOccupation: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Class / Level</label>
              <input
                type="text"
                value={form.highestLevel}
                onChange={(e) => setForm({...form, highestLevel: e.target.value})}
                placeholder="e.g., Grade 8, Form 4, KCSE"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Programme Applied For */}
        <section className="rounded-2xl border border-[#0A2A66]/12 bg-white p-6 space-y-4">
          <h3 className="text-base font-bold text-white bg-[#0A2A66] px-4 py-2 rounded-lg">
            2. Programme / Service Applied For *
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PROGRAMME_OPTIONS.map((prog) => (
              <label
                key={prog}
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-sm cursor-pointer transition-colors ${
                  form.programmes.includes(prog)
                    ? 'border-[#0A2A66] bg-[#0A2A66]/5 font-medium text-[#0A2A66]'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.programmes.includes(prog)}
                  onChange={() => toggleProgramme(prog)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300"
                />
                <span>{prog}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Specific Course / Subject / Skill Requested
            </label>
            <input
              type="text"
              value={form.specificCourse}
              onChange={(e) => setForm({...form, specificCourse: e.target.value})}
              placeholder="e.g., MS Excel, Form 4 Maths & Chemistry, Adult English"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />
          </div>
        </section>

        {/* Section 3: Course / Training Preference */}
        <section className="rounded-2xl border border-[#0A2A66]/12 bg-white p-6 space-y-4">
          <h3 className="text-base font-bold text-white bg-[#0A2A66] px-4 py-2 rounded-lg">
            3. Course / Training Preference
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Start Date</label>
              <input
                type="date"
                value={form.preferredStartDate}
                onChange={(e) => setForm({...form, preferredStartDate: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time</label>
              <select
                value={form.preferredTime}
                onChange={(e) =>
                  setForm({...form, preferredTime: e.target.value as 'Morning' | 'Afternoon' | 'Evening'})
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              >
                <option value="Morning">Morning (8:30 AM – 11:30 AM)</option>
                <option value="Afternoon">Afternoon (1:30 PM – 4:30 PM)</option>
                <option value="Evening">Evening (5:00 PM – 7:00 PM)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Training Mode</label>
              <select
                value={form.trainingMode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    trainingMode: e.target.value as 'Individual' | 'Group' | 'Holiday/Short Course',
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              >
                <option value="Group">Small Group (Max 4 Seats)</option>
                <option value="Individual">Individual 1-on-1</option>
                <option value="Holiday/Short Course">Holiday / Short Course</option>
              </select>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Preferred Days</p>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => {
                const checked = form.preferredDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                      checked
                        ? 'bg-[#0A2A66] text-white border-[#0A2A66]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 4: Parent / Guardian / Emergency Contact */}
        <section className="rounded-2xl border border-[#0A2A66]/12 bg-white p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0A2A66] text-white px-4 py-2 rounded-lg">
            <h3 className="text-base font-bold">4. Parent / Guardian / Emergency Contact</h3>
            <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={form.isMinor}
                onChange={(e) => setForm({...form, isMinor: e.target.checked})}
              />
              <span>Learner is under 18 (Minor)</span>
            </label>
          </div>
          {form.isMinor && (
            <p className="text-xs font-medium text-[#EA580C]">
              Child Safety Requirement: Parent or guardian details below are mandatory for learners under 18.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent / Guardian Full Name {form.isMinor ? '*' : ''}
              </label>
              <input
                type="text"
                required={form.isMinor}
                value={form.guardianName}
                onChange={(e) => setForm({...form, guardianName: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
              <input
                type="text"
                value={form.guardianRelationship}
                onChange={(e) => setForm({...form, guardianRelationship: e.target.value})}
                placeholder="Parent / Guardian / Sponsor"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Guardian Phone / WhatsApp {form.isMinor ? '*' : ''}
              </label>
              <input
                type="tel"
                required={form.isMinor}
                value={form.guardianPhone}
                onChange={(e) => setForm({...form, guardianPhone: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alternative Emergency Contact</label>
              <input
                type="text"
                value={form.guardianAltContact}
                onChange={(e) => setForm({...form, guardianAltContact: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Section 5: Declaration & Kenya Data Protection Act Compliance */}
        <section className="rounded-2xl border border-[#0A2A66]/12 bg-white p-6 space-y-4">
          <h3 className="text-base font-bold text-white bg-[#0A2A66] px-4 py-2 rounded-lg">
            5. Student / Parent Declaration &amp; Privacy Notice
          </h3>

          <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.declarationAccepted}
              onChange={(e) => setForm({...form, declarationAccepted: e.target.checked})}
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            <span>
              I confirm that the information provided in this form is correct. I agree to follow the Centre’s rules, respect staff and other learners, take care of Centre property, and meet the agreed fees and attendance requirements.
            </span>
          </label>

          <label className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 cursor-pointer rounded-xl bg-[#FAF7F2] p-3.5 border border-slate-200">
            <input
              type="checkbox"
              checked={form.privacyAccepted}
              onChange={(e) => setForm({...form, privacyAccepted: e.target.checked})}
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            <span className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0A2A66] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Data Privacy (Kenya Data Protection Act):</strong> I consent to Ebenezer Technology and Skills Centre collecting and securely storing this registration data strictly for learner admission, safeguarding, and academic communication. Data is never sold to third parties.
              </span>
            </span>
          </label>

          {errorMsg && (
            <p className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#F58220] text-sm font-bold text-[#071E4B] hover:bg-[#E06D0B] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Submitting Registration...' : 'Submit Admission Form'}
          </button>
        </section>
      </form>
    </div>
  );
};

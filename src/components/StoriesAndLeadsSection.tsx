import React, {useState} from 'react';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Gift,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Phone,
  Star,
} from 'lucide-react';
import {copy, Lang} from '../i18n';
import {BlogArticle, CentreSettings, GalleryItem, LeadRecord, TestimonialItem} from '../types';
import {QRCodeCard} from './QRCodeCard';

interface StoriesAndLeadsSectionProps {
  lang: Lang;
  testimonials: TestimonialItem[];
  gallery: GalleryItem[];
  articles: BlogArticle[];
  settings: CentreSettings;
  onReviewAdded: (item: TestimonialItem) => void;
  showFullGalleryAndBlog?: boolean;
}

export const StoriesAndLeadsSection: React.FC<StoriesAndLeadsSectionProps> = ({
  lang,
  testimonials,
  gallery,
  articles,
  settings,
  onReviewAdded,
  showFullGalleryAndBlog = true,
}) => {
  const t = copy[lang];

  // Lead Capture State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [offerType, setOfferType] = useState<LeadRecord['offerType']>('Free First Lesson');
  const [interestArea, setInterestArea] = useState('Computer Training');
  const [referredByCode, setReferredByCode] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [savedLead, setSavedLead] = useState<LeadRecord | null>(null);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revName, setRevName] = useState('');
  const [revRole, setRevRole] = useState('');
  const [revOrg, setRevOrg] = useState('');
  const [revQuote, setRevQuote] = useState('');
  const [revSaving, setRevSaving] = useState(false);

  // Expanded Blog Article
  const [openArticleId, setOpenArticleId] = useState<string | null>(articles[0]?.id || null);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError('');
    if (!leadName.trim() || leadPhone.trim().length < 7) {
      setLeadError('Enter your name and a valid phone/WhatsApp number.');
      return;
    }
    setLeadSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: leadName.trim(),
          phone: leadPhone.trim(),
          offerType,
          interestArea,
          referredByCode: referredByCode.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLeadError(data.error || 'Could not save request.');
      } else {
        setSavedLead(data.lead);
        setLeadName('');
        setLeadPhone('');
      }
    } catch {
      setLeadError('Connection unavailable. Message us on WhatsApp 0714 490545.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || revQuote.trim().length < 10) return;
    setRevSaving(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: revName.trim(),
          role: revRole.trim() || 'Community Member',
          organisation: revOrg.trim() || 'Ngama / Kajiado',
          quote: revQuote.trim(),
          rating: 5,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onReviewAdded(data.testimonial);
        setRevName('');
        setRevRole('');
        setRevOrg('');
        setRevQuote('');
        setShowReviewForm(false);
      }
    } finally {
      setRevSaving(false);
    }
  };

  const pageUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ebenezer-ngama.example';

  return (
    <div className="space-y-16">
      {/* Why Ebenezer + Testimonials (Claim-to-Proof Adjacency) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-10">
        <div>
          <p className="text-xs font-semibold text-[#F58220]">Trust &amp; Community Proof</p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[#0A2A66] text-balance">{t.whyTitle}</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.whyItems.map((w, idx) => (
              <div key={w.title} className="rounded-2xl border border-[#0A2A66]/10 bg-white p-5">
                <p className="text-xs font-mono font-semibold text-[#F58220]">0{idx + 1}</p>
                <h3 className="mt-1 font-display text-lg font-bold text-[#0A2A66]">{w.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0A2A66]">
              Voices from Parents, Youth &amp; Institutions
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={settings.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A2A66] underline"
              >
                <span>Google Reviews</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setShowReviewForm((v) => !v)}
                className="px-3.5 py-2 rounded-lg border border-[#0A2A66]/20 bg-white text-xs font-semibold text-[#0A2A66] hover:bg-slate-50 cursor-pointer"
              >
                {showReviewForm ? 'Close Review Form' : 'Leave a Review'}
              </button>
            </div>
          </div>

          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-[#0A2A66]/15 bg-white p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name *"
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Role (e.g., Parent, Pastor, Learner)"
                  value={revRole}
                  onChange={(e) => setRevRole(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Town / School / Church"
                  value={revOrg}
                  onChange={(e) => setRevOrg(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <textarea
                rows={2}
                required
                placeholder="Share your experience with Ebenezer..."
                value={revQuote}
                onChange={(e) => setRevQuote(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={revSaving}
                className="px-4 py-2 rounded-lg bg-[#0A2A66] text-xs font-bold text-white hover:bg-[#071E4B] cursor-pointer"
              >
                {revSaving ? 'Saving...' : 'Publish Review'}
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.slice(0, 6).map((item) => (
              <blockquote
                key={item.id}
                className="rounded-2xl border border-[#0A2A66]/10 bg-white p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-0.5 text-[#F2B705]" aria-label={`${item.rating} out of 5 stars`}>
                    {Array.from({length: item.rating}).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">“{item.quote}”</p>
                </div>
                <footer className="border-t border-slate-100 pt-3">
                  <p className="text-sm font-bold text-[#0A2A66]">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.role} · {item.organisation}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#15803D]">{item.outcome}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery & Local Tips Blog */}
      {showFullGalleryAndBlog && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-12">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
              <div>
                <p className="text-xs font-semibold text-[#F58220]">Centre Showcase</p>
                <h3 className="text-2xl font-bold text-[#0A2A66]">Learning &amp; Print Studio Highlights</h3>
              </div>
              <p className="text-xs text-slate-500">
                Practical training, student support, media creation, and printing at our Ngama centre.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gallery.map((g) => (
                <figure key={g.id} className="group rounded-2xl border border-[#0A2A66]/10 bg-white overflow-hidden flex flex-col">
                  <div className="aspect-[16/10] bg-[#FAF7F2] overflow-hidden">
                    <img
                      src={g.imageUrl}
                      alt={g.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="p-4 space-y-1 flex-1">
                    <p className="text-[11px] font-semibold text-[#F58220]">{g.category}</p>
                    <h4 className="font-bold text-sm text-[#0A2A66]">{g.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{g.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Blog & Practical Tips */}
          <div className="rounded-2xl border border-[#0A2A66]/10 bg-white p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6D28D9]">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Learning Tips &amp; Community Guides</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {articles.map((art) => {
                const isOpen = openArticleId === art.id;
                return (
                  <article key={art.id} className="rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-3">
                    <div>
                      <p className="text-xs text-slate-500">
                        {art.category} · {art.readTime}
                      </p>
                      <h4 className="mt-1 font-display text-base font-bold text-[#0A2A66]">{art.title}</h4>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{art.summary}</p>
                      {isOpen && (
                        <ul className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                          {art.content.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpenArticleId(isOpen ? null : art.id)}
                      className="text-left text-xs font-bold text-[#F58220] hover:underline cursor-pointer"
                    >
                      {isOpen ? 'Hide Full Guide' : 'Read Full Guide'}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* In-Page Lead Capture + Bring a Friend Referral Programme */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl bg-[#071E4B] text-white p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F2B705]">
              <Gift className="w-4 h-4" aria-hidden="true" />
              <span>Free Community Offers &amp; Bring-a-Friend Referral</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-balance">{t.leadTitle}</h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Not ready to enrol yet? Leave your name and phone number to claim a <strong>Free First Computer Lesson</strong>, <strong>Free CV Check</strong>, or join our <strong>WhatsApp Updates</strong>. You will also receive a personal <em>Bring-a-Friend</em> referral code for a fee discount when a friend joins.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={settings.whatsappChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/10"
              >
                <HeartHandshake className="w-4 h-4 text-[#F2B705]" aria-hidden="true" />
                <span>Join WhatsApp Broadcast / Channel</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-xl bg-white text-[#0F172A] p-5 sm:p-6">
            {savedLead ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#15803D] font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  <span>Offer Claimed &amp; Saved</span>
                </div>
                <p className="text-sm text-slate-700">
                  Asante, <strong>{savedLead.name}</strong>! Your <strong>{savedLead.offerType}</strong> request has been logged.
                </p>
                <div className="rounded-lg bg-[#FAF7F2] border border-[#0A2A66]/15 p-3 text-xs">
                  <p className="text-slate-600">Your Bring-a-Friend Referral Code:</p>
                  <p className="font-mono text-base font-bold text-[#0A2A66] mt-0.5">{savedLead.referralCode}</p>
                  <p className="text-slate-500 mt-1">Share this code with friends in Ngama or Illasit for fee discounts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSavedLead(null)}
                  className="text-xs font-semibold text-[#0A2A66] underline cursor-pointer"
                >
                  Claim another offer
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Full name"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="07xx xxx xxx"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Free Offer</label>
                    <select
                      value={offerType}
                      onChange={(e) => setOfferType(e.target.value as LeadRecord['offerType'])}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="Free First Lesson">Free First Computer Lesson</option>
                      <option value="Free CV Check">Free CV Check</option>
                      <option value="Free Consultation">Free Course Consultation</option>
                      <option value="WhatsApp Broadcast">WhatsApp Updates &amp; Intake Dates</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Referral Code (optional)</label>
                    <input
                      type="text"
                      value={referredByCode}
                      onChange={(e) => setReferredByCode(e.target.value)}
                      placeholder="e.g., EBZ-JOS42"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono uppercase"
                    />
                  </div>
                </div>
                {leadError && <p className="text-xs text-red-600 font-medium">{leadError}</p>}
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="w-full rounded-xl bg-[#F58220] py-2.5 text-sm font-bold text-[#071E4B] hover:bg-[#E06D0B] cursor-pointer"
                >
                  {leadSubmitting ? 'Saving...' : 'Claim Offer & Get Referral Code'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact, Hours, Map Directions & Scannable QR Strip */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-8">
        <div className="rounded-2xl border border-[#0A2A66]/12 bg-white p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-semibold text-[#F58220]">Visit Us in Ngama</p>
            <h3 className="text-2xl font-bold text-[#0A2A66]">Directions, Hours &amp; Direct Contacts</h3>
            <div className="space-y-2.5 text-sm text-slate-700">
              <p className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#15803D] shrink-0 mt-1" aria-hidden="true" />
                <span>
                  <strong>Call / WhatsApp:</strong>{' '}
                  <a href={`tel:${settings.phoneDisplay.replace(/\s+/g, '')}`} className="underline text-[#0A2A66]">
                    {settings.phoneDisplay}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#0A2A66] shrink-0 mt-1" aria-hidden="true" />
                <span>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${settings.email}`} className="underline text-[#0A2A66]">
                    {settings.email}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F58220] shrink-0 mt-1" aria-hidden="true" />
                <span>
                  <strong>Location:</strong> {settings.locationLine}
                </span>
              </p>
              <p className="text-xs text-slate-500 pt-1">
                {settings.hoursWeekdays} · {settings.hoursSaturday}
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Ngama+Kajiado+Kenya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#0A2A66]/20 px-4 py-2 text-xs font-bold text-[#0A2A66] hover:bg-slate-50"
            >
              <span>Open Ngama Area in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-[#FAF7F2] h-[220px] flex flex-col items-center justify-center p-4 text-center">
              <MapPin className="w-8 h-8 text-[#F58220]" aria-hidden="true" />
              <p className="mt-2 font-bold text-sm text-[#0A2A66]">Ngama · Kajiado South</p>
              <p className="mt-1 text-xs text-slate-600">
                Serving Ngama, Illasit, Kimana, Loitokitok &amp; Tarakea (Kenya–Tanzania Border Corridor)
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 flex justify-center">
            <QRCodeCard
              value={pageUrl}
              label="Scan to Open Ebenezer"
              sublabel="0714 490545 · Ngama"
              size={124}
              allowDownload={false}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

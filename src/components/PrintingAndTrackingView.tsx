import React, {useState} from 'react';
import {CheckCircle2, FileUp, MessageCircle, PackageCheck, Printer, Search, Smartphone} from 'lucide-react';
import {CentreSettings, OrderStage, PrintQuoteOrder} from '../types';

interface PrintingAndTrackingViewProps {
  settings: CentreSettings;
}

const DIRECT_SERVICES = [
  'A4 Photocopying & Document Scanning',
  'Typing, Editing & Formatting of Customer Documents',
  'CV Preparation, Cover Letters & Job Applications',
  'School Worksheets, Exams, Forms & Official Letters',
  'Funeral & Wedding Programmes (Standard Layout)',
  'Basic Graphic Design for Simple Flyers & Notices',
];

const PARTNER_SERVICES = [
  'Banners, Signage & Large-Format Printing',
  'Bulk Colour Printing, Brochures & Promotional Flyers',
  'Business Cards & Branded Institutional Stationery',
  'Booklets, Spiral/Thermal Binding & Certificates',
  'Custom Specialised Finishes Requiring External Equipment',
];

const ORDER_STAGES: OrderStage[] = ['Received', 'In design', 'Printing', 'Ready'];

export const PrintingAndTrackingView: React.FC<PrintingAndTrackingViewProps> = ({settings}) => {
  // 5-Step Quote Form State
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    customerType: 'Individual' as PrintQuoteOrder['customerType'],
    institutionOrName: '',
    contactPerson: '',
    phone: '',
    email: '',
    serviceType: 'CV Typing, Layout & Printing',
    isPartnerJob: false,
    size: 'A4',
    quantity: 50,
    colourMode: 'Black & White' as 'Black & White' | 'Full Colour',
    paperType: '80gsm Standard Bond',
    finishing: 'Standard Trim / Stapled',
    needsDesignLayout: true,
    fileName: '',
    notes: '',
    requiredDate: '',
    deliveryLocation: 'Collect at Ngama Centre',
  });
  const [submitting, setSubmitting] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [createdOrder, setCreatedOrder] = useState<PrintQuoteOrder | null>(null);

  // Order Tracker State
  const [trackRefInput, setTrackRefInput] = useState('EBZ-PRT-1042');
  const [trackedOrder, setTrackedOrder] = useState<PrintQuoteOrder | null>(null);
  const [trackError, setTrackError] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);

  const computeEstimate = () => {
    if (form.isPartnerJob) return 'Partner Quote Confirmed Before Production';
    const unit = form.colourMode === 'Full Colour' ? 30 : 10;
    const designFee = form.needsDesignLayout ? 250 : 0;
    const est = form.quantity * unit + designFee;
    return `Approx. KSh ${est.toLocaleString()} (final confirmed on proof)`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        fileName: `${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB)`,
      }));
    }
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteError('');
    if (!form.contactPerson.trim() || form.phone.trim().length < 7) {
      setQuoteError('Please provide your name and phone/WhatsApp number.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...form,
          estimatedTotal: computeEstimate(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setQuoteError(data.error || 'Could not submit quote request.');
      } else {
        setCreatedOrder(data.order);
        setTrackRefInput(data.order.ref);
        setTrackedOrder(data.order);
      }
    } catch {
      setQuoteError('Connection error. Please send your print details via WhatsApp on 0714 490545.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const ref = trackRefInput.trim().toUpperCase();
    if (!ref) return;
    setTrackError('');
    setTrackingLoading(true);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(ref)}`);
      const data = await res.json();
      if (!res.ok) {
        setTrackedOrder(null);
        setTrackError(data.error || 'Order not found.');
      } else {
        setTrackedOrder(data.order);
      }
    } catch {
      setTrackError('Unable to reach server. Call 0714 490545 for live status.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const activeStageIndex = trackedOrder ? ORDER_STAGES.indexOf(trackedOrder.status) : -1;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 space-y-14">
      {/* Header & Direct vs Partner Matrix */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold tracking-wide text-[#0F766E]">Printing, Typing &amp; Graphic Design</p>
            <h2 className="mt-1 text-3xl sm:text-4xl font-bold text-[#0A2A66] text-balance">
              Clear Print Production &amp; 5-Step Order Flow
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Honest, transparent production: everyday A4 documents, CVs, and programmes are produced directly at our Ngama desk, while specialised large-format or bulk jobs are arranged by order through vetted external partners.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="group overflow-hidden rounded-2xl border border-[#0A2A66]/12 bg-white aspect-[16/9] shadow-sm">
              <img
                src="/assets/photos/printing-design.jpg"
                alt="Printer and finished printed flyers, brochures, and designs at Ebenezer"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#0F766E]/25 bg-white p-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F766E]">
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Produced Directly at Ngama Centre</span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-[#0A2A66]">Everyday Documents &amp; A4 Printing</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {DIRECT_SERVICES.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0F766E] shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
              A4 printing is fulfilled in-house according to current paper &amp; equipment availability.
            </p>
          </div>

          <div className="rounded-2xl border border-[#F58220]/30 bg-white p-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#EA580C]">
              <PackageCheck className="w-4 h-4" aria-hidden="true" />
              <span>Arranged by Order Through Partners</span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-[#0A2A66]">Specialised &amp; Large-Format Printing</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {PARTNER_SERVICES.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#F58220] shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
              We confirm supplier availability, exact turnaround, and written cost before accepting deposit.
            </p>
          </div>
        </div>
      </div>

      {/* 5-Step Quote & Order Flow */}
      <section className="rounded-2xl border border-[#0A2A66]/12 bg-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <p className="text-xs font-semibold text-[#F58220]">5-Step Order Flow</p>
            <h3 className="text-2xl font-bold text-[#0A2A66]">Request a Print or Design Quotation</h3>
          </div>
          {!createdOrder && (
            <div className="flex items-center gap-1.5 text-xs font-semibold tabular-nums">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(s)}
                  className={`h-8 w-8 rounded-lg transition-colors cursor-pointer ${
                    step === s
                      ? 'bg-[#0A2A66] text-white'
                      : step > s
                        ? 'bg-[#0F766E]/15 text-[#0F766E]'
                        : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {createdOrder ? (
          <div className="py-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#15803D]">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              <span>Quotation &amp; Order Received</span>
            </div>
            <h4 className="text-2xl font-bold text-[#0A2A66]">
              Tracking Reference: <span className="font-mono text-[#F58220]">{createdOrder.ref}</span>
            </h4>
            <p className="text-sm text-slate-600 max-w-xl">
              Save your reference number above to track progress below (`Received → In design → Printing → Ready`). You can also send this summary straight to our WhatsApp desk to attach artwork or confirm deposit.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`https://wa.me/${settings.whatsappIntl}?text=${encodeURIComponent(
                  `Hello Ebenezer, I submitted Print Quote ${createdOrder.ref} for ${createdOrder.serviceType} (Qty: ${createdOrder.quantity}, ${createdOrder.size}). Please confirm proof & deposit.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-[#052E16] hover:bg-[#1FB857]"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Send Order Ref on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setCreatedOrder(null);
                  setStep(1);
                }}
                className="px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-[#0A2A66] hover:bg-slate-50 cursor-pointer"
              >
                Submit Another Job
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuote} className="mt-6 space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="font-bold text-[#0A2A66]">Step 1 of 5 · Tell us what you need (size, quantity, colour &amp; finishing)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Job Category</label>
                    <select
                      value={form.serviceType}
                      onChange={(e) => {
                        const val = e.target.value;
                        const partner =
                          val.includes('Banner') || val.includes('Bulk') || val.includes('Business Cards') || val.includes('Booklet');
                        setForm({...form, serviceType: val, isPartnerJob: partner});
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    >
                      <option value="CV Typing, Layout & Printing">CV Typing, Layout &amp; Printing</option>
                      <option value="A4 Photocopying & Worksheets">A4 Photocopying &amp; School Worksheets</option>
                      <option value="Church / Funeral / Wedding Programme">Church / Funeral / Wedding Programme</option>
                      <option value="Flyer / Poster Design">Flyer / Poster Design &amp; A4 Print</option>
                      <option value="Banners & Signage (Partner Arranged)">Banners &amp; Signage (Arranged by order)</option>
                      <option value="Business Cards & Branded Stationery (Partner Arranged)">Business Cards (Arranged by order)</option>
                      <option value="Bulk Colour Brochures / Booklets (Partner Arranged)">Bulk Colour Brochures / Booklets (Arranged by order)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Paper / Output Size</label>
                    <select
                      value={form.size}
                      onChange={(e) => setForm({...form, size: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    >
                      <option value="A4">A4 Standard</option>
                      <option value="A5 Folded">A5 Folded Programme</option>
                      <option value="A3">A3 Poster</option>
                      <option value="Business Card (90x54mm)">Business Card</option>
                      <option value="Custom Banner Size">Custom Banner / Signage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity (Copies / Units)</label>
                    <input
                      type="number"
                      min={1}
                      value={form.quantity}
                      onChange={(e) => setForm({...form, quantity: Math.max(1, Number(e.target.value) || 1)})}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Colour Mode</label>
                    <select
                      value={form.colourMode}
                      onChange={(e) =>
                        setForm({...form, colourMode: e.target.value as 'Black & White' | 'Full Colour'})
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    >
                      <option value="Black & White">Black &amp; White</option>
                      <option value="Full Colour">Full Colour</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Paper / Material</label>
                    <input
                      type="text"
                      value={form.paperType}
                      onChange={(e) => setForm({...form, paperType: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Required Deadline</label>
                    <input
                      type="date"
                      value={form.requiredDate}
                      onChange={(e) => setForm({...form, requiredDate: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h4 className="font-bold text-[#0A2A66]">Step 2 of 5 · Send your document or ask us to prepare a layout</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <label className="rounded-xl border border-dashed border-[#0A2A66]/30 bg-[#FAF7F2] p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#F58220]">
                    <FileUp className="w-6 h-6 text-[#0A2A66]" aria-hidden="true" />
                    <span className="mt-2 text-sm font-semibold text-[#0A2A66]">
                      {form.fileName ? `Selected: ${form.fileName}` : 'Attach Draft Document, Photo or PDF'}
                    </span>
                    <span className="mt-1 text-xs text-slate-500">Or send later directly on WhatsApp 0714 490545</span>
                    <input type="file" onChange={handleFileChange} className="sr-only" />
                  </label>

                  <div className="space-y-3">
                    <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.needsDesignLayout}
                        onChange={(e) => setForm({...form, needsDesignLayout: e.target.checked})}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0A2A66]"
                      />
                      <span>
                        <strong>Yes, prepare/format the design layout for me</strong> (basic flyers, notices, CVs, or programmes)
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({...form, notes: e.target.value})}
                      placeholder="Add text instructions, colours, school/church name, or finishing preferences..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h4 className="font-bold text-[#0A2A66]">Step 3 of 5 · Proof &amp; Estimated Quotation Check</h4>
                <div className="rounded-xl bg-[#FAF7F2] border border-[#0A2A66]/10 p-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Service:</span>
                    <span className="font-semibold text-[#0A2A66]">{form.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Specification:</span>
                    <span className="font-semibold text-[#0A2A66] tabular-nums">
                      {form.quantity} × {form.size} ({form.colourMode})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Production Channel:</span>
                    <span className="font-semibold text-[#0A2A66]">
                      {form.isPartnerJob ? 'Arranged by order through partner' : 'Direct at Ngama Centre'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span className="text-slate-700 font-semibold">Indicative Estimate:</span>
                    <span className="font-bold text-[#0F766E] tabular-nums">{computeEstimate()}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Before any final printing begins, we send a digital proof on WhatsApp or review it with you at reception for approval.
                </p>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h4 className="font-bold text-[#0A2A66]">Step 4 of 5 · Contact, Deposit &amp; Delivery / Collection Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Institution Type</label>
                    <select
                      value={form.customerType}
                      onChange={(e) =>
                        setForm({...form, customerType: e.target.value as PrintQuoteOrder['customerType']})
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    >
                      <option value="Individual">Individual / Job Seeker</option>
                      <option value="School">School / College</option>
                      <option value="Church">Church / Ministry</option>
                      <option value="Health Facility">Dispensary / Health Centre</option>
                      <option value="NGO">NGO / Community Group</option>
                      <option value="Business">Shop / Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Institution or Your Name</label>
                    <input
                      type="text"
                      value={form.institutionOrName}
                      onChange={(e) => setForm({...form, institutionOrName: e.target.value})}
                      placeholder="e.g., Ngama Primary or Grace N."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person *</label>
                    <input
                      type="text"
                      required
                      value={form.contactPerson}
                      onChange={(e) => setForm({...form, contactPerson: e.target.value})}
                      placeholder="Full name"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    />
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
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Collection or Delivery Location</label>
                    <input
                      type="text"
                      value={form.deliveryLocation}
                      onChange={(e) => setForm({...form, deliveryLocation: e.target.value})}
                      placeholder="Collect at Ngama Centre / Illasit / Kimana / Loitokitok / Tarakea cross-border arrangement"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h4 className="font-bold text-[#0A2A66]">Step 5 of 5 · Confirm &amp; Generate Order Tracking Number</h4>
                <p className="text-sm text-slate-600">
                  We will generate your tracking reference (`EBZ-PRT-...`), confirm supplier/equipment readiness, and coordinate production, quality check, and collection or delivery.
                </p>
                {quoteError && (
                  <p className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
                    {quoteError}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={step === 1}
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 disabled:opacity-40 cursor-pointer"
              >
                Previous Step
              </button>
              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(5, s + 1))}
                  className="px-5 py-2.5 rounded-lg bg-[#0A2A66] text-xs font-bold text-white hover:bg-[#071E4B] cursor-pointer"
                >
                  Next Step ({step}/5)
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-lg bg-[#F58220] text-xs font-bold text-[#071E4B] hover:bg-[#E06D0B] disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? 'Submitting Quote...' : 'Submit & Get Tracking Ref'}
                </button>
              )}
            </div>
          </form>
        )}
      </section>

      {/* Order Tracking + M-Pesa Payment Info Split */}
      <section id="track-order" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-[#0A2A66]/12 bg-white p-6 sm:p-7 space-y-5">
          <div>
            <p className="text-xs font-semibold text-[#0F766E]">Live Status Lookup</p>
            <h3 className="text-xl font-bold text-[#0A2A66]">Track Your Print or Design Order</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try sample references: <button type="button" onClick={() => setTrackRefInput('EBZ-PRT-1042')} className="font-mono underline text-[#0A2A66] cursor-pointer">EBZ-PRT-1042</button>,{' '}
              <button type="button" onClick={() => setTrackRefInput('EBZ-PRT-1043')} className="font-mono underline text-[#0A2A66] cursor-pointer">EBZ-PRT-1043</button>,{' '}
              <button type="button" onClick={() => setTrackRefInput('EBZ-PRT-1044')} className="font-mono underline text-[#0A2A66] cursor-pointer">EBZ-PRT-1044</button>
            </p>
          </div>

          <form onSubmit={handleTrackLookup} className="flex flex-wrap sm:flex-nowrap gap-2.5">
            <input
              type="text"
              value={trackRefInput}
              onChange={(e) => setTrackRefInput(e.target.value)}
              placeholder="Enter reference e.g. EBZ-PRT-1042"
              aria-label="Print order reference number"
              className="flex-1 min-w-[200px] rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono uppercase focus:border-[#0A2A66] focus:outline-none"
            />
            <button
              type="submit"
              disabled={trackingLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A2A66] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#071E4B] cursor-pointer whitespace-nowrap"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>{trackingLoading ? 'Checking...' : 'Check Status'}</span>
            </button>
          </form>

          {trackError && (
            <p className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
              {trackError}
            </p>
          )}

          {trackedOrder && (
            <div className="rounded-xl bg-[#FAF7F2] border border-[#0A2A66]/10 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-mono text-slate-500">{trackedOrder.ref}</p>
                  <h4 className="font-bold text-[#0A2A66]">{trackedOrder.serviceType}</h4>
                  <p className="text-xs text-slate-600">
                    {trackedOrder.institutionOrName} · {trackedOrder.quantity} × {trackedOrder.size}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#0F766E] tabular-nums">{trackedOrder.estimatedTotal}</span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2">
                {ORDER_STAGES.map((stage, i) => {
                  const done = i <= activeStageIndex;
                  const current = i === activeStageIndex;
                  return (
                    <div key={stage} className="space-y-1.5">
                      <div
                        className={`h-2 rounded-full ${
                          done ? (current ? 'bg-[#F58220]' : 'bg-[#0F766E]') : 'bg-slate-200'
                        }`}
                      />
                      <p className={`text-[11px] font-semibold ${done ? 'text-[#0A2A66]' : 'text-slate-400'}`}>
                        {stage}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* M-Pesa Payment Info */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0A2A66] text-white p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F2B705]">
              <Smartphone className="w-4 h-4" aria-hidden="true" />
              <span>Lipa na M-Pesa &amp; Deposits</span>
            </div>
            <h3 className="text-xl font-bold">Payment &amp; Deposit Details</h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              For course registration fees or approved print order deposits, confirm the official Paybill/Till number directly with our reception desk before sending funds.
            </p>
            <div className="rounded-xl border border-white/15 bg-white/5 p-4 space-y-1.5 text-xs sm:text-sm">
              <p className="text-slate-300">Account Name</p>
              <p className="font-bold text-white">{settings.mpesaAccountName}</p>
              <p className="text-slate-300 pt-2">Paybill / Till Confirmation</p>
              <p className="font-mono font-semibold text-[#F2B705]">{settings.mpesaPaybillOrTill}</p>
            </div>
          </div>

          <a
            href={`https://wa.me/${settings.whatsappIntl}?text=${encodeURIComponent(
              'Hello Ebenezer, please share your official M-Pesa Paybill/Till details for my payment.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-[#052E16] hover:bg-[#1FB857]"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>Confirm M-Pesa Number on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};

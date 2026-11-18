import React, {useState} from 'react';
import {Building2, Download, MapPin, MessageCircle, QrCode} from 'lucide-react';
import {CentreSettings} from '../types';
import {QRCodeCard} from './QRCodeCard';

interface InstitutionsAndKitViewProps {
  settings: CentreSettings;
  onGoToQuote: () => void;
}

export const InstitutionsAndKitView: React.FC<InstitutionsAndKitViewProps> = ({
  settings,
  onGoToQuote,
}) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ebenezer-ngama.example';
  const [qrTarget, setQrTarget] = useState<'home' | 'admissions' | 'printing' | 'whatsapp'>('admissions');
  const [customCourseName, setCustomCourseName] = useState('Introduction to Computers');

  const getQrValue = () => {
    if (qrTarget === 'home') return baseUrl;
    if (qrTarget === 'admissions') return `${baseUrl}/?view=admissions`;
    if (qrTarget === 'printing') return `${baseUrl}/?view=printing`;
    return `https://wa.me/${settings.whatsappIntl}?text=${encodeURIComponent(
      `Hello Ebenezer, I scanned your QR code for ${customCourseName}.`
    )}`;
  };

  const getQrLabel = () => {
    if (qrTarget === 'home') return 'Ebenezer Centre Home';
    if (qrTarget === 'admissions') return 'Online Admission Form';
    if (qrTarget === 'printing') return 'Print Quote & Order Tracker';
    return `WhatsApp: ${customCourseName}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 space-y-14">
      {/* Institutional Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 rounded-2xl bg-[#0A2A66] text-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F2B705]">
              <Building2 className="w-4 h-4" aria-hidden="true" />
              <span>Institutional Outreach &amp; Local Partnerships</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-balance leading-tight">
              Your Trusted Printing &amp; Digital Partner Across Kajiado South &amp; Tarakea
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              We support <strong>Schools, Churches, Dispensaries, Health Centres, NGOs, Community Organisations, and Local Businesses</strong> with dependable photocopying, exam/worksheet preparation, event programmes, CVs, reports, and partner-coordinated banners.
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-xs sm:text-sm text-slate-100 space-y-1.5">
            <p className="font-semibold text-[#F2B705] flex items-center gap-1.5">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>Service Area &amp; Cross-Border Orders</span>
            </p>
            <p>
              Ngama · Illasit · Kimana · Loitokitok · Tarakea and neighbouring Tanzanian communities. Cross-border orders are welcome subject to agreed delivery, payment, and applicable customs arrangements.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/assets/aistudio/Ebenezer_Institutional_Marketing_Pack_A4__1__ad516390.pdf"
              download="Ebenezer_Institutional_Marketing_Pack_A4.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F58220] px-5 py-3 text-sm font-bold text-[#071E4B] hover:bg-[#E06D0B] whitespace-nowrap"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Download Institutional PDF Pack</span>
            </a>
            <button
              type="button"
              onClick={onGoToQuote}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 cursor-pointer whitespace-nowrap"
            >
              <span>Request Institutional Quote</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-[#0A2A66]/12 bg-white p-4 flex flex-col justify-between">
          <div className="group flex-1 overflow-hidden rounded-xl bg-[#FAF7F2]">
            <img
              src="/assets/photos/printing-design.jpg"
              alt="Printing and document preparation for schools, churches, NGOs and businesses"
              referrerPolicy="no-referrer"
              className="w-full h-full min-h-[240px] max-h-[380px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span>Quality · Professionalism · Reliability</span>
            <a
              href={`https://wa.me/${settings.whatsappIntl}?text=${encodeURIComponent(
                'Hello Ebenezer, please arrange an institutional introduction visit or quotation for our organisation.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#15803D] hover:underline whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Book Institutional Visit</span>
            </a>
          </div>
        </div>
      </section>

      {/* QR Code Generator for Posters & Shop Signs */}
      <section className="rounded-2xl border border-[#0A2A66]/12 bg-white p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0A2A66]">
              <QrCode className="w-4 h-4 text-[#F58220]" aria-hidden="true" />
              <span>QR Code Generator</span>
            </div>
            <h3 className="text-2xl font-bold text-[#0A2A66]">
              Create Scannable QR Codes for Notices &amp; Shop Signs
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generate crisp navy QR codes for church notices, school handouts, or your Ngama shopfront window so passers-by can open the admission form, print quote page, or WhatsApp chat in one scan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">QR Destination</label>
                <select
                  value={qrTarget}
                  onChange={(e) => setQrTarget(e.target.value as typeof qrTarget)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                >
                  <option value="admissions">Online Admission Form</option>
                  <option value="printing">Print Quote &amp; Order Tracker</option>
                  <option value="home">Centre Website Home</option>
                  <option value="whatsapp">Pre-filled WhatsApp Enquiry</option>
                </select>
              </div>
              {qrTarget === 'whatsapp' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service / Course Label</label>
                  <input
                    type="text"
                    value={customCourseName}
                    onChange={(e) => setCustomCourseName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <QRCodeCard value={getQrValue()} label={getQrLabel()} sublabel="Scan with Phone Camera" size={160} />
          </div>
        </div>
      </section>
    </div>
  );
};

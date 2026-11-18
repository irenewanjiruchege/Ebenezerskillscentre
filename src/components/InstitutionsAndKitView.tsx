import React, {useState} from 'react';
import {Building2, Download, FileText, MapPin, MessageCircle, QrCode} from 'lucide-react';
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
  const [customCourseName, setCustomCourseName] = useState('Computer Training');

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
    if (qrTarget === 'printing') return 'Print Quote & Tracking';
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
          <img
            src="/assets/aistudio/Ebenezer_Skills_Centre_Institutional_Brochure__3__f5eb2c58.png"
            alt="Ebenezer Institutional Services Brochure"
            referrerPolicy="no-referrer"
            className="w-full h-full max-h-[380px] object-contain rounded-xl bg-[#FAF7F2]"
          />
          <p className="mt-3 text-xs text-slate-500 text-center">
            Official Institutional Brochure · Quality · Professionalism · Reliability
          </p>
        </div>
      </section>

      {/* Printable Marketing Kit Pack */}
      <section className="rounded-2xl border border-[#0A2A66]/12 bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#F58220]">Printable Marketing Kit</p>
            <h3 className="text-2xl font-bold text-[#0A2A66]">Download Official Flyers, Forms &amp; Institutional Pack</h3>
          </div>
          <a
            href={`https://wa.me/${settings.whatsappIntl}?text=${encodeURIComponent(
              'Hello Ebenezer, please arrange an institutional introduction visit or quotation for our organisation.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#15803D] hover:underline whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>Book an Institutional Visit on WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/assets/aistudio/Ebenezer_Institutional_Marketing_Pack_A4__1__ad516390.pdf"
            download="Ebenezer_Institutional_Marketing_Pack_A4.pdf"
            className="rounded-xl border border-slate-200 p-4 hover:border-[#0A2A66] transition-colors flex flex-col justify-between gap-3"
          >
            <FileText className="w-6 h-6 text-[#0A2A66]" aria-hidden="true" />
            <div>
              <p className="font-bold text-sm text-[#0A2A66]">4-Page Institutional Pack (PDF)</p>
              <p className="text-xs text-slate-500 mt-1">Intro letter, order guide &amp; quotation template</p>
            </div>
            <span className="text-xs font-semibold text-[#F58220]">Download PDF</span>
          </a>

          <a
            href="/assets/aistudio/ChatGPT_Image_Oct_5__2026__02_02_30_PM_41fe253b.png"
            download="Ebenezer_Services_Flyer.png"
            className="rounded-xl border border-slate-200 p-4 hover:border-[#0A2A66] transition-colors flex flex-col justify-between gap-3"
          >
            <FileText className="w-6 h-6 text-[#1D4ED8]" aria-hidden="true" />
            <div>
              <p className="font-bold text-sm text-[#0A2A66]">Main Services Flyer</p>
              <p className="text-xs text-slate-500 mt-1">All 5 colour-coded services &amp; contact strip</p>
            </div>
            <span className="text-xs font-semibold text-[#1D4ED8]">Download Flyer</span>
          </a>

          <a
            href="/assets/aistudio/ChatGPT_Image_Oct_5__2026__02_16_06_PM_17c5aa0c.png"
            download="Ebenezer_Admission_Form.png"
            className="rounded-xl border border-slate-200 p-4 hover:border-[#0A2A66] transition-colors flex flex-col justify-between gap-3"
          >
            <FileText className="w-6 h-6 text-[#15803D]" aria-hidden="true" />
            <div>
              <p className="font-bold text-sm text-[#0A2A66]">Printable Admission Form</p>
              <p className="text-xs text-slate-500 mt-1">Paper registration sheet for walk-in learners</p>
            </div>
            <span className="text-xs font-semibold text-[#15803D]">Download Form</span>
          </a>

          <a
            href="/assets/aistudio/Ebenezer_Technology_and_Skills_Centre_Banner_d176f1a4.png"
            download="Ebenezer_Poster_Banner.png"
            className="rounded-xl border border-slate-200 p-4 hover:border-[#0A2A66] transition-colors flex flex-col justify-between gap-3"
          >
            <FileText className="w-6 h-6 text-[#EA580C]" aria-hidden="true" />
            <div>
              <p className="font-bold text-sm text-[#0A2A66]">Shop &amp; Noticeboard Poster</p>
              <p className="text-xs text-slate-500 mt-1">Computer, Tuition, English &amp; Printing poster</p>
            </div>
            <span className="text-xs font-semibold text-[#EA580C]">Download Poster</span>
          </a>
        </div>
      </section>

      {/* QR Code Generator for Flyers, Posters & Shop Signs */}
      <section className="rounded-2xl border border-[#0A2A66]/12 bg-white p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0A2A66]">
              <QrCode className="w-4 h-4 text-[#F58220]" aria-hidden="true" />
              <span>Flyer &amp; Poster QR Code Generator</span>
            </div>
            <h3 className="text-2xl font-bold text-[#0A2A66]">
              Create Scannable QR Codes for Flyers &amp; Shop Signs
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generate crisp navy QR codes to print on church notices, school handouts, or your Ngama shopfront window so passers-by can open the admission form, print quote page, or WhatsApp chat in one scan.
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

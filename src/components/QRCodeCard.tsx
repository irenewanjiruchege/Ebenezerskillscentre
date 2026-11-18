import React, {useEffect, useState} from 'react';
import QRCode from 'qrcode';
import {Download} from 'lucide-react';

interface QRCodeCardProps {
  value: string;
  label: string;
  sublabel?: string;
  size?: number;
  allowDownload?: boolean;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({
  value,
  label,
  sublabel,
  size = 132,
  allowDownload = true,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      color: {
        dark: '#0A2A66',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch(() => {
        if (active) setDataUrl('');
      });
    return () => {
      active = false;
    };
  }, [value, size]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `ebenezer-qr-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
    link.click();
  };

  return (
    <div className="inline-flex flex-col items-center rounded-xl border border-[#0A2A66]/12 bg-white p-4 text-center">
      {dataUrl ? (
        <img
          src={dataUrl}
          alt={`QR code for ${label}`}
          width={size}
          height={size}
          className="rounded-lg border border-slate-100"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          style={{width: size, height: size}}
          className="flex items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500"
        >
          Generating QR...
        </div>
      )}
      <p className="mt-2.5 text-xs font-semibold text-[#0A2A66] max-w-[160px] leading-snug">{label}</p>
      {sublabel && <p className="mt-0.5 text-[11px] text-slate-500 max-w-[160px] truncate">{sublabel}</p>}
      {allowDownload && dataUrl && (
        <button
          type="button"
          onClick={handleDownload}
          className="mt-2.5 inline-flex items-center gap-1 rounded-md border border-[#0A2A66]/20 px-2.5 py-1 text-[11px] font-medium text-[#0A2A66] hover:bg-[#0A2A66] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
        >
          <Download className="w-3 h-3" aria-hidden="true" />
          <span>Download PNG</span>
        </button>
      )}
    </div>
  );
};

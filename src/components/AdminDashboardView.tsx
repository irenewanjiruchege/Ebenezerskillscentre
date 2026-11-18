import React, {useState} from 'react';
import {Download, Lock, Plus, RefreshCw, Trash2} from 'lucide-react';
import {
  AdmissionRecord,
  CourseItem,
  GalleryItem,
  LeadRecord,
  OrderStage,
  PrintQuoteOrder,
  PromoOffer,
  SeatBooking,
} from '../types';

interface AdminDashboardViewProps {
  onDataMutated: () => void;
}

interface AdminPayload {
  admissions: AdmissionRecord[];
  orders: PrintQuoteOrder[];
  leads: LeadRecord[];
  bookings: SeatBooking[];
  courses: CourseItem[];
  promo: PromoOffer;
  gallery: GalleryItem[];
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({onDataMutated}) => {
  const [pin, setPin] = useState('2026');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<AdminPayload | null>(null);
  const [tab, setTab] = useState<'admissions' | 'orders' | 'leads' | 'courses' | 'promo'>('orders');

  // New Course Form
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('computer');
  const [newCourseFee, setNewCourseFee] = useState('');
  const [newCourseDuration, setNewCourseDuration] = useState('');

  // Promo Form
  const [promoHeadline, setPromoHeadline] = useState('');
  const [promoSubtext, setPromoSubtext] = useState('');
  const [promoActive, setPromoActive] = useState(true);

  // Gallery Form
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState('Centre & Learners');
  const [galCaption, setGalCaption] = useState('');

  const loadDashboard = async (enteredPin = pin) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: {'x-admin-pin': enteredPin},
      });
      if (!res.ok) {
        setAuthed(false);
        setError('Invalid Admin PIN. Default staff PIN is 2026.');
        return;
      }
      const json: AdminPayload = await res.json();
      setData(json);
      setPromoHeadline(json.promo.headline);
      setPromoSubtext(json.promo.subtext);
      setPromoActive(json.promo.active);
      setAuthed(true);
    } catch {
      setError('Cannot reach admin API.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStage = async (ref: string, status: OrderStage) => {
    await fetch(`/api/admin/orders/${encodeURIComponent(ref)}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json', 'x-admin-pin': pin},
      body: JSON.stringify({status}),
    });
    await loadDashboard();
    onDataMutated();
  };

  const updateAdmissionStatus = async (id: string, status: 'Pending' | 'Accepted') => {
    await fetch(`/api/admin/admissions/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json', 'x-admin-pin': pin},
      body: JSON.stringify({status}),
    });
    await loadDashboard();
    onDataMutated();
  };

  const updateCourseFee = async (courseId: string, fee: string) => {
    await fetch(`/api/admin/courses/${encodeURIComponent(courseId)}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'x-admin-pin': pin},
      body: JSON.stringify({fee}),
    });
    await loadDashboard();
    onDataMutated();
  };

  const addCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    await fetch('/api/admin/courses', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-admin-pin': pin},
      body: JSON.stringify({
        title: newCourseTitle.trim(),
        category: newCourseCategory,
        fee: newCourseFee.trim() || 'Contact for price',
        duration: newCourseDuration.trim() || '4 Weeks',
      }),
    });
    setNewCourseTitle('');
    setNewCourseFee('');
    setNewCourseDuration('');
    await loadDashboard();
    onDataMutated();
  };

  const savePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/promo', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'x-admin-pin': pin},
      body: JSON.stringify({
        headline: promoHeadline,
        subtext: promoSubtext,
        active: promoActive,
      }),
    });
    await loadDashboard();
    onDataMutated();
  };

  const addGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle.trim()) return;
    await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-admin-pin': pin},
      body: JSON.stringify({
        title: galTitle.trim(),
        category: galCategory.trim(),
        caption: galCaption.trim(),
      }),
    });
    setGalTitle('');
    setGalCaption('');
    await loadDashboard();
    onDataMutated();
  };

  const removeGalleryItem = async (id: string) => {
    await fetch(`/api/admin/gallery/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {'x-admin-pin': pin},
    });
    await loadDashboard();
    onDataMutated();
  };

  const exportLeadsCsv = () => {
    if (!data) return;
    const rows = [
      ['Name', 'Phone', 'Offer', 'ReferralCode', 'ReferredBy', 'Date'].join(','),
      ...data.leads.map((l) =>
        [l.name, l.phone, l.offerType, l.referralCode || '', l.referredByCode || '', l.createdAt]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ];
    const blob = new Blob([rows.join('\n')], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ebenezer-leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-14">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadDashboard(pin);
          }}
          className="rounded-2xl border border-[#0A2A66]/15 bg-white p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center gap-2 text-[#0A2A66]">
            <Lock className="w-5 h-5 text-[#F58220]" aria-hidden="true" />
            <h2 className="text-xl font-bold">Centre Staff Admin Panel</h2>
          </div>
          <p className="text-xs text-slate-600">
            Update course fees, print order stages, admissions, leads, and intake offers without a developer. (Demo PIN: <span className="font-mono font-bold">2026</span>)
          </p>
          <div>
            <label htmlFor="admin-pin" className="block text-xs font-semibold text-slate-700 mb-1">
              Staff PIN
            </label>
            <input
              id="admin-pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-mono"
            />
          </div>
          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#0A2A66] py-3 text-sm font-bold text-white hover:bg-[#071E4B] cursor-pointer"
          >
            {loading ? 'Signing In...' : 'Open Admin Panel'}
          </button>
        </form>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#F58220]">Centre Operations</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2A66]">Ebenezer Admin Dashboard</h2>
        </div>
        <button
          type="button"
          onClick={() => loadDashboard()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-[#0A2A66] hover:bg-slate-50 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#0A2A66]/10 bg-white p-4">
          <p className="text-xs text-slate-500">Print Orders</p>
          <p className="text-2xl font-bold font-display text-[#0A2A66] tabular-nums">{data.orders.length}</p>
        </div>
        <div className="rounded-xl border border-[#0A2A66]/10 bg-white p-4">
          <p className="text-xs text-slate-500">Admissions</p>
          <p className="text-2xl font-bold font-display text-[#0A2A66] tabular-nums">{data.admissions.length}</p>
        </div>
        <div className="rounded-xl border border-[#0A2A66]/10 bg-white p-4">
          <p className="text-xs text-slate-500">Captured Leads</p>
          <p className="text-2xl font-bold font-display text-[#0A2A66] tabular-nums">{data.leads.length}</p>
        </div>
        <div className="rounded-xl border border-[#0A2A66]/10 bg-white p-4">
          <p className="text-xs text-slate-500">4-Seat Bookings</p>
          <p className="text-2xl font-bold font-display text-[#0A2A66] tabular-nums">{data.bookings.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-white border border-slate-200 rounded-xl w-fit">
        {(
          [
            ['orders', 'Print Orders'],
            ['admissions', 'Admissions'],
            ['leads', 'Leads & Bookings'],
            ['courses', 'Edit Courses & Prices'],
            ['promo', 'Promo & Gallery'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
              tab === key ? 'bg-[#0A2A66] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
              <tr>
                <th className="p-3.5">Ref</th>
                <th className="p-3.5">Client / Institution</th>
                <th className="p-3.5">Job</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Advance Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.orders.map((o) => (
                <tr key={o.ref}>
                  <td className="p-3.5 font-mono font-bold text-[#0A2A66]">{o.ref}</td>
                  <td className="p-3.5">
                    <p className="font-semibold text-[#0A2A66]">{o.institutionOrName}</p>
                    <p className="text-xs text-slate-500">{o.phone}</p>
                  </td>
                  <td className="p-3.5">
                    <p>{o.serviceType}</p>
                    <p className="text-xs text-slate-500 tabular-nums">
                      {o.quantity} × {o.size}
                    </p>
                  </td>
                  <td className="p-3.5 font-semibold text-[#0F766E]">{o.status}</td>
                  <td className="p-3.5">
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStage(o.ref, e.target.value as OrderStage)}
                      aria-label={`Update status for ${o.ref}`}
                      className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                    >
                      <option value="Received">Received</option>
                      <option value="In design">In design</option>
                      <option value="Printing">Printing</option>
                      <option value="Ready">Ready</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'admissions' && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
              <tr>
                <th className="p-3.5">Admission No</th>
                <th className="p-3.5">Learner</th>
                <th className="p-3.5">Programmes</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.admissions.map((a) => (
                <tr key={a.id}>
                  <td className="p-3.5 font-mono font-bold text-[#0A2A66]">{a.admissionNo}</td>
                  <td className="p-3.5">
                    <p className="font-semibold text-[#0A2A66]">{a.fullName}</p>
                    <p className="text-xs text-slate-500">
                      {a.phone} · {a.townArea}
                    </p>
                  </td>
                  <td className="p-3.5 text-xs">{a.programmes.join(', ')}</td>
                  <td className="p-3.5 font-semibold">{a.status}</td>
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => updateAdmissionStatus(a.id, a.status === 'Accepted' ? 'Pending' : 'Accepted')}
                      className="px-3 py-1 rounded-md border border-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                    >
                      {a.status === 'Accepted' ? 'Set Pending' : 'Mark Accepted'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'leads' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0A2A66]">Lead Capture &amp; Referral List</h3>
              <button
                type="button"
                onClick={exportLeadsCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A2A66] text-xs font-semibold text-white cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Export CSV</span>
              </button>
            </div>
            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {data.leads.map((l) => (
                <div key={l.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[#0A2A66]">{l.name}</p>
                    <p className="text-xs text-slate-500">
                      {l.phone} · {l.offerType}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#F58220] font-semibold">{l.referralCode}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="font-bold text-[#0A2A66]">4-Seat Lab Bookings</h3>
            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {data.bookings.map((b) => (
                <div key={b.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[#0A2A66]">{b.learnerName}</p>
                    <p className="text-xs text-slate-500">
                      {b.topic} · {b.phone}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-700 tabular-nums">
                    {b.date} · {b.session}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'courses' && (
        <div className="space-y-6">
          <form onSubmit={addCourse} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <h3 className="font-bold text-[#0A2A66] flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#F58220]" aria-hidden="true" />
              <span>Add New Course</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                placeholder="Course Title *"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <select
                value={newCourseCategory}
                onChange={(e) => setNewCourseCategory(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="computer">Computer Training</option>
                <option value="tuition">Student Tuition</option>
                <option value="reading">Reading &amp; English</option>
                <option value="content">Content Creation</option>
                <option value="enterprise">Enterprise &amp; Youth</option>
              </select>
              <input
                type="text"
                placeholder="Fee (e.g., KSh 3,500)"
                value={newCourseFee}
                onChange={(e) => setNewCourseFee(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 4 Weeks)"
                value={newCourseDuration}
                onChange={(e) => setNewCourseDuration(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#0A2A66] text-xs font-bold text-white cursor-pointer"
            >
              Add Course
            </button>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
            {data.courses.map((c) => (
              <div key={c.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-sm text-[#0A2A66]">{c.title}</p>
                  <p className="text-xs text-slate-500">
                    {c.category} · {c.duration} · {c.schedule}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue={c.fee}
                    onBlur={(e) => {
                      if (e.target.value !== c.fee) {
                        updateCourseFee(c.id, e.target.value);
                      }
                    }}
                    aria-label={`Edit fee for ${c.title}`}
                    className="w-36 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold tabular-nums"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'promo' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={savePromo} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="font-bold text-[#0A2A66]">Promo Banner &amp; Intake Offer</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
              <input
                type="text"
                value={promoHeadline}
                onChange={(e) => setPromoHeadline(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subtext</label>
              <input
                type="text"
                value={promoSubtext}
                onChange={(e) => setPromoSubtext(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={promoActive}
                onChange={(e) => setPromoActive(e.target.checked)}
              />
              <span>Show Promo Strip on Website</span>
            </label>
            <button
              type="submit"
              className="block px-5 py-2.5 rounded-lg bg-[#F58220] text-xs font-bold text-[#071E4B] cursor-pointer"
            >
              Save Promo Offer
            </button>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="font-bold text-[#0A2A66]">Gallery Manager</h3>
            <form onSubmit={addGalleryItem} className="space-y-2.5">
              <input
                type="text"
                placeholder="Gallery Title"
                value={galTitle}
                onChange={(e) => setGalTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Category"
                value={galCategory}
                onChange={(e) => setGalCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Short Caption"
                value={galCaption}
                onChange={(e) => setGalCaption(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0A2A66] text-xs font-bold text-white cursor-pointer"
              >
                Add Gallery Card
              </button>
            </form>
            <div className="divide-y divide-slate-100 text-xs">
              {data.gallery.map((g) => (
                <div key={g.id} className="py-2 flex items-center justify-between gap-2">
                  <span className="font-semibold text-[#0A2A66] truncate">{g.title}</span>
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(g.id)}
                    aria-label={`Remove ${g.title}`}
                    className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

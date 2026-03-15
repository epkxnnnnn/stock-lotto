'use client';

import { useState, useEffect } from 'react';

const volumeOptions = [
  { value: '', label: 'เลือกปริมาณ' },
  { value: 'low', label: 'น้อย (< 100 req/วัน)' },
  { value: 'medium', label: 'ปานกลาง (100-1,000 req/วัน)' },
  { value: 'high', label: 'มาก (1,000-10,000 req/วัน)' },
  { value: 'very_high', label: 'มากที่สุด (> 10,000 req/วัน)' },
];

interface ApiAccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ApiAccessModal({ open, onClose }: ApiAccessModalProps) {
  const [form, setForm] = useState({
    contact_name: '',
    contact_phone: '',
    line_id: '',
    system_name: '',
    system_url: '',
    use_case: '',
    expected_volume: '',
    webhook_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/agent/api-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      // Reset after animation
      setTimeout(() => {
        setSuccess(false);
        setError('');
        setForm({
          contact_name: '',
          contact_phone: '',
          line_id: '',
          system_name: '',
          system_url: '',
          use_case: '',
          expected_volume: '',
          webhook_url: '',
        });
      }, 300);
    }
  };

  if (!open) return null;

  const inputClass = 'w-full bg-[var(--bg-input)] border border-[var(--border)] rounded px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" style={{ animation: 'fadeIn 0.2s ease-out' }} />

      {/* Modal */}
      <div
        className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'fadeInUp 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--bg-card)] border-b border-[var(--border)] px-5 py-3 flex items-center justify-between rounded-t z-10">
          <div>
            <h3 className="text-sm font-semibold text-[var(--brand-primary)]">
              ขอใช้งาน API
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">สำหรับระบบที่ต้องการเชื่อมต่อผลหวยหุ้น</p>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {'\u2715'}
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div
              className="bg-emerald-500/10 border border-emerald-500/30 rounded p-5 text-center"
              style={{ animation: 'fadeInUp 0.4s ease-out' }}
            >
              <div className="text-4xl mb-3">{'\u2705'}</div>
              <div className="text-lg font-semibold text-emerald-400 mb-2">
                ส่งคำขอเรียบร้อยแล้ว!
              </div>
              <div className="text-sm text-[var(--text-secondary)] mb-4">
                ทีมงานจะตรวจสอบและส่ง API Key ให้ทาง LINE ภายใน 24-48 ชั่วโมง
              </div>
              <button
                onClick={handleClose}
                className="text-sm text-[var(--brand-primary)] hover:underline"
              >
                ปิด
              </button>
            </div>
          ) : (
            <>
              {/* API Info cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: '\u{1F4E1}', label: 'REST API', sub: 'JSON response' },
                  { icon: '\u{1F514}', label: 'Webhook Push', sub: 'Real-time notify' },
                  { icon: '\u{1F512}', label: 'API Key Auth', sub: 'Whitelist only' },
                  { icon: '\u26A1', label: '60 req/min', sub: 'Rate limit' },
                ].map(info => (
                  <div key={info.label} className="bg-[var(--bg-secondary)] rounded-lg p-3 text-center">
                    <div className="text-lg mb-1">{info.icon}</div>
                    <div className="text-xs font-semibold text-[var(--text-primary)]">{info.label}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{info.sub}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Contact Name */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    ชื่อผู้ติดต่อ <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    value={form.contact_name}
                    onChange={handleChange}
                    required
                    placeholder="ชื่อ-นามสกุล"
                    className={inputClass}
                  />
                </div>

                {/* Phone + LINE ID row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      เบอร์โทร <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contact_phone"
                      value={form.contact_phone}
                      onChange={handleChange}
                      required
                      placeholder="0812345678"
                      maxLength={10}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      LINE ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="line_id"
                      value={form.line_id}
                      onChange={handleChange}
                      required
                      placeholder="LINE ID"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* System Name */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    ชื่อระบบ/เว็บไซต์ <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="system_name"
                    value={form.system_name}
                    onChange={handleChange}
                    required
                    placeholder="ชื่อเว็บไซต์หรือแพลตฟอร์มของคุณ"
                    className={inputClass}
                  />
                </div>

                {/* System URL */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    URL ระบบ <span className="text-[var(--text-muted)]">(ไม่บังคับ)</span>
                  </label>
                  <input
                    type="text"
                    name="system_url"
                    value={form.system_url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className={inputClass}
                  />
                </div>

                {/* Use Case */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    วัตถุประสงค์การใช้ API <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="use_case"
                    value={form.use_case}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="อธิบายว่าจะนำ API ไปใช้งานอย่างไร เช่น แสดงผลหวยในเว็บ, ส่งแจ้งเตือนลูกค้า..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Expected Volume */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    ปริมาณการใช้งานที่คาดหวัง <span className="text-[var(--text-muted)]">(ไม่บังคับ)</span>
                  </label>
                  <select
                    name="expected_volume"
                    value={form.expected_volume}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {volumeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Webhook URL */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Webhook URL <span className="text-[var(--text-muted)]">(ไม่บังคับ)</span>
                  </label>
                  <input
                    type="text"
                    name="webhook_url"
                    value={form.webhook_url}
                    onChange={handleChange}
                    placeholder="https://your-system.com/webhook/results"
                    className={inputClass}
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">
                    ระบบจะส่งผลหวยหุ้นไปยัง URL นี้ทันทีที่ออกผล (POST + HMAC-SHA256 signature)
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded px-3 py-2 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--brand-primary)] text-[var(--bg-primary)] font-semibold rounded px-5 py-2.5 text-sm transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'กำลังส่งคำขอ...' : 'ส่งคำขอใช้ API'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

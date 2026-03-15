'use client';

import { useState } from 'react';
import { getBrandConfig } from '@/lib/theme/config';
import { useI18n } from '@/lib/i18n';
import ApiAccessModal from '@/components/ApiAccessModal';

const config = getBrandConfig();
const roundCount = config.brand === 'platinum' ? 15 : 13;

const benefits = [
  { title: 'ค่าคอมมิชชั่นสูง', description: 'รับค่าตอบแทนจากการแนะนำสมาชิกทุกคน' },
  { title: 'ผลหวยเรียลไทม์', description: 'เข้าถึงผลหวยหุ้นแบบเรียลไทม์ทันที' },
  { title: 'ซัพพอร์ตตลอด 24 ชม.', description: 'ทีมงานคอยช่วยเหลือตลอดเวลา' },
  { title: 'สื่อการตลาด', description: 'แบนเนอร์ ลิงก์แนะนำ พร้อมใช้งานทันที' },
];

const steps = [
  { step: '01', title: 'สมัคร', description: 'กรอกข้อมูลและส่งใบสมัครผ่านแบบฟอร์ม' },
  { step: '02', title: 'อนุมัติ', description: 'ทีมงานตรวจสอบและอนุมัติภายใน 24 ชม.' },
  { step: '03', title: 'เริ่มทำงาน', description: 'รับข้อมูลเข้าระบบและเริ่มหารายได้ทันที' },
];

const referralOptions = [
  { value: '', label: 'เลือกช่องทาง' },
  { value: 'website', label: 'เว็บไซต์' },
  { value: 'friend', label: 'เพื่อนแนะนำ' },
  { value: 'line', label: 'LINE' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'other', label: 'อื่นๆ' },
];

const inputClass = 'w-full bg-[var(--bg-input)] border border-[var(--border)] rounded px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors';

export default function AgentPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    line_id: '',
    experience: '',
    referral_source: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [apiModalOpen, setApiModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/agent/register', {
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

  return (
    <div className="py-6">
      <h1 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        {t('agent.title')} {config.siteName}
      </h1>

      {/* Hero */}
      <div className="panel p-5 mb-4">
        <h3 className="text-base font-semibold text-[var(--brand-primary)] mb-3">
          โปรแกรมตัวแทน {config.siteNameTh}
        </h3>
        <div className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          <p>
            ร่วมเป็นตัวแทนของ {config.siteNameTh} สร้างรายได้จากการแนะนำสมาชิก
            พร้อมรับสิทธิพิเศษมากมาย
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { value: 'สูงสุด', label: 'ค่าคอมฯ' },
          { value: `${roundCount}`, label: 'รอบ/วัน' },
          { value: '24/7', label: 'ซัพพอร์ต' },
        ].map((stat) => (
          <div key={stat.label} className="panel p-4 text-center">
            <div className="font-[family-name:var(--font-mono)] text-xl font-bold text-[var(--brand-primary)] mb-0.5">
              {stat.value}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="panel p-4 flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] mt-2 shrink-0" />
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)] mb-0.5">{benefit.title}</div>
              <div className="text-xs text-[var(--text-muted)]">{benefit.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="panel p-5 mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">ขั้นตอนการสมัคร</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--brand-primary)]">{s.step}</span>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary)]">{s.title}</div>
                <div className="text-xs text-[var(--text-muted)]">{s.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Access CTA */}
      <div className="panel p-4 mb-4 border-[var(--brand-primary)]/20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-[var(--text-primary)] mb-0.5">
              มีระบบอยู่แล้ว? เชื่อมต่อผ่าน API
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              ดึงผลหวยหุ้นแบบเรียลไทม์ผ่าน REST API + Webhook
            </div>
          </div>
          <button
            onClick={() => setApiModalOpen(true)}
            className="shrink-0 bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 text-[var(--brand-primary)] font-medium rounded px-4 py-2 text-sm transition-colors hover:bg-[var(--brand-primary)]/20"
          >
            ขอใช้ API
          </button>
        </div>
      </div>

      {/* Registration Form */}
      <div className="panel p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">แบบฟอร์มสมัครตัวแทน</h3>

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-5 text-center">
            <div className="text-lg font-semibold text-emerald-400 mb-1">ส่งใบสมัครเรียบร้อยแล้ว!</div>
            <div className="text-sm text-[var(--text-secondary)]">ทีมงานจะติดต่อกลับทาง LINE ภายใน 24 ชั่วโมง</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                ชื่อ-นามสกุล <span className="text-red-400">*</span>
              </label>
              <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required placeholder="กรอกชื่อ-นามสกุล" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                เบอร์โทรศัพท์ <span className="text-red-400">*</span>
              </label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="0812345678" maxLength={10} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                LINE ID <span className="text-red-400">*</span>
              </label>
              <input type="text" name="line_id" value={form.line_id} onChange={handleChange} required placeholder="กรอก LINE ID" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">ประสบการณ์</label>
              <textarea name="experience" value={form.experience} onChange={handleChange} rows={3} placeholder="เล่าประสบการณ์ที่เกี่ยวข้อง (ถ้ามี)" className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">ทราบจากช่องทางใด</label>
              <select name="referral_source" value={form.referral_source} onChange={handleChange} className={inputClass}>
                {referralOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded px-3 py-2 text-sm text-red-400">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--brand-primary)] text-[var(--bg-primary)] font-semibold rounded px-5 py-2.5 text-sm transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'กำลังส่ง...' : 'ส่งใบสมัคร'}
            </button>

            <p className="text-[10px] text-[var(--text-muted)] text-center">
              การส่งใบสมัครถือว่าคุณยอมรับเงื่อนไขของ {config.siteName}
            </p>
          </form>
        )}
      </div>

      <ApiAccessModal open={apiModalOpen} onClose={() => setApiModalOpen(false)} />
    </div>
  );
}

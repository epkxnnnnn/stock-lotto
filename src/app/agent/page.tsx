'use client';

import { useState } from 'react';
import { getBrandConfig } from '@/lib/theme/config';
import SectionTitle from '@/components/SectionTitle';
import ApiAccessModal from '@/components/ApiAccessModal';

const config = getBrandConfig();
const roundCount = config.brand === 'platinum' ? 15 : 13;

const benefits = [
  {
    icon: '\u{1F4B0}',
    title: 'ค่าคอมมิชชั่นสูง',
    description: 'รับค่าตอบแทนจากการแนะนำสมาชิกทุกคน อัตราค่าคอมมิชชั่นที่คุ้มค่า',
  },
  {
    icon: '\u26A1',
    title: 'ผลหวยเรียลไทม์',
    description: 'เข้าถึงผลหวยหุ้นแบบเรียลไทม์ทันทีที่ออกผล เพื่อให้บริการลูกค้าได้อย่างรวดเร็ว',
  },
  {
    icon: '\u{1F4DE}',
    title: 'ซัพพอร์ตตลอด 24 ชม.',
    description: 'ทีมงานคอยช่วยเหลือตลอดเวลา พร้อมแก้ไขปัญหาให้ทันที',
  },
  {
    icon: '\u{1F4E2}',
    title: 'สื่อการตลาด',
    description: 'รับสื่อการตลาดสำเร็จรูป แบนเนอร์ ลิงก์แนะนำ พร้อมใช้งานทันที',
  },
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

export default function AgentPage() {
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
    <div className="py-10">
      <SectionTitle>{'\u{1F91D}'} สมัครตัวแทน {config.siteName}</SectionTitle>

      {/* Hero */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent pointer-events-none" />
        <div className="relative">
          <h3 className="font-heading text-2xl tracking-[3px] gradient-text mb-4">
            โปรแกรมตัวแทน {config.siteNameTh}
          </h3>
          <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            <p>
              ร่วมเป็นตัวแทนของ {config.siteNameTh} สร้างรายได้จากการแนะนำสมาชิก
              พร้อมรับสิทธิพิเศษมากมาย สนับสนุนเต็มที่ตลอดการทำงาน
            </p>
            <p>
              เราเปิดรับตัวแทนที่มีความตั้งใจและพร้อมเติบโตไปด้วยกัน
              ไม่จำเป็นต้องมีประสบการณ์ เรามีทีมงานคอยสอนและดูแลทุกขั้นตอน
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {[
          { value: 'สูงสุด', label: 'ค่าคอมมิชชั่น', sub: 'อัตราที่คุ้มค่า' },
          { value: `${roundCount}`, label: 'รอบต่อวัน', sub: 'ครบทุกตลาด' },
          { value: '24/7', label: 'ซัพพอร์ต', sub: 'พร้อมช่วยเหลือ' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 text-center"
          >
            <div className="font-mono text-2xl md:text-3xl font-bold gradient-text mb-1">
              {stat.value}
            </div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">{stat.label}</div>
            <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {benefits.map((benefit, i) => (
          <div
            key={benefit.title}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 flex items-start gap-4 hover:border-[var(--brand-primary)]/30 transition-all"
            style={{
              animation: 'fadeInUp 0.4s ease-out backwards',
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <div className="w-10 h-10 rounded-[10px] bg-[var(--brand-primary)]/10 flex items-center justify-center text-xl shrink-0">
              {benefit.icon}
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                {benefit.title}
              </div>
              <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                {benefit.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 md:p-8 mb-6">
        <h3 className="font-heading text-xl tracking-[2px] text-[var(--brand-primary)] mb-6">
          {'\u{1F4CB}'} ขั้นตอนการสมัคร
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <div key={s.step} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center shrink-0">
                <span className="font-mono text-lg font-bold gradient-text">{s.step}</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                  {s.title}
                </div>
                <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {s.description}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center text-[var(--text-muted)] text-lg">
                  {'\u2192'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 md:p-8 mb-6">
        <h3 className="font-heading text-xl tracking-[2px] text-[var(--brand-primary)] mb-4">
          {'\u2705'} คุณสมบัติผู้สมัคร
        </h3>
        <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
          {[
            'อายุ 18 ปีขึ้นไป',
            'มีบัญชี LINE สำหรับติดต่อสื่อสาร',
            'มีความรับผิดชอบและตั้งใจทำงาน',
            'สามารถใช้งานสมาร์ทโฟนหรือคอมพิวเตอร์ได้',
            'ไม่จำเป็นต้องมีประสบการณ์ — มีทีมงานสอนให้',
          ].map((req) => (
            <li key={req} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] text-[var(--brand-primary)]">{'\u2713'}</span>
              </span>
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* API Access CTA */}
      <div className="bg-[var(--bg-card)] border border-[var(--brand-primary)]/20 rounded-[14px] p-6 md:p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary)]/5 to-transparent pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-12 h-12 rounded-[10px] bg-[var(--brand-primary)]/10 flex items-center justify-center text-2xl shrink-0">
            {'\u{1F517}'}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              มีระบบอยู่แล้ว? เชื่อมต่อผ่าน API
            </div>
            <div className="text-xs text-[var(--text-muted)] leading-relaxed">
              สำหรับเว็บไซต์หรือแพลตฟอร์มที่ต้องการดึงผลหวยหุ้นแบบเรียลไทม์ผ่าน REST API พร้อม Webhook push notification
            </div>
          </div>
          <button
            onClick={() => setApiModalOpen(true)}
            className="shrink-0 bg-[var(--bg-secondary)] border border-[var(--brand-primary)]/30 text-[var(--brand-primary)] font-semibold rounded-lg px-5 py-2.5 text-sm transition-all hover:bg-[var(--brand-primary)]/10"
          >
            ขอใช้ API
          </button>
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 md:p-8">
        <h3 className="font-heading text-xl tracking-[2px] text-[var(--brand-primary)] mb-6">
          {'\u{1F4DD}'} แบบฟอร์มสมัครตัวแทน
        </h3>

        {success ? (
          <div
            className="bg-emerald-500/10 border border-emerald-500/30 rounded-[14px] p-6 text-center"
            style={{ animation: 'fadeInUp 0.4s ease-out' }}
          >
            <div className="text-4xl mb-3">{'\u2705'}</div>
            <div className="text-lg font-semibold text-emerald-400 mb-2">
              ส่งใบสมัครเรียบร้อยแล้ว!
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              ทีมงานจะตรวจสอบและติดต่อกลับทาง LINE ภายใน 24 ชั่วโมง
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                ชื่อ-นามสกุล <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                placeholder="กรอกชื่อ-นามสกุล"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]/50 transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                เบอร์โทรศัพท์ <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="0812345678"
                maxLength={10}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]/50 transition-all"
              />
            </div>

            {/* LINE ID */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                LINE ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="line_id"
                value={form.line_id}
                onChange={handleChange}
                required
                placeholder="กรอก LINE ID ของคุณ"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]/50 transition-all"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                ประสบการณ์ <span className="text-[var(--text-muted)]">(ไม่บังคับ)</span>
              </label>
              <textarea
                name="experience"
                value={form.experience}
                onChange={handleChange}
                rows={3}
                placeholder="เล่าประสบการณ์ที่เกี่ยวข้อง (ถ้ามี)"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]/50 transition-all resize-none"
              />
            </div>

            {/* Referral Source */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                ทราบจากช่องทางใด <span className="text-[var(--text-muted)]">(ไม่บังคับ)</span>
              </label>
              <select
                name="referral_source"
                value={form.referral_source}
                onChange={handleChange}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]/50 transition-all"
              >
                {referralOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--brand-primary)] text-[var(--bg-primary)] font-semibold rounded-lg px-6 py-3.5 text-sm tracking-wide transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'กำลังส่งใบสมัคร...' : 'ส่งใบสมัคร'}
            </button>

            <p className="text-[11px] text-[var(--text-muted)] text-center">
              การส่งใบสมัครถือว่าคุณยอมรับเงื่อนไขและข้อกำหนดของ {config.siteName}
            </p>
          </form>
        )}
      </div>

      {/* API Access Modal */}
      <ApiAccessModal open={apiModalOpen} onClose={() => setApiModalOpen(false)} />
    </div>
  );
}

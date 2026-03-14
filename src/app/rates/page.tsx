import type { Metadata } from 'next';
import SectionTitle from '@/components/SectionTitle';
import { getBrandConfig } from '@/lib/theme/config';
import { payoutRates, ignoredThreeDigitNumbers } from '@/config/payout-rates';

const config = getBrandConfig();

export const metadata: Metadata = {
  title: `อัตราจ่ายหวยหุ้น — ตาราง 3 ตัว 2 ตัว ${config.siteNameTh}`,
  description: `อัตราจ่ายหวยหุ้น ${config.siteNameTh} ตาราง 3 ตัวบน 3 ตัวโต๊ด 2 ตัว อัพเดทล่าสุด จ่ายเต็มอัตรา`,
  openGraph: {
    title: `อัตราจ่ายหวยหุ้น — ${config.siteNameTh}`,
    description: `อัตราจ่ายหวยหุ้น ${config.siteNameTh} ตาราง 3 ตัวบน 3 ตัวโต๊ด 2 ตัว อัพเดทล่าสุด`,
    url: '/rates',
  },
  alternates: { canonical: '/rates' },
};

export default function RatesPage() {
  return (
    <div className="py-10">
      <SectionTitle>&#x1F4B0; อัตราจ่าย</SectionTitle>

      {/* Highlight cards for top rates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {payoutRates.slice(0, 3).map((rate) => (
          <div
            key={rate.type}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 text-center relative overflow-hidden hover:border-[var(--brand-primary)]/30 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="text-xs text-[var(--text-muted)] tracking-wider uppercase mb-2">
                {rate.type}
              </div>
              <div className="font-mono text-4xl font-bold gradient-text mb-2">
                {rate.rate}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                {rate.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full payout table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h3 className="font-heading text-lg tracking-[2px] text-[var(--brand-primary)]">
            ตารางอัตราจ่ายทั้งหมด
          </h3>
        </div>
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="bg-gradient-to-br from-[var(--brand-primary)]/15 to-[var(--brand-primary)]/5 px-5 py-3.5 text-left text-[13px] font-semibold text-[var(--brand-primary)] tracking-wider border-b border-[var(--border)]">
                ประเภท
              </th>
              <th className="bg-gradient-to-br from-[var(--brand-primary)]/15 to-[var(--brand-primary)]/5 px-5 py-3.5 text-left text-[13px] font-semibold text-[var(--brand-primary)] tracking-wider border-b border-[var(--border)]">
                อัตราจ่าย (บาท)
              </th>
              <th className="bg-gradient-to-br from-[var(--brand-primary)]/15 to-[var(--brand-primary)]/5 px-5 py-3.5 text-left text-[13px] font-semibold text-[var(--brand-primary)] tracking-wider border-b border-[var(--border)] max-md:hidden">
                รายละเอียด
              </th>
            </tr>
          </thead>
          <tbody>
            {payoutRates.map((rate, i) => (
              <tr key={rate.type} className="hover:bg-[var(--brand-primary)]/[0.03] transition-colors">
                <td className="px-5 py-4 text-sm font-semibold text-[var(--text-primary)] border-b border-white/[0.03]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" style={{ opacity: 1 - i * 0.12 }} />
                    {rate.type}
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-lg text-[var(--brand-light)] font-bold border-b border-white/[0.03]">
                  {rate.rate}
                </td>
                <td className="px-5 py-4 text-xs text-[var(--text-muted)] border-b border-white/[0.03] max-md:hidden">
                  {rate.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ignored numbers */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 mb-8">
        <h3 className="font-heading text-lg tracking-[2px] text-[var(--brand-primary)] mb-4">
          &#x26A0;&#xFE0F; เลขที่ไม่รับแทง (3 ตัวตรง)
        </h3>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          เลขเหล่านี้ไม่สามารถแทงแบบ 3 ตัวตรงได้ เนื่องจากเป็นเลขเบิ้ล
        </p>
        <div className="flex flex-wrap gap-2">
          {ignoredThreeDigitNumbers.map((num) => (
            <span
              key={num}
              className="font-mono text-sm px-3 py-1.5 rounded-lg bg-[var(--accent-red)]/10 text-[var(--accent-red)] border border-[var(--accent-red)]/20"
            >
              {num}
            </span>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6">
        <h3 className="font-heading text-lg tracking-[2px] text-[var(--brand-primary)] mb-3">
          &#x2139;&#xFE0F; หมายเหตุ
        </h3>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-[var(--brand-primary)] mt-0.5">&#x2022;</span>
            อัตราจ่ายอาจมีการเปลี่ยนแปลงโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--brand-primary)] mt-0.5">&#x2022;</span>
            การจ่ายเงินคิดจากเงินเดิมพัน 1 บาท
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--brand-primary)] mt-0.5">&#x2022;</span>
            ผลหวยหุ้นทุกรอบอ้างอิงจากตลาดหุ้นจริง
          </li>
        </ul>
      </div>
    </div>
  );
}

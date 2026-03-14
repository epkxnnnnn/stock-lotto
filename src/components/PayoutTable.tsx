import { payoutRates } from '@/config/payout-rates';

export default function PayoutTable() {
  return (
    <section className="my-10">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 bg-[var(--bg-card)] rounded-[14px] overflow-hidden border border-[var(--border)]">
          <thead>
            <tr>
              <th className="bg-gradient-to-br from-[var(--brand-primary)]/15 to-[var(--brand-primary)]/5 px-3 py-2.5 md:px-5 md:py-3.5 text-left text-[13px] font-semibold text-[var(--brand-primary)] tracking-wider border-b border-[var(--border)]">
                ประเภท
              </th>
              <th className="bg-gradient-to-br from-[var(--brand-primary)]/15 to-[var(--brand-primary)]/5 px-3 py-2.5 md:px-5 md:py-3.5 text-left text-[13px] font-semibold text-[var(--brand-primary)] tracking-wider border-b border-[var(--border)]">
                อัตราจ่าย
              </th>
              <th className="bg-gradient-to-br from-[var(--brand-primary)]/15 to-[var(--brand-primary)]/5 px-3 py-2.5 md:px-5 md:py-3.5 text-left text-[13px] font-semibold text-[var(--brand-primary)] tracking-wider border-b border-[var(--border)]">
                รายละเอียด
              </th>
            </tr>
          </thead>
          <tbody>
            {payoutRates.map((rate) => (
              <tr key={rate.type} className="hover:bg-[var(--brand-primary)]/[0.03] transition-colors">
                <td className="px-3 py-2.5 md:px-5 md:py-3.5 text-sm font-semibold text-[var(--text-primary)] border-b border-white/[0.03] last:[&:last-child]:border-b-0">
                  {rate.type}
                </td>
                <td className="px-3 py-2.5 md:px-5 md:py-3.5 font-mono text-[var(--brand-light)] font-bold border-b border-white/[0.03]">
                  {rate.rate}
                </td>
                <td className="px-3 py-2.5 md:px-5 md:py-3.5 text-xs text-[var(--text-muted)] border-b border-white/[0.03]">
                  {rate.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

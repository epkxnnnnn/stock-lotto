import SectionTitle from '@/components/SectionTitle';
import PayoutTable from '@/components/PayoutTable';

export default function RatesPage() {
  return (
    <div className="py-10">
      <SectionTitle>&#x1F4B0; อัตราจ่าย</SectionTitle>
      <PayoutTable />
    </div>
  );
}

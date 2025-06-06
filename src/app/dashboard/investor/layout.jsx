import InvestorNavbar from '../InvestorNavbar';

export default function InvestorLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <InvestorNavbar />
      <main className="container mx-auto px-4 py-8 ml-64">{children}</main>
    </div>
  );
}
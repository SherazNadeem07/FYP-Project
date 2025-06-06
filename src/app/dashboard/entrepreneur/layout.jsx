import EntrepreneurSidebar from '../EntrepreneurNavbar';

export default function EntrepreneurLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <EntrepreneurSidebar />
      <main className="flex-1 p-8 ml-64">{children}</main>
    </div>
  );
}
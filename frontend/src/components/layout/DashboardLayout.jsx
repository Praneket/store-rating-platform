import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => (
  <div className="min-h-screen">
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  </div>
);

export default DashboardLayout;

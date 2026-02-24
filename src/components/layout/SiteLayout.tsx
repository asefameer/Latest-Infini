import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import ChatbotLauncher from '@/components/layout/ChatbotLauncher';

const SiteLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {!isHome && <Navbar activeSection="" onNavigate={() => {}} />}
      <main className={`flex-1 ${!isHome ? 'pt-[72px]' : ''}`}>
        <Outlet />
      </main>
      <Footer />
      <ChatbotLauncher />
    </div>
  );
};

export default SiteLayout;

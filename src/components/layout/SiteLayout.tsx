import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import ChatbotLauncher from '@/components/layout/ChatbotLauncher';
import GrainOverlay from '@/components/GrainOverlay';
import GlobalSparkles from '@/components/GlobalSparkles';

const SiteLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <GrainOverlay />
      <GlobalSparkles />
      {!isHome && <Navbar activeSection="" onNavigate={() => {}} />}
      <main className={`flex-1 ${!isHome ? 'pt-[72px]' : ''}`}>
        <Outlet />
      </main>
      {!isHome && <Footer />}
      <ChatbotLauncher />
    </div>
  );
};

export default SiteLayout;

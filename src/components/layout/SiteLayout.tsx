import { Outlet, useLocation } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import ChatbotLauncher from '@/components/layout/ChatbotLauncher';

const SiteLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      {!isHome && <Footer />}
      <ChatbotLauncher />
    </div>
  );
};

export default SiteLayout;

import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import ChatbotLauncher from '@/components/layout/ChatbotLauncher';
import GrainOverlay from '@/components/GrainOverlay';
import GlobalSparkles from '@/components/GlobalSparkles';
import SmoothScroll from '@/components/SmoothScroll';
import { useEffect } from 'react';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

const SiteLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col">
        <GrainOverlay />
        <GlobalSparkles />
        {!isHome && <Navbar activeSection="" onNavigate={() => {}} />}
        <main className={`flex-1 ${!isHome ? 'pt-[72px]' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <ChatbotLauncher />
      </div>
    </SmoothScroll>
  );
};

export default SiteLayout;

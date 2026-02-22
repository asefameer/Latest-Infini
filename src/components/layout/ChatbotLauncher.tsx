import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotLauncher = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--infinity-cyan)), hsl(var(--infinity-purple)))',
          boxShadow: '0 0 30px hsl(var(--infinity-cyan) / 0.3), 0 8px 32px rgba(0,0,0,0.4)',
        }}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <X className="w-5 h-5 text-background" /> : <MessageCircle className="w-5 h-5 text-background" />}
      </button>

      {/* Chat modal placeholder */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-96 rounded-2xl border border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border/30 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-display font-semibold text-sm">Infinity Assistant</span>
            </div>
            <div className="flex-1 flex items-center justify-center px-6 text-center">
              <p className="text-muted-foreground text-sm">
                Chat support coming soon. For now, reach us at <span className="text-foreground">hello@infinity.bd</span>
              </p>
            </div>
            <div className="px-4 py-3 border-t border-border/30">
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                Type a message...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotLauncher;

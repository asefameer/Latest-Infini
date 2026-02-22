import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { CheckCircle, Download, QrCode, Mail } from 'lucide-react';

const TicketConfirmation = () => {
  const { ticketOrderId } = useParams<{ ticketOrderId: string }>();
  const [showQr, setShowQr] = useState(false);

  return (
    <>
      <SEOHead title="Tickets Confirmed" description="Your tickets have been confirmed." />

      <div className="container mx-auto px-6 py-20 text-center max-w-lg">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-3">Tickets Confirmed!</h1>
        <p className="text-muted-foreground mb-2">You're all set for the event.</p>
        <p className="text-sm text-muted-foreground mb-8">Booking ID: <span className="text-foreground font-medium">{ticketOrderId}</span></p>

        <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground mb-8">
          <Mail className="w-4 h-4" />
          <span>A confirmation email has been sent to your inbox.</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium border border-border/40 hover:bg-muted/50 transition-colors">
            <Download className="w-4 h-4" /> Download PDF Ticket
          </button>
          <button
            onClick={() => setShowQr(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium border border-border/40 hover:bg-muted/50 transition-colors"
          >
            <QrCode className="w-4 h-4" /> View QR Code
          </button>
        </div>

        {/* QR modal placeholder */}
        {showQr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowQr(false)}>
            <div className="bg-card border border-border/30 rounded-2xl p-8 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-16 h-16 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">QR code placeholder</p>
              <button onClick={() => setShowQr(false)} className="mt-4 text-sm text-primary hover:underline">Close</button>
            </div>
          </div>
        )}

        <Link to="/encounter" className="text-sm text-primary hover:underline">Browse More Events</Link>
      </div>
    </>
  );
};

export default TicketConfirmation;

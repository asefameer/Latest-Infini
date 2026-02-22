import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/components/CartContext";
import SiteLayout from "@/components/layout/SiteLayout";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TrinityHub from "./pages/trinity/TrinityHub";
import BrandPage from "./pages/trinity/BrandPage";
import EditionsLanding from "./pages/editions/EditionsLanding";
import CategoryPage from "./pages/editions/CategoryPage";
import ProductDetail from "./pages/editions/ProductDetail";
import CartPage from "./pages/editions/CartPage";
import Checkout from "./pages/editions/Checkout";
import OrderConfirmation from "./pages/editions/OrderConfirmation";
import EncounterLanding from "./pages/encounter/EncounterLanding";
import EventDetail from "./pages/encounter/EventDetail";
import TicketCheckout from "./pages/encounter/TicketCheckout";
import TicketConfirmation from "./pages/encounter/TicketConfirmation";
import AccountDashboard from "./pages/account/AccountDashboard";
import OrderHistory from "./pages/account/OrderHistory";
import OrderDetail from "./pages/account/OrderDetail";
import Addresses from "./pages/account/Addresses";
import Wishlist from "./pages/account/Wishlist";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/the-trinity" element={<TrinityHub />} />
                <Route path="/the-trinity/:brandSlug" element={<BrandPage />} />
                <Route path="/editions" element={<EditionsLanding />} />
                <Route path="/editions/c/:categorySlug" element={<CategoryPage />} />
                <Route path="/editions/p/:productSlug" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order/confirmed/:orderId" element={<OrderConfirmation />} />
                <Route path="/encounter" element={<EncounterLanding />} />
                <Route path="/encounter/e/:eventSlug" element={<EventDetail />} />
                <Route path="/encounter/checkout/:eventId" element={<TicketCheckout />} />
                <Route path="/encounter/confirmed/:ticketOrderId" element={<TicketConfirmation />} />
                <Route path="/account" element={<AccountDashboard />} />
                <Route path="/account/orders" element={<OrderHistory />} />
                <Route path="/account/orders/:orderId" element={<OrderDetail />} />
                <Route path="/account/addresses" element={<Addresses />} />
                <Route path="/account/wishlist" element={<Wishlist />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

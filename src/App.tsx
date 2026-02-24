import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/components/CartContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
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

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import ProductForm from "./pages/admin/ProductForm";
import EventsAdmin from "./pages/admin/EventsAdmin";
import EventForm from "./pages/admin/EventForm";
import BannersAdmin from "./pages/admin/BannersAdmin";
import CRMCustomers from "./pages/admin/CRMCustomers";
import CRMChatbot from "./pages/admin/CRMChatbot";
import CRMMessaging from "./pages/admin/CRMMessaging";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <AdminAuthProvider>
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

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<ProductsAdmin />} />
                  <Route path="products/:productId" element={<ProductForm />} />
                  <Route path="events" element={<EventsAdmin />} />
                  <Route path="events/:eventId" element={<EventForm />} />
                  <Route path="banners" element={<BannersAdmin />} />
                  <Route path="crm/customers" element={<CRMCustomers />} />
                  <Route path="crm/chatbot" element={<CRMChatbot />} />
                  <Route path="crm/messaging" element={<CRMMessaging />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AdminAuthProvider>
      </CartProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

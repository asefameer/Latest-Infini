import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import {
  LayoutDashboard, ShoppingBag, CalendarDays, Image, LogOut, ChevronLeft, Menu,
  Users, MessageCircle, Mail, BarChart3, Tag, ClipboardList, FileText,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin', badge: 0 },
  { label: 'Products', icon: ShoppingBag, path: '/admin/products', badge: 0 },
  { label: 'Events & Tickets', icon: CalendarDays, path: '/admin/events', badge: 0 },
  { label: 'Banners & Media', icon: Image, path: '/admin/banners', badge: 0 },
  { label: 'Site Content', icon: FileText, path: '/admin/content', badge: 0 },
  { label: 'Discounts', icon: Tag, path: '/admin/discounts', badge: 0 },
  { label: 'Orders', icon: ClipboardList, path: '/admin/orders', badge: 0 },
  { label: 'Customers', icon: Users, path: '/admin/crm/customers', badge: 0 },
  { label: 'Chatbot', icon: MessageCircle, path: '/admin/crm/chatbot', badge: 3 },
  { label: 'Messaging', icon: Mail, path: '/admin/crm/messaging', badge: 0 },
  { label: 'Analytics', icon: BarChart3, path: '/admin/crm/analytics', badge: 0 },
];

// Mock: new order count for Dashboard badge
const DASHBOARD_BADGE = 5;

const AdminLayout = () => {
  const { isAuthenticated, user, logout } = useAdminAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-card border-r border-border z-50 flex flex-col transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <span className="font-display font-bold text-sm bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              INFINITY CMS
            </span>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-foreground">
            {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(item => {
            const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const badgeCount = item.path === '/admin' ? DASHBOARD_BADGE : item.badge;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative',
                  active
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <span className="relative shrink-0">
                  <item.icon className="w-5 h-5" />
                  {badgeCount > 0 && collapsed && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold leading-none">
                      {badgeCount > 9 ? '9+' : badgeCount}
                    </span>
                  )}
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {badgeCount > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold leading-none">
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="border-t border-border p-3">
          {!collapsed && (
            <p className="text-xs text-muted-foreground mb-2 truncate">{user?.email}</p>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className={cn('flex-1 transition-all duration-300', collapsed ? 'ml-16' : 'ml-60')}>
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

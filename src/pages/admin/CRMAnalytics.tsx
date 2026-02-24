import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCustomers, mockEmailCampaigns, mockConversations } from '@/data/crm-mock';
import { TrendingUp, Users, MessageCircle, Mail } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

/* ── mock time-series data ── */
const customerGrowth = [
  { month: 'Sep', total: 120, new: 30 },
  { month: 'Oct', total: 180, new: 60 },
  { month: 'Nov', total: 240, new: 55 },
  { month: 'Dec', total: 330, new: 90 },
  { month: 'Jan', total: 410, new: 80 },
  { month: 'Feb', total: 480, new: 70 },
];

const campaignPerformance = mockEmailCampaigns
  .filter(c => c.status === 'sent')
  .map(c => ({
    name: c.name.length > 18 ? c.name.slice(0, 18) + '…' : c.name,
    openRate: c.openRate ?? 0,
    clickRate: c.clickRate ?? 0,
  }));

const chatbotResolution = [
  { name: 'Resolved', value: mockConversations.filter(c => c.status === 'resolved').length },
  { name: 'Open', value: mockConversations.filter(c => c.status === 'open').length },
  { name: 'Escalated', value: mockConversations.filter(c => c.status === 'escalated').length },
];

const segmentData = [
  { name: 'VIP', value: mockCustomers.filter(c => c.segment === 'vip').length },
  { name: 'Regular', value: mockCustomers.filter(c => c.segment === 'regular').length },
  { name: 'New', value: mockCustomers.filter(c => c.segment === 'new').length },
  { name: 'Inactive', value: mockCustomers.filter(c => c.segment === 'inactive').length },
];

const PIE_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent-foreground))',
  'hsl(var(--muted-foreground))',
];

const statCards = [
  { label: 'Total Customers', value: mockCustomers.length, icon: Users, delta: '+12%' },
  { label: 'Avg Open Rate', value: `${(campaignPerformance.reduce((a, c) => a + c.openRate, 0) / (campaignPerformance.length || 1)).toFixed(1)}%`, icon: Mail, delta: '+3.2%' },
  { label: 'Resolution Rate', value: `${((chatbotResolution[0].value / (mockConversations.length || 1)) * 100).toFixed(0)}%`, icon: MessageCircle, delta: '+5%' },
  { label: 'Total Revenue', value: `€${mockCustomers.reduce((a, c) => a + c.totalSpent, 0).toLocaleString()}`, icon: TrendingUp, delta: '+18%' },
];

const CRMAnalytics = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>

    {/* KPI cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map(s => (
        <Card key={s.label}>
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
              <span className="text-xs text-primary font-medium">{s.delta} vs last month</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Charts row 1 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Customer Growth */}
      <Card>
        <CardHeader><CardTitle className="text-base">Customer Growth</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
              <Legend />
              <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} name="Total" />
              <Area type="monotone" dataKey="new" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.15} name="New" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <Card>
        <CardHeader><CardTitle className="text-base">Campaign Performance</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis unit="%" className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
              <Legend />
              <Bar dataKey="openRate" fill="hsl(var(--primary))" name="Open %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="clickRate" fill="hsl(var(--secondary))" name="Click %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    {/* Charts row 2 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chatbot Resolution */}
      <Card>
        <CardHeader><CardTitle className="text-base">Chatbot Resolution</CardTitle></CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chatbotResolution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {chatbotResolution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer Segments */}
      <Card>
        <CardHeader><CardTitle className="text-base">Customer Segments</CardTitle></CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={segmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {segmentData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default CRMAnalytics;

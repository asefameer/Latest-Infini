import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockCustomers, mockEmailCampaigns, mockConversations } from '@/data/crm-mock';
import { TrendingUp, Users, MessageCircle, Mail, CalendarIcon } from 'lucide-react';
import { format, subDays, subMonths, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { DateRange } from 'react-day-picker';

/* ── preset ranges ── */
const presets = [
  { label: 'Last 7 days', range: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: 'Last 30 days', range: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: 'Last 3 months', range: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
  { label: 'Last 6 months', range: () => ({ from: subMonths(new Date(), 6), to: new Date() }) },
  { label: 'All time', range: () => ({ from: new Date('2024-01-01'), to: new Date() }) },
];

/* ── full mock time-series (monthly, keyed by date) ── */
const allCustomerGrowth = [
  { date: '2025-09-01', month: 'Sep 25', total: 120, new: 30 },
  { date: '2025-10-01', month: 'Oct 25', total: 180, new: 60 },
  { date: '2025-11-01', month: 'Nov 25', total: 240, new: 55 },
  { date: '2025-12-01', month: 'Dec 25', total: 330, new: 90 },
  { date: '2026-01-01', month: 'Jan 26', total: 410, new: 80 },
  { date: '2026-02-01', month: 'Feb 26', total: 480, new: 70 },
];

const PIE_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent-foreground))',
  'hsl(var(--muted-foreground))',
];

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  color: 'hsl(var(--foreground))',
};

const CRMAnalytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 6),
    to: new Date(),
  });
  const [activePreset, setActivePreset] = useState('Last 6 months');

  const handlePreset = (p: typeof presets[number]) => {
    setDateRange(p.range());
    setActivePreset(p.label);
  };

  const inRange = (dateStr: string) => {
    if (!dateRange?.from) return true;
    const d = new Date(dateStr);
    return isWithinInterval(d, {
      start: startOfDay(dateRange.from),
      end: endOfDay(dateRange.to ?? dateRange.from),
    });
  };

  /* ── filtered data ── */
  const customerGrowth = useMemo(
    () => allCustomerGrowth.filter(r => inRange(r.date)),
    [dateRange]
  );

  const filteredCampaigns = useMemo(
    () => mockEmailCampaigns.filter(c => c.status === 'sent' && c.sentAt && inRange(c.sentAt)),
    [dateRange]
  );

  const campaignPerformance = useMemo(
    () => filteredCampaigns.map(c => ({
      name: c.name.length > 18 ? c.name.slice(0, 18) + '…' : c.name,
      openRate: c.openRate ?? 0,
      clickRate: c.clickRate ?? 0,
    })),
    [filteredCampaigns]
  );

  const filteredConversations = useMemo(
    () => mockConversations.filter(c => inRange(c.startedAt)),
    [dateRange]
  );

  const chatbotResolution = useMemo(() => [
    { name: 'Resolved', value: filteredConversations.filter(c => c.status === 'resolved').length },
    { name: 'Open', value: filteredConversations.filter(c => c.status === 'open').length },
    { name: 'Escalated', value: filteredConversations.filter(c => c.status === 'escalated').length },
  ], [filteredConversations]);

  const filteredCustomers = useMemo(
    () => mockCustomers.filter(c => inRange(c.lastActive)),
    [dateRange]
  );

  const segmentData = useMemo(() => [
    { name: 'VIP', value: filteredCustomers.filter(c => c.segment === 'vip').length },
    { name: 'Regular', value: filteredCustomers.filter(c => c.segment === 'regular').length },
    { name: 'New', value: filteredCustomers.filter(c => c.segment === 'new').length },
    { name: 'Inactive', value: filteredCustomers.filter(c => c.segment === 'inactive').length },
  ], [filteredCustomers]);

  const totalConvos = filteredConversations.length || 1;
  const resolvedCount = chatbotResolution[0]?.value ?? 0;

  const statCards = [
    { label: 'Total Customers', value: filteredCustomers.length, icon: Users, delta: '+12%' },
    { label: 'Avg Open Rate', value: `${(campaignPerformance.reduce((a, c) => a + c.openRate, 0) / (campaignPerformance.length || 1)).toFixed(1)}%`, icon: Mail, delta: '+3.2%' },
    { label: 'Resolution Rate', value: `${((resolvedCount / totalConvos) * 100).toFixed(0)}%`, icon: MessageCircle, delta: '+5%' },
    { label: 'Total Revenue', value: `€${filteredCustomers.reduce((a, c) => a + c.totalSpent, 0).toLocaleString()}`, icon: TrendingUp, delta: '+18%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header + date range */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Preset buttons */}
          {presets.map(p => (
            <Button
              key={p.label}
              variant={activePreset === p.label ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
              onClick={() => handlePreset(p)}
            >
              {p.label}
            </Button>
          ))}

          {/* Custom date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn('text-xs gap-1.5', !dateRange?.from && 'text-muted-foreground')}>
                <CalendarIcon className="w-3.5 h-3.5" />
                {dateRange?.from ? (
                  dateRange.to
                    ? `${format(dateRange.from, 'MMM d')} – ${format(dateRange.to, 'MMM d, yyyy')}`
                    : format(dateRange.from, 'MMM d, yyyy')
                ) : 'Custom range'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  setActivePreset('');
                }}
                numberOfMonths={2}
                initialFocus
                className={cn('p-3 pointer-events-auto')}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

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
        <Card>
          <CardHeader><CardTitle className="text-base">Customer Growth</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} name="Total" />
                <Area type="monotone" dataKey="new" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.15} name="New" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Campaign Performance</CardTitle></CardHeader>
          <CardContent className="h-72">
            {campaignPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                  <YAxis unit="%" className="text-xs fill-muted-foreground" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="openRate" fill="hsl(var(--primary))" name="Open %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="clickRate" fill="hsl(var(--secondary))" name="Click %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No campaigns in this period</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Chatbot Resolution</CardTitle></CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chatbotResolution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {chatbotResolution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Customer Segments</CardTitle></CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={segmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {segmentData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CRMAnalytics;

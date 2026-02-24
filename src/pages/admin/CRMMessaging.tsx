import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, Bell, Plus, Eye, Send, Clock, Pencil, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockEmailCampaigns, mockPushNotifications, EmailCampaign, PushNotification } from '@/data/crm-mock';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusIcon: Record<string, React.ReactNode> = {
  draft: <Pencil className="w-3 h-3" />,
  scheduled: <Clock className="w-3 h-3" />,
  sent: <Send className="w-3 h-3" />,
};

const statusStyle: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground border-border',
  scheduled: 'bg-primary/15 text-primary border-primary/30',
  sent: 'bg-green-500/15 text-green-400 border-green-500/30',
};

const CRMMessaging = () => {
  const [tab, setTab] = useState('email');
  const [emails, setEmails] = useState(mockEmailCampaigns);
  const [pushes, setPushes] = useState(mockPushNotifications);
  const [emailForm, setEmailForm] = useState<Partial<EmailCampaign> | null>(null);
  const [pushForm, setPushForm] = useState<Partial<PushNotification> | null>(null);

  const openEmailForm = (campaign?: EmailCampaign) => {
    setEmailForm(campaign || { name: '', subject: '', segment: 'all', status: 'draft', recipientCount: 0 });
  };

  const saveEmail = () => {
    if (!emailForm?.name || !emailForm?.subject) { toast.error('Name and subject are required'); return; }
    if (emailForm.id) {
      setEmails(prev => prev.map(e => e.id === emailForm.id ? { ...e, ...emailForm } as EmailCampaign : e));
      toast.success('Campaign updated');
    } else {
      setEmails(prev => [...prev, { ...emailForm, id: `em-${Date.now()}`, recipientCount: Math.floor(Math.random() * 3000) } as EmailCampaign]);
      toast.success('Campaign created');
    }
    setEmailForm(null);
  };

  const openPushForm = (notif?: PushNotification) => {
    setPushForm(notif || { title: '', body: '', segment: 'all', status: 'draft', recipientCount: 0 });
  };

  const savePush = () => {
    if (!pushForm?.title || !pushForm?.body) { toast.error('Title and body are required'); return; }
    if (pushForm.id) {
      setPushes(prev => prev.map(p => p.id === pushForm.id ? { ...p, ...pushForm } as PushNotification : p));
      toast.success('Notification updated');
    } else {
      setPushes(prev => [...prev, { ...pushForm, id: `pn-${Date.now()}`, recipientCount: Math.floor(Math.random() * 5000) } as PushNotification]);
      toast.success('Notification created');
    }
    setPushForm(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">Messaging</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 bg-muted/50">
          <TabsTrigger value="email" className="gap-1"><Mail className="w-4 h-4" /> Email Campaigns</TabsTrigger>
          <TabsTrigger value="push" className="gap-1"><Bell className="w-4 h-4" /> Push Notifications</TabsTrigger>
        </TabsList>

        {/* Email Campaigns */}
        <TabsContent value="email">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">{emails.length} campaigns</p>
            <Button size="sm" onClick={() => openEmailForm()} className="gap-1"><Plus className="w-4 h-4" /> New Campaign</Button>
          </div>

          <div className="space-y-3">
            {emails.map(em => (
              <div key={em.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{em.name}</p>
                    <p className="text-xs text-muted-foreground">"{em.subject}"</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn('capitalize text-xs gap-1', statusStyle[em.status])}>
                      {statusIcon[em.status]} {em.status}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => openEmailForm(em)}><Pencil className="w-3 h-3" /></Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Segment: {em.segment}</span>
                  <span>{em.recipientCount.toLocaleString()} recipients</span>
                  {em.openRate !== undefined && <span>Opens: {em.openRate}%</span>}
                  {em.clickRate !== undefined && <span>Clicks: {em.clickRate}%</span>}
                  {em.sentAt && <span>Sent: {em.sentAt}</span>}
                  {em.scheduledAt && <span>Scheduled: {em.scheduledAt}</span>}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Push Notifications */}
        <TabsContent value="push">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">{pushes.length} notifications</p>
            <Button size="sm" onClick={() => openPushForm()} className="gap-1"><Plus className="w-4 h-4" /> New Notification</Button>
          </div>

          <div className="space-y-3">
            {pushes.map(pn => (
              <div key={pn.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-foreground">{pn.title}</p>
                  <Badge variant="outline" className={cn('capitalize text-xs gap-1', statusStyle[pn.status])}>
                    {statusIcon[pn.status]} {pn.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{pn.body}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                  <span>Segment: {pn.segment}</span>
                  <span>{pn.recipientCount.toLocaleString()} recipients</span>
                  {pn.sentAt && <span>Sent: {pn.sentAt}</span>}
                  {pn.scheduledAt && <span>Scheduled: {pn.scheduledAt}</span>}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Email Form Dialog */}
      <Dialog open={!!emailForm} onOpenChange={() => setEmailForm(null)}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">{emailForm?.id ? 'Edit Campaign' : 'New Campaign'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input placeholder="Campaign name" value={emailForm?.name || ''} onChange={e => setEmailForm(f => f ? { ...f, name: e.target.value } : f)} className="bg-background border-border" />
            <Input placeholder="Email subject line" value={emailForm?.subject || ''} onChange={e => setEmailForm(f => f ? { ...f, subject: e.target.value } : f)} className="bg-background border-border" />
            <Select value={emailForm?.segment || 'all'} onValueChange={v => setEmailForm(f => f ? { ...f, segment: v } : f)}>
              <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="nova-fan">Nova Fans</SelectItem>
                <SelectItem value="xforce-fan">X-Force Fans</SelectItem>
                <SelectItem value="ltm-fan">LTM Fans</SelectItem>
                <SelectItem value="event-goer">Event Goers</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={emailForm?.status || 'draft'} onValueChange={v => setEmailForm(f => f ? { ...f, status: v as EmailCampaign['status'] } : f)}>
              <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEmailForm(null)}>Cancel</Button>
              <Button onClick={saveEmail}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Push Form Dialog */}
      <Dialog open={!!pushForm} onOpenChange={() => setPushForm(null)}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">{pushForm?.id ? 'Edit Notification' : 'New Notification'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input placeholder="Notification title" value={pushForm?.title || ''} onChange={e => setPushForm(f => f ? { ...f, title: e.target.value } : f)} className="bg-background border-border" />
            <Textarea placeholder="Notification body..." value={pushForm?.body || ''} onChange={e => setPushForm(f => f ? { ...f, body: e.target.value } : f)} rows={3} className="bg-background border-border" />
            <Select value={pushForm?.segment || 'all'} onValueChange={v => setPushForm(f => f ? { ...f, segment: v } : f)}>
              <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="nova-fan">Nova Fans</SelectItem>
                <SelectItem value="xforce-fan">X-Force Fans</SelectItem>
                <SelectItem value="event-goer">Event Goers</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setPushForm(null)}>Cancel</Button>
              <Button onClick={savePush}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRMMessaging;

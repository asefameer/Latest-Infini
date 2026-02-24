import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, MessageCircle, BookOpen, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { mockConversations, mockKBArticles, ChatConversation, KBArticle } from '@/data/crm-mock';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  open: 'bg-green-500/15 text-green-400 border-green-500/30',
  resolved: 'bg-muted text-muted-foreground border-border',
  escalated: 'bg-destructive/15 text-destructive border-destructive/30',
};

const CRMChatbot = () => {
  const [tab, setTab] = useState('conversations');
  const [convSearch, setConvSearch] = useState('');
  const [kbSearch, setKBSearch] = useState('');
  const [selectedConv, setSelectedConv] = useState<ChatConversation | null>(null);
  const [kbArticles, setKBArticles] = useState(mockKBArticles);
  const [editingKB, setEditingKB] = useState<KBArticle | null>(null);
  const [kbForm, setKBForm] = useState({ title: '', category: '', content: '', isPublished: true });

  const filteredConvs = mockConversations.filter(c =>
    c.customerName.toLowerCase().includes(convSearch.toLowerCase())
  );

  const filteredKB = kbArticles.filter(a =>
    a.title.toLowerCase().includes(kbSearch.toLowerCase()) || a.category.toLowerCase().includes(kbSearch.toLowerCase())
  );

  const openKBEditor = (article?: KBArticle) => {
    if (article) {
      setEditingKB(article);
      setKBForm({ title: article.title, category: article.category, content: article.content, isPublished: article.isPublished });
    } else {
      setEditingKB({ id: '', title: '', category: '', content: '', isPublished: true, updatedAt: '' });
      setKBForm({ title: '', category: '', content: '', isPublished: true });
    }
  };

  const saveKB = () => {
    if (!kbForm.title || !kbForm.content) { toast.error('Title and content are required'); return; }
    if (editingKB?.id) {
      setKBArticles(prev => prev.map(a => a.id === editingKB.id ? { ...a, ...kbForm, updatedAt: new Date().toISOString().split('T')[0] } : a));
      toast.success('Article updated');
    } else {
      setKBArticles(prev => [...prev, { id: `kb-${Date.now()}`, ...kbForm, updatedAt: new Date().toISOString().split('T')[0] }]);
      toast.success('Article created');
    }
    setEditingKB(null);
  };

  const deleteKB = (id: string) => {
    setKBArticles(prev => prev.filter(a => a.id !== id));
    toast.success('Article deleted');
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">Chatbot Management</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 bg-muted/50">
          <TabsTrigger value="conversations" className="gap-1"><MessageCircle className="w-4 h-4" /> Conversations</TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-1"><BookOpen className="w-4 h-4" /> Knowledge Base</TabsTrigger>
        </TabsList>

        {/* Conversations Tab */}
        <TabsContent value="conversations">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." value={convSearch} onChange={e => setConvSearch(e.target.value)} className="pl-9 bg-card border-border" />
          </div>

          <div className="space-y-3">
            {filteredConvs.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{conv.customerName}</p>
                  <Badge variant="outline" className={cn('capitalize text-xs', statusColors[conv.status])}>{conv.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{conv.messages[conv.messages.length - 1]?.content}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{conv.messages.length} messages · {new Date(conv.lastMessageAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search articles..." value={kbSearch} onChange={e => setKBSearch(e.target.value)} className="pl-9 bg-card border-border" />
            </div>
            <Button size="sm" onClick={() => openKBEditor()} className="gap-1"><Plus className="w-4 h-4" /> New Article</Button>
          </div>

          <div className="space-y-3">
            {filteredKB.map(article => (
              <div key={article.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-foreground">{article.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={article.isPublished ? 'default' : 'secondary'} className="text-xs">{article.isPublished ? 'Published' : 'Draft'}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => openKBEditor(article)}><Pencil className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteKB(article.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{article.category} · Updated {article.updatedAt}</p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{article.content}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Conversation Detail Dialog */}
      <Dialog open={!!selectedConv} onOpenChange={() => setSelectedConv(null)}>
        <DialogContent className="max-w-lg bg-card border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              {selectedConv?.customerName}
              {selectedConv && <Badge variant="outline" className={cn('capitalize text-xs', statusColors[selectedConv.status])}>{selectedConv.status}</Badge>}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {selectedConv?.messages.map(msg => (
              <div key={msg.id} className={cn('flex', msg.role === 'customer' ? 'justify-start' : 'justify-end')}>
                <div className={cn(
                  'max-w-[80%] rounded-xl px-3 py-2 text-sm',
                  msg.role === 'customer' ? 'bg-muted text-foreground' :
                  msg.role === 'bot' ? 'bg-primary/15 text-primary' :
                  'bg-secondary/15 text-secondary'
                )}>
                  <p className="text-[10px] font-medium mb-0.5 opacity-60 uppercase">{msg.role}</p>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* KB Editor Dialog */}
      <Dialog open={!!editingKB} onOpenChange={() => setEditingKB(null)}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">{editingKB?.id ? 'Edit Article' : 'New Article'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input placeholder="Title" value={kbForm.title} onChange={e => setKBForm(f => ({ ...f, title: e.target.value }))} className="bg-background border-border" />
            <Input placeholder="Category (e.g. Orders, Events)" value={kbForm.category} onChange={e => setKBForm(f => ({ ...f, category: e.target.value }))} className="bg-background border-border" />
            <Textarea placeholder="Article content..." value={kbForm.content} onChange={e => setKBForm(f => ({ ...f, content: e.target.value }))} rows={6} className="bg-background border-border" />
            <div className="flex items-center gap-2">
              <Switch checked={kbForm.isPublished} onCheckedChange={v => setKBForm(f => ({ ...f, isPublished: v }))} />
              <span className="text-sm text-muted-foreground">Published</span>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingKB(null)}>Cancel</Button>
              <Button onClick={saveKB}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRMChatbot;

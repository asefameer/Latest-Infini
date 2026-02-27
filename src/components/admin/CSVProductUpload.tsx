import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Upload, Download, FileSpreadsheet, Loader2, Check, X, AlertTriangle, Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCreateProduct } from '@/services/api/hooks';
import type { Product } from '@/types';

const SAMPLE_CSV = `name,slug,brand,category,price,currency,description,in_stock,is_new,is_trending,is_live,tags,images
"Neon Pulse Hoodie",neon-pulse-hoodie,nova,apparel,3500,BDT,"A bold neon hoodie for the brave.",true,true,false,false,"hoodie,neon,streetwear","/placeholder.svg"
"Shadow Runner Sneakers",shadow-runner-sneakers,x-force,footwear,7800,BDT,"Stealth-mode sneakers with grip.",true,false,true,true,"sneakers,running","/placeholder.svg"
`;

const REQUIRED_COLS = ['name', 'slug', 'brand', 'category', 'price'] as const;
const VALID_BRANDS = ['nova', 'live-the-moment', 'x-force'];
const VALID_CATEGORIES = ['apparel', 'accessories', 'footwear', 'limited-drops'];

interface ParsedRow {
  data: Partial<Product>;
  errors: string[];
  selected: boolean;
}

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (current.trim()) lines.push(current);
      current = '';
      if (ch === '\r' && text[i + 1] === '\n') i++;
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current);

  const splitRow = (line: string): string[] => {
    const cells: string[] = [];
    let cell = '';
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (q && line[i + 1] === '"') { cell += '"'; i++; } else q = !q; }
      else if (ch === ',' && !q) { cells.push(cell.trim()); cell = ''; }
      else cell += ch;
    }
    cells.push(cell.trim());
    return cells;
  };

  const headers = splitRow(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_'));
  const rows = lines.slice(1).map(splitRow);
  return { headers, rows };
}

function validateRow(headers: string[], cells: string[]): ParsedRow {
  const errors: string[] = [];
  const get = (col: string) => {
    const idx = headers.indexOf(col);
    return idx >= 0 ? cells[idx] ?? '' : '';
  };

  const name = get('name');
  const slug = get('slug') || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const brand = get('brand').toLowerCase();
  const category = get('category').toLowerCase();
  const priceStr = get('price');
  const price = Number(priceStr);

  if (!name) errors.push('Name is required');
  if (!slug) errors.push('Slug is required');
  if (!brand || !VALID_BRANDS.includes(brand)) errors.push(`Invalid brand: "${brand}"`);
  if (!category || !VALID_CATEGORIES.includes(category)) errors.push(`Invalid category: "${category}"`);
  if (!priceStr || isNaN(price) || price < 0) errors.push('Invalid price');
  if (name.length > 200) errors.push('Name too long (max 200)');
  if (slug.length > 200) errors.push('Slug too long (max 200)');

  const toBool = (v: string) => ['true', '1', 'yes'].includes(v.toLowerCase());

  const data: Partial<Product> = {
    name,
    slug,
    brand: brand as Product['brand'],
    category,
    price: isNaN(price) ? 0 : price,
    currency: get('currency') || 'BDT',
    description: get('description') || '',
    inStock: get('in_stock') ? toBool(get('in_stock')) : true,
    isNew: toBool(get('is_new')),
    isTrending: toBool(get('is_trending')),
    isLive: toBool(get('is_live')),
    tags: get('tags') ? get('tags').split(',').map(t => t.trim()).filter(Boolean) : [],
    images: get('images') ? get('images').split(',').map(t => t.trim()).filter(Boolean) : ['/placeholder.svg'],
    specs: [],
    variants: [],
  };

  return { data, errors, selected: errors.length === 0 };
}

export const CSVProductUpload = ({ onComplete }: { onComplete?: () => void }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [parsed, setParsed] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const createMutation = useCreateProduct();

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      toast.error('Please upload a CSV file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const { headers, rows } = parseCSV(text);
        const missing = REQUIRED_COLS.filter(c => !headers.includes(c));
        if (missing.length) {
          toast.error(`Missing columns: ${missing.join(', ')}`);
          return;
        }
        const parsed = rows.map(cells => validateRow(headers, cells));
        setParsed(parsed);
        const validCount = parsed.filter(r => r.errors.length === 0).length;
        toast.success(`Parsed ${parsed.length} rows (${validCount} valid)`);
      } catch {
        toast.error('Failed to parse CSV');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.csv') || f.type === 'text/csv');
    if (files.length === 0) { toast.error('Please drop CSV files'); return; }
    // Process all CSV files
    files.forEach(f => handleFile(f));
  };

  const toggleRow = (idx: number) => {
    setParsed(prev => prev.map((r, i) => i === idx ? { ...r, selected: !r.selected } : r));
  };

  const updateRowField = (idx: number, field: string, value: any) => {
    setParsed(prev => prev.map((r, i) => i === idx ? { ...r, data: { ...r.data, [field]: value } } : r));
  };

  const removeRow = (idx: number) => {
    setParsed(prev => prev.filter((_, i) => i !== idx));
  };

  const handleImport = async () => {
    const selected = parsed.filter(r => r.selected && r.errors.length === 0);
    if (selected.length === 0) { toast.error('No valid rows selected'); return; }
    setImporting(true);
    let success = 0;
    let failed = 0;
    for (const row of selected) {
      try {
        await createMutation.mutateAsync({
          ...row.data,
          id: `csv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        } as Product);
        success++;
      } catch {
        failed++;
      }
    }
    setImporting(false);
    toast.success(`Imported ${success} product${success !== 1 ? 's' : ''}${failed ? `, ${failed} failed` : ''}`);
    setParsed([]);
    onComplete?.();
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'products-sample.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsed.filter(r => r.selected && r.errors.length === 0).length;

  return (
    <div className="space-y-4">
      {/* Drop zone + sample download */}
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={downloadSample} className="gap-2 shrink-0">
          <Download className="w-4 h-4" /> Download Sample CSV
        </Button>
        <input ref={fileRef} type="file" accept=".csv,text/csv" multiple className="hidden" onChange={e => {
          if (e.target.files) Array.from(e.target.files).forEach(handleFile);
          if (fileRef.current) fileRef.current.value = '';
        }} />
      </div>

      <div
        onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
        onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDragOver(false); }}
        onDrop={handleDrop}
        onClick={() => !importing && fileRef.current?.click()}
        className={`
          flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed cursor-pointer
          transition-colors min-h-[120px] p-6
          ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
          ${importing ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <FileSpreadsheet className="w-10 h-10 text-muted-foreground/40" />
        <span className="text-sm text-muted-foreground">
          Drag & drop CSV files here, or click to browse
        </span>
        <span className="text-xs text-muted-foreground/60">
          Supports multiple CSV files at once
        </span>
      </div>

      {/* Parsed preview table */}
      {parsed.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{parsed.length} rows parsed</span>
              <Badge variant="outline" className="text-xs">{validCount} ready</Badge>
              {parsed.some(r => r.errors.length > 0) && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {parsed.filter(r => r.errors.length > 0).length} with errors
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setParsed([])}>
                Clear
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={importing || validCount === 0}
                onClick={handleImport}
                className="gap-2"
              >
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {importing ? 'Importing…' : `Import ${validCount} Product${validCount !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left text-xs text-muted-foreground w-8"></th>
                  <th className="px-3 py-2 text-left text-xs text-muted-foreground">Name</th>
                  <th className="px-3 py-2 text-left text-xs text-muted-foreground">Slug</th>
                  <th className="px-3 py-2 text-left text-xs text-muted-foreground">Brand</th>
                  <th className="px-3 py-2 text-left text-xs text-muted-foreground">Category</th>
                  <th className="px-3 py-2 text-right text-xs text-muted-foreground">Price</th>
                  <th className="px-3 py-2 text-center text-xs text-muted-foreground">Live</th>
                  <th className="px-3 py-2 text-left text-xs text-muted-foreground">Status</th>
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {parsed.map((row, idx) => (
                  <tr key={idx} className={`border-b border-border/30 ${row.errors.length > 0 ? 'bg-destructive/5' : ''}`}>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={row.selected}
                        disabled={row.errors.length > 0}
                        onChange={() => toggleRow(idx)}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        value={row.data.name || ''}
                        onChange={e => updateRowField(idx, 'name', e.target.value)}
                        className="h-7 text-xs"
                      />
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground font-mono">{row.data.slug}</td>
                    <td className="px-3 py-2">
                      <Select value={row.data.brand} onValueChange={v => updateRowField(idx, 'brand', v)}>
                        <SelectTrigger className="h-7 text-xs w-[120px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nova">Nova</SelectItem>
                          <SelectItem value="live-the-moment">LTM</SelectItem>
                          <SelectItem value="x-force">X-Force</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Select value={row.data.category} onValueChange={v => updateRowField(idx, 'category', v)}>
                        <SelectTrigger className="h-7 text-xs w-[120px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apparel">Apparel</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                          <SelectItem value="footwear">Footwear</SelectItem>
                          <SelectItem value="limited-drops">Limited Drops</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        value={row.data.price || 0}
                        onChange={e => updateRowField(idx, 'price', Number(e.target.value))}
                        className="h-7 text-xs w-20 text-right"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Switch
                        checked={row.data.isLive || false}
                        onCheckedChange={v => updateRowField(idx, 'isLive', v)}
                        className="scale-75"
                      />
                    </td>
                    <td className="px-3 py-2">
                      {row.errors.length > 0 ? (
                        <span className="text-xs text-destructive flex items-center gap-1">
                          <X className="w-3 h-3" /> {row.errors[0]}
                        </span>
                      ) : (
                        <span className="text-xs text-green-500 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeRow(idx)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

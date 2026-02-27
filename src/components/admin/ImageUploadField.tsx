import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadCmsImage } from '@/hooks/use-cms';

export const ImageUploadField = ({
  value,
  onChange,
  label = 'Image',
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadCmsImage(file);
      onChange(url);
      toast.success('Image uploaded');
    } catch (err: any) {
      toast.error(err.message ?? 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-2">
        <Input
          placeholder="https://... or drag & drop below"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          title="Upload image"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        </Button>
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed
          cursor-pointer transition-colors min-h-[100px]
          ${dragOver
            ? 'border-primary bg-primary/5'
            : value && value.startsWith('http')
              ? 'border-border'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-1.5 py-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Uploading…</span>
          </div>
        ) : value && value.startsWith('http') ? (
          <img src={value} alt="Preview" className="w-full max-h-32 object-cover rounded" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
            <span className="text-xs text-muted-foreground">
              Drag & drop an image here, or click to browse
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

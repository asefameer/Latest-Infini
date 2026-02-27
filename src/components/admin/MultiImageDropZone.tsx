import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, Images } from 'lucide-react';
import { toast } from 'sonner';
import { uploadCmsImage } from '@/hooks/use-cms';

interface MultiImageDropZoneProps {
  onImagesUploaded: (urls: string[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export const MultiImageDropZone = ({
  onImagesUploaded,
  maxFiles = 10,
  maxSizeMB = 5,
}: MultiImageDropZoneProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const processFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => {
      if (!f.type.startsWith('image/')) {
        toast.error(`${f.name} is not an image`);
        return false;
      }
      if (f.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${f.name} exceeds ${maxSizeMB} MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;
    if (validFiles.length > maxFiles) {
      toast.error(`Max ${maxFiles} files at once`);
      return;
    }

    setUploading(true);
    setProgress({ done: 0, total: validFiles.length });

    const urls: string[] = [];
    for (const file of validFiles) {
      try {
        const url = await uploadCmsImage(file);
        urls.push(url);
        setProgress(p => ({ ...p, done: p.done + 1 }));
      } catch (err: any) {
        toast.error(`Failed: ${file.name}`);
      }
    }

    setUploading(false);
    if (urls.length > 0) {
      onImagesUploaded(urls);
      toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => e.target.files && processFiles(e.target.files)}
      />
      <div
        onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
        onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDragOver(false); }}
        onDrop={e => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
          if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
        }}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`
          flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed
          cursor-pointer transition-colors min-h-[120px] p-4
          ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-1.5">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              Uploading {progress.done}/{progress.total}…
            </span>
            <div className="w-40 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <Images className="w-10 h-10 text-muted-foreground/40" />
            <span className="text-sm text-muted-foreground">
              Drag & drop multiple images here, or click to browse
            </span>
            <span className="text-xs text-muted-foreground/60">
              Up to {maxFiles} files · {maxSizeMB} MB each
            </span>
          </>
        )}
      </div>
    </div>
  );
};

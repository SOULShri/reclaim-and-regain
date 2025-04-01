
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ImagePlus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileChange: (file: File) => void;
  onFileUpload: (file: File) => Promise<string>;
  value?: string;
  onChange?: (url: string) => void;
  accept?: string;
  preview?: boolean;
  className?: string;
  label?: string;
}

export function FileUpload({
  onFileChange,
  onFileUpload,
  value,
  onChange,
  accept = "image/*",
  preview = true,
  className,
  label = "Upload File"
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError(null);
    onFileChange(file);
    
    if (preview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    
    try {
      setIsUploading(true);
      const uploadedUrl = await onFileUpload(file);
      if (onChange) {
        onChange(uploadedUrl);
      }
      setPreviewUrl(uploadedUrl);
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
        <input
          type="file"
          accept={accept}
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        {previewUrl && preview ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-40 object-contain mx-auto"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button type="button" variant="outline" size="sm" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Change File
                  </>
                )}
              </Button>
            </label>
          </div>
        ) : (
          <label htmlFor="file-upload" className="cursor-pointer block">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {isUploading ? 'Uploading...' : 'Drag and drop or click to upload'}
              </p>
              <Button type="button" variant="outline" size="sm" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {label}
                  </>
                )}
              </Button>
            </div>
          </label>
        )}
        
        {error && (
          <p className="text-sm text-destructive mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}

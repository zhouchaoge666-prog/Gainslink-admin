import { useRef, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MAX_SIZE_MB = 5;

export default function ImageUpload({ value, onChange, placeholder = '点击上传封面图片' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`图片大小不能超过 ${MAX_SIZE_MB}MB`);
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange('');
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
          <img src={value} alt="cover" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white text-slate-700 rounded-lg hover:bg-slate-50"
            >
              <Upload size={12} />
              重新上传
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white text-red-600 rounded-lg hover:bg-red-50"
            >
              <X size={12} />
              清除
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-48 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-primary/50 transition-colors flex flex-col items-center justify-center text-slate-400"
        >
          <ImageIcon size={32} className="mb-2" />
          <span className="text-sm">{placeholder}</span>
          <span className="text-xs mt-1">支持 JPG / PNG / GIF，最大 {MAX_SIZE_MB}MB</span>
        </button>
      )}

      {error && (
        <div className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
    </div>
  );
}

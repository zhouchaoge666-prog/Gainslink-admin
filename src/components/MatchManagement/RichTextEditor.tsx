import { useRef, useEffect, useState } from 'react';
import { Bold, Italic, ImageIcon } from 'lucide-react';

interface RichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = '请输入图文内容...',
  rows = 4,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (editor.innerHTML !== value) {
      editor.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    const html = editorRef.current?.innerHTML || '';
    onChange(html);
  };

  const exec = (command: string, valueArg: string | undefined = undefined) => {
    document.execCommand(command, false, valueArg);
    editorRef.current?.focus();
    handleInput();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        editorRef.current?.focus();
        document.execCommand('insertImage', false, result);
        handleInput();
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isEmpty = !value || value === '<br>' || value === '<div><br></div>';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
        <button
          type="button"
          onClick={() => exec('bold')}
          className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded transition-colors"
          title="粗体"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded transition-colors"
          title="斜体"
        >
          <Italic size={14} />
        </button>
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded transition-colors"
          title="插入图片"
        >
          <ImageIcon size={14} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <div
        className={`relative border rounded-lg transition-colors ${
          isFocused ? 'border-primary' : 'border-slate-200'
        }`}
      >
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full text-sm px-3 py-2 outline-none min-h-[96px] empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
          data-placeholder={placeholder}
          style={{ minHeight: `${rows * 24}px` }}
        />
      </div>

      {isEmpty && (
        <div className="text-xs text-slate-400">支持文字、粗体、斜体与图片混排</div>
      )}
    </div>
  );
}

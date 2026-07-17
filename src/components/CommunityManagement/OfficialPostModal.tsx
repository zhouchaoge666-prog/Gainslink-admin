import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Image, Video, Smile, Hash, Pin, Plus } from 'lucide-react';

const EMOJI_LIST = ['🔥', '🏆', '💪', '😱', '👀', '🎮', '⚡', '🎯', '🥇', '👏', '📢', '🌟'];

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
  'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400',
];

const OFFICIAL_AVATAR = 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80';

export interface OfficialPostData {
  title: string;
  content: string;
  category: string;
  images: string[];
  videoUrl: string;
  isPinned: boolean;
}

interface Props {
  onClose: () => void;
  onPost: (data: OfficialPostData) => void;
}

export default function OfficialPostModal({ onClose, onPost }: Props) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Announcement');
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [showVideoZone, setShowVideoZone] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasImages = images.length > 0;
  const hasVideo = !!videoUrl;
  const canPost = content.trim().length > 0;

  const handlePost = () => {
    if (!canPost) return;
    onPost({ title: '', content, category, images, videoUrl, isPinned });
    onClose();
  };

  const addEmoji = (emoji: string) => {
    setContent(prev => prev + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  const addMockImage = () => {
    const next = MOCK_IMAGES[images.length % MOCK_IMAGES.length];
    if (images.length < 9) setImages(prev => [...prev, next]);
  };

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center">
              <span className="text-primary text-sm font-bold">官</span>
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-sm">发布官方帖子</h2>
              <p className="text-xs text-slate-400">以 Gainslink Official 身份发布</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Author row */}
          <div className="flex items-center gap-3">
            <img src={OFFICIAL_AVATAR} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-primary/20" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Gainslink Official</p>
              <span className="text-[11px] px-2 py-0.5 bg-primary-light text-primary rounded-full font-medium">官方账号</span>
            </div>
          </div>

          {/* Content textarea — always visible */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={5}
              maxLength={1000}
              placeholder="输入帖子内容...（支持换行）"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 transition-colors resize-none leading-relaxed bg-slate-50/50"
            />
            <div className="absolute bottom-3 right-3 text-[11px] text-slate-300 select-none">{content.length}/1000</div>
          </div>

          {/* Image grid (shown when images exist) */}
          {hasImages && (
            <div className="space-y-2">
              <div className={`grid gap-2 ${images.length > 1 ? 'grid-cols-3' : 'grid-cols-1'}`}>
                {images.map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-100">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
                {images.length < 9 && (
                  <button
                    onClick={addMockImage}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-colors text-slate-400 hover:text-primary ${
                      images.length === 0 ? 'py-10' : 'aspect-square'
                    }`}
                  >
                    <Plus size={20} />
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400">{images.length}/9 张图片</p>
            </div>
          )}

          {/* Video upload zone (toggle) */}
          {showVideoZone && !hasVideo && (
            <div
              onClick={() => { setVideoUrl('https://www.w3schools.com/html/mov_bbb.mp4'); setShowVideoZone(false); }}
              className="flex flex-col items-center justify-center gap-2 py-12 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer group"
            >
              <Video size={28} className="text-slate-300 group-hover:text-primary transition-colors" />
              <p className="text-sm text-slate-400 group-hover:text-primary transition-colors font-medium">上传视频</p>
              <p className="text-xs text-slate-300">支持 MP4、MOV 格式，最大 500MB</p>
            </div>
          )}

          {/* Video preview */}
          {hasVideo && (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
              <video src={videoUrl} className="w-full h-full object-contain" controls />
              <button
                onClick={() => setVideoUrl('')}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
            {/* Emoji */}
            <div className="relative">
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-primary/8 transition-colors"
                title="表情"
              >
                <Smile size={16} />
              </button>
              {showEmoji && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowEmoji(false)} />
                  <div className="absolute bottom-9 left-0 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2 flex flex-wrap gap-1 w-52">
                    {EMOJI_LIST.map(e => (
                      <button key={e} onClick={() => addEmoji(e)}
                        className="w-8 h-8 flex items-center justify-center text-lg hover:bg-slate-100 rounded-lg transition-colors">
                        {e}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Image button — disabled when video exists */}
            <button
              onClick={() => { if (!hasVideo) addMockImage(); }}
              disabled={hasVideo}
              className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-primary/8 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="添加图片"
            >
              <Image size={16} />
            </button>

            {/* Video button — disabled when images exist */}
            <button
              onClick={() => { if (!hasImages && !hasVideo) setShowVideoZone(v => !v); }}
              disabled={hasImages || hasVideo}
              className={`p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                showVideoZone ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary hover:bg-primary/8'
              }`}
              title="添加视频"
            >
              <Video size={16} />
            </button>

            {/* Category — free-text input */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
              <Hash size={11} className="flex-shrink-0" />
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="输入标签…"
                className="text-xs font-semibold bg-transparent outline-none w-28 placeholder-primary/50 text-primary"
                maxLength={30}
              />
            </div>

            {/* Pin toggle */}
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isPinned
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
              title="置顶"
            >
              <Pin size={11} />
              置顶
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 flex-shrink-0 bg-slate-50/50 rounded-b-2xl">
          <div className="text-xs text-slate-400">
            将以 <span className="font-semibold text-primary">Gainslink Official</span> 官方身份发布
            {isPinned && <span className="ml-2 text-primary font-medium">· 已设置置顶</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handlePost}
              disabled={!canPost}
              className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              发布帖子
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

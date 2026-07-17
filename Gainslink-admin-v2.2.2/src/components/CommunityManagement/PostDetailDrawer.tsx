import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Pin, Flame, Trash2, Heart, MessageSquare, Share2, Eye, ChevronDown, ChevronUp, ShieldCheck, ShieldX, Clock } from 'lucide-react';
import { communityCommentData, communityCommentReplies, CommunityPost, CommunityComment, CommentReply } from '../../data/mockData';

const STATUS_LABELS: Record<CommunityPost['status'], string> = { normal: '正常', hidden: '已隐藏', deleted: '已删除' };
const STATUS_COLORS: Record<CommunityPost['status'], string> = {
  normal: 'bg-emerald-50 text-emerald-600',
  hidden: 'bg-yellow-50 text-yellow-600',
  deleted: 'bg-red-50 text-red-500',
};
const AUTO_REVIEW_CONFIG = {
  passed: { label: '已通过', Icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  failed: { label: '未通过', Icon: ShieldX, color: 'text-red-500', bg: 'bg-red-50' },
  pending: { label: '审核中', Icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
};
const COMMENT_STATUS_COLORS: Record<CommunityComment['status'], string> = {
  normal: '', hidden: 'opacity-50', deleted: 'opacity-30 line-through',
};

interface Props {
  post: CommunityPost;
  isHot?: boolean;
  zIndex?: string;
  onClose: () => void;
  onUpdateStatus: (id: number, status: CommunityPost['status']) => void;
  onTogglePin: (id: number) => void;
  onToggleHot?: (id: number) => void;
  onOpenUser?: (authorId: string) => void;
}

export default function PostDetailDrawer({ post, isHot, zIndex = 'z-50', onClose, onUpdateStatus, onTogglePin, onToggleHot, onOpenUser }: Props) {
  const [comments, setComments] = useState<CommunityComment[]>(
    communityCommentData.filter(c => c.postId === post.id)
  );
  const [replies, setReplies] = useState<CommentReply[]>(
    communityCommentReplies.filter(r =>
      communityCommentData.some(c => c.postId === post.id && c.id === r.commentId)
    )
  );
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  const ar = AUTO_REVIEW_CONFIG[post.autoReview];
  const ArIcon = ar.Icon;

  const updateCommentStatus = (id: number, status: CommunityComment['status']) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };
  const updateReplyStatus = (id: number, status: CommentReply['status']) => {
    setReplies(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const toggleReplies = (commentId: number) => {
    setExpandedComments(prev => {
      const n = new Set(prev);
      n.has(commentId) ? n.delete(commentId) : n.add(commentId);
      return n;
    });
  };

  return createPortal(
    <div className={`fixed inset-0 ${zIndex} flex`} onClick={onClose}>
      <div className="flex-1 bg-black/20" />
      <div
        className="w-[520px] h-full bg-white flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="font-semibold text-slate-800 text-sm">帖子详情</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Author info */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-100">
            <button
              onClick={() => onOpenUser?.(post.authorId)}
              className="flex items-center gap-3 group text-left w-full"
            >
              <img src={post.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">{post.authorName}</p>
                <p className="text-xs text-slate-400">{post.createdAt}</p>
              </div>
            </button>
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{post.category}</span>
              {post.isPinned && (
                <span className="text-xs text-primary bg-primary-light px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Pin size={10} />置顶
                </span>
              )}
              {post.isOfficial && (
                <span className="text-xs text-primary bg-primary-light px-2 py-0.5 rounded-full font-bold">官方</span>
              )}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[post.status]}`}>
                {STATUS_LABELS[post.status]}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${ar.bg} ${ar.color}`}>
                <ArIcon size={10} />{ar.label}
              </span>
            </div>
            {post.autoReviewReason && (
              <div className="mt-2 px-3 py-2 bg-red-50 rounded-lg text-xs text-red-600">
                <span className="font-semibold">拦截原因：</span>{post.autoReviewReason}
              </div>
            )}
          </div>

          {/* Title & content */}
          <div className="px-6 py-5 border-b border-slate-100">
            {post.title && (
              <h3 className="text-base font-bold text-slate-800 mb-3 leading-snug">{post.title}</h3>
            )}
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5 px-6 py-3 border-b border-slate-100 text-sm text-slate-600">
            <span className="flex items-center gap-1.5"><Eye size={14} className="text-sky-400" /> {post.views.toLocaleString()}</span>
            <span className="flex items-center gap-1.5"><Heart size={14} className="text-rose-400" /> {post.likes}</span>
            <span className="flex items-center gap-1.5"><MessageSquare size={14} className="text-blue-400" /> {post.comments}</span>
            <span className="flex items-center gap-1.5"><Share2 size={14} className="text-green-500" /> {post.shares}</span>
            {post.reportCount > 0 && (
              <span className="ml-auto text-xs text-red-500">⚠ {post.reportCount} 条举报</span>
            )}
          </div>

          {/* Management actions */}
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">管理操作</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onTogglePin(post.id)}
                className={`text-xs px-3 py-1.5 border rounded-lg transition-colors flex items-center gap-1.5 ${
                  post.isPinned
                    ? 'border-primary/30 bg-primary-light text-primary'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Pin size={12} />{post.isPinned ? '取消置顶' : '设为置顶'}
              </button>
              <button
                onClick={() => onToggleHot?.(post.id)}
                className={`text-xs px-3 py-1.5 border rounded-lg transition-colors flex items-center gap-1.5 ${
                  isHot
                    ? 'border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Flame size={12} />{isHot ? '取消热门' : '上热门'}
              </button>
              {post.status !== 'deleted' && (
                <button
                  onClick={() => onUpdateStatus(post.id, 'deleted')}
                  className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={12} />删除帖子
                </button>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="px-6 py-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              全部评论（{comments.length}）
            </p>
            {comments.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">暂无评论</p>
            )}
            <div className="space-y-4">
              {comments.map(comment => {
                const commentReplies = replies.filter(r => r.commentId === comment.id);
                const isExpanded = expandedComments.has(comment.id);
                return (
                  <div key={comment.id} className={`rounded-xl border ${comment.status === 'normal' ? 'border-slate-100 bg-slate-50' : 'border-red-100 bg-red-50/30'}`}>
                    {/* Comment */}
                    <div className="p-3">
                      <div className="flex items-start gap-2">
                        <img src={comment.authorAvatar} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-slate-700">{comment.authorName}</span>
                            <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                            {comment.status !== 'normal' && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                comment.status === 'hidden' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-500'
                              }`}>
                                {comment.status === 'hidden' ? '已隐藏' : '已删除'}
                              </span>
                            )}
                            {comment.reportCount > 0 && (
                              <span className="text-[10px] text-red-500 ml-auto">⚠ 被举报 {comment.reportCount} 次</span>
                            )}
                          </div>
                          <p className={`text-xs text-slate-600 leading-relaxed ${COMMENT_STATUS_COLORS[comment.status]}`}>
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><Heart size={9} /> {comment.likes}</span>
                            {/* Comment actions */}
                            <div className="ml-auto flex items-center gap-1">
                              {commentReplies.length > 0 && (
                                <button
                                  onClick={() => toggleReplies(comment.id)}
                                  className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                                >
                                  {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                                  {commentReplies.length} 条回复
                                </button>
                              )}
                              {comment.status === 'normal' ? (
                                <button
                                  onClick={() => updateCommentStatus(comment.id, 'hidden')}
                                  className="text-[10px] px-2 py-0.5 border border-yellow-200 text-yellow-600 rounded hover:bg-yellow-50 transition-colors"
                                >
                                  隐藏
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateCommentStatus(comment.id, 'normal')}
                                  className="text-[10px] px-2 py-0.5 border border-emerald-200 text-emerald-600 rounded hover:bg-emerald-50 transition-colors"
                                >
                                  恢复
                                </button>
                              )}
                              {comment.status !== 'deleted' && (
                                <button
                                  onClick={() => updateCommentStatus(comment.id, 'deleted')}
                                  className="text-[10px] px-2 py-0.5 border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors"
                                >
                                  删除
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {isExpanded && commentReplies.length > 0 && (
                      <div className="border-t border-slate-100 px-3 pb-3 pt-2 space-y-2.5 ml-8">
                        {commentReplies.map(reply => (
                          <div key={reply.id} className={`flex items-start gap-2 ${reply.status !== 'normal' ? 'opacity-50' : ''}`}>
                            <img src={reply.authorAvatar} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[11px] font-semibold text-slate-600">{reply.authorName}</span>
                                <span className="text-[10px] text-slate-400">{reply.createdAt}</span>
                                {reply.status !== 'normal' && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                    reply.status === 'hidden' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-500'
                                  }`}>
                                    {reply.status === 'hidden' ? '已隐藏' : '已删除'}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed">{reply.content}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><Heart size={8} /> {reply.likes}</span>
                                <div className="ml-auto flex items-center gap-1">
                                  {reply.status === 'normal' ? (
                                    <button
                                      onClick={() => updateReplyStatus(reply.id, 'hidden')}
                                      className="text-[10px] px-2 py-0.5 border border-yellow-200 text-yellow-600 rounded hover:bg-yellow-50 transition-colors"
                                    >
                                      隐藏
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => updateReplyStatus(reply.id, 'normal')}
                                      className="text-[10px] px-2 py-0.5 border border-emerald-200 text-emerald-600 rounded hover:bg-emerald-50 transition-colors"
                                    >
                                      恢复
                                    </button>
                                  )}
                                  {reply.status !== 'deleted' && (
                                    <button
                                      onClick={() => updateReplyStatus(reply.id, 'deleted')}
                                      className="text-[10px] px-2 py-0.5 border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors"
                                    >
                                      删除
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

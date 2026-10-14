import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '../ui/Button';

export function TaskComments({ taskId }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Alex Chen', text: 'Working on backend database constraints.', time: '1h ago' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, { id: Date.now(), author: 'You', text: comment, time: 'Just now' }]);
    setComment('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
        <MessageSquare className="h-4 w-4" /> Activity & Comments
      </div>
      <div className="space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
            <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
              <span>{c.author}</span>
              <span className="text-[10px] text-slate-400 font-normal">{c.time}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">{c.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment..."
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        />
        <Button size="sm" type="submit" icon={Send}>Send</Button>
      </form>
    </div>
  );
}

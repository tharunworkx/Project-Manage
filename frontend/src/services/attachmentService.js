import { supabase } from '../lib/supabase';

export const attachmentService = {
  async fetchAttachments(taskId) {
    const { data, error } = await supabase.from('attachments').select('*').eq('task_id', taskId);
    if (error) return [];
    return data;
  },
  async uploadAttachment(taskId, file) {
    const filePath = `${taskId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('task-attachments').upload(filePath, file);
    if (uploadError) throw uploadError;
    return { name: file.name, path: filePath };
  },
};

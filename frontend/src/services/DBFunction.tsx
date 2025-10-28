import { supabase } from '../supabase-client';
import type { RectType } from '../components/types';

export interface CanvasData {
  rects: RectType[];
}

export async function saveCanvas(data: CanvasData): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    if (data.rects.length > 0) {
        await supabase.from('rects').insert(
            data.rects.map(rect => ({
            user_id: user.id,
            rect_id: rect.id,
            title: rect.title,
            description: rect.description,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            color: rect.color,
            due_date: rect.dueDate,
            status: rect.status,
            is_collapsed: rect.isCollapsed,
            children: rect.children,
            parents: rect.parents,
      }))
    );
}
    
    return { success: true };
} 
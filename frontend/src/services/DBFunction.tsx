import { supabase } from "../supabase-client";
import type { RectType } from "../components/types";

export interface CanvasData {
  rects: RectType[];
  // add others later
}

export async function saveCanvas(
  data: CanvasData
): Promise<{ success: boolean; error?: string }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    if (data.rects.length > 0) {
      await supabase.from("rects").insert(
        data.rects.map((rect) => ({
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
  } catch (error) {
    console.error("Error saving:", error);
    return { success: false };
  }
}

export async function loadCanvas(): Promise<
  { success: true; data: CanvasData } | { success: false; error: string }
> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("rects") //add others later
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    const rects: RectType[] = (data ?? []).map((r: any) => ({
      id: r.rect_id,
      title: r.title ?? "",
      description: r.description ?? "",
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height,
      color: r.color ?? "#ffffff",
      dueDate: r.due_date ?? "",
      status: r.status ?? "",
      isCollapsed: r.is_collapsed ?? false,
      children: r.children ?? [],
      parents: r.parents ?? "",
    }));

    return { success: true, data: { rects } };
  } catch (error: any) {
    console.error("loadCanvas error:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteCanvas(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase
      .from("rects")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("deleteCanvas error:", err);
    return { success: false, error: String(err) };
  }
}

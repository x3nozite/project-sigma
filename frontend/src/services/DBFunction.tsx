import { supabase } from "../supabase-client";
import type { RectType, ShapeType } from "../components/types";

export interface CanvasData {
  shapes: ShapeType[];
  // add others later
}

// export async function saveCanvas(
//   data: CanvasData
// ): Promise<{ success: boolean; error?: string }> {
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return { success: false, error: "User not authenticated" };
//     }

//     if (data.shapes.length > 0) {
//       await supabase.from("shapes").upsert(
//         data.shapes.filter((s): s is RectType => s.type === "rect").map((rect) => ({
//           user_id: user.id,
//           rect_id: rect.id,
//           title: rect.title,
//           description: rect.description,
//           x: rect.x,
//           y: rect.y,
//           width: rect.width,
//           height: rect.height,
//           color: rect.color,
//           due_date: rect.dueDate,
//           status: rect.status,
//           is_collapsed: rect.isCollapsed,
//           children: rect.children,
//           parents: rect.parents,
//         }))
//       );
//     }

//     return { success: true };
//   } catch (error) {
//     console.error("Error saving:", error);
//     return { success: false };
//   }
// }

async function getOrCreateCanvas(userId: string): Promise<string | null> {
  const { data: existingCanvas, error: fetchError } = await supabase
    .from("canvas")
    .select("canvas_id")
    .eq("owner_id", userId)
    .maybeSingle(); // returns null if no canvas exists

  if (fetchError) {
    console.error("Error fetching canvas:", fetchError);
    return null;
  }

  if (existingCanvas) {
    return existingCanvas.canvas_id;
  }

  // canvas id doesnt exist
  console.log("canvas id doesnt exist");
  const { data: newCanvas, error: createError } = await supabase
    .from("canvas")
    .insert({
      owner_id: userId,
      viewport_x: 0,
      viewport_y: 0,
      viewport_zoom: 1,
    })
    .select("canvas_id")
    .single();

  if (createError) {
    console.error("Error creating canvas:", createError);
    return null;
  }
  
  return newCanvas.canvas_id;
}

export async function saveCanvas(
  data: CanvasData,
  canvasId?: string | null
): Promise<{ success: boolean; error?: string; canvasId?: string }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Get the canvas ID (either provided or get/create default)
    let targetCanvasId = canvasId;
    if (!targetCanvasId) {
      targetCanvasId = await getOrCreateCanvas(user.id);
      if (!targetCanvasId) {
        return { success: false, error: "Failed to get canvas" };
      }
    }

    if (data.shapes.length > 0) {
      // Delete existing shapes for this canvas
      await supabase
        .from("shapes")
        .delete()
        .eq("canvas_id", targetCanvasId);

      // Insert new shapes
      const shapesToInsert = data.shapes.map((shape) => ({
        canvas_id: targetCanvasId,
        shape_data: shape, // Store the entire shape object as JSON
      }));

      const { error: insertError } = await supabase
        .from("shapes")
        .insert(shapesToInsert);

      if (insertError) {
        return { success: false, error: insertError.message };
      }
    } else {
      // If no shapes, delete all shapes for this canvas
      await supabase
        .from("shapes")
        .delete()
        .eq("canvas_id", targetCanvasId);
    }

    return { success: true, canvasId: targetCanvasId };
  } catch (error) {
    console.log("ASDJKLASDJLDJKLASASDJKL");
    console.error("Error saving:", error);
    return { success: false, error: String(error) };
  }
}

// export async function loadCanvas(): Promise<
//   { success: true; data: CanvasData } | { success: false; error: string }
// > {
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return { success: false, error: "User not authenticated" };
//     }

//     const { data, error } = await supabase
//       .from("rects") //add others later
//       .select("*")
//       .eq("user_id", user.id);

//     if (error) {
//       return { success: false, error: error.message };
//     }

//     const rects: RectType[] = (data ?? []).map((r: any) => ({
//       id: r.rect_id,
//       title: r.title ?? "",
//       description: r.description ?? "",
//       x: r.x,
//       y: r.y,
//       width: r.width,
//       height: r.height,
//       color: r.color ?? "#ffffff",
//       dueDate: r.due_date ?? "",
//       status: r.status ?? "",
//       isCollapsed: r.is_collapsed ?? false,
//       children: r.children ?? [],
//       parents: r.parents ?? "",
//     }));

//     return { success: true, data: { rects } };
//   } catch (error: any) {
//     console.error("loadCanvas error:", error);
//     return { success: false, error: String(error) };
//   }
// }

export async function loadCanvas(
  canvasId?: string | null
): Promise<
  { success: true; data: CanvasData; canvasId: string } | { success: false; error: string }
> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }


    let targetCanvasId = canvasId;
    if (!targetCanvasId) {
      targetCanvasId = await getOrCreateCanvas(user.id);
      if (!targetCanvasId) {
        return { success: false, error: "Failed to get or create canvas" };
      }
    }

    const { data, error } = await supabase
      .from("shapes")
      .select("shape_data")
      .eq("canvas_id", targetCanvasId);

    if (error) {
      return { success: false, error: error.message };
    }

    const shapes: ShapeType[] = (data ?? []).map((row: any) => row.shape_data);

    return { success: true, data: { shapes }, canvasId: targetCanvasId };
  } catch (error: any) {
    console.error("loadCanvas error:", error);
    return { success: false, error: String(error) };
  }
}


// export async function deleteCanvas(): Promise<{
//   success: boolean;
//   error?: string;
// }> {
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return { success: false, error: "User not authenticated" };
//     }

//     const { error } = await supabase
//       .from("rects")
//       .delete()
//       .eq("user_id", user.id);

//     if (error) {
//       return { success: false, error: error.message };
//     }

//     return { success: true };
//   } catch (err: any) {
//     console.error("deleteCanvas error:", err);
//     return { success: false, error: String(err) };
//   }
// }

export async function deleteCanvas(
  canvasId: string | null
): Promise<{
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

    // Delete all shapes for this canvas
    const { error: shapesError } = await supabase
      .from("shapes")
      .delete()
      .eq("canvas_id", canvasId);

    if (shapesError) {
      return { success: false, error: shapesError.message };
    }

    // Optionally delete the canvas record itself
    const { error: canvasError } = await supabase
      .from("canvas")
      .delete()
      .eq("canvas_id", canvasId)
      .eq("owner_id", user.id);

    if (canvasError) {
      return { success: false, error: canvasError.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("deleteCanvas error:", err);
    return { success: false, error: String(err) };
  }
}


export async function getUserProfile(): Promise<
  { success: true; data: UserProfile } | { success: false; error: string }
> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: {
        id: data.id,
        avatar_url: data.avatar_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    };
  } catch (error: any) {
    console.error("getUserProfile error:", error);
    return { success: false, error: String(error) };
  }
}

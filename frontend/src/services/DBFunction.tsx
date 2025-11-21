import { supabase } from "../supabase-client";
import type { RectType, ShapeType, LineType, ArrowType } from "../components/types";

export interface CanvasData {
  shapes: ShapeType[];
  connectors: ArrowType[];
}

async function getOrCreateCanvas(userId: string): Promise<string | null> {
  const { data: existingCanvas, error: fetchError } = await supabase
    .from("canvas")
    .select("canvas_id")
    .order("created_at", { ascending: false }) // ambil paling baru
    .limit(1)
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
      viewport_zoom: 100,
    })
    .select("canvas_id")
    .single();

  if (createError) {
    console.error("Error creating canvas:", createError);
    return null;
  }

  return newCanvas.canvas_id;
}

export async function createNewCanvas(
  userId: string,
  name?: string
): Promise<{ success: boolean; canvasId?: string; error?: string }> {
  try {
    const { data: newCanvas, error: createError } = await supabase
      .from("canvas")
      .insert({
        owner_id: userId,
        canvas_name: name || `Canvas ${Date.now()}`,
        viewport_x: 0,
        viewport_y: 0,
        viewport_zoom: 100,
      })
      .select("canvas_id")
      .single();

    if (createError) {
      return { success: false, error: createError.message };
    }

    return { success: true, canvasId: newCanvas.canvas_id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getUserCanvases(
  userId: string
): Promise<{ success: boolean; canvases?: any[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("canvas")
      .select("canvas_id, canvas_name, created_at, updated_at")
      .eq("owner_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, canvases: data || [] };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function saveCanvas(
  shapesData: CanvasData,
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

    if (shapesData.shapes.length > 0) {
      // Delete existing shapes for this canvas
      await supabase.from("shapes").delete().eq("canvas_id", targetCanvasId);

      // Insert new shapes
      const shapesToInsert = shapesData.shapes.map((shape) => ({
        canvas_id: targetCanvasId,
        shape_data: shape
      }));

      const connectorsToInsert = shapesData.connectors.map((connector) => ({
        canvas_id: targetCanvasId,
        shape_data: connector
      }));

      console.log("connectors to insert:", connectorsToInsert);


      const allData = [...shapesToInsert, ...connectorsToInsert];

      console.log(allData);

      const { error: insertError } = await supabase
        .from("shapes")
        .insert(allData);
      if (insertError) {
        return { success: false, error: insertError.message };
      }
    } else {
      // If no shapes, delete all shapes for this canvas
      await supabase.from("shapes").delete().eq("canvas_id", targetCanvasId);
    }

    return { success: true, canvasId: targetCanvasId };
  } catch (error) {
    console.error("Error saving:", error);
    return { success: false, error: String(error) };
  }
}

export async function loadCanvas(
  canvasId?: string | null
): Promise<
  | { success: true; data: CanvasData; canvasId: string }
  | { success: false; error: string }
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

    const shapes: ShapeType[] = data.filter((row) => row.shape_data["shape"] === "rect").map((row) => row.shape_data);
    const connectors: ArrowType[] = data.filter((row) => row.shape_data["shape"] === "connector").map((row) => row.shape_data);
    console.log("rects to load: ", shapes);
    console.log("connectors to load: ", connectors);

    return { success: true, data: { shapes, connectors }, canvasId: targetCanvasId };
  } catch (error: any) {
    console.error("loadCanvas error:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteCanvas(canvasId: string | null): Promise<{
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

    /* DELETE CANVAS FROM DATABASE, COULD BE USEFUL IN OTHER PARTS */
    // const { error: canvasError } = await supabase
    //   .from("canvas")
    //   .delete()
    //   .eq("canvas_id", canvasId)
    //   .eq("owner_id", user.id);

    // if (canvasError) {
    //   return { success: false, error: canvasError.message };
    // }

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

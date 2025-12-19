import { supabase } from "../supabase-client";
import type { ShapeType, ArrowType } from "../components/types";

interface Viewport {
  x: number;
  y: number;
  scale: number;
}

export interface CanvasData {
  shapes: ShapeType[];
  connectors: ArrowType[];
  viewport: Viewport;
}

interface CanvasDataRecord {
  local_canvas: string;
  canvasData: CanvasData;
  updatedAt: number;
}

interface UserProfile {
  id: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

type CollaboratorRole = "owner" | "editor" | "viewer";

export interface CanvasUsers {
  user_id: string;
  role: CollaboratorRole;
}

async function getOrCreateCanvas(userId: string): Promise<string | null> {
  const { data: existingCanvas, error: fetchError } = await supabase
    .from("canvas")
    .select("canvas_id")
    .order("updated_at", { ascending: false }) // ambil paling baru
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
  // console.log("canvas id doesnt exist");
  const { data: newCanvas, error: createError } = await supabase
    .from("canvas")
    .insert({
      owner_id: userId,
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

export async function updateCanvasColor(
  canvasId?: string | null,
  canvasCol?: string
) {
  try {
    const { data: auth } = await supabase.auth.getUser(); // could just check if canvasId === "local" (?)
    const user = auth?.user;

    if (!user || canvasId === "local") {
      await new Promise((resolve) => {
        const request = indexedDB.open("CanvasDB");

        const canvasColorData = {
          local_color: "local",
          color: canvasCol || "#ffffff",
          updatedAt: Date.now(),
        };

        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction("BackgroundColor", "readwrite");
          const colorStore = tx.objectStore("BackgroundColor");

          colorStore.put(canvasColorData);

          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(true);
        };

        request.onerror = () => resolve(true);
      });

      return { success: true, canvasId: "local" };
    }

    const { error } = await supabase
      .from("canvas")
      .update({ background_color: canvasCol })
      .eq("canvas_id", canvasId);

    if (error) {
      console.error(error);
    }
  } catch (error) {
    console.error("Error on update canvas color function: ", error);
  }
}

export async function getCanvasColor(canvasId: string | null) {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user || canvasId === "local") {
      return new Promise((resolve) => {
        const request = indexedDB.open("CanvasDB");

        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction(["BackgroundColor"], "readonly");
          const store = tx.objectStore("BackgroundColor");
          const res = store.get("local");

          tx.oncomplete = () => {
            const localColor = res.result;
            if (localColor) {
              resolve(localColor.color);
            }
            else resolve("#ffffff");
          };
        };

        request.onerror = () => {
          resolve("#ffffff");
        };
      });
    }

    // fetch from database if user is logged in
    const { data, error } = await supabase
      .from("canvas")
      .select("background_color")
      .eq("canvas_id", canvasId)
      .single();

    if (error) {
      console.error(error);
      return "#ffffff";
    }

    return data.background_color;
  } catch (error) {
    console.error("Error on get canvas color function: ", error);
  }
}

export async function saveCanvas(
  shapesData: CanvasData,
  canvasId?: string | null,
): Promise<{ success: boolean; error?: string; canvasId?: string }> {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    // --- SAVE TO INDEXEDDB if not logged in---
    if (!user || canvasId === "local") {
      await new Promise((resolve) => {
        const request = indexedDB.open("CanvasDB");

        const canvasData = {
          local_canvas: "local",
          canvasData: shapesData,
          updatedAt: Date.now(),
        };

        const viewportData = {
          canvas_viewport: "local",
          x: shapesData.viewport.x,
          y: shapesData.viewport.y,
          scale: shapesData.viewport.scale,
          updatedAt: Date.now(),
        };

        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction(["Canvas", "Viewport"], "readwrite");
          const canvasStore = tx.objectStore("Canvas");
          const viewportStore = tx.objectStore("Viewport");

          canvasStore.put(canvasData);
          viewportStore.put(viewportData);

          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(true);
        };

        request.onerror = () => resolve(true);
      });

      return { success: true, canvasId: "local" };
    }

    if (!user) {
      return { success: true };
    }

    let targetCanvasId = canvasId;
    if (!targetCanvasId) {
      targetCanvasId = await getOrCreateCanvas(user.id);
      if (!targetCanvasId) {
        return { success: false, error: "Failed to get canvas" };
      }
    }

    if (!shapesData || !shapesData.shapes || !shapesData.connectors) {
      console.warn("Skipping save - incomplete data");
      return { success: true, canvasId: targetCanvasId };
    }

    await supabase.from("shapes").delete().eq("canvas_id", targetCanvasId);

    const shapesToInsert = shapesData.shapes.map((shape) => ({
      canvas_id: targetCanvasId,
      shape_data: shape,
    }));

    const connectorsToInsert = shapesData.connectors.map((c) => ({
      canvas_id: targetCanvasId,
      shape_data: c,
    }));

    const allData = [...shapesToInsert, ...connectorsToInsert];

    // console.log('Saving to DB:', {
    //   shapes: shapesToInsert.length,
    //   connectors: connectorsToInsert.length,
    //   total: allData.length
    // });

    if (allData.length > 0) {
      const { error: insertError } = await supabase
        .from("shapes")
        .insert(allData);

      if (insertError) {
        console.error("Insert error:", insertError);
        return { success: false, error: insertError.message };
      }
    }

    // if (shapesData.shapes.length > 0) {
    //   await supabase.from("shapes").delete().eq("canvas_id", targetCanvasId);

    //   const shapesToInsert = shapesData.shapes.map((shape) => ({
    //     canvas_id: targetCanvasId,
    //     shape_data: shape,
    //   }));

    //   const connectorsToInsert = shapesData.connectors.map((c) => ({
    //     canvas_id: targetCanvasId,
    //     shape_data: c,
    //   }));

    //   const allData = [...shapesToInsert, ...connectorsToInsert];
    //   const { error: insertError } = await supabase
    //     .from("shapes")
    //     .insert(allData);

    //   if (insertError) {
    //     return { success: false, error: insertError.message };
    //   }
    // } else {
    //   await supabase.from("shapes").delete().eq("canvas_id", targetCanvasId);
    // }

    return { success: true, canvasId: targetCanvasId };
  } catch (error) {
    console.error("Error saving:", error);
    return { success: false, error: String(error) };
  }
}

const loadViewport = async (): Promise<Viewport> => {
  return new Promise((resolve) => {
    const request = indexedDB.open("CanvasDB");

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("Viewport", "readonly");
      const store = tx.objectStore("Viewport");
      const res = store.get("local");

      tx.oncomplete = () => {
        const vp = res.result as Viewport | undefined;
        if (vp) resolve(vp);
        else resolve({ x: 0, y: 0, scale: 1 });
      };
    };

    request.onerror = () => {
      resolve({ x: 0, y: 0, scale: 1 });
    };
  });
};

export function filterValidConnectors(
  connectors: ArrowType[],
  shapes: ShapeType[]
) {
  const shapeIds = new Set(shapes.map((s) => s.id));

  return connectors.filter(
    (c) => c.from && c.to && shapeIds.has(c.from) && shapeIds.has(c.to)
  );
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
    const viewport = await loadViewport();

    if (!user || canvasId === "local") {
      return new Promise((resolve) => {
        const request = indexedDB.open("CanvasDB");

        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction(["Canvas", "Viewport"], "readonly");
          const canvasStore = tx.objectStore("Canvas");
          const canvasRes = canvasStore.get("local");

          const viewportStore = tx.objectStore("Viewport");
          const viewportRes = viewportStore.get("local");

          canvasRes.onerror = () =>
            resolve({ success: false, error: "Failed to get canvas data" });
          viewportRes.onerror = () =>
            resolve({ success: false, error: "Failed to get canvas viewport" });

          tx.oncomplete = () => {
            const canvasRecord = canvasRes.result as
              | CanvasDataRecord
              | undefined;
            const viewportRecord = viewportRes.result as Viewport | undefined;

            if (!canvasRecord) {
              resolve({ success: false, error: "No offline canvas found" });
              return;
            }

            if (viewportRecord)
              canvasRecord.canvasData.viewport = viewportRecord;

            resolve({
              success: true,
              data: canvasRecord.canvasData,
              canvasId: canvasRecord.local_canvas,
            });
          };
        };
      });
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

    const rects: ShapeType[] = data
      .filter((row) => row.shape_data["shape"] === "rect")
      .map((row) => row.shape_data);
    const lines: ShapeType[] = data
      .filter((row) => row.shape_data["shape"] === "line")
      .map((row) => row.shape_data);
    // const connectors: ArrowType[] = data.filter((row) => row.shape_data["shape"] === "connector").map((row) => row.shape_data);
    const todos: ShapeType[] = data
      .filter((row) => row.shape_data["shape"] === "todo")
      .map((row) => row.shape_data);
    const connectors: ArrowType[] = data
      .filter((row) => row.shape_data["shape"] === "connector")
      .map((row) => row.shape_data);

    const shapes = [...rects, ...lines, ...todos];

    const uniqueShapes = Array.from(
      new Map(shapes.map((s) => [s.id, s])).values()
    );

    const uniqueConnectors = Array.from(
      new Map(connectors.map((c) => [c.id, c])).values()
    );

    const shapeIdSet = new Set<string>();
    uniqueShapes.forEach(shape => {
      shapeIdSet.add(shape.id);
      shapeIdSet.add(`group-${shape.id}`);
    });

    const validConnectors = uniqueConnectors.filter(conn => {
      const hasFrom = shapeIdSet.has(conn.from);
      const hasTo = shapeIdSet.has(conn.to);

      if (!hasFrom || !hasTo) {
        console.warn('Removing orphaned connector:', {
          id: conn.id,
          from: conn.from,
          to: conn.to,
          fromExists: hasFrom,
          toExists: hasTo
        });
        return false;
      }

      return true;
    });
    
    // console.log('Load complete:', {
    //   shapes: uniqueShapes.length,
    //   connectors: validConnectors.length,
    //   removed: uniqueConnectors.length - validConnectors.length
    // });

    return {
      success: true,
      data: { shapes: uniqueShapes, connectors: validConnectors, viewport },
      canvasId: targetCanvasId,
      
    };
  } catch (error: any) {
    console.error("loadCanvas error:", error);
    return { success: false, error: String(error) };
  }
}

export async function addCanvasUser(
  canvasId: string,
  userId: string | undefined,
  role: CollaboratorRole
) {
  try {
    const { data, error } = await supabase
      .from("canvas_collaborators")
      .insert([
        {
          canvas_id: canvasId,
          user_id: userId,
          role: role,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      collaborator: data as CanvasUsers,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to add collaborator",
    };
  }
}

export async function checkCanvasUserExists(
  canvasId: string,
  userId: string | undefined
) {
  const { data } = await supabase
    .from("canvas_collaborators")
    .select("canvas_id")
    .eq("canvas_id", canvasId)
    .eq("user_id", userId)
    .single();

  return !!data; //converts data to boolean
}

export async function getCanvasUsers(canvasId: string) {
  try {
    const { data, error } = await supabase
      .from("canvas_collaborators")
      .select("user_id, role")
      .eq("canvas_id", canvasId)
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Error fetching collaborators:", error);
      return [];
    }

    return data as CanvasUsers[];
  } catch (error) {
    console.error("Error:", error);
  }

  return [];
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

export async function updateCanvasName(
  canvasId: string,
  newName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase
      .from("canvas")
      .update({ canvas_name: newName, updated_at: new Date().toISOString() })
      .eq("canvas_id", canvasId)
      .eq("owner_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("updateCanvasName error:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteCanvasById(
  canvasId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error: shapesError } = await supabase
      .from("shapes")
      .delete()
      .eq("canvas_id", canvasId);

    if (shapesError) {
      return { success: false, error: shapesError.message };
    }

    const { error: canvasError } = await supabase
      .from("canvas")
      .delete()
      .eq("canvas_id", canvasId)
      .eq("owner_id", user.id);

    if (canvasError) {
      return { success: false, error: canvasError.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("deleteCanvasById error:", error);
    return { success: false, error: String(error) };
  }
}

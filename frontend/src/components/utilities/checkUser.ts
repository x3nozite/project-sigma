import { supabase } from "../../supabase-client";

export async function checkEmailExists(email: string) {
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  return !!data; // converts to boolean (true if exists)
}

export async function checkUsernameExists(username: string) {
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();
  return !!data; // converts to boolean (true if exists)
}

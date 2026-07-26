import { supabase } from "./supabase-client";

// ✅ Fetch a single user profile by ID
export const getProfile = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  if (!session) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

// ✅ Update a profile safely
export const updateProfile = async (userId, updates) => {
  if (!userId) throw new Error("User ID is required");

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  if (!session) throw new Error("Not authenticated");

  // ✅ Fix: Always include .select("*").single() to get full updated record
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
};
// ✅ Delete a user by ID (admin action)
export const deleteUserById = async (userId) => {
  const { error } = await supabase.from("profiles").delete().eq("id", userId);
  if (error) throw error;
  return userId; // return deleted user id for confirmation
};


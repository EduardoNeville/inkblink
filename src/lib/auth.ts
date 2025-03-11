import { supabase } from "@/lib/supabase";

/**
 * Handles user login with email and password
 */
export const handleLogin = async (email: string, password: string) => {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Handles user sign-up and stores user in Supabase database with 5 Inkbucks.
 */
export const handleSignup = async (name: string, email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw new Error(error.message);

  if (data.user) {
    await saveUserToDatabase(data.user.id, name, email);
  }

  setTimeout(async () => {
    const { data, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) throw new Error(sessionError.message);
    const user = data.session?.user;
    if (user) {
      const { id, email, user_metadata } = user;
      const name = user_metadata.full_name || "Google User";

      // Ensure user exists in the database
      await saveUserToDatabase(id, name, email);
    }
  }, 2000);

  return data;
};

/**
 * Handles Google OAuth Login and ensures user is stored in the database.
 */
export const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });

  if (error) throw new Error(error.message);

  // Wait for authentication to complete
  setTimeout(async () => {
    const { data, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) throw new Error(sessionError.message);
    const user = data.session?.user;
    if (user) {
      const { id, email, user_metadata } = user;
      const name = user_metadata.full_name || email?.split("@");

      // Ensure user exists in the database
      await saveUserToDatabase(id, name, email);
    }

  }, 2000);
};

/**
 * Saves a user to the database if they don’t already exist.
 */
const saveUserToDatabase = async (id: string, name: string, email: string) => {
  // Check if user already exists in `users` table
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("id", id)
    .single();

  console.log("Existing User: ", existingUser);

  if (fetchError && fetchError.code !== "PGRST116") throw new Error(fetchError.message);

  if (!existingUser) {
    const { error: dbError } = await supabase
      .from("users")
      .insert([{ id, email, name: name, inkbucks: 5 }]);

    if (dbError) throw new Error(dbError.message);
  }

};

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
 * Handles user sign-up, and initializes the user with 5 Inkbucks in the database
 */
export const handleSignup = async (name: string, email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
};

/**
 * Handles Google OAuth Login
 */
export const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth(
    {
      provider: "google" 
    }
  );
  if (error) throw new Error(error.message);
};

export const newUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  console.log("User data: ", user);
}

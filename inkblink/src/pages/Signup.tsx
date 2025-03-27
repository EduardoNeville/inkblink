import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Handle email/password login
  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem("idToken", idToken); // Store token for API requests
      navigate("/create");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login");
    }
  };

  // Handle email/password signup
  const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const target = e.target as typeof e.target & {
      name: { value: string };
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    const name = target.name.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await createUserInBackend(idToken, email, name); // Sync with backend
      localStorage.setItem("idToken", idToken);
      navigate("/create");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during signup");
    }
  };

  // Handle Google login/signup
  const onGoogleLogin = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const email = result.user.email || "";
      const name = result.user.displayName || "";
      await createUserInBackend(idToken, email, name); // Sync with backend
      localStorage.setItem("idToken", idToken);
      navigate("/create");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred with Google login");
    }
  };

  // Send ID token to backend to create or retrieve user
  const createUserInBackend = async (idToken: string, email: string, name: string) => {
    const response = await fetch("http://localhost:8000/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: idToken, email, username: name }),
    });
    if (!response.ok) {
      console.log("Response: ", response)
      throw new Error("Failed to sync user with backend");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 md:p-10 mt-10">
      <div className="w-full max-w-3xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid md:grid-cols-2">
            <div className="p-6 md:p-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="flex justify-center gap-4 w-full">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                </TabsList>

                {/* LOGIN FORM */}
                <TabsContent value="login">
                  <form onSubmit={onLogin} className="flex flex-col gap-4 mt-5">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-primary">Welcome back</h2>
                      <p className="text-muted-foreground font-display text-primary/50">Login to your account</p>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="space-y-3 text-primary font-display">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="space-y-3 text-primary font-display">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">Login</Button>
                    <div className="relative text-sm text-center text-primary/50 font-display pt-1">
                      <span className="bg-background px-2">Or continue with</span>
                    </div>
                    <Button variant="outline" className="w-full text-primary" onClick={onGoogleLogin}>
                      Login with Google
                    </Button>
                  </form>
                </TabsContent>

                {/* SIGN-UP FORM */}
                <TabsContent value="sign-up">
                  <form onSubmit={onSignup} className="flex flex-col gap-4 mt-5">
                    <div className="text-center text-primary">
                      <h2 className="text-2xl font-bold">Create an account</h2>
                      <p className="text-muted-foreground font-display text-primary/50">Sign up for a new account</p>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="space-y-3 text-primary font-display">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" type="text" placeholder="IconLover" required />
                    </div>
                    <div className="space-y-3 text-primary font-display">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="space-y-3 text-primary font-display">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">Sign Up</Button>
                    <div className="relative text-sm text-center text-primary/50 font-display pt-1">
                      <span className="bg-background px-2">Or sign up with</span>
                    </div>
                    <Button variant="outline" className="w-full text-primary" onClick={onGoogleLogin}>
                      Sign Up with Google
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
            <div className="bg-muted relative hidden md:block">
              <img
                src="/placeholder.svg"
                alt="Signup Illustration"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

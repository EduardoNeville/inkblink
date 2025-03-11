import { handleLogin, handleSignup, handleGoogleLogin } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Handle user login
  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    
    try {
      await handleLogin(target.email.value, target.password.value);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle user signup
  const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const target = e.target as typeof e.target & {
      name: { value: string };
      email: { value: string };
      password: { value: string };
    };

    try {
      await handleSignup(target.name.value, target.email.value, target.password.value);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
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
                      <h2 className="text-2xl font-semibold text-primary">Welcome back</h2>
                      <p className="text-muted-foreground">Login to your account</p>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="space-y-3 text-primary">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" required />
                    </div>

                    <div className="space-y-3 text-primary">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>

                    <Button type="submit" className="w-full">
                      Login
                    </Button>

                    <div className="relative text-sm text-center text-primary">
                      <span className="bg-background px-2">Or continue with</span>
                    </div>

                    <Button variant="outline" className="w-full text-primary" onClick={handleGoogleLogin}>
                      Login with Google
                    </Button>
                  </form>
                </TabsContent>
                
                {/* SIGN-UP FORM */}
                <TabsContent value="sign-up">
                  <form onSubmit={onSignup} className="flex flex-col gap-4 mt-5">
                    <div className="text-center text-primary">
                      <h2 className="text-2xl font-semibold">Create an account</h2>
                      <p className="text-muted-foreground">Sign up for a new account</p>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="space-y-3 text-primary">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" type="text" placeholder="IconLover" required />
                    </div>

                    <div className="space-y-3 text-primary">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" required />
                    </div>

                    <div className="space-y-3 text-primary">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>

                    <Button type="submit" className="w-full">
                      Sign Up
                    </Button>

                    <div className="relative text-sm text-center text-primary">
                      <span className="bg-background px-2">Or sign up with</span>
                    </div>

                    <Button variant="outline" className="w-full text-primary" onClick={handleGoogleLogin}>
                      Sign Up with Google
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>

            {/* IMAGE SECTION */}
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

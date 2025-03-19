
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const returnTo = location.state?.returnTo || "/";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Handle login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Login successful",
          description: "Welcome back!",
        });

        navigate(returnTo);
      } else {
        // Handle signup
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            },
          },
        });

        if (error) throw error;

        toast({
          title: "Signup successful",
          description: "Please check your email to confirm your account.",
        });

        setIsLogin(true);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to pre-fill admin credentials
  const fillAdminCredentials = () => {
    setEmail("asumanssendegeya@gmail.com");
    setPassword("Sasuman883@");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-cafePurple">
        {isLogin ? (
          // Login image - coffee with latte art
          <div className="w-full h-full bg-cover bg-center" style={{ 
            backgroundImage: "url(https://lovable-uploads.s3.amazonaws.com/uploads/66f82d04-38c4-4330-a31b-c37be43db678.png)",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(128, 0, 255, 0.3)'
          }}>
            <div className="flex flex-col justify-center items-center h-full text-white p-12">
              <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
              <p className="text-xl max-w-md text-center">
                Log in to access your account and continue your coffee journey with us.
              </p>
            </div>
          </div>
        ) : (
          // Signup image - food with red juice
          <div className="w-full h-full bg-cover bg-center" style={{ 
            backgroundImage: "url(https://lovable-uploads.s3.amazonaws.com/uploads/761a7bca-5d22-4aa4-96da-0d0245885c74.png)",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(128, 0, 255, 0.3)'
          }}>
            <div className="flex flex-col justify-center items-center h-full text-white p-12">
              <h1 className="text-4xl font-bold mb-4">Join Us Today</h1>
              <p className="text-xl max-w-md text-center">
                Create an account to explore our menu and enjoy a personalized experience.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="font-medium text-cafePurple hover:text-cafePurple-dark"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
            {returnTo === "/checkout" && (
              <p className="mt-2 text-sm text-cafePurple">
                Sign in to continue with your checkout
              </p>
            )}
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            {!isLogin && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="mt-1 relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="pl-10"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1 relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1 relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  className="pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-cafePurple hover:bg-cafePurple-dark"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isLogin ? "Sign in" : "Sign up"
                )}
              </Button>
            </div>
            
            {isLogin && (
              <div className="text-center">
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-cafePurple hover:text-cafePurple-dark text-sm"
                  onClick={fillAdminCredentials}
                >
                  Use Admin Credentials
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;

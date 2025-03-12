import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch user session on mount and listen for auth changes
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Handle scroll behavior for small screens
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleScroll = () => {
      if (mediaQuery.matches) {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 0) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
    setIsExpanded(false); // Close menu on logout
  };

  // Toggle expand state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const ExpansionNav = () => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    if (mediaQuery.matches) {
      return (
        <Button variant="ghost" onClick={toggleExpand}>
        {isExpanded ? <X /> : <Menu />}
        </Button>
      );
    } else {
      return (
        <div className="flex items-center">
          {/* Custom Navigation Menu for Pricing (only on medium and larger screens) */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              to="/pricing" 
              className="text-xs font-bold text-primary hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Button className="text-xs bg-primary text-white hover:bg-accent transition-all 
              duration-300 rounded-full border-primary border-1"
              onClick={() => navigate("/signup")}
            >
              Join for free
            </Button>
          </div>
        </div>
      );
    }
  }

  return (
    <nav
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 bg-primary/30 backdrop-blur-xl rounded-3xl py-2 px-4 mt-5 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-30"
      }`}
    >
      {/* Main bar content */}
      <div className="flex items-center justify-between w-full gap-30 sm:gap-40">
        <Link to="/" className="text-base sm:text-xs font-bold text-primary">
          InkBlink
        </Link>

        <ExpansionNav />
      </div>

      {/* Expanded navigation section */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-64 opacity-100 py-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-start">
          <Link
            to="/pricing"
            className="text-base font-semibold text-primary hover:text-accent hover:underline transition-colors"
            onClick={() => setIsExpanded(false)}
          >
            Pricing
          </Link>
          <Link
            to="/create"
            className="text-base font-semibold text-primary hover:text-accent transition-colors"
            onClick={() => setIsExpanded(false)}
          >
            Create
          </Link>
          {user ? (
            <>
              <div className="flex items-center gap-2 py-1">
                <Avatar className="border h-6 w-6">
                  <AvatarFallback>
                    {user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-primary">{user.email}</span>
              </div>
              <Link
                to="/dashboard"
                className="text-xs text-primary hover:text-accent transition-colors"
                onClick={() => setIsExpanded(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-primary hover:text-accent transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Button
              className="mt-8 text-xs bg-primary text-white hover:bg-accent transition-all duration-300 rounded-full border-primary border-1"
              variant="link"
              onClick={() => {
                navigate("/signup");
                setIsExpanded(false);
              }}
            >
              Join for free
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

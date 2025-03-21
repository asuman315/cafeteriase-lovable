
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOutIcon, LogInIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserMenuProps {
  isScrolled?: boolean;
}

const UserMenu = ({ isScrolled }: UserMenuProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // check if location.pathname is a product detail page
  const isProductDetailPage = location.pathname.includes("/product/");

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "Hope to see you again soon!",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials from name or email
  const getUserInitials = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();
    } else if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={isScrolled ? "text-gray-700" : `${isProductDetailPage ? "text-cafePurple" : "text-white"}`}
        onClick={() => navigate("/auth")}
      >
        <LogInIcon className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center">
      <Avatar className="h-8 w-8 mr-2">
        <AvatarFallback className="bg-cafePurple text-white">
          {getUserInitials()}
        </AvatarFallback>
      </Avatar>
      <Button
        variant="ghost"
        size="sm"
        className={isScrolled ? "text-gray-700" : "text-white"}
        onClick={handleSignOut}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        ) : (
          <>
            <LogOutIcon className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Sign Out</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default UserMenu;

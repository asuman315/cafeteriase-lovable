
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminCreateButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if the current user is the specific admin
  const isSpecificAdmin = user?.email === "asumanssendegeya@gmail.com";
  
  if (!isSpecificAdmin) {
    return null;
  }
  
  return (
    <Button 
      onClick={() => navigate("/admin")}
      className="fixed bottom-6 right-6 z-50 bg-cafePurple hover:bg-cafePurple-dark shadow-lg"
      size="lg"
    >
      <PlusCircle className="mr-2" />
      Create Item
    </Button>
  );
};

export default AdminCreateButton;

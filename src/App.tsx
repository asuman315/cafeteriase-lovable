import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Auth from "@/pages/Auth";
import Checkout from "@/pages/Checkout";
import Favorites from "@/pages/Favorites";
import Admin from "@/pages/Admin";
import Index from "@/pages/Index";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/hooks/use-cart";
import { FavoritesProvider } from "@/hooks/use-favorites";
import { ThemeProvider } from "@/hooks/use-mobile";
import NotFound from "@/pages/NotFound";
import ChatbotButton from "@/components/ChatbotButton";
import { ChatProvider } from "@/contexts/ChatContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <FavoritesProvider>
          <ChatProvider>
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ChatbotButton />
                <Toaster />
              </BrowserRouter>
            </AuthProvider>
          </ChatProvider>
        </FavoritesProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;

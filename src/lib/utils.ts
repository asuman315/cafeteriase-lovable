
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CartItem } from "@/hooks/use-cart"
import { supabase } from "@/integrations/supabase/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD"): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(amount);
}

export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerDetails: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
    notes?: string;
  },
  items: CartItem[],
  totalPrice: number
) {
  try {
    console.log("Sending order confirmation email to:", customerEmail);
    
    // Use the supabase client to invoke the edge function
    const { data, error } = await supabase.functions.invoke("send-order-confirmation", {
      body: {
        email: customerEmail,
        ...customerDetails,
        items,
        totalPrice,
      },
    });

    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(error.message || "Failed to send order confirmation");
    }

    console.log("Order confirmation email sent successfully");
    return data;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
}

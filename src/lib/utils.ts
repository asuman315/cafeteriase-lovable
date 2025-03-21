
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
    console.log("Customer details:", JSON.stringify(customerDetails));
    console.log("Order items:", JSON.stringify(items));
    console.log("Total price:", totalPrice);
    
    if (!customerEmail) {
      console.error("No customer email provided for order confirmation");
      return { success: false, error: "Customer email is required" };
    }
    
    if (!items || items.length === 0) {
      console.error("No items provided for order confirmation");
      return { success: false, error: "Order items are required" };
    }
    
    // Use the supabase client to invoke the edge function
    const { data, error } = await supabase.functions.invoke("send-order-confirmation", {
      body: {
        email: customerEmail,
        customerDetails,
        items,
        totalPrice,
      },
    });

    if (error) {
      console.error("Supabase function error:", error);
      // Don't throw, just return the error info
      return { success: false, error: error.message || "Failed to send order confirmation" };
    }

    console.log("Order confirmation email sent successfully");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error sending order confirmation email:", error);
    // Return error info rather than throwing
    return { success: false, error: error.message || "Unknown error sending confirmation email" };
  }
}

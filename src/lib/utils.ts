
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CartItem } from "@/hooks/use-cart"

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
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase configuration is missing");
    }
    
    const response = await fetch(`${supabaseUrl}/functions/v1/send-order-confirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        email: customerEmail,
        ...customerDetails,
        items,
        totalPrice,
      }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to send order confirmation";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If JSON parsing fails, use the status text
        errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Try to parse JSON, but handle cases where response body might be empty
    let data;
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn("Could not parse response as JSON:", text);
        data = { success: true, message: "Email sent" };
      }
    } else {
      data = { success: true, message: "Email sent" };
    }

    return data;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
}

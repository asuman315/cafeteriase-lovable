
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
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-confirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email: customerEmail,
        ...customerDetails,
        items,
        totalPrice,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send order confirmation");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
}

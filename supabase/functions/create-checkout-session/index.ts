
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.2.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  currency?: string;
}

interface CheckoutSessionRequest {
  items: CartItem[];
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Checkout function invoked with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("Missing STRIPE_SECRET_KEY environment variable");
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    console.log("Initializing Stripe client");
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Parse request body
    console.log("Parsing request body");
    const requestText = await req.text();
    console.log("Request body (raw):", requestText);
    
    // Handle empty body
    if (!requestText) {
      console.error("Empty request body");
      return new Response(
        JSON.stringify({ success: false, error: "Empty request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    let requestData;
    try {
      requestData = JSON.parse(requestText);
      console.log("Request data (parsed):", JSON.stringify(requestData));
    } catch (parseError) {
      console.error("Error parsing JSON request body:", parseError);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate request body
    if (!requestData || typeof requestData !== "object") {
      console.error("Invalid request format");
      throw new Error("Invalid request format");
    }

    const { items, customerEmail, successUrl, cancelUrl } = requestData as CheckoutSessionRequest;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("No items provided or invalid items format:", items);
      throw new Error("No items provided or invalid items format");
    }

    if (!successUrl) {
      console.error("Success URL is required but not provided");
      throw new Error("Success URL is required");
    }

    if (!cancelUrl) {
      console.error("Cancel URL is required but not provided");
      throw new Error("Cancel URL is required");
    }

    // Add logs for debugging
    console.log("Creating checkout session with items:", JSON.stringify(items));
    console.log("Success URL:", successUrl);
    console.log("Cancel URL:", cancelUrl);
    console.log("Customer email:", customerEmail);

    // Format line items for Stripe
    const lineItems = items.map((item) => {
      if (!item.name || typeof item.price !== 'number' || !item.image) {
        console.error("Invalid item:", JSON.stringify(item));
        throw new Error(`Invalid item data: ${item.id}`);
      }

      return {
        price_data: {
          currency: item.currency?.toLowerCase() || "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      };
    });

    console.log("Formatted line items:", JSON.stringify(lineItems));

    // Create Stripe checkout session
    try {
      console.log("Creating Stripe checkout session...");
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: customerEmail,
      });

      console.log("Checkout session created successfully:", session.id);
      console.log("Checkout URL:", session.url);

      return new Response(JSON.stringify({ id: session.id, url: session.url }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (stripeError: any) {
      console.error("Stripe API error:", stripeError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Stripe error: ${stripeError.message}`,
          code: stripeError.code || "unknown",
          type: stripeError.type || "unknown"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in create-checkout-session function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

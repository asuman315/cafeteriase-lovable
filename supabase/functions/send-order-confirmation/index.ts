
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  currency?: string;
}

interface OrderDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  items: OrderItem[];
  totalPrice: number;
  notes?: string;
  district?: string;
  deliveryTime?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const resend = new Resend(resendApiKey);
    const orderDetails: OrderDetails = await req.json();
    
    // Format date for the email
    const orderDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Create HTML content for the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; border-bottom: 2px solid #f5f5f7; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #1D1D1F; font-size: 28px; margin: 0 0 10px;">Order Confirmation</h1>
          <p style="color: #1D1D1F; font-size: 16px; margin: 0;">Thank you for your order!</p>
        </div>

        <div style="margin-bottom: 25px; padding: 15px; background-color: #f5f5f7; border-radius: 5px;">
          <h2 style="color: #1D1D1F; font-size: 18px; margin: 0 0 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Order Details</h2>
          <p><strong>Order Date:</strong> ${orderDate}</p>
          <p><strong>Payment Method:</strong> Pay on Delivery</p>
          ${orderDetails.deliveryTime ? `<p><strong>Preferred Delivery Time:</strong> ${orderDetails.deliveryTime}</p>` : ''}
        </div>

        <div style="margin-bottom: 25px; padding: 15px; background-color: #f5f5f7; border-radius: 5px;">
          <h2 style="color: #1D1D1F; font-size: 18px; margin: 0 0 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Customer Information</h2>
          <p><strong>Name:</strong> ${orderDetails.fullName}</p>
          <p><strong>Phone:</strong> ${orderDetails.phone}</p>
          <p><strong>Email:</strong> ${orderDetails.email}</p>
          ${orderDetails.district ? `<p><strong>District:</strong> ${orderDetails.district}</p>` : ''}
        </div>

        <div style="margin-bottom: 25px; padding: 15px; background-color: #f5f5f7; border-radius: 5px;">
          <h2 style="color: #1D1D1F; font-size: 18px; margin: 0 0 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Shipping Address</h2>
          <p>${orderDetails.fullName}</p>
          <p>${orderDetails.address}</p>
          <p>${orderDetails.city}, ${orderDetails.zipCode}</p>
          <p>Phone: ${orderDetails.phone}</p>
          ${orderDetails.notes ? `<p><strong>Delivery Notes:</strong> ${orderDetails.notes}</p>` : ''}
        </div>

        <div style="margin-bottom: 25px; padding: 15px; background-color: #f5f5f7; border-radius: 5px;">
          <h2 style="color: #1D1D1F; font-size: 18px; margin: 0 0 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Order Summary</h2>
          ${orderDetails.items.map(item => `
            <div style="display: flex; margin-bottom: 15px; padding: 10px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
              <div style="width: 80px; margin-right: 15px;">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: auto; border-radius: 4px;">
              </div>
              <div style="flex: 1;">
                <h3 style="margin: 0 0 5px; font-size: 16px;">${item.name}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: ${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: item.currency || 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(item.price)}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="text-align: right; padding: 15px; background-color: #1D1D1F; border-radius: 5px; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px;">Total: ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(orderDetails.totalPrice)}</h2>
        </div>

        <div style="margin-top: 25px; padding: 15px; background-color: #f5f5f7; border-radius: 5px; text-align: center; font-size: 14px; color: #666;">
          <p>If you have any questions about your order, please contact our support team.</p>
          <p>Thank you for shopping with us!</p>
        </div>
      </div>
    `;

    try {
      // Send the email
      const emailResponse = await resend.emails.send({
        from: "Orders <onboarding@resend.dev>",
        to: [orderDetails.email, "asumanssendegeya@gmail.com"], // Send to customer and shop owner
        subject: "Your Order Confirmation",
        html: htmlContent,
      });

      console.log("Email sent successfully:", emailResponse);

      return new Response(JSON.stringify({ success: true, data: emailResponse }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (emailError: any) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({ success: false, error: emailError.message || "Failed to send email" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
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

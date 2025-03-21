
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { sendOrderConfirmationEmail } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

// Create a schema for form validation
const formSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  zipCode: z.string().min(4, { message: "Zip code must be at least 4 characters." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  notes: z.string().optional(),
});

// Define the form values type from the schema
type FormValues = z.infer<typeof formSchema>;

// Define the component props correctly to avoid the type error
interface ShippingFormProps {
  onSubmit: (values: FormValues) => void;
}

const ShippingForm = ({ onSubmit }: ShippingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cartItems, totalPrice } = useCart();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      zipCode: "",
      phone: "",
      notes: "",
    },
  });

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Processing order submission:", values);
      
      // Send order confirmation email
      const emailResult = await sendOrderConfirmationEmail(
        values.email,
        {
          fullName: values.fullName,
          address: values.address,
          city: values.city,
          zipCode: values.zipCode,
          phone: values.phone,
          notes: values.notes,
        },
        cartItems,
        totalPrice
      );
      
      if (emailResult.success) {
        toast.success("Order confirmation email sent!", {
          description: "Check your email for details.",
          duration: 3000,
        });
      } else {
        console.warn("Email sending issue:", emailResult.error);
        toast.warning("Order placed, but confirmation email may be delayed", {
          description: "We'll try to send your receipt later.",
          duration: 3000,
        });
      }
      
      // Complete the checkout process regardless of email status
      console.log("Completing checkout process");
      onSubmit(values);
    } catch (error: any) {
      console.error("Failed to complete order:", error);
      
      toast.error("There was a problem processing your order", {
        description: error.message || "Please try again or contact support.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Delivery Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, Apt 4B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Special instructions for delivery" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Order"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ShippingForm;

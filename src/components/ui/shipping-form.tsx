
import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"

const shippingFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  zipCode: z.string().min(3, { message: "Zip code must be at least 3 characters" }),
  phone: z.string().min(5, { message: "Phone number must be at least 5 characters" }),
  notes: z.string().optional(),
})

type ShippingFormValues = z.infer<typeof shippingFormSchema>

interface ShippingFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onSubmit: (values: ShippingFormValues) => void
  isSubmitting?: boolean
}

const ShippingForm = React.forwardRef<HTMLDivElement, ShippingFormProps>(
  ({ onSubmit, isSubmitting = false, className, ...props }, ref) => {
    const form = useForm<ShippingFormValues>({
      resolver: zodResolver(shippingFormSchema),
      defaultValues: {
        fullName: "",
        address: "",
        city: "",
        zipCode: "",
        phone: "",
        notes: "",
      },
    })

    return (
      <div ref={ref} className={cn("w-full animate-fade-in", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, Apt 4B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Special instructions for delivery (e.g., doorbell not working, call upon arrival)"
                      {...field}
                      className="resize-none h-24"
                    />
                  </FormControl>
                  <FormDescription>
                    Any special instructions for the delivery person
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-cafePurple hover:bg-cafePurple-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></span>
                  Processing...
                </>
              ) : (
                "Complete Order"
              )}
            </Button>
          </form>
        </Form>
      </div>
    )
  }
)
ShippingForm.displayName = "ShippingForm"

export { ShippingForm }

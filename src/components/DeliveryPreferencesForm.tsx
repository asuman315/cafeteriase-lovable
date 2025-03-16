
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Create a schema for form validation
const formSchema = z.object({
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  district: z.string().min(2, { message: "District is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  deliveryTime: z.enum(["Morning", "Afternoon", "Evening", "Any"]),
});

// Define the form values type from the schema
type FormValues = z.infer<typeof formSchema>;

// Define the component props
interface DeliveryPreferencesFormProps {
  onSubmit: (values: FormValues) => void;
}

const districtOptions = [
  "Kampala Central",
  "Kawempe",
  "Makindye",
  "Nakawa",
  "Rubaga",
  "Wakiso",
  "Mukono",
  "Entebbe",
  "Other"
];

const DeliveryPreferencesForm = ({ onSubmit }: DeliveryPreferencesFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      district: "",
      email: "",
      city: "",
      deliveryTime: "Any",
    },
  });

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      onSubmit(values);
    } catch (error) {
      console.error("Error submitting preferences:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Delivery Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 0777123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a district" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districtOptions.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City or Town (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ntinda, Kololo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryTime"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Preferred Delivery Time</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Morning" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Morning (8:00 AM - 12:00 PM)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Afternoon" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Afternoon (12:00 PM - 4:00 PM)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Evening" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Evening (4:00 PM - 8:00 PM)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Any" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Any Time
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
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
              {isSubmitting ? "Processing..." : "Continue to Delivery Address"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DeliveryPreferencesForm;

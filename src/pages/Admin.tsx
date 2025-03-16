
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Coffee, Utensils, Cake, Star, ImagePlus, ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Product form schema
const productSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce
    .number()
    .min(0.01, { message: "Price must be greater than 0." }),
  category: z.enum(["Breakfast", "Coffee", "Lunch", "Desserts"], {
    required_error: "Please select a category.",
  }),
  image: z.string().url({ message: "Please enter a valid image URL." }),
  featured: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Default form values
  const defaultValues: Partial<ProductFormValues> = {
    name: "",
    description: "",
    price: 0,
    category: "Coffee",
    image: "",
    featured: false,
  };

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  // Watch the image field to update preview
  const imageUrl = form.watch("image");
  if (imageUrl && imageUrl !== imagePreview) {
    setImagePreview(imageUrl);
  }

  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    
    try {
      // In a real app, you would send this to your API/backend
      console.log("Product data:", data);
      
      // For demo purposes, we'll just show a success toast
      toast({
        title: "Product created",
        description: `${data.name} has been added to the ${data.category} category.`,
      });
      
      // Reset form
      form.reset(defaultValues);
      setImagePreview("");
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "There was an error creating the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get category icon based on selection
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Breakfast":
        return <Utensils className="h-4 w-4" />;
      case "Coffee":
        return <Coffee className="h-4 w-4" />;
      case "Lunch":
        return <Utensils className="h-4 w-4" />;
      case "Desserts":
        return <Cake className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Create or update menu items</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/")} size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Site
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Add New Product</h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter product description" 
                          {...field} 
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            step="0.01" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Breakfast">
                              <div className="flex items-center">
                                <Utensils className="mr-2 h-4 w-4" />
                                <span>Breakfast</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Coffee">
                              <div className="flex items-center">
                                <Coffee className="mr-2 h-4 w-4" />
                                <span>Coffee</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Lunch">
                              <div className="flex items-center">
                                <Utensils className="mr-2 h-4 w-4" />
                                <span>Lunch</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Desserts">
                              <div className="flex items-center">
                                <Cake className="mr-2 h-4 w-4" />
                                <span>Desserts</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter a URL for the product image (or use our image upload in the future)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center">
                          <Star className="mr-2 h-4 w-4 text-yellow-400" />
                          Featured Product
                        </FormLabel>
                        <FormDescription>
                          Featured products will be highlighted in their category section
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-cafePurple hover:bg-cafePurple-dark"
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Creating..." : "Create Product"}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Preview</h2>
            
            {imagePreview ? (
              <div className="mb-4 overflow-hidden rounded-lg">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="h-64 w-full object-cover"
                  onError={() => setImagePreview("/placeholder.svg")}
                />
              </div>
            ) : (
              <div className="mb-4 flex h-64 items-center justify-center rounded-lg bg-muted">
                <ImagePlus className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">
                    {form.watch("name") || "Product Name"}
                  </h3>
                  {form.watch("featured") && (
                    <Star className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(form.watch("category") || "Coffee")}
                  <span className="text-sm text-muted-foreground">
                    {form.watch("category") || "Category"}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground">
                {form.watch("description") || "Product description will appear here..."}
              </p>

              <p className="font-semibold text-cafePurple">
                ${(form.watch("price") || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Help & Tips</h2>
            <ul className="ml-5 list-disc space-y-2 text-muted-foreground">
              <li>Use high-quality, square images (1:1 ratio) for best results</li>
              <li>Keep product names concise and descriptive</li>
              <li>Write detailed descriptions to help customers understand your products</li>
              <li>Mark your best/signature items as featured to highlight them</li>
              <li>Set competitive prices that reflect the quality of your products</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

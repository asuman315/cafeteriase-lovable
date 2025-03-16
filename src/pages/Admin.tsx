
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Coffee, Utensils, Cake, Star, ArrowLeft, Save, X, Plus, Image, Trash2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

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
  currency: z.enum(["USD", "UGX", "EUR", "GBP", "CAD", "AUD"], {
    required_error: "Please select a currency.",
  }),
  images: z.array(z.instanceof(File).or(z.string()))
    .min(1, { message: "At least one image is required" })
    .max(3, { message: "Maximum of 3 images allowed" }),
  featured: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviewIndex, setImagePreviewIndex] = useState(0);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [editorContent, setEditorContent] = useState('');

  // Default form values
  const defaultValues: Partial<ProductFormValues> = {
    name: "",
    description: "",
    price: undefined,
    category: "Coffee",
    currency: "USD",
    images: [],
    featured: false,
  };

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  // Upload image to Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log('Uploading image to Supabase Storage:', filePath);
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }
      
      // Generate a public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
        
      console.log('Image uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return null;
    }
  };

  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    
    try {
      // Upload all images to Supabase Storage and get their URLs
      const imageFiles = data.images.filter(img => img instanceof File) as File[];
      const imageUrls: string[] = [];
      
      console.log('Files to upload:', imageFiles.length);
      
      // Upload all images in parallel
      const imagePromises = imageFiles.map(file => uploadImage(file));
      const uploadedImages = await Promise.all(imagePromises);
      
      // Filter out any failed uploads
      uploadedImages.forEach(url => {
        if (url) imageUrls.push(url);
      });
      
      // If we couldn't upload any images, show an error
      if (imageUrls.length === 0 && imageFiles.length > 0) {
        throw new Error("Failed to upload images. Please try again.");
      }

      console.log('Images uploaded successfully:', imageUrls);

      // Create the product in the database
      const { data: product, error } = await supabase
        .from('cafe_products')
        .insert({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          currency: data.currency,
          images: imageUrls,
          featured: data.featured
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting product:', error);
        throw error;
      }
      
      // Show a success message
      toast({
        title: "Product created",
        description: `${data.name} has been added to the ${data.category} category.`,
        variant: "default",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      
      // Reset form and previews
      form.reset(defaultValues);
      setImagePreviews([]);
      setImagePreviewIndex(0);
      setEditorContent('');
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "There was an error creating the product. Please try again.",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Quill editor modules and formats
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };
  
  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link'
  ];

  // Handle editor content change
  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    form.setValue("description", content, { shouldValidate: true });
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

  // Get currency symbol based on selection
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$";
      case "UGX":
        return "USh";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "CAD":
        return "C$";
      case "AUD":
        return "A$";
      default:
        return "$";
    }
  };

  // Strip HTML tags from rich text
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // Handle file input change
  const handleFileChange = (index: number, files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      
      // Update form state with the file
      const currentImages = [...form.getValues("images")];
      currentImages[index] = file;
      form.setValue("images", currentImages);
      
      // Create and update preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPreviews = [...imagePreviews];
        newPreviews[index] = e.target?.result as string;
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add image upload slot
  const addImageUpload = () => {
    const currentImages = form.getValues("images") || [];
    if (currentImages.length < 3) {
      form.setValue("images", [...currentImages, ""]);
      setImagePreviews([...imagePreviews, ""]);
    }
  };

  // Remove image upload slot
  const removeImageUpload = (index: number) => {
    const currentImages = form.getValues("images") || [];
    if (currentImages.length > 1) {
      const newImages = currentImages.filter((_, i) => i !== index);
      form.setValue("images", newImages);
      
      const newPreviews = imagePreviews.filter((_, i) => i !== index);
      setImagePreviews(newPreviews);
      
      if (imagePreviewIndex >= newPreviews.length) {
        setImagePreviewIndex(newPreviews.length - 1);
      }
    }
  };

  // Get the current images count
  const watchImages = form.watch("images") || [];
  
  // Get the current currency
  const watchCurrency = form.watch("currency") || "USD";

  // Handle price change to prevent form submission and handle empty value
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    // Handle empty input or just the initial 0
    const inputValue = e.target.value;
    if (inputValue === '' || inputValue === '0') {
      form.setValue("price", undefined);
      return;
    }
    
    // Otherwise set the parsed value
    form.setValue("price", parseFloat(inputValue) || 0);
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
                        <div className="min-h-[150px]">
                          <ReactQuill
                            theme="snow"
                            modules={quillModules}
                            formats={quillFormats}
                            value={editorContent}
                            onChange={handleEditorChange}
                            placeholder="Enter product description"
                            className="h-[120px] mb-12"
                          />
                        </div>
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
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            step="0.01"
                            onChange={handlePriceChange}
                            value={field.value === undefined ? '' : field.value}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                            <SelectItem value="UGX">Ugandan Shilling (USh)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="GBP">British Pound (£)</SelectItem>
                            <SelectItem value="CAD">Canadian Dollar (C$)</SelectItem>
                            <SelectItem value="AUD">Australian Dollar (A$)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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

                <div>
                  <FormLabel>Product Images (Max 3)</FormLabel>
                  <FormDescription className="mb-2">
                    Upload images of your product (JPG, PNG)
                  </FormDescription>
                  
                  {watchImages.map((_, index) => (
                    <div key={index} className="mb-4 border rounded-md p-4">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            id={`image-${index}`}
                            className="hidden"
                            onChange={(e) => handleFileChange(index, e.target.files)}
                            ref={(el) => (fileInputRefs.current[index] = el)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRefs.current[index]?.click()}
                            className="w-full"
                          >
                            <Image className="mr-2 h-4 w-4" />
                            {imagePreviews[index] ? 'Change Image' : 'Select Image'}
                          </Button>
                        </div>
                        {watchImages.length > 1 && (
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon"
                            onClick={() => removeImageUpload(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {imagePreviews[index] && (
                        <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                          <img 
                            src={imagePreviews[index]} 
                            alt={`Preview ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {watchImages.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={addImageUpload}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Image
                    </Button>
                  )}
                </div>

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
                  {isLoading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Product
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Preview</h2>
            
            {imagePreviews.length > 0 && imagePreviews[imagePreviewIndex] ? (
              <div>
                <div className="mb-4 overflow-hidden rounded-lg">
                  <img
                    src={imagePreviews[imagePreviewIndex]}
                    alt="Product preview"
                    className="h-64 w-full object-cover"
                  />
                </div>
                
                {imagePreviews.length > 1 && (
                  <div className="mb-4 flex gap-2 justify-center">
                    {imagePreviews.map((img, idx) => (
                      img && (
                        <button
                          key={idx}
                          onClick={() => setImagePreviewIndex(idx)}
                          className={`h-2 w-2 rounded-full ${
                            imagePreviewIndex === idx 
                              ? "bg-cafePurple" 
                              : "bg-gray-300"
                          }`}
                          aria-label={`View image ${idx + 1}`}
                        />
                      )
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-4 flex h-64 items-center justify-center rounded-lg bg-muted">
                <Image className="h-12 w-12 text-muted-foreground/50" />
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
                {form.watch("description") ? stripHtml(form.watch("description")) : "Product description will appear here..."}
              </p>

              <p className="font-semibold text-cafePurple">
                {getCurrencySymbol(watchCurrency)}{" "}
                {form.watch("price") !== undefined
                  ? Number(form.watch("price")).toFixed(watchCurrency === "UGX" ? 0 : 2)
                  : '0.00'}
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
              <li>Upload multiple images to showcase different angles/aspects of your product</li>
              <li>Choose the appropriate currency based on your target market</li>
              <li>Use rich text formatting to make your descriptions more engaging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

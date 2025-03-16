
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
        duration: 5000,
      });
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5 text-cafePurple" />,
      title: "Email Us",
      details: "info@cafeteriase.com",
    },
    {
      icon: <Phone className="h-5 w-5 text-cafePurple" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
    },
    {
      icon: <MapPin className="h-5 w-5 text-cafePurple" />,
      title: "Visit Us",
      details: "123 Coffee Street, Cafe City, CC 12345",
    },
  ];

  return (
    <section id="contact" className="py-24 bg-cafeGray-light">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out to us using
            the form below or through our contact information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="glass-morphism p-8 rounded-xl shadow-lg animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message"
                  className="w-full min-h-[150px]"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-cafePurple hover:bg-cafePurple-dark"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
              <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-cafeGray-light p-3 rounded-full">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{info.title}</h4>
                      <p className="text-gray-600">{info.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
              <h3 className="text-xl font-semibold mb-6">Business Hours</h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span>7:00 AM - 8:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span>8:00 AM - 9:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span>8:00 AM - 7:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

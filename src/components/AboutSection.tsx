
import { Coffee, Clock, MapPin, Award } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: <Coffee className="h-6 w-6 text-cafePurple" />,
      title: "Premium Coffee",
      description: "We source the finest beans from around the world and roast them in-house for the perfect cup."
    },
    {
      icon: <Award className="h-6 w-6 text-cafePurple" />,
      title: "Award Winning",
      description: "Our cafe has been recognized for excellence in both coffee quality and food innovation."
    },
    {
      icon: <Clock className="h-6 w-6 text-cafePurple" />,
      title: "Fast Delivery",
      description: "Order online and enjoy our prompt delivery service, bringing your favorites right to your door."
    },
    {
      icon: <MapPin className="h-6 w-6 text-cafePurple" />,
      title: "Prime Location",
      description: "Located in the heart of the city, our cafe offers a convenient and welcoming space."
    }
  ];

  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Cafeteriase</h2>
            <p className="text-gray-600 mb-6">
              Founded in 2020, Cafeteriase was born from a passion for exceptional coffee and food. 
              We believe that quality ingredients, expert preparation, and a welcoming atmosphere 
              create the perfect dining experience.
            </p>
            <p className="text-gray-600 mb-8">
              Our team of skilled baristas and chefs work together to craft each item on our menu 
              with care and attention to detail. From our signature espresso drinks to our 
              locally-sourced breakfast and lunch options, every bite and sip at Cafeteriase 
              is designed to delight.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex space-x-4 items-start">
                  <div className="glass-morphism p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative h-[400px] md:h-[600px] rounded-xl overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-cafePurple/10 z-10 rounded-xl"></div>
            <img 
              src="/cafe-interior.jpg" 
              alt="Cafeteriase Interior" 
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cafePurple-dark/80 to-transparent p-8 z-20">
              <div className="glass-morphism p-6 rounded-xl max-w-md mx-auto">
                <h3 className="text-white text-xl font-semibold mb-2">Our Promise</h3>
                <p className="text-white/90 text-sm">
                  We are committed to sustainability, quality, and creating memorable experiences 
                  for every customer who walks through our doors or orders online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

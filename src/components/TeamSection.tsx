
import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Head Barista",
    image: "/lovable-uploads/3d98dbd5-f125-4671-9bc2-ad8e0d6c0577.png",
    bio: "Sarah has over 10 years of experience in specialty coffee and has won multiple barista championships.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "sarah@example.com"
    }
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Head Chef",
    image: "/lovable-uploads/350513f1-aee9-4e77-8698-635273261602.png",
    bio: "Michael brings his culinary expertise from working in Michelin-starred restaurants across Europe.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "michael@example.com"
    }
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Product Manager",
    image: "/lovable-uploads/c1cd1677-91bf-469f-b25f-99aa098db4a1.png",
    bio: "Emily ensures that our product lineup is always fresh, innovative, and meets our high quality standards.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "emily@example.com"
    }
  }
];

const TeamSection = () => {
  return (
    <section className="py-24 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Meet Our Team
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The passionate people behind our products, dedicated to providing you with the best experience.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className="glass-morphism rounded-xl overflow-hidden hover-scale"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-cafePurple mb-4">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-6">{member.bio}</p>
                <div className="flex space-x-4">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-gray-500 hover:text-cafePurple transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="text-gray-500 hover:text-cafePurple transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {member.social.email && (
                    <a href={`mailto:${member.social.email}`} className="text-gray-500 hover:text-cafePurple transition-colors">
                      <Mail className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;

import { motion } from "framer-motion";
import { Quote, Star, MessageSquare } from "lucide-react";
import { useState } from "react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Game Developer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "VXLverse has completely transformed how I create games. The grid and snapping tools are incredibly intuitive, and I can build complex worlds in a fraction of the time it used to take me.",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "3D Artist",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "As someone who's primarily visual, I love how VXLverse lets me create without coding. The voxel-based editor is powerful yet easy to use, and the results look amazing.",
    rating: 5
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Indie Game Studio Owner",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    content: "We've published three games using VXLverse, and our players love them. The platform's performance is excellent, and the ability to instantly share games with a link has helped us grow our audience.",
    rating: 5
  },
  {
    id: 4,
    name: "Emma Wilson",
    role: "Teacher",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    content: "I use VXLverse in my classroom to teach game design concepts. My students pick it up quickly and are always excited to show off their creations. The no-code approach makes it accessible to everyone.",
    rating: 4
  },
  {
    id: 5,
    name: "David Park",
    role: "Hobbyist Creator",
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
    content: "I've tried many game creation tools, but VXLverse strikes the perfect balance between power and simplicity. The grid system makes precise placement a breeze.",
    rating: 5
  }
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-64 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-64 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-block p-2 bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-4">
            <MessageSquare className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Creator Stories
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Hear from the community building amazing games with VXLverse
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Large quote mark */}
            <div className="absolute -top-10 -left-10 opacity-10">
              <Quote className="w-20 h-20 text-blue-500" />
            </div>
            
            {/* Testimonial slider */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 backdrop-blur-sm p-8 md:p-10">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row gap-8 items-center"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-md opacity-50 rounded-full" />
                    <img 
                      src={TESTIMONIALS[activeIndex].avatar} 
                      alt={TESTIMONIALS[activeIndex].name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/10 relative"
                    />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < TESTIMONIALS[activeIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>
                  
                  <p className="text-lg text-gray-300 italic mb-6">
                    "{TESTIMONIALS[activeIndex].content}"
                  </p>
                  
                  <div>
                    <div className="font-bold text-white">
                      {TESTIMONIALS[activeIndex].name}
                    </div>
                    <div className="text-blue-400 text-sm">
                      {TESTIMONIALS[activeIndex].role}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <button 
                  onClick={prevTestimonial}
                  className="p-2 bg-gray-800/80 hover:bg-blue-500/20 border border-gray-700 hover:border-blue-500/30 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === activeIndex 
                          ? 'bg-blue-500' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={nextTestimonial}
                  className="p-2 bg-gray-800/80 hover:bg-blue-500/20 border border-gray-700 hover:border-blue-500/30 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

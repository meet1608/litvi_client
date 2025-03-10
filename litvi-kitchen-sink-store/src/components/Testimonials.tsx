import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, ArrowRight, Quote } from "lucide-react";


const productFeatures = [
  {
    id: 1,
    title: "Craftsmanship",
    description: "Our sinks are crafted with precision and care, ensuring a perfect blend of form and function.",
    icon: <CheckCircle className="h-6 w-6 text-litvi-purple" />,
  },
  {
    id: 2,
    title: "Durability",
    description: "Built to last, our sinks withstand the rigors of daily use while maintaining their beauty.",
    icon: <CheckCircle className="h-6 w-6 text-litvi-purple" />,
  },
  {
    id: 3,
    title: "Sustainability",
    description: "We use eco-friendly materials and sustainable practices to minimize our environmental footprint.",
    icon: <CheckCircle className="h-6 w-6 text-litvi-purple" />,
  },
  {
    id: 4,
    title: "Design Excellence",
    description: "Our sinks are designed to elevate your kitchen's aesthetic, combining style with functionality.",
    icon: <CheckCircle className="h-6 w-6 text-litvi-purple" />,
  },
  {
    id: 5,
    title: "Quality Assurance",
    description: "Each sink undergoes rigorous quality control to ensure it meets our high standards.",
    icon: <CheckCircle className="h-6 w-6 text-litvi-purple" />,
  },
];

const FeatureCard = ({ feature }: { feature: any }) => {
  return (
    <motion.div
      className="relative neo-blur p-8 rounded-xl shadow-md border border-white/10 h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex items-center mb-4 relative z-10">
        {feature.icon}
        <h4 className="font-semibold text-white ml-4">{feature.title}</h4>
      </div>
      <p className="text-white/80 text-lg flex-grow relative z-10">{feature.description}</p>
    </motion.div>
  );
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleFeatures, setVisibleFeatures] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateVisibleItems = () => {
      let itemsToShow = 3; // Default for desktop
      
      if (window.innerWidth < 768) {
        itemsToShow = 1; // Mobile
      } else if (window.innerWidth < 1024) {
        itemsToShow = 2; // Tablet
      }
      
      const visibleItems = [];
      for (let i = 0; i < itemsToShow; i++) {
        const index = (currentIndex + i) % productFeatures.length;
        visibleItems.push(productFeatures[index]);
      }
      setVisibleFeatures(visibleItems);
    };
    
    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, [currentIndex]);
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % productFeatures.length);
  };
  
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + productFeatures.length) % productFeatures.length);
  };
  
  return (
    <section className="py-24 bg-litvi-dark relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-litvi-purple/10 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-litvi-purple/10 rounded-full transform -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full glass-effect">
            <span className="text-sm font-medium text-litvi-purple">Why Choose Us</span>
          </span>
          <h2 className="section-title text-gradient-modern">Experience the Litvi Difference</h2>
          <p className="section-subtitle">
            Discover the qualities that set our products apart and make them the perfect choice for your kitchen.
          </p>
        </motion.div>
        
        <div className="relative">
          <div 
            ref={containerRef} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-hidden"
          >
            {visibleFeatures.map((feature, idx) => (
              <FeatureCard key={`${feature.id}-${idx}`} feature={feature} />
            ))}
          </div>
          
          <div className="flex justify-center mt-16 space-x-6">
            <motion.button
              onClick={handlePrev}
              className="w-14 h-14 rounded-full glass-effect flex items-center justify-center text-white hover:bg-litvi-purple/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              onClick={handleNext}
              className="w-14 h-14 rounded-full glass-effect flex items-center justify-center text-white hover:bg-litvi-purple/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import im0 from '../accets/im0.jpeg';
const Hero = () => {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3,
      } 
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };

  // Image animation variants
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.4 } 
    }
  };

  // Badge animation
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, delay: 0.3 }
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      {/* Full-screen background with parallax effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074&auto=format&fit=crop" 
          alt="Luxury kitchen" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-litvi-dark/85 to-litvi-darkCharcoal/80" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left space-y-6"
          >
            <motion.div
              variants={badgeVariants}
              className="inline-block mb-2 px-4 py-1 rounded-full neo-blur"
            >
              <span className="text-sm font-medium text-litvi-purple">Premium Quartz Sinks</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 text-white leading-tight tracking-tight"
            >
              Redefining{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-litvi-steel via-litvi-chrome to-litvi-oceanBlue">
                Kitchen Elegance
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl mb-6 text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              LITVI is one of the finest manufacturers of Quartz Kitchen sinks in India, offering innovative designs and unmatched durability. Transform your kitchen with our exquisite collection of Metallic and Granite series sinks.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button 
                className="bg-gradient-to-r from-litvi-purple to-litvi-magenta text-white hover:opacity-90 transition-all duration-300 px-8 py-6 shadow-lg hover:shadow-xl"
                asChild
              >
                <a href="#products" className="flex items-center gap-2">
                  <span>Explore Collection</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
              
              <Button 
                className="bg-transparent border border-white/20 text-white hover:bg-white/10 transition-all duration-300 px-8 py-6"
                asChild
              >
                <a href="#about" className="flex items-center gap-2">
                  <span>Our Story</span>
                </a>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:block"
          >
            <div className="relative z-10">
              <motion.div 
                className="relative z-10 p-6 rounded-2xl neo-blur overflow-hidden"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <img 
                  src= {im0}
                  alt="Elegant kitchen sink" 
                  className="w-full h-auto object-cover rounded-xl shadow-inner"
                />
                
                <motion.div 
                  className="absolute -bottom-10 -right-10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="bg-gradient-to-r from-litvi-steel to-litvi-chrome text-white px-6 py-3 rounded-lg shadow-lg font-medium">
                    <span className="text-sm uppercase tracking-wider">High Durability</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute -top-10 -left-10"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <div className="bg-gradient-to-r from-litvi-purple to-litvi-magenta text-white px-6 py-3 rounded-lg shadow-lg font-medium">
                    <span className="text-sm uppercase tracking-wider">Shine Lock Technology</span>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-litvi-steel/20 to-litvi-chrome/10 rounded-full blur-2xl"></div>
              <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-litvi-purple/20 to-litvi-magenta/10 rounded-full blur-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-10 left-0 right-0 z-10 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="flex justify-center">
          <motion.div
            animate={{ 
              y: [0, 10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          >
            <a href="#products" className="text-white flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-sm font-medium">Discover More</span>
              <ArrowRight className="h-5 w-5 rotate-90" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

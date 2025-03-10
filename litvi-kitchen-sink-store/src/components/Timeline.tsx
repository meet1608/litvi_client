import { motion } from "framer-motion";

const timelineData = [
  {
    year: "2022",
    title: "Factory Inception",
    description: "Litvi Quartz Sink factory was established, setting the foundation for premium kitchen sink solutions."
  },
  {
    year: "2023",
    title: "Production Begins",
    description: "Full-scale manufacturing started with a focus on quality, durability, and modern aesthetics."
  },
  {
    year: "2024",
    title: "Market Expansion",
    description: "Expanded our distribution network, reaching more homes and businesses with our innovative sink designs."
  },
  {
    year: "2025",
    title: "Smart Sink Technology",
    description: "Introducing AI-powered sink solutions for enhanced convenience and modern kitchen experiences."
  }
];

const TimelineItem = ({ item, index }: { item: any, index: number }) => {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      className={`relative pl-10 md:pl-0 ${isEven ? 'md:pr-16 ml-auto' : 'md:pl-16'} pb-12 md:w-1/2`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="timeline-dot"></div>
      <div 
        className={`p-8 neo-blur rounded-xl shadow-md border border-white/10 hover:shadow-lg transition-all duration-300 ${
          isEven ? 'md:text-right' : ''
        }`}
      >
        <span className="inline-block px-4 py-2 mb-4 text-sm font-bold bg-litvi-purple/20 text-litvi-purple rounded-full">
          {item.year}
        </span>
        <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
        <p className="text-white/70 text-lg">{item.description}</p>
      </div>
    </motion.div>
  );
};

const Timeline = () => {
  return (
    <section id="timeline" className="py-24 bg-litvi-darkCharcoal relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-litvi-purple/5 rounded-full"
          animate={{
            y: [0, 20, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-litvi-purple/5 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full glass-effect">
            <span className="text-sm font-medium text-litvi-purple">Our Journey</span>
          </span>
          <h2 className="section-title text-gradient-modern pb-5">Building a Legacy</h2>
          <p className="section-subtitle ">
            From our founding year, explore the milestones that have driven our commitment to excellence in kitchen design.
          </p>
        </motion.div>
        
        <div className="relative timeline-item">
          <div className="ml-8 md:ml-0 flex flex-col md:flex-row md:flex-wrap">
            {timelineData.map((item, index) => (
              <TimelineItem key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;

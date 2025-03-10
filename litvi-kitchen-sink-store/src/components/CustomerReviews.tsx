import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import im1 from "../accets/im1.jpg";
import im2 from "../accets/im2.jpg";
import im3 from "../accets/im3.jpg";
import im4 from "../accets/im4.jpg";
import im5 from "../accets/im5.jpg";
import im6 from "../accets/im6.jpg";

const images = [
  {
    id: 1,
    src: im1,
    alt: "Litvi Kitchen Sink 1",
    description: "Sleek and modern sink design enhancing any kitchen space."
  },
  {
    id: 2,
    src: im2,
    alt: "Litvi Kitchen Sink 2",
    description: "Durable and stain-resistant, perfect for busy kitchens."
  },
  {
    id: 3,
    src: im3,
    alt: "Litvi Kitchen Sink 3",
    description: "Elegant farmhouse sink, a timeless addition to your home."
  },
  {
    id: 4,
    src: im4,
    alt: "Litvi Kitchen Sink 4",
    description: "Modern kitchen designed with perfection and quality."
  },
  {
    id: 5,
    src: im5,
    alt: "Litvi Kitchen Sink 5",
    description: "It is easy to clean and highly durable."
  },
  {
    id: 6,
    src: im6,
    alt: "Litvi Kitchen Sink 6",
    description: "Elegant farmhouse sink, a timeless addition to your home."
  }
];

const CustomerReviews = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [description, setDescription] = useState(images[0].description);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setDescription(images[(currentImageIndex + 1) % images.length].description);
    }, 3500); // Change image every 3.5 seconds

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, [currentImageIndex]);

  const handleSidebarClick = (index: number) => {
    setCurrentImageIndex(index);
    setDescription(images[index].description);
  };

  return (
    <section id="reviews" className="py-24 bg-litvi-dark relative overflow-hidden text-white">
      {/* Background elements (adjust as needed) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-litvi-purple/5 rounded-full"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full glass-effect">
            <span className="text-sm font-medium text-litvi-purple">Product Showcase</span>
          </span>
          <h2 className="section-title text-gradient-modern pb-5">Explore Our Kitchen Sink Collection</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Image Slideshow */}
          <div className="md:col-span-3">
            <motion.img
              key={currentImageIndex} // Force re-render on image change
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className="w-full h-auto rounded-lg shadow-xl neo-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
            <p className="italic text-center mt-4">
              {description}
            </p>
          </div>

          {/* Sidebar Navigation */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  className={`p-3 rounded-lg shadow-md cursor-pointer neo-blur hover:scale-105 transition-transform ${
                    index === currentImageIndex ? "border-2 border-litvi-purple" : "border border-gray-700"
                  }`}
                  onClick={() => handleSidebarClick(index)}
                  whileHover={{ backgroundColor: "rgba(102, 51, 153, 0.2)" }} // Purple hue on hover
                >
                  <h4 className="font-semibold">{image.alt}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
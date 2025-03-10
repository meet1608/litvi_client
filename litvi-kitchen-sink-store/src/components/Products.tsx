import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';





const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="sink-card cursor-pointer bg-litvi-darkCharcoal rounded-xl overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white">{product.name}</h3>
        <p className="text-litvi-purple font-semibold">${product.price}</p>
      </div>
    </motion.div>
  );
};

  

 



const Products = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);  
  const [selectedTab, setSelectedTab] = useState("metallic");
const navigate = useNavigate();

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/admin/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []);
  return (
    <section id="products" className="py-24 bg-litvi-dark">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full glass-effect">
            <span className="text-sm font-medium text-litvi-purple">Our Collection</span>
          </span>
          <h2 className="section-title text-gradient-modern">Premium Quartz Kitchen Sinks</h2>
          <p className="section-subtitle">
            Explore our exquisite collection of quartz kitchen sinks, designed to blend elegance with unmatched durability.
          </p>
        </motion.div>

        {loading ? (
              <p className="text-center text-white">Loading products...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.slice(0, 6).map((product, index) => (
  <ProductCard key={product._id} product={product} index={index} />
))}

              </div>
            )}

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Button onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-litvi-purple to-litvi-magenta hover:opacity-90 text-white px-8 py-6 shadow-lg"
          >
            View Full Catalog
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
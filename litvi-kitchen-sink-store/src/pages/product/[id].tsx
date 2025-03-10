import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Heart, Share, ZoomIn } from 'lucide-react';
import { useParams } from "react-router-dom";
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/cartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Product = {
  _id: string; // Assuming your API uses _id
  id: number;
  name: string;
  material: string;
  color: string;
  sinkType: string;
  shape: string;
  sizeDimension: string;
  usageApplication: string;
  finishType: string;
  positionOfDrainer: string;
  price: number;
  productDescription: string;
  category: string;
  images: string;
  description: string;
  dimensions: string;
  weight: string;
};


const productFeatures = [
  "Premium quality quartz material",
  "Scratch and stain-resistant surface",
  "Heat resistant up to 535°F",
  "Easy to clean and maintain",
  "Environmentally friendly materials",
  "10-year limited warranty"
];

const ProductDetail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { addToCart, removeFromCart, updateQuantity, cartItems } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5002/api/admin/products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        // setRelatedProducts(getRelatedProducts(data.id)); // If your API provides related products, use that instead
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Console log to verify cart items
  useEffect(() => {
    console.log("Current cart items:", cartItems);
  }, [cartItems]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${product?.name} has been ${isFavorite ? "removed from" : "added to"} your favorites.`,
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Product link has been copied to clipboard.",
    });
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images
      });

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-litvi-dark flex items-center justify-center">
        <div className="text-center text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-litvi-dark flex items-center justify-center">
        <div className="text-center text-white">Error: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-litvi-dark flex items-center justify-center">
        <div className="text-center text-white bg-litvi-darkCharcoal p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleGoBack} variant="secondary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-litvi-dark via-litvi-darkCharcoal to-litvi-darkGray text-white pb-16 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-litvi-darkCharcoal rounded-xl overflow-hidden border border-white/5 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Product Image Section */}
              <div className="relative overflow-hidden bg-gradient-to-br from-litvi-darkCharcoal to-litvi-dark p-6 md:p-8">
                <div className={`relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'} transition-all duration-500`}>
                  <div className="aspect-square overflow-hidden rounded-lg relative">
                    <motion.img
                      src={product.images[0]} // Use imageUrl here
                      alt={product.name}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      animate={{ scale: isZoomed ? 1.5 : 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setIsZoomed(!isZoomed)}
                    />
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full bg-black/30 backdrop-blur-sm border-white/10 hover:bg-black/50"
                        onClick={() => setIsZoomed(!isZoomed)}
                      >
                        <ZoomIn className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </div>
                  <table>
                    <tr>
                      <td className='pl-20'>
                        <div>
                          <span className="text-xs text-white/50">Dimensions</span>
                          <p className="text-white font-medium">{product.sizeDimension}</p>
                        </div>
                      </td>
                      <td className='pl-20'>
                      <div>
                        <span className="text-xs text-white/50">Weight</span>
                        <p className="text-white font-medium">{product.weight}</p>
                      </div>
                      </td>
                    </tr>

                  </table>

                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                  <Button
                    size="icon"
                    variant="outline"
                    className={`rounded-full ${isFavorite ? 'bg-litvi-purple/20 border-litvi-purple' : 'bg-black/30 backdrop-blur-sm border-white/10'} hover:bg-litvi-purple/30`}
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'text-litvi-purple fill-litvi-purple' : 'text-white'}`} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-black/30 backdrop-blur-sm border-white/10 hover:bg-black/50"
                    onClick={handleShare}
                  >
                    <Share className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="p-6 md:p-8 lg:p-10">
                <span className="inline-block px-3 py-1 mb-4 rounded-full text-xs font-medium bg-litvi-purple/20 text-litvi-purple">
                  Premium Collection
                </span>

                <h1 className="text-3xl md:text-4xl font-bold text-gradient-modern mb-2">
                  {product.name}
                </h1>

                <div className="flex items-baseline mb-6">
                  <span className="text-2xl md:text-3xl font-bold text-white">${product.price}</span>
                  <span className="ml-2 text-sm text-white/60">USD</span>
                </div>

                <div className="prose prose-invert max-w-none mb-6">
                  <p className="text-white/80 text-lg">{product.productDescription}</p>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-2">Specifications</h3>
                    <div className="bg-black/20 rounded-lg p-4 grid grid-cols-2 gap-4">

                      
                      <div>
                        <span className="text-xs text-white/50">Material</span>
                        <p className="text-white font-medium">{product.material}</p>
                      </div>
                      <div>
                        <span className="text-xs text-white/50">Shape</span>
                        <p className="text-white font-medium">{product.shape}</p>
                      </div>
                      <div>
                        <span className="text-xs text-white/50">UsageApplication</span>
                        <p className="text-white font-medium">{product.usageApplication}</p>
                      </div>
                      <div>
                        <span className="text-xs text-white/50">FinishType</span>
                        <p className="text-white font-medium">{product.finishType}</p>
                      </div>

                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-2">Features</h3>
                    <ul className="space-y-2">
                      {productFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-litvi-purple/20 text-litvi-purple mr-2 flex-shrink-0">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button
                    className="w-full bg-gradient-to-r from-litvi-purple to-litvi-magenta hover:opacity-90 text-white py-6"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5 py-6"
                  >
                    Request Custom Quote
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product Details Tabs */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-litvi-darkCharcoal rounded-xl overflow-hidden border border-white/5 shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Product Details</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80">
                Our premium {product.name} quartz sink is designed to be the centerpiece of your modern kitchen.
                Crafted with meticulous attention to detail, this sink combines aesthetic appeal with unparalleled
                functionality. The quartz material ensures exceptional durability, resistance to scratches,
                and ease of maintenance.
              </p>

              <h3 className="text-xl font-medium mt-6 mb-4">Material & Construction</h3>
              <p className="text-white/80">
                Made from high-quality quartz composite (80% quartz and 20% resin binders), our sinks are
                non-porous, hygienic, and highly resistant to heat, scratches, stains, and impact. The
                manufacturing process involves molding the material under high pressure and temperature,
                ensuring consistent quality throughout.
              </p>

              <h3 className="text-xl font-medium mt-6 mb-4">Installation & Maintenance</h3>
              <p className="text-white/80">
                The {product.name} sink can be installed as an undermount, topmount, or flush-mount,
                providing flexibility to match your kitchen design. Regular cleaning with mild soap
                and water is all that's needed to maintain its pristine appearance. Avoid using
                abrasive cleaners or scrubbers to preserve the surface finish.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products Section */}

      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;

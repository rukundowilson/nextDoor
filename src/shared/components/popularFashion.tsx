import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

type Product = {
  id: number;
  tag?: "Featured" | "On Sale";
  category: string;
  title: string;
  rating: number;
  reviews: number;
  price: string;
  oldPrice?: string;
  badge?: string;
  image: string;
  colors?: string[];
};

const popularProducts: Product[] = [
  {
    id: 1,
    tag: "Featured",
    category: "T-Shirts",
    title: "Men Hooded Navy Blue & Grey T‑Shirt",
    rating: 5,
    reviews: 2,
    price: "$70.00 – $95.00",
    badge: "19% Off",
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Solid-Men-Hooded-Blue-Grey-T-Shirt-2-300x350.jpg",
  },
  {
    id: 2,
    tag: "Featured",
    category: "Tops",
    title: "Women Off White Printed Blouson Top",
    rating: 0,
    reviews: 0,
    price: "$47.00",
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Women-Off-White-Printed-Blouson-Top-2-300x350.jpg",
  },
  {
    id: 3,
    category: "Casual Shoes",
    title: "Men Blue Colourblocked Mid‑Top Sneakers",
    rating: 5,
    reviews: 3,
    price: "$45.00",
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Men-Blue-Colourblocked-Mid-Top-Sneakers-2-300x350.jpg",
  },
  {
    id: 4,
    category: "Jeans",
    title: "Women Blue Skinny Fit Stretchable Jeans",
    rating: 0,
    reviews: 0,
    price: "$70.00 – $78.00",
    colors: ["#4a5568", "#3182ce", "#63b3ed"],
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Women-Blue-Skinny-Fit-Stretchable-Jeans-2-300x350.jpg",
  },
  {
    id: 5,
    category: "Watches",
    title: "Navy Blue‑Silver‑White Multifunction Analog Watch",
    rating: 4,
    reviews: 1,
    price: "$49.00",
    oldPrice: "$85.00",
    badge: "42% Off",
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Navy-BlueSilver-White-Multifunction-Analog-Watch-2-300x350.jpg",
  },
  {
    id: 6,
    category: "Luggage & Travel",
    title: "Unisex Blue Graphic Backpack",
    rating: 3,
    reviews: 1,
    price: "$15.00",
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Unisex-Blue-Graphic-Backpack.jpg",
  },
  {
    id: 7,
    tag: "Featured",
    category: "Jeans",
    title: "Men Blue Skinny Fit Stretchable Jeans",
    rating: 2,
    reviews: 1,
    price: "$120.00",
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Men-Blue-Skinny-Fit-Stretchable-Jeans.jpg",
  },
  {
    id: 8,
    category: "Bags & Backpacks",
    title: "Brown Quilted Satchel",
    rating: 0,
    reviews: 0,
    price: "$35.00",
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Brown-Quilted-Satchel-2-300x350.jpg",
  },
];

const categories = [
  "Women",
  "Watches",
  "Shoes",
  "Others",
  "Men",
  "Jewellery",
  "Beauty & Care",
  "Bags & Backpacks",
];

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  function handleAdd() {
    addToCart({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      img: product.image,
      badge: product.badge,
    } as any);
  }

  return (
    <div className="group bg-white border border-gray-100 hover:border-blue-500/40 rounded-md overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full">
      <div className="relative bg-white flex items-center justify-center p-3">
        {product.tag && (
          <span className="absolute left-2 top-2 text-[9px] font-semibold uppercase bg-orange-500 text-white px-1.5 py-0.5 rounded z-10">
            {product.tag}
          </span>
        )}
        {product.badge && (
          <span className={`absolute text-[9px] font-semibold uppercase bg-green-500 text-white px-1.5 py-0.5 rounded z-10 ${product.tag ? 'left-2 top-8' : 'left-2 top-2'}`}>
            {product.badge}
          </span>
        )}
        <button className="absolute right-2 top-2 w-6 h-6 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-300 transition">
          <Heart className="w-2.5 h-2.5" />
        </button>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <button onClick={handleAdd} className="mb-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto bg-blue-600 text-white px-3 py-2 rounded-full flex items-center gap-2 shadow">
            <ShoppingCart className="w-4 h-4" />
            Add to cart
          </button>
        </div>
      </div>

      <div className="px-3 pb-3 flex-1 flex flex-col">
        <p className="text-[10px] uppercase tracking-wide text-blue-600 mb-1">
          {product.category}
        </p>

        <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 min-h-[32px] leading-tight mb-2">
          {product.title}
        </h3>

        <div className="mt-auto flex items-baseline gap-1.5">
          <span className="text-xs font-semibold text-gray-900">
            {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-[10px] text-gray-400 line-through">
              {product.oldPrice}
            </span>
          )}
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="mt-3 flex gap-2">
            {product.colors.map((color, index) => (
              <button
                key={index}
                className={`w-4 h-4 rounded-full border-2 ${
                  index === 0 ? "border-blue-500" : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function PopularFashion() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-2">
            <h2 className="text-lg md:text-xl font-bold text-blue-600 mb-6">
              Popular Fashion
            </h2>
            <div className="flex flex-col gap-3">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="text-left text-sm text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="lg:col-span-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

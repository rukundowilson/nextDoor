import { Heart } from "lucide-react";

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
};

const products: Product[] = [
  {
    id: 1,
    tag: "Featured",
    category: "T-Shirts",
    title: "Men Hooded Navy Blue & Grey T‑Shirt",
    rating: 5,
    reviews: 2,
    price: "$70.00 – $95.00",
    oldPrice: "",
    badge: "19% Off",
    image: "/asset/img/Men-Blue-Colourblocked-Mid-Top-Sneakers-430x502.jpg",
  },
  {
    id: 2,
    category: "Leather",
    title: "Navy Blue‑Silver‑White Multifunction Analog Watch",
    rating: 4,
    reviews: 1,
    price: "$49.00",
    oldPrice: "$85.00",
    badge: "42% Off",
    image: "/asset/img/Men-Blue-Colourblocked-Mid-Top-Sneakers-430x502.jpg",
  },
  {
    id: 3,
    tag: "Featured",
    category: "Shorts & Skirts",
    title: "Women Off White Printed Blouson Top",
    rating: 2.7,
    reviews: 3,
    price: "$47.00",
    image: "/asset/img/Women-Off-White-Printed-Top-5-150x150.jpg",
  },
  {
    id: 4,
    category: "Luggage & Travel",
    title: "Unisex Blue Graphic Backpack",
    rating: 3,
    reviews: 1,
    price: "$15.00",
    image: "/asset/img/Men-Blue-Colourblocked-Mid-Top-Sneakers-430x502.jpg",
  },
  {
    id: 5,
    category: "Casual Shoes",
    title: "Men Blue Colourblocked Mid‑Top Sneakers",
    rating: 5,
    reviews: 3,
    price: "$45.00",
    image: "/asset/img/Men-Blue-Colourblocked-Mid-Top-Sneakers-430x502.jpg",
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white border border-gray-100 hover:border-blue-500/40 rounded-md overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
      <div className="relative bg-white flex items-center justify-center p-4">
        {product.badge && (
          <span className="absolute left-3 top-3 text-[10px] font-semibold uppercase bg-orange-500 text-white px-2 py-1 rounded">
            {product.badge}
          </span>
        )}
        {product.tag && (
          <span className="absolute left-3 bottom-3 text-[10px] font-semibold uppercase bg-green-500 text-white px-2 py-1 rounded">
            {product.tag}
          </span>
        )}
        <button className="absolute right-3 top-3 w-7 h-7 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-300 transition">
          <Heart className="w-3 h-3" />
        </button>
        <img
          src={product.image}
          alt={product.title}
          className="max-h-44 object-contain"
        />
      </div>

      <div className="px-4 pb-4 flex-1 flex flex-col">
        <p className="text-[11px] uppercase tracking-wide text-blue-600 mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[40px]">
          {product.title}
        </h3>

        <div className="flex items-center gap-1 mt-2">
          <div className="flex text-yellow-400 text-xs">
            {"★★★★★".slice(0, Math.round(product.rating))}
          </div>
          <span className="text-[11px] text-gray-500">
            ({product.reviews})
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              {product.oldPrice}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}

export function FeaturedProducts() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Featured Products
            </h2>
            <div className="hidden sm:flex text-xs md:text-[13px] uppercase tracking-wide border border-gray-200 rounded-full overflow-hidden">
              <button className="px-3 py-1.5 bg-blue-600 text-white font-semibold">
                Featured
              </button>
              <button className="px-3 py-1.5 text-gray-700 hover:bg-gray-100">
                Recent
              </button>
              <button className="px-3 py-1.5 text-gray-700 hover:bg-gray-100">
                On Sale
              </button>
              <button className="px-3 py-1.5 text-gray-700 hover:bg-gray-100">
                Top Rated
              </button>
            </div>
          </div>

          <button className="hidden md:inline-flex text-xs font-semibold uppercase text-blue-600 border border-blue-600 rounded-full px-4 py-1.5 hover:bg-blue-600 hover:text-white transition">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200" />
    </section>
  );
}


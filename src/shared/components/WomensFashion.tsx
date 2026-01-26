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

const womensProducts: Product[] = [
  {
    id: 1,
    tag: "Featured",
    category: "Tops",
    title: "Women Off White Printed...",
    rating: 0,
    reviews: 0,
    price: "$47.00",
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Women-Off-White-Printed-Blouson-Top-2-430x502.jpg",
  },
  {
    id: 2,
    category: "Tops",
    title: "Women Khaki Solid Top",
    rating: 0,
    reviews: 0,
    price: "$199.00",
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Women-Khaki-Solid-Top-2-430x502.jpg",
  },
  {
    id: 3,
    category: "Jackets & Coats",
    title: "Women Navy Blue Solid Parka...",
    rating: 0,
    reviews: 0,
    price: "$160.00 – $190.00",
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Women-Navy-Blue-Solid-Parka-Jacket-2-300x350.jpg",
  },
  {
    id: 4,
    category: "Jeans",
    title: "Women Blue Skinny Fit...",
    rating: 0,
    reviews: 0,
    price: "$70.00 – $78.00",
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Women-Blue-Skinny-Fit-Stretchable-Jeans-2-430x502.jpg",
  },
  {
    id: 5,
    tag: "Featured",
    category: "Shorts & Skirts",
    title: "Women Blue Solid Denim...",
    rating: 0,
    reviews: 0,
    price: "$49.00",
    oldPrice: "$89.00",
    badge: "45% OFF",
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Women-Blue-Solid-Denim-Pencil-Skirt-2-300x350.jpg",
  },
  {
    id: 6,
    category: "Jeans",
    title: "Women Blue Alexi Skinny...",
    rating: 0,
    reviews: 0,
    price: "$95.00",
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Women-Blue-Alexi-Skinny-Fit-Jeans-2-300x350.jpg",
  },
];

const categories = [
  "Trousers & Capris",
  "Tops",
  "Shorts & Skirts",
  "Lingerie & Nightwear",
  "Jeans",
  "Dresses",
];

function ProductCard({ product }: { product: Product }) {
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
      </div>

      <div className="px-3 pb-1 flex-1 flex flex-col">
        {/* <p className="text-[10px] uppercase tracking-wide text-blue-600 mb-1">
          {product.category}
        </p> */}

        <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 min-h-[20px] leading-tight">
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
      </div>
    </div>
  );
}

export function WomensFashion() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-2">
            <h2 className="text-lg md:text-xl font-bold text-blue-600 mb-4">
              Women' Fashion
            </h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <button className="text-sm text-gray-700 hover:text-blue-600 transition w-full text-left py-1">
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-10 ">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-start">
              {/* HERO IMAGE - Takes 2 columns, reduced height and width */}
              <div className="md:col-span-2 relative rounded-lg overflow-hidden bg-gray-100 max-h-full flex-shrink-0">
                <img
                  src="https://kapee.presslayouts.com/wp-content/uploads/2019/07/Product-box-banner-4.jpg"
                  alt="Women's Fashion"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs uppercase tracking-wide mb-1">
                      NEW ARRIVAL
                    </p>
                    <p className="text-lg font-bold">UP TO 70% Off</p>
                  </div>
                </div>
              </div>

              {/* PRODUCT GRID - Takes 4 columns on desktop, shows 3 products horizontally */}
              <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[350px]">
                {womensProducts.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 mt-6" />
    </section>
  );
}

import { ChevronRight } from "lucide-react";

export function Hero() {
  const categories = [
    { name: "Men", image: "/asset/img/men.jpg"},
    { name: "Women", image: "/asset/img/women-150x150.jpg" },
    { name: "Shoes", image: "/asset/img/Shoes-150x150.jpg" },
    { name: "Bags & Backpacks", image: "/asset/img/Bags-150x150.png" },
    { name: "Watches", image: "/asset/img/Watch-150x150.jpg" },
    { name: "Jewellery", image: "/asset/img/Jewellery-150x150.jpg" },
    { name: "Accessories", image: "/asset/img/Accessories-150x150.jpg" },
    { name: "Dresses", image: "/asset/img/ndoor.png" },
    { name: "Tops", image: "/asset/img/Women-Khaki-Solid-Top-150x150.jpg" },
    { name: "Lingerie & N...", image: "/asset/img/ndoor.png" },
  ];

  const promos = [
    {
      label: "WHITE SNEAKERS",
      discount: "MIN. 30% OFF",
      description: "Men Fashionable Shoes",
      color: "bg-blue-50",
    },
    {
      label: "WOMEN'S FASHION",
      discount: "UP TO 65% OFF",
      description: "Shoes & Backpacks",
      color: "bg-orange-50",
    },
  ];

  return (
    <section className="w-full bg-white">
      {/* MAIN HERO */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-12">
          {/* LEFT - Main Hero Image & Content */}
          <div className="md:col-span-2">
            <div className="relative bg-gray-50 overflow-hidden rounded-lg">
              <div className="md:flex md:items-center">
                <div className="w-full md:w-1/2">
                  <img
                    src="/asset/img/ndoor.png"
                    alt="Men's Fashion"
                    className="w-full h-64 md:h-96 object-cover"
                  />
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                  <p className="text-blue-600 font-semibold text-sm md:text-base">
                    NEW COLLECTIONS 2019
                  </p>
                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2">
                    MEN'S FASHION
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                    eiusmod tempor!
                  </p>
                  <button className="mt-6 bg-blue-600 text-white px-6 md:px-8 py-2 md:py-3 font-semibold text-sm md:text-base hover:bg-blue-700 transition inline-flex items-center gap-2 w-max">
                    SHOP NOW
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - Promotional Cards */}
          <div className="w-full flex flex-col gap-6">
            {promos.map((promo, index) => (
              <div
                key={index}
                className={`${promo.color} rounded-lg p-6 space-y-3 hover:shadow-lg transition`}
              >
                <p className="text-blue-600 font-semibold text-xs md:text-sm">
                  {promo.label}
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  {promo.discount}
                </h3>
                <p className="text-gray-600 text-sm">{promo.description}</p>
                <button className="bg-blue-600 text-white px-4 py-2 font-semibold text-xs md:text-sm hover:bg-blue-700 transition inline-flex items-center gap-2">
                  SHOP NOW
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORIES GRID */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className="group flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="p-1 w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden group-hover:bg-blue-100 transition">
                  <img src={category.image} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-700 text-center line-clamp-2">
                  {category.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-gray-200"></div>
    </section>
  );
}

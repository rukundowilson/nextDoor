import { ChevronRight } from "lucide-react";

export function Hero() {
  const categories = [
    { name: "Men", image: "/asset/img/ndoor.png"},
    { name: "Women", image: "/asset/img/ndoor.png" },
    { name: "Shoes", image: "/asset/img/ndoor.png" },
    { name: "Bags & Backpacks", image: "/asset/img/ndoor.png" },
    { name: "Watches", image: "/asset/img/ndoor.png" },
    { name: "Jewellery", image: "/asset/img/ndoor.png" },
    { name: "Accessories", image: "/asset/img/ndoor.png" },
    { name: "Dresses", image: "/asset/img/ndoor.png" },
    { name: "Tops", image: "/asset/img/ndoor.png" },
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
          <div className=" p-6 bg-gray-100 md:col-span-2 flex flex-col md:flex-row items-center gap-8">
            
            <div className="w-full md:w-1/2 space-y-4">
              <p className="text-blue-600 font-semibold text-sm md:text-base">
                NEW COLLECTIONS 2019
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
                MEN'S FASHION
              </h1>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor!
              </p>
              <button className="bg-blue-600 text-white px-6 md:px-8 py-2 md:py-3 font-semibold text-sm md:text-base hover:bg-blue-700 transition inline-flex items-center gap-2">
                SHOP NOW
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src="/asset/img/ndoor.png"
                alt="Men's Fashion"
                className="w-full max-w-sm rounded-lg object-cover"
              />
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
                <div className="p-2 w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl md:text-4xl group-hover:bg-blue-100 transition">
                  <img src={category.image} alt="" />
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

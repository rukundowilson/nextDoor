import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
  import { getCategories } from "../services/axios";

export function Hero() {
  const navigate = useNavigate();
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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
    <section className="w-full bg-white mt-20">
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* MAIN HERO */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-12">
          {/* LEFT - Main Hero Image & Content */}
          <div className="md:col-span-2">
            <div className="relative bg-gray-50 overflow-hidden rounded-lg">
              <div className="md:flex md:items-center">
                <div className="w-full md:w-1/2">
                  <img
                    src="https://kapee.presslayouts.com/wp-content/uploads/2019/07/Product-box-banner-1.jpg"
                    alt="Men's Fashion"
                    className="w-full md:h-96 object-cover"
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
          <div className="relative group">
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition opacity-0 group-hover:opacity-100 duration-300"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition opacity-0 group-hover:opacity-100 duration-300"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>

            {/* Categories Container */}
            <div 
              ref={scrollContainerRef} 
              className="overflow-x-auto scroll-smooth hide-scrollbar"
            >
              <div className="flex gap-4 pb-2 min-w-min">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => navigate(`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`)}
                      className="group/item flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
                    >
                      <div className="p-1 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden group-hover/item:bg-blue-100 transition">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center">
                            <p className="text-xs font-bold text-blue-600 uppercase">{category.name.substring(0, 2)}</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs md:text-sm font-medium text-gray-700 text-center line-clamp-2 w-16 md:w-20">
                        {category.name}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-8">Loading categories...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-gray-200"></div>
    </section>
  );
}

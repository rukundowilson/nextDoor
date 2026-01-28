import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Category = {
  id: number;
  name: string;
  productCount: number;
  image: string;
};

const categories: Category[] = [
  {
    id: 1,
    name: "WOMEN",
    productCount: 9,
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/03/women-300x350.jpg",
  },
  {
    id: 2,
    name: "SHOES",
    productCount: 5,
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/03/Shoes-300x350.jpg",
  },
  {
    id: 3,
    name: "JEWELLERY",
    productCount: 4,
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/03/Jewellery-300x350.jpg",
  },
  {
    id: 4,
    name: "WATCHES",
    productCount: 4,
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/03/Watch-300x350.jpg",
  },
  {
    id: 5,
    name: "MEN",
    productCount: 7,
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/03/Men-300x350.jpg",
  },
  {
    id: 6,
    name: "BEAUTY & CA...",
    productCount: 2,
    image: "https://kapee.presslayouts.com/wp-content/uploads/2019/06/beauty-category-300x350.jpg",
  },
];

const sidebarCategories = [
  "Women",
  "Watches",
  "Shoes",
  "Men",
  "Jewellery",
  "Beauty & Care",
  "Bags & Backpacks",
  "Accessories",
];

function CategoryCard({ category }: { category: Category }) {
  const navigate = useNavigate();

  return (
    <div 
      className="group relative bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition h-40 cursor-pointer"
      onClick={() => navigate(`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`)}
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex flex-col items-center justify-center">
        <h3 className="text-white font-bold text-sm md:text-base">
          {category.name}
        </h3>
        <p className="text-white text-xs mt-1">{category.productCount} PRODUCTS</p>
      </div>
    </div>
  );
}

export function FashionCategories() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const displayedCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 border-t-2 border-orange-400">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-2">
            <h2 className="text-lg md:text-xl font-bold text-orange-500 mb-6">
              Fashion<br />Categories
            </h2>
            <ul className="space-y-2">
              {sidebarCategories.map((category) => (
                <li key={category}>
                  <button 
                    onClick={() => navigate(`/category/${category.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="text-sm text-gray-700 hover:text-blue-600 transition w-full text-left py-1"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-10">
            <div className="flex gap-6">
              {/* BANNER */}
              <div className="hidden md:block w-80 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src="https://kapee.presslayouts.com/wp-content/uploads/2019/06/Product-box-category-banner.jpg"
                  alt="Fashion Categories"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CATEGORY GRID WITH NAVIGATION */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="grid grid-cols-3 gap-4">
                      {displayedCategories.map((category) => (
                        <div key={category.id}>
                          <CategoryCard category={category} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={handlePrev}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                    title="Previous"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx)}
                        className={`w-2 h-2 rounded-full transition ${
                          idx === currentPage ? "bg-orange-500" : "bg-gray-300"
                        }`}
                        title={`Go to page ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                    title="Next"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px mt-6 bg-gray-200" />
    </section>
  );
}

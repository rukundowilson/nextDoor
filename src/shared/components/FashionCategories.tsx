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
  return (
    <div className="group relative bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition h-40">
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
                  <button className="text-sm text-gray-700 hover:text-blue-600 transition w-full text-left py-1">
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-10">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-start">
              {/* BANNER - Takes 2 columns */}
              <div className="md:col-span-2 relative rounded-md overflow-hidden bg-gray-100 max-h-[500px] flex-shrink-0">
                <img
                  src="https://kapee.presslayouts.com/wp-content/uploads/2019/06/Product-box-category-banner.jpg"
                  alt="Fashion Categories"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CATEGORY GRID - Takes 4 columns */}
              <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px mt-6 bg-gray-200" />
    </section>
  );
}

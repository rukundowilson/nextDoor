import API_BASE_URL from "../../config/apiConfig";

export type Product = {
	id: number;
	backendId?: string; // Original backend product ID (e.g., "product-1769537739458")
	title: string;
	category: string;
	price: string; // e.g. "$49.00"
	img: string;
	badge?: string;
	description?: string;
	displayTags?: ("Featured" | "Mens" | "Womens" | "Popular" | "Categories")[];
	// Backend fields for compatibility
	name?: string;
	categoryId?: string;
	image?: string;
	inStock?: boolean;
	quantity?: number;
};

// Type for backend products
export type BackendProduct = {
	id: string;
	name: string;
	categoryId: string;
	price: number;
	image?: string;
	description?: string;
	displayTags?: ("Featured" | "Mens" | "Womens" | "Popular" | "Categories")[];
	inStock?: boolean;
	quantity?: number;
};

const sampleProducts: Product[] = [
	{
		id: 1,
		title: "Men Hooded Navy Blue & Grey T-Shirt",
		category: "T-SHIRTS",
		price: "$70.00",
		img: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Solid-Men-Hooded-Blue-Grey-T-Shirt-2-300x350.jpg",
		badge: "FEATURED",
	},
	{
		id: 2,
		title: "Navy Blue-Silver-White Watch",
		category: "LEATHER",
		price: "$49.00",
		img: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Navy-BlueSilver-White-Multifunction-Analog-Watch-2-300x350.jpg",
	},
	{
		id: 3,
		title: "Women Off White Printed Blouson Top",
		category: "SHORTS & SKIRTS",
		price: "$47.00",
		img: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Women-Off-White-Printed-Blouson-Top-2-300x350.jpg",
		badge: "FEATURED",
	},
	{
		id: 4,
		title: "Casual Brown Boots",
		category: "SHOES",
		price: "$85.00",
		img: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Unisex-Blue-Graphic-Backpack-2-300x350.jpg",
	},
	{
		id: 5,
		title: "Tan Leather Handbag",
		category: "BAGS & BACKPACKS",
		price: "$120.00",
		img: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Men-Blue-Colourblocked-Mid-Top-Sneakers-2-300x350.jpg",
	},
	{
		id: 6,
		title: "Simple Pendant Necklace",
		category: "JEWELLERY",
		price: "$25.00",
		img: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Men-Blue-Skinny-Fit-Stretchable-Jeans-2-300x350.jpg",
	},
];

// Fetch products from API, fallback to mock data
export async function getProducts(): Promise<Product[]> {
	try {
		const response = await fetch(`${API_BASE_URL}/products`);
		
		if (!response.ok) {
			console.warn(`Failed to fetch products, using mock data: ${response.status}`);
			return sampleProducts.slice();
		}

		const text = await response.text();
		if (!text) return sampleProducts.slice();

		const products = JSON.parse(text) as BackendProduct[];
		const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
		const categoriesText = await categoriesResponse.text();
		const categories = categoriesText ? JSON.parse(categoriesText) as Category[] : [];
		
		// Create a map of categoryId to category name
		const categoryMap = new Map(categories.map(c => [c.id, c.name]));
		
		// Map backend fields to frontend fields
		return Array.isArray(products) ? products.map((p: BackendProduct) => ({
			id: parseInt(p.id.split('-')[1]) || Math.random(), // Convert string id to number
			backendId: p.id, // Keep the original backend ID
			title: p.name,
			category: categoryMap.get(p.categoryId) || p.categoryId,
			price: typeof p.price === 'string' ? p.price : `$${p.price.toFixed(2)}`,
			img: p.image || "",
			description: p.description,
			displayTags: p.displayTags,
		})) : sampleProducts.slice();
	} catch (error) {
		console.error('Error fetching products, using mock data:', error);
		return sampleProducts.slice();
	}
}

export interface Category {
	id: string;
	name: string;
	description?: string;
	image?: string;
}

export async function getCategories(): Promise<Category[]> {
	try {
		const response = await fetch(`${API_BASE_URL}/categories`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		
		if (!response.ok && response.status !== 304) {
			throw new Error(`Failed to fetch categories: ${response.status}`);
		}
		
		// Handle 304 Not Modified or empty responses
		const text = await response.text();
		if (!text) return [];
		
		return JSON.parse(text);
	} catch (error) {
		console.error("Error fetching categories:", error);
		return [];
	}
}

export async function uploadCategory(
	name: string,
	description: string,
	imageFile?: File,
	token?: string
): Promise<Category | null> {
	try {
		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);
		if (imageFile) {
			formData.append('image', imageFile);
		}

		const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

		const response = await fetch(`${API_BASE_URL}/categories`, {
			method: 'POST',
			headers,
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`Failed to upload category: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error uploading category:', error);
		return null;
	}
}

export async function deleteCategory(categoryId: string, token?: string): Promise<boolean> {
	try {
		const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

		const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
			method: 'DELETE',
			headers,
		});

		if (!response.ok) {
			throw new Error(`Failed to delete category: ${response.status}`);
		}

		return true;
	} catch (error) {
		console.error('Error deleting category:', error);
		return false;
	}
}

export async function uploadProduct(
	categoryId: string,
	title: string,
	price: string,
	description: string,
	imageFile?: File,
	displayTags?: string[],
	token?: string
): Promise<Product | null> {
	try {
		const formData = new FormData();
		formData.append('name', title); // Backend expects 'name'
		formData.append('price', price);
		formData.append('description', description);
		formData.append('categoryId', categoryId);
		if (displayTags && displayTags.length > 0) {
			formData.append('displayTags', JSON.stringify(displayTags));
		}
		if (imageFile) {
			formData.append('image', imageFile);
		}

		const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

		const response = await fetch(`${API_BASE_URL}/products`, {
			method: 'POST',
			headers,
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`Failed to upload product: ${response.status}`);
		}

		const data = await response.json() as BackendProduct;
		// Map backend fields to frontend fields
		return {
			id: parseInt(data.id.split('-')[1]) || Date.now(), // Convert string id to number
			title: data.name,
			category: data.categoryId,
			price: `$${data.price}`, // Format price as currency
			img: data.image || "",
			description: data.description,
			displayTags: data.displayTags,
		};
	} catch (error) {
		console.error('Error uploading product:', error);
		return null;
	}
}

export async function updateProduct(
	productId: string,
	title: string,
	price: string,
	description: string,
	imageFile?: File,
	displayTags?: string[],
	token?: string
): Promise<Product | null> {
	try {
		const formData = new FormData();
		formData.append('name', title);
		formData.append('price', price);
		formData.append('description', description);
		if (displayTags && displayTags.length > 0) {
			formData.append('displayTags', JSON.stringify(displayTags));
		}
		if (imageFile) {
			formData.append('image', imageFile);
		}

		const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

		const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
			method: 'PUT',
			headers,
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`Failed to update product: ${response.status}`);
		}

		const data = await response.json() as BackendProduct;
		return {
			id: parseInt(data.id.split('-')[1]) || Date.now(),
			title: data.name,
			category: data.categoryId,
			price: `$${data.price}`,
			img: data.image || "",
			description: data.description,
			displayTags: data.displayTags,
		};
	} catch (error) {
		console.error('Error updating product:', error);
		return null;
	}
}

export async function deleteProduct(productId: string, token?: string): Promise<boolean> {
	try {
		const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

		const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
			method: 'DELETE',
			headers,
		});

		if (!response.ok) {
			throw new Error(`Failed to delete product: ${response.status}`);
		}

		return true;
	} catch (error) {
		console.error('Error deleting product:', error);
		return false;
	}
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
	try {
		const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`);
		
		if (!response.ok) {
			console.warn(`Failed to fetch products: ${response.status}`);
			return [];
		}

		const text = await response.text();
		if (!text) return [];

		const products = JSON.parse(text) as BackendProduct[];
		// Map backend fields to frontend fields
		return Array.isArray(products) ? products.map((p: BackendProduct) => ({
			id: parseInt(p.id.split('-')[1]) || Math.random(), // Convert string id to number
			backendId: p.id, // Keep the original backend ID
			title: p.name,
			category: p.categoryId,
			price: typeof p.price === 'string' ? p.price : `$${p.price.toFixed(2)}`,
			img: p.image || "",
			description: p.description,
			displayTags: p.displayTags,
		})) : [];
	} catch (error) {
		console.error('Error fetching products:', error);
		return [];
	}
}

export async function getFeaturedProducts(): Promise<Product[]> {
	try {
		const [productsResponse, categoriesResponse] = await Promise.all([
			fetch(`${API_BASE_URL}/products`),
			fetch(`${API_BASE_URL}/categories`)
		]);
		
		if (!productsResponse.ok || !categoriesResponse.ok) {
			console.warn(`Failed to fetch products or categories`);
			return [];
		}

		const productsText = await productsResponse.text();
		const categoriesText = await categoriesResponse.text();
		
		if (!productsText || !categoriesText) return [];

		const products = JSON.parse(productsText) as BackendProduct[];
		const categories = JSON.parse(categoriesText) as Category[];
		
		// Create a map of categoryId to category name
		const categoryMap = new Map(categories.map(c => [c.id, c.name]));
		
		// Filter products with "Featured" tag
		const featuredProducts = Array.isArray(products) 
			? products.filter(p => p.displayTags?.includes("Featured"))
			: [];
		
		// Map backend fields to frontend fields
		return featuredProducts.map((p: BackendProduct) => ({
			id: parseInt(p.id.split('-')[1]) || Math.random(), // Convert string id to number
			title: p.name,
			category: categoryMap.get(p.categoryId) || p.categoryId,
			price: typeof p.price === 'string' ? p.price : `$${p.price.toFixed(2)}`,
			img: p.image || "",
			badge: "FEATURED",
			description: p.description,
			displayTags: p.displayTags,
		}));
	} catch (error) {
		console.error('Error fetching featured products:', error);
		return [];
	}
}

export async function getProductsByTag(tag: string): Promise<Product[]> {
	try {
		const [productsResponse, categoriesResponse] = await Promise.all([
			fetch(`${API_BASE_URL}/products`),
			fetch(`${API_BASE_URL}/categories`)
		]);
		
		if (!productsResponse.ok || !categoriesResponse.ok) {
			console.warn(`Failed to fetch products or categories`);
			return [];
		}

		const productsText = await productsResponse.text();
		const categoriesText = await categoriesResponse.text();
		
		if (!productsText || !categoriesText) return [];

		const products = JSON.parse(productsText) as BackendProduct[];
		const categories = JSON.parse(categoriesText) as Category[];
		
		// Create a map of categoryId to category name
		const categoryMap = new Map(categories.map(c => [c.id, c.name]));
		
		// Filter products with the specified tag
		const taggedProducts = Array.isArray(products) 
			? products.filter(p => p.displayTags?.includes(tag as any))
			: [];
		
		// Map backend fields to frontend fields
		return taggedProducts.map((p: BackendProduct) => ({
			id: parseInt(p.id.split('-')[1]) || Math.random(),
			backendId: p.id, // Keep the original backend ID
			title: p.name,
			category: categoryMap.get(p.categoryId) || p.categoryId,
			price: typeof p.price === 'string' ? p.price : `$${p.price.toFixed(2)}`,
			img: p.image || "",
			description: p.description,
			displayTags: p.displayTags,
		}));
	} catch (error) {
		console.error(`Error fetching products with tag ${tag}:`, error);
		return [];
	}
}

export default {
	getProducts,
	getCategories,
	uploadCategory,
	uploadProduct,
	getProductsByCategory,
	getFeaturedProducts,
	getProductsByTag,
};

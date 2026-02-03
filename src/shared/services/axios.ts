import API_BASE_URL from "../../config/apiConfig";

export type ProductColor = {
	name: string;
	hexColor?: string;
};

export type ProductVariant = {
	size?: string;
	color?: string;
	hexColor?: string;
	images?: string[]; // backend URLs
};

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
	categoryIds?: string[];
	image?: string;
	inStock?: boolean;
	quantity?: number;
	images?: string[]; // Multiple product images
	variants?: ProductVariant[];
	colors?: ProductColor[]; // Available colors
	sizes?: string[]; // Available sizes
};

// Type for backend products
export type BackendProduct = {
	id: string;
	name: string;
	categoryId: string;
	categoryIds?: string[];
	price: number;
	image?: string;
	images?: string[];
	variants?: ProductVariant[];
	description?: string;
	displayTags?: ("Featured" | "Mens" | "Womens" | "Popular" | "Categories")[];
	inStock?: boolean;
	quantity?: number;
	colors?: ProductColor[];
	sizes?: string[];
};

const sampleProducts: Product[] = [
	{
		id: 1,
		title: "Men Hooded Navy Blue & Grey T-Shirt",
		category: "T-SHIRTS",
		price: "$70.00",
		img: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Solid-Men-Hooded-Blue-Grey-T-Shirt-2-300x350.jpg",
		badge: "FEATURED",
		description: "Classic hooded t-shirt crafted from premium cotton blend fabric. Features a comfortable fit with stylish navy blue and grey color blocking. Perfect for casual wear and everyday styling.",
	},
	{
		id: 2,
		title: "Navy Blue-Silver-White Watch",
		category: "LEATHER",
		price: "$49.00",
		img: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Navy-BlueSilver-White-Multifunction-Analog-Watch-2-300x350.jpg",
		description: "Elegant multifunction analog watch with stainless steel case and leather strap. Features navy blue dial with silver accents and white markers. Water resistant and perfect for both formal and casual occasions.",
	},
	{
		id: 3,
		title: "Women Off White Printed Blouson Top",
		category: "SHORTS & SKIRTS",
		price: "$47.00",
		img: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Women-Off-White-Printed-Blouson-Top-2-300x350.jpg",
		badge: "FEATURED",
		description: "Stylish off-white blouson top with contemporary printed design. Made from breathable fabric with relaxed fit and gathered sleeves for an effortless look. Versatile piece for casual or smart casual styling.",
	},
	{
		id: 4,
		title: "Casual Brown Boots",
		category: "SHOES",
		price: "$85.00",
		img: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Unisex-Blue-Graphic-Backpack-2-300x350.jpg",
		description: "Comfortable brown leather boots with cushioned sole and lace-up closure. Features sturdy construction and slip-resistant grip. Ideal for outdoor activities and everyday adventures.",
	},
	{
		id: 5,
		title: "Tan Leather Handbag",
		category: "BAGS & BACKPACKS",
		price: "$120.00",
		img: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Men-Blue-Colourblocked-Mid-Top-Sneakers-2-300x350.jpg",
		description: "Sophisticated tan leather handbag with premium craftsmanship. Features multiple compartments, adjustable shoulder strap, and gold-tone hardware. Perfect for work or weekend outings.",
	},
	{
		id: 6,
		title: "Simple Pendant Necklace",
		category: "JEWELLERY",
		price: "$25.00",
		img: "https://kapee.presslayouts.com/wp-content/uploads/2019/04/Men-Blue-Skinny-Fit-Stretchable-Jeans-2-300x350.jpg",
		description: "Minimalist pendant necklace crafted from high-quality sterling silver. Features a delicate chain and polished finish. A timeless piece that works with any style or outfit.",
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
        
				// Map backend fields to frontend fields. If product has multiple categories, pick first for `category` display.
				return Array.isArray(products) ? products.map((p: BackendProduct) => ({
						id: parseInt(p.id.split('-')[1]) || Math.random(), // Convert string id to number
						backendId: p.id, // Keep the original backend ID
						title: p.name,
						category: (p.categoryIds && p.categoryIds.length > 0)
							? (categoryMap.get(p.categoryIds[0]) || p.categoryIds[0])
							: (categoryMap.get(p.categoryId) || p.categoryId),
						categoryId: p.categoryId,
						categoryIds: p.categoryIds,
						price: typeof p.price === 'string' ? p.price : `$${p.price.toFixed(2)}`,
						img: p.image || "",
						description: p.description,
						displayTags: p.displayTags,
						quantity: p.quantity,
						inStock: p.inStock,
						images: p.images,
						variants: p.variants,
						colors: p.colors,
						sizes: p.sizes,
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
	tag?: string;
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
		// single tag support: frontend should pass tag via optional param (use updateCategory to set tag)
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

export async function updateCategory(
	categoryId: string,
	name: string,
	description: string,
	tag?: string,
	imageFile?: File,
	token?: string
): Promise<Category | null> {
	try {
		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);
		if (tag && tag.length > 0) {
			formData.append('tag', tag);
		}
		if (imageFile) {
			formData.append('image', imageFile);
		}

		const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

		const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
			method: 'PUT',
			headers,
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`Failed to update category: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error updating category:', error);
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
	categoryId: string | undefined,
	categoryIds: string[] | undefined,
	title: string,
	price: string,
	description: string,
	imageFile?: File,
	variants?: ProductVariant[],
	variantFiles?: File[][],
	displayTags?: string[],
	token?: string,
	quantity?: number,
	colors?: ProductColor[],
	sizes?: string[]
): Promise<Product | null> {
	try {
		console.log('uploadProduct - Token:', token ? `${token.substring(0, 20)}...` : 'No token');
		const formData = new FormData();
		formData.append('name', title); // Backend expects 'name'
		formData.append('price', price);
		formData.append('description', description);
		if (categoryId) formData.append('categoryId', categoryId);
		if (categoryIds && categoryIds.length > 0) formData.append('categoryIds', JSON.stringify(categoryIds));
		if (displayTags && displayTags.length > 0) {
			formData.append('displayTags', JSON.stringify(displayTags));
		}
		if (quantity !== undefined) formData.append('quantity', quantity.toString());
		if (colors && colors.length > 0) formData.append('colors', JSON.stringify(colors));
		if (sizes && sizes.length > 0) formData.append('sizes', JSON.stringify(sizes));
		// attach main product image(s)
		if (imageFile) {
			formData.append('images', imageFile);
		}

		// append variants JSON
		if (variants && variants.length > 0) {
			formData.append('variants', JSON.stringify(variants));
		}

		// append variant files per-variant: variantFiles is array where each item is File[] for that variant index
		if (variantFiles && variantFiles.length > 0) {
			variantFiles.forEach((files, idx) => {
				files.forEach(file => {
					formData.append(`variantImages[${idx}]`, file);
				});
			});
		}

		const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
		console.log('uploadProduct - Headers:', headers);

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
			quantity: data.quantity,
			images: data.images,
			colors: data.colors,
			sizes: data.sizes,
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
	variants?: ProductVariant[],
	variantFiles?: File[][],
	displayTags?: string[],
	token?: string,
	categoryId?: string,
	categoryIds?: string[],
	quantity?: number,
	colors?: ProductColor[],
	sizes?: string[],
): Promise<Product | null> {
	try {
		const formData = new FormData();
		formData.append('name', title);
		formData.append('price', price);
		formData.append('description', description);
		if (displayTags && displayTags.length > 0) {
			formData.append('displayTags', JSON.stringify(displayTags));
		}
		if (categoryId) formData.append('categoryId', categoryId);
		if (categoryIds && categoryIds.length > 0) formData.append('categoryIds', JSON.stringify(categoryIds));
		if (quantity !== undefined) formData.append('quantity', quantity.toString());
		if (colors && colors.length > 0) formData.append('colors', JSON.stringify(colors));
		if (sizes && sizes.length > 0) formData.append('sizes', JSON.stringify(sizes));
		if (imageFile) {
			formData.append('images', imageFile);
		}

		if (variants && variants.length > 0) {
			formData.append('variants', JSON.stringify(variants));
		}

		if (variantFiles && variantFiles.length > 0) {
			variantFiles.forEach((files, idx) => {
				files.forEach(file => formData.append(`variantImages[${idx}]`, file));
			});
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
			quantity: data.quantity,
			images: data.images,
			colors: data.colors,
			sizes: data.sizes,
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

		// Fetch categories to map ids to names
		const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
		const categoriesText = await categoriesResponse.text();
		const categories = categoriesText ? JSON.parse(categoriesText) as Category[] : [];
		const categoryMap = new Map(categories.map(c => [c.id, c.name]));

		// Map backend fields to frontend fields, prefer category name when available
		return Array.isArray(products) ? products.map((p: BackendProduct) => ({
			id: parseInt(p.id.split('-')[1]) || Math.random(), // Convert string id to number
			backendId: p.id, // Keep the original backend ID
			title: p.name,
			category: (p.categoryIds && p.categoryIds.length > 0)
				? (categoryMap.get(p.categoryIds[0]) || p.categoryIds[0])
				: (categoryMap.get(p.categoryId) || p.categoryId),
			categoryId: p.categoryId,
			categoryIds: p.categoryIds,
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
			category: (p.categoryIds && p.categoryIds.length > 0) ? (categoryMap.get(p.categoryIds[0]) || p.categoryIds[0]) : (categoryMap.get(p.categoryId) || p.categoryId),
			categoryId: p.categoryId,
			categoryIds: p.categoryIds,
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
		const [taggedProductsResponse, categoriesResponse] = await Promise.all([
			fetch(`${API_BASE_URL}/products/tag/${tag}`),
			fetch(`${API_BASE_URL}/categories`)
		]);
		
		if (!taggedProductsResponse.ok || !categoriesResponse.ok) {
			console.warn(`Failed to fetch products by tag or categories`);
			return [];
		}

		const productsText = await taggedProductsResponse.text();
		const categoriesText = await categoriesResponse.text();
		
		if (!productsText || !categoriesText) return [];

		const products = JSON.parse(productsText) as BackendProduct[];
		const categories = JSON.parse(categoriesText) as Category[];
		
		// Create a map of categoryId to category name
		const categoryMap = new Map(categories.map(c => [c.id, c.name]));
		
		// Map backend fields to frontend fields
		return Array.isArray(products) ? products.map((p: BackendProduct) => ({
			id: parseInt(p.id.split('-')[1]) || Math.random(),
			backendId: p.id,
			title: p.name,
			category: (p.categoryIds && p.categoryIds.length > 0) ? (categoryMap.get(p.categoryIds[0]) || p.categoryIds[0]) : (categoryMap.get(p.categoryId) || p.categoryId),
			categoryId: p.categoryId,
			categoryIds: p.categoryIds,
			price: typeof p.price === 'string' ? p.price : `$${p.price.toFixed(2)}`,
			img: p.image || "",
			description: p.description,
			displayTags: p.displayTags,
		})) : [];
	} catch (error) {
		console.error(`Error fetching products with tag ${tag}:`, error);
		return [];
	}
}

// Order types
export type OrderItem = {
	productId: string;
	quantity: number;
	price: number;
	name: string;
	category?: string;
	description?: string;
	image?: string;
};

export type BillingDetails = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
};

export type Order = {
	id: string;
	userId: string;
	items: OrderItem[];
	billingDetails: BillingDetails;
	subtotal: number;
	shipping: number;
	total: number;
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	createdAt: string;
};

// Get user orders
export async function getUserOrders(token?: string): Promise<Order[]> {
	try {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};
		
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		const response = await fetch(`${API_BASE_URL}/orders`, {
			method: 'GET',
			headers,
		});

		if (!response.ok) {
			console.error(`Error fetching orders: ${response.status}`);
			return [];
		}

		const orders = await response.json();
		return Array.isArray(orders) ? orders : [];
	} catch (error) {
		console.error("Error fetching orders:", error);
		return [];
	}
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string, token?: string): Promise<Order | null> {
	try {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};
		
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
			method: 'PUT',
			headers,
			body: JSON.stringify({ status }),
		});

		if (!response.ok) {
			let msg = `Error updating order: ${response.status}`;
			try {
				const body = await response.json();
				if (body && body.message) msg = body.message;
			} catch (_) {}
			throw new Error(msg);
		}

		const data = await response.json();
		return data.order || null;
	} catch (error) {
		console.error("Error updating order:", error);
		throw error;
	}
}

// Get all orders (admin only)
export async function getAllAdminOrders(token?: string): Promise<Order[]> {
	try {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};
		
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		const response = await fetch(`${API_BASE_URL}/orders/admin/all`, {
			method: 'GET',
			headers,
		});

		if (!response.ok) {
			console.error(`Error fetching all orders: ${response.status}`);
			return [];
		}

		const orders = await response.json();
		return Array.isArray(orders) ? orders : [];
	} catch (error) {
		console.error("Error fetching all orders:", error);
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
	getUserOrders,
	getAllAdminOrders,
	updateOrderStatus,
};

export type Product = {
	id: number;
	title: string;
	category: string;
	price: string; // e.g. "$49.00"
	img: string;
	badge?: string;
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

// Simulated async fetch for mock data. Returns promise resolved after 250ms.
export function getProducts(): Promise<Product[]> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(sampleProducts.slice()), 250);
	});
}

export default {
	getProducts,
};

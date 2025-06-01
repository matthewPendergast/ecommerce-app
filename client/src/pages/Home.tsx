import { useEffect, useState } from "react";

type Product = {
	id: number;
	name: string;
	description: string;
	price: number;
	stock: number;
};

export default function Home() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const apiURL = import.meta.env.VITE_API_URL;

	function handleAddToCart(productId: number) {
		const token = localStorage.getItem("token");
		if (!token) {
			alert("Please log in to add items to your cart.");
			return;
		}

		fetch(`${apiURL}/cart/add`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				product_id: productId,
				quantity: 1,
			}),
		})
			.then((res) => {
				if (!res.ok)
					throw new Error(
						`Failed to add to cart (status ${res.status})`,
					);
				return res.json();
			})
			.then(() => {
				alert("Item added to cart!");
			})
			.catch((err) => {
				console.error("Add to cart error:", err);
				alert("Could not add item to cart. Please try again.");
			});
	}

	useEffect(() => {
		fetch(`${apiURL}/products`)
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch products.");
				return res.json();
			})
			.then((data) => {
				setProducts(data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [apiURL]);

	if (loading) return <p className="mt-10 text-center">Loading...</p>;
	if (error) return <p className="mt-10 text-center text-red-500">{error}</p>;

	return (
		<div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3">
			{products.map((product) => (
				<div
					key={product.id}
					className="rounded-xl border p-4 shadow transition hover:shadow-md"
				>
					<h2 className="mb-2 text-lg font-semibold">
						{product.name}
					</h2>
					<p className="text-sm text-gray-700">
						{product.description}
					</p>
					<p className="mt-2 font-bold text-green-600">
						${product.price}
					</p>
					<button
						onClick={() => handleAddToCart(product.id)}
						className="mt-3 rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"
					>
						Add to Cart
					</button>
				</div>
			))}
		</div>
	);
}

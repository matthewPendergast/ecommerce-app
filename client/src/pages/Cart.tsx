import { useEffect, useState } from "react";

type CartItem = {
	id: number;
	user_id: number;
	product_id: number;
	quantity: number;
	created_at: string;
	product_name: string;
	product_price: number;
	product_stock: number;
};

export default function Cart() {
	const [items, setItems] = useState<CartItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const apiURL = import.meta.env.VITE_API_URL;

	function handleClearCart() {
		const token = localStorage.getItem("token");
		if (!token) {
			alert("You must be logged in.");
			return;
		}

		fetch(`${apiURL}/cart/clear`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				if (!res.ok) throw new Error("Failed to clear cart.");
				return res.json();
			})
			.then(() => {
				alert("Cart cleared.");
				setItems([]);
			})
			.catch((err) => {
				console.error("Clear cart error:", err);
				alert("An error occurred while clearing the cart.");
			});
	}

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			setError("You must be logged in to view your cart.");
			setLoading(false);
			return;
		}

		fetch(`${apiURL}/cart`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch cart.");
				return res.json();
			})
			.then((data) => {
				setItems(data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	const total = items.reduce(
		(sum, item) => sum + item.quantity * item.product_price,
		0,
	);

	if (loading) return <p className="p-4">Loading cart...</p>;
	if (error) return <p className="p-4 text-red-500">{error}</p>;

	return (
		<div className="p-4">
			<h1 className="mb-4 text-2xl font-bold">My Cart</h1>
			{items.length === 0 ? (
				<p>Your cart is empty.</p>
			) : (
				<div className="space-y-4">
					{items.map((item) => (
						<div
							key={item.id}
							className="flex items-center justify-between rounded-lg border p-4"
						>
							<div>
								<h2 className="font-semibold">
									{item.product_name}
								</h2>
								<p>
									$
									{item.product_price
										? Number(item.product_price).toFixed(2)
										: "N/A"}{" "}
									each
								</p>
								<p>Quantity: {item.quantity}</p>
							</div>
							<p className="font-bold">
								{item.product_price
									? `$${(item.quantity * Number(item.product_price)).toFixed(2)}`
									: "Error"}
							</p>
						</div>
					))}
					<hr />
					<div className="text-right text-lg font-semibold">
						Total: ${total.toFixed(2)}
					</div>
					{items.length > 0 && (
						<button
							onClick={handleClearCart}
							className="mb-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
						>
							Clear Cart
						</button>
					)}
				</div>
			)}
		</div>
	);
}

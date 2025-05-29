import { useState } from "react";

export default function Signup() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const apiURL = import.meta.env.VITE_API_URL;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);

		try {
			const res = await fetch(`${apiURL}/auth/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				const { error } = await res.json();
				throw new Error(error || "Signup failed.");
			}

			setSuccess(true);
			setFormData({ name: "", email: "", password: "" });
		} catch (err: any) {
			setError(err.message || "Error signing up.");
		}
	};

	return (
		<div className="mx-auto mt-10 max-w-md rounded-xl border p-6 shadow">
			<h1 className="mb-4 text-2xl font-bold">Create an Account</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					name="name"
					type="text"
					placeholder="Name"
					value={formData.name}
					onChange={handleChange}
					className="w-full rounded border p-2"
					required
				/>
				<input
					name="email"
					type="email"
					placeholder="Email"
					value={formData.email}
					onChange={handleChange}
					className="w-full rounded border p-2"
					required
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					value={formData.password}
					onChange={handleChange}
					className="w-full rounded border p-2"
					required
				/>
				<button
					type="submit"
					className="w-full rounded bg-black py-2 text-white transition hover:bg-gray-800"
				>
					Sign Up
				</button>
				{error && <p className="text-red-600">{error}</p>}
				{success && (
					<p className="text-green-600">Signup successful!</p>
				)}
			</form>
		</div>
	);
}

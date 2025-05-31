import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const apiURL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);

		try {
			const res = await fetch(`${apiURL}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Login failed");
			}

			localStorage.setItem("token", data.token);
			setSuccess(true);
			navigate("/");
		} catch (err: any) {
			setError(err.message || "Something went wrong");
		}
	};

	return (
		<div className="mx-auto mt-10 max-w-md rounded-xl border p-6 shadow">
			<h1 className="mb-4 text-2xl font-bold">Login</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
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
					Log In
				</button>
				{error && <p className="text-red-600">{error}</p>}
				{success && <p className="text-green-600">Login successful!</p>}
			</form>
		</div>
	);
}

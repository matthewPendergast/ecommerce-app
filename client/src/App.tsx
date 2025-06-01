import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";
import { isTokenExpired } from "./utils/auth";

export default function App() {
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token && isTokenExpired(token)) {
			localStorage.removeItem("token");
		}
	}, []);

	return (
		<Router>
			<div className="min-h-screen">
				<Navbar />
				<main>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/cart" element={<Cart />} />
						<Route path="/checkout" element={<Checkout />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

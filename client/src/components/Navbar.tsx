import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<nav className="flex h-[10vh] w-full items-center justify-around bg-white">
			<Link to="/signup" className="font-bold">
				Signup
			</Link>
			<Link to="/login" className="font-bold">
				Login
			</Link>
			<Link to="/" className="font-bold">
				Home
			</Link>
			<Link to="/cart" className="font-bold">
				My Cart
			</Link>
			<Link to="/checkout" className="font-bold">
				Checkout
			</Link>
		</nav>
	);
}

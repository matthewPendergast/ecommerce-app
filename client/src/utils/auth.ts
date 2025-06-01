import { jwtDecode } from "jwt-decode";

type JwtPayload = {
	exp: number;
	[key: string]: any;
};

export function isTokenExpired(token: string): boolean {
	try {
		const decoded = jwtDecode<JwtPayload>(token);
		const currentTime = Math.floor(Date.now() / 1000);
		return decoded.exp < currentTime;
	} catch {
		// Invalid/expired token
		return true;
	}
}

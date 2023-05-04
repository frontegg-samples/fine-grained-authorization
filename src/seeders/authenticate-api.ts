import axios from 'axios';

export class AuthenticateApi {
	public static async authenticate(
		creds: { clientId: string; secret: string },
		baseUrl: string = 'https://api.frontegg.com'
	): Promise<string> {
		const authResponse = await axios.post(`${baseUrl}/auth/vendor`, creds);
		return authResponse.data.token;
	}
}

export const googleYoloConfig = {
	supportedAuthMethods: ['https://accounts.google.com'],
	supportedIdTokenProviders: [
		{
			uri: 'https://accounts.google.com',
			clientId: process.env.GOOGLE_CLIENT_ID
		}
	]
}

export const googleAuthConfig = {
	client_id: process.env.GOOGLE_CLIENT_ID
}

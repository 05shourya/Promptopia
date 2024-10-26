import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from '@models/user';
import { connectToDB } from '@utils/database';  // Your DB connection logic

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		})
	],
	callbacks: {
		// Handle session callback
		async session({ session, token, user }) {
			const sessionUser = await User.findOne({
				email: session.user.email,
			});

			// Attach the user's ID to the session object
			session.user.id = sessionUser._id.toString();
			return session;
		},

		// Handle sign-in callback
		async signIn({ profile }) {
			try {
				await connectToDB();

				// Check if user exists
				const userExists = await User.findOne({
					email: profile.email,
				});

				// If user does not exist, create a new one
				if (!userExists) {
					await User.create({
						email: profile.email,
						username: profile.name.replace(" ", "").toLowerCase(),
						image: profile.picture,
					});
				}

				return true;  // Return true to allow sign-in
			} catch (error) {
				console.log('Error during sign-in:', error);
				return false;  // Return false to deny sign-in
			}
		},
	}
});

export { handler as GET, handler as POST };

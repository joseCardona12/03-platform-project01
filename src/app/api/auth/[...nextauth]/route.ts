import { ILoginRequest } from "@/app/core/application/dto/auth";
import { AuthService } from "@/app/infrastructure/services";
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


interface AuthUser {
    id: string;
    name: string;
    email: string;
    token: string;
    role: string;
    photo: string;
}

export interface CustomSession extends Session {
    user: {
        id?: string;
        token?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        photo: string;
        role: string;
    };
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Correo Electrónico", type: "text" },
                password: { label: "Contraseña", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.password || !credentials.username) {
                    console.error("Credenciales faltantes");
                    return null;
                }
                console.log("dadaddd", credentials);
                const loginRequest: ILoginRequest = {
                    password: credentials.password,
                    email: credentials.username
                };

                try {
                    const authService = new AuthService();
                    const response = await authService.login(loginRequest);

                    return {
                        email: loginRequest.email,
                        id: loginRequest.email,
                        name: loginRequest.email,
                        token: response.data.access_token,
                        role: response.data.user.role,
                        photo: response.data.user.photo
                    } as AuthUser;

                } catch (error) {
                    console.log(error);
                    return Promise.reject(new Error(JSON.stringify(error)));
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            const customSession = session as CustomSession;
            customSession.user.id = token.id as string;
            customSession.user.token = token.token as string;
            customSession.user.role = token.role as string;
            customSession.user.photo = token.photo as string; 
            customSession.user.name = token.name as string | null;
    
            return customSession;
        },
        async jwt({ token, user }) {
            if (user) {
                const authUser = user as AuthUser;
                token.id = authUser.id;
                token.token = authUser.token;
                token.role = authUser.role;
                token.photo = authUser.photo; 
                token.name = authUser.name;
            }
            return token;
        },
    }
    
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
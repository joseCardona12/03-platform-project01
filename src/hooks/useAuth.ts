import { useSession } from "next-auth/react";

export const useAuthService = () => {
    const { data: session, status } = useSession();

    const isAuthenticated = status === "authenticated";
    const user = session?.user;

    return {
        isAuthenticated,
        user: {
            id: user?.id, 
            name: user?.name, 
            email: user?.email,
            role: user?.role, 
            photo: user?.photo, 
            token: user?.token,
        },
    };
};
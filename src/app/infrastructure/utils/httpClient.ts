import { authOptions, CustomSession } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

const defaultBaseUrl = "https://communnityvolunteering-production.up.railway.app/api/v1";

export default class HttpClientUtils {
    private baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || defaultBaseUrl;
    }

    private async getHeaders(authRequired: boolean = true): Promise<Record<string, string>> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (authRequired) {
            try {
                const session = await getServerSession(authOptions) as CustomSession;
                if (session && session.user.token) {
                    headers["Authorization"] = `Bearer ${session.user.token}`;
                }
            } catch (error) {
                console.error("Failed to get session:", error);
            }
        }

        return headers;
    }

    private async handleResponse(response: Response) {
        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }
        return await response.json();
    }

    public async get<T>(url: string): Promise<T> {
        try {
            const response = await fetch(`${this.baseUrl}/${url}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching data from server:", error);
            throw error;
        }
    }

    public async delete<T>(url: string, authRequired: boolean = true): Promise<T> {
        const headers = await this.getHeaders(authRequired);
        const response = await fetch(`${this.baseUrl}/${url}`, {
            headers: headers,
            method: "DELETE",
        });
        return this.handleResponse(response);
    }

    public async post<T, B>(url: string, body: B, authRequired: boolean = true): Promise<T> {
        const headers = await this.getHeaders(authRequired);
    
        if (body instanceof FormData) {
            delete headers["Content-Type"];
        }
    
        const response = await fetch(`${this.baseUrl}/${url}`, {
            headers: headers,
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    
        return this.handleResponse(response);
    }
    
    
    public async put<T, B>(url: string, body: B, authRequired: boolean = true): Promise<T> {
        const headers = await this.getHeaders(authRequired);
        const response = await fetch(`${this.baseUrl}/${url}`, {
            headers: headers,
            method: "PUT",
            body: JSON.stringify(body),
        });
        return this.handleResponse(response);
    }
}

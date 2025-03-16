import Cookies from "universal-cookie";

const API_URL = import.meta.env.VITE_API_URL;

type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" | "PATCH" | "DELETE";
type HeadersType = Record<string, string>;
type RequestData = Record<string, any> | FormData | null;

export class ApiRouter {
    static request<T = any>(
        method: HttpMethod,
        path: string,
        data: RequestData = null,
        headers: HeadersType = {}
    ): Promise<T | null> {
        const cookies = new Cookies();
        const token = cookies.get("csrftoken");
        const isFormData = data instanceof FormData;

        const requestHeaders: HeadersType = {
            Accept: "application/json",
            "X-CSRFToken": token || "",
            ...headers,
        };

        const options: RequestInit = {
            method,
            headers: requestHeaders,
            credentials: "include",
        };

        if (isFormData) {
            options.body = data;
            delete requestHeaders["Content-Type"];
        } else if (method !== "GET" && method !== "HEAD" && data) {
            requestHeaders["Content-Type"] = "application/json";
            options.body = JSON.stringify(data);
        }

        const requestUrl = `${API_URL}${path}`;

        return new Promise((resolve, reject) => {
            fetch(requestUrl, options)
                .then((response) =>
                response.headers.get("Content-Type")?.includes("application/json")
                    ? response.json()
                    : null
                )
                .then(resolve)
                .catch(reject);
        });
    }

    static get<T = any>(path: string): Promise<T | null> {
        return this.request<T>("GET", path);
    }

    static post<T = any>(path: string, data: RequestData): Promise<T | null> {
        return this.request<T>("POST", path, data);
    }

    static put<T = any>(path: string, data: RequestData): Promise<T | null> {
        return this.request<T>("PUT", path, data);
    }

    static patch<T = any>(path: string, data: RequestData): Promise<T | null> {
        return this.request<T>("PATCH", path, data);
    }

    static delete<T = any>(path: string): Promise<T | null> {
        return this.request<T>("DELETE", path);
    }
}

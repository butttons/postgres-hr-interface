const API_ENDPOINT =
    process.env.NODE_ENV === 'production'
        ? '/api'
        : 'http://localhost:9876/api';
export const httpApi = async (
    endpoint: string,
    data: unknown,
    method = 'POST',
) => {
    const isPost = method === 'POST';
    const headers: Record<string, string> = isPost
        ? {
              'Content-Type': 'application/json',
          }
        : {};
    const body = isPost ? JSON.stringify(data) : null;
    return await fetch(`${API_ENDPOINT}${endpoint}`, {
        method,
        headers,
        body,
    }).then((res) => res.json());
};

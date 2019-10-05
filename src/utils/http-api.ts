const API_ENDPOINT = 'http://localhost:3000/api';
export const httpApi = async (endpoint: string, data: any, method = 'POST') => {
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

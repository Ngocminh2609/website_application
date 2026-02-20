/**
 * Tiện ích xử lý URL cho môi trường Production.
 * Đảm bảo giao thức (http/https) đồng bộ với trình duyệt.
 */
export const getBaseApiUrl = () => {
    let url = import.meta.env.VITE_API_URL;

    if (!url) {
        console.warn('CẢNH BÁO: VITE_API_URL không được định nghĩa, sử dụng fallback localhost');
        url = 'http://localhost:8080/api';
    }

    if (window.location.protocol === 'https:' && url.startsWith('http:')) {
        url = url.replace('http:', 'https:');
    }
    return url;
};

export const getWsUrl = () => {
    const apiUrl = getBaseApiUrl();
    let wsBaseUrl = apiUrl.replace(/\/api$/, '');

    // Xử lý trường hợp URL không có protocol (ví dụ: website-application.onrender.com/api)
    if (window.location.protocol === 'https:' && !wsBaseUrl.startsWith('http')) {
        if (wsBaseUrl.startsWith('//')) {
            wsBaseUrl = 'https:' + wsBaseUrl;
        } else {
            wsBaseUrl = 'https://' + wsBaseUrl;
        }
    }

    // Nếu URL đang là http nhưng trang web là https thì ép sang https
    if (window.location.protocol === 'https:' && wsBaseUrl.startsWith('http:')) {
        wsBaseUrl = wsBaseUrl.replace('http:', 'https:');
    }

    return `${wsBaseUrl}/ws-chat`;
};

// VITE_STORAGE_URL tro den MinIO khi local (http://localhost:9000) va Backblaze B2 khi production
// Tach biet khoi VITE_API_URL (Spring Boot) vi storage chay tren endpoint/port khac
export const getStorageUrl = (bucket: string, fileName: string) => {
    const storageBase = import.meta.env.VITE_STORAGE_URL || 'http://localhost:9000';
    return `${storageBase}/${bucket}/${fileName}`;
};

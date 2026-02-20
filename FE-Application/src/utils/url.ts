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

// FE goi BE /api/upload/{bucket}/{object}, BE tu redirect sang presigned URL cua B2/MinIO.
// Cach nay tranh FE phai biet bucket la private hay public, va khong lo het han chu ky.
export const getStorageUrl = (bucket: string, fileName: string) => {
    const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
    return `${apiBase}/upload/${bucket}/${fileName}`;
};

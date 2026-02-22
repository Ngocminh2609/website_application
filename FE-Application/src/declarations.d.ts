// Khai bao module cho cac dinh dang file anh de TypeScript khong bao loi khi import
declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.jpeg' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    const src: string;
    export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

// Khai báo cho vite-plugin-pwa
declare module 'virtual:pwa-register/react' {
    import { Dispatch, SetStateAction } from 'react'
    export interface RegisterSWOptions {
        immediate?: boolean
        onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
        onRegisterError?: (error: any) => void
        onNeedRefresh?: () => void
        onOfflineReady?: () => void
    }
    export function useRegisterSW(options?: RegisterSWOptions): {
        needRefresh: [boolean, Dispatch<SetStateAction<boolean>>]
        offlineReady: [boolean, Dispatch<SetStateAction<boolean>>]
        updateServiceWorker: (reloadPage?: boolean) => Promise<void>
    }
}

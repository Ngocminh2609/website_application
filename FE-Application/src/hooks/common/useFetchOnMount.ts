import {useCallback, useEffect, useRef, useState} from "react";
import {notification} from "../../utils/notification";
import {getErrorMessage} from "../../utils/error";

interface UseFetchOnMountOptions<T> {
    fetcher: () => Promise<T>;
    errorMessage: string;
    initialData: T;
    /** default true */
    enabled?: boolean;
}

export function useFetchOnMount<T>({
    fetcher,
    errorMessage,
    initialData,
    enabled = true,
}: UseFetchOnMountOptions<T>) {
    const [data, setData] = useState<T>(initialData);
    const [loading, setLoading] = useState(enabled);
    const fetcherRef = useRef(fetcher);
    const errorMessageRef = useRef(errorMessage);

    fetcherRef.current = fetcher;
    errorMessageRef.current = errorMessage;

    const refetch = useCallback(async () => {
        setLoading(true);
        try {
            const result = await fetcherRef.current();
            setData(result);
            return result;
        } catch (error: unknown) {
            notification.error(
                getErrorMessage(error, errorMessageRef.current),
            );
            return undefined;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (enabled) {
            void refetch();
        }
    }, [enabled, refetch]);

    return {data, setData, loading, setLoading, refetch};
}

export function useAsyncList<T>(
    fetchFn: () => Promise<T>,
    errorMessage: string,
    initialData: T,
    enabled = true,
) {
    return useFetchOnMount({
        fetcher: fetchFn,
        errorMessage,
        initialData,
        enabled,
    });
}

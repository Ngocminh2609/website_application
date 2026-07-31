import {useCallback, useState} from "react";
import {notification} from "../../utils/notification";
import {getErrorMessage} from "../../utils/error";

interface UseAsyncActionOptions {
    successMessage?: string;
    errorMessage: string;
    onSuccess?: () => void | Promise<void>;
}

export function useAsyncAction() {
    const [loading, setLoading] = useState(false);

    const run = useCallback(
        async <T,>(
            action: () => Promise<T>,
            options: UseAsyncActionOptions,
        ): Promise<T | undefined> => {
            setLoading(true);
            try {
                const result = await action();
                if (options.successMessage) {
                    notification.success(options.successMessage);
                }
                await options.onSuccess?.();
                return result;
            } catch (error: unknown) {
                notification.error(getErrorMessage(error, options.errorMessage));
                return undefined;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return {loading, setLoading, run};
}

import type {User} from "../types/auth";
import {ROLES} from "../components/common/Commons";

/**
 * Giải mã payload JWT (hỗ trợ UTF-8 tiếng Việt).
 */
export const decodeJwtPayload = (accessToken: string): Record<string, unknown> => {
    const base64Url = accessToken.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const utf8String = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
    );
    return JSON.parse(utf8String) as Record<string, unknown>;
};

/**
 * Map JWT Keycloak → User UI. Dùng claim `picture` làm avatar tạm
 * cho đến khi `/users/me` trả về avatarUrl từ DB.
 */
export const buildUserFromJwtPayload = (
    payload: Record<string, unknown>,
): User => {
    const realmAccess = payload.realm_access as
        | { roles?: string[] }
        | undefined;
    const isAdmin = realmAccess?.roles?.includes("ADMIN") || false;
    const username =
        (payload.preferred_username as string | undefined) ||
        (payload.sub as string);
    const picture = payload.picture as string | undefined;

    return {
        id: 1,
        username,
        email: (payload.email as string | undefined) || "",
        fullName:
            (payload.name as string | undefined) ||
            (payload.preferred_username as string | undefined) ||
            "User",
        role: isAdmin ? ROLES.ADMIN : ROLES.USER,
        ...(picture ? {avatarUrl: picture} : {}),
    };
};

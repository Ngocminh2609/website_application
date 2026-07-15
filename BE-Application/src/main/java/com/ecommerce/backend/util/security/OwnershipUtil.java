package com.ecommerce.backend.util.security;

import com.ecommerce.backend.exception.ForbiddenException;

/**
 * Tiện ích kiểm tra quyền sở hữu tài nguyên.
 */
public final class OwnershipUtil {

    private OwnershipUtil() {
    }

    public static void requireUsernameMatch(String ownerUsername, String actorUsername, String errorMessage) {
        if (ownerUsername == null || !ownerUsername.equals(actorUsername)) {
            throw new ForbiddenException(errorMessage);
        }
    }

    public static void requireOwnerOrAdmin(Long ownerId, Long actorId, String actorRole, String adminRole, String errorMessage) {
        boolean isOwner = ownerId != null && ownerId.equals(actorId);
        boolean isAdmin = adminRole != null && adminRole.equals(actorRole);
        if (!isOwner && !isAdmin) {
            throw new ForbiddenException(errorMessage);
        }
    }
}

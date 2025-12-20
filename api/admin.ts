// utils/api/admin.ts
// Admin-specific API calls

import type { SystemSettings } from "@/types/api";
import { ApiDedupKeys, ApiRoutes } from "./comman/api.enum";
import {
	authenticatedGet,
	authenticatedPatch,
	authenticatedPost,
	dedupedFetch,
} from "./comman/core";

/**
 * Get system settings
 */
export const callApi_getSystemSettings = async (): Promise<SystemSettings> => {
	return dedupedFetch(ApiDedupKeys.GET_SYSTEM_SETTINGS, async () => {
		return await authenticatedGet<SystemSettings>(
			ApiRoutes.ADMIN_SYSTEM_SETTINGS,
		);
	});
};

/**
 * Update system settings
 */
export const callApi_updateSystemSettings = async (
	settings: Partial<SystemSettings>,
): Promise<SystemSettings> => {
	return dedupedFetch(ApiDedupKeys.UPDATE_SYSTEM_SETTINGS, () =>
		authenticatedPatch<SystemSettings>(
			ApiRoutes.ADMIN_SYSTEM_SETTINGS,
			settings,
		),
	);
};

/**
 * Sync users from Clerk to local database
 */
export const callApi_syncUsersFromClerk = async (): Promise<{
	success: boolean;
	totalClerkUsers: number;
	syncedCount: number;
	skippedCount: number;
	excludedCount?: number;
}> => {
	return dedupedFetch(ApiDedupKeys.SYNC_USERS_FROM_CLERK, () =>
		authenticatedPost(ApiRoutes.ADMIN_SYNC_USERS, {}),
	);
};

/**
 * Check if user creation is allowed (based on user limits)
 */
export const callApi_checkUserLimit = async (): Promise<{
	canCreate: boolean;
	currentCount: number;
	maxCount: number;
}> => {
	return dedupedFetch(ApiDedupKeys.CHECK_USER_LIMIT, () =>
		authenticatedGet(ApiRoutes.ADMIN_USER_LIMIT),
	);
};

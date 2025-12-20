// api/comman/enum.ts
// Centralized deduplication keys for API calls

/**
 * Deduplication keys for API calls
 * These keys are used with dedupedFetch to prevent duplicate simultaneous requests
 */
export enum ApiDedupKeys {
	// Public API
	GET_TIMETABLE = "getTimetable",
	GET_PAPER_BY_ID = "getPaperById",

	// Admin API
	GET_SYSTEM_SETTINGS = "getSystemSettings",
	UPDATE_SYSTEM_SETTINGS = "updateSystemSettings",
	SYNC_USERS_FROM_CLERK = "syncUsersFromClerk",
	CHECK_USER_LIMIT = "checkUserLimit",

	// Student API
	GET_ACTIVE_PAPER = "getActivePaper",
	GET_ACTIVE_PAPER_FULL = "getActivePaperFull",

	// Teacher - Paper Management
	GET_CURRENT_CREATING_PAPER = "getCurrentCreatingPaper",
	GET_ALL_PAPERS = "getAllPapers",
	SEARCH_PAPERS = "searchPapers",
	FETCH_SAVED_QUESTIONS = "fetchSavedQuestions",

	GET_FULL_PAPER = "getFullPaper",

	// Teacher - User Management
	SEARCH_USERS = "searchUsers",

	// Teacher - Paper Groups
	GET_ALL_PAPER_GROUPS = "getAllPaperGroups",
	GET_AVAILABLE_PAPERS = "getAvailablePapers",
	GET_AVAILABLE_USERS = "getAvailableUsers",

	// Teacher - System Settings
	TEACHER_GET_SYSTEM_SETTINGS = "teacherGetSystemSettings",
}

/**
 * Helper functions for dynamic deduplication keys
 */
export const DedupKeyHelpers = {
	// Public
	getPaperById: (id: number) => `${ApiDedupKeys.GET_PAPER_BY_ID}-${id}`,

	// Teacher - Paper Management
	createPaper: (title: string) => `createPaper-${title}`,
	submitQuestion: (
		paperId: number,
		questionNumber: number,
		contentHash: string,
	) => `submitQuestion-${paperId}-${questionNumber}-${contentHash}`,
	finishPaper: (paperId: number) => `finishPaper-${paperId}`,
	deletePaper: (id: number) => `deletePaper-${id}`,
	setActivePaper: (id: number) => `setActivePaper-${id}`,
	setInactivePaper: (id: number) => `setInactivePaper-${id}`,
	getPapersPaginated: (page: number, pageSize: number) =>
		`papers-${page}-${pageSize}`,
	searchPapers: (query: string) => `searchPapers-${query}`,
	fetchSavedQuestions: (paperId: number) => `fetchSavedQuestions-${paperId}`,
	getFullPaper: (paperId: number) => `getFullPaper-${paperId}`,
	deleteQuestion: (questionId: number) => `deleteQuestion-${questionId}`,

	// Teacher - User Management
	getUsersPaginated: (page: number, pageSize: number) =>
		`users-${page}-${pageSize}`,
	createUser: (email: string) => `createUser-${email}`,
	deleteUser: (userId: string) => `deleteUser-${userId}`,
	updateUserBlocked: (userId: string, blocked: boolean) =>
		`updateUserBlocked-${userId}-${blocked}`,
	searchUsers: (query: string) => `searchUsers-${query}`,

	// Teacher - Paper Groups
	createPaperGroup: (name: string) => `createPaperGroup-${name}`,
	updatePaperGroup: (id: number) => `updatePaperGroup-${id}`,
	deletePaperGroup: (id: number) => `deletePaperGroup-${id}`,
	assignPapersToGroup: (groupId: number) => `assignPapersToGroup-${groupId}`,
	assignUsersToGroup: (groupId: number) => `assignUsersToGroup-${groupId}`,
	getAvailablePapers: (groupId: number) =>
		`${ApiDedupKeys.GET_AVAILABLE_PAPERS}-${groupId}`,
	getAvailableUsers: (groupId: number) =>
		`${ApiDedupKeys.GET_AVAILABLE_USERS}-${groupId}`,
	removeUserFromGroup: (groupId: number, userId: string) =>
		`removeUserFromGroup-${groupId}-${userId}`,
	blockUserInGroup: (groupId: number, userId: string) =>
		`blockUserInGroup-${groupId}-${userId}`,
	getPaperGroupsPaginated: (page: number, pageSize: number) =>
		`paperGroups-${page}-${pageSize}`,
	searchPaperGroups: (query: string) => `searchPaperGroups-${query}`,
	searchAvailablePapers: (groupId: number, query: string) =>
		`searchAvailablePapers-${groupId}-${query}`,
	searchAvailableUsers: (groupId: number, query: string) =>
		`searchAvailableUsers-${groupId}-${query}`,

	// Teacher - Exam Submissions
	deleteSubmission: (id: number) => `deleteSubmission-${id}`,
};

/**
 * API Route paths
 * Centralized definitions for all backend API routes
 */
export enum ApiRoutes {
	// Public
	PUBLIC_TIMETABLE = "/api/public/timetable",
	PUBLIC_PAPER = "/api/paper",

	// Admin
	ADMIN_SYSTEM_SETTINGS = "/api/admin/system-settings",
	ADMIN_SYNC_USERS = "/api/admin/sync-users",
	ADMIN_USER_LIMIT = "/api/admin/users/check-limit",

	// Student
	STUDENT_EXAM_STATUS = "/api/student/exam-status",
	STUDENT_RESULTS = "/api/student/results",
	STUDENT_ACTIVE_PAPER = "/api/student/activePaper",
	STUDENT_SUBMIT_EXAM = "/api/student/submit-exam",

	// Teacher - Paper
	TEACHER_PAPER_CREATE = "/api/teacher/paper/createPaper",
	TEACHER_PAPER_MANAGE = "/api/teacher/paper/managePapers",
	TEACHER_PAPER_CURRENT = "/api/teacher/paper/currentPaper",
	TEACHER_PAPER_QUESTIONS = "/api/teacher/paper/questions",
	TEACHER_PAPER_ADD_QUESTION = "/api/teacher/paper/addQuestion",
	TEACHER_PAPER_SEARCH = "/api/teacher/paper/search",

	// Teacher - Users
	TEACHER_USERS_ALL = "/api/teacher/users/getAll",
	TEACHER_USERS_CREATE = "/api/teacher/users/create",
	TEACHER_USERS_UPDATE = "/api/teacher/users/update",
	TEACHER_USERS_SEARCH = "/api/teacher/users/search",

	// Teacher - Paper Groups
	TEACHER_PAPER_GROUPS = "/api/teacher/paper-groups",

	// Teacher - System Settings
	TEACHER_SYSTEM_SETTINGS = "/api/teacher/system-settings",

	// Teacher - Exam Submissions
	TEACHER_EXAM_SUBMISSIONS = "/api/teacher/paper/exam-submissions",

	// AI
	AI_GENERATE_IMAGE = "/api/ai/generate-image",
	AI_TRANSCRIBE_AUDIO = "/api/ai/transcribe-audio",

	// Upload
	UPLOAD_IMAGE = "/api/upload/image",
}

/**
 * Helper functions for dynamic API routes
 */
export const ApiRouteHelpers = {
	// Teacher - Paper Management
	teacherPaperManage: (id: number) =>
		`${ApiRoutes.TEACHER_PAPER_MANAGE}/${id}`,
	teacherPaperSearch: (query: string) =>
		`${ApiRoutes.TEACHER_PAPER_SEARCH}?q=${encodeURIComponent(query)}`,
	teacherPapersPaginated: (page: number, pageSize: number) =>
		`${ApiRoutes.TEACHER_PAPER_MANAGE}?page=${page}&pageSize=${pageSize}`,
	teacherPaperQuestions: (paperId: number) =>
		`/api/teacher/paper/${paperId}/questions`,
	teacherPaperById: (paperId: number) => `/api/teacher/paper/${paperId}`,

	// Teacher - Users
	teacherUser: (userId: string) => `/api/teacher/users/${userId}`,
	teacherUsersPaginated: (page: number, pageSize: number) =>
		`${ApiRoutes.TEACHER_USERS_ALL}?page=${page}&pageSize=${pageSize}`,
	teacherUsersSearch: (query: string) =>
		`${ApiRoutes.TEACHER_USERS_SEARCH}?q=${encodeURIComponent(query)}`,

	// Teacher - Paper Groups
	teacherPaperGroup: (id: number) =>
		`${ApiRoutes.TEACHER_PAPER_GROUPS}/${id}`,
	teacherPaperGroupPapers: (groupId: number) =>
		`${ApiRoutes.TEACHER_PAPER_GROUPS}/${groupId}/papers`,
	teacherPaperGroupUsers: (groupId: number) =>
		`${ApiRoutes.TEACHER_PAPER_GROUPS}/${groupId}/users`,
	teacherPaperGroupUser: (groupId: number, userId: string) =>
		`${ApiRoutes.TEACHER_PAPER_GROUPS}/${groupId}/users/${userId}`,
	teacherPaperGroupUserBlock: (groupId: number, userId: string) =>
		`${ApiRoutes.TEACHER_PAPER_GROUPS}/${groupId}/users/${userId}/block`,
	teacherPaperGroupAvailablePapers: (groupId: number) =>
		`${ApiRoutes.TEACHER_PAPER_GROUPS}/${groupId}/available-papers`,
	teacherPaperGroupAvailableUsers: (groupId: number) =>
		`${ApiRoutes.TEACHER_PAPER_GROUPS}/${groupId}/available-users`,
	teacherPaperGroupsPaginated: (page: number, pageSize: number) =>
		`${ApiRoutes.TEACHER_PAPER_GROUPS}/paginated?page=${page}&pageSize=${pageSize}`,
	teacherPaperGroupsSearch: (query: string) =>
		`${ApiRoutes.TEACHER_PAPER_GROUPS}/search?q=${encodeURIComponent(query)}`,
	teacherPaperGroupAvailablePapersSearch: (groupId: number, query: string) =>
		`${ApiRoutes.TEACHER_PAPER_GROUPS}/${groupId}/available-papers/search?q=${encodeURIComponent(query)}`,
	teacherPaperGroupAvailableUsersSearch: (groupId: number, query: string) =>
		`${ApiRoutes.TEACHER_PAPER_GROUPS}/${groupId}/available-users/search?q=${encodeURIComponent(query)}`,

	// Teacher - Exam Submissions
	teacherExamSubmission: (id: number) =>
		`${ApiRoutes.TEACHER_EXAM_SUBMISSIONS}/${id}`,
};

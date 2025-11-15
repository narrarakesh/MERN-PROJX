export const BASE_URL = "https://mern-projx.onrender.com";

export const API_PATHS = {
    AUTH: {
        REGISTER: '/api/auth/register', // Register the user
        LOGIN: '/api/auth/login', // authenticate user and return jwt token
        GET_PROFILE: '/api/auth/profile'
    },

    USERS:{
        GET_ALL_USERS: "/api/users", //GET all users (Admin only)
        GET_USER_BY_ID: (userID) => `api/users/${userID}`, // GET user by id
        CREATE_USER: "/api/users", // Create a new user (Admin Only)
        UPDATE_USER: (userID) => `api/users/${userID}`, // update user details
        DELETE_USER: (userID) => `api/users/${userID}`, // delete user details
        GET_USERS_BY_ADMIN : "/api/users/admin", // Get users based on admins
    },

    REPORTS: {
        EXPORT_TASKS: '/api/reports/export/projects', // Export all projects and tasks as an excel
        EXPORT_USERS: '/api/reports/export/users', // Export all Users as an excel
    },

    PROJECTS: {
        GET_DASHBOARD_DATA: "/api/projects/dashboard-data", // Admin dashboard data
        GET_USER_DASHBOARD_DATA: "/api/projects/user-dashboard-data", // User-specific dashboard

        GET_ALL_PROJECTS: "/api/projects", // Get all projects (Admin: all, User: assigned)
        GET_PROJECT_BY_ID: (id) => `/api/projects/${id}`, // Get a specific project by ID

        CREATE_PROJECT: "/api/projects", // Create a new project (Admin only)
        UPDATE_PROJECT: (id) => `/api/projects/${id}`, // Update project details (Admin only)
        UPDATE_PROJECT_STATUS_PROGRESS: (id) => `/api/projects/${id}/status`, // Update project status

        DELETE_PROJECT: (id) => `/api/projects/${id}`, // Delete a project (Admin only)
    },

    TASKS: {
        GET_ALL_TASKS: '/api/tasks', // Get all tasks (admin: all , User: assigned)
        GET_TASK_BY_ID: (id) => `/api/tasks/${id}`, // GET task based on id
        UPDATE_TASK: (id) => `/api/tasks/${id}`, // GET task based on id
        DELETE_TASK: (id) => `/api/tasks/${id}`, // GET task based on id

        CREATE_TASK: '/api/tasks' // create task
    },

    IMAGE: {
        UPLOAD_IMAGE: "api/auth/upload-image"
    },
}
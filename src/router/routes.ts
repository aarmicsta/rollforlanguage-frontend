/**
 * Central route name/path registry.
 *
 * This file defines stable route identifiers used across the app.
 * Prefer importing these constants instead of hard-coding route strings
 * inside components, guards, stores, or services.
 */

export enum AppRouteNames {
  // Public routes
  Landing = 'Landing',
  Login = 'Login',
  Register = 'Register',
  ForgotPassword = 'ForgotPassword',

  // User dashboard routes
  StudentDashboard = 'StudentDashboard',
  TeacherDashboard = 'TeacherDashboard',

  // Admin routes
  Admin = 'Admin',
  AdminDashboard = 'AdminDashboard',
  AdminUsers = 'AdminUsers',
  AdminCampaigns = 'AdminCampaigns',
  AdminContent = 'AdminContent',
  AdminSystem = 'AdminSystem',
  AdminPlayables = 'AdminPlayables',
}

export enum AppRoutePaths {
  // Public paths
  Landing = '/',
  Login = '/login',
  Register = '/register',
  ForgotPassword = '/forgot-password',

  // User dashboard paths
  StudentDashboard = '/dashboard',
  TeacherDashboard = '/teacher-dashboard',

  // Admin paths
  Admin = '/admin',
  AdminDashboard = '/admin/dashboard',
  AdminUsers = '/admin/users',
  AdminCampaigns = '/admin/campaigns',
  AdminContent = '/admin/content',
  AdminSystem = '/admin/system',
  AdminPlayables = '/admin/playables',
}
import type { UserRole } from '@/types/auth';

export const isAdmin = (role?: UserRole) => role === 'admin';
export const isManagerOrAdmin = (role?: UserRole) => role === 'manager' || role === 'admin';
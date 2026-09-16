export const ROLES = {
  USER: "user",
  EMPLOYEE: "employee",
  BUSINESS: "business",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function isAdmin(role?: string | null) {
  return role === ROLES.ADMIN;
}

export function isEmployee(role?: string | null) {
  return role === ROLES.EMPLOYEE;
}

export function isBusiness(role?: string | null) {
  return role === ROLES.BUSINESS || isAdmin(role);
}

export function isUser(role?: string | null) {
  return role === ROLES.USER || isEmployee(role) || isBusiness(role) || isAdmin(role);
}

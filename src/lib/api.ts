const ADMIN_PHONES = ["09123456789"];

export function isAdminPhone(
  mobileNumber?: string | null,
  role?: string | null
): boolean {
  if (role === "admin") return true;
  if (mobileNumber && ADMIN_PHONES.includes(mobileNumber)) return true;
  return false;
}

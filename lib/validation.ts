const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export function normalizePhone(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

export function isValidPhone(value: string): boolean {
  const normalized = normalizePhone(value);
  return PHONE_REGEX.test(normalized);
}

export function isValidOtp(value: string, length = 6): boolean {
  if (!value) {
    return false;
  }

  const pattern = new RegExp(`^\\d{${length}}$`);
  return pattern.test(value);
}

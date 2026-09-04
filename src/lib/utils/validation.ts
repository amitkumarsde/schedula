// Validation rules shared by the client forms and the server, so both agree.

// A short check for "something@something.something" with no spaces.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Full name length rule, used at signup and in both profile checks.
const FULL_NAME_MIN = 3;
const FULL_NAME_MAX = 30;
export const FULL_NAME_MESSAGE = `Full name must be between ${FULL_NAME_MIN} and ${FULL_NAME_MAX} characters`;

export function isValidFullName(value: string): boolean {
  return value.length >= FULL_NAME_MIN && value.length <= FULL_NAME_MAX;
}

// Links and photo URLs must be https, so we never load an insecure resource.
export function isHttpsUrl(value: string): boolean {
  return value.startsWith("https://");
}

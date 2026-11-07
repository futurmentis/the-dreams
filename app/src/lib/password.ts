export const MIN_PASSWORD = 8;

/** Text for the first thing wrong with a new password, or null when it is fine. */
export function passwordProblem(password: string, repeat: string): string | null {
  if (password.length < MIN_PASSWORD) return `Heslo má mať aspoň ${MIN_PASSWORD} znakov.`;
  if (password !== repeat) return 'Heslá sa zatiaľ nezhodujú.';
  return null;
}

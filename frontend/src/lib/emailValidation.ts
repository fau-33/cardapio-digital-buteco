const STRICT_EMAIL_REGEX =
  /^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,24}$/;

const BLOCKED_EMAIL_DOMAINS = new Set([
  "teste.com",
  "teste.com.br",
  "test.com",
  "test.org",
  "test.net",
  "example.com",
  "example.org",
  "example.net",
  "admin.com",
  "buteco.com",
  "localhost",
  "tempmail.com",
  "temp-mail.org",
  "mailinator.com",
  "10minutemail.com",
  "yopmail.com",
  "guerrillamail.com",
  "sharklasers.com",
  "trashmail.com",
  "maildrop.cc",
  "fakeinbox.com",
  "dispostable.com",
  "getnada.com",
]);

export const INVALID_REAL_EMAIL_MESSAGE =
  "Por favor, utilize um endereço de e-mail real e válido (ex: Gmail, Outlook, iCloud ou corporativo).";

export function normalizeEmail(rawEmail: string): string {
  return rawEmail.trim().toLowerCase();
}

export function validateRealEmail(rawEmail: string): {
  valid: boolean;
  normalizedEmail: string;
  error?: string;
} {
  const normalizedEmail = normalizeEmail(rawEmail);

  if (!normalizedEmail || !STRICT_EMAIL_REGEX.test(normalizedEmail)) {
    return {
      valid: false,
      normalizedEmail,
      error: INVALID_REAL_EMAIL_MESSAGE,
    };
  }

  const parts = normalizedEmail.split("@");
  if (parts.length !== 2) {
    return {
      valid: false,
      normalizedEmail,
      error: INVALID_REAL_EMAIL_MESSAGE,
    };
  }

  const [localPart, domain] = parts;

  if (
    localPart.length < 2 ||
    BLOCKED_EMAIL_DOMAINS.has(domain) ||
    domain.endsWith(".test") ||
    domain.endsWith(".example") ||
    domain.endsWith(".invalid") ||
    domain.endsWith(".localhost")
  ) {
    return {
      valid: false,
      normalizedEmail,
      error: INVALID_REAL_EMAIL_MESSAGE,
    };
  }

  return {
    valid: true,
    normalizedEmail,
  };
}

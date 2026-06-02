function formatTimestamp(date: Date) {
  return date.toISOString();
}

const ANSI_COLORS = {
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  reset: '\x1b[0m',
  white: '\x1b[97m',
} as const;

export function logInfo(message: string) {
  console.log(
    `${ANSI_COLORS.cyan}[${formatTimestamp(new Date())}]${ANSI_COLORS.reset} ` +
      `${ANSI_COLORS.green}[INFO]${ANSI_COLORS.reset} ` +
      `${ANSI_COLORS.gray}[auto-swagger]${ANSI_COLORS.reset} ` +
      `${ANSI_COLORS.white}${message}${ANSI_COLORS.reset}\n`
  );
}

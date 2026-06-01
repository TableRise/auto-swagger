function formatTimestamp(date: Date) {
  return date.toISOString();
}

export function logInfo(message: string) {
  console.log(`[auto-swagger] [INFO] [${formatTimestamp(new Date())}] ${message}`);
}

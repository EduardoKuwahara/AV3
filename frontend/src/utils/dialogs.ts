export function showConfirm(message: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.confirm(message);
}

export function showPrompt(message: string, defaultValue = ''): string | null {
  if (typeof window === 'undefined') return null;
  return window.prompt(message, defaultValue);
}

const dialogs = {
  showConfirm,
  showPrompt,
};

export default dialogs;

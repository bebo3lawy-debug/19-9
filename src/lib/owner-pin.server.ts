export const OWNER_PIN = "علاوي";

export function verifyOwnerPin(pin: string) {
  return pin.trim() === OWNER_PIN;
}

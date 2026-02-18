import { completeRegistration } from "../actions";

export default async function RegisterCompletePage() {
  await completeRegistration();
  return null;
}

export type ActionSuccess<T = undefined> = { ok: true; data?: T };
export type ActionFailure<C extends string = string> = { ok: false; code: C; message: string };
export type ActionResult<T = undefined, C extends string = string> = ActionSuccess<T> | ActionFailure<C>;

export function ok<T = undefined>(data?: T): ActionSuccess<T> {
  if (typeof data === "undefined") return { ok: true };
  return { ok: true, data };
}

export function fail<C extends string>(code: C, message: string): ActionFailure<C> {
  return { ok: false, code, message };
}

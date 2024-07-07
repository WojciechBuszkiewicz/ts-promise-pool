export type PromisePoolResult<P> = Array<
  | { status: "solved"; data: P; index: number }
  | { status: "error"; index: number; data: any }
>;

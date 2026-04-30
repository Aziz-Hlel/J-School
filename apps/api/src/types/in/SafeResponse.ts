export type SafeResponse<T, E = unknown> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
    };

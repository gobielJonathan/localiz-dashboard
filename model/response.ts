export type Success<P> = { status: number; type: 'success'; payload: P };
export type Failed = {
  status: number;
  type: 'failed';
  error: string | string[] | any[] | Record<string, any>;
};

export type ApiResponse<S = any> = Success<S> | Failed;

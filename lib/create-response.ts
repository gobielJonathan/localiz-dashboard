import { ApiResponse } from '@/model/response';

export default function createResponse(arg: ApiResponse) {
  if (arg.type === 'success') {
    return Response.json(
      {
        status: arg.status,
        data: arg.payload,
        success: true,
      },
      { status: arg.status },
    );
  }
  return Response.json(
    {
      status: arg.status,
      error: arg.error,
      success: false,
    },
    { status: arg.status },
  );
}

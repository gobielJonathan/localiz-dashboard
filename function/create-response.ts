type Success = { status: number, type: "success", payload: any }
type Failed = { status: number, type: "failed", error: string | string[] | any[] | Record<string, any> }

type Arg = Success | Failed

export default function createResponse(arg: Arg) {
    if (arg.type === "success") {
        return Response.json({
            status: arg.status,
            data: arg.payload,
            success: true
        }, { status: arg.status })
    }
    return Response.json({
        status: arg.status,
        error: arg.error,
        success: false
    }, { status: arg.status })
}
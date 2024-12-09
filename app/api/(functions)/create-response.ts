type Success = {status : number, type : "success", payload :any }
type Failed = {status : number, type : "failed", error : string }

type Arg = Success| Failed

export default function createResponse(arg : Arg) {
    if(arg.type === "success") {
        return  {
            status : arg.status, 
            data : arg.payload
        }
    }
    return { 
        status: arg.status, 
        error: arg.error,
    }
}
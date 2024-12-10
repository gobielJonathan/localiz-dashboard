
export default function tryCatch<T extends () => any>(func: T): [Error | undefined, ReturnType<typeof func> | undefined] {
    try {
        const result = func()
        return [undefined, result]
    } catch (error) {
        const _error = error instanceof Error ? error : Error(String(error))
        return [_error, undefined]
    }
}

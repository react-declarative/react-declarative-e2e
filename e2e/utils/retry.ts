export const retry = <T extends any = any, P extends any[] = any[]>(run: (...args: P) => Promise<T>, count = 5) => {
    const wrappedFn = async (...args: P) => {
        let total = count;        
        const call = async (): Promise<T> => {
            try {
                return await run(...args);
            } catch (error) {
                if (--total === 0) {
                    throw error;
                }
                return await call();
            }
        };
        return await call();
    };
    return wrappedFn;
}

export default retry;

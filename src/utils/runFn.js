import loggers from "./loggers";

export default function runFn(fn) {
    return async () => {
        try {
            return await fn();
        } catch(e) {
            loggers.error('***** run function fail *****', e);
            throw e;
        }
    }
}
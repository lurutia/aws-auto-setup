import loggers from "./loggers";
import sleep from './sleep';

export default function runFn(fn) {
    return async (...args) => {
        try {
            await sleep(5000);
            return await fn(...args);
        } catch(e) {
            loggers.error('***** run function fail *****', e);
            throw e;
        }
    }
}
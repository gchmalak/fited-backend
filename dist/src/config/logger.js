const LOG_LEVELS = {
    ERROR: "ERROR",
    WARN: "WARN",
    INFO: "INFO",
    DEBUG: "DEBUG",
};
function log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, ...meta };
    if (process.env.NODE_ENV === "development") {
        console.log(JSON.stringify(logEntry, null, 2));
    }
    else {
        console.log(JSON.stringify(logEntry));
    }
}
export const logger = {
    error: (message, meta) => log(LOG_LEVELS.ERROR, message, meta),
    warn: (message, meta) => log(LOG_LEVELS.WARN, message, meta),
    info: (message, meta) => log(LOG_LEVELS.INFO, message, meta),
    debug: (message, meta) => log(LOG_LEVELS.DEBUG, message, meta),
};

const dotEnv = require("dotenv");

const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
dotEnv.config({ path: envFile });

module.exports = {
    APP_PORT: process.env.APP_PORT,
    DEFAULT_OFFSET: process.env.DEFAULT_OFFSET,
    DEFAULT_LIMIT: process.env.DEFAULT_LIMIT,
    DEFAULT_SORT_BY: process.env.DEFAULT_SORT_BY,
    DEFAULT_SORT_ORDER: process.env.DEFAULT_SORT_ORDER,
    DELIVERY_AGENT_SERVICE_BASE_URL: process.env.DELIVERY_AGENT_SERVICE_BASE_URL,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASS: process.env.POSTGRES_PASS,
};

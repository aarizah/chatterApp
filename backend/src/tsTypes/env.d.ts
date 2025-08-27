declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string;
    DB_NAME: string;
    JWT_SECRET: string;
    PORT?: string;
  }
}

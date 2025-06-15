declare class Config {
    DB_HOST: string;
    DB_PASSWORD: string;
    DB_USER: string;
    DB_NAME: string;
    DB_PORT: number;
    JWT_SIGING_KEY: string;
    JWT_EXPIRES: number;
    constructor(path?: string);
}
declare const cfg: Config;
export { cfg, Config };

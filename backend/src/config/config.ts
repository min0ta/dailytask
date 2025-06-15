import { readFileSync } from "fs"

class Config {
    DB_HOST = "localhost"
    DB_PASSWORD = "root"
    DB_USER = "postgres"
    DB_NAME = "dailytasks"
    DB_PORT = 5432
    JWT_SIGING_KEY = "ANDTSDONTMAKENOSENSE"
    JWT_EXPIRES = 30*24*60

    constructor(path?: string) {
        if (path == null) {
            return
        }
        const file = readFileSync(path).toString()
        const parsed = JSON.parse(file)
        Object.keys(parsed).forEach(v => {
            this[v] = parsed[v]
        })
    }
}

const cfg = new Config()

export {cfg, Config}
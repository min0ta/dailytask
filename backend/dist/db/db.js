"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const config_1 = require("../config/config");
const models_1 = require("./models");
class Database {
    pool;
    constructor(config) {
        this.pool = new pg_1.Pool({
            host: config.DB_HOST,
            password: config.DB_PASSWORD,
            user: config.DB_USER,
            database: config.DB_NAME,
            port: config.DB_PORT,
        });
    }
    async getUserByEmail(email) {
        const q = await this.pool.query(`SELECT id, email, pwd FROM users WHERE email = $1`, [email]);
        if (q.rowCount == 0)
            return models_1.nullUser;
        const row = q.rows[0];
        return {
            id: row['id'],
            password: row['pwd'],
            email: row['email'],
        };
    }
    async createUser(user) {
        const q = await this.pool.query(`INSERT INTO users(email, pwd) VALUES ($1, $2) RETURNING id`, [user.email, user.password]);
        return q.rows[0];
    }
    async getTasksByUserID(user) {
        const q = await this.pool.query(`SELECT tasks.id, tasks.caption, tasks.textvalue, tasks.importancy, tasks.periodic, tasks.expires, tasks.period_s, tasks.complete FROM users INNER JOIN tasks ON tasks.userid = users.id WHERE users.id = $1`, [user.id]);
        return q.rows;
    }
    async insertTask(task) {
        const q = await this.pool.query(`INSERT INTO tasks 
            (caption, textvalue, importancy, periodic, expires, period_s, complete, userid) VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`, [task.caption, task.textvalue, task.importancy, task.periodic, task.expires, task.period_s, task.complete, task.userid]);
        return q.rows[0].id;
    }
    async alterTask(newTask) {
        const q = await this.pool.query(`UPDATE tasks 
            SET 
                caption = $2, 
                textvalue = $3, 
                importancy = $4, 
                periodic = $5, 
                expires = $6, 
                period_s = $7, 
                complete = $8 
            WHERE id = $1 AND userid = $9 RETURNING id;
            `, [newTask.id, newTask.caption, newTask.textvalue, newTask.importancy, newTask.periodic, newTask.expires, newTask.period_s, newTask.complete, newTask.userid]);
        return q.rows[0];
    }
    async deleteTask(taskid, userid) {
        const q = await this.pool.query(`DELETE FROM tasks WHERE id = $1 AND userid = $2 RETURNING id`, [taskid, userid]);
        return q.rows[0];
    }
}
exports.db = new Database(config_1.cfg);
//# sourceMappingURL=db.js.map
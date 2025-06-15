import { Pool } from "pg";
import { Config } from "src/config/config";
import { Task, User } from "./models";
declare class Database {
    pool: Pool;
    constructor(config: Config);
    getUserByEmail(email: string): Promise<User | 0>;
    createUser(user: User): Promise<number>;
    getTasksByUserID(user: Pick<User, 'id'>): Promise<Task[]>;
    insertTask(task: Omit<Task, 'id'>): Promise<number>;
    alterTask(newTask: Task): Promise<any>;
    deleteTask(taskid: number, userid: number): Promise<any>;
}
export declare const db: Database;
export {};

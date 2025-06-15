declare const nullUser = 0;
type User = {
    id: number;
    email: string;
    password: string;
};
type Task = {
    id: number;
    caption: string;
    textvalue: string;
    importancy: number;
    periodic: boolean;
    expires: Date;
    period_s: number;
    complete: boolean;
    userid: number;
};
export { nullUser, User, Task };

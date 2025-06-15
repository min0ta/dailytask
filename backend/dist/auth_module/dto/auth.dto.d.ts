export declare class LoginRequest {
    email: string;
    password: string;
}
export declare class LoginResponse {
    error?: string;
    code: number;
}
export declare class RegisterRequest {
    email: string;
    password: string;
}
export declare class RegisterResponse {
    error?: string;
    code: number;
}
export declare const errors: {
    Unknown: string;
    InvalidData: string;
};

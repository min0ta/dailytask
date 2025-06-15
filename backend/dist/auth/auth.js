"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config_1 = require("../config/config");
const db_1 = require("../db/db");
const errors_1 = require("./errors");
const authCookieName = "auth-cookie";
class Authorization {
    createJWTCookie(res, id) {
        const signedString = jwt.sign({ id: `${id}` }, config_1.cfg.JWT_SIGING_KEY, {
            expiresIn: config_1.cfg.JWT_EXPIRES * 1000
        });
        res.cookie(authCookieName, signedString, {
            sameSite: 'strict',
            httpOnly: true,
            maxAge: config_1.cfg.JWT_EXPIRES * 1000,
            secure: true,
        });
    }
    AuthCheck(req) {
        const token = req.cookies[authCookieName];
        if (token == null) {
            return 0;
        }
        try {
            const id = jwt.verify(token, config_1.cfg.JWT_SIGING_KEY);
            return id.id;
        }
        catch (e) {
            return 0;
        }
    }
    async Login(queryUser, res) {
        const query = await db_1.db.getUserByEmail(queryUser.email);
        if (query == 0) {
            throw errors_1.authErrors.authFail;
        }
        const actualUser = query;
        if (!await bcrypt.compare(queryUser.password, actualUser.password)) {
            throw errors_1.authErrors.authFail;
        }
        this.createJWTCookie(res, actualUser.id);
    }
    async Register(user) {
        const alreadyRegistered = await db_1.db.getUserByEmail(user.email);
        if (alreadyRegistered !== 0) {
            throw errors_1.authErrors.alreadyExists;
        }
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
        const id = await db_1.db.createUser(user);
        user.id = id;
        return user;
    }
    async LogOut(res) {
        res.cookie(authCookieName, "", {
            sameSite: 'strict',
            httpOnly: true,
            maxAge: -1,
            secure: true
        });
    }
}
exports.auth = new Authorization();
//# sourceMappingURL=auth.js.map
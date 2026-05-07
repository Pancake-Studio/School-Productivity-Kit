"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
exports.__esModule = true;
exports.getTenantDb = exports.masterDb = void 0;
var client_1 = require("@prisma/client");
var pg_1 = require("pg");
var adapter_pg_1 = require("@prisma/adapter-pg");
// Helper to create a Prisma client with a dynamic connection string using Driver Adapters
function createPrismaClient(connectionString) {
    if (!connectionString) {
        throw new Error("Database connection string is missing");
    }
    var pool = new pg_1.Pool({ connectionString: connectionString });
    var adapter = new adapter_pg_1.PrismaPg(pool);
    return new client_1.PrismaClient({ adapter: adapter });
}
// Singleton pattern for Master Database (Next.js hot-reloading safe)
var globalForPrisma = globalThis;
exports.masterDb = (_a = globalForPrisma.masterPrisma) !== null && _a !== void 0 ? _a : createPrismaClient(process.env.MASTER_DATABASE_URL);
if (process.env.NODE_ENV !== "production")
    globalForPrisma.masterPrisma = exports.masterDb;
// Cache for tenant DB connections to avoid exceeding connection limits
var tenantDbCache = new Map();
/**
 * Resolves and returns the PrismaClient for a specific school (Tenant DB).
 * @param schoolId - UUID of the school from the master database
 */
function getTenantDb(schoolId) {
    return __awaiter(this, void 0, void 0, function () {
        var school, tenantDb;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Return cached client if it exists
                    if (tenantDbCache.has(schoolId)) {
                        return [2 /*return*/, tenantDbCache.get(schoolId)];
                    }
                    return [4 /*yield*/, exports.masterDb.school.findUnique({
                            where: { id: schoolId },
                            select: { dbConnectionString: true, status: true }
                        })];
                case 1:
                    school = _a.sent();
                    if (!school) {
                        throw new Error("ไม่พบข้อมูลโรงเรียนนี้ในระบบ");
                    }
                    if (school.status === "MAINTENANCE") {
                        throw new Error("โรงเรียนกำลังย้ายฐานข้อมูล กรุณารอสักครู่ (School is under maintenance/migration)");
                    }
                    if (school.status !== "ACTIVE") {
                        throw new Error("โรงเรียนนี้ถูกระงับการใช้งาน กรุณาติดต่อ Ferrum Group");
                    }
                    tenantDb = createPrismaClient(school.dbConnectionString);
                    // Cache the client for future requests in this lambda container
                    tenantDbCache.set(schoolId, tenantDb);
                    return [2 /*return*/, tenantDb];
            }
        });
    });
}
exports.getTenantDb = getTenantDb;

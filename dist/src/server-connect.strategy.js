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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConnect = void 0;
const connect_fastify_1 = require("@connectrpc/connect-fastify");
const microservices_1 = require("@nestjs/microservices");
const platform_fastify_1 = require("@nestjs/platform-fastify");
class ServerConnect extends microservices_1.Server {
    constructor(port = 3000, host = '0.0.0.0', fastifyOptions) {
        super();
        this.handlers = [];
        this.port = port;
        this.host = host;
        this.adapter = new platform_fastify_1.FastifyAdapter(fastifyOptions);
    }
    listen(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.adapter.register(connect_fastify_1.fastifyConnectPlugin, {
                    routes: this.buildRouter(),
                });
                yield this.adapter.getInstance().listen({
                    port: this.port,
                    host: this.host,
                });
            }
            catch (error) {
                callback(error);
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield ((_a = this.adapter) === null || _a === void 0 ? void 0 : _a.getInstance().close());
        });
    }
    addHandler(pattern, callback) {
        this.handlers.push(Object.assign(Object.assign({}, pattern), { unary: callback }));
        this.messageHandlers.set(pattern.service.typeName + '/' + pattern.method.name, callback);
    }
    buildRouter() {
        return (router) => {
            this.handlers.forEach((handler) => {
                router.rpc(handler.service, handler.method, handler.unary);
            });
            return router;
        };
    }
}
exports.ServerConnect = ServerConnect;

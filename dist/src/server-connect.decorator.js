"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectMethod = exports.ConnectService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const METHOD_DECORATOR_KEY = Symbol('METHOD_DECORATOR_KEY');
const TRANSPORT_CONNECT = Symbol('TRANSPORT_CONNECT');
const ConnectService = (service) => (0, common_1.applyDecorators)((0, common_1.Controller)(), (target) => {
    const processMethod = (method) => {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, method.signature);
        const metadata = { service, method: method.method };
        (0, microservices_1.MessagePattern)(metadata, TRANSPORT_CONNECT)(target.prototype, method.signature, descriptor);
    };
    const definedMethods = Reflect.getMetadata(METHOD_DECORATOR_KEY, target) || [];
    definedMethods.forEach((method) => processMethod(method));
});
exports.ConnectService = ConnectService;
const ConnectMethod = (method) => (target, signature) => {
    const metadata = {
        method,
        signature: signature.toString(),
    };
    const existingMethods = Reflect.getMetadata(METHOD_DECORATOR_KEY, target.constructor) ||
        new Set();
    if (!existingMethods.has(metadata)) {
        existingMethods.add(metadata);
    }
    Reflect.defineMetadata(METHOD_DECORATOR_KEY, existingMethods, target.constructor);
};
exports.ConnectMethod = ConnectMethod;

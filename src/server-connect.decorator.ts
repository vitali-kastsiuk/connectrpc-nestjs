import { MethodInfo, ServiceType } from '@bufbuild/protobuf';
import { applyDecorators, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

export interface PatternMetadata {
  service: ServiceType;
  method: MethodInfo;
}

const METHOD_DECORATOR_KEY = Symbol('METHOD_DECORATOR_KEY');
const TRANSPORT_CONNECT = Symbol('TRANSPORT_CONNECT');

interface MethodDescription {
  method: MethodInfo;
  signature: string;
}

interface ConstructorWithPrototype {
  prototype: Record<string, PropertyDescriptor>;
}

export const ConnectService = (service: ServiceType): ClassDecorator =>
  applyDecorators(Controller(), (target: ConstructorWithPrototype) => {
    const processMethod = (method: MethodDescription) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        target.prototype,
        method.signature,
      );

      const metadata: PatternMetadata = { service, method: method.method };

      MessagePattern(metadata, TRANSPORT_CONNECT)(
        target.prototype,
        method.signature,
        descriptor!,
      );
    };

    const definedMethods: MethodDescription[] =
      Reflect.getMetadata(METHOD_DECORATOR_KEY, target) || [];
    definedMethods.forEach((method) => processMethod(method));
  });

export const ConnectMethod =
  (method: MethodInfo): MethodDecorator =>
  (target: object, signature: string | symbol) => {
    const metadata: MethodDescription = {
      method,
      signature: signature.toString(),
    };

    const existingMethods =
      Reflect.getMetadata(METHOD_DECORATOR_KEY, target.constructor) ||
      new Set();

    if (!existingMethods.has(metadata)) {
      existingMethods.add(metadata);
    }

    Reflect.defineMetadata(
      METHOD_DECORATOR_KEY,
      existingMethods,
      target.constructor,
    );
  };

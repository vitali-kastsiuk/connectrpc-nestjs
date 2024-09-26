import { MethodInfo, ServiceType } from '@bufbuild/protobuf';
export interface PatternMetadata {
    service: ServiceType;
    method: MethodInfo;
}
export declare const ConnectService: (service: ServiceType) => ClassDecorator;
export declare const ConnectMethod: (method: MethodInfo) => MethodDecorator;

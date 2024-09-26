import { CustomTransportStrategy, MessageHandler, Server } from '@nestjs/microservices';
import { PatternMetadata } from './server-connect.decorator';
export declare class ServerConnect extends Server implements CustomTransportStrategy {
    private handlers;
    private port;
    private host;
    private adapter;
    constructor(port?: number, host?: string);
    listen(callback: (error?: unknown, ...optionalParams: unknown[]) => void): Promise<void>;
    close(): Promise<void>;
    addHandler(pattern: PatternMetadata, callback: MessageHandler): void;
    private buildRouter;
}

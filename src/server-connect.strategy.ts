import { fastifyConnectPlugin } from '@connectrpc/connect-fastify';
import {
  CustomTransportStrategy,
  MessageHandler,
  Server,
} from '@nestjs/microservices';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ConnectRouter } from '@connectrpc/connect';
import { AnyMessage, MethodInfo, ServiceType } from '@bufbuild/protobuf';
import { PatternMetadata } from './server-connect.decorator';
import { UnaryImpl } from '@connectrpc/connect/dist/cjs/implementation';

// todo: resolve issue with reflection server

type RouteHandler = {
  service: ServiceType;
  method: MethodInfo;
  unary: UnaryImpl<AnyMessage, AnyMessage>;
};

export class ServerConnect extends Server implements CustomTransportStrategy {
  private handlers: RouteHandler[] = [];

  private port: number;
  private host: string;

  private adapter: FastifyAdapter;

  constructor(port: number = 3000, host: string = '0.0.0.0') {
    super();
    this.port = port;
    this.host = host;
    this.adapter = new FastifyAdapter();
  }

  public async listen(
    callback: (error?: unknown, ...optionalParams: unknown[]) => void,
  ): Promise<void> {
    try {
      this.adapter.register(fastifyConnectPlugin as any, {
        routes: this.buildRouter(),
      });

      await this.adapter.getInstance().listen({
        port: this.port,
        host: this.host,
      });
    } catch (error) {
      callback(error);
    }
  }

  public async close(): Promise<void> {
    await this.adapter?.getInstance().close();
  }

  public override addHandler(
    pattern: PatternMetadata,
    callback: MessageHandler,
  ) {
    this.handlers.push({ ...pattern, unary: callback });
    this.messageHandlers.set(
      pattern.service.typeName + '/' + pattern.method.name,
      callback,
    );
  }

  private buildRouter() {
    return (router: ConnectRouter) => {
      this.handlers.forEach((handler: RouteHandler) => {
        router.rpc(handler.service, handler.method, handler.unary);
      });

      return router;
    };
  }
}

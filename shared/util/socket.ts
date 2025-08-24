import { Socket as ServerSocket } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";
import { ClientEventPayloads, ServerEventPayloads } from "@vtt/shared/types";

export class VttServerSocket {
  public internal: ServerSocket;

  constructor(socket: ServerSocket) {
    this.internal = socket;
  }

  on<E extends keyof ClientEventPayloads>(
    event: E,
    handler: ClientEventPayloads[E] extends void
      ? () => void
      : (payload: ClientEventPayloads[E]) => void
  ) {
    this.internal.on(event, handler as any);
  }

  emit<E extends keyof ServerEventPayloads>(
    event: E,
    payload: ServerEventPayloads[E]
  ) {
    this.internal.emit(event, payload);
  }
}

export class VttClientSocket {
  public internal: typeof ClientSocket;

  constructor(socket: typeof ClientSocket) {
    this.internal = socket;
  }

  on<E extends keyof ServerEventPayloads>(
    event: E,
    handler: ServerEventPayloads[E] extends void
      ? () => void
      : (payload: ServerEventPayloads[E]) => void
  ) {
    this.internal.on(event, handler as any);
  }

  emit<E extends keyof ClientEventPayloads>(
    event: E,
    payload: ClientEventPayloads[E]
  ) {
    this.internal.emit(event, payload);
  }

  off<E extends keyof ServerEventPayloads>(event: E) {
    this.internal.off(event);
  }
}

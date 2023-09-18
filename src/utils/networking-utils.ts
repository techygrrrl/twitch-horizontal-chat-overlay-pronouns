import { AbstractrrrEvent, IRCData, IRCEventClearChatData } from "./twitch-chat-utils.ts";
import { debugModeFromURL } from "./url-utils.ts";


export const connectToChat = ({
  port,
  token,
  host,
  onChat,
  onError,
  onClose,
  onClearChat,
}: {
  port: string;
  token: string;
  host: string;
  onClearChat: (irc_data: IRCEventClearChatData) => void,
  onChat: (irc_data: IRCData) => void;
  onError: (event: Event) => void;
  onClose: (event: CloseEvent) => void;
}) => {
  const debug = debugModeFromURL()

  if (debug) {
    console.log(
      `Connecting to web sockets at URL ws://${host}:${port}/v1/subscribe with token: ${token}`
    );
  }

  // Create WebSocket connection.
  const socket = new WebSocket(`ws://${host}:${port}/v1/subscribe`);

  socket.addEventListener("close", (event) => {
    onClose(event);
  });

  socket.addEventListener("error", (event) => {
    onError(event);
  });

  socket.addEventListener("message", (event) => {
    if (debug) {
      console.log("event type: message", event);
    }

    const parsedData = JSON.parse(event.data) as AbstractrrrEvent;

    switch (parsedData.event_type) {
      case "auth":
        break;

      case "irc":
        switch (parsedData.event_data.irc_type) {
          case "PrivateMessage":
            onChat(parsedData.event_data.irc_data)
            break;
          case "PingMessage":
            break;
          case "ClearChatMessage":
            onClearChat(parsedData.event_data.irc_data)
            break;
          case "PongMessage":
            break;
        }
        break;
    }

    if (debug) {
      console.log(">> data → parsed", parsedData);

      const formattedData = JSON.stringify(parsedData, null, 2);
      console.log(">> data → JSON", formattedData);
    }
  });

  socket.addEventListener("open", (_event) => {
    // Send the auth token
    if (debug) {
      console.log("Sending token payload:", { token });
    }

    socket.send(JSON.stringify({ token }));
  });
};


export type AbstractrrrHealthResponse = {
  data: {
    date: string;
    service: string;
  }
  meta: {
    request_id: string;
  }
}

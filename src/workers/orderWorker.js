// orderWorker.js
importScripts("https://cdn.socket.io/4.7.2/socket.io.min.js");

let socket;

onmessage = function (e) {
  if (e.data.type === "connect") {
    const { staffID, serverUrl } = e.data;
    socket = io(serverUrl, { query: { staffID } });

    socket.on("connect", () => {
      postMessage({ type: "connected" });
    });

    socket.on("disconnect", () => {
      postMessage({ type: "disconnected" });
    });

    socket.on("new-order", (data) => {
      // push event back to React
      postMessage({ type: "new-order", payload: data });
    });
  }

  if (e.data.type === "disconnect" && socket) {
    socket.disconnect();
  }
};

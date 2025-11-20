import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8080';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect_error", (err) => {
  console.error("❌ Erro de conexão no Socket (Cliente):", err.message);
});
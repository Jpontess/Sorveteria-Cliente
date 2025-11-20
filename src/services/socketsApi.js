import io from 'socket.io-client';

const SOCKET_URL = 'https://sorveteria-backend-h7bw.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect_error", (err) => {
  console.error("❌ Erro de conexão no Socket (Cliente):", err.message);
});
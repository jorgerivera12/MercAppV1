module.exports = function initChat(io) {
  const socketToNombre   = new Map(); // socketId  → nombre
  const nombreToSockets  = new Map(); // nombre    → Set<socketId>
  const historialPrivado = new Map(); // "A|B"     → [mensajes]

  // Ordenar los nombres garantiza la misma clave sin importar quién inicia la conversación
  function convKey(a, b) { return [a, b].sort().join('|'); }
  function uniqueUsuarios() { return Array.from(nombreToSockets.keys()); }

  function emitToUser(nombre, event, data) {
    const sockets = nombreToSockets.get(nombre);
    if (sockets) sockets.forEach(sid => io.to(sid).emit(event, data));
  }

  io.on('connection', (socket) => {
    const nombre = socket.request.session?.usuarioNombre;
    if (!nombre) return socket.disconnect();

    socketToNombre.set(socket.id, nombre);
    if (!nombreToSockets.has(nombre)) nombreToSockets.set(nombre, new Set());
    nombreToSockets.get(nombre).add(socket.id);

    io.emit('chat:usuarios', uniqueUsuarios());

    socket.on('chat:cargar', (otroUsuario) => {
      const key  = convKey(nombre, otroUsuario);
      const hist = historialPrivado.get(key) || [];
      socket.emit('chat:historial', { con: otroUsuario, mensajes: hist });
    });

    socket.on('chat:privado', ({ para, texto }) => {
      if (!texto || typeof texto !== 'string' || !para) return;

      const key = convKey(nombre, para);
      if (!historialPrivado.has(key)) historialPrivado.set(key, []);
      const hist = historialPrivado.get(key);

      const msg = {
        de:   nombre,
        para,
        texto: texto.trim().substring(0, 500),
        hora:  new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
      };

      hist.push(msg);
      // Limitar a 100 mensajes por conversación para evitar crecimiento ilimitado en memoria
      if (hist.length > 100) hist.shift();

      socket.emit('chat:mensaje:privado', msg);
      emitToUser(para, 'chat:mensaje:privado', msg);
    });

    socket.on('disconnect', () => {
      socketToNombre.delete(socket.id);
      const sockets = nombreToSockets.get(nombre);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) nombreToSockets.delete(nombre);
      }
      io.emit('chat:usuarios', uniqueUsuarios());
    });
  });
};

const dotenv = require("dotenv");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const shortId = require("shortid");
const roomHandler = require("./roomHandler");  // Asegúrate de importar roomHandler

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

const rooms = [];

io.on("connection", (socket) => {
  console.log("connected", socket.id);
  roomHandler(io, socket, rooms);

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

// Endpoint para crear una nueva sala
// Endpoint para crear una nueva sala
app.use(express.json());  // Middleware para procesar el cuerpo JSON
app.post('/create-room', (req, res) => {
  const { challenger, opponent, stake, type } = req.body;  // Recibir estos datos en el cuerpo de la petición
  const uuid = shortId.generate();  // Generar un UUID para la sala
  const roomLink = `https://bet-pv-p-test.vercel.app/room/${roomId}`; // Generar el enlace de la sala

  // Llamar a la función 'create' de roomHandler para crear la sala
  roomHandler.create({
    roomId: uuid,  // Cambiado a 'roomId'
    players: {
      challenger: {
        option: null,
        optionLock: false,
        score: 0,
      },
      opponent: {
        option: null,
        optionLock: false,
        score: 0,
      },
    },
    vacant: false,  // Cambiado a 'false'
    private: type === 'private',  // Determinar si la sala es privada
    type: type,  // Cambiado a 'type'
  }, (err, roomId) => {
    if (err) {
      res.status(500).send({ error: 'No se pudo crear la sala' });
      return;
    }
    res.status(200).send({ roomId, roomLink });  // Envía el enlace de la sala como parte de la respuesta
  });
});


const port = process.env.PORT || 8080;
httpServer.listen(port, () => console.log(`Listening on port ${port}`));

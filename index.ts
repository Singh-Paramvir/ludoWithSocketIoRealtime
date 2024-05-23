const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 4000;

// Serve static files (e.g., your HTML, CSS, and client-side JS)
app.use(express.static(__dirname + '/public'));

const rooms = new Map(); // To store active rooms
const xy = 2; // Number of players per room
const turnTimeLimit = 30 * 1000; // 30 seconds in milliseconds

// Track game state
const gameState = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('playGame', (playerName) => {
    console.log(playerName, "playername");

    let roomName;
    for (const [name, players] of rooms) {
      if (players.length < xy) {
        roomName = name;
        break;
      }
    }
    if (!roomName) {
      roomName = `Room_${Date.now()}`;
      rooms.set(roomName, []);
      gameState.set(roomName, {
        players: [],
        currentPlayerIndex: 0,
        positions: {},
        timers: {},
        missedTurns: {},
      });
      console.log(`${roomName} created`);
    }

    socket.join(roomName);
    const player = { id: socket.id, name: playerName };
    rooms.get(roomName).push(player);
    gameState.get(roomName).players.push(player);
    gameState.get(roomName).positions[player.id] = 0;
    gameState.get(roomName).missedTurns[player.id] = 0;

    socket.emit('message', `Welcome to Room ${roomName}, ${playerName}! Waiting for other players...`);

    if (rooms.get(roomName).length === xy) {
      console.log(`Game starting in ${roomName}`);
      io.to(roomName).emit('gameStart', 'The game is starting!');
      startPlayerTurn(roomName);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const [roomName, players] of rooms) {
      const index = players.findIndex(player => player.id === socket.id);
      if (index !== -1) {
        players.splice(index, 1);
        rooms.delete(roomName);
        gameState.delete(roomName);
        console.log("Deleted room:", roomName);
        break;
      }
    }
  });

  socket.on("diceRolled", (playerName) => {
    handlePlayerAction(socket, 'roll', playerName);
  });

  socket.on("movePiece", (playerName) => {
    handlePlayerAction(socket, 'move', playerName);
  });

  function handlePlayerAction(socket, action, playerName) {
    const rolledValue = Math.floor(Math.random() * 6) + 1;
    let roomName;

    for (const [name, players] of rooms) {
      if (players.find(player => player.id === socket.id)) {
        roomName = name;
        break;
      }
    }

    if (roomName) {
      const state = gameState.get(roomName);
      const currentPlayer = state.players[state.currentPlayerIndex];

      if (currentPlayer.id === socket.id) {
        clearTimeout(state.timers[socket.id]); // Clear the timer

        if (action === 'roll') {
          state.positions[socket.id] += rolledValue;
          const newPosition = state.positions[socket.id];
          io.to(roomName).emit("updateDice", { playerName, rolledValue });
          io.to(roomName).emit("updatePosition", { playerName, newPosition });

          if (newPosition >= 100) {
            io.to(roomName).emit("gameOver", `${playerName} wins!`);
            rooms.delete(roomName);
            gameState.delete(roomName);
            return;
          }
        } else if (action === 'move') {
          io.to(roomName).emit("playerMoved", { playerName, position: state.positions[socket.id] });
          passTurnToNextPlayer(roomName);
          return;
        }

        startPlayerTurn(roomName);
      }
    }
  }

  function startPlayerTurn(roomName) {
    const state = gameState.get(roomName);
    const currentPlayer = state.players[state.currentPlayerIndex];

    io.to(currentPlayer.id).emit('yourTurn');
    state.timers[currentPlayer.id] = setTimeout(() => {
      state.missedTurns[currentPlayer.id] += 1;
      if (state.missedTurns[currentPlayer.id] >= 3) {
        io.to(currentPlayer.id).emit('gameOver', 'You missed your turn 3 times. You lose.');
        const opponent = state.players.find(player => player.id !== currentPlayer.id);
        io.to(opponent.id).emit('gameOver', 'Your opponent missed their turn 3 times. You win.');
        rooms.delete(roomName);
        gameState.delete(roomName);
      } else {
        passTurnToNextPlayer(roomName);
      }
    }, turnTimeLimit);
  }

  function passTurnToNextPlayer(roomName) {
    const state = gameState.get(roomName);
    state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    startPlayerTurn(roomName);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

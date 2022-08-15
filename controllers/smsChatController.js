const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
var router = express.Router();
var userChatModel = require('../models/userChatModel');
const { addUser, removeUser, getUsersInRoom } = require("../models/userChatModel");
const { addMessage, getMessagesInRoom } = require("../models/messageChatModel");

const appChat = express();
appChat.use(cors());
var userModel = require("../models/userModel");
const server = http.createServer(appChat);
const io = socketIo(server, {
  cors: {
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = 4000;
const USER_JOIN_CHAT_EVENT = "USER_JOIN_CHAT_EVENT";
const USER_LEAVE_CHAT_EVENT = "USER_LEAVE_CHAT_EVENT";
const NEW_CHAT_MESSAGE_EVENT = "NEW_CHAT_MESSAGE_EVENT";
const START_TYPING_MESSAGE_EVENT = "START_TYPING_MESSAGE_EVENT";
const STOP_TYPING_MESSAGE_EVENT = "STOP_TYPING_MESSAGE_EVENT";

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  // Join a conversation
  const { roomId } = socket.handshake.query
  socket.join(roomId);

  const user = addUser(socket.id, roomId);
  io.in(roomId).emit(USER_JOIN_CHAT_EVENT, user);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    const message = addMessage(roomId, data);
//////////////insert into chatMessage table/////
console.log("datas:"+roomId)
let ts = Date.now();
let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let hour=date_ob.getHours();
let fullDate = year + "-" + month + "-" + date + "-" + hour;
// var message="aa"
let filOne=roomId.split(" ");
var sellerID=filOne[1];
var userID=filOne[0];
  ////////insert to uniqu table/////
  var name="sdsd"
  userChatModel.checkRoomExists(roomId, (result) => {
    if(result.length==0)
    {
      userChatModel.createRooms(roomId, name,fullDate,data.body,userID,sellerID, (result) => {
      });
      
      
    }
  else{
    // res.status(200).json({ rommID: 'chating Room ID already exists' });
    console.log("RoomID Exists"+result.length);
  }
});
  //////////end ////////////////////
  userChatModel.createChat(roomId, name,fullDate,data.body,userID,sellerID, (result) => {
  });

// });
///////////////end insert//////////////////////
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, message);
  });

  // Listen typing events
  socket.on(START_TYPING_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(START_TYPING_MESSAGE_EVENT, data);
  });
  socket.on(STOP_TYPING_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(STOP_TYPING_MESSAGE_EVENT, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.in(roomId).emit(USER_LEAVE_CHAT_EVENT, user);
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
module.exports = server;
router.get("/rooms/:roomId/users", (req, res) => {
  const users = getUsersInRoom(req.params.roomId);
  return res.json({ users });
});  

router.get("/rooms/:roomId/messages", (req, res) => {
  const messages = getMessagesInRoom(req.params.roomId);
  return res.json({ messages });
});
router.get('/getSingleSmsMessage/:userID', (req, res) => {
  var userIDs = req.params.userID;
  userChatModel.getSingleSmsMessage(userIDs, (result) => {
      if (!result) {
          console.log("not existed data")
      } else {
        res.status(200).json({ messages: result });
      }
  });
});
router.get('/getMessageByRoomId/:roomID', (req, res) => {
  var userIDs = req.params.roomID;
  userChatModel.getMessageByRoomId(userIDs, (result) => {
      if (!result) {
          console.log("not existed data")
      } else {
        res.status(200).json({ messages: result });
      }
  });
});
module.exports = router;
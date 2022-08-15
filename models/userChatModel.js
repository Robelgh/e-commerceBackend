const users = [];
var db = require("../models/config");
const addUser = (id, room) => {
  const existingUser = users.find(
    (user) => user.room === room
  );

  if (!room) return { error: "Username and room are required." };
  if (existingUser) return { error: "Username is taken." };

  const user = { id, room };

  users.push(user);

  return { id};
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);
/////////////split data from userid ad roomid
// let filTwo=roomId.split(",");
// var roomIDs=filOne[0];
// var userID=filOne[1];
// roomIDs, name,fullDate,data.body,userID,
var name="ss"
var createChat = (roomIDs, name,date,message,userID,sellerID, callback) => {
  var sql = "INSERT INTO  chatMessages VALUES(null, ?, ?, ?,?,?,?)";
  db.executeQuery(
    sql,
    [ 
      roomIDs,
      name,
      date,
      message,
      userID,
      sellerID
    ],
    function (result) {
      callback(result);
    }
  );
};
var checkRoomExists = (roomId, callback) => {
  var sql = "SELECT * FROM uniqueroomid WHERE roomId=?";
  db.executeQuery(sql, [roomId], function (result) {
    callback(result);
  });
};
var createRooms = (roomIDs, name,date,message,userID,sellerID, callback) => {
  var sql = "INSERT INTO  uniqueroomid VALUES(null, ?, ?, ?,?,?,?)";
  db.executeQuery(
    sql,
    [ 
      roomIDs,
      name,
      date,
      message,
      userID,
      sellerID
    ],
    function (result) {
      callback(result);
    }
  );
};
var getSingleSmsMessage = (userIDs, callback) => {
  var sql =
  "SELECT users.firstName,users.lastName,chatmessages.roomId,chatmessages.date,chatmessages.message,chatmessages.sender,chatmessages.userID,chatmessages.sellerID, chatmessages.id FROM chatmessages LEFT JOIN users ON chatmessages.userID = users.user_id  WHERE chatmessages.userID =? AND users.status=0 ORDER BY chatmessages.id DESC";

  db.executeQuery(sql, [userIDs], function (result) {
    callback(result);
  });
};
var getSingleSellerSmsMessage = (userIDs, callback) => {
  var sql =
  "SELECT users.firstName,users.lastName,chatmessages.roomId,chatmessages.sender,chatmessages.date,chatmessages.message,chatmessages.userID,chatmessages.sellerID, chatmessages.id FROM chatmessages LEFT JOIN users ON chatmessages.userID = users.user_id  WHERE chatmessages.userID =? AND users.status=1 ORDER BY chatmessages.id DESC";

  db.executeQuery(sql, [userIDs], function (result) {
    callback(result);
  });
};
var getAllChats = (callback) => {
  var sql = "SELECT * FROM chatmessages";
  db.executeQuery(sql, [null], function (result) {
    callback(result);
  });
};


var getMessageByRoomId = (userIDs, callback) => {
  var sql = "SELECT * FROM chatmessages WHERE roomID = ?";
  db.executeQuery(sql, [userIDs], function (result) {
    callback(result);
  });
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom,createChat,getSingleSmsMessage,checkRoomExists,getMessageByRoomId,createRooms,getSingleSellerSmsMessage,getAllChats };



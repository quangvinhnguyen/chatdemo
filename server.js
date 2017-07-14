var express = require("express");
var app = express();
app.use(express.static("./public"));
app.set("view engine","ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);
// include the mongodb module
var mongo = require('mongodb');

// create a server instance
var serverInstance = new mongo.Server('localhost', 27017, {auto_reconnect: true});

// retrieve a database reference
var dbref = new mongo.Db('myDatabaseName', serverInstance);

// connect to database server
dbref.open(function(err, dbref) {
    // now a connection is established
     if(!err) {
    console.log("We are connected");
  }
});

// close a database connection
dbref.close();
// retrieve a collection reference
dbref.collection('myCollectionName', function(err, collectionref) {
    // this is an asynchroneous operation
});
var usersOnline = [];
io.on("connection",function(socket){
	console.log("new connection, id:"+socket.id);
	socket.on("client_send_Username",function(data){
			console.log("CLient register username is "+data);
			if(usersOnline.indexOf(data)>=0){
					socket.emit("User_exist",data);
			}
			else{

				usersOnline.push(data);
				socket.username = data;
				socket.emit("success",data);// server res all client
				io.sockets.emit("Server_Send_Listuseronline",usersOnline);
			}
		});

	socket.on("Call_OneUser",function(data){
			io.to(socket.id).emit("Controll_Call",socket.username);
		});
	socket.on("disconnect",function(){
			console.log(socket.id+" Ngat ket noi");
	});
	socket.on("logout",function(){
			usersOnline.splice(
				usersOnline.indexOf(socket.username),1
				);
			socket.broadcast.emit("Server_Send_Listuseronline",usersOnline);
			socket.emit("logoutsuccess");
	});
	//Room
	var rooms=[];

	socket.on("createNewRoom",function(data){
		if (rooms.indexOf(data)>=0) {
			socket.emit("User_exist",data);
		}
		else{
			socket.join(data);
			socket.room = data;
				rooms.push(data);
			io.sockets.emit("server_send_Rooms",rooms);
		}

	});
socket.on("client_send_server",function(data){
			io.sockets.in(socket.room).emit("server_send_message",{username:socket.username,msg:data,room:socket.room});
		});

	});
//socket.broadcast.emit --> res all not host
app.get("/",function(req,res){
			res.render("index");


	});

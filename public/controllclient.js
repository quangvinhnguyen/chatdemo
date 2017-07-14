var socket =io("http://localhost:3000");
            socket.on("User_exist",function(data){
                        alert(data +" exist");
                });
                socket.on("success",function(data){
                    //console.log(data);
                     $('#register').hide(2000);
                     $('#ContainChat').show(1000);

                });
                socket.on("Server_Send_Listuseronline",function(data) {
                     $('#list_online').html("");

                     data.forEach(function(user){

                     $('#list_online').append( " <div class='chat-box-online-left' idUseronline='"+user+"'> <img src='assets/img/user.png' alt='bootstrap Chat box user image' class='img-circle' />"+user+ " <br />( <small>Active from 3 hours</small> ) <hr class='hr-clas-low' />");
                     });

                });
                socket.on("server_send_message",function(data){
                        $("#ChatName").html("");
                        $("#ChatName").append(data.room);
                        var content = "<div class='hat-box-left'>"+data.msg+"</div><div class='chat-box-name-left'><img src='assets/img/user.png' alt='bootstrap Chat box user image' class='img-circle' />"+ data.username +"</div><hr class='hr-clas' />";

                            $('#chat-box').append(content);
                });
                 socket.on("server_send_Rooms",function(data){
                $('#lstroomschat').html("");
                data.forEach(function(r){
                   $('#lstroomschat').append(' <img src="assets/img/user.png" alt="bootstrap Chat box user image" class="img-circle" />'+r+'<hr class="hr-clas-low" />');

                });
                       });
                // socket.on("Controll_Call",function(data){
                //         alert(data+":call you!");
                // });

        $(document).ready(function(){
            $(function(){
            $("#addClass").click(function () {
              $('#sidebar_secondary').addClass('popup-box-on');
                });

                $("#removeClass").click(function () {
              $('#sidebar_secondary').removeClass('popup-box-on');
                });
            })
            //end
            $('#btnRegister').click(function(){
                socket.emit("client_send_Username",$('#txtUser').val());

                            });
            $('#message').on('keypress',function(e){
                if (e.which == 13){
                    if($('#message').val()!= ""){
                         socket.emit("client_send_server",$('#message').val());
                    $('#message').val("");
                    }

                }
            });
              $('#chat').on('click',function(){
                    socket.emit("client_send_server",$('#message').val());
                      $('#message').val("");
            });

            $('#logout').click(function(){
                    socket.emit("logout");
            });
            socket.on("logoutsuccess",function(){
                $('#register').show(1000);
                     $('#ContainChat').hide(2000);
            });
//room
                    $('#txtRoomName').on('keypress',function(e){
                if (e.which == 13){
                    if($('#txtRoomName').val()!= ""){
                        socket.emit("createNewRoom",$('#txtRoomName').val());
                    $('#txtRoomName').val("");
                    }

                }
            });

        });
        $(document).on("click",".chat-box-online-left",function(){
                var id = $(this).attr("idUseronline");

                socket.emit("Call_OneUser",id);

        });
  $(document).on("click",".chat-box-online-left",function(){
                var id = $(this).attr("idUseronline");

                socket.emit("Call_OneUser",id);

        });

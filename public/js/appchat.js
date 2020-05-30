$(function(){

    var socket = io.connect();

    var formUser = $("#formUser");
    var formChat = $("#formChat");
    var user = $("#user");
    var listUsers = $("#listUsers");
    var message = $("#message");
    var chat = $("#windowChat"); 
    
    formUser.submit(function(evento){
        
        evento.preventDefault();
        if(!validateField(user.val(), 'usuario',true)){
            user.focus();
            return false;
        }
     
        socket.emit('new-user', user.val(), function(data){
            if(data){
                $("#error").hide();
                $("#sectionRegisterUser").hide();
                $("#sectionMain").show();
            }
            else{
                $("#error").html("El nombre del usario existe");
                $("#error").show();
            }
        });

        user.val("");
        
        socket.on('update-users', function(users){
            var html = '';
            users.forEach(function(user){
                html += user + '<br/>'
            });

            listUsers.html(html);
        });
       
        formChat.submit(function(evento){
            evento.preventDefault();

            if(!validateField(message.val(), 'message',false)){
                message.focus();
                return false;
            }

            socket.emit('new-message', message.val())
            message.val("");
        });
        
        socket.on('message', function(data){
            chat.append('<strong>' + data.user + '</strong> -' + data.message +'<br/>');
        });
    })


    function validateField(value, field, showAlert){
       if((value == '' || value == null) && showAlert == true){
           alert('Debe digitar un ' + field );
           return false;
       }

       if((value == '' || value == null) && showAlert != true){
          return false;
       }
       return true;
    }
})
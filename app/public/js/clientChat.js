//yêu cầu server kết nối client
const socket = io();

document.getElementById('form-message').addEventListener('submit', (e) => {
    e.preventDefault();
    const messageText = document.getElementById('input-message').value;
    const acknowledgement = (err) => {
        if(err){
            return alert(err);
        }
        console.log("Gửi tin nhắn thành công");
    }
    socket.emit(
        'send message from client to server',
        messageText,
        acknowledgement
    );
});

socket.on('send message from server to client', (messageText) => {
    console.log(messageText);
})

//gửi vị trí
document.getElementById('btn-share-location').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit(
            'share location from client to server', {
                latitude,
                longitude,
            }
        )
    })
});

socket.on(
    'share location from server to client',
    (linkLocation) => {
        console.log(linkLocation);
    }
)

//xử lý querySring
const querySring = location.search;
const params = Qs.parse(querySring, {
    ignoreQueryPrefix : true
});
const { room, username } = params;
    socket.emit('join room from client to server', { room, username });

// xu ly userlist
socket.on('Send userlist from server to client', (userList) => {
    console.log(userList);
})
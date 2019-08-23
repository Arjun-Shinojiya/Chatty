var socket = io();

socket.on('answer-made', function(data) {
    pc.setRemoteDescription(new sessionDescription(data.answer), function() {
      console.log("answer"+JSON.stringify(data.answer));
        document.getElementById(data.socket).setAttribute('class', 'active');
        if (!answersFrom[data.socket]) {
            createOffer(data.socket);
            answersFrom[data.socket] = true;
        }
    }, error);
});
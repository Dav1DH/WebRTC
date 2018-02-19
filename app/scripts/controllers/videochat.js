'use strict';

/**
 * @ngdoc function
 * @name webRtcApp.controller:VideochatCtrl
 * @description
 * # VideochatCtrl
 * Controller of the webRtcApp
 */
angular.module('webRtcApp')
  .controller('VideoChatCtrl',['$routeParams', '$scope', function ($routeParams, $scope) {
    $(function () {
      var messages = [];
      var peer_id, name, conn;
      var messages_template = Handlebars.compile($('#messages-template').html());

      var peer = new Peer({
        host: 'localhost',
        port: 9005,
        path: '/peerjs',
        debug: 3,
        config: {
          'iceServers': [
            {url: 'stun:stun1.l.google.com:19302'},
            {
              url: 'turn:numb.viagenie.ca',
              credential: 'muazkh', username: 'webrtc@live.com'
            }
          ]
        }
      });

      $scope.username = '';

      peer.on('open', function () {
        $('#id').text(peer.id);
        automaticConnect();
      });

      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      /*   video: {
       mandatory: {
       chromeMediaSource: 'screen',
       maxWidth: 1280,
       maxHeight: 720
       },
       optional: []
       }
       */
      function getVideo(callback) {
        navigator.getUserMedia({
          audio: true, video: true
        }, callback, function (error) {
          console.log(error);
          if (error) {
            alert('An error occured. Please try again');
          }
        });
      }

      getVideo(function (stream) {
        window.localStream = stream;
        onReceiveStream(stream, 'my-camera');
      });

      function onReceiveStream(stream, element_id) {
        var video = $('#' + element_id + ' video')[0];
        video.src = window.URL.createObjectURL(stream);
        window.peer_stream = stream;
      }

      function automaticConnect() {
        if ($routeParams.id) {
          setTimeout(function() {
            document.getElementById('login').click();
            document.getElementById('call').click();

          }, 1000);
          console.log($routeParams.id);
          $('#peer_id').val($routeParams.id);
        } else {

        }
      }


      $('#login').click(function () {
        name = $('#name').val();
        peer_id = $('#peer_id').val();
        if (peer_id) {
          conn = peer.connect(peer_id, {
            metadata: {
              'username': name
            }
          });
          conn.on('data', handleMessage);
          document.getElementById('login').click();
        }


        $('#chat').removeClass('hidden');
        $('#connect').addClass('hidden');

      });


      peer.on('connection', function (connection) {
        conn = connection;
        peer_id = connection.peer;
        conn.on('data', handleMessage);

        $('#peer_id').addClass('hidden').val(peer_id);
        $('#connected_peer_container').removeClass('hidden');
        $('#connected_peer').text(connection.metadata.username);
        $("#name").val($scope.username);
        $("#login").click();
      });


      function handleMessage(data) {
        if (typeof data.type != 'undefined') {
          console.log(data);

        } else {
          var header_plus_footer_height = 285;
          var base_height = $(document).height() - header_plus_footer_height;
          var messages_container_height = $('#messages-container').height();
          messages.push(data);
          $("#messages-container").animate({ scrollTop: $("#messages-container")[0].scrollHeight}, 500);
          var html = messages_template({'messages': messages});
          $('#messages').html(html);

          if (messages_container_height >= base_height) {
            $('html, body').animate({scrollTop: $(document).height()}, 500);
          }
        }

      }


      function sendMessage() {
        var text = $('#message').val();
        var data = {'from': name, 'text': text};
        $("#messages-container").animate({ scrollTop: $("#messages-container")[0].scrollHeight}, 500);

        conn.send(data);
        handleMessage(data);
        $('#message').val('');
      }

      $('#message').keypress(function (e) {
        if (e.which == 13) {
          sendMessage();
        }
      });

      $('#send-message').click(sendMessage);

      $('#call').click(function () {
        console.log('now calling: ' + peer_id);
        console.log(peer);
        var call = peer.call(peer_id, window.localStream);
        call.on('stream', function (stream) {
          window.peer_stream = stream;
          onReceiveStream(stream, 'peer-conn');
        });
      });

      peer.on('call', function (call) {
        onReceiveCall(call);
      });



      function onReceiveCall(call) {
        call.answer(window.localStream);
        call.on('stream', function (stream) {
          window.peer_stream = stream;
          onReceiveStream(stream, 'peer-conn');
        });
      }
    });

  }]);

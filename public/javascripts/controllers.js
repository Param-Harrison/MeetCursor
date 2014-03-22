'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, socket) {
  }).
  controller('HomeCtrl', function ($scope, socket) {
    $scope.reset = function() {
      $scope.username = '', $scope.chatText = '';
      $scope.valid = false;
      if($scope.drawTimeout) clearTimeout($scope.drawTimeout);
      if($scope.useradd) clearInterval($scope.useradd);
    }
    
    $scope.reset();

    $scope.submitName = function () {
      if ($scope.username) {
          var data = { 'name': $scope.username, 'pos': currentMousePos };
          socket.emit('adduser', data);
          var data = { 'name': $scope.username, 'text': $scope.chatText };
          socket.emit('addChat', data);
          socket.emit('StartTime');
          $scope.valid = true;

          $scope.useradd = setInterval(function() {
            var data = {'name': $scope.username, 'pos': currentMousePos};
            socket.emit('adduser', data);
          }, 200);
      }
    };

    $scope.myStyleFunction = function($last) {
      return {
        'left': $last.x + '%',
        'top': $last.y + '%'
      };
    }

    $scope.AddCoversation = function() {
      if($scope.chatText)
      {
        var data = { 'name': $scope.username, 'text': $scope.chatText };
        socket.emit('addChat', data);
        $scope.chatText = '';
      }
    }

    $scope.drawTime = function(time) {
      $scope.time = time;
      $scope.drawTimeout = setTimeout(function() {
        var split = time.split(':');
        var min = parseInt(split[0]);
        var sec = parseInt(split[1]);
        sec++;
        if(sec >= 60) {
          sec = 0;
          min++;
        }
        if(min < 10) min = '0' + min;
        if(sec < 10) sec = '0' + sec;
        var timeval = min + ':' + sec;
        $scope.$apply(function() {
          $scope.drawTime(timeval);
        });
      }, 1000);
    }

    $scope.endSession = function() {
      socket.emit('disconnectuser');
      $scope.reset();
    }

    socket.on('updateCoverso', function(conversation) {
      $scope.conversation = conversation;
    });

    socket.on('updateusers', function (usernames) {
      console.log(usernames);
      $scope.usernames = usernames;
    });

    socket.on('StartTime', function(data) {
      var timeDiff = parseInt(data.currenttime, 10) - parseInt(data.time, 10);
      timeDiff = parseInt(timeDiff / 1000, 10);
      var min = parseInt(timeDiff / 60, 10);
      var sec = parseInt(timeDiff % 60, 10);
      if(min < 10) min = '0' + min;
      if(sec < 10) sec = '0' + sec;
      var time = min + ':' + sec;
      $scope.drawTime(time);
    });
  });


var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
  var width = $(document).width();
  var height = $(document).height();
  var ePageX = (event.pageX - 10) * 100 / width;
  var ePageY = (event.pageY - 10) * 100 / height;
  if(ePageX > 100) ePageX = 100;
  if(ePageY > 100) ePageY = 100; 
  currentMousePos.x = ePageX;
  currentMousePos.y = ePageY;
});
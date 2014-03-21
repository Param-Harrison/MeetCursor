'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, socket) {
  }).
  controller('HomeCtrl', function ($scope, socket) {
    $scope.username = '';
    $scope.valid = false;
    
    $scope.submitName = function () {
      if ($scope.username) {
          var data = {'name': $scope.username, 'pos': currentMousePos};
          socket.emit('adduser', data);
          $scope.valid = true;

          setInterval(function() {
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

    socket.on('updateusers', function (usernames) {
      $scope.usernames = usernames;
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
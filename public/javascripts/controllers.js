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
          }, 10);
      }
    };
    socket.on('updateusers', function (usernames) {
      $scope.usernames = usernames;
    });
  });

var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;
});
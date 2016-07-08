'use strict';

angular.module('openAim')
  .controller('LoginCtrl', function ($location, Auth, $state, Constant) {

    var vm = this;

    if (Auth.isLogged()) {
      $state.go('home');
    }

    angular.extend(vm, {

      name: 'LoginCtrl',
      failed: '',

      /**
       * User credentials
       */
      user: { email: '', password: '' },

      /**
       * Login method
       */
      login: function () {
        if (!vm.user.email || !vm.user.password) {
          vm.failed = Constant.loginError.missingUser;
          return false;
        }
        Auth.login(vm.user)
          .then(function () {
            $location.path('/');
          })
          .catch(function (err) {
            vm.failed = err.msg;
          });
      }

    });

  });

'use strict';
angular.module('openAim')
  .service('ModalService', function($uibModal) {
    return {
      confirmDelete: function(data) {
        return $uibModal.open({
          templateUrl: 'services/modal/confirm-delete.html',
          controller: 'ConfirmDeleteCtrl',
          size: 'sm',
          animation: true,
          backdrop: "static",
          resolve: {
            data: function() {
              return data;
            }
          }
        });
      },

      error: function(err, accNumberLenght) {
        return $uibModal.open({
          templateUrl: 'services/modal/error.html',
          controller: 'ErrorModalCtrl',
          size: 'sm',
          animation: true,
          resolve: {
            accessionNumberLength: function() {
              return accNumberLenght;
            },
            errorMessage: function() {
              return err;
            }
          }
        });
      },

      successTransfer: function(res) {
        return $uibModal.open({
          templateUrl: 'services/modal/success-transfer.html',
          controller: 'SuccessTransferCtrl',
          size: 'sm',
          animation: true,
          resolve: {
            info: function() {
              return res;
            }
          }
        });
      },

      successLatestTest: function(message, status) {
        return $uibModal.open({
          templateUrl: 'services/modal/success-latest-test.html',
          controller: 'SuccessLatestTestCtrl',
          size: 'sm',
          animation: true,
          resolve: {
            popupMessage: function() {
              return message;
            },
            updateStatus: status
          }
        });
      },

      autoInsertChange: function (autoInsert) {
        return $uibModal.open({
          templateUrl: 'services/modal/auto-insert-change.html',
          controller: 'AutoInsertCtrl',
          size: 'sm',
          animation: true,
          backdrop: "static",
          resolve: {
            auto: function() {
              return autoInsert.value;
            }
          }
        });
      },

      uploadFile: function(success, error) {
        return $uibModal.open({
          templateUrl: 'services/modal/upload.html',
          controller: 'UploadModalCtrl',
          size: 'sm',
          animation: true,
          backdrop: "static",
          keyboard  : false,
          resolve: {
            error: {
              data: error
            },
            success: success
          }
        });
      },

      /**
       * @param { object } analyzerResult: analyzer result being revised
       * @param { array } accNumbers: accession numbers already have existed
       */
      addAccNumber: function(analyzerResult, accNumbers) {
        return $uibModal.open({
          templateUrl: 'services/modal/add-accNumber.html',
          controller: 'addAccNumberCtrl',
          size: 'lg',
          animation: true,
          backdrop: "static",
          resolve: {
              analyzerResult: function() {
                return analyzerResult;
              },
              accNumbers: function() {
                return accNumbers;
              }
            }
          });
        },

        /**
         * @param { array } accNumbersRes: accession numbers already have existed
         */
        failSaveAccNumber: function(accNumbersRes) {
          return $uibModal.open({
            templateUrl: 'services/modal/fail-save-accNumber.html',
            controller: 'FailSaveAccNumberCtrl',
            size: 'lg',
            animation: true,
            backdrop: "static",
            resolve: {
                accessionNumbers: function() {
                return accNumbersRes;
              }
            }
          });
        }
    };
  })
  .controller('ConfirmDeleteCtrl', function($scope, $uibModalInstance, data) {
    $scope.ok = function() {
      $scope.data = data;
      $uibModalInstance.close($scope.data);
    };
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  })
  .controller('ErrorModalCtrl', function($scope, $uibModalInstance, Constant, accessionNumberLength, errorMessage) {
    if (accessionNumberLength) {
      $scope.translationData = {
        accessionNumberLength: Constant.testResultView.accessionNumberLength
      };
    }
    $scope.errorMessage = errorMessage;
    $scope.close = function() {
      $uibModalInstance.close();
    };
  })
  .controller('SuccessTransferCtrl', function($scope, $uibModalInstance, info) {
    $scope.translationData = {
      total: info.totalAnalyzerResult,
      success: info.success,
      fail: info.fail
    };
    $scope.info = 'INFO_TRANSFER';
    $scope.total = 'INFO_TOTAL';
    $scope.success = 'INFO_SUCCESS';
    $scope.fail = 'INFO_FAIL';
    $scope.close = function() {
      $uibModalInstance.close();
    };
  })
  .controller('SuccessLatestTestCtrl', function($scope, Constant, $uibModalInstance, popupMessage, updateStatus) {
    $scope.popupMessage = popupMessage;
    if (updateStatus) {
      // Showing the number of creared test
      if (updateStatus.numberCreated > 0) {
        $scope.translationDataCreated = {
          created: updateStatus.numberCreated
        };
        $scope.numberCreated = Constant.msg.test.MSG_CREATED_OK;
      }
      // Showing the number of updated test
      if (updateStatus.numberUpdated > 0) {
        $scope.translationDataUpdated = {
          updated: updateStatus.numberUpdated
        };
        $scope.numberUpdated = Constant.msg.test.MSG_UPDATED_OK;
      }
    }
    $scope.close = function() {
      $uibModalInstance.close();
    };
  })
  .controller('UploadModalCtrl', function($scope, $uibModalInstance, success, error, Constant) {
    $scope.error = error ? Constant.UPLOAD.ERROR[error.data] : null;
    $scope.result = success ? 'upload.success' : 'upload.failed';
    $scope.ok = function() {
      $uibModalInstance.close();
    };
  })
  .controller('AutoInsertCtrl', function($scope, $uibModalInstance, auto) {
    $scope.info = auto === 'false' ? 'AUTO_INSERT_ON_TO_OFF' : 'AUTO_INSERT_OFF_TO_ON';
    $scope.continue = function() {
      $uibModalInstance.close();
    };
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  })
  .controller('addAccNumberCtrl', function($scope, $uibModalInstance, analyzerResult, accNumbers, Constant) {
      // define accession numbers input
      var accessionNumberInputs = accNumbers ? accNumbers.map(function(num) { return { value: num }; }) : [{}];

      // Display information of test results on modal
      angular.extend($scope, {
        accessionNumber: analyzerResult.accessionNumber,
        testName: analyzerResult.test.name,
        result: analyzerResult.resultStr,
        beginDate: analyzerResult.beginDate,
        accessionNumberInputs: accessionNumberInputs
      });

      /**
       * Check duplication for data inputs
       * @return { Boolean } identical or not
       */
      $scope.checkInputData = function() {
        $scope.duplicated = false;

        var duplicatedAccessionNumbers = _($scope.accessionNumberInputs.map(function(accessionNumberInput) { return accessionNumberInput.value; }))
        .filter(function (value, index, iteratee) {
           return _.includes(iteratee, value, index + 1);
        }).uniq().compact().value();

        $scope.accessionNumberInputs.forEach(function(accessionNumberInput) {
          // We only check for the inputs that has been inputted
          if (accessionNumberInput.value !== '' && duplicatedAccessionNumbers.indexOf(accessionNumberInput.value) !== -1) {
            accessionNumberInput.error = true;
            accessionNumberInput.errorMessage = Constant.testResultError.DUPLICATE_ACCESSIONUMBER;
          } else {
            // Reset to the latest state
            accessionNumberInput.error = false;
          }
        });

        return ($scope.duplicated = duplicatedAccessionNumbers.length > 0);
      };

      // Press add button to add a accession number input
      $scope.addInput = function() {
        // add empty accession number input
        $scope.accessionNumberInputs.push({});
      };

      // Press remove button to remove a accession number input
      $scope.removeInput = function(accessionNumberInput) {
        _.remove($scope.accessionNumberInputs, accessionNumberInput);
        $scope.checkInputData();
      };

      /**
       * @param  {array} accNumbers all: of accession number inputs
       */
      $scope.save = function(accessionNumbers) {
        if (!$scope.duplicated) {
          $uibModalInstance.close(accessionNumbers);
        }
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
  })
  .controller('FailSaveAccNumberCtrl', function($scope, $uibModalInstance, accessionNumbers) {
    $scope.accNumbers = accessionNumbers;
    $scope.close = function() {
      $uibModalInstance.close(accessionNumbers);
    };
  });

'use strict';

angular.module('openAim')
  .constant('Constant', {
    // API URL
    serviceURL: {
      ANALYZER: 'api/analyzers/:id',
      ANALYZER_RESULTS: 'api/test-results/:id',
      ANALYZER_RESULTS_MULTI_DELETE: 'api/test-results/',
      HISTORY: 'api/histories/:id',
      TEST: 'api/tests/:id',
      TEST_MAPS: 'api/test-maps/:id',
      UPLOAD: 'api/import-analyzers/file',
      SETTING: 'api/settings/:key'
    },

    // analyzer status
    analyzerStatus: {
      OPENED: true,
      CLOSED: false
    },

    // analyzer protocol
    analyzerProtocol: {
      SERIAL: 'serial',
      FILE: 'file',
      NET: 'net'
    },
    // Login error
    loginError: {
      missingUser: 'missingUser',
      failedUser: 'failedUser'
    },

    // common
    ALL: 'ALL',

    // Upload config
    UPLOAD: {
      TEMPLATE: [
        'ABI7500.Trioplex',
        'GeneXpert.389.MTB',
        'IgG Dai',
        'IgG DEN',
        'IgG HTN',
        'IgM DEN',
        'IgM JE',
        'IgM HTN',
        'NS1 DEN',
        'Realtime.PCR-Dengue-(Định Tính)',
        'Realtime.PCR-Zika-(Định Tính)',
        'Realtime.PCR-Zika-(Định Lượng)',
        'Realtime.PCR-Pool-(Định Tính)',
        'Realtime.PCR-Pool-(Định Lượng)'
      ],
      ERROR: {
        '-1': 'templateWasNotChoose',
        '0': 'templatesWasNotFound',
        '1': 'testMapIsNotFull',
        '2': 'testCodeInvalid',
        '3': 'analyzerIsNotActive',
        '4': 'fileMissingData',
        '5': 'testCodeDoesNotExists',
        '6': 'sheetNameIncorrect',
        '7': 'templateUnderfined',
        '8': 'testNotExist',
        '9': 'analyzerNotExist',
        '10': 'templateAndFileIsNotMap',
        '11': 'duplicateTestResult'
      },
      FORMDATA: {
        file: 'file',
        txtfile: 'test',
        template: 'template',
        beginDate: 'beginDate'
      }
    },
    // SETTING
    setting: {
      AUTO_INSERT: 'auto-insert',
      SUPPORT_TEMPLATES: 'support-templates',
      AUTO_INSERT_INTOLIS: 'AUTO_INSERT_INTOLIS',
      ON: 'ON',
      OFF: 'OFF',
    },

    // test result status
    testResultStatus: {
      NEW: 'NEW',
      SAVED: 'TRANSFERRED'
    },

    testResultError: {
      EDIT_ACCESSIONUMBER: 'EDIT_ACCESSIONUMBER',
      ANALYZER_RESULT_EMPTY: 'ANALYZER_RESULT_EMPTY',
      LESS10_ACCESSIONUMBER: 'LESS10_ACCESSIONUMBER',
      DUPLICATE_ACCESSIONUMBER: 'DUPLICATE_ACCESSIONUMBER'
    },
    // test result
    testResult: {
      POSITIVE: '1',
      NEGATIVE: '-1',
      UNKNOWN: '0'
    },

    // test result type
    testResultType: {
      RESULT: 'result',
      VALUE: 'value'
    },
    // display string of test result
    testResultStr: {
      POSITIVE: 'test.Result.POSITIVE',
      NEGATIVE: 'test.Result.NEGATIVE',
      UNKNOWN: 'test.Result.UNKNOWN'
    },

    // common messages
    msg: {
      // analyzer screen
      analyzer: {
        MSG_LOAD_DATA_SUCCESS: 'Load analyzers data succesfully at ',
        MSG_LOAD_DATA_UNSUCCESS: 'Load analyzers data unsuccesfully at ',
        MSG_OPEN_SUCCESS: 'Open analyzers successfully at ',
        MSG_OPEN_UNSUCCESS: 'Open analyzers unsuccessfully at ',
        MSG_CLOSE_SUCCESS: 'Close analyzers successfully at ',
        MSG_CLOSE_UNSUCCESS: 'Close analyzers unsuccessfully at ',
        MSG_OPEN_ALL_SUCCESS: 'Open all analyzers successfully at ',
        MSG_OPEN_ALL_UNSUCCESS: 'Open all analyzers unsuccessfully at ',
        MSG_CLOSE_ALL_SUCCESS: 'Close all analyzers successfully at ',
        MSG_CLOSE_ALL_UNSUCCESS: 'Close all analyzers unsuccessfully at ',
        MSG_UPDATE_SUCCESS: 'Update analyzers successfully at ',
        MSG_UPDATE_UNSUCCESS: 'Update analyzers unsuccessfully at '
      },
      analyzerServer: {
        disconnectOpenLabConnectToAnalyzer: 'disconnectOpenLabConnectToAnalyzer'
      },
      // test result screen
      analyzerResult: {
        MSG_LOAD_DATA_SUCCESS: 'Load test results succesfully at ',
        MSG_LOAD_DATA_UNSUCCESS: 'Load test results unsuccesfully at ',
        MSG_UPDATE_DATA_SUCCESS: 'Data save succesfully at ',
        MSG_UPDATE_DATA_UNSUCCESS: 'Data save unsuccesfully at ',
        MSG_DELETE_DATA_SUCCESS: 'Data delete succesfully at ',
        MSG_DELETE_DATA_UNSUCCESS: 'Data delete unsuccesfully at '
      },
      // audit-log screen
      histories: {
        MSG_LOAD_DATA_SUCCESS: 'Load histories succesfully at ',
        MSG_LOAD_DATA_UNSUCCESS: 'Load histories unsuccesfully at ',
        MSG_ERROR_DATE: 'HISTORY_DATE_SEARCH_ERR',
        MSG_ERROR_MISSING_DATE: 'HISTORY_DATE_SEARCH_ERR_MISSING'
      },
      // test
      test: {
        MSG_LOAD_DATA_SUCCESS: 'Load tests succesfully at ',
        MSG_LOAD_DATA_UNSUCCESS: 'Load tests unsuccesfully at ',
        MSG_GET_OK: 'MSG_GET_OK',
        MSG_GET_NOT_OK: 'MSG_GET_NOT_OK',
        MSG_CREATED_OK: 'MSG_CREATED_OK',
        MSG_UPDATED_OK: 'MSG_UPDATED_OK'
      },

      // test map
      testMap: {
        MSG_LOAD_DATA_SUCCESS: 'Load test maps succesfully at ',
        MSG_LOAD_DATA_UNSUCCESS: 'Load test maps unsuccesfully at ',
        MSG_UPDATE_DATA_SUCCESS: 'Data update succesfully at ',
        MSG_UPDATE_DATA_UNSUCCESS: 'Data update unsuccesfully at ',
        MSG_CREATE_DATA_SUCCESS: 'Data create succesfully at ',
        MSG_CREATE_DATA_UNSUCCESS: 'Data create unsuccesfully at ',
        MSG_DELETE_DATA_SUCCESS: 'Data delete succesfully at ',
        MSG_DELETE_DATA_UNSUCCESS: 'Data delete unsuccesfully at ',
        MSG_NOT_SET: 'Not set',
        MSG_SAVE_ERR: 'MSG_SAVE_ERR',
        MSG_DUPLICATE: 'MSG_DUPLICATE'
      },

      // popup modal
      modal: {
        MSG_MODAL_DISMISS: 'Modal dismissed at '
      }
    },

    // CSS contants
    css: {
      analyzer_actived: 'ok-sign text-success',
      analyzer_inactived: 'minus-sign text-danger'
    },

    // pagination
    record_per_page: {
      TEST_RESULT: 50,
      HISTORY: 20,
      TEST: 20,
      TEST_MAP: 20
    },
    // Configuration for test-result view
    testResultView: {
      accessionNumberLength: 10
    },
    // Auto Connect OpenELIS
    ECONNREFUSED: 'ECONNREFUSED',
    // Pool specimen
    POOL: 'Pool',
    TXTFILE: ['ABI7500.Trioplex'],
    CSVFILE: ['GeneXpert.389.MTB']
  });

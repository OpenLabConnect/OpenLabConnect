'use strict';

angular.module('openAim')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {

      // common text
      'ACTION': 'Action',
      'SEARCH': 'Search',
      'EDIT': 'Edit',
      'DELETE': 'Delete',
      'CANCEL': 'Cancel',
      'OK': 'Ok',
      'NEXT': 'Next',
      'PREVIOUS': 'Previous',
      'ADD_ROW': 'ADD ROW',
      'CLEAR': 'Clear',
      'CLOSE': 'Close',
      'TODAY': 'Today',
      'SAVE': 'Save',
      'NO': 'NO.',
      'MAIN_MENU': 'Main Menu',
      'SEARCH_FOR': 'Search for...',
      'ERROR': 'Error',
      'INFO': 'Information',
      'CHOOSEFILE': 'Choose file',
      'UPLOADFILE': 'Upload file',
      'GETLATESTTEST': 'Get latest test',
      'DETAIL': 'Detail',
      // Screens title
      'TITLE_STATUS_COM_PORTS': 'Status of COM ports of all analyzers',
      'TITLE_TEST_RESULTS': 'Test Results from Analyzers',
      'TITLE_GET_LATEST_TESTS': 'Get the latest tests from OpenELIS',
      'TITLE_MAPPING': 'Test mapping ',
      'TITLE_ASSIGN_STAFF': 'Assign Lab Staff',
      'TITLE_LOGS': 'Audit Log',
      'TITLE_UPLOAD': 'Upload File',
      'TITLE_LOGOUT': 'Logout',

      // Nav
      'NAV_STATUS_COM_PORTS': 'Status of COM ports',
      'NAV_TEST_RESULTS': 'View Test Results',
      'NAV_GET_LATEST_TESTS': 'Get Latest Test',
      'NAV_MAPPING': 'Mapping Test',
      'NAV_ASSIGN_STAFF': 'Assign Lab Staff',
      'NAV_LOGS': 'Audit Log',
      'NAV_UPLOAD': 'Upload File',
      'NAV_LOGOUT': 'Logout',

      // Analyzers properties and actions
      'analyzer.NAME': 'Name',
      'analyzer.PORT': 'Port',
      'analyzer.PARAMETERS': 'Prameters',
      'analyzer.STATUS': 'Status',
      'analyzer.statusses.OPEN': 'Open',
      'analyzer.statusses.CLOSED': 'Closed',
      'analyzer.action.OPEN': 'Open',
      'analyzer.action.OPEN_ALL': 'Open all',
      'analyzer.action.CLOSE': 'Close',
      'analyzer.action.CLOSE_ALL': 'Close all',

      // Test properties and actions
      'test.NAME': 'Test Name',
      'test.CODE': 'Test Code',
      'test.ID': 'TEST ID',
      'test.RESULT': 'Test Result',
      'test.Result.POSITIVE': 'Positive',
      'test.Result.NEGATIVE': 'Negative',
      'test.Result.UNKNOWN': 'Unknow',
      'test.ANALYZER': 'Analyzer',
      'test.DESCRIPTION': 'Test Description',
      'test.SECTION': 'Test Section',
      'test.STATUS': 'Status',
      'test.ACCESSION_NUMBER': 'Accesion Number',
      'test.PERFORMED_DATE': 'Performed Date',
      'test.PERFORMED_BY': 'Performed By',
      'test.AUTO_INSERT': 'Auto insert test results into LIS system',
      'test.action.SELECT_ALL': 'Select All',
      'test.action.DESELECT_ALL': 'Deselect All',
      'test.action.RESULT_ENTRY': 'Result Entry',
      'test.action.GET_LATEST': 'GET THE LATEST',
      'test.BEGIN_DATE': 'Begin date',

      // History
      'history.DATETIME': 'Date Time',
      'history.ACTION': 'Action',
      'history.DATA': 'Data',
      'history.FROMDATE': 'From Date Time',
      'history.TODATE': 'To Date Time',
      'history.ANALYZER': 'Analyzer',

      // Latest test
      'latestTest.GET_LATEST': 'Get the latest',
      'latestTest.TEST_ID': 'Test ID',
      'latestTest.TEST_NAME': 'Test Name',
      'latestTest.DESCRIPTION': 'Test Description',
      'latestTest.SECTION': 'Test Section',
      'MSG_GET_NOT_OK': 'Can not get the latest tests from OpenELIS',
      'MSG_GET_OK': 'Get the latest tests successfull',
      'MSG_CREATED_OK': 'Created: {{created}}',
      'MSG_UPDATED_OK': 'Updated: {{updated}}',

      // ERROR Message
      'ERR_MSG_ORDER_DUPPLICATE': 'Oder already used',
      'MSG_SAVE_ERR': 'Data saved unsuccesfully! Please fill all fields and check again!',
      'HISTORY_DATE_SEARCH_ERR': 'From-Date must less than To-Date',
      'MSG_DUPLICATE': 'Data saved unsuccesfully! Test Map is duplicate.',
      'HISTORY_DATE_SEARCH_ERR_MISSING ': 'From-Date and To-Date is empty. Please fill all and check again!',
      'EMPTY_DATA': 'No data.',
      // Test mapping
      'mapping.ADD_ROW': 'Add Row',
      'mapping.ANALYZER': 'Analyzer',
      'mapping.TEST_CODE': 'Test Code',
      'mapping.TEST_ID': 'Test ID',
      'mapping.TEST_NAME': 'Test Name',
      'mapping.ORDER': 'Order',
      'mapping.EDIT': 'Edit',
      'MSG_DELETE_CONFIRM': 'Are you sure you want to delete this record?',
      'DELETE_CONFIRM': 'Delete confirmation',
      'mapping.DUPPLICATE_ORDER': 'Dupplicate order!',

      // Test mapping
      'assign.NO': 'No',
      'assign.ANALYZER': 'Analyzer',
      'assign.STAFF': 'Staff',
      'assign.ACTION': 'Action',
      'assign.EDIT': 'Edit',
      'assign.SAVE': 'Save',
      'assign.CANCEL': 'Cancel',

      // Upload file
      'upload.success': 'Upload successfull',
      'upload.failed': 'Upload failed',
      'upload.error': 'Error :',
      'upload.template': 'Choose template',
      // Error
      'templatesWasNotFound': 'Template has not been implemented.',
      'testMapIsNotFull': 'Test Map is not full.',
      'testCodeInvalid': 'Test code was not found.',
      'analyzerIsNotActive': 'Analyzer is not active.',
      'fileMissingData': 'File upload is missing test-name or test-name is incorrect. Please check your file.',
      'testCodeDoesNotExists': 'Test Code does not exists. Please choose right file with right template.',
      'sheetNameIncorrect': 'Sheet name of file is incorrect. Please check your file.',
      'templateUnderfined': 'Template is underfined. Please choose file again.',
      'templateWasNotChoose': 'Template was not choose. Please choose template and upload again.',
      'testNotExist': 'Test is not exists on database.',
      'analyzerNotExist': 'Analyzer is not exists on database.',
      'templateAndFileIsNotMap': 'Template and file is not map. Please choose again.',
      // Login
      'username': 'Username',
      'password': 'Password',
      'login': 'Login',
      // Login Error
      'missingUser': 'Please insert full information to login.',
      'failedUser': 'Username or password is incorrect',
      'OPENAIM_ERROR': 'OpenAIM is not available.',
      'OPENELIS_ERROR': 'OpenELIS is not available.',
      // Test Result Error
      'EDIT_ACCESSIONUMBER': 'Accession Number must be {{accessionNumberLength}} characters.',
      'CAN_NOT_CONNECT_TO_MEDIATOR': 'Can not transfer analyzer results. Can not connect to Mediator',
      'CAN_NOT_CONNECT_TO_OPENELIS': 'Can not transfer analyzer results. Can not connect to OpenELIS',
      // Test result info
      'INFO_TRANSFER': 'Tranfer analyzer result into OpenELIS:',
      'INFO_TOTAL': 'Total: {{total}}',
      'INFO_SUCCESS': 'SuccessfulL: {{success}}',
      'INFO_FAIL': 'Failed: {{fail}}',
      'ANALYZER_RESULTS_INVALID': 'The quantity of analyzer results were more than expectation. Please check again.'

    });

    $translateProvider.translations('vn', {
      // common text
      'ACTION': 'Action',
      'SEARCH': 'Tìm kiếm',
      'EDIT': 'Sửa',
      'DELETE': 'Xóa',
      'CLEAR': 'Xóa',
      'CLOSE': 'Đóng',
      'TODAY': 'Hôm nay',
      'OK': 'Ok',
      'CANCEL': 'Hủy bỏ',
      'NEXT': 'Tiếp theo',
      'PREVIOUS': 'Trước',
      'ADD_ROW': 'Thêm',
      'SAVE': 'Lưu',
      'NO': 'NO.',
      'INFO': 'Thông tin chuyển kết quả.',
      'MAIN_MENU': 'Danh mục chính',
      'SEARCH_FOR': 'Tìm kiếm...',
      'ERROR': 'Lỗi',
      'CHOOSEFILE': 'Chọn tập tin',
      'UPLOADFILE': 'Tải lên tập tin',
      'GETLATESTTEST': 'Lấy xét nghiệm mới nhất',
      'DETAIL': 'Chi tiết',
      // Screens title
      'TITLE_STATUS_COM_PORTS': 'Trạng thái kết nối của các máy phân tích',
      'TITLE_TEST_RESULTS': 'Kết quả xét nghiệm từ các máy phân tích',
      'TITLE_GET_LATEST_TESTS': 'Lấy kết quả mới nhất từ hệ thống OpenELIS',
      'TITLE_MAPPING': 'Lập chỉ dẫn xét nghiệm',
      'TITLE_ASSIGN_STAFF': 'Chỉ định nhân viên phụ trách máy xét nghiệm',
      'TITLE_LOGS': 'Xem Log',
      'TITLE_UPLOAD': 'Tải lên tập tin',
      'TITLE_LOGOUT': 'Logout',

      // Nav
      'NAV_STATUS_COM_PORTS': 'Trạng thái kết nối',
      'NAV_TEST_RESULTS': 'Kết quả xét nghiệm',
      'NAV_GET_LATEST_TESTS': 'Xét nghiệm mới nhất',
      'NAV_MAPPING': 'Lập chỉ dẫn',
      'NAV_ASSIGN_STAFF': 'Phân công',
      'NAV_LOGS': 'Xem Log',
      'NAV_UPLOAD': 'Tải lên tập tin',
      'NAV_LOGOUT': 'Thoát',

      // Analyzers properties and actions
      'analyzer.NAME': 'Tên',
      'analyzer.PORT': 'Cổng kết nối',
      'analyzer.PARAMETERS': 'Tham số',
      'analyzer.STATUS': 'Tình trạng',
      'analyzer.statusses.OPEN': 'Mở',
      'analyzer.statusses.CLOSED': 'Đóng',
      'analyzer.action.OPEN': 'Mở',
      'analyzer.action.OPEN_ALL': 'Mở hết',
      'analyzer.action.CLOSE': 'Đóng',
      'analyzer.action.CLOSE_ALL': 'Đóng hết',


      // Test properties and actions
      'test.NAME': 'Tên xét nghiệm',
      'test.CODE': 'Mã xét nghiệm',
      'test.ID': 'Số xét nghiệm',
      'test.Result.POSITIVE': 'Dương tính',
      'test.Result.NEGATIVE': 'Âm tính',
      'test.Result.UNKNOWN': 'Không rõ',
      'test.RESULT': 'Kết quả',
      'test.ANALYZER': 'Máy phân tích',
      'test.DESCRIPTION': 'Mô tả',
      'test.SECTION': 'Lĩnh vực xét nghiệm',
      'test.STATUS': 'Trạng thái',
      'test.ACCESSION_NUMBER': 'Số hiệu mẫu',
      'test.PERFORMED_DATE': 'Ngày thực hiện',
      'test.PERFORMED_BY': 'Người thực hiện',
      'test.AUTO_INSERT': 'Tự động ghi kết quả xét nghiệm vào hệ thống LIS',
      'test.action.SELECT_ALL': 'Chọn hết',
      'test.action.DESELECT_ALL': 'Bỏ chọn hết',
      'test.action.RESULT_ENTRY': 'Chuyển kết quả',
      'test.action.GET_LATEST': 'Lấy kết quả mới nhất',
      'test.BEGIN_DATE': 'Ngày bắt đầu làm xét nghiệm',

      // History
      'history.DATETIME': 'Thời gian',
      'history.ACTION': 'Hành động',
      'history.DATA': 'Dữ liệu',
      'history.FROMDATE': 'Từ',
      'history.TODATE': 'Đến',
      'history.ANALYZER': 'Máy phân tích',

      // Latest test
      'latestTest.GET_LATEST': 'Lấy các xét nghiệm mới nhất',
      'latestTest.TEST_ID': 'Số xét nghiệm',
      'latestTest.TEST_NAME': 'Tên xét nghiệm',
      'latestTest.DESCRIPTION': 'Mô tả',
      'latestTest.SECTION': 'Lĩnh vực xét nghiệm',
      'MSG_GET_NOT_OK': 'Không thể lấy xét nghiệm mới nhất từ hệ thống OpenELIS',
      'MSG_GET_OK': 'Lấy xét nghiệm mới nhất thành công',
      'MSG_CREATED_OK': 'Tạo mới: {{created}}',
      'MSG_UPDATED_OK': 'Cập nhật: {{updated}}',

      // ERROR Message
      'ERR_MSG_ORDER_DUPPLICATE':'Trùng lặp thứ tự sắp xếp',
      'MSG_SAVE_ERR': 'Lưu không thành công! Xin vui lòng điền đầy đủ thông tin và thực hiện lại!',
      'HISTORY_DATE_SEARCH_ERR': 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc. Vui lòng nhập lại thông tin và thực hiện lại.',
      'MSG_DUPLICATE': 'Lưu không thành công! Chỉ dẫn đã bị trùng.',
      'HISTORY_DATE_SEARCH_ERR_MISSING': 'Ngày bắt đầu và ngày kết thúc rỗng.Vui lòng nhập và thực hiện lại.',
      'EMPTY_DATA': 'Không có dữ liệu.',

      // Test mapping
      'mapping.ADD_ROW': 'Thêm',
      'mapping.ANALYZER': 'Máy phân tích',
      'mapping.TEST_CODE': 'Mã xét nghiệm',
      'mapping.TEST_ID': 'Số xét nghiệm',
      'mapping.TEST_NAME': 'Tên xét nghiệm',
      'mapping.ORDER': 'Sắp xếp',
      'mapping.EDIT': 'Sửa',
      'MSG_DELETE_CONFIRM': 'Bạn có chắc chắn muốn xóa ?',
      'DELETE_CONFIRM': 'Xác nhận xóa',
      'mapping.DUPPLICATE_ORDER': 'Trùng thứ tự sắp xếp!',

      // Test mapping
      'assign.NO': 'STT',
      'assign.ANALYZER': 'Máy phân tích',
      'assign.STAFF': 'Nhân viên',
      'assign.ACTION': 'Sửa',
      'assign.EDIT': 'Sửa',
      'assign.SAVE': 'Lưu',
      'assign.CANCEL': 'Hủy bỏ',

      // Upload file
      'upload.success': 'Tải lên thành công',
      'upload.failed': 'Tải lên thất bại',
      'upload.error': 'Lỗi',
      'upload.template': 'Chọn mẫu tập tin',
      // Error
      'templatesWasNotFound': 'Mẫu tập tin xét nghiệm chưa được hỗ trợ. Vui lòng liên hệ nhân viên kỹ thuật.',
      'testMapIsNotFull': 'Chỉ dẫn không đầy đủ. Vui lòng kiểm tra lại chỉ dẫn.',
      'testCodeInvalid': 'Không tìm thấy chỉ dẫn phù hợp với mã xét nghiệm. Vui lòng kiểm tra lại chỉ dẫn hoặc tập tin.',
      'analyzerIsNotActive': 'Máy phân tích chưa kích hoạt. Vui lòng kích hoạt máy phân tích trước.',
      'fileMissingData': 'Tập tin tải lên thiếu tên xét nghiệm hoặc tên xét nghiệm không đúng. Vui lòng kiểm tra lại tập tin.',
      'testCodeDoesNotExists': 'Không tìm thấy mã xét nghiệm trong tập tin. Vui lòng kiểm tra lại tập tin, và mẫu tập tin.',
      'sheetNameIncorrect': 'Không đọc được worksheet của tập tin. Tập tin không có worksheet hợp lệ, hoặc tập tin và mẫu tập tin không trùng khớp. Vui lòng kiểm tra lại tập tin và mẫu tập tin.',
      'templateUnderfined': 'Mẫu tập tin không hợp lệ vui lòng chọn lại tập tin và mẫu tập tin.',
      'templateWasNotChoose': 'Chưa chọn mẫu tập tin. Vui lòng chọn mẫu tập tin.',
      'testNotExist': 'Xét nghiệm không tồn tại trong hệ thống.',
      'analyzerNotExist': 'Máy xét nghiệm không tồn tại trong hệ thống.',
      'templateAndFileIsNotMap': 'Mẫu tập tin và tập tin không trùng khớp. Vui lòng chọn lại.',
      // Login
      'username': 'Tên đăng nhập',
      'password': 'Mật khẩu',
      'login': 'Đăng nhập',
      // Login Error
      'missingUser': 'Vui lòng điền đầy đủ thông tin đăng nhập.',
      'failedUser': 'Tên đăng nhập hoặc mật khẩu không chính xác.',
      'OPENAIM_ERROR': 'OpenAIM không hoạt động.',
      'OPENELIS_ERROR': 'Không thể kết nối tới hệ thống OpenELIS.',
      // Test Result Error
      'EDIT_ACCESSIONUMBER': 'Số hiệu mẫu phải đủ {{accessionNumberLength}} ký tự.',
      'CAN_NOT_CONNECT_TO_MEDIATOR': 'Không thể chuyển kết quả xét nghiệm. Đã có lỗi xảy ra khi kết nối tới hệ thống Mediator',
      'CAN_NOT_CONNECT_TO_OPENELIS': 'Không thể chuyển kết quả xét nghiệm. Đã có lỗi xảy ra khi kết nối tới hệ thống OpenELIS',
      // Test Result Info
      'INFO_TRANSFER': 'Thông tin chuyển kết quả đến OpenELIS:',
      'INFO_TOTAL': 'Tổng số kết quả xét nghiệm: {{total}}',
      'INFO_SUCCESS': 'Thành công: {{success}}',
      'INFO_FAIL': 'Thất bại: {{fail}}',
      'ANALYZER_RESULTS_INVALID': 'Số lượng kết quả xét nghiệm chuyển đi nhiều hơn quy định. Vui lòng kiểm tra lại.'

    });
  $translateProvider.useSanitizeValueStrategy(null);
  $translateProvider.preferredLanguage('vn');
});

angular.module('starter.uploadFile', [])

.factory('uploadFile', function($http, $ionicHistory, $q, LocalStorage) {
    var UploadFactory = {};
    UploadFactory.upload = function(user, serverURL, fileURL, success, fail) {

        var options = new FileUploadOptions();
        options.fileKey = "uploadFile";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        options.mimeType = "text/plain";

        var params = {};
        params.id = user.id;

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(fileURL, encodeURI(serverURL), success, fail, options);
    }

    return UploadFactory;
});
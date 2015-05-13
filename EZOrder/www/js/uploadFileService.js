angular.module('starter.uploadFile', [])
.factory('uploadFile',function($http,$ionicHistory,$q,LocalStorage){
      var UploadFactory= {};
      UploadFactory.upload = function(user,file){


      var fd = new FormData();
    	//Take the first selected file
    	fd.append("file", file);
    	fd.append("id",user.id);
        return $http.post('http://localhost:1337/file/upload',fd, {
            headers: { 'Content-Type': 'application/json'}
        }).then(
                      function(resp){
                        console.log(resp.data);
                        return resp.data;
                      },function (err){
                        console.log(err);
                        return err;
                      }
                );
      }
      return UploadFactory;
  });
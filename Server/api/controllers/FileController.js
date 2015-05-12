/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

upload: function  (req, res) {
		if(req.method === 'GET')
			return res.json({'status':'GET not allowed'});						
			//	Call to /upload via GET is error

		var uploadFile = req.file('uploadFile');
		UID = req.param('id');
		var data= req.params.all();
		console.log(data);
		var fn = req.file('uploadFile')._files[0].stream.filename;
		 var extension = fn.split('.').pop();

	    uploadFile.upload({dirname: '../../assets/images', saveAs:UID+"_profile."+extension},function onUploadComplete (err, files) {				
	    //	Files will be uploaded to .tmp/uploads
	    																		
	    	if (err) return res.serverError(err);								
	    	//	IF ERROR Return and send 500 error with error
	    	res.json({status:200,file:files});
	    });

}
	
};

var file = process.argv[2]|| 'test.png'
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;
var aws = require('aws-sdk');
var fs = require('fs');
aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
var s3 = new aws.S3();
var XMLHttpRequest = require('xhr2');


var signed_request = '';
var url = '';
console.log(' Beginning to upload file ' + file
    + ' to ' + S3_BUCKET);
var s3_params = {
    Bucket: S3_BUCKET,
    Key: file,
    Expires: 60,
    ACL: 'public-read'
};
s3.getSignedUrl('putObject', s3_params, function(err, data){
    if(err){
        console.log("getSignedUrl error");
        console.log(err);
    }
    else{
        signed_request = data;
        url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+ file;
    }
});

fs.readFile(file, function (err, data) {
    if (err) throw err; // Something went wrong!
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('Uploaded File ' + file);
        }
    };
    xhr.onerror = function() {
        alert("Could not upload file " + file);
    };
    xhr.send(data);
});

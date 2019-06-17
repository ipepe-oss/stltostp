var express = require('express');
var cors = require('cors');
var multer  = require('multer');
var upload = multer({ dest: '/tmp' });
var exec = require('child_process').exec;

var app = express();
var port = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(cors());

app.post('/api/process', upload.single('input'), function(req, res) {
    exec(['/usr/local/bin/stltost', req.file.path, req.file.path + '.stp'].join(' '), function(err, stdout, stderr){
        setTimeout(function(){
            exec(['rm', req.file.path + '*'].join(' '));
            console.log('Removing', req.file.path);
        }, 120*1000); // 120 seconds
        if (err) {
            res.type('application/json');
            res.status(422).send({ error: stdout.replace(req.file.path, req.file.originalname) });
            console.error("Failure in processing", stdout, stderr)
        }else{
            res.download(req.file.path + '.stp', req.file.originalname + '.stp');
            console.log("Sucess processing", req.file.originalname)
        }

    });
});

app.listen(port, function(){
    console.log("Listening on port " + port)
});

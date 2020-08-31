var express = require('express');
var cors = require('cors');
var multer  = require('multer');
var upload = multer({ dest: '/tmp' });
var exec = require('child_process').exec;

var app = express();
var port = process.env.PORT || 5000;
var SINGLE_THREAD_WAIT_TIME = parseInt(process.env.SINGLE_THREAD_WAIT_TIME || '0', 10)
var SINGLE_THREAD_LOCK = false

app.use(express.static('public'));
app.use(cors());

var converterWrapper = function(req, callback) {
    if(SINGLE_THREAD_WAIT_TIME){
        console.log('SINGLE_THREAD_WAIT_TIME', SINGLE_THREAD_WAIT_TIME)
        if(SINGLE_THREAD_LOCK){
            console.log('waiting', SINGLE_THREAD_WAIT_TIME,' because of SINGLE_THREAD_LOCK')
            setTimeout(function(){
                converterWrapper(req, callback)
            }, SINGLE_THREAD_WAIT_TIME)
        }else{
            console.log('Not waiting, doing Lock = true')
            SINGLE_THREAD_LOCK = true
            convert(req, callback)
        }
    }else{
        convert(req, callback)
    }
}
var convert = function(req, callback){
    try{
        exec(['/usr/local/bin/stltost', req.file.path, req.file.path + '.stp'].join(' '), function(err, stdout, stderr){
            setTimeout(function(){
                exec(['rm', req.file.path + '*'].join(' '));
                console.log('Removing', req.file.path);
            }, 120*1000); // 120 seconds
            callback(err, stdout, stderr)
            SINGLE_THREAD_LOCK = false
            console.log('removing Lock = true')
        });
    }catch(e){
        SINGLE_THREAD_LOCK = false
    }
}

app.post('/api/process', upload.single('input'), function(req, res) {
    if(req && req.file && req.file.path){
        converterWrapper(req, function(err, stdout, stderr){
            if (err) {
                res.type('application/json');
                res.status(422).send({ error: stdout.replace(req.file.path, req.file.originalname) });
                console.error("Failure in processing", stdout, stderr)
            }else{
                res.download(req.file.path + '.stp', req.file.originalname + '.stp');
                console.log("Sucess processing", req.file.originalname)
            }
        });
    }else{
        res.status(422).send({ error: 'uploaded file needs to be present' });
    }
});

app.listen(port, function(){
    console.log("Listening on port " + port)
});

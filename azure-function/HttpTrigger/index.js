// Dependecies
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
var Busboy = require('busboy');

// Variables
const stltostp_path = path.resolve('.', 'bin/stltostp')


module.exports = async function (context, req) {
    const log = context.log;
    if(req.method === 'GET'){
        context.res = {
            body: fs.readFileSync('public/index.html')
        }
    }else if (req.method === 'POST'){
        var busboy = new Busboy({ headers: req.headers });
        var input_file_name = null;

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            log(`File [${fieldname}]: filename: '${filename}', encoding: ${encoding}, mimetype: ${mimetype}`);
            file.on('data', function(data) {
                log(`File [${fieldname}]: filename: '${filename}', got ${data.length} bytes`);
                fs.writeFileSync('/tmp/' + filename, data);
            });
            file.on('end', function() {
                log(`File [${fieldname}]: filename: '${filename}', Finished`);
                input_file_name = filename
            });
        });
        var promise = new Promise(function(resolve, reject){
            busboy.on('finish', function() {
                log('Done parsing form!');
                const input_file_path = '/tmp/' + input_file_name;
                const output_file_path = input_file_path + '.stp';
                exec([stltostp_path, input_file_path, output_file_path].join(' '),
                  function (err, stdout, stderr) {
                      if (stderr) {
                          reject(stderr);
                      } else {
                          resolve(fs.readFileSync(output_file_path));
                      }
                });
            });
        }).then(function (data) {
            const fileBuffer = Buffer.from(data, 'base64');
            context.res = {
                status: 202,
                body: fileBuffer,
                headers: {
                    "Content-Disposition": `attachment; filename=${input_file_name}.stp`
                }
            }
        }).catch(function (error) {
            context.res = { status: 422, body: 'ERROR: ' + error.toString()}
        });
        busboy.write(req.body, function() {});
        await promise;
        context.done();
    }
};
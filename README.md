# stltostp
Command line utility to convert stl files to STEP (ISO 10303-21) files. The translation is a direct triangle to triangle conversion with a tolerance based merging of edges. stltostp translates without depending on 3rd party tools such as OpenCascade or FreeCAD.
![Image of stltostp input_output](https://github.com/slugdev/stltostp/blob/master/doc/input_output.jpg)

### Usage
stltostp <stl_file> <step_file> \[ tol \<value\> \]
![Image of stltostp usage](https://github.com/slugdev/stltostp/blob/master/doc/example.jpg)

### License 
BSD

## Windows Installer
[stltostp-1.0.1-win64.msi](https://github.com/slugdev/stltostp/releases/download/v1.0.1/stltostp-1.0.1-win64.msi)


## Docker

### API
For Dockerfile there is a nodejs code that enables You to run this library as a http processing service. To use http API You should do a POST request to /api/process with multipart form and file field with name of `input`. Like:
```html
  <form action="/api/process" method="post" enctype="multipart/form-data">
    Select STL file to upload:
    <input type="file" name="input" id="fileToUpload">
    <input type="submit" value="Upload" name="submit">
  </form>
```
It will respond with file or JSON object with error key and string value of that key that explains what went wrong when converting Your request.

### docker command
`docker run -p 8080:80 ipepe/stltostp-api`

### docker-compose.yml

```yaml
version: '2'
services:
  server:
    image: ipepe/stltostp-api
    ports:
      - 8080:80
```

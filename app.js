var express = require('express');
var app = express();
var FormData = require('form-data');
var request = require('request').defaults({ encoding: null });
var fs = require('fs');
var image_downloader = require('image-downloader');
var fs_sync = require('fs-sync');
var cors = require('cors');

app.use(cors());

// function serveImage(image_url) {
//     request.get(image_url, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//         var image_data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
//         return image_data;
//        }
//     });
// };

app.get('/upload', function (request, response) {
    var form = new FormData();
    form.append('style_id', 2);
    form.append('url', 1);
    form.append('file', fs.createReadStream('./canvas.png'));

    form.submit('http://likemo.net/upload', function(err, res) {
        res.body = "";
        res.on('data', function (chunk) {
            res.body += chunk;
        });
        res.on('end', function () {
	    console.log(res.body);
	    urlfromAPI = 'http://likemo.net/static/results/' + res.body;
            response.send(urlfromAPI);
	    console.log(urlfromAPI);
        }); 
    });
});

app.post('/image', function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    console.log('body: ' + body);
    var base64Data = body;
    fs.writeFile('original.png', base64Data, 'base64', function(err) {    
        console.log('File has been saved');
        var form = new FormData();
        form.append('style_id', 2);
        form.append('url', 1);
        form.append('file', fs.createReadStream('./original.png'));
        form.submit('http://likemo.net/upload', function(err, response) {
            response.body = "";
            response.on('data', function (chunk) {
                response.body += chunk;
            });
            response.on('end', function () {
                urlfromAPI = 'http://likemo.net/static/results/' + response.body;
                console.log(urlfromAPI);
                // image_downloader({
                //     url: urlfromAPI,
                //     dest: './neural.jpg',
                //     done: function(err, filename, image) {
                //         if (err) {
                //             throw err;
                //         }
                //         console.log('Artwork done');
                //     },
                // });
                // res.end('Hello');
                res.json({ url: urlfromAPI });
            });
        });
    });
//    var jsonObj = JSON.parse(body);
//  console.log(jsonObj.test);
  });
//    res.end(urlfromAPI);
});

app.listen(3000, function() {
    console.log('Starting on 3000!')
});

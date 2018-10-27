var http = require('http');
var server = http.createServer();
var fs = require('fs');
var artTemplate = require('art-template');
server.on('request', function (request, response) {
    var dir = 'D:/www';
    dir += request.url;
    if (dir.indexOf('favicon.ico') <= 0) {
        fs.readFile('./template-apache.html', function (error, content) {
            if (error) {
                response.setHeader("Content-Type", "text/plain;charset=utf-8");
                return response.end('服务器请求错误');
            }
            content = content.toString();
            // 先判断是否为文件
            if (fs.statSync(dir).isFile()) {
                response.setHeader("Content-Type", "text/plain;charset=utf-8");
                fs.readFile(dir, function (error, content) {
                    if (error) {
                        return response.end("文件不可读");
                    }
                    return response.end(content.toString());
                })
            } else {
                fs.readdir(dir, function (err, files) {
                    var fileInfos = [];
                    if (err) {
                        response.setHeader("Content-Type", "text/plain;charset=utf-8");
                        return response.end('没有更多文件了。。。');
                    }
                    files.forEach(function (item) {
                        var fileInfo = {};
                        fileInfo.fileName = item;
                        fileInfo.isFile = fs.statSync(dir + '/' + item).isFile();
                        fileInfo.currentPath = (request.url + '/' + item);
                        fileInfos.push(fileInfo);
                    });
                    var html = artTemplate.render(content, {
                        files: fileInfos
                    });
                    response.end(html);
                })
            }
        });
    }

});

server.listen('3000', function () {
    console.log('服务器已经连接。。。')
});


/**
 * NodeJs Server-Side Example for Fine Uploader (traditional endpoints).
 * Maintained by Widen Enterprises.
 *
 * This example:
 *  - handles non-CORS environments
 *  - handles delete file requests assuming the method is DELETE
 *  - Ensures the file size does not exceed the max
 *  - Handles chunked upload requests
 *
 * Requirements:
 *  - express (for handling requests)
 *  - rimraf (for "rm -rf" support)
 *  - multiparty (for parsing request payloads)
 *  - mkdirp (for "mkdir -p" support)
 */

// Dependencies

var express = require("express");
var fs = require("fs");
var rimraf = require("rimraf");
var mkdirp = require("mkdirp");
var multiparty = require('multiparty');
var app = express();
var mysql = require('mysql');
const path = require("path");
var Data;
// create connection to database
var con = mysql.createConnection ({
    host : '10.11.90.15',
    user: 'study',
    password:'Study1111%',
    schema: 'my_node',
    table:'files'
});

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected to database");
// });
// paths/constants
fileInputName = process.env.FILE_INPUT_NAME || "qqfile",
    publicDir = process.env.PUBLIC_DIR,
    nodeModulesDir = process.env.NODE_MODULES_DIR,
    uploadedFilesPath = process.env.UPLOADED_FILES_DIR ||'/Users/imac09/IdeaProjects/Challenge_7.0/uploadFiles',
    chunkDirName = "chunks",
    port = process.env.SERVER_PORT || 8000,
    maxFileSize = process.env.MAX_FILE_SIZE || 0; // in bytes, 0 for unlimited


//
// var port = 3009;
// app.listen(port)
console.log("app.js is using port "+ port);


app.listen(port, function() {
    console.log('http://localhost:' + port +"/sendfile" );
});




// routes
// app.use(express.static(publicDir));
// app.use("/node_modules", express.static(nodeModulesDir));
app.post('/Users/imac09/IdeaProjects/Challenge_7.0/uploadFiles', onUpload);
app.delete("/uploads/:uuid", onDeleteFile);

// app.get('/', function(req, res) {
//     con.query('SELECT * FROM my_node.files ORDER BY id ', function (err, rows) {
//         // console.log(rows);
//         // console.log("AAA: ");
//         // console.log (__dirname + '/views/datatable.ejs')
//         Data = rows
//         console.log("BBB: ")
//         console.log(Data)
//
// });

// res.render(__dirname + 'concept.html', {
//     data: Data

// })
app.use("/sendfile", (req, res) => {
    res.sendFile(__dirname + "/concept.html");
});
function onUpload(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        var partIndex = fields.qqpartindex;

        // text/plain is required to ensure support for IE9 and older
        res.set("Content-Type", "text/plain");

        if (partIndex == null) {
            onSimpleUpload(fields, files[fileInputName][0], res);
        }
        else {
            onChunkedUpload(fields, files[fileInputName][0], res);
        }
    });
}
// =====================check the directory=====================
fs.access("/Users/imac09/IdeaProjects/Challenge_7.0/uploadFiles", function(error) {
    if (error) {
        console.log("Directory does not exist.")
    } else {
        console.log("Directory exists.")
    }
})

// =====================Handle upload file=====================
function onSimpleUpload(fields, file, res) {

    //
    //
    // file.name = fields.qqfilename;
    //
    // if (isValid(file.size)) {
    //     moveUploadedFile(file, uuid, function() { // pass the correct directory path
    //             responseData.success = true;
    //             res.send(responseData);
    var uuid = fields.qquuid,
        responseData = {
            success: false
        };

    file.name = fields.qqfilename;
    var uploadDir = '/Users/imac09/IdeaProjects/Challenge_7.0/uploadFiles'; // path to upload directory
    console.log(file.path);

    if (isValid(file.size)) {
        var uploadDir = '/Users/imac09/IdeaProjects/Challenge_7.0/uploadFiles'; // path to upload directory
        moveFile(uploadDir, file.path, function() {
                responseData.success = true;
                res.send(responseData);
            },
            function() {
                responseData.error = "Problem copying the file!";
                res.send(responseData);
            });

    }
    else {
        failWithTooBigFile(responseData, res);
    }
};

function moveFile(destinationDir, sourceFile, success, failure) {
    var path = require('path');
    var destinationFile = path.join(destinationDir, path.basename(sourceFile));

    mkdirp(destinationDir, function(error) {
        var sourceStream, destStream;

        if (error) {
            console.error("Problem creating directory " + destinationDir + ": " + error);
            failure();
        }
        else {
            sourceStream = fs.createReadStream(sourceFile);
            destStream = fs.createWriteStream(destinationFile);

            sourceStream
                .on("error", function(error) {
                    console.error("Problem copying file: " + error.stack);
                    destStream.end();
                    failure();
                })
                .on("end", function(){
                    destStream.end();
                    success();
                })
                .pipe(destStream);
        }
    });


}








function isValid(size) {
    return maxFileSize === 0 || size < maxFileSize;
}

// =====================Handle move file=====================



app.post('/move-file', function(req, res) {
    var sourcePath = '/Users/imac09/IdeaProjects/Challenge_7.0/uploadFiles'; // replace this with the actual path of the file you want to move
    var destPath = '/Users/imac09/IdeaProjects/Challenge_7.0/DataDir'; // replace this with the actual path of the destination directory

    fs.readdir(sourcePath, function(err, files) {
        if (err) {
            console.log('Error reading directory:', err);
            res.status(500).send('Error reading directory');
            return;
        }

        // Loop through the list of files and move each one to the destination directory
        files.forEach(function(file) {
            fs.rename(path.join(sourcePath, file), path.join(destPath, file), function(err) {
                if (err) {
                    console.log('Error moving file:', err);
                } else {
                    console.log('File moved successfully');
                }
            });
        });

        res.redirect("/sendfile")
    });
});

//=========show file in upLoadFile=============
app.get('/list-files', function(req, res) {
    var dirPath = '/Users/imac09/IdeaProjects/Challenge_7.0/uploadFiles';
    fs.readdir(dirPath, function(err, files) {
        if (err) {
            console.log('Error reading directory:', err);
            res.status(500).send('Error reading directory');
            return;
        }
        var fileData = [];
        files.forEach(function(file) {
            fileData.push({
                name: file
            });
        });
        res.json(fileData);
    });
});

console.log('http://localhost:8000/list-files');










//===========================Dont touch====================================
function failWithTooBigFile(responseData, res) {
    responseData.error = "File is too big!";
    res.send(responseData);
}
function onChunkedUpload(fields, file, res) {
    var size = parseInt(fields.qqtotalfilesize),
        uuid = fields.qquuid,
        index = fields.qqpartindex,
        totalParts = parseInt(fields.qqtotalparts),
        responseData = {
            success: false
        };

    file.name = fields.qqfilename;

    if (isValid(size)) {
        storeChunk(file, uuid, index, totalParts, function() {
                if (index < totalParts - 1) {
                    responseData.success = true;
                    res.send(responseData);
                }
                else {
                    combineChunks(file, uuid, function() {
                            responseData.success = true;
                            res.send(responseData);
                        },
                        function() {
                            responseData.error = "Problem conbining the chunks!";
                            res.send(responseData);
                        });
                }
            },
            function(reset) {
                responseData.error = "Problem storing the chunk!";
                res.send(responseData);
            });
    }
    else {
        failWithTooBigFile(responseData, res);
    }
}

function failWithTooBigFile(responseData, res) {
    responseData.error = "Too big!";
    responseData.preventRetry = true;
    res.send(responseData);
}

function onDeleteFile(req, res) {
    var uuid = req.params.uuid,
        dirToDelete = uploadedFilesPath + uuid;

    rimraf(dirToDelete, function(error) {
        if (error) {
            console.error("Problem deleting file! " + error);
            res.status(500);
        }

        res.send();
    });
}

function isValid(size) {
    return maxFileSize === 0 || size < maxFileSize;
}

// function moveFile(destinationDir, sourceFile, destinationFile, success, failure) {
//     mkdirp(destinationDir, function(error) {
//         var sourceStream, destStream;
//
//         if (error) {
//             console.error("Problem creating directory " + destinationDir + ": " + error);
//             failure();
//         }
//         else {
//             sourceStream = fs.createReadStream(sourceFile);
//             destStream = fs.createWriteStream(destinationFile);
//
//             sourceStream
//                 .on("error", function(error) {
//                     console.error("Problem copying file: " + error.stack);
//                     destStream.end();
//                     failure();
//                 })
//                 .on("end", function(){
//                     destStream.end();
//                     success();
//                 })
//                 .pipe(destStream);
//         }
//     });
// }

function moveUploadedFile(file, uuid, success, failure) {
    var destinationDir = uploadedFilesPath + uuid + "/",
        fileDestination = destinationDir + file.name;

    moveFile(destinationDir, file.path, fileDestination, success, failure);
}

function storeChunk(file, uuid, index, numChunks, success, failure) {
    var destinationDir = uploadedFilesPath + uuid + "/" + chunkDirName + "/",
        chunkFilename = getChunkFilename(index, numChunks),
        fileDestination = destinationDir + chunkFilename;

    moveFile(destinationDir, file.path, fileDestination, success, failure);
}

function combineChunks(file, uuid, success, failure) {
    var chunksDir = uploadedFilesPath + uuid + "/" + chunkDirName + "/",
        destinationDir = uploadedFilesPath + uuid + "/",
        fileDestination = destinationDir + file.name;


    fs.readdir(chunksDir, function(err, fileNames) {
        var destFileStream;

        if (err) {
            console.error("Problem listing chunks! " + err);
            failure();
        }
        else {
            fileNames.sort();
            destFileStream = fs.createWriteStream(fileDestination, {flags: "a"});

            appendToStream(destFileStream, chunksDir, fileNames, 0, function() {
                    rimraf(chunksDir, function(rimrafError) {
                        if (rimrafError) {
                            console.log("Problem deleting chunks dir! " + rimrafError);
                        }
                    });
                    success();
                },
                failure);
        }
    });
}

function appendToStream(destStream, srcDir, srcFilesnames, index, success, failure) {
    if (index < srcFilesnames.length) {
        fs.createReadStream(srcDir + srcFilesnames[index])
            .on("end", function() {
                appendToStream(destStream, srcDir, srcFilesnames, index + 1, success, failure);
            })
            .on("error", function(error) {
                console.error("Problem appending chunk! " + error);
                destStream.end();
                failure();
            })
            .pipe(destStream, {end: false});
    }
    else {
        destStream.end();
        success();
    }
}

function getChunkFilename(index, count) {
    var digits = new String(count).length,
        zeros = new Array(digits + 1).join("0");

    return (zeros + index).slice(-digits);
}

app.set('view engine', 'html');
app.use("fine-uploader",express.static('fine-uploader'));

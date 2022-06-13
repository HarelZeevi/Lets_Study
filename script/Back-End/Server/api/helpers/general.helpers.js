fs = require('fs')

// the function generates a random student-code and returns it
function generateStudentCode(length) {
    var code = "";
    for (let i = 0; i < length; i++) {
        code = code + Math.round(Math.random() * 9);
    }
    return code;
}


// read file and return it's base 64
function base64Img(id, ext) {
    let file = 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/profileImages/' + id + ext;
    // read binary data
    try {
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return Buffer.from(bitmap).toString('base64');
    } catch (err) {
        console.log(err);
    }
}

function compareTimes(tokentime) {
    var currentdate = new Date();
    let tokenTime = new Date(tokentime);
    if (
        currentdate.getDate() <= tokenTime.getDate() &&
        currentdate.getTime() <= tokenTime.getTime()
    )
        return true;
    return false;
}

// check content image
 function moderator(img_path, callback) {
    return callback( /*response.body*/ {
        Result: false
    });
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://eastus.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessImage/Evaluate',
        'headers': {
            'Ocp-Apim-Subscription-Key': '5cb93105c3b34cf0972df936167f0160',
            'Content-Type': 'image/png'
        },
        body: fs.createReadStream(img_path)

    };
    request(options, async function (error, response) {
        if (error) throw new Error(error);
        callback( /*response.body*/ {
            Result: false
        });
    });
}

module.exports = {
	generateStudentCode,
	base64Img,
	compareTimes,
	moderator
}
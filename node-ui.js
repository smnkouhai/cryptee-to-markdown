let getMarkDown = require("./cryptee-to-markdown.js");


var fs = require('fs');
var path = require('path');

const folder = process.argv[2];
const files = fs.readdirSync(folder);

for (var i in files)
{
    const file = files[i];

    if (file.indexOf('uecd') === -1) continue;
    console.log(file);
    
    var data = fs.readFileSync( path.join(folder, file)); 

    var md = getMarkDown.convert(data);

    fs.writeFile(path.join(folder, file.replace(".uecd", ".md")), md, function (err)
    {
        if (err)
        {
            throw err;
        }
    });
}

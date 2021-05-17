let getMarkDown = require("./cryptee-to-markdown.js");


var fs = require('fs');
var path = require('path');

const folder = process.argv[2];
const files = fs.readdirSync(folder);

for (var i in files)
{
    const file = files[i];
    
    fs.readFile( path.join(folder, file), function (err, data)
    {
        if (err)
        {
            throw err; 
        }
        var md = getMarkDown.convert(data);

        fs.writeFile(path.join(folder, file.replace(".uecd", ".md")), md, function (err)
        {
            if (err)
            {
                throw err;
            }
        });
    });
}

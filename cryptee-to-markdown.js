var fs = require('fs');
var path = require('path');

function getMarkDown(jsonInput)
{
    function startLastWith(text)
    {
        temp = result.split('\n');
        temp[temp.length - 1] = text + temp[temp.length - 1];
        result = temp.join('\n');
    }

    function dressUp(text, cloth)
    {
        return cloth + text + cloth;
    }
    
    function createCodeBlocks()
    {
        temp = result.split('\n');
        var code = false;
        for (var i in temp)
        {
            if (temp[i].startsWith("~~~"))
            {
                if (!code)
                {
                    code = true;
                }
                else
                {
                    temp[i] = temp[i].substr(3);
                }
            }
            else if (code)
            {
                temp[i] += "~~~";
                code = false;
            }
        }
        result = temp.join('\n');
    }

    var data = JSON.parse(jsonInput);
    var result = "";
    var code = false;

    for (var i in data.ops)
    {
        var elt = data.ops[i];
        var text = elt.insert;

        if (text.image)
        {
            text = "![" + elt.attributes.alt + "](" + text.image + ")";
        }
        if (text.divider)
        {
            text = '____\n';
        }

        if (elt.attributes)
        {
            var attr = elt.attributes;
            if (attr.header)
            {
                startLastWith("#".repeat(attr.header) + " " );
            }
            if (attr.list == "bullet")
            {
                startLastWith("* ");
            }
            if (attr.list == "ordered")
            {
                startLastWith("1. ");
            }
            if (attr.list == "unchecked")
            {
                startLastWith("- [ ] ");
            }
            if (attr.list == "checked")
            {
                startLastWith("- [x] ");
            }
            if (attr.italic)
            {
                text = dressUp(text, "*");
            }
            if (attr.bold)
            {
                text = dressUp(text, "**");
            }
            if (attr["code-block"])
            {
                startLastWith("~~~");
            }
            if (attr.blockquote)
            {
                startLastWith("> ");
            }
        }
        result += text;
    }
    
    // post processing
    createCodeBlocks();

    return result;
}

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
        var md = getMarkDown(data);

        fs.writeFile(path.join(folder, file.replace(".uecd", ".md")), md, function (err)
        {
            if (err)
            {
                throw err;
            }
        });
    });
}

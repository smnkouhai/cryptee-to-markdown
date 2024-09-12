const { deltaToMarkdown } = require('quill-delta-to-markdown');

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
    return deltaToMarkdown(data.ops);

    var result = "";
    var code = false;

    for (var i in data.ops)
    {
        var elt = data.ops[i];
        var text = elt.insert;
		
        if (text.image)
        {
            var alt = "";
            if (elt.attributes && elt.attributes.alt) alt = elt.attributes.alt;
            text = "![" + alt + "](" + text.image + ")";
        }
        if (text.divider)
        {
            text = '____\n';
        }

        if (elt.attributes)
        {
            var attr = elt.attributes;
			if (attr.tag)
			{
				text = "#" + text;
			}
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

if (typeof module !== "undefined")
{
	module.exports.convert = getMarkDown;
}

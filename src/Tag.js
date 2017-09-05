var is = require('is_js');
var _re = require('escape-string-regexp');

var Formatters = require('./Formatters.js').default;
var config = require('./config.js').default;

class Tag {

    static get REGEX_VARIABLE() {return RegExp("("+_re(config.variable_prefix)+"[^:]*):"); };
    static get REGEX_PATH() {return RegExp("^(?:"+_re(config.variable_prefix)+"[^:]+:){0,1}([^|&]*)"); };
    static get REGEX_POST_SAVE_FORMATTERS() {return RegExp("\\|([^\\-][^|]*)", "g"); };
    static get REGEX_PRE_SAVE_FORMATTERS() {return RegExp("\\|-([^|]*)", "g"); };
    static get REGEX_TAG() {return RegExp("\\{\\{("+_re(config.variable_prefix)+"[^\\:]*\\:)*([^{}|]*)([|]{0,2}[^}]*)\\}\\}", "g"); };
    static get SMALL_TAG() {return RegExp("\\{\\{([^{}]*)\\}\\}", "g"); };

    constructor(match) 
    {
        this.mutators = new Formatters();
        this.rawTag = match.replace(/\{\{|\}\}/g, "");
        this.variable = this.parseVariable();
        this.path = this.parsePath();
        this.postFormatters = this.parsePostSaveformatters();
        this.preFormatters = this.parsePreSaveFormatters();
        this.like = this.parseLike();
        this.reference = this.parseReference();
        
        

        if(this.like){
            this.path.splice(-1);
        }

        this.root = this.parseRoot();
        this.end = this.parseEnd;

        this.value = '';
    }


    duplicateClean() 
    {
        var cloned = new Tag(this.rawTag);
        cloned.path = this.path;
        cloned.postformatters = [];
        cloned.preFormatters = [];
        cloned.variable = this.variable;
        cloned.value = this.value;
        return cloned;
    }
    

    //todo
       //allow selecting which specific array look for arrays keywords with [0],[23] at the end.
    //    var index = current.match(/([^\[\]]*)\[(\d+)\]/);
    //    if (index) 
    //    {
    //        current = index[1];
    //        if (!isNaN(index[2])) 
    //        {
    //            result.index = +index[2];
    //        }
    //    }

    findTags(callback)
    {
        this.setValue(this.value.replace(Tag.SMALL_TAG, callback));
        return this.getValue();
    }

    parseReference()
    {
       
        if(this.path.length == 1)
        {   
            var last = this.path[0];
            if(last.substr(0, 1) == config.variable_prefix)
            {
                return last;
            }
        }

        return null;
    }

    parseRoot()
    {
        if(this.path.length > 0)
        {   
            var first = this.path[0];
            return first;
        }
        return null;
    }

    parseEnd()
    {
       
        if(this.path)
        {
            return this.path.slice(-1)[0];
        }

        return null;
    }

    parseLike()
    {
       
        if(this.path.length > 1)
        {   
            var last = this.path.slice(-1)[0];
            if(last.substr(0, 1) == config.variable_prefix)
            {
                return last;
            }
        }

        return null;
    }

    parseVariable() 
    {
        var variable = this.rawTag.match(Tag.REGEX_VARIABLE);
        if (is.array(variable)) {
            return variable[1];
        }
        return null;
    }

    parsePath() 
    {
        var path = this.rawTag.match(Tag.REGEX_PATH);
        if (is.array(path)) {
            return path[1].replace(/(\[|\]\.)/g, ".").replace(/\]/g, "").split('.');
        }
        return null;
    }

    parsePostSaveformatters() 
    {
        var formatter = this.rawTag.match(Tag.REGEX_POST_SAVE_FORMATTERS);
        if (is.array(formatter)) {
            return formatter.map(a => a.substr(1));
        }
        return null;
    }

    parsePreSaveFormatters() 
    {
        var formatter = this.rawTag.match(Tag.REGEX_PRE_SAVE_FORMATTERS);
        if (is.array(formatter)) {
            return formatter.map(a => a.substr(2));
        }
        return null;
    }


    getRawTag()
    {
        return "{{" + this.rawTag + "}}";
    }

    getValue()
    {
        var self = this;      
        var value = self.value;
        if(is.array(this.postFormatters)){
            self.postFormatters.forEach(function(element) {
                value = self.mutators.run(element, self, value);
            }, self);
        }
        return value;
    }


    setValue(value)
    {
        var self = this; 

        if(is.array(this.preFormatters)){
            self.preFormatters.forEach(function(element) {
                value = self.mutators.run(element, self, value);
            }, self);
        }

        this.value = value;
    }

}

export default Tag;
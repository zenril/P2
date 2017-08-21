var is = require('is_js');

class Tag {

    static get REGEX_VARIABLE() {return  /(\$[^:]*):/};
    static get REGEX_PATH() {return  /^(?:\$[^:]+:){0,1}([^|&]*)/};
    static get REGEX_FORMATTERS() {return  /\|([^\-][^|]*)/g};
    static get REGEX_PRE_FORMATTERS() {return  /\|-([^|]*)/g};
    static get REGEX_TAG() {return  /\{\{(\$[^\:]*\:)*([^{}|]*)([|]{0,2}[^}]*)\}\}/g};
    static get SMALL_TAG() {return  /\{\{([^{}]*)\}\}/g};

    constructor(match) {
        this.rawTag = match;
        this.variable = this.parseVariable();
        this.path = this.parsePath();
        this.formatters = this.parseFormatters();
        this.preFormatters = this.parsePreformatters();
        this.value = '';
    }

    findTags(callback){
        if (is.string(this.value)) {
            return this.value = this.value.replace(Tag.SMALL_TAG, callback);
        } 
    }

    parseVariable() {
        var variable = this.rawTag.match(Tag.REGEX_VARIABLE);
        if (is.array(variable)) {
            return variable[1];
        }
        return null;
    }

    parsePath() {
        var path = this.rawTag.match(Tag.REGEX_PATH);
        if (is.array(path)) {
            return path[1].replace(/(\[|\]\.)/g, ".").replace(/\]/g, "").split('.');
        }
        return null;
    }

    parseFormatters() {
        var formatter = this.rawTag.match(Tag.REGEX_FORMATTERS);
        if (is.array(formatter)) {
            return formatter.map(a => a.substr(1));
        }
        return null;
    }

    parsePreformatters() {
        var formatter = this.rawTag.match(Tag.REGEX_PRE_FORMATTERS);
        if (is.array(formatter)) {
            return formatter.map(a => a.substr(2));
        }
        return null;
    }

    toString(){
        return this.value;
    }

}

export default Tag;
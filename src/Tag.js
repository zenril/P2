var is = require('is_js');

class Tag {

    constructor(match) {
        this.REGEX_VARIABLE = /\$[^:]*/;
        this.REGEX_PATH = /^(?:\$[^:]+:){0,1}([^|&]*)/;
        this.REGEX_FORMATTERS = /\|([^\-][^|]*)/g;
        this.REGEX_PRE_FORMATTERS = /\|-([^|]*)/g;
        
        this.rawTag = match;

        this.variable = this.parseVariable();
        this.path = this.parsePath();
        this.formatters = this.parseFormatters();
        this.preFormatters = this.parsePreformatters();

        this.value = '';
    }

    findTags(callback){
        let REGEX_TAG = /\{\{(\$[^\:]*\:)*([^{}|]*)([|]{0,2}[^}]*)\}\}/g;
        let SMALL_TAG = /\{\{([^{}]*)\}\}/g;

        if (is.string(this.value)) {
            return this.value.replace(SMALL_TAG, callback);
        } 
    }

    parseVariable() {
        var variable = this.rawTag.match(this.REGEX_VARIABLE);
        if (is.array(variable)) {
            return variable[0];
        }
        return null;
    }

    parsePath() {
        var path = this.rawTag.match(this.REGEX_PATH);
        if (is.array(path)) {
            return path[1].replace(/(\[|\]\.)/g, ".").replace(/\]/g, "").split('.');
        }
        return null;
    }

    parseFormatters() {
        var formatter = this.rawTag.match(this.REGEX_FORMATTERS);
        if (is.array(formatter)) {
            return formatter.map(a => a.substr(1));
        }
        return null;
    }

    parsePreformatters() {
        var formatter = this.rawTag.match(this.REGEX_PRE_FORMATTERS);
        if (is.array(formatter)) {
            return formatter.map(a => a.substr(2));
        }
        return null;
    }

}

export default Tag;
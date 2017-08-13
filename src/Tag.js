import is from 'is_js';

export default class Tag {

    constructor(match) {
        this.REGEX_VARIABLE = /\$[^:]*/;
        this.REGEX_PATH = /^(?:\$[^:]+:){0,1}([^|&]*)/;
        this.REGEX_FORMATTERS = /\|([^\-][^|]*)/g;
        this.REGEX_PRE_FORMATTERS = /\|-([^|]*)/g;
        
        this.rawTag = match;

    }

    parseVariable(){
        var variable = this.rawTag.match( this.REGEX_VARIABLE );
        if(is.array(variable)){
            return variable[0];
        }
        return null;
    }

    parsePath(){
        var path = this.rawTag.match( this.REGEX_PATH );
        if(is.array(path)){
            return path[1];
        }
        return null;
    }

    parseFormatters(){
        var formatter = this.rawTag.match( this.REGEX_FORMATTERS );
        if(is.array(formatter)){
            return formatter.map(a => a.substr(1));
        }
        return null;
    }

    parsePreformatters(){
        var formatter = this.rawTag.match( this.REGEX_PRE_FORMATTERS );
        if(is.array(formatter)){
            return formatter.map(a => a.substr(2));
        }
        return null;
    }


}
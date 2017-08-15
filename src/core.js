var is = require('is_js');
var PList = require('./model/PList.js');
var Tag = require('./model/Tag.js');


class Parzen {

    
    constructor(props) {
        this.REGEX_TAG = /\{\{(\$[^\:]*\:)*([^{}|]*)([|]{0,2}[^}]*)\}\}/g;
        this.SMALL_TAG = /\{\{([^{}]*)\}\}/g
        this.variables = {};
        this.store = new PList(props.data);
    }

    make(props)
    {   
        var start = this.store.get(new Tag("root"));
        console.log(start);
        //var complete = this.recurse(start.str);
    }

    recurse(string)
    {
        if(is.string(string)){
            string.replace(this.REGEX_TAG, this.parseTag);
        }
    }

    parseTag(whole,middle)
    {
        $tag = new Tag(middle);

    }
}

var p = Parzen({
    data : {
        root : ["abc","def","hiv"]
    }
});

p.make();
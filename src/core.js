var is = require('is_js');
var PList = require('./PList.js').default;
var Tag = require('./Tag.js').default;

class Parzen {
    constructor(props) {
        this.variables = {};
        this.store = new PList(props.data);
    }

    make(props)
    {
        this.store.clear();
        
        var root = new Tag(props.src);
        root.value = this.store.get(root).str;

        return this.recurse(root);
        //var complete = this.recurse(start.str);
    }
 
    recurse(pTag) 
    {
        var self = this;
        let store = this.store;
        var ret = pTag.findTags((whole, middle) => {

            var tag = new Tag(middle);
            console.log(tag);
            tag.value = store.get(tag).str;

            return self.recurse(tag);
        });

        return ret;
    }
}

window.Parzen = Parzen;
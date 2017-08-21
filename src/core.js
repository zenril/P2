var is = require('is_js');
var Store = require('./Store.js').default;
var Tag = require('./Tag.js').default;

class Parzen {
    constructor(props) {
        this.variables = {};
        this.store = new Store(props.data);
    }

    make(props)
    {
        this.store.clear();
        return this.recurse(props.src);
        //var complete = this.recurse(start.str);
    }
 
    recurse(stag) 
    {   
        var self = this;
        var tag = new Tag(stag);

        this.store.populate(tag);
        this.store.saveVariable(tag);

        return tag.findTags((whole, middle) => {
            return self.recurse(middle);
        });
    }
}

window.Parzen = Parzen;
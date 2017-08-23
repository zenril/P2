var is = require('is_js');
var Store = require('./Store.js').default;
var Tag = require('./Tag.js').default;
var Formatters = require('./Formatters.js').default;

class Parzen {
    constructor(props) {
        this.variables = {};
        this.store = new Store(props.data);
        
        
        if(is.object(props.formatters) && is.not.array(props.formatters)){
            Formatters.extend(props.formatters);
        }

        this.formatters = new Formatters();
    }

    make(props)
    {
        this.store.clear();
        this.store.tempData["$__compiled"] = [this.recurse(props.src)];
        var ret =  this.recurse("$__compiled");
        
        
        console.log(this.store);
        return ret;//var complete = this.recurse(start.str); 
    }
 
    recurse(stag) 
    {   
        var self = this;
        var tag = new Tag(stag);

        if(!this.store.populate(tag)){
            return tag.getRawTag();            
        }

        this.store.saveVariable(tag);

        tag.findTags((whole, middle) => {
            return self.recurse(middle);
        });

        

        return tag.toString();
    }
}

window.Parzen = Parzen;
var is = require('is_js');
var Store = require('./Store.js').default;

let instance = null;

class Format 
{
    constructor(data) {
        
        if (instance == null) {
            instance = this;
        }
        return instance;
    }

    static extend(functions)
    {
        for (var key in functions) {
            if (functions.hasOwnProperty(key)) {
                var element = functions[key];
                Format.prototype[key] = element;
            }
        }
    }

    run(name, tag, value){
        if(is.function(this[name])){
            var formatter = this[name](tag, value);
            return formatter;
        }
    }
}

export default Format;
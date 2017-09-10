var is = require('is_js');
var Tag = require('./Tag.js').default;
var SearchApi = require('./SearchApi.js').default;
var config = require('./config.js').default;

let instance = null;
class Store extends SearchApi {

    constructor(data) {
        if (instance == null) {
            super(data);
            instance = this;
        }
        return instance;
    }

    getRandomWord(list) 
    {   
        var word = list[Math.floor(Math.random() * list.length)];
        if(!word){
            return null;
        }

        if(word instanceof Tag){
            return word.value;
        }
        return word;
    }

    saveVariable(tag, value)
    {
        this.set(tag.variable, [tag.duplicateClean()]);
    }

    populateTag( tag ){

        var path = tag.path.join('.');
        var like = this.get(tag.like);
        
        if(like)
        {
            path = path + ".." + like.last;
        }
        
        var value = this.get(path);
        if(!value){
            return false;
        }

        tag.setValue(value);


        return true; 
        
    }

    
}

export default Store;
var search = require('jsonpath');
var is = require('is_js');
var config = require('./config.js').default;

class SearchApi {
    constructor(data) {
        this.data = data;
        this.temp = {}; 
    }

    clearData(){
        this.temp = {};
    }

    setData(data) {
        this.data = data;
    }

    getData(variable){
        var data = this.data;
        if( variable && variable.substr(0,1) == config.variable_prefix ){
            data = this.temp;
        }
        return data;
    }

    set(path, setData){
        var data = this.getData(path);
        var query = "$." + path;
        search.value(data, query, setData);
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

    getWordFromObject(data)
    {   
        var current = "";
        while (is.object(data) && is.not.array(data))
        {
            
            //if path has ended or path node has failed get a random key from the next nested list
            if (current == "" || !data.hasOwnProperty(current)) 
            {
                current = this.getRandomWord(Object.keys(data));
            }
            data = data[current];
        }
        
        if(is.array(data)){
            return this.getRandomWord(data);
        }

        return null;
    }



    get(query)
    {
        if(!query){
            return null;
        }

        var data = this.getData(query);
        query = "$." + query;
        var paths = search.paths(data, query);
        
        if(!paths || !paths.length){
            return null;
        }
        var path = paths[0].join(".");

        var value = search.value(data, path);
        if(is.object(value) && is.not.array(value)){
            value = this.getWordFromObject(value);
        }


        if(!value){
            return null;
        }

        return value[0];   
    }

}


export default SearchApi;
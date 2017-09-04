var search = require('jsonpath');

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

        if(!value){
            return null;
        }

        return value[0];
        
    }

}


export default SearchApi;
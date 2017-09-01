var search = require('jsonpath');

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
        if( variable && variable.substr(0,1) == "$" ){
            data = this.temp;
        }
        return data;
    }

    set(path, setData){
        var data = this.getData(path);
        search.value(data, path, setData);
    }

    get(query)
    {
        
        var data = this.getData(query);
        query = "$." + query;
        var paths = search.paths(data, query);
        
        if(!paths || !paths.length){
            return null;
        }

        var value = search.value(data, paths[0]);

        if(!values){
            return null;
        }

        return value;
        
    }

}


export default SearchApi;
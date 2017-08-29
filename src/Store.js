var is = require('is_js');
var Tag = require('./Tag.js').default;

let instance = null;
class Store {

    constructor(data) {
        if (instance == null) {
            instance = this;
            instance.init(data);
        }
        return instance;
    }

    find(path)
    {

    }

    compileFo()
    {
        recurse
    }

    init(data) {
        this.data = data;
        this.compiled = this.flatten(this.data);
        this.tempData = {};
    }

    function flatten(data) {
        var result = {};
        function recurse (cur, prop, addto) {

            if(prop && !result[prop]){
                result[prop] = {
                    values : []
                };
                addto.push(result[prop].values);
            }
            
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if (Array.isArray(cur)) {
                result[prop].values = cur;

                if(Array.isArray(addto)){
                    addto.forEach(function(array) {
                        cur.forEach(function(item) {
                            array.push(item);
                        });
                    });
                }

            } else {
                var isEmpty = true;
                
                

                for (var p in cur) {
                    isEmpty = false;

                    pp = prop ? prop+"."+p : p;
                    
                    // if(pp && !result[pp]){
                        
                    // }


                    recurse(cur[p], pp, []);
                }
                
                
            }
        }
        recurse(data, "", null);
        return result;
    }

flatten({
            root : ["{{$b:bob}} climbed a {{tree.$b}}"],
            bob : { 
                small: {
                    small1 : ["small bob"],
                    small2 : ["small steve"]
                },
            
                big: ["big bob","asdasd"]
            },
            tree : {
                big : [ "big tree" ],
                small : [ "small tree" ]
            }
        })


    setToPath(obj, path, value) {
        path = path.replace(/(\[|\]\.)/g, ".").replace(/\]/g, "").split('.');
        for (i = 0; i < path.length - 1; i++) {
            var key = path[i];

            if (!obj[key] && i < path.length - 1) {
                obj[key] = {};
            }

            if (is.not.array(obj[key]) && i == path.length - 1) {
                obj[key] = [];
            }

            obj = obj[key];
        }
        obj[key].push(value);
    }

    setTempVar(key, value) {
        setToPath(this.tempData, path, value);
    }

    setPathVar(path, value) {
        setToPath(this.data, path, value);
    }

    setData(data) {
        this.data = data;
        this.tempData = {};
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

    clear() 
    {
        this.tempData = {};
    }

    saveVariable(tag, value){
        if(!tag.variable){
            return;
        }
        
        if(!this.tempData[tag.variable]){
            this.tempData[tag.variable] = [];
        }
           
        this.tempData[tag.variable].push(tag.duplicateClean());
    }

    populate(tag){
        var ret = this.get(tag);

        if(!ret){
            return false;
        }
        
        //this.saveVariable(tag);
        tag.path = ret.path;
        tag.setValue(ret.str); 
            
        return true;
    }

    dataByRefernceType(reference)
    {
        var data = this.data;
        if (reference) 
        {
            data = this.tempData;
        }
        return data;
    }

    findEndData(tag, end)
    {

        var op = tag.path;
        var data = this.dataByRefernceType(tag.reference);
        // while (is.object(data) && is.not.array(data))
        // {
        //     if(data[])
        // }

        op.forEach(function(element) {
            if(is.not.array( data ) && is.object( data ) && data[element]){
                data = data[element];
            }
        }, this);

        // var data = this.dataByRefernceType($);

        function searchTree(data, key, end){
            if(key == end){
                return data;
            }else if (data != null && is.not.array(data) && is.object(data)){
                var result = null;
                
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var e = data[key];
                        result = searchTree(e,key, end);
                        if( is.array(result) ){
                            return result;
                        }
                    }
                }

                return result;
            }
            return null;
        }

        
        var end = this.tempData[end][0].end();
        return searchTree(data, null, end);
    }

    get(tag) 
    {
        let path = tag.path;
        if (!path.length) {
            return null;
        }

        
        let result = {
            index: null,
            path: [],
            str: ""
        };

        //is normal path or a variable
        //if its trying to select a pre saved variable changed to temp data struct
        var data = this.dataByRefernceType(tag.reference);

        if(tag.like){
            data = this.findEndData(tag, tag.like);
        }

        //if the root node doesnt match we wont return any matches
        var base = path[0];
        if(!data[base]){
            return null;
        }

        //handle nested lists
        var current = "";
        while (is.object(data) && is.not.array(data))
        {
            if (path.length) 
            {
                current = path.shift();

                if(!data[current]){
                    return null;
                }
            }



            //allow selecting which specific array look for arrays keywords with [0],[23] at the end.
            var index = current.match(/([^\[\]]*)\[(\d+)\]/);
            if (index) 
            {
                current = index[1];
                if (!isNaN(index[2])) 
                {
                    result.index = +index[2];
                }
            }

            //if path has ended or path node has failed get a random key from the next nested list
            if (current == "" || !data.hasOwnProperty(current)) 
            {
                current = this.getRandomWord(Object.keys(data));
            }

            result.path.push(current);
            data = data[current];
        }

        
        //now actuallt
        if (is.array(data)) 
        {
            if (result.index != null) {
                result.str = data[result.index];
            }
            result.str = this.getRandomWord(data);
            return result;
        }
        return null;
        
    }
}

export default Store;
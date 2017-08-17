var is = require('is_js');

let instance = null;
class PList {

    constructor(data) {
        if (instance == null) {
            instance = this;
            instance.init(data);
        }

        return instance;
    }

    init(data) {
        this.data = data;
        this.tempData = {};
    }

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

    getRandomWord(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    clear() 
    {
        this.tempData = {};
    }

    saveVariable(tag){
        if(!tag.variable){
            return;
        }
        
        if(!this.tempData[tag.variable]){
            this.tempData[tag.variable] = [];
        }

        this.tempData[tag.variable].push(tag);
    }

    populate(tag){
        var ret = this.get(tag);

        if(!ret){
            return false;
        }
        
        this.saveVariable(tag);

        tag.value = ret.str;
        tag.path = ret.path;
        
        return true;
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
        var data = this.data;
        if (path.length > 0 && path[0].substr(0, 1) == "$") 
        {
            data = this.tempData;
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

export default PList;
import is from 'is_js';


let instance = null;
export default class Store  
{

    constructor (data) 
    {
        if(instance == null){
            instance = this;
            instance.init(data);
        }
        
        return instance;
    }

    init(data)
    {
        this.data = data;
        this.tempData = {};
    }

    

    setToPath(obj ,path, value)
    {
        path = path.replace(/(\[|\]\.)/g,".").replace(/\]/g, "").split('.');
        for (i = 0; i < path.length - 1; i++)
        {
            var key = path[i];

            if(!obj[key] && i < path.length - 1 ){
                obj[key] = {};
            }

            if(is.not.array(obj[key]) && i == path.length - 1){
                obj[key] = [];
            }
			
            obj = obj[key];     
        }
        obj[key].push(value);
    }

    setTempVar(key, value)
    {
        setToPath(this.tempData, path, value );    
    }

    setPathVar(path, value)
    {
        setToPath(this.data, path, value );    
    }

    setData(data)
    {
        this.data = data;
        this.tempData = {};
    }

    
    
}
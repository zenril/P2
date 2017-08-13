import is from 'is_js';
import Tag from './Tag.js';

class Parzen {

    constructor(props) {
        this.REGEX_TAG = /\{\{(\$[^\:]*\:)*([^{}|]*)([|]{0,2}[^}]*)\}\}/g;
        this.SMALL_TAG = /\{\{([^{}]*)\}\}/g
        this.data = props.data;
        this.variables = {};
    }



    getRandomWord(list)
    {
        return list[Math.floor(Math.random() * list.length)];
    }

    make(props)
    {
        var start = this.getListString(props.base);
        var complete = this.recurse(start.str);
    }

    recurse(string)
    {
        if(is.string(string)){
            string.replace(this.REGEX_TAG, this.parseTag);
        }
    }

    parseTag(whole,middle)
    {
        $tag = new Tag(middle);
    }

    getListString(name) 
    {
        //get object keys as name might be delcared like people.cloths.shoes
        let path = name.split(".");
        if(!path.length){
            return null;
        }

        let result = {
            index : null,
            path : [],
            str : ""
        }

        let data = this.data;

        //handle nested lists
        var current = "";
        while(is.object(data) && is.not.array(data))
        {             
            if(path.length)
            {
                current = path.shift();    
            }

            //allow selecting which specific array look for arrays keywords with [0],[23] at the end.
            var index = current.match(/([^\[\]]*)\[(\d+)\]/);      
            if(index)
            {
                current = index[1];
                if(!isNaN(index[2]))
                {
                    result.index = +index[2];
                }
            } 
                   
            //if path has ended or path node has failed get a random key from the next nested list
            if( current == "" || !data.hasOwnProperty(current))
            {
                current = this.getRandomWord(Object.keys(data));
            }
            
            result.path.push(current);
            data = data[current];
        }

        //now actuallt
        if(is.array(data))
        {   
            if(result.index != null)
            {
                result.str = data[result.index];
            }
            
            if(result.index + 1 > data.lengh)
            {
                result.str = this.getRandomWord(data)
            }
        }    
        return result;
    }
}

window.Parzen = Parzen;
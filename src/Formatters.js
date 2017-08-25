var ia = require('indefinite-article');
var Format = require('./Format.js').default;



class Formatters extends Format {
    //upper case first
    upperCaseFirstChar(phrase, value)
    {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    ucf(phrase, value)
    {
        return this.upperCaseFirstChar(phrase, value);
    }

    //upper case all    
    upperCaseAll(phrase, value)
    {
        return value.toUpperCase();
    }

    uc(phrase, value)
    {
        return this.upperCaseAll(phrase, value);
    }

    //upper case first character of each word
    upperCaseEachWord(phrase, value)
    {
        return value.replace(/\w\S*/g, txt => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    ucw(phrase, value)
    {
        return this.upperCaseEachWord(phrase, value);
    }

    //reverse all
    reverse(phrase, value)
    {
        return value.split('').reverse().join('');
    }

    rev(phrase, value)
    {
        return this.reverse(phrase, value);
    }

    //reverse word order
    wordReverse(phrase, value)
    {
        return value.split('').reverse().join('').split(' ').reverse().join(' ');
    }

    wrev(phrase, value)
    {
        return this.wordReverse(phrase, value);
    }

    //indefinite article
    
    an(phrase, value){
        return ia(value) + " " + value;
    }


}

export default Formatters;
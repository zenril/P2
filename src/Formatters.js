var ansas = require('indefinite-article');

let instance = null;
class Formatters {
    

    constructor(data) {
        if (instance == null) {
            instance = this;
        }

        console.log(ansas);

        return instance;
    }


    //upper case first
    upperCaseFirstChar(phrase)
    {
        return phrase.value.charAt(0).toUpperCase() + phrase.value.slice(1);
    }

    ucf(phrase)
    {
        return this.upperCaseFirstChar(phrase);
    }

    //upper case all    
    upperCaseAll(phrase)
    {
        return phrase.value.toUpperCase();
    }

    uc(phrase)
    {
        this.upperCaseAll(phrase);
    }

    //upper case first character of each word
    upperCaseEachWord(phrase)
    {
        return phrase.value.replace(/\w\S*/g, txt => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    ucw(phrase)
    {
        this.upperCaseEachWord(phrase);
    }

    //reverse all
    reverse(phrase)
    {
        return phrase.value.split('').reverse().join('');
    }

    rev(phrase)
    {
        return this.reverse(phrase);
    }

    //reverse word order
    wordReverse(phrase)
    {
        return phrase.value.split('').reverse().join('').split(' ').reverse().join(' ');
    }

    wrev(phrase)
    {
        return this.wordReverse(phrase);
    }

    //indefinite article


}

export default Formatters;
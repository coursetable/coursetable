// From http://stackoverflow.com/questions/11479094/conditional-on-last-item-in-array-using-handlebars-js-template
// You can write: <div class='{{#if $first}} first{{/if}}{{#if $last}} last{{/if}}'></div>
Handlebars.registerHelper("foreach",function(arr,options) {
    if(options.inverse && !arr.length)
        return options.inverse(this);

    return arr.map(function(item,index) {
        item.$index = index;
        item.$first = index === 0;
        item.$last  = index === arr.length-1;
        return options.fn(item);
    }).join('');
});

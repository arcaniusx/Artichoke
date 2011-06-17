/**
 * Artichoke visual testing suite
 * @description
 * @required jQuery
 * @author Filipe Araujo
 * @version 1.0
 */






Artichoke = (function($){
    var

    result = function(msg){
        return (!msg) ? test = { msg : 'Test passed', result : true } : { msg : msg, result : false };
    },
        
    api = function(el){
        var
        
        $el = $(el),

        exists = function(){
            var msg,
                selectors = el.split(','),
                xl = selectors.length -1;

            for(xl; xl>-1; xl--){
                if($(selectors[xl]).length === 0){
                    msg = 'Expected selector:'+selectors[xl]+' to exist';
                }
            }

            return result(msg);

        },

        visible = function(){
            var msg;
            $el.each(function(){
                if($(this).is(':hidden')){
                    msg = 'Expected selector:'+$el.selector+' to be visible';
                }
            });
            
            return result(msg);
        };



        return {
            exists : exists,

            isVisible : visible
        };
    };

    return api;
}(jQuery));





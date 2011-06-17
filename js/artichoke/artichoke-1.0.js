/**
 * Artichoke visual testing suite
 * @description
 * @required jQuery
 * @author Filipe Araujo
 * @version 1.0
 */


Artichoke = (function($){
    var

    trace,

    result = function(test){
        var msg = test.msg;
        return {
            msg : (msg) ? msg : 'Test passed',
            trace : trace,
            result : (msg) ? false : true
        };
    },
        
    api = function(el){
        var
        
        $el = $(el),

        exists = function(){
            var msg,
                matches = 0,
                failed = 0,
                selectors = el.split(','),
                xl = selectors.length -1;
            
            for(xl; xl>-1; xl--){
                if($(selectors[xl]).length === 0){
                    msg = 'Expected selector: '+selectors[xl]+' to exist';
                    failed+=1;
                }
                matches += $(selectors[xl]).length;
            }

            trace.push({ step : 'exists', selector : el, matches : matches, failed : failed });
            return result({msg : msg});

        },

        inside = function(inner){
            var msg,
                error = 'Expected to see '+el+' inside of '+inner,
                exists = api(el).exists();

            if(!exists.result){
                return exists;
            }

            $el.each(function(){
                
            });
        },

        visible = function(){
            var msg,
                matches = $el.length,
                failed = 0,
                error = 'Expected selector: '+$el.selector+' to be visible',
                exists = api(el).exists();

            if(!exists.result){
                return exists;
            }

            $el.each(function(){
                if($(this).is(':hidden')){
                    failed+=1;
                    msg = error;
                }
            });

            trace.push({ step : 'visible', selector : el, matches : matches, failed : failed });
            return result({msg : msg});
        };

        trace = [];

        return {
            exists : exists,

            isInside : inside,

            isVisible : visible
        };
    };

    return api;
}(jQuery));





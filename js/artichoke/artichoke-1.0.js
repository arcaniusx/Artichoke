/**
 * Artichoke visual testing suite
 * @description
 * @required jQuery
 * @author Filipe Araujo
 * @version 1.0
 */


var Artichoke = (function($){
    var

    trace,

    result = function(test){
        var msg = test.msg;
        return {
            msg : msg || 'Test passed',
            trace : trace,
            result : (msg) ? false : true
        };
    },
        
    api = function(el){
        var
        
        $el = $(el),

        equals = function(str){
            var msg,
                exists = api(el).exists(1);

            if(!exists.result){
                return exists;
            }

            if(!$el.is('input') && !$el.is('select')){
                msg ='Expected selector: '+$el.selector+' to be a form element';
            }

            if($el.val() !== str){
                msg ='Expected selector: '+$el.selector+' to have a value equal to '+str;
            }

            trace.push({ step : 'exists', selector : el });
            return result({msg : msg});
        },

        exists = function(expecting){
            var msg,
                matches = 0,
                failed = 0,
                selectors = el.split(','),
                xl = selectors.length -1;
            
            for(xl; xl>-1; xl-=1){
                if($(selectors[xl]).length === 0){
                    msg = 'Expected selector: '+selectors[xl]+' to exist';
                    failed+=1;
                }
                matches += $(selectors[xl]).length;
            }
            
            if(matches > expecting){
                msg = 'Expected to find only '+expecting+' elements, found multiple elements instead';
            }

            trace.push({ step : 'exists', selector : el, matches : matches, failed : failed });
            return result({msg : msg});

        },

        inside = function(e){
            var inner = api(el).exists(1),
                outer = api(e).exists(1),
                msg;

            if(!inner.result || !outer.result){
                return (!inner.result) ? inner : outer;
            }
            
            if($(e).find(el).length === 0){
                msg ='Expected selector: '+$el.selector+' to be inside of selector: '+e;
            }

            trace.unshift({ step : 'inside', innerSelector : el,  outerSelector : e});
            return result({msg : msg});
        },

        sibling = function(e){
            var selector = api(el).exists(1),
                sibling = api(e).exists(1),
                msg;

            if(!selector.result || !sibling.result){
                return (!selector.result) ? selector : sibling;
            }

            if($el.siblings(e).length === 0){
                msg ='Expected selector: '+$el.selector+' to be a sibling of selector: '+e;
            }

            trace.unshift({ step : 'sibling', selector : el,  sibling : e});
            return result({msg : msg});
        },

        text = function(str){
             var msg,
                exists = api(el).exists(1);

            if(!exists.result){
                return exists;
            }

            if($(el+':contains('+str+')').length === 0){
                msg = 'Expected selector: '+$el.selector+' to contain the text: '+str;
            }

            trace.unshift({ step : 'sibling', selector : el,  text : str});
            return result({msg : msg});
        },

        visible = function(){
            var msg,
                matches = $el.length,
                failed = 0,
                exists = api(el).exists();

            if(!exists.result){
                return exists;
            }

            $el.each(function(){
                if($(this).is(':hidden')){
                    failed+=1;
                    msg = 'Expected selector: '+$el.selector+' to be visible';
                }
            });

            trace.push({ step : 'visible', selector : el, matches : matches, failed : failed });
            return result({msg : msg});
        };

        trace = [];

        return {

            equals : equals,

            exists : exists,

            hasText : text,

            isInside : inside,

            isSiblingOf : sibling,
            
            isVisible : visible
        };
    };

    return api;
}(jQuery));





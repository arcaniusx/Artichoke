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
                details = { step : 'equals', selector : el },
                exists = api(el).exists(1);

            if(!exists.result){
                return exists;
            }

            if(!$el.is('input') && !$el.is('select')){
                msg ='Expected selector: '+$el.selector+' to be a form element';
            }
            if($el.val() !== str && !msg){
                $.extend(details, { expectedValue : str, actualValue : $el.val()});
                msg ='Expected selector: '+$el.selector+' to have a value equal to '+str;
            }

            trace.unshift(details);
            return result({msg : msg});
        },

        exists = function(expecting){
            var msg,
                details = {
                    step : 'exists',
                    selector : el,
                    matches : 0,
                    failed : 0
                },
                selectors = el.split(','),
                xl = selectors.length -1;
            
            for(xl; xl>-1; xl-=1){
                if($(selectors[xl]).length === 0){
                    msg = 'Expected selector: '+selectors[xl]+' to exist';
                    details.failed+=1;
                }
                details.matches += $(selectors[xl]).length;
            }
            
            if(details.matches > expecting){
                msg = 'Expected to find only '+expecting+' elements, found multiple elements instead';
            }

            trace.unshift(details);
            return result({msg : msg});

        },

        inside = function(e){
            var details = {
                    step : 'inside',
                    innerSelector : el,
                    outerSelector : e
                },
                inner = api(el).exists(1),
                outer = api(e).exists(1),
                msg;

            if(!inner.result || !outer.result){
                return (!inner.result) ? inner : outer;
            }
            
            if($(e).find(el).length === 0){
                msg ='Expected selector: '+$el.selector+' to be inside of selector: '+e;
            }

            trace.unshift(details);
            return result({msg : msg});
        },

        check = function(bool){
            var details = {
                    step : 'check',
                    selector : el,
                    value : bool
                },
                msg,
                selector = api(el).exists(1);
            
            if(!selector.result){
                return selector;
            }

            if(!$el.is(':radio') && !$el.is(':checkbox')){
                msg ='Expected selector: '+$el.selector+' to be a radio or checkbox element';
            }

            if(typeof bool === 'string' && !msg){
                msg ='Expected rule to be passed a Boolean value';
            }

            if(!msg){
                $el.prop("checked", bool);
            }

            trace.unshift(details);
            return result({msg : msg});
        },

        set = function(str){
            var details = {
                    step : 'set',
                    selector : el,
                    value : str
                },
                msg,
                selector = api(el).exists(1);

            if(!selector.result){
                return selector;
            }

            if(!$el.is('input') && !$el.is('select')){
                msg ='Expected selector: '+$el.selector+' to be a form element';
            }

            $el.val(str);

            if($el.val() !== str && !msg){
                msg ='Expected selector: '+$el.selector+' value to be set to '+str;
            }

            trace.unshift(details);
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
                selector = api(el).exists(1);

            if(!selector.result){
                return selector;
            }

            if($(el+':contains('+str+')').length === 0){
                msg = 'Expected selector: '+$el.selector+' to contain the text: '+str;
            }

            trace.unshift({ step : 'text', selector : el,  text : str});
            return result({msg : msg});
        },

        trigger = function(event){
            var selector = api(el).exists(1);

            if(!selector.result){
                return selector;
            }

            $el.trigger(event);
            trace.unshift({ step : 'trigger', selector : el,  event : event});
            return result({});
        },

        visible = function(){
            var msg,
                matches = $el.length,
                failed = 0,
                selector = api(el).exists();

            if(!selector.result){
                return selector;
            }

            $el.each(function(){
                if($(this).is(':hidden')){
                    failed+=1;
                    msg = 'Expected selector: '+$el.selector+' to be visible';
                }
            });

            trace.unshift({ step : 'visible', selector : el, matches : matches, failed : failed });
            return result({msg : msg});
        };

        trace = [];

        return {

            check : check,

            equals : equals,

            exists : exists,

            hasText : text,

            isInside : inside,

            isSiblingOf : sibling,
            
            isVisible : visible,

            set : set,

            trigger : trigger
        };
    };

    return api;
}(jQuery));





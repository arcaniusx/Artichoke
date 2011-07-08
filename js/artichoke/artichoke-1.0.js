/**
 * Artichoke visual testing suite
 * @description
 * @required jQuery
 * @author Filipe Araujo
 * @version 1.0
 */


var Artichoke = (function(){
    var

    // removes duplicates
    clean = function(matches){
        var
        matchesLength,
        result = [],
        resultLength;

        o:for(matchesLength = matches.length; matchesLength--;){
            resultLength = result.length;
            for(resultLength; resultLength--;){
                if(matches[matchesLength] === result[resultLength]){
                    continue o;
                }
            }
            result.push(matches[matchesLength]);
        }

        return result;
    },

    find = function(selector, context){
        var
        ctx,
        ctxLength,
        ctxGroups = [],
        ctxGroupsLength = 1,
        ctxMatches = [],
        elem,
        slcts,
        slctsLength,
        matches = [];

        if(!selector || (!context && selector === 'body')){
            return [document.body];
        }

        slcts = selector.split(',');
        ctx = context ? context.split(',') : ['body'];

        // iterate through each context and create a context group
        for(ctxLength = ctx.length; ctxLength--;){
            ctxGroups = NW.select(ctx[ctxLength]);
            ctxGroupsLength = ctxGroups.length;

            if(!ctxGroupsLength){
                report.call(this,{
                    selector : selector,
                    context : ctx[ctxLength],
                    code : 'ctxExists'
                });
            }
            //console.info('context groups:',ctxGroups)

            // iterate through each context groups and create a context match array
            for(ctxGroupsLength; ctxGroupsLength--;){
                ctxMatches = ctxGroups[ctxGroupsLength];
                //console.log('context matches:',ctxMatches);

                // iterate through selectors and match against the context
                for(slctsLength = slcts.length; slctsLength--;){
                    //console.log('context item:',ctxMatches);

                    elem = NW.select(slcts[slctsLength], ctxMatches);
                    if(elem.length > 0){
                        matches = matches.concat(elem);
                    }
                    else {
                        report.call(this,{
                            selector : slcts[slctsLength],
                            context : ctx[ctxLength],
                            code : 'sltExists'
                        });
                    }
                }
            }
        }
        return clean(matches);
    },

    // error reporting
    report = function(params){
        var msg;

       if(!this.trace){
           this.trace = [];
       }

        if(!this.failures){
            this.failures = 0;
        }
        switch(params.code){
            case 'ctxExists':
                msg = 'Expected context:'+ params.context + ' to exist ';
               this.failures++;
                break;
            case 'sltExists':
                msg = 'Expected selector:' + params.selector + ' to exist within context: '+ params.context + '.';
                    this.failures++;
                break;
            default:
                break;
        }

        this.trace.push(msg);
    },

    Artichoke = (function(){

        var Artichoke = function(selector, context) {
            return new Artichoke.fn.init(selector, context);
        };

        Artichoke.fn = Artichoke.prototype = {
            constructor : Artichoke,
            init : function(selector, context){
                this.selector = selector;
                this.context = context;
                this.push.apply(this, find.call(this,selector, context));
                return this;
            },
            exists : function(){
               return !this.failures;
            },
            hasCountOf : function(num){
                if(typeof num !== 'number'){
                    return false;
                }
                return num === this.length;
            },
            isVisible : function(){
                for(var x = this.length; x--;){
                    if(NW.match(this[x],':hidden')){
                        return false;
                    }
                }
                return true;
            },

            // Behaves like an Array's method, similiar to jQuery
            push:  Array.prototype.push,
            sort: [].sort,
            splice: [].splice
        };

        Artichoke.fn.init.prototype = Artichoke.fn;

        return Artichoke;
    }());

    return Artichoke;

})();



var NW = (function(){
    /*!
     * NWMatcher 1.2.4 - Fast CSS3 Selector Engine
     * Copyright (C) 2007-2011 Diego Perini
     * See http://nwbox.com/license
     *
     * removed internal namespace declarations and returned DOM instead
     */
    var NW = (function(v){var c='nwmatcher-1.2.4',l={},i=v.document,m=i.documentElement,K=[].slice,bO={}.toString,bl,W,G,X,q,bm,bn,bo,bp,L='[#.:]?',bq='([~*^$|!]?={1})',y='[\\x20\\t\\n\\r\\f]*',br='[\\x20]|[>+~][^>+~]',bs='[-+]?\\d*n?[-+]?\\d*',Y='"[^"]*"'+"|'[^']*'",bP='\\([^()]+\\)|\\(.*\\)',bQ='\\{[^{}]+\\}|\\{.*\\}',bR='\\[[^[\\]]*\\]|\\[.*\\]',Z='\\[.*\\]|\\(.*\\)|\\{.*\\}',r='(?:[-\\w]|[^\\x00-\\xa0]|\\\\.)',B='(?:-?[_a-zA-Z]{1}[-\\w]*|[^\\x00-\\xa0]+|\\\\.+)+',bt='('+Y+'|'+B+')',C=y+'('+r+'+:?'+r+'+)'+y+'(?:'+bq+y+bt+')?'+y,bS=C.replace(bt,'([\\x22\\x27]*)((?:\\\\?.)*?)\\3'),M='((?:'+bs+'|'+Y+'|'+L+'|'+r+'+|\\['+C+'\\]|\\(.+\\)|'+y+'|,)+)',bT='.+',ba='(?=[\\x20\\t\\n\\r\\f]*[^>+~(){}<>])(\\*|(?:'+L+B+')|'+br+'|\\['+C+'\\]|\\('+M+'\\)|\\{'+bT+'\\}|,)+',bU=ba.replace(M,'.*'),N=new RegExp(ba,'g'),O=new RegExp('^'+y+'|'+y+'$','g'),bV=new RegExp('^((?!:not)('+L+'|'+B+'|\\([^()]*\\))+|\\['+C+'\\])$'),bb=new RegExp('([^,\\\\\\[\\]]+|'+bR+'|'+bP+'|'+bQ+'|\\\\.)+','g'),bW=new RegExp('(\\['+C+'\\]|\\('+M+'\\)|[^\\x20>+~]|\\\\.)+','g'),bu=/[\x20\t\n\r\f]+/g,bv=new RegExp(B+'|^$'),t=(function(){var g=(i.appendChild+'').replace(/appendChild/g,'');return function(b,a){var d=b&&b[a]||false;return d&&typeof d!='string'&&g==(d+'').replace(new RegExp(a,'g'),'')}})(),bX=t(i,'hasFocus'),P=t(i,'querySelector'),bY=t(i,'getElementById'),bZ=t(m,'getElementsByTagName'),Q=t(m,'getElementsByClassName'),ca=t(m,'getAttribute'),cb=t(m,'hasAttribute'),bw=(function(){var b=false,a=m.id;m.id='length';try{b=!!K.call(i.childNodes,0)[0]}catch(e){}m.id=a;return b})(),bx='nextElementSibling'in m&&'previousElementSibling'in m,R=t(m,'matchesSelector')?'matchesSelector':t(m,'oMatchesSelector')?'oMatchesSelector':t(m,'msMatchesSelector')?'msMatchesSelector':t(m,'mozMatchesSelector')?'mozMatchesSelector':t(m,'webkitMatchesSelector')?'webkitMatchesSelector':null,cc=bY?(function(){var b=true,a='x'+String(+new Date),d=i.createElementNS?'a':'<a name="'+a+'">';(d=i.createElement(d)).name=a;m.insertBefore(d,m.firstChild);b=!!i.getElementById(a);m.removeChild(d);return b})():true,by=bZ?(function(){var b=i.createElement('div');b.appendChild(i.createComment(''));return!!b.getElementsByTagName('*')[0]})():true,bz=Q?(function(){var b,a=i.createElement('div'),d='\u53f0\u5317';a.appendChild(i.createElement('span')).setAttribute('class',d+'abc '+d);a.appendChild(i.createElement('span')).setAttribute('class','x');b=!a.getElementsByClassName(d)[0];a.lastChild.className=d;return b||a.getElementsByClassName(d).length!=2})():true,cd=ca?(function(){var b=i.createElement('input');b.setAttribute('value',5);return b.defaultValue!=5})():true,bA=cb?(function(){var b=i.createElement('option');b.setAttribute('selected','selected');return!b.hasAttribute('selected')})():true,ce=R?(function(){try{m[R](':buggy');return true}catch(e){}return false})():true,cf=(function(){var b=i.createElement('select');b.appendChild(i.createElement('option'));return!b.firstChild.selected})(),bB,bc,z,bC,n,bD=/opera/i.test(bO.call(v.opera)),cg=bD&&parseFloat(opera.version())>=11,bE=P?(function(){var h=[],f=i.createElement('div'),c,k=function(b,a,d,g){var j=false;a.appendChild(d);try{j=a.querySelectorAll(b).length==g}catch(e){}while(a.firstChild){a.removeChild(a.firstChild)}return j};c=i.createElement('p');c.setAttribute('class','');k('[class^=""]',f,c,1)&&h.push('[*^$]=[\\x20\\t\\n\\r\\f]*(?:""|'+"'')");c=i.createElement('option');c.setAttribute('selected','selected');k(':checked',f,c,0)&&h.push(':checked');c=i.createElement('input');c.setAttribute('type','hidden');k(':enabled',f,c,1)&&h.push(':enabled',':disabled');c=i.createElement('link');c.setAttribute('href','x');k(':link',f,c,1)||h.push(':link');if(bA){h.push('\\[[\\x20\\t\\n\\r\\f]*(?:checked|disabled|ismap|multiple|readonly|selected|value)')}return h.length?new RegExp(h.join('|')):{'test':function(){return false}}})():true,bF=new RegExp('(?:\\[[\\x20\\t\\n\\r\\f]*class\\b|\\.'+B+')'),ch=new RegExp(':[-\\w]+'),ci=new RegExp(!(by&&bz)?!bD?'^(?:\\*|[.#]?-?[_a-zA-Z]{1}'+r+'*)$':'^(?:\\*|#-?[_a-zA-Z]{1}'+r+'*)$':'^#?-?[_a-zA-Z]{1}'+r+'*$'),cj={'a':1,'A':1,'area':1,'AREA':1,'link':1,'LINK':1},ck={checked:1,disabled:1,ismap:1,multiple:1,readonly:1,selected:1},S={value:'defaultValue',checked:'defaultChecked',selected:'defaultSelected'},bG={'class':'className','for':'htmlFor'},cl={'action':2,'cite':2,'codebase':2,'data':2,'href':2,'longdesc':2,'lowsrc':2,'src':2,'usemap':2},bH={'class':0,'accept':1,'accept-charset':1,'align':1,'alink':1,'axis':1,'bgcolor':1,'charset':1,'checked':1,'clear':1,'codetype':1,'color':1,'compact':1,'declare':1,'defer':1,'dir':1,'direction':1,'disabled':1,'enctype':1,'face':1,'frame':1,'hreflang':1,'http-equiv':1,'lang':1,'language':1,'link':1,'media':1,'method':1,'multiple':1,'nohref':1,'noresize':1,'noshade':1,'nowrap':1,'readonly':1,'rel':1,'rev':1,'rules':1,'scope':1,'scrolling':1,'selected':1,'shape':1,'target':1,'text':1,'type':1,'valign':1,'valuetype':1,'vlink':1},cm={'accept':1,'accept-charset':1,'alink':1,'axis':1,'bgcolor':1,'charset':1,'codetype':1,'color':1,'enctype':1,'face':1,'hreflang':1,'http-equiv':1,'lang':1,'language':1,'link':1,'media':1,'rel':1,'rev':1,'target':1,'text':1,'type':1,'vlink':1},D={},H={'=':"n=='%m'",'^=':"n.indexOf('%m')==0",'*=':"n.indexOf('%m')>-1",'|=':"(n+'-').indexOf('%m-')==0",'~=':"(' '+n+' ').indexOf(' %m ')>-1",'$=':"n.substr(n.length-'%m'.length)=='%m'"},E={ID:new RegExp('^\\*?#('+r+'+)|'+Z),TAG:new RegExp('^('+r+'+)|'+Z),CLASS:new RegExp('^\\*?\\.('+r+'+$)|'+Z)},w={spseudos:/^\:((root|empty|nth-)?(?:(first|last|only)-)?(child)?-?(of-type)?)(?:\(([^\x29]*)\))?(.*)/,dpseudos:/^\:(link|visited|target|lang|not|active|focus|hover|checked|disabled|enabled|selected)(?:\((["']*)(.*?(\(.*\))?[^'"()]*?)\2\))?(.*)/,attribute:new RegExp('^\\['+bS+'\\](.*)'),children:/^[\x20\t\n\r\f]*\>[\x20\t\n\r\f]*(.*)/,adjacent:/^[\x20\t\n\r\f]*\+[\x20\t\n\r\f]*(.*)/,relative:/^[\x20\t\n\r\f]*\~[\x20\t\n\r\f]*(.*)/,ancestor:/^[\x20\t\n\r\f]+(.*)/,universal:/^\*(.*)/,id:new RegExp('^#('+r+'+)(.*)'),tagName:new RegExp('^('+r+'+)(.*)'),className:new RegExp('^\\.('+r+'+)(.*)')},bI=function(b,a){var d=-1,g;if(!b.length&&Array.slice)return Array.slice(a);while((g=a[++d]))b[b.length]=g;return b},bJ=function(b,a,d){var g=-1,j;while((j=a[++g]))d(b[b.length]=j);return b},F=function(a,d){var g,j=i;X=a;i=a.ownerDocument||a;if(d||j!==i){m=i.documentElement;n=i.createElement('DiV').nodeName=='DiV';bC=n?'.toUpperCase()':'';z=!n&&typeof i.compatMode=='string'?i.compatMode.indexOf('CSS')<0:(function(){var b=i.createElement('div').style;return b&&(b.width=1)&&b.width=='1px'})();g=i.createElement('div');g.appendChild(i.createElement('p')).setAttribute('class','xXx');g.appendChild(i.createElement('p')).setAttribute('class','xxx');bB=!n&&Q&&z&&(g.getElementsByClassName('xxx').length!=2||g.getElementsByClassName('xXx').length!=2);bc=!n&&P&&z&&(g.querySelectorAll('[class~=xxx]').length!=2||g.querySelectorAll('.xXx').length!=2);o.CACHING&&l.setCache(true,i)}},bd=function(b,a){var d=-1,g=null;while((g=a[++d])){if(g.getAttribute('id')==b){break}}return g},I=!cc?function(b,a){b=b.replace(/\\/g,'');return a.getElementById&&a.getElementById(b)||bd(b,a.getElementsByTagName('*'))}:function(b,a){var d=null;b=b.replace(/\\/g,'');if(n||a.nodeType!=9){return bd(b,a.getElementsByTagName('*'))}if((d=a.getElementById(b))&&d.name==b&&a.getElementsByName){return bd(b,a.getElementsByName(b))}return d},cn=function(b,a){F(a||(a=i));return I(b,a)},co=function(b,a){var d=b=='*',g=a,j=[],h=g.firstChild;d||(b=b.toUpperCase());while((g=h)){if(g.tagName>'@'&&(d||g.tagName.toUpperCase()==b)){j[j.length]=g}if((h=g.firstChild||g.nextSibling))continue;while(!h&&(g=g.parentNode)&&g!==a){h=g.nextSibling}}return j},A=!by&&bw?function(b,a){return n||a.nodeType==11?co(b,a):K.call(a.getElementsByTagName(b),0)}:function(b,a){var d=-1,g=d,j=[],h,f=a.getElementsByTagName(b);if(b=='*'){while((h=f[++d])){if(h.nodeName>'@')j[++g]=h}}else{while((h=f[++d])){j[d]=h}}return j},cp=function(b,a){F(a||(a=i));return A(b,a)},bK=function(b,a){return be('[name="'+b.replace(/\\/g,'')+'"]',a)},cq=function(b,a){var d=-1,g=d,j=[],h,f=A('*',a),c;b=' '+(z?b.toLowerCase():b).replace(/\\/g,'')+' ';while((h=f[++d])){c=n?h.getAttribute('class'):h.className;if(c&&c.length&&(' '+(z?c.toLowerCase():c).replace(bu,' ')+' ').indexOf(b)>-1){j[++g]=h}}return j},J=function(b,a){return(bz||bB||n||!a.getElementsByClassName)?cq(b,a):K.call(a.getElementsByClassName(b.replace(/\\/g,'')),0)},cr=function(b,a){F(a||(a=i));return J(b,a)},bf='compareDocumentPosition'in m?function(b,a){return(b.compareDocumentPosition(a)&16)==16}:'contains'in m?function(b,a){return b!==a&&b.contains(a)}:function(b,a){while((a=a.parentNode)){if(a===b)return true}return false},bL=!cd?function(b,a){return b.getAttribute(a)||''}:function(b,a){a=a.toLowerCase();a=bG[a]||a;if(S[a]){return b[S[a]]||''}return(cl[a]?b.getAttribute(a,2)||'':ck[a]?b.getAttribute(a)?a:'':((b=b.getAttributeNode(a))&&b.value)||'')},bg=!bA?function(b,a){return n?!!b.getAttribute(a):b.hasAttribute(a)}:function(b,a){a=a.toLowerCase();a=bG[a]||a;if(S[a]){return!!b[S[a]]}b=b.getAttributeNode(a);return!!(b&&(b.specified||b.nodeValue))},cs=function(b){b=b.firstChild;while(b){if(b.nodeType==3||b.nodeName>'@')return false;b=b.nextSibling}return true},ct=function(b){return bg(b,'href')&&cj[b.nodeName]},cu=function(b,a){var d=1,g=a?'nextSibling':'previousSibling';while((b=b[g])){if(b.nodeName>'@')++d}return d},cv=function(b,a){var d=1,g=a?'nextSibling':'previousSibling',j=b.nodeName;while((b=b[g])){if(b.nodeName==j)++d}return d},cw=function(b){for(var a in b){o[a]=!!b[a];if(a=='SIMPLENOT'){bh={};T={};bi={};U={};o['USE_QSAPI']=false;N=new RegExp(bU,'g')}else if(a=='USE_QSAPI'){o[a]=!!b[a]&&P;N=new RegExp(ba,'g')}}},u=function(b){if(o.VERBOSITY){if(typeof v.DOMException!='undefined'){var a=new Error();a.message='SYNTAX_ERR: (Selectors) '+b;a.code=12;throw a;}else{throw new Error(12,'SYNTAX_ERR: (Selectors) '+b);}}else{var d=v.console;if(d&&d.log){d.log(b)}else{if(/exception/i.test(b)){v.status=b;v.defaultStatus=b}else{v.status+=b}}}},o={CACHING:false,SHORTCUTS:false,SIMPLENOT:true,USE_HTML5:false,USE_QSAPI:P,VERBOSITY:true},bM='f&&f(c[k]);r[r.length]=c[k];continue main;',V=function(b,a,d){var g=typeof b=='string'?b.match(bb):b;if(g.length==1){a+=bN(g[0],d?bM:'f&&f(k);return true;')}else{var j=-1,h={},f;while((f=g[++j])){f=f.replace(O,'');if(!h[f]&&(h[f]=true)){a+=bN(f,d?bM:'f&&f(k);return true;')}}}if(d){return new Function('c,s,r,d,h,g,f','var N,n,x=0,k=-1,e;main:while((e=c[++k])){'+a+'}return r;')}else{return new Function('e,s,r,d,h,g,f','var N,n,x=0,k=e;'+a+'return false;')}},bN=function(b,a){var d,g,j,h=0,f,c,k,x,p,s;while(b){h++;if((c=b.match(w.universal))){f=''}else if((c=b.match(w.id))){a='if('+(n?'s.getAttribute(e,"id")':'(e.submit?s.getAttribute(e,"id"):e.id)')+'=="'+c[1]+'"){'+a+'}'}else if((c=b.match(w.tagName))){a='if(e.nodeName'+(n?'=="'+c[1]+'"':bC+'=="'+c[1].toUpperCase()+'"')+'){'+a+'}'}else if((c=b.match(w.className))){a='if((n='+(n?'s.getAttribute(e,"class")':'e.className')+')&&n.length&&(" "+'+(z?'n.toLowerCase()':'n')+'.replace('+bu+'," ")+" ").indexOf(" '+(z?c[1].toLowerCase():c[1])+' ")>-1){'+a+'}'}else if((c=b.match(w.attribute))){f=c[1].split(':');f=f.length==2?f[1]:f[0]+'';if(c[2]&&!H[c[2]]){u('Unsupported operator in attribute selectors "'+b+'"');return''}p=false;s='false';if(c[2]&&c[4]&&(s=H[c[2]])){bH['class']=z?1:0;c[4]=c[4].replace(/\\([0-9a-f]{2,2})/,'\\x$1');p=(n?cm:bH)[f.toLowerCase()];s=s.replace(/\%m/g,p?c[4].toLowerCase():c[4])}else if(c[2]=='!='||c[2]=='='){s='n'+c[2]+'="'+c[4]+'"'}f='n=s.'+(c[2]?'get':'has')+'Attribute(e,"'+c[1]+'")'+(p?'.toLowerCase();':';');a=f+'if('+(c[2]?s:'n')+'){'+a+'}'}else if((c=b.match(w.adjacent))){a=bx?'var N'+h+'=e;if(e&&(e=e.previousElementSibling)){'+a+'}e=N'+h+';':'var N'+h+'=e;while(e&&(e=e.previousSibling)){if(e.nodeName>"@"){'+a+'break;}}e=N'+h+';'}else if((c=b.match(w.relative))){a=bx?('var N'+h+'=e;e=e.parentNode.firstElementChild;while(e&&e!==N'+h+'){'+a+'e=e.nextElementSibling}e=N'+h+';'):('var N'+h+'=e;e=e.parentNode.firstChild;while(e&&e!==N'+h+'){if(e.nodeName>"@"){'+a+'}e=e.nextSibling}e=N'+h+';');}else if((c=b.match(w.children))){a='var N'+h+'=e;if(e&&e!==h&&e!==g&&(e=e.parentNode)){'+a+'}e=N'+h+';';}else if((c=b.match(w.ancestor))){a='var N'+h+'=e;while(e&&e!==h&&e!==g&&(e=e.parentNode)){'+a+'}e=N'+h+';';}else if((c=b.match(w.spseudos))&&c[1]){switch(c[2]){case'root':if(c[7]){a='if(e===h||s.contains(h,e)){'+a+'}';}else{a='if(e===h){'+a+'}';}break;case'empty':a='if(s.isEmpty(e)){'+a+'}';break;default:if(c[2]&&c[6]){if(c[6]=='n'){a='if(e!==h){'+a+'}';break;}else if(c[6]=='even'){d=2;g=0;}else if(c[6]=='odd'){d=2;g=1;}else{g=((j=c[6].match(/(-?\d+)$/))?parseInt(j[1],10):0);d=((j=c[6].match(/(-?\d*)n/))?parseInt(j[1],10):0);if(j&&j[1]=='-')d=-1;}p=g<1&&d>1?'(n-('+g+'))%'+d+'==0':d>+1?(c[3]=='last')?'(n-('+g+'))%'+d+'==0':'n>='+g+'&&(n-('+g+'))%'+d+'==0':d<-1?(c[3]=='last')?'(n-('+g+'))%'+d+'==0':'n<='+g+'&&(n-('+g+'))%'+d+'==0':d===0?'n=='+g:(c[3]=='last')?d==-1?'n>='+g:'n<='+g:d==-1?'n<='+g:'n>='+g;a='if(e!==h){n=s['+(c[5]?'"nthOfType"':'"nthElement"')+'](e,'+(c[3]=='last'?'true':'false')+');if('+p+'){'+a+'}}';}else{d=c[3]=='first'?'previous':'next';j=c[3]=='only'?'previous':'next';g=c[3]=='first'||c[3]=='last';s=c[5]?'&&n.nodeName!=e.nodeName':'&&n.nodeName<"@"';a='if(e!==h){'+('n=e;while((n=n.'+d+'Sibling)'+s+');if(!n){'+(g?a:'n=e;while((n=n.'+j+'Sibling)'+s+');if(!n){'+a+'}')+'}')+'}';}break;}}else if((c=b.match(w.dpseudos))&&c[1]){switch(c[1]){case'not':f=c[3].replace(O,'');if(o.SIMPLENOT&&!bV.test(f)){u('Negation pseudo-class only accepts simple selectors "'+b+'"');return'';}else{if('compatMode'in i){a='if(!'+V([f],'',false)+'(e,s,r,d,h,g)){'+a+'}';}else{a='if(!s.match(e, "'+f.replace(/\x22/g,'\\"')+'",g)){'+a+'}';}}break;case'checked':p='if((typeof e.form!="undefined"&&(/^(?:radio|checkbox)$/i).test(e.type)&&e.checked)';a=(o.USE_HTML5?p+'||(/^option$/i.test(e.nodeName)&&e.selected)':p)+'){'+a+'}';break;case'disabled':a='if(((typeof e.form!="undefined"&&!(/^hidden$/i).test(e.type))||s.isLink(e))&&e.disabled){'+a+'}';break;case'enabled':a='if(((typeof e.form!="undefined"&&!(/^hidden$/i).test(e.type))||s.isLink(e))&&!e.disabled){'+a+'}';break;case'lang':p='';if(c[3])p=c[3].substr(0,2)+'-';a='do{(n=e.lang||"").toLowerCase();if((n==""&&h.lang=="'+c[3].toLowerCase()+'")||(n&&(n=="'+c[3].toLowerCase()+'"||n.substr(0,3)=="'+p.toLowerCase()+'"))){'+a+'break;}}while((e=e.parentNode)&&e!==g);';break;case'target':j=i.location?i.location.hash:'';if(j){a='if(e.id=="'+j.slice(1)+'"){'+a+'}';}break;case'link':a='if(s.isLink(e)&&!e.visited){'+a+'}';break;case'visited':a='if(s.isLink(e)&&e.visited){'+a+'}';break;case'active':if(n)break;a='if(e===d.activeElement){'+a+'}';break;case'hover':if(n)break;a='if(e===d.hoverElement){'+a+'}';break;case'focus':if(n)break;a=bX?'if(e===d.activeElement&&d.hasFocus()&&(e.type||e.href)){'+a+'}':'if(e===d.activeElement&&(e.type||e.href)){'+a+'}';break;case'selected':f=cf?'||(n=e.parentNode)&&n.options[n.selectedIndex]===e':'';a='if(/^option$/i.test(e.nodeName)&&(e.selected'+f+')){'+a+'}';break;default:break;}}else{f=false;x=true;for(f in D){if((c=b.match(D[f].Expression))&&c[1]){k=D[f].Callback(c,a);a=k.source;x=k.status;if(x)break;}}if(!x){u('Unknown pseudo-class selector "'+b+'"');return'';}if(!f){u('Unknown token in selector "'+b+'"');return'';}}if(!c){u('Invalid syntax in selector "'+b+'"');return'';}b=c&&c[c.length-1];}return a;},bj=function(b,a,d,g){var j;if(!(b&&b.nodeName>'@')){u('Invalid element argument');return false;}else if(!a||typeof a!='string'){u('Invalid selector argument');return false;}else if(d&&d.nodeType==1&&!bf(d,b)){return false;}else if(X!==d){F(d||(d=b.ownerDocument));}a=a.replace(O,'');o.SHORTCUTS&&(a=NW.Dom.shortcuts(a,b,d));if(bm!=a){if((j=a.match(N))&&j[0]==a){bl=(j=a.match(bb)).length<2;bm=a;bo=j;}else{u('The string "'+a+'", is not a valid CSS selector');return false;}}else j=bo;if(!n&&o.USE_QSAPI&&b[R]&&!(bc&&bF.test(a))&&!(ce&&ch.test(a))&&!bE.test(a)){try{if(b[R](a)){if(typeof g=='function'){g(b);}return true;}return false;}catch(e){}}if(!T[a]||bh[a]!==d){T[a]=V(bl?[a]:j,'',false);bh[a]=d;}return T[a](b,bk,[],i,m,d,g);},be=function(b,a,d){var g,j,h,f,c,k,x=b;if(arguments.length===0){u('Missing required selector parameters');return[];}else if(b===''){u('Empty selector string');return[];}else if(typeof b!='string'){return[];}else if(X!==a){F(a||(a=i));}if(o.CACHING&&(f=l.loadResults(x,a,i,m))){return d?bJ([],f,d):f;}if(!cg&&ci.test(b)){switch(b.charAt(0)){case'#':if((h=I(b.slice(1),a))){f=[h];}else f=[];break;case'.':f=J(b.slice(1),a);break;default:f=A(b,a);break;}}else if(!n&&o.USE_QSAPI&&!(bc&&bF.test(b))&&!bE.test(b)){try{f=a.querySelectorAll(b);}catch(e){}}if(f){f=d?bJ([],f,d):bw?K.call(f):bI([],f);o.CACHING&&l.saveResults(x,a,i,f);return f;}b=b.replace(O,'');o.SHORTCUTS&&(b=NW.Dom.shortcuts(b,a));if((j=bn!=b)){if((c=b.match(N))&&c[0]==b){W=(c=b.match(bb)).length<2;bn=b;bp=c;}else{u('The string "'+b+'", is not a valid CSS selector');return[];}}else c=bp;if(a.nodeType==11){f=a.childNodes;}else if(!n&&W){if(j){c=b.match(bW);k=c[c.length-1];G=k.split(':not')[0];q=b.length-k.length;}if((c=G.match(E.ID))&&(k=c[1])){if((h=I(k,a))){if(bj(h,b)){d&&d(h);f=[h];}else f=[];}}else if((c=b.match(E.ID))&&(k=c[1])){if((h=I(k,i))){if('#'+k==b){d&&d(h);f=[h];}if(/[>+~]/.test(b)){a=h.parentNode;}else{b=b.replace('#'+k,'*');q-=k.length+1;a=h;}}else f=[];}if(f){o.CACHING&&l.saveResults(x,a,i,f);return f;}if(!Q&&(c=G.match(E.TAG))&&(k=c[1])){if((f=A(k,a)).length===0){return[];}b=b.slice(0,q)+b.slice(q).replace(k,'*');}else if((c=G.match(E.CLASS))&&(k=c[1])){if((f=J(k,a)).length===0){return[];}if(bv.test(b.charAt(b.indexOf(k)-1))){b=b.slice(0,q)+b.slice(q).replace('.'+k,'');}else{b=b.slice(0,q)+b.slice(q).replace('.'+k,'*');}}else if((c=b.match(E.CLASS))&&(k=c[1])){if((f=J(k,a)).length===0){return[];}for(var p=0,s=[];f.length>p;++p){s=bI(s,f[p].getElementsByTagName('*'));}f=s;if(bv.test(b.charAt(b.indexOf(k)-1))){b=b.slice(0,q)+b.slice(q).replace('.'+k,'');}else{b=b.slice(0,q)+b.slice(q).replace('.'+k,'*');}}else if(Q&&(c=G.match(E.TAG))&&(k=c[1])){if((f=A(k,a)).length===0){return[];}b=b.slice(0,q)+b.slice(q).replace(k,'*');}}if(!f){f=/^(?:applet|object)$/i.test(a.nodeName)?a.childNodes:A('*',a);}if(!U[b]||bi[b]!==a){U[b]=V(W?[b]:c,'',true);bi[b]=a}f=U[b](f,bk,[],i,m,a,d);o.CACHING&&l.saveResults(x,a,i,f);return f},bh={},T={},bi={},U={},bk={nthElement:cu,nthOfType:cv,getAttribute:bL,hasAttribute:bg,byClass:J,byName:bK,byTag:A,byId:I,contains:bf,isEmpty:cs,isLink:ct,select:be,match:bj}; var Tokens={prefixes:L,encoding:r,operators:bq,whitespace:y,identifier:B,attributes:C,combinators:br,pseudoclass:M,pseudoparms:bs,quotedvalue:Y};l.emit=u;l.byId=cn;l.byTag=cp;l.byName=bK;l.byClass=cr;l.getAttribute=bL;l.hasAttribute=bg;l.match=bj;l.select=be;l.compile=V;l.contains=bf;l.configure=cw;l.setCache=function(){return};l.loadResults=function(){return};l.saveResults=function(){return};l.shortcuts=function(b){return b};l.Config=o;l.Snapshot=bk;l.Operators=H;l.Selectors=D;l.Tokens=Tokens;l.registerOperator=function(b,a){H[b]||(H[b]=a)};l.registerSelector=function(b,a,d){D[b]||(D[b]={Expression:a,Callback:d})};F(i,true); return l; })(this);

    /*
     * Child Selectors
     * :even, :odd, :eq, :lt, :gt, :first, :last, :nth
     */
    NW.registerSelector(
        ':child',
        /^\:(even|odd|eq|lt|gt|first|last|nth)(?:\(([^()]*)\))?(.*)/,
        function(match, source) {

            var
            status = true,
            // do not change this, it is searched & replaced
            ACCEPT_NODE = 'f&&f(c[k]);r[r.length]=c[k];continue main;';

            switch (match[1]) {
                case 'even':
                    source = source.replace(ACCEPT_NODE, 'if((x=x^1)==1){' + ACCEPT_NODE + '}');
                    break;
                case 'odd':
                    source = source.replace(ACCEPT_NODE, 'if((x=x^1)==0){' + ACCEPT_NODE + '}');
                    break;
                case 'eq':
                    source = source.replace(ACCEPT_NODE, 'if(x++==' + match[2] + '){' + ACCEPT_NODE + '}');
                    break;
                case 'lt':
                    source = source.replace(ACCEPT_NODE, 'if(x++<' + match[2] + '){' + ACCEPT_NODE + '}');
                    break;
                case 'gt':
                    source = source.replace(ACCEPT_NODE, 'if(x++>' + match[2] + '){' + ACCEPT_NODE + '}');
                    break;
                case 'first':
                    source = 'n=h.getElementsByTagName(e.nodeName);if(n.length&&n[0]===e){' + source + '}';
                    break;
                case 'last':
                    source = 'n=h.getElementsByTagName(e.nodeName);if(n.length&&n[n.length-1]===e){' + source + '}';
                    break;
                case 'nth':
                    source = 'n=h.getElementsByTagName(e.nodeName);if(n.length&&n[' + match[2] + ']===e){' + source + '}';
                    break;
                default:
                    status = false;
                break;
            }

        // compiler will add this to "source"
        return {
            'source': source,
            'status': status
        };
    });

    /*
     * Pseudo Selectors
     * :has, :button, :header, :input, :checkbox, :radio, :file, :image
     * :password, :reset, :submit, :text, :hidden, :visible, :parent
     */
    NW.registerSelector(
        ':pseudo',
        /^\:(has|checkbox|file|image|password|radio|reset|submit|text|button|input|header|hidden|visible|parent)(?:\((["']*)([^'"()]*)\2\))?(.*)/,
        function(match, source) {
            var
            status = true,
            // do not change this, it is searched & replaced
            ACCEPT_NODE = 'f&&f(c[k]);r[r.length]=c[k];continue main;';

            switch(match[1]) {
                case 'has':
                    source = source.replace(ACCEPT_NODE, 'if(e.getElementsByTagName("' + match[3] + '")[0]){' + ACCEPT_NODE + '}');
                    break;
                case 'checkbox':
                case 'file':
                case 'image':
                case 'password':
                case 'radio':
                case 'reset':
                case 'submit':
                case 'text':
                    // :checkbox, :file, :image, :password, :radio, :reset, :submit, :text, ... ;-)
                    source = 'if(e.type&&e.type=="' + match[1] + '"){' + source + '}';
                    break;
                case 'button':
                case 'input':
                    source = 'if(e.type||/button/i.test(e.nodeName)){' + source + '}';
                    break;
                case 'header':
                    source = 'if(/h[1-6]/i.test(e.nodeName)){' + source + '}';
                    break;
                case 'hidden':
                    source = 'if(!e.offsetWidth&&!e.offsetHeight){' + source + '}';
                    break;
                case 'visible':
                    source = 'if(e.offsetWidth||e.offsetHeight){' + source + '}';
                    break;
                case 'parent':
                    source += 'if(e.firstChild){' + source + '}';
                    break;
                default:
                    status = false;
                break;
            }

        // compiler will add this to "source"
        return {
            'source': source,
            'status': status
        };
    });

    return NW;
})();

//
//var Artichoke = (function(){
//    var
//
//    trace,
//
//    result = function(test){
//        var msg = test.msg;
//        return {
//            msg : msg || 'Test passed',
//            trace : trace,
//            result : (msg) ? false : true
//        };
//    },
//
//
//    api = function(el){
//        var
//
//        $el = Sizzle(el),
//
//        equals = function(str){
//            var msg,
//                details = { step : 'equals', selector : el },
//                exists = api(el).exists(1);
//
//            if(!exists.result){
//                return exists;
//            }
//
//            if(!$el.is('input') && !$el.is('select')){
//                msg ='Expected selector: '+$el.selector+' to be a form element';
//            }
//            if($el.val() !== str && !msg){
//                $.extend(details, { expectedValue : str, actualValue : $el.val()});
//                msg ='Expected selector: '+$el.selector+' to have a value equal to '+str;
//            }
//
//            trace.unshift(details);
//            return result({msg : msg});
//        },
//
//
//        /**
//         *
//         */
//        exists = function(expecting){
//            var msg,
//                details = {
//                    step : 'exists',
//                    selector : el,
//                    matches : 0,
//                    failed : 0
//                },
//                selectors = el.split(','),
//                xl = selectors.length -1;
//
//            for(xl; xl>-1; xl-=1){
//                if(Sizzle(selectors[xl]).length === 0){
//                    msg = 'Expected selector: '+selectors[xl]+' to exist';
//                    details.failed+=1;
//                }
//                details.matches += Sizzle(selectors[xl]).length;
//            }
//
//            if(details.matches > expecting){
//                msg = 'Expected to find only '+expecting+' elements, found multiple elements instead';
//            }
//
//            trace.unshift(details);
//            return result({msg : msg});
//
//        },
//
//        inside = function(e){
//            var details = {
//                    step : 'inside',
//                    innerSelector : el,
//                    outerSelector : e
//                },
//                inner = api(el).exists(1),
//                outer = api(e).exists(1),
//                msg;
//
//            if(!inner.result || !outer.result){
//                return (!inner.result) ? inner : outer;
//            }
//
//            if($(e).find(el).length === 0){
//                msg ='Expected selector: '+$el.selector+' to be inside of selector: '+e;
//            }
//
//            trace.unshift(details);
//            return result({msg : msg});
//        },
//
//        check = function(bool){
//            var details = {
//                    step : 'check',
//                    selector : el,
//                    value : bool
//                },
//                msg,
//                selector = api(el).exists(1);
//
//            if(!selector.result){
//                return selector;
//            }
//
//            if(!$el.is(':radio') && !$el.is(':checkbox')){
//                msg ='Expected selector: '+$el.selector+' to be a radio or checkbox element';
//            }
//
//            if(typeof bool === 'string' && !msg){
//                msg ='Expected rule to be passed a Boolean value';
//            }
//
//            if(!msg){
//                $el.prop("checked", bool);
//            }
//
//            trace.unshift(details);
//            return result({msg : msg});
//        },
//
//        set = function(str){
//            var details = {
//                    step : 'set',
//                    selector : el,
//                    value : str
//                },
//                msg,
//                selector = api(el).exists(1);
//
//            if(!selector.result){
//                return selector;
//            }
//
//            if(!$el.is('input') && !$el.is('select')){
//                msg ='Expected selector: '+$el.selector+' to be a form element';
//            }
//
//            $el.val(str);
//
//            if($el.val() !== str && !msg){
//                msg ='Expected selector: '+$el.selector+' value to be set to '+str;
//            }
//
//            trace.unshift(details);
//            return result({msg : msg});
//        },
//
//        sibling = function(e){
//            var selector = api(el).exists(1),
//                sibling = api(e).exists(1),
//                msg;
//
//            if(!selector.result || !sibling.result){
//                return (!selector.result) ? selector : sibling;
//            }
//
//            if($el.siblings(e).length === 0){
//                msg ='Expected selector: '+$el.selector+' to be a sibling of selector: '+e;
//            }
//
//            trace.unshift({ step : 'sibling', selector : el,  sibling : e});
//            return result({msg : msg});
//        },
//
//        text = function(str){
//             var msg,
//                selector = api(el).exists(1);
//
//            if(!selector.result){
//                return selector;
//            }
//
//            if($(el+':contains('+str+')').length === 0){
//                msg = 'Expected selector: '+$el.selector+' to contain the text: '+str;
//            }
//
//            trace.unshift({ step : 'text', selector : el,  text : str});
//            return result({msg : msg});
//        },
//
//        trigger = function(event){
//            var selector = api(el).exists(1);
//
//            if(!selector.result){
//                return selector;
//            }
//
//            $el.trigger(event);
//            trace.unshift({ step : 'trigger', selector : el,  event : event});
//            return result({});
//        },
//
//
//        /**
//         *
//         */
//        visible = function(){
//            var msg,
//                matches = $el.length,
//                x = matches,
//                failed = 0,
//                selector = api(el).exists();
//
//            if(!selector.result){
//                return selector;
//            }
//
//            for(x; x > 0; x--){
////                console.log(Sizzle.filter(':hidden', $el[x-1] ).length > 0);
////                console.log(Sizzle.filter(':hidden', $el[x-1]))
//
//            }
//
////            $el.each(function(){
////                if($(this).is(':hidden')){
////                    failed+=1;
////                    msg = 'Expected selector: '+$el.selector+' to be visible';
////                }
////            });
////
////            trace.unshift({ step : 'visible', selector : el, matches : matches, failed : failed });
////            return result({msg : msg});
//        };
//
//        is = function(selector){
//            console.info(!!selector,Sizzle.filter( selector, this ).length > 0 )
//            return !!selector && ( typeof selector === "string" ? Sizzle.filter( selector, this ).length > 0 : this.filter( selector ).length > 0 );
//        },
//
//        trace = [];
//
//        Sizzle.selectors.filters.hidden = function(elem) {
//            var width = elem.offsetWidth,
//                height = elem.offsetHeight;
//
//            console.log(elem);
//
//            return (width === 0 && height === 0) || (elem.style.display  === "none");
//        };
//
//        return {
//
//            check : check,
//
//            equals : equals,
//
//            exists : exists,
//
//            hasText : text,
//
//            isInside : inside,
//
//            isSiblingOf : sibling,
//
//            isVisible : visible,
//
//            set : set,
//
//            trigger : trigger
//        };
//    };
//
//    /*!
//     * Sizzle CSS Selector Engine
//     *  Copyright 2011, The Dojo Foundation
//     *  Released under the MIT, BSD, and GPL Licenses.
//     *  More information: http://sizzlejs.com/
//     */
//    (function(){var l=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,m=0,p=Object.prototype.toString,g=false,f=true,n=/\\/g,t=/\W/;[0,0].sort(function(){f=false;return 0});var c=function(y,e,B,C){B=B||[];e=e||document;var E=e;if(e.nodeType!==1&&e.nodeType!==9){return[]}if(!y||typeof y!=="string"){return B}var v,G,J,u,F,I,H,A,x=true,w=c.isXML(e),z=[],D=y;do{l.exec("");v=l.exec(D);if(v){D=v[3];z.push(v[1]);if(v[2]){u=v[3];break}}}while(v);if(z.length>1&&h.exec(y)){if(z.length===2&&i.relative[z[0]]){G=q(z[0]+z[1],e)}else{G=i.relative[z[0]]?[e]:c(z.shift(),e);while(z.length){y=z.shift();if(i.relative[y]){y+=z.shift()}G=q(y,G)}}}else{if(!C&&z.length>1&&e.nodeType===9&&!w&&i.match.ID.test(z[0])&&!i.match.ID.test(z[z.length-1])){F=c.find(z.shift(),e,w);e=F.expr?c.filter(F.expr,F.set)[0]:F.set[0]}if(e){F=C?{expr:z.pop(),set:j(C)}:c.find(z.pop(),z.length===1&&(z[0]==="~"||z[0]==="+")&&e.parentNode?e.parentNode:e,w);G=F.expr?c.filter(F.expr,F.set):F.set;if(z.length>0){J=j(G)}else{x=false}while(z.length){I=z.pop();H=I;if(!i.relative[I]){I=""}else{H=z.pop()}if(H==null){H=e}i.relative[I](J,H,w)}}else{J=z=[]}}if(!J){J=G}if(!J){c.error(I||y)}if(p.call(J)==="[object Array]"){if(!x){B.push.apply(B,J)}else{if(e&&e.nodeType===1){for(A=0;J[A]!=null;A++){if(J[A]&&(J[A]===true||J[A].nodeType===1&&c.contains(e,J[A]))){B.push(G[A])}}}else{for(A=0;J[A]!=null;A++){if(J[A]&&J[A].nodeType===1){B.push(G[A])}}}}}else{j(J,B)}if(u){c(u,E,B,C);c.uniqueSort(B)}return B};c.uniqueSort=function(u){if(o){g=f;u.sort(o);if(g){for(var e=1;e<u.length;e++){if(u[e]===u[e-1]){u.splice(e--,1)}}}}return u};c.matches=function(e,u){return c(e,null,null,u)};c.matchesSelector=function(e,u){return c(u,null,null,[e]).length>0};c.find=function(A,e,B){var z;if(!A){return[]}for(var w=0,v=i.order.length;w<v;w++){var x,y=i.order[w];if((x=i.leftMatch[y].exec(A))){var u=x[1];x.splice(1,1);if(u.substr(u.length-1)!=="\\"){x[1]=(x[1]||"").replace(n,"");z=i.find[y](x,e,B);if(z!=null){A=A.replace(i.match[y],"");break}}}}if(!z){z=typeof e.getElementsByTagName!=="undefined"?e.getElementsByTagName("*"):[]}return{set:z,expr:A}};c.filter=function(E,D,H,x){var z,e,v=E,J=[],B=D,A=D&&D[0]&&c.isXML(D[0]);while(E&&D.length){for(var C in i.filter){if((z=i.leftMatch[C].exec(E))!=null&&z[2]){var I,G,u=i.filter[C],w=z[1];e=false;z.splice(1,1);if(w.substr(w.length-1)==="\\"){continue}if(B===J){J=[]}if(i.preFilter[C]){z=i.preFilter[C](z,B,H,J,x,A);if(!z){e=I=true}else{if(z===true){continue}}}if(z){for(var y=0;(G=B[y])!=null;y++){if(G){I=u(G,z,y,B);var F=x^!!I;if(H&&I!=null){if(F){e=true}else{B[y]=false}}else{if(F){J.push(G);e=true}}}}}if(I!==undefined){if(!H){B=J}E=E.replace(i.match[C],"");if(!e){return[]}break}}}if(E===v){if(e==null){c.error(E)}else{break}}v=E}return B};c.error=function(e){throw"Syntax error, unrecognized expression: "+e};var i=c.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(e){return e.getAttribute("href")},type:function(e){return e.getAttribute("type")}},relative:{"+":function(z,u){var w=typeof u==="string",y=w&&!t.test(u),A=w&&!y;if(y){u=u.toLowerCase()}for(var v=0,e=z.length,x;v<e;v++){if((x=z[v])){while((x=x.previousSibling)&&x.nodeType!==1){}z[v]=A||x&&x.nodeName.toLowerCase()===u?x||false:x===u}}if(A){c.filter(u,z,true)}},">":function(z,u){var y,x=typeof u==="string",v=0,e=z.length;if(x&&!t.test(u)){u=u.toLowerCase();for(;v<e;v++){y=z[v];if(y){var w=y.parentNode;z[v]=w.nodeName.toLowerCase()===u?w:false}}}else{for(;v<e;v++){y=z[v];if(y){z[v]=x?y.parentNode:y.parentNode===u}}if(x){c.filter(u,z,true)}}},"":function(w,u,y){var x,v=m++,e=r;if(typeof u==="string"&&!t.test(u)){u=u.toLowerCase();x=u;e=a}e("parentNode",u,v,w,x,y)},"~":function(w,u,y){var x,v=m++,e=r;if(typeof u==="string"&&!t.test(u)){u=u.toLowerCase();x=u;e=a}e("previousSibling",u,v,w,x,y)}},find:{ID:function(u,v,w){if(typeof v.getElementById!=="undefined"&&!w){var e=v.getElementById(u[1]);return e&&e.parentNode?[e]:[]}},NAME:function(v,y){if(typeof y.getElementsByName!=="undefined"){var u=[],x=y.getElementsByName(v[1]);for(var w=0,e=x.length;w<e;w++){if(x[w].getAttribute("name")===v[1]){u.push(x[w])}}return u.length===0?null:u}},TAG:function(e,u){if(typeof u.getElementsByTagName!=="undefined"){return u.getElementsByTagName(e[1])}}},preFilter:{CLASS:function(w,u,v,e,z,A){w=" "+w[1].replace(n,"")+" ";if(A){return w}for(var x=0,y;(y=u[x])!=null;x++){if(y){if(z^(y.className&&(" "+y.className+" ").replace(/[\t\n\r]/g," ").indexOf(w)>=0)){if(!v){e.push(y)}}else{if(v){u[x]=false}}}}return false},ID:function(e){return e[1].replace(n,"")},TAG:function(u,e){return u[1].replace(n,"").toLowerCase()},CHILD:function(e){if(e[1]==="nth"){if(!e[2]){c.error(e[0])}e[2]=e[2].replace(/^\+|\s*/g,"");var u=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(e[2]==="even"&&"2n"||e[2]==="odd"&&"2n+1"||!/\D/.test(e[2])&&"0n+"+e[2]||e[2]);e[2]=(u[1]+(u[2]||1))-0;e[3]=u[3]-0}else{if(e[2]){c.error(e[0])}}e[0]=m++;return e},ATTR:function(x,u,v,e,y,z){var w=x[1]=x[1].replace(n,"");if(!z&&i.attrMap[w]){x[1]=i.attrMap[w]}x[4]=(x[4]||x[5]||"").replace(n,"");if(x[2]==="~="){x[4]=" "+x[4]+" "}return x},PSEUDO:function(x,u,v,e,y){if(x[1]==="not"){if((l.exec(x[3])||"").length>1||/^\w/.test(x[3])){x[3]=c(x[3],null,null,u)}else{var w=c.filter(x[3],u,v,true^y);if(!v){e.push.apply(e,w)}return false}}else{if(i.match.POS.test(x[0])||i.match.CHILD.test(x[0])){return true}}return x},POS:function(e){e.unshift(true);return e}},filters:{enabled:function(e){return e.disabled===false&&e.type!=="hidden"},disabled:function(e){return e.disabled===true},checked:function(e){return e.checked===true},selected:function(e){if(e.parentNode){e.parentNode.selectedIndex}return e.selected===true},parent:function(e){return !!e.firstChild},empty:function(e){return !e.firstChild},has:function(v,u,e){return !!c(e[3],v).length},header:function(e){return(/h\d/i).test(e.nodeName)},text:function(v){var e=v.getAttribute("type"),u=v.type;return v.nodeName.toLowerCase()==="input"&&"text"===u&&(e===u||e===null)},radio:function(e){return e.nodeName.toLowerCase()==="input"&&"radio"===e.type},checkbox:function(e){return e.nodeName.toLowerCase()==="input"&&"checkbox"===e.type},file:function(e){return e.nodeName.toLowerCase()==="input"&&"file"===e.type},password:function(e){return e.nodeName.toLowerCase()==="input"&&"password"===e.type},submit:function(u){var e=u.nodeName.toLowerCase();return(e==="input"||e==="button")&&"submit"===u.type},image:function(e){return e.nodeName.toLowerCase()==="input"&&"image"===e.type},reset:function(u){var e=u.nodeName.toLowerCase();return(e==="input"||e==="button")&&"reset"===u.type},button:function(u){var e=u.nodeName.toLowerCase();return e==="input"&&"button"===u.type||e==="button"},input:function(e){return(/input|select|textarea|button/i).test(e.nodeName)},focus:function(e){return e===e.ownerDocument.activeElement}},setFilters:{first:function(u,e){return e===0},last:function(v,u,e,w){return u===w.length-1},even:function(u,e){return e%2===0},odd:function(u,e){return e%2===1},lt:function(v,u,e){return u<e[3]-0},gt:function(v,u,e){return u>e[3]-0},nth:function(v,u,e){return e[3]-0===u},eq:function(v,u,e){return e[3]-0===u}},filter:{PSEUDO:function(v,A,z,B){var e=A[1],u=i.filters[e];if(u){return u(v,z,A,B)}else{if(e==="contains"){return(v.textContent||v.innerText||c.getText([v])||"").indexOf(A[3])>=0}else{if(e==="not"){var w=A[3];for(var y=0,x=w.length;y<x;y++){if(w[y]===v){return false}}return true}else{c.error(e)}}}},CHILD:function(e,w){var z=w[1],u=e;switch(z){case"only":case"first":while((u=u.previousSibling)){if(u.nodeType===1){return false}}if(z==="first"){return true}u=e;case"last":while((u=u.nextSibling)){if(u.nodeType===1){return false}}return true;case"nth":var v=w[2],C=w[3];if(v===1&&C===0){return true}var y=w[0],B=e.parentNode;if(B&&(B.sizcache!==y||!e.nodeIndex)){var x=0;for(u=B.firstChild;u;u=u.nextSibling){if(u.nodeType===1){u.nodeIndex=++x}}B.sizcache=y}var A=e.nodeIndex-C;if(v===0){return A===0}else{return(A%v===0&&A/v>=0)}}},ID:function(u,e){return u.nodeType===1&&u.getAttribute("id")===e},TAG:function(u,e){return(e==="*"&&u.nodeType===1)||u.nodeName.toLowerCase()===e},CLASS:function(u,e){return(" "+(u.className||u.getAttribute("class"))+" ").indexOf(e)>-1},ATTR:function(y,w){var v=w[1],e=i.attrHandle[v]?i.attrHandle[v](y):y[v]!=null?y[v]:y.getAttribute(v),z=e+"",x=w[2],u=w[4];return e==null?x==="!=":x==="="?z===u:x==="*="?z.indexOf(u)>=0:x==="~="?(" "+z+" ").indexOf(u)>=0:!u?z&&e!==false:x==="!="?z!==u:x==="^="?z.indexOf(u)===0:x==="$="?z.substr(z.length-u.length)===u:x==="|="?z===u||z.substr(0,u.length+1)===u+"-":false},POS:function(x,u,v,y){var e=u[2],w=i.setFilters[e];if(w){return w(x,v,u,y)}}}};var h=i.match.POS,b=function(u,e){return"\\"+(e-0+1)};for(var d in i.match){i.match[d]=new RegExp(i.match[d].source+(/(?![^\[]*\])(?![^\(]*\))/.source));i.leftMatch[d]=new RegExp(/(^(?:.|\r|\n)*?)/.source+i.match[d].source.replace(/\\(\d+)/g,b))}var j=function(u,e){u=Array.prototype.slice.call(u,0);if(e){e.push.apply(e,u);return e}return u};try{Array.prototype.slice.call(document.documentElement.childNodes,0)[0].nodeType}catch(s){j=function(x,w){var v=0,u=w||[];if(p.call(x)==="[object Array]"){Array.prototype.push.apply(u,x)}else{if(typeof x.length==="number"){for(var e=x.length;v<e;v++){u.push(x[v])}}else{for(;x[v];v++){u.push(x[v])}}}return u}}var o,k;if(document.documentElement.compareDocumentPosition){o=function(u,e){if(u===e){g=true;return 0}if(!u.compareDocumentPosition||!e.compareDocumentPosition){return u.compareDocumentPosition?-1:1}return u.compareDocumentPosition(e)&4?-1:1}}else{o=function(B,A){if(B===A){g=true;return 0}else{if(B.sourceIndex&&A.sourceIndex){return B.sourceIndex-A.sourceIndex}}var y,u,v=[],e=[],x=B.parentNode,z=A.parentNode,C=x;if(x===z){return k(B,A)}else{if(!x){return -1}else{if(!z){return 1}}}while(C){v.unshift(C);C=C.parentNode}C=z;while(C){e.unshift(C);C=C.parentNode}y=v.length;u=e.length;for(var w=0;w<y&&w<u;w++){if(v[w]!==e[w]){return k(v[w],e[w])}}return w===y?k(B,e[w],-1):k(v[w],A,1)};k=function(u,e,v){if(u===e){return v}var w=u.nextSibling;while(w){if(w===e){return -1}w=w.nextSibling}return 1}}c.getText=function(e){var u="",w;for(var v=0;e[v];v++){w=e[v];if(w.nodeType===3||w.nodeType===4){u+=w.nodeValue}else{if(w.nodeType!==8){u+=c.getText(w.childNodes)}}}return u};(function(){var u=document.createElement("div"),v="script"+(new Date()).getTime(),e=document.documentElement;u.innerHTML="<a name='"+v+"'/>";e.insertBefore(u,e.firstChild);if(document.getElementById(v)){i.find.ID=function(x,y,z){if(typeof y.getElementById!=="undefined"&&!z){var w=y.getElementById(x[1]);return w?w.id===x[1]||typeof w.getAttributeNode!=="undefined"&&w.getAttributeNode("id").nodeValue===x[1]?[w]:undefined:[]}};i.filter.ID=function(y,w){var x=typeof y.getAttributeNode!=="undefined"&&y.getAttributeNode("id");return y.nodeType===1&&x&&x.nodeValue===w}}e.removeChild(u);e=u=null})();(function(){var e=document.createElement("div");e.appendChild(document.createComment(""));if(e.getElementsByTagName("*").length>0){i.find.TAG=function(u,y){var x=y.getElementsByTagName(u[1]);if(u[1]==="*"){var w=[];for(var v=0;x[v];v++){if(x[v].nodeType===1){w.push(x[v])}}x=w}return x}}e.innerHTML="<a href='#'></a>";if(e.firstChild&&typeof e.firstChild.getAttribute!=="undefined"&&e.firstChild.getAttribute("href")!=="#"){i.attrHandle.href=function(u){return u.getAttribute("href",2)}}e=null})();if(document.querySelectorAll){(function(){var e=c,w=document.createElement("div"),v="__sizzle__";w.innerHTML="<p class='TEST'></p>";if(w.querySelectorAll&&w.querySelectorAll(".TEST").length===0){return}c=function(H,y,C,G){y=y||document;if(!G&&!c.isXML(y)){var F=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(H);if(F&&(y.nodeType===1||y.nodeType===9)){if(F[1]){return j(y.getElementsByTagName(H),C)}else{if(F[2]&&i.find.CLASS&&y.getElementsByClassName){return j(y.getElementsByClassName(F[2]),C)}}}if(y.nodeType===9){if(H==="body"&&y.body){return j([y.body],C)}else{if(F&&F[3]){var B=y.getElementById(F[3]);if(B&&B.parentNode){if(B.id===F[3]){return j([B],C)}}else{return j([],C)}}}try{return j(y.querySelectorAll(H),C)}catch(D){}}else{if(y.nodeType===1&&y.nodeName.toLowerCase()!=="object"){var z=y,A=y.getAttribute("id"),x=A||v,J=y.parentNode,I=/^\s*[+~]/.test(H);if(!A){y.setAttribute("id",x)}else{x=x.replace(/'/g,"\\$&")}if(I&&J){y=y.parentNode}try{if(!I||J){return j(y.querySelectorAll("[id='"+x+"'] "+H),C)}}catch(E){}finally{if(!A){z.removeAttribute("id")}}}}}return e(H,y,C,G)};for(var u in e){c[u]=e[u]}w=null})()}(function(){var e=document.documentElement,v=e.matchesSelector||e.mozMatchesSelector||e.webkitMatchesSelector||e.msMatchesSelector;if(v){var x=!v.call(document.createElement("div"),"div"),u=false;try{v.call(document.documentElement,"[test!='']:sizzle")}catch(w){u=true}c.matchesSelector=function(z,B){B=B.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!c.isXML(z)){try{if(u||!i.match.PSEUDO.test(B)&&!/!=/.test(B)){var y=v.call(z,B);if(y||!x||z.document&&z.document.nodeType!==11){return y}}}catch(A){}}return c(B,null,null,[z]).length>0}}})();(function(){var e=document.createElement("div");e.innerHTML="<div class='test e'></div><div class='test'></div>";if(!e.getElementsByClassName||e.getElementsByClassName("e").length===0){return}e.lastChild.className="e";if(e.getElementsByClassName("e").length===1){return}i.order.splice(1,0,"CLASS");i.find.CLASS=function(u,v,w){if(typeof v.getElementsByClassName!=="undefined"&&!w){return v.getElementsByClassName(u[1])}};e=null})();function a(u,z,y,C,A,B){for(var w=0,v=C.length;w<v;w++){var e=C[w];if(e){var x=false;e=e[u];while(e){if(e.sizcache===y){x=C[e.sizset];break}if(e.nodeType===1&&!B){e.sizcache=y;e.sizset=w}if(e.nodeName.toLowerCase()===z){x=e;break}e=e[u]}C[w]=x}}}function r(u,z,y,C,A,B){for(var w=0,v=C.length;w<v;w++){var e=C[w];if(e){var x=false;e=e[u];while(e){if(e.sizcache===y){x=C[e.sizset];break}if(e.nodeType===1){if(!B){e.sizcache=y;e.sizset=w}if(typeof z!=="string"){if(e===z){x=true;break}}else{if(c.filter(z,[e]).length>0){x=e;break}}}e=e[u]}C[w]=x}}}if(document.documentElement.contains){c.contains=function(u,e){return u!==e&&(u.contains?u.contains(e):true)}}else{if(document.documentElement.compareDocumentPosition){c.contains=function(u,e){return !!(u.compareDocumentPosition(e)&16)}}else{c.contains=function(){return false}}}c.isXML=function(e){var u=(e?e.ownerDocument||e:0).documentElement;return u?u.nodeName!=="HTML":false};var q=function(e,A){var y,w=[],x="",v=A.nodeType?[A]:A;while((y=i.match.PSEUDO.exec(e))){x+=y[0];e=e.replace(i.match.PSEUDO,"")}e=i.relative[e]?e+"*":e;for(var z=0,u=v.length;z<u;z++){c(e,v[z],w)}return c.filter(x,w)};this.Sizzle=c})();
//
//    return api;
//}());

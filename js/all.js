

/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/lib/Class.coffee ---- */


(function() {
  var Class,
    slice = [].slice;

  jQuery(document).ready(function() {});

  Class = (function() {
    function Class() {}

    Class.prototype.trace = true;

    Class.prototype.log = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (!this.trace) {
        return;
      }
      if (typeof console === 'undefined') {
        return;
      }
      args.unshift("[" + this.constructor.name + "]");
      console.log.apply(console, args);
      return this;
    };

    Class.prototype.logStart = function() {
      var args, name;
      name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (!this.trace) {
        return;
      }
      this.logtimers || (this.logtimers = {});
      this.logtimers[name] = +(new Date);
      if (args.length > 0) {
        this.log.apply(this, ["" + name].concat(slice.call(args), ["(started)"]));
      }
      return this;
    };

    Class.prototype.logEnd = function() {
      var args, ms, name;
      name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      ms = +(new Date) - this.logtimers[name];
      this.log.apply(this, ["" + name].concat(slice.call(args), ["(Done in " + ms + "ms)"]));
      return this;
    };

    return Class;

  })();

  window.Class = Class;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/lib/Dollar.coffee ---- */


(function() {
  window.$ = function(selector) {
    if (selector.startsWith("#")) {
      return document.getElementById(selector.replace("#", ""));
    }
  };

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/lib/Promise.coffee ---- */


(function() {
  var Promise,
    slice = [].slice;

  Promise = (function() {
    Promise.join = function() {
      var args, fn, i, len, num_uncompleted, promise, task, task_id, tasks;
      tasks = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      num_uncompleted = tasks.length;
      args = new Array(num_uncompleted);
      promise = new Promise();
      fn = function(task_id) {
        return task.then(function() {
          var callback, j, len1, ref, results;
          args[task_id] = Array.prototype.slice.call(arguments);
          num_uncompleted--;
          if (num_uncompleted === 0) {
            ref = promise.callbacks;
            results = [];
            for (j = 0, len1 = ref.length; j < len1; j++) {
              callback = ref[j];
              results.push(callback.apply(promise, args));
            }
            return results;
          }
        });
      };
      for (task_id = i = 0, len = tasks.length; i < len; task_id = ++i) {
        task = tasks[task_id];
        fn(task_id);
      }
      return promise;
    };

    function Promise() {
      this.resolved = false;
      this.end_promise = null;
      this.result = null;
      this.callbacks = [];
    }

    Promise.prototype.resolve = function() {
      var back, callback, i, len, ref;
      if (this.resolved) {
        return false;
      }
      this.resolved = true;
      this.data = arguments;
      if (!arguments.length) {
        this.data = [true];
      }
      this.result = this.data[0];
      ref = this.callbacks;
      for (i = 0, len = ref.length; i < len; i++) {
        callback = ref[i];
        back = callback.apply(callback, this.data);
      }
      if (this.end_promise && back && back.then) {
        return back.then((function(_this) {
          return function(back_res) {
            return _this.end_promise.resolve(back_res);
          };
        })(this));
      }
    };

    Promise.prototype.fail = function() {
      return this.resolve(false);
    };

    Promise.prototype.then = function(callback) {
      if (this.resolved === true) {
        return callback.apply(callback, this.data);
      }
      this.callbacks.push(callback);
      this.end_promise = new Promise();
      return this.end_promise;
    };

    return Promise;

  })();

  window.Promise = Promise;


  /*
  s = Date.now()
  log = (text) ->
  	console.log Date.now()-s, Array.prototype.slice.call(arguments).join(", ")
  
  log "Started"
  
  cmd = (query) ->
  	p = new Promise()
  	setTimeout ( ->
  		p.resolve query+" Result"
  	), 100
  	return p
  
  
  back = cmd("SELECT * FROM message").then (res) ->
  	log res
  	p = new Promise()
  	setTimeout ( ->
  		p.resolve("DONE parsing SELECT")
  	), 100
  	return p
  .then (res) ->
  	log "Back of messages", res
  	return cmd("SELECT * FROM users")
  .then (res) ->
  	log "End result", res
  
  log "Query started", back
  
  
  q1 = cmd("SELECT * FROM anything")
  q2 = cmd("SELECT * FROM something")
  
  Promise.join(q1, q2).then (res1, res2) ->
    log res1, res2 */

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/lib/Property.coffee ---- */


(function() {
  Function.prototype.property = function(prop, desc) {
    return Object.defineProperty(this.prototype, prop, desc);
  };

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/lib/Prototypes.coffee ---- */


(function() {
  String.prototype.startsWith = function(s) {
    return this.slice(0, s.length) === s;
  };

  String.prototype.endsWith = function(s) {
    return s === '' || this.slice(-s.length) === s;
  };

  String.prototype.repeat = function(count) {
    return new Array(count + 1).join(this);
  };

  window.isEmpty = function(obj) {
    var key;
    for (key in obj) {
      return false;
    }
    return true;
  };

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/lib/RateLimitCb.coffee ---- */


(function() {
  var call_after_interval, calling, last_time,
    slice = [].slice;

  last_time = {};

  calling = {};

  call_after_interval = {};

  window.RateLimitCb = function(interval, fn, args) {
    var cb;
    if (args == null) {
      args = [];
    }
    cb = function() {
      var left;
      left = interval - (Date.now() - last_time[fn]);
      if (left <= 0) {
        delete last_time[fn];
        if (calling[fn]) {
          RateLimitCb(interval, fn, calling[fn]);
        }
        return delete calling[fn];
      } else {
        return setTimeout((function() {
          delete last_time[fn];
          if (calling[fn]) {
            RateLimitCb(interval, fn, calling[fn]);
          }
          return delete calling[fn];
        }), left);
      }
    };
    if (last_time[fn]) {
      return calling[fn] = args;
    } else {
      last_time[fn] = Date.now();
      return fn.apply(this, [cb].concat(slice.call(args)));
    }
  };

  window.RateLimit = function(interval, fn) {
    if (!calling[fn]) {
      call_after_interval[fn] = false;
      fn();
      return calling[fn] = setTimeout((function() {
        if (call_after_interval[fn]) {
          fn();
        }
        delete calling[fn];
        return delete call_after_interval[fn];
      }), interval);
    } else {
      return call_after_interval[fn] = true;
    }
  };


  /*
  window.s = Date.now()
  window.load = (done, num) ->
    console.log "Loading #{num}...", Date.now()-window.s
    setTimeout (-> done()), 1000
  
  RateLimit 500, window.load, [0] # Called instantly
  RateLimit 500, window.load, [1]
  setTimeout (-> RateLimit 500, window.load, [300]), 300
  setTimeout (-> RateLimit 500, window.load, [600]), 600 # Called after 1000ms
  setTimeout (-> RateLimit 500, window.load, [1000]), 1000
  setTimeout (-> RateLimit 500, window.load, [1200]), 1200  # Called after 2000ms
  setTimeout (-> RateLimit 500, window.load, [3000]), 3000  # Called after 3000ms */

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/lib/anime.min.js ---- */


/*
 * Anime v1.0.0
 * http://anime-js.com
 * JavaScript animation engine
 * Copyright (c) 2016 Julian Garnier
 * http://juliangarnier.com
 * Released under the MIT license
 */
(function(r,n){"function"===typeof define&&define.amd?define([],n):"object"===typeof module&&module.exports?module.exports=n():r.anime=n()})(this,function(){var r={duration:1E3,delay:0,loop:!1,autoplay:!0,direction:"normal",easing:"easeOutElastic",elasticity:400,round:!1,begin:void 0,update:void 0,complete:void 0},n="translateX translateY translateZ rotate rotateX rotateY rotateZ scale scaleX scaleY scaleZ skewX skewY".split(" "),e=function(){return{array:function(a){return Array.isArray(a)},object:function(a){return-1<
Object.prototype.toString.call(a).indexOf("Object")},html:function(a){return a instanceof NodeList||a instanceof HTMLCollection},node:function(a){return a.nodeType},svg:function(a){return a instanceof SVGElement},number:function(a){return!isNaN(parseInt(a))},string:function(a){return"string"===typeof a},func:function(a){return"function"===typeof a},undef:function(a){return"undefined"===typeof a},"null":function(a){return"null"===typeof a},hex:function(a){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a)},
rgb:function(a){return/^rgb/.test(a)},rgba:function(a){return/^rgba/.test(a)},hsl:function(a){return/^hsl/.test(a)},color:function(a){return e.hex(a)||e.rgb(a)||e.rgba(a)||e.hsl(a)}}}(),z=function(){var a={},b={Sine:function(a){return 1-Math.cos(a*Math.PI/2)},Circ:function(a){return 1-Math.sqrt(1-a*a)},Elastic:function(a,b){if(0===a||1===a)return a;var f=1-Math.min(b,998)/1E3,h=a/1-1;return-(Math.pow(2,10*h)*Math.sin(2*(h-f/(2*Math.PI)*Math.asin(1))*Math.PI/f))},Back:function(a){return a*a*(3*a-2)},
Bounce:function(a){for(var b,f=4;a<((b=Math.pow(2,--f))-1)/11;);return 1/Math.pow(4,3-f)-7.5625*Math.pow((3*b-2)/22-a,2)}};["Quad","Cubic","Quart","Quint","Expo"].forEach(function(a,d){b[a]=function(a){return Math.pow(a,d+2)}});Object.keys(b).forEach(function(c){var d=b[c];a["easeIn"+c]=d;a["easeOut"+c]=function(a,b){return 1-d(1-a,b)};a["easeInOut"+c]=function(a,b){return.5>a?d(2*a,b)/2:1-d(-2*a+2,b)/2}});a.linear=function(a){return a};return a}(),u=function(a){return e.string(a)?a:a+""},A=function(a){return a.replace(/([a-z])([A-Z])/g,
"$1-$2").toLowerCase()},B=function(a){if(e.color(a))return!1;try{return document.querySelectorAll(a)}catch(b){return!1}},v=function(a){return a.reduce(function(a,c){return a.concat(e.array(c)?v(c):c)},[])},p=function(a){if(e.array(a))return a;e.string(a)&&(a=B(a)||a);return e.html(a)?[].slice.call(a):[a]},C=function(a,b){return a.some(function(a){return a===b})},N=function(a,b){var c={};a.forEach(function(a){var f=JSON.stringify(b.map(function(b){return a[b]}));c[f]=c[f]||[];c[f].push(a)});return Object.keys(c).map(function(a){return c[a]})},
D=function(a){return a.filter(function(a,c,d){return d.indexOf(a)===c})},w=function(a){var b={},c;for(c in a)b[c]=a[c];return b},t=function(a,b){for(var c in b)a[c]=e.undef(a[c])?b[c]:a[c];return a},O=function(a){a=a.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(a,b,c,e){return b+b+c+c+e+e});var b=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);a=parseInt(b[1],16);var c=parseInt(b[2],16),b=parseInt(b[3],16);return"rgb("+a+","+c+","+b+")"},P=function(a){a=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(a);
var b=parseInt(a[1])/360,c=parseInt(a[2])/100,d=parseInt(a[3])/100;a=function(a,b,c){0>c&&(c+=1);1<c&&--c;return c<1/6?a+6*(b-a)*c:.5>c?b:c<2/3?a+(b-a)*(2/3-c)*6:a};if(0==c)c=d=b=d;else var f=.5>d?d*(1+c):d+c-d*c,h=2*d-f,c=a(h,f,b+1/3),d=a(h,f,b),b=a(h,f,b-1/3);return"rgb("+255*c+","+255*d+","+255*b+")"},k=function(a){return/([\+\-]?[0-9|auto\.]+)(%|px|pt|em|rem|in|cm|mm|ex|pc|vw|vh|deg)?/.exec(a)[2]},E=function(a,b,c){return k(b)?b:-1<a.indexOf("translate")?k(c)?b+k(c):b+"px":-1<a.indexOf("rotate")||
-1<a.indexOf("skew")?b+"deg":b},F=function(a,b){if((e.node(a)||e.svg(a))&&C(n,b))return"transform";if((e.node(a)||e.svg(a))&&"transform"!==b&&x(a,b))return"css";if((e.node(a)||e.svg(a))&&(a.getAttribute(b)||e.svg(a)&&a[b]))return"attribute";if(!e["null"](a[b])&&!e.undef(a[b]))return"object"},x=function(a,b){if(b in a.style)return getComputedStyle(a).getPropertyValue(A(b))||"0"},Q=function(a,b){var c=-1<b.indexOf("scale")?1:0,d=a.style.transform;if(!d)return c;for(var f=/(\w+)\((.+?)\)/g,h=[],e=[],
q=[];h=f.exec(d);)e.push(h[1]),q.push(h[2]);d=q.filter(function(a,c){return e[c]===b});return d.length?d[0]:c},G=function(a,b){switch(F(a,b)){case "transform":return Q(a,b);case "css":return x(a,b);case "attribute":return a.getAttribute(b)}return a[b]||0},H=function(a,b,c){if(e.color(b))return b=e.rgb(b)||e.rgba(b)?b:e.hex(b)?O(b):e.hsl(b)?P(b):void 0,b;if(k(b))return b;a=k(a.to)?k(a.to):k(a.from);!a&&c&&(a=k(c));return a?b+a:b},I=function(a){var b=/-?\d*\.?\d+/g;return{original:a,numbers:u(a).match(b)?
u(a).match(b).map(Number):[0],strings:u(a).split(b)}},R=function(a,b,c){return b.reduce(function(b,f,e){f=f?f:c[e-1];return b+a[e-1]+f})},S=function(a){a=a?v(e.array(a)?a.map(p):p(a)):[];return a.map(function(a,c){return{target:a,id:c}})},T=function(a,b){var c=[],d;for(d in a)if(!r.hasOwnProperty(d)&&"targets"!==d){var f=e.object(a[d])?w(a[d]):{value:a[d]};f.name=d;c.push(t(f,b))}return c},J=function(a,b,c,d){"transform"===c?(c=a+"("+E(a,b.from,b.to)+")",b=a+"("+E(a,b.to)+")"):(a="css"===c?x(d,a):
void 0,c=H(b,b.from,a),b=H(b,b.to,a));return{from:I(c),to:I(b)}},U=function(a,b){var c=[];a.forEach(function(d,f){var h=d.target;return b.forEach(function(b){var q=F(h,b.name);if(q){var k;k=b.name;var g=b.value,g=p(e.func(g)?g(h,f):g);k={from:1<g.length?g[0]:G(h,k),to:1<g.length?g[1]:g[0]};g=w(b);g.animatables=d;g.type=q;g.from=J(b.name,k,g.type,h).from;g.to=J(b.name,k,g.type,h).to;g.round=e.color(k.from)||g.round?1:0;g.delay=(e.func(g.delay)?g.delay(h,f,a.length):g.delay)/l.speed;g.duration=(e.func(g.duration)?
g.duration(h,f,a.length):g.duration)/l.speed;c.push(g)}})});return c},V=function(a,b){var c=U(a,b);return N(c,["name","from","to","delay","duration"]).map(function(a){var b=w(a[0]);b.animatables=a.map(function(a){return a.animatables});b.totalDuration=b.delay+b.duration;return b})},y=function(a,b){a.tweens.forEach(function(c){var d=c.from,f=a.duration-(c.delay+c.duration);c.from=c.to;c.to=d;b&&(c.delay=f)});a.reversed=a.reversed?!1:!0},K=function(a){var b=[],c=[];a.tweens.forEach(function(a){if("css"===
a.type||"transform"===a.type)b.push("css"===a.type?A(a.name):"transform"),a.animatables.forEach(function(a){c.push(a.target)})});return{properties:D(b).join(", "),elements:D(c)}},W=function(a){var b=K(a);b.elements.forEach(function(a){a.style.willChange=b.properties})},X=function(a){K(a).elements.forEach(function(a){a.style.removeProperty("will-change")})},Y=function(a,b){var c=a.path,d=a.value*b,f=function(f){f=f||0;return c.getPointAtLength(1<b?a.value+f:d+f)},e=f(),k=f(-1),f=f(1);switch(a.name){case "translateX":return e.x;
case "translateY":return e.y;case "rotate":return 180*Math.atan2(f.y-k.y,f.x-k.x)/Math.PI}},Z=function(a,b){var c=Math.min(Math.max(b-a.delay,0),a.duration)/a.duration,d=a.to.numbers.map(function(b,d){var e=a.from.numbers[d],k=z[a.easing](c,a.elasticity),e=a.path?Y(a,k):e+k*(b-e);return e=a.round?Math.round(e*a.round)/a.round:e});return R(d,a.to.strings,a.from.strings)},L=function(a,b){var c=void 0;a.time=Math.min(b,a.duration);a.progress=a.time/a.duration*100;a.tweens.forEach(function(a){a.currentValue=
Z(a,b);var d=a.currentValue;a.animatables.forEach(function(b){var e=b.id;switch(a.type){case "css":b.target.style[a.name]=d;break;case "attribute":b.target.setAttribute(a.name,d);break;case "object":b.target[a.name]=d;break;case "transform":c||(c={}),c[e]||(c[e]=[]),c[e].push(d)}})});if(c)for(var d in c)a.animatables[d].target.style.transform=c[d].join(" ");a.settings.update&&a.settings.update(a)},M=function(a){var b={};b.animatables=S(a.targets);b.settings=t(a,r);b.properties=T(a,b.settings);b.tweens=
V(b.animatables,b.properties);b.duration=b.tweens.length?Math.max.apply(Math,b.tweens.map(function(a){return a.totalDuration})):a.duration/l.speed;b.time=0;b.progress=0;b.running=!1;b.ended=!1;return b},m=[],l=function(a){var b=M(a),c={tick:function(){if(b.running){b.ended=!1;c.now=+new Date;c.current=c.last+c.now-c.start;L(b,c.current);var a=b.settings;a.begin&&c.current>=a.delay&&(a.begin(b),a.begin=void 0);c.current>=b.duration?(a.loop?(c.start=+new Date,"alternate"===a.direction&&y(b,!0),e.number(a.loop)&&
a.loop--,c.raf=requestAnimationFrame(c.tick)):(b.ended=!0,a.complete&&a.complete(b),b.pause()),c.last=0):c.raf=requestAnimationFrame(c.tick)}}};b.seek=function(a){L(b,a/100*b.duration)};b.pause=function(){b.running=!1;cancelAnimationFrame(c.raf);X(b);var a=m.indexOf(b);-1<a&&m.splice(a,1)};b.play=function(a){a&&(b=t(M(t(a,b.settings)),b));b.pause();b.running=!0;c.start=+new Date;c.last=b.ended?0:b.time;a=b.settings;"reverse"===a.direction&&y(b);"alternate"!==a.direction||a.loop||(a.loop=1);W(b);m.push(b);
c.raf=requestAnimationFrame(c.tick)};b.restart=function(){b.reversed&&y(b);b.pause();b.seek(0);b.play()};b.settings.autoplay&&b.play();return b};l.speed=1;l.list=m;l.remove=function(a){a=v(e.array(a)?a.map(p):p(a));for(var b=m.length-1;0<=b;b--)for(var c=m[b],d=c.tweens.length-1;0<=d;d--)for(var f=c.tweens[d],h=f.animatables.length-1;0<=h;h--)C(a,f.animatables[h].target)&&(f.animatables.splice(h,1),f.animatables.length||c.tweens.splice(d,1),c.tweens.length||c.pause())};l.easings=z;l.getValue=G;l.path=
function(a){a=e.string(a)?B(a)[0]:a;return{path:a,value:a.getTotalLength()}};l.random=function(a,b){return Math.floor(Math.random()*(b-a+1))+a};return l});


/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/lib/clone.js ---- */


function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
}


/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/lib/htmlentities.js ---- */


//html entits
//src https://github.com/mdevils/node-html-entities/blob/master/lib/html5-entities.js

(function() {
var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['CloseCurlyDoubleQuote', [8221]], ['CloseCurlyQuote', [8217]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (str.length === 0) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    var strLength = str.length;
    if (strLength === 0) {
        return '';
    }
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    var strLength = str.length;
    if (strLength === 0) {
        return '';
    }
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    var strLength = str.length;
    if (strLength === 0) {
        return '';
    }
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

window.entities=new Html5Entities()

}());



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/lib/jquery.min.js ---- */


/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.2.1",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null==a?f.call(this):a<0?this[a+this.length]:this[a]},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(a<0?b:0);return this.pushStack(c>=0&&c<b?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);h<i;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=Array.isArray(d)))?(e?(e=!1,f=c&&Array.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return!(!a||"[object Object]"!==k.call(a))&&(!(b=e(a))||(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n))},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;d<c;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;d<c;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;f<g;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;f<d;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;if("string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a))return d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"!==c&&!r.isWindow(a)&&("array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a)}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:d<0?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ca=function(a,b){return b?"\0"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0&&("form"in a||"label"in a)},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"form"in b?b.parentNode&&b.disabled===!1?"label"in b?"label"in b.parentNode?b.parentNode.disabled===a:b.disabled===a:b.isDisabled===a||b.isDisabled!==!a&&ea(b)===a:b.disabled===a:"label"in b&&b.disabled===a}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return!!b&&"HTML"!==b.nodeName},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}}):(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c,d,e,f=b.getElementById(a);if(f){if(c=f.getAttributeNode("id"),c&&c.value===a)return[f];e=b.getElementsByName(a),d=0;while(f=e[d++])if(c=f.getAttributeNode("id"),c&&c.value===a)return[f]}return[]}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){if("undefined"!=typeof b.getElementsByClassName&&p)return b.getElementsByClassName(a)},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:!b||(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b&&(e===c||e.slice(0,c.length+1)===c+"-"))}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[c<0?c+b:c]}),even:pa(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e);return!1}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}return!1}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;d<e;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;h<i;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];i<f;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;e<f;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,i<e&&ya(a.slice(i,e)),e<f&&ya(a=a.slice(e)),e<f&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,c,e){var f,i,j,k,l,m="function"==typeof a&&a,n=!e&&g(a=m.selector||a);if(c=c||[],1===n.length){if(i=n[0]=n[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&9===b.nodeType&&p&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(_,aa),b)||[])[0],!b)return c;m&&(b=b.parentNode),a=a.slice(i.shift().value.length)}f=V.needsContext.test(a)?0:i.length;while(f--){if(j=i[f],d.relative[k=j.type])break;if((l=d.find[k])&&(e=l(j.matches[0].replace(_,aa),$.test(i[0].type)&&qa(b.parentNode)||b))){if(i.splice(f,1),a=e.length&&sa(i),!a)return G.apply(c,e),c;break}}}return(m||h(a,n))(e,b,!p,c,!b||$.test(a)&&qa(b.parentNode)||b),c},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;if(!c)return a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext;function B(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()}var C=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,D=/^.[^:#\[\.,]*$/;function E(a,b,c){return r.isFunction(b)?r.grep(a,function(a,d){return!!b.call(a,d,a)!==c}):b.nodeType?r.grep(a,function(a){return a===b!==c}):"string"!=typeof b?r.grep(a,function(a){return i.call(b,a)>-1!==c}):D.test(b)?r.filter(b,a,c):(b=r.filter(b,a),r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType}))}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;b<d;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;b<d;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(E(this,a||[],!1))},not:function(a){return this.pushStack(E(this,a||[],!0))},is:function(a){return!!E(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var F,G=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,H=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||F,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:G.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),C.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};H.prototype=r.fn,F=r(d);var I=/^(?:parents|prev(?:Until|All))/,J={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;a<c;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;d<e;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function K(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return K(a,"nextSibling")},prev:function(a){return K(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return B(a,"iframe")?a.contentDocument:(B(a,"template")&&(a=a.content||a),r.merge([],a.childNodes))}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(J[a]||r.uniqueSort(e),I.test(a)&&e.reverse()),this.pushStack(e)}});var L=/[^\x20\t\r\n\f]+/g;function M(a){var b={};return r.each(a.match(L)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?M(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=e||a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),c<=h&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function N(a){return a}function O(a){throw a}function P(a,b,c,d){var e;try{a&&r.isFunction(e=a.promise)?e.call(a).done(b).fail(c):a&&r.isFunction(e=a.then)?e.call(a,b,c):b.apply(void 0,[a].slice(d))}catch(a){c.apply(void 0,[a])}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(b<f)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,N,e),g(f,c,O,e)):(f++,j.call(a,g(f,c,N,e),g(f,c,O,e),g(f,c,N,c.notifyWith))):(d!==N&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==O&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:N,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:N)),c[2][3].add(g(0,a,r.isFunction(d)?d:O))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(b<=1&&(P(a,g.done(h(c)).resolve,g.reject,!b),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)P(e[c],h(c),g.reject);return g.promise()}});var Q=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&Q.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)},r.readyException=function(b){a.setTimeout(function(){throw b})};var R=r.Deferred();r.fn.ready=function(a){return R.then(a)["catch"](function(a){r.readyException(a)}),this},r.extend({isReady:!1,readyWait:1,ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||R.resolveWith(d,[r]))}}),r.ready.then=R.then;function S(){d.removeEventListener("DOMContentLoaded",S),
a.removeEventListener("load",S),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",S),a.addEventListener("load",S));var T=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)T(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(r(a),c)})),b))for(;h<i;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},U=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function V(){this.expando=r.expando+V.uid++}V.uid=1,V.prototype={cache:function(a){var b=a[this.expando];return b||(b={},U(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){Array.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(L)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var W=new V,X=new V,Y=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Z=/[A-Z]/g;function $(a){return"true"===a||"false"!==a&&("null"===a?null:a===+a+""?+a:Y.test(a)?JSON.parse(a):a)}function _(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Z,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c=$(c)}catch(e){}X.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return X.hasData(a)||W.hasData(a)},data:function(a,b,c){return X.access(a,b,c)},removeData:function(a,b){X.remove(a,b)},_data:function(a,b,c){return W.access(a,b,c)},_removeData:function(a,b){W.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=X.get(f),1===f.nodeType&&!W.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),_(f,d,e[d])));W.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){X.set(this,a)}):T(this,function(b){var c;if(f&&void 0===b){if(c=X.get(f,a),void 0!==c)return c;if(c=_(f,a),void 0!==c)return c}else this.each(function(){X.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){X.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=W.get(a,b),c&&(!d||Array.isArray(c)?d=W.access(a,b,r.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return W.get(a,c)||W.access(a,c,{empty:r.Callbacks("once memory").add(function(){W.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=W.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var aa=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ba=new RegExp("^(?:([+-])=|)("+aa+")([a-z%]*)$","i"),ca=["Top","Right","Bottom","Left"],da=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},ea=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function fa(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&ba.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var ga={};function ha(a){var b,c=a.ownerDocument,d=a.nodeName,e=ga[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),ga[d]=e,e)}function ia(a,b){for(var c,d,e=[],f=0,g=a.length;f<g;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=W.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&da(d)&&(e[f]=ha(d))):"none"!==c&&(e[f]="none",W.set(d,"display",c)));for(f=0;f<g;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ia(this,!0)},hide:function(){return ia(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){da(this)?r(this).show():r(this).hide()})}});var ja=/^(?:checkbox|radio)$/i,ka=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,la=/^$|\/(?:java|ecma)script/i,ma={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ma.optgroup=ma.option,ma.tbody=ma.tfoot=ma.colgroup=ma.caption=ma.thead,ma.th=ma.td;function na(a,b){var c;return c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[],void 0===b||b&&B(a,b)?r.merge([a],c):c}function oa(a,b){for(var c=0,d=a.length;c<d;c++)W.set(a[c],"globalEval",!b||W.get(b[c],"globalEval"))}var pa=/<|&#?\w+;/;function qa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;n<o;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(pa.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ka.exec(f)||["",""])[1].toLowerCase(),i=ma[h]||ma._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=na(l.appendChild(f),"script"),j&&oa(g),c){k=0;while(f=g[k++])la.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var ra=d.documentElement,sa=/^key/,ta=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ua=/^([^.]*)(?:\.(.+)|)/;function va(){return!0}function wa(){return!1}function xa(){try{return d.activeElement}catch(a){}}function ya(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)ya(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=wa;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(ra,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(L)||[""],j=b.length;while(j--)h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.hasData(a)&&W.get(a);if(q&&(i=q.events)){b=(b||"").match(L)||[""],j=b.length;while(j--)if(h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&W.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(W.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g,h=[],i=b.delegateCount,j=a.target;if(i&&j.nodeType&&!("click"===a.type&&a.button>=1))for(;j!==this;j=j.parentNode||this)if(1===j.nodeType&&("click"!==a.type||j.disabled!==!0)){for(f=[],g={},c=0;c<i;c++)d=b[c],e=d.selector+" ",void 0===g[e]&&(g[e]=d.needsContext?r(e,this).index(j)>-1:r.find(e,this,null,[j]).length),g[e]&&f.push(d);f.length&&h.push({elem:j,handlers:f})}return j=this,i<b.length&&h.push({elem:j,handlers:b.slice(i)}),h},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){if(this.originalEvent)return b(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[a]},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==xa()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===xa()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&B(this,"input"))return this.click(),!1},_default:function(a){return B(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?va:wa,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:wa,isPropagationStopped:wa,isImmediatePropagationStopped:wa,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=va,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=va,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=va,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&sa.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&ta.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return ya(this,a,b,c,d)},one:function(a,b,c,d){return ya(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=wa),this.each(function(){r.event.remove(this,a,c,b)})}});var za=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Aa=/<script|<style|<link/i,Ba=/checked\s*(?:[^=]|=\s*.checked.)/i,Ca=/^true\/(.*)/,Da=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Ea(a,b){return B(a,"table")&&B(11!==b.nodeType?b:b.firstChild,"tr")?r(">tbody",a)[0]||a:a}function Fa(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Ga(a){var b=Ca.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ha(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(W.hasData(a)&&(f=W.access(a),g=W.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;c<d;c++)r.event.add(b,e,j[e][c])}X.hasData(a)&&(h=X.access(a),i=r.extend({},h),X.set(b,i))}}function Ia(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ja.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ja(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&Ba.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ja(f,b,c,d)});if(m&&(e=qa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(na(e,"script"),Fa),i=h.length;l<m;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,na(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Ga),l=0;l<i;l++)j=h[l],la.test(j.type||"")&&!W.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Da,""),k))}return a}function Ka(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(na(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&oa(na(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(za,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=na(h),f=na(a),d=0,e=f.length;d<e;d++)Ia(f[d],g[d]);if(b)if(c)for(f=f||na(a),g=g||na(h),d=0,e=f.length;d<e;d++)Ha(f[d],g[d]);else Ha(a,h);return g=na(h,"script"),g.length>0&&oa(g,!i&&na(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(U(c)){if(b=c[W.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[W.expando]=void 0}c[X.expando]&&(c[X.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ka(this,a,!0)},remove:function(a){return Ka(this,a)},text:function(a){return T(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.appendChild(a)}})},prepend:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(na(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null!=a&&a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return T(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!Aa.test(a)&&!ma[(ka.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;c<d;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(na(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ja(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(na(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;g<=f;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var La=/^margin/,Ma=new RegExp("^("+aa+")(?!px)[a-z%]+$","i"),Na=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",ra.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,ra.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Oa(a,b,c){var d,e,f,g,h=a.style;return c=c||Na(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&Ma.test(g)&&La.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Pa(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Qa=/^(none|table(?!-c[ea]).+)/,Ra=/^--/,Sa={position:"absolute",visibility:"hidden",display:"block"},Ta={letterSpacing:"0",fontWeight:"400"},Ua=["Webkit","Moz","ms"],Va=d.createElement("div").style;function Wa(a){if(a in Va)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ua.length;while(c--)if(a=Ua[c]+b,a in Va)return a}function Xa(a){var b=r.cssProps[a];return b||(b=r.cssProps[a]=Wa(a)||a),b}function Ya(a,b,c){var d=ba.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Za(a,b,c,d,e){var f,g=0;for(f=c===(d?"border":"content")?4:"width"===b?1:0;f<4;f+=2)"margin"===c&&(g+=r.css(a,c+ca[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+ca[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+ca[f]+"Width",!0,e))):(g+=r.css(a,"padding"+ca[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+ca[f]+"Width",!0,e)));return g}function $a(a,b,c){var d,e=Na(a),f=Oa(a,b,e),g="border-box"===r.css(a,"boxSizing",!1,e);return Ma.test(f)?f:(d=g&&(o.boxSizingReliable()||f===a.style[b]),"auto"===f&&(f=a["offset"+b[0].toUpperCase()+b.slice(1)]),f=parseFloat(f)||0,f+Za(a,b,c||(g?"border":"content"),d,e)+"px")}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Oa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=Ra.test(b),j=a.style;return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:j[b]:(f=typeof c,"string"===f&&(e=ba.exec(c))&&e[1]&&(c=fa(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(j[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i?j.setProperty(b,c):j[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b),i=Ra.test(b);return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Oa(a,b,d)),"normal"===e&&b in Ta&&(e=Ta[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){if(c)return!Qa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?$a(a,b,d):ea(a,Sa,function(){return $a(a,b,d)})},set:function(a,c,d){var e,f=d&&Na(a),g=d&&Za(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=ba.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Ya(a,c,g)}}}),r.cssHooks.marginLeft=Pa(o.reliableMarginLeft,function(a,b){if(b)return(parseFloat(Oa(a,"marginLeft"))||a.getBoundingClientRect().left-ea(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px"}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];d<4;d++)e[a+ca[d]+b]=f[d]||f[d-2]||f[0];return e}},La.test(a)||(r.cssHooks[a+b].set=Ya)}),r.fn.extend({css:function(a,b){return T(this,function(a,b,c){var d,e,f={},g=0;if(Array.isArray(b)){for(d=Na(a),e=b.length;g<e;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function _a(a,b,c,d,e){return new _a.prototype.init(a,b,c,d,e)}r.Tween=_a,_a.prototype={constructor:_a,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=_a.propHooks[this.prop];return a&&a.get?a.get(this):_a.propHooks._default.get(this)},run:function(a){var b,c=_a.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):_a.propHooks._default.set(this),this}},_a.prototype.init.prototype=_a.prototype,_a.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.unit)}}},_a.propHooks.scrollTop=_a.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=_a.prototype.init,r.fx.step={};var ab,bb,cb=/^(?:toggle|show|hide)$/,db=/queueHooks$/;function eb(){bb&&(d.hidden===!1&&a.requestAnimationFrame?a.requestAnimationFrame(eb):a.setTimeout(eb,r.fx.interval),r.fx.tick())}function fb(){return a.setTimeout(function(){ab=void 0}),ab=r.now()}function gb(a,b){var c,d=0,e={height:a};for(b=b?1:0;d<4;d+=2-b)c=ca[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function hb(a,b,c){for(var d,e=(kb.tweeners[b]||[]).concat(kb.tweeners["*"]),f=0,g=e.length;f<g;f++)if(d=e[f].call(c,b,a))return d}function ib(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&da(a),q=W.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],cb.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=W.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ia([a],!0),j=a.style.display||j,k=r.css(a,"display"),ia([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=W.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ia([a],!0),m.done(function(){p||ia([a]),W.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=hb(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function jb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],Array.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function kb(a,b,c){var d,e,f=0,g=kb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=ab||fb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;g<i;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),f<1&&i?c:(i||h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:ab||fb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;c<d;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(jb(k,j.opts.specialEasing);f<g;f++)if(d=kb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,hb,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j}r.Animation=r.extend(kb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return fa(c.elem,a,ba.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(L);for(var c,d=0,e=a.length;d<e;d++)c=a[d],kb.tweeners[c]=kb.tweeners[c]||[],kb.tweeners[c].unshift(b)},prefilters:[ib],prefilter:function(a,b){b?kb.prefilters.unshift(a):kb.prefilters.push(a)}}),r.speed=function(a,b,c){var d=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off?d.duration=0:"number"!=typeof d.duration&&(d.duration in r.fx.speeds?d.duration=r.fx.speeds[d.duration]:d.duration=r.fx.speeds._default),null!=d.queue&&d.queue!==!0||(d.queue="fx"),d.old=d.complete,d.complete=function(){r.isFunction(d.old)&&d.old.call(this),d.queue&&r.dequeue(this,d.queue)},d},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(da).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=kb(this,r.extend({},a),f);(e||W.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=W.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&db.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=W.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;b<g;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(gb(b,!0),a,d,e)}}),r.each({slideDown:gb("show"),slideUp:gb("hide"),slideToggle:gb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(ab=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),ab=void 0},r.fx.timer=function(a){r.timers.push(a),r.fx.start()},r.fx.interval=13,r.fx.start=function(){bb||(bb=!0,eb())},r.fx.stop=function(){bb=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var lb,mb=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return T(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?lb:void 0)),void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),
null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&B(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(L);if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c)}}),lb={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=mb[b]||r.find.attr;mb[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=mb[g],mb[g]=e,e=null!=c(a,b,d)?g:null,mb[g]=f),e}});var nb=/^(?:input|select|textarea|button)$/i,ob=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return T(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):nb.test(a.nodeName)||ob.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});function pb(a){var b=a.match(L)||[];return b.join(" ")}function qb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,qb(this)))});if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,qb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,qb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(L)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=qb(this),b&&W.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":W.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+pb(qb(c))+" ").indexOf(b)>-1)return!0;return!1}});var rb=/\r/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":Array.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(rb,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:pb(r.text(a))}},select:{get:function(a){var b,c,d,e=a.options,f=a.selectedIndex,g="select-one"===a.type,h=g?null:[],i=g?f+1:e.length;for(d=f<0?i:g?f:0;d<i;d++)if(c=e[d],(c.selected||d===f)&&!c.disabled&&(!c.parentNode.disabled||!B(c.parentNode,"optgroup"))){if(b=r(c).val(),g)return b;h.push(b)}return h},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){if(Array.isArray(b))return a.checked=r.inArray(r(a).val(),b)>-1}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var sb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!sb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,sb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(W.get(h,"events")||{})[b.type]&&W.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&U(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!U(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];if(c)return r.event.trigger(a,b,c,!0)}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=W.access(d,b);e||d.addEventListener(a,c,!0),W.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=W.access(d,b)-1;e?W.access(d,b,e):(d.removeEventListener(a,c,!0),W.remove(d,b))}}});var tb=a.location,ub=r.now(),vb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var wb=/\[\]$/,xb=/\r?\n/g,yb=/^(?:submit|button|image|reset|file)$/i,zb=/^(?:input|select|textarea|keygen)/i;function Ab(a,b,c,d){var e;if(Array.isArray(b))r.each(b,function(b,e){c||wb.test(a)?d(a,e):Ab(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)Ab(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(Array.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)Ab(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&zb.test(this.nodeName)&&!yb.test(a)&&(this.checked||!ja.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:Array.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(xb,"\r\n")}}):{name:b.name,value:c.replace(xb,"\r\n")}}).get()}});var Bb=/%20/g,Cb=/#.*$/,Db=/([?&])_=[^&]*/,Eb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Fb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Gb=/^(?:GET|HEAD)$/,Hb=/^\/\//,Ib={},Jb={},Kb="*/".concat("*"),Lb=d.createElement("a");Lb.href=tb.href;function Mb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(L)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Nb(a,b,c,d){var e={},f=a===Jb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Ob(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Pb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}if(f)return f!==i[0]&&i.unshift(f),c[f]}function Qb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:tb.href,type:"GET",isLocal:Fb.test(tb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Kb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Ob(Ob(a,r.ajaxSettings),b):Ob(r.ajaxSettings,a)},ajaxPrefilter:Mb(Ib),ajaxTransport:Mb(Jb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Eb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||tb.href)+"").replace(Hb,tb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(L)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Lb.protocol+"//"+Lb.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Nb(Ib,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Gb.test(o.type),f=o.url.replace(Cb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(Bb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(vb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Db,"$1"),n=(vb.test(f)?"&":"?")+"_="+ub++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Kb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Nb(Jb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&b<300||304===b,d&&(v=Pb(o,y,d)),v=Qb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",b<0&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Rb={0:200,1223:204},Sb=r.ajaxSettings.xhr();o.cors=!!Sb&&"withCredentials"in Sb,o.ajax=Sb=!!Sb,r.ajaxTransport(function(b){var c,d;if(o.cors||Sb&&!b.crossDomain)return{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Rb[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Tb=[],Ub=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Tb.pop()||r.expando+"_"+ub++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Ub.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ub.test(b.data)&&"data");if(h||"jsonp"===b.dataTypes[0])return e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Ub,"$1"+e):b.jsonp!==!1&&(b.url+=(vb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Tb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=C.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=qa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=pb(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length},r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),b=f.ownerDocument,c=b.documentElement,e=b.defaultView,{top:d.top+e.pageYOffset-c.clientTop,left:d.left+e.pageXOffset-c.clientLeft}):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),B(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||ra})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return T(this,function(a,d,e){var f;return r.isWindow(a)?f=a:9===a.nodeType&&(f=a.defaultView),void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Pa(o.pixelPosition,function(a,c){if(c)return c=Oa(a,b),Ma.test(c)?r(a).position()[b]+"px":c})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return T(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.holdReady=function(a){a?r.readyWait++:r.ready(!0)},r.isArray=Array.isArray,r.parseJSON=JSON.parse,r.nodeName=B,"function"==typeof define&&define.amd&&define("jquery",[],function(){return r});var Vb=a.jQuery,Wb=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Wb),b&&a.jQuery===r&&(a.jQuery=Vb),r},b||(a.jQuery=a.$=r),r});



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/lib/maquette.js ---- */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory(root.maquette = {});
    }
}(this, function (exports) {
    'use strict';
    ;
    ;
    ;
    ;
    var NAMESPACE_W3 = 'http://www.w3.org/';
    var NAMESPACE_SVG = NAMESPACE_W3 + '2000/svg';
    var NAMESPACE_XLINK = NAMESPACE_W3 + '1999/xlink';
    // Utilities
    var emptyArray = [];
    var extend = function (base, overrides) {
        var result = {};
        Object.keys(base).forEach(function (key) {
            result[key] = base[key];
        });
        if (overrides) {
            Object.keys(overrides).forEach(function (key) {
                result[key] = overrides[key];
            });
        }
        return result;
    };
    // Hyperscript helper functions
    var same = function (vnode1, vnode2) {
        if (vnode1.vnodeSelector !== vnode2.vnodeSelector) {
            return false;
        }
        if (vnode1.properties && vnode2.properties) {
            if (vnode1.properties.key !== vnode2.properties.key) {
                return false;
            }
            return vnode1.properties.bind === vnode2.properties.bind;
        }
        return !vnode1.properties && !vnode2.properties;
    };
    var toTextVNode = function (data) {
        return {
            vnodeSelector: '',
            properties: undefined,
            children: undefined,
            text: data.toString(),
            domNode: null
        };
    };
    var appendChildren = function (parentSelector, insertions, main) {
        for (var i = 0; i < insertions.length; i++) {
            var item = insertions[i];
            if (Array.isArray(item)) {
                appendChildren(parentSelector, item, main);
            } else {
                if (item !== null && item !== undefined) {
                    if (!item.hasOwnProperty('vnodeSelector')) {
                        item = toTextVNode(item);
                    }
                    main.push(item);
                }
            }
        }
    };
    // Render helper functions
    var missingTransition = function () {
        throw new Error('Provide a transitions object to the projectionOptions to do animations');
    };
    var DEFAULT_PROJECTION_OPTIONS = {
        namespace: undefined,
        eventHandlerInterceptor: undefined,
        styleApplyer: function (domNode, styleName, value) {
            // Provides a hook to add vendor prefixes for browsers that still need it.
            domNode.style[styleName] = value;
        },
        transitions: {
            enter: missingTransition,
            exit: missingTransition
        }
    };
    var applyDefaultProjectionOptions = function (projectorOptions) {
        return extend(DEFAULT_PROJECTION_OPTIONS, projectorOptions);
    };
    var checkStyleValue = function (styleValue) {
        if (typeof styleValue !== 'string') {
            throw new Error('Style values must be strings');
        }
    };
    var setProperties = function (domNode, properties, projectionOptions) {
        if (!properties) {
            return;
        }
        var eventHandlerInterceptor = projectionOptions.eventHandlerInterceptor;
        var propNames = Object.keys(properties);
        var propCount = propNames.length;
        for (var i = 0; i < propCount; i++) {
            var propName = propNames[i];
            /* tslint:disable:no-var-keyword: edge case */
            var propValue = properties[propName];
            /* tslint:enable:no-var-keyword */
            if (propName === 'className') {
                throw new Error('Property "className" is not supported, use "class".');
            } else if (propName === 'class') {
                if (domNode.className) {
                    // May happen if classes is specified before class
                    domNode.className += ' ' + propValue;
                } else {
                    domNode.className = propValue;
                }
            } else if (propName === 'classes') {
                // object with string keys and boolean values
                var classNames = Object.keys(propValue);
                var classNameCount = classNames.length;
                for (var j = 0; j < classNameCount; j++) {
                    var className = classNames[j];
                    if (propValue[className]) {
                        domNode.classList.add(className);
                    }
                }
            } else if (propName === 'styles') {
                // object with string keys and string (!) values
                var styleNames = Object.keys(propValue);
                var styleCount = styleNames.length;
                for (var j = 0; j < styleCount; j++) {
                    var styleName = styleNames[j];
                    var styleValue = propValue[styleName];
                    if (styleValue) {
                        checkStyleValue(styleValue);
                        projectionOptions.styleApplyer(domNode, styleName, styleValue);
                    }
                }
            } else if (propName === 'key') {
                continue;
            } else if (propValue === null || propValue === undefined) {
                continue;
            } else {
                var type = typeof propValue;
                if (type === 'function') {
                    if (propName.lastIndexOf('on', 0) === 0) {
                        if (eventHandlerInterceptor) {
                            propValue = eventHandlerInterceptor(propName, propValue, domNode, properties);    // intercept eventhandlers
                        }
                        if (propName === 'oninput') {
                            (function () {
                                // record the evt.target.value, because IE and Edge sometimes do a requestAnimationFrame between changing value and running oninput
                                var oldPropValue = propValue;
                                propValue = function (evt) {
                                    evt.target['oninput-value'] = evt.target.value;
                                    // may be HTMLTextAreaElement as well
                                    oldPropValue.apply(this, [evt]);
                                };
                            }());
                        }
                        domNode[propName] = propValue;
                    }
                } else if (type === 'string' && propName !== 'value' && propName !== 'innerHTML') {
                    if (projectionOptions.namespace === NAMESPACE_SVG && propName === 'href') {
                        domNode.setAttributeNS(NAMESPACE_XLINK, propName, propValue);
                    } else {
                        domNode.setAttribute(propName, propValue);
                    }
                } else {
                    domNode[propName] = propValue;
                }
            }
        }
    };
    var updateProperties = function (domNode, previousProperties, properties, projectionOptions) {
        if (!properties) {
            return;
        }
        var propertiesUpdated = false;
        var propNames = Object.keys(properties);
        var propCount = propNames.length;
        for (var i = 0; i < propCount; i++) {
            var propName = propNames[i];
            // assuming that properties will be nullified instead of missing is by design
            var propValue = properties[propName];
            var previousValue = previousProperties[propName];
            if (propName === 'class') {
                if (previousValue !== propValue) {
                    throw new Error('"class" property may not be updated. Use the "classes" property for conditional css classes.');
                }
            } else if (propName === 'classes') {
                var classList = domNode.classList;
                var classNames = Object.keys(propValue);
                var classNameCount = classNames.length;
                for (var j = 0; j < classNameCount; j++) {
                    var className = classNames[j];
                    var on = !!propValue[className];
                    var previousOn = !!previousValue[className];
                    if (on === previousOn) {
                        continue;
                    }
                    propertiesUpdated = true;
                    if (on) {
                        classList.add(className);
                    } else {
                        classList.remove(className);
                    }
                }
            } else if (propName === 'styles') {
                var styleNames = Object.keys(propValue);
                var styleCount = styleNames.length;
                for (var j = 0; j < styleCount; j++) {
                    var styleName = styleNames[j];
                    var newStyleValue = propValue[styleName];
                    var oldStyleValue = previousValue[styleName];
                    if (newStyleValue === oldStyleValue) {
                        continue;
                    }
                    propertiesUpdated = true;
                    if (newStyleValue) {
                        checkStyleValue(newStyleValue);
                        projectionOptions.styleApplyer(domNode, styleName, newStyleValue);
                    } else {
                        projectionOptions.styleApplyer(domNode, styleName, '');
                    }
                }
            } else {
                if (!propValue && typeof previousValue === 'string') {
                    propValue = '';
                }
                if (propName === 'value') {
                    if (domNode[propName] !== propValue && domNode['oninput-value'] !== propValue) {
                        domNode[propName] = propValue;
                        // Reset the value, even if the virtual DOM did not change
                        domNode['oninput-value'] = undefined;
                    }
                    // else do not update the domNode, otherwise the cursor position would be changed
                    if (propValue !== previousValue) {
                        propertiesUpdated = true;
                    }
                } else if (propValue !== previousValue) {
                    var type = typeof propValue;
                    if (type === 'function') {
                        throw new Error('Functions may not be updated on subsequent renders (property: ' + propName + '). Hint: declare event handler functions outside the render() function.');
                    }
                    if (type === 'string' && propName !== 'innerHTML') {
                        if (projectionOptions.namespace === NAMESPACE_SVG && propName === 'href') {
                            domNode.setAttributeNS(NAMESPACE_XLINK, propName, propValue);
                        } else {
                            domNode.setAttribute(propName, propValue);
                        }
                    } else {
                        if (domNode[propName] !== propValue) {
                            domNode[propName] = propValue;
                        }
                    }
                    propertiesUpdated = true;
                }
            }
        }
        return propertiesUpdated;
    };
    var findIndexOfChild = function (children, sameAs, start) {
        if (sameAs.vnodeSelector !== '') {
            // Never scan for text-nodes
            for (var i = start; i < children.length; i++) {
                if (same(children[i], sameAs)) {
                    return i;
                }
            }
        }
        return -1;
    };
    var nodeAdded = function (vNode, transitions) {
        if (vNode.properties) {
            var enterAnimation = vNode.properties.enterAnimation;
            if (enterAnimation) {
                if (typeof enterAnimation === 'function') {
                    enterAnimation(vNode.domNode, vNode.properties);
                } else {
                    transitions.enter(vNode.domNode, vNode.properties, enterAnimation);
                }
            }
        }
    };
    var nodeToRemove = function (vNode, transitions) {
        var domNode = vNode.domNode;
        if (vNode.properties) {
            var exitAnimation = vNode.properties.exitAnimation;
            if (exitAnimation) {
                domNode.style.pointerEvents = 'none';
                var removeDomNode = function () {
                    if (domNode.parentNode) {
                        domNode.parentNode.removeChild(domNode);
                    }
                };
                if (typeof exitAnimation === 'function') {
                    exitAnimation(domNode, removeDomNode, vNode.properties);
                    return;
                } else {
                    transitions.exit(vNode.domNode, vNode.properties, exitAnimation, removeDomNode);
                    return;
                }
            }
        }
        if (domNode.parentNode) {
            domNode.parentNode.removeChild(domNode);
        }
    };
    var checkDistinguishable = function (childNodes, indexToCheck, parentVNode, operation) {
        var childNode = childNodes[indexToCheck];
        if (childNode.vnodeSelector === '') {
            return;    // Text nodes need not be distinguishable
        }
        var properties = childNode.properties;
        var key = properties ? properties.key === undefined ? properties.bind : properties.key : undefined;
        if (!key) {
            for (var i = 0; i < childNodes.length; i++) {
                if (i !== indexToCheck) {
                    var node = childNodes[i];
                    if (same(node, childNode)) {
                        if (operation === 'added') {
                            throw new Error(parentVNode.vnodeSelector + ' had a ' + childNode.vnodeSelector + ' child ' + 'added, but there is now more than one. You must add unique key properties to make them distinguishable.');
                        } else {
                            throw new Error(parentVNode.vnodeSelector + ' had a ' + childNode.vnodeSelector + ' child ' + 'removed, but there were more than one. You must add unique key properties to make them distinguishable.');
                        }
                    }
                }
            }
        }
    };
    var createDom;
    var updateDom;
    var updateChildren = function (vnode, domNode, oldChildren, newChildren, projectionOptions) {
        if (oldChildren === newChildren) {
            return false;
        }
        oldChildren = oldChildren || emptyArray;
        newChildren = newChildren || emptyArray;
        var oldChildrenLength = oldChildren.length;
        var newChildrenLength = newChildren.length;
        var transitions = projectionOptions.transitions;
        var oldIndex = 0;
        var newIndex = 0;
        var i;
        var textUpdated = false;
        while (newIndex < newChildrenLength) {
            var oldChild = oldIndex < oldChildrenLength ? oldChildren[oldIndex] : undefined;
            var newChild = newChildren[newIndex];
            if (oldChild !== undefined && same(oldChild, newChild)) {
                textUpdated = updateDom(oldChild, newChild, projectionOptions) || textUpdated;
                oldIndex++;
            } else {
                var findOldIndex = findIndexOfChild(oldChildren, newChild, oldIndex + 1);
                if (findOldIndex >= 0) {
                    // Remove preceding missing children
                    for (i = oldIndex; i < findOldIndex; i++) {
                        nodeToRemove(oldChildren[i], transitions);
                        checkDistinguishable(oldChildren, i, vnode, 'removed');
                    }
                    textUpdated = updateDom(oldChildren[findOldIndex], newChild, projectionOptions) || textUpdated;
                    oldIndex = findOldIndex + 1;
                } else {
                    // New child
                    createDom(newChild, domNode, oldIndex < oldChildrenLength ? oldChildren[oldIndex].domNode : undefined, projectionOptions);
                    nodeAdded(newChild, transitions);
                    checkDistinguishable(newChildren, newIndex, vnode, 'added');
                }
            }
            newIndex++;
        }
        if (oldChildrenLength > oldIndex) {
            // Remove child fragments
            for (i = oldIndex; i < oldChildrenLength; i++) {
                nodeToRemove(oldChildren[i], transitions);
                checkDistinguishable(oldChildren, i, vnode, 'removed');
            }
        }
        return textUpdated;
    };
    var addChildren = function (domNode, children, projectionOptions) {
        if (!children) {
            return;
        }
        for (var i = 0; i < children.length; i++) {
            createDom(children[i], domNode, undefined, projectionOptions);
        }
    };
    var initPropertiesAndChildren = function (domNode, vnode, projectionOptions) {
        addChildren(domNode, vnode.children, projectionOptions);
        // children before properties, needed for value property of <select>.
        if (vnode.text) {
            domNode.textContent = vnode.text;
        }
        setProperties(domNode, vnode.properties, projectionOptions);
        if (vnode.properties && vnode.properties.afterCreate) {
            vnode.properties.afterCreate(domNode, projectionOptions, vnode.vnodeSelector, vnode.properties, vnode.children);
        }
    };
    createDom = function (vnode, parentNode, insertBefore, projectionOptions) {
        var domNode, i, c, start = 0, type, found;
        var vnodeSelector = vnode.vnodeSelector;
        if (vnodeSelector === '') {
            domNode = vnode.domNode = document.createTextNode(vnode.text);
            if (insertBefore !== undefined) {
                parentNode.insertBefore(domNode, insertBefore);
            } else {
                parentNode.appendChild(domNode);
            }
        } else {
            for (i = 0; i <= vnodeSelector.length; ++i) {
                c = vnodeSelector.charAt(i);
                if (i === vnodeSelector.length || c === '.' || c === '#') {
                    type = vnodeSelector.charAt(start - 1);
                    found = vnodeSelector.slice(start, i);
                    if (type === '.') {
                        domNode.classList.add(found);
                    } else if (type === '#') {
                        domNode.id = found;
                    } else {
                        if (found === 'svg') {
                            projectionOptions = extend(projectionOptions, { namespace: NAMESPACE_SVG });
                        }
                        if (projectionOptions.namespace !== undefined) {
                            domNode = vnode.domNode = document.createElementNS(projectionOptions.namespace, found);
                        } else {
                            domNode = vnode.domNode = document.createElement(found);
                        }
                        if (insertBefore !== undefined) {
                            parentNode.insertBefore(domNode, insertBefore);
                        } else {
                            parentNode.appendChild(domNode);
                        }
                    }
                    start = i + 1;
                }
            }
            initPropertiesAndChildren(domNode, vnode, projectionOptions);
        }
    };
    updateDom = function (previous, vnode, projectionOptions) {
        var domNode = previous.domNode;
        var textUpdated = false;
        if (previous === vnode) {
            return false;    // By contract, VNode objects may not be modified anymore after passing them to maquette
        }
        var updated = false;
        if (vnode.vnodeSelector === '') {
            if (vnode.text !== previous.text) {
                var newVNode = document.createTextNode(vnode.text);
                domNode.parentNode.replaceChild(newVNode, domNode);
                vnode.domNode = newVNode;
                textUpdated = true;
                return textUpdated;
            }
        } else {
            if (vnode.vnodeSelector.lastIndexOf('svg', 0) === 0) {
                projectionOptions = extend(projectionOptions, { namespace: NAMESPACE_SVG });
            }
            if (previous.text !== vnode.text) {
                updated = true;
                if (vnode.text === undefined) {
                    domNode.removeChild(domNode.firstChild);    // the only textnode presumably
                } else {
                    domNode.textContent = vnode.text;
                }
            }
            updated = updateChildren(vnode, domNode, previous.children, vnode.children, projectionOptions) || updated;
            updated = updateProperties(domNode, previous.properties, vnode.properties, projectionOptions) || updated;
            if (vnode.properties && vnode.properties.afterUpdate) {
                vnode.properties.afterUpdate(domNode, projectionOptions, vnode.vnodeSelector, vnode.properties, vnode.children);
            }
        }
        if (updated && vnode.properties && vnode.properties.updateAnimation) {
            vnode.properties.updateAnimation(domNode, vnode.properties, previous.properties);
        }
        vnode.domNode = previous.domNode;
        return textUpdated;
    };
    var createProjection = function (vnode, projectionOptions) {
        return {
            update: function (updatedVnode) {
                if (vnode.vnodeSelector !== updatedVnode.vnodeSelector) {
                    throw new Error('The selector for the root VNode may not be changed. (consider using dom.merge and add one extra level to the virtual DOM)');
                }
                updateDom(vnode, updatedVnode, projectionOptions);
                vnode = updatedVnode;
            },
            domNode: vnode.domNode
        };
    };
    ;
    // The other two parameters are not added here, because the Typescript compiler creates surrogate code for desctructuring 'children'.
    exports.h = function (selector) {
        var properties = arguments[1];
        if (typeof selector !== 'string') {
            throw new Error();
        }
        var childIndex = 1;
        if (properties && !properties.hasOwnProperty('vnodeSelector') && !Array.isArray(properties) && typeof properties === 'object') {
            childIndex = 2;
        } else {
            // Optional properties argument was omitted
            properties = undefined;
        }
        var text = undefined;
        var children = undefined;
        var argsLength = arguments.length;
        // Recognize a common special case where there is only a single text node
        if (argsLength === childIndex + 1) {
            var onlyChild = arguments[childIndex];
            if (typeof onlyChild === 'string') {
                text = onlyChild;
            } else if (onlyChild !== undefined && onlyChild !== null && onlyChild.length === 1 && typeof onlyChild[0] === 'string') {
                text = onlyChild[0];
            }
        }
        if (text === undefined) {
            children = [];
            for (; childIndex < arguments.length; childIndex++) {
                var child = arguments[childIndex];
                if (child === null || child === undefined) {
                    continue;
                } else if (Array.isArray(child)) {
                    appendChildren(selector, child, children);
                } else if (child.hasOwnProperty('vnodeSelector')) {
                    children.push(child);
                } else {
                    children.push(toTextVNode(child));
                }
            }
        }
        return {
            vnodeSelector: selector,
            properties: properties,
            children: children,
            text: text === '' ? undefined : text,
            domNode: null
        };
    };
    /**
 * Contains simple low-level utility functions to manipulate the real DOM.
 */
    exports.dom = {
        /**
     * Creates a real DOM tree from `vnode`. The [[Projection]] object returned will contain the resulting DOM Node in
     * its [[Projection.domNode|domNode]] property.
     * This is a low-level method. Users wil typically use a [[Projector]] instead.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]]
     * objects may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the projection.
     * @returns The [[Projection]] which also contains the DOM Node that was created.
     */
        create: function (vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            createDom(vnode, document.createElement('div'), undefined, projectionOptions);
            return createProjection(vnode, projectionOptions);
        },
        /**
     * Appends a new childnode to the DOM which is generated from a [[VNode]].
     * This is a low-level method. Users wil typically use a [[Projector]] instead.
     * @param parentNode - The parent node for the new childNode.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]]
     * objects may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the [[Projection]].
     * @returns The [[Projection]] that was created.
     */
        append: function (parentNode, vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            createDom(vnode, parentNode, undefined, projectionOptions);
            return createProjection(vnode, projectionOptions);
        },
        /**
     * Inserts a new DOM node which is generated from a [[VNode]].
     * This is a low-level method. Users wil typically use a [[Projector]] instead.
     * @param beforeNode - The node that the DOM Node is inserted before.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function.
     * NOTE: [[VNode]] objects may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the projection, see [[createProjector]].
     * @returns The [[Projection]] that was created.
     */
        insertBefore: function (beforeNode, vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            createDom(vnode, beforeNode.parentNode, beforeNode, projectionOptions);
            return createProjection(vnode, projectionOptions);
        },
        /**
     * Merges a new DOM node which is generated from a [[VNode]] with an existing DOM Node.
     * This means that the virtual DOM and the real DOM will have one overlapping element.
     * Therefore the selector for the root [[VNode]] will be ignored, but its properties and children will be applied to the Element provided.
     * This is a low-level method. Users wil typically use a [[Projector]] instead.
     * @param domNode - The existing element to adopt as the root of the new virtual DOM. Existing attributes and childnodes are preserved.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]] objects
     * may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the projection, see [[createProjector]].
     * @returns The [[Projection]] that was created.
     */
        merge: function (element, vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            vnode.domNode = element;
            initPropertiesAndChildren(element, vnode, projectionOptions);
            return createProjection(vnode, projectionOptions);
        }
    };
    /**
 * Creates a [[CalculationCache]] object, useful for caching [[VNode]] trees.
 * In practice, caching of [[VNode]] trees is not needed, because achieving 60 frames per second is almost never a problem.
 * For more information, see [[CalculationCache]].
 *
 * @param <Result> The type of the value that is cached.
 */
    exports.createCache = function () {
        var cachedInputs = undefined;
        var cachedOutcome = undefined;
        var result = {
            invalidate: function () {
                cachedOutcome = undefined;
                cachedInputs = undefined;
            },
            result: function (inputs, calculation) {
                if (cachedInputs) {
                    for (var i = 0; i < inputs.length; i++) {
                        if (cachedInputs[i] !== inputs[i]) {
                            cachedOutcome = undefined;
                        }
                    }
                }
                if (!cachedOutcome) {
                    cachedOutcome = calculation();
                    cachedInputs = inputs;
                }
                return cachedOutcome;
            }
        };
        return result;
    };
    /**
 * Creates a {@link Mapping} instance that keeps an array of result objects synchronized with an array of source objects.
 * See {@link http://maquettejs.org/docs/arrays.html|Working with arrays}.
 *
 * @param <Source>       The type of source items. A database-record for instance.
 * @param <Target>       The type of target items. A [[Component]] for instance.
 * @param getSourceKey   `function(source)` that must return a key to identify each source object. The result must either be a string or a number.
 * @param createResult   `function(source, index)` that must create a new result object from a given source. This function is identical
 *                       to the `callback` argument in `Array.map(callback)`.
 * @param updateResult   `function(source, target, index)` that updates a result to an updated source.
 */
    exports.createMapping = function (getSourceKey, createResult, updateResult) {
        var keys = [];
        var results = [];
        return {
            results: results,
            map: function (newSources) {
                var newKeys = newSources.map(getSourceKey);
                var oldTargets = results.slice();
                var oldIndex = 0;
                for (var i = 0; i < newSources.length; i++) {
                    var source = newSources[i];
                    var sourceKey = newKeys[i];
                    if (sourceKey === keys[oldIndex]) {
                        results[i] = oldTargets[oldIndex];
                        updateResult(source, oldTargets[oldIndex], i);
                        oldIndex++;
                    } else {
                        var found = false;
                        for (var j = 1; j < keys.length; j++) {
                            var searchIndex = (oldIndex + j) % keys.length;
                            if (keys[searchIndex] === sourceKey) {
                                results[i] = oldTargets[searchIndex];
                                updateResult(newSources[i], oldTargets[searchIndex], i);
                                oldIndex = searchIndex + 1;
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            results[i] = createResult(source, i);
                        }
                    }
                }
                results.length = newSources.length;
                keys = newKeys;
            }
        };
    };
    /**
 * Creates a [[Projector]] instance using the provided projectionOptions.
 *
 * For more information, see [[Projector]].
 *
 * @param projectionOptions   Options that influence how the DOM is rendered and updated.
 */
    exports.createProjector = function (projectorOptions) {
        var projector;
        var projectionOptions = applyDefaultProjectionOptions(projectorOptions);
        projectionOptions.eventHandlerInterceptor = function (propertyName, eventHandler, domNode, properties) {
            return function () {
                // intercept function calls (event handlers) to do a render afterwards.
                projector.scheduleRender();
                return eventHandler.apply(properties.bind || this, arguments);
            };
        };
        var renderCompleted = true;
        var scheduled;
        var stopped = false;
        var projections = [];
        var renderFunctions = [];
        // matches the projections array
        var doRender = function () {
            scheduled = undefined;
            if (!renderCompleted) {
                return;    // The last render threw an error, it should be logged in the browser console.
            }
            var s = Date.now()
            renderCompleted = false;
            for (var i = 0; i < projections.length; i++) {
                var updatedVnode = renderFunctions[i]();
                projections[i].update(updatedVnode);
            }
            if (Date.now()-s > 15)
                console.log("Render time:", Date.now()-s, "ms")
            renderCompleted = true;
        };
        projector = {
            scheduleRender: function () {
                if (!scheduled && !stopped) {
                    scheduled = requestAnimationFrame(doRender);
                }
            },
            stop: function () {
                if (scheduled) {
                    cancelAnimationFrame(scheduled);
                    scheduled = undefined;
                }
                stopped = true;
            },
            resume: function () {
                stopped = false;
                renderCompleted = true;
                projector.scheduleRender();
            },
            append: function (parentNode, renderMaquetteFunction) {
                projections.push(exports.dom.append(parentNode, renderMaquetteFunction(), projectionOptions));
                renderFunctions.push(renderMaquetteFunction);
            },
            insertBefore: function (beforeNode, renderMaquetteFunction) {
                projections.push(exports.dom.insertBefore(beforeNode, renderMaquetteFunction(), projectionOptions));
                renderFunctions.push(renderMaquetteFunction);
            },
            merge: function (domNode, renderMaquetteFunction) {
                projections.push(exports.dom.merge(domNode, renderMaquetteFunction(), projectionOptions));
                renderFunctions.push(renderMaquetteFunction);
            },
            replace: function (domNode, renderMaquetteFunction) {
                var vnode = renderMaquetteFunction();
                createDom(vnode, domNode.parentNode, domNode, projectionOptions);
                domNode.parentNode.removeChild(domNode);
                projections.push(createProjection(vnode, projectionOptions));
                renderFunctions.push(renderMaquetteFunction);
            },
            detach: function (renderMaquetteFunction) {
                for (var i = 0; i < renderFunctions.length; i++) {
                    if (renderFunctions[i] === renderMaquetteFunction) {
                        renderFunctions.splice(i, 1);
                        return projections.splice(i, 1)[0];
                    }
                }
                throw new Error('renderMaquetteFunction was not found');
            }
        };
        return projector;
    };
}));



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/lib/marked.min.js ---- */


/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */
(function(){var block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:noop,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:noop,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:noop,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};block.bullet=/(?:[*+-]|\d+\.)/;block.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item=replace(block.item,"gm")(/bull/g,block.bullet)();block.list=replace(block.list)(/bull/g,block.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+block.def.source+")")();block.blockquote=replace(block.blockquote)("def",block.def)();block._tag="(?!(?:"+"a|em|strong|small|s|cite|q|dfn|abbr|data|time|code"+"|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo"+"|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";block.html=replace(block.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,block._tag)();block.paragraph=replace(block.paragraph)("hr",block.hr)("heading",block.heading)("lheading",block.lheading)("blockquote",block.blockquote)("tag","<"+block._tag)("def",block.def)();block.normal=merge({},block);block.gfm=merge({},block.normal,{fences:/^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,paragraph:/^/});block.gfm.paragraph=replace(block.paragraph)("(?!","(?!"+block.gfm.fences.source.replace("\\1","\\2")+"|"+block.list.source.replace("\\1","\\3")+"|")();block.tables=merge({},block.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/});function Lexer(options){this.tokens=[];this.tokens.links={};this.options=options||marked.defaults;this.rules=block.normal;if(this.options.gfm){if(this.options.tables){this.rules=block.tables}else{this.rules=block.gfm}}}Lexer.rules=block;Lexer.lex=function(src,options){var lexer=new Lexer(options);return lexer.lex(src)};Lexer.prototype.lex=function(src){src=src.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n");return this.token(src,true)};Lexer.prototype.token=function(src,top,bq){var src=src.replace(/^ +$/gm,""),next,loose,cap,bull,b,item,space,i,l;while(src){if(cap=this.rules.newline.exec(src)){src=src.substring(cap[0].length);if(cap[0].length>1){this.tokens.push({type:"space"})}}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);cap=cap[0].replace(/^ {4}/gm,"");this.tokens.push({type:"code",text:!this.options.pedantic?cap.replace(/\n+$/,""):cap});continue}if(cap=this.rules.fences.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"code",lang:cap[2],text:cap[3]});continue}if(cap=this.rules.heading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[1].length,text:cap[2]});continue}if(top&&(cap=this.rules.nptable.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].split(/ *\| */)}this.tokens.push(item);continue}if(cap=this.rules.lheading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[2]==="="?1:2,text:cap[1]});continue}if(cap=this.rules.hr.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"hr"});continue}if(cap=this.rules.blockquote.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"blockquote_start"});cap=cap[0].replace(/^ *> ?/gm,"");this.token(cap,top,true);this.tokens.push({type:"blockquote_end"});continue}if(cap=this.rules.list.exec(src)){src=src.substring(cap[0].length);bull=cap[2];this.tokens.push({type:"list_start",ordered:bull.length>1});cap=cap[0].match(this.rules.item);next=false;l=cap.length;i=0;for(;i<l;i++){item=cap[i];space=item.length;item=item.replace(/^ *([*+-]|\d+\.) +/,"");if(~item.indexOf("\n ")){space-=item.length;item=!this.options.pedantic?item.replace(new RegExp("^ {1,"+space+"}","gm"),""):item.replace(/^ {1,4}/gm,"")}if(this.options.smartLists&&i!==l-1){b=block.bullet.exec(cap[i+1])[0];if(bull!==b&&!(bull.length>1&&b.length>1)){src=cap.slice(i+1).join("\n")+src;i=l-1}}loose=next||/\n\n(?!\s*$)/.test(item);if(i!==l-1){next=item.charAt(item.length-1)==="\n";if(!loose)loose=next}this.tokens.push({type:loose?"loose_item_start":"list_item_start"});this.token(item,false,bq);this.tokens.push({type:"list_item_end"})}this.tokens.push({type:"list_end"});continue}if(cap=this.rules.html.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:cap[1]==="pre"||cap[1]==="script"||cap[1]==="style",text:cap[0]});continue}if(!bq&&top&&(cap=this.rules.def.exec(src))){src=src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()]={href:cap[2],title:cap[3]};continue}if(top&&(cap=this.rules.table.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */)}this.tokens.push(item);continue}if(top&&(cap=this.rules.paragraph.exec(src))){src=src.substring(cap[0].length);this.tokens.push({type:"paragraph",text:cap[1].charAt(cap[1].length-1)==="\n"?cap[1].slice(0,-1):cap[1]});continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"text",text:cap[0]});continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return this.tokens};var inline={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:noop,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:noop,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};inline._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link=replace(inline.link)("inside",inline._inside)("href",inline._href)();inline.reflink=replace(inline.reflink)("inside",inline._inside)();inline.normal=merge({},inline);inline.pedantic=merge({},inline.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/});inline.gfm=merge({},inline.normal,{escape:replace(inline.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:replace(inline.text)("]|","~]|")("|","|https?://|")()});inline.breaks=merge({},inline.gfm,{br:replace(inline.br)("{2,}","*")(),text:replace(inline.gfm.text)("{2,}","*")()});function InlineLexer(links,options){this.options=options||marked.defaults;this.links=links;this.rules=inline.normal;this.renderer=this.options.renderer||new Renderer;this.renderer.options=this.options;if(!this.links){throw new Error("Tokens array requires a `links` property.")}if(this.options.gfm){if(this.options.breaks){this.rules=inline.breaks}else{this.rules=inline.gfm}}else if(this.options.pedantic){this.rules=inline.pedantic}}InlineLexer.rules=inline;InlineLexer.output=function(src,links,options){var inline=new InlineLexer(links,options);return inline.output(src)};InlineLexer.prototype.output=function(src){var out="",link,text,href,cap;while(src){if(cap=this.rules.escape.exec(src)){src=src.substring(cap[0].length);out+=cap[1];continue}if(cap=this.rules.autolink.exec(src)){src=src.substring(cap[0].length);if(cap[2]==="@"){text=cap[1].charAt(6)===":"?this.mangle(cap[1].substring(7)):this.mangle(cap[1]);href=this.mangle("mailto:")+text}else{text=escape(cap[1]);href=text}out+=this.renderer.link(href,null,text);continue}if(!this.inLink&&(cap=this.rules.url.exec(src))){src=src.substring(cap[0].length);text=escape(cap[1]);href=text;out+=this.renderer.link(href,null,text);continue}if(cap=this.rules.tag.exec(src)){if(!this.inLink&&/^<a /i.test(cap[0])){this.inLink=true}else if(this.inLink&&/^<\/a>/i.test(cap[0])){this.inLink=false}src=src.substring(cap[0].length);out+=this.options.sanitize?escape(cap[0]):cap[0];continue}if(cap=this.rules.link.exec(src)){src=src.substring(cap[0].length);this.inLink=true;out+=this.outputLink(cap,{href:cap[2],title:cap[3]});this.inLink=false;continue}if((cap=this.rules.reflink.exec(src))||(cap=this.rules.nolink.exec(src))){src=src.substring(cap[0].length);link=(cap[2]||cap[1]).replace(/\s+/g," ");link=this.links[link.toLowerCase()];if(!link||!link.href){out+=cap[0].charAt(0);src=cap[0].substring(1)+src;continue}this.inLink=true;out+=this.outputLink(cap,link);this.inLink=false;continue}if(cap=this.rules.strong.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.strong(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.em.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.em(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.codespan(escape(cap[2],true));continue}if(cap=this.rules.br.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.br();continue}if(cap=this.rules.del.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.del(this.output(cap[1]));continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);out+=escape(this.smartypants(cap[0]));continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return out};InlineLexer.prototype.outputLink=function(cap,link){var href=escape(link.href),title=link.title?escape(link.title):null;return cap[0].charAt(0)!=="!"?this.renderer.link(href,title,this.output(cap[1])):this.renderer.image(href,title,escape(cap[1]))};InlineLexer.prototype.smartypants=function(text){if(!this.options.smartypants)return text;return text.replace(/--/g,"—").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")};InlineLexer.prototype.mangle=function(text){var out="",l=text.length,i=0,ch;for(;i<l;i++){ch=text.charCodeAt(i);if(Math.random()>.5){ch="x"+ch.toString(16)}out+="&#"+ch+";"}return out};function Renderer(options){this.options=options||{}}Renderer.prototype.code=function(code,lang,escaped){if(this.options.highlight){var out=this.options.highlight(code,lang);if(out!=null&&out!==code){escaped=true;code=out}}if(!lang){return"<pre><code>"+(escaped?code:escape(code,true))+"\n</code></pre>"}return'<pre><code class="'+this.options.langPrefix+escape(lang,true)+'">'+(escaped?code:escape(code,true))+"\n</code></pre>\n"};Renderer.prototype.blockquote=function(quote){return"<blockquote>\n"+quote+"</blockquote>\n"};Renderer.prototype.html=function(html){return html};Renderer.prototype.heading=function(text,level,raw){return"<h"+level+' id="'+this.options.headerPrefix+raw.toLowerCase().replace(/[^\w]+/g,"-")+'">'+text+"</h"+level+">\n"};Renderer.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"};Renderer.prototype.list=function(body,ordered){var type=ordered?"ol":"ul";return"<"+type+">\n"+body+"</"+type+">\n"};Renderer.prototype.listitem=function(text){return"<li>"+text+"</li>\n"};Renderer.prototype.paragraph=function(text){return"<p>"+text+"</p>\n"};Renderer.prototype.table=function(header,body){return"<table>\n"+"<thead>\n"+header+"</thead>\n"+"<tbody>\n"+body+"</tbody>\n"+"</table>\n"};Renderer.prototype.tablerow=function(content){return"<tr>\n"+content+"</tr>\n"};Renderer.prototype.tablecell=function(content,flags){var type=flags.header?"th":"td";var tag=flags.align?"<"+type+' style="text-align:'+flags.align+'">':"<"+type+">";return tag+content+"</"+type+">\n"};Renderer.prototype.strong=function(text){return"<strong>"+text+"</strong>"};Renderer.prototype.em=function(text){return"<em>"+text+"</em>"};Renderer.prototype.codespan=function(text){return"<code>"+text+"</code>"};Renderer.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"};Renderer.prototype.del=function(text){return"<del>"+text+"</del>"};Renderer.prototype.link=function(href,title,text){if(this.options.sanitize){try{var prot=decodeURIComponent(unescape(href)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(prot.indexOf("javascript:")===0){return""}}var out='<a href="'+href+'"';if(title){out+=' title="'+title+'"'}out+=">"+text+"</a>";return out};Renderer.prototype.image=function(href,title,text){var out='<img src="'+href+'" alt="'+text+'"';if(title){out+=' title="'+title+'"'}out+=this.options.xhtml?"/>":">";return out};function Parser(options){this.tokens=[];this.token=null;this.options=options||marked.defaults;this.options.renderer=this.options.renderer||new Renderer;this.renderer=this.options.renderer;this.renderer.options=this.options}Parser.parse=function(src,options,renderer){var parser=new Parser(options,renderer);return parser.parse(src)};Parser.prototype.parse=function(src){this.inline=new InlineLexer(src.links,this.options,this.renderer);this.tokens=src.reverse();var out="";while(this.next()){out+=this.tok()}return out};Parser.prototype.next=function(){return this.token=this.tokens.pop()};Parser.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0};Parser.prototype.parseText=function(){var body=this.token.text;while(this.peek().type==="text"){body+="\n"+this.next().text}return this.inline.output(body)};Parser.prototype.tok=function(){switch(this.token.type){case"space":{return""}case"hr":{return this.renderer.hr()}case"heading":{return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text)}case"code":{return this.renderer.code(this.token.text,this.token.lang,this.token.escaped)}case"table":{var header="",body="",i,row,cell,flags,j;cell="";for(i=0;i<this.token.header.length;i++){flags={header:true,align:this.token.align[i]};cell+=this.renderer.tablecell(this.inline.output(this.token.header[i]),{header:true,align:this.token.align[i]})}header+=this.renderer.tablerow(cell);for(i=0;i<this.token.cells.length;i++){row=this.token.cells[i];cell="";for(j=0;j<row.length;j++){cell+=this.renderer.tablecell(this.inline.output(row[j]),{header:false,align:this.token.align[j]})}body+=this.renderer.tablerow(cell)}return this.renderer.table(header,body)}case"blockquote_start":{var body="";while(this.next().type!=="blockquote_end"){body+=this.tok()}return this.renderer.blockquote(body)}case"list_start":{var body="",ordered=this.token.ordered;while(this.next().type!=="list_end"){body+=this.tok()}return this.renderer.list(body,ordered)}case"list_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.token.type==="text"?this.parseText():this.tok()}return this.renderer.listitem(body)}case"loose_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.tok()}return this.renderer.listitem(body)}case"html":{var html=!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text;return this.renderer.html(html)}case"paragraph":{return this.renderer.paragraph(this.inline.output(this.token.text))}case"text":{return this.renderer.paragraph(this.parseText())}}};function escape(html,encode){return html.replace(!encode?/&(?!#?\w+;)/g:/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function unescape(html){return html.replace(/&([#\w]+);/g,function(_,n){n=n.toLowerCase();if(n==="colon")return":";if(n.charAt(0)==="#"){return n.charAt(1)==="x"?String.fromCharCode(parseInt(n.substring(2),16)):String.fromCharCode(+n.substring(1))}return""})}function replace(regex,opt){regex=regex.source;opt=opt||"";return function self(name,val){if(!name)return new RegExp(regex,opt);val=val.source||val;val=val.replace(/(^|[^\[])\^/g,"$1");regex=regex.replace(name,val);return self}}function noop(){}noop.exec=noop;function merge(obj){var i=1,target,key;for(;i<arguments.length;i++){target=arguments[i];for(key in target){if(Object.prototype.hasOwnProperty.call(target,key)){obj[key]=target[key]}}}return obj}function marked(src,opt,callback){if(callback||typeof opt==="function"){if(!callback){callback=opt;opt=null}opt=merge({},marked.defaults,opt||{});var highlight=opt.highlight,tokens,pending,i=0;try{tokens=Lexer.lex(src,opt)}catch(e){return callback(e)}pending=tokens.length;var done=function(err){if(err){opt.highlight=highlight;return callback(err)}var out;try{out=Parser.parse(tokens,opt)}catch(e){err=e}opt.highlight=highlight;return err?callback(err):callback(null,out)};if(!highlight||highlight.length<3){return done()}delete opt.highlight;if(!pending)return done();for(;i<tokens.length;i++){(function(token){if(token.type!=="code"){return--pending||done()}return highlight(token.text,token.lang,function(err,code){if(err)return done(err);if(code==null||code===token.text){return--pending||done()}token.text=code;token.escaped=true;--pending||done()})})(tokens[i])}return}try{if(opt)opt=merge({},marked.defaults,opt);return Parser.parse(Lexer.lex(src,opt),opt)}catch(e){e.message+="\nPlease report this to https://github.com/chjj/marked.";if((opt||marked.defaults).silent){return"<p>An error occured:</p><pre>"+escape(e.message+"",true)+"</pre>"}throw e}}marked.options=marked.setOptions=function(opt){merge(marked.defaults,opt);return marked};marked.defaults={gfm:true,tables:true,breaks:false,pedantic:false,sanitize:false,smartLists:false,silent:false,highlight:null,langPrefix:"lang-",smartypants:false,headerPrefix:"",renderer:new Renderer,xhtml:false};marked.Parser=Parser;marked.parser=Parser.parse;marked.Renderer=Renderer;marked.Lexer=Lexer;marked.lexer=Lexer.lex;marked.InlineLexer=InlineLexer;marked.inlineLexer=InlineLexer.output;marked.parse=marked;if(typeof module!=="undefined"&&typeof exports==="object"){module.exports=marked}else if(typeof define==="function"&&define.amd){define(function(){return marked})}else{this.marked=marked}}).call(function(){return this||(typeof window!=="undefined"?window:global)}());


/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/lib/striptags.js ---- */


'use strict';

//src from https://github.com/ericnorris/striptags/blob/master/src/striptags.js

(function (global) {

    const STATE_PLAINTEXT = Symbol('plaintext');
    const STATE_HTML      = Symbol('html');
    const STATE_COMMENT   = Symbol('comment');

    const ALLOWED_TAGS_REGEX  = /<(\w*)>/g;
    const NORMALIZE_TAG_REGEX = /<\/?([^\s\/>]+)/;

    function striptags(html, allowable_tags, tag_replacement) {
        html            = html || '';
        allowable_tags  = allowable_tags || [];
        tag_replacement = tag_replacement || '';

        let context = init_context(allowable_tags, tag_replacement);

        return striptags_internal(html, context);
    }

    function init_striptags_stream(allowable_tags, tag_replacement) {
        allowable_tags  = allowable_tags || [];
        tag_replacement = tag_replacement || '';

        let context = init_context(allowable_tags, tag_replacement);

        return function striptags_stream(html) {
            return striptags_internal(html || '', context);
        };
    }

    striptags.init_streaming_mode = init_striptags_stream;

    function init_context(allowable_tags, tag_replacement) {
        allowable_tags = parse_allowable_tags(allowable_tags);

        return {
            allowable_tags,
            tag_replacement,

            state         : STATE_PLAINTEXT,
            tag_buffer    : '',
            depth         : 0,
            in_quote_char : ''
        };
    }

    function striptags_internal(html, context) {
        let allowable_tags  = context.allowable_tags;
        let tag_replacement = context.tag_replacement;

        let state         = context.state;
        let tag_buffer    = context.tag_buffer;
        let depth         = context.depth;
        let in_quote_char = context.in_quote_char;
        let output        = '';

        for (let idx = 0, length = html.length; idx < length; idx++) {
            let char = html[idx];

            if (state === STATE_PLAINTEXT) {
                switch (char) {
                    case '<':
                        state       = STATE_HTML;
                        tag_buffer += char;
                        break;

                    default:
                        output += char;
                        break;
                }
            }

            else if (state === STATE_HTML) {
                switch (char) {
                    case '<':
                        // ignore '<' if inside a quote
                        if (in_quote_char) {
                            break;
                        }

                        // we're seeing a nested '<'
                        depth++;
                        break;

                    case '>':
                        // ignore '>' if inside a quote
                        if (in_quote_char) {
                            break;
                        }

                        // something like this is happening: '<<>>'
                        if (depth) {
                            depth--;

                            break;
                        }

                        // this is closing the tag in tag_buffer
                        in_quote_char = '';
                        state         = STATE_PLAINTEXT;
                        tag_buffer   += '>';

                        if (allowable_tags.has(normalize_tag(tag_buffer))) {
                            output += tag_buffer;
                        } else {
                            output += tag_replacement;
                        }

                        tag_buffer = '';
                        break;

                    case '"':
                    case '\'':
                        // catch both single and double quotes

                        if (char === in_quote_char) {
                            in_quote_char = '';
                        } else {
                            in_quote_char = in_quote_char || char;
                        }

                        tag_buffer += char;
                        break;

                    case '-':
                        if (tag_buffer === '<!-') {
                            state = STATE_COMMENT;
                        }

                        tag_buffer += char;
                        break;

                    case ' ':
                    case '\n':
                        if (tag_buffer === '<') {
                            state      = STATE_PLAINTEXT;
                            output    += '< ';
                            tag_buffer = '';

                            break;
                        }

                        tag_buffer += char;
                        break;

                    default:
                        tag_buffer += char;
                        break;
                }
            }

            else if (state === STATE_COMMENT) {
                switch (char) {
                    case '>':
                        if (tag_buffer.slice(-2) == '--') {
                            // close the comment
                            state = STATE_PLAINTEXT;
                        }

                        tag_buffer = '';
                        break;

                    default:
                        tag_buffer += char;
                        break;
                }
            }
        }

        // save the context for future iterations
        context.state         = state;
        context.tag_buffer    = tag_buffer;
        context.depth         = depth;
        context.in_quote_char = in_quote_char;

        return output;
    }

    function parse_allowable_tags(allowable_tags) {
        let tags_array = [];

        if (typeof allowable_tags === 'string') {
            let match;

            while ((match = ALLOWED_TAGS_REGEX.exec(allowable_tags)) !== null) {
                tags_array.push(match[1]);
            }
        }

        else if (typeof allowable_tags[Symbol.iterator] === 'function') {
            tags_array = allowable_tags;
        }

        return new Set(tags_array);
    }

    function normalize_tag(tag_buffer) {
        let match = NORMALIZE_TAG_REGEX.exec(tag_buffer);

        return match ? match[1].toLowerCase() : null;
    }
        // Browser
        global.striptags = striptags;
}(window));



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/Animation.coffee ---- */


(function() {
  var Animation;

  Animation = (function() {
    function Animation() {}

    Animation.prototype.slideDown = function(elem, props) {
      var border_bottom_width, border_top_width, cstyle, h, margin_bottom, margin_top, next_elem, padding_bottom, padding_top, parent, top_after, top_before, transition;
      h = elem.offsetHeight;
      cstyle = window.getComputedStyle(elem);
      margin_top = cstyle.marginTop;
      margin_bottom = cstyle.marginBottom;
      padding_top = cstyle.paddingTop;
      padding_bottom = cstyle.paddingBottom;
      border_top_width = cstyle.borderTopWidth;
      border_bottom_width = cstyle.borderBottomWidth;
      transition = cstyle.transition;
      if (window.Animation.shouldScrollFix(elem, props)) {
        top_after = document.body.scrollHeight;
        next_elem = elem.nextSibling;
        parent = elem.parentNode;
        parent.removeChild(elem);
        top_before = document.body.scrollHeight;
        console.log("Scrollcorrection down", top_before - top_after);
        window.scrollTo(window.scrollX, window.scrollY - (top_before - top_after));
        if (next_elem) {
          parent.insertBefore(elem, next_elem);
        } else {
          parent.appendChild(elem);
        }
        return;
      }
      if (props.animate_scrollfix && elem.getBoundingClientRect().top > 1600) {
        return;
      }
      elem.style.boxSizing = "border-box";
      elem.style.overflow = "hidden";
      if (!props.animate_noscale) {
        elem.style.transform = "scale(0.6)";
      }
      elem.style.opacity = "0";
      elem.style.height = "0px";
      elem.style.marginTop = "0px";
      elem.style.marginBottom = "0px";
      elem.style.paddingTop = "0px";
      elem.style.paddingBottom = "0px";
      elem.style.borderTopWidth = "0px";
      elem.style.borderBottomWidth = "0px";
      elem.style.transition = "none";
      setTimeout((function() {
        elem.className += " animate-inout";
        elem.style.height = h + "px";
        elem.style.transform = "scale(1)";
        elem.style.opacity = "1";
        elem.style.marginTop = margin_top;
        elem.style.marginBottom = margin_bottom;
        elem.style.paddingTop = padding_top;
        elem.style.paddingBottom = padding_bottom;
        elem.style.borderTopWidth = border_top_width;
        return elem.style.borderBottomWidth = border_bottom_width;
      }), 1);
      return elem.addEventListener("transitionend", function() {
        elem.classList.remove("animate-inout");
        elem.style.transition = elem.style.transform = elem.style.opacity = elem.style.height = null;
        elem.style.boxSizing = elem.style.marginTop = elem.style.marginBottom = null;
        elem.style.paddingTop = elem.style.paddingBottom = elem.style.overflow = null;
        elem.style.borderTopWidth = elem.style.borderBottomWidth = elem.style.overflow = null;
        return elem.removeEventListener("transitionend", arguments.callee, false);
      });
    };

    Animation.prototype.shouldScrollFix = function(elem, props) {
      var pos;
      pos = elem.getBoundingClientRect();
      if (props.animate_scrollfix && window.scrollY > 300 && pos.top < 0 && !document.querySelector(".noscrollfix:hover")) {
        return true;
      } else {
        return false;
      }
    };

    Animation.prototype.slideDownAnime = function(elem, props) {
      var cstyle;
      cstyle = window.getComputedStyle(elem);
      elem.style.overflowY = "hidden";
      return anime({
        targets: elem,
        height: [0, elem.offsetHeight],
        easing: 'easeInOutExpo'
      });
    };

    Animation.prototype.slideUpAnime = function(elem, remove_func, props) {
      elem.style.overflowY = "hidden";
      return anime({
        targets: elem,
        height: [elem.offsetHeight, 0],
        complete: remove_func,
        easing: 'easeInOutExpo'
      });
    };

    Animation.prototype.slideUp = function(elem, remove_func, props) {
      var next_elem, parent, top_after, top_before;
      if (window.Animation.shouldScrollFix(elem, props) && elem.nextSibling) {
        top_after = document.body.scrollHeight;
        next_elem = elem.nextSibling;
        parent = elem.parentNode;
        parent.removeChild(elem);
        top_before = document.body.scrollHeight;
        console.log("Scrollcorrection down", top_before - top_after);
        window.scrollTo(window.scrollX, window.scrollY + (top_before - top_after));
        if (next_elem) {
          parent.insertBefore(elem, next_elem);
        } else {
          parent.appendChild(elem);
        }
        remove_func();
        return;
      }
      if (props.animate_scrollfix && elem.getBoundingClientRect().top > 1600) {
        remove_func();
        return;
      }
      elem.className += " animate-inout";
      elem.style.boxSizing = "border-box";
      elem.style.height = elem.offsetHeight + "px";
      elem.style.overflow = "hidden";
      elem.style.transform = "scale(1)";
      elem.style.opacity = "1";
      elem.style.pointerEvents = "none";
      setTimeout((function() {
        var cstyle;
        cstyle = window.getComputedStyle(elem);
        elem.style.height = "0px";
        elem.style.marginTop = (0 - parseInt(cstyle.borderTopWidth) - parseInt(cstyle.borderBottomWidth)) + "px";
        elem.style.marginBottom = "0px";
        elem.style.paddingTop = "0px";
        elem.style.paddingBottom = "0px";
        elem.style.transform = "scale(0.8)";
        return elem.style.opacity = "0";
      }), 1);
      return elem.addEventListener("transitionend", function(e) {
        if (e.propertyName === "opacity" || e.elapsedTime >= 0.6) {
          elem.removeEventListener("transitionend", arguments.callee, false);
          return setTimeout((function() {
            return remove_func();
          }), 2000);
        }
      });
    };

    Animation.prototype.showRight = function(elem, props) {
      elem.className += " animate";
      elem.style.opacity = 0;
      elem.style.transform = "TranslateX(-20px) Scale(1.01)";
      setTimeout((function() {
        elem.style.opacity = 1;
        return elem.style.transform = "TranslateX(0px) Scale(1)";
      }), 1);
      return elem.addEventListener("transitionend", function() {
        elem.classList.remove("animate");
        elem.style.transform = elem.style.opacity = null;
        return elem.removeEventListener("transitionend", arguments.callee, false);
      });
    };

    Animation.prototype.show = function(elem, props) {
      var delay, ref;
      delay = ((ref = arguments[arguments.length - 2]) != null ? ref.delay : void 0) * 1000 || 1;
      elem.className += " animate";
      elem.style.opacity = 0;
      setTimeout((function() {
        return elem.style.opacity = 1;
      }), delay);
      return elem.addEventListener("transitionend", function() {
        elem.classList.remove("animate");
        elem.style.opacity = null;
        return elem.removeEventListener("transitionend", arguments.callee, false);
      });
    };

    Animation.prototype.hide = function(elem, remove_func, props) {
      var delay, ref;
      delay = ((ref = arguments[arguments.length - 2]) != null ? ref.delay : void 0) * 1000 || 1;
      elem.className += " animate";
      setTimeout((function() {
        return elem.style.opacity = 0;
      }), delay);
      return elem.addEventListener("transitionend", function(e) {
        if (e.propertyName === "opacity") {
          remove_func();
          return elem.removeEventListener("transitionend", arguments.callee, false);
        }
      });
    };

    Animation.prototype.addVisibleClass = function(elem, props) {
      return setTimeout(function() {
        return elem.classList.add("visible");
      });
    };

    Animation.prototype.cloneAnimation = function(elem, animation) {
      return window.requestAnimationFrame((function(_this) {
        return function() {
          var clone, cloneleft, cstyle;
          if (elem.style.pointerEvents === "none") {
            elem = elem.nextSibling;
          }
          elem.style.position = "relative";
          elem.style.zIndex = "2";
          clone = elem.cloneNode(true);
          cstyle = window.getComputedStyle(elem);
          clone.classList.remove("loading");
          clone.style.position = "absolute";
          clone.style.zIndex = "1";
          clone.style.pointerEvents = "none";
          clone.style.animation = "none";
          elem.parentNode.insertBefore(clone, elem);
          cloneleft = clone.offsetLeft;
          clone.parentNode.removeChild(clone);
          clone.style.marginLeft = parseInt(cstyle.marginLeft) + elem.offsetLeft - cloneleft + "px";
          elem.parentNode.insertBefore(clone, elem);
          clone.style.animation = animation + " 0.8s ease-in-out forwards";
          return setTimeout((function() {
            return clone.remove();
          }), 1000);
        };
      })(this));
    };

    Animation.prototype.flashIn = function(elem) {
      if (elem.offsetWidth > 100) {
        return this.cloneAnimation(elem, "flash-in-big");
      } else {
        return this.cloneAnimation(elem, "flash-in");
      }
    };

    Animation.prototype.flashOut = function(elem) {
      if (elem.offsetWidth > 100) {
        return this.cloneAnimation(elem, "flash-out-big");
      } else {
        return this.cloneAnimation(elem, "flash-out");
      }
    };

    return Animation;

  })();

  window.Animation = new Animation();

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/Autosize.coffee ---- */


(function() {
  var Autosize,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Autosize = (function(superClass) {
    extend(Autosize, superClass);

    function Autosize(attrs1) {
      var base, ref;
      this.attrs = attrs1 != null ? attrs1 : {};
      this.render = bind(this.render, this);
      this.handleKeydown = bind(this.handleKeydown, this);
      this.handleInput = bind(this.handleInput, this);
      this.autoHeight = bind(this.autoHeight, this);
      this.setValue = bind(this.setValue, this);
      this.storeNode = bind(this.storeNode, this);
      this.node = null;
            if ((ref = (base = this.attrs).classes) != null) {
        ref;
      } else {
        base.classes = {};
      };
      this.attrs.classes.loading = false;
      this.attrs.oninput = this.handleInput;
      this.attrs.onkeydown = this.handleKeydown;
      this.attrs.afterCreate = this.storeNode;
      this.attrs.rows = 1;
      this.attrs.disabled = false;
    }

    Autosize.property('loading', {
      get: function() {
        return this.attrs.classes.loading;
      },
      set: function(loading) {
        this.attrs.classes.loading = loading;
        this.node.value = this.attrs.value;
        this.autoHeight();
        return Page.projector.scheduleRender();
      }
    });

    Autosize.prototype.storeNode = function(node) {
      this.node = node;
      if (this.attrs.focused) {
        node.focus();
      }
      return setTimeout((function(_this) {
        return function() {
          return _this.autoHeight();
        };
      })(this));
    };

    Autosize.prototype.setValue = function(value) {
      if (value == null) {
        value = null;
      }
      this.attrs.value = value;
      if (this.node) {
        this.node.value = value;
        this.autoHeight();
      }
      return Page.projector.scheduleRender();
    };

    Autosize.prototype.autoHeight = function() {
      var h, height_before, scrollh;
      height_before = this.node.style.height;
      if (height_before) {
        this.node.style.height = "0px";
      }
      h = this.node.offsetHeight;
      scrollh = this.node.scrollHeight;
      this.node.style.height = height_before;
      if (scrollh > h) {
        return anime({
          targets: this.node,
          height: scrollh,
          scrollTop: 0
        });
      } else {
        return this.node.style.height = height_before;
      }
    };

    Autosize.prototype.handleInput = function(e) {
      if (e == null) {
        e = null;
      }
      this.attrs.value = e.target.value;
      return RateLimit(300, this.autoHeight);
    };

    Autosize.prototype.handleKeydown = function(e) {
      if (e == null) {
        e = null;
      }
      if (e.which === 13 && !e.shiftKey && this.attrs.onsubmit && this.attrs.value.trim()) {
        this.attrs.onsubmit();
        setTimeout(((function(_this) {
          return function() {
            return _this.autoHeight();
          };
        })(this)), 100);
        return false;
      }
    };

    Autosize.prototype.render = function(body) {
      var attrs;
      if (body == null) {
        body = null;
      }
      if (body && this.attrs.value === void 0) {
        this.setValue(body);
      }
      if (this.loading) {
        attrs = clone(this.attrs);
        attrs.disabled = true;
        return h("textarea.autosize", attrs);
      } else {
        return h("textarea.autosize", this.attrs);
      }
    };

    return Autosize;

  })(Class);

  window.Autosize = Autosize;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/Debug.coffee ---- */


(function() {
  var Debug;

  Debug = (function() {
    function Debug() {}

    Debug.prototype.formatException = function(err) {
      if (typeof err === 'object') {
        if (err.message) {
          console.log('Message: ' + err.message);
        }
        if (err.stack) {
          console.log('Stacktrace:');
          console.log('====================');
          return console.log(err.stack);
        }
      } else {
        return console.log(err);
      }
    };

    return Debug;

  })();

  window.Debug = new Debug();

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/Editable.coffee ---- */


(function() {
  var Editable,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Editable = (function(superClass) {
    extend(Editable, superClass);

    function Editable(type, handleSave, handleDelete) {
      this.type = type;
      this.handleSave = handleSave;
      this.handleDelete = handleDelete;
      this.render = bind(this.render, this);
      this.handleSaveClick = bind(this.handleSaveClick, this);
      this.handleDeleteClick = bind(this.handleDeleteClick, this);
      this.handleCancelClick = bind(this.handleCancelClick, this);
      this.handleEditClick = bind(this.handleEditClick, this);
      this.storeNode = bind(this.storeNode, this);
      this.node = null;
      this.editing = false;
      this.render_function = null;
      this.empty_text = "Click here to edit this field";
    }

    Editable.prototype.storeNode = function(node) {
      return this.node = node;
    };

    Editable.prototype.handleEditClick = function(e) {
      this.editing = true;
      this.field_edit = new Autosize({
        focused: 1,
        style: "height: 0px"
      });
      return false;
    };

    Editable.prototype.handleCancelClick = function() {
      this.editing = false;
      return false;
    };

    Editable.prototype.handleDeleteClick = function() {
      Page.cmd("wrapperConfirm", ["Are you sure?", "Delete"], (function(_this) {
        return function() {
          _this.field_edit.loading = true;
          return _this.handleDelete(function(res) {
            return _this.field_edit.loading = false;
          });
        };
      })(this));
      return false;
    };

    Editable.prototype.handleSaveClick = function() {
      this.field_edit.loading = true;
      this.handleSave(this.field_edit.attrs.value, (function(_this) {
        return function(res) {
          _this.field_edit.loading = false;
          if (res) {
            return _this.editing = false;
          }
        };
      })(this));
      return false;
    };

    Editable.prototype.render = function(body) {
      if (this.editing) {
        return h("div.editable.editing", {
          exitAnimation: Animation.slideUp
        }, this.field_edit.render(body), h("div.editablebuttons", h("a.link", {
          href: "#Cancel",
          onclick: this.handleCancelClick,
          tabindex: "-1"
        }, "Cancel"), this.handleDelete ? h("a.button.button-submit.button-small.button-outline", {
          href: "#Delete",
          onclick: this.handleDeleteClick,
          tabindex: "-1"
        }) : void 0, h("a.button.button-submit.button-small", {
          href: "#Save",
          onclick: this.handleSaveClick
        }, "Save")));
      } else {
        return h("div.editable", {
          enterAnimation: Animation.slideDown
        }, h("a.icon.icon-edit", {
          key: this.node,
          href: "#Edit",
          onclick: this.handleEditClick
        }), !body ? h(this.type, h("span.empty", {
          onclick: this.handleEditClick
        }, this.empty_text)) : this.render_function ? h(this.type, {
          innerHTML: this.render_function(body)
        }) : h(this.type, body));
      }
    };

    return Editable;

  })(Class);

  window.Editable = Editable;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/ImagePreview.coffee ---- */


(function() {
  var ImagePreview,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ImagePreview = (function(superClass) {
    extend(ImagePreview, superClass);

    function ImagePreview() {
      this.setPreviewData = bind(this.setPreviewData, this);
      this.width = 0;
      this.height = 0;
      this.preview_data = "";
      this.pixel_chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    }

    ImagePreview.prototype.getSize = function(target_width, target_height) {
      return this.calcSize(this.width, this.height, target_width, target_height);
    };

    ImagePreview.prototype.calcSize = function(source_width, source_height, target_width, target_height) {
      var height, width;
      width = target_width;
      height = width * (source_height / source_width);
      if (height > target_height) {
        height = target_height;
        width = height * (source_width / source_height);
      }
      return [Math.round(width), Math.round(height)];
    };

    ImagePreview.prototype.setPreviewData = function(preview_data) {
      var colors, pixels, ref;
      this.preview_data = preview_data;
      return ref = this.preview_data.split(","), this.width = ref[0], this.height = ref[1], colors = ref[2], pixels = ref[3], ref;
    };

    ImagePreview.prototype.getPreviewUri = function(target_width, target_height) {
      var b, back, canvas, color, color_codes, colors, ctx, di, g, height, hex, i, image_data, j, k, len, len1, pixel, pixels, r, ref, ref1, width;
      if (target_width == null) {
        target_width = 10;
      }
      if (target_height == null) {
        target_height = 10;
      }
      this.logStart("Render");
      ref = this.preview_data.split(","), this.width = ref[0], this.height = ref[1], colors = ref[2], pixels = ref[3];
      ref1 = this.getSize(target_width, target_height), width = ref1[0], height = ref1[1];
      colors = colors.match(/.{3}/g);
      pixels = pixels.split("");
      canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d');
      image_data = ctx.createImageData(width, height);
      color_codes = {};
      for (i = j = 0, len = colors.length; j < len; i = ++j) {
        color = colors[i];
        color_codes[this.pixel_chars[i]] = color;
      }
      di = 0;
      for (k = 0, len1 = pixels.length; k < len1; k++) {
        pixel = pixels[k];
        hex = color_codes[pixel];
        r = parseInt(hex[0], 16) * 17;
        g = parseInt(hex[1], 16) * 17;
        b = parseInt(hex[2], 16) * 17;
        image_data.data[di] = r;
        image_data.data[di + 1] = g;
        image_data.data[di + 2] = b;
        image_data.data[di + 3] = 255;
        di += 4;
      }
      ctx.putImageData(image_data, 0, 0);

      /*
      		canvas2 = document.createElement("canvas")
      		canvas2.width = width*3
      		canvas2.height = height*3
      		ctx = canvas2.getContext('2d')
      		ctx.filter = "blur(1px)"
      		ctx.drawImage(canvas, 1, 0, canvas.width*3, canvas.height*3)
      		ctx.drawImage(canvas, 0, 1, canvas.width*3, canvas.height*3)
      		ctx.drawImage(canvas, 0, 0, canvas.width*3, canvas.height*3) */
      back = canvas.toDataURL("image/png");
      this.logEnd("Render");
      return back;
    };

    return ImagePreview;

  })(Class);

  window.ImagePreview = ImagePreview;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/ItemList.coffee ---- */


(function() {
  var ItemList;

  ItemList = (function() {
    function ItemList(item_class1, key1) {
      this.item_class = item_class1;
      this.key = key1;
      this.items = [];
      this.items_bykey = {};
    }

    ItemList.prototype.sync = function(rows, item_class, key) {
      var current_obj, i, item, len, results, row;
      this.items.splice(0, this.items.length);
      results = [];
      for (i = 0, len = rows.length; i < len; i++) {
        row = rows[i];
        current_obj = this.items_bykey[row[this.key]];
        if (current_obj) {
          current_obj.row = row;
          results.push(this.items.push(current_obj));
        } else {
          item = new this.item_class(row, this);
          this.items_bykey[row[this.key]] = item;
          results.push(this.items.push(item));
        }
      }
      return results;
    };

    ItemList.prototype.deleteItem = function(item) {
      var index;
      index = this.items.indexOf(item);
      if (index > -1) {
        this.items.splice(index, 1);
      } else {
        console.log("Can't delete item", item);
      }
      return delete this.items_bykey[item.row[this.key]];
    };

    return ItemList;

  })();

  window.ItemList = ItemList;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/MarkdownStrip.coffee ---- */


(function() {
  window.stripMarkdown = function(str) {
    return entities.decode(striptags(Text.renderMarked(str)));
  };

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/Maxheight.coffee ---- */


(function() {
  var Maxheight;

  Maxheight = (function() {
    function Maxheight() {}

    Maxheight.prototype.apply = function(elem) {
      if (elem.classList.contains("maxheight") && elem.scrollHeight > 500) {
        elem.classList.add("maxheight-limited");
        return elem.onclick = function(e) {
          if (e.target === elem) {
            elem.style.maxHeight = elem.scrollHeight + "px";
            elem.classList.remove("maxheight-limited");
            return setTimeout((function() {
              elem.classList.remove("maxheight");
              return elem.style.maxHeight = null;
            }), 1000);
          }
        };
      } else {
        return elem.classList.remove("maxheight-limited");
      }
    };

    return Maxheight;

  })();

  window.Maxheight = new Maxheight();

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/Menu.coffee ---- */


(function() {
  var Menu,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Menu = (function() {
    function Menu() {
      this.render = bind(this.render, this);
      this.renderItem = bind(this.renderItem, this);
      this.handleClick = bind(this.handleClick, this);
      this.storeNode = bind(this.storeNode, this);
      this.toggle = bind(this.toggle, this);
      this.hide = bind(this.hide, this);
      this.show = bind(this.show, this);
      this.visible = false;
      this.items = [];
      this.node = null;
    }

    Menu.prototype.show = function() {
      var ref;
      if ((ref = window.visible_menu) != null) {
        ref.hide();
      }
      this.visible = true;
      return window.visible_menu = this;
    };

    Menu.prototype.hide = function() {
      return this.visible = false;
    };

    Menu.prototype.toggle = function() {
      if (this.visible) {
        this.hide();
      } else {
        this.show();
      }
      return Page.projector.scheduleRender();
    };

    Menu.prototype.addItem = function(title, cb, selected) {
      if (selected == null) {
        selected = false;
      }
      return this.items.push([title, cb, selected]);
    };

    Menu.prototype.storeNode = function(node) {
      this.node = node;
      if (this.visible) {
        node.className = node.className.replace("visible", "");
        return setTimeout((function() {
          return node.className += " visible";
        }), 10);
      }
    };

    Menu.prototype.handleClick = function(e) {
      var cb, i, item, keep_menu, len, ref, selected, title;
      keep_menu = false;
      ref = this.items;
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        title = item[0], cb = item[1], selected = item[2];
        if (title === e.target.textContent) {
          keep_menu = cb(item);
        }
      }
      if (keep_menu !== true) {
        this.hide();
      }
      return false;
    };

    Menu.prototype.renderItem = function(item) {
      var cb, href, onclick, selected, title;
      title = item[0], cb = item[1], selected = item[2];
      if (typeof selected === "function") {
        selected = selected();
      }
      if (title === "---") {
        return h("div.menu-item-separator");
      } else {
        if (typeof cb === "string") {
          href = cb;
          onclick = true;
        } else {
          href = "#" + title;
          onclick = this.handleClick;
        }
        return h("a.menu-item", {
          href: href,
          onclick: onclick,
          key: title,
          classes: {
            "selected": selected
          }
        }, [title]);
      }
    };

    Menu.prototype.render = function(class_name) {
      if (class_name == null) {
        class_name = "";
      }
      if (this.visible || this.node) {
        return h("div.menu" + class_name, {
          classes: {
            "visible": this.visible
          },
          afterCreate: this.storeNode
        }, this.items.map(this.renderItem));
      }
    };

    return Menu;

  })();

  window.Menu = Menu;

  document.body.addEventListener("mouseup", function(e) {
    if (!window.visible_menu || !window.visible_menu.node) {
      return false;
    }
    if (e.target !== window.visible_menu.node.parentNode && e.target.parentNode !== window.visible_menu.node && e.target.parentNode !== window.visible_menu.node.parentNode && e.target.parentNode !== window.visible_menu.node && e.target.parentNode.parentNode !== window.visible_menu.node.parentNode) {
      window.visible_menu.hide();
      return Page.projector.scheduleRender();
    }
  });

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/Overlay.coffee ---- */


(function() {
  var Overlay,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Overlay = (function(superClass) {
    extend(Overlay, superClass);

    function Overlay() {
      this.render = bind(this.render, this);
      this.handleClick = bind(this.handleClick, this);
      this.zoomImageTag = bind(this.zoomImageTag, this);
      this.visible = false;
      this.called = false;
      this.height = 0;
      this.image_top = 0;
      this.image_left = 0;
      this.image_width = 0;
      this.image_height = 0;
      this.background_image = "";
      this.image_transform = "";
      this.style = "";
      this.pos = null;
      this.tag = null;
    }

    Overlay.prototype.zoomImageTag = function(tag, target_width, target_height) {
      var pos, ratio;
      this.log("Show", target_width, target_height);
      this.background_image = tag.style.backgroundImage;
      this.height = document.body.scrollHeight;
      pos = tag.getBoundingClientRect();
      this.original_pos = pos;
      this.image_top = parseInt(pos.top + window.scrollY) + "px";
      this.image_left = parseInt(pos.left) + "px";
      this.image_width = target_width;
      this.image_height = target_height;
      ratio = pos.width / target_width;
      this.image_transform = "scale(" + ratio + ") ";
      this.image_margin_left = parseInt((pos.width - target_width) / 2);
      this.image_margin_top = parseInt((pos.height - target_height) / 2);
      this.style = "";
      this.called = true;
      this.tag = tag;
      this.visible = true;
      return window.requestAnimationFrame(((function(_this) {
        return function() {
          ratio = 1;
          _this.image_transform = "scale(" + ratio + ") ";
          return Page.projector.scheduleRender();
        };
      })(this)));
    };

    Overlay.prototype.handleClick = function() {
      var ratio;
      this.log("Hide");
      ratio = this.original_pos.width / this.image_width;
      this.image_transform = "scale(" + ratio + ") ";
      this.image_margin_left = Math.floor((this.original_pos.width - this.image_width) / 2);
      this.image_margin_top = Math.floor((this.original_pos.height - this.image_height) / 2);
      this.log(this.image_margin_top, this.image_margin_left, this.image_width, this.image_height);
      this.visible = false;
      setTimeout(((function(_this) {
        return function() {
          _this.log("opacity", _this.visible);
          if (!_this.visible) {
            _this.style = "opacity: 0";
            return Page.projector.scheduleRender();
          }
        };
      })(this)), 400);
      setTimeout(((function(_this) {
        return function() {
          if (!_this.visible) {
            _this.called = false;
            return Page.projector.scheduleRender();
          }
        };
      })(this)), 900);
      return false;
    };

    Overlay.prototype.render = function() {
      if (!this.called) {
        return h("div#Overlay", {
          classes: {
            visible: this.visible
          },
          onclick: this.handleClick
        });
      }
      return h("div#Overlay", {
        classes: {
          visible: this.visible
        },
        onclick: this.handleClick,
        style: "height: " + this.height + "px"
      }, [
        h("div.img", {
          style: "transform: " + this.image_transform + "; margin-left: " + this.image_margin_left + "px; margin-top: " + this.image_margin_top + "px;\ntop: " + this.image_top + "; left: " + this.image_left + ";\nwidth: " + this.image_width + "px; height: " + this.image_height + "px;\nbackground-image: " + this.background_image + ";\n" + this.style
        })
      ]);
    };

    return Overlay;

  })(Class);

  window.Overlay = Overlay;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/Scrollwatcher.coffee ---- */


(function() {
  var Scrollwatcher,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Scrollwatcher = (function(superClass) {
    extend(Scrollwatcher, superClass);

    function Scrollwatcher() {
      this.checkScroll = bind(this.checkScroll, this);
      this.log("Scrollwatcher");
      this.items = [];
      window.onscroll = (function(_this) {
        return function() {
          return RateLimit(200, _this.checkScroll);
        };
      })(this);
      this;
    }

    Scrollwatcher.prototype.checkScroll = function() {
      var cb, i, item_top, j, ref, ref1, results, tag, view_bottom, view_top;
      if (!this.items.length) {
        return;
      }
      view_top = window.scrollY;
      view_bottom = window.scrollY + window.innerHeight;
      ref = this.items;
      results = [];
      for (i = j = ref.length - 1; j >= 0; i = j += -1) {
        ref1 = ref[i], item_top = ref1[0], tag = ref1[1], cb = ref1[2];
        if (item_top + 900 > view_top && item_top - 400 < view_bottom) {
          this.items.splice(i, 1);
          results.push(cb(tag));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Scrollwatcher.prototype.add = function(tag, cb) {
      this.items.push([tag.getBoundingClientRect().top + window.scrollY, tag, cb]);
      return RateLimit(200, this.checkScroll);
    };

    return Scrollwatcher;

  })(Class);

  window.Scrollwatcher = Scrollwatcher;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/Text.coffee ---- */


(function() {
  var MarkedRenderer, Text,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  MarkedRenderer = (function(superClass) {
    extend(MarkedRenderer, superClass);

    function MarkedRenderer() {
      return MarkedRenderer.__super__.constructor.apply(this, arguments);
    }

    MarkedRenderer.prototype.image = function(href, title, text) {
      return "<code>![" + text + "](" + href + ")</code>";
    };

    return MarkedRenderer;

  })(marked.Renderer);

  Text = (function() {
    function Text() {
      this.renderLinks = bind(this.renderLinks, this);
      this.renderMarked = bind(this.renderMarked, this);
    }

    Text.prototype.toColor = function(text, saturation, lightness) {
      var hash, i, j, ref;
      if (saturation == null) {
        saturation = 30;
      }
      if (lightness == null) {
        lightness = 50;
      }
      hash = 0;
      for (i = j = 0, ref = text.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        hash += text.charCodeAt(i) * i;
        hash = hash % 1777;
      }
      return "hsl(" + (hash % 360) + ("," + saturation + "%," + lightness + "%)");
    };

    Text.prototype.renderMarked = function(text, options) {
      if (options == null) {
        options = {};
      }
      if (!text) {
        return "";
      }
      options["gfm"] = true;
      options["breaks"] = true;
      options["sanitize"] = true;
      options["renderer"] = marked_renderer;
      text = this.fixReply(text);
      text = marked(text, options);
      text = text.replace(/(@[^\x00-\x1f^\x21-\x2f^\x3a-\x40^\x5b-\x60^\x7b-\x7f]{1,16}):/g, '<b class="reply-name">$1</b>:');
      return this.fixHtmlLinks(text);
    };

    Text.prototype.renderLinks = function(text) {
      text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      text = text.replace(/(https?:\/\/[^\s)]+)/g, function(match) {
        return "<a href=\"" + (match.replace(/&amp;/g, '&')) + "\">" + match + "</a>";
      });
      text = text.replace(/\n/g, '<br>');
      text = text.replace(/(@[^\x00-\x1f^\x21-\x2f^\x3a-\x40^\x5b-\x60^\x7b-\x7f]{1,16}):/g, '<b class="reply-name">$1</b>:');
      text = this.fixHtmlLinks(text);
      return text;
    };

    Text.prototype.emailLinks = function(text) {
      return text.replace(/([a-zA-Z0-9]+)@zeroid.bit/g, "<a href='?to=$1' onclick='return Page.message_create.show(\"$1\")'>$1@zeroid.bit</a>");
    };

    Text.prototype.fixHtmlLinks = function(text) {
      text = text.replace(/href="http:\/\/(127.0.0.1|localhost):43110\/(Me.ZeroNetwork.bit|1MeFqFfFFGQfa1J3gJyYYUvb5Lksczq7nH)\/\?/gi, 'href="?');
      if (window.is_proxy) {
        text = text.replace(/href="http:\/\/(127.0.0.1|localhost):43110/gi, 'href="http://zero');
        text = text.replace(/http:\/\/zero\/([^\/]+\.bit)/, "http://$1");
      } else {
        text = text.replace(/href="http:\/\/(127.0.0.1|localhost):43110/g, 'href="');
      }
      text = text.replace(/href="\.\/\?/g, 'href="?');
      text = text.replace(/href="\?/g, 'onclick="return Page.handleLinkClick(window.event)" href="?');
      return text;
    };

    Text.prototype.fixLink = function(link) {
      var back;
      if (window.is_proxy) {
        back = link.replace(/http:\/\/(127.0.0.1|localhost):43110/, 'http://zero');
        return back.replace(/http:\/\/zero\/([^\/]+\.bit)/, "http://$1");
      } else {
        return link.replace(/http:\/\/(127.0.0.1|localhost):43110/, '');
      }
    };

    Text.prototype.toUrl = function(text) {
      return text.replace(/[^A-Za-z0-9]/g, "+").replace(/[+]+/g, "+").replace(/[+]+$/, "");
    };

    Text.prototype.getSiteUrl = function(address) {
      if (window.is_proxy) {
        if (indexOf.call(address, ".") >= 0) {
          return "http://" + address + "/";
        } else {
          return "http://zero/" + address + "/";
        }
      } else {
        return "/" + address + "/";
      }
    };

    Text.prototype.fixReply = function(text) {
      return text.replace(/(>.*\n)([^\n>])/gm, "$1\n$2");
    };

    Text.prototype.toBitcoinAddress = function(text) {
      return text.replace(/[^A-Za-z0-9]/g, "");
    };

    Text.prototype.jsonEncode = function(obj) {
      return unescape(encodeURIComponent(JSON.stringify(obj)));
    };

    Text.prototype.jsonDecode = function(obj) {
      return JSON.parse(decodeURIComponent(escape(obj)));
    };

    Text.prototype.fileEncode = function(obj) {
      if (typeof obj === "string") {
        return btoa(unescape(encodeURIComponent(obj)));
      } else {
        return btoa(unescape(encodeURIComponent(JSON.stringify(obj, void 0, '\t'))));
      }
    };

    Text.prototype.utf8Encode = function(s) {
      return unescape(encodeURIComponent(s));
    };

    Text.prototype.utf8Decode = function(s) {
      return decodeURIComponent(escape(s));
    };

    Text.prototype.distance = function(s1, s2) {
      var char, extra_parts, j, key, len, match, next_find, next_find_i, val;
      s1 = s1.toLocaleLowerCase();
      s2 = s2.toLocaleLowerCase();
      next_find_i = 0;
      next_find = s2[0];
      match = true;
      extra_parts = {};
      for (j = 0, len = s1.length; j < len; j++) {
        char = s1[j];
        if (char !== next_find) {
          if (extra_parts[next_find_i]) {
            extra_parts[next_find_i] += char;
          } else {
            extra_parts[next_find_i] = char;
          }
        } else {
          next_find_i++;
          next_find = s2[next_find_i];
        }
      }
      if (extra_parts[next_find_i]) {
        extra_parts[next_find_i] = "";
      }
      extra_parts = (function() {
        var results;
        results = [];
        for (key in extra_parts) {
          val = extra_parts[key];
          results.push(val);
        }
        return results;
      })();
      if (next_find_i >= s2.length) {
        return extra_parts.length + extra_parts.join("").length;
      } else {
        return false;
      }
    };

    Text.prototype.queryParse = function(query) {
      var j, key, len, params, part, parts, ref, val;
      params = {};
      parts = query.split('&');
      for (j = 0, len = parts.length; j < len; j++) {
        part = parts[j];
        ref = part.split("="), key = ref[0], val = ref[1];
        if (val) {
          params[decodeURIComponent(key)] = decodeURIComponent(val);
        } else {
          params["url"] = decodeURIComponent(key);
          params["urls"] = params["url"].split("/");
        }
      }
      return params;
    };

    Text.prototype.queryEncode = function(params) {
      var back, key, val;
      back = [];
      if (params.url) {
        back.push(params.url);
      }
      for (key in params) {
        val = params[key];
        if (!val || key === "url") {
          continue;
        }
        back.push((encodeURIComponent(key)) + "=" + (encodeURIComponent(val)));
      }
      return back.join("&");
    };

    Text.prototype.highlight = function(text, search) {
      var back, i, j, len, part, parts;
      parts = text.split(RegExp(search, "i"));
      back = [];
      for (i = j = 0, len = parts.length; j < len; i = ++j) {
        part = parts[i];
        back.push(part);
        if (i < parts.length - 1) {
          back.push(h("span.highlight", {
            key: i
          }, search));
        }
      }
      return back;
    };

    Text.prototype.sqlIn = function(values) {
      var value;
      return "(" + ((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = values.length; j < len; j++) {
          value = values[j];
          results.push("'" + value + "'");
        }
        return results;
      })()).join(',') + ")";
    };

    Text.prototype.formatSize = function(size) {
      var size_mb;
      size_mb = size / 1024 / 1024;
      if (size_mb >= 1000) {
        return (size_mb / 1024).toFixed(1) + " GB";
      } else if (size_mb >= 100) {
        return size_mb.toFixed(0) + " MB";
      } else if (size / 1024 >= 1000) {
        return size_mb.toFixed(2) + " MB";
      } else {
        return (size / 1024).toFixed(2) + " KB";
      }
    };

    return Text;

  })();

  window.is_proxy = document.location.host === "zero" || window.location.pathname === "/";

  window.marked_renderer = new MarkedRenderer();

  window.Text = new Text();

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/Time.coffee ---- */


(function() {
  var Time;

  Time = (function() {
    function Time() {}

    Time.prototype.since = function(timestamp) {
      var back, now, secs;
      now = +(new Date) / 1000;
      if (timestamp > 1000000000000) {
        timestamp = timestamp / 1000;
      }
      secs = now - timestamp;
      if (secs < 60) {
        back = "Just now";
      } else if (secs < 60 * 60) {
        back = (Math.round(secs / 60)) + " minutes ago";
      } else if (secs < 60 * 60 * 24) {
        back = (Math.round(secs / 60 / 60)) + " hours ago";
      } else if (secs < 60 * 60 * 24 * 3) {
        back = (Math.round(secs / 60 / 60 / 24)) + " days ago";
      } else {
        back = "on " + this.date(timestamp);
      }
      back = back.replace(/^1 ([a-z]+)s/, "1 $1");
      return back;
    };

    Time.prototype.date = function(timestamp, format) {
      var display, parts;
      if (format == null) {
        format = "short";
      }
      if (timestamp > 1000000000000) {
        timestamp = timestamp / 1000;
      }
      parts = (new Date(timestamp * 1000)).toString().split(" ");
      if (format === "short") {
        display = parts.slice(1, 4);
      } else {
        display = parts.slice(1, 5);
      }
      return display.join(" ").replace(/( [0-9]{4})/, ",$1");
    };

    Time.prototype.timestamp = function(date) {
      if (date == null) {
        date = "";
      }
      if (date === "now" || date === "") {
        return parseInt(+(new Date) / 1000);
      } else {
        return parseInt(Date.parse(date) / 1000);
      }
    };

    return Time;

  })();

  window.Time = new Time;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/Translate.coffee ---- */


(function() {
  window._ = function(s) {
    return s;
  };

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/Uploadable.coffee ---- */


(function() {
  var Uploadable,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Uploadable = (function(superClass) {
    extend(Uploadable, superClass);

    function Uploadable(handleSave) {
      this.handleSave = handleSave;
      this.getPixelData = bind(this.getPixelData, this);
      this.render = bind(this.render, this);
      this.handleUploadClick = bind(this.handleUploadClick, this);
      this.resizeImage = bind(this.resizeImage, this);
      this.storeNode = bind(this.storeNode, this);
      this.node = null;
      this.resize_width = 50;
      this.resize_height = 50;
      this.preverse_ratio = true;
      this.try_png = false;
      this.png_limit = 2200;
      this.image_preview = new ImagePreview();
      this.pixel_chars = this.image_preview.pixel_chars;
      this;
    }

    Uploadable.prototype.storeNode = function(node) {
      return this.node = node;
    };

    Uploadable.prototype.scaleHalf = function(image) {
      var canvas, ctx;
      canvas = document.createElement("canvas");
      canvas.width = image.width / 2;
      canvas.height = image.height / 2;
      ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas;
    };

    Uploadable.prototype.resizeImage = function(file, width, height, cb) {
      var image;
      image = new Image();
      image.onload = (function(_this) {
        return function() {
          var canvas, canvas_quant, ctx, image_base64uri, optimizer, quant, ref;
          _this.log("Resize image loaded");
          canvas = document.createElement("canvas");
          if (_this.preverse_ratio) {
            ref = _this.image_preview.calcSize(image.width, image.height, width, height), canvas.width = ref[0], canvas.height = ref[1];
          } else {
            canvas.width = width;
            canvas.height = height;
          }
          ctx = canvas.getContext("2d");
          ctx.fillStyle = "#FFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          while (image.width > width * 2) {
            image = _this.scaleHalf(image);
          }
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          if (_this.try_png) {
            quant = new RgbQuant({
              colors: 128,
              method: 1
            });
            quant.sample(canvas);
            quant.palette(true);
            canvas_quant = drawPixels(quant.reduce(canvas), width);
            optimizer = new CanvasTool.PngEncoder(canvas_quant, {
              bitDepth: 8,
              colourType: CanvasTool.PngEncoder.ColourType.TRUECOLOR
            });
            image_base64uri = "data:image/png;base64," + btoa(optimizer.convert());
            if (image_base64uri.length > _this.png_limit) {
              _this.log("PNG too large (" + image_base64uri.length + " bytes), convert to jpg instead");
              image_base64uri = canvas.toDataURL("image/jpeg", 0.8);
            }
          } else {
            image_base64uri = canvas.toDataURL("image/jpeg", 0.8);
          }
          _this.log("Size: " + image_base64uri.length + " bytes");
          return cb(image_base64uri, canvas.width, canvas.height);
        };
      })(this);
      image.onerror = (function(_this) {
        return function(e) {
          _this.log("Image upload error", e);
          Page.cmd("wrapperNotification", ["error", "Invalid image, only jpg format supported"]);
          return cb(null);
        };
      })(this);
      if (file.name) {
        return image.src = URL.createObjectURL(file);
      } else {
        return image.src = file;
      }
    };

    Uploadable.prototype.handleUploadClick = function(e) {
      var input, script;
      this.log("handleUploadClick", e);
      script = document.createElement("script");
      script.src = "js-external/pngencoder.js";
      document.head.appendChild(script);
      input = document.createElement('input');
      document.body.appendChild(input);
      input.type = "file";
      input.style.visibility = "hidden";
      input.onchange = (function(_this) {
        return function(e) {
          _this.log("Uploaded");
          return _this.resizeImage(input.files[0], _this.resize_width, _this.resize_height, function(image_base64uri, width, height) {
            _this.log("Resized", width, height);
            if (image_base64uri) {
              _this.handleSave(image_base64uri, width, height);
            }
            return input.remove();
          });
        };
      })(this);
      input.click();
      return false;
    };

    Uploadable.prototype.render = function(body) {
      return h("div.uploadable", h("a.icon.icon-upload", {
        href: "#Upload",
        onclick: this.handleUploadClick
      }), body());
    };

    Uploadable.prototype.getPixelData = function(data) {
      var b, color_db, colors, colors_next_id, g, hex, i, j, pixels, r, ref;
      color_db = {};
      colors = [];
      colors_next_id = 0;
      pixels = [];
      for (i = j = 0, ref = data.length - 1; j <= ref; i = j += 4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        r = Math.round(r / 17);
        g = Math.round(g / 17);
        b = Math.round(b / 17);
        hex = Number(0x1000 + r * 0x100 + g * 0x10 + b).toString(16).substring(1);
        if (i === 0) {
          this.log(r, g, b, data[i + 3], hex);
        }
        if (!color_db[hex]) {
          color_db[hex] = this.pixel_chars[colors_next_id];
          colors.push(hex);
          colors_next_id += 1;
        }
        pixels.push(color_db[hex]);
      }
      return [colors, pixels];
    };

    Uploadable.prototype.getPreviewData = function(image_base64uri, target_width, target_height, cb) {
      var image;
      image = new Image();
      image.src = image_base64uri;
      return image.onload = (function(_this) {
        return function() {
          var back, canvas, ctx, image_data, image_height, image_width, pixeldata, quant, ref;
          image_width = image.width;
          image_height = image.height;
          canvas = document.createElement("canvas");
          ref = _this.image_preview.calcSize(image.width, image.height, target_width, target_height), canvas.width = ref[0], canvas.height = ref[1];
          ctx = canvas.getContext("2d");
          ctx.fillStyle = "#FFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          while (image.width > target_width * 2) {
            image = _this.scaleHalf(image);
          }
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          quant = new RgbQuant({
            colors: 16,
            method: 1
          });
          quant.sample(canvas);
          quant.palette(true);
          canvas = drawPixels(quant.reduce(canvas), canvas.width);
          ctx = canvas.getContext("2d");
          image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          pixeldata = _this.getPixelData(image_data.data);
          back = [image_width, image_height, pixeldata[0].join(""), pixeldata[1].join("")].join(",");
          _this.log("Previewdata size:", back.length);
          return cb(back);
        };
      })(this);
    };

    return Uploadable;

  })(Class);

  window.Uploadable = Uploadable;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/utils/ZeroFrame.coffee ---- */


(function() {
  var ZeroFrame,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ZeroFrame = (function(superClass) {
    extend(ZeroFrame, superClass);

    function ZeroFrame(url) {
      this.onCloseWebsocket = bind(this.onCloseWebsocket, this);
      this.onOpenWebsocket = bind(this.onOpenWebsocket, this);
      this.onRequest = bind(this.onRequest, this);
      this.onMessage = bind(this.onMessage, this);
      this.url = url;
      this.waiting_cb = {};
      this.history_state = {};
      this.wrapper_nonce = document.location.href.replace(/.*wrapper_nonce=([A-Za-z0-9]+).*/, "$1");
      this.connect();
      this.next_message_id = 1;
      this.init();
    }

    ZeroFrame.prototype.init = function() {
      return this;
    };

    ZeroFrame.prototype.connect = function() {
      this.target = window.parent;
      window.addEventListener("message", this.onMessage, false);
      this.cmd("innerReady");
      window.addEventListener("beforeunload", (function(_this) {
        return function(e) {
          _this.log("Save scrollTop", window.pageYOffset);
          _this.history_state["scrollTop"] = window.pageYOffset;
          return _this.cmd("wrapperReplaceState", [_this.history_state, null]);
        };
      })(this));
      return this.cmd("wrapperGetState", [], (function(_this) {
        return function(state) {
          return _this.handleState(state);
        };
      })(this));
    };

    ZeroFrame.prototype.handleState = function(state) {
      if (state != null) {
        this.history_state = state;
      }
      this.log("Restore scrollTop", state, window.pageYOffset);
      if (window.pageYOffset === 0 && state) {
        return window.scroll(window.pageXOffset, state.scrollTop);
      }
    };

    ZeroFrame.prototype.onMessage = function(e) {
      var cmd, message;
      message = e.data;
      cmd = message.cmd;
      if (cmd === "response") {
        if (this.waiting_cb[message.to] != null) {
          return this.waiting_cb[message.to](message.result);
        } else {
          return this.log("Websocket callback not found:", message);
        }
      } else if (cmd === "wrapperReady") {
        return this.cmd("innerReady");
      } else if (cmd === "ping") {
        return this.response(message.id, "pong");
      } else if (cmd === "wrapperOpenedWebsocket") {
        return this.onOpenWebsocket();
      } else if (cmd === "wrapperClosedWebsocket") {
        return this.onCloseWebsocket();
      } else if (cmd === "wrapperPopState") {
        this.handleState(message.params.state);
        return this.onRequest(cmd, message.params);
      } else {
        return this.onRequest(cmd, message.params);
      }
    };

    ZeroFrame.prototype.onRequest = function(cmd, message) {
      return this.log("Unknown request", message);
    };

    ZeroFrame.prototype.response = function(to, result) {
      return this.send({
        "cmd": "response",
        "to": to,
        "result": result
      });
    };

    ZeroFrame.prototype.cmd = function(cmd, params, cb) {
      if (params == null) {
        params = {};
      }
      if (cb == null) {
        cb = null;
      }
      return this.send({
        "cmd": cmd,
        "params": params
      }, cb);
    };

    ZeroFrame.prototype.cmdp = function(cmd, params) {
      var p;
      if (params == null) {
        params = {};
      }
      p = new Promise();
      this.send({
        "cmd": cmd,
        "params": params
      }, function(res) {
        return p.resolve(res);
      });
      return p;
    };

    ZeroFrame.prototype.send = function(message, cb) {
      if (cb == null) {
        cb = null;
      }
      message.wrapper_nonce = this.wrapper_nonce;
      message.id = this.next_message_id;
      this.next_message_id += 1;
      this.target.postMessage(message, "*");
      if (cb) {
        return this.waiting_cb[message.id] = cb;
      }
    };

    ZeroFrame.prototype.onOpenWebsocket = function() {
      return this.log("Websocket open");
    };

    ZeroFrame.prototype.onCloseWebsocket = function() {
      return this.log("Websocket close");
    };

    return ZeroFrame;

  })(Class);

  window.ZeroFrame = ZeroFrame;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/ActivityList.coffee ---- */


(function() {
  var ActivityList,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ActivityList = (function(superClass) {
    extend(ActivityList, superClass);

    function ActivityList() {
      this.update = bind(this.update, this);
      this.render = bind(this.render, this);
      this.handleMoreClick = bind(this.handleMoreClick, this);
      this.activities = null;
      this.directories = [];
      this.need_update = true;
      this.limit = 10;
      this.found = 0;
      this.loading = true;
      this.update_timer = null;
    }

    ActivityList.prototype.queryActivities = function(cb) {
      var query, where;
      if (this.directories === "all") {
        where = "WHERE date_added > " + (Time.timestamp() - 60 * 60 * 24 * 2) + " AND date_added < " + (Time.timestamp() + 120) + " ";
      } else {
        where = "WHERE json.directory IN " + (Text.sqlIn(this.directories)) + " AND date_added < " + (Time.timestamp() + 120) + " ";
      }
      query = "SELECT\n 'comment' AS type, json.*,\n json.site || \"/\" || post_uri AS subject, body, date_added,\n NULL AS subject_auth_address, NULL AS subject_hub, NULL AS subject_user_name\nFROM\n json\nLEFT JOIN comment USING (json_id)\n " + where + "\n\nUNION ALL\n\nSELECT\n 'post_like' AS type, json.*,\n json.site || \"/\" || post_uri AS subject, '' AS body, date_added,\n NULL AS subject_auth_address, NULL AS subject_hub, NULL AS subject_user_name\nFROM\n json\nLEFT JOIN post_like USING (json_id)\n " + where;
      if (this.directories !== "all") {
        query += "UNION ALL\n\nSELECT\n 'follow' AS type, json.*,\n follow.hub || \"/\" || follow.auth_address AS subject, '' AS body, date_added,\n follow.auth_address AS subject_auth_address, follow.hub AS subject_hub, follow.user_name AS subject_user_name\nFROM\n json\nLEFT JOIN follow USING (json_id)\n " + where;
      }
      query += "\nORDER BY date_added DESC\nLIMIT " + (this.limit + 1);
      this.logStart("Update");
      return Page.cmd("dbQuery", [
        query, {
          directories: this.directories
        }
      ], (function(_this) {
        return function(rows) {
          var directories, directory, i, len, row, subject_address;
          directories = [];
          rows = (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = rows.length; i < len; i++) {
              row = rows[i];
              if (row.subject) {
                results.push(row);
              }
            }
            return results;
          })();
          for (i = 0, len = rows.length; i < len; i++) {
            row = rows[i];
            row.auth_address = row.directory.replace("data/users/", "");
            subject_address = row.subject.replace(/_.*/, "").replace(/.*\//, "");
            row.post_id = row.subject.replace(/.*_/, "").replace(/.*\//, "");
            row.subject_address = subject_address;
            directory = "data/users/" + subject_address;
            if (indexOf.call(directories, directory) < 0) {
              directories.push(directory);
            }
          }
          return Page.cmd("dbQuery", [
            "SELECT * FROM json WHERE ?", {
              directory: directories
            }
          ], function(subject_rows) {
            var base, base1, base2, j, k, l, last_row, len1, len2, len3, ref, ref1, ref2, ref3, ref4, row_group, row_groups, subject_db, subject_row;
            subject_db = {};
            for (j = 0, len1 = subject_rows.length; j < len1; j++) {
              subject_row = subject_rows[j];
              subject_row.auth_address = subject_row.directory.replace("data/users/", "");
              subject_db[subject_row.auth_address] = subject_row;
            }
            for (k = 0, len2 = rows.length; k < len2; k++) {
              row = rows[k];
              row.subject = subject_db[row.subject_address];
                            if ((ref = row.subject) != null) {
                ref;
              } else {
                row.subject = {};
              };
                            if ((ref1 = (base = row.subject).auth_address) != null) {
                ref1;
              } else {
                base.auth_address = row.subject_auth_address;
              };
                            if ((ref2 = (base1 = row.subject).hub) != null) {
                ref2;
              } else {
                base1.hub = row.subject_hub;
              };
                            if ((ref3 = (base2 = row.subject).user_name) != null) {
                ref3;
              } else {
                base2.user_name = row.subject_user_name;
              };
            }
            last_row = null;
            row_group = [];
            row_groups = [];
            for (l = 0, len3 = rows.length; l < len3; l++) {
              row = rows[l];
              if (!last_row || (row.auth_address === (last_row != null ? last_row.auth_address : void 0) && row.type === (last_row != null ? last_row.type : void 0) && ((ref4 = row.type) === "post_like" || ref4 === "follow"))) {
                row_group.push(row);
              } else {
                row_groups.push(row_group);
                row_group = [row];
              }
              last_row = row;
            }
            if (row_group.length) {
              row_groups.push(row_group);
            }
            _this.found = rows.length;
            _this.logEnd("Update");
            return cb(row_groups);
          });
        };
      })(this));
    };

    ActivityList.prototype.handleMoreClick = function() {
      this.limit += 20;
      this.update(0);
      return false;
    };

    ActivityList.prototype.renderActivity = function(activity_group) {
      var activity, activity_more, activity_user_link, back, body, i, j, len, len1, now, ref, ref1, subject_post_link, subject_user_link, title;
      back = [];
      now = Time.timestamp();
      activity = activity_group[0];
      if (!activity.subject.user_name) {
        return back;
      }
      activity_user_link = "?Profile/" + activity.hub + "/" + activity.auth_address + "/" + activity.cert_user_id;
      subject_user_link = "?Profile/" + activity.subject.hub + "/" + activity.subject.auth_address + "/" + (activity.subject.cert_user_id || '');
      subject_post_link = "?Post/" + activity.subject.hub + "/" + activity.subject.auth_address + "/" + activity.post_id;
      if (activity.type === "post_like") {
        body = [
          h("a.link", {
            href: activity_user_link,
            onclick: this.Page.handleLinkClick
          }, activity.user_name), " liked ", h("a.link", {
            href: subject_user_link,
            onclick: this.Page.handleLinkClick
          }, activity.subject.user_name), "'s ", h("a.link", {
            href: subject_post_link,
            onclick: this.Page.handleLinkClick
          }, _("post", "like post"))
        ];
        if (activity_group.length > 1) {
          ref = activity_group.slice(1, 11);
          for (i = 0, len = ref.length; i < len; i++) {
            activity_more = ref[i];
            subject_user_link = "?Profile/" + activity_more.subject.hub + "/" + activity_more.subject.auth_address + "/" + (activity_more.subject.cert_user_id || '');
            subject_post_link = "?Post/" + activity_more.subject.hub + "/" + activity_more.subject.auth_address + "/" + activity_more.post_id;
            body.push(", ");
            body.push(h("a.link", {
              href: subject_user_link,
              onclick: this.Page.handleLinkClick
            }, activity_more.subject.user_name));
            body.push("'s ");
            body.push(h("a.link", {
              href: subject_post_link,
              onclick: this.Page.handleLinkClick
            }, _("post", "like post")));
          }
        }
      } else if (activity.type === "comment") {
        body = [
          h("a.link", {
            href: activity_user_link,
            onclick: this.Page.handleLinkClick
          }, activity.user_name), " commented on ", h("a.link", {
            href: subject_user_link,
            onclick: this.Page.handleLinkClick
          }, activity.subject.user_name), "'s ", h("a.link", {
            href: subject_post_link,
            onclick: this.Page.handleLinkClick
          }, _("post", "comment post")), ": " + activity.body
        ];
      } else if (activity.type === "follow") {
        body = [
          h("a.link", {
            href: activity_user_link,
            onclick: this.Page.handleLinkClick
          }, activity.user_name), " started following ", h("a.link", {
            href: subject_user_link,
            onclick: this.Page.handleLinkClick
          }, activity.subject.user_name)
        ];
        if (activity_group.length > 1) {
          ref1 = activity_group.slice(1, 11);
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            activity_more = ref1[j];
            subject_user_link = "?Profile/" + activity_more.subject.hub + "/" + activity_more.subject.auth_address + "/" + (activity_more.subject.cert_user_id || '');
            body.push(", ");
            body.push(h("a.link", {
              href: subject_user_link,
              onclick: this.Page.handleLinkClick
            }, activity_more.subject.user_name));
          }
        }
      } else {
        body = activity.body;
      }
      if (activity.body) {
        title = Time.since(activity.date_added) + " - " + (activity.body.length > 500 ? activity.body.slice(0, 501) + "..." : activity.body);
      } else {
        title = Time.since(activity.date_added);
      }
      back.push(h("div.activity", {
        key: activity.cert_user_id + "_" + activity.date_added + "_" + activity_group.length,
        title: title,
        classes: {
          latest: now - activity.date_added < 600
        },
        enterAnimation: Animation.slideDown,
        exitAnimation: Animation.slideUp
      }, [h("div.circle"), h("div.body", body)]));
      return back;
    };

    ActivityList.prototype.render = function() {
      if (this.need_update) {
        this.need_update = false;
        this.queryActivities((function(_this) {
          return function(res) {
            _this.activities = res;
            return Page.projector.scheduleRender();
          };
        })(this));
      }
      if (this.activities === null) {
        return null;
      }
      return h("div.activity-list", [
        this.activities.length > 0 ? h("h2", {
          enterAnimation: Animation.slideDown,
          exitAnimation: Animation.slideUp
        }, "Activity feed") : void 0, h("div.items", [h("div.bg-line"), this.activities.slice(0, +(this.limit - 1) + 1 || 9e9).map(this.renderActivity)]), this.found > this.limit ? h("a.more.small", {
          href: "#More",
          onclick: this.handleMoreClick,
          enterAnimation: Animation.slideDown,
          exitAnimation: Animation.slideUp
        }, "Show more...") : void 0
      ]);
    };

    ActivityList.prototype.update = function(delay) {
      if (delay == null) {
        delay = 600;
      }
      clearInterval(this.update_timer);
      if (!this.need_update) {
        return this.update_timer = setTimeout(((function(_this) {
          return function() {
            _this.need_update = true;
            return Page.projector.scheduleRender();
          };
        })(this)), delay);
      }
    };

    return ActivityList;

  })(Class);

  window.ActivityList = ActivityList;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/AnonUser.coffee ---- */


(function() {
  var AnonUser,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  AnonUser = (function(superClass) {
    extend(AnonUser, superClass);

    function AnonUser() {
      this.save = bind(this.save, this);
      this.updateInfo = bind(this.updateInfo, this);
      this.auth_address = null;
      this.hub = null;
      this.followed_users = {};
      this.likes = {};
    }

    AnonUser.prototype.updateInfo = function(cb) {
      if (cb == null) {
        cb = null;
      }
      return Page.on_local_storage.then((function(_this) {
        return function() {
          _this.followed_users = Page.local_storage.followed_users;
          return typeof cb === "function" ? cb(true) : void 0;
        };
      })(this));
    };

    AnonUser.prototype.like = function(site, post_uri, cb) {
      if (cb == null) {
        cb = null;
      }
      Page.cmd("wrapperNotification", ["info", "You need a profile for this feature"]);
      return cb(true);
    };

    AnonUser.prototype.dislike = function(site, post_uri, cb) {
      if (cb == null) {
        cb = null;
      }
      Page.cmd("wrapperNotification", ["info", "You need a profile for this feature"]);
      return cb(true);
    };

    AnonUser.prototype.followUser = function(hub, auth_address, user_name, cb) {
      if (cb == null) {
        cb = null;
      }
      this.followed_users[hub + "/" + auth_address] = true;
      this.save(cb);
      Page.needSite(hub);
      return Page.content.update();
    };

    AnonUser.prototype.unfollowUser = function(hub, auth_address, cb) {
      if (cb == null) {
        cb = null;
      }
      delete this.followed_users[hub + "/" + auth_address];
      this.save(cb);
      return Page.content.update();
    };

    AnonUser.prototype.comment = function(site, post_uri, body, cb) {
      if (cb == null) {
        cb = null;
      }
      Page.cmd("wrapperNotification", ["info", "You need a profile for this feature"]);
      return typeof cb === "function" ? cb(false) : void 0;
    };

    AnonUser.prototype.save = function(cb) {
      if (cb == null) {
        cb = null;
      }
      return Page.saveLocalStorage(cb);
    };

    return AnonUser;

  })(Class);

  window.AnonUser = AnonUser;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/ChangeBackground.coffee ---- */


(function() {
  window.bgString = function(color, image) {
    if (!color) {
      color = "#FFFFF";
    }
    if (image) {
      return "background: url('" + image + "') no-repeat fixed center;background-size: cover;background-color: " + color;
    } else {
      return "background-color: " + color;
    }
  };

  window.setBackground = function(color, image) {
    if (Page.getSetting("disable_background")) {
      return window.stripBackground();
    }
    console.log(("[Background] color=%c" + color + "%c") + (image ? ", image=" + image : ""), "color:" + color, "");
    return document.body.style = window.bgString(color, image);
  };

  window.defaultBackground = function() {
    return window.setBackground(window.defaultBackground.color, window.defaultBackground.image);
  };

  window.defaultBackground.color = "#D30C37";

  window.defaultBackground.image = "img/default-bg.jpg";

  window.stripBackground = function() {
    return document.body.style = "";
  };

  window.otherPageBackground = function() {
    if (Page.getSetting("hide_background_timeline" || Page.getSetting("disable_background"))) {
      return window.stripBackground();
    } else {
      if (Page.user && Page.user.applyBackground) {
        return Page.user.applyBackground();
      } else {
        return window.defaultBackground();
      }
    }
  };

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/ContentBadges.coffee ---- */


(function() {
  var ContentBadges,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ContentBadges = (function(superClass) {
    extend(ContentBadges, superClass);

    function ContentBadges() {
      this.update = bind(this.update, this);
      this.render = bind(this.render, this);
      this.renderCheck = bind(this.renderCheck, this);
      this.section = bind(this.section, this);
      this.loaded = true;
      this.need_update = false;
    }

    ContentBadges.prototype.fncs = {};

    ContentBadges.prototype.section = function(name, ar) {
      var e;
      if (ar.filter(((function(_this) {
        return function(e) {
          return !e.properties.classes.invisible;
        };
      })(this))).length) {
        return h("div.setting" + name, [
          h("h2.sep", name), (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = ar.length; i < len; i++) {
              e = ar[i];
              results.push(e);
            }
            return results;
          })(), h("br", name)
        ]);
      }
    };

    ContentBadges.prototype.renderCheck = function(key, name, desc, attrs) {
      var base, ref;
      if (desc == null) {
        desc = "";
      }
      if (attrs == null) {
        attrs = {};
      }
            if ((ref = (base = this.fncs)[key]) != null) {
        ref;
      } else {
        base[key] = (function(_this) {
          return function(item) {
            if (attrs.disabled_by && Page.local_storage.settings[attrs.disabled_by]) {
              return false;
            }
            Page.local_storage.settings[key] = !Page.local_storage.settings[key];
            if (attrs.postRun) {
              attrs.postRun(Page.local_storage.settings[key]);
            }
            document.body.className = "loaded" + Page.otherClasses();
            Page.projector.scheduleRender();
            Page.saveLocalStorage();
            Page.content.need_update = true;
            return false;
          };
        })(this);
      };
      return h("div.checkbox.setting", {
        classes: {
          invisible: (!this.search || (name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1) ? false : true),
          checked: Page.local_storage.settings[key],
          disabled: attrs.disabled_by && Page.local_storage.settings[attrs.disabled_by]
        },
        onclick: this.fncs[key]
      }, h("div.checkbox-skin"), h("div.title", name), h("br", key));
    };

    ContentBadges.prototype.render = function() {
      window.otherPageBackground();
      if (this.loaded && !Page.on_loaded.resolved) {
        Page.on_loaded.resolve();
      }
      if (this.need_update) {
        this.log("Updating");
        this.need_update = false;
        Page.changeTitle("Badges");
      }
      return h("div#Content.center", [
        Page.local_storage_loaded ? h("div.post.settings", {
          style: "border-radius: 16px"
        }, [
          h("br", "top"), h("div", {
            style: "display:flex;"
          }, [
            h("h1", {
              style: "margin:6px;"
            }, "Badges")
          ]), h("h2", "Show to other users in your profile what you're doing for make Peeper better!"), h("h4", "What are Open Badges?"), h("span", "'Get recognition for learning that happens anywhere. Then share it on the places that matter. A digital badge is an online representation of a skill you've earned'. Know more in "), h("a", {
            href: "https://openbadges.org/"
          }, "the Open Badges site"), h("span", "."), h("br"), h("img", {
            src: "img/issuer-insignia-banner1.png",
            align: "middle"
          }), h("h4", "How to earn my badges in Peeper?"), h("span", "Complete a specific task/achievement. For reference, see the "), h("a", {
            href: "http://127.0.0.1:43110/peeper.bit/badges/list.html"
          }, "badge list"), h("span", ". Send to Peeper the proof of achievement and your email to receive the badge."), h("h4", "Questions?"), h("span", "Mention us in Peeper, by using "), h("code", "@Peeper:"), h("span", " in a post/comment."), h("h4", "News?"), h("a", {
            href: "http://127.0.0.1:43110/peeper.bit/?Profile/1oranGeS2xsKZ4jVsu9SVttzgkYXu4k9v/1EbCmWB1LcB6NdJhRBhu6krKCs3gZhePzp/peeper@zeroid.bit"
          }, "Follow Peeper"), h("span", "."), h("br", "bottom")
        ]) : (h("h1", "Loading Settings..."), this.need_update = true)
      ]);
    };

    ContentBadges.prototype.update = function() {
      this.need_update = true;
      return Page.projector.scheduleRender();
    };

    return ContentBadges;

  })(Class);

  window.ContentBadges = ContentBadges;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/ContentCreateProfile.coffee ---- */


(function() {
  var ContentCreateProfile,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ContentCreateProfile = (function(superClass) {
    extend(ContentCreateProfile, superClass);

    function ContentCreateProfile() {
      this.update = bind(this.update, this);
      this.render = bind(this.render, this);
      this.renderDefaultHubs = bind(this.renderDefaultHubs, this);
      this.renderSeededHubs = bind(this.renderSeededHubs, this);
      this.renderHub = bind(this.renderHub, this);
      this.updateHubs = bind(this.updateHubs, this);
      this.handleJoinClick = bind(this.handleJoinClick, this);
      this.handleDownloadClick = bind(this.handleDownloadClick, this);
      this.loaded = true;
      this.hubs = [];
      this.default_hubs = [];
      this.need_update = true;
      this.creation_status = [];
      this.downloading = {};
    }

    ContentCreateProfile.prototype.handleDownloadClick = function(e) {
      var hub;
      hub = e.target.attributes.address.value;
      this.downloading[hub] = true;
      Page.needSite(hub, (function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
      return false;
    };

    ContentCreateProfile.prototype.handleJoinClick = function(e) {
      var hub, user;
      hub = e.target.attributes.address.value;
      user = new User({
        hub: hub,
        auth_address: Page.site_info.auth_address
      });
      this.creation_status.push("Checking user on selected hub...");
      Page.cmd("fileGet", {
        "inner_path": user.getPath() + "/content.json",
        "required": false
      }, (function(_this) {
        return function(found) {
          var data, user_name;
          if (found) {
            Page.cmd("wrapperNotification", ["error", "User " + Page.site_info.cert_user_id + " already exists on this hub"]);
            _this.creation_status = [];
            return;
          }
          user_name = Page.site_info.cert_user_id.replace(/@.*/, "");
          data = user.getDefaultData();
          data.avatar = "generate";
          data.user_name = user_name.charAt(0).toUpperCase() + user_name.slice(1);
          data.hub = hub;
          _this.creation_status.push("Creating new profile...");
          return user.save(data, hub, function() {
            _this.creation_status = [];
            Page.checkUser();
            return Page.setUrl("?Home");
          });
        };
      })(this));
      return false;
    };

    ContentCreateProfile.prototype.updateHubs = function() {
      return Page.cmd("mergerSiteList", true, (function(_this) {
        return function(sites) {
          var address, content, ref, results;
          Page.cmd("dbQuery", "SELECT * FROM json", function(users) {
            var address, hubs, i, len, name, ref, site, site_users, user;
            site_users = {};
            for (i = 0, len = users.length; i < len; i++) {
              user = users[i];
                            if ((ref = site_users[name = user.hub]) != null) {
                ref;
              } else {
                site_users[name] = [];
              };
              site_users[user.hub].push(user);
            }
            hubs = [];
            for (address in sites) {
              site = sites[address];
              if (address === Page.userdb) {
                continue;
              }
              site["users"] = site_users[site.address] || [];
              hubs.push(site);
            }
            _this.hubs = hubs;
            return Page.projector.scheduleRender();
          });
          _this.default_hubs = [];
          ref = Page.site_info.content.settings.default_hubs;
          results = [];
          for (address in ref) {
            content = ref[address];
            if (!sites[address] && !_this.downloading[address]) {
              results.push(_this.default_hubs.push({
                users: [],
                address: address,
                content: content,
                type: "available"
              }));
            } else {
              results.push(void 0);
            }
          }
          return results;
        };
      })(this));
    };

    ContentCreateProfile.prototype.renderHub = function(hub) {
      var rendered;
      rendered = 0;
      return h("div.hub.card", {
        key: hub.address + hub.type,
        enterAnimation: Animation.slideDown,
        exitAnimation: Animation.slideUp
      }, [
        hub.type === "available" ? h("a.button.button-join", {
          href: "#Download:" + hub.address,
          address: hub.address,
          onclick: this.handleDownloadClick
        }, "Download") : h("a.button.button-join", {
          href: "#Join:" + hub.address,
          address: hub.address,
          onclick: this.handleJoinClick
        }, "Join!"), h("div.avatars", [
          hub.users.map((function(_this) {
            return function(user) {
              var avatar, ref;
              if (((ref = user.avatar) !== "jpg" && ref !== "png") || rendered >= 4) {
                return "";
              }
              avatar = "merged-ZeroMe/" + hub.address + "/" + user.directory + "/avatar." + user.avatar;
              rendered += 1;
              return h("a.avatar", {
                key: user.user_name,
                title: user.user_name,
                style: "background-image: url('" + avatar + "')"
              });
            };
          })(this)), hub.users.length - rendered > 0 ? h("a.avatar.empty", "+" + (hub.users.length - rendered)) : void 0
        ]), h("div.name", hub.content.title), h("div.intro", hub.content.description)
      ]);
    };

    ContentCreateProfile.prototype.renderSeededHubs = function() {
      return h("div.hubs.hubs-seeded", this.hubs.map(this.renderHub));
    };

    ContentCreateProfile.prototype.renderDefaultHubs = function() {
      return h("div.hubs.hubs-default", this.default_hubs.map(this.renderHub));
    };

    ContentCreateProfile.prototype.handleSelectUserClick = function() {
      Page.cmd("certSelect", {
        "accepted_domains": ["zeroid.bit"],
        "accept_any": true
      });
      return false;
    };

    ContentCreateProfile.prototype.render = function() {
      var ref;
      if (this.loaded && !Page.on_loaded.resolved) {
        Page.on_loaded.resolve();
      }
      if (this.need_update) {
        this.updateHubs();
        this.need_update = false;
        Page.changeTitle("Create Profile");
      }
      return h("div#Content.center.content-signup", [
        h("h1", "Create new profile"), h("a.button.button-submit.button-certselect.certselect", {
          href: "#Select+user",
          onclick: this.handleSelectUserClick
        }, [h("div.icon.icon-profile"), ((ref = Page.site_info) != null ? ref.cert_user_id : void 0) ? "As: " + Page.site_info.cert_user_id : "Select ID..."]), this.creation_status.length > 0 ? h("div.creation-status", {
          enterAnimation: Animation.slideDown,
          exitAnimation: Animation.slideUp
        }, [
          this.creation_status.map((function(_this) {
            return function(creation_status) {
              return h("h3", {
                key: creation_status,
                enterAnimation: Animation.slideDown,
                exitAnimation: Animation.slideUp
              }, creation_status);
            };
          })(this))
        ]) : Page.site_info.cert_user_id ? h("div.hubs", {
          enterAnimation: Animation.slideDown,
          exitAnimation: Animation.slideUp
        }, [
          this.hubs.length ? h("div.hubselect.seeded", {
            enterAnimation: Animation.slideDown,
            exitAnimation: Animation.slideUp
          }, [h("h2", "Seeded HUBs"), this.renderSeededHubs()]) : void 0, this.default_hubs.length ? h("div.hubselect.default", {
            enterAnimation: Animation.slideDown,
            exitAnimation: Animation.slideUp
          }, [h("h2", "Available HUBs"), this.renderDefaultHubs()]) : void 0, h("h5", "(With this you choose where is your profile stored. There is no difference on content and you will able to reach all users from any hub)")
        ]) : void 0
      ]);
    };

    ContentCreateProfile.prototype.update = function() {
      this.need_update = true;
      return Page.projector.scheduleRender();
    };

    return ContentCreateProfile;

  })(Class);

  window.ContentCreateProfile = ContentCreateProfile;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/ContentDonate.coffee ---- */


(function() {
  var ContentDonate,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ContentDonate = (function(superClass) {
    extend(ContentDonate, superClass);

    function ContentDonate() {
      this.update = bind(this.update, this);
      this.render = bind(this.render, this);
      this.renderCheck = bind(this.renderCheck, this);
      this.section = bind(this.section, this);
      this.loaded = true;
      this.need_update = false;
    }

    ContentDonate.prototype.fncs = {};

    ContentDonate.prototype.section = function(name, ar) {
      var e;
      if (ar.filter(((function(_this) {
        return function(e) {
          return !e.properties.classes.invisible;
        };
      })(this))).length) {
        return h("div.setting" + name, [
          h("h2.sep", name), (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = ar.length; i < len; i++) {
              e = ar[i];
              results.push(e);
            }
            return results;
          })(), h("br", name)
        ]);
      }
    };

    ContentDonate.prototype.renderCheck = function(key, name, desc, attrs) {
      var base, ref;
      if (desc == null) {
        desc = "";
      }
      if (attrs == null) {
        attrs = {};
      }
            if ((ref = (base = this.fncs)[key]) != null) {
        ref;
      } else {
        base[key] = (function(_this) {
          return function(item) {
            if (attrs.disabled_by && Page.local_storage.settings[attrs.disabled_by]) {
              return false;
            }
            Page.local_storage.settings[key] = !Page.local_storage.settings[key];
            if (attrs.postRun) {
              attrs.postRun(Page.local_storage.settings[key]);
            }
            document.body.className = "loaded" + Page.otherClasses();
            Page.projector.scheduleRender();
            Page.saveLocalStorage();
            Page.content.need_update = true;
            return false;
          };
        })(this);
      };
      return h("div.checkbox.setting", {
        classes: {
          invisible: (!this.search || (name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1) ? false : true),
          checked: Page.local_storage.settings[key],
          disabled: attrs.disabled_by && Page.local_storage.settings[attrs.disabled_by]
        },
        onclick: this.fncs[key]
      }, h("div.checkbox-skin"), h("div.title", name), h("br", key));
    };

    ContentDonate.prototype.render = function() {
      window.otherPageBackground();
      if (this.loaded && !Page.on_loaded.resolved) {
        Page.on_loaded.resolve();
      }
      if (this.need_update) {
        this.log("Updating");
        this.need_update = false;
        Page.changeTitle("Donate");
      }
      return h("div#Content.center", [
        Page.local_storage_loaded ? h("div.post.settings", {
          style: "border-radius: 16px"
        }, [
          h("br", "top"), h("div", {
            style: "display:flex;"
          }, [
            h("h1", {
              style: "margin:6px;"
            }, "Donate")
          ]), h("h2", "Help Peeper grow like Twitter and other surfacenet social networks"), h("h4", "Donate any amount in Bitcoin to the following address:"), h("img", {
            src: "img/bitcoin_1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu.png",
            width: "400px"
          }), h("br"), h("a", {
            href: "bitcoin:1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu"
          }, "1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu"), h("small", " (This is the same address of Peeper in ZeroNet)"), h("br"), h("span", " Any amount you donate, I and possibly the community will be very grateful."), h("i.fa.fa-heart.icon-heart"), h("h4", "For where your BTC is going?"), h("span", "All donations/transactions are registered "), h("a", {
            href: "https://blockchain.info/address/1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu"
          }, "here"), h("span", " and every transaction with amount that I'll withdraw, will be linked in the issue that is offering the bounty. You can see the issues, the bounty offered and the developer(s). You can see more at our "), h("a", {
            href: "https://github.com/ZeroNetPlus/Peeper/issues"
          }, "GitHub issues"), h("span", "."), h("h4", "Questions?"), h("span", "Mention us in Peeper, by using "), h("code", "@Peeper:"), h("span", " in a post/comment."), h("h4", "News?"), h("a", {
            href: "http://127.0.0.1:43110/peeper.bit/?Profile/1oranGeS2xsKZ4jVsu9SVttzgkYXu4k9v/1EbCmWB1LcB6NdJhRBhu6krKCs3gZhePzp/peeper@zeroid.bit"
          }, "Follow Peeper"), h("span", "."), h("br"), h("img", {
            src: "img/issuer-insignia-ribbon2.png",
            align: "middle"
          }), h("br", "bottom")
        ]) : (h("h1", "Loading Settings..."), this.need_update = true)
      ]);
    };

    ContentDonate.prototype.update = function() {
      this.need_update = true;
      return Page.projector.scheduleRender();
    };

    return ContentDonate;

  })(Class);

  window.ContentDonate = ContentDonate;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/ContentFeed.coffee ---- */


(function() {
  var ContentFeed,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ContentFeed = (function(superClass) {
    extend(ContentFeed, superClass);

    function ContentFeed() {
      this.update = bind(this.update, this);
      this.render = bind(this.render, this);
      this.handleListTypeClick = bind(this.handleListTypeClick, this);
      this.post_create = new PostCreate();
      this.post_list = new PostList();
      this.activity_list = new ActivityList();
      this.new_user_list = new UserList("new");
      this.suggested_user_list = new UserList("suggested");
      this.need_update = true;
      this.type = "followed";
      this.update();
    }

    ContentFeed.prototype.handleListTypeClick = function(e) {
      this.type = e.currentTarget.attributes.type.value;
      this.post_list.limit = 10;
      this.activity_list.limit = 10;
      this.update();
      return false;
    };

    ContentFeed.prototype.render = function() {
      var _, followed, key, like;
      if (this.post_list.loaded && !Page.on_loaded.resolved) {
        Page.on_loaded.resolve();
      }
      if (this.need_update) {
        this.log("Updating", this.type);
        Page.changeTitle("Home");
        window.otherPageBackground();
        this.need_update = false;
        this.new_user_list.need_update = true;
        this.suggested_user_list.need_update = true;
        if (this.type === "followed") {
          this.post_list.directories = (function() {
            var ref, results;
            ref = Page.user.followed_users;
            results = [];
            for (key in ref) {
              followed = ref[key];
              results.push("data/users/" + (key.split('/')[1]));
            }
            return results;
          })();
          if (Page.user.hub) {
            this.post_list.directories.push("data/users/" + Page.user.auth_address);
          }
          this.post_list.filter_post_ids = null;
        } else if (this.type === "liked") {
          this.post_list.directories = (function() {
            var ref, results;
            ref = Page.user.likes;
            results = [];
            for (like in ref) {
              _ = ref[like];
              results.push("data/users/" + (like.split('_')[0]));
            }
            return results;
          })();
          this.post_list.filter_post_ids = (function() {
            var ref, results;
            ref = Page.user.likes;
            results = [];
            for (like in ref) {
              _ = ref[like];
              results.push(like.split('_')[1]);
            }
            return results;
          })();
        } else {
          this.post_list.directories = "all";
          this.post_list.filter_post_ids = null;
        }
        this.post_list.need_update = true;
        if (this.type === "followed") {
          this.activity_list.directories = (function() {
            var ref, results;
            ref = Page.user.followed_users;
            results = [];
            for (key in ref) {
              followed = ref[key];
              results.push("data/users/" + (key.split('/')[1]));
            }
            return results;
          })();
        } else {
          this.activity_list.directories = "all";
        }
        this.activity_list.update();
      }
      return h("div#Content.center", [
        h("div.col-center", [
          this.post_create.render(), h("div.post-list-type", h("a.link", {
            href: "#Followed+users",
            onclick: this.handleListTypeClick,
            type: "followed",
            classes: {
              active: this.type === "followed"
            }
          }, h("i.fa.fa-user-plus"), " Followed users"), h("a.link", {
            href: "#Liked",
            onclick: this.handleListTypeClick,
            type: "liked",
            classes: {
              active: this.type === "liked"
            }
          }, h("i.fa.fa-heart"), " Liked"), h("a.link", {
            href: "#Everyone",
            onclick: this.handleListTypeClick,
            type: "everyone",
            classes: {
              active: this.type === "everyone"
            }
          }, h("i.fa.fa-globe"), " Everyone")), this.post_list.render()
        ]), h("div.col-right.noscrollfix", [
          h("div.light-bg", [
            this.activity_list.render(), this.new_user_list.users.length > 0 ? h("h2.sep.new", [
              "New users", h("a.link", {
                href: "?Users",
                onclick: Page.handleLinkClick
              }, "Browse all \u203A")
            ]) : void 0, this.new_user_list.render(".gray"), this.suggested_user_list.users.length > 0 ? h("h2.sep.suggested", ["Suggested users"]) : void 0, this.suggested_user_list.render(".gray")
          ])
        ])
      ]);
    };

    ContentFeed.prototype.update = function() {
      this.need_update = true;
      return Page.projector.scheduleRender();
    };

    return ContentFeed;

  })(Class);

  window.ContentFeed = ContentFeed;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/ContentProfile.coffee ---- */


(function() {
  var ContentProfile,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ContentProfile = (function(superClass) {
    extend(ContentProfile, superClass);

    function ContentProfile() {
      this.update = bind(this.update, this);
      this.render = bind(this.render, this);
      this.handleOptionalHelpClick = bind(this.handleOptionalHelpClick, this);
      this.settingsClick = bind(this.settingsClick, this);
      this.handleEditClick = bind(this.handleEditClick, this);
      this.handleBackgroundUpload = bind(this.handleBackgroundUpload, this);
      this.handleAvatarUpload = bind(this.handleAvatarUpload, this);
      this.handleUserNameSave = bind(this.handleUserNameSave, this);
      this.handleIntroSave = bind(this.handleIntroSave, this);
      this.handleBgColorSave = bind(this.handleBgColorSave, this);
      this.filter = bind(this.filter, this);
      this.findUser = bind(this.findUser, this);
      this.setUser = bind(this.setUser, this);
      this.renderNotSeeded = bind(this.renderNotSeeded, this);
      this.post_list = null;
      this.activity_list = null;
      this.user_list = null;
      this.auth_address = null;
      this.user = new User();
      this.activity_list = new ActivityList();
      this.owned = false;
      this.need_update = true;
      this.filter_post_id = null;
      this.loaded = false;
      this.help_distribute = false;
      this.editing = false;
    }

    ContentProfile.prototype.renderNotSeeded = function() {
      window.defaultBackground();
      return h("div#Content.center." + this.auth_address, [
        h("div.col-left", [
          h("div.users", [
            h("div.user.card.profile", [
              this.user.renderAvatar(), h("a.name.link", {
                href: this.user.getLink(),
                style: "color: " + (Text.toColor(this.user.row.auth_address)),
                onclick: Page.handleLinkClick
              }, this.user.row.user_name), h("div.cert_user_id", this.user.row.cert_user_id), h("div.intro-full", this.user.row.intro), h("div.follow-container", [
                h("a.button.button-follow-big", {
                  href: "#",
                  onclick: this.user.handleFollowClick,
                  classes: {
                    loading: this.user.submitting_follow
                  }
                }, h("span.icon-follow", "+"), !this.user.isFollowed() ? "Follow" : void 0)
              ])
            ])
          ])
        ]), h("div.col-center", {
          style: "padding-top: 30px; text-align: center"
        }, [
          h("h1", "Download profile site"), h("h2", "User's profile site not loaded to your client yet."), h("a.button.submit", {
            href: "#Add+site",
            onclick: this.user.handleDownloadClick
          }, "Download user's site")
        ])
      ]);
    };

    ContentProfile.prototype.setUser = function(hub, auth_address) {
      this.hub = hub;
      this.auth_address = auth_address;
      this.loaded = false;
      this.log("setUser", this.hub, this.auth_address);
      if (!this.post_list || this.post_list.directories[0] !== "data/users/" + this.auth_address) {
        this.post_list = new PostList();
        this.activity_list = new ActivityList();
        this.user_list = new UserList();
        this.user = new User();
        this.post_list.directories = ["data/users/" + this.auth_address];
        this.user_list.followed_by = this.user;
        this.user_list.limit = 50;
        this.need_update = true;
      }
      return this;
    };

    ContentProfile.prototype.findUser = function(user_name, cb) {
      var query;
      query = "SELECT\n json.cert_user_id,\n REPLACE(REPLACE(json.directory, 'data/userdb/', ''), 'data/users/', '') AS auth_address,\n CASE WHEN user.hub IS NOT NULL THEN user.hub ELSE json.site END AS hub,\n user.*\nFROM\n json\nLEFT JOIN user USING (json_id)\nWHERE user.user_name = :user_name OR json.user_name = :user_name\nORDER BY date_added DESC LIMIT 1";
      return Page.cmd("dbQuery", [
        query, {
          user_name: user_name
        }
      ], (function(_this) {
        return function(res) {
          var user;
          user = new User();
          user.setRow(res[0]);
          return cb(user);
        };
      })(this));
    };

    ContentProfile.prototype.filter = function(post_id) {
      this.log("Filter", post_id);
      this.filter_post_id = post_id;
      return this.need_update = true;
    };

    ContentProfile.prototype.handleBgColorSave = function(new_color, cb) {
      var color;
      color = new_color.match(/#([a-f0-9]{3}){1,2}\b/i);
      if (!color) {
        cb(false);
      }
      color = color[0];
      if (!color) {
        cb(false);
      }
      this.user.row.bgColor = color;
      return this.user.getData(this.user.hub, (function(_this) {
        return function(data) {
          data.bgColor = color;
          return _this.user.save(data, _this.user.hub, function(res) {
            cb(res);
            return _this.update();
          });
        };
      })(this));
    };

    ContentProfile.prototype.handleIntroSave = function(intro, cb) {
      this.user.row.intro = intro;
      return this.user.getData(this.user.hub, (function(_this) {
        return function(data) {
          data.intro = intro;
          return _this.user.save(data, _this.user.hub, function(res) {
            cb(res);
            return _this.update();
          });
        };
      })(this));
    };

    ContentProfile.prototype.handleUserNameSave = function(user_name, cb) {
      this.user.row.user_name = user_name;
      return this.user.getData(this.user.hub, (function(_this) {
        return function(data) {
          data.user_name = user_name;
          return _this.user.save(data, _this.user.hub, function(res) {
            cb(res);
            return _this.update();
          });
        };
      })(this));
    };

    ContentProfile.prototype.handleAvatarUpload = function(image_base64uri) {
      var ext, image_base64;
      Page.cmd("fileDelete", this.user.getPath() + "/avatar.jpg");
      Page.cmd("fileDelete", this.user.getPath() + "/avatar.png");
      if (!image_base64uri) {
        this.user.getData(this.user.hub, (function(_this) {
          return function(data) {
            data.avatar = "generate";
            return _this.user.save(data, _this.user.hub, function(res) {
              return Page.cmd("wrapperReload");
            });
          };
        })(this));
        return false;
      }
      image_base64 = image_base64uri != null ? image_base64uri.replace(/.*?,/, "") : void 0;
      ext = image_base64uri.match("image/([a-z]+)")[1];
      if (ext === "jpeg") {
        ext = "jpg";
      }
      return Page.cmd("fileWrite", [this.user.getPath() + "/avatar." + ext, image_base64], (function(_this) {
        return function(res) {
          return _this.user.getData(_this.user.hub, function(data) {
            data.avatar = ext;
            return _this.user.save(data, _this.user.hub, function(res) {
              return Page.cmd("wrapperReload");
            });
          });
        };
      })(this));
    };

    ContentProfile.prototype.handleBackgroundUpload = function(image_base64uri) {
      var ext, image_base64;
      Page.cmd("fileDelete", this.user.getPath() + "/bg.jpg");
      Page.cmd("fileDelete", this.user.getPath() + "/bg.png");
      if (!image_base64uri) {
        this.user.getData(this.user.hub, (function(_this) {
          return function(data) {
            delete data.bg;
            return _this.user.save(data, _this.user.hub, function(res) {
              return Page.cmd("wrapperReload");
            });
          };
        })(this));
        return false;
      }
      image_base64 = image_base64uri != null ? image_base64uri.replace(/.*?,/, "") : void 0;
      ext = image_base64uri.match("image/([a-z]+)")[1];
      if (ext === "jpeg") {
        ext = "jpg";
      }
      return Page.cmd("fileWrite", [this.user.getPath() + "/bg." + ext, image_base64], (function(_this) {
        return function(res) {
          return _this.user.getData(_this.user.hub, function(data) {
            data.bg = ext;
            return _this.user.save(data, _this.user.hub, function(res) {
              return Page.cmd("wrapperReload");
            });
          });
        };
      })(this));
    };

    ContentProfile.prototype.handleEditClick = function() {
      return this.editing = !this.editing;
    };

    ContentProfile.prototype.settingsClick = function() {
      return Page.setUrl("?Settings");
    };

    ContentProfile.prototype.handleOptionalHelpClick = function() {
      if (Page.server_info.rev < 1700) {
        Page.cmd("wrapperNotification", ["info", "You need ZeroNet version 0.5.0 use this feature"]);
        return false;
      }
      this.user.hasHelp((function(_this) {
        return function(optional_helping) {
          _this.optional_helping = optional_helping;
          if (_this.optional_helping) {
            Page.cmd("OptionalHelpRemove", ["data/users/" + _this.user.auth_address, _this.user.hub]);
            _this.optional_helping = false;
          } else {
            Page.cmd("OptionalHelp", ["data/users/" + _this.user.auth_address, _this.user.row.user_name + "'s new files", _this.user.hub]);
            _this.optional_helping = true;
          }
          Page.content_profile.update();
          return Page.projector.scheduleRender();
        };
      })(this));
      return true;
    };

    ContentProfile.prototype.render = function() {
      var ref, ref1, ref2, ref3, ref4;
      if (this.need_update) {
        this.log("Updating");
        this.need_update = false;
        if (this.user && this.user.row) {
          Page.changeTitle(this.user.row.user_name);
        } else {
          Page.changeTitle();
          this.need_update = true;
        }
        this.post_list.filter_post_ids = this.filter_post_id ? [this.filter_post_id] : null;
        if ((ref = this.post_list) != null) {
          ref.need_update = true;
        }
        if ((ref1 = this.user_list) != null) {
          ref1.need_update = true;
        }
        if ((ref2 = this.activity_list) != null) {
          ref2.need_update = true;
        }
        this.activity_list.directories = ["data/users/" + this.auth_address];
        this.user.auth_address = this.auth_address;
        this.user.hub = this.hub;
        this.user.get(this.hub, this.auth_address, (function(_this) {
          return function(res) {
            var ref3;
            if (res) {
              _this.user.row = res;
              _this.owned = _this.user.auth_address === ((ref3 = Page.user) != null ? ref3.auth_address : void 0);
              if (_this.owned && !_this.editable_intro) {
                _this.editable_bgcolor = new Editable("div", _this.handleBgColorSave);
                _this.editable_intro = new Editable("div", _this.handleIntroSave);
                _this.editable_intro.render_function = Text.renderMarked;
                _this.editable_user_name = new Editable("span", _this.handleUserNameSave);
                _this.uploadable_avatar = new Uploadable(_this.handleAvatarUpload);
                _this.uploadable_avatar.try_png = true;
                _this.uploadable_avatar.preverse_ratio = false;
                _this.uploadable_background = new Uploadable(_this.handleBackgroundUpload);
                _this.uploadable_background.resize_width = 900;
                _this.uploadable_background.resize_height = 700;
                _this.post_create = new PostCreate();
              }
              Page.projector.scheduleRender();
              return _this.loaded = true;
            } else {
              return Page.queryUserdb(_this.auth_address, function(row) {
                _this.log("UserDb row", row);
                _this.user.setRow(row);
                Page.projector.scheduleRender();
                return _this.loaded = true;
              });
            }
          };
        })(this));
        if (!Page.merged_sites[this.hub]) {
          Page.queryUserdb(this.auth_address, (function(_this) {
            return function(row) {
              _this.user.setRow(row);
              Page.projector.scheduleRender();
              return _this.loaded = true;
            };
          })(this));
        }
        this.user.hasHelp((function(_this) {
          return function(res) {
            return _this.optional_helping = res;
          };
        })(this));
      }
      if (!((ref3 = this.user) != null ? (ref4 = ref3.row) != null ? ref4.user_name : void 0 : void 0)) {
        if (this.loaded) {
          return h("div#Content.center." + this.auth_address, [h("div.user-notfound", "User not found or muted")]);
        } else {
          return h("div#Content.center." + this.auth_address, []);
        }
      }
      if (!Page.merged_sites[this.hub]) {
        return this.renderNotSeeded();
      }
      if (this.post_list.loaded && !Page.on_loaded.resolved) {
        Page.on_loaded.resolve();
      }
      if (this.loaded) {
        this.user.applyBackground();
      }
      return h("div#Content.center." + this.auth_address, [
        h("div.col-left", {
          classes: {
            faded: this.filter_post_id
          }
        }, [
          h("div.users", [
            h("div.user.card.profile", {
              classes: {
                followed: this.user.isFollowed()
              }
            }, [
              this.editing ? this.uploadable_avatar.render(this.user.renderAvatar) : this.user.renderAvatar(), h("span.name.link", {
                style: "color: " + (Text.toColor(this.user.row.auth_address))
              }, this.editing ? this.editable_user_name.render(this.user.row.user_name) : h("a", {
                href: this.user.getLink(),
                onclick: Page.handleLinkClick,
                style: "color: inherit"
              }, this.user.row.user_name)), h("div.cert_user_id", this.user.row.cert_user_id), this.editing ? h("div.intro-full", this.editable_intro.render(this.user.row.intro)) : h("div.intro-full", {
                innerHTML: Text.renderMarked(this.user.row.intro)
              }), h("div.follow-container", [
                h("a.button.button-follow-big", {
                  href: "#",
                  onclick: this.user.handleFollowClick
                }, h("span.icon-follow", "+"), !this.user.isFollowed() ? "Follow" : void 0)
              ]), h("div.follow-container.settings-container", [
                this.owned ? h("div.button-tiny.button-mute", {
                  classes: {
                    "button-active": this.editing
                  },
                  href: "#Edit",
                  style: "transition: all 0.5s;margin-right:10px",
                  title: "Make your profile more personal",
                  onclick: this.handleEditClick
                }, [
                  h("div.icon.icon-small.icon-edit", {
                    style: "margin-right: 6px;"
                  }), "Edit Profile"
                ]) : void 0, !this.owned ? h("div.button-tiny.button-mute", {
                  href: "#Mute",
                  onclick: this.user.handleMuteClick
                }, [h("div.icon.icon-mute"), "Mute"]) : h("div.button-tiny.button-mute", {
                  onclick: this.settingsClick
                }, [h("div.icon.icon-small.fa.fa-gear"), "Settings"])
              ]), h("div.help.checkbox", {
                classes: {
                  checked: this.optional_helping
                },
                onclick: this.handleOptionalHelpClick
              }, h("div.checkbox-skin"), h("div.title", "Help distribute this user's images"))
            ])
          ]), this.editing && this.loaded && (this.user.row.bgColor || this.user.row.bgUnset) ? h("div.user.card.profile.bgsetting", [h("div.bg-settings", [h("h2", h("b.intro-full", "Theme Settings")), h("div", "Background"), this.uploadable_background.render(this.user.renderBackground), h("div.bg-preview", this.editable_bgcolor.render("Theme Color: " + this.user.getBackground()))])]) : void 0, h("div.light-bg", [
            this.activity_list.render(), this.user_list.users.length > 0 ? h("h2.sep", {
              afterCreate: Animation.show
            }, ["Following"]) : void 0, this.user_list.render(".gray")
          ])
        ]), h("div.col-center", [
          this.owned && !this.filter_post_id ? h("div.post-create-container", {
            enterAnimation: Animation.slideDown,
            exitAnimation: Animation.slideUp
          }, this.post_create.render()) : void 0, this.post_list.render()
        ])
      ]);
    };

    ContentProfile.prototype.update = function() {
      if (!this.auth_address) {
        return;
      }
      this.need_update = true;
      return Page.projector.scheduleRender();
    };

    return ContentProfile;

  })(Class);

  window.ContentProfile = ContentProfile;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/ContentSettings.coffee ---- */


(function() {
  var ContentSettings,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ContentSettings = (function(superClass) {
    extend(ContentSettings, superClass);

    function ContentSettings() {
      this.update = bind(this.update, this);
      this.render = bind(this.render, this);
      this.handleSearchInput = bind(this.handleSearchInput, this);
      this.renderCheck = bind(this.renderCheck, this);
      this.section = bind(this.section, this);
      this.loaded = true;
      this.need_update = false;
    }

    ContentSettings.prototype.fncs = {};

    ContentSettings.prototype.section = function(name, ar) {
      var e;
      if (ar.filter(((function(_this) {
        return function(e) {
          return !e.properties.classes.invisible;
        };
      })(this))).length) {
        return h("div.setting" + name, [
          h("h2.sep", name), (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = ar.length; i < len; i++) {
              e = ar[i];
              results.push(e);
            }
            return results;
          })(), h("br", name)
        ]);
      }
    };

    ContentSettings.prototype.renderCheck = function(key, name, desc, attrs) {
      var base, ref;
      if (desc == null) {
        desc = "";
      }
      if (attrs == null) {
        attrs = {};
      }
            if ((ref = (base = this.fncs)[key]) != null) {
        ref;
      } else {
        base[key] = (function(_this) {
          return function(item) {
            if (attrs.disabled_by && Page.local_storage.settings[attrs.disabled_by]) {
              return false;
            }
            Page.local_storage.settings[key] = !Page.local_storage.settings[key];
            if (attrs.postRun) {
              attrs.postRun(Page.local_storage.settings[key]);
            }
            document.body.className = "loaded" + Page.otherClasses();
            Page.projector.scheduleRender();
            Page.saveLocalStorage();
            Page.content.need_update = true;
            return false;
          };
        })(this);
      };
      return h("div.checkbox.setting", {
        classes: {
          invisible: (!this.search || (name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1) ? false : true),
          checked: Page.local_storage.settings[key],
          disabled: attrs.disabled_by && Page.local_storage.settings[attrs.disabled_by]
        },
        onclick: this.fncs[key]
      }, h("div.checkbox-skin"), h("div.title", name), desc ? (!Array.isArray(desc) ? desc = [desc] : void 0, desc.map((function(_this) {
        return function(d) {
          if (d.startsWith("!WARN")) {
            return h("div.desc.red", d.replace("!WARN", "WARNING:"));
          } else {
            return h("div.desc", d);
          }
        };
      })(this))) : void 0, h("br", key));
    };

    ContentSettings.prototype.handleSearchInput = function(e) {
      if (e == null) {
        e = null;
      }
      this.search = e.target.value;
      Page.projector.scheduleRender();
      Page.content.need_update = true;
      return false;
    };

    ContentSettings.prototype.render = function() {
      window.otherPageBackground();
      if (this.loaded && !Page.on_loaded.resolved) {
        Page.on_loaded.resolve();
      }
      if (this.need_update) {
        this.log("Updating");
        this.need_update = false;
        Page.changeTitle("Settings");
      }
      return h("div#Content.center", [
        Page.local_storage_loaded ? h("div.post.settings", {
          style: "border-radius: 16px"
        }, [
          h("br", "top"), h("div", {
            style: "display:flex;"
          }, [
            h("h1", {
              style: "margin:6px;"
            }, "Settings"), h("input.text.search", {
              value: this.search,
              placeholder: "Search in settings...",
              oninput: this.handleSearchInput
            })
          ]), this.section("", [this.renderCheck("autoload_media", "Autoload images", ["This will automatically load images in posts", "!WARN This might also autoload images you don't want to see or seed!"]), this.renderCheck("gimme_stars", "I want my stars back", "Replace the thumbs up with a star"), this.renderCheck("transparent", "Enable transparency")]), this.section("Background", [
            this.renderCheck("disable_background", "Disable the background feature entierly"), this.renderCheck("load_others_background_disabled", "Don't load other users backgrounds", "", {
              disabled_by: "disable_background"
            }), this.renderCheck("hide_background_timeline", "Don't show background on the feed/timeline and other pages", "", {
              disabled_by: "disable_background"
            })
          ]), this.section("Header", [this.renderCheck("not_sticky_header", "Disable Sticky Header"), this.renderCheck("logo_left", "Move logo to the left")]), this.section("Feed", [this.renderCheck("hide_hello_zerome", "Hide \"Hello ZeroMe!\" messages", "This actually just hides a user's first post"), this.renderCheck("two_column", "Show two columns instead of one")]), h("br", "bottom")
        ]) : (h("h1", "Loading Settings..."), this.need_update = true)
      ]);
    };

    ContentSettings.prototype.update = function() {
      this.need_update = true;
      return Page.projector.scheduleRender();
    };

    return ContentSettings;

  })(Class);

  window.ContentSettings = ContentSettings;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/ContentUsers.coffee ---- */


(function() {
  var ContentUsers,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ContentUsers = (function(superClass) {
    extend(ContentUsers, superClass);

    function ContentUsers() {
      this.update = bind(this.update, this);
      this.render = bind(this.render, this);
      this.handleSearchInput = bind(this.handleSearchInput, this);
      this.handleRecentMoreClick = bind(this.handleRecentMoreClick, this);
      this.handleActiveMoreClick = bind(this.handleActiveMoreClick, this);
      this.handleSuggestedMoreClick = bind(this.handleSuggestedMoreClick, this);
      this.user_list_suggested = new UserList("suggested");
      this.user_list_suggested.limit = 9;
      this.user_list_active = new UserList("active");
      this.user_list_active.limit = 9;
      this.user_list_recent = new UserList("recent");
      this.user_list_recent.limit = 90;
      this.loaded = true;
      this.need_update = false;
      this.search = "";
      this.num_users_total = null;
    }

    ContentUsers.prototype.handleSuggestedMoreClick = function() {
      this.user_list_suggested.limit += 90;
      this.user_list_suggested.need_update = true;
      this.user_list_suggested.loading = true;
      Page.projector.scheduleRender();
      return false;
    };

    ContentUsers.prototype.handleActiveMoreClick = function() {
      this.user_list_active.limit += 90;
      this.user_list_active.need_update = true;
      this.user_list_active.loading = true;
      Page.projector.scheduleRender();
      return false;
    };

    ContentUsers.prototype.handleRecentMoreClick = function() {
      this.user_list_recent.limit += 300;
      this.user_list_recent.need_update = true;
      this.user_list_recent.loading = true;
      Page.projector.scheduleRender();
      return false;
    };

    ContentUsers.prototype.handleSearchInput = function(e) {
      var rate_limit;
      if (e == null) {
        e = null;
      }
      this.search = e.target.value;
      if (this.search === "") {
        rate_limit = 0;
      }
      if (this.search.length < 3) {
        rate_limit = 400;
      } else {
        rate_limit = 200;
      }
      return RateLimit(rate_limit, (function(_this) {
        return function() {
          _this.log("Search", _this.search);
          _this.user_list_recent.search = _this.search;
          _this.user_list_recent.need_update = true;
          _this.user_list_recent.limit = 15;
          return Page.projector.scheduleRender();
        };
      })(this));
    };

    ContentUsers.prototype.render = function() {
      var ref, ref1, ref2;
      window.otherPageBackground();
      if (this.loaded && !Page.on_loaded.resolved) {
        Page.on_loaded.resolve();
      }
      if (this.need_update || !this.num_users_total) {
        Page.cmd("dbQuery", "SELECT COUNT(*) AS num FROM user", (function(_this) {
          return function(res) {
            _this.num_users_total = res[0]["num"];
            return Page.projector.scheduleRender();
          };
        })(this));
      }
      if (this.need_update) {
        this.log("Updating");
        this.need_update = false;
        Page.changeTitle("Users");
        if ((ref = this.user_list_recent) != null) {
          ref.need_update = true;
        }
        if ((ref1 = this.user_list_active) != null) {
          ref1.need_update = true;
        }
        if (Page.user.auth_address) {
          if ((ref2 = this.user_list_suggested) != null) {
            ref2.need_update = true;
          }
        }
      }
      return h("div#Content.center", [
        h("input.text.big.search", {
          placeholder: "Search in users...",
          value: this.search,
          oninput: this.handleSearchInput
        }), !this.search ? [
          this.user_list_suggested.users.length > 0 ? h("h2.suggested", "Suggested users") : void 0, h("div.users.cards.suggested", [this.user_list_suggested.render("card")]), this.user_list_suggested.users.length === this.user_list_suggested.limit ? h("a.more.suggested", {
            href: "#",
            onclick: this.handleSuggestedMoreClick
          }, "Show more...") : this.user_list_suggested.users.length > 0 && this.user_list_suggested.loading ? h("a.more.suggested", {
            href: "#",
            onclick: this.handleSuggestedMoreClick
          }, "Loading...") : void 0, this.user_list_active.users.length > 0 ? h("h2.active", "Most active") : void 0, h("div.users.cards.active", [this.user_list_active.render("card")]), this.user_list_active.users.length === this.user_list_active.limit ? h("a.more.active", {
            href: "#",
            onclick: this.handleActiveMoreClick
          }, "Show more...") : this.user_list_active.users.length > 0 && this.user_list_active.loading ? h("a.more.active", {
            href: "#",
            onclick: this.handleActiveMoreClick
          }, "Loading...") : void 0, this.user_list_recent.users.length > 0 ? h("h2.recent", "New users in ZeroMe") : void 0
        ] : void 0, h("div.users.cards.recent", [this.user_list_recent.render("card")]), this.user_list_recent.users.length === this.user_list_recent.limit ? h("a.more.recent", {
          href: "#",
          onclick: this.handleRecentMoreClick
        }, "Show more...") : this.user_list_recent.users.length > 0 && this.user_list_recent.loading ? h("a.more.recent", {
          href: "#",
          onclick: this.handleRecentMoreClick
        }, "Loading...") : void 0, this.user_list_recent.users.length ? h("h5", {
          style: "text-align: center"
        }, "Total: " + this.num_users_total + " registered users") : void 0
      ]);
    };

    ContentUsers.prototype.update = function() {
      this.need_update = true;
      return Page.projector.scheduleRender();
    };

    return ContentUsers;

  })(Class);

  window.ContentUsers = ContentUsers;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/Head.coffee ---- */


(function() {
  var Head,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Head = (function(superClass) {
    extend(Head, superClass);

    function Head() {
      this.render = bind(this.render, this);
      this.saveFollows = bind(this.saveFollows, this);
      this.handleMenuClick = bind(this.handleMenuClick, this);
      this.handleFollowMenuItemClick = bind(this.handleFollowMenuItemClick, this);
      this.menu = new Menu();
      this.follows = [];
    }

    Head.prototype.handleSelectUserClick = function() {
      if (indexOf.call(Page.site_info.settings.permissions, "Merger:ZeroMe") < 0) {
        Page.cmd("wrapperPermissionAdd", "Merger:ZeroMe", (function(_this) {
          return function() {
            return Page.updateSiteInfo(function() {
              return Page.content.update();
            });
          };
        })(this));
      } else {
        Page.cmd("certSelect", {
          "accepted_domains": ["zeroid.bit", "kxoid.bit"],
          "accept_any": true
        });
      }
      return false;
    };

    Head.prototype.handleFollowMenuItemClick = function(type, item) {
      var selected;
      selected = !this.follows[type];
      this.follows[type] = selected;
      item[2] = selected;
      this.saveFollows();
      Page.projector.scheduleRender();
      return true;
    };

    Head.prototype.handleMenuClick = function() {
      var ref;
      if (!((ref = Page.site_info) != null ? ref.cert_user_id : void 0)) {
        return this.handleSelectUserClick();
      }
      Page.cmd("feedListFollow", [], (function(_this) {
        return function(follows) {
          _this.follows = follows;
          _this.menu.items = [];
          _this.menu.items.push([
            "Follow username mentions", (function(item) {
              return _this.handleFollowMenuItemClick("Mentions", item);
            }), _this.follows["Mentions"]
          ]);
          _this.menu.items.push([
            "Follow comments on your posts", (function(item) {
              return _this.handleFollowMenuItemClick("Comments on your posts", item);
            }), _this.follows["Comments on your posts"]
          ]);
          _this.menu.items.push([
            "Follow new followers", (function(item) {
              return _this.handleFollowMenuItemClick("New followers", item);
            }), _this.follows["New followers"]
          ]);
          _this.menu.toggle();
          return Page.projector.scheduleRender();
        };
      })(this));
      return false;
    };

    Head.prototype.saveFollows = function() {
      var out;
      out = {};
      if (this.follows["Mentions"]) {
        out["Mentions"] = ["SELECT 'mention' AS type, comment.date_added AS date_added, 'a comment' AS title, '@' || user_name || ': ' || comment.body AS body, '?Post/' || json.site || '/' || REPLACE(post_uri, '_', '/') AS url FROM comment LEFT JOIN json USING (json_id) WHERE comment.body LIKE '%@" + Page.user.row.user_name + "%' UNION SELECT 'mention' AS type, post.date_added AS date_added, 'In ' || json.user_name || \"'s post\" AS title, post.body AS body, '?Post/' || json.site || '/' || REPLACE(json.directory, 'data/users/', '') || '/' || post_id AS url FROM post LEFT JOIN json USING (json_id) WHERE post.body LIKE '%@" + Page.user.row.user_name + "%'", [""]];
      }
      if (this.follows["Comments on your posts"]) {
        out["Comments on your posts"] = ["SELECT 'comment' AS type, comment.date_added AS date_added, 'Your post' AS title, '@' || json.user_name || ': ' || comment.body AS body, '?Post/' || site || '/' || REPLACE(post_uri, '_', '/') AS url FROM comment LEFT JOIN json USING (json_id) WHERE post_uri LIKE '" + Page.user.auth_address + "%'", [""]];
      }
      if (this.follows["New followers"]) {
        out["New followers"] = ["SELECT 'follow' AS type, follow.date_added AS date_added, json.user_name || ' started following you' AS title, '' AS body, '?Profile/' || json.hub || REPLACE(json.directory, 'data/users', '') AS url FROM follow LEFT JOIN json USING(json_id) WHERE auth_address = '" + Page.user.auth_address + "' GROUP BY json.directory", [""]];
      }
      return Page.cmd("feedFollow", [out]);
    };

    Head.prototype.render = function() {
      var el, ref, ref1, ref2, ref3;
      return h("div.head.center", [
        Page.getSetting("logo_left") ? h("div.logo", h("img", {
          src: "img/logo.svg",
          height: 40,
          title: "Peeper",
          onerror: "this.src='img/logo.png'; this.onerror=null;"
        })) : void 0, h("ul", [
          (function() {
            var i, len, ref, results;
            ref = [["Home", 'Home', "home"], ["Users", 'Users', "users"], ["Settings", 'Settings', "gear"], ["", 'Donate', "heart"], ["", 'Badges', "certificate"]];
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              el = ref[i];
              results.push(h("li", h("a", {
                href: "?" + el[1],
                onclick: Page.handleLinkClick
              }, [h("i.fa.fa-margin.fa-" + el[2]), el[0]])));
            }
            return results;
          })()
        ]), !Page.getSetting("logo_left") ? h("div.logo", h("img", {
          src: "img/logo.svg",
          height: 40,
          title: "Peeper",
          onerror: "this.src='img/logo.png'; this.onerror=null;"
        })) : void 0, ((ref = Page.user) != null ? ref.hub : void 0) ? h("div.right.authenticated", [
          h("div.user", h("a.name.link", {
            href: Page.user.getLink(),
            onclick: Page.handleLinkClick
          }, Page.user.row.user_name), h("a.address", {
            href: "#Select+user",
            onclick: this.handleSelectUserClick
          }, Page.site_info.cert_user_id)), h("a.settings", {
            href: "#Settings",
            onclick: Page.returnFalse,
            onmousedown: this.handleMenuClick
          }, "\u22EE"), this.menu.render()
        ]) : !((ref1 = Page.user) != null ? ref1.hub : void 0) && ((ref2 = Page.site_info) != null ? ref2.cert_user_id : void 0) ? h("div.right.selected", [
          h("div.user", h("a.name.link", {
            href: "?Create+profile",
            onclick: Page.handleLinkClick
          }, "Create profile"), h("a.address", {
            href: "#Select+user",
            onclick: this.handleSelectUserClick
          }, Page.site_info.cert_user_id)), this.menu.render(), h("a.settings", {
            href: "#Settings",
            onclick: Page.returnFalse,
            onmousedown: this.handleMenuClick
          }, "\u22EE")
        ]) : !((ref3 = Page.user) != null ? ref3.hub : void 0) && Page.site_info ? h("div.right.unknown", [
          h("div.user", h("a.name.link", {
            href: "#Select+user",
            onclick: this.handleSelectUserClick
          }, "Visitor"), h("a.address", {
            href: "#Select+user",
            onclick: this.handleSelectUserClick
          }, "Select your account")), this.menu.render(), h("a.settings", {
            href: "#Settings",
            onclick: Page.returnFalse,
            onmousedown: this.handleMenuClick
          }, "\u22EE")
        ]) : h("div.right.unknown")
      ]);
    };

    return Head;

  })(Class);

  window.Head = Head;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/Post.coffee ---- */


(function() {
  var Post,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Post = (function(superClass) {
    extend(Post, superClass);

    function Post(row, item_list) {
      this.item_list = item_list;
      this.render = bind(this.render, this);
      this.renderComments = bind(this.renderComments, this);
      this.follow = bind(this.follow, this);
      this.unfollow = bind(this.unfollow, this);
      this.handleSettingsClick = bind(this.handleSettingsClick, this);
      this.getPostUri = bind(this.getPostUri, this);
      this.handleReplyClick = bind(this.handleReplyClick, this);
      this.handleMoreCommentsClick = bind(this.handleMoreCommentsClick, this);
      this.handleCommentDelete = bind(this.handleCommentDelete, this);
      this.handleCommentSave = bind(this.handleCommentSave, this);
      this.handleCommentSubmit = bind(this.handleCommentSubmit, this);
      this.handleCommentClick = bind(this.handleCommentClick, this);
      this.handleLikeClick = bind(this.handleLikeClick, this);
      this.handlePostDelete = bind(this.handlePostDelete, this);
      this.handlePostSave = bind(this.handlePostSave, this);
      this.liked = false;
      this.commenting = false;
      this.submitting_like = false;
      this.owned = false;
      this.editable_comments = {};
      this.field_comment = new Autosize({
        placeholder: "Add your comment",
        onsubmit: this.handleCommentSubmit
      });
      this.comment_limit = 3;
      this.menu = null;
      this.meta = null;
      this.css_style = "";
      this.setRow(row);
    }

    Post.prototype.setRow = function(row) {
      var ref;
      this.row = row;
      if (this.row.meta) {
        this.meta = new PostMeta(this, JSON.parse(this.row.meta));
      }
      if (Page.user) {
        this.liked = Page.user.likes[this.row.key];
      }
      this.user = new User({
        hub: row.site,
        auth_address: row.directory.replace("data/users/", "")
      });
      this.user.row = row;
      this.owned = this.user.auth_address === ((ref = Page.user) != null ? ref.auth_address : void 0);
      if (this.owned) {
        this.editable_body = new Editable("div.body", this.handlePostSave, this.handlePostDelete);
        this.editable_body.render_function = Text.renderMarked;
        return this.editable_body.empty_text = " ";
      }
    };

    Post.prototype.getLink = function() {
      return "?Post/" + this.user.hub + "/" + this.user.auth_address + "/" + this.row.post_id;
    };

    Post.prototype.handlePostSave = function(body, cb) {
      return Page.user.getData(Page.user.hub, (function(_this) {
        return function(data) {
          var i, j, len, post, post_index, ref;
          ref = data.post;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            post = ref[i];
            if (post.post_id === _this.row.post_id) {
              post_index = i;
            }
          }
          data.post[post_index].body = body;
          return Page.user.save(data, Page.user.hub, function(res) {
            return cb(res);
          });
        };
      })(this));
    };

    Post.prototype.handlePostDelete = function(cb) {
      return Page.user.getData(Page.user.hub, (function(_this) {
        return function(data) {
          var i, j, len, post, post_index, ref, ref1, ref2;
          ref = data.post;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            post = ref[i];
            if (post.post_id === _this.row.post_id) {
              post_index = i;
            }
          }
          data.post.splice(post_index, 1);
          if ((ref1 = _this.meta) != null ? (ref2 = ref1.meta) != null ? ref2.img : void 0 : void 0) {
            return Page.cmd("fileDelete", (_this.user.getPath()) + "/" + _this.row.post_id + ".jpg", function() {
              return Page.user.save(data, Page.user.hub, function(res) {
                return cb(res);
              });
            });
          } else {
            return Page.user.save(data, Page.user.hub, function(res) {
              return cb(res);
            });
          }
        };
      })(this));
    };

    Post.prototype.handleLikeClick = function(e) {
      var post_uri, ref, site;
      this.submitting_like = true;
      ref = this.row.key.split("-"), site = ref[0], post_uri = ref[1];
      if (Page.user.likes[post_uri]) {
        Animation.flashOut(e.currentTarget.firstChild);
        Page.user.dislike(site, post_uri, (function(_this) {
          return function() {
            _this.submitting_like = false;
            return _this.unfollow();
          };
        })(this));
      } else {
        Animation.flashIn(e.currentTarget.firstChild);
        Page.user.like(site, post_uri, (function(_this) {
          return function() {
            _this.submitting_like = false;
            return _this.follow();
          };
        })(this));
      }
      return false;
    };

    Post.prototype.handleCommentClick = function() {
      if (this.field_comment.node) {
        this.field_comment.node.focus();
      } else {
        this.commenting = true;
        setTimeout(((function(_this) {
          return function() {
            return _this.field_comment.node.focus();
          };
        })(this)), 600);
      }
      return false;
    };

    Post.prototype.handleCommentSubmit = function() {
      var post_uri, ref, site, timer_loading;
      timer_loading = setTimeout(((function(_this) {
        return function() {
          return _this.field_comment.loading = true;
        };
      })(this)), 100);
      ref = this.row.key.split("-"), site = ref[0], post_uri = ref[1];
      return Page.user.comment(site, post_uri, this.field_comment.attrs.value, (function(_this) {
        return function(res) {
          clearInterval(timer_loading);
          _this.field_comment.loading = false;
          if (res) {
            _this.field_comment.setValue("");
          }
          return _this.follow();
        };
      })(this));
    };

    Post.prototype.handleCommentSave = function(comment_id, body, cb) {
      return Page.user.getData(this.row.site, (function(_this) {
        return function(data) {
          var comment, comment_index, i, j, len, ref;
          ref = data.comment;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            comment = ref[i];
            if (comment.comment_id === comment_id) {
              comment_index = i;
            }
          }
          data.comment[comment_index].body = body;
          return Page.user.save(data, _this.row.site, function(res) {
            return cb(res);
          });
        };
      })(this));
    };

    Post.prototype.handleCommentDelete = function(comment_id, cb) {
      return Page.user.getData(this.row.site, (function(_this) {
        return function(data) {
          var comment, comment_index, i, j, len, ref;
          ref = data.comment;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            comment = ref[i];
            if (comment.comment_id === comment_id) {
              comment_index = i;
            }
          }
          data.comment.splice(comment_index, 1);
          return Page.user.save(data, _this.row.site, function(res) {
            cb(res);
            return _this.unfollow();
          });
        };
      })(this));
    };

    Post.prototype.handleMoreCommentsClick = function() {
      this.comment_limit += 10;
      return false;
    };

    Post.prototype.handleReplyClick = function(e) {
      var user_name;
      user_name = e.currentTarget.attributes.user_name.value;
      if (this.field_comment.attrs.value) {
        this.field_comment.setValue(this.field_comment.attrs.value + "\n@" + user_name + ": ");
      } else {
        this.field_comment.setValue("@" + user_name + ": ");
      }
      this.handleCommentClick(e);
      return false;
    };

    Post.prototype.getEditableComment = function(comment_uri) {
      var comment_id, handleCommentDelete, handleCommentSave, ref, user_address;
      if (!this.editable_comments[comment_uri]) {
        ref = comment_uri.split("_"), user_address = ref[0], comment_id = ref[1];
        handleCommentSave = (function(_this) {
          return function(body, cb) {
            return _this.handleCommentSave(parseInt(comment_id), body, cb);
          };
        })(this);
        handleCommentDelete = (function(_this) {
          return function(cb) {
            return _this.handleCommentDelete(parseInt(comment_id), cb);
          };
        })(this);
        this.editable_comments[comment_uri] = new Editable("div.body", handleCommentSave, handleCommentDelete);
        this.editable_comments[comment_uri].render_function = Text.renderMarked;
      }
      return this.editable_comments[comment_uri];
    };

    Post.prototype.getPostUri = function() {
      return this.user.auth_address + "_" + this.row.post_id;
    };

    Post.prototype.handleSettingsClick = function() {
      this.css_style = "z-index: " + this.row.date_added + "; position: relative";
      Page.cmd("feedListFollow", [], (function(_this) {
        return function(follows) {
          var followed, ref;
          if (!_this.menu) {
            _this.menu = new Menu();
          }
          followed = follows["Post follow"] && (ref = _this.getPostUri(), indexOf.call(follows["Post follow"][1], ref) >= 0);
          _this.menu.items = [];
          _this.menu.items.push([
            (followed ? "Unfollow" : "Follow") + " post in newsfeed", (function() {
              if (followed) {
                return _this.unfollow();
              } else {
                return _this.follow();
              }
            }), followed
          ]);
          if (!_this.owned) {
            _this.menu.items.push(["Mute user", _this.user.handleMuteClick]);
          }
          _this.menu.items.push(["Permalink", _this.getLink()]);
          return _this.menu.toggle();
        };
      })(this));
      return false;
    };

    Post.prototype.unfollow = function() {
      return Page.cmd("feedListFollow", [], (function(_this) {
        return function(follows) {
          var followed_uris, index;
          if (!follows["Post follow"]) {
            return;
          }
          followed_uris = follows["Post follow"][1];
          index = followed_uris.indexOf(_this.getPostUri());
          if (index === -1) {
            return;
          }
          followed_uris.splice(index, 1);
          if (followed_uris.length === 0) {
            delete follows["Post follow"];
          }
          _this.log("Unfollow", follows);
          return Page.cmd("feedFollow", [follows]);
        };
      })(this));
    };

    Post.prototype.follow = function() {
      return Page.cmd("feedListFollow", [], (function(_this) {
        return function(follows) {
          var followed_uris;
          if (!follows["Post follow"]) {
            follows["Post follow"] = ["SELECT\n \"comment\" AS type,\n comment.date_added AS date_added,\n \"a followed post\" AS title,\n '@' || user_name || ': ' || comment.body AS body,\n '?Post/' || json.site || '/' || REPLACE(post_uri, '_', '/') AS url\nFROM comment\nLEFT JOIN json USING (json_id)\nWHERE post_uri IN (:params)", []];
          }
          followed_uris = follows["Post follow"][1];
          followed_uris.push(_this.getPostUri());
          return Page.cmd("feedFollow", [follows]);
        };
      })(this));
    };

    Post.prototype.renderComments = function() {
      var comment_limit, ref, ref1;
      if (!this.row.comments && !this.commenting) {
        return [];
      }
      if (this.row.selected) {
        comment_limit = this.comment_limit + 50;
      } else {
        comment_limit = this.comment_limit;
      }
      return h("div.comment-list", {
        enterAnimation: Animation.slideDown,
        exitAnimation: Animation.slideUp,
        animate_scrollfix: true,
        animate_noscale: true
      }, [
        this.commenting ? h("div.comment-create", {
          enterAnimation: Animation.slideDown
        }, this.field_comment.render()) : void 0, (ref = this.row.comments) != null ? ref.slice(0, +(comment_limit - 1) + 1 || 9e9).map((function(_this) {
          return function(comment) {
            var comment_uri, owned, ref1, ref2, user_address, user_link;
            user_address = comment.directory.replace("data/users/", "");
            comment_uri = user_address + "_" + comment.comment_id;
            owned = user_address === ((ref1 = Page.user) != null ? ref1.auth_address : void 0);
            user_link = "?Profile/" + comment.hub + "/" + user_address + "/" + comment.cert_user_id;
            return h("div.comment", {
              id: comment_uri,
              key: comment_uri,
              animate_scrollfix: true,
              enterAnimation: Animation.slideDown,
              exitAnimation: Animation.slideUp
            }, [
              h("div.user", [
                h("a.name.link", {
                  href: user_link,
                  style: "color: " + (Text.toColor(user_address)),
                  onclick: Page.handleLinkClick
                }, comment.user_name), h("span.sep", " \u00B7 "), h("span.address", {
                  title: user_address
                }, comment.cert_user_id), h("span.sep", " \u2015 "), h("a.added.link", {
                  href: _this.getLink(),
                  title: Time.date(comment.date_added, "long")
                }, Time.since(comment.date_added)), h("a.icon.icon-reply", {
                  href: "#Reply",
                  onclick: _this.handleReplyClick,
                  user_name: comment.user_name
                }, "Reply")
              ]), owned ? _this.getEditableComment(comment_uri).render(comment.body) : ((ref2 = comment.body) != null ? ref2.length : void 0) > 5000 ? h("div.body.maxheight", {
                innerHTML: Text.renderMarked(comment.body),
                afterCreate: Maxheight.apply
              }) : h("div.body", {
                innerHTML: Text.renderMarked(comment.body)
              })
            ]);
          };
        })(this)) : void 0, ((ref1 = this.row.comments) != null ? ref1.length : void 0) > comment_limit ? h("a.more", {
          href: "#More",
          onclick: this.handleMoreCommentsClick,
          enterAnimation: Animation.slideDown,
          exitAnimation: Animation.slideUp
        }, "Show more comments...") : void 0
      ]);
    };

    Post.prototype.render = function() {
      var post_uri, ref, ref1, ref2, ref3, site;
      ref = this.row.key.split("-"), site = ref[0], post_uri = ref[1];
      return h("div.post", {
        key: this.row.key,
        enterAnimation: Animation.slideDown,
        exitAnimation: Animation.slideUp,
        animate_scrollfix: true,
        classes: {
          selected: this.row.selected
        },
        style: this.css_style
      }, [
        h("div.user", [
          this.user.renderAvatar({
            href: this.user.getLink(),
            onclick: Page.handleLinkClick
          }), h("a.name.link", {
            href: this.user.getLink(),
            onclick: Page.handleLinkClick,
            style: "color: " + (Text.toColor(this.user.auth_address))
          }, this.row.user_name), h("span.sep", " \u00B7 "), h("span.address", {
            title: this.user.auth_address
          }, this.row.cert_user_id), h("span.sep", " \u2015 "), h("a.added.link", {
            href: this.getLink(),
            title: Time.date(this.row.date_added, "long"),
            onclick: Page.handleLinkClick
          }, Time.since(this.row.date_added)), this.menu ? this.menu.render(".menu-right") : void 0, h("a.settings", {
            href: "#Settings",
            title: "Options for this post",
            onclick: Page.returnFalse,
            onmousedown: this.handleSettingsClick
          }, "\u22EE")
        ]), this.owned ? this.editable_body.render(this.row.body) : h("div.body", {
          classes: {
            maxheight: !this.row.selected && ((ref1 = this.row.body) != null ? ref1.length : void 0) > 3000
          },
          innerHTML: Text.renderMarked(this.row.body),
          afterCreate: Maxheight.apply,
          afterUpdate: Maxheight.apply
        }), this.meta ? this.meta.render() : void 0, h("div.actions", [
          h("a.icon.link", {
            href: "#Comment",
            title: "What do you think?",
            onclick: this.handleCommentClick
          }, h("i.fa.fa-comment.icon-comment"), "Comment"), h("a.icon.link", {
            classes: {
              active: (ref2 = Page.user) != null ? ref2.likes[post_uri] : void 0,
              loading: this.submitting_like,
              "like-zero": this.row.likes === 0
            },
            href: "#Like",
            title: "Like",
            onclick: this.handleLikeClick
          }, h("div" + (Page.getSetting("gimme_stars") ? ".fa.fa-star.icon-star" : ".fa.fa-thumbs-up.icon-thumbs-up"), {
            classes: {
              active: (ref3 = Page.user) != null ? ref3.likes[post_uri] : void 0
            }
          }), this.row.likes ? this.row.likes : void 0), h("a.icon.link", {
            href: "#Soon",
            title: "Peers seeding this post"
          }, h("i.fa.fa-share-alt"), " HUB")
        ]), this.renderComments()
      ]);
    };

    return Post;

  })(Class);

  window.Post = Post;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/PostCreate.coffee ---- */


(function() {
  var PostCreate,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  PostCreate = (function(superClass) {
    extend(PostCreate, superClass);

    function PostCreate() {
      this.render = bind(this.render, this);
      this.handleUploadClick = bind(this.handleUploadClick, this);
      this.handlePostSubmit = bind(this.handlePostSubmit, this);
      this.handleImageClose = bind(this.handleImageClose, this);
      this.handleUpload = bind(this.handleUpload, this);
      this.startEdit = bind(this.startEdit, this);
      this.field_post = new Autosize({
        placeholder: "Write something...",
        "class": "postfield",
        onfocus: this.startEdit,
        onblur: this.startEdit
      });
      this.upload = new Uploadable(this.handleUpload);
      this.upload.resize_width = 900;
      this.upload.resize_height = 700;
      this.is_editing = false;
      this.image = new ImagePreview();
    }

    PostCreate.prototype.startEdit = function() {
      this.is_editing = true;
      return Page.projector.scheduleRender();
    };

    PostCreate.prototype.handleUpload = function(base64uri, width, height) {
      this.startEdit();
      this.image.base64uri = base64uri;
      this.image.width = width;
      this.image.height = height;
      return this.upload.getPreviewData(base64uri, 10, 10, (function(_this) {
        return function(preview_data) {
          _this.image.preview_data = preview_data;
          return Page.projector.scheduleRender();
        };
      })(this));
    };

    PostCreate.prototype.handleImageClose = function() {
      this.image.height = 0;
      this.image.base64uri = "";
      return false;
    };

    PostCreate.prototype.handlePostSubmit = function() {
      var meta, ref;
      this.field_post.loading = true;
      if (this.image.height) {
        meta = {};
        meta["img"] = this.image.preview_data;
      } else {
        meta = null;
      }
      Page.user.post(this.field_post.attrs.value, meta, (ref = this.image.base64uri) != null ? ref.replace(/.*base64,/, "") : void 0, (function(_this) {
        return function(res) {
          _this.field_post.loading = false;
          if (res) {
            _this.field_post.setValue("");
            _this.image = new ImagePreview();
            document.activeElement.blur();
          }
          return setTimeout((function() {
            return Page.content.update();
          }), 100);
        };
      })(this));
      return false;
    };

    PostCreate.prototype.handleUploadClick = function() {
      if (Page.server_info.rev < 1700) {
        return Page.cmd("wrapperNotification", ["info", "You need ZeroNet version 0.5.0 to upload images"]);
      } else {
        return this.upload.handleUploadClick();
      }
    };

    PostCreate.prototype.render = function() {
      var user;
      user = Page.user;
      if (user === false) {
        return h("div.post-create.post.empty");
      } else if (user != null ? user.hub : void 0) {
        return h("div.post-create.post", {
          classes: {
            editing: this.is_editing
          }
        }, h("div.user", user.renderAvatar()), this.field_post.render(), this.image.base64uri ? h("div.image", {
          style: "background-image: url(" + this.image.base64uri + "); height: " + (this.image.getSize(530, 600)[1]) + "px",
          classes: {
            empty: false
          }
        }, [
          h("a.close", {
            href: "#",
            onclick: this.handleImageClose
          }, "×")
        ]) : h("div.image", {
          style: "height: 0px",
          classes: {
            empty: true
          }
        }), h("div.postbuttons", h("a.icon-add.link", {
          href: "#",
          title: "Add a photo",
          onclick: this.handleUploadClick
        }, h("i.fa.fa-picture-o")), h("a.button.button-submit", {
          href: "#Submit",
          onclick: this.handlePostSubmit
        }, h("i.fa.fa-pencil-square-o"), " Post")), h("div", {
          style: "clear: both"
        }));
      } else if (Page.site_info.cert_user_id) {
        return h("div.post-create.post.empty.noprofile", h("div.user", h("a.avatar", {
          href: "#",
          style: "background-image: url('img/unkown.png')"
        })), h("div.select-user-container", h("a.button.button-submit.select-user", {
          href: "?Create+profile",
          onclick: Page.handleLinkClick
        }, ["Create new profile"])), h("textarea", {
          disabled: true
        }));
      } else {
        return h("div.post-create.post.empty.nocert", h("div.user", h("a.avatar", {
          href: "#",
          style: "background-image: url('img/unkown.png')"
        })), h("div.select-user-container", h("a.button.button-submit.select-user", {
          href: "#Select+user",
          onclick: Page.head.handleSelectUserClick
        }, [h("div.icon.icon-profile"), "Select user to post new content"])), h("textarea", {
          disabled: true
        }));
      }
    };

    return PostCreate;

  })(Class);

  window.PostCreate = PostCreate;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/PostList.coffee ---- */


(function() {
  var PostList,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  PostList = (function(superClass) {
    extend(PostList, superClass);

    function PostList() {
      this.render = bind(this.render, this);
      this.storeMoreTag = bind(this.storeMoreTag, this);
      this.addScrollwatcher = bind(this.addScrollwatcher, this);
      this.handleMoreClick = bind(this.handleMoreClick, this);
      this.update = bind(this.update, this);
      this.queryLikes = bind(this.queryLikes, this);
      this.queryComments = bind(this.queryComments, this);
      this.item_list = new ItemList(Post, "key");
      this.posts = this.item_list.items;
      this.need_update = true;
      this.directories = [];
      this.loaded = false;
      this.filter_post_ids = null;
      this.limit = 10;
    }

    PostList.prototype.queryComments = function(post_uris, cb) {
      var query;
      query = "SELECT post_uri, comment.body, comment.date_added, comment.comment_id, json.cert_auth_type, json.cert_user_id, json.user_name, json.hub, json.directory, json.site FROM comment LEFT JOIN json USING (json_id) WHERE ? AND date_added < " + (Time.timestamp() + 120) + " ORDER BY date_added DESC";
      return Page.cmd("dbQuery", [
        query, {
          post_uri: post_uris
        }
      ], cb);
    };

    PostList.prototype.queryLikes = function(post_uris, cb) {
      var query;
      query = "SELECT post_uri, COUNT(*) AS likes FROM post_like WHERE ? GROUP BY post_uri";
      return Page.cmd("dbQuery", [
        query, {
          post_uri: post_uris
        }
      ], cb);
    };

    PostList.prototype.update = function() {
      var param, query, where;
      this.need_update = false;
      param = {};
      if (this.directories === "all") {
        where = "WHERE post_id IS NOT NULL AND post.date_added < " + (Time.timestamp() + 120) + " ";
      } else {
        where = "WHERE directory IN " + (Text.sqlIn(this.directories)) + " AND post_id IS NOT NULL AND post.date_added < " + (Time.timestamp() + 120) + " ";
      }
      if (this.filter_post_ids) {
        where += "AND post_id IN " + (Text.sqlIn(this.filter_post_ids)) + " ";
      }
      if (Page.local_storage_loaded) {
        if (Page.local_storage.settings.hide_hello_zerome) {
          where += "AND post_id > 1 ";
        }
      } else {
        this.need_update = true;
      }
      query = "SELECT * FROM post LEFT JOIN json ON (post.json_id = json.json_id) " + where + " ORDER BY date_added DESC LIMIT " + (this.limit + 1);
      this.logStart("Update");
      return Page.cmd("dbQuery", [query, param], (function(_this) {
        return function(rows) {
          var items, j, len, post_uris, row;
          items = [];
          post_uris = [];
          for (j = 0, len = rows.length; j < len; j++) {
            row = rows[j];
            row["key"] = row["site"] + "-" + row["directory"].replace("data/users/", "") + "_" + row["post_id"];
            row["post_uri"] = row["directory"].replace("data/users/", "") + "_" + row["post_id"];
            post_uris.push(row["post_uri"]);
          }
          _this.queryComments(post_uris, function(comment_rows) {
            var comment_db, comment_row, k, l, len1, len2, name, ref, ref1;
            comment_db = {};
            for (k = 0, len1 = comment_rows.length; k < len1; k++) {
              comment_row = comment_rows[k];
                            if ((ref = comment_db[name = comment_row.site + "/" + comment_row.post_uri]) != null) {
                ref;
              } else {
                comment_db[name] = [];
              };
              comment_db[comment_row.site + "/" + comment_row.post_uri].push(comment_row);
            }
            for (l = 0, len2 = rows.length; l < len2; l++) {
              row = rows[l];
              row["comments"] = comment_db[row.site + "/" + row.post_uri];
              if (((ref1 = _this.filter_post_ids) != null ? ref1.length : void 0) === 1 && row.post_id === parseInt(_this.filter_post_ids[0])) {
                row.selected = true;
              }
            }
            _this.item_list.sync(rows);
            _this.loaded = true;
            _this.logEnd("Update");
            Page.projector.scheduleRender();
            if (_this.posts.length > _this.limit) {
              return _this.addScrollwatcher();
            }
          });
          return _this.queryLikes(post_uris, function(like_rows) {
            var k, l, len1, len2, like_db, like_row;
            like_db = {};
            for (k = 0, len1 = like_rows.length; k < len1; k++) {
              like_row = like_rows[k];
              like_db[like_row["post_uri"]] = like_row["likes"];
            }
            for (l = 0, len2 = rows.length; l < len2; l++) {
              row = rows[l];
              row["likes"] = like_db[row["post_uri"]];
            }
            _this.item_list.sync(rows);
            return Page.projector.scheduleRender();
          });
        };
      })(this));
    };

    PostList.prototype.handleMoreClick = function() {
      this.limit += 10;
      this.update();
      return false;
    };

    PostList.prototype.addScrollwatcher = function() {
      return setTimeout(((function(_this) {
        return function() {
          var i, item, j, len, ref;
          ref = Page.scrollwatcher.items;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            item = ref[i];
            if (item[1] === _this.tag_more) {
              Page.scrollwatcher.items.splice(i, 1);
              break;
            }
          }
          return Page.scrollwatcher.add(_this.tag_more, function(tag) {
            if (tag.getBoundingClientRect().top === 0) {
              return;
            }
            _this.limit += 10;
            _this.need_update = true;
            return Page.projector.scheduleRender();
          });
        };
      })(this)), 2000);
    };

    PostList.prototype.storeMoreTag = function(elem) {
      return this.tag_more = elem;
    };

    PostList.prototype.render = function() {
      var f, l1, l2;
      if (this.need_update) {
        this.update();
      }
      if (!this.posts.length) {
        if (!this.loaded) {
          return null;
        } else {
          return h("div.post-list", [
            h("div.post-list-empty", {
              enterAnimation: Animation.slideDown,
              exitAnimation: Animation.slideUp
            }, [
              h("h2", "No posts yet"), h("a", {
                href: "?Users",
                onclick: Page.handleLinkClick
              }, "Let's follow some users!")
            ])
          ]);
        }
      }
      if (Page.getSetting("two_column")) {
        f = false;
        l1 = [];
        l2 = [];
        this.posts.slice(0, this.limit).map((function(_this) {
          return function(post) {
            f = !f;
            if (f) {
              return l1.push(post);
            } else {
              return l2.push(post);
            }
          };
        })(this));
        return [
          h("div.post-2-column", [
            h("div.post-list", l1.map((function(_this) {
              return function(post) {
                var err;
                try {
                  return post.render();
                } catch (error) {
                  err = error;
                  h("div.error", ["Post render error:", err.message]);
                  return Debug.formatException(err);
                }
              };
            })(this))), h("div.post-list", l2.map((function(_this) {
              return function(post) {
                var err;
                try {
                  return post.render();
                } catch (error) {
                  err = error;
                  h("div.error", ["Post render error:", err.message]);
                  return Debug.formatException(err);
                }
              };
            })(this)))
          ]), this.posts.length > this.limit ? h("a.more.small", {
            href: "#More",
            onclick: this.handleMoreClick,
            enterAnimation: Animation.slideDown,
            exitAnimation: Animation.slideUp,
            afterCreate: this.storeMoreTag
          }, "Show more posts...") : void 0
        ];
      } else {
        return [
          h("div.post-list", this.posts.slice(0, +this.limit + 1 || 9e9).map((function(_this) {
            return function(post) {
              var err;
              try {
                return post.render();
              } catch (error) {
                err = error;
                h("div.error", ["Post render error:", err.message]);
                return Debug.formatException(err);
              }
            };
          })(this))), this.posts.length > this.limit ? h("a.more.small", {
            href: "#More",
            onclick: this.handleMoreClick,
            enterAnimation: Animation.slideDown,
            exitAnimation: Animation.slideUp,
            afterCreate: this.storeMoreTag
          }, "Show more posts...") : void 0
        ];
      }
    };

    return PostList;

  })(Class);

  window.PostList = PostList;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/PostMeta.coffee ---- */


(function() {
  var PostMeta,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  PostMeta = (function(superClass) {
    extend(PostMeta, superClass);

    function PostMeta(post, meta) {
      this.post = post;
      this.meta = meta;
      this.render = bind(this.render, this);
      this.handleImageSettingsClick = bind(this.handleImageSettingsClick, this);
      this.handleImageDeleteClick = bind(this.handleImageDeleteClick, this);
      this.handleOptionalHelpClick = bind(this.handleOptionalHelpClick, this);
      this.handleImageClick = bind(this.handleImageClick, this);
      this.afterCreateImage = bind(this.afterCreateImage, this);
      this;
    }

    PostMeta.prototype.afterCreateImage = function(tag) {
      return Page.scrollwatcher.add(tag, (function(_this) {
        return function() {
          var e;
          try {
            _this.image_preview.preview_uri = _this.image_preview.getPreviewUri();
            Page.cmd("optionalFileInfo", _this.post.user.getPath() + "/" + _this.post.row.post_id + ".jpg", function(res) {
              _this.image_preview.optional_info = res;
              return Page.projector.scheduleRender();
            });
          } catch (error) {
            e = error;
            _this.log("Image preview error: " + e);
          }
          return Page.projector.scheduleRender();
        };
      })(this));
    };

    PostMeta.prototype.handleImageClick = function(e) {
      var image, ref;
      if (this.image_preview.load_fullsize || ((ref = this.image_preview.optional_info) != null ? ref.is_downloaded : void 0)) {
        Page.overlay.zoomImageTag(e.currentTarget, this.image_preview.width, this.image_preview.height);
      } else {
        this.image_preview.load_fullsize = true;
        this.image_preview.loading = true;
        image = new Image();
        image.src = (this.post.user.getPath()) + "/" + this.post.row.post_id + ".jpg";
        image.onload = (function(_this) {
          return function() {
            _this.image_preview.loading = false;
            _this.image_preview.optional_info.is_downloaded = 1;
            _this.image_preview.optional_info.peer += 1;
            return Page.projector.scheduleRender();
          };
        })(this);
        Page.projector.scheduleRender();
      }
      return false;
    };

    PostMeta.prototype.handleOptionalHelpClick = function() {
      this.post.user.hasHelp((function(_this) {
        return function(optional_helping) {
          _this.optional_helping = optional_helping;
          if (_this.optional_helping) {
            Page.cmd("OptionalHelpRemove", ["data/users/" + _this.post.user.auth_address, _this.post.user.hub]);
            _this.optional_helping = false;
          } else {
            Page.cmd("OptionalHelp", ["data/users/" + _this.post.user.auth_address, _this.post.row.user_name + "'s new images", _this.post.user.hub]);
            _this.optional_helping = true;
          }
          Page.content_profile.update();
          return Page.projector.scheduleRender();
        };
      })(this));
      return true;
    };

    PostMeta.prototype.handleImageDeleteClick = function() {
      var inner_path;
      inner_path = (this.post.user.getPath()) + "/" + this.post.row.post_id + ".jpg";
      return Page.cmd("optionalFileDelete", inner_path, (function(_this) {
        return function() {
          _this.image_preview.optional_info.is_downloaded = 0;
          _this.image_preview.optional_info.peer -= 1;
          return Page.projector.scheduleRender();
        };
      })(this));
    };

    PostMeta.prototype.handleImageSettingsClick = function(e) {
      if (e.target.classList.contains("menu-item")) {
        return;
      }
      this.post.user.hasHelp((function(_this) {
        return function(helping) {
          var ref;
          if (!_this.menu_image) {
            _this.menu_image = new Menu();
          }
          _this.optional_helping = helping;
          _this.menu_image.items = [];
          _this.menu_image.items.push([
            "Help distribute this user's new images", _this.handleOptionalHelpClick, (function() {
              return _this.optional_helping;
            })
          ]);
          _this.menu_image.items.push(["---"]);
          if ((ref = _this.image_preview.optional_info) != null ? ref.is_downloaded : void 0) {
            _this.menu_image.items.push(["Delete image", _this.handleImageDeleteClick]);
          } else {
            _this.menu_image.items.push(["Show image", _this.handleImageClick, false]);
          }
          return _this.menu_image.toggle();
        };
      })(this));
      return false;
    };

    PostMeta.prototype.render = function() {
      var height, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, style_fullsize, style_preview, width;
      if (this.meta.img) {
        if (!this.image_preview) {
          this.image_preview = new ImagePreview();
          this.image_preview.setPreviewData(this.meta.img);
        }
        ref = this.image_preview.getSize(530, 600), width = ref[0], height = ref[1];
        if ((ref1 = this.image_preview) != null ? ref1.preview_uri : void 0) {
          style_preview = "background-image: url(" + this.image_preview.preview_uri + ")";
        } else {
          style_preview = "";
        }
        if (this.image_preview.load_fullsize || ((ref2 = this.image_preview.optional_info) != null ? ref2.is_downloaded : void 0)) {
          style_fullsize = "background-image: url(" + (this.post.user.getPath()) + "/" + this.post.row.post_id + ".jpg)";
        } else {
          style_fullsize = "";
        }
        return h("div.img.preview", {
          afterCreate: this.afterCreateImage,
          style: "width: " + width + "px; height: " + height + "px; " + style_preview,
          classes: {
            downloaded: (ref3 = this.image_preview.optional_info) != null ? ref3.is_downloaded : void 0,
            hasinfo: ((ref4 = this.image_preview.optional_info) != null ? ref4.peer : void 0) !== null,
            loading: this.image_preview.loading
          }
        }, h("a.fullsize", {
          href: "#",
          onclick: this.handleImageClick,
          style: style_fullsize
        }), Page.server_info.rev < 1700 ? h("small.oldversion", "You need ZeroNet 0.5.0 to view this image") : void 0, ((ref5 = this.image_preview) != null ? ref5.optional_info : void 0) ? (h("a.show", {
          href: "#",
          onclick: this.handleImageClick
        }, h("div.title", "Loading...\nShow image")), Page.getSetting("autoload_media") && !((ref6 = this.image_preview.optional_info) != null ? ref6.is_downloaded : void 0) ? setTimeout(this.handleImageClick, 0) : void 0) : void 0, ((ref7 = this.image_preview) != null ? ref7.optional_info : void 0) ? h("a.details", {
          href: "#Settings",
          onclick: Page.returnFalse,
          onmousedown: this.handleImageSettingsClick
        }, [h("div.size", Text.formatSize((ref8 = this.image_preview.optional_info) != null ? ref8.size : void 0)), h("div.peers.icon-profile"), (ref9 = this.image_preview.optional_info) != null ? ref9.peer : void 0, h("a.image-settings", "\u22EE"), this.menu_image ? this.menu_image.render(".menu-right") : void 0]) : void 0);
      }
    };

    return PostMeta;

  })(Class);

  window.PostMeta = PostMeta;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/User.coffee ---- */


(function() {
  var User,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  User = (function(superClass) {
    extend(User, superClass);

    function User(row, item_list) {
      this.item_list = item_list;
      this.renderList = bind(this.renderList, this);
      this.handleMuteClick = bind(this.handleMuteClick, this);
      this.handleDownloadClick = bind(this.handleDownloadClick, this);
      this.download = bind(this.download, this);
      this.handleFollowClick = bind(this.handleFollowClick, this);
      this.saveUserdb = bind(this.saveUserdb, this);
      this.applyBackground = bind(this.applyBackground, this);
      this.renderBackground = bind(this.renderBackground, this);
      this.renderAvatar = bind(this.renderAvatar, this);
      this.hasHelp = bind(this.hasHelp, this);
      this.updateInfo = bind(this.updateInfo, this);
      if (row) {
        this.setRow(row);
      }
      this.likes = {};
      this.followed_users = {};
      this.submitting_follow = false;
    }

    User.prototype.setRow = function(row) {
      this.row = row;
      this.hub = row.hub;
      return this.auth_address = row.auth_address;
    };

    User.prototype.get = function(site, auth_address, cb) {
      var params;
      if (cb == null) {
        cb = null;
      }
      params = {
        site: site,
        directory: "data/users/" + auth_address
      };
      return Page.cmd("dbQuery", ["SELECT * FROM json WHERE site = :site AND directory = :directory LIMIT 1", params], (function(_this) {
        return function(res) {
          var row;
          row = res[0];
          if (row) {
            row.auth_address = row.directory.replace("data/users/", "");
            _this.setRow(row);
            return typeof cb === "function" ? cb(row) : void 0;
          } else {
            return cb(false);
          }
        };
      })(this));
    };

    User.prototype.updateInfo = function(cb) {
      var p_followed_users, p_likes;
      if (cb == null) {
        cb = null;
      }
      this.logStart("Info loaded");
      p_likes = new Promise();
      p_followed_users = new Promise();
      Page.cmd("dbQuery", ["SELECT * FROM follow WHERE json_id = " + this.row.json_id], (function(_this) {
        return function(res) {
          var j, len, row;
          _this.followed_users = {};
          for (j = 0, len = res.length; j < len; j++) {
            row = res[j];
            _this.followed_users[row.hub + "/" + row.auth_address] = row;
          }
          return p_followed_users.resolve();
        };
      })(this));
      Page.cmd("dbQuery", ["SELECT post_like.* FROM json LEFT JOIN post_like USING (json_id) WHERE directory = 'data/users/" + this.auth_address + "' AND post_uri IS NOT NULL"], (function(_this) {
        return function(res) {
          var j, len, row;
          _this.likes = {};
          for (j = 0, len = res.length; j < len; j++) {
            row = res[j];
            _this.likes[row.post_uri] = true;
          }
          return p_likes.resolve();
        };
      })(this));
      return Promise.join(p_followed_users, p_likes).then((function(_this) {
        return function(res1, res2) {
          _this.logEnd("Info loaded");
          return typeof cb === "function" ? cb(true) : void 0;
        };
      })(this));
    };

    User.prototype.isFollowed = function() {
      return Page.user.followed_users[this.hub + "/" + this.auth_address];
    };

    User.prototype.isSeeding = function() {
      return Page.merged_sites[this.hub];
    };

    User.prototype.hasHelp = function(cb) {
      return Page.cmd("OptionalHelpList", [this.hub], (function(_this) {
        return function(helps) {
          return cb(helps["data/users/" + _this.auth_address]);
        };
      })(this));
    };

    User.prototype.getPath = function(site) {
      if (site == null) {
        site = this.hub;
      }
      if (site === Page.userdb) {
        return "merged-ZeroMe/" + site + "/data/userdb/" + this.auth_address;
      } else {
        return "merged-ZeroMe/" + site + "/data/users/" + this.auth_address;
      }
    };

    User.prototype.getLink = function() {
      return "?Profile/" + this.hub + "/" + this.auth_address + "/" + (this.row.cert_user_id || '');
    };

    User.prototype.getAvatarLink = function() {
      var cache_invalidation, ref;
      cache_invalidation = "";
      if (this.auth_address === ((ref = Page.user) != null ? ref.auth_address : void 0)) {
        cache_invalidation = "?" + Page.cache_time;
      }
      return "merged-ZeroMe/" + this.hub + "/data/users/" + this.auth_address + "/avatar." + this.row.avatar + cache_invalidation;
    };

    User.prototype.getBackgroundLink = function() {
      var cache_invalidation, ref;
      cache_invalidation = "";
      if (this.auth_address === ((ref = Page.user) != null ? ref.auth_address : void 0)) {
        cache_invalidation = "?" + Page.cache_time;
      }
      return "merged-ZeroMe/" + this.hub + "/data/users/" + this.auth_address + "/bg." + this.row.bg + cache_invalidation;
    };

    User.prototype.getBackground = function() {
      if (this.row && this.row.bgColor) {
        return this.row.bgColor;
      } else if (this.row && this.row.bgUnset) {
        return window.defaultBackground.color;
      } else {
        throw new Error("ROW ERROR");
      }
    };

    User.prototype.getDefaultData = function() {
      var ref;
      return {
        "next_post_id": 2,
        "next_comment_id": 1,
        "next_follow_id": 1,
        "avatar": "generate",
        "user_name": (ref = this.row) != null ? ref.user_name : void 0,
        "hub": this.hub,
        "intro": "Random ZeroNet user",
        "post": [
          {
            "post_id": 1,
            "date_added": Time.timestamp(),
            "body": "Hello ZeroMe!"
          }
        ],
        "bgColor": window.defaultBackground.color = "#D30C37",
        "post_like": {},
        "comment": [],
        "follow": []
      };
    };

    User.prototype.getData = function(site, cb) {
      return Page.cmd("fileGet", [this.getPath(site) + "/data.json", false], (function(_this) {
        return function(data) {
          var ref;
          data = JSON.parse(data);
                    if (data != null) {
            data;
          } else {
            data = {
              "next_comment_id": 1,
              "user_name": (ref = _this.row) != null ? ref.user_name : void 0,
              "hub": _this.hub,
              "post_like": {},
              "comment": []
            };
          };
          return cb(data);
        };
      })(this));
    };

    User.prototype.renderAvatar = function(attrs) {
      if (attrs == null) {
        attrs = {};
      }
      if (this.isSeeding() && (this.row.avatar === "png" || this.row.avatar === "jpg")) {
        attrs.style = "background-image: url('" + (this.getAvatarLink()) + "')";
        return h("a.avatar", attrs);
      } else {
        attrs.style = "background: linear-gradient(" + Text.toColor(this.auth_address) + "," + Text.toColor(this.auth_address.slice(-5)) + ")";
        attrs.src = "img/user-shape.png";
        return h("img.avatar", attrs);
      }
    };

    User.prototype.renderBackground = function(attrs) {
      if (attrs == null) {
        attrs = {};
      }
      if (this.isSeeding() && (this.row.bg === "png" || this.row.bg === "jpg")) {
        attrs.src = "" + (this.getBackgroundLink());
      }
      attrs.style = "background: #AFAFAF;width:160px;min-height:75px;";
      return h("img.bg-preview", attrs);
    };

    User.prototype.applyBackground = function(cb) {
      var ref;
      if (Page.getSetting("disable_background")) {
        return window.stripBackground();
      } else if ((Page.user && Page.user.getLink ? (typeof Page !== "undefined" && Page !== null ? (ref = Page.user) != null ? ref.getLink() : void 0 : void 0) !== this.getLink() : false) && Page.getSetting("load_others_background_disabled")) {
        return window.defaultBackground();
      } else {
        if (this.row.bg && !this.row.bgColor) {
          this.row.bgUnset = true;
        }
        if (this.row.bgColor || this.row.bgUnset) {
          if (this.isSeeding() && (this.row.bg === "png" || this.row.bg === "jpg")) {
            window.setBackground(this.getBackground(), this.getBackgroundLink());
          } else if (this.row.bgColor) {
            window.setBackground(this.getBackground());
          } else if (this.row.bgUnset) {
            window.defaultBackground();
          }
          if (cb) {
            return cb();
          }
        } else {
          console.trace("Loading background async, should not happen");
          return this.getData(this.hub, (function(_this) {
            return function(row) {
              var ref1;
                            if ((ref1 = _this.row) != null) {
                ref1;
              } else {
                _this.row = {};
              };
              _this.row.bg = row.bg;
              _this.row.bgColor = row.bgColor;
              if (!row.bgColor) {
                _this.row.bgUnset = true;
              }
              return _this.applyBackground(cb);
            };
          })(this));
        }
      }
    };

    User.prototype.save = function(data, site, cb) {
      if (site == null) {
        site = this.hub;
      }
      if (cb == null) {
        cb = null;
      }
      return Page.cmd("fileWrite", [this.getPath(site) + "/data.json", Text.fileEncode(data)], (function(_this) {
        return function(res_write) {
          if (Page.server_info.rev > 1400) {
            Page.content.update();
          }
          if (typeof cb === "function") {
            cb(res_write);
          }
          return Page.cmd("sitePublish", {
            "inner_path": _this.getPath(site) + "/data.json"
          }, function(res_sign) {
            _this.log("Save result", res_write, res_sign);
            if (site === _this.hub && res_write === "ok" && res_sign === "ok") {
              return _this.saveUserdb(data);
            }
          });
        };
      })(this));
    };

    User.prototype.saveUserdb = function(data, cb) {
      var cert_provider;
      cert_provider = Page.site_info.cert_user_id.replace(/.*@/, "");
      if (cert_provider !== "zeroid.bit" && cert_provider !== "zeroverse.bit") {
        this.log("Cert provider " + cert_provider + " not supported by userdb!");
        cb(false);
        return false;
      }
      return Page.cmd("fileGet", [this.getPath(Page.userdb) + "/content.json", false], (function(_this) {
        return function(userdb_data) {
          var changed, field, j, len, ref;
          userdb_data = JSON.parse(userdb_data);
          changed = false;
          if (!(userdb_data != null ? userdb_data.user : void 0)) {
            userdb_data = {
              user: [
                {
                  date_added: Time.timestamp()
                }
              ]
            };
            changed = true;
          }
          ref = ["avatar", "hub", "intro", "user_name", "bg", "bgColor"];
          for (j = 0, len = ref.length; j < len; j++) {
            field = ref[j];
            if (userdb_data.user[0][field] !== data[field]) {
              changed = true;
              _this.log("Changed in profile:", field, userdb_data.user[0][field], "!=", data[field]);
            }
            userdb_data.user[0][field] = data[field];
          }
          if (changed) {
            return Page.cmd("fileWrite", [_this.getPath(Page.userdb) + "/content.json", Text.fileEncode(userdb_data)], function(res_write) {
              return Page.cmd("sitePublish", {
                "inner_path": _this.getPath(Page.userdb) + "/content.json"
              }, function(res_sign) {
                _this.log("Userdb save result", res_write, res_sign);
                return typeof cb === "function" ? cb(res_sign) : void 0;
              });
            });
          }
        };
      })(this));
    };

    User.prototype.like = function(site, post_uri, cb) {
      if (cb == null) {
        cb = null;
      }
      this.log("Like", site, post_uri);
      this.likes[post_uri] = true;
      return this.getData(site, (function(_this) {
        return function(data) {
          data.post_like[post_uri] = Time.timestamp();
          return _this.save(data, site, function(res) {
            if (cb) {
              return cb(res);
            }
          });
        };
      })(this));
    };

    User.prototype.dislike = function(site, post_uri, cb) {
      if (cb == null) {
        cb = null;
      }
      this.log("Dislike", site, post_uri);
      delete this.likes[post_uri];
      return this.getData(site, (function(_this) {
        return function(data) {
          delete data.post_like[post_uri];
          return _this.save(data, site, function(res) {
            if (cb) {
              return cb(res);
            }
          });
        };
      })(this));
    };

    User.prototype.comment = function(site, post_uri, body, cb) {
      if (cb == null) {
        cb = null;
      }
      return this.getData(site, (function(_this) {
        return function(data) {
          data.comment.push({
            "comment_id": data.next_comment_id,
            "body": body,
            "post_uri": post_uri,
            "date_added": Time.timestamp()
          });
          data.next_comment_id += 1;
          return _this.save(data, site, function(res) {
            if (cb) {
              return cb(res);
            }
          });
        };
      })(this));
    };

    User.prototype.checkContentJson = function(cb) {
      if (cb == null) {
        cb = null;
      }
      return Page.cmd("fileGet", [this.getPath(this.hub) + "/content.json", false], (function(_this) {
        return function(res) {
          var content_json;
          content_json = JSON.parse(res);
          if (content_json.optional) {
            return cb(true);
          }
          content_json.optional = "(?!avatar).*jpg";
          return Page.cmd("fileWrite", [_this.getPath(_this.hub) + "/content.json", Text.fileEncode(content_json)], function(res_write) {
            return cb(res_write);
          });
        };
      })(this));
    };

    User.prototype.fileWrite = function(file_name, content_base64, cb) {
      if (cb == null) {
        cb = null;
      }
      if (!content_base64) {
        return typeof cb === "function" ? cb(null) : void 0;
      }
      return this.checkContentJson((function(_this) {
        return function() {
          return Page.cmd("fileWrite", [_this.getPath(_this.hub) + "/" + file_name, content_base64], function(res_write) {
            return typeof cb === "function" ? cb(res_write) : void 0;
          });
        };
      })(this));
    };

    User.prototype.post = function(body, meta, image_base64, cb) {
      if (meta == null) {
        meta = null;
      }
      if (image_base64 == null) {
        image_base64 = null;
      }
      if (cb == null) {
        cb = null;
      }
      return this.getData(this.hub, (function(_this) {
        return function(data) {
          var post;
          post = {
            "post_id": Time.timestamp() + data.next_post_id,
            "body": body,
            "date_added": Time.timestamp()
          };
          if (meta) {
            post["meta"] = Text.jsonEncode(meta);
          }
          data.post.push(post);
          data.next_post_id += 1;
          return _this.fileWrite(post.post_id + ".jpg", image_base64, function(res) {
            return _this.save(data, _this.hub, function(res) {
              if (cb) {
                return cb(res);
              }
            });
          });
        };
      })(this));
    };

    User.prototype.followUser = function(hub, auth_address, user_name, cb) {
      if (cb == null) {
        cb = null;
      }
      this.log("Following", hub, auth_address);
      this.download();
      return this.getData(this.hub, (function(_this) {
        return function(data) {
          var follow_row;
          follow_row = {
            "follow_id": data.next_follow_id,
            "hub": hub,
            "auth_address": auth_address,
            "user_name": user_name,
            "date_added": Time.timestamp()
          };
          data.follow.push(follow_row);
          _this.followed_users[hub + "/" + auth_address] = true;
          data.next_follow_id += 1;
          _this.save(data, _this.hub, function(res) {
            if (cb) {
              return cb(res);
            }
          });
          return Page.needSite(hub);
        };
      })(this));
    };

    User.prototype.unfollowUser = function(hub, auth_address, cb) {
      if (cb == null) {
        cb = null;
      }
      this.log("UnFollowing", hub, auth_address);
      delete this.followed_users[hub + "/" + auth_address];
      return this.getData(this.hub, (function(_this) {
        return function(data) {
          var follow, follow_index, i, j, len, ref;
          ref = data.follow;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            follow = ref[i];
            if (follow.hub === hub && follow.auth_address === auth_address) {
              follow_index = i;
            }
          }
          data.follow.splice(follow_index, 1);
          return _this.save(data, _this.hub, function(res) {
            if (cb) {
              return cb(res);
            }
          });
        };
      })(this));
    };

    User.prototype.handleFollowClick = function(e) {
      this.submitting_follow = true;
      if (!this.isFollowed()) {
        Animation.flashIn(e.target);
        Page.user.followUser(this.hub, this.auth_address, this.row.user_name, (function(_this) {
          return function(res) {
            _this.submitting_follow = false;
            return Page.projector.scheduleRender();
          };
        })(this));
      } else {
        Animation.flashOut(e.target);
        Page.user.unfollowUser(this.hub, this.auth_address, (function(_this) {
          return function(res) {
            _this.submitting_follow = false;
            return Page.projector.scheduleRender();
          };
        })(this));
      }
      return false;
    };

    User.prototype.download = function() {
      if (!Page.merged_sites[this.hub]) {
        return Page.cmd("mergerSiteAdd", this.hub, (function(_this) {
          return function() {
            return Page.updateSiteInfo();
          };
        })(this));
      }
    };

    User.prototype.handleDownloadClick = function(e) {
      this.download();
      return false;
    };

    User.prototype.handleMuteClick = function(e) {
      if (Page.server_info.rev < 1880) {
        Page.cmd("wrapperNotification", ["info", "You need ZeroNet 0.5.2 to use this feature."]);
        return false;
      }
      Page.cmd("muteAdd", [this.auth_address, this.row.cert_user_id, "Muted from [page](http://127.0.0.1:43110/" + Page.address + "/?" + Page.history_state.url + ")"]);
      return false;
    };

    User.prototype.renderCleanIntro = function() {
      var text;
      text = window.stripMarkdown(this.row.intro);
      text = text.split("\n");
      text = text.filter((function(_this) {
        return function(a) {
          return !!a.trim();
        };
      })(this));
      if (!text.length) {
        return '…';
      }
      return text[0];
    };

    User.prototype.renderList = function(type) {
      var classname, enterAnimation, exitAnimation, followed, link, seeding, title;
      if (type == null) {
        type = "normal";
      }
      classname = "";
      if (type === "card") {
        classname = ".card";
      }
      link = this.getLink();
      followed = this.isFollowed();
      seeding = this.isSeeding();
      if (followed) {
        title = "Unfollow";
      } else {
        title = "Follow";
      }
      if (type !== "card") {
        enterAnimation = Animation.slideDown;
        exitAnimation = Animation.slideUp;
      } else {
        enterAnimation = null;
        exitAnimation = null;
      }
      return h("div.user" + classname, {
        key: this.hub + "/" + this.auth_address,
        classes: {
          followed: followed,
          notseeding: !seeding
        },
        enterAnimation: enterAnimation,
        exitAnimation: exitAnimation
      }, [
        h("a.button.button-follow", {
          href: link,
          onclick: this.handleFollowClick,
          title: title,
          classes: {
            loading: this.submitting_follow
          }
        }, "+"), h("a", {
          href: link,
          onclick: Page.handleLinkClick
        }, this.renderAvatar()), h("div.nameline", [
          h("a.name.link", {
            href: link,
            onclick: Page.handleLinkClick
          }, this.row.user_name), type === "card" ? h("span.added", Time.since(this.row.date_added)) : void 0
        ]), this.row.followed_by ? h("div.intro.followedby", [
          "Followed by ", h("a.name.link", {
            href: "?ProfileName/" + this.row.followed_by,
            onclick: Page.handleLinkClick
          }, this.row.followed_by)
        ]) : h("div.intro", this.renderCleanIntro())
      ]);
    };

    return User;

  })(Class);

  window.User = User;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/UserList.coffee ---- */


(function() {
  var UserList,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  UserList = (function(superClass) {
    extend(UserList, superClass);

    function UserList(type1) {
      this.type = type1 != null ? type1 : "new";
      this.render = bind(this.render, this);
      this.item_list = new ItemList(User, "key");
      this.users = this.item_list.items;
      this.need_update = true;
      this.limit = 5;
      this.followed_by = null;
      this.search = null;
    }

    UserList.prototype.update = function() {
      var followed_user_addresses, followed_user_directories, key, params, query, search_where, val;
      this.loading = true;
      params = {};
      if (this.search) {
        search_where = "AND json.user_name LIKE :search_like OR user.user_name LIKE :search_like";
        params["search_like"] = "%" + this.search + "%";
      } else {
        search_where = "";
      }
      if (this.followed_by) {
        query = "SELECT user.user_name, follow.*, user.*\nFROM follow\nLEFT JOIN user USING (auth_address, hub)\nWHERE\n follow.json_id = " + this.followed_by.row.json_id + "  AND user.json_id IS NOT NULL\n\nUNION\n\nSELECT user.user_name, follow.*, user.*\nFROM follow\nLEFT JOIN json ON (json.directory = 'data/userdb/' || follow.auth_address)\nLEFT JOIN user ON (user.json_id = json.json_id)\nWHERE\n follow.json_id = " + this.followed_by.row.json_id + "  AND user.json_id IS NOT NULL AND\n follow.date_added < " + (Time.timestamp() + 120) + "\nORDER BY date_added DESC\nLIMIT " + this.limit;
      } else if (this.type === "suggested") {
        followed_user_addresses = (function() {
          var ref, results;
          ref = Page.user.followed_users;
          results = [];
          for (key in ref) {
            val = ref[key];
            results.push(key.replace(/.*\//, ""));
          }
          return results;
        })();
        followed_user_directories = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = followed_user_addresses.length; i < len; i++) {
            key = followed_user_addresses[i];
            results.push("data/users/" + key);
          }
          return results;
        })();
        if (!followed_user_addresses.length) {
          return;
        }
        query = "SELECT\n COUNT(DISTINCT(json.directory)) AS num,\n GROUP_CONCAT(DISTINCT(json.user_name)) AS followed_by,\n follow.*,\n json_suggested.avatar\nFROM follow\n LEFT JOIN json USING (json_id)\n LEFT JOIN json AS json_suggested ON (json_suggested.directory = 'data/users/' || follow.auth_address AND json_suggested.avatar IS NOT NULL)\nWHERE\n json.directory IN " + (Text.sqlIn(followed_user_directories)) + " AND\n auth_address NOT IN " + (Text.sqlIn(followed_user_addresses)) + " AND\n auth_address != '" + Page.user.auth_address + "' AND\n date_added < " + (Time.timestamp() + 120) + "\nGROUP BY follow.auth_address\nORDER BY num DESC\nLIMIT " + this.limit;
      } else if (this.type === "active") {
        query = "SELECT\n json.*,\n json.site AS json_site,\n json.directory AS json_directory,\n json.file_name AS json_file_name,\n json.cert_user_id AS json_cert_user_id,\n json.hub AS json_hub,\n json.user_name AS json_user_name,\n json.avatar AS json_avatar,\n COUNT(*) AS posts\nFROM\n post LEFT JOIN json USING (json_id)\nWHERE\n post.date_added > " + (Time.timestamp() - 60 * 60 * 24 * 7) + "\nGROUP BY json_id\nORDER BY posts DESC\nLIMIT " + this.limit;
      } else {
        query = "SELECT\n user.*,\n json.site AS json_site,\n json.directory AS json_directory,\n json.file_name AS json_file_name,\n json.cert_user_id AS json_cert_user_id,\n json.hub AS json_hub,\n json.user_name AS json_user_name,\n json.avatar AS json_avatar\nFROM\n user LEFT JOIN json USING (json_id)\nWHERE\n date_added < " + (Time.timestamp() + 120) + "\n " + search_where + "\nORDER BY date_added DESC\nLIMIT " + this.limit;
      }
      return Page.cmd("dbQuery", [query, params], (function(_this) {
        return function(rows) {
          var followed_by_displayed, i, len, row, rows_by_user, user_rows, username;
          rows_by_user = {};
          followed_by_displayed = {};
          for (i = 0, len = rows.length; i < len; i++) {
            row = rows[i];
            if (row.json_cert_user_id) {
              row.cert_user_id = row.json_cert_user_id;
              row.auth_address = row.json_directory.replace("data/userdb/", "").replace("data/users/", "");
            }
            if (!row.auth_address) {
              continue;
            }
            if (row.followed_by) {
              row.followed_by = ((function() {
                var j, len1, ref, results;
                ref = row.followed_by.split(",");
                results = [];
                for (j = 0, len1 = ref.length; j < len1; j++) {
                  username = ref[j];
                  if (!followed_by_displayed[username]) {
                    results.push(username);
                  }
                }
                return results;
              })())[0];
              followed_by_displayed[row.followed_by] = true;
            }
            row.key = row.hub + "/" + row.auth_address;
            if (!rows_by_user[row.hub + row.auth_address]) {
              rows_by_user[row.hub + row.auth_address] = row;
            }
          }
          user_rows = (function() {
            var results;
            results = [];
            for (key in rows_by_user) {
              val = rows_by_user[key];
              results.push(val);
            }
            return results;
          })();
          _this.item_list.sync(user_rows);
          _this.loading = false;
          return Page.projector.scheduleRender();
        };
      })(this));
    };

    UserList.prototype.render = function(type) {
      if (type == null) {
        type = "normal";
      }
      if (this.need_update) {
        this.need_update = false;
        setTimeout(((function(_this) {
          return function() {
            return _this.update();
          };
        })(this)), 100);
      }
      if (!this.users.length) {
        return null;
      }
      return h("div.UserList.users" + type + "." + this.type, {
        afterCreate: Animation.show
      }, this.users.map((function(_this) {
        return function(user) {
          return user.renderList(type);
        };
      })(this)));
    };

    return UserList;

  })(Class);

  window.UserList = UserList;

}).call(this);



/* ---- /1PEEPJuD41shof53g3WauQKi4k4wVe3Vzu/js/ZeroMe.coffee ---- */


(function() {
  var ZeroMe,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.h = maquette.h;

  ZeroMe = (function(superClass) {
    extend(ZeroMe, superClass);

    function ZeroMe() {
      this.queryUserdb = bind(this.queryUserdb, this);
      this.checkUser = bind(this.checkUser, this);
      this.needSite = bind(this.needSite, this);
      this.updateServerInfo = bind(this.updateServerInfo, this);
      this.updateSiteInfo = bind(this.updateSiteInfo, this);
      this.otherClasses = bind(this.otherClasses, this);
      this.onOpenWebsocket = bind(this.onOpenWebsocket, this);
      this.handleLinkClick = bind(this.handleLinkClick, this);
      this.renderContent = bind(this.renderContent, this);
      return ZeroMe.__super__.constructor.apply(this, arguments);
    }

    ZeroMe.prototype.init = function() {
      this.params = {};
      this.merged_sites = {};
      this.site_info = null;
      this.server_info = null;
      this.address = null;
      this.user = false;
      this.user_loaded = false;
      this.userdb = "1UDbADib99KE9d3qZ87NqJF2QLTHmMkoV";
      this.cache_time = Time.timestamp();
      this.on_site_info = new Promise();
      this.on_local_storage = new Promise();
      this.on_user_info = new Promise();
      this.on_loaded = new Promise();
      this.local_storage = null;
      this.local_storage_loaded = false;
      this.loadLocalStorage();
      return this.on_site_info.then((function(_this) {
        return function() {
          _this.checkUser(function() {
            return _this.on_user_info.resolve();
          });
          if (indexOf.call(_this.site_info.settings.permissions, "Merger:ZeroMe") < 0) {
            return _this.cmd("wrapperPermissionAdd", "Merger:ZeroMe", function() {
              return _this.updateSiteInfo(function() {
                return _this.content.update();
              });
            });
          }
        };
      })(this));
    };

    ZeroMe.prototype.changeTitle = function(title) {
      var ref, ref1, suffix;
      suffix = ((ref = this.site_info) != null ? (ref1 = ref.content) != null ? ref1.title : void 0 : void 0) || "ZeroMe";
      if (title) {
        return Page.cmd("wrapperSetTitle", title + " | " + suffix);
      } else {
        return Page.cmd("wrapperSetTitle", "" + suffix);
      }
    };

    ZeroMe.prototype.createProjector = function() {
      var url;
      this.projector = maquette.createProjector();
      this.head = new Head();
      this.overlay = new Overlay();
      this.content_feed = new ContentFeed();
      this.content_users = new ContentUsers();
      this.content_settings = new ContentSettings();
      this.content_donate = new ContentDonate();
      this.content_badges = new ContentBadges();
      this.content_profile = new ContentProfile();
      this.content_create_profile = new ContentCreateProfile();
      this.scrollwatcher = new Scrollwatcher();
      if (base.href.indexOf("?") === -1) {
        this.route("");
      } else {
        url = base.href.replace(/.*?\?/, "");
        this.route(url);
        this.history_state["url"] = url;
      }
      this.on_loaded.then((function(_this) {
        return function() {
          _this.log("onloaded");
          return window.requestAnimationFrame(function() {
            return document.body.className = "loaded" + _this.otherClasses();
          });
        };
      })(this));
      this.projector.replace($("#Head")[0], this.head.render);
      this.projector.replace($("#Overlay")[0], this.overlay.render);
      return setInterval((function() {
        return Page.projector.scheduleRender();
      }), 60 * 1000);
    };

    ZeroMe.prototype.renderContent = function() {
      if (this.site_info) {
        return h("div#Content", this.content.render());
      } else {
        return h("div#Content");
      }
    };

    ZeroMe.prototype.route = function(query) {
      var changed, content;
      this.params = Text.queryParse(query);
      this.log("Route", this.params);
      if (!this.params.urls) {
        content = {
          update: function() {
            return false;
          },
          render: function() {
            return false;
          }
        };
        return this.setUrl("?Home");
      } else if (this.params.urls[0] === "Create+profile") {
        content = this.content_create_profile;
      } else if (this.params.urls[0] === 'Users' && (content = this.content_users)) {

      } else if (this.params.urls[0] === 'Settings') {
        content = this.content_settings;
      } else if (this.params.urls[0] === 'Donate') {
        content = this.content_donate;
      } else if (this.params.urls[0] === 'Badges') {
        content = this.content_badges;
      } else if (this.params.urls[0] === "ProfileName") {
        this.content_profile.findUser(this.params.urls[1], (function(_this) {
          return function(user) {
            return _this.setUrl(user.getLink(), "replace");
          };
        })(this));
      } else if (this.params.urls[0] === "Profile") {
        content = this.content_profile;
        changed = this.content_profile.auth_address !== this.params.urls[2];
        this.content_profile.setUser(this.params.urls[1], this.params.urls[2]).filter(null);
      } else if (this.params.urls[0] === "Post") {
        content = this.content_profile;
        changed = this.content_profile.auth_address !== this.params.urls[2] || this.content_profile.filter_post_id !== this.params.urls[3];
        this.content_profile.setUser(this.params.urls[1], this.params.urls[2]).filter(this.params.urls[3]);
      } else {
        content = this.content_feed;
      }
      if (content && (this.content !== content || changed)) {
        if (this.content) {
          setTimeout(((function(_this) {
            return function() {
              return _this.content.update();
            };
          })(this)), 100);
          this.projector.detach(this.content.render);
        }
        this.content = content;
        return this.on_user_info.then((function(_this) {
          return function() {
            return _this.projector.replace($("#Content")[0], _this.content.render);
          };
        })(this));
      }
    };

    ZeroMe.prototype.setUrl = function(url, mode) {
      if (mode == null) {
        mode = "push";
      }
      url = url.replace(/.*?\?/, "");
      this.log("setUrl", this.history_state["url"], "->", url);
      if (this.history_state["url"] === url) {
        this.content.update();
        return false;
      }
      this.history_state["url"] = url;
      if (mode === "replace") {
        this.cmd("wrapperReplaceState", [this.history_state, "", url]);
      } else {
        this.cmd("wrapperPushState", [this.history_state, "", url]);
      }
      this.route(url);
      return false;
    };

    ZeroMe.prototype.handleLinkClick = function(e) {
      if (e.which === 2) {
        return true;
      } else {
        this.log("save scrollTop", window.pageYOffset);
        this.history_state["scrollTop"] = window.pageYOffset;
        this.cmd("wrapperReplaceState", [this.history_state, null]);
        window.scroll(window.pageXOffset, 0);
        this.history_state["scrollTop"] = 0;
        this.on_loaded.resolved = false;
        document.body.className = "" + this.otherClasses();
        this.setUrl(e.currentTarget.search);
        return false;
      }
    };

    ZeroMe.prototype.createUrl = function(key, val) {
      var params, vals;
      params = JSON.parse(JSON.stringify(this.params));
      if (typeof key === "Object") {
        vals = key;
        for (key in keys) {
          val = keys[key];
          params[key] = val;
        }
      } else {
        params[key] = val;
      }
      return "?" + Text.queryEncode(params);
    };

    ZeroMe.prototype.loadLocalStorage = function() {
      return this.on_site_info.then((function(_this) {
        return function() {
          _this.logStart("Loaded localstorage");
          return _this.cmd("wrapperGetLocalStorage", [], function(local_storage) {
            var base1, base2, ref, ref1, ref2;
            _this.local_storage = local_storage;
            _this.logEnd("Loaded localstorage");
            _this.local_storage_loaded = true;
                        if ((ref = _this.local_storage) != null) {
              ref;
            } else {
              _this.local_storage = {};
            };
                        if ((ref1 = (base1 = _this.local_storage).followed_users) != null) {
              ref1;
            } else {
              base1.followed_users = {};
            };
                        if ((ref2 = (base2 = _this.local_storage).settings) != null) {
              ref2;
            } else {
              base2.settings = {};
            };
            return _this.on_local_storage.resolve(_this.local_storage);
          });
        };
      })(this));
    };

    ZeroMe.prototype.saveLocalStorage = function(cb) {
      if (cb == null) {
        cb = null;
      }
      this.logStart("Saved localstorage");
      if (this.local_storage) {
        return this.cmd("wrapperSetLocalStorage", this.local_storage, (function(_this) {
          return function(res) {
            _this.logEnd("Saved localstorage");
            return typeof cb === "function" ? cb(res) : void 0;
          };
        })(this));
      }
    };

    ZeroMe.prototype.onOpenWebsocket = function(e) {
      this.updateSiteInfo();
      return this.updateServerInfo();
    };

    ZeroMe.prototype.otherClasses = function() {
      var res;
      res = [];
      if (!this.getSetting("transparent")) {
        res.push("no-transparent");
      }
      if (this.getSetting("logo_left")) {
        res.push("logo-left");
      }
      if (!this.getSetting("not_sticky_header")) {
        res.push("sticky-header");
      }
      if (res.length) {
        return " " + res.join(" ");
      } else {
        return "";
      }
    };

    ZeroMe.prototype.updateSiteInfo = function(cb) {
      var on_site_info;
      if (cb == null) {
        cb = null;
      }
      on_site_info = new Promise();
      this.cmd("mergerSiteList", {}, (function(_this) {
        return function(merged_sites) {
          _this.merged_sites = merged_sites;
          return on_site_info.then(function() {
            if (indexOf.call(_this.site_info.settings.permissions, "Merger:ZeroMe") >= 0 && !_this.merged_sites[_this.userdb]) {
              _this.cmd("mergerSiteAdd", _this.userdb);
            }
            return typeof cb === "function" ? cb(true) : void 0;
          });
        };
      })(this));
      return this.cmd("siteInfo", {}, (function(_this) {
        return function(site_info) {
          _this.address = site_info.address;
          _this.setSiteInfo(site_info);
          return on_site_info.resolve();
        };
      })(this));
    };

    ZeroMe.prototype.updateServerInfo = function() {
      return this.cmd("serverInfo", {}, (function(_this) {
        return function(server_info) {
          return _this.setServerInfo(server_info);
        };
      })(this));
    };

    ZeroMe.prototype.needSite = function(address, cb) {
      if (this.merged_sites[address]) {
        return typeof cb === "function" ? cb(true) : void 0;
      } else {
        return Page.cmd("mergerSiteAdd", address, cb);
      }
    };

    ZeroMe.prototype.checkUser = function(cb) {
      if (cb == null) {
        cb = null;
      }
      this.log("Find hub for user", this.site_info.cert_user_id);
      if (!this.site_info.cert_user_id) {
        this.user = new AnonUser();
        this.user.updateInfo(cb);
        return false;
      }
      return Page.cmd("dbQuery", [
        "SELECT * FROM json WHERE directory = :directory AND user_name IS NOT NULL AND file_name = 'data.json' AND intro IS NOT NULL", {
          directory: "data/users/" + this.site_info.auth_address
        }
      ], (function(_this) {
        return function(res) {
          var i, len, row;
          if ((res != null ? res.length : void 0) > 0) {
            _this.user = new User({
              hub: res[0]["hub"],
              auth_address: _this.site_info.auth_address
            });
            _this.user.row = res[0];
            for (i = 0, len = res.length; i < len; i++) {
              row = res[i];
              if (row.site === row.hub) {
                _this.user.row = row;
              }
            }
            _this.log("Choosen site for user", _this.user.row.site, _this.user.row);
            _this.user.updateInfo(cb);
          } else {
            _this.user = new AnonUser();
            _this.user.updateInfo();
            _this.queryUserdb(_this.site_info.auth_address, function(user) {
              if (user) {
                if (!_this.merged_sites[user.hub]) {
                  _this.log("Profile not seeded, but found in the userdb", user);
                  return Page.cmd("mergerSiteAdd", user.hub, function() {
                    return typeof cb === "function" ? cb(true) : void 0;
                  });
                } else {
                  return typeof cb === "function" ? cb(true) : void 0;
                }
              } else {
                return typeof cb === "function" ? cb(false) : void 0;
              }
            });
          }
          return Page.projector.scheduleRender();
        };
      })(this));
    };

    ZeroMe.prototype.queryUserdb = function(auth_address, cb) {
      var query;
      query = "SELECT\n CASE WHEN user.auth_address IS NULL THEN REPLACE(json.directory, \"data/userdb/\", \"\") ELSE user.auth_address END AS auth_address,\n CASE WHEN user.cert_user_id IS NULL THEN json.cert_user_id ELSE user.cert_user_id END AS cert_user_id,\n *\nFROM user\nLEFT JOIN json USING (json_id)\nWHERE\n user.auth_address = :auth_address OR\n json.directory = :directory\nLIMIT 1";
      return Page.cmd("dbQuery", [
        query, {
          auth_address: auth_address,
          directory: "data/userdb/" + auth_address
        }
      ], (function(_this) {
        return function(res) {
          if ((res != null ? res.length : void 0) > 0) {
            return typeof cb === "function" ? cb(res[0]) : void 0;
          } else {
            return typeof cb === "function" ? cb(false) : void 0;
          }
        };
      })(this));
    };

    ZeroMe.prototype.getSetting = function(key) {
      var ref, ref1;
      if ((ref = this.local_storage) != null ? (ref1 = ref.settings) != null ? ref1[key] : void 0 : void 0) {
        return true;
      } else if (!this.local_storage_loaded) {
        return this.log("WARN: Getting setting " + key + " but storage has not been loaded yet");
      } else {
        return false;
      }
    };

    ZeroMe.prototype.onRequest = function(cmd, params) {
      if (cmd === "setSiteInfo") {
        return this.setSiteInfo(params);
      } else if (cmd === "wrapperPopState") {
        if (params.state) {
          if (!params.state.url) {
            params.state.url = params.href.replace(/.*\?/, "");
          }
          this.on_loaded.resolved = false;
          document.body.className = "" + this.otherClasses();
          window.scroll(window.pageXOffset, params.state.scrollTop || 0);
          return this.route(params.state.url || "");
        }
      } else {
        return this.log("Unknown command", cmd, params);
      }
    };

    ZeroMe.prototype.setSiteInfo = function(site_info) {
      var file_name, ref, ref1, ref2;
      if (site_info.address === this.address) {
        if (!this.site_info) {
          this.site_info = site_info;
          this.on_site_info.resolve();
        }
        this.site_info = site_info;
        if (((ref = site_info.event) != null ? ref[0] : void 0) === "cert_changed") {
          this.checkUser((function(_this) {
            return function(found) {
              if (Page.site_info.cert_user_id && !found) {
                _this.setUrl("?Create+profile");
              }
              if (Page.site_info.cert_user_id) {
                Page.head.follows["Mentions"] = true;
                Page.head.follows["Comments on your posts"] = true;
                Page.head.saveFollows();
              }
              return _this.content.update();
            };
          })(this));
        }
      }
      if (((ref1 = site_info.event) != null ? ref1[0] : void 0) === "file_done") {
        file_name = site_info.event[1];
        if (file_name.indexOf(site_info.auth_address) !== -1 && ((ref2 = Page.user) != null ? ref2.auth_address : void 0) !== site_info.auth_address) {
          return this.checkUser((function(_this) {
            return function() {
              return _this.content.update();
            };
          })(this));
        } else if (!this.merged_sites[site_info.address] && site_info.address !== this.address) {
          this.log("New site added:", site_info.address);
          return this.updateSiteInfo((function(_this) {
            return function() {
              return _this.content.update();
            };
          })(this));
        } else if (file_name.indexOf(site_info.auth_address) !== -1) {
          return this.content.update();
        } else if (!file_name.endsWith("content.json") || file_name.indexOf(this.userdb) !== -1) {
          if (site_info.tasks > 100) {
            return RateLimit(3000, this.content.update);
          } else if (site_info.tasks > 20) {
            return RateLimit(1000, this.content.update);
          } else {
            return RateLimit(500, this.content.update);
          }
        }
      }
    };

    ZeroMe.prototype.setServerInfo = function(server_info) {
      this.server_info = server_info;
      if (this.server_info.rev < 1400) {
        this.cmd("wrapperNotification", ["error", "This site requries ZeroNet 0.4.0+<br>Please delete the site from your current client, update it, then add again!"]);
      }
      return this.projector.scheduleRender();
    };

    ZeroMe.prototype.returnFalse = function() {
      return false;
    };

    return ZeroMe;

  })(ZeroFrame);

  window.Page = new ZeroMe();

  window.Page.createProjector();

}).call(this);

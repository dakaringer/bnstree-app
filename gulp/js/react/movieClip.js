!function(a,b){"use strict";function c(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}a.movieClip=function(a){function d(){var a="0px"!==f.width?-((j-1)*f.width)+"px":f.width,b="0px"!==f.height?-((j-1)*f.height)+"px":f.height;h.css({backgroundPosition:a+" "+b})}function e(){null!==i&&(clearInterval(i),i=null)}if(a.selector){var f=c({selector:"",frameRate:30,width:"0px",height:"0px",max:30},a);f.frameRate=Math.floor(1e3/f.frameRate);var g=this,h=b(f.selector),i=null,j=1;g.play=function(a){null!==i&&g.stop();var b=c({speed:1,start:null,end:null,loop:!1,callback:null,param:null},a);null!==b.start&&(j=b.start),null!==b.end&&j>b.end&&b.speed>0&&(b.speed=-1),d(),i=setInterval(function(){j+=b.speed,null!==b.end&&(b.speed>0&&j>=b.end||b.speed<0&&j<=b.end)&&(j=b.end,e(),null!==b.callback&&b.callback(b.param)),b.speed>0?j>=f.max&&(b.loop?j>f.max&&(j=1):(j=f.max,e(),null!==b.callback&&b.callback(b.param))):b.speed<0&&1>=j&&(b.loop?1>j&&(j=f.max):(j=1,e(),null!==b.callback&&b.callback(b.param))),d()},f.frameRate)},g.stop=function(a){e();var b=c({end:j},a);j=b.end,d()}}}}(this,jQuery);
var W = new movieClip({
    selector: ".loading-img",
    frameRate: 16,
    width: 0,
    height: 64,
    max: 16
});
W.play({
    loop: !0
});
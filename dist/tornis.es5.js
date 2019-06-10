!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i(exports):"function"==typeof define&&define.amd?define(["exports"],i):(t=t||self,i(t.tornis={}))}(this,function(t){"use strict";function i(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}function s(t,i){for(var s=0;s<i.length;s++){var e=i[s];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}function e(t,i,e){return i&&s(t.prototype,i),e&&s(t,e),t}function h(t,i){var s=0;return function(){var e=(new Date).getTime();if(!(e-s<t))return s=e,i.apply(void 0,arguments)}}function o(t){return Math.floor(t.reduce(function(t,i){return t+i},0)/t.length)}var a="undefined"==typeof window,n=new(function(){function t(){i(this,t),a||(this.lastX=0,this.lastY=0,this.lastWidth=window.innerWidth,this.lastHeight=window.innerHeight,this.lastMouseX=0,this.lastMouseY=0,this.scrollHeight=document.body.scrollHeight,this.scrollChange=!1,this.sizeChange=!1,this.mouseChange=!1,this.currX=0,this.currY=0,this.currWidth=window.innerWidth,this.currHeight=window.innerHeight,this.currMouseX=0,this.currMouseY=0,this.mouseXVelocity=[],this.mouseYVelocity=[],this.lastMouseXVelocity=0,this.lastMouseYVelocity=0,this.updating=!1,this.callbacks=[],this.update=this.update.bind(this),this.handleResize=this.handleResize.bind(this),this.handleMouse=this.handleMouse.bind(this),this.formatData=this.formatData.bind(this),this.watch=this.watch.bind(this),this.unwatch=this.unwatch.bind(this),this.handleResize=h(110,this.handleResize),this.handleMouse=h(75,this.handleMouse),window.addEventListener("resize",this.handleResize),window.addEventListener("mousemove",this.handleMouse),requestAnimationFrame(this.update))}return e(t,[{key:"handleResize",value:function(t){this.currWidth=window.innerWidth,this.currHeight=window.innerHeight}},{key:"handleMouse",value:function(t){this.currMouseX=t.clientX,this.currMouseY=t.clientY}},{key:"formatData",value:function(){return{scroll:{changed:this.scrollChange,left:Math.floor(this.lastX),right:Math.floor(this.lastX+this.lastWidth),top:Math.floor(this.lastY),bottom:Math.floor(this.lastY+this.lastHeight),velocity:{x:Math.floor(this.scrollXVelocity)||0,y:Math.floor(this.scrollYVelocity)||0}},size:{changed:this.sizeChange,x:Math.floor(this.lastWidth),y:Math.floor(this.lastHeight),docY:Math.floor(this.scrollHeight)},mouse:{changed:this.mouseChange,x:Math.floor(this.lastMouseX),y:Math.floor(this.lastMouseY),velocity:{x:Math.floor(this.lastMouseXVelocity)||0,y:Math.floor(this.lastMouseYVelocity)||0}}}}},{key:"update",value:function(){var t=this,i=this.currWidth,s=this.currHeight,e=this.currMouseX,h=this.currMouseY;if(this.updating)return!1;this.scrollChange=this.sizeChange=this.mouseChange=!1,window.pageXOffset==this.lastX&&0!=this.scrollXVelocity&&(this.scrollXVelocity=0,this.scrollChange=!0),window.pageYOffset==this.lastY&&0!=this.scrollYVelocity&&(this.scrollYVelocity=0,this.scrollChange=!0),window.pageXOffset!=this.lastX&&(this.scrollChange=!0,this.scrollXVelocity=Math.floor(window.pageXOffset-this.lastX),this.lastX=window.pageXOffset),window.pageYOffset!=this.lastY&&(this.scrollChange=!0,this.scrollYVelocity=Math.floor(window.pageYOffset-this.lastY),this.lastY=window.pageYOffset),i!=this.lastWidth&&(this.lastWidth=i,this.scrollHeight=document.body.scrollHeight,this.sizeChange=!0),s!=this.lastHeight&&(this.lastHeight=s,this.sizeChange=!0),this.mouseXVelocity.length>5&&this.mouseXVelocity.shift(),this.mouseXVelocity.push(e-this.lastMouseX),o(this.mouseXVelocity)!=this.lastMouseXVelocity&&(this.lastMouseXVelocity=o(this.mouseXVelocity),this.mouseChange=!0),e!=this.lastMouseX&&(this.lastMouseX=e,this.mouseChange=!0),this.mouseYVelocity.length>5&&this.mouseYVelocity.shift(),this.mouseYVelocity.push(h-this.lastMouseY),o(this.mouseYVelocity)!=this.lastMouseYVelocity&&(this.lastMouseYVelocity=o(this.mouseYVelocity),this.mouseChange=!0),h==this.lastMouseY&&0==o(this.mouseYVelocity)||(this.lastMouseY=h,this.mouseChange=!0),(this.scrollChange||this.sizeChange||this.mouseChange)&&this.callbacks.forEach(function(i){return i(t.formatData())}),this.updating=!1,requestAnimationFrame(this.update)}},{key:"watch",value:function(t){var i=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if("function"!=typeof t)throw new Error("Value passed to Watch is not a function");if(!a){if(i){var s=this.formatData();s.scroll.changed=!0,s.mouse.changed=!0,s.size.changed=!0,t(s)}this.callbacks.push(t)}}},{key:"unwatch",value:function(t){if("function"!=typeof t)throw new Error("The value passed to unwatch is not a function");a||(this.callbacks=this.callbacks.filter(function(i){return i!==t}))}}]),t}());a||(window.__TORNIS={watchViewport:n.watch,unwatchViewport:n.unwatch,getViewportState:n.formatData});var l=n.watch,r=n.unwatch,u=n.formatData;t.getViewportState=u,t.unwatchViewport=r,t.watchViewport=l,Object.defineProperty(t,"__esModule",{value:!0})});

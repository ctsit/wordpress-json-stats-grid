!function(e){function t(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});n(1)},function(e,t,n){"use strict";function r(e){return fetch(e).then(function(e){return e.json()}).then(function(e){if(e.success&&e.data&&1===e.data.length)return e.data})}function a(e){return e.stats?Object.keys(e.stats).map(function(t){return wp.element.createElement(f,{label:t,help:"Text that will appear after this metric",value:e.fieldNames[t],onChange:function(n){return e.onChange({newValue:n,key:t})}})}):"Please enter a valid URL"}function l(e){try{return e.hasOwnProperty("stats")?Object.keys(e.fieldNames).map(function(t){return wp.element.createElement("div",{class:"grid-item",id:t},e.stats[t]," ",e.fieldNames[t]," ")}):Object.keys(e.fieldNames).map(function(t){return wp.element.createElement("div",{class:"grid-item",id:t},e.fieldNames[t]," ")})}catch(e){return"Please enter a valid URL"}}var i=n(2),o=(n.n(i),n(3)),__=(n.n(o),wp.i18n.__),s=wp.blocks.registerBlockType,c=wp.editor,u=c.InspectorControls,m=c.PanelColorSettings,d=wp.components,p=d.PanelBody,f=(d.PanelRow,d.TextControl);s("cgb/block-redcap-stats-plugin",{title:__("JSON Stats Grid"),icon:"chart-line",category:"common",keywords:[__("redcap-stats-plugin \u2014 CGB Block"),__("CGB Example"),__("create-guten-block")],attributes:{endpoint:{type:"string",default:""},stats:{type:"object"},fieldNames:{type:"object",default:{}},bgColor:{type:"string",default:""},textColor:{type:"string",default:""}},edit:function(e){function t(t){e.setAttributes({endpoint:t}),r(t).then(function(t){e.setAttributes({stats:t[0]})})}function n(t){var n=t.key,r=t.newValue;try{var a=Object.assign({},e.attributes.fieldNames);""===r?delete a[n]:a[n]=r,e.setAttributes({fieldNames:a})}catch(t){e.setAttributes({fieldNames:{}})}}return[wp.element.createElement(u,null,wp.element.createElement(m,{title:__("Background Color","tar"),icon:"admin-appearance",colorSettings:[{value:e.attributes.bgColor,onChange:function(t){return e.setAttributes({bgColor:t})},label:__("Color","tar")}]}),wp.element.createElement(m,{title:__("Text Color","tar"),icon:"admin-customizer",colorSettings:[{value:e.attributes.textColor,onChange:function(t){return e.setAttributes({textColor:t})},label:__("Color","tar")}]}),wp.element.createElement(p,{title:"Set Field Names",icon:"edit"},wp.element.createElement(a,{stats:e.attributes.stats,fieldNames:e.attributes.fieldNames,onChange:n}))),wp.element.createElement(React.Fragment,null,wp.element.createElement(f,{label:"API endpoint",help:"The URL for your JSON data",value:e.attributes.endpoint,onChange:t}),wp.element.createElement("div",{className:e.className,style:{backgroundColor:e.attributes.bgColor,color:e.attributes.textColor}},wp.element.createElement("p",{hidden:!0,id:"expose-endpoint-hack"},e.attributes.endpoint),wp.element.createElement("div",{id:"rcmetrics"},wp.element.createElement(l,{fieldNames:e.attributes.fieldNames,stats:e.attributes.stats}))))]},save:function(e){return wp.element.createElement(React.Fragment,null,wp.element.createElement("div",{className:e.className,style:{backgroundColor:e.attributes.bgColor,color:e.attributes.textColor}},wp.element.createElement("p",{hidden:!0,id:"expose-endpoint-hack"},e.attributes.endpoint),wp.element.createElement("div",{id:"rcmetrics"},wp.element.createElement(l,{fieldNames:e.attributes.fieldNames}))))}})},function(e,t){},function(e,t){}]);
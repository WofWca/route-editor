(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{1:function(e,t,n){"use strict";(function(e){var n=e.ymaps;t.a=n}).call(this,n(4))},12:function(e,t,n){e.exports=n(21)},17:function(e,t,n){},20:function(e,t,n){},21:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),i=n(5),r=n.n(i),s=(n(17),n(2)),c=n.n(s),u=n(6),p=n(7),d=n(8),l=n(10),m=n(9),f=n(11),g=(n(20),n(1)),h=function(e){function t(e){var n;return Object(p.a)(this,t),(n=Object(l.a)(this,Object(m.a)(t).call(this,e))).handlePointListItemDragEnd=function(e){n._draggedPoint=null},n.handlePointListItemDragStart=function(e,t){n._draggedPoint=t,e.dataTransfer.setData("text","Stub data")},n.handlePointListItemDrop=function(e,t){e.preventDefault(),n._draggedPoint&&n.setState(function(e,a){var o=e.points.slice(),i=e.points.indexOf(t),r=e.points.indexOf(n._draggedPoint);return o.splice(r,1),o.splice(i,0,n._draggedPoint),{points:o}})},n.removePoint=function(e){n.setState(function(t,a){var o=t.points.slice(),i=t.points[e];return o.splice(e,1),n.map.geoObjects.remove(i.ymapsObj),{points:o}})},n.handleNewPointSubmit=function(e){e.preventDefault();var t=n.state.newPointName;n.setState(function(e,a){var o=e.points.slice(),i=n.nextPointId;n.nextPointId++;var r=new g.a.GeoObject({geometry:{type:"Point",coordinates:n.map.getCenter()},properties:{balloonContent:t,hintContent:"Loading..."}},{draggable:!0});function s(e){return p.apply(this,arguments)}function p(){return(p=Object(u.a)(c.a.mark(function e(t){var n;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,g.a.geocode(t.geometry.getBounds()[0]);case 3:n=e.sent,t.properties.set({hintContent:n.geoObjects.get(0).getAddressLine()}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),t.properties.set({hintContent:"Error"});case 10:case"end":return e.stop()}},e,this,[[0,7]])}))).apply(this,arguments)}return s(r),r.events.add("geometrychange",function(){n.mapRefreshRoute()}),r.events.add("dragend",function(e){s(e.get("target"))}),r.events.add("dragstart",function(e){e.get("target").properties.set({hintContent:"Loading..."})}),n.map.geoObjects.add(r),o.push({id:i,name:t,ymapsObj:r}),{points:o,newPointName:""}})},n.mapRefreshRoute=function(){var e=[],t=!0,a=!1,o=void 0;try{for(var i,r=n.state.points[Symbol.iterator]();!(t=(i=r.next()).done);t=!0){var s=i.value.ymapsObj.geometry.getBounds()[0];e.push(s)}}catch(c){a=!0,o=c}finally{try{t||null==r.return||r.return()}finally{if(a)throw o}}n.ymapsRouteObj.geometry.setCoordinates(e)},n.handleNewPointNameChange=function(e){n.setState({newPointName:e.target.value})},n.state={newPointName:"",points:[],mapReady:!1},n.map=void 0,n.nextPointId=1,n.ymapsRouteObj=void 0,n.newPointNameInput=o.a.createRef(),n}return Object(f.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){var e=this;return o.a.createElement("div",{className:"App"},o.a.createElement("div",{className:"points-editor"},o.a.createElement("form",{onSubmit:this.handleNewPointSubmit},o.a.createElement("legend",null,"New waypoint"),o.a.createElement("input",{disabled:!this.state.mapReady,required:!0,autoFocus:!0,type:"text",placeholder:"Name",value:this.state.newPointName,onChange:this.handleNewPointNameChange,ref:this.newPointNameInput})),o.a.createElement("ol",{className:"points-list"},this.state.points.map(function(t,n){return o.a.createElement("li",{key:t.id,draggable:!0,onDragStart:function(n){return e.handlePointListItemDragStart(n,t)},onDragOver:e.allowDrop,onDrop:function(n){return e.handlePointListItemDrop(n,t)},onDragEnd:e.handlePointListItemDragEnd,className:"point"},o.a.createElement("span",{className:"point-name"},t.name),o.a.createElement("button",{onClick:function(t){return e.removePoint(n)},className:"delete"},"X"))}))),o.a.createElement("div",{id:"map",className:"map"}))}},{key:"allowDrop",value:function(e){e.preventDefault()}},{key:"componentDidMount",value:function(){var e=this;g.a.ready(function(){e.setState({mapReady:!0}),e.map=new g.a.Map("map",{center:[55.76,37.64],zoom:10}),e.ymapsRouteObj=new g.a.Polyline([]),e.map.geoObjects.add(e.ymapsRouteObj),e.map.events.add("actionbegin",function(){e.newPointNameInput.current.focus()})})}},{key:"componentDidUpdate",value:function(e,t,n){this.state.points!==t.points&&this.mapRefreshRoute()}}]),t}(a.Component);r.a.render(o.a.createElement(h,null),document.getElementById("root"))}},[[12,1,2]]]);
//# sourceMappingURL=main.1f6d7e4d.chunk.js.map
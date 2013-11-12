"use strict";angular.module("yoAngularApp",["myApp.config","myApp.services","myApp.filters","firebase","MainCtrl","BoxCtrl","BoxDocCtrl","RptMainCtrl","ResourcesCtrl"]).config(["$routeProvider",function(a){a.when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/logout",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/list",{authRequired:!0,templateUrl:"views/list.html",controller:"DbCtrl"}).when("/box/add",{authRequired:!0,templateUrl:"views/boxdoc.html",controller:"DbBoxCtrl"}).when("/box/:id",{authRequired:!0,templateUrl:"views/boxdoc.html",controller:"DbBoxCtrl"}).when("/box/:boxid/doc/add",{authRequired:!0,templateUrl:"views/doc.html",controller:"DbDocCtrl"}).when("/box/:boxid/doc/:docid",{authRequired:!0,templateUrl:"views/doc.html",controller:"DbDocCtrl"}).when("/rpt/checkout",{authRequired:!0,templateUrl:"views/rpt/rptmain.html",controller:"RptMainCtrl"}).when("/rpt/destruct",{authRequired:!0,templateUrl:"views/rpt/rptmain.html",controller:"RptMainCtrl"}).when("/rpt/retention",{authRequired:!0,templateUrl:"views/rpt/rptmain.html",controller:"RptMainCtrl"}).when("/rpt/inventory",{authRequired:!0,templateUrl:"views/rpt/rptmain.html",controller:"RptMainCtrl"}).when("/resources/:type",{authRequired:!0,templateUrl:"views/resources.html",controller:"ResourcesCtrl"}).when("/resources/:type/:id",{authRequired:!0,templateUrl:"views/resources.html",controller:"ResourcesCtrl"}).when("/resources/:type/add",{authRequired:!0,templateUrl:"views/resources.html",controller:"ResourcesCtrl"}).when("/resources",{authRequired:!0,redirectTo:"/resources/doctype"}).otherwise({redirectTo:"/list"})}]).run(["angularFireAuth","FBURL","Firebase","$rootScope",function(a,b,c,d){var e=new c(b);a.initialize(e,{scope:d,name:"auth",path:"/login"})}]),angular.module("myApp.config",[]).constant("version","0.1").constant("FBURL","https://docbox1.firebaseio.com"),angular.module("MainCtrl",[]).controller("DbCtrl",["$scope","fbService","FBURL","Firebase","angularFire","angularFireCollection","$routeParams","$location",function(a,b,c,d,e,f,g,h){a.location=h,a.path=a.location.path(),a.list=[];var i=new d(c+"/box");a.list=f(i),a.showBox=function(){return!0},a.editBox=function(b){a.editedBox=a.list[b],h.path("/box/"+a.editedBox.$id)}}]).controller("LoginCtrl",["$scope","LoginService","$location",function(a,b,c){function d(){a.loginService.logout("/logout")}a.location=c,a.path=a.location.path(),a.loginService=b,/logout/g.test(a.path)&&d(),a.login=function(){a.loginService.login(a.email,a.pass,"#/list",function(){})},a.createProfile=function(){}}]),angular.module("BoxCtrl",[]).controller("BoxCtrl",["$scope","$location","$routeParams","$http","Dbservice",function(a,b,c,d,e){a.location=b,/add/g.test(a.location.path())?a.box={isAdd:!0,docs:[]}:e.getBox(a,c.id)}]).controller("DbBoxCtrl",["$scope","$routeParams","FBURL","Firebase","angularFire","angularFireCollection","$location","util.types",function(a,b,c,d,e,f,g,h){function i(a){return a=a||{},{location:a.location||"",barcode:a.barcode||"",desc:a.desc||"",docs:a.docs||[]}}function j(){var b=new d(c).root().child("/box/"+a.boxid);a._boxref=e(b,a,"box",{}),a._boxref.then(function(){a.boxUpdate=angular.copy(a.box)})}function k(){a.boxUpdate;var b=new d(c).root().child("/box");a.list=f(b),a.list.add(a.boxUpdate)}a.utilTypes=h,a.location=g,a.boxid=b.id,a.isNew=!1,a.box={},a.boxUpdate=i(),/add/g.test(a.location.path())?a.isNew=!0:j(),a.save=function(){a.isNew?k():angular.copy(a.boxUpdate,a.box)}}]),angular.module("BoxDocCtrl",[]).controller("DbDocCtrl",["$scope","$routeParams","FBURL","Firebase","angularFire","angularFireCollection","$location","myapp.util","util.types",function(a,b,c,d,e,f,g,h,i){function j(){var b=l.child("docs").child(a.docid);a._docref=e(b,a,"doc",{}),a._docref.then(function(){a.docUpdate=angular.copy(a.doc)})}function k(){a.docUpdate.created=h.formatDBDate(new Date),a._docs=[];var b=l.child("docs"),c=f(b);c.add?c.add(a.docUpdate):c.push(a.docUpdate)}a.utilTypes=i,a.location=g,a.path=a.location.path(),a.boxid=b.boxid,a.docid=b.docid,a.doc={created:new Date},a.docUpdate={};var l=new d(c).root().child("/box/"+a.boxid);/add/g.test(a.path)?(a.isNew=!0,angular.copy(a.doc,a.docUpdate)):j(),a.update=function(){a.isNew?k():angular.copy(a.docUpdate,a.doc)}}]),angular.module("RptMainCtrl",[]).controller("RptMainCtrl",["$scope","$routeParams","$http","$location","FBURL","Firebase","angularFire","angularFireCollection","myapp.util",function(a,b,c,d,e,f,g,h,i){function j(){/checkout/g.test(a.path)?(a.isCheckout=!0,k(function(a){return!a.destroyed&&!a.checkin&&a.checkout&&a.checkoutby})):/destruct/g.test(a.path)?(a.isDestruct=!0,k(function(a){return a.destroyed})):/retention/g.test(a.path)?a.isRetention=!0:/inventory/g.test(a.path)&&(a.isInventory=!0,k(function(){return!0})),a.noRecords=a.list.length<1}function k(b){var c=_.values(a._list);return _.each(c,function(c){var d={};if(angular.copy(c,d),d.docs){var e=_.filter(d.docs,b);d.docs=e}d.docs&&d.docs.length>0&&a.list.push(d)}),a.list}a.location=d,a.path=a.location.path(),a.search=a.search||{};var l=new Date;a.search.dtStart||(a.search.dtStart=i.formatDBDate(l)),a.search.dtEnd||(a.search.dtEnd=new Date(a.search.dtStart),a.search.dtEnd.getMonth(a.search.dtEnd.getMonth()-1),a.search.dtEnd=i.formatDBDate(a.search.dtEnd)),a.list=[],a._list=[];var m=new f(e),n=m.root().child("/box"),o=g(n,a,"_list");o.then(function(){j()}),a.isCheckout=!1,a.isDestruct=!1,a.isInventory=!1,a.isRetention=!1,a.noRecords=!0,a.searchList=function(){a.search}}]),angular.module("ResourcesCtrl",[]).controller("ResourcesCtrl",["$scope","$routeParams","FBURL","Firebase","angularFire","angularFireCollection","$location","myapp.util",function(a,b,c,d,e,f,g){function h(){if(a.isUpdate){var b=j.child(a.resourceType+"/"+a.typeid);a._typeref=e(b,a,"type",{}),a._typeref.then(function(){a.type})}else{var b=j.child(a.resourceType);a.list=f(b)}}function i(){var b=j.child(a.resourceType);a._dbRef=f(b),a._dbRef.add(a.typeUpdate)}a.location=g,a.path=a.location.path(),a.resourceType=b.type||"docType",a.typeid=b.id,a.isUpdate="undefined"!=typeof a.typeid,a.isNew=!1,a.pathResourceRoot="/resources/",a.type={created:new Date},a.typeUpdate={},a.isNew=!1,a.list=void 0;var j=new d(c).child("resources");/add/g.test(a.path)?(a.isNew=!0,angular.copy(a.type,a.typeUpdate)):h(),a.update=function(){a.isNew?i():angular.copy(a.typeUpdate,a.type)}}]),function(){function a(a){return a?"["+a.code+"] "+a.toString():null}angular.module("myApp.services",[]).factory("fbService",["Firebase","FBURL","$rootScope",function(a,b){return{_fb:null,service:function(){return this._fb||(this._fb=new a(b)),_fb}}}]).factory("LoginService",["angularFireAuth","profileCreator","$location","$rootScope",function(b,c,d,e){return{login:function(a,c,e,f){var g=b.login("password",{email:a,password:c,rememberMe:!0});g.then(function(a){e&&d.path(e),f&&f(null,a)},f)},logout:function(a){b.logout(),a&&d.path(a)},changePassword:function(c){c.oldpass&&c.newpass?c.newpass!==c.confirm?c.callback("Passwords do not match"):b._authClient.changePassword(c.email,c.oldpass,c.newpass,function(b){c.callback(a(b)),e.$apply()}):c.callback("Please enter a password")},createAccount:function(a,c,d){b._authClient.createUser(a,c,function(a,b){d&&(d(a,b),e.$apply())})},createProfile:c}}]).factory("profileCreator",["Firebase","FBURL","$rootScope",function(a,b,c){return function(d,e,f){function g(a){return h(a.substr(0,a.indexOf("@"))||"")}function h(a){a+="";var b=a.charAt(0).toUpperCase();return b+a.substr(1)}new a(b).child("users/"+d).set({email:e,name:g(e)},function(a){f&&(f(a),c.$apply())})}}]).factory("myapp.util",[function(){return{formatDBDate:function(a){var b=""+a;return angular.isDate(a)||(a=new Date(a)),b=a.getFullYear()+"-"+(a.getMonth()+1)+"-"+a.getDate()},formatUIDate:function(a){var b=""+a;return angular.isDate(a)||(a=new Date(a)),b=a.getMonth()+1+"/"+a.getDate()+"/"+a.getFullYear()}}}]).factory("util.types",["Firebase","FBURL","angularFireCollection",function(a,b,c){var d="/resources",e=new c(new a(b).root().child(d+"/location")),f=new c(new a(b).root().child(d+"/dept")),g=new c(new a(b).root().child(d+"/doctype")),h=new c(new a(b).root().child(d+"/employees")),i={locations:e,doctypes:g,departments:f,employees:h};return i}])}(),function(){angular.module("myApp.filters",[]).filter("lookup",["util.types",function(a){return function(b,c){var d="";return"loc"==c?angular.forEach(a.locations,function(a){a.$index==b&&(d=a.desc)}):"dept"==c?angular.forEach(a.departments,function(a){a.$index==b&&(d=a.desc)}):"doctype"==c?angular.forEach(a.doctype,function(a){a.$index==b&&(d=a.desc)}):"emp"==c&&angular.forEach(a.employees,function(a){a.$index==b&&(d=a.name)}),d}}])}(),angular.module("my.service",[]).factory("Dbservice",["$http","$resource",function(a){var b=function(){};return b.prototype={getFB:function(){},getMain:function(b){a.get("data/box-list.json").success(function(a){b.list=a.data.list})},getBox:function(b){a.get("data/box.json").success(function(a){b.box=a.data})},getBoxDoc:function(b){a.get("data/box-doc.json").success(function(a){b.doc=a.data})},getRptData:function(b,c){var d=c||{};d.type=d.type||"checkout";var e=function(a){b.rpt=a};/checkout$/g.test(d.type)?a.get("data/rpt-checkout.json").success(e):/destruct$/g.test(d.type)?a.get("data/rpt-destruct.json").success(e):/retention$/g.test(d.type)?a.get("data/rpt-retention.json").success(e):/inventory$/g.test(d.type)&&a.get("data/rpt-inventory.json").success(e)}},new b}]);
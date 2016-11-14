// ==UserScript==
// @name        Login Aliexpress.com By Google
// @namespace   http://ubotplugin.com
// @description Login Aliexpress.com By Google
// @copyright   @2016
// @author  	Apichai Pashaiam
// @include     https://login.aliexpress.com*
// @include     https://accounts.google.com*
// @version     1.0
// @grant        unsafeWindow
// @grant		 GM_log
// @grant        GM_openInTab
// @run-at 		 document-idle
// ==/UserScript==

// Website: http://ubotplugin.com

var yourEmail = "abc@gmail.com";

var href = window.location.href;


if(href.indexOf("logout") != -1 
	|| href.indexOf("xlogin") != -1 
	|| href.indexOf("iframe_delete") != -1
	|| href.indexOf("success_proxy") != -1
	){
	return;
}

if(href.indexOf("login.aliexpress.com") != -1 ){
	window.open("http://thirdparty.aliexpress.com/login.htm?type=gg&tracelog=ws_gg_mainlogin", '_blank').focus();
}

if(href.indexOf("https://thirdparty.aliexpress.com/ggcallback.htm") != -1){
	
	var buttons = document.getElementsByTagName('button');	
	for(var i = 0; i < buttons.length; i++) {
		if(yourEmail == ""){
			buttons[i].click();
			return;
		}
		else if(buttons[i].textContent.toLowerCase().indexOf(yourEmail.toLowerCase()) != -1) {
			buttons[i].click();
			return;
		}
	}	
}

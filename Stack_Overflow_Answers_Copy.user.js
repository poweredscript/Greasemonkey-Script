// ==UserScript==
// @name        Stack Overflow Answers Copy
// @namespace   StackOverflow
// @description Stack Overflow Answers Copy & SOFU Answer Highlighter
// @copyright   Apichai Pashaiam
// @version     1.2
// @include     *superuser.com/*
// @include     *stackoverflow.com/*
// @include     *stackexchange.com/*
// @include     *serverfault.com/*
// @license     http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @downloadURL https://github.com/poweredscript/Greasemonkey-Script/raw/master/Stack_Overflow_Answers_Copy.user.js
// @updateURL   https://github.com/poweredscript/Greasemonkey-Script/raw/master/Stack_Overflow_Answers_Copy.user.js
// @grant       none
// ==/UserScript==

//Credit
//SOFU Answer Highlighter http://userscripts-mirror.org/scripts/show/58178
//Stack Copy Button https://addons.mozilla.org/en-US/firefox/addon/stack-copy-button

function copyToClipboard(c) {
	var a = $(window).scrollTop(),
	b = $("<textarea></textarea>");
	b.attr("id", "_CopyButtonTextArea_");
	$("body").append(b);
	b.text(c);
	b.get(0).focus();
	b.get(0).setSelectionRange(0, c.length);
	document.execCommand("copy");
	$("#_CopyButtonTextArea_").remove();
	$(window).scrollTop(a)
}
$(document).ready(function () {
	var c = $("<button>Copy</button>").attr("class", "_copyButton_"),
	a = $(".post-tag"),
	a = {
		display : "none",
		"transition-property" : "none",
		position : "absolute",
		cursor : "pointer",
		margin : "0px",
		padding : $(a).css("padding"),
		color : $(a).css("color"),
		"font-size" : $(a).css("font-size"),
		"font-family" : $(a).css("font-family"),
		"background-color" : $(a).css("background-color"),
		"border-color" : $(a).css("border-color"),
		"border-width" : $(a).css("border-width"),
		"border-style" : $(a).css("border-style"),
		"border-radius" : $(a).css("border-radius")
	};
	c.css(a);
	$("body").append(c);
	var b = c.width();
	c.remove();
	b += 30;
	$(".answer").hover(function () {
		var a = $(this).width() - b,
		a = c.clone().css("margin-left", a + "px");
		$(this).prepend(a);
		a.click(function () {	
			var links = $(this).parent().find("a");
			for(i = 0; i < links.length; i++)
			{
				var link = links[i];
				var text = link.innerText + "";				
				var href = link.href + "";
				text = text.replace(/\/$/g, "").trim();
				href = href.replace(/\/$/g, "").trim();
				if(text.indexOf(href) == -1){
					link.innerText = link.innerText + " (" + link.href + ")";
				}			
			}
			var a = $(this).parent().find(".post-text").text();
			var b = $(this).parent().find("code").text();
			
			//a = a.replace(/\b^/mg, "//");
			var c = "//************************************************************************************************************************************************************************\n";
			c += "//" + window.location.href + "\n";
			var d = a.split("\n");
			for(i = 0; i < d.length; i++)
			{
				if(b.indexOf(d[i]) == -1)
				{
					c += "//" + d[i] + "\n";
				}else{
					c += d[i] + "\n";
				}		
			}			
			c = c.replace("\n\n", "\n").trim();
			c = c.replace(/\/\/$/g, "").trim() + "\n";
			copyToClipboard(c)
		});
		a.fadeIn()
	}, function () {
		$("._copyButton_").fadeOut(function () {
			$(this).remove()
		})
	})	
});
// //div[@class='post-text']
// //div[@class='answer accepted-answer']
var allDivs, thisDiv;
allDivs = document.evaluate("//div[@class='answer accepted-answer']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = 0; i < allDivs.snapshotLength; i++) {
    thisDiv = allDivs.snapshotItem(i);
    thisDiv.style.backgroundColor = "#eeffee";
}

// ==UserScript==
// @name           ♥ Search on Stores
// @description    Search Selected text on Stores
// @copyright      Mahi Balan M | RCA | VBI
// @version        1.0
// @website        https:/ubotplugin.com
// @namespace      *
// @include       *
// @author        Apichai P.
// @grant         GM_openInTab
// @run-at        context-menu
// @require       http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// ==/UserScript==
// ==/UserScript==

// GM_registerMenuCommand('Run this now', function() {
//     alert("Put script's main function here");
// }, 'r');


(function() {
    'use strict';
    //GM_openInTab("https://website.net");
function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if ((activeElTagName == "textarea") || (activeElTagName == "input" && /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) && (typeof activeEl.selectionStart == "number")) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}
    function searchSelectionText(){
        var txt = getSelectionText();
        if(txt.length > 0)
        {
            GM_openInTab("https://www.aliexpress.com/af/usb.html?SearchText=" + encodeURIComponent(txt) + "&SortType=price_asc", true);
            GM_openInTab("https://www.ebay.com/sch/i.html?_from=R40&_sacat=0&LH_BIN=1&_sop=15&_nkw=" + encodeURIComponent(txt), true);//
            GM_openInTab("https://shopee.co.th/search?order=asc&page=0&sortBy=price&keyword=" + encodeURIComponent(txt), true);
            GM_openInTab("https://www.lazada.co.th/catalog/?_keyori=ss&from=search_history&page=1&sort=priceasc&q=" + encodeURIComponent(txt), true);

            //GM_openInTab("" + encodeURIComponent(txt), true);
        }
    }
searchSelectionText();
})();

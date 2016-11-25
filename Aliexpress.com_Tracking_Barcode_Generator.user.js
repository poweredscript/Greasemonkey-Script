// ==UserScript==
// @name                Aliexpress.com Tracking Barcode Generator
// @namespace        http://ubotplugin.com
// @description         Aliexpress.com Tracking Barcode Generator
// @copyright           @2016
// @author  	            Apichai Pashaiam
// @downloadURL     https://github.com/poweredscript/Greasemonkey-Script/raw/master/Aliexpress.com_Tracking_Barcode_Generator.user.js
// @updateURL 	    https://github.com/poweredscript/Greasemonkey-Script/raw/master/Aliexpress.com_Tracking_Barcode_Generator.user.js
// @version             1.3
// @license             Apache
// @include             *trade.aliexpress.com/order*
// @require             https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant               GM_xmlhttpRequest
// @grant               GM_getResourceText
// @grant               GM_getResourceURL
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_openInTab
// @grant               GM_registerMenuCommand
// @grant               GM_addStyle
// @grant	          GM_log
// @grant               unsafeWindow
// @run-at 	          document-idle
// ==/UserScript==
// Email: poweredscript@gmail.com
// Website: http://ubotplugin.com
const qrCode = false;
function resourceText(url, eleTracking, callback, postfields) {
    var options = {
        'url': url,
        'method': (!postfields ? 'get' : 'post'),
        'headers':
        {
            'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20080404'
        },
        'onload': function (e) {
            callback(e.responseText, eleTracking);
        },
        'onerror': function (e) {
            callback(e.responseText, eleTracking);
        }
    };

    if (!!postfields) {
        var postdata = '';
        for (n in postfields) {
            postdata += '&' + n + '=' + encodeURIComponent(postfields[n]);
        }
        data = postdata.substr(1);

        options.headers["Content-type"] = "application/x-www-form-urlencoded";
        options.headers["Content-length"] = postdata.length;
        options.data = postdata;
    }

    GM_xmlhttpRequest(options);
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function sleepFor(sleepDuration) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
}

window.addEventListener("load", pageFullyLoaded);
function pageFullyLoaded() {
    //http://track.aliexpress.com/logisticsdetail.htm?tradeId=80319479301398
    var orderActions = document.getElementsByClassName("order-action");
    for (var i = 0; i < orderActions.length; i++) {
        var orderAction = orderActions[i];
        var reAddToCarts = orderAction.getElementsByClassName("ui-button ui-button-normal button-reAddToCart");
        if (reAddToCarts.length == 0) {
            var trackings = orderAction.getElementsByClassName("ui-button ui-button-normal button-logisticsTracking");
            for (var j = 0; j < trackings.length; j++) {
                var eleTracking = trackings[j];
                var trackingId = eleTracking.getAttribute("orderid");
                if (trackingId != "") {
                    resourceText('http://track.aliexpress.com/logisticsdetail.htm?tradeId=' + trackingId, eleTracking, function (htmlXRates, eleTrackingOut) {
                        var result = htmlXRates.match(/Tracking number:<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g)[0];
                        result = result.match(/<div class="item msg">.*?<\/div>/g)[0];
                        result = result.replace(/(<div class="item msg">|<\/div>)/g, "");
                     
                        if (result.length > 5) {
                            var eleTrackingParent = eleTrackingOut.parentElement;
                            var img = document.createElement("img");
                            if (qrCode) {
                                img.src = "http://www.qr-code-generator.com/phpqrcode/getCode.php?cht=qr&chs=150x150&choe=UTF-8&chld=L|0&chl=" + result;
                                img.style.width = "150px";
                                img.style.height = "150px";
                            } else {
                                img.src = "http://www.barcode-generator.org/zint/api.php?bc_number=20&bc_data=" + result;
                                img.style.height = "95px";
                            }
                            img.alt = result;
                            img.title = result;
                            eleTrackingParent.appendChild(img);
                        }
                    });
                }
            }
        }
    }
}

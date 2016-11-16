// ==UserScript==
// @name                Aliexpress.com Tracking Barcode Generator
// @namespace        http://ubotplugin.com
// @description         Aliexpress.com Tracking Barcode Generator
// @copyright           @2016
// @author  	            Apichai Pashaiam
// @downloadURL     https://github.com/poweredscript/Greasemonkey-Script/raw/master/Aliexpress.com_Tracking_Barcode_Generator.user.js
// @updateURL 	    https://github.com/poweredscript/Greasemonkey-Script/raw/master/Aliexpress.com_Tracking_Barcode_Generator.user.js
// @version             1.2
// @license             Apache
// @include             *trade.aliexpress.com/order*
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

//http://track.aliexpress.com/logisticsdetail.htm?tradeId=80319479301398
var trackings = document.getElementsByClassName("ui-button ui-button-normal button-logisticsTracking");
for (var i = 0; i < trackings.length; i++) {
    var eleTracking = trackings[i];
    var trackingId = eleTracking.getAttribute("orderid");
    //alert(trackingId);
    //GetTrackingNumber(trackingId);
    //alert(GetTrackingNumber(trackingId));
    if (trackingId != "") {
        resourceText('http://track.aliexpress.com/logisticsdetail.htm?tradeId=' + trackingId, eleTracking, function (htmlXRates, eleTracking) {
            //alert(htmlXRates);
            var result = htmlXRates.match(/Tracking number:<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g)[0];
            result = result.match(/<div class="item msg">.*?<\/div>/g)[0];
            result = result.replace(/(<div class="item msg">|<\/div>)/g, "");
           // alert(result);
            if (result.length > 5) {

                var eleTrackingParent = eleTracking.parentElement;

                var para = document.createElement("P");
                var t = document.createTextNode(result);
                para.appendChild(t);
                eleTrackingParent.appendChild(para);

                var img = document.createElement("img");
                img.src = "http://www.qr-code-generator.com/phpqrcode/getCode.php?cht=qr&chs=150x150&choe=UTF-8&chld=L|0&chl=" + result;
                img.style.width = "150px";
                img.style.height = "150px";
                img.alt = result;
                img.title = result;
                eleTrackingParent.appendChild(img);
                //eleTracking.style.height = "205px";
                //return result;
            }
        });
        //break;
    }
}

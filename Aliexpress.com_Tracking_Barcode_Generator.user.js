// ==UserScript==
// @name                Aliexpress.com Tracking Barcode Generator
// @namespace        http://ubotplugin.com
// @description         Aliexpress.com Tracking Barcode Generator
// @copyright           @2016
// @author  	            Apichai Pashaiam
// @downloadURL     https://github.com/poweredscript/Greasemonkey-Script/raw/master/Aliexpress.com_Tracking_Barcode_Generator.user.js
// @updateURL 	    https://github.com/poweredscript/Greasemonkey-Script/raw/master/Aliexpress.com_Tracking_Barcode_Generator.user.js
// @version             1.6
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
function resourceText(url, eleTracking, productNames, callback, postfields) {
    var options = {
        'url': url,
        'method': (!postfields ? 'get' : 'post'),
        'headers':
        {
            'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20080404'
        },
        'onload': function (e) {
            callback(e.responseText, eleTracking, productNames);
        },
        'onerror': function (e) {
            callback(e.responseText, eleTracking, productNames);
        }
    };

    if (!!postfields) {
        var postdata = '';
        for (var n in postfields) {
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
    //
    //var orderBodys = document.getElementsByTagName("tbody");
    var orderActions = document.getElementsByClassName("order-action");
    //alert("orderActions = " + orderActions.length);
    for (var i = 0; i < orderActions.length; i++) {
        var orderAction = orderActions[i];
        //var productNames = orderBodys[i].getElementsByClassName("baobei-name");
        var productNames2 = [];
        //for (var j = 0; j < productNames.length; j++) {
        //    if (j % 2 === 0) {
        //        productNames2.push(productNames[j].innerText);
        //    }
        //}
        //alert(i + " = " + productNames2.length);
        //productName = productName.getElementsByClassName("baobei-name");
        //alert("Count = " + i);
        var confirmOrderReceived = orderAction.getElementsByClassName("ui-button ui-button-normal button-confirmOrderReceived");
        //alert("confirmOrderReceived = " + confirmOrderReceived.length);
        if (confirmOrderReceived.length === 0) continue;
        var trackings = orderAction.getElementsByClassName("ui-button ui-button-normal button-logisticsTracking");
        //alert("trackings = " + trackings.length);
        if (trackings.length === 0) continue;
        var orderid = trackings[0].getAttribute("orderid");
        //alert(orderid);
        if (orderid === "") continue;
        //continue;
        try {
            resourceText('http://track.aliexpress.com/logisticsdetail.htm?tradeId=' + orderid, orderAction, productNames2, function (htmlXRates, eleTrackingOut, productNamesOut) {
                //alert(htmlXRates);
                //alert(productNamesOut[0]);
                //var matchs = htmlXRates.match(/Tracking number:<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g);
                var trackingNumber = htmlXRates.match(/logisticsNo":".*?"/g);
                //var logisticsCompanyName = htmlXRates.match(/logisticsCompanyName":".*?"/g)[0].replace(/(logisticsCompanyName":"|")/g, "");
                //var sendTime = htmlXRates.match(/sendTime":".*?"/g)[0].replace(/(sendTime":"|")/g, "");
                //var tradeId = htmlXRates.match(/tradeId":".*?"/g)[0].replace(/(tradeId":"|")/g, "");
                //alert(trackingNumber.length);
                if (trackingNumber.length > 0) {
                    trackingNumber = trackingNumber[0].replace(/(logisticsNo":"|")/g, "");
                    var eleTrackingParent = eleTrackingOut.parentElement;
                    var img = document.createElement("div");
                    var url = "";
                    var style = "";
                    if (qrCode) {
                        url = "http://www.qr-code-generator.com/phpqrcode/getCode.php?cht=qr&chs=150x150&choe=UTF-8&chld=L|0&chl=" + trackingNumber;
                        style = 'style="width:150px;height:150px;"';
                    } else {
                        url = "http://www.barcode-generator.org/zint/api.php?bc_number=20&bc_data=" + trackingNumber;
                        style = 'style="height:95px;"';
                    }
                    img.innerHTML = '<a target="_blank" href="https://global.cainiao.com/detail.htm?mailNoList=' + trackingNumber + '"><img alt="' + trackingNumber + '" src="' + url + '" ' + style + '></a>';
                    eleTrackingParent.appendChild(img);

                    var p = document.createElement("div");
                    p.innerText = trackingNumber;
                    //p.innerText = productNamesOut.join(" + ") + "," + trackingNumber + "," + logisticsCompanyName;
                    //eleTrackingParent.appendChild(p);
                    document.body.insertBefore(p, document.body.firstChild);
                    //document.body.appendChild(p);

                }
            }, "get");
        } catch (e) {
            alert(e);
        }
    }
}

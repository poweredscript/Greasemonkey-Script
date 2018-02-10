// ==UserScript==
// @name                Aliexpress.com USD to Bath Conversion
// @namespace        http://ubotplugin.com
// @description         Aliexpress.com USD to Bath Conversion
// @author  	        Apichai Pashaiam
// @downloadURL    https://github.com/poweredscript/Greasemonkey-Script/raw/master/Aliexpress.com_USD_to_Bath_Conversion.user.js
// @updateURL 	     https://github.com/poweredscript/Greasemonkey-Script/raw/master/Aliexpress.com_USD_to_Bath_Conversion.user.js
// @version             2.4
// @include             *aliexpress.com/*
// @require             https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @run-at 	            document-end
// @grant               GM_xmlhttpRequest
// @grant               GM_getResourceText
// @grant               GM_getResourceURL
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_openInTab
// @grant               GM_registerMenuCommand
// @grant               GM_addStyle
// @grant	            GM_log
// @grant               unsafeWindow

// ==/UserScript==
// Email: poweredscript@gmail.com
// Website: http://ubotplugin.com
//https://bit.ly/2g1mTAG
//https://redirect.viglink.com?key=32636576ec65e78c67d41892f6dc6f0f&u=https%3A%2F%2Fwww.aliexpress.com%2F
//document-idle

const source = "USD"; //สกุลเงินที่จะแปลง
const taget = "THB"; //สกุลเงินที่จะแปลงไป
const sourceSymbol = "$"; //สัญญาลักษ์สกุลเงินที่จะแปลง
const prefixTagetSymbol = "฿"; //สัญญาลักษ์สกุลเงินที่จะแปลงไป
const suffixTagetSymbol = "บาท"; //สัญญาลักษ์สกุลเงินที่จะแปลงไป
const useSuffixTagetSymbol = true;
const showSourcePrice = true;
const includeShippingPrice = true;
const hideShippingCost = true; // ถ้าคุณเลือก "includeShippingPrice = true" คุณสามรถกำหนดให้ไม่ต้องแสดงค่าจัดส่งได้ ปรกติค่าคือ true.
const showShippingBy = true;  //แสดงชื่อบริษัทขนส่ง
const includeProcessingTime = true; //รวมเวลาบรรจุสินค้าก่อนส่ง
const showPiecesPerLot = true; // แสดงจำนวนต่อ Lot

var ShippingFreeTrackedWork = "#008000";
var ShippingFreeTrackedNotWork = "#556B2F";//"#32CD32";
var ShippingChargeTrackedWork = "#FF0000";


const debug = true; //
var runOneShipping = true;
var htmlXRates = "";
var baht = 0;
function resourceText(url, ele, ele2, callback, postfields) {
    var options = {
        'url' : url,
        'method' : (!postfields ? 'get' : 'post'),
        'headers' : {
            'User-Agent' : 'Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20080404'
        },
        'onload' : function (e) {
            callback(e.responseText, ele, ele2);
        },
        'onerror' : function (e) {
            callback(e.responseText, ele, ele2);
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
    //alert(n);
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function parseToFloat(n) {
    n = n + "";
    n = n.replace(/[^\d\.]+/g,"");
    return parseFloat(n);
}

Number.prototype.formatMoney = function(c, d, t){
    var n = this;
    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d === undefined ? "." : d;
    t = t === undefined ? "," : t;
    s = n < 0 ? "-" : "";
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
    var j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function usdToTHB(usds, shippingPrice) {
    var bahtStr = '';
    var val1, val2, val1Thb, val2Thb;
    try
    {
        //alert(baht);
        //alert("usdToTHB/ usds=" + usds + ":" + shippingPrice);
        //alert(shippingPrice);
        //shippingPrice = parseToFloat(shippingPrice) * baht;
        //alert(shippingPrice);
        //alert("usds=" + usds + " = " + isNumeric(usds));
        usds = usds.replace("$", "").replace("US", "").replace(",", "").trim();
        if (isNumeric(usds)) {
            val1 = parseToFloat(usds) + shippingPrice;

            if (useSuffixTagetSymbol) {
                if (showSourcePrice) {
                    bahtStr = (parseToFloat(val1 * baht)).formatMoney() + ' ' + suffixTagetSymbol + ' (' + sourceSymbol + val1.formatMoney() + ')';
                } else {
                    bahtStr = (parseToFloat(val1 * baht)).formatMoney() + ' ' + suffixTagetSymbol;
                }
            } else {
                if (showSourcePrice) {
                    bahtStr = prefixTagetSymbol + (parseToFloat(val1 * baht)).formatMoney() + ' (' + sourceSymbol + val1.formatMoney() + ')';
                } else {
                    bahtStr = prefixTagetSymbol + (parseToFloat(val1 * baht).formatMoney());
                }
            }
            //alert(bahtStr);
        } else {
            usds = usds.split("-");
            //alert(usds.length);
            if (usds.length == 2) {
                val1 = usds[0].replace(/[^\d\.\,]/ig, "");
                val1 = parseToFloat(val1) + shippingPrice;
                val1Thb = (val1 * baht).formatMoney();

                val2 = usds[1].replace(/[^\d\.\,]/ig, "");
                val2 = parseToFloat(val2) + shippingPrice;
                val2Thb = (val2 * baht).formatMoney();
                if (useSuffixTagetSymbol) {
                    if (showSourcePrice) {
                        bahtStr = val1Thb + ' - ' + val2Thb + ' ' + suffixTagetSymbol + ' (' + sourceSymbol + val1.formatMoney() + ' - ' + val2.formatMoney() + ')';
                    } else {
                        bahtStr = val1Thb + ' - ' + val2Thb + ' ' + suffixTagetSymbol;
                    }
                } else {
                    if (showSourcePrice) {
                        bahtStr = prefixTagetSymbol + val1Thb + ' - ' + val2Thb + ' (' + sourceSymbol + val1.formatMoney() + ' - ' + val2.formatMoney() + ')';
                    } else {
                        bahtStr = prefixTagetSymbol + val1Thb + ' - ' + val2Thb;
                    }
                }

            }
            else if (usds.length == 1) {
                val1 = usds[0].replace(/[^\d\.\,]/ig, "");
                if (val1 === "") return "";
                val1 = parseToFloat(val1) + shippingPrice;
                val1Thb = (val1 * baht).formatMoney(0);
                if (useSuffixTagetSymbol) {
                    if (showSourcePrice) {
                        bahtStr = val1Thb + ' ' + suffixTagetSymbol + ' (' + sourceSymbol + val1.formatMoney() + ')';
                    } else {
                        bahtStr = val1Thb + ' ' + suffixTagetSymbol;
                    }
                } else {
                    if (showSourcePrice) {
                        bahtStr = prefixTagetSymbol + val1Thb + ' (' + sourceSymbol + val1.formatMoney() + ')';
                    } else {
                        bahtStr = prefixTagetSymbol + val1Thb;
                    }
                }
            } else {
                //alert("");
            }
        }
    } catch (err) {
        if (debug) alert("Error at usdToTHB\n\n" + err.message);
    }
    //alert(bahtStr);
    return bahtStr;
}
function getElementByAttribute(attr, value, root) {
    root = root || document.body;
    if(root.hasAttribute(attr) && root.getAttribute(attr) == value) {
        return root;
    }
    var children = root.children,
        element;
    for(var i = children.length; i--; ) {
        element = getElementByAttribute(attr, value, children[i]);
        if(element) {
            return element;
        }
    }
    return null;
}
function evaluateXPath(parent, xpath)
{
    let results = [];
    let query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i=0, length=query.snapshotLength; i<length; ++i) {
        results.push(query.snapshotItem(i));
    }
    if(results.length === 0){
         query = top.document.evaluate(xpath, top.document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
         for (let i=0, length=query.snapshotLength; i<length; ++i) {
             results.push(query.snapshotItem(i));
         }
     }
    return results;
}
function hideEle(xPath){
    var eles = evaluateXPath(document, xPath);
    if(eles.length > 0)eles[0].style.display = 'none';
}

function findParentNode(className, childObj) {
    var testObj = childObj.parentNode;
    while ((testObj.className + "") != className && testObj !== null)
    {
        testObj = testObj.parentNode;
    }
    return testObj;
}
function findAncestor(el, maxLayer) {
    var i = 0;
    var elBak = el;
    try {
        for (i = 0; i < maxLayer; i++)
        {
            el = el.parentNode;
            if (el === null)
            {
                return elBak;
            }
            var className = (el.className + "").trim();
            //alert(className);
            if (className == "item" ||
                className == "list-item list-item-first" ||
                className == "list-item" ||
                className == "right-block util-clearfix" ||
                className == "p-logistics-addition-info" ||
                className == "product util-clearfix js-product  item-group"
               )
            {
                break;
            }
        }
        if (i == maxLayer)
        {
            return null;
        }
    } catch (err)
    {
        if (debug) alert("Error at findAncestor\n\n" + err.message);
    }

    return el;
}

function urlCheck() { var href = window.location.href;
                     return (href.includes("wholesale") ||
                             href.includes("SearchText") ||
                             href.includes("wishlist") ||
                             href.includes("category") ||
                             href.includes("/af/") ||
                             href.includes("/item/"));
                    }

function converterAllToThb(xPath) {
    try {
        var productId = "";
        var shippingPrice = null;

        var eles = evaluateXPath(document, xPath);
        //alert(xPath + " = " + eles.length);
        var href = window.location.href;
        for (var i = 0; i < eles.length; i++) {
            var ele = eles[i];
            var textContent = ele.textContent;
            if (textContent.includes(prefixTagetSymbol) || textContent.includes(suffixTagetSymbol)) continue;
            //if (ele.className == "p-unit-lot-disc" || ele.className == "promotion-title") {
            //    continue;
            //}
            if (includeShippingPrice) {
                //alert(window.location.href);

                if (urlCheck())
                {
                    var eleParentNode = findAncestor(ele, 5);
                    if (eleParentNode === null) {
                        //alert("erro null");
                        changeTextContent(ele, getShippingPrice(ele));
                        continue;
                    }

                    var products = eleParentNode.getElementsByClassName("history-item product ");
                    //alert(products.length);
                    //break;
                    if (products.length === 0) {
                        products = eleParentNode.getElementsByClassName("product");
                    }
                    if (products.length === 0) {
                        products = eleParentNode.getElementsByClassName("history-item product j-p4plog");
                    }
                    if (products.length === 0) {
                        products = eleParentNode.getElementsByClassName("image");
                    }
                    //alert(products.length);
                    //break;

                    if (products.length > 0) {
                        var productUrl = products[0].href + "";
                        //alert(productUrl);break;
                        productId = ((productUrl.match(/\/\d+.*?\.htm/) + "").replace(/.*\//, "") + "").replace(/.htm/, "") + "";
                        //alert(productId);break;
                        resourceText("https://freight.aliexpress.com/ajaxFreightCalculateService.htm?f=d&productid=" + productId +
                                     "&count=1&currencyCode=USD&sendGoodsCountry=CN&country=TH&province=&city=&abVersion=1", ele, eleParentNode, function (htmlXRates, eleOut, eleOut2) {
                            //alert(htmlXRates);
                            var companyDisplayName = (htmlXRates.match(/"companyDisplayName":".*?"/) + "")
                            .replace(/(companyDisplayName|"|:|,)/ig, "");
                            var time = (htmlXRates.match(/"time":".*?"/) + "").replace(/[^\d\-]/ig, "");
                            var processingTime = (htmlXRates.match(/"processingTime":.*?,/) + "").replace(/[^\d]/ig, "");
                            var price = (htmlXRates.match(/"price":"[\d\.\,]+"/) + "").replace(/[^\d\.]/ig, "");
                            var localPriceFormatStr = (htmlXRates.match(/"localPriceFormatStr":".*?"/) + "").replace(/(localPriceFormatStr|"|:|,)/ig, "");
                            var isTracked = (htmlXRates.match(/"isTracked":.*?,/g)[0] + "").replace(/(isTracked|"|:|,)/ig, "");
                            //alert(price);
                            //return;
                            if (price != "0") {
                                changeTextContent(eleOut, parseToFloat(price));
                            } else {
                                changeTextContent(eleOut, 0);
                            }

                            //+ Show Shipping By
                            if (showShippingBy) {
                                //+ Include Processing Time
                                if (includeProcessingTime) {
                                    var times = time.split("-");
                                    var timeStart = times[0];//parseInt(times[0]) + parseInt(processingTime);
                                    var timeEnd = times[1];//parseInt(times[1]) + parseInt(processingTime);
                                    time = timeStart + "-" + timeEnd + " วัน (จัดส่งใน " + processingTime + " วัน)";
                                    //time = timeStart + "-" + timeEnd + " วัน";
                                }
                                var report = "";
                                if (price == "0") {
                                    if (isTracked == "true") {
                                        report += "<strong style='color:" + ShippingFreeTrackedWork + "'>";
                                    } else {
                                        report += "<strong style='color:" + ShippingFreeTrackedNotWork + "'>";
                                    }
                                } else {
                                    report += "<strong style='color:" + ShippingChargeTrackedWork + "'>";
                                }

                                var shipping = "";
                                if (price == "0") {
                                    shipping = "จัดส่งฟรี: ";
                                    price = "";
                                } else {
                                    shipping = "รวมค่าจัดส่ง: ";
                                }

                                //alert(companyDisplayName);
                                //alert(price);
                                //alert(time);
                                //alert(processingTime);
                                //var div = document.createElement('div');
                                //div.innerHTML = "<strong>" + shipping + " " + companyDisplayName + " " + time + "</strong>";
                                //alert(eleOut2.innerHTML);
                                //alert(isTracked);

                                shippingPrices = eleOut2.getElementsByClassName("free-s");
                                if (shippingPrices.length > 0) {
                                    shippingPrice = shippingPrices[0];
                                    report += shipping;
                                    report += " ";
                                    report += companyDisplayName;
                                    report += " ";
                                    report += time;
                                    report += "</strong>";
                                    shippingPrice.innerHTML = report;
                                }
                                shippingPrices = eleOut2.getElementsByClassName("pnl-shipping");
                                //alert(shippingPrices.length);
                                if (shippingPrices.length > 0) {
                                    //alert(shippingPrices.length);
                                    shippingPrice = shippingPrices[0];
                                    report += shipping;
                                    report += " ";
                                    report += companyDisplayName;
                                    report += " ";
                                    report += time;
                                    report += "</strong>";
                                    shippingPrice.innerHTML = report;

                                }
                            }
                        });
                        //break;
                        //+ Hide Shipping Cost
                        if (hideShippingCost && !showShippingBy) {
                            shippingPrice = eleParentNode.getElementsByClassName("pnl-shipping");
                            if (shippingPrice.length > 0) {
                                //shippingPrice[0].style.display = 'none';
                                shippingPrice[0].getElementsByClassName("value")[0].style.display = 'none';
                                shippingPrice[0].getElementsByClassName("separator")[0].style.display = 'none';
                                shippingPrice[0].getElementsByClassName("unit")[0].style.display = 'none';
                                shippingPrice[0].style.fontWeight = "900";
                            }
                        }

                    } else {
                        changeTextContent(ele, getShippingPrice(ele));
                    }
                }
                else
                {
                    changeTextContent(ele, getShippingPrice(ele));

                    var logistics = document.getElementsByClassName("p-logistics-addition-info");
                    if (href.includes("/item/") && href.includes(".html") && logistics.length > 0 && runOneShipping) {
                        runOneShipping = false;
                        logistics = logistics[0];
                        if (logistics.textContent.includes("วัน")) {
                            continue;
                        }
                        productId = ((href.match(/\/\d+.*?\.htm/) + "").replace(/.*\//, "") + "").replace(/.htm/, "") + "";
                        //alert(productId);

                        //  https://freight.aliexpress.com/ajaxFreightCalculateService.htm?f=d&productid=32751886157&count=1&currencyCode=USD&sendGoodsCountry=CN&country=TH&province=&city=&abVersion=1
                        resourceText("https://freight.aliexpress.com/ajaxFreightCalculateService.htm?f=d&productid=" +
                                     productId +
                                     "&count=1&currencyCode=USD&sendGoodsCountry=CN&country=TH&province=&city=&abVersion=1",
                                     logistics,
                                     null,
                                     function (htmlXRates, eleOut, eleOut2) {

                            //alert(htmlXRates);
                            var companyDisplayNames = htmlXRates.match(/"companyDisplayName":".*?"/g);
                            var times = htmlXRates.match(/"time":".*?"/g);
                            var processingTimes = htmlXRates.match(/"processingTime":.*?,/g);
                            var prices = htmlXRates.match(/"price":"[\d\.\,]+"/g);
                            var isTrackeds = htmlXRates.match(/"isTracked":.*?,/g);
                            //alert(times);
                            var report = "";
                            for (var j = 0; j < companyDisplayNames.length; j++) {
                                //alert(times[j]);
                                var companyDisplayName = (companyDisplayNames[j] + "").replace(/(companyDisplayName|"|:|,)/ig, "");
                                var time = (times[j] + "").replace(/[^\d\-]/ig, "");
                                var processingTime = (processingTimes[j] + "").replace(/[^\d]/ig, "");
                                var price = (prices[j] + "").replace(/[^\d\.\,]/ig, "");
                                var isTracked = (isTrackeds[j] + "").replace(/(isTracked|"|:|,)/ig, "");
                                //alert(price);
                                //+ Show Shipping By
                                if (showShippingBy) {
                                    //+ Include Processing Time
                                    if (includeProcessingTime) {
                                        //alert(time);
                                        var times2 = time.split("-");
                                        var timeStart = times[0];//parseInt(times[0]) + parseInt(processingTime);
                                        var timeEnd = times[1];//parseInt(times[1]) + parseInt(processingTime);
                                        time = timeStart + "-" + timeEnd + " วัน (จัดส่งใน " + processingTime + " วัน)";
                                        //time = timeStart + "-" + timeEnd + " วัน";
                                    }
                                    if (price == "0") {
                                        if (isTracked == "true") {
                                            report += "<strong style='color:" + ShippingFreeTrackedWork + "'>";
                                        } else {
                                            report += "<strong style='color:" + ShippingFreeTrackedNotWork + "'>";
                                        }
                                    } else {
                                        report += "<strong style='color:" + ShippingChargeTrackedWork + "'>";
                                    }
                                    var shipping = "";
                                    if (price == "0") {
                                        shipping = "จัดส่งฟรี: ";
                                        price = "";
                                    } else {
                                        shipping = "รวมค่าจัดส่ง: ";
                                        price = usdToTHB(price, 0);
                                    }
                                    report += shipping;
                                    report += " ";
                                    report += price;
                                    report += " ";
                                    report += companyDisplayName;
                                    report += " ";
                                    report += time;
                                    report += "</strong><br />";
                                }
                            }
                            eleOut.innerHTML = report;
                        }
                                    );
                    }
                }
            }
            else {
                changeTextContent(ele, 0);
            }
            //++ Test
            //break;
        }
    } catch (err) {
        if (debug) alert("Error at converterAllToThb\n\n" + err.message);
    }

}

function changeTextContent(ele, shippingPrice) {
    try
    {//
        var textContent = ele.innerText;
        if (textContent === "")
        {
            textContent = ele.textContent;
        }
        //alert(textContent);
        //alert(textContent.includes(prefixTagetSymbol));
        //alert(textContent.includes(suffixTagetSymbol));
        if (textContent.includes(prefixTagetSymbol) || textContent.includes(suffixTagetSymbol)) {
            return;
        }
        if ((textContent.match(/\d+/g) + "") === "")
        {
            return;
        }
        var reg;
        var className = ele.className + "";
        if (className == "price" || className == "value" || className == "value notranslate" || className == "p4p-price-list" || className == "p-unit-lot-disc")
        {
            reg = new RegExp(/\$([\d\.\,]+ \- [\d\.\,]+|[\d\.\,]+)/g);
        }
        else if (className == "p-price")
        {
            //alert(textContent);
            reg = new RegExp(/([\d\.\,]+ \- [\d\.\,]+|[\d\.\,]+)/g);
        }
        else {
            reg = new RegExp(/[\s\S].*?[\d\.\,]+/g);
        }
        var results;
        while ((results = reg.exec(textContent)) !== null)
        {
            //alert(results.length + "\n\n" + results + "\n\n" + textContent);
            for (var i = 0; i < results.length; i++)
            {
                var result = results[i] + "";
                if (textContent.includes(prefixTagetSymbol) || textContent.includes(suffixTagetSymbol))
                {
                    break;
                }
                //alert(result);
                //alert(result.includes(prefixTagetSymbol));
                //alert(result.includes(suffixTagetSymbol));
                //alert("textContent=" + textContent + "\nshippingPrice=" + shippingPrice + "\nresult=" + result);
                //var newResult = result.replace(/[^\d\.\,]/ig, "") + "";
                //alert("newResult=" + newResult);
                //parseToFloat(newResult)
                var newText = usdToTHB(result, parseToFloat(shippingPrice));
                //alert("result=" + result + "\nnewText=" + newText);
                //alert("newResult=" + newResult + "\nnewText=" + newText + "\nshippingPrice=" + shippingPrice + "\nresult=" + result);
                textContent = textContent.replace(result, newText).replace("US", "").replace("$", "");
                //alert("text=" + textContent);
            }
        }
        //alert(textContent);
        ele.textContent = textContent;
    } catch (err) {
        if (debug) alert("Error at changeTextContent\n\n" + err.message);
    }
}


function getShippingPrice(ele) {
    try {
        var shippingPriceReport = 0;
        var href = window.location.href;
        if (urlCheck())
        {
            var tmpEle = ele;
            for (var i = 0; i < 4; i++) {
                if (tmpEle === null || tmpEle === undefined) return 0;
                var shippingPrice = tmpEle.getElementsByClassName("pnl-shipping");
                if (shippingPrice.length > 0) {

                    shippingPrice = shippingPrice[0];

                    if (shippingPrice.textContent.includes(prefixTagetSymbol) || ele.textContent.includes(suffixTagetSymbol)) {
                        return 0;
                    }

                    shippingPriceReport = parseToFloat(shippingPrice.textContent.replace(/[^\d\.\,]/ig, ""));
                    if (hideShippingCost) {
                        //shippingPrice[0].style.display = 'none';
                        var value = shippingPrice.getElementsByClassName("value");
                        if (value.length > 0) value[0].style.display = 'none';

                        var separator = shippingPrice.getElementsByClassName("separator");
                        if (separator.length > 0) separator[0].style.display = 'none';

                        var unit = shippingPrice.getElementsByClassName("unit");
                        if (unit.length > 0) unit[0].style.display = 'none';

                        shippingPrice.style.fontWeight = "900";
                    }
                    return shippingPriceReport;
                } else {
                    tmpEle = tmpEle.parentElement;
                }
            }
        }
    } catch (err) {
        if (debug) alert("Error at getShippingPrice\n\n" + err.message);
    }
    return 0;
}

function checkTHB()
{
    try {
        var href = window.location.href;
        if (!excludeUrl(href)) {
            return;
        }
        converterAllToThb('//*[@class="p-price"]');
        converterAllToThb('//*[@class="price"]');
        converterAllToThb('//*[@class="value"]');
        converterAllToThb('//*[@class="notranslate"]');
        converterAllToThb('//*[@class="value notranslate"]');
        //converterAllToThb('//*[@class="total-price-show"]');
        // Contains Source Symbol notranslate
        converterAllToThb('//*[contains(text(),"' + sourceSymbol + '")]');
        hideEle('//*[@itemprop="priceCurrency"]');
        hideEle('//*[@class="p-symbol"]');
        //var href = window.location.href;

        if (showPiecesPerLot)// && (href.includes("wholesale") || href.includes("SearchText"))
        {
            var piecesPerLots = document.getElementsByClassName("min-order");
            //alert(piecesPerLot.length);
            for (var i = 0; i < piecesPerLots.length; i++) {
                var piecesPerLot = piecesPerLots[i];
                var eleParentNode = findAncestor(piecesPerLot, 5);
                if (eleParentNode !== null) {
                    //alert(piecesPerLot.textContent);
                    var pieces = eleParentNode.getElementsByClassName("price price-m");
                    //alert(pieces.textContent);
                    if (pieces.length > 0) {
                        pieces = pieces[0];
                        if (!pieces.textContent.includes(suffixTagetSymbol))
                        {
                            //var str1 = "\\d+ \\" + suffixTagetSymbol;
                            //var reg = new RegExp(RegExp.quote(str1), "g");
                            var piece = pieces.textContent.match(/[\d+\.]+/) + "";
                            var lot = piecesPerLot.textContent.match(/[\d+\.]+/) + "";
                            piecesPerLot.textContent = piecesPerLot.textContent + " (" + usdToTHB((parseToFloat(piece) / parseToFloat(lot)).toFixed(2), 0) + ")";
                        }
                    }
                }
            }
        }
        const showSaler = true;
        if (showSaler) {
            var storeDsrDatas = document.getElementsByClassName("store-dsr-data");
            //alert(storeDsrDatas.length);
            if (storeDsrDatas.length > 0)
            {
                //alert(storeDsrDatas[0].innerHTML);
                //document.getElementsByClassName("product-attribute-main")[0].appendChild(storeDsrDatas[0]);
            }
        }
    }
    catch (err) {
        if (debug) alert("Error at checkTHB\n\n" + err.message);
    }
}
var observer = new MutationObserver(function (mutations) {

    mutations.forEach(function (mutationRecord) {
        try {
            //console.log(mutationRecord.type); // <- It always detects changes
            // Total-price-show
            converterAllToThb('//*[@class="total-price-show"]');
            // Price Currency
            converterAllToThb('//*[@class="p-price"]');
            converterAllToThb('//*[@class="price"]');
            converterAllToThb('//*[@class="value"]');
            converterAllToThb('//*[@class="notranslate"]');
            //Logistics Cost
            converterAllToThb('//*[@class="logistics-cost"]');

            converterAllToThb('//*[contains(text(),"' + sourceSymbol + '")]');
            hideEle('//*[@itemprop="priceCurrency"]');
        } catch (err) {
            if (debug) alert("Error at MutationObserver\n\n" + err.message);
        }
    });
});

if (window.attachEvent) {window.attachEvent('onload', windowOnload);}
else if (window.addEventListener) {window.addEventListener('load', windowOnload, false);}
else {document.addEventListener('load', windowOnload, false);}

function windowOnload() {
    try
    {
        var href = window.location.href;
        resourceText('http://www.x-rates.com/calculator/?from=' + source + '&to=' + taget + '&amount=1', "", "", function (htmlXRates, eleOut) {
            if (baht === 0 || baht === undefined || baht === null)
            {
                var result = htmlXRates.match(/ccOutputRslt">[\d\.\,]+/ig) + "";
                var ccOutputRslt = result.replace(/[^\d\.\,]/ig, "");
                result = htmlXRates.match(/ccOutputTrail">[\d\.\,]+/ig) + "";
                var ccOutputTrail = result.replace(/[^\d\.\,]/ig, "");
                baht = parseToFloat(ccOutputRslt + ccOutputTrail);
            }
            checkTHB();
            var target = document.getElementById('j-total-price-value');
            if (target !== null) {
                var config = {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                    //attributeFilter : ['style']
                };
                observer.observe(target, config);
            }
            // On scroll
            window.onscroll = function () {
                if (href.includes("sale.aliexpress.com")) {
                    converterAllToThb('//div[@class="price"]');
                }
            };
        });

    } catch (err) {
        if (debug) alert("Error at window.onload\n\n" + err.message);
    }
}

function excludeUrl(href){
    return !(href.includes("alibaba.com")  ||
             href.includes("javascrpt") ||
             href.includes("javascript") ||
             href.includes("login")  ||
             href.includes("password") ||
             href.includes("email") ||
             href.includes("mailto") ||
             href.includes("msg.") ||
             href.includes("32636576ec65e78c67d41892f6dc6f0f") ||
             href.includes("logout") ||
             href.includes("xlogin") ||
             href.includes("iframe_delete") ||
             href.includes("success_proxy") ||
             href.includes("security") ||
             href.includes("account") ||
             href.includes("membership")
            );
}

// ==UserScript==
// @name                Aliexpress.com USD to Bath Conversion
// @namespace        http://ubotplugin.com
// @description         Aliexpress.com USD to Bath Conversion
// @copyright           @2016
// @author  	            Apichai Pashaiam
// @downloadURL     https://github.com/poweredscript/Greasemonkey-Script/raw/master/Aliexpress.com_USD_to_Bath_Conversion.user.js
// @updateURL 	    https://github.com/poweredscript/Greasemonkey-Script/raw/master/Aliexpress.com_USD_to_Bath_Conversion.user.js
// @version             1.4
// @license             Apache
// @include             *aliexpress.com/*
// @require             https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @run-at 	          document-idle
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

// ==/UserScript==
// Email: poweredscript@gmail.com
// Website: http://ubotplugin.com
//https://bit.ly/2g1mTAG
//https://redirect.viglink.com?key=32636576ec65e78c67d41892f6dc6f0f&u=https%3A%2F%2Fwww.aliexpress.com%2F


const source = "USD"; //สกุลเงินที่จะแปลง
const taget = "THB"; //สกุลเงินที่จะแปลงไป
const sourceSymbol = "$"; //สัญญาลักษ์สกุลเงินที่จะแปลง
const prefixTagetSymbol = "฿"; //สัญญาลักษ์สกุลเงินที่จะแปลงไป
const suffixTagetSymbol = "บาท"; //สัญญาลักษ์สกุลเงินที่จะแปลงไป
const useSuffixTagetSymbol = true;
const showSourcePrice = false;
const includeShippingPrice = true;
const hideShippingCost = true; // ถ้าคุณเลือก "includeShippingPrice = true" คุณสามรถกำหนดให้ไม่ต้องแสดงค่าจัดส่งได้ ปรกติค่าคือ true.

var htmlXRates = "";
var baht = 0;
function resourceText(url, callback, postfields) {
	var options = {
		'url' : url,
		'method' : (!postfields ? 'get' : 'post'),
		'headers' : {
			'User-Agent' : 'Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20080404'
		},
		'onload' : function (e) {
			callback(e.responseText);
		},
		'onerror' : function (e) {
			callback(e.responseText);
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

function formatMoney(num, decPlaces) {
    if(decPlaces > 0){
		var p = num.toFixed(decPlaces).split(".");
		return p[0].split("").reverse().reduce(function(acc, num, i, orig) 
		{
			return  num + (i && !(i % 3) ? "," : "") + acc;
		}, "") + "." + p[1];
	}else{
		var p = num.toFixed(decPlaces).split(".");
		return p[0].split("").reverse().reduce(function(acc, num, i, orig) 
		{
			return  num + (i && !(i % 3) ? "," : "") + acc;
		}, "");
	}    
}

function usdToTHB(usds, shippingPrice) {	
    var bahtStr = '';     
	var val1, val2, val1Thb, val2Thb;
    if(!isNumeric(usds)) {
		usds = usds.split("-");
		if(usds.length == 2)
		{
			val1 = usds[0].replace(/[^\d\.]/ig, "");			
			val1 = parseFloat(val1) + shippingPrice;
			val1Thb = formatMoney((val1 * baht), 0);
			
			val2 = usds[1].replace(/[^\d\.]/ig, "");
			val2 = parseFloat(val2) + shippingPrice;			
			val2Thb = formatMoney((val2 * baht), 0);
			if (useSuffixTagetSymbol) {
			    if (showSourcePrice) {
			        bahtStr = val1Thb + ' - ' + val2Thb + ' ' + suffixTagetSymbol + ' (' + sourceSymbol + formatMoney(val1, 2) + ' - ' + formatMoney(val2, 2) + ')';
			    } else {
			        bahtStr = val1Thb + ' - ' + val2Thb + ' ' + suffixTagetSymbol;
			    }
			} else {
			    if (showSourcePrice) {
			        bahtStr = prefixTagetSymbol + val1Thb + ' - ' + val2Thb + ' (' + sourceSymbol + formatMoney(val1, 2) + ' - ' + formatMoney(val2, 2) + ')';
			    } else {
			        bahtStr = prefixTagetSymbol + val1Thb + ' - ' + val2Thb;
			    }
			}
			
		}
		else if(usds.length == 1){
			val1 = usds[0].replace(/[^\d\.]/ig, "");
			if(val1 == "") return "";			
			val1 = parseFloat(val1) + shippingPrice;
			val1Thb = formatMoney((val1 * baht), 0);
			if (useSuffixTagetSymbol) {
			    if (showSourcePrice) {
			        bahtStr = val1Thb + ' ' + suffixTagetSymbol + ' (' + sourceSymbol + formatMoney(val1, 2) + ')';
			    } else {
			        bahtStr = val1Thb + ' ' + suffixTagetSymbol;
			    }
			} else {
			    if (showSourcePrice) {
			        bahtStr = prefixTagetSymbol + val1Thb + ' (' + sourceSymbol + formatMoney(val1, 2) + ')';
			    } else {
			        bahtStr = prefixTagetSymbol + val1Thb;
			    }
			}
			
		}        
    }
    else {
        val1 = parseFloat(usds + shippingPrice);
        if (useSuffixTagetSymbol) {
            if (showSourcePrice) {
                bahtStr = formatMoney(parseFloat(val1 * baht), 0) + ' ' + suffixTagetSymbol + ' (' + sourceSymbol + formatMoney(val1, 2) + ')';
            } else {
                bahtStr = formatMoney(parseFloat(val1 * baht), 0) + ' ' + suffixTagetSymbol;
            }
        } else {
            if (showSourcePrice) {
                bahtStr = prefixTagetSymbol + formatMoney(parseFloat(val1 * baht), 0) + ' (' + sourceSymbol + formatMoney(val1, 2) + ')';
            } else {
                bahtStr = prefixTagetSymbol + formatMoney(parseFloat(val1 * baht), 0);
            }
        }
		
    }
    return bahtStr; 
};

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

function evaluateXPath(document, expression) {
    var ANY_TYPE = XPathResult.ANY_TYPE;
    var nodes = document.evaluate(expression, document, null, ANY_TYPE, null);
    var results = [], node;
    while(node = nodes.iterateNext()) {
        results.push(node);
    }
    return results;
}

function hideEle(xPath){
	var eles = evaluateXPath(document, xPath);
	if(eles.length > 0)eles[0].style.display = 'none';
}

function converterToThb(xPath){
	var eles = evaluateXPath(document, xPath);
	if(eles.length > 0)eles[0].textContent = usdToTHB(eles[0].textContent, 0);
}

function converterAllToThb(xPath){
	var eles = evaluateXPath(document, xPath);
	for(var i = 0; i < eles.length; i++) {
		var ele = eles[i];
		if (!ele.textContent.includes(prefixTagetSymbol) && !ele.textContent.includes(suffixTagetSymbol)) {
		    if (includeShippingPrice) {
		        ele.textContent = usdToTHB(ele.textContent, getShippingPrice(ele));
			}
			else{
				ele.textContent = usdToTHB(ele.textContent, 0);
			}		
		} 
	}
}
function getShippingPrice(ele){
	var shippingPriceReport = 0;
	var href = window.location.href;
	if (href.includes("wholesale") || href.includes("SearchText")) {
	    var tmpEle = ele;
	    for (var i = 0; i < 4; i++) {
	        if (tmpEle == null || tmpEle == undefined) return 0;
	        var shippingPrice = tmpEle.getElementsByClassName("pnl-shipping");
	        if (shippingPrice.length > 0) {
	            if (shippingPrice[0].textContent.includes(prefixTagetSymbol) || ele.textContent.includes(suffixTagetSymbol)) {
	                return 0;
	            }
	            shippingPriceReport = parseFloat(shippingPrice[0].textContent.replace(/[^\d\.]/ig, ""));
	            if (hideShippingCost) {
	                shippingPrice[0].style.display = 'none';
	            }
	            return shippingPriceReport;
	        } else {
	            tmpEle = tmpEle.parentElement;
	        }
	    }
	}
	return 0;
}

function checkTHB()
{	var href = window.location.href;
	if(!excludeUrl(href)){
		return;
	}
	hideEle('//span[@itemprop="priceCurrency"]');
	converterAllToThb('//span[@class="p-price"]');
	converterAllToThb('//div[@class="price"]');
	converterAllToThb('//*[contains(text(),"' + sourceSymbol + '")]');
}
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
		console.log(mutationRecord.type); // <- It always detects changes
		// Total-price-show
		converterAllToThb('//span[@class="total-price-show"]');
		// Price Currency
		hideEle('//span[@itemprop="priceCurrency"]');
		
		converterAllToThb('//span[@class="p-price"]');
    });    
});





function pageFullyLoaded () {
	//alert("pageFullyLoaded");	
	   
}
function DOM_ContentReady () {
    //alert("DOM_ContentReady");
}

document.addEventListener ("DOMContentLoaded", DOM_ContentReady);
window.addEventListener ("load", pageFullyLoaded);

window.onload = function(){    
	resourceText('http://www.x-rates.com/calculator/?from='+ source +'&to='+ taget +'&amount=1', function (htmlXRates) 
	{
	    if (baht == 0) {
	        var result = htmlXRates.match(/ccOutputRslt">[\d\.]+/ig) + "";
	        var ccOutputRslt = result.replace(/[^\d\.]/ig, "");
	        result = htmlXRates.match(/ccOutputTrail">[\d\.]+/ig) + "";
	        var ccOutputTrail = result.replace(/[^\d\.]/ig, "");
	        baht = parseFloat(ccOutputRslt + ccOutputTrail);
	    }
		checkTHB();
		var target = document.getElementById('j-total-price-value');
		if(target != null){
			var config = {
			  attributes: true,
			  childList: true,
			  characterData: true, 
			  subtree: true 
			  //attributeFilter : ['style']
			};
			observer.observe(target, config);
		} else{
			//alert("Error getElementById")
		}
	    // On scroll
		window.onscroll = function () {
		    var href = window.location.href;
		    if (href.includes("sale.aliexpress.com")) {
		        converterAllToThb('//div[@class="price"]');
		    }
		};
	});
	var allUrls = evaluateXPath(document, "//a");
	for (var i = 0; i < allUrls.length; i++) {
	    var url = allUrls[i];
	    var href = url.href;
	    if (!(!excludeUrl(href)
            || href.includes("&g=n&")
            || href.includes("&g=y&")
            || href.includes("SortType")
            || href.includes("order_list.htm")
            || href.includes("mobileRechargeList.htm")
            || href.includes("issue_list.htm")
            || href.includes("orderTrash.htm")
            || href.includes("feedbackBuyerList.htm")
            || href.includes("coupon/listView.htm")
            || href.includes("shoppingcoupon.htm")
            || href.includes("buyerGainedGiftCardList.htm")
            || href.includes("addressList.htm")
            || href.includes("myTraceProductList.htm")
            || href.includes("buyerCouponList.htm")
            || href.includes("ForderList.htm")
            || href.includes("reportIndex.htm")
            || href.includes("orderList.htm")
            || href.includes("home.aliexpress.com")
            || href.includes("my.aliexpress.com")
            )) {
	        url.setAttribute('target', '_blank');
	    }
	}
}
//https://my.aliexpress.com/wishlist/wish_list_product_list.htm?&currentGroupId=3108749798&page=1
function excludeUrl(href){	
	return !(href.includes("alibaba.com")
			//|| href.includes("shopcart") 
			//|| href.includes("category") 
			//|| href.includes("page=")
			|| href.includes("javascrpt")
			|| href.includes("javascript")
			|| href.includes("login")
			|| href.includes("password")
			|| href.includes("email")
			|| href.includes("mailto")
			|| href.includes("msg.")			
			|| href.includes("32636576ec65e78c67d41892f6dc6f0f")
			|| href.includes("logout") 
			|| href.includes("xlogin") 
			|| href.includes("iframe_delete")
			|| href.includes("success_proxy")			
			|| href.includes("security")
            || href.includes("account")
            || href.includes("membership")
        );
}

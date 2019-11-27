function loadconfig(url) {
	var thisurl = url;
	console.log({
		"url": thisurl,
		"areacode": areacode
	});
	console.log(JSON.stringify({
		"url": thisurl,
		"areacode": areacode
	}));
	$.ajax({
		contentType: "application/json",
		headers: {
			Accept: "application/json; charset=utf-8",
			"areacode": areacode
		},
		type: "post",
		dataType: "json",
		timeout: 10000,
		async: true,
		url: aiUrl + "wxmanager/getwxsign",
		data: JSON.stringify({
			"url": thisurl,
			"areacode": areacode
		}),
		complete: function(XMLHttpRequest, status) {
			if(status == "timeout") {
				isloadconfig = false;
				wxConfigFalse()
			}
		},
		success: function(data) {
			if(!data) {
				isloadconfig = false;
				wxConfigFalse();
				return false
			}
			var resultobj = data;
			console.log(data);
			wx.config({
				appId: resultobj.appid,
				timestamp: resultobj.timestamp,
				nonceStr: resultobj.nonceStr,
				signature: resultobj.signature,
				jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice", "startRecord", "stopRecord", "onVoiceRecordEnd", "playVoice", "onVoicePlayEnd", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"]
			});
			isloadconfig = true;
		},
		error: function(data, status) {
			isloadconfig = false;
			wxConfigFalse()
		}
	})
}

function wxConfigFalse() {
	showError("加载微信配置失败,请在微信中重新打开");
	return false
};
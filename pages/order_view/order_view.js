var request = require('../../utils/requestService.js');
Page({
	data:{
        address:[],
        allorder:[],
        rid:'',
    },
    onLoad:function(e){
    	var that = this
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        var url = '/app/w_api/order/view'
        request.post(url,{token:wx.getStorageSync('user').token,rid:e.rid},function(res){
        	if (res.success == true){
        		wx.hideToast()
        		console.log(res)
        		that.setData({
        			address: res.data.express_info,
        			allorder:res.data,
        			rid: res.data.rid,
        		})
        	}
        })
    },
    payFor(e){
    	wx.showToast({
        	title: '加载中',
            icon: 'loading',
            duration: 3000
        });
    	var that = this
    	wx.login({//login流程
    		success: function (res) {//登录成功
        		var code = res.code;
        		wx.getUserInfo({//getUserInfo流程
					success: function (res2) {//获取userinfo成功
						var encryptedData = res2.encryptedData;//一定要把加密串转成URI编码
						var iv = res2.iv;
						var url = '/app/w_api/order/pay'
				        request.post(url,{token:wx.getStorageSync('user').token,rid:that.data.is_rid,code:code,iv:iv,encryptedData:encryptedData},function(res){
				        	wx.hideToast()
				        	wx.requestPayment({
				        		'appId': res.data.appid,
								'timeStamp': String(res.data.time_stamp),
								'nonceStr': String(res.data.nonce_str),
								'package': 'prepay_id='+res.data.prepay_id,
								'signType': 'MD5',
								'paySign': String(res.data.sign),
								'success':function(res){
									wx.switchTab({
										url:'../index/index'
									})
								},
								'fail':function(ress){
									wx.redirectTo({
										url:'../fail/fail?appId='+ res.data.appid+'&timeStamp='+ String(res.data.time_stamp)+'&nonceStr='+res.data.nonce_str+'&package='+res.data.prepay_id+'&signType=MD5'+'&paySign='+res.data.sign
									})
								}
							})

				        })
					}
				})

    		}
		})
    },
    onReady:function(){
    // 页面渲染完成
    },
    onShow:function(){
        var that=this

    },
})
Page({
	data: {
	    disabled: false,
	    plain: false,
	    loading: false
	},
	onLoad:function(e){
		console.log(e)
		var that = this;
		that.setData({
            appId: e.appId,
            timeStamp: e.timeStamp,
            nonceStr: e.nonceStr,
            package: e.package,
            signType: e.signType,
            paySign: e.paySign
        })
    },
    payFor(e){
    	var that = this
    	that.setData({
    		loading: true,
    	})
    	wx.requestPayment({
    		'appId': that.data.appId,
			'timeStamp':that.data.timeStamp,
			'nonceStr': that.data.nonceStr,
			'package': 'prepay_id='+that.data.package,
			'signType': that.data.signType,
			'paySign': that.data.paySign,
			'success':function(res){
				wx.switchTab({
					url:'../index/index'
				})
			},
			'fail':function(ress){
				wx.redirectTo({
					url:'../fail/fail?appId='+ that.data.appId+'&timeStamp='+ that.data.timeStamp+'&nonceStr='+that.data.nonceStr+'&package='+that.data.package+'&signType='+that.data.signType+'&paySign='+that.data.paySign
				})
			}
		})
    },
    goHome(e){
    	wx.switchTab({
			url:'../index/index'
		})
    }

})
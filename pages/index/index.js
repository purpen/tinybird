var request = require('../../utils/requestService.js')
Page({
	data: {
		loadingHidden: false,
		topn:[],
		list: [],
		duration: 1000,
	    indicatorDots: true,
	    autoplay: true,
	    interval: 5000,
	    loading: false,
	    plain: false,
		plist:[],
	},
	//事件处理函数
  	bindViewTap: function(e) {
  		wx.navigateTo({
	      url: '../show/show?id=' + e.currentTarget.dataset.id+'&title='+e.currentTarget.dataset.title
	    })  	
  	},
	onLoad: function() {
		var that = this
		wx.request({
			url: getApp().globaData.Api_url + '/app/w_api/common/slide',
			data: {
				name: 'wx_index_slide'
			},
			header: {
		        'Content-Type': 'application/json'
		    },
			success: function(res) {
				//console.log(res.data)
				that.setData({
		          // 拼接数组
		          topn: res.data.data.rows,
		          loadingHidden: true,
		        })
			}
		})
		var url = '/app/w_api/product/getlist'
		request.post(url,{sort:4,size:16,token:wx.getStorageSync('user').token},function(res){
			wx.hideToast()
			//console.log(res)
			that.setData({
				plist: res.data.rows,
			})
		})
	}
})
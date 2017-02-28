var request = require('../../utils/requestService.js')
Page({
	data:{
		scrollHeight:'',
		scrollTop:'',
		order:[],
		list:[],
		general:true,
		new:false,
		price:false,
		sort: '',
		catelist:[],
		scrollleft:'',
		title: '',
	},
	onLoad:function(e){
		wx.setNavigationBarTitle({
			title: e.title
		})
        var that = this
        that.setData({
        	category_id: e.id,
        	title: e.title
        })
        
	},
	//综合
	general(e){
		wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 3000
        })
		var that = this;
		that.setData({
			general: true,
			new: false,
			price: false,
			sort:''
		})
		var url = '/app/w_api/product/getlist'
		request.post(url,{category_ids:that.data.category_id,sort:2,token:wx.getStorageSync('user').token},function(res){
			wx.hideToast()
			that.setData({
				list: res.data.rows,
				order: res.data,
			})
		})
	},
	//最新
	new(e){
		wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 3000
        })
		var that = this;
		that.setData({
			general: false,
			new: true,
			price: false,
			sort:''
		})
		var url = '/app/w_api/product/getlist'
		request.post(url,{category_ids:that.data.category_id,token:wx.getStorageSync('user').token},function(res){
			wx.hideToast()
			that.setData({
				list: res.data.rows,
				order: res.data,
			})
		})
	},
	//价格
	price(e){
		wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 3000
        })
		var that = this;
		that.setData({
			general: false,
			new: false,
			price: true,
		})
		if (e.currentTarget.dataset.sort == 6 || e.currentTarget.dataset.sort == ''){
			var url = '/app/w_api/product/getlist'
			request.post(url,{category_ids:that.data.category_id,sort:7,token:wx.getStorageSync('user').token},function(res){
				wx.hideToast()
				that.setData({
					list: res.data.rows,
					order: res.data,
					sort: 7,
				})
			})
		}else {
			var url = '/app/w_api/product/getlist'
			request.post(url,{category_ids:that.data.category_id,sort:6,token:wx.getStorageSync('user').token},function(res){
				wx.hideToast()
				that.setData({
					list: res.data.rows,
					order: res.data,
					sort: 6
				})
			})
		}
		//console.log(that.data.sort)
		
	},
	
	golist(e){
		wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 3000
        })
		var that = this;
		that.setData({
			category_id: e.currentTarget.dataset.id
		})
		wx.setNavigationBarTitle({
			title: e.currentTarget.dataset.title
		})
		var url = '/app/w_api/product/getlist'
		request.post(url,{category_ids:that.data.category_id,sort:2,token:wx.getStorageSync('user').token},function(res){
			wx.hideToast()
			that.setData({
				list: res.data.rows,
				order: res.data,
			})
		})
    },
	scroll:function(event){
        this.setData({
          scrollTop: event.detail.scrollTop
        });
    },
    bindDownLoad(e){
    	 wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        var page =e.target.dataset.page;
        var page = ++page;
        var totalpage = e.target.dataset.totalpage;
        var that = this;
        if (totalpage >= page) {
            var url = '/app/w_api/product/getlist'
            request.post(url,{category_ids:that.data.category_id,sort:that.data.sort,token:wx.getStorageSync('user').token,page:page},function(res){
                wx.hideToast()
                that.setData({
                	order: res.data,
                    list: that.data.list.concat(res.data.rows)
                })
            })
        }else{
            wx.showToast({
                title: '没有更多了',
                icon: 'success',
                duration: 1000
            })
            setTimeout(function(){
                wx.hideToast()
            },2000)
        }
    },
    bindViewTap: function(e) {
    	//console.log(e);
  		wx.navigateTo({
	      url: '../show/show?id=' + e.currentTarget.dataset.id+'&title='+e.currentTarget.dataset.title
	    })  	
  	},
  	onShow(e){
  		wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 3000
        })
  		var that = this;
  		wx.getSystemInfo({
            success:function(res){
                that.setData({
                    scrollHeight:res.windowHeight
                });
            }
        })
		var url = '/app/w_api/product/getlist'
		request.post(url,{category_ids:that.data.category_id,sort:2,token:wx.getStorageSync('user').token},function(res){
			wx.hideToast()
			//console.log(res)
			that.setData({
				list: res.data.rows,
				order: res.data,
			})
		})
		var url = '/app/w_api/category/getlist'
		request.post(url,{token:wx.getStorageSync('user').token},function(res){
			//console.log(res)
			wx.hideToast()
			that.setData({
				catelist: res.data.rows,
			})
		})
  	},

})
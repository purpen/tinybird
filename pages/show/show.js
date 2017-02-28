var request = require('../../utils/requestService.js');
Page({
	data:{
		duration: 1000,
	    indicatorDots: true,
	    autoplay: true,
	    interval: 5000,
	    loading: false,
	    plain: false,
	    art: [],
	    list:[],
	    navList: ['好货','好货详情','品牌描述'],
	    activeIndex: 0,
	    brdata:[],
	    viewimg:[],
	    modelCard:false,
	    skulist:[],
	    skuChose:'',
	    skuPrice:'',
	    skuActive:'',
	    inputValue:1,
	    inventory:'',
	    modelCart:false,
	    isLogin:'',
        page:'',
        token:'',
        Cartnum: '',
	},
	onLoad:function(e){
		var that = this;
		wx.setNavigationBarTitle({
			title: e.title
		})
		that.setData({
            page: getCurrentPages().length
        })
		wx.showToast({
        	title: '加载中',
            icon: 'loading',
            duration: 2000
        });
		var url = '/app/w_api/product/view?id='+e.id
        request.post(url,{},function(res){
        	wx.hideToast();
        	that.setData({
        		art: res.data,
        		list: res.data.asset,
        		brdata: res.data.brand, 
        		viewimg: res.data.des_images,
        		skulist: res.data.skus,
        		skuChose: res.data.skus[0].mode,
				skuPrice: res.data.skus[0].price,
				skuActive: res.data.skus[0]._id,
				inventory: res.data.skus[0].quantity,
        	})
        	if ( res.data.brand == null){
				that.setData({
					brdata: ''
				})
			}
        })
	},
	onShow:function(){
		var that = this;
        var value = wx.getStorageSync('user');
        if (value) {
            that.setData({
                isLogin: true,
                token: value.token
            })
            //console.log(that.data.token)
        }
        if ( that.data.isLogin == true ){
        	var url = '/app/w_api/cart/fetch_cart_count'
        	request.post(url,{token:that.data.token},function(res){
        		//console.log(res)
        		that.setData({
					Cartnum : res.data.count
				})
        	})
        }
    },
	//点击sku
	skuClick(e){
		var that = this;
		that.setData({
			skuActive: e.target.dataset.id,
			skuPrice:e.target.dataset.price,
			inventory:e.target.dataset.quantity,
			skuChose: e.target.dataset.sku
		})
	},
	onTapTag(e) {
        const index = e.currentTarget.dataset.index
        var that = this;
        that.setData({
            activeIndex: index,
        })
        wx.hideToast();
        wx.showToast({
        	title: '加载中',
            icon: 'loading',
            duration: 800
        });
    },
    modalCartTap(e){
    	var that = this;
    	that.setData({
    		modelCard: true,
    		modelCart: true
    	})
    },
    modalBuyTap(e){
    	var that = this;
    	that.setData({
    		modelCard: true,
    		modelCart:false
    	})
    },
    modalChange(e){
    	var that = this;
    	that.setData({
    		modelCard: false,
    		modelCart: false,
    	})
    },
    numAdd:function(e){
    	var that = this;
	    that.setData({
	      inputValue: parseInt(e.target.dataset.add) + 1,
	    })
	    if( that.data.inputValue >= that.data.inventory){
	    	that.setData({
	    		inputValue:that.data.inventory
	    	})
	    	wx.showToast({
	        	title: '库存不足',
	            duration: 1500
	        });
	    }
	},
	  //产品数量减1
	numMinus:function(e){
		var that = this;
	    that.setData({
	      inputValue: parseInt(e.target.dataset.add) - 1,
	    })
	},
	bindKeyInput(e){
		var that = this;
    	var value = e.detail.value
      	that.setData({
        	inputValue:value
      	})
      	if(value > that.data.inventory){
      		that.setData({
      			inputValue: that.data.inventory
      		})
      		wx.showToast({
	        	title: '库存不足',
	            duration: 1500
	        });
      	}
  	},
  	Catadd(e){
  		var that = this;
  		var target_id = e.currentTarget.dataset.id;
  		var n = e.currentTarget.dataset.num;
  		if ( that.data.isLogin == '' || that.data.isLogin == false ){
            wx.setStorageSync('page', that.data.page)
            wx.navigateTo({
                url: '../login/login'
            })
        }else{
        	if (that.data.inventory < that.data.inputValue ){
        		wx.showToast({
		        	title: '库存不足',
		            duration: 1500
		        });
        	}else{
        		wx.showToast({
        			icon: 'loading',
		            duration: 1500
		        });
        		var url = '/app/w_api/cart/add_cart'
	        	request.post(url,{target_id: target_id,n: n,token:that.data.token},function(res){
	        		//console.log(res)
					if ( res.success == true){
						wx.hideToast()
						wx.showToast({
				        	title: res.message,
				            duration: 1500
				        });
						that.setData({
				    		modelCard: false,
				    		modelCart: false
				    	})
				    	var url ='/app/w_api/cart/fetch_cart_count'
				    	request.post(url,{token:that.data.token},function(res){
				    		//console.log(res)
				    		that.setData({
								Cartnum : res.data.count
							})
				    	})
				    }
	        	})
        	}
        }
  	},
  	goCart(e){
  		wx.switchTab({
            url: '../cart/cart'
        })
  	},
  	Gobuy(e){
  		console.log(e)
  		var that = this;
  		var target_id = e.target.dataset.id;
  		var n = e.target.dataset.num;
  		var buyarr = e.target.dataset.buyarr;
  		//console.log(target_id)
  		if ( that.data.isLogin == '' || that.data.isLogin == false ){
            wx.setStorageSync('page', that.data.page)
            wx.navigateTo({
                url: '../login/login'
            })
        }else{
        	if (that.data.inventory < that.data.inputValue ){
	    		wx.showToast({
		        	title: '库存不足',
		            duration: 1500
		        });
	    	}else{
		  		var url = '/app/w_api/order/now_buy'
		  		request.post(url,{target_id: target_id,n: n,token:that.data.token},function(res){
		  			if (res.success == true){
		  				// that.setData({
		  				// 	rid: res.data.order_info.rid
		  				// })
		  				wx.navigateTo({
		            		url: '../nowbuy/nowbuy?target_id='+target_id+'&n='+n+'&buyarr='+buyarr
		        		})
		        		that.setData({
				    		modelCard: false,
				    		modelCart: false
				    	})
		  			}
		  		})
		  	}
        }
  	}
})

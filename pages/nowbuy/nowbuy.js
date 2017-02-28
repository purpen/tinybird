var request = require('../../utils/requestService.js');
Page({
	data:{
		isLogin:'',
        page:'',
        token:'',
        n:'',
        target_id:'',
        noAddress: false,
        rid:'',
        buyinfo:[],
        timedata:['任意时间','周一到周五工作日','周六、周日'],
        index: 0,
        pay_money:'',
        noaddress:'',
        addName:'',
	    addPhone:'',
	    addProvince:'',
	    addCity:'',
	    addArea:'',
	    addTown:'',
	    addHome:'',
	    addbook_id:'',
	    freight:'',
	    is_nowbuy: 1,
	    is_rid:'',
	    rrid:'',
	    buyarr:'',
	},
	onLoad:function(e){
		var that = this;
		that.setData({
            n: e.n,
            target_id: e.target_id,
            buyarr: e.buyarr
        })
		// wx.showToast({
  //       	title: '加载中',
  //           icon: 'loading',
  //           duration: 1000
  //       });    
    },
    onShow:function(){
		var that = this;
		if( that.data.buyarr !== 'false' ){
			var url = '/app/w_api/order/cart_buy';
        	request.post(url,{array:that.data.buyarr,token:wx.getStorageSync('user').token},function(res){
        		if (res.success == true){
					that.setData({
						pay_money: res.data.pay_money,
						rid: res.data.order_info.rid,
						buyinfo: res.data.order_info.dict.items,
						rrid: res.data.order_info._id
					})

					var address = wx.getStorageSync('address');
					if (address){
						that.setData({
							noaddress: false,
							addbook_id: address.addbook_id,
							addProvince: address.addProvince,
			    			addCity: address.addCity,
			    			addArea: address.addArea,
			    			addTown: address.addTown,
			    			addHome: address.addHome,
			    			addPhone: address.addPhone,
			    			addName: address.addName
						})
						var url = '/app/w_api/order/fetch_freight'
						request.post(url,{token:wx.getStorageSync('user').token,addbook_id:address.addbook_id,rid:that.data.rid},function(res){
							that.setData({
								freight: res.data.freight
							})
						})
						wx.removeStorageSync('address');
					}else{
						var url ='/app/w_api/delivery_address/defaulted'
					    request.post(url,{token:wx.getStorageSync('user').token},function(res){
					    	if (res.data.has_default == 0){
					    		that.setData({
					    			noaddress: true
					    		})
					    	}else{
					    		that.setData({
					    			noaddress: false,
					    			addbook_id: res.data._id,
					    			addProvince: res.data.province,
					    			addCity: res.data.city,
					    			addArea: res.data.county,
					    			addTown: res.data.town,
					    			addHome: res.data.address,
					    			addPhone: res.data.phone,
					    			addName: res.data.name,
					    		})
					    		var url = '/app/w_api/order/fetch_freight'
								request.post(url,{rid:that.data.rid,token:wx.getStorageSync('user').token,addbook_id:that.data.addbook_id},function(res){
								
									console.log(res)
									that.setData({
										freight: res.data.freight
									})
								})
					    	}
				        })
					}
				}
        	})
		}
		else if( that.data.buyarr == 'false' ){
			var url = '/app/w_api/order/now_buy'
			request.post(url,{n:that.data.n,target_id:that.data.target_id,token:wx.getStorageSync('user').token},function(res){
				if (res.success == true){
					that.setData({
						pay_money: res.data.pay_money,
						rid: res.data.order_info.rid,
						buyinfo: res.data.order_info.dict.items,
						rrid: res.data.order_info._id
					})

					var address = wx.getStorageSync('address');
					if (address){
						that.setData({
							noaddress: false,
							addbook_id: address.addbook_id,
							addProvince: address.addProvince,
			    			addCity: address.addCity,
			    			addArea: address.addArea,
			    			addTown: address.addTown,
			    			addHome: address.addHome,
			    			addPhone: address.addPhone,
			    			addName: address.addName
						})
						var url = '/app/w_api/order/fetch_freight'
						request.post(url,{token:wx.getStorageSync('user').token,addbook_id:address.addbook_id,rid:that.data.rid},function(res){
							that.setData({
								freight: res.data.freight
							})
						})
						wx.removeStorageSync('address');
					}else{
						var url ='/app/w_api/delivery_address/defaulted'
					    request.post(url,{token:wx.getStorageSync('user').token},function(res){
					    	if (res.data.has_default == 0){
					    		that.setData({
					    			noaddress: true
					    		})
					    	}else{
					    		that.setData({
					    			noaddress: false,
					    			addbook_id: res.data._id,
					    			addProvince: res.data.province,
					    			addCity: res.data.city,
					    			addArea: res.data.county,
					    			addTown: res.data.town,
					    			addHome: res.data.address,
					    			addPhone: res.data.phone,
					    			addName: res.data.name,
					    		})
					    		var url = '/app/w_api/order/fetch_freight'
								request.post(url,{rid:that.data.rid,token:wx.getStorageSync('user').token,addbook_id:that.data.addbook_id},function(res){
								
									console.log(res)
									that.setData({
										freight: res.data.freight
									})
								})
					    	}
				        })
					}
				}
			})
		}
		
		
        var value = wx.getStorageSync('user');
        if (value) {
            that.setData({
                isLogin: true,
                token: value.token
            })
        }else{
            wx.setStorageSync('page', this.data.page)
            wx.navigateTo({
                url: '../login/login'
            })
        }
        
    },
    addRess(e){
    	wx.navigateTo({
            url: '../address/address?rid='+this.data.rid
        })
    },
    bindTimeChange(e){
    	this.setData({
	      	index: e.detail.value
	    })
    },
    //支付订单
    payFor(e){
    	wx.showToast({
        	title: '加载中',
            icon: 'loading',
            duration: 3000
        });
    	var that = this;
    	var url = '/app/w_api/order/confirm'
    	request.post(url,{token:wx.getStorageSync('user').token,rrid:that.data.rrid,addbook_id:that.data.addbook_id,is_nowbuy:that.data.is_nowbuy},function(res){
    		//console.log(res)
    		if(res.success == true){
    			that.setData({
    				is_rid: res.data.rid
    			})
    			wx.login({//login流程
            		success: function (res) {//登录成功
                		var code = res.code;
                		wx.getUserInfo({//getUserInfo流程
							success: function (res2) {//获取userinfo成功
								var encryptedData = res2.encryptedData;//一定要把加密串转成URI编码
								var iv = res2.iv;
								var url = '/app/w_api/order/pay'
						        request.post(url,{token:wx.getStorageSync('user').token,rid:that.data.is_rid,code:code,iv:iv,encryptedData:encryptedData},function(res){
						        	console.log(res)
						        	wx.hideToast()
						        	wx.requestPayment({
						        		'appId': res.data.appid,
										'timeStamp': String(res.data.time_stamp),
										'nonceStr': String(res.data.nonce_str),
										'package': 'prepay_id='+res.data.prepay_id,
										'signType': 'MD5',
										'paySign': String(res.data.sign),
										'success':function(ress){
											wx.switchTab({
												url:'../index/index'
											})
										},
										'fail':function(ress){
											//console.log(ress)
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
    		}
    	})
    
        
    }



})
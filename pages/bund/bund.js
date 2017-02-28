Page({
	data:{
		bundOk: true,
		hintMsg:'',
		toToast:true,
		union_id: '',
		page:'',
		phoneNum:'',
		identifyCode:'',
	},
	bundUp(){
		var that= this;
		that.setData({
			bundOk: false
		})
	},
	bundDown(){
		var that= this;
		that.setData({
			bundOk: true
		})
	},
	onLoad:function(e){
		var that = this;
		that.setData({
			union_id: e.union_id,
			page: getCurrentPages().length
		})
	},
	input_phoneNum(e){
		var that = this;
		that.setData({
			phoneNum: e.detail.value 
		})
    },
    input_identifyCode(e){
    	var that = this;
		that.setData({
			identifyCode: e.detail.value 
		})
    },
	//绑定登陆
	bundLogin(){
		var that = this;
		var phoneNum = that.data.phoneNum;
		var identifyCode = that.data.identifyCode;
		var oid = 'wx0691a2c7fc3ed597';
		var union_id = that.data.union_id;
		if( !(/^1[3|4|5|8][0-9]\d{8}$/i.test(phoneNum)) ){
    		that.setData({
    			hintMsg: "请输入正确的手机号码!",
    			toToast: false 
    		})
    		setTimeout(function(){
    			that.setData({
	    			toToast: true 
	    		})
    		},2000)
	    }else if ( identifyCode == '' ){
	    	that.setData({
    			hintMsg: "请输入密码!",
    			toToast: false 
    		})
    		setTimeout(function(){
    			that.setData({
	    			toToast: true 
	    		})
    		},2000)
	    }else{
	    	wx.showToast({
	            title: '正在绑定...',
	            icon: 'loading',
	            duration: 10000
	        });
	        wx.request({
				url: getApp().globaData.Api_url +'/app/w_api/auth/third_register_with_phone',
				data: {
					account: phoneNum,
					password: identifyCode,
					oid: oid,
					union_id: union_id
				},
				method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
			    success: function(res) {
			    	wx.hideToast();
			    	console.log(getApp().globaData.Api_url +'/app/w_api/auth/third_register_with_phone'+'?account='+phoneNum+'&verify_code='+identifyCode+'&oid='+oid+'&union_id='+union_id)
			    	console.log(res.data)
			    	if ( res.data.success == true){
						wx.setStorageSync('user', {isLogin:true,token:res.data.token,uid:res.data.uid})
			    		wx.navigateBack({
                        	delta: parseInt(that.data.page) - parseInt(wx.getStorageSync('page'))
                        })
                        wx.removeStorageSync('page')
			    	}
			    	if (res.data.status = 3001){
			    		that.setData({
			    			hintMsg: res.data.message,
			    			toToast: false 
			    		})
			    		setTimeout(function(){
			    			that.setData({
				    			toToast: true 
				    		})
			    		},2000)
			    	}
			    }
			})
	    }

	},
	//立即登陆
	loginIn(){
		var that = this;
		wx.getUserInfo({
			success: function(res) {
				var userInfo = res.userInfo
			    var nickName = userInfo.nickName
			    var avatarUrl = userInfo.avatarUrl
			    var gender = userInfo.gender //性别 0：未知、1：男、2：女 
			    var province = userInfo.province
			    var city = userInfo.city
			    var oid = 'wx0691a2c7fc3ed597'
			    var union_id = that.data.union_id
			    wx.showToast({
		            title: '正在登录...',
		            icon: 'loading',
		            duration: 80000
		        });
			    wx.request({
                    url: getApp().globaData.Api_url +'/app/w_api/auth/third_register_without_phone',
                    //url:'http://taihuoniao.me/app/w_api/auth/third_register_without_phone',
                    data: {
                        oid: oid,
                        union_id: union_id,
                        nick_name: nickName,
                        sex:gender,
                        city:city,
                        province:province,
                        avatar_url:avatarUrl,
                    },
                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (result) {
                    	//console.log(result.data)
                    	if (result.data.success == true){
                    		wx.setStorageSync('user', {isLogin:true,token:result.data.token,uid:result.data.uid})
				    		wx.navigateBack({
                            	delta: parseInt(that.data.page) - parseInt(wx.getStorageSync('page'))
                            })
                            wx.removeStorageSync('page')
                    	}
                    	if(result.data.status == 3001 ){
                    		wx.hideToast();
                			that.setData({
				    			hintMsg: result.data.message,
				    			toToast: false 
				    		})
				    		setTimeout(function(){
				    			that.setData({
					    			toToast: true 
					    		})
				    		},2000)
                		}

                    }
                })
			}
		})

	}
	
})
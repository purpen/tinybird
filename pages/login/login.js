var interval = null
var currentTime =60
var phoneNum = null
var identifyCode = null
Page({
	data: {
		hintMsg:'',
	    loading: false,
    	messge:'获取动态密码',
    	disAbled:false,
    	toToast:true,
    	page:'',
	},
	input_phoneNum(e){
    	phoneNum = e.detail.value 
    },
    input_identifyCode(e){
        identifyCode = e.detail.value  
    },
    onLoad:function(){
    	var that = this;
    	that.setData({
    		page: getCurrentPages().length
    	})
    },
    getMsg(e){
    	var that = this;
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
	    }else{
	    	wx.request({
				url: 'http://t.taihuoniao.com/app/w_api/auth/send_mms_captcha',
				data: {
					mobile: phoneNum
				},
				header: {
			        'Content-Type': 'application/json'
			    }
			})
	    	interval = setInterval(function(){  
	            currentTime--;  
	            that.setData({  
	                messge : currentTime +'后重新发送', 
	                disAbled: true
	            })
	            if(currentTime <= 0){  
	                clearInterval(interval)
	                that.setData({  
		                messge : '获取动态密码', 
		                disAbled: false
		            })
	                currentTime = 60  
	            }  
	        }, 1000)
	    }
         
        
    },
    wxLogin(e){
    	var that = this;
        wx.login({//login流程
            success: function (res) {//登录成功
                if (res.code) {
                    var code = res.code;
                    wx.getUserInfo({//getUserInfo流程
                        success: function (res2) {//获取userinfo成功
                            var encryptedData = res2.encryptedData;//一定要把加密串转成URI编码
                            var iv = res2.iv;
                            wx.showToast({
                            	title: '加载中',
					            icon: 'loading',
					            duration: 10000
					        });
                            wx.request({
                                url: getApp().globaData.Api_url +'/app/w_api/auth/wechat_token',
                                //url: 'http://taihuoniao.me/app/w_api/auth/wechat_token',
                                data: {
                                    code: code,
                                    encryptedData: encryptedData,
                                    iv: iv
                                },
                                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                },
                                success: function (result) {
                                	//console.log(result.data)
                                    if ( result.data.success == true ){
                                    	//已绑定的
                                        if( result.data.data.exist_user == 1){
                                            wx.setStorageSync('user', {isLogin:true,token:result.data.token,uid:result.data.uid})
                                            wx.navigateBack({
                                            	delta: parseInt(that.data.page) - parseInt(wx.getStorageSync('page'))
                                            })
                                            wx.removeStorageSync('page')
                                        }else{
                                            wx.navigateTo({
                                        		url:'../bund/bund?union_id='+result.data.data.auth_info.union_id
                                        	})

                                        }
                                    } 
                                    wx.hideToast();

                                },
                                fail: function () {
                                  // fail
                                  // wx.hideToast();
                                },
                                complete: function () {
                                  // complete
                                }
                            })
                            //Login(code,encryptedData,iv);
                        }
                    })

                } else {
                    //console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
    },
    fastLogin(e){
    	var that = this;
    	if(!(/^1[3|4|5|8][0-9]\d{8}$/i.test(phoneNum))){  
    		that.setData({
    			hintMsg: "请输入正确的电话号码!",
    			toToast: false 
    		})
    		setTimeout(function(){
    			that.setData({
	    			toToast: true 
	    		})
    		},2000)
	    }else if ( identifyCode && identifyCode!=null && (/^1[3|4|5|8][0-9]\d{8}$/i.test(phoneNum)) ){
	        wx.showToast({
	            title: '正在登录...',
	            icon: 'loading',
	            duration: 10000
	        });
	        wx.request({
				url: getApp().globaData.Api_url +'/app/w_api/auth/quick_login',
				data: {
					account: phoneNum,
					verify_code: identifyCode
				},
				header: {
			        'Content-Type': 'application/json'
			    },
			    success: function(res) {
			    	wx.hideToast();
			    	//console.log(res.data)
			    	if ( res.data.success == true){
						wx.setStorageSync('user', {isLogin:true,token:res.data.token,uid:res.data.uid})
			    		wx.navigateBack({
                        	delta: parseInt(that.data.page) - parseInt(wx.getStorageSync('page'))
                        })
                        wx.removeStorageSync('page')
			    	}else{
		    			that.setData({
			    			hintMsg: '验证码错误！',
			    			toToast: false 
			    		})
			    		setTimeout(function(){
			    			that.setData({
				    			toToast: true 
				    		})
			    		},2000)
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
	    }else{
	    	that.setData({
    			hintMsg: "请输入验证码!",
    			toToast: false 
    		})
    		setTimeout(function(){
    			that.setData({
	    			toToast: true 
	    		})
    		},2000)
	    }
    },

})
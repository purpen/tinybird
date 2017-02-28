var request = require('../../utils/requestService.js')
Page({
	data:{
		noaddress: true,
		addTo: false,
		token: '',
		province:[],
		index:'',
	    oid:[],
	    poid:'',
	    city:[],
	    coid:[],
	    cindex:'',
	    cpoid:'',
	    area:[],
	    aoid:[],
	    aindex:'',
	    apoid:'',
	    town:[],
	    toid:'',
	    tindex:'',
	    addlist:[],
	    addcount:'',
	    rid:'',
	    addName:'',
	    addPhone:'',
	    addZip:'',
	    addProvince:'',
	    addCity:'',
	    addArea:'',
	    addTown:'',
	    addHome:'',
	    is_default: 0,
	    hintMsg:'',
	    toToast:true,
	    addbook_id:'',
	    is_switch: false,
	},
	onLoad:function(e){
		var that = this;
		that.setData({
			rid: e.rid
		})

	},
	onShow:function(){
		var that = this;
		that.setData({
			token : wx.getStorageSync('user').token
		})
		var url = '/app/w_api/delivery_address/getlist'
		request.post(url,{token:that.data.token},function(res){
			//console.log(res)
			that.setData({
				addlist: res.data.rows,
				addcount: res.data.rows.length
			})
			if ( res.data.rows.length == 0 ){
				that.setData({
					addTo: false
				})
				// if( that.data.rid ){
				// 	that.setData({
				// 		addTo: true
				// 	})
				// }else{
				// 	that.setData({
				// 		addTo: false
				// 	})
				// }
			}else{
				that.setData({
					noaddress: false
				})
			}
		})
		var url = '/app/w_api/common/fetch_city'
        request.post(url,{layer:1,token:that.data.token},function(res){
        	var province = [];
        	var oid = [];
        	for (var i=0;i<res.data.rows.length;i++ ){
        		province[i] = res.data.rows[i].name
        		oid[i] = res.data.rows[i].oid
        	}
        	that.setData({
				province: province,
				oid: oid
			})
        })
	},
	addRess(e){

		this.setData({
			addTo: true
		})
	},
	//取消
	Canse(e){
		var that = this;
		if (that.data.addcount == 0 ){
			that.setData({
				addTo: false,
				addName:'',
				addPhone:'',
				addHome:'',
				addProvince:'',
				addCity:'',
				addArea:'',
				addTown:'',
				addbook_id:'',
				addZip:'',
				index:'',
				cindex:'',
				aindex:'',
				tindex:''
			})
		}else{
			that.setData({
				noaddress: false,
				addTo: false,
				addName:'',
				addPhone:'',
				addHome:'',
				addProvince:'',
				addCity:'',
				addArea:'',
				addTown:'',
				addbook_id:'',
				addZip:'',
				index:'',
				cindex:'',
				aindex:'',
				tindex:''
			})
		}
	},
	addSubmit(e){
		var that = this;
		if (that.data.addName == ''){
			that.setData({
    			hintMsg: "请输入姓名!",
    			toToast: false 
    		})
    		setTimeout(function(){
    			that.setData({
	    			toToast: true 
	    		})
    		},2000)
		}else if ( !(/^1[3|4|5|8][0-9]\d{8}$/i.test(that.data.addPhone)) ){
			that.setData({
    			hintMsg: "请输入正确的手机号码!",
    			toToast: false 
    		})
    		setTimeout(function(){
    			that.setData({
	    			toToast: true 
	    		})
    		},2000)
		}else if( !(/^[a-zA-Z0-9 ]{3,12}$/.exec(that.data.addZip))){
			that.setData({
    			hintMsg: "请输入正确的邮编!",
    			toToast: false 
    		})
    		setTimeout(function(){
    			that.setData({
	    			toToast: true 
	    		})
    		},2000)
		}else if( that.data.addProvince == '' ){
			that.setData({
    			hintMsg: "请选择省份!",
    			toToast: false 
    		})
    		setTimeout(function(){
    			that.setData({
	    			toToast: true 
	    		})
    		},2000)
		}else if( that.data.addCity == '' ){
			that.setData({
    			hintMsg: "请选择城市!",
    			toToast: false 
    		})
    		setTimeout(function(){
    			that.setData({
	    			toToast: true 
	    		})
    		},2000)
		}else if( that.data.addArea == '' ){
			that.setData({
    			hintMsg: "请选择地区!",
    			toToast: false 
    		})
    		setTimeout(function(){
    			that.setData({
	    			toToast: true 
	    		})
    		},2000)
		}else if( that.data.addHome == '' ){
			that.setData({
    			hintMsg: "请输入详细地址!",
    			toToast: false 
    		})
    		setTimeout(function(){
    			that.setData({
	    			toToast: true 
	    		})
    		},2000)
		}else{
			var url ='/app/w_api/delivery_address/save'
			request.post(url,{id:that.data.addbook_id,token:that.data.token,name:that.data.addName,phone:that.data.addPhone,province_id:that.data.addProvince,city_id:that.data.addCity,county_id:that.data.addArea,town_id:that.data.addArea,address:that.data.addHome,zip:that.data.addZip,is_default:that.data.is_default},function(res){
				if( res.success == true ){
					var url = '/app/w_api/delivery_address/getlist'
					request.post(url,{token:that.data.token},function(res2){
						that.setData({
							addTo: false,
							noaddress: false,
							addlist: res2.data.rows,
							addcount: res2.data.rows.length,
							addName:'',
							addPhone:'',
							addHome:'',
							addProvince:'',
							addCity:'',
							addArea:'',
							addTown:'',
							addbook_id:'',
							addZip:'',
							index:'',
							cindex:'',
							aindex:'',
							tindex:''
						})
					})
				}
			})
		}
		

	},
	addName(e){
		this.setData({
			addName:e.detail.value
		})
	},
	addPhone(e){
		this.setData({
			addPhone:e.detail.value
		})
	},
	addZip(e){
		this.setData({
			addZip:e.detail.value
		})
	},
	addHome(e){
		this.setData({
			addHome:e.detail.value
		})
	},
	switchChange(e){
		if ( e.detail.value == true ){
			this.setData({
				is_default: 1
			})
		}else{
			this.setData({
				is_default: 0
			})
		}
	},
	//编辑
	addEdit(e){

		var that = this;
		var url = '/app/w_api/common/fetch_city'
        request.post(url,{layer:1,token:that.data.token},function(res){
        	var province = [];
        	var oid = [];
        	for (var i=0;i<res.data.rows.length;i++ ){
        		province[i] = res.data.rows[i].name
        		oid[i] = res.data.rows[i].oid
        		if(oid[i] == e.target.dataset.province ){
        			that.setData({
        				index: i
        			})
        		}
        	}
        	that.setData({
        		addProvince: e.target.dataset.province,
				province: province,
				oid: oid
			})
			var url = '/app/w_api/common/fetch_city'
	        request.post(url,{layer:2,pid:e.target.dataset.province,token:that.data.token},function(res){
	        	console.log(res)
	        	var city = [];
	        	var coid = [];
	        	for (var i=0;i<res.data.rows.length;i++ ){
	        		city[i] = res.data.rows[i].name
	        		coid[i] = res.data.rows[i].oid
	        		if(coid[i] == e.target.dataset.city ){
	        			that.setData({
	        				cindex: i
	        			})
	        		}
	        	}
	        	that.setData({
					city: city,
					coid: coid,
					addCity: e.target.dataset.city
				})
				var url = '/app/w_api/common/fetch_city'
				request.post(url,{layer:3,pid:e.target.dataset.city,token:that.data.token},function(res){
		        	var area = [];
		        	var aoid = [];
		        	for (var i=0;i<res.data.rows.length;i++ ){
		        		area[i] = res.data.rows[i].name
		        		aoid[i] = res.data.rows[i].oid
		        		if(aoid[i] == e.target.dataset.county ){
		        			that.setData({
		        				aindex: i
		        			})
		        		}
		        	}
		        	that.setData({
						area: area,
						aoid: aoid,
						addArea: e.target.dataset.county
					})
					var url = '/app/w_api/common/fetch_city'
			        request.post(url,{layer:4,pid:e.target.dataset.county,token:that.data.token},function(res){
			        	var town = [];
			        	var toid = [];
			        	for (var i=0;i<res.data.rows.length;i++ ){
			        		town[i] = res.data.rows[i].name
			        		toid[i] = res.data.rows[i].oid
			        		if(aoid[i] == e.target.dataset.town ){
			        			that.setData({
			        				tindex: i
			        			})
			        		}
			        	}
			        	that.setData({
							town: town,
							toid: toid,
							addTown: e.target.dataset.town
						})
			        })
		        })

	        })
        })

	    
		if(e.target.dataset.default == 1){
			that.setData({
				is_switch: true
			})
		}else{
			that.setData({
				is_switch: false
			})
		}
		that.setData({
			addTo: true,
			addbook_id : e.target.dataset.id,
			addName: e.target.dataset.name,
			addPhone: e.target.dataset.phone,
			addHome: e.target.dataset.address,
			addZip: e.target.dataset.zip,
		})
	},
	//删除
	addDel(e){
		var that = this;
		wx.showModal({
		  title: '确定删除地址？',
		  confirmColor:'#be8914',
		  success: function(res) {
		    if (res.confirm) {
		      	var url = '/app/w_api/delivery_address/deleted'
				request.post(url,{id:e.target.dataset.id,token:that.data.token},function(res){
					//console.log(res)
					var url = '/app/w_api/delivery_address/getlist'
					request.post(url,{token:that.data.token},function(res){
						that.setData({
							addlist: res.data.rows,
							addcount: res.data.rows.length
						})
						if ( res.data.rows.length == 0 ){
							that.setData({
								addTo: false
							})
							// if( that.data.rid ){
							// 	that.setData({
							// 		addTo: true
							// 	})
							// }else{
							// 	that.setData({
							// 		addTo: false
							// 	})
							// }
						}else{
							that.setData({
								noaddress: false
							})
						}
					})
				})
		    }
		  }
		})
		
	},

	bindProvince(e){
		var that = this;
		that.setData({
	      	index: e.detail.value,
	      	poid: that.data.oid[e.detail.value],
	      	addProvince: that.data.oid[e.detail.value]
	    })

	    var url = '/app/w_api/common/fetch_city'
        request.post(url,{layer:2,pid:that.data.poid,token:that.data.token},function(res){
        	//console.log(res)
        	var city = [];
        	var coid = [];
        	for (var i=0;i<res.data.rows.length;i++ ){
        		city[i] = res.data.rows[i].name
        		coid[i] = res.data.rows[i].oid
        	}
        	that.setData({
				city: city,
				coid: coid,
				cindex: 0,
				aindex: 0,
				tindex: 0,
				addCity: coid[0]
			})
			var url = '/app/w_api/common/fetch_city'
			request.post(url,{layer:3,pid:that.data.coid[0],token:that.data.token},function(res){
	        	var area = [];
	        	var aoid = [];
	        	for (var i=0;i<res.data.rows.length;i++ ){
	        		area[i] = res.data.rows[i].name
	        		aoid[i] = res.data.rows[i].oid
	        	}
	        	that.setData({
					area: area,
					aoid: aoid,
					aindex: 0,
					tindex: 0,
					addArea: aoid[0]
				})
				var url = '/app/w_api/common/fetch_city'
		        request.post(url,{layer:4,pid:that.data.aoid[0],token:that.data.token},function(res){
		        	var town = [];
		        	var toid = [];
		        	for (var i=0;i<res.data.rows.length;i++ ){
		        		town[i] = res.data.rows[i].name
		        		toid[i] = res.data.rows[i].oid
		        	}
		        	that.setData({
						town: town,
						toid: toid,
						tindex: 0,
						addTown: toid[0]
					})
		        })
	        })

        })
	},
	bindCity(e){
		var that = this;
		that.setData({
	      	cindex: e.detail.value,
	      	cpoid: that.data.coid[e.detail.value],
	      	addCity: that.data.coid[e.detail.value]
	    })
	    var url = '/app/w_api/common/fetch_city'
        request.post(url,{layer:3,pid:that.data.cpoid,token:that.data.token},function(res){
        	var area = [];
        	var aoid = [];
        	for (var i=0;i<res.data.rows.length;i++ ){
        		area[i] = res.data.rows[i].name
        		aoid[i] = res.data.rows[i].oid
        	}
        	that.setData({
				area: area,
				aoid: aoid,
				aindex: 0,
				tindex: 0,
				addArea: aoid[0]
			})
			var url = '/app/w_api/common/fetch_city'
	        request.post(url,{layer:4,pid:that.data.aoid[0],token:that.data.token},function(res){
	        	//console.log(res)
	        	var town = [];
	        	var toid = [];
	        	for (var i=0;i<res.data.rows.length;i++ ){
	        		town[i] = res.data.rows[i].name
	        		toid[i] = res.data.rows[i].oid
	        	}
	        	that.setData({
					town: town,
					toid: toid,
					tindex: 0,
					addTown: toid[0]
				})
	        })
        })
	},
	bindArea(e){
		var that = this;
		that.setData({
	      	aindex: e.detail.value,
	      	apoid: that.data.aoid[e.detail.value],
	      	addArea: that.data.aoid[e.detail.value]
	    })
	    var url = '/app/w_api/common/fetch_city'
        request.post(url,{layer:4,pid:that.data.apoid,token:that.data.token},function(res){
        	//console.log(res)
        	var town = [];
        	var toid = [];
        	for (var i=0;i<res.data.rows.length;i++ ){
        		town[i] = res.data.rows[i].name
        		toid[i] = res.data.rows[i].oid
        	}
        	that.setData({
				town: town,
				toid: toid,
				tindex: 0,
				addTown: toid[0]
			})
        })
	},
	bindTown(e){
		var that = this;
		that.setData({
	      	tindex: e.detail.value,
	    })
	},
	Rid(e){
		wx.setStorageSync('address', {addbook_id:e.currentTarget.dataset.id,addName:e.currentTarget.dataset.name,addProvince:e.currentTarget.dataset.province,addCity:e.currentTarget.dataset.city,addArea:e.currentTarget.dataset.county,addTown:e.currentTarget.dataset.town,addHome:e.currentTarget.dataset.address,addPhone:e.currentTarget.dataset.phone})
        //console.log(wx.getStorageSync('address'))
        wx.navigateBack({
        	delta: 1
        })
	},

})
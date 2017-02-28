var Api_url = 'https://m.taihuoniao.com';
function post(url,data,cb){
    wx.request({
        url: Api_url+url,
        data: data,
        header: {'content-type': 'application/x-www-form-urlencoded'},
        method: 'POST',
        success: function(res){  
            return typeof cb == "function" && cb(res.data)  
        },  
        fail: function(){  
            return typeof cb == "function" && cb(false)  
        }  
    })
}
module.exports.post = post;
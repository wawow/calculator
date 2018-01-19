Page({
    data:{
    	list : [],
        alpha: '',
        windowHeight: ''
    },
    onLoad(){
    	let t = this;
	    var res = wx.getSystemInfoSync()
	    this.pixelRatio = res.pixelRatio;
	    this.apHeight = 16;
	    this.offsetTop = 80;
	    wx.request({
		    url: 'https://www.maxappa.com/api/detail.php',
		    data:{
			    all : 'city'
		    },
		    success: function(res) {
			    var citylist = res.data;
			    var list=[],
				    ABCArr = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","W","X","Y","Z"];
			    for (var i = 0,len = ABCArr.length; i < len; i++ ) {
				    list.push({
					    "alphabet" : ABCArr[i],
					    "datas" : []
				    });
				    citylist.forEach(function(val){
					    if (val.initial == ABCArr[i]){
						    list[i].datas.push(val.cityname)
					    }
				    });
			    }
			    t.setData({
				    list : list
			    });
		    }
	    });
	    t.setData({
		    windowHeight: res.windowHeight + 'px'
	    });
    },
    handlerAlphaTap(e) {
        let {ap} = e.target.dataset;
        this.setData({alpha: ap});
    },
    handlerMove(e) {
        let {list} = this.data;
        let moveY = e.touches[0].clientY;
        let rY = moveY - this.offsetTop;
        if(rY >= 0) {
          let index = Math.ceil((rY - this.apHeight)/ this.apHeight);
          if(0 <= index < list.length) {
            let nonwAp = list[index];
            nonwAp && this.setData({alpha: nonwAp.alphabet});
          }
        }
    },
    handlerCity(e){
	    wx.request({
		    url: 'https://www.maxappa.com/api/detail.php',
		    data:{
			    city : e.currentTarget.dataset.text
		    },
		    success: function(res) {
			    console.log(res.data);
		    }
	    });
    }
})

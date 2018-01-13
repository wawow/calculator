//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var amapFile = require('../../utils/amap-wx.js');

Page({
	onShareAppMessage: function (res) {
		return this.data.shareData
	},
	data: {
		city : [],
		citydata : [],
		cityIndex : '',
		money: '',
		insurance : '',
		fund : '',
		localdata : [],
		show : 'none',
		shareData : {
			path : '/pages/index/index'
		},
		userInfo : {}
	},
	getUserInfo(){
		var t = this;
		wx.getUserInfo({
			success: function(res) {
				var data = res.userInfo
				var nickName = data.nickName
				var avatarUrl = data.avatarUrl
				wx.downloadFile({
					url: avatarUrl,
					success: function(res) {
						if (res.statusCode === 200) {
							t.setData({
								userInfo : {
									nickName : nickName,
									avatarUrl : res.tempFilePath
								}
							});
						}
					}
				});
			}
		})
	},
	getCanvasImage:function(){
		let t = this;
		const ctx = wx.createCanvasContext('firstCanvas');
		ctx.save()
		ctx.drawImage('../../static/images/qrcode.jpg',0,0,200,160);
		ctx.restore()
		ctx.arc(100, 80, 35, 0, 2*Math.PI)
		ctx.clip()
		ctx.drawImage(t.data.userInfo.avatarUrl,65,45,70,70);
		ctx.restore()
		ctx.draw()
	},
	onLoad:function () {
		var t = this;
		t.getUserInfo();
		wx.request({
			url: 'https://www.maxappa.com/api/city.php',
			success: function(res) {
				var City = [];
				for(var i=0;i<res.data.length;i++){
					City.push(res.data[i].city);
				}
				t.setData({
					city : City,
					citydata : res.data
				});
				t.getCity();
			}
		});
	},
	getImage:function(){
		var t = this;
		wx.canvasToTempFilePath({
			x: 0,
			y: 0,
			width: 200,
			height: 160,
			destWidth: 200,
			destHeight: 160,
			canvasId: 'firstCanvas',
			success : (res) => {
				wx.saveFile({
					tempFilePath: res.tempFilePath,
					success:(res) => {
						//更新分享标题
						t.setData({
							shareData : {
								imageUrl : res.savedFilePath
							}
						});
					}
				});
			},
			fail : (e) =>{
				console.log(e)
			}
		})
	},
	count:function () {
		let t = this,
			data = t.data,
			money = data.money,
			localdata = data.localdata;
		//公积金、社保如果用户自定义以自定义为主
		var insurance = t.getBase(data.insurance,localdata.sbMin,localdata.sbMax),
			fund = t.getBase(data.fund,localdata.gjjMin,localdata.gjjMax);
		t.setData({
			insurance : insurance,
			fund : fund
		});
		//获取用户缴纳对应金额
		var	yanglao = t.getBase(insurance,localdata.sbMin,localdata.sbMax,0.08),
			yiliao = t.getBase(insurance,localdata.sbMin,localdata.sbMax,0.02),
			shiye = t.getBase(insurance,localdata.sbMin,localdata.sbMax,0.002),
			zhufang = t.getBase(fund,localdata.gjjMin,localdata.gjjMax,localdata.gjjBl),
			shuiqian = util.formatNum(money - yanglao - yiliao - shiye - zhufang),
			individualIncomeTax = util.formatNum(t.getTax(shuiqian)),
			postTaxWage = util.formatNum(shuiqian - individualIncomeTax);

		if(money == ''){
			t.openToast('请输入月薪');
			t.setData({
				show : 'none'
			});
			return false;
		}else{
			t.setData({
				yanglao: yanglao,
				yiliao: yiliao,
				shiye: shiye,
				zhufang: zhufang,
				postTaxWage: postTaxWage,
				individualIncomeTax : individualIncomeTax,
				gjjBl : util.formatNum(t.data.localdata.gjjBl * 100),
				show : 'block'
			});
			t.getImage();
		}
	},
	getCity:function () {
		let t = this;
		var myAmapFun = new amapFile.AMapWX({key:'536e0fcadf78c63f2ad7f413a672462e'});
		myAmapFun.getRegeo({
			success:(data) => {
				let city = data[0].regeocodeData.addressComponent.province;
				for(var i=0;i<t.data.city.length;i++){
					if(city == t.data.city[i]){
						t.setData({
							cityIndex: i
						});
						t.getCityData(city);
					}else{
						t.setData({
							cityIndex: 0
						});
						t.getCityData('北京市');
					}
				}

				t.getCanvasImage();
			},
			fail: () => {
				t.openToast('定位失败，请手动选择城市！');
				t.setData({
					cityIndex: 0
				});
				t.getCityData('北京市');
				t.getCanvasImage();
			}
		});
	},
	getCityData:function (city) {
		let t = this,
			data = t.data;
		for(var i=0;i<data.citydata.length;i++){
			if(city == data.citydata[i].city){
				t.setData({
					localdata : data.citydata[i],
					insurance : t.getBase(data.money,data.citydata[i].sbMin,data.citydata[i].sbMax),
					fund : t.getBase(data.money,data.citydata[i].gjjMin,data.citydata[i].gjjMax)
				});
			}
		}
	},
	setMoney:function (e) {
		var t = this,
			data = t.data,
			money = e.detail.value;
		t.setData({
			money: money,
			insurance : t.getBase(money,data.citydata.sbMin,data.citydata.sbMax),
			fund : t.getBase(money,data.citydata.gjjMin,data.citydata.gjjMax)
		});
	},
	setInsurance:function (e) {
		this.setData({
			insurance : e.detail.value
		});
	},
	setFund:function (e) {
		this.setData({
			fund : e.detail.value
		});
	},
	getBase:function (money,min,max,scale) {
		var scale = scale || 1;
		if(money < min){
			return util.formatNum(min * scale);
		}else if(money > max){
			return util.formatNum(max * scale);
		}else{
			return util.formatNum(money * scale);
		}
	},
	getTax:function(money){
		var money = money - 3500;
		if(money <= 0){
			return 0;
		}else if(money > 0 && money <= 1500){
			return (util.formatNum(money*0.03))
		}else if(money > 1500 && money <= 4500){
			return (util.formatNum(money*0.1))-105
		}else if(money > 4500 && money <= 9000){
			return (util.formatNum(money*0.2))-555
		}else if(money > 9000 && money <= 35000){
			return (util.formatNum(money*0.25))-1005
		}else if(money > 35000 && money <= 55000){
			return (util.formatNum(money*0.3))-2755
		}else if(money > 55000 && money <= 80000){
			return (util.formatNum(money*0.35))-5505
		}else if(money > 80000){
			return (util.formatNum(money*0.45))-13505
		}
	},
	openToast: function (name) {
		wx.showModal({
			content: name,
			showCancel : false
		})
	},
	changeCity: function (e) {
		this.setData({
			cityIndex: e.detail.value,
			show : 'none'
		});
		this.getCityData(this.data.city[e.detail.value]);
	}
})

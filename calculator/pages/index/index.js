//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var amapFile = require('../../utils/amap-wx.js');
var sliderWidth = 96;

Page({
	onShareAppMessage: function (res) {
		return this.data.shareData
	},
	data: {
		tabs: ["个税计算", "年终计算"],
		activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
		city : '请选择城市',
		citydata : {
			yanglao : '', //养老金
			gjj : '', //公积金
			yiliao : '', //医保
			shiye : '', //失业
			yanglaoBl : '', //社保基数
			gjjBl : '', //公积金基数
			yiliaoBl : '', //医疗基数
			shiyeBl : '', //失业基数
			wage : '', //当地平均工资
			wageMax : '', //当地工资上限
			wageMin : '', //当地工资下限
			gjjMax : '', //公积金最大
			gjjMin : '' //公积金最小
		},
		insurance : '',
		fund : '',
		money: '',
		show : 'none',
		showYear : 'none',
		shareData : {
			path : '/pages/index/index'
		},
		yearAwardAfter : '',
		yearAward : ''
	},
	onLoad(option) {
		var t = this;
		wx.getSystemInfo({
            success: function(res) {
                t.setData({
                    sliderLeft: (res.windowWidth / t.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / t.data.tabs.length * t.data.activeIndex
                });
            }
        });
		t.getCity(option);
	},
	getCity(option) {
		let t = this;
		var city = option.city;
		if(city){
			t.setData({
				city: city
			});
			t.getCityData(city);
		}else{
			var myAmapFun = new amapFile.AMapWX({key:'536e0fcadf78c63f2ad7f413a672462e'});
			myAmapFun.getRegeo({
				success:(data) => {
				let city = data[0].regeocodeData.addressComponent.province;
				wx.request({
					url: 'https://www.maxappa.com/api/detail.php',
					data:{
						all : 'city'
					},
					success: function(res) {
						for(var i = 0;i<res.data.length;i++){
							if(!(city.indexOf(res.data[i].cityname))){
								var cityName = res.data[i].cityname;
								t.setData({
									city: cityName
								});
							}
						}
						t.getCityData(cityName);
					}
				});

			},
				fail: () => {
					t.openToast('定位失败，请手动选择城市！');
					t.setData({
						city: '北京'
					});
					t.getCityData('北京');
				}
			});
		}
	},
	getCityData(city){
		let t = this;
		wx.request({
		    url: 'https://www.maxappa.com/api/detail.php',
		    data:{
		        city : city
		    },
		    success: function(res) {
		    	let data = res.data;
		        t.setData({
		            citydata : {
			            yanglaoBl : util.formatNum(data.ylBl/100),
		                gjjBl : util.formatNum(data.gjjBl/100),
		                yiliaoBl : util.formatNum(data.yiliaoBl/100),
		                shiyeBl : util.formatNum(data.shiyeBl/100),
		                wage : util.formatNum(data.wage),
			            dbyiliao_qian : data.dbyiliao_qian,
			            dbyiliao_bl : data.dbyiliao_bl,
		                wageMax : !(data.wageMax == null) ? util.formatNum(data.wageMax) : util.formatNum(data.wage*3),
		                wageMin : !(data.wageMin == null) ? util.formatNum(data.wageMin) : util.formatNum(data.wage*0.6),
		                gjjMax : !(data.gjjMax == null) ? util.formatNum(data.gjjMax) : util.formatNum(data.wage*3),
		                gjjMin : !(data.gjjMin == null) ? util.formatNum(data.gjjMin) : util.formatNum(data.wage*0.6)
		            }
		        });
		    }
		});
	},
	count() {
		//获取税后工资
		let t = this,
			data = t.data,
			money = data.money,
			citydata = data.citydata;
		//公积金、社保如果用户自定义以自定义为主
		var insurance = t.getBase(data.insurance,citydata.wageMin,citydata.wageMax),
			fund = t.getBase(data.fund,citydata.gjjMin,citydata.gjjMax);
		t.setData({
			insurance : insurance,
			fund : fund
		});
		var	yibaoBl = util.formatNum(citydata.yiliaoBl) + util.formatNum(citydata.dbyiliao_bl),
			yanglao = t.getBase(insurance,citydata.wageMin,citydata.wageMax,citydata.yanglaoBl),
			yiliao = t.getBase(insurance,citydata.wageMin,citydata.wageMax,yibaoBl) + util.formatNum(citydata.dbyiliao_qian),
			shiye = t.getBase(insurance,citydata.wageMin,citydata.wageMax,citydata.shiyeBl),
			zhufang = t.getBase(fund,citydata.gjjMin,citydata.gjjMax,citydata.gjjBl),
			shuiqian = util.formatNum(money - yanglao - yiliao - shiye - zhufang),
			individualIncomeTax = util.formatNum(t.getTax(shuiqian)),
			postTaxWage = util.formatNum(shuiqian - individualIncomeTax);
		if(money == '' && t.data.activeIndex == 0){
			t.openToast('请输入月薪');
			t.setData({
				show : 'none'
			});
			return false;
		}else{
			t.setData({
				yanglao : yanglao,
				yiliao: yiliao,
				shiye: shiye,
				zhufang: zhufang,
				gjjBl : util.formatNum(citydata.gjjBl * 100),
				yanglaoBl : util.formatNum(citydata.yanglaoBl * 100),
				yiliaoBl : util.formatNum(citydata.yiliaoBl * 100),
				shiyeBl : util.formatNum(citydata.shiyeBl * 100),
				postTaxWage: postTaxWage,
				individualIncomeTax : individualIncomeTax,
				show : 'block'
			});
			t.getCanvasImage();
		}
	},
	countYearAward() {
		//获取年终奖
		let t = this,
			data = t.data,
			yearAward = data.yearAward;
		var yearAwardAfter = util.formatNum(t.getYearTax(yearAward));
		if(yearAward == '' && t.data.activeIndex == 1){
			t.openToast('请输入年终奖金');
			t.setData({
				showYear : 'none'
			});
			return false;
		}else{
			t.setData({
				yearAwardAfter : yearAwardAfter,
				showYear : 'block'
			});
			t.getCanvasImage();
		}
	},
	getCanvasImage(){
		let t = this;
		const ctx = wx.createCanvasContext('firstCanvas');
		ctx.save()
		ctx.drawImage('../../static/images/qrcode.jpg',0,0,200,160);
		ctx.restore()
		ctx.draw();
		t.getImage();
	},
	getImage(){
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
	setMoney(e) {
		var t = this,
			data = t.data,
			money = e.detail.value;
		t.setData({
			money: money,
			insurance : t.getBase(money,data.citydata.wageMin,data.citydata.wageMax),
			fund : t.getBase(money,data.citydata.gjjMin,data.citydata.gjjMax)
		});
	},
	setYearAward(e){
		var t = this,
			data = t.data,
			yearAward = e.detail.value;
		t.setData({
			yearAward: yearAward
		});
	},
	setInsurance(e) {
		this.setData({
			insurance : e.detail.value
		});
	},
	setFund(e) {
		this.setData({
			fund : e.detail.value
		});
	},
	getBase(money,min,max,scale) {
		var scale = scale || 1;
		if(money < min){
			return util.formatNum(min * scale);
		}else if(money > max){
			return util.formatNum(max * scale);
		}else{
			return util.formatNum(money * scale);
		}
	},
	getTax(money){
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
	getYearTax(money){
		var moneyMonth = money / 12;
		if(moneyMonth <= 0){
			return 0;
		}else if(moneyMonth > 0 && moneyMonth <= 1500){
			return util.formatNum(money - (money * 0.03))
		}else if(moneyMonth > 1500 && moneyMonth <= 4500){
			return util.formatNum(money - (money * 0.1 - 105))
		}else if(moneyMonth > 4500 && moneyMonth <= 9000){
			return util.formatNum(money - (money * 0.2 - 555))
		}else if(moneyMonth > 9000 && moneyMonth <= 35000){
			return util.formatNum(money - (money * 0.25 - 1005))
		}else if(moneyMonth > 35000 && moneyMonth <= 55000){
			return util.formatNum(money - (money * 0.3 - 2755))
		}else if(moneyMonth > 55000 && moneyMonth <= 80000){
			return util.formatNum(money - (money * 0.35 - 5505))
		}else if(moneyMonth > 80000){
			return util.formatNum(money - (money * 0.45 - 13505))
		}
	},
	openToast(name) {
		wx.showModal({
			content: name,
			showCancel : false
		})
	},
	tabClick(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,
			money : '',
			yearAward : '',
			show : 'none',
			showYear : 'none',
        });
    }
})

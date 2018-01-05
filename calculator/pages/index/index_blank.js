//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var amapFile = require('../../utils/amap-wx.js');
var localData = require('../../localData.js');

Page({
	data: {
		money: '', //工资总额
		fund: '', //公积金
		insurance: '', //社保
		individualIncomeTax: '', //个人所得税
		postTaxWage: '', //税后工资
		yanglao: '',
		yiliao: '',
		shiye: '',
		zhufang: '',
		gjjBl : '',
		bczhufang: '',
		city : localData.City,
		cityIndex : '',
		localdata : '',
		show: 'none'
	},
	openToast: function (name) {
		wx.showModal({
			content: name,
			showCancel : false
		})
	},
	onLoad: function (e) {
		var t = this;
		var myAmapFun = new amapFile.AMapWX({key:'536e0fcadf78c63f2ad7f413a672462e'});
		myAmapFun.getRegeo({
			success: function(data){
				let city = data[0].regeocodeData.addressComponent.province;
				for(var i=0;i<localData.City.length;i++){
					if(city == localData.City[i]){
						t.setData({
							cityIndex: i
						});
					}
				}
				t.getCityData(city);
			},
			fail: function(){
				t.openToast('定位失败，请手动选择城市！');
			}
		});
	},
	getCityData:function(city,setCityData){
		let t = this;
		for(var i=0;i<localData.localData.length;i++){
			if(city == localData.localData[i].city){
				t.setData({
					localdata : localData.localData[i]
				});
				if(setCityData){
					t.setData({
						insurance : t.getBase(t.data.money,localData.localData[i].ylMin,localData.localData[i].sbMax),
						fund : t.getBase(t.data.money,localData.localData[i].gjjMin,localData.localData[i].gjjMax),
						gjjBl : util.formatMoney(localData.localData[i].gjjBl * 100)
					});
				}
			}
		}
	},
	bindKeyInput: function (e) {
		this.setData({
			money: e.detail.value,
			insurance : this.getBase(e.detail.value,this.data.localdata.ylMin,this.data.localdata.sbMax),
			fund : this.getBase(e.detail.value,this.data.localdata.gjjMin,this.data.localdata.gjjMax)
		});
	},
	count: function () {
		let money = this.data.money,
			yanglao = this.rangeRate(money,this.data.localdata.ylMin,this.data.localdata.sbMax,0.08),
			yiliao = this.rangeRate(money,this.data.localdata.ybMin,this.data.localdata.sbMax,0.02),
			shiye = this.rangeRate(money,this.data.localdata.ylMin,this.data.localdata.sbMax,0.002),
			zhufang = this.rangeRate(money,this.data.localdata.gjjMin,this.data.localdata.gjjMax,this.data.localdata.gjjBl);
		let koushuiqian = util.formatMoney(money - yanglao - yiliao - shiye - zhufang);
		let individualIncomeTax = util.formatMoney(this.taxRate(koushuiqian));
		let postTaxWage = util.formatMoney(koushuiqian - individualIncomeTax);
		if(money == ''){
			this.openToast('请输入月薪');
			this.setData({
				show : 'none',
				insurance : '',
				fund : ''
			});
			return false;
		}else{
			this.setData({
				yanglao: yanglao,
				yiliao: yiliao,
				shiye: shiye,
				zhufang: zhufang,
				postTaxWage: postTaxWage,
				individualIncomeTax : individualIncomeTax,
				gjjBl : util.formatMoney(this.data.localdata.gjjBl * 100),
				show : 'block'
			});
		}
	},
	rangeRate:function(money,min,max,scale){
		if(money < min){
			return util.formatMoney(min * scale);
		}else if(money > max){
			return util.formatMoney(max * scale);
		}else{
			return util.formatMoney(money * scale);
		}
	},
	getBase:function (money,min,max) {
		if(money < min){
			return min;
		}else if(money > max){
			return max;
		}else{
			return money;
		}
	},
	taxRate:function(money){
		var money = money - 3500;
		if(money <= 0){
			return 0;
		}else if(money > 0 && money <= 1500){
			return (util.formatMoney(money*0.03))
		}else if(money > 1500 && money <= 4500){
			return (util.formatMoney(money*0.1))-105
		}else if(money > 4500 && money <= 9000){
			return (util.formatMoney(money*0.2))-555
		}else if(money > 9000 && money <= 35000){
			return (util.formatMoney(money*0.25))-1005
		}else if(money > 35000 && money <= 55000){
			return (util.formatMoney(money*0.3))-2755
		}else if(money > 55000 && money <= 80000){
			return (util.formatMoney(money*0.35))-5505
		}else if(money > 80000){
			return (util.formatMoney(money*0.45))-13505
		}
	},
	bindTypeChange: function (e) {
		this.setData({
			typeIndex: e.detail.value
		})
	},
	changeCity: function (e) {
		this.setData({
			cityIndex: e.detail.value,
			show : 'none'
		});
		this.getCityData(localData.City[e.detail.value],true);
	}
})
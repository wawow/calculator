const formatNum = n => {
    if (n == null) {
        return 0;
    } else {
        n = parseFloat(n);
        if (isNaN(n)) {
            console.log('格式不正确，请重新传值');
            return false;
        }
        return Math.round(n * 100) / 100;
    }
}
const formatNum2 = n => {
    if (n == null) {
        return 0;
    } else {
        n = parseFloat(n);
        if (isNaN(n)) {
            console.log('格式不正确，请重新传值');
            return false;
        }
        return Math.round(n * 1000) / 1000;
    }
}
const getBase = (money,min,max,scale) =>{
	var scale = scale == 0 ? 0 : scale || 1;
	if(money < min){
		return formatNum(min * scale);
	}else if(money > max){
		return formatNum(max * scale);
	}else{
		return formatNum(money * scale);
	}
}
const getTax = money => {
    var money = money - 3500;
    if (money <= 0) {
        return 0;
    } else if (money > 0 && money <= 1500) {
        return (formatNum(money * 0.03))
    } else if (money > 1500 && money <= 4500) {
        return (formatNum(money * 0.1)) - 105
    } else if (money > 4500 && money <= 9000) {
        return (formatNum(money * 0.2)) - 555
    } else if (money > 9000 && money <= 35000) {
        return (formatNum(money * 0.25)) - 1005
    } else if (money > 35000 && money <= 55000) {
        return (formatNum(money * 0.3)) - 2755
    } else if (money > 55000 && money <= 80000) {
        return (formatNum(money * 0.35)) - 5505
    } else if (money > 80000) {
        return (formatNum(money * 0.45)) - 13505
    }
}
const getYearTax = money =>{
	var moneyMonth = money / 12;
	if(moneyMonth <= 0){
		return 0;
	}else if(moneyMonth > 0 && moneyMonth <= 1500){
		return formatNum(money - (money * 0.03))
	}else if(moneyMonth > 1500 && moneyMonth <= 4500){
		return formatNum(money - (money * 0.1 - 105))
	}else if(moneyMonth > 4500 && moneyMonth <= 9000){
		return formatNum(money - (money * 0.2 - 555))
	}else if(moneyMonth > 9000 && moneyMonth <= 35000){
		return formatNum(money - (money * 0.25 - 1005))
	}else if(moneyMonth > 35000 && moneyMonth <= 55000){
		return formatNum(money - (money * 0.3 - 2755))
	}else if(moneyMonth > 55000 && moneyMonth <= 80000){
		return formatNum(money - (money * 0.35 - 5505))
	}else if(moneyMonth > 80000){
		return formatNum(money - (money * 0.45 - 13505))
	}
}
module.exports = {
    formatNum: formatNum,
    formatNum2:formatNum2,
    getTax: getTax,
	getYearTax: getYearTax,
	getBase: getBase
}

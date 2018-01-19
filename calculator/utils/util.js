const formatNum = n => {
	if(n == null){
		return 0;
	}else{
		n = parseFloat(n);
		if(isNaN(n)){
			console.log('格式不正确，请重新传值');
			return false;
		}
		return Math.round(n * 1000) / 1000;
	}
}
module.exports = {
	formatNum: formatNum
}

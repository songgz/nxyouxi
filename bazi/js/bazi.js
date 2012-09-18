var curJD; //现在日期
var curTZ; //当前时区

var bazi = {
	init: function(){
		var arr = [];
		for(var i = 0, l = JWv.length; i < l; i++){
			arr.push('<option value="' + i + '">' + JWv[i][0] + '</option>');
		}
		$('#Sel1').empty().html(arr.join(''));
		
		var self = this;
		$('#Sel1').change(function(){
			Sel2.length = 0;
			var i, ob = JWv[Sel1.options[Sel1.selectedIndex].value - 0];
			for( i = 1; i < ob.length; i++)
				addOp(Sel2, ob[i].substr(0, 4), ob[i].substr(4, ob[i].length - 4));
			$('#Sel2').trigger('change');
		});
		
		$('#Sel2').change(function(){
			var v = new JWdecode(Sel2.options[Sel2.selectedIndex].value);
			Sel2.vJ = v.J;
			Sel2.vW = v.W;
			$('#Cp11_J').val((v.J / Math.PI * 180).toFixed(6));
			Cal_zdzb.innerHTML = '<b>经</b>' + rad2str2(v.J) + '<b>纬</b>' + rad2str2(v.W);
			setCookie('Sel1', Sel1.selectedIndex);
			setCookie('Sel2', Sel2.selectedIndex);
		});
		
		$('#Sel1').trigger('change');

		this.ML_settime();
		
		$('#ML_settime').click(function(){
			self.ML_settime();
		});
		$('#ML_calc').click(function(){
			self.ML_calc();
		});
	},
	ML_calc: function(){
		var ob = new Object();
		var t = timeStr2hour(Cml_his.value);
		var jd = JD.JD(year2Ayear(Cml_y.value), Cml_m.value - 0, Cml_d.value - 0 + t / 24);

		obb.mingLiBaZi(jd + curTZ / 24 - J2000, Cp11_J.value / radd, ob);
		//八字计算
		var arr = [];
		arr.push('<font color=red>  <b>[日标]：</b></font>' + '公历 ' + Cml_y.value + '-' + Cml_m.value + '-' + Cml_d.value + ' 儒略日数 ' + int2(jd + 0.5) + ' 距2000年首' + int2(jd + 0.5 - J2000) + '日');
		arr.push('<font color=red  ><b>[八字]：</b></font>' + ob.bz_jn + '年 ' + ob.bz_jy + '月 ' + ob.bz_jr + '日 ' + ob.bz_js + '时 真太阳 <font color=red>' + ob.bz_zty + '</font>');
		arr.push('<font color=green><b>[纪时]：</b></font><i>' + ob.bz_JS + '</i>');
		arr.push('<font color=green><b>[时标]：</b></font><i>' + '23　 01　 03　 05　 07　 09　 11　 13　 15　 17　 19　 21　 23');
		$('#Cal6').html(arr.join('<br />'));
	},
	
	set_date_screen: function(){
		var now = new Date();
		curTZ = now.getTimezoneOffset() / 60;
		//时区 -8为北京时
		curJD = now / 86400000 - 10957.5 - curTZ / 24;
		//J2000起算的儒略日数(当前本地时间)
		JD.setFromJD(curJD + J2000);

		$('#Cml_y').val(JD.Y);
		$('#Cml_m').val(JD.M);
		$('#Cml_d').val(JD.D);
		$('#Cml_his').val(JD.h + ':' + JD.m + ':' + JD.s.toFixed(0));
		
		curJD = int2(curJD + 0.5);
	},

	ML_settime: function(){
		this.set_date_screen(); 
		this.ML_calc();
	},

	get: function(){
		this.year = parseInt($('#year').val(), 10);
		this.getNianLi();
	},
	getNianLi: function(){ //dy起始年份偏移数
		var y = this.year2Ayear(this.year);
		if( y == -10000 ){
			return;         //检查输入值
		}                     
		$('#re_year').html(this.Ayear2year(y)); //加上偏移年数
		if( y < -10000 ) { 
			alert('到底了'); 
			return; 
		} //检查输入值
		$('#re_con').html(this.nianLiHTML(y));
		// if(Cp2_tg.checked){
			// Cal7.innerHTML = Ayear2year(y)+'年<br>'+;
		// } else {
			// Cal7.innerHTML = Ayear2year(y)+'年<br>'+nianLi2HTML(y);
		// }
	},
	year2Ayear: function(c){ //传入普通纪年或天文纪年，传回天文纪年
		var y = String(c).replace(/[^0-9Bb\*-]/g, '');
		var q = y.substr(0,1);
		if( q == 'B' || q == 'b' || q == '*' ){ //通用纪年法(公元前)
			y = 1 - y.substr(1, y.length);
			if( y > 0 ){
				alert('通用纪法的公元前纪法从B.C.1年开始。并且没有公元0年'); 
				return -10000;
			}
		} else {
			y -= 0;
		}
		if( y < -4712 ){
			alert('超过B.C. 4713不准'); 
		}
		if( y > 9999 ){
			alert('超过9999年的农历计算很不准。');
		}
		return y;
	},
	Ayear2year: function(y){ //传入天文纪年，传回显示用的常规纪年
		y -= 0;
		if( y <= 0 ){
			return 'B' + ( -y + 1 );
		}
		return '' + y;
	},
	nianLiHTML: function(y){ //html年历生成
		var i, j, s = '', s1, s2, v, qi;
		SSQ.calcY( int2((y-2000)*365.2422+180) );
		for( i = 0; i < 14; i ++ ){
			if( SSQ.HS[ i + 1 ] > SSQ.ZQ[24] ){
				break; //已包含下一年的冬至
			}
			if(SSQ.leap && i==SSQ.leap){
				s1 = '闰'; 
			} else {
				s1 = '·';
			}
			s1 += SSQ.ym[i];
			if(s1.length<3){
				s1 += '月';
			}
			s1 += SSQ.dx[i] > 29 ? '大' : '小';
			s1 += ' ' + JD.JD2str(SSQ.HS[i] + J2000).substr(6, 5);
			
			v = obb.so_accurate2(SSQ.HS[i]);
			s2 = '(' + JD.JD2str( v + J2000 ).substr(9, 11) + ')';
			if(int2(v + 0.5) != SSQ.HS[i]){
				s2 = '<font color=red>' + s2 + '</font>';
			}
			//v=(v+0.5+J2000)%1; if(v>0.5) v=1-v; if(v<8/1440) s2 = '<u>'+s2+'</u>'; //对靠近0点的加注
			s1 += s2;
			
			for(j=-2;j<24;j++){
				if(j>=0)  qi=SSQ.ZQ[j];
				if(j==-1) qi=SSQ.ZQ.pe1;
				if(j==-2) qi=SSQ.ZQ.pe2;
				
				if(qi<SSQ.HS[i] || qi>=SSQ.HS[i+1]) continue;
				s1 += ' ' + obb.jqmc[(j + 24) % 24] + JD.JD2str(qi + J2000).substr(6, 5);
				
				v = obb.qi_accurate2(qi);
				s2 = '(' + JD.JD2str( v + J2000 ).substr(9, 11) + ')';
				if(int2(v+0.5)!=qi) s2 = '<font color=red>' + s2 + '</font>';
				//v=(v+0.5+J2000)%1; if(v>0.5) v=1-v; if(v<8/1440) s2 = '<u>'+s2+'</u>'; //对靠近0点的加注
				s1 += s2;
			}
			s += s1 + '<br>';
		}
		return s;
	}
};

$(document).ready(function(){
	bazi.init();
});

// JavaScript Document

var llk = {
	mapX: 14, 
	mapY: 10,
	mapLength: 20,
	remain: 0,
	node_width: 46,
	node_height: 41,
	level: 0,
	score: 0,
	cx: 0,
	cy: 0
}
document.onkeydown = function(event){
	if (event.keyCode==49) llk.start();
}

llk.start = function(){	
	llk.level = 1;
	llk.score = 0;
	
	llk.game();
	
	document.onkeydown = function(event){
		if (event.keyCode==49) llk.resetMap();
		if (event.keyCode==50) llk.note();
		if (event.keyCode==81) llk.pause();
	}
}

llk.next_level = function(){
	llk.game();
}

llk.note = function(){
	var arrT;
	var next_double = llk.next_double();
	if(next_double){
		arrT = next_double.split("_");
		llk.choose(arrT[0], arrT[1]);
		llk.choose(arrT[2], arrT[3]);
		llk.clickNode(parseInt(arrT[0]), parseInt(arrT[1]));
		llk.clickNode(parseInt(arrT[2]), parseInt(arrT[3]));
	}
	return false;
}

llk.resetMap = function(){
	llk.setImages();
}

llk.over = function(){
	clearInterval(llk.timeid);
	llk.setLayShow("llk_timeout");
	document.getElementById("timeout_score").innerHTML = llk.score;
	llk.post_back();
}

llk.success = function(){
	clearInterval(llk.timeid);
	llk.setLayShow("llk_success");
	llk.score += document.getElementById("time_count").width;
	document.getElementById("success_score").innerHTML = llk.score;	
	if(llk.level>=8){
		document.getElementById("btnNextLevel").style.display = "none";
		llk.post_back();
	}else{
		llk.level += 1;
		document.getElementById("btnNextLevel").value = "第 " + llk.level + " 关";		
	}
}

llk.post_back = function(){
	document.getElementById("end_level").value = llk.level;
	document.getElementById("end_score").value = llk.score;
	document.getElementById("postback_form").submit();
}

llk.pause = function(){
	if(!llk.remain){
		return;
	}
	if(!llk.paused){
		llk.paused = true;
		clearInterval(llk.timeid);
		llk.setLayShow("llk_pause");
	}else{
		llk.paused = false;
		llk.count();
		llk.setLayShow("llk_main");
	}
}

llk.game = function(){
	llk.sound(1);
	
	llk.update_level();
	llk.update_score();
	
	llk.loadSharps();
	
	var time_count = document.getElementById("time_count");
	time_count.src = "images/llk/count1.gif";
	time_count.width = 450;
	time_count.height = 13;
	llk.count();
	
	llk.setLayShow("llk_main");
}

llk.loadSharps = function(){
	llk.arrSharps = [];
	llk.blocks = {};
	var arrT = llk.randomArr([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]);
	
	switch(llk.level){
		case 1:
			for(var t=0;t<15;t++){
				for(var m=0;m<8;m++){
					llk.arrSharps.push(arrT[t]);
				}
			}
			for(var t=15;t<20;t++){
				for(var m=0;m<4;m++){
					llk.arrSharps.push(arrT[t]);
				}
			}
			break;
		case 2:
			for(var t=0;t<20;t++){
				for(var m=0;m<6;m++){
					llk.arrSharps.push(arrT[t]);
				}
			}
			for(var t=20;t<25;t++){
				for(var m=0;m<4;m++){
					llk.arrSharps.push(arrT[t]);
				}
			}
			break;
		case 3:
		default:
			for(var t=0;t<35;t++){
				for(var m=0;m<4;m++){
					llk.arrSharps.push(arrT[t]);
				}
			}
	}
	
	llk.remain = llk.arrSharps.length;
	for(var i=1;i<=llk.mapY;i++){
		for(var j=1;j<=llk.mapX;j++){
			tid = j + "," + i;
			llk.blocks[tid] = 1;
		}
	}	
	llk.setImages();
	for(var i=0;i<=llk.mapY+1;i++){
		llk.blocks[0 + "," + i] = 0;
		llk.blocks[15 + "," + i] = 0;
	}
	for(var i=0;i<=llk.mapX+1;i++){
		llk.blocks[i + "," + 0] = 0;
		llk.blocks[i + "," + 11] = 0;
	}
}

llk.setImages = function(){
	var c = 0;
	var tid;
	var tArr = llk.arrSharps;
	llk.arrSharps = llk.randomArr(tArr);
	for(var i=1;i<=llk.mapY;i++){
		for(var j=1;j<=llk.mapX;j++){
			tid = j + "," + i;
			if(llk.blocks[tid]!=0){
				llk.blocks[tid] = llk.arrSharps[c];
				v = "item_" + i + "_" + j;
				document.getElementById(v).innerHTML = "<img alt='img_" + j + "_" + i + "' id='img_" + j + "_" + i + "' src='images/llk/" + llk.arrSharps[c] + ".gif' style='width:43px;height:38px;' onclick='javascript:llk.clickNode(" + j + "," + i + ")'>";
				c++;
			}
		}
	}
}

llk.clickNode = function(i, j){
	if (llk.blocks[i+","+j]==0) return
	
	cx = llk.cx;
	cy = llk.cy;
	px = i;
	py = j;
	
	if(cx!=0 && cy!=0){
		var t = "img_" + cx + "_" + cy;
		document.getElementById(t).style.border = "0px";
	}
	
	if(px==cx && py==cy){
		llk.cx = 0;
		llk.cy = 0;
		llk.sound(2);
		return
	}
	if(llk.blocks[px+","+py]==llk.blocks[cx+","+cy]){	
		path = llk.path = llk.find_path(cx,cy,px,py);
		if(path){
			llk.cx = 0;
			llk.cy = 0;
			llk.del(cx, cy, px, py);
			return
		}
	}
	
	llk.sound(2);
	llk.cx = px;
	llk.cy = py;
	llk.choose(px, py);
}

llk.choose = function(x, y){	
	var v = "img_" + x + "_" + y;
	if(!document.getElementById(v)){
		alert(v);
	}
	document.getElementById(v).style.height = "38px";
	document.getElementById(v).style.width = "43px";
	document.getElementById(v).style.border = "1px solid #00FFFF";
}

llk.cross = function(x, y){
	for(var x1=x-1;x1>-1;x1--)
		if(llk.blocks[x1+","+y]!=0) break;
	
	for(var x2=x+1;x2<llk.mapX+2;x2++)
		if(llk.blocks[x2+","+y]!=0) break;
	
	for(var y1=y-1;y1>-1;y1--)
		if(llk.blocks[x+","+y1]!=0) break;
	
	for(var y2=y+1;y2<=llk.mapY+2;y2++)
		if(llk.blocks[x+","+y2]!=0) break;
		
	console.log({x1:x1, x2:x2, y1:y1, y2:y2});
	return {x1:x1, x2:x2, y1:y1, y2:y2}
}

llk.passx = function(x1,x2,y){
	if(x1 < x2){
		while (++x1 < x2)
			if (llk.blocks[x1+ "," +y]) return false
	} else {
		while (++x2 < x1)
			if (llk.blocks[x2+ "," +y]) return false
	}
	return true
}
llk.passy = function(y1,y2,x){
	if (y1 < y2) {
		while (++y1 < y2)
			if (llk.blocks[x+ "," +y1]) return false
	} else {
		while (++y2 < y1)
			if (llk.blocks[x+ "," +y2]) return false
	}
	return true
}

llk.linex = function(x1, x2, y){
	var path = []
	if(x1 < x2){
		while (x1++ < x2)
			path.push('<img src="images/llk/linex.gif" style="position:absolute;left:'+(x1*llk.node_width-20)+'px;top:'+y*llk.node_height+'px;width:46px;height:41px;">');
	} else {
		while (x2++ < x1)
			path.push('<img src="images/llk/linex.gif" style="position:absolute;left:'+(x2*llk.node_width-20)+'px;top:'+y*llk.node_height+'px;width:46px;height:41px;">');
	}
	return path
}
llk.liney = function(y1, y2, x){
	var path = []
	if(y1 < y2){
		while (y1++ < y2)
			path.push('<img src="images/llk/liney.gif" style="position:absolute;left:'+x*llk.node_width+'px;top:'+(y1*llk.node_height-20)+'px;width:46px;height:41px;">');
	} else {
		while (y2++ < y1)
			path.push('<img src="images/llk/liney.gif" style="position:absolute;left:'+x*llk.node_width+'px;top:'+(y2*llk.node_height-20)+'px;width:46px;height:41px;">');
	}
	return path
}
llk.find_path = function(sx,sy,ex,ey){
	var s = llk.cross(sx, sy);
	if(sy==ey && s.x1<=ex && ex<=s.x2){
		return llk.linex(sx, ex, sy)
	}
	if(sx==ex && s.y1<=ey && ey<=s.y2){
		return llk.liney(sy, ey, sx)
	}
	var e = llk.cross(ex, ey)

	var x1 = s.x1 < e.x1 ? e.x1 : s.x1
	var x2 = s.x2 > e.x2 ? e.x2 : s.x2
	var y1 = s.y1 < e.y1 ? e.y1 : s.y1
	var y2 = s.y2 > e.y2 ? e.y2 : s.y2
	
	if (x1<sx && sx<x2 && y1<ey && ey<y2){
		return llk.liney(sy, ey, sx).concat(llk.linex(sx, ex, ey))
	}
	if (x1<ex && ex<x2 && y1<sy && sy<y2){
		return llk.liney(sy, ey, ex).concat(llk.linex(sx, ex, sy))
	}
	if (sx < ex){
		var x3 = sx
		var x4 = ex
		var s1 = sy
		var e1 = ey
	} else {
		var x3 = ex
		var x4 = sx
		var s1 = ey
		var e1 = sy
	}
	for(var x=x3+1;x<x4;x++){
		if(x1<x && x<x2 && llk.passy(s1, e1, x)){
			return llk.liney(s1, e1, x).concat(llk.linex(x3, x, s1), llk.linex(x, x4, e1))
		}
	}
	if(sy < ey){
		var y3 = sy
		var y4 = ey
		var s2 = sx
		var e2 = ex
	} else {
		var y3 = ey
		var y4 = sy
		var s2 = ex
		var e2 = sx
	}
	for (var y=y3+1; y<y4; y++){
		if (y1<y && y<y2 && llk.passx(s2, e2, y)){
			return llk.linex(s2, e2, y).concat(llk.liney(y3, y, s2), llk.liney(y, y4, e2))
		}
	}
	s1 = true
	e1 = true
	s2 = true
	e2 = true
	while (s1 || e1 || s2 || e2){
		if(s1){
			if(x1 < --x3 && x3 < x2){
				if (llk.passy(sy, ey, x3)){
					return llk.liney(sy, ey, x3).concat(llk.linex(x3, sx, sy), llk.linex(x3, ex, ey))
				}
			} else {
				s1 = false
			}
		}
		if (e1){
			if (x1 < ++x4 && x4 < x2){
				if (llk.passy(sy, ey, x4)){
					return llk.liney(sy, ey, x4).concat(llk.linex(x4, sx, sy), llk.linex(x4, ex, ey))
				}
			} else {
				e1 = false
			}
		}
		if (s2){
			if (y1 < --y3 && y3 < y2){
				if (llk.passx(sx, ex, y3)){
					return llk.linex(sx, ex, y3).concat(llk.liney(y3, sy, sx), llk.liney(y3, ey, ex))
				}
			} else {
				s2 = false
			}
		}
		if (e2){
			if (y1 < ++y4 && y4 < y2){
				if (llk.passx(sx, ex, y4)){
					return llk.linex(sx, ex, y4).concat(llk.liney(y4, sy, sx), llk.liney(y4, ey, ex))
				}
			} else {
				e2 = false
			}
		}
	}
	return false
}

llk.del = function(cx, cy, px, py){
	llk.remain -= 2;
	llk.addTime();
	
	llk.score += 10;
	llk.update_score();
	
	var fnode = cx + "," + cy;
	var snode = px + "," + py;
	var v = llk.blocks[fnode];
	for(var j=0;j<llk.arrSharps.length;j++){
		if(llk.arrSharps[j]==v){
			llk.arrSharps.splice(j,1);
			break;
		}
	}
	for(var j=0;j<llk.arrSharps.length;j++){
		if(llk.arrSharps[j]==v){
			llk.arrSharps.splice(j,1);
			break;
		}
	}
	llk.blocks[fnode] = 0;
	llk.blocks[snode] = 0;
		
	llk.sound(3);
	
	var objPath = document.getElementById("find_path");	
	objPath.style.display = "";
	llk.path.push('<img src="images/llk/del.gif" style="position:absolute;left:'+cx*llk.node_width+'px;top:'+(cy*llk.node_height)+'px;width:43px;height:38px;z-index:1;">');
	llk.path.push('<img src="images/llk/del.gif" style="position:absolute;left:'+px*llk.node_width+'px;top:'+(py*llk.node_height)+'px;width:43px;height:38px;z-index:1;">');
	objPath.innerHTML = llk.path.join("");
	llk.path = "";
	
	setTimeout('document.getElementById("find_path").style.display="none"',300);
	
	var ftd_id = "item_" + cy + "_" + cx;
	var std_id = "item_" + py + "_" + px;	
	document.getElementById(ftd_id).innerHTML = "";
	document.getElementById(std_id).innerHTML = "";
	
	llk.move_as_level(cx, cy, px, py);
	
	if(llk.remain){
		while(!llk.next_double()){
			llk.resetMap();
		}
	}else{
		setTimeout("llk.success()",600);
	}
}

llk.next_double = function(){
	var tid;
	for(var i=1;i<=llk.mapY;i++){
		for(var j=1;j<=llk.mapX;j++){
			tid = j + "," + i;
			if(llk.blocks[tid]!=0){
				var next_node = llk.find_next(j, i);
				if(next_node){
					return (j + "_" + i + "_" + next_node);
				}
			}
		}
	}
	return false;
}

llk.find_next = function(x, y){
	var v = llk.blocks[x + "," + y];
	
	var arrSame = [];
	for(var i=1;i<=llk.mapY;i++){
		for(var j=1;j<=llk.mapX;j++){
			tid = j + "," + i;
			if(llk.blocks[tid]==v){
				arrSame.push(tid);
			}
		}
	}
	
	var i = 0;
	var j = 0;
	var arrT;
	for(var t=0;t<arrSame.length;t++){
		arrT = arrSame[t].split(',');
		i = parseInt(arrT[0]);
		j = parseInt(arrT[1]);
		if(x==i && y==j){
		}else{
			path = llk.find_path(x,y,i,j);
			if(path){
				return i+"_"+j;
			}
		}
	}
	return false;
}

llk.move_to_left = function(y, from){
	var arrTemp = [];
	var t = (from=="center")? 8 : 15;
	for(var j=1;j<t;j++){
		if(llk.blocks[j + "," + y]!=0){
			arrTemp.push(llk.blocks[j + "," + y]);
		}
		llk.blocks[j + "," + y] = 0;
		sid = "item_" + y + "_" + j;
		document.getElementById(sid).innerHTML = "";
	}
	for(var j=1;j<=arrTemp.length;j++){
		llk.blocks[j + "," + y] = arrTemp[j-1];
		fid = "item_" + y + "_" + j;
		document.getElementById(fid).innerHTML = "<img alt='img_" + j + "_" + y + "' id='img_" + j + "_" + y + "' src='images/llk/" + llk.blocks[j + "," + y] + ".gif' style='width:43px;height:38px;' onclick='javascript:llk.clickNode(" + j + "," + y + ")'>";
	}
}

llk.move_to_right = function(y, from){
	var arrTemp = [];
	var t = (from=="center")? 7 : 0;
	for(var j=14;j>t;j--){
		if(llk.blocks[j + "," + y]!=0){
			arrTemp.push(llk.blocks[j + "," + y]);
		}
		llk.blocks[j + "," + y] = 0;
		sid = "item_" + y + "_" + j;
		document.getElementById(sid).innerHTML = "";
	}
	for(var j=14;j>14-arrTemp.length;j--){
		llk.blocks[j + "," + y] = arrTemp[14-j];
		fid = "item_" + y + "_" + j;
		document.getElementById(fid).innerHTML = "<img alt='img_" + j + "_" + y + "' id='img_" + j + "_" + y + "' src='images/llk/" + llk.blocks[j + "," + y] + ".gif' style='width:43px;height:38px;' onclick='javascript:llk.clickNode(" + j + "," + y + ")'>";
	}
}

llk.move_to_top = function(x, from){
	var arrTemp = [];
	var t = (from=="center")? 6 : 11;
	for(var i=1;i<t;i++){
		if(llk.blocks[x + "," + i]!=0){
			arrTemp.push(llk.blocks[x + "," + i]);
		}
		llk.blocks[x + "," + i] = 0;
		sid = "item_" + i + "_" + x;
		document.getElementById(sid).innerHTML = "";
	}
	for(var i=1;i<=arrTemp.length;i++){
		llk.blocks[x + "," + i] = arrTemp[i-1];
		fid = "item_" + i + "_" + x;
		document.getElementById(fid).innerHTML = "<img alt='img_" + x + "_" + i + "' id='img_" + x + "_" + i + "' src='images/llk/" + llk.blocks[x + "," + i] + ".gif' style='width:43px;height:38px;' onclick='javascript:llk.clickNode(" + x + "," + i + ")'>";
	}
}

llk.move_to_bottom = function(x, from){
	var arrTemp = [];
	var t = (from=="center")? 5 : 0;
	for(var i=10;i>t;i--){					
		if(llk.blocks[x + "," + i]!=0){
			arrTemp.push(llk.blocks[x + "," + i]);
		}
		llk.blocks[x + "," + i] = 0;
		sid = "item_" + i + "_" + x;
		document.getElementById(sid).innerHTML = "";
	}
	for(var i=10;i>10-arrTemp.length;i--){
		llk.blocks[x + "," + i] = arrTemp[10-i];
		fid = "item_" + i + "_" + x;
		document.getElementById(fid).innerHTML = "<img alt='img_" + x + "_" + i + "' id='img_" + x + "_" + i + "' src='images/llk/" + llk.blocks[x + "," + i] + ".gif' style='width:43px;height:38px;' onclick='javascript:llk.clickNode(" + x + "," + i + ")'>";
	}
}

llk.move_as_level = function(cx, cy, px, py){
	var arrTemp;
	switch(llk.level){
		case 1:
			break;
		case 2:
			break;
		case 3:
			llk.move_to_top(cx, "center");
			llk.move_to_top(px, "center");
			llk.move_to_bottom(cx, "center");
			llk.move_to_bottom(px, "center");
			break;
		case 4:
			llk.move_to_left(cy, "center");
			llk.move_to_left(py, "center");
			llk.move_to_right(cy, "center");
			llk.move_to_right(py, "center");
			break;
		case 5:
			llk.move_to_left(cy, "right");
			llk.move_to_left(py, "right");
			break;
		case 6:
			llk.move_to_right(cy, "left");
			llk.move_to_right(py, "left");
			break;
		default:
	}
}

llk.update_level = function(){
	document.getElementById("level").innerHTML = llk.level;
}

llk.update_score = function(){
	document.getElementById("score").innerHTML = llk.score;
}

llk.randomArr = function(arr){
	var rnd = []
	while (arr.length){
		rnd=rnd.splice(0,Math.floor(Math.random()*(rnd.length+1))).concat(arr.splice(Math.floor(Math.random()*arr.length),1),rnd)
	}
	return rnd
}

llk.setLayShow = function(layName){
	document.getElementById("llk_start").style.display = "none";
	document.getElementById("llk_main").style.display = "none";
	document.getElementById("llk_pause").style.display = "none";
	document.getElementById("llk_timeout").style.display = "none";
	document.getElementById("llk_success").style.display = "none";
	document.getElementById(layName).style.display = "";
}
llk.addTime = function(){	
	var time_count = document.getElementById("time_count");
	var counts = time_count.width;
	if(time_count.width<447){
		time_count.width += 3;
	}
	if(counts>350)
	{
		time_count.src = "images/llk/count1.gif";
	}else if(counts>220 && counts<=350)
	{
		time_count.src = "images/llk/count2.gif";
	}else if(counts>120 && counts<=220)
	{
		time_count.src = "images/llk/count3.gif";
	}else if(counts>35 && counts<=120)
	{
		time_count.src = "images/llk/count4.gif";	
	}else if(counts>20 && counts<=35)
	{
		time_count.src = "images/llk/count5.gif";	
	}else if(counts<20)
	{
		time_count.src = "images/llk/count6.gif";
	}
}

llk.count = function(){
	clearInterval(llk.timeid)
	var time_count = document.getElementById("time_count");
	llk.timeid = setInterval(function(){
		var counts = time_count.width;
		time_count.width = counts-1;
		switch (counts){
			case 350:
				time_count.src = "images/llk/count2.gif";
				break;
			case 220: 
				time_count.src = "images/llk/count3.gif";
				break;
			case 120: 
				time_count.src = "images/llk/count4.gif";
				break;
			case  35:
				time_count.src = "images/llk/count5.gif";
				break;
			case  20:
				time_count.src = "images/llk/count6.gif";
		}
		if (counts < 2){
			llk.over();
		}
	}
	, 500)
}

llk.sound = function(id)
{
	try{
		au_sound.GotoFrame(0)
		au_sound.GotoFrame(id)
		au_sound.Play()
	}
	catch(err){}
}

window.onload = function(){
	llk.setLayShow("llk_start");
}
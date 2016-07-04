var SizeBoardX = 25;
var SizeBoardY =15;
var NumBomb = 70;
var GameArray= [,];
var PrintSpring;
var SizeSmallSquare = 30;
var MyAudio;
var ModeGame = 2;
var Player = 1;
var Sound = 1;


$(document).ready(function(){
	
	$("#myBoard").hide();
	document.getElementById("play").addEventListener("click",createGame);
	MyAudio = document.getElementById("soundResource");
	
})

function createGame(){
	
	$("#controlPanel").hide("slow");
	$("h1").hide("slow");
	configConditions();
	
	PrintSpring = createBoard(SizeBoardX,SizeBoardY,NumBomb);
	document.getElementById("myBoard").innerHTML = PrintSpring;
	
	$("#winScreen").css("width", (SizeBoardX * SizeSmallSquare) + "px");
	$("#winScreen").css("height", (SizeBoardY * SizeSmallSquare) + "px");
	
	$(".smallBox").click(eventChoose);
	$("#newGame").click(eventNewGame);
	$("#soundButton").click(soundControl);
	
	$("#myBoard").show();
	
	configScoresZone();
}

function createBoard(SizeX,SizeY,NumBom){
	
	GameArray = createArray(SizeX,SizeY,NumBom);
	
	var txtReturn = createCounterBox();
	txtReturn += "<div id='scoreBox1'>";
	txtReturn += createScorePlayerZone(1);
	if(ModeGame==3 || ModeGame==4){
		txtReturn += createScorePlayerZone(3);
	}
	txtReturn += "</div>";
	
	txtReturn += "<div id='bigBox' style='width:" + (SizeSmallSquare*SizeX) + "px'><div id='winScreen'></div>"
	for(var j=0;j<SizeY;j++){
		for(var i=0;i<SizeX;i++){
			if(GameArray[i][j]==-1){
				txtReturn += createSmallSquare(-1,i+"_"+j);
			}else{
				txtReturn += createSmallSquare(GameArray[i][j],i+"_"+j);
			}
		}
	}
	txtReturn += "</div><div id='scoreBox2'>";
	if(ModeGame!=1){
		txtReturn += createScorePlayerZone(2);
	}
	if(ModeGame==4){
		txtReturn += createScorePlayerZone(4);
	}
	txtReturn += "</div>"
	
	return txtReturn;
}

function createArray(SizeX,SizeY,NumBom){
	var MySize = SizeX * SizeY;
	var MyArray = new Array(SizeX);
	for(var i=0;i<SizeX;i++){
		MyArray[i] = new Array(SizeY)
	}
	//Inicializo todo el array a 0
	for(var i=0;i<SizeX;i++){
		for(var j=0;j<SizeY;j++){
			MyArray[i][j]=0;
		}
	}
	
	//Situo las bombas aleatoriamente representandolas con el valor -1
	// var valorGeneradoX;
	// var valorGeneradoY;
	for(var i=0;i<NumBom;i++){
		valorGeneradoX = Math.round(Math.random()* SizeX);
		valorGeneradoY = Math.round(Math.random()* SizeY);
		if(valorGeneradoX==SizeX || valorGeneradoY==SizeY || MyArray[valorGeneradoX][valorGeneradoY] ==-1){
			i--;	
		}else{
			//Coloco una bomba con el valor -1
			MyArray[valorGeneradoX][valorGeneradoY] = -1
			
			//Sumo +1 a todas las casillas de su alrededor
			//excepto otras bombas
			if(valorGeneradoX!=0){
				if(MyArray[valorGeneradoX-1][valorGeneradoY]!=-1){
					MyArray[valorGeneradoX-1][valorGeneradoY] += 1;
				}
				if(valorGeneradoY!=0 && MyArray[valorGeneradoX-1][valorGeneradoY-1]!=-1){
					MyArray[valorGeneradoX-1][valorGeneradoY-1]+= 1;
				}
				if(valorGeneradoY!=SizeY-1 && MyArray[valorGeneradoX-1][valorGeneradoY+1]!=-1){
					MyArray[valorGeneradoX-1][valorGeneradoY+1]+= 1;
				}
			}
			if(valorGeneradoX!=SizeX-1){
				if(MyArray[valorGeneradoX+1][valorGeneradoY]!=-1){
					MyArray[valorGeneradoX+1][valorGeneradoY] += 1;
				}
				if(valorGeneradoY!=0 && MyArray[valorGeneradoX+1][valorGeneradoY-1]!=-1){
					MyArray[valorGeneradoX+1][valorGeneradoY-1]+= 1;
				}
				if(valorGeneradoY!=SizeY-1 && MyArray[valorGeneradoX+1][valorGeneradoY+1]!=-1){
					MyArray[valorGeneradoX+1][valorGeneradoY+1]+= 1;
				}
			}
			if(valorGeneradoY!=0 && MyArray[valorGeneradoX][valorGeneradoY-1]!=-1){
				MyArray[valorGeneradoX][valorGeneradoY-1] += 1;
			}
			if(valorGeneradoY!=SizeY && MyArray[valorGeneradoX][valorGeneradoY+1]!=-1){
				MyArray[valorGeneradoX][valorGeneradoY+1] += 1;
			}
		}
	}

	return MyArray;
}

function createCounterBox(){
	
	var txtReturn = "<div id='counterBox'><div id='counterBoxA'><p>Number of bomb</p><p id='scoreBomb'>";
	
	txtReturn += NumBomb;
	
	txtReturn += "</p></div><div id='counterBoxB'><button type='submit' id='newGame'>New game</button><p>Sound <button type='submit' id='soundButton' value='" + Sound + "'>";
	if(Sound==1){
		txtReturn += "ON</button></p></div></div>";
	}else{
		txtReturn += "OFF</button></p></div></div>";
	}
	
	
	return txtReturn;
}

function createScorePlayerZone(player){
	var txtReturn = "<div class='scorePlayer' id='scorePlayer"+player+"'><p class='namePlayer'>Player "+player+"</p><p class='screenPlayer' id='screenPlayer"+player+"'>0</p></div>";
	
	return txtReturn;
}

function createSmallSquare(type,position){
	
	var txtReturn = "<div class='smallBox' value=" + type + " id='" + position + "'></div>";
	
	return txtReturn;
}

function eventChoose(){
	var position = $(this).attr('id').split('_');
	var type = $(this).attr('value');
	
	//Change the class
	$(this).attr('class','sqr_off');
	
	//Change the background
	if(type==-1){
		MyAudio.src = "sound/bomb.mp3";
		if (Player == 1){
			$(this).css('background-Image','url(ima/bomb1.png)');
			document.getElementById("screenPlayer1").innerHTML = parseInt(document.getElementById("screenPlayer1").innerHTML) + 1;
		}else if(Player == 2){
			$(this).css('background-Image','url(ima/bomb2.png)');
			document.getElementById("screenPlayer2").innerHTML = parseInt(document.getElementById("screenPlayer2").innerHTML) + 1;
		}else if(Player == 3){
			$(this).css('background-Image','url(ima/bomb3.png)');
			document.getElementById("screenPlayer3").innerHTML = parseInt(document.getElementById("screenPlayer3").innerHTML) + 1;
		}else if(Player == 4){
			$(this).css('background-Image','url(ima/bomb4.png)');
			document.getElementById("screenPlayer4").innerHTML = parseInt(document.getElementById("screenPlayer4").innerHTML) + 1;
		}
		
		document.getElementById("scoreBomb").innerHTML = parseInt(document.getElementById("scoreBomb").innerHTML) - 1;
		
	}else{
		if(ModeGame != 1){
			changePlayer();
		}
		MyAudio.src = "sound/normal.mp3";
		$(this).css('background-Image','url(ima/' + type + '.png)');
	}
	
	//Calculate in the case of white squares
	if(type==0){
		MyAudio.src = "sound/open.mp3";
		whiteSquaresCase(parseInt(position[0]),parseInt(position[1]));
	}
	
	if (Sound==1){
		MyAudio.play();
	}
	
	if(type==-1 && parseInt(document.getElementById("scoreBomb").innerHTML)<NumBomb/2){
		checkWinner(0);
	}
	
	$(this).unbind("click",eventChoose);
}

function eventNewGame(){
	
	$("#myBoard").hide();
	$("h1").show("slow");
	$("#controlPanel").show("slow");
	
}

function whiteSquaresCase(x,y){

	var searchIdString = "";
	var numSustitute = 0;
	
	//alert("X="+x+"Y="+y);
	if(x!=0){
		numSustitute= x - 1;
		searchIdString = "#" + numSustitute + "_" + y;
		if (GameArray[numSustitute][y]!=-1 && $(searchIdString).attr("class")=="smallBox"){
			$(searchIdString).css('background-Image','url(ima/' + GameArray[numSustitute][y] + '.png)').unbind("click");
			$(searchIdString).attr('class','sqr_off');
			if(GameArray[numSustitute][y]==0){
				whiteSquaresCase(numSustitute,y);
			}
		}
	}
	if(x!=SizeBoardX-1){
		numSustitute= x + 1;
		searchIdString = "#" + numSustitute + "_" + y;
		if (GameArray[numSustitute][y]!=-1 && $(searchIdString).attr("class")=="smallBox"){
			$(searchIdString).css('background-Image','url(ima/' + GameArray[numSustitute][y] + '.png)').unbind("click");
			$(searchIdString).attr('class','sqr_off');
			if(GameArray[numSustitute][y]==0){
				whiteSquaresCase(numSustitute,y);
			}
		}
	}
	if(y!=0){
		numSustitute= y - 1;
		searchIdString = "#" + x + "_" + numSustitute;
		if (GameArray[x][numSustitute]!=-1 && $(searchIdString).attr("class")=="smallBox"){
			$(searchIdString).css('background-Image','url(ima/' + GameArray[x][numSustitute] + '.png)').unbind("click");
			$(searchIdString).attr('class','sqr_off');
			if(GameArray[x][numSustitute]==0){
				whiteSquaresCase(x,numSustitute);
			}
		}
	}
	if(y!=SizeBoardY-1){
		numSustitute= y + 1;
		searchIdString = "#" + x + "_" + numSustitute;
		if (GameArray[x][numSustitute]!=-1 && $(searchIdString).attr("class")=="smallBox"){
			$(searchIdString).css('background-Image','url(ima/' + GameArray[x][numSustitute] + '.png)').unbind("click");
			$(searchIdString).attr('class','sqr_off');
			if(GameArray[x][numSustitute]==0){
				whiteSquaresCase(x,numSustitute);
			}
		}
	}
	
	var numSustitute2 = 0;
	
	if(x!=0 && y!=0){
		numSustitute= x - 1;
		numSustitute2= y - 1;
		searchIdString = "#" + numSustitute + "_" + numSustitute2;
		if (GameArray[numSustitute][numSustitute2]!=-1 && $(searchIdString).attr("class")=="smallBox"){
			$(searchIdString).css('background-Image','url(ima/' + GameArray[numSustitute][numSustitute2] + '.png)').unbind("click");
			$(searchIdString).attr('class','sqr_off');
			if(GameArray[numSustitute][numSustitute2]==0){
				whiteSquaresCase(numSustitute,numSustitute2);
			}
		}
	}
	if(x!=0 && y!=SizeBoardY-1){
		numSustitute= x - 1;
		numSustitute2= y + 1;
		searchIdString = "#" + numSustitute + "_" + numSustitute2;
		if (GameArray[numSustitute][numSustitute2]!=-1 && $(searchIdString).attr("class")=="smallBox"){
			$(searchIdString).css('background-Image','url(ima/' + GameArray[numSustitute][numSustitute2] + '.png)').unbind("click");
			$(searchIdString).attr('class','sqr_off');
			if(GameArray[numSustitute][numSustitute2]==0){
				whiteSquaresCase(numSustitute,numSustitute2);
			}
		}
	}
	if(x!=SizeBoardX-1 && y!=0){
		numSustitute= x + 1;
		numSustitute2= y - 1;
		searchIdString = "#" + numSustitute + "_" + numSustitute2;
		if (GameArray[numSustitute][numSustitute2]!=-1 && $(searchIdString).attr("class")=="smallBox"){
			$(searchIdString).css('background-Image','url(ima/' + GameArray[numSustitute][numSustitute2] + '.png)').unbind("click");
			$(searchIdString).attr('class','sqr_off');
			if(GameArray[numSustitute][numSustitute2]==0){
				whiteSquaresCase(numSustitute,numSustitute2);
			}
		}
	}
	if(x!=SizeBoardX-1 && y!=SizeBoardY-1){
		numSustitute= x + 1;
		numSustitute2= y + 1;
		searchIdString = "#" + numSustitute + "_" + numSustitute2;
		if (GameArray[numSustitute][numSustitute2]!=-1 && $(searchIdString).attr("class")=="smallBox"){
			$(searchIdString).css('background-Image','url(ima/' + GameArray[numSustitute][numSustitute2] + '.png)').unbind("click");
			$(searchIdString).attr('class','sqr_off');
			if(GameArray[numSustitute][numSustitute2]==0){
				whiteSquaresCase(numSustitute,numSustitute2);
			}
		}
	}
}

function changePlayer(){
	if(Player==1){
		Player = 2;
	}else if(Player==2){
		if(ModeGame==2){
			Player = 1;
		}else{
			Player = 3;
		}
	}else if(Player==3){
		if(ModeGame==3){
			Player = 1;
		}else{
			Player = 4;
		}
	}else if(Player==4){
		Player = 1;
	}
	
	colorPlayer();
	
}

function configConditions(){
	ModeGame = $('input[name=numberPlayersOption]:checked', '').val();
	
	Player = 1;
	
	switch ($('input[name=sizeOption]:checked').val()){
		case "1":
			SizeBoardX = 15;
			SizeBoardY = 11;
			NumBomb = 41;
			break;
		case "2":
			SizeBoardX = 25;
			SizeBoardY = 15;
			NumBomb = 81;
			break;
		case "3":
			SizeBoardX = 32;
			SizeBoardY = 18;
			NumBomb = 111;
			break;
		default:
	}
	
	var TemSizeBoard = 200 + (SizeBoardX * SizeSmallSquare);
	$("section").css("width", TemSizeBoard + "px");
	
}

function configScoresZone(){
	var x = SizeSmallSquare * SizeBoardY;
	x=x+"px";
	$("#scoreBox1").css("height",x);
	$("#scoreBox2").css("height",x);
	
	var y=(SizeSmallSquare * SizeBoardY) - 303;
	y =y+"px";
	if(ModeGame==3 || ModeGame==4){
		$("#scorePlayer3").css("margin-top",y);
	}
	if(ModeGame==4){
		$("#scorePlayer4").css("margin-top",y);
	}
}

function checkWinner(empate){
	
	var p1 = parseInt(document.getElementById("screenPlayer1").innerHTML);
	if(ModeGame>1){var p2 = parseInt(document.getElementById("screenPlayer2").innerHTML);}
	if(ModeGame>2){
		var p3 = parseInt(document.getElementById("screenPlayer3").innerHTML);
		if(ModeGame>3){var p4 = parseInt(document.getElementById("screenPlayer4").innerHTML);}else{p4=0;}
	}
	var bombNotFind = parseInt(document.getElementById("scoreBomb").innerHTML);

	var anybodyWin = 0;
	
	switch (ModeGame){
		case "1":
			if (bombNotFind == 0){
				winCase(1);
			}
			break;
		case "2":
			if(p1>(NumBomb/2) || p2>(NumBomb/2)){
				winCase(Player);
			}
			break
		case "3": case "4":
			if(p1>(p2+bombNotFind) && p1>(p3+bombNotFind) && p1>(p4+bombNotFind) && empate!=1){
				winCase(1)
				anybodyWin++;
			}
			if(p2>(p1+bombNotFind) && p2>(p3+bombNotFind) && p2>(p4+bombNotFind) && empate!=1){
				winCase(2)
				anybodyWin++;
			}
			if(p3>(p1+bombNotFind) && p3>(p2+bombNotFind) && p3>(p4+bombNotFind) && empate!=1){
				winCase(3)
				anybodyWin++;
			}
			if(p4>(p1+bombNotFind) && p4>(p2+bombNotFind) && p4>(p3+bombNotFind) && empate!=1){
				winCase(4)
				anybodyWin++;
			}
			
			
			if(bombNotFind == 0 && anybodyWin==0){
				//Caso de empate entre 2 o 3
				if(empate!=1){
					checkWinner(1)
				}else{
					winCase(0,[0,p1,p2,p3,p4],Math.max(p1,p2,p3,p4));
				}
			}
			break;
		default:
	}
}

function winCase(winer,cadenaNum,max){
	
	var cadena = "<img src='ima/cup.png' width='50%' /><h1>";
	
	$("#counterBoxA").hide();
	$("#winScreen").show("slow");
	$("#counterBoxB").css("width","100%");
	
	if(winer!=0){
		cadena += "Player " + winer + " WIN</h1>";
	}else{
		cadena += "Players ";
		for(var i=1;i<cadenaNum.length+1;i++){
			if (cadenaNum[i]==max){
				cadena += "  *" + i + "*  "
			}
		}
		cadena += "WIN";
	}
	
	if (Sound==1){
		MyAudio.src = "sound/win.mp3";
		MyAudio.play();
	}
	
	document.getElementById("winScreen").innerHTML = cadena;
	
}

function soundControl(){
	
	if ($("#soundButton").html()=="ON"){
		$("#soundButton").html("OFF");
		Sound = 0;
	}else{
		$("#soundButton").html("ON");
		Sound = 1;
	}
}

function colorPlayer(){
	
	$("#scorePlayer1").css("background","#D8D8D8");
	$("#scorePlayer2").css("background","#D8D8D8");
	$("#scorePlayer3").css("background","#D8D8D8");
	$("#scorePlayer4").css("background","#D8D8D8");
	
	if(Player==1){
		$("#scorePlayer1").css("background","#97c018");
	}
	if(Player==2){
		$("#scorePlayer2").css("background","#eea2bc");
	}
	if(Player==3){
		$("#scorePlayer3").css("background","#d4a70c");
	}
	if(Player==4){
		$("#scorePlayer4").css("background","#99d9ea");
	}
	
}

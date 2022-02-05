let data;
var groupPos;
var time = new Date();
//var currentHour = time.getHours();
//var currentMinute = time.getMinutes();
let DATA={
 TurtleG1_ID: 1,
 TurtleG2_ID: 2,
 G2am:0,
 G1am:0,
 Turtle_ID:0,
 GroupS:1,
 IsClose:false,
 HasNest:false
}
GroupPosition();
/////////////////////////////////////load player id 
//document.getElementById("avghp1").innerHTML = "Average Group HP:" +100;
//document.getElementById("avghp2").innerHTML = "Average Group HP:" +100;
function GetPlayerinfo(playerdata){
	//update the table with the player info	
	DATA.G1am = playerdata[0].Turtle_group_amount;
	DATA.TurtleG1_ID = playerdata[0].Turtle_group_id;
	DATA.G2am = playerdata[1].Turtle_group_amount;
	DATA.TurtleG2_ID = playerdata[1].Turtle_group_id;
	if (DATA.GroupS == 1){
		DATA.GroupS = playerdata[0].Turtle_group_id;
	}	
	//gets group 2 ammount
	$.getJSON('/getG/'+DATA.TurtleG2_ID,playerData2);

	function playerData2(data){
		DATA.G2am = data[0].Turtle_group_amount;
		updateStatus2(data[0].Turtle_group_amount);
	}
	//gets group 1  ammount
	$.getJSON('/getG/'+DATA.TurtleG1_ID,playerData1);

	function playerData1(data){
		DATA.G1am = data[0].Turtle_group_amount;
		updateStatus1(data[0].Turtle_group_amount);
	}
	//getgroup position for the map
	GroupPosition();
	getXY();
	//draw();

};
$.getJSON('/otherGroups', getOtherGroups);
$.getJSON('/GetPlayerIdLog/', GetPlayerinfo);

/////////////////////////////////////////////////
function getRandomInteger(min, max) {
    min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
};

var canvas;
var canvas2 = $("#MinimapC");

var food;
var water;
var island;
var beach;
var plastic;
var waterFoodPlastic;
var beachHumans;
var beachFood;
var beachPlastic;
var beachFoodPlastic;
var beachNested;
var group1;
var group2;
var group3;
var group4;
var highlight;
let pX;
let pY;
let tileT;
let tilePlas;
let tileFood;

let tile;

let MoveTile2;

function drawHex(){
	for(let r = 0; r <= 4; r++){
		for (let c = 0; c <= 4; c++) {

		}
	}
}

function preload(){
	GroupPosition();
	water = loadImage('Tiles/Water_tile.png'); // Load the image

	beach = loadImage('Tiles/Beach_tile.png'); // Load the image

	island = loadImage('Tiles/Island_tile.png'); // Load the image

	food = loadImage('Tiles/Water_Food_tile.png'); // Load the image

	plastic = loadImage('Tiles/Water_Plastic_tile.png'); // Load the image

	waterFoodPlastic = loadImage('Tiles/Water_Food_Plastic_tile.png'); // Load the image

	beachHumans = loadImage('Tiles/Human_Beach_tile.png'); // Load the image

	beachFood = loadImage('Tiles/Food_Beach_tile.png'); // Load the image

	beachPlastic = loadImage('Tiles/Plastic_Beach_tile.png'); // Load the image

	beachFoodPlastic = loadImage('Tiles/Plastic_Food_Beach_tile.png'); //Load the image

	beachNested = loadImage('Tiles/Nested_Beach_tile.png'); //Load the image

	group1 = loadImage('Tiles/1.png'); //Load the image

	group2 = loadImage('Tiles/2.png'); //Load the image

	group3 = loadImage('Tiles/3.png'); //Load the image

	group4 = loadImage('Tiles/4.png'); //Load the image

	highlightImage = loadImage('Tiles/Highlight.png'); //Load the image

	NotMyGroup = loadImage('Tiles/NotMyGroup.png'); //Load the image


	loadJSON('/LoadMap', loadMap);
}
function setup() {
	canvas = createCanvas(750,660);
	canvas.position(550, 200);
	canvas2.position(1000, 400);
	/*for(i == 0; i <= 10; i++){
		for(j == 0; j <= 10; j++){

		}
	}*/
}

//img = getRandomInteger(1, 101);

function generate() {
var oof;
	$.post('/resetMap', oof, sucess, 'json');

	function sucess(callback){
	}

};


$.getJSON('/LoadMap', loadMap);

function GroupPosition(){
	$.getJSON('/LoadGroupsP', loadGroups);

	function loadGroups(playerpos2){
		groupPos = playerpos2;

	};
}



function loadMap(data1){
	// body...
	data = data1
	
};

var otherGroup;

function getOtherGroups(OTG){

	otherGroup = OTG;
};

//draw();
function mousePressed() {
	$.getJSON('/otherGroups', getOtherGroups);
	$.getJSON('/GetPlayerIdLog/', GetPlayerinfo);
  	GroupPosition();
	$.getJSON('/LoadMap', loadMap);
	if(mouseX >= 550-550 && mouseX <= canvas.width && mouseY >= 200-200 && mouseY <= canvas.height && 
		((DATA.GroupS==DATA.TurtleG1_ID && DATA.G1am > 0 ) || (DATA.GroupS==DATA.TurtleG2_ID && DATA.G2am > 0 ) )  ){
		MoveG(MoveTile2);
	}
}

var highlighted = false;
function mouseOver(highlighted){

}
var canMove = true;

GroupPosition();
function draw(){
	
	clear();
	translate(-gX * 100 + 325, -gY * 87 + (278));
	let i;
	for(i = 0; i < data.length; i++){
		tile = water;

		var dx = gX - data[i].Map_tile_x
		var dy = gY - data[i].Map_tile_y
		if (Math.abs(dx) > 8 || Math.abs(dy) > 8)
			continue;

		//for(var j = 0; j <= 100; j++){
			

		//if(-gX * 100 + 325 && -gY * 87 + (278)){

			// water
			if(data[i].Map_tile_type_id == 1 && data[i].Map_tile_has_food == 0 && data[i].Map_tile_has_plastic == 0){tile = water};
			//food
			if(data[i].Map_tile_type_id == 1 && data[i].Map_tile_has_food == 1 && data[i].Map_tile_has_plastic == 0){tile = water};
			//  plastic
			if(data[i].Map_tile_type_id == 1 && data[i].Map_tile_has_food == 0 && data[i].Map_tile_has_plastic == 1){tile = water};
			// water with food and plastic
			if(data[i].Map_tile_type_id == 1 && data[i].Map_tile_has_food == 1 && data[i].Map_tile_has_plastic == 1){tile = water};
			// beach
			if(data[i].Map_tile_type_id == 2 && data[i].Map_tile_has_food == 0 && data[i].Map_tile_has_plastic == 0 && data[i].Map_humans_tile_has_humans == 0 && data[i].Map_tile_has_nest == 0){tile = beach};
			// nested beachj
			if(data[i].Map_tile_type_id == 2 && data[i].Map_tile_has_nest == 1){tile = beachNested};
			// beach with bad humans
			if(data[i].Map_tile_type_id == 2 && data[i].Map_tile_has_food == 0 && data[i].Map_tile_has_plastic == 0 && data[i].Map_humans_tile_has_humans == 2 && data[i].Map_tile_has_nest == 0){tile = beachHumans};
			// beach with good humans
			if(data[i].Map_tile_type_id == 2 && data[i].Map_tile_has_food == 0 && data[i].Map_tile_has_plastic == 0 && data[i].Map_humans_tile_has_humans == 1 && data[i].Map_tile_has_nest == 0){tile = beachHumans};
			// beach with food
			if(data[i].Map_tile_type_id == 2 && data[i].Map_tile_has_food == 1 && data[i].Map_tile_has_plastic == 0 && data[i].Map_humans_tile_has_humans == 0 && data[i].Map_tile_has_nest == 0){tile = beach};
			// beach with plastic
			if(data[i].Map_tile_type_id == 2 && data[i].Map_tile_has_food == 0 && data[i].Map_tile_has_plastic == 1 && data[i].Map_humans_tile_has_humans == 0 && data[i].Map_tile_has_nest == 0){tile = beach};
			// beach with food and plastic
			if(data[i].Map_tile_type_id == 2 && data[i].Map_tile_has_food == 1 && data[i].Map_tile_has_plastic == 1 && data[i].Map_humans_tile_has_humans == 0 && data[i].Map_tile_has_nest == 0){tile = beach};
			// island
			if(data[i].Map_tile_type_id >= 3){tile = island};
			 

				for (var j = 0; j < otherGroup.length; j++) {
					if(data[i].Map_tile_x==int(otherGroup[j].Map_tile_x) && data[i].Map_tile_y==int(otherGroup[j].Map_tile_y)){tile = NotMyGroup;};
				}
				// group 1
				if(data[i].Map_tile_x==int(groupPos[0].Map_tile_x) && data[i].Map_tile_y==int(groupPos[0].Map_tile_y)){tile = group1;};
				// group 2
				if(data[i].Map_tile_x==int(groupPos[1].Map_tile_x) && data[i].Map_tile_y==int(groupPos[1].Map_tile_y)){tile = group2;};			

				
			
			if(data[i].Map_tile_y==0 || data[i].Map_tile_y%2==0){
				image(tile, data[i].Map_tile_x*tile.width, data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9), tile.width, tile.height);
				noFill();
				beginShape();
					vertex(data[i].Map_tile_x*tile.width+(tile.width/2) ,data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9));
					vertex(data[i].Map_tile_x*tile.width ,data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+(tile.height/4));
					vertex(data[i].Map_tile_x*tile.width ,data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+(tile.height-tile.height/4));
					vertex(data[i].Map_tile_x*tile.width+(tile.width/2) ,data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+tile.height);
					vertex(data[i].Map_tile_x*tile.width+tile.width ,data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+(tile.height-tile.height/4));
					vertex(data[i].Map_tile_x*tile.width+tile.width ,data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+(tile.height/4));
				endShape(CLOSE);
			}else{
				image(tile, data[i].Map_tile_x*tile.width+(tile.width/2), data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9), tile.width, tile.height);
				noFill();
				beginShape();
					vertex(data[i].Map_tile_x*tile.width+(tile.width/2)+(tile.width/2) ,data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9));
					vertex(data[i].Map_tile_x*tile.width+(tile.width/2) ,data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+(tile.height/4));
					vertex(data[i].Map_tile_x*tile.width+(tile.width/2) ,data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+(tile.height-tile.height/4));
					vertex(data[i].Map_tile_x*tile.width+(tile.width/2)+(tile.width/2) ,data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+tile.height);
					vertex(data[i].Map_tile_x*tile.width+(tile.width/2)+tile.width ,data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+(tile.height-tile.height/4));
					vertex(data[i].Map_tile_x*tile.width+(tile.width/2)+tile.width ,data[i].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+(tile.height/4));
				endShape(CLOSE);
			};
		};
		//Highlights
			var Gindex;
            if (DATA.GroupS == DATA.TurtleG2_ID){
                Gindex = 1;
            }else {
                Gindex = 0;
            }
			//Left highlight
			if(canMove == true && (groupPos[Gindex].Map_tile_y==0 || groupPos[Gindex].Map_tile_y%2==0) && mouseX <= canvas.width/2-tile.width/2 && mouseX >= canvas.width/2-tile.width-tile.width/2 && mouseY <= canvas.height/2+tile.height/2 && mouseY >= canvas.height/2-tile.height/4+25){
				image(highlightImage, groupPos[Gindex].Map_tile_x*tile.width-100, groupPos[Gindex].Map_tile_y*(tile.height/2.5 + tile.height/2.9));
				MoveTile2 = 3;
				highlighted = true;
			}
			if(canMove == true && groupPos[Gindex].Map_tile_y%2!=0 && mouseX <= canvas.width/2 && mouseX >= canvas.width/2-100 && mouseY <= canvas.height/2+tile.height/2 && mouseY >= canvas.height/2-tile.height/4+25){
				image(highlightImage, groupPos[Gindex].Map_tile_x*tile.width-tile.width+(tile.width/2), groupPos[Gindex].Map_tile_y*(tile.height/2.5 + tile.height/2.9));
				MoveTile2 = 3;
				highlighted = true;
			}

			//UPLeft highlight
			if(canMove == true && (groupPos[Gindex].Map_tile_y==0 || groupPos[Gindex].Map_tile_y%2==0) && mouseX >= canvas.width/2-tile.width && mouseX <= canvas.width/2 && mouseY <= canvas.height/2-tile.height/2 && mouseY >= canvas.height/2-tile.height+25){
				image(highlightImage, groupPos[Gindex].Map_tile_x*tile.width-tile.width/2, groupPos[Gindex].Map_tile_y*(tile.height/2.5 + tile.height/2.9)-tile.height/2-30);
				MoveTile2 = 1;
				highlighted = true;
			}
			if(canMove == true && groupPos[Gindex].Map_tile_y%2!=0 && mouseX >= canvas.width/2-tile.width/2 && mouseX <= canvas.width/2+tile.width/2 && mouseY <= canvas.height/2-tile.height/2+25 && mouseY >= canvas.height/2-tile.height+25){
				image(highlightImage, groupPos[Gindex].Map_tile_x*tile.width, groupPos[Gindex].Map_tile_y*(tile.height/2.5 + tile.height/2.9)-tile.height/2-30);
				MoveTile2 = 1;
				highlighted = true;
			}

			//DownLeft highlight
			if(canMove == true && (groupPos[Gindex].Map_tile_y==0 || groupPos[Gindex].Map_tile_y%2==0) && mouseX >= canvas.width/2-tile.width && mouseX <= canvas.width/2 && mouseY >= canvas.height/2+tile.height/2+25 && mouseY <= canvas.height/2+tile.height+10){
				image(highlightImage, groupPos[Gindex].Map_tile_x*tile.width-tile.width/2, groupPos[Gindex].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+tile.height/2+30);
				MoveTile2 = 5;
				highlighted = true;
			}
			if(canMove == true && groupPos[Gindex].Map_tile_y%2!=0 && mouseX >= canvas.width/2-tile.width/2 && mouseX <= canvas.width/2+tile.width/2 && mouseY <= canvas.height/2+tile.height+25 && mouseY >= canvas.height/2+tile.height/2+25){
				image(highlightImage, groupPos[Gindex].Map_tile_x*tile.width, groupPos[Gindex].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+tile.height/2+30);
				MoveTile2 = 5;
				highlighted = true;
			}



			//Right highlight
			if(canMove == true && (groupPos[Gindex].Map_tile_y==0 || groupPos[Gindex].Map_tile_y%2==0) && mouseX >= canvas.width/2+tile.width/2 && mouseX <= canvas.width/2+tile.width+(tile.width/2) && mouseY <= canvas.height/2+tile.height/2 && mouseY >= canvas.height/2-tile.height/4+25){
				image(highlightImage, groupPos[Gindex].Map_tile_x*tile.width+100, groupPos[Gindex].Map_tile_y*(tile.height/2.5 + tile.height/2.9));
				MoveTile2 = 4;
				highlighted = true;
			}
			if(canMove == true && groupPos[Gindex].Map_tile_y%2!=0 && mouseX >= canvas.width/2+105 && mouseX <= canvas.width/2+205 && mouseY <= canvas.height/2+tile.height/2 && mouseY >= canvas.height/2-tile.height/4+25){
				image(highlightImage, groupPos[Gindex].Map_tile_x*tile.width+tile.width+(tile.width/2), groupPos[Gindex].Map_tile_y*(tile.height/2.5 + tile.height/2.9));
				MoveTile2 = 4;
				highlighted = true;
			}

			//UPRight highlight
			if(canMove == true && (groupPos[Gindex].Map_tile_y==0 || groupPos[Gindex].Map_tile_y%2==0) && mouseX <= canvas.width/2+tile.width && mouseX >= canvas.width/2 && mouseY <= canvas.height/2-tile.height/2 && mouseY >= canvas.height/2-tile.height+25){
				image(highlightImage, groupPos[Gindex].Map_tile_x*tile.width+tile.width/2, groupPos[Gindex].Map_tile_y*(tile.height/2.5 + tile.height/2.9)-tile.height/2-tile.height/4);
				MoveTile2 = 2;
				highlighted = true;
			}
			if(canMove == true && groupPos[Gindex].Map_tile_y%2!=0 && mouseX <= canvas.width/2+tile.width+(tile.width/2) && mouseX >= canvas.width/2+tile.width/2 && mouseY <= canvas.height/2-tile.height/2+25 && mouseY >= canvas.height/2-tile.height+25){
				image(highlightImage, groupPos[Gindex].Map_tile_x*tile.width+tile.width, groupPos[Gindex].Map_tile_y*(tile.height/2.5 + tile.height/2.9)-tile.height/2-tile.height/4);
				MoveTile2 = 2;
				highlighted = true;
			}

			//DownRight highlight
			if(canMove == true && (groupPos[Gindex].Map_tile_y==0 || groupPos[Gindex].Map_tile_y%2==0) && mouseX <= canvas.width/2+tile.width && mouseX >= canvas.width/2 && mouseY >= canvas.height/2+tile.height/2+25 && mouseY <= canvas.height/2+tile.height+10){
				image(highlightImage, groupPos[Gindex].Map_tile_x*tile.width+tile.width/2, groupPos[Gindex].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+tile.height/2+tile.height/4);
				MoveTile2 = 6;
				highlighted = true;
			}
			if(canMove == true && groupPos[Gindex].Map_tile_y%2!=0 && mouseX <= canvas.width/2+tile.width+(tile.width/2) && mouseX >= canvas.width/2+tile.width/2 && mouseY <= canvas.height/2+tile.height+25 && mouseY >= canvas.height/2+tile.height/2+25){
				image(highlightImage, groupPos[Gindex].Map_tile_x*tile.width+tile.width, groupPos[Gindex].Map_tile_y*(tile.height/2.5 + tile.height/2.9)+tile.height/2+tile.height/4);
				MoveTile2 = 6;
				highlighted = true;
			}
		//}
	};


//Leaderboard
$.getJSON('/Leaderboard/', (DATA)=>{
	var ul = document.getElementById("LeaderboardList");
	for (let i = 0; i < 5; i++) {
		var node = document.createTextNode(DATA[i].Player_name);
		var li = document.createElement("li");
		li.appendChild(node);
		ul.appendChild(li);
	}
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// select a group--------------------------------------------------------------
function selectG(groupId){
	if (groupId == 1){
		DATA.GroupS = DATA.TurtleG1_ID;
		getXY();
	}else{
		DATA.GroupS = DATA.TurtleG2_ID;
		getXY();
	}
}


//___________________________________GROUP switch ___________________________________
// remove 1 turtle from group 1
var g2X;
var g2Y;
	var Ayeet;
	//get x and y of the other group
	function getXY2(){
		if (DATA.GroupS == DATA.TurtleG1_ID){
			Ayeet = DATA.TurtleG2_ID;
		}else {
			Ayeet = DATA.TurtleG1_ID;
		}
		$.getJSON('/GroupXY/'+Ayeet,moveG);

		function moveG(data){
			g2X = data[0].Map_tile_x;
			g2Y = data[0].Map_tile_y;
			//get x and y of the selected group 
			$.getJSON('/GroupXY/'+DATA.GroupS,CheckForP);
			function CheckForP(checkif){
				//check if the groups are near each other
				if ((checkif[0].Map_tile_x == g2X || checkif[0].Map_tile_x == g2X-1 || checkif[0].Map_tile_x == g2X+1) &&
				 (checkif[0].Map_tile_y == g2Y || checkif[0].Map_tile_y == g2Y-1 || checkif[0].Map_tile_y == g2Y+1)){
					DATA.IsClose = true;
				}else{
					DATA.IsClose = false;
				}
			}
		}
	}

function RemoveT(groupNumber){
	getXY2();
	if (groupNumber == 1 && DATA.G1am > 1 && DATA.IsClose == true ){
		DATA.G2am = DATA.G2am +1;
		DATA.G1am = DATA.G1am -1;
	
		//gets a turtle id and changes the turtle group id	
		$.getJSON('/getTurtleID/'+DATA.TurtleG1_ID,getTid);

		function getTid(data){
			DATA.Turtle_ID = data[0].Turtle_id;
			$.post('/ChangeTurtle/'+DATA.Turtle_ID+'/'+DATA.TurtleG2_ID, DATA, sucess,'json');

			function sucess(callback){
				console.log(callback);
			}
		}

		//changes ammount of turtles in the 2 affected groups			
		$.post('/addturtle/'+DATA.G2am+'/'+DATA.TurtleG2_ID, DATA, sucess,'json');

		function sucess(callback){
			console.log(callback);
		}

		$.post('/removeturtle/'+DATA.G1am+'/'+DATA.TurtleG1_ID, DATA, sucess,'json');
		function sucess(callback){
			console.log(callback);
		}	
		document.getElementById("G1").innerHTML = "Ammount of Turtles:" +DATA.G1am;
		document.getElementById("G2").innerHTML = "Ammount of Turtles:" +DATA.G2am;

	}else if (groupNumber == 2 && DATA.G2am > 1 && DATA.IsClose == true ){
		DATA.G1am = DATA.G1am +1;
		DATA.G2am = DATA.G2am -1;
	
		//gets a turtle id and changes the turtle group id	
		$.getJSON('/getTurtleID/'+DATA.TurtleG2_ID,getTid);

		function getTid(data){
			DATA.Turtle_ID = data[0].Turtle_id;
			$.post('/ChangeTurtle/'+DATA.Turtle_ID+'/'+DATA.TurtleG1_ID, DATA, sucess,'json');

			function sucess(callback){
				console.log(callback);
			}
		}

		//changes ammount of turtles in the 2 affected groups			
		$.post('/addturtle/'+DATA.G1am+'/'+DATA.TurtleG1_ID, DATA, sucess,'json');

		function sucess(callback){
			console.log(callback);
		}

		$.post('/removeturtle/'+DATA.G2am+'/'+DATA.TurtleG2_ID, DATA, sucess,'json');
		function sucess(callback){
			console.log(callback);
		}	
		document.getElementById("G1").innerHTML = "Ammount of Turtles:" +DATA.G1am;
		document.getElementById("G2").innerHTML = "Ammount of Turtles:" +DATA.G2am;

	}
}


//-----------------------------------------------------------------
//function for updating group ammount 
function updateStatus2(amount){

	document.getElementById("G2").innerHTML = "Ammount of Turtles:" +amount;

	//game over condition 
	if (DATA.TurtleG1_ID >499 && DATA.G1am == 0 && DATA.G2am == 0 ){
		alert("All your Turtles Died , make another account to continue");
	}
}
//function for updating group ammount 
function updateStatus1(amount){

	document.getElementById("G1").innerHTML = "Ammount of Turtles:" +amount;
}

//get x & y
var gX;
var gY;
function getXY(){
	$.getJSON('/GroupXY/'+DATA.GroupS,moveG);

	
	function moveG(data){
		gX = data[0].Map_tile_x;
		gY = data[0].Map_tile_y;

	//Minimap
	var c = document.getElementById("MinimapC");
	var ctx = c.getContext("2d");
	ctx.clearRect(0, 0,  c.width, c.height);
	ctx.beginPath();
	ctx.backgroundColor = "lightgrey";
	ctx.arc(gX*3, gY*1.5, 5, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.fillStyle = "lightgreen";
	ctx.fill();


		
	}	
}


//moves group

function MoveG(movement){
	//check for players on the tile
	$.getJSON('/PlayerInT/'+gX+'/'+gY+'/'+movement,PlayerinTile);

	function PlayerinTile(GroupsIn){
	
	if (JSON.stringify(GroupsIn).length < 3 || GroupsIn[0].Turtle_group_id < 500){
		
	//get tile info
	$.getJSON('/TileXY/'+gX+'/'+gY+'/'+movement,Tileinfo);

	function Tileinfo(data){
		 tileT = data[0].Map_tile_type_id;
		 tilePlas = data[0].Map_tile_has_plastic;
		 tileFood = data[0].Map_tile_has_food;
		 if (data[0].Map_tile_x==1 && data[0].Map_tile_y==0){
		 	alert("You should also Try the game Turtle Trip ");
		 }else if(data[0].Map_tile_x==0 && data[0].Map_tile_y==1){
		 	alert("Did you know about the collab with Turtle Trip?");
		 }
		// if the tile has plastic 
		if (data[0].Map_tile_has_plastic == 1){
			$.getJSON('/DamageTurtles/'+DATA.GroupS, AvgTurtlesHP);
			function AvgTurtlesHP(avgT){
				if (DATA.GroupS == DATA.TurtleG1_ID){
				//	document.getElementById("avghp1").innerHTML = "Average Group HP:" +math.floor(avgT[0].average);	
				}else{
				//	document.getElementById("avghp2").innerHTML = "Average Group HP:" +math.floor(avgT[0].average);
				}
			}	
		}

		 // if it has nest 
		 if (data[0].Map_tile_has_nest == 1){
		 	//gets id of the nest group
		 	DATA.HasNest = false;
		 	$.getJSON('/GetGroupNId/'+data[0].Map_tile_x+'/'+data[0].Map_tile_y, GetGNId);
		 	function GetGNId(GNID){
		 		// Take turtles from the nest
		 		let NestId = GNID[0].Turtle_group_id;
		 		$.post('/TakeTurtles/'+DATA.GroupS+'/'+NestId, DATA, success,'json');

		 		//drop Nest 
		 		$.post('/DeleteN/'+NestId, DATA, success,'json');
		 		//drop Nest Group
		 		$.post('/DeleteG/'+NestId, DATA, success,'json');
		 		//Remove Nest from tile
		 		let nest = 0;
		 		$.post('/ChangeToNest/'+data[0].Map_tile_x+'/'+data[0].Map_tile_y+'/'+nest, DATA, success,'json');

		 		//update turtle ammount on selected group 
		 		$.getJSON('/TurtleC/'+DATA.GroupS,Turtlecount);

			 	function Turtlecount(ammount){
			 		if (DATA.GroupS == DATA.TurtleG1_ID){
			 			DATA.G1am == DATA.G1am + ammount;
			 			alert("You now have "+ammount[0].countT+" turtles in this group ");
			 			document.getElementById("G1").innerHTML = "Ammount of Turtles:" +DATA.G1am;
			 		}else{
			 			DATA.G2am == DATA.G2am + ammount;
			 			alert("You now have "+ammount[0].countT+" turtles in this group ");
			 			document.getElementById("G2").innerHTML = "Ammount of Turtles:" +DATA.G2am;
			 		}
			 		$.post('/removeturtle/'+ammount[0].countT+'/'+DATA.GroupS, DATA, success,'json');
			 		
			 	}
			}
		 }
		 
	//Check the tile info
	if (tilePlas == 1){document.getElementById("tileInfo").innerHTML = "&nbsp;&nbsp;You swim in plastics"}
	if (tileFood == 1){document.getElementById("tileInfo").innerHTML = "&nbsp;&nbsp;Your eat food"}
	if (tilePlas == 1 && tileFood == 1){document.getElementById("tileInfo").innerHTML = "&nbsp;&nbsp;You swim in plastics and eat food"}
	if (tilePlas == 0 && tileFood == 0){document.getElementById("tileInfo").innerHTML = "&nbsp;&nbsp;"}
		$.post('/move/'+DATA.GroupS+'/'+gX+'/'+gY+'/'+movement+'/'+tileT, DATA, success,'json');

		function success(callback){
			console.log(callback);
		}

	$.getJSON('/GroupXY/'+DATA.GroupS,moveG2);

	let newGX;
	let newGY;
	function moveG2(data){
		 newGX = data[0].Map_tile_x;
		 newGY = data[0].Map_tile_y;
		 
		GroupPosition();
		getXY();

		if (DATA.GroupS == DATA.TurtleG1_ID){
			groupPos[0].Map_tile_x = newGX;
			groupPos[0].Map_tile_y = newGY;
		}else if (DATA.GroupS == DATA.TurtleG2_ID){
			groupPos[1].Map_tile_x = newGX;
			groupPos[1].Map_tile_y = newGY;
		}
		loop();
	}
	GroupPosition();
	draw();
	}
}};	
};

//Nest_________________________________________________
function Nesting(Group){
	time = new Date();
	let currentHour = time.getHours();
	let currentMinute = time.getMinutes();
	let Gid;
	if (Group == 1 && DATA.HasNest == false){
		Gid = 0;
			$.getJSON('/TileXY/'+(groupPos[0].Map_tile_x-1)+'/'+(groupPos[0].Map_tile_y-1)+'/'+6,Tileinfo2);
		}else if (Group == 2 && DATA.HasNest == false){
		Gid = 1;
			$.getJSON('/TileXY/'+(groupPos[1].Map_tile_x-1)+'/'+(groupPos[1].Map_tile_y-1)+'/'+6,Tileinfo2);
		}

	function Tileinfo2(Tinfo){
		DATA.HasNest = true;
		var RandoTurtleN = 0;
		if (Tinfo[0].Map_tile_type_id == 2 && Tinfo[0].Map_humans_tile_has_humans == 0 && Tinfo[0].Map_tile_has_nest ==0){
			RandoTurtleN = getRandomInteger(1, 5);
		}else if(Tinfo[0].Map_tile_type_id == 2 && Tinfo[0].Map_humans_tile_has_humans == 1 && Tinfo[0].Map_tile_has_nest ==0){
			RandoTurtleN = getRandomInteger(1, 10);
		}else {
			RandoTurtleN = 0;
		}
		if ( RandoTurtleN != 0 ){
			
			//makes a group for nesting
			$.post('/InsertGroup/'+groupPos[Gid].Map_tile_x+'/'+groupPos[Gid].Map_tile_y+'/'+RandoTurtleN, DATA, success,'json');

			function success(callback){
				console.log(callback);
			}
			//insert into nest
			$.post('/InsertNest/'+groupPos[Gid].Map_tile_x+'/'+groupPos[Gid].Map_tile_y+'/'+RandoTurtleN, DATA, success,'json');

			function success(callback){
				console.log(callback);
			}
			//insert turtles
			
			//update Map_tile
			let nest = 1;
			$.post('/ChangeToNest/'+groupPos[Gid].Map_tile_x+'/'+groupPos[Gid].Map_tile_y+'/'+nest, DATA, success,'json');
			
			
				canMove = false;
			
			console.log("buttons locked ")
			setTimeout(function(){
	    	//happens after the timer is done

	    		canMove = true;

			console.log("buttons unlocked")
			}, 1000); //60000

			setTimeout(function(){
	    	//happens after the timer is done
		    //insert turtles
			for (i=0;i < RandoTurtleN; i++){
				$.post('/Maketurtle/', DATA, success,'json');

			}
			console.log("turtles created")
			}, 1000);	//900000
		}
		
		
	}
}

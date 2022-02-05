const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

//Authentication packages 
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const mySqlSessionStore = require('express-mysql-session')(session);
const passportAuthStrategy = require('passport-local').Strategy;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static('web'));

///connection is database where session is meant to be stored ////
var connection = {
    host:"localhost",
	port:"3306",
	user:"root",
	password:"root",
	database:"Turtleation"
}
var sessionStore = new mySqlSessionStore(connection);

///creates a cookie for you//////
app.use(session({
    secret: 'shdgdhghdg',//cookie is signed with this secret (more like 'hashing' the cookie)
    resave: false,//this determined if our session should be updated even if no change is made (eg if you only refresh the page i.e no changes are made but if this is true it will update session)
    store: sessionStore, // this one is added after adding express-mysql-session to store session in DB
    saveUninitialized: false //this create a cookie and session when someone visit the page and not logged in . so to keep storage small set it to false.
}));

app.use(passport.initialize());//initializa passport
app.use(passport.session());//passport integrates with express-session

app.listen(3000, () => { console.log('listening on 2000') });

const dbase = mysql.createConnection({
	host:"localhost",
	port:"3306",
	user:"root",
	password:"root",
	database:"Turtleation"
});

dbase.connect((err) => {
    if (err) throw err;
    console.log('connected');
})


/////////////////////////////////////////////YOUR REGISTRATION FILE///////////////////////////
app.get('/turtleationRegister', (req, res) => {
    res.sendFile(path.join(__dirname + '/web/turtleationRegister.html'))
});
////////////////////////////////////////REGISTER ROUTE POST YOUR DATA TO LOGIN TABLE U HAVE IN DB AND REDIRECTS U TO HOMEPAGE///////////
app.post('/turtleationRegister', (req, res) => {
    
    const userName = req.body.Username;
    const email = req.body.Email;
    const password = req.body.Password;
    const score = 0;

    let q = 'insert into Player (Player_name,Player_email,Player_password,Player_score) values (?,?,?,?)'
    bcrypt.hash(password, 10, (err, hash) => {
        dbase.query(q, [userName, email, hash,score], (err, result) => {
            if (err) {
                console.log(err);
                //res.redirect('/registration');

            }else{
            
            // get player id
            let sql= "SELECT `Player_id`  FROM `Player` WHERE `Player_name` ='"+userName+"' ;"

            dbase.query(sql, (err,result2)=>{
                if (err) throw err;
                //create groups 
                for (let i=1 ; i<=2 ; i++){
                    let numb = Math.floor((Math.random()* (10 - 1 ) +1  ));
                    let sql1 = "INSERT INTO Turtle_group (Map_tile_x, Map_tile_y, Turtle_group_amount, Player_id) VALUES ("+numb+","+numb+", "+1+", "+result2[0].Player_id+");";

                    dbase.query(sql1, (err,result3)=>{
                        if(err) throw err;
                    });
                }
                // get groups id
                let sql2= "SELECT `Turtle_group_id`  FROM `Turtle_group` WHERE `Player_id` ='"+result2[0].Player_id+"' ;"

                dbase.query(sql2, (err,result4)=>{
                    if (err) throw err;
                    //create turtles
                    var C =0;
                    for (let i=1 ; i<=2 ; i++){
                        let sql3 = "Insert Into Turtles(Turtle_group_id, Turtle_health, Turtle_lifespan, Turtle_birth_date, Turtle_last_eaten) VALUES ("+result4[C].Turtle_group_id+", 100, 100, '2019-04-16 14:00:00', '2019-04-16 14:00:00');";

                        dbase.query(sql3, (err,result5)=>{
                            if(err) throw err;
                        });
                        C = C +1;
                    }
                });
            });
            
            res.redirect('/');
        }});
    })
})
///////////////////////////////////////////LOGIN ROUTE POSTS CREDENTIALS TO PASSPORT STARTEGY TO CHECK IF THEY ARE CORRECT////////////////////////////// 
app.post('/turtleationLogin', passport.authenticate(
    'local', {
        successRedirect: '/turtleationGamePage',///////this should be ur main game route
        failureRedirect: '/'
    })
);
////////////////////////YOUR GAME PAGE WHERE AUTHENTICATION HAS TO BE DONE///////////////////////////////////////////
app.get('/turtleationGamePage', authenticationMiddleWare(), (req, res) => {
    //res.send(req.session.passport);
    res.sendFile(__dirname + '/web/turtleationGamePage.html');
})


//////////////////////////////////////////AUTHENTICATION FUNCTION CHECKS IF USER  IS LOGGED IN OR NOT///////////////////////////////////
let player_id ;
function authenticationMiddleWare() {
    return (req, res, next) => {
        player_id = req.session.passport.user.userid;
        if (req.isAuthenticated()) return next();
        res.redirect('/')
    }
}



passport.serializeUser(function (username, done) {
    done(null, username);
});

passport.deserializeUser(function (username, done) {
    done(null, username);
});



//create a strategy for authenticating the user for login ///////////////////


passport.use(new passportAuthStrategy(
    function (username, password, done) {
        dbase.query('select Player_id,Player_password from Player  where Player_name = ?', [username], (err, res) => {
            if (err) {
                done(err)
            }
            if (res.length === 0) {
                done(null, false);

            } else {
                const hash = res[0].Player_password.toString();
                bcrypt.compare(password, hash, (err, result) => {
                    if (result === true) {
                        player_id = res[0].Player_id;
                        return done(null, { userid: res[0].Player_id })
                    } else {
                        return done(null, false);
                    }
                })
            }
        });

    }
))

//////////////////////////////////////logOUt BY Destroying Session and Cookie/////////////////////////////////
app.get('/logout', (req, res) => {
    //res.send(req.session.passport);
    req.logout();
    req.session.destroy(() => {
        res.clearCookie('connect.sid')
        res.redirect('/');
    });

})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////PUT REST OF YOUR CODE BELOW THIS/////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// get player info //////////////
app.get('/GetPlayerIdLog/',(req,res)=>{
    var undefinedvar;
    if (player_id == undefinedvar){

        res.clearCookie('connect.sid')
        res.redirect('/');


    }else{
        let sql= "select * from Turtle_group  where Player_id = "+player_id+" AND Turtle_group_id >= 500 ;"
    
        dbase.query(sql, (err,result)=>{
            if (err) throw err;

            res.send(result);
        });
    }

    
});


///////////////////////////////////
function getRandomInteger(min, max) {
    min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
};

//create the map
app.post("/resetMap", (request,response)=>{

    //deletemap()

    for(var x = 0; x <= 99; x++)
    {
        for(var y = 0; y <= 99; y++)
        {
            has_food = false;
            has_plastic = false;
            has_humans = false;
            has_bad_humans = false;

            let random = getRandomInteger(1, 100);

            if (random <= 70)
                tile_type_id = 1; // water (70%)
            else if (random <= 90)
                tile_type_id = 2; // beach (20%)
            else
                tile_type_id = 3; // island (10%)

            if (tile_type_id != 3)
            {
                random = getRandomInteger(1, 100);

                if (random <= 50)
                    has_food = true;                

                random = getRandomInteger(1, 100);

                if (random <= 50)
                    has_plastic = true;             
            }

            if (tile_type_id == 2)
            {
                random = getRandomInteger(1, 100);

                if (random <= 50)
                    has_humans = true;              
            }

            if (tile_type_id == 2 && has_humans == true)
            {
                random = getRandomInteger(1, 100);

                if (random <= 50)
                    has_bad_humans = true;
            }

            let sql = "INSERT INTO `Map_tile` (Map_tile_x, Map_tile_y, Map_tile_type_id, Map_tile_has_food, Map_tile_has_plastic, Map_humans_tile_has_humans) VALUES " +
            "(" + x + "," + y + "," + tile_type_id + "," + has_food + "," + has_plastic + "," + has_humans + ");";

            dbase.query(sql, (err,result)=>{
                if(err) throw err;
            });
        
    
        }

    }

});

//Leaderboard
app.get('/Leaderboard', (req, res)=>{

    let sql= "SELECT Player_name FROM Player ORDER BY Player_score DESC;"

        dbase.query(sql, (err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});

//load the map table
app.get('/LoadMap',(req,res)=>{

    let sql= "SELECT *  FROM Map_tile ;"

    dbase.query(sql, (err,result)=>{
        if (err) throw err;

        res.send(result);
    });
});
//load groups position
app.get('/LoadGroupsP',(req,res)=>{
    let player_id = req.session.passport.user.userid;

    let sql= "SELECT `Map_tile_x`,`Map_tile_y`  FROM `Turtle_group` WHERE `Player_id`="+player_id+" AND `Turtle_group_id`>= 500 ;"

    dbase.query(sql, (err,result)=>{
        if (err) throw err;

        res.send(result);
    });
});

// get amount of turtles on a group
app.get('/getG/:groupId',(req,res)=>{
    let player_id = req.session.passport.user.userid;
    let reqData = req.params;
    let TurtleG_ID = reqData.groupId;
    
    let sql= "SELECT Turtle_group_amount FROM `Turtle_group` where `Player_id` = '"+player_id+"' and `Turtle_group_id` = '"+TurtleG_ID+"' ;"
    
    dbase.query(sql, (err,result)=>{
        if (err) throw err;

        res.send(result);
    });
});

// get random turtle_id from specific group 
app.get('/getTurtleID/:groupId',(req,res)=>{
    let player_id = req.session.passport.user.userid;
    let reqData = req.params;
    let TurtleG_ID = Number(reqData.groupId);
    
    let sql= "SELECT `Turtle_id`  FROM `Turtles` where  `Turtle_group_id` = "+TurtleG_ID+" GROUP BY `Turtle_group_id` ;"
    
    dbase.query(sql, (err,result)=>{
        if (err) throw err;

        res.send(result);
    });
});

// change turtle_group_id
app.post('/ChangeTurtle/:TurtleId/:groupId',(req,res)=>{
    let reqData = req.params;
    let TurtleId = reqData.TurtleId;
    let groupID = reqData.groupId;

    let sql= "UPDATE `Turtles` SET `Turtle_group_id` = "+groupID+" WHERE `Turtle_id` = "+TurtleId+"  ;"


    dbase.query(sql, (err,result)=>{
        if(err) throw err;

    });
    res.send("this is a reset of the clogging");
});
// place in other group
app.post('/addturtle/:group1/:groupId1',(req,res)=>{
    let player_id = req.session.passport.user.userid;
    let reqData = req.params;
    let G1 = Number(reqData.group1);
    let groupID1 = Number(reqData.groupId1);

    let sql= "UPDATE `Turtle_group` SET `Turtle_group_amount` = "+G1+" WHERE `Player_id` = "+player_id+" and `Turtle_group_id` = "+groupID1+" ;"


    dbase.query(sql, (err,result)=>{
        if(err) throw err;

    });
    // increase score of the player
    let sql2= "SELECT `Player_score` FROM `Player` WHERE `Player_id` = "+player_id+" ;" 

    dbase.query(sql2, (err,result2)=>{
        if (err) throw err;

        let sql3= "UPDATE `Player` SET `Player_score` = "+(Number(result2[0].Player_score)+(G1*10))+" WHERE `Player_id` = "+player_id+" ;" 

        dbase.query(sql3, (err,result3)=>{
            if (err) throw err;
        });                   
    });
    res.send("this is a reset of the clogging");
});

//remove a turtle from group  
app.post('/removeturtle/:group2/:groupId2',(req,res)=>{
    let player_id = req.session.passport.user.userid;
    let reqData = req.params;
    let G2 = reqData.group2;
    let groupID2 = reqData.groupId2;

    let sql= "UPDATE `Turtle_group` SET `Turtle_group_amount` = '"+G2+"' WHERE `Player_id` = '"+player_id+"' and `Turtle_group_id` = '"+groupID2+"' ;"


    dbase.query(sql, (err,result)=>{
        if(err) throw err;

    });
    res.send("this is a reset of the clogging");
});

// get x & y position of the group
app.get('/GroupXY/:groupId',(req,res)=>{
    let player_id = req.session.passport.user.userid;
    let reqData = req.params;
    let PlayerID = reqData.playerId;
    let TurtleG_ID = reqData.groupId;
    
    let sql= "SELECT `Map_tile_x`,`Map_tile_y`  FROM `Turtle_group` where  `Turtle_group_id` = "+TurtleG_ID+" AND `Player_id` = "+player_id+" ;"
    
    dbase.query(sql, (err,result)=>{
        if (err) throw err;

        res.send(result);
    });
});

// get tile info
app.get('/TileXY/:TX/:TY/:movement',(req,res)=>{
    let reqData = req.params;
    let NX = Number(reqData.TX);
    let NY = Number(reqData.TY);
    let Movement = Number(reqData.movement);

    if(NY==0 || NY%2==0){
        if (Movement==1){
            NY = NY -1;
            NX = NX -1;
        }else if (Movement==2){
            NY = NY -1;
        }else if (Movement==3){
            NX = NX -1;
        }else if (Movement==4){
            NX = NX +1;
        }else if (Movement==5){
            NY = NY +1;
            NX = NX -1;
        }else if (Movement==6){
            NY = NY +1;
        }
    }else{
        if (Movement==1){
            NY = NY -1;
        }else if (Movement==2){

            NY = NY -1;
            NX = NX +1;
        }else if (Movement==3){
            NX = NX -1;
        }else if (Movement==4){
            NX = NX +1;
        }else if (Movement==5){
            NY = NY +1;
        }else if (Movement==6){
            NX = NX +1;
            NY = NY +1;
        }   
    }
    let sql= "SELECT *  FROM `Map_tile` where  `Map_tile_x` = "+NX+" AND `Map_tile_y` = "+NY+" ;"
    
    dbase.query(sql, (err,result)=>{
        if (err) throw err;

        res.send(result);
        
    });
});

//Move a group
app.post('/move/:groupId/:gX/:gY/:movement/:TT',(req,res)=>{
    let player_id = req.session.passport.user.userid;
    let GID = req.params.groupId;
    let NX = Number(req.params.gX);
    let NY = Number(req.params.gY);
    let Movement = req.params.movement;
    let TileT = Number(req.params.TT);


    if(NY==0 || NY%2==0){
        if (Movement==1){
            NY = NY -1;
            NX = NX -1;
        }else if (Movement==2){
            NY = NY -1;
        }else if (Movement==3){
            NX = NX -1;
        }else if (Movement==4){
            NX = NX +1;
        }else if (Movement==5){
            NY = NY +1;
            NX = NX -1;
        }else if (Movement==6){
            NY = NY +1;
        }
    }else{
        if (Movement==1){
            NY = NY -1;
        }else if (Movement==2){

            NY = NY -1;
            NX = NX +1;
        }else if (Movement==3){
            NX = NX -1;
        }else if (Movement==4){
            NX = NX +1;
        }else if (Movement==5){
            NY = NY +1;
        }else if (Movement==6){
            NX = NX +1;
            NY = NY +1;
        }   
    }
    if (NX >= 0 && NY >= 0 && TileT != 3 ){
    let sql= "UPDATE `turtle_group` SET `Map_tile_x` = "+NX+" , `Map_tile_y` = "+NY+" WHERE `Player_id` = "+player_id+" and `Turtle_group_id` = "+GID+" ;"


    dbase.query(sql, (err,result)=>{
        if(err) throw err;

    }); 
    }

    res.send("this is a reset of the clogging");
});



// check for players
app.get('/PlayerInT/:TX/:TY/:movement',(req,res)=>{
    let reqData = req.params;
    let NX = Number(reqData.TX);
    let NY = Number(reqData.TY);
    let Movement = Number(reqData.movement);

    if(NY==0 || NY%2==0){
        if (Movement==1){
            NY = NY -1;
            NX = NX -1;
        }else if (Movement==2){
            NY = NY -1;
        }else if (Movement==3){
            NX = NX -1;
        }else if (Movement==4){
            NX = NX +1;
        }else if (Movement==5){
            NY = NY +1;
            NX = NX -1;
        }else if (Movement==6){
            NY = NY +1;
        }
    }else{
        if (Movement==1){
            NY = NY -1;
        }else if (Movement==2){

            NY = NY -1;
            NX = NX +1;
        }else if (Movement==3){
            NX = NX -1;
        }else if (Movement==4){
            NX = NX +1;
        }else if (Movement==5){
            NY = NY +1;
        }else if (Movement==6){
            NX = NX +1;
            NY = NY +1;
        }   
    }
    let sql= "SELECT *  FROM `Turtle_group` where  `Map_tile_x` = "+NX+" AND `Map_tile_y` = "+NY+" ;"
    
    dbase.query(sql, (err,result)=>{
        if (err) throw err;
        res.send(result);
        
    });
});
// insert nest
app.post('/InsertNest/:gx/:gy/:ammount',(req,res)=>{
    let player_id = req.session.passport.user.userid;
    let reqData = req.params;
    let TID = player_id;
    let GX = reqData.gx;
    let GY = reqData.gy;
    let ammount = reqData.ammount;

    let sql= "INSERT INTO `Nest_tile` (Turtle_group_id,Map_tile_x, Map_tile_y, Nest_eggs, Nesting_date) VALUES " +
            "(" + TID + "," + GX + "," + GY + "," + ammount + ",'2019-03-23 14:00:00');";

    dbase.query(sql, (err,result)=>{
        if(err) throw err;
    });
    res.send("this is a reset of the clogging");
});

// add nest to tile turtle_group_id
app.post('/ChangeToNest/:gx/:gy/:Nest',(req,res)=>{
    let reqData = req.params;
    let GX = reqData.gx;
    let GY = reqData.gy;
    let nest = reqData.Nest;
    let sql= "UPDATE `Map_tile` SET `Map_tile_has_nest` = "+nest+" WHERE `Map_tile_x` = "+GX+" AND `Map_tile_y` = "+GY+" ;"


    dbase.query(sql, (err,result)=>{
        if(err) throw err;
    });
    res.send("this is a reset of the clogging");
});

// place in nest group
app.post('/Maketurtle/',(req,res)=>{
    let player_id = req.session.passport.user.userid;
    let reqData = req.params;
    let TGID = player_id;
    

    let sql= "INSERT INTO `Turtles` (Turtle_group_id,Turtle_health, Turtle_lifespan, Turtle_birth_date, Turtle_last_eaten) VALUES " +
            "(" + TGID + "," + 100 + "," + 100 + ",'2019-03-23 14:00:00','2019-03-23 14:00:00');";

    dbase.query(sql, (err,result)=>{
        if(err) throw err;
    });
    res.send("this is a reset of the clogging");
});
// insert nest group
app.post('/InsertGroup/:gx/:gy/:ammount',(req,res)=>{
    let player_id = req.session.passport.user.userid;
    let reqData = req.params;
    let TGID = player_id;
    let GX = reqData.gx;
    let GY = reqData.gy;
    let ammount = reqData.ammount;

    let sql= "INSERT INTO `Turtle_group` (Turtle_group_id,Map_tile_x, Map_tile_y, Turtle_group_amount, Player_id) VALUES " +
            "(" + TGID + "," + GX + "," + GY + "," + ammount + "," + player_id + ");";

    dbase.query(sql, (err,result)=>{
        if(err) throw err;
    });
    res.send("this is a reset of the clogging");
});


// Get Nest Group ID  based on position
app.get('/GetGroupNId/:gx/:gy',(req,res)=>{
    let reqData = req.params;
    let GX = Number(reqData.gx);
    let GY = Number(reqData.gy);

    let sql= "SELECT `Turtle_group_id` FROM `Turtle_group` where  `Map_tile_x` = "+GX+" AND `Map_tile_y` = "+GY+" AND `Turtle_group_id` < 500 ;"
    
    dbase.query(sql, (err,result)=>{
        if (err) throw err;
        res.send(result);
        
    });
});


// take all the turtles from nest
app.post('/TakeTurtles/:GroupS/:groupId',(req,res)=>{
    let reqData = req.params;
    let groups = reqData.GroupS;
    let groupID = reqData.groupId;

    let sql= "UPDATE `Turtles` SET `Turtle_group_id` = "+groups+" WHERE `Turtle_group_id` = "+groupID+"  ;"


    dbase.query(sql, (err,result)=>{
        if(err) throw err;
    });
    res.send("this is a reset of the clogging");
});
// delete row from Nest 
app.post('/DeleteN/:groupId',(req,res)=>{
    let reqData = req.params;
    let groupID = reqData.groupId;

    let sql= "DELETE FROM `Nest_tile` WHERE `Turtle_group_id` = "+groupID+"  ;"


    dbase.query(sql, (err,result)=>{
        if(err) throw err;
    });
    res.send("this is a reset of the clogging");
});

// Delete nest group
app.post('/DeleteG/:groupId',(req,res)=>{
    let reqData = req.params;
    let groupID = reqData.groupId;

    let sql= "DELETE FROM `Turtle_group` WHERE `Turtle_group_id` = "+groupID+"  ;"


    dbase.query(sql, (err,result)=>{
        if(err) throw err;
    });
    res.send("this is a reset of the clogging");
});

// select count ammount of turtles 
app.get('/TurtleC/:groupId',(req,res)=>{
    let reqData = req.params;
    let TurtleG_ID = reqData.groupId;
    
    let sql= "SELECT COUNT(`Turtle_id`) as `countT` FROM `Turtles` where  `Turtle_group_id` = "+TurtleG_ID+" ;"
    
    dbase.query(sql, (err,result)=>{
        if (err) throw err;

        res.send(result);
    });
});

// gets other player's groups
app.get('/otherGroups',(req,res)=>{
    let player_id = req.session.passport.user.userid;

    let sql= "SELECT `Map_tile_x`, `Map_tile_y`  FROM `Turtle_group` where `Turtle_group_id` >= 500 AND Player_id <> "+player_id+";"
    
    dbase.query(sql, (err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});

// get turtles hp and take damage
app.get('/DamageTurtles/:Groupid',(req,res)=>{
    let reqData = req.params;
    let GroupID = Number(reqData.Groupid);
    
    let sql= "SELECT *  FROM `Turtles` where  `Turtle_group_id` = "+GroupID+" ;"
    
    dbase.query(sql, (err,result)=>{
        if (err) throw err; 
        if (result.length > 1 ){
            for (let i=1 ; i<result.length ; i++){
            //update 
                let sql2= "UPDATE `Turtles` SET `Turtle_health` = "+(Number(result[i].Turtle_health)-5) +" WHERE `Turtle_group_id` = "+GroupID+" and `Turtle_id` = "+Number(result[i].Turtle_id)+";" 
                if ((Number(result[i].Turtle_health)-5) <= 0 ){
                    
                    sql2= "DELETE  FROM `Turtles` WHERE `Turtle_group_id` = "+GroupID+" and `Turtle_id` = "+Number(result[i].Turtle_id)+";" 
                }
                dbase.query(sql2, (err2,result2)=>{
                    if (err2) throw err2; 
                });

                let sql3= "SELECT COUNT(Turtle_health) as NTurtles  FROM `Turtles` where  `Turtle_group_id` = "+GroupID+" ;"

                dbase.query(sql3, (err3,result3)=>{
                    if (err3) throw err3;
                        
                    let sql4= "UPDATE `Turtle_group` SET `Turtle_group_amount` = "+(Number(result3[0].NTurtles)) +" WHERE `Turtle_group_id` = "+GroupID+";" 

                    dbase.query(sql4, (err4,result4)=>{
                        if (err4) throw err4;
                            
                    });
                });
            }    
        }else{
            let hp = Number(result[0].Turtle_health)-5;
            console.log(hp + "a test to know the hp when there is only one turtle left") 
            let sql2= "UPDATE `Turtles` SET `Turtle_health` = "+hp+" WHERE `Turtle_group_id` = "+GroupID+" and `Turtle_id` = "+Number(result[0].Turtle_id)+";" 
                if ((Number(result[0].Turtle_health)-5) < 5 ){
                    
                    sql2= "DELETE  FROM `Turtles` WHERE `Turtle_group_id` = "+GroupID+" and `Turtle_id` = "+Number(result[0].Turtle_id)+";" 
                }
                dbase.query(sql2, (err2,result2)=>{
                    if (err2) throw err2; 
                });

                let sql3= "SELECT COUNT(Turtle_health) as NTurtles  FROM `Turtles` where  `Turtle_group_id` = "+GroupID+" ;"

                dbase.query(sql3, (err3,result3)=>{
                    if (err3) throw err3;
                        
                    let sql4= "UPDATE `Turtle_group` SET `Turtle_group_amount` = "+(Number(result3[0].NTurtles)) +" WHERE `Turtle_group_id` = "+GroupID+";" 

                    dbase.query(sql4, (err4,result4)=>{
                        if (err4) throw err4;
                            
                    });
                });

        }
        
    });
});

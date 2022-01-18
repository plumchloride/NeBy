// 静的ファイルのルーティング用
const path = require('path');

// サーバーインスタンス作製
var express = require('express');
var app = express();
var http = require('http').Server(app);
const PORT = process.env.PORT || 3001;

// socket io 読み込み
const io = require("socket.io")(http);

// server listen
http.listen(PORT, function(){
  console.log('server listening. Port:' + PORT);
});


// /にアクセスがあったらindex.htmlを返却
app.get('/' , function(req, res){
  res.sendFile(__dirname + '/index.html'); // html送信
});

// 静的ファイルのルーティング
app.use(express.static(path.join(__dirname, 'public')));

// sqlite
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('database/mes.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
      console.error(err.message);
  }
  else{
    console.log('(sqlite) Connected to the message database.');
  }
});

// db データ取得
const get_data = (id)=>{
  db.serialize(() => {
    db.each(`SELECT * FROM message`, (err, row) => {
        if (err) {
          console.error("(sqlite) " + err.message);
        }else{
          db_data[id].push(row);
        }
    })
  });
}

// dbデータチェック・送信まで
const check_send_data = (time,socket,geo)=>{
  c = time + 100
  if(!db_data[socket.id][db_data[socket.id].length - 1]){
    if(c > 1400){
      console.log("(sqlite) Can not get data. So try again. ["+socket.id+"]");
      get_data(socket.id);
      check_send_data(0,socket,geo);
    }
    console.log("(sqlite) None data. Wait "+String(c)+"ms. ["+socket.id+"]");
    setTimeout(()=>{check_send_data(c,socket,geo)},c);
  }else{
    console.log("(sqlite) Get data.["+socket.id+"]");
    send_data_check(socket,geo);
    db_data[socket.id] = [undefined];
  }
}

// 二つの緯度経度を入力した際にその間の距離を計算して返す
// 参考文献 https://qiita.com/yuba/items/4372944ce0f6a0bf6cb5
const CALC_DIS_KM = (latA,lonA,latB,lonB)=>{
  pi = Math.PI;
  distance_km = 6371 * Math.acos(
    Math.cos(latA/180*pi) * Math.cos((lonB - lonA)/180*pi) * Math.cos(latB/180*pi) +
    Math.sin(latA/180*pi) * Math.sin(latB/180*pi)
  );
  return distance_km;
}

// dbデータが取得者の現在地と近いか確認し，近い投稿のみを送信する
const send_data_check = (socket,geo)=>{
  send_data_text = []
  db_data[socket.id].forEach((element,index) => {
    if(!(index == 0)){
      if(0.5 > CALC_DIS_KM(geo.lat,geo.long,element.lat,element.long)){
        send_data_text.push({"text":element.text,"date":element.date})
      };
    };
  });
  console.log("[send data / db data] " +String(send_data_text.length)+" / "+String(db_data[socket.id].length -1) + " ["+socket.id+"]")
  io.to(socket.id).emit("msg_db_send",send_data_text);
}

// dbデータ保管と接続状況確認用
let db_data = {};



// socket io 通信周り
io.sockets.on('connection',function(socket){
  db_data[socket.id] = [undefined];
  console.log("["+socket.id+"]接続++接続人数："+ Object.keys(db_data).length+"人");

  // 新規投稿取得
  socket.on("mes_send",(msg)=>{
    var now = new Date();
    var time_now = now.getFullYear()+"/"+(now.getMonth()+1)+"/"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
    var query_str = "INSERT INTO message(so_id, text, lat, long, date ) VALUES(?,?,?,?,?)";
    var params = [socket.id ,msg.text,msg.lat,msg.long,time_now];
    db.run(query_str,params,function(err){
      if (err) { //エラーハンドリング
          return console.log("(sqlite) " + err.message);
      }
      // 成功した場合
      console.log("(sqlite)  A row has been inserted into database by ["+socket.id+"]");
    });
    io.sockets.emit("msg_send",{"text":msg.text,"lat":msg.lat,"long":msg.long,"time":time_now})
  })

  socket.on("send_geo",(msg)=>{
    get_data(socket.id); // dbよりデータ取得
    check_send_data(0,socket,msg);
  });


  // 切断処理
  socket.on("disconnect",()=>{
    delete db_data[socket.id];
    console.log("["+socket.id+"]切断--接続人数："+ Object.keys(db_data).length+"人")})
});
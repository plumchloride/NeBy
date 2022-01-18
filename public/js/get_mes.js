// 各投稿の時に起動
socket.on("msg_send",(msg)=>{
  navigator.geolocation.getCurrentPosition(SEP_GEO,ERROR_GEO);
  if(0.5 > CALC_DIS_KM(lat,long,msg.lat,msg.long)){ // 1km以内だった場合TLに投稿
    MAKE_CARD(msg.text.replace(/\n/g, '<br>'),msg.time);
  }else{
    ;
  }
})

// 初回にまとめて読み込んだときに起動
socket.on("msg_db_send",(msg)=>{
  msg.forEach(element => {
    MAKE_CARD(element.text.replace(/\n/g, '<br>'),element.date);
  });
})
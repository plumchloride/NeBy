// 現在地表示非表示切り替え機能
document.getElementById("geo_show_button").addEventListener("click",(e)=>{
  if(geo_mask){
    document.getElementById("now_geo_mask").setAttribute("style","display:none;")
    document.getElementById("now_geo").setAttribute("style","")
    geo_mask = false;
  }else{
    document.getElementById("now_geo_mask").setAttribute("style","")
    document.getElementById("now_geo").setAttribute("style","display:none;")
    geo_mask = true;
  }

});

// フォーム送信用
const NEW_MES_SEND = () =>{
  navigator.geolocation.getCurrentPosition(SEP_GEO,ERROR_GEO); // 再度緯度経度の取得
  var text = document.getElementById("new_mes_text");
  socket.emit("mes_send",{"text":text.value,"lat":lat,"long":long})
  text.value = "";
  return false;
}

// メッセージカード作成
const MAKE_CARD = (text,time) => {
  div_element = document.createElement('div');
  div_element.setAttribute("class","text_card");
  div_element.innerHTML = "<div class='text_card_text'>"+text+"</div><div class='text_card_time'>"+time+"</div>";
  document.getElementById("text_card_area").insertAdjacentElement("afterbegin",div_element);
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

// 画面読み込み完了の際+300ms秒後にサーバー再度データベースを取得
setTimeout(()=>{
  navigator.geolocation.getCurrentPosition(SEP_GEO,ERROR_GEO); // 再度緯度経度の取得
  socket.emit("send_geo",{"lat":lat,"long":long})
},300);

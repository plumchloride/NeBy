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

// 現在地の設定を00に切り替え
let private = false
const set_zero = ()=>{
  private = true;
  lat = 0;
  long = 0;
  SET_geo(lat,long)
  if(geo_mask){
    // 非表示なら外す
    document.getElementById("now_geo_mask").setAttribute("style","display:none;")
    document.getElementById("now_geo").setAttribute("style","")
    geo_mask = false;
  }
  document.getElementById("geozero").innerText = "緯度経度を現在地に設定する"
  document.getElementById("geozero").setAttribute("onclick","set_here();")
}
// 現在地の設定を現在地に設定
const set_here = ()=>{
  private = false;
  navigator.geolocation.getCurrentPosition(SEP_GEO,ERROR_GEO);
  if(!geo_mask){
    // 非表示なら外す
    document.getElementById("now_geo_mask").setAttribute("style","")
    document.getElementById("now_geo").setAttribute("style","display:none;")
    geo_mask = true;
  }
  document.getElementById("geozero").innerText = "緯度0, 経度0 に設定する"
  document.getElementById("geozero").setAttribute("onclick","set_zero();")
}

// フォーム送信用
const NEW_MES_SEND = () =>{
  if(!private){
    navigator.geolocation.getCurrentPosition(SEP_GEO,ERROR_GEO); // 再度緯度経度の取得
  }
  var text = document.getElementById("new_mes_text");
  send_json = JSON.stringify({"text":text.value,"lat":lat,"long":long})
  xhr = new XMLHttpRequest;
  xhr.onload = function(){
    var res = xhr.responseText;
    console.log(res);
  };
  xhr.onerror = function(){
    alert("バグです。サーバーが起動していません。\n Error1: Server is shutting down.");
  }
  xhr.open('POST', "", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(send_json);

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

// 利用規約同意
const set_info_true = ()=>{
  (()=>{navigator.geolocation.getCurrentPosition(SEP_GEO,ERROR_GEO);})();
  localStorage.setItem('neby-kiyaku', true);
}

// 同意してある場合利用規約をスキップ
if(localStorage.getItem('neby-kiyaku')){
  document.getElementById("info").classList.add("non-visi");
  (()=>{navigator.geolocation.getCurrentPosition(SEP_GEO,ERROR_GEO);})();
}
// // 二つの緯度経度を入力した際にその間の距離を計算して返す
// // 参考文献 https://qiita.com/yuba/items/4372944ce0f6a0bf6cb5
// const CALC_DIS_KM = (latA,lonA,latB,lonB)=>{
//   pi = Math.PI;
//   distance_km = 6371 * Math.acos(
//     Math.cos(latA/180*pi) * Math.cos((lonB - lonA)/180*pi) * Math.cos(latB/180*pi) +
//     Math.sin(latA/180*pi) * Math.sin(latB/180*pi)
//   );
//   return distance_km;
// }

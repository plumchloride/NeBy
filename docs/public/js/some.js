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
  if(!private){
    set_tl_get();
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
    // 非表示ならつける
    document.getElementById("now_geo_mask").setAttribute("style","")
    document.getElementById("now_geo").setAttribute("style","display:none;")
    geo_mask = true;
  }
  document.getElementById("geozero").innerText = "緯度0, 経度0 に設定する"
  document.getElementById("geozero").setAttribute("onclick","set_zero();")
  set_tl_get();
}

// フォーム送信用
const NEW_MES_SEND = () =>{
  now_posi = ""
  if(!private){
    navigator.geolocation.getCurrentPosition(SEP_GEO,ERROR_GEO); // 再度緯度経度の取得
    now_posi = "現在地"
  }else{
    now_posi = "00地点"
  }
  var text = document.getElementById("new_mes_text");
  if(confirm(`このサイトでは現在地付きで投稿されます。以下の内容にご注意下さい\n ・${now_posi}が共有されます\n ・誹謗中傷を含んでいない\n投稿内容：\n${text.value}`)){
    send_json = JSON.stringify({"text":text.value,"lat":lat,"long":long})
    xhr = new XMLHttpRequest;
    xhr.onload = function(){
      var res = xhr.responseText;
      // console.log(res);
      GET_MES();
    };
    xhr.onerror = function(){
      alert("バグです。サーバーが起動していません。\n Error1: Server is shutting down.");
    }
    xhr.open('POST', "https://e5mapekaj3imhd56ii4xvlwx4y0iobmr.lambda-url.ap-northeast-1.on.aws/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(send_json);

    text.value = "";
  };
  return false;
}

// メッセージカード作成
const MAKE_CARD = (elm) => {
  div_element = document.createElement('div');
  div_element.setAttribute("class","text_card");
  let dateTime = new Date(elm["text_id"] * 1000)
  let time_stamp = dateTime.toLocaleDateString() +" "+ dateTime.toLocaleTimeString()
  div_element.innerHTML = `<div class='text_card_text'>${elm["text"]}</div><div class='text_card_time'>${time_stamp}</div>`
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

const set_tl_get = ()=>{
  if(geo_mask){
    document.getElementById("now_mode").innerHTML = `緯度：非表示 経度:非表示 所得時刻:${search_time}`
  }else{
    document.getElementById("now_mode").innerHTML = `緯度：${search_lat} 経度:${search_long} 所得時刻:${search_time}`
  }
}
let search_lat = "==";
let search_long = "==";
let search_time = "==";
const GET_MES = ()=>{
  if(!private){
    navigator.geolocation.getCurrentPosition(SEP_GEO,ERROR_GEO); // 再度緯度経度の取得
  }
  send_json = JSON.stringify({"lat":lat,"long":long})
  xhr = new XMLHttpRequest;
  xhr.onload = function(){
    let res = xhr.responseText;
    SET_MES(JSON.parse(res));
  };
  xhr.onerror = function(){
    alert("バグです。サーバーが起動していません。\n Error1: Server is shutting down.");
  }
  xhr.open('POST', "https://viq5lu4m4fudegv5xmub5r4k6y0jeeus.lambda-url.ap-northeast-1.on.aws/", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(send_json);

  let now = new Date();
  search_time = now.getFullYear() + "/" + Number(now.getMonth())+1 + "/" + now.getDate() +" "+ now.getHours() + ":" + String("0"+now.getMinutes()).slice(-2) + ":" + String("0"+now.getSeconds()).slice(-2);
  search_long = long;
  search_lat = lat;
  set_tl_get();
}

const SET_MES = (response_dic)=>{
  document.getElementById("text_card_area").innerHTML = ""
  response_dic.sort((a, b) => a.time_stamp - b.time_stamp);
  response_dic.forEach(element => {
    console.log(element)
    MAKE_CARD(element)
  });
}
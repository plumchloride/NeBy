// 現在地取得用

GET_GEO = false;
if( navigator.geolocation ){
  // 現在位置を取得できる場合の処理
  ;
  } else {
  // 現在位置を取得できない場合の処理
  alert("現在位置情報を取得できません．")

}

let lat = 0;
let long = 0;


// 位置情報を分割する
const SEP_GEO = (position) => {
  GET_GEO = true;
  lat = position.coords.latitude;
  long = position.coords.longitude;
  // var geo_text = "緯度:" + position.coords.latitude + "\n";
  // geo_text += "経度:" + position.coords.longitude + "\n";
  // geo_text += "高度:" + position.coords.altitude + "\n";
  // geo_text += "位置精度:" + position.coords.accuracy + "\n";
  // geo_text += "高度精度:" + position.coords.altitudeAccuracy  + "\n";
  // geo_text += "移動方向:" + position.coords.heading + "\n";
  // geo_text += "速度:" + position.coords.speed + "\n";

  // var date = new Date(position.timestamp);

  // geo_text += "取得時刻:" + date.toLocaleString() + "\n";

  // console.log(geo_text);
  
  SET_geo(lat,long);
}

// 緯度経度からマップを開くaタグ編集
const SET_geo = (lat,long) =>{
  document.getElementById("now_geo").innerHTML = "緯度：" + lat + "<br> 経度：" + long;
  document.getElementById("now_geo_a").setAttribute("href","https://www.google.com/maps?q="+lat+","+long)
  document.getElementById("now_geo_a").innerText = "→Google map に飛ぶ"
}

// 位置情報取得時にエラー
ERROR_GEO = ()=>{
  alert("現在位置情報を取得できません．")
}
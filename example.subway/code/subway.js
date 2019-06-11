module.exports.function = function subway (station, line) {
  const config = require('config');
  const fail = require('fail');
  const http = require('http');
  const console = require('console');
  const baseURL = config.get("baseUrl");
  
  let response = null;
  let line = String(line)

  url = baseURL + encodeURI(String(station));
  
  response = http.getUrl(url, {format:"json", cacheTime:0, returnHeaders:true});
  
  objects = [];
  
  subwayinfo = {'1':'1001', '2':'1002','3':'1003','4':'1004', '5':'1005',
                '6':'1006', '7':'1007', '8':'1008','9':'1009','신분당':'1077',
                '분당':'1075','경의중앙선':'1063','경춘선':'1067','공항철도':'1065','수인':'1071',}
  
  let line_color = subwayinfo[line]  // 사용자가 찾고자 하는 호선

  for (var index in response.parsed.realtimeArrivalList){
    let each_train = response.parsed.realtimeArrivalList[index] // 각 열차 정보
    let each_subwayID = each_train.subwayId  // 각 열차가 무슨 라인인지
    console.log(each_subwayID)
    
    if (each_subwayID == line_color){  // 들어온 열차정보가, 원하는 열차 라인과 같을 때만
      let each_time = each_train.arvlMsg2  // 시간 정보 넣어
      objects.push(each_time)
      }
    }  
 
  console.log(objects)
  
  return {
    station : station, 
    line : line,
    result : objects
}
}
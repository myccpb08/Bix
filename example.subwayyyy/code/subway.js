module.exports.function = function subway (station, line) {
  require('secret');
  const config = require('config');
  const fail = require('fail');
  const http = require('http');
  const console = require('console');
  const baseURL = config.get("baseUrl");
  
  
  
  let response = null;
  let line = String(line)
  const key = secret.get('key');
  url = baseURL + key + '/json/realtimeStationArrival/0/20/' + encodeURI(String(station));
  console.log(url)
  
  response = http.getUrl(url, {format:"json", cacheTime:0, returnHeaders:true});
  
  uptime = [];
  downtime = [];
  
  subwayinfo = {'1호선':'1001', '2호선':'1002','3호선':'1003','4호선':'1004', '5호선':'1005',
                '6호선':'1006', '7호선':'1007', '8호선':'1008','9호선':'1009','신분당선':'1077',
                '분당선':'1075','경의중앙선':'1063','경춘선':'1067','공항철도':'1065','수인선':'1071',}
  
  let line_color = subwayinfo[line]  // 사용자가 찾고자 하는 호선

  for (var index in response.parsed.realtimeArrivalList){
    let each_train = response.parsed.realtimeArrivalList[index] // 각 열차 정보
    let each_subwayID = each_train.subwayId  // 각 열차가 무슨 라인인지
    
    if (each_subwayID == line_color){  // 들어온 열차정보가, 원하는 열차 라인과 같을 때만
      let each_time = each_train.arvlMsg2  // 시간 정보 넣어
      
      if (each_train.updnLine == '상행' || each_train.updnLine == '외선' ){
        if (uptime.length == 0){
          uptime.push(each_train.trainLineNm)
          uptime.push('내리는문: ' + each_train.subwayHeading)
        }
        uptime.push(each_time)
        
      }
      else {
        if (downtime.length == 0){
          downtime.push(each_train.trainLineNm)
          downtime.push('내리는문: ' + each_train.subwayHeading)
        }
        downtime.push(each_time)
      } 
      }
    }  
 
  return {
    station : station, 
    line : line,
    상행 : uptime,
    하행 : downtime,
}
}
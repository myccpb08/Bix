const DATA = require("./Data");
const STATION_DATA = DATA.STATION_DATA

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
  
  // 이미지 링크
  let stationData = STATION_DATA.find(obj => obj.line === line);
  if (stationData) {
    line_photo_url = stationData.imgURL;
  }
  
  // 역공백없애기
  station = String(station).replace(/(\s*)/g,"");
  check = station.length-1
  if (station[check] == '역'){
    station = station.slice(0,check)
  }
  
  full_station_dict = {
  "쌍용":"쌍용(나사렛대)", 
  "나사렛대":"쌍용(나사렛대)",
  "총신대입구":"총신대입구(이수)",
  "이수":"총신대입구(이수)",
  "올림픽공원":"올림픽공원(한국체대)",
  "한국체대":"올림픽공원(한국체대)",
  "군자":"군자(능동)",
  "능동":"군자(능동)",
  "천호":"천호(풍납토성)",
  "풍납토성":"천호(풍납토성)",
  "굽은다리":"굽은다리(강동구민회관앞)",
  "강동구민회관앞":"굽은다리(강동구민회관앞)",
  "오목교":"오목교(목동운동장앞)",
  "목동운동장앞":"오목교(목동운동장앞)",
  "신정":"신정(은행정)",
  "은행정":"신정(은행정)",
  "광나루":"광나루(장신대)",
  "장신대":"광나루(장신대)",
  "아차산":"아차산(어린이대공원후문)",
  "어린이대공원후문":"아차산(어린이대공원후문)",
  "월드컵경기장":"월드컵경기장(성산)",
  "성산":"월드컵경기장(성산)",
  "대흥":"대흥(서강대앞)",
  "서강대앞":"대흥(서강대앞)",
  "증산":"증산(명지대앞)",
  "명지대앞":"증산(명지대앞)",
  "월곡":"월곡(동덕여대)",
  "동덕여대":"월곡(동덕여대)",
  "새절":"새절(신사)",
  "신사":"새절(신사)",
  "상월곡":"상월곡(한국과학기술연구원)",
  "한국과학기술연구원":"상월곡(한국과학기술연구원)",
  "화랑대":"화랑대(서울여대입구)",
  "서울여대입구":"화랑대(서울여대입구)",
  "응암순환":"응암순환(상선)",
  "상선":"응암순환(상선)",
  "안암":"안암(고대병원앞)",
  "고대병원앞":"안암(고대병원앞)",
  "공릉":"공릉(서울산업대입구)",
  "서울산업대입구":"공릉(서울산업대입구)",
  "총신대입구":"총신대입구(이수)",
  "이수":"총신대입구(이수)",
  "숭실대입구":"숭실대입구(살피재)",
  "살피재":"숭실대입구(살피재)",
  "어린이대공원":"어린이대공원(세종대)",
  "세종대":"어린이대공원(세종대)",
  "상도":"상도(중앙대앞)",
  "중앙대앞":"상도(중앙대앞)",
  "군자":"군자(능동)",
  "능동":"군자(능동)",
  "남한산성입구":"남한산성입구(성남법원, 검찰청)",
  "성남법원":"남한산성입구(성남법원, 검찰청)",
  "검찰청":"남한산성입구(성남법원, 검찰청)",
  "몽촌토성":"몽촌토성(평화의문)",
  "평화의문":"몽촌토성(평화의문)",
  "천호":"천호(풍납토성)",
  "풍납토성":"천호(풍납토성)",
  "신촌":"신촌(경의.중앙선)"
  }
  //신촌 예외처리
  if (station == "신촌" && line == "2호선"){
    station = station
  }
  else if(station in full_station_dict) {
    station = full_station_dict[station]
  }
  
  //서울시 공공데이터 api 주소
  url = baseURL + key + '/json/realtimeStationArrival/0/20/' + encodeURI(String(station));
  response = http.getUrl(url, {format:"json", cacheTime:0, returnHeaders:true});
  
  //상행선, 하행선 정보 생성
  uptime = [];
  downtime = [];
  
  //호선 이름 변환 dict
  subwayinfo = {'1호선':'1001', '2호선':'1002','3호선':'1003','4호선':'1004', '5호선':'1005',
                '6호선':'1006', '7호선':'1007', '8호선':'1008','9호선':'1009','신분당선':'1077',
                '분당선':'1075','경의중앙선':'1063','경춘선':'1067','공항철도':'1065','수인선':'1071',}
  
  subwayinfo2 = {'1001':'1호선', '1002':'2호선','1003':'3호선','1004':'4호선','1005':'5호선',
                 '1006':'6호선', '1007':'7호선','1008':'8호선','1009':'9호선','1077':'신분당선',
                 '1075':'분당선', '1063':'경의중앙선','1067':'경춘선','1065':'공항철도','1071':'수인선'}
  
 
  let line_color = subwayinfo[line]  // 사용자가 찾고자 하는 호선의 id
  
  for (var index in response.parsed.realtimeArrivalList){
    let each_train = response.parsed.realtimeArrivalList[index] // 각 열차 정보

    // 첫번째 열차정보만으로 환승호선 알 수 있다 >> 환승호선이 존재하면
    if (index==0){
      transline = []
      var idx = 100
      temp = response.parsed.realtimeArrivalList[0].subwayList // 환승정보 있는지 없는지
      if (temp.length > 4){     
        howmany = (temp.length + 1)/5  // 환승호선 수
        for (var trans = 0 ; trans < howmany ; trans++){  // 환승호선 수만큼 반복문 돌리기
          trans_subway = temp.slice(5*trans, 5*(trans+1)-1)
          transline.push(subwayinfo2[trans_subway])  // 환승라인을 리스트에 담는다
          
          // 지금 보고 있는 호선은 보여 주지 않기 위해
          if (trans_subway == line_color){
            idx = trans
          }
        }
       }
    }
    
    let each_subwayID = each_train.subwayId  // 각 열차가 무슨 라인인지
    
    if (each_subwayID == line_color){  // 들어온 열차정보가, 원하는 열차 라인과 같을 때만
      let each_time = each_train.arvlMsg2  // 시간 정보 넣어
      
      // 도착 정보 뒤에 불필요한 정보 삭제
      let num = [0,1,2,3,4,5,6,7,8,9]
      for (var brace_idx = 0 ; brace_idx < each_time.length; brace_idx ++){
        if (each_time[brace_idx] === "("  && each_time[brace_idx +1] in num ){
              each_time = each_time.slice(0,brace_idx) + "도착";
              break
            }
      }
      
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
  console.log(idx)
  result = {
    station : station, 
    line : line,
    photo_url : line_photo_url,
    상행 : uptime,
    하행 : downtime,
    환승 : transline,
    ox : idx
    
}
  console.log(result)
  return result
}

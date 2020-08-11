const Discord = require('discord.js');  // discord.js를 가져옴
const schedule = require('node-schedule');  // node-schedule을 가져옴
const axios = require('axios');
const client = new Discord.Client();    // 봇 client 생성

// .env 사용
const dotenv = require('dotenv');
dotenv.config();

let lat, lon;
let location;
let job;

// kakao api 키
const kakaoAPIKey = "19cf4c86e1fe80f1a2cc0bf7468295f3";
const weatherAPIKey = "fee325a9153b5176b2610a2096004088";

// 로그인 되었을때 -> console.log() 출력
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const everyMin = "* * * * *";    // every min
const everySecond = "* * * * * *";    // every second
const every8AM = "* * 8 * * *"  // every 8AM

// 메세지가 들어왔을떄
client.on('message', async msg => {
  //메세지 들어옴
  console.log("msg :", msg.content.split(' '));
  // 메세지가 'ping'
  if (msg.content === 'ping') {
      // Pong!이라고 매초마다 답변
      schedule.scheduleJob(every8AM, function(){
          msg.reply('Pong!');
        })
  }

  // 위치 설정 명령어
  else if(msg.content.split(' ')[0] === "위치"){
    // 위치 설정
    // 위치 서그내로23-9
    location = msg.content.split(' ')[1];
    await getCoord(location);
    msg.reply(`위치가 ${location}으로 설정되었습니다.`);
  }

  // 날씨 호출 명령어
  else if(msg.content === '날씨'){
    if(location){
      let weatherData = await getWeather(lat, lon);

      msg.reply(location +"의 날씨는 " + String(weatherData.weather[0].main) + " 입니다.");
      msg.reply(location +"의 기온은 " + String(Math.floor(weatherData.main.temp - 273)) + "도 입니다.");
    }
    else{
      // location === null
      msg.reply("위치정보를 먼저 설정해주세요.");
    }
  }

  // 알람 시작
  else if(msg.content === '시작'){
    if(location){
      msg.reply("알람 서비스를 시작합니다.");
      job = schedule.scheduleJob(every8AM, async function(){
        let weatherData = await getWeather(lat, lon);

        msg.reply(location +"의 날씨는 " + String(weatherData.weather[0].main) + " 입니다.");
        msg.reply(location +"의 기온은 " + String(Math.floor(weatherData.main.temp - 273)) + "도 입니다.");
      })
    }
    else{
      // location === null
      msg.reply("위치정보를 먼저 설정해주세요.");
     
    }
  }
  
});

// 좌표 얻는 함수
function getCoord(location){
  // uri로 쓸수있게 인코딩
  const locationURI = encodeURI(location);

  return axios.get(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${locationURI}`,
    {headers: {
        Authorization: `KakaoAK ${kakaoAPIKey}`
      }
    }
  )
  .then((response) => {
      // console.log(response.data.documents[0]);
      lon = response.data.documents[0].address.x;
      lat = response.data.documents[0].address.y;
    },
    (error) => {
      console.log(error);
    }
  );
}

// 날씨 얻는 함수
function getWeather(lat, lon){
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`;

  return axios.get(url).then(function(response){
      // console.log(response.data);
      return response.data;
  })
}

async function printWeather(){
  let weatherData = await getWeather(latitude, longitude);
  // console.log(weatherData);

  console.log(weatherData.name +"의 날씨는 " + String(weatherData.weather[0].main) + " 입니다.");
  console.log(weatherData.name +"의 기온은 " + String(Math.floor(weatherData.main.temp - 273)) + " 입니다.");
}

// 로그인 파트
client.login(process.env.token);

async function print(){
  await getCoord("서그내로23-9");
  let weatherData = await getWeather(lat, lon);
  console.log(weatherData.name +"의 날씨는 " + String(weatherData.weather[0].main) + " 입니다.");
  console.log(weatherData.name +"의 기온은 " + String(Math.floor(weatherData.main.temp - 273)) + " 입니다.");
}

// print();
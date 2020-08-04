const Discord = require('discord.js');  // discord.js를 가져옴
const schedule = require('node-schedule');  // node-schedule을 가져옴
const client = new Discord.Client();    // 봇 client 생성

// .env 사용
const dotenv = require('dotenv');
dotenv.config();

// 로그인 되었을때 -> console.log() 출력
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const everySecond = "* * * * * *";    // every second
const every8AM = "* * 8 * * *"  // every 8AM

// 메세지가 들어왔을떄
client.on('message', msg => {
    // 메세지가 'ping'
  if (msg.content === 'ping') {
      // Pong!이라고 매초마다 답변
      schedule.scheduleJob(every8AM, function(){
          msg.reply('Pong!');
        })
  }
});

// 로그인 파트
client.login(process.env.token);
import puppeteer from "puppeteer";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import schedule from 'node-schedule'

const imageUrls = [
    //'https://t.mwm.moe/mp', //横图
    '/home/gallery',
    // 添加更多的 URL或本地文件夹...
];

// 定时发送时间，采用 Cron 表达式
const time = '0 30 7 * * ?'

/* 各位代表的意思 *-代表任意值 ？-不指定值，仅日期和星期域支持该字符。 （想了解更多，请自行搜索Cron表达式学习）
    *  *  *  *  *  *
    ┬  ┬  ┬  ┬  ┬  ┬
    │  │  │  │  │  |
    │  │  │  │  │  └ 星期几，取值：0 - 7，其中 0 和 7 都表示是周日
    │  │  │  │  └─── 月份，取值：1 - 12
    │  │  │  └────── 日期，取值：1 - 31
    │  │  └───────── 时，取值：0 - 23
    │  └──────────── 分，取值：0 - 59
    └─────────────── 秒，取值：0 - 59（可选）
*/

// 指定定时发送的群号
const groupList = ['123456','123456']
// const groupList = ["774780354"];
/**
 * 开启定时推送的群号，填写格式如下
 * 单个群号填写如下：
 * ["374900636"];
 * 多个个群号填写如下：
 * ["374900636","374900636"];
 */

// 是否开启定时推送
const isAutoPush = false

autoTask()


// TextMsg可自行更改，其他照旧即可。
export class TextMsg extends plugin {
    constructor() {
        super({
            name: '今日运势', // 插件名称
            dsc: '今日运势',  // 插件描述            
            event: 'message',  // 更多监听事件请参考下方的 Events
            priority: 6,   // 插件优先度，数字越小优先度越高
            rule: [
                {
                    reg: '^#?今日运势$',   // 正则表达式,有关正则表达式请自行百度
                    fnc: '今日运势'  // 执行方法
                }
            ]
        })

    }
    async 今日运势(e) {
      e.reply("正在为您渲染，请稍后" , true, { recallMsg: 5 });
        push今日运势(e)
      }
}

/**
 * 推送日历
 * @param e oicq传递的事件参数e
 */


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function push今日运势(e, isAuto = 0) {
  

  // 随机选择一个URL或本地文件夹
  let imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
  
  if (imageUrl.startsWith('http')) {
      // 如果选择的是URL
      logger.info(imageUrl);
  } else {
      // 如果选择的是本地文件夹
      fs.readdir(imageUrl, async (err, files) => {
          if (err) throw err;
  
          let imageFiles = files.filter(file => ['.jpeg', '.jpg', '.gif', '.png', '.webp'].includes(path.extname(file).toLowerCase()));
  
          if (imageFiles.length > 0) {
              // 如果文件夹中有图片
              imageUrl = path.join(imageUrl, imageFiles[Math.floor(Math.random() * imageFiles.length)]);
  
              // 读取图片文件并转换为Base64编码
              fs.readFile(imageUrl, (err, data) => {
                  if (err) throw err;
                  let base64Image = Buffer.from(data).toString('base64');
                  console.log(base64Image);
              });
          } else {
              // 如果文件夹中没有图片，从所有子文件夹中随机选择一个
              let subfolders = files.filter(file => fs.statSync(path.join(imageUrl, file)).isDirectory());
              let subfolderPath = path.join(imageUrl, subfolders[Math.floor(Math.random() * subfolders.length)]);
  
              // 在子文件夹中随机选择一张图片
              fs.readdir(subfolderPath, (err, subfolderFiles) => {
                  if (err) throw err;
  
                  let subfolderImageFiles = subfolderFiles.filter(file => ['.jpeg', '.jpg', '.gif', '.png', '.webp'].includes(path.extname(file).toLowerCase()));
  
                  if (subfolderImageFiles.length > 0) {
                      imageUrl = path.join(subfolderPath, subfolderImageFiles[Math.floor(Math.random() * subfolderImageFiles.length)]);
                      logger.info(imageUrl)
                      // 读取图片文件并转换为Base64编码
                      fs.readFile(imageUrl, (err, data) => {
                          if (err) throw err;
                          let base64Image = Buffer.from(data).toString('base64');
                          imageUrl = 'data:image/jpeg;base64,' + base64Image;
                      });
                  }
              });
          }
      });
  }


      
    // 获取 JSON 文件的绝对路径
    const filePath = path.resolve(__dirname, `../../resources/jrys/jrys.json`);
    // 获取文件路径的目录部分
    const dirPath = path.dirname(filePath);
    logger.info(filePath); 
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    let data;
    if (fs.existsSync(filePath)) {
      try {
        // 尝试读取和解析 JSON 文件
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (error) {
        // 如果出现错误，删除文件以便重新下载
        fs.unlinkSync(filePath);
      }
    }
    if (!data) {
      await downloadFile(`https://raw.githubusercontent.com/logier/emojihub/main/jrys/jrys.json`, filePath);
      // 重新读取 JSON 文件
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    // 随机选择一个内容
    const item = data[Math.floor(Math.random() * data.length)];
    logger.info(item)
    const cgColor = 'rgba(255, 255, 255, 0.6)';
    const shadowc = '0px 0px 15px rgba(0, 0, 0, 0.3)';
    const lightcg = 'brightness(100%)';
    
    let browser;
    try {
      browser = await puppeteer.launch({headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
    
      let Html = `
      <html style="background: ${cgColor}">
      <div class="fortune" style="width: 35%; height: 65rem; float: left; text-align: center; background: ${cgColor};">
        <p>你的今日运势为</p>
        <h2>${item.fortuneSummary}</h2>
        <p>${item.luckyStar}</p>
        <div class="content" style="margin: 0 auto; padding: 12px 12px; height: 49rem; max-width: 980px; max-height: 1024px; background: ${cgColor}; border-radius: 15px; backdrop-filter: blur(3px); box-shadow: ${shadowc}; writing-mode: vertical-rl; text-orientation: mixed;">
          <p>${item.signText}</p>
          <p>${item.unsignText}</p>
        </div>
        <p>仅供娱乐| 相信科学，请勿迷信 |仅供娱乐</p>
      </div>
      <div class="image" style="height:65rem; width: 65%; float: right; box-shadow: ${shadowc}; text-align: center;">
        <img src=${imageUrl} style="height: 100%; filter: ${lightcg}; overflow: hidden; display: inline-block; vertical-align: middle; margin: 0; padding: 0;"/>
      </div>
    </html>
    
      `
    
    
    
      await page.setContent(Html)
    
      const base64 = await page.screenshot({ encoding: "base64", fullPage: true })
    
      if (isAuto) {
        e.sendMsg(segment.image(`base64://${base64}`))
      } else {
        e.reply(segment.image(`base64://${base64}`))
      }
    
    } catch (error) {
      console.error(error);
      e.reply('抱歉，生成图片时出现了错误。');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
    
    return true;
    
  }



  function autoTask() {
    if (isAutoPush) {
      schedule.scheduleJob(time, () => {
        logger.info('[今日运势]：开始自动推送...')
        for (let i = 0; i < groupList.length; i++) {
          let group = Bot.pickGroup(groupList[i])
          push今日运势(group, 1)
          common.sleep(1000)
        }
      })
    }
  }
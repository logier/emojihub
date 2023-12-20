import plugin from '../../lib/plugins/plugin.js'
import common from '../../lib/common/common.js'
import schedule from 'node-schedule'
import { segment } from 'oicq'
import fs from 'fs';
import path from 'path';

// 定时发送时间，采用 Cron 表达式，当前默认为小时推送一次
const time = '0 /30 * * * ? '

// 指定定时发送的群号
const groupList = ['774780354']

// 是否开启定时推送，默认为 false
const isAutoPush = false

autoTask()

export class example extends plugin {
  constructor() {
    super({
      name: '定时发图',
      dsc: '定时发图',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^#定时发图$',
          fnc: '自定义'
        }
      ]
    })
  }

  async 自定义(e) {
    push自定义(e)
  }
}

/**
 * 推送
 * @param e oicq传递的事件参数e
 */


async function push自定义(e, isAuto = 0) {
  const dir = '/home/gallery'; // 改成你的文件夹路径
  const excludeDirs = ['不想要的文件夹1', '不想要的文件夹2'];  // 你想要排除的文件夹
  const fileTypeRegex = /\.(jpg|jpeg|png|gif|webp)$/;
  let files = [];

  // 获取文件夹及其子文件夹下的所有文件
  (function getFiles(currentDir) {
      fs.readdirSync(currentDir).forEach(file => {
          const filePath = path.join(currentDir, file);
          const stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
              if (!excludeDirs.includes(file)) {
                  getFiles(filePath);
              }
          } else if (fileTypeRegex.test(filePath)) {
              files.push(filePath);
          }
      });
  })(dir);

  // 从文件列表中随机选择一个文件
  const picture = files[Math.floor(Math.random() * files.length)];

  // 获取文件夹名和文件名
  const folderName = path.dirname(picture).split(path.sep).pop();
  const pictureNameWithoutExt = path.basename(picture, path.extname(picture));

  // 构造消息
  let maxLabelLength = Math.max('分类'.length, 'Pid'.length);
  let fenlei = `分类${' '.repeat(maxLabelLength - '分类'.length)}：${folderName}\nPid${' '.repeat(maxLabelLength - 'Pid'.length)} ：${pictureNameWithoutExt}`;


  if (isAuto) {
    e.sendMsg([fenlei, segment.image(picture)])
  } else {
    e.reply([fenlei, segment.image(picture)])
  }
}


/**
 * 定时任务
 */
function autoTask() {
  if (isAutoPush) {
    schedule.scheduleJob(time, () => {
      logger.info('[定时发图]：开始自动推送...')
      for (let i = 0; i < groupList.length; i++) {
        let group = Bot.pickGroup(groupList[i])
        push自定义(group, 1)
        common.sleep(1000)
      }
    })
  }
}

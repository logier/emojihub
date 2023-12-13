import fs from 'fs';
import path from 'path';
import schedule from 'node-schedule'

// 定时发送时间，采用 Cron 表达式，当前默认为每小时推送一次
const time = '0 0 */1 * * ?'

// 指定定时发送的群号
const groupList = ['123456']

// 是否开启定时推送，默认为 false
const isAutoPush = false




export class TextMsg extends plugin {
    constructor() {
        super({
            name: '测试插件', 
            dsc: '这是一个基础的插件示例',            
            event: 'message',  
            priority: 6,   
            rule: [
                {
                    reg: '^#?emojihub|表情包仓库|表情包$',   
                    fnc: 'emojihub'  
                },
                {
                    reg: '^#?capoo|猫猫虫|咖波$',   
                    fnc: 'capoo'  
                },
                {
                    reg: '^#?狗妈|nana|神乐七奈$',   
                    fnc: '狗妈'  
                },                {
                    reg: '^#?黑白|黑白表情包$',   
                    fnc: '黑白'  
                },                {
                    reg: '^#?龙图|long|龙$',   
                    fnc: '龙图'  
                },                {
                    reg: '^#?柴郡|chaiq$',   
                    fnc: '柴郡'  
                },
                {
                    reg: '^#?小黑子|坤图|坤坤|cxk$',   
                    fnc: '小黑子'  
                },
                {
                    reg: '^#?相册|图库|画廊$',   
                    fnc: '自定义'  
                }
                
            ],
            
        })
        this.autoTask();

    }

    

    

    async 自定义(e, isAuto = 0) {
        const dir = '/path/yo/your/gallery/'; // 改成你的文件夹路径
        const excludeDirs = ['xxxxx', 'xxxxx'];  // 你想要排除的文件夹
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
        const file = files[Math.floor(Math.random() * files.length)];
    
        // 获取文件夹名和文件名
        const folderName = path.dirname(file).split(path.sep).pop();
        const fileNameWithoutExt = path.basename(file, path.extname(file));
    
        // 构造消息
        const message = `分类：${folderName}\nPid：${fileNameWithoutExt}`;
    
        e.reply([`分类：${folderName}\nPid：${fileNameWithoutExt}`, segment.image(file)]);
    
        return true;
    }
    

        /**
     * 定时任务
     */
        autoTask() {
            if (isAutoPush) {
                schedule.scheduleJob(time, () => {
                    logger.info('[相册]：开始自动推送...');
                    for (let i = 0; i < groupList.length; i++) {
                        let group = Bot.pickGroup(groupList[i]);
                        自定义(group, 1); // 可以把这里的自定义改为emojihub、capoo等等
                        common.sleep(1000);
                    }
                });
            }
        }
    
    

    
    async emojihub(e) {
        const dir = './resources/emojihub'; //推荐吧emojihub下载，然后放到resources文件夹内
        const excludeDirs = ['long-emoji', 'long-emoji2'];  // 你想要排除的文件夹
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
        const file = files[Math.floor(Math.random() * files.length)];
    
        e.reply([segment.image(file)]);
    
        return true;
    }
  
    

    
    async capoo(e) {
        const dir = './resources/emojihub/capoo-emoji/';
        const baseUrl = 'https://gitee.com/logier/emojihub/raw/main/capoo-emoji/capoo';  // 基础URL
        const max = 456;  // 图片数量
        let filePath;
    
        if (fs.existsSync(dir)) {
            // 如果文件夹存在，获取文件夹下的所有文件
            let files = fs.readdirSync(dir);
            // 从文件列表中随机选择一个文件
            const file = files[Math.floor(Math.random() * files.length)];
            // 构造文件的完整路径
            filePath = path.join(dir, file);
        } else {
            // 如果文件夹不存在，构造URL列表
            let urls = [];
            for (let i = 1; i <= max; i++) {
                urls.push(`${baseUrl}${i}.gif`);
            }
            // 从URL列表中随机选择一个URL
            filePath = urls[Math.floor(Math.random() * urls.length)];
        }

    
        e.reply([segment.image(filePath)]);
    
        return true;
    }
    
    async 狗妈(e) {
        const dir = './resources/emojihub/kaguranana-emoji';
        const baseUrl = 'https://gitee.com/logier/emojihub/raw/main/kaguranana-emoji/nana';  // 基础URL
        const max = 180;  // 图片数量
        let filePath;
    
        if (fs.existsSync(dir)) {
            // 如果文件夹存在，获取文件夹下的所有文件
            let files = fs.readdirSync(dir);
            // 从文件列表中随机选择一个文件
            const file = files[Math.floor(Math.random() * files.length)];
            // 构造文件的完整路径
            filePath = path.join(dir, file);
        } else {
            // 如果文件夹不存在，构造URL列表
            let urls = [];
            for (let i = 1; i <= max; i++) {
                urls.push(`${baseUrl}${i}.gif`);
            }
            // 从URL列表中随机选择一个URL
            filePath = urls[Math.floor(Math.random() * urls.length)];
        }
    
        e.reply([segment.image(filePath)]);
    
        return true;
    }
    async 黑白(e) {
        const dir = './resources/emojihub/greyscale-emoji';
        const baseUrl = 'https://gitee.com/logier/emojihub/raw/main/greyscale-emoji/greyscale';  // 基础URL
        const max = 108;  // 图片数量
        let filePath;
    
        if (fs.existsSync(dir)) {
            // 如果文件夹存在，获取文件夹下的所有文件
            let files = fs.readdirSync(dir);
            // 从文件列表中随机选择一个文件
            const file = files[Math.floor(Math.random() * files.length)];
            // 构造文件的完整路径
            filePath = path.join(dir, file);
        } else {
            // 如果文件夹不存在，构造URL列表
            let urls = [];
            for (let i = 1; i <= max; i++) {
                urls.push(`${baseUrl}${i}.gif`);
            }
            // 从URL列表中随机选择一个URL
            filePath = urls[Math.floor(Math.random() * urls.length)];
        }
    
        e.reply([segment.image(filePath)]);
    
        return true;
    }

    
    async 龙图(e) {
        const dirs = ['./resources/emojihub/long-emoji', './resources/emojihub/long-emoji2'];
        const baseUrls = ['https://gitee.com/logier/emojihub/raw/main/long-emoji/long', 'https://gitee.com/logier/emojihub/raw/main/long-emoji2/long'];
        const maxes = [1000, 315];
        let filePath;
    
        // 从数组中随机选择一个文件夹
        const dirIndex = Math.floor(Math.random() * dirs.length);
        const dir = dirs[dirIndex];
    
        if (fs.existsSync(dir)) {
            // 如果文件夹存在，获取文件夹下的所有文件
            let files = fs.readdirSync(dir);
            // 从文件列表中随机选择一个文件
            const file = files[Math.floor(Math.random() * files.length)];
            // 构造文件的完整路径
            filePath = path.join(dir, file);
        } else {
            // 如果文件夹不存在，构造URL列表
            let urls = [];
            for (let i = 1; i <= maxes[dirIndex]; i++) {
                urls.push(`${baseUrls[dirIndex]}${i + dirIndex * 1000}.gif`);
            }
            // 从URL列表中随机选择一个URL
            filePath = urls[Math.floor(Math.random() * urls.length)];
        }
    
        e.reply([segment.image(filePath)]);
    
        return true;
    }
    

    
    async 柴郡(e) {

        e.reply([segment.image("https://api.yujn.cn/api/chaijun.php?")])
    
        return true;
    }


    async 小黑子(e) {

    
        e.reply([segment.image("http://api.yujn.cn/api/cxk.php?")])
    
        return true;
    }



    
    
}



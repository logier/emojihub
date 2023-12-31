import fs from 'fs';
import path from 'path';





export class TextMsg extends plugin {
    constructor() {
        super({
            name: 'emojihub', 
            dsc: '发送表情包',            
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
                    reg: '^#龙图|#long|#龙$',   
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
                    reg: '^#?相册|图库$',   
                    fnc: '自定义'  
                }
                
            ],
            
        })

    }

    

    

    async 自定义(e) {
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
        const file = files[Math.floor(Math.random() * files.length)];

        // 构造消息
    
        e.reply(segment.image(file));
    
        return true;
    }
    

    
    

    
    async emojihub(e) {
        const dir = './resources/emojihub';
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



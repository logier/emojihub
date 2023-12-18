import puppeteer from "puppeteer";
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import https from 'https';

const 毛玻璃样式 = true 
const imageUrls = [
    'https://t.mwm.moe/ycy', //横图
    // 添加更多的 本地文件夹或URL... 需要图片api可以去https://www.logier.icu
];



let 提示词颜表情 = true; //是否在回复的时候开启颜表情

let emojis = 提示词颜表情 ? ["ヾ(≧▽≦*)o", "φ(*￣0￣)", "q(≧▽≦q)", "ψ(｀∇´)ψ ​​", "（￣︶￣）↗　", "*^____^*", "(～￣▽￣)～", "( •̀ ω •́ )✧", "[]~(￣▽￣)~*", "φ(゜▽゜*)♪"] : [""]; //可以自己添加颜表情

export class TextMsg extends plugin {
    constructor() {
        super({
            name: '图片一言', // 插件名称
            dsc: '发送带有图片的一言',  // 插件描述            
            event: 'message',  // 更多监听事件请参考下方的 Events
            priority: 6,   // 插件优先度，数字越小优先度越高
            rule: [
                {
                    reg: '^#?一言$',
                    fnc: '一言'
                },               
                {
                    reg: '^#?人间$',
                    fnc: '人间'
                },
                {
                    reg: '^#?毒鸡汤$',
                    fnc: '毒鸡汤'
                },
                {
                    reg: '^#?舔狗日记$',
                    fnc: '舔狗日记'
                },
                {
                    reg: '^#?社会语录$',
                    fnc: '社会语录'
                },
                {
                    reg: '^#?骚话$',
                    fnc: '骚话'
                },
                {
                    reg: '^#?发病$',
                    fnc: '发病'
                },
                {
                    reg: '^#?烧脑$',
                    fnc: '烧脑'
                },
                {
                    reg: '^#?kfc$',
                    fnc: 'kfc'
                },
            ]
        })

    }
    
    async 一言(e) {
        const response = await fetch('https://v1.hitokoto.cn');
        const data = await response.json();
        const content = data.hitokoto;
        const source = data.from;
        logger.info(data);  
        await generateHtml(e, content, source);
    }
    async 人间(e) {
        const response = await fetch('https://xoss.cc/api/yan/?msg=%E6%88%91%E5%9C%A8%E4%BA%BA%E9%97%B4%E5%87%91%E6%95%B0%E7%9A%84%E6%97%A5%E5%AD%90&type=text');
        const data = await response.text();
        logger.info(data);
        const regex = /(.*?)——选自散文集(.*?)/;
        const match = data.match(regex);
        if (match) {
            const content = match[1];
            const source = '《我在人间凑数的日子》';    
            await generateHtml(e, content, source);
        }
    }
    async 毒鸡汤(e) {
        await easyfetchData(e, 'https://xoss.cc/api/yan/?msg=%E6%AF%92%E9%B8%A1%E6%B1%A4&type=text', '《毒鸡汤》');
    }
    
    async 舔狗日记(e) {
        await easyfetchData(e, 'https://xoss.cc/api/yan/?msg=%E8%88%94%E7%8B%97%E6%97%A5%E8%AE%B0&type=text', '《舔狗日记》');
    }
    
    async 社会语录(e) {
        await easyfetchData(e, 'https://xoss.cc/api/yan/?msg=%E7%A4%BE%E4%BC%9A%E8%AF%AD%E5%BD%95&type=text', '《社会语录》');
    }
    
    async 骚话(e) {
        await easyfetchData(e, 'https://xoss.cc/api/yan/?msg=%E9%AA%9A%E8%AF%9D&type=text', '《骚话》');
    }
    
    async 发病(e) {
        let mmap = await e.group.getMemberMap();
        let fabingren;
        let memberId = this.e.at !== undefined ? this.e.at : e.user_id;
        let memberInfo = mmap.get(memberId);
        fabingren = memberInfo.nickname;
    
        let fabingurl = 'https://api.lolimi.cn/API/fabing/fb.php?name='
        const response = await fetch(fabingurl + fabingren);
        logger.info(fabingurl + fabingren);
        const data = await response.json();
        const content = data.data;
        const source = '《发病》'; 
        logger.info(data);
        await generateHtml(e, content, source);
    }
    async 烧脑(e) {
        await filefetchData(e, 'brainteasers.json', item.answer);
    }
    
    async kfc(e) {
        await filefetchData(e, 'corpus.json', '《疯狂星期四》');
    }
    
  
}


async function easyfetchData(e, url, source) {
    const response = await fetch(url);
    const data = await response.text();
    logger.info(data);
    const content = data;
    await generateHtml(e, content, source);
}
    
async function filefetchData(e, jsonFileName, source) {
    // 获取当前文件的目录
    const __dirname = dirname(fileURLToPath(import.meta.url));
    // 获取 JSON 文件的绝对路径
    const filePath = path.resolve(__dirname, `../../resources/maxim-json/${jsonFileName}`);
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
        await downloadFile(`https://raw.githubusercontent.com/logier/emojihub/main/maxim-json/${jsonFileName}`, filePath);
        // 重新读取 JSON 文件
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    // 随机选择一个内容
    const item = data[Math.floor(Math.random() * data.length)];
    const content = item.title || item;
    
    await generateHtml(e, content, source);
}


  


const blurStyle = 毛玻璃样式 ? 'backdrop-filter: blur(5px);' : '';




async function downloadFile(url, dest) {
    const file = fs.createWriteStream(dest);
    return new Promise((resolve, reject) => {
      https.get(url, response => {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', error => {
        fs.unlink(dest);
        reject(error.message);
      });
    });
  }






async function generateHtml(e, content, source, html_style, img_style, quote_style, content_style, source_style) {
    var randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    e.reply("正在为您渲染，请稍后" + randomEmoji, true, { recallMsg: 5 });

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
    
    let browser;
    try {
        browser = await puppeteer.launch({headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        const html_style = `display: flex;justify-content: center;align-items: center;position: relative;`;
        const img_style = `position: absolute; top: 0; left: 0; object-fit: cover;`;
        const quote_style = `color: white;background-color: rgba(0, 0, 0, 0.7);padding: 5px;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);text-align: center;width: 40%;display: flex;flex-direction: column;justify-content: center;font-size: 3em; border: 1px solid black;box-shadow: 5px 5px 5px 5px black; position: absolute; left: 0; top: 0; bottom: 0; ${blurStyle}`;
        const content_style = `text-align: justify; line-height: normal; text-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);`;
        const source_style = `text-align: right; font-size: 1em; color: rgba(255, 255, 255, 0.7); transform: skewX(-15deg);`;
        
        let Html = `
        <html style="${html_style}">
        <div class="img-container" style="${img_style}">
          <img src="${imageUrl}" object-fit: cover;" />
        </div>
        <div class="quote" style="${quote_style}">
          <div class="content" style="${content_style}">『${content}』</div>
          <div class="source" style="${source_style}">——${source}</div>
        </div>
      </html>
        `  
    
        await page.setContent(Html)
    
        // 获取图片容器元素
        const imgContainerElement = await page.$('.img-container img');

        // 对图片容器元素进行截图
        const base64 = await imgContainerElement.screenshot({ encoding: "base64" });

        e.reply(segment.image(`base64://${base64}`))
        return true

    } catch (error) {
        console.error(error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    
}














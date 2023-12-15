import plugin from '../../../lib/plugins/plugin.js'

export class TextMsg extends plugin {
    constructor() {
        super({
            name: '测试插件', // 插件名称
            dsc: '这是一个基础的插件示例',  // 插件描述            
            event: 'message',  // 更多监听事件请参考下方的 Events
            priority: 6,   // 插件优先度，数字越小优先度越高
            rule: [
                {
                    reg: '^#测试回复$',   // 正则表达式,有关正则表达式请自行百度
                    fnc: 'test'  // 执行方法
                }
            ]
        })

    }
    

    async test(e) {
        // 引用回复
            
        

        (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto('https://logier.icu');
          await page.screenshot({path: 'example.png'});
        
          await browser.close();
        })();


        return true

   }
}
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 获取当前目录
let currentDir = process.cwd();

// 创建一个对象来保存所有文件夹和文件名
let allFileNames = {};

// 创建一个对象来保存已经遇到的哈希值
let hashes = {};

// 创建一个数组来列出你想要忽略的文件夹
let ignoreDirs = ['.git', 'alsoIgnoreThisDir'];

// 读取当前目录下的所有文件和文件夹
fs.readdir(currentDir, (err, files) => {
    if (err) {
        return console.error('Unable to scan directory: ' + err);
    } 

    // 遍历所有文件和文件夹
    files.forEach((file) => {
        // 检查文件夹是否在忽略列表中
        if (ignoreDirs.includes(file)) {
            return;
        }

        // 获取完整路径
        let fullPath = path.join(currentDir, file);

        // 检查是否为目录
        if (fs.statSync(fullPath).isDirectory()) {
            // 读取目录下的所有文件
            fs.readdir(fullPath, (err, dirFiles) => {
                if (err) {
                    return console.error('Unable to scan directory: ' + err);
                } 

                // 在全局对象中创建一个新的分类
                allFileNames[file] = [];

                // 遍历所有文件
                dirFiles.forEach((dirFile) => {
                    // 获取文件的完整路径
                    let filePath = path.join(fullPath, dirFile);

                    // 检查 filePath 是否是一个文件
                    if (fs.statSync(filePath).isFile()) {
                        // 检查文件是否是图片
                        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(path.extname(filePath))) {
                            // 计算文件的哈希值
                            let hash = crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');

                            // 检查哈希值是否已经存在
                            if (hashes[hash]) {
                                // 如果哈希值已经存在，删除文件
                                fs.unlinkSync(filePath);
                            } else {
                                // 如果哈希值不存在，将文件名添加到全局对象的相应分类中
                                allFileNames[file].push(`${dirFile}`);

                                // 将哈希值添加到哈希值对象中
                                hashes[hash] = true;
                            }
                        }
                    }
                });

                // 将全局对象转换为JSON字符串
                let data = JSON.stringify(allFileNames, null, 2);

                // 将JSON字符串写入文件
                fs.writeFile('D:\\dev\\Miao-Yunzai\\plugins\\logier-plugin\\data\\emojiindex.json', data, (err) => {
                    if (err) throw err;
                    console.log('Data written to index.json');
                });
            });
        }
    });
});

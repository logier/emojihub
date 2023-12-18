const fs = require('fs');
const path = require('path');

function getFiles(dir, extensions, files_){
    files_ = files_ || [];
    let files = fs.readdirSync(dir);
    for (let i in files){
        let name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, extensions, files_);
        } else {
            let ext = path.extname(name);
            if(extensions.includes(ext)) {
                files_.push(name);
            }
        }
    }
    return files_;
}

// 使用示例
let dir = './test'; // 你的文件夹地址
let extensions = ['.txt', '.js']; // 你的文件后缀数组
let result = getFiles(dir, extensions);

console.log(result);

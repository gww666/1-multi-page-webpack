const fs = require("fs");
const path = require("path");

let versionFilePath = path.resolve(__dirname, "../version.json");

const read = (path) => {
    return new Promise(resolve => {
        const readStream = fs.createReadStream(path, "utf-8");
        let str = "";
        readStream.on("data", (s) => {
            str += s;
        });
        readStream.on("end", () => {
            resolve(str);
        });
    });
}
//获得版本信息文件的内容
const getJsonArray = () => {
    // let jsonStr = await read(versionFilePath);
    let jsonStr = fs.readFileSync(versionFilePath, "utf-8");
    return JSON.parse(jsonStr);
}
const getVersion = () => {
    let jsonArray = getJsonArray();
    let oldVersion = jsonArray[0].version;
    
    return oldVersion.split(".");
}
const getNewVersion = () => {
    let oldVersionArr = getVersion();
    
    //版本加1
    oldVersionArr[2] = Number(oldVersionArr[2]) + 1 + "";
    let newVersion = oldVersionArr.join(".");
    return newVersion;
}

//版本加1
const addVersion = () => {
    let jsonArray = getJsonArray();
    //获取新版本号
    let newVersion = getNewVersion();
    //获取发版说明
    let log = process.argv[2] || "暂无发版说明";
    let date = new Date();
    date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    //追加一个新的版本节点
    jsonArray.unshift({
        version: newVersion,
        log,
        date
    });
    //写入文件
    fs.writeFileSync(versionFilePath, JSON.stringify(jsonArray));
    return newVersion;
}

module.exports = {
    addVersion,
    getNewVersion
}
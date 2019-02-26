const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {getNewVersion} = require("../utils");
const fs = require("fs");
const path = require("path");
const getBaseConfig = ({
    dirName,
    version = "0.0.1"
}) => {
    return {
        mode: "production",
        entry: {},
        output: {
            publicPath: "/",
            path: path.resolve(__dirname, "../dist"),
            filename: `${dirName}/[name].${version}.js`
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: `${dirName}/[name].${version}.css`,
                // chunkFilename: "[id].css"
            }),
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, "../src/assets"),
                    to: path.resolve(__dirname, "../dist/assets")
                }
            ])
        ]
    }
}

//扫描pages文件夹，为每个页面生成配置
const getConfigs = async () => {
    const configs = [];
    let result = fs.readdirSync(path.resolve(__dirname, "../src/pages"));
    let reg = /\.js$/;
    // for (let subDir of result) {
    result.forEach(subDir => {
        //扫描子文件夹--每个页面
        let subDirPath = path.resolve(__dirname, `../src/pages/${subDir}`);
        let subResult = fs.readdirSync(subDirPath);
        //获得要打包的js文件
        let entry = {};
        
        subResult.forEach(fileName => {
            if (reg.test(fileName)) {
                let _fileName = fileName.slice(0, -3);
                entry[_fileName] = `${subDirPath}/${fileName}`;
            }
        });
        let HtmlWebpackPluginConfig = [
            new HtmlWebpackPlugin({
                template: `${subDirPath}/index.html`,
                filename: `${subDir}/index.html`,
            })
        ];
        //获取版本
        let version = getNewVersion();
        //拿到基础对象
        let _baseConfig = getBaseConfig({
            dirName: subDir,
            version
        });
        //生成配置
        _baseConfig.entry = entry;
        _baseConfig.plugins = _baseConfig.plugins.concat(HtmlWebpackPluginConfig);
        // console.log("entry", entry);
        configs.push(_baseConfig);
    });
    // }
    return configs;
}

module.exports = getConfigs();
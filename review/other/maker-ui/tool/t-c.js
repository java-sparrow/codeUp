/*
 * template-compiler 模板自动编译工具，基于node
 */

var fs = require('fs');

// 存放模板的文件夹路径
var templateDirectory = '../src'; //相对于当前文件的相对路径

// 模板文件的读取规则
var reg = /-template.html$/;

var templateFiles = readAllFile(templateDirectory, reg);
compileTemplate(templateFiles);


/*------------工具函数------------*/
/*
 * 读取指定文件夹下的全部文件，可通过正则进行过滤，返回文件路径数组
 * @param root 指定文件夹路径
 * [@param] reg 对文件的过滤正则表达式,可选参数
 *
 * 注：还可变形用于文件路径是否符合正则规则，路径可以是文件夹，也可以是文件，对不存在的路径也做了容错处理*/
function readAllFile(root, reg) {

    var resultArr = [];
    var thisFn = arguments.callee;
    if (fs.existsSync(root)) {//文件或文件夹存在

        var stat = fs.lstatSync(root); // 对于不存在的文件或文件夹，此函数会报错

        if (stat.isDirectory()) {// 文件夹
            var files = fs.readdirSync(root);
            files.forEach(function (file) {
                var t = thisFn(root + '/' + file, reg);
                resultArr = resultArr.concat(t);
            });

        } else {
            if (reg !== undefined) {

                if (typeof reg.test == 'function'
                    && reg.test(root)) {
                    resultArr.push(root);
                }
            }
            else {
                resultArr.push(root);
            }
        }
    }

    return resultArr;
}

/*
 * 编译模板
 * @paran templateFiles 需要编译的html模板文件路径列表
 * */
function compileTemplate(templateFiles) {
    // 模板引擎的路径
    var template = require('../dep/template-3.0.0');

    // 包装的头和尾
    var header = "define(['template'], function (template) {\r\n";
    var foot = "\r\n    return { render: anonymous };\r\n});";

    for(var i = 0,len = templateFiles.length; i < len; i++){
        var templateFilePath = templateFiles[i];

        var templateJSFilePath = templateFilePath.replace('.html','.js');
        var templateContent = fs.readFileSync(templateFilePath,"utf-8");

        try{
            var compileResult = template.compile(templateContent) + '';
            // 美化格式
            compileResult = compileResult.replace(/^/gm,'        ');
            compileResult = compileResult.replace(/^        /g,'    ');
            compileResult = compileResult.replace(/        \}$/g,'    }');
            // 修正闭包中的对外不可调用的问题
            compileResult = compileResult.replace('var $utils=this', 'var $utils=template.utils');
        }catch (e){
            console.log('模板：' + templateFilePath + '编译错误');
        }
        // 加上外包装
        compileResult = header + compileResult;
        compileResult += foot;

        if (!fs.existsSync(templateJSFilePath)) {
            // 追加文件
            fs.appendFile(templateFilePath.replace('.html','.js'), compileResult, 'utf8', function (err) {
                if (err) {
                    console.log(err);
                }
            });
        } else {

            // 写文件
            fs.writeFile(templateJSFilePath, compileResult, function (err) {
                if (err) throw err;

            });
        }
    }

    console.log('模板编译完成');
}
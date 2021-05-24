

var onMenuClicked = function(identifier){
    // system.log(invocation.selections);
    if(!invocation.selectionExist){
        return {
            'result':false
        };
    }
    var tabStr = ' '.repeat(invocation.tabWidth);
    var outLines = ['#pragma mark - 懒加载',''];

    let allLines = invocation.selectionLines;
    allLines.forEach(line => {
        // 判断property为有效行
        if (line.indexOf("@property") != -1) {
            // system.log(line)
            let values = line.split(' ');

            if (values.length >= 4) {
                let attribute = values[1];
                // 非assign 创建get方法
                if (attribute.indexOf("assign") == -1) {
                    var reValues = values.reverse();
                    let className = reValues[1];
                    var ivar = reValues[0];

                    // 去除* 去除空格 去除;
                    ivar = ivar.replace(/\s*/g,"");
                    ivar = ivar.replace('\*',"");
                    ivar = ivar.replace(';',"");
                    // system.log(ivar)

                    //生成字符串
                    // let outStr = (`- (${className} *)${ivar} {\n${tabStr}if (!_${ivar}) {\n${tabStr}${tabStr}\n${tabStr}}\n${tabStr}return _${ivar};\n}`);
                    
                    outLines.push(`- (${className} *)${ivar} {`);
                    outLines.push(`${tabStr}if (!_${ivar}) {`);
                    outLines.push(`${tabStr}${tabStr}`);
                    outLines.push(`${tabStr}}`);
                    outLines.push(`${tabStr}return _${ivar};`);
                    outLines.push(`}`);
                    outLines.push('');
                    // outLines.push(outStr)
                }
            }
        }
    });

    if (outLines.length) {
        for (let index = invocation.lineCount; index > 0; index--) {
            const line = invocation.lines[index];
            if (line) {
                if (line.indexOf('@end') != -1) {
                    invocation.insertLinesAtIndex(
                        outLines,
                        index
                    );
                    system.log(index)
                    break;
                }                    
            }
        }
    }

    return {'result':true};
}

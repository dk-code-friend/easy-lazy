
var checkHasHead = (headName, allLines, endLine) => {
    for (let index = 0; index < endLine; index++) {
        const element = allLines[index];
        if (RegExp(headName).test(element)) {
            return true;
        }
    }
    return false;
};

var insertImport = (line, allLines, endLine) => {
    var lastDocument = [];
    var lastImport = [];
    var lastImplementation = 0;
    let docReg = /^\/\//
    let importReg = /^(@|#)import/
    let implementationReg = /@(interface|implementation)/

    for (let index = 0; index < endLine; index++) {
        const element = allLines[index];
        if (docReg.test(element)) {
            lastDocument.push(index);
            // system.log("当前行"+index+",数据:"+element+",类型doc");
        }
        else if(importReg.test(element)) {
            lastImport.push(index);
            // system.log("当前行"+index+",数据:"+element+",类型import");
        }
        else if(implementationReg.test(element)) {
            lastImplementation = index;
            // system.log("当前行"+index+",数据:"+element+",类型Implementation");
        }
    }

    system.log("lastDocument"+lastDocument);
    system.log("lastImport"+lastImport);
    system.log("lastImplementation"+lastImplementation);

    var insertNum = 0;


    if (lastImport.length) {
        var last = lastImport.pop()
        while (lastImplementation < last) {
            last = lastImport.pop()
        }

        if (last) {
            insertNum = last + 1;
        }
    }

    if (insertNum === 0) {
        if (lastDocument.length) {
            var last = lastDocument.pop()
            while (lastImplementation > last) {
                last = lastDocument.pop()
            }
            if (last) {
                insertNum = last;
            }
        }
    }

    invocation.insertLinesAtIndex([line.trim()],insertNum);
};

var onMenuClicked = function (identifier) {
    selections = invocation.selections[0];
    beginLine = selections[0]
    endLine = selections[2]
    system.log("beginLine:" + beginLine + " endLine:" + endLine);

    // system.log("import:"+typeof(invocation.selections));
    // system.log("import invocation:"+invocation.lines);
    let allLines = invocation.lines;

    var simpleLine = allLines[beginLine]

    var importReg = /(@|#)import/
    if (importReg.test(simpleLine)) {
        let result = simpleLine.match(/(".+")|(<.+>)/);
        system.log('result' + result);
        if (result && result[0].length) {
            var headName = result[0];
            headName = headName.slice(1, headName.length - 1);
            invocation.removeLinesFromTo(beginLine, beginLine);
            if (checkHasHead(headName, allLines, beginLine)) {
                // throw("存在"+headName);
                return { 'result': false };
            } else {
                insertImport(simpleLine, allLines, beginLine);
            }
        }
    }

    return { 'result': true };
}

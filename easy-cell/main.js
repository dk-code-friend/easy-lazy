Array.prototype.insert = function (index, value) {
  this.splice(index, 0, value);
}

var generateWithString = function (strValue) {
  // 判断property为有效行
  if (strValue.indexOf("@property") != -1) {
    let values = strValue.split(' ');

    if (values.length > 3) {
      let attribute = values[1];

      // 非assign 创建get方法
      if (attribute.indexOf("assign") == -1) {
        var reValues = values.reverse();
        let className = reValues[1];
        var ivar = reValues[0];

        // 去除* 去除空格 去除;
        ivar = ivar.replace(/\s*/g, "");
        ivar = ivar.replace('\*', "");
        ivar = ivar.replace(';', "");
        // system.log(ivar)

        //首字母大写
        let capVar = ivar.charAt(0).toUpperCase() + ivar.slice(1);

        // 生成字符串
        // let resultStr = "- (void)initViewWith" + capVar + " {\n    " + className + " *" + ivar + " = [self createWithCmd:_cmd];\n}\n"
        // return resultStr;
        var resultvalue = [];
        resultvalue.push("- (void)initViewWith" + capVar + " {");
        resultvalue.push("    " + className + " *" + ivar + " = [self createWithCmd:_cmd];");
        resultvalue.push("}");
        resultvalue.push("");
        return resultvalue;
      }

    }
  }
  return null;
}

var onMenuClicked = function (identifier) {
  // system.log(invocation.selections);
  if (!invocation.selectionExist) {
    return {
      'result': false
    };
  }

  var tabStr = ' '.repeat(invocation.tabWidth);
  var outLines = [];

  let allLines = invocation.selectionLines;
  allLines.forEach(line => {
    // 判断property为有效行
    let rsValue = generateWithString(line);
    if (rsValue != null) {
      outLines = outLines.concat(rsValue);
    }
  });

  if (outLines.length) {
    headLines = [
      "#pragma mark - init",
      "- (void)initViews {",
      "    [super initViews];",
      "}",
      "",
      "",
    ];

    footLines = [
      "#pragma mark-约束",
      "- (void)updateConstraintsWithMasonry {",
      "    [super updateConstraintsWithMasonry];",
      "}",
      "",
      "- (void)setModel:(LLCellModel *)model {",
      "    [super setModel:model];",
      "}",
      ""
    ];
    outLines = headLines.concat(outLines);
    outLines = outLines.concat(footLines);

    for (let index = invocation.lineCount; index > 0; index--) {
      const line = invocation.lines[index];
      if (line) {
        if (line.indexOf('@implementation') != -1) {
          invocation.insertLinesAtIndex(
            outLines,
            index + 1
          );
          system.log(index)
          break;
        }
      }
    }
  }

  return { 'result': true };
}

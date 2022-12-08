import xpath from 'xpath'
import { DOMParser } from 'xmldom'
class VConsoleNewWorkLogsPlugin {
  constructor(vConsole) {
    this.vConsole = vConsole;
    this.$ = vConsole.$;
    this.dom = null;
    return this.init();
  }

  init() {
    const logInstance = new window.VConsole.VConsolePlugin(
      "exportLog",
      "exportLog"
    );

    logInstance.on("ready", () => {
      console.log('[vConsole-exportlog-plugin] -- load');
    });
    logInstance.on("renderTab", (callback) => {
      const html = `<div class="vconsole-exportlog">
      </div>`;
      callback(html);
    });
    logInstance.on("addTool", (callback) => {
      const buttons = [
        {
          name: "exportLogs",
          onClick: this.export,
        },
        {
          name: "copyLogs",
          onClick: this.copyText,
        },
      ];
      callback(buttons);
    });
    this.vConsole.addPlugin(logInstance);
    return logInstance;
  }
  funDownload = (content, filename) => {
    var eleLink = document.createElement("a");
    eleLink.download = filename;
    eleLink.style.display = "none";
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
  }
  export = () => {
    let _str = ''
    const netEle = document.getElementById('__vc_tab_network')
    const exportEle = document.getElementById('__vc_tab_exportlog')
    netEle.click()
    setTimeout(() => {
      exportEle.click()
      let nodes = document.querySelectorAll(".vc-group-detail")
      for (let node of nodes) {
        _str += `${_str}\n\n`
        let xml = node.innerHTML
        var doc = new DOMParser().parseFromString(xml)
        var result = xpath.evaluate(
          "/div/div/*",            // xpathExpression
          doc,                        // contextNode
          null,                       // namespaceResolver
          xpath.XPathResult.ANY_TYPE, // resultType
          null                        // result
        )
        node = result.iterateNext();
        let index = 0
        let key = ''
        while (node) {
          console.log(node.localName + ": " + node.firstChild.data);
          if (index % 2 === 0) {
            _str += `${node.firstChild.data},`
          } else {
            _str += `${node.firstChild.data}\n`
          }
          index++
          node = result.iterateNext();
        }
      }
      this.funDownload(_str, `${new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()}.log`)
    }, 300);
  };
}

window.VConsoleNewWorkLogsPlugin = VConsoleNewWorkLogsPlugin;

export default VConsoleNewWorkLogsPlugin;

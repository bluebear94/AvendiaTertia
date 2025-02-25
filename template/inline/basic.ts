//

import {
  AvendiaTemplateManager
} from "../../generator/transformer";


let manager = new AvendiaTemplateManager();

function splitToWords(string: string): Array<string> {
  let splitStrings = ["", ...string.split(/('| )/), ""];
  for (let i = 0 ; i < splitStrings.length ; i ++) {
    if (i % 2 === 0) {
      if (splitStrings[i] === "'") {
        let previous = splitStrings[i - 1];
        if (previous === "s" || previous === "di" || previous === "ac" || previous === "al") {
          splitStrings[i - 1] = splitStrings[i - 1] + "'";
        } else {
          splitStrings[i + 1] = "'" + splitStrings[i + 1];
        }
        splitStrings[i] = "";
      }
    } else {
      let match;
      if ((match = splitStrings[i].match(/^((?:\(|\[|«|“)+)(.*?)$/)) !== null) {
        splitStrings[i - 1] = splitStrings[i - 1] + match[1];
        splitStrings[i] = match[2];
      }
      if ((match = splitStrings[i].match(/^(.*?)((?:\)|\]|»|”|\.|,|:|;|!|\?)+)$/)) !== null) {
        splitStrings[i + 1] = match[2] + splitStrings[i + 1];
        splitStrings[i] = match[1];
      }
    }
  }
  return splitStrings;
};

manager.registerElementRule("x", true, (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("span", (self) => {
    self.addClassName("sans");
    if (true) {
      let currentNode = document.createDocumentFragment();
      let currentName = "";
      let appendCurrentNode = function () {
        self.appendElement("span", (self) => {
          self.addClassName("word");
          self.setAttribute("data-name", currentName);
          self.appendChild(currentNode);
        });
        currentNode = document.createDocumentFragment();
        currentName = "";
      };
      for (let i = 0 ; i < element.childNodes.length ; i ++) {
        let child = element.childNodes.item(i)!;
        if (child.isText()) {
          let splitContents = splitToWords(child.data);
          for (let j = 0 ; j < splitContents.length ; j ++) {
            let content = splitContents[j];
            if (j % 2 === 1) {
              currentNode.appendChild(document.createTextNode(content));
              currentName += content;
              if (j < splitContents.length - 2 || splitContents[j + 1] !== "") {
                appendCurrentNode();
              }
            } else {
              self.appendTextNode(content);
            }
          }
        } else if (child.isElement()) {
          currentNode.appendChild(transformer.processElement(child));
          currentName += child.textContent;
        }
      }
      appendCurrentNode();
    } else {
      self.appendChild(transformer.apply());
    }
  });
  return self;
});

manager.registerElementRule("xn", true, (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("span", (self) => {
    self.addClassName("sans");
    self.appendChild(transformer.apply());
  });
  return self;
});

manager.registerElementRule("i", true, (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("var", (self) => {
    self.addClassName("italic");
    self.appendChild(transformer.apply());
  });
  return self;
});

manager.registerElementRule("k", ["page", "page.section-table"], (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("span", (self) => {
    self.addClassName("japanese");
    self.appendChild(transformer.apply());
  });
  return self;
});

manager.registerElementRule(["c", "m"], ["page", "page.section-table"], (transformer, document, element) => {
  let self = document.createDocumentFragment();
  let className = (element.tagName === "c") ? "code" : "monospace";
  self.appendElement("code", (self) => {
    self.addClassName(className);
    self.appendChild(transformer.apply());
  });
  return self;
});

manager.registerElementRule("h", ["page", "page.section-table"], (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("span", (self) => {
    self.addClassName("hairia");
    self.appendChild(transformer.apply());
  });
  return self;
});

manager.registerElementRule("ch", true, (transformer, document, element) => {
  let self = document.createDocumentFragment();
  if (element.hasAttribute("c")) {
    let codePoint = parseInt(element.getAttribute("c"), 16);
    self.appendTextNode(String.fromCodePoint(codePoint));
  } else if (element.hasAttribute("n")) {
    let query = element.getAttribute("n");
    if (query === "nbsp") {
      self.appendTextNode(String.fromCodePoint(0xA0));
    }
  }
  return self;
});

manager.registerElementRule("fl", "page", (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("span", (self) => {
    self.addClassName("foreign");
    self.appendChild(transformer.apply());
  });
  return self;
});

manager.registerElementRule("em", "page", (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("em", (self) => {
    self.addClassName("emphasis");
    self.appendChild(transformer.apply());
  });
  return self;
});

manager.registerElementRule("small", "page", (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("span", (self) => {
    self.addClassName("small");
    self.appendChild(transformer.apply());
  });
  return self;
});

manager.registerElementRule("lys", "page", (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("span", (self) => {
    self.addClassName("lyrics-space");
  });
  return self;
});

manager.registerElementRule("red", "page", (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("span", (self) => {
    self.addClassName("redaction");
    if (element.hasAttribute("len")) {
      let length = parseInt(element.getAttribute("len"));
      self.appendTextNode(" ".repeat(length));
    }
    self.appendChild(transformer.apply());
  });
  return self;
});

manager.registerElementRule("box", "page", (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("span", (self) => {
    self.addClassName("box");
    self.appendChild(transformer.apply());
  });
  return self;
});

manager.registerElementRule("label", "page", (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("span", (self) => {
    self.addClassName("label");
    self.appendChild(transformer.apply());
  });
  return self;
});

manager.registerElementRule(["sup", "sub"], ["page", "page.section-table"], (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("span", (self) => {
    self.addClassName(element.tagName);
    self.appendChild(transformer.apply());
  });
  return self;
});

export default manager;
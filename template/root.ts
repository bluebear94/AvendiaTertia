//

import {
  AVENDIA_CONFIGS
} from "../generator/configs";
import {
  AvendiaTemplateManager
} from "../generator/transformer";


let manager = new AvendiaTemplateManager();

manager.registerElementRule("page", "", (transformer, document, element) => {
  let path = transformer.variables.path;
  let language = transformer.variables.language;
  let splitRelativePath = AVENDIA_CONFIGS.getSplitRelativeDocumentPath(path, language);
  let depth = splitRelativePath.length - 1;
  let mainClassName = (depth >= 1 && depth <= 2 && path.match(/index\.zml$/)) ? "content-table-main" : "main";
  let navigationNode = document.createDocumentFragment();
  let headerNode = document.createDocumentFragment();
  let mainNode = document.createDocumentFragment();
  transformer.variables.foreignLanguage = (language === "ja") ? "en" : "ja";
  navigationNode.appendChild(transformer.call("navigation", element));
  navigationNode.appendChild(transformer.apply(element, "navigation"));
  headerNode.appendChild(transformer.apply(element, "header"));
  mainNode.appendElement("article", (self) => {
    self.addClassName(mainClassName);
    self.appendChild(transformer.apply(element, "page"));
  });
  transformer.variables.navigationNode = navigationNode;
  transformer.variables.headerNode = headerNode;
  return mainNode;
});

export default manager;
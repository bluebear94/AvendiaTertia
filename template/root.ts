//

import {
  AvendiaOutputLanguage
} from "../generator/configs";
import {
  AvendiaLightTransformer,
  AvendiaTemplateManager
} from "../generator/transformer";


let manager = new AvendiaTemplateManager();

function getMainClassName(path: string, language: AvendiaOutputLanguage, transformer: AvendiaLightTransformer): string {
  let splitRelativePath = transformer.environments.configs.getSplitRelativeDocumentPath(path, language);
  let depth = splitRelativePath.length - 1;
  if (depth >= 1 && depth <= 2 && path.match(/index\.zml$/)) {
    return "content-table-main";
  } else if (depth === 2 && path.match(/error/)) {
    return "error-main";
  } else {
    return "main";
  }
}

manager.registerElementRule("page", "", (transformer, document, element) => {
  let path = transformer.variables.path;
  let language = transformer.variables.language;
  let mainClassName = getMainClassName(path, language, transformer);
  let navigationNode = document.createDocumentFragment();
  let headerNode = document.createDocumentFragment();
  let mainNode = document.createDocumentFragment();
  transformer.variables.foreignLanguage = (language === "ja") ? "en" : "ja";
  transformer.variables.mode = "page";
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

manager.registerElementRule("html", "", (transformer, document, element) => {
  let self = document.createDocumentFragment();
  let language = transformer.variables.language;
  transformer.variables.mode = "html";
  self.appendElement("html", (self) => {
    self.setAttribute("lang", language);
    self.appendChild(transformer.apply(element, "html"));
  });
  return self;
});

export default manager;
//

import type {
  SectionSpec
} from "../generator/service/reference";
import {
  AvendiaTemplateManager
} from "../generator/transformer";


let manager = new AvendiaTemplateManager();

manager.registerElementRule("page", "reference", (transformer, document, element) => {
  let path = transformer.variables.path;
  let language = transformer.variables.language;
  let splitRelativePath = transformer.environments.configs.getSplitRelativeDocumentPath(path, language);
  let href = splitRelativePath[splitRelativePath.length - 1].replace(/\.zml/, ".html");
  let sectionElements = element.searchXpath("/page/*[name() = 'h1' or name() = 'h2']") as Array<Element>;
  let sectionSpecs = [] as Array<SectionSpec>;
  let currentSectionSpec = null as SectionSpec | null;
  for (let sectionElement of sectionElements) {
    let tag = sectionElement.getAttribute("tag");
    let content = transformer.apply(sectionElement, "page").toString();
    if (sectionElement.tagName === "h1") {
      if (currentSectionSpec !== null) {
        sectionSpecs.push(currentSectionSpec);
      }
      currentSectionSpec = {href, tag, content, childSpecs: []};
    } else if (sectionElement.tagName === "h2") {
      let subsectionSpec = {href, tag, content, childSpecs: []};
      currentSectionSpec?.childSpecs.push(subsectionSpec);
    }
  }
  if (currentSectionSpec !== null) {
    sectionSpecs.push(currentSectionSpec);
  }
  return document.createTextNode(JSON.stringify(sectionSpecs));
});

manager.registerElementRule(true, "reference", (transformer, document) => {
  return document.createDocumentFragment();
});

manager.registerTextRule("reference", (transformer, document) => {
  return document.createDocumentFragment();
});

export default manager;
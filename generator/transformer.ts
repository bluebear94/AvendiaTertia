//

import {
  BaseTransformer,
  LightTransformer,
  NodeLikeOf,
  TemplateManager
} from "@zenml/zenml";
import {
  ZoticaResourceUtils
} from "@zenml/zotica";
import dotjs from "dot";
import TEMPLATE_HTML from "../template/template.html";
import TRANSLATIONS from "../template/translations.json";
import {
  AVENDIA_CONFIGS,
  AvendiaOutputLanguage
} from "./configs";
import type {
  AvendiaDocument
} from "./dom";


export class AvendiaTransformer extends BaseTransformer<AvendiaDocument, AvendiaTransformerEnvironments, AvendiaTransformerVariables> {

  private template: (...args: Array<any>) => string;

  public constructor(implementation: () => AvendiaDocument) {
    super(implementation);
    this.template = dotjs.template(TEMPLATE_HTML, {...dotjs.templateSettings, strip: false});
  }

  public transformFinalize(...[input, configs]: Parameters<typeof this.transform>): string {
    let document = this.transform(input, configs);
    let view = {
      environments: this.environments,
      variables: this.variables,
      configs: AVENDIA_CONFIGS,
      translations: TRANSLATIONS,
      document
    };
    let output = this.template(view);
    return output;
  }

  protected resetEnvironments(initialEnvironments?: Partial<AvendiaTransformerEnvironments>): void {
    this.environments = {
      mathStyleString: ZoticaResourceUtils.getStyleString("/material/font/math.otf"),
      mathScriptString: ZoticaResourceUtils.getScriptString(),
      ...initialEnvironments
    };
  }

  protected resetVariables(initialVariables?: Partial<AvendiaTransformerVariables>): void {
    this.variables = {
      path: "",
      language: "ja",
      number: {theorem: 0, equation: 0, bibliography: 0},
      numbers: {theorem: new Map(), equation: new Map(), bibliography: new Map()},
      namePrefixes: {theorem: new Map(), equation: new Map(), bibliography: new Map()},
      ...initialVariables
    };
  }

}


export class AvendiaTemplateManager extends TemplateManager<AvendiaDocument, AvendiaTransformerEnvironments, AvendiaTransformerVariables> {

}


export type AvendiaLightTransformer = LightTransformer<AvendiaDocument, AvendiaTransformerEnvironments, AvendiaTransformerVariables>;

export type AvendiaTransformerEnvironments = {
  mathStyleString: string,
  mathScriptString: string
};
export type AvendiaTransformerVariables = {
  path: string,
  language: AvendiaOutputLanguage,
  foreignLanguage?: AvendiaOutputLanguage,
  title?: string,
  pageTitle?: string,
  latest?: boolean,
  navigationNode?: NodeLikeOf<AvendiaDocument>,
  headerNode?: NodeLikeOf<AvendiaDocument>,
  number: {theorem: number, equation: number, bibliography: number},
  numbers: {theorem: Map<string, number>, equation: Map<string, number>, bibliography: Map<string, number>},
  namePrefixes: {theorem: Map<string, string | null>, equation: Map<string, string | null>, bibliography: Map<string, string | null>},
  numberPrefix?: string
};
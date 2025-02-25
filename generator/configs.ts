//

import pathUtil from "path";


export class AvendiaConfigs {

  private readonly json: AvendiaConfigsJson;

  public constructor(json: AvendiaConfigsJson) {
    this.json = json;
  }

  public getServerHost(): string {
    return this.json.server.host;
  }

  public getServerUser(): string {
    return this.json.server.user;
  }

  public getServerPassword(): string {
    return this.json.server.password;
  }

  public getRemoteDomain(language: AvendiaOutputLanguage): string {
    return this.json.remoteDomain[language];
  }

  public getRemoteUrl(path: string, language: AvendiaOutputLanguage): string {
    let documentDirPath = this.getDocumentDirPath(language);
    let remoteDomain = this.getRemoteDomain(language);
    let remoteUrl = remoteDomain + "/" + pathUtil.relative(documentDirPath, path).replace(/\\/g, "/").replace(/\.zml$/, ".html");
    return remoteUrl;
  }

  public getDocumentDirPath(language: AvendiaLanguage): string {
    return this.json.documentDirPath[language];
  }

  public getDocumentDirPathSpecs(): Array<[string, AvendiaLanguage]> {
    return Object.entries(this.json.documentDirPath).map(([language, dirPath]) => [dirPath, language]) as any;
  }

  public getRelativeDocumentPath(path: string, language: AvendiaLanguage): string {
    return pathUtil.relative(this.getDocumentDirPath(language), path);
  }

  public getSplitRelativeDocumentPath(path: string, language: AvendiaLanguage): Array<string> {
    return this.getRelativeDocumentPath(path, language).split(pathUtil.sep);
  }

  public getOutputDirPath(language: AvendiaOutputLanguage): string {
    return this.json.outputDirPath[language];
  }

  public getRemoteDirPath(language: AvendiaOutputLanguage): string {
    return this.json.remoteDirPath[language];
  }

  public getHistoryIndexPath(language: AvendiaOutputLanguage): string {
    return pathUtil.join(this.json.logDirPath, "history", `${language}.txt`);
  }

  public getReferenceIndexPath(language: AvendiaOutputLanguage): string {
    return pathUtil.join(this.json.logDirPath, "reference", `${language}.json`);
  }

  public getErrorLogPath(): string {
    return pathUtil.join(this.json.logDirPath, "error.txt");
  }

  public findDocumentLanguage(path: string): AvendiaLanguage | null {
    for (let [language, dirPath] of Object.entries(this.json.documentDirPath)) {
      let relative = pathUtil.relative(dirPath, path);
      if (!relative.startsWith("..")) {
        return language as any;
      }
    }
    return null;
  }

  public replaceDocumentDirPath(documentPath: string, documentLanguage: AvendiaLanguage, outputLanguage: AvendiaOutputLanguage): string {
    return pathUtil.join(this.getOutputDirPath(outputLanguage), pathUtil.relative(this.getDocumentDirPath(documentLanguage), documentPath));
  }

  public replaceOutputDirPath(outputPath: string, outputLanguage: AvendiaOutputLanguage): string {
    return pathUtil.join(this.getRemoteDirPath(outputLanguage), pathUtil.relative(this.getOutputDirPath(outputLanguage), outputPath)).replace(/\/|\\/g, "/");
  }

}


export type AvendiaLanguage = "ja" | "en" | "common";
export type AvendiaOutputLanguage = Exclude<AvendiaLanguage, "common">;
export type AvendiaConfigsJson = typeof import("../config/default.json");
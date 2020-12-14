import { IDecoration } from './util/color-util';
import { TextDocument } from 'vscode';

class CacheManager {
  private _dirtyCache: Map<string, Map<number, IDecoration[]>>;
  private _decorationsCache: Map<string, Map<number, IDecoration[]>>;

  constructor() {
    this._dirtyCache = new Map();
    this._decorationsCache = new Map();
  }

  /**
   * Return the saved decorations for a document or return null if the file has never been opened before.
   *
   * @param {TextEditor} editor
   * @returns {(Map<number, IDecoration[]> | null)}
   */
  public getCachedDecorations(document: TextDocument): Map<number, IDecoration[]> | null  {
    if (!document.isDirty && this._decorationsCache.has(document.fileName)) {
      return this._decorationsCache.get(document.fileName);
    }
    if (this._dirtyCache.has(document.fileName)) {
      return this._dirtyCache.get(document.fileName);
    }
    return null;
  }
  /**
   * Save a file decorations
   *
   * @param {TextDocument} document
   * @param {Map<number, IDecoration[]>} deco
   */
  public saveDecorations(document: TextDocument, deco: Map<number, IDecoration[]>) {
    document.isDirty ? this._saveDirtyDecoration(document.fileName, deco) : this._saveSavedDecorations(document.fileName, deco);
  }

  private _saveDirtyDecoration(fileName: string, decorations: Map<number, IDecoration[]>) {
    return this._dirtyCache.set(fileName, decorations);
  }

  private _saveSavedDecorations(fileName: string, decorations: Map<number, IDecoration[]>) {
    return this._decorationsCache.set(fileName, decorations);
  }

  public clearCache() {
    this._dirtyCache.clear();
    this._decorationsCache.clear();
  }
}

const instance = new CacheManager();

export default instance;

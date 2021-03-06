import Logger from 'color-logger';
import AbstractDoc from './AbstractDoc.js';
import ParamParser from '../Parser/ParamParser.js';

let logger = new Logger('ExternalDoc');

/**
 * Doc Class from virtual comment node of external.
 */
export default class ExternalDoc extends AbstractDoc {
  /**
   * apply own tag.
   * @private
   */
  _apply() {
    super._apply();

    delete this._value.export;
    delete this._value.importPath;
    delete this._value.importStyle;
  }

  /** specify ``external`` to kind. */
  _$kind() {
    super._$kind();
    this._value.kind = 'external';
  }

  /** take out self name from tag */
  _$name() {
    let value = this._findTagValue(['@external']);
    if (!value) {
      logger.w(`can not resolve name.`);
    }

    this._value.name = value;

    let tags = this._findAll(['@external']);
    if (!tags) {
      logger.w(`can not resolve name.`);
      return;
    }

    let name;
    for (let tag of tags) {
      let {tagName, tagValue} = tag;
      let {typeText, paramDesc} = ParamParser.parseParamValue(tagValue, true, false, true);
      name = typeText;
      this._value.externalLink = paramDesc;
    }

    this._value.name = name;
  }

  /** take out self memberof from file path. */
  _$memberof() {
    super._$memberof();
    this._value.memberof = this._pathResolver.filePath;
  }

  /** specify name to longname */
  _$longname() {
    super._$longname();
    if (this._value.longname) return;
    this._value.longname = this._value.name;
  }

  /** avoid unknown tag */
  _$external() {}
}


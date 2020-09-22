import {SourceDescription} from 'rollup';
import {CLOSING_BRACKET_AND_EXPORT, stylesheetInit} from './bits';

/** @internal */
export function transformWithoutMap(varType: string, code: string): SourceDescription {
  return {
    code: stylesheetInit(varType) + JSON.stringify(code) + CLOSING_BRACKET_AND_EXPORT,
    map: {
      mappings: ''
    }
  };
}

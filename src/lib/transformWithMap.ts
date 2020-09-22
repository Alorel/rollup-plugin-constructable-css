import MagicString from 'magic-string';
import {SourceDescription} from 'rollup';
import {CLOSING_BRACKET_AND_EXPORT, stylesheetInit} from './bits';

/** @internal */
export function transformWithMap(varType: string, code: string): SourceDescription {
  const ms = new MagicString(code);
  const jsoned = JSON.stringify(code);

  // If JSON.stringify only added brackets and didn't have to escape anything we can do a basic wrapping
  if (jsoned.length - code.length === 2) { // eslint-disable-line no-magic-numbers
    ms.append(`"${CLOSING_BRACKET_AND_EXPORT}`)
      .prepend(`${stylesheetInit(varType)}"`);
  } else {
    ms.overwrite(0, code.length, jsoned)
      .append(CLOSING_BRACKET_AND_EXPORT)
      .prepend(stylesheetInit(varType));
  }

  return {
    code: ms.toString(),
    map: ms.generateMap({hires: true})
  };
}

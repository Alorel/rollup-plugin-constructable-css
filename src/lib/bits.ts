/** @internal */
export const CLOSING_BRACKET_AND_EXPORT: string = [
  ');',
  '',
  'export default stylesheet;',
  ''
].join('\n');

/** @internal */
export function stylesheetInit(varType: string): string {
  return `${varType} stylesheet = new CSSStyleSheet();\nstylesheet.replaceSync(`;
}

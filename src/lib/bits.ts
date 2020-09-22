/** @internal */
export const CLOSING_BRACKET_AND_EXPORT = `);

export default stylesheet;
`;

/** @internal */
export function stylesheetInit(varType: string): string {
  return `${varType} stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`;
}

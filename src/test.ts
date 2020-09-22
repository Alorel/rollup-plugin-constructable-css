import {expect} from 'chai';
import * as fs from 'fs/promises';
import {join} from 'path';
import {ModuleJSON, rollup, RollupBuild} from 'rollup';
import * as tmp from 'tmp';
import {constructableCssRollupPlugin, ConstructableCssRollupPluginOpts as PluginOpts} from './index';

tmp.setGracefulCleanup();

// eslint-disable-next-line max-lines-per-function
describe('Test', () => {
  let rm: () => void;
  let tmpDir: string;
  let input: string;

  async function writeCss(css: string): Promise<string> {
    const path = join(tmpDir, 'style.css');
    await fs.writeFile(path, css);

    return path;
  }

  async function writeJs(): Promise<string> {
    const path = join(tmpDir, 'index.js');
    await fs.writeFile(path, `import css from './style.css';

console.log(css);`);

    return path;
  }

  async function run(config?: Partial<PluginOpts>): Promise<[RollupBuild, ModuleJSON]> {
    const build = await rollup({
      input,
      plugins: [
        constructableCssRollupPlugin({
          include: /\.css/,
          ...config
        })
      ]
    });
    const module = build.cache!.modules.find(({id}) => id.endsWith('.css'))!;

    return [build, module];
  }

  beforeEach(async() => {
    rm = tmpDir = input = null as any;

    // Create temp dir
    await new Promise<void>((resolve, reject) => {
      tmp.dir({unsafeCleanup: true}, (err, name, removeCallback) => {
        if (err) {
          reject(err);
        } else {
          rm = removeCallback;
          tmpDir = name;
          resolve();
        }
      });
    });

    input = await writeJs();
  });

  afterEach(() => rm && rm());

  it('Should throw if include is not provided', () => {
    const fnCall = () => constructableCssRollupPlugin(null as any);
    expect(fnCall).to.throw('include option missing');
  });

  describe('sourceMap=true', () => {
    it('Should just wrap on a simple unescaped input', async() => {
      await writeCss('body{color:red}');
      const [, module] = await run();

      const exp = [
        'var stylesheet = new CSSStyleSheet();',
        'stylesheet.replaceSync("body{color:red}");',
        '',
        'export default stylesheet;',
        ''
      ].join('\n');

      expect(module.code).to.eq(exp);
    });

    it('Should overwrite with JSON.stringified contents', async() => {
      await writeCss('span::before{content:" "}');
      const [, module] = await run();

      const exp = [
        'var stylesheet = new CSSStyleSheet();',
        'stylesheet.replaceSync("span::before{content:\\" \\"}");',
        '',
        'export default stylesheet;',
        ''
      ].join('\n');

      expect(module.code).to.eq(exp);
    });
  });

  describe('preferConst', () => {

    it('Should use "const" when preferConst is true', async() => {
      await writeCss('body{color:red}');
      const [, module] = await run({preferConst: true, sourceMap: false});

      expect(module.code).to.match(/^const/);
    });
  });

});

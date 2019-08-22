/*eslint-env jest*/
/*eslint-disable import/no-commonjs, @getify/proper-arrows/this*/
const fs = require('fs');
const { processSource } = require('..');

function readFile(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, 'utf8', function(err, code) {
      if (err) {
        reject(err);
        return;
      }
      resolve(code);
    });
  });
}

describe('wrap', () => {
  const command = require('../dist/commands/wrap').default;

  test('string', () => {
    expect(processSource('const a: string = 2', { command })).toBe(
      'const a/*: string*/ = 2',
    );
  });

  test('file', async () => {
    const unwrappedSource = await readFile(
      `${__dirname}/fixtures/unwrapped.js`,
    );
    const wrappedSource = await readFile(`${__dirname}/fixtures/wrapped.js`);

    expect(processSource(unwrappedSource, { command })).toBe(wrappedSource);
  });
});

describe('unwrap', () => {
  const command = require('../dist/commands/unwrap').default;

  test('string', () => {
    expect(processSource('const a/*: string*/ = 2', { command })).toBe(
      'const a: string = 2',
    );
  });

  test('file', async () => {
    const unwrappedSource = await readFile(
      `${__dirname}/fixtures/unwrapped.js`,
    );
    const wrappedSource = await readFile(`${__dirname}/fixtures/wrapped.js`);

    expect(processSource(wrappedSource, { command })).toBe(unwrappedSource);
  });
});

describe('to-htm', () => {
  /*eslint-disable no-template-curly-in-string*/
  const command = require('../dist/commands/to-htm').default;

  function compile(code, options) {
    return processSource(code, { command, ...options });
  }

  describe('import', () => {
    test('import shortcut', () => {
      expect(compile('(<div />);', { import: 'htm/preact' })).toBe(
        'import {html} from "htm/preact";\n(html`<div />`);',
      );
    });

    test('import shortcut, dotted tag', () => {
      expect(
        compile('(<div />);', { tag: 'html.bound', import: 'htm/preact' }),
      ).toBe('import {html} from "htm/preact";\n(html.bound`<div />`);');
    });

    test('named import', () => {
      expect(
        compile('(<div />);', {
          import: { module: 'htm/preact', export: '$html' },
        }),
      ).toBe('import {$html as html} from "htm/preact";\n(html`<div />`);');
    });

    test('named import, dotted tag', () => {
      expect(
        compile('(<div />);', {
          tag: 'html.bound',
          import: { module: 'htm/preact', export: '$html' },
        }),
      ).toBe(
        'import {$html as html} from "htm/preact";\n(html.bound`<div />`);',
      );
    });

    test('default import', () => {
      expect(
        compile('(<div />);', {
          import: { module: 'htm/preact', export: 'default' },
        }),
      ).toBe('import html from "htm/preact";\n(html`<div />`);');
    });

    test('namespace import', () => {
      expect(
        compile('(<div />);', {
          import: { module: 'htm/preact', export: '*' },
        }),
      ).toBe('import * as html from "htm/preact";\n(html`<div />`);');
    });

    test('no import without JSX', () => {
      expect(compile('false;', { import: 'htm/preact' })).toBe('false;');
    });

    test('import before comment when no imports found', () => {
      expect(compile('/**/\n(<div />);', { import: 'htm/preact' })).toBe(
        'import {html} from "htm/preact";\n/**/\n(html`<div />`);',
      );
    });

    test('import after comment when imports found', () => {
      expect(
        compile('/**/\nimport Foo from "foo";\n(<div />);', {
          import: 'htm/preact',
        }),
      ).toBe(
        '/**/\nimport {html} from "htm/preact";\nimport Foo from "foo";\n(html`<div />`);',
      );
    });

    test('no import if already in scope', () => {
      expect(
        compile('import html from "foo";\n(<div />);', {
          import: 'htm/preact',
        }),
      ).toBe('import html from "foo";\n(html`<div />`);');
    });
  });

  describe('elements and text', () => {
    test('single named element', () => {
      expect(compile('(<div />);')).toBe('(html`<div />`);');

      expect(compile('(<div>a</div>);')).toBe('(html`<div>a</div>`);');

      expect(compile('(<div$ />);')).toBe('(html`<div$ />`);');

      expect(compile('(<div$>a</div$>);')).toBe('(html`<div$>a</div$>`);');

      expect(compile('(<div_ />);')).toBe('(html`<div_ />`);');

      expect(compile('(<div_>a</div_>);')).toBe('(html`<div_>a</div_>`);');
    });

    test('single component element', () => {
      expect(compile('(<Foo />);')).toBe('(html`<${Foo} />`);');

      expect(compile('(<Foo>a</Foo>);')).toBe('(html`<${Foo}>a</${Foo}>`);');

      expect(compile('(<$ />);')).toBe('(html`<${$} />`);');

      expect(compile('(<$>a</$>);')).toBe('(html`<${$}>a</${$}>`);');

      expect(compile('(<_ />);')).toBe('(html`<${_} />`);');

      expect(compile('(<_>a</_>);')).toBe('(html`<${_}>a</${_}>`);');

      expect(compile('(<_foo />);')).toBe('(html`<${_foo} />`);');

      expect(compile('(<_foo>a</_foo>);')).toBe(
        '(html`<${_foo}>a</${_foo}>`);',
      );

      expect(compile('(<$foo />);')).toBe('(html`<${$foo} />`);');

      expect(compile('(<$foo>a</$foo>);')).toBe(
        '(html`<${$foo}>a</${$foo}>`);',
      );
    });

    test('dotted component element', () => {
      expect(compile('(<a.b.c />);')).toBe('(html`<${a.b.c} />`);');

      expect(compile('(<a.b.c>a</a.b.c>);')).toBe(
        '(html`<${a.b.c}>a</${a.b.c}>`);',
      );
    });

    test('static text', () => {
      expect(compile('(<div>Hello</div>);')).toBe('(html`<div>Hello</div>`);');
      expect(compile('(<div>こんにちわ</div>);')).toBe(
        '(html`<div>こんにちわ</div>`);',
      );
    });

    test('HTML entities get unescaped', () => {
      expect(compile('(<div>&amp;</div>);')).toBe('(html`<div>&</div>`);');
    });

    test('&lt; gets wrapped into an expression container', () => {
      expect(compile('(<div>a&lt;b&lt;&lt;&lt;c</div>);')).toBe(
        '(html`<div>${"a<b<<<c"}</div>`);',
      );
    });
  });

  describe('fragments', () => {
    test('React.Fragment', () => {
      expect(
        compile(
          '<React.Fragment><div>Foo</div><div>Bar</div></React.Fragment>',
        ),
      ).toBe('html`<div>Foo</div><div>Bar</div>`');
    });

    test('short syntax', () => {
      expect(compile('<><div>Foo</div><div>Bar</div></>')).toBe(
        'html`<div>Foo</div><div>Bar</div>`',
      );
    });

    test('root expressions', () => {
      expect(compile('<React.Fragment>{Foo}{Bar}</React.Fragment>')).toBe(
        'html`${Foo}${Bar}`',
      );
    });
  });

  describe('props', () => {
    test('static values', () => {
      expect(compile('(<div a="a" b="bb" c d />);')).toBe(
        '(html`<div a="a" b="bb" c d />`);',
      );
      expect(compile('(<div a="こんにちわ" />);')).toBe(
        '(html`<div a="こんにちわ" />`);',
      );
    });

    test('HTML entities get unescaped', () => {
      expect(compile('(<div a="&amp;" />);')).toBe('(html`<div a="&" />`);');
    });

    test('double quote values with single quotes', () => {
      expect(compile('(<div a="\'b\'" />);')).toBe(
        '(html`<div a="\'b\'" />`);',
      );
    });

    test('single quote values with double quotes', () => {
      expect(compile('(<div a=\'"b"\' />);')).toBe(
        '(html`<div a=\'"b"\' />`);',
      );
    });

    test('escape values with newlines as expressions', () => {
      expect(compile('(<div a="\n" />);')).toBe('(html`<div a=${`\n`} />`);');
    });

    test('escape values with both single and double quotes as expressions', () => {
      expect(compile('(<div a="&#34;\'" />);')).toBe(
        '(html`<div a=${"\\"\'"} />`);',
      );
    });

    test('expression values', () => {
      expect(
        compile(
          'const Foo = (props, a) => <div a={a} b={"b"} c={{}} d={props.d} e />;',
        ),
      ).toBe(
        'const Foo = (props, a) => html`<div a=${a} b=${"b"} c=${{}} d=${props.d} e />`;',
      );
    });

    test('spread', () => {
      expect(compile('const Foo = props => <div {...props} />;')).toBe(
        'const Foo = props => html`<div ...${props} />`;',
      );

      expect(compile('(<div {...{}} />);')).toBe('(html`<div ...${{}} />`);');

      expect(compile('(<div a {...b} c />);')).toBe(
        '(html`<div a ...${b} c />`);',
      );
    });
  });

  describe('nesting', () => {
    test('element children are merged into one template', () => {
      expect(
        compile(
          'const Foo = () => <div class="foo" draggable>\n  <h1>Hello</h1>\n  <p>world.</p>\n</div>;',
        ),
      ).toBe(
        'const Foo = () => html`<div class="foo" draggable>\n  <h1>Hello</h1>\n  <p>world.</p>\n</div>`;',
      );
    });

    test('inter-element whitespace is collapsed similarly to the JSX plugin', () => {
      expect(
        compile(
          'const Foo = props => <div a b> a \n <em> b \n B </em> c <strong> d </strong> e </div>;',
        ),
      ).toBe(
        'const Foo = props => html`<div a b> a \n <em> b \n B </em> c <strong> d </strong> e </div>`;',
      );
    });

    test('nested JSX Expressions produce nested templates', () => {
      expect(
        compile(
          'const Foo = props => <ul>{props.items.map(item =>\n  <li>\n    {item}\n  </li>\n)}</ul>;',
        ),
      ).toBe(
        'const Foo = props => html`<ul>${props.items.map(item =>\n  html`<li>\n    ${item}\n  </li>`\n)}</ul>`;',
      );
    });

    test('empty expressions are ignored', () => {
      expect(compile('(<div>{/* a comment */}</div>);')).toBe(
        '(html`<div>${""/* a comment */}</div>`);',
      );
    });
  });
});

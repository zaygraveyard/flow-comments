import test from 'ava';
import { processSource } from '../src/main.js';

function compile(code, options) {
  return processSource(code, { command: 'to-htm', ...options });
}

/*eslint-disable no-template-curly-in-string*/
test('import - import shortcut', async (t) => {
  t.is(
    await compile('(<div />);', { import: 'htm/preact' }),
    'import {html} from "htm/preact";\n(html`<div />`);',
  );
});

test('import - import shortcut, dotted tag', async (t) => {
  t.is(
    await compile('(<div />);', { tag: 'html.bound', import: 'htm/preact' }),
    'import {html} from "htm/preact";\n(html.bound`<div />`);',
  );
});

test('import - named import', async (t) => {
  t.is(
    await compile('(<div />);', {
      import: { module: 'htm/preact', export: '$html' },
    }),
    'import {$html as html} from "htm/preact";\n(html`<div />`);',
  );
});

test('import - named import, dotted tag', async (t) => {
  t.is(
    await compile('(<div />);', {
      tag: 'html.bound',
      import: { module: 'htm/preact', export: '$html' },
    }),
    'import {$html as html} from "htm/preact";\n(html.bound`<div />`);',
  );
});

test('import - default import', async (t) => {
  t.is(
    await compile('(<div />);', {
      import: { module: 'htm/preact', export: 'default' },
    }),
    'import html from "htm/preact";\n(html`<div />`);',
  );
});

test('import - namespace import', async (t) => {
  t.is(
    await compile('(<div />);', {
      import: { module: 'htm/preact', export: '*' },
    }),
    'import * as html from "htm/preact";\n(html`<div />`);',
  );
});

test('import - no import without JSX', async (t) => {
  t.is(await compile('false;', { import: 'htm/preact' }), 'false;');
});

test('import - import before comment when no imports found', async (t) => {
  t.is(
    await compile('/**/\n(<div />);', { import: 'htm/preact' }),
    'import {html} from "htm/preact";\n/**/\n(html`<div />`);',
  );
});

test('import - import after comment when imports found', async (t) => {
  t.is(
    await compile('/**/\nimport Foo from "foo";\n(<div />);', {
      import: 'htm/preact',
    }),
    '/**/\nimport {html} from "htm/preact";\nimport Foo from "foo";\n(html`<div />`);',
  );
});

test('import - no import if already in scope', async (t) => {
  t.is(
    await compile('import html from "foo";\n(<div />);', {
      import: 'htm/preact',
    }),
    'import html from "foo";\n(html`<div />`);',
  );
});

test('elements and text - single named element', async (t) => {
  t.is(await compile('(<div />);'), '(html`<div />`);');

  t.is(await compile('(<div>a</div>);'), '(html`<div>a</div>`);');

  t.is(await compile('(<div$ />);'), '(html`<div$ />`);');

  t.is(await compile('(<div$>a</div$>);'), '(html`<div$>a</div$>`);');

  t.is(await compile('(<div_ />);'), '(html`<div_ />`);');

  t.is(await compile('(<div_>a</div_>);'), '(html`<div_>a</div_>`);');
});

test('elements and text - single component element', async (t) => {
  t.is(await compile('(<Foo />);'), '(html`<${Foo} />`);');

  t.is(await compile('(<Foo>a</Foo>);'), '(html`<${Foo}>a</${Foo}>`);');

  t.is(await compile('(<$ />);'), '(html`<${$} />`);');

  t.is(await compile('(<$>a</$>);'), '(html`<${$}>a</${$}>`);');

  t.is(await compile('(<_ />);'), '(html`<${_} />`);');

  t.is(await compile('(<_>a</_>);'), '(html`<${_}>a</${_}>`);');

  t.is(await compile('(<_foo />);'), '(html`<${_foo} />`);');

  t.is(await compile('(<_foo>a</_foo>);'), '(html`<${_foo}>a</${_foo}>`);');

  t.is(await compile('(<$foo />);'), '(html`<${$foo} />`);');

  t.is(await compile('(<$foo>a</$foo>);'), '(html`<${$foo}>a</${$foo}>`);');
});

test('elements and text - dotted component element', async (t) => {
  t.is(await compile('(<a.b.c />);'), '(html`<${a.b.c} />`);');

  t.is(await compile('(<a.b.c>a</a.b.c>);'), '(html`<${a.b.c}>a</${a.b.c}>`);');
});

test('elements and text - static text', async (t) => {
  t.is(await compile('(<div>Hello</div>);'), '(html`<div>Hello</div>`);');
  t.is(
    await compile('(<div>こんにちわ</div>);'),
    '(html`<div>こんにちわ</div>`);',
  );
});

test('elements and text - HTML entities get unescaped', async (t) => {
  t.is(await compile('(<div>&amp;</div>);'), '(html`<div>&</div>`);');
});

test('elements and text - &lt; gets wrapped into an expression container', async (t) => {
  t.is(
    await compile('(<div>a&lt;b&lt;&lt;&lt;c</div>);'),
    '(html`<div>${"a<b<<<c"}</div>`);',
  );
});

test('fragments - React.Fragment', async (t) => {
  t.is(
    await compile(
      '<React.Fragment><div>Foo</div><div>Bar</div></React.Fragment>',
    ),
    'html`<div>Foo</div><div>Bar</div>`',
  );
});

test('fragments - short syntax', async (t) => {
  t.is(
    await compile('<><div>Foo</div><div>Bar</div></>'),
    'html`<div>Foo</div><div>Bar</div>`',
  );
});

test('fragments - root expressions', async (t) => {
  t.is(
    await compile('<React.Fragment>{Foo}{Bar}</React.Fragment>'),
    'html`${Foo}${Bar}`',
  );
});

test('props - static values', async (t) => {
  t.is(
    await compile('(<div a="a" b="bb" c d />);'),
    '(html`<div a="a" b="bb" c d />`);',
  );
  t.is(
    await compile('(<div a="こんにちわ" />);'),
    '(html`<div a="こんにちわ" />`);',
  );
});

test('props - HTML entities get unescaped', async (t) => {
  t.is(await compile('(<div a="&amp;" />);'), '(html`<div a="&" />`);');
});

test('props - double quote values with single quotes', async (t) => {
  t.is(await compile('(<div a="\'b\'" />);'), '(html`<div a="\'b\'" />`);');
});

test('props - single quote values with double quotes', async (t) => {
  t.is(await compile('(<div a=\'"b"\' />);'), '(html`<div a=\'"b"\' />`);');
});

test('props - escape values with newlines as expressions', async (t) => {
  t.is(await compile('(<div a="\n" />);'), '(html`<div a=${`\n`} />`);');
});

test('props - escape values with both single and double quotes as expressions', async (t) => {
  t.is(
    await compile('(<div a="&#34;\'" />);'),
    '(html`<div a=${"\\"\'"} />`);',
  );
});

test('props - expression values', async (t) => {
  t.is(
    await compile(
      'const Foo = (props, a) => <div a={a} b={"b"} c={{}} d={props.d} e />;',
    ),
    'const Foo = (props, a) => html`<div a=${a} b=${"b"} c=${{}} d=${props.d} e />`;',
  );
});

test('props - spread', async (t) => {
  t.is(
    await compile('const Foo = props => <div {...props} />;'),
    'const Foo = props => html`<div ...${props} />`;',
  );

  t.is(await compile('(<div {...{}} />);'), '(html`<div ...${{}} />`);');

  t.is(await compile('(<div a {...b} c />);'), '(html`<div a ...${b} c />`);');
});

test('nesting - element children are merged into one template', async (t) => {
  t.is(
    await compile(
      'const Foo = () => <div class="foo" draggable>\n  <h1>Hello</h1>\n  <p>world.</p>\n</div>;',
    ),
    'const Foo = () => html`<div class="foo" draggable>\n  <h1>Hello</h1>\n  <p>world.</p>\n</div>`;',
  );
});

test('nesting - inter-element whitespace is collapsed similarly to the JSX plugin', async (t) => {
  t.is(
    await compile(
      'const Foo = props => <div a b> a \n <em> b \n B </em> c <strong> d </strong> e </div>;',
    ),
    'const Foo = props => html`<div a b> a \n <em> b \n B </em> c <strong> d </strong> e </div>`;',
  );
});

test('nesting - nested JSX Expressions produce nested templates', async (t) => {
  t.is(
    await compile(
      'const Foo = props => <ul>{props.items.map(item =>\n  <li>\n    {item}\n  </li>\n)}</ul>;',
    ),
    'const Foo = props => html`<ul>${props.items.map(item =>\n  html`<li>\n    ${item}\n  </li>`\n)}</ul>`;',
  );
});

test('nesting - empty expressions are ignored', async (t) => {
  t.is(
    await compile('(<div>{/* a comment */}</div>);'),
    '(html`<div>${""/* a comment */}</div>`);',
  );
});

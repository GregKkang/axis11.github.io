import test from 'node:test';
import assert from 'node:assert/strict';
import { firstBodyParagraph } from './first-body-paragraph.mjs';
const paragraph = (children, level = 0) => [{type:'paragraph_open', level}, {type:'inline', children}, {type:'paragraph_close', level}];
test('skips headings, italic subtitles, quotes and image paragraphs', () => {
  const tokens = [
    {type:'heading_open',level:0}, {type:'inline',children:[{type:'text',content:'Heading'}]}, {type:'heading_close'},
    ...paragraph([{type:'em_open'},{type:'text',content:'Subtitle'},{type:'em_close'}]),
    ...paragraph([{type:'text',content:'Quotation'}], 1),
    ...paragraph([{type:'image',content:'Image caption'}]),
    ...paragraph([{type:'text',content:'Full opening paragraph.'}]),
  ];
  assert.equal(firstBodyParagraph(tokens), 'Full opening paragraph.');
});
test('keeps full length, decoded text, linked words and inline code; omits footnote markers', () => {
  const long = 'A & B '.repeat(60);
  assert.equal(firstBodyParagraph(paragraph([
    {type:'text',content:long},{type:'link_open'},{type:'text',content:'source'},{type:'link_close'},
    {type:'softbreak'},{type:'code_inline',content:'value'},{type:'footnote_ref',content:''},
  ])), long + 'source value');
});
test('returns empty when there is no prose paragraph', () => {
  assert.equal(firstBodyParagraph([{type:'fence',content:'code'}]), '');
});

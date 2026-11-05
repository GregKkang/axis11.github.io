// Receives markdown-it's parsed tokens; no HTML decoding or truncation needed.
export function firstBodyParagraphs(tokens, limit = 4) {
  const paragraphs = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    if (tokens[i].type !== 'paragraph_open' || tokens[i].level !== 0) continue;
    const inline = tokens[i + 1];
    if (inline.type !== 'inline') continue;
    const children = inline.children ?? [];
    // AXIS11 articles commonly begin with an italic subtitle.
    if (children[0]?.type === 'em_open' && children.at(-1)?.type === 'em_close') continue;
    const text = children.map(token =>
      ['text', 'code_inline'].includes(token.type) ? token.content :
      ['softbreak', 'hardbreak'].includes(token.type) ? ' ' : ''
    ).join('').replace(/\s+/g, ' ').trim();
    if (text) paragraphs.push(text);
    if (paragraphs.length === limit) break;
  }
  return paragraphs;
}

export function firstBodyParagraph(tokens) {
  return firstBodyParagraphs(tokens, 1)[0] ?? '';
}

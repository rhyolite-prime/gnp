// Run with: node --experimental-strip-types --test tests/rememberWhenPrompt.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REMEMBER_WHEN_SYSTEM_PROMPT,
  REMEMBER_WHEN_JSON_SCHEMA,
  REMEMBER_WHEN_FEW_SHOT_EXAMPLES,
  buildRememberWhenUserPromptText,
  buildRememberWhenPrompt,
  formatOpenAiVisionPayload,
  formatAnthropicVisionPayload,
  formatGeminiVisionPayload,
  parseRememberWhenAiResponse,
  formatRememberWhenForCms,
  generateSimulatedRememberWhen,
} from '../utils/rememberWhenPrompt.ts';
import { validateRememberWhenSlidePayload } from '../utils/cmsContent.ts';

test('REMEMBER_WHEN_SYSTEM_PROMPT establishes archival role, deliverables, constraints, and guidelines', () => {
  assert.match(REMEMBER_WHEN_SYSTEM_PROMPT, /Senior Archival Historian and Chief Digital Curator/);
  assert.match(REMEMBER_WHEN_SYSTEM_PROMPT, /Graphic NewsPlus/);
  assert.match(REMEMBER_WHEN_SYSTEM_PROMPT, /"headline"/);
  assert.match(REMEMBER_WHEN_SYSTEM_PROMPT, /"description"/);
  assert.match(REMEMBER_WHEN_SYSTEM_PROMPT, /"keywords"/);
  assert.match(REMEMBER_WHEN_SYSTEM_PROMPT, /50-120 characters/);
  assert.match(REMEMBER_WHEN_SYSTEM_PROMPT, /180-350 characters/);
  assert.match(REMEMBER_WHEN_SYSTEM_PROMPT, /6 to 12 strings/);
  assert.match(REMEMBER_WHEN_SYSTEM_PROMPT, /Masthead & Dateline Parsing/);
  assert.match(REMEMBER_WHEN_SYSTEM_PROMPT, /OCR & Archival Print Compensation/);
  assert.match(REMEMBER_WHEN_SYSTEM_PROMPT, /NEVER hallucinate/);
});

test('REMEMBER_WHEN_JSON_SCHEMA enforces required keys and structural limits', () => {
  assert.equal(REMEMBER_WHEN_JSON_SCHEMA.type, 'object');
  assert.deepEqual(
    REMEMBER_WHEN_JSON_SCHEMA.required,
    ['headline', 'description', 'keywords', 'date', 'publicationName', 'label'],
  );
  assert.equal(REMEMBER_WHEN_JSON_SCHEMA.properties.headline.maxLength, 140);
  assert.equal(REMEMBER_WHEN_JSON_SCHEMA.properties.keywords.type, 'array');
});

test('REMEMBER_WHEN_FEW_SHOT_EXAMPLES provides realistic Ghanaian historical front pages', () => {
  assert.equal(REMEMBER_WHEN_FEW_SHOT_EXAMPLES.length >= 3, true);

  const independence = REMEMBER_WHEN_FEW_SHOT_EXAMPLES[0];
  assert.match(independence.title, /Independence/);
  assert.equal(independence.expectedOutput.date, '1957-03-06');
  assert.equal(independence.expectedOutput.publicationName, 'Daily Graphic');
  assert.match(independence.expectedOutput.headline, /Independence/);
  assert.ok(independence.expectedOutput.keywords.includes('Kwame Nkrumah'));
  assert.ok(independence.expectedOutput.keywords.includes('Ghana Independence'));

  const afcon = REMEMBER_WHEN_FEW_SHOT_EXAMPLES[1];
  assert.match(afcon.title, /AFCON/);
  assert.equal(afcon.expectedOutput.date, '1982-03-15');
  assert.ok(afcon.expectedOutput.keywords.includes('Black Stars'));
});

test('buildRememberWhenUserPromptText interpolates hints and defaults cleanly', () => {
  const empty = buildRememberWhenUserPromptText();
  assert.match(empty, /No prior editorial hints provided/);

  const hinted = buildRememberWhenUserPromptText({
    publicationNameHint: 'The Mirror',
    dateHint: '1960-07-02',
    storyFocusHint: 'Presidential inauguration ceremony',
    targetAudience: 'National heritage readers',
  });
  assert.match(hinted, /The Mirror/);
  assert.match(hinted, /1960-07-02/);
  assert.match(hinted, /Presidential inauguration ceremony/);
  assert.match(hinted, /National heritage readers/);
});

test('formatOpenAiVisionPayload formats multimodal messages for gpt-4o', () => {
  const payload = formatOpenAiVisionPayload({
    image: 'https://cdn.example.com/daily-graphic-1957.jpg',
    publicationNameHint: 'Daily Graphic',
    dateHint: '1957-03-06',
  });

  assert.equal(payload.model, 'gpt-4o');
  assert.deepEqual(payload.response_format, { type: 'json_object' });
  const messages = payload.messages;
  assert.equal(messages[0].role, 'system');
  assert.equal(messages[0].content, REMEMBER_WHEN_SYSTEM_PROMPT);
  assert.equal(messages[1].role, 'user');
  assert.equal(messages[1].content[0].type, 'text');
  assert.equal(messages[1].content[1].type, 'image_url');
  assert.equal(messages[1].content[1].image_url.url, 'https://cdn.example.com/daily-graphic-1957.jpg');
});

test('formatAnthropicVisionPayload formats Claude 3.5 Sonnet payload with data URLs and URLs', () => {
  const urlPayload = formatAnthropicVisionPayload({
    image: 'https://cdn.example.com/frontpage.jpg',
  });
  assert.equal(urlPayload.model, 'claude-3-5-sonnet-20241022');
  assert.equal(urlPayload.messages[0].content[0].type, 'image');
  assert.equal(urlPayload.messages[0].content[0].source.type, 'url');

  const b64Payload = formatAnthropicVisionPayload({
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  });
  assert.equal(b64Payload.messages[0].content[0].source.type, 'base64');
  assert.equal(b64Payload.messages[0].content[0].source.media_type, 'image/png');
});

test('formatGeminiVisionPayload formats Gemini 1.5 Pro multimodal contents', () => {
  const geminiPayload = formatGeminiVisionPayload({
    image: 'data:image/jpeg;base64,abc123fake',
  });
  assert.ok(geminiPayload.contents);
  assert.equal(geminiPayload.contents[0].parts[1].inline_data.mime_type, 'image/jpeg');
  assert.equal(geminiPayload.contents[0].parts[1].inline_data.data, 'abc123fake');
});

test('buildRememberWhenPrompt returns complete bundle for all providers', () => {
  const openAiBundle = buildRememberWhenPrompt({ provider: 'openai', image: '/images/explore-archives.jpg' });
  assert.equal(openAiBundle.systemPrompt, REMEMBER_WHEN_SYSTEM_PROMPT);
  assert.ok(openAiBundle.providerPayload.messages);

  const genericBundle = buildRememberWhenPrompt({ provider: 'generic' });
  assert.ok(genericBundle.providerPayload.systemPrompt);
  assert.ok(genericBundle.providerPayload.jsonSchema);
});

test('parseRememberWhenAiResponse extracts JSON from raw strings, code fences, and objects', () => {
  // Case 1: Markdown code fenced json
  const markdownFenced = `
Here is the extracted archival metadata for the front page:
\`\`\`json
{
  "headline": "Ghana Attains Independence: Kwame Nkrumah Declares Nation Free Forever",
  "description": "At midnight on March 6, 1957, Prime Minister Kwame Nkrumah proclaimed Ghana's freedom before tens of thousands at the Old Polo Grounds in Accra. The historic moment heralded the dawn of African liberation.",
  "keywords": ["Ghana Independence", "Kwame Nkrumah", "Accra", "Old Polo Grounds", "Daily Graphic", "1957", "Decolonisation"],
  "date": "1957-03-06",
  "publicationName": "Daily Graphic",
  "label": "Independence Day 1957",
  "ctaLabel": "Revisit this story →",
  "historicalSignificance": "The founding moment of modern sovereign Ghana.",
  "transcribedSnippet": "Ghana is free forever! The long battle has ceased.",
  "pageQuality": "readable",
  "confidence": 0.98
}
\`\`\`
Hope this helps!`;

  const parsed1 = parseRememberWhenAiResponse(markdownFenced);
  assert.equal(parsed1.headline, 'Ghana Attains Independence: Kwame Nkrumah Declares Nation Free Forever');
  assert.equal(parsed1.date, '1957-03-06');
  assert.equal(parsed1.publicationName, 'Daily Graphic');
  assert.equal(parsed1.label, 'Independence Day 1957');
  assert.ok(parsed1.keywords.includes('Ghana Independence'));
  assert.ok(parsed1.keywords.includes('Kwame Nkrumah'));
  assert.equal(parsed1.confidence, 0.98);

  // Case 2: Direct object with messy keyword strings and extra spaces
  const dirtyObj = {
    headline: '<b>Massive Housing Scheme Launched in Accra</b>',
    description: '<p>Government unveils 5,000 unit social housing project.</p>',
    keywords: 'Housing, Infrastructure, Accra, Housing, #dailygraphic, 1978',
    date: '1978/04/12',
    publicationName: 'Daily Graphic ',
  };

  const parsed2 = parseRememberWhenAiResponse(dirtyObj);
  assert.equal(parsed2.headline, 'Massive Housing Scheme Launched in Accra');
  assert.equal(parsed2.date, '1978-04-12');
  assert.ok(parsed2.keywords.includes('Housing'));
  assert.ok(parsed2.keywords.includes('Accra'));
  // deduplication check
  assert.equal(parsed2.keywords.filter(k => k.toLowerCase() === 'housing').length, 1);
});

test('parseRememberWhenAiResponse applies fallbacks on empty or malformed inputs', () => {
  const fallback = parseRememberWhenAiResponse('completely unparseable junk', {
    publicationNameHint: 'The Mirror',
    dateHint: '1965-02-14',
  });

  assert.equal(fallback.publicationName, 'The Mirror');
  assert.equal(fallback.date, '1965-02-14');
  assert.match(fallback.headline, /The Mirror/);
  assert.ok(fallback.keywords.length >= 3);
  assert.ok(fallback.keywords.includes('The Mirror'));
  assert.ok(fallback.keywords.includes('1965'));
});

test('formatRememberWhenForCms produces valid RememberWhenSlide payload', () => {
  const aiResult = {
    headline: 'Ghana Achieves Independence: Midnight Proclamation at Old Polo Grounds',
    description:
      'At midnight on March 6, 1957, Prime Minister Kwame Nkrumah declared to cheering thousands that Ghana was free forever.',
    keywords: ['Ghana Independence', 'Kwame Nkrumah', '1957', 'Old Polo Grounds', 'Daily Graphic'],
    date: '1957-03-06',
    publicationName: 'Daily Graphic',
    label: 'Independence Day 1957',
    ctaLabel: 'Revisit this story →',
  };

  const cmsPayload = formatRememberWhenForCms(aiResult, {
    imageUrl: '/images/explore-archives.jpg',
    archiveId: 'arch-1957-03-06',
  });

  assert.equal(cmsPayload.headline, aiResult.headline);
  assert.equal(cmsPayload.date, '1957-03-06');
  assert.equal(cmsPayload.archiveId, 'arch-1957-03-06');
  assert.equal(cmsPayload.ctaUrl, '/archives/arch-1957-03-06');
  assert.deepEqual(cmsPayload.keywords, aiResult.keywords);

  const validation = validateRememberWhenSlidePayload(cmsPayload);
  assert.equal(validation.valid, true);
  assert.equal(validation.data.headline, aiResult.headline);
  assert.deepEqual(validation.data.keywords, aiResult.keywords);
});

test('generateSimulatedRememberWhen handles preset and dynamic archive simulations', () => {
  const indep = generateSimulatedRememberWhen({ dateHint: '1957-03-06' });
  assert.match(indep.headline, /Independence/);
  assert.equal(indep.date, '1957-03-06');

  const sports = generateSimulatedRememberWhen({ storyFocusHint: 'AFCON championship' });
  assert.match(sports.headline, /AFCON/);

  const generic = generateSimulatedRememberWhen({ publicationNameHint: 'The Mirror', dateHint: '1990-11-20' });
  assert.equal(generic.publicationName, 'The Mirror');
  assert.equal(generic.date, '1990-11-20');
  assert.ok(generic.keywords.includes('The Mirror'));
  assert.ok(generic.keywords.includes('1990'));
});

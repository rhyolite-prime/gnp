/**
 * Remember When AI Vision Prompt Specification & Pipeline
 *
 * Given a newspaper page (in the form of an image) as an input, this module builds
 * a prompt for multimodal vision models (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro)
 * to generate the headline, narrative description, and taxonomic keywords for Graphic
 * NewsPlus's "Remember When" archival retrospective carousel on the homepage.
 */

import type { RememberWhenSlide, RememberWhenStatus } from '~/utils/cmsContent';

export interface RememberWhenAiGeneratedResult {
  /** Concise, impactful archival headline (50-120 chars, max 140 chars) */
  headline: string;
  /** Nostalgic, narrative retrospective summary (180-350 chars, 2-3 sentences) */
  description: string;
  /** 6-12 categorised search & taxonomy tags (entities, events, places, decade) */
  keywords: string[];
  /** Publication date extracted from masthead in YYYY-MM-DD format */
  date: string;
  /** Publication brand (e.g. Daily Graphic, The Mirror, Graphic Sports) */
  publicationName: string;
  /** Badge/eyebrow label (e.g. "67 Years Ago Today", "March 6, 1957", "Historic Milestone") */
  label: string;
  /** Engaging call-to-action button text */
  ctaLabel?: string;
  /** 1-2 sentence analytical statement on the historical significance */
  historicalSignificance?: string;
  /** Verbatim excerpt transcribed from the visible banner/subhead for editorial audit */
  transcribedSnippet?: string;
  /** Visual scan condition assessment */
  pageQuality?: 'pristine' | 'readable' | 'faded' | 'damaged';
  /** Model confidence score between 0.0 and 1.0 */
  confidence?: number;
}

export interface BuildRememberWhenPromptOptions {
  /** Image URL, base64 data URL (`data:image/...`), or local image path */
  image?: string;
  /** Optional publication name hint if already known (e.g. "Daily Graphic") */
  publicationNameHint?: string;
  /** Optional date hint if partially known (e.g. "1957" or "1957-03-06") */
  dateHint?: string;
  /** Optional focal story guidance (e.g. "Focus on the boxing championship story at the bottom") */
  storyFocusHint?: string;
  /** Target audience tone or cultural lens */
  targetAudience?: string;
  /** Additional editorial notes or context */
  additionalContext?: string;
  /** Target provider format for the generated payload */
  provider?: 'generic' | 'openai' | 'anthropic' | 'gemini';
}

export interface FewShotExample {
  title: string;
  context: string;
  expectedOutput: RememberWhenAiGeneratedResult;
}

export interface RememberWhenPromptBundle {
  systemPrompt: string;
  userPromptText: string;
  jsonSchema: Record<string, unknown>;
  fewShotExamples: readonly FewShotExample[];
  providerPayload: unknown;
}

// ── System Prompt ─────────────────────────────────────────────────────────────

export const REMEMBER_WHEN_SYSTEM_PROMPT = `You are the Senior Archival Historian and Chief Digital Curator at Graphic NewsPlus (GNP), the digital archival platform of the Graphic Communications Group Limited (GCGL) in Accra, Ghana. GCGL has published Ghana's leading national newspapers—including the Daily Graphic (est. 1950), The Mirror (est. 1953), Graphic Sports, Graphic Business, and Graphic Showbiz—for over seven decades.

YOUR MISSION:
Analyze the provided digitized newspaper page image (which may be a historic or contemporary front page, feature page, or sports page) and generate the core editorial copy and classification metadata for Graphic NewsPlus's flagship "Remember When" retrospective carousel featured on the homepage.

The "Remember When" carousel celebrates historical milestones, cultural memories, political turning points, and nostalgic moments that shaped Ghana, West Africa, and the wider world.

CORE DELIVERABLES (REQUIRED):
1. "headline" (String, 50-120 characters, strictly maximum 140 characters):
   - A crisp, captivating, journalistic headline that captures the primary historical milestone or lead front-page story visible on the page.
   - Use active voice and dignified archival tone. Avoid clickbait, vague generalities ("An old newspaper article"), or sensationalism.
   - If multiple stories appear on the front page, select the lead story (the splash/banner headline with the highest typographical weight), unless the user specifies a particular focal story.

2. "description" (String, 180-350 characters, 2-3 sentences):
   - An evocative, nostalgic, narrative retrospective summary written for readers looking back in time.
   - Sentence 1: Detail the milestone event, identifying who was involved, what transpired, where it took place, and the date.
   - Sentence 2: Provide historical context on the societal, political, or cultural significance of the moment.
   - Sentence 3: Connect the past to the present—explain why this front page remains an unforgettable part of our collective heritage.

3. "keywords" (Array of 6 to 12 strings):
   - A comprehensive, deduplicated set of search and indexing tags covering:
     * Named entities & personalities (e.g. "Kwame Nkrumah", "Azumah Nelson", "Jerry John Rawlings", "Queen Elizabeth II")
     * Key locations & landmarks (e.g. "Accra", "Old Polo Grounds", "Kumasi", "Tripoli", "Black Star Square")
     * Primary historical event / topic (e.g. "Ghana Independence", "1982 AFCON Championship", "First Republic", "1992 Constitution")
     * Broad categorical domain (e.g. "Politics & Governance", "Sports History", "Economy", "Culture & Arts")
     * Temporal anchor / decade (e.g. "1957", "1950s", "1980s")
     * Source brand (e.g. "Daily Graphic", "Archival Front Page")

ACCOMPANYING METADATA (EXTRACTED FROM THE IMAGE):
- "date": Publication date in strict ISO format "YYYY-MM-DD". Locate the masthead dateline (typically below the newspaper title banner). If day/month is blurred, deduce from historical context or provide "YYYY-MM-01".
- "publicationName": Publication brand name found in the masthead (e.g. "Daily Graphic", "The Mirror", "Graphic Sports", "Graphic Business"). Default to "Daily Graphic" if unclear.
- "label": Contextual temporal or milestone badge for the slide pill (e.g. "67 Years Ago Today", "March 6, 1957", "AFCON Glory 1982", "Historic Milestone").
- "ctaLabel": Action prompt (e.g. "Revisit this story →", "Read the 1957 Edition →", "Explore the Archive →").
- "historicalSignificance": 1-2 sentence analytical statement explaining the historical weight and lasting legacy.
- "transcribedSnippet": Verbatim excerpt (25-60 words) transcribed directly from the visible lead banner, deck, or opening sentence for editorial verification.
- "pageQuality": Visual scan condition: "pristine" | "readable" | "faded" | "damaged".
- "confidence": Float between 0.00 and 1.00 indicating visual legibility and factual certainty.

IMAGE INSPECTION GUIDELINES:
1. Masthead & Dateline Parsing:
   - Examine the top 15% of the page. Look for the paper's title banner, dateline (day of week, month, day, year), issue number, volume, and original price (e.g., "Daily Graphic, Wednesday, March 6, 1957. Price 2d.").
2. Lead Headline Identification:
   - Identify the largest bold font spanning multiple columns (the splash/banner headline).
   - Read the sub-headline ("deck") and lead opening paragraph.
   - Associate front-page photographs, captions, and portraits with the headline.
3. OCR & Archival Print Compensation:
   - Archival scans often suffer from aged newsprint, yellowing, bleed-through ink, creases, or microfilm grain.
   - Cross-reference visible text fragments with verified historical records (e.g., recognizing "Nkr...ah" and "Indep...nce" as "Dr. Kwame Nkrumah" and "Independence").
   - NEVER hallucinate fictional events, nonexistent names, or false dates.
4. Editorial Discretion:
   - If the front page contains an advertisement rather than editorial news, capture it as a historical commercial milestone or focus on the main news column.

OUTPUT FORMAT:
Respond with STRICT, VALID JSON ONLY conforming to the JSON schema. Do NOT include markdown code blocks, preambles, or conversational commentary.`;

// ── JSON Schema ───────────────────────────────────────────────────────────────

export const REMEMBER_WHEN_JSON_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'RememberWhenAiGeneratedResult',
  type: 'object',
  required: ['headline', 'description', 'keywords', 'date', 'publicationName', 'label'],
  properties: {
    headline: {
      type: 'string',
      description: 'Crisp, captivating archival headline for the Remember When slide (50-120 chars, max 140).',
      minLength: 20,
      maxLength: 140,
    },
    description: {
      type: 'string',
      description: 'Nostalgic narrative retrospective summary (180-350 chars, 2-3 sentences).',
      minLength: 100,
      maxLength: 400,
    },
    keywords: {
      type: 'array',
      description: '6 to 12 distinct keywords categorizing people, places, events, themes, and decade.',
      items: { type: 'string' },
      minItems: 5,
      maxItems: 15,
    },
    date: {
      type: 'string',
      description: 'Publication date in YYYY-MM-DD ISO format.',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    },
    publicationName: {
      type: 'string',
      description: 'Name of the publication (e.g. Daily Graphic, The Mirror, Graphic Sports).',
    },
    label: {
      type: 'string',
      description: 'Temporal or milestone pill label (e.g. "67 Years Ago Today", "March 6, 1957").',
      maxLength: 80,
    },
    ctaLabel: {
      type: 'string',
      description: 'Call-to-action button text (e.g. "Revisit this story →").',
      maxLength: 40,
    },
    historicalSignificance: {
      type: 'string',
      description: 'Brief 1-2 sentence analytical statement on why this front page matters.',
    },
    transcribedSnippet: {
      type: 'string',
      description: 'Verbatim excerpt transcribed from the headline, subhead deck, or lead sentence.',
    },
    pageQuality: {
      type: 'string',
      enum: ['pristine', 'readable', 'faded', 'damaged'],
      description: 'Visual condition of the scanned newspaper page.',
    },
    confidence: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      description: 'Model confidence score for legibility and date certainty.',
    },
  },
  additionalProperties: false,
} as const;

// ── Few-Shot Demonstrations ───────────────────────────────────────────────────

export const REMEMBER_WHEN_FEW_SHOT_EXAMPLES: readonly FewShotExample[] = [
  {
    title: 'Ghana Independence Day Front Page (1957)',
    context:
      'Digitized front page of Daily Graphic, Wednesday, March 6, 1957. Splash banner headline reads: "GHANA IS FREE! MIDNIGHT PROCLAMATION BY DR. NKRUMAH". Photo shows Kwame Nkrumah with Kojo Botsio and Komla Gbedemah at the Old Polo Grounds.',
    expectedOutput: {
      headline: 'Ghana Achieves Independence: Midnight Proclamation at Old Polo Grounds',
      description:
        'At midnight on March 6, 1957, Prime Minister Kwame Nkrumah declared to cheering thousands that Ghana was free forever. The historic proclamation marked the birth of sub-Saharan Africa\'s first independent nation, inspiring liberation movements across the continent.',
      keywords: [
        'Ghana Independence',
        'Kwame Nkrumah',
        'Old Polo Grounds',
        'Accra',
        'Daily Graphic',
        '1957',
        '1950s',
        'Decolonisation',
        'Pan-Africanism',
        'National Sovereignty',
      ],
      date: '1957-03-06',
      publicationName: 'Daily Graphic',
      label: 'Independence Day 1957',
      ctaLabel: 'Revisit this story →',
      historicalSignificance:
        'The definitive front page heralding modern Ghana\'s sovereignty and the dawn of African independence.',
      transcribedSnippet:
        'Ghana is free forever! The long battle has ceased and today our beloved country is free.',
      pageQuality: 'readable',
      confidence: 0.98,
    },
  },
  {
    title: 'Black Stars 4th AFCON Victory in Tripoli (1982)',
    context:
      'Front page of Daily Graphic, Monday, March 15, 1982. Splash banner: "BLACK STARS WIN 4TH AFRICAN CUP! GHANA DEFEATS LIBYA 7-6 IN PENALTY DRAMA". Photo shows captain Emmanuel Quarshie hoisting the trophy with a young Abedi Pele.',
    expectedOutput: {
      headline: 'Black Stars Clinch Fourth AFCON Crown in Thrilling Tripoli Shootout',
      description:
        'In a dramatic final in Tripoli, Ghana\'s Black Stars defeated host nation Libya on penalties to capture their fourth African Cup of Nations title. The triumph cemented Ghana\'s status as a continental football powerhouse and sparked nationwide celebrations.',
      keywords: [
        'AFCON 1982',
        'Black Stars',
        'Emmanuel Quarshie',
        'Abedi Pele',
        'Tripoli',
        'Libya',
        'Football',
        'Daily Graphic',
        '1982',
        '1980s',
        'African Cup of Nations',
        'Sports History',
      ],
      date: '1982-03-15',
      publicationName: 'Daily Graphic',
      label: 'AFCON Glory 1982',
      ctaLabel: 'Revisit this match →',
      historicalSignificance:
        'Ghana\'s historic fourth continental championship, making them the most successful nation in AFCON history at the time.',
      transcribedSnippet:
        'A heroic shootout victory in Tripoli seals Ghana\'s fourth continental crown amidst roaring applause.',
      pageQuality: 'readable',
      confidence: 0.95,
    },
  },
  {
    title: 'Inauguration of the First Republic (1960)',
    context:
      'Front page of The Mirror, Saturday, July 2, 1960. Headline: "REPUBLIC OF GHANA INAUGURATED: OSAGYEFO SWORN IN AS FIRST PRESIDENT". Photo: Dr. Kwame Nkrumah taking the presidential oath of office at Parliament House.',
    expectedOutput: {
      headline: 'First Republic Declared: Dr. Kwame Nkrumah Inaugurated as President',
      description:
        'Ghana formally transitioned to a constitutional republic on July 1, 1960, replacing the British monarch with an indigenous head of state. Osagyefo Dr. Kwame Nkrumah took the presidential oath before Parliament, ushering in the First Republic.',
      keywords: [
        'First Republic',
        'Kwame Nkrumah',
        'Presidential Inauguration',
        'The Mirror',
        '1960',
        '1960s',
        'Accra',
        'Sovereignty',
        'Constitution',
        'Parliament House',
      ],
      date: '1960-07-02',
      publicationName: 'The Mirror',
      label: 'Republic Day 1960',
      ctaLabel: 'Read the Republic Edition →',
      historicalSignificance:
        'The formal constitutional birth of the Republic of Ghana, establishing complete executive sovereignty.',
      transcribedSnippet:
        'Osagyefo Dr. Kwame Nkrumah took the oath of office yesterday as the first President of the Republic of Ghana.',
      pageQuality: 'readable',
      confidence: 0.96,
    },
  },
];

// ── User Prompt Template ──────────────────────────────────────────────────────

export const REMEMBER_WHEN_USER_PROMPT_TEMPLATE = `Please analyze the accompanying newspaper page image and generate the Remember When Slide assets according to the archival curation guidelines.

INPUT CONTEXT:
{{CONTEXT_HINTS}}

INSTRUCTIONS:
1. Examine the masthead at the top: identify the publication title and extract the exact publication date (YYYY-MM-DD).
2. Locate the most prominent lead headline, primary photographs, and subhead decks.
3. Formulate:
   - "headline": captivating, historically grounded, 50-120 chars (max 140).
   - "description": nostalgic retrospective narrative, 180-350 chars (2-3 sentences).
   - "keywords": 6-12 distinct tags across entities, places, event topics, category, and decade.
   - Accompanying fields: "date", "publicationName", "label", "ctaLabel", "historicalSignificance", "transcribedSnippet", "pageQuality", and "confidence".
4. Output strictly valid JSON matching the schema.`;

/**
 * Builds the user prompt text by interpolating optional context hints.
 */
export function buildRememberWhenUserPromptText(options: BuildRememberWhenPromptOptions = {}): string {
  const hints: string[] = [];

  if (options.publicationNameHint) {
    hints.push(`- Publication Name Hint: ${options.publicationNameHint.trim()}`);
  }
  if (options.dateHint) {
    hints.push(`- Date Hint: ${options.dateHint.trim()}`);
  }
  if (options.storyFocusHint) {
    hints.push(`- Story Focus Hint: ${options.storyFocusHint.trim()}`);
  }
  if (options.targetAudience) {
    hints.push(`- Target Audience Tone: ${options.targetAudience.trim()}`);
  }
  if (options.additionalContext) {
    hints.push(`- Additional Editorial Context: ${options.additionalContext.trim()}`);
  }

  const contextText = hints.length
    ? hints.join('\n')
    : '- No prior editorial hints provided. Extract all metadata directly from the page image.';

  return REMEMBER_WHEN_USER_PROMPT_TEMPLATE.replace('{{CONTEXT_HINTS}}', contextText);
}

// ── Provider Payloads ─────────────────────────────────────────────────────────

/**
 * Formats the prompt bundle into standard OpenAI Chat Completion payload format (e.g. gpt-4o).
 */
export function formatOpenAiVisionPayload(
  options: BuildRememberWhenPromptOptions = {},
): Record<string, unknown> {
  const userText = buildRememberWhenUserPromptText(options);
  const imageUrl = options.image || '/images/explore-archives.jpg';

  return {
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_tokens: 1000,
    messages: [
      {
        role: 'system',
        content: REMEMBER_WHEN_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: userText,
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
              detail: 'high',
            },
          },
        ],
      },
    ],
  };
}

/**
 * Formats the prompt bundle into Anthropic Claude Messages format (e.g. claude-3-5-sonnet).
 */
export function formatAnthropicVisionPayload(
  options: BuildRememberWhenPromptOptions = {},
): Record<string, unknown> {
  const userText = buildRememberWhenUserPromptText(options);
  const rawImage = options.image || '/images/explore-archives.jpg';

  const isDataUrl = rawImage.startsWith('data:');
  let imageBlock: Record<string, unknown>;

  if (isDataUrl) {
    const match = rawImage.match(/^data:([^;]+);base64,(.+)$/);
    imageBlock = {
      type: 'image',
      source: {
        type: 'base64',
        media_type: match?.[1] || 'image/jpeg',
        data: match?.[2] || '',
      },
    };
  } else {
    imageBlock = {
      type: 'image',
      source: {
        type: 'url',
        url: rawImage,
      },
    };
  }

  return {
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    temperature: 0.2,
    system: REMEMBER_WHEN_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          imageBlock,
          {
            type: 'text',
            text: `${userText}\n\nRespond with valid JSON matching the following schema:\n${JSON.stringify(REMEMBER_WHEN_JSON_SCHEMA, null, 2)}`,
          },
        ],
      },
    ],
  };
}

/**
 * Formats the prompt bundle into Google Gemini GenerateContent format (e.g. gemini-1.5-pro).
 */
export function formatGeminiVisionPayload(
  options: BuildRememberWhenPromptOptions = {},
): Record<string, unknown> {
  const userText = buildRememberWhenUserPromptText(options);
  const rawImage = options.image || '/images/explore-archives.jpg';

  const parts: Array<Record<string, unknown>> = [
    { text: `${REMEMBER_WHEN_SYSTEM_PROMPT}\n\n${userText}` },
  ];

  if (rawImage.startsWith('data:')) {
    const match = rawImage.match(/^data:([^;]+);base64,(.+)$/);
    parts.push({
      inline_data: {
        mime_type: match?.[1] || 'image/jpeg',
        data: match?.[2] || '',
      },
    });
  } else {
    parts.push({
      file_data: {
        file_uri: rawImage,
        mime_type: 'image/jpeg',
      },
    });
  }

  return {
    contents: [
      {
        role: 'user',
        parts,
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: REMEMBER_WHEN_JSON_SCHEMA,
    },
  };
}

/**
 * Constructs a full Remember When Vision Prompt Bundle for the desired provider.
 */
export function buildRememberWhenPrompt(
  options: BuildRememberWhenPromptOptions = {},
): RememberWhenPromptBundle {
  const provider = options.provider || 'generic';
  const userPromptText = buildRememberWhenUserPromptText(options);

  let providerPayload: unknown;
  switch (provider) {
    case 'openai':
      providerPayload = formatOpenAiVisionPayload(options);
      break;
    case 'anthropic':
      providerPayload = formatAnthropicVisionPayload(options);
      break;
    case 'gemini':
      providerPayload = formatGeminiVisionPayload(options);
      break;
    default:
      providerPayload = {
        systemPrompt: REMEMBER_WHEN_SYSTEM_PROMPT,
        userPrompt: userPromptText,
        image: options.image || '/images/explore-archives.jpg',
        jsonSchema: REMEMBER_WHEN_JSON_SCHEMA,
      };
      break;
  }

  return {
    systemPrompt: REMEMBER_WHEN_SYSTEM_PROMPT,
    userPromptText,
    jsonSchema: REMEMBER_WHEN_JSON_SCHEMA,
    fewShotExamples: REMEMBER_WHEN_FEW_SHOT_EXAMPLES,
    providerPayload,
  };
}

// ── Response Parsing & Validation ─────────────────────────────────────────────

/**
 * Strips HTML tags, trims extra whitespace, and normalizes characters.
 */
function cleanText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses and validates raw AI output from a vision model.
 * Handles markdown fences, raw JSON strings, and partial/nested objects.
 */
export function parseRememberWhenAiResponse(
  rawInput: unknown,
  fallbackHints: { publicationNameHint?: string; dateHint?: string } = {},
): RememberWhenAiGeneratedResult {
  let jsonObj: Record<string, unknown> = {};

  if (typeof rawInput === 'string') {
    let cleaned = rawInput.trim();
    // Strip markdown code fences if present (```json ... ``` or ``` ...)
    const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch?.[1]) {
      cleaned = codeBlockMatch[1].trim();
    } else {
      // Find outermost curly braces
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        cleaned = cleaned.slice(start, end + 1);
      }
    }

    try {
      jsonObj = JSON.parse(cleaned);
    } catch {
      jsonObj = {};
    }
  } else if (rawInput && typeof rawInput === 'object') {
    jsonObj = rawInput as Record<string, unknown>;
  }

  // Publication Name
  const rawPublication = cleanText(
    jsonObj.publicationName || jsonObj.publication || fallbackHints.publicationNameHint || 'Daily Graphic',
  );
  const publicationName = rawPublication.slice(0, 80) || 'Daily Graphic';

  // Date parsing
  let date = '';
  const rawDate = cleanText(jsonObj.date || jsonObj.publicationDate || fallbackHints.dateHint || '');
  const dateMatch = rawDate.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (dateMatch) {
    const y = dateMatch[1];
    const m = dateMatch[2]!.padStart(2, '0');
    const d = dateMatch[3]!.padStart(2, '0');
    date = `${y}-${m}-${d}`;
  } else {
    // If year only is provided
    const yearMatch = rawDate.match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) {
      date = `${yearMatch[1]}-01-01`;
    } else {
      date = new Date().toISOString().slice(0, 10);
    }
  }

  // Headline (50-120 chars ideal, max 140)
  let headline = cleanText(jsonObj.headline || jsonObj.title || '');
  if (!headline) {
    headline = `${publicationName} Archival Edition: Historic Moments from ${date.slice(0, 4)}`;
  }
  if (headline.length > 140) {
    headline = headline.slice(0, 137).trim() + '...';
  }

  // Description (180-350 chars)
  let description = cleanText(jsonObj.description || jsonObj.summary || jsonObj.excerpt || '');
  if (!description) {
    description = `A look back at the milestone front-page reporting published in ${publicationName} on ${date}. Revisit the defining personalities, decisions, and public conversations that made this day an enduring memory in our national archives.`;
  }
  if (description.length > 600) {
    description = description.slice(0, 597).trim() + '...';
  }

  // Keywords (6-12 taxonomy tags)
  let rawKeywords = jsonObj.keywords || jsonObj.tags || jsonObj.topics;
  if (!Array.isArray(rawKeywords) && typeof rawKeywords === 'string') {
    rawKeywords = rawKeywords.split(/[,;\n]+/);
  }

  const seen = new Set<string>();
  const keywords: string[] = [];
  if (Array.isArray(rawKeywords)) {
    for (const item of rawKeywords) {
      const tag = cleanText(item).replace(/^#/, '');
      if (tag && tag.length >= 2 && tag.length <= 50) {
        const lower = tag.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          keywords.push(tag);
        }
      }
    }
  }

  // Guarantee foundational tags if list is too brief
  if (!seen.has(publicationName.toLowerCase())) {
    keywords.push(publicationName);
    seen.add(publicationName.toLowerCase());
  }
  const year = date.slice(0, 4);
  if (year && !seen.has(year)) {
    keywords.push(year);
    seen.add(year);
  }
  if (!seen.has('archival front page')) {
    keywords.push('Archival Front Page');
    seen.add('archival front page');
  }

  // Label (pill badge)
  let label = cleanText(jsonObj.label || jsonObj.badge || '');
  if (!label) {
    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();
    const diff = currentYear - yearNum;
    if (diff > 0) {
      label = `${diff} Years Ago`;
    } else {
      label = `Archive Milestone (${date})`;
    }
  }
  if (label.length > 60) {
    label = label.slice(0, 57).trim() + '...';
  }

  // CTA Label
  const ctaLabel = cleanText(jsonObj.ctaLabel || 'Revisit this story →').slice(0, 40) || 'Revisit this story →';

  // Significance & Snippet
  const historicalSignificance = cleanText(jsonObj.historicalSignificance || '').slice(0, 300);
  const transcribedSnippet = cleanText(jsonObj.transcribedSnippet || '').slice(0, 300);

  // Page Quality
  const validQualities = new Set(['pristine', 'readable', 'faded', 'damaged']);
  const rawQuality = String(jsonObj.pageQuality || '').toLowerCase();
  const pageQuality = (validQualities.has(rawQuality) ? rawQuality : 'readable') as RememberWhenAiGeneratedResult['pageQuality'];

  // Confidence
  const rawConf = Number(jsonObj.confidence);
  const confidence = Number.isFinite(rawConf) ? Math.max(0, Math.min(1, Math.round(rawConf * 100) / 100)) : 0.9;

  return {
    headline,
    description,
    keywords: keywords.slice(0, 15),
    date,
    publicationName,
    label,
    ctaLabel,
    historicalSignificance,
    transcribedSnippet,
    pageQuality,
    confidence,
  };
}

/**
 * Converts a validated AI generation result into a CMS-ready RememberWhenSlide payload.
 */
export function formatRememberWhenForCms(
  result: RememberWhenAiGeneratedResult,
  defaults: {
    imageUrl?: string;
    archiveId?: string;
    ctaUrl?: string;
    displayOrder?: number;
    status?: RememberWhenStatus;
  } = {},
): Omit<RememberWhenSlide, 'id' | 'createdAt' | 'updatedAt'> {
  const archiveId = defaults.archiveId || '';
  const ctaUrl = defaults.ctaUrl || (archiveId ? `/archives/${encodeURIComponent(archiveId)}` : '/archives');

  return {
    label: result.label,
    date: result.date,
    publicationName: result.publicationName,
    headline: result.headline,
    description: result.description,
    keywords: result.keywords,
    imageUrl: defaults.imageUrl || '/images/explore-archives.jpg',
    archiveId,
    ctaLabel: result.ctaLabel || 'Revisit this story →',
    ctaUrl,
    displayOrder: defaults.displayOrder ?? 100,
    status: defaults.status ?? 'draft',
  };
}

// ── Smart Offline / Simulated Analyzer ─────────────────────────────────────────

/**
 * Generates deterministic or context-aware simulated Remember When slide data.
 * Ideal for offline test runs, CI environments, dev previews, or when no paid API key is present.
 */
export function generateSimulatedRememberWhen(
  options: {
    image?: string;
    publicationNameHint?: string;
    dateHint?: string;
    storyFocusHint?: string;
    additionalContext?: string;
  } = {},
): RememberWhenAiGeneratedResult {
  const image = options.image || '';
  const dateHint = options.dateHint || '';
  const focus = (options.storyFocusHint || '').toLowerCase();

  // Match known milestone presets
  if (image.includes('1957') || dateHint.includes('1957') || focus.includes('independence')) {
    return { ...REMEMBER_WHEN_FEW_SHOT_EXAMPLES[0]!.expectedOutput };
  }

  if (image.includes('1982') || dateHint.includes('1982') || focus.includes('afcon') || focus.includes('sports')) {
    return { ...REMEMBER_WHEN_FEW_SHOT_EXAMPLES[1]!.expectedOutput };
  }

  if (image.includes('1960') || dateHint.includes('1960') || focus.includes('republic')) {
    return { ...REMEMBER_WHEN_FEW_SHOT_EXAMPLES[2]!.expectedOutput };
  }

  // Dynamic simulation based on hints
  const publication = options.publicationNameHint || 'Daily Graphic';
  const detectedDate = dateHint && /^\d{4}-\d{2}-\d{2}$/.test(dateHint) ? dateHint : '1974-08-04';
  const year = detectedDate.slice(0, 4);

  return {
    headline: options.storyFocusHint
      ? `${options.storyFocusHint.slice(0, 80)}: Front-Page Special Report`
      : `${publication} Front Page: Landmark Dispatches from ${year}`,
    description: `Published on ${detectedDate}, this memorable front page captured a key moment of social and national dialogue in Ghana. The lead coverage highlighted community resilience and economic initiatives that resonated across the country.`,
    keywords: [
      publication,
      year,
      'Archival Front Page',
      'National History',
      'Accra',
      'Heritage Coverage',
      'Graphic Communications',
    ],
    date: detectedDate,
    publicationName: publication,
    label: `${new Date().getFullYear() - Number(year)} Years Ago`,
    ctaLabel: 'Revisit this story →',
    historicalSignificance: `A representative front-page edition capturing mid-${year} national affairs and civic developments.`,
    transcribedSnippet: `Historic banner coverage from the national archive recording front-page dispatches.`,
    pageQuality: 'readable',
    confidence: 0.92,
  };
}

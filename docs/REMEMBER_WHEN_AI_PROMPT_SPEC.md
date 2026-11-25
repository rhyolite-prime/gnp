# Graphic NewsPlus: "Remember When" AI Vision Prompt Specification

## 1. Executive Summary & Purpose

The **"Remember When"** slider on the Graphic NewsPlus homepage is a curated archival retrospective showcasing historical moments, front pages, and cultural milestones from Ghana, West Africa, and the global African diaspora dating from 1950 to the present day.

When an editor uploads or points to a digitized newspaper page image (such as an archival microfilm scan from the *Daily Graphic*, *The Mirror*, *Graphic Sports*, or *Graphic Business*), an AI Multimodal Vision model is tasked with analyzing the page image and generating:
1. **Headline**: A concise, captivating, and historically accurate headline capturing the lead front-page story or milestone.
2. **Description**: An evocative retrospective narrative contextualizing the event, its key figures, and its lasting significance.
3. **Keywords**: A structured set of 6–12 taxonomic tags covering people, places, topics, eras, and source publications.
4. **Accompanying Metadata**: Masthead publication date (`YYYY-MM-DD`), publication name, temporal pill label, call-to-action text, historical significance insight, transcribed quote snippet, and confidence score.

---

## 2. Complete System Prompt

Below is the production system prompt used with multimodal vision models (e.g. GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro).

```text
You are the Senior Archival Historian and Chief Digital Curator at Graphic NewsPlus (GNP), the digital archival platform of the Graphic Communications Group Limited (GCGL) in Accra, Ghana. GCGL has published Ghana's leading national newspapers—including the Daily Graphic (est. 1950), The Mirror (est. 1953), Graphic Sports, Graphic Business, and Graphic Showbiz—for over seven decades.

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
Respond with STRICT, VALID JSON ONLY conforming to the JSON schema. Do NOT include markdown code blocks, preambles, or conversational commentary.
```

---

## 3. Multimodal User Prompt & Dynamic Hints

When sending the image to the vision model, the user prompt interpolates optional editorial hints provided by the editor:

```text
Please analyze the accompanying newspaper page image and generate the Remember When Slide assets according to the archival curation guidelines.

INPUT CONTEXT:
- Publication Name Hint: Daily Graphic
- Date Hint: 1957-03-06
- Story Focus Hint: Lead splash headline: Ghana Independence proclamation

INSTRUCTIONS:
1. Examine the masthead at the top: identify the publication title and extract the exact publication date (YYYY-MM-DD).
2. Locate the most prominent lead headline, primary photographs, and subhead decks.
3. Formulate:
   - "headline": captivating, historically grounded, 50-120 chars (max 140).
   - "description": nostalgic retrospective narrative, 180-350 chars (2-3 sentences).
   - "keywords": 6-12 distinct tags across entities, places, event topics, category, and decade.
   - Accompanying fields: "date", "publicationName", "label", "ctaLabel", "historicalSignificance", "transcribedSnippet", "pageQuality", and "confidence".
4. Output strictly valid JSON matching the schema.
```

---

## 4. JSON Schema Specification

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "RememberWhenAiGeneratedResult",
  "type": "object",
  "required": [
    "headline",
    "description",
    "keywords",
    "date",
    "publicationName",
    "label"
  ],
  "properties": {
    "headline": {
      "type": "string",
      "minLength": 20,
      "maxLength": 140,
      "description": "Crisp, captivating archival headline for the Remember When slide (50-120 chars, max 140)."
    },
    "description": {
      "type": "string",
      "minLength": 100,
      "maxLength": 400,
      "description": "Nostalgic narrative retrospective summary (180-350 chars, 2-3 sentences)."
    },
    "keywords": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 5,
      "maxItems": 15,
      "description": "6 to 12 distinct keywords categorizing people, places, events, themes, and decade."
    },
    "date": {
      "type": "string",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
      "description": "Publication date in YYYY-MM-DD ISO format."
    },
    "publicationName": {
      "type": "string",
      "description": "Name of the publication (e.g. Daily Graphic, The Mirror, Graphic Sports)."
    },
    "label": {
      "type": "string",
      "maxLength": 80,
      "description": "Temporal or milestone pill label (e.g. '67 Years Ago Today', 'March 6, 1957')."
    },
    "ctaLabel": {
      "type": "string",
      "maxLength": 40,
      "description": "Call-to-action button text (e.g. 'Revisit this story →')."
    },
    "historicalSignificance": {
      "type": "string",
      "description": "Brief 1-2 sentence analytical statement on why this front page matters."
    },
    "transcribedSnippet": {
      "type": "string",
      "description": "Verbatim excerpt transcribed from the headline, subhead deck, or lead sentence."
    },
    "pageQuality": {
      "type": "string",
      "enum": ["pristine", "readable", "faded", "damaged"],
      "description": "Visual condition of the scanned newspaper page."
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Model confidence score for legibility and date certainty."
    }
  },
  "additionalProperties": false
}
```

---

## 5. Few-Shot Historical Benchmarks

### Example 1: Independence Day 1957
- **Input Page**: *Daily Graphic*, Wednesday, March 6, 1957. Banner headline: "GHANA IS FREE! MIDNIGHT PROCLAMATION BY DR. NKRUMAH".
- **Generated Output**:
  ```json
  {
    "headline": "Ghana Achieves Independence: Midnight Proclamation at Old Polo Grounds",
    "description": "At midnight on March 6, 1957, Prime Minister Kwame Nkrumah declared to cheering thousands that Ghana was free forever. The historic proclamation marked the birth of sub-Saharan Africa's first independent nation, inspiring liberation movements across the continent.",
    "keywords": [
      "Ghana Independence",
      "Kwame Nkrumah",
      "Old Polo Grounds",
      "Accra",
      "Daily Graphic",
      "1957",
      "1950s",
      "Decolonisation",
      "Pan-Africanism",
      "National Sovereignty"
    ],
    "date": "1957-03-06",
    "publicationName": "Daily Graphic",
    "label": "Independence Day 1957",
    "ctaLabel": "Revisit this story →",
    "historicalSignificance": "The definitive front page heralding modern Ghana's sovereignty and the dawn of African independence.",
    "transcribedSnippet": "Ghana is free forever! The long battle has ceased and today our beloved country is free.",
    "pageQuality": "readable",
    "confidence": 0.98
  }
  ```

### Example 2: Black Stars AFCON 1982 Victory
- **Input Page**: *Daily Graphic*, Monday, March 15, 1982. Splash: "BLACK STARS WIN 4TH AFRICAN CUP! GHANA DEFEATS LIBYA 7-6 IN PENALTY DRAMA".
- **Generated Output**:
  ```json
  {
    "headline": "Black Stars Clinch Fourth AFCON Crown in Thrilling Tripoli Shootout",
    "description": "In a dramatic final in Tripoli, Ghana's Black Stars defeated host nation Libya on penalties to capture their fourth African Cup of Nations title. The triumph cemented Ghana's status as a continental football powerhouse and sparked nationwide celebrations.",
    "keywords": [
      "AFCON 1982",
      "Black Stars",
      "Emmanuel Quarshie",
      "Abedi Pele",
      "Tripoli",
      "Libya",
      "Football",
      "Daily Graphic",
      "1982",
      "1980s",
      "African Cup of Nations",
      "Sports History"
    ],
    "date": "1982-03-15",
    "publicationName": "Daily Graphic",
    "label": "AFCON Glory 1982",
    "ctaLabel": "Revisit this match →",
    "historicalSignificance": "Ghana's historic fourth continental championship, making them the most successful nation in AFCON history at the time.",
    "transcribedSnippet": "A heroic shootout victory in Tripoli seals Ghana's fourth continental crown amidst roaring applause.",
    "pageQuality": "readable",
    "confidence": 0.95
  }
  ```

---

## 6. Provider Code Snippets

### OpenAI (GPT-4o) Payload
```json
{
  "model": "gpt-4o",
  "response_format": { "type": "json_object" },
  "temperature": 0.2,
  "messages": [
    {
      "role": "system",
      "content": "<REMEMBER_WHEN_SYSTEM_PROMPT>"
    },
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "<USER_PROMPT_TEXT>" },
        { "type": "image_url", "image_url": { "url": "https://.../newspaper-page.jpg", "detail": "high" } }
      ]
    }
  ]
}
```

### Anthropic Claude 3.5 Sonnet Payload
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 1024,
  "temperature": 0.2,
  "system": "<REMEMBER_WHEN_SYSTEM_PROMPT>",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image",
          "source": { "type": "url", "url": "https://.../newspaper-page.jpg" }
        },
        {
          "type": "text",
          "text": "<USER_PROMPT_TEXT>\n\nRespond with valid JSON matching schema."
        }
      ]
    }
  ]
}
```

---

## 7. Architecture & Code Integration

- **Prompt Builder & Parser**: `utils/rememberWhenPrompt.ts`
- **CMS Model & Validation**: `utils/cmsContent.ts` (`RememberWhenSlide.keywords`, `validateRememberWhenSlidePayload`)
- **API Endpoint**: `POST /api/v1/cms/remember-when/ai-generate` in `server/api/v1/cms/[...slug].ts`
- **CMS Admin UI**: `pages/admin/content-management/remember-when.vue` (AI Vision Assistant panel, tag editor, prompt inspector modal)
- **Public Slider**: `components/RememberWhenSlider.vue` (renders keywords as hashtags)
- **Automated Tests**: `tests/rememberWhenPrompt.test.mjs` (12 passing tests)

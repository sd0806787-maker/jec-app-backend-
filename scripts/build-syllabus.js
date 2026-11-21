#!/usr/bin/env node
/**
 * Builds the app's flat `syllabus.json` from the PDF-extracted source file.
 *
 * The app (src/screens/SyllabusScreen.tsx) reads a flat payload:
 *
 *   {
 *     "CE_3": [ { subject, code, type, hoursPerWeek, credits, modules: [...] } ],
 *     "semesterInfo": { "CE_3": { branch, semester, totalCredits, ... } }
 *   }
 *
 * The extracted file (syllabus.json produced from the ASTU PDFs) uses a richer
 * `branches -> semester_N -> subjects` shape and has a few extraction defects:
 *
 *   - one subject block can contain the modules of the next course(s),
 *   - PDF page footers leak into module text
 *     ("Hours per week Credit Course Code Course Title L-T-P"),
 *   - lab rows have no `topics`,
 *   - course titles can be split around the code in the course-structure table.
 *
 * This script rebuilds the subject list from the PDF course tables (authoritative
 * for code, type, L-T-P, credits and title), splits merged module blocks, strips
 * the footer artefacts and emits the flat schema.
 *
 * Usage:
 *   node scripts/build-syllabus.js \
 *     --src /path/to/syllabus.json \
 *     --pdfs /path/to/pdf/folder \
 *     --base /path/to/published-syllabus.json \
 *     --out /path/to/syllabus.build.json
 *
 * `--base` is the currently published file; it is only used to carry semester 2
 * over, because the new extraction has no semester 2.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

/* -------------------------------------------------------------------------- */
/*                                   CLI                                      */
/* -------------------------------------------------------------------------- */

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

const SRC = arg('src', '/home/souvik/syllabus/syllabus.json');
const PDF_DIR = arg('pdfs', '/home/souvik/syllabus');
const BASE = arg('base', '/tmp/opencode/remote_syllabus.json');
const OUT = arg('out', path.join(PDF_DIR, 'syllabus.build.json'));

/* -------------------------------------------------------------------------- */
/*                              Branch config                                 */
/* -------------------------------------------------------------------------- */

const BRANCHES = [
  {
    name: 'Civil Engineering',
    key: 'CE',
    pdfs: {
      3: 'B.Tech-3rd-Sem-CE-final.pdf',
      4: 'B.Tech-4th-Sem-CE-final-3.pdf',
      5: 'B.Tech-5th-Sem-CE-final-2.pdf',
    },
  },
  {
    name: 'Computer Science and Engineering',
    key: 'CSE',
    pdfs: {
      3: 'B.Tech-3-rd-Sem-CSE-final.pdf',
      4: 'B.Tech-CSE-4th-Sem-Final-1.pdf',
      5: 'B.Tech-CSE-5th-Sem-Final.pdf',
    },
  },
  {
    name: 'Electrical Engineering',
    key: 'EE',
    pdfs: {
      3: 'B.Tech-3-rd-Sem-EE-final.pdf',
      4: 'B.Tech-4th-Sem-EE-final-3.pdf',
      5: 'B.Tech-5th-Sem-EE-final-1.pdf',
    },
  },
  {
    name: 'Instrumentation Engineering',
    key: 'IE',
    pdfs: {
      3: 'B.Tech-3-rd-Sem-IE-final-1.pdf',
      4: 'B.Tech-4th-Sem-IE-final-2.pdf',
      5: 'B.Tech-5th-Sem-IE-final.pdf',
    },
  },
  {
    name: 'Mechanical Engineering',
    key: 'ME',
    pdfs: {
      3: 'B.Tech-3rd-Sem-ME-final-2.pdf',
      4: 'B.Tech-4th-Sem-ME-final-2.pdf',
      5: 'B.Tech-5th-Sem-ME-final-3.pdf',
    },
  },
];

const FY_PDF = 'First-Year-UG-Syllabus-inline-with-NEP2020_final12092024.pdf';

const BRANCH_LABEL = {
  CE: 'Civil Engineering',
  CSE: 'Computer Science and Engineering',
  EE: 'Electrical Engineering',
  IE: 'Instrumentation Engineering',
  ME: 'Mechanical Engineering',
};

const UNIVERSITY = 'Assam Science and Technology University';
const ACADEMIC_SESSION = '2024-25 onwards';

/** Official titles for rows whose title is split/empty in both PDF places. */
const TITLE_OVERRIDES = {
  BS102: 'Mathematics-I',
  ES101: 'Basic Electrical Engineering',
  ES201: 'Programming for Problem Solving',
  AU201: 'Sports and Yoga',
  HS241306: 'Indian Knowledge Systems',
  AC241307: 'Language other than MIL',
  AU241407: 'Environmental Science',
  CE241303: 'Construction Materials and Concrete Technology',
  CE241313: 'Construction Materials and Concrete Technology Lab',
  CE241405: 'Construction Engineering and Management',
  CE241413: 'Hydraulics and Hydraulic Machines Lab',
  CS241318: 'Python Programming Lab',
  CS241404: 'Computer Organization & Architecture',
  CS241412: 'Full Stack Application Development Lab',
  CS241504: 'Formal Language and Automata',
  CS241512: 'AI-Augmented Software Engineering Lab',
  CS241513: 'Software DevOps and Automation Lab',
  EI241403: 'Microprocessors and Microcontrollers',
  EI241413: 'Microprocessors and Microcontrollers Lab',
  EE241404: 'Transmission and Distribution of Electric Power',
  EE241503: 'Electrical and Electronic Measurements',
  EE241513: 'Electrical and Electronic Measurements Lab',
  IE241302: 'Fundamentals of Instrumentation & Transducers',
  IE241502: 'Electrical and Electronic Measurements and Instruments',
  IE241512: 'Electrical and Electronic Measurements and Instruments Lab',
  HS241506: 'Entrepreneurship and Industrial Management',
  ME241414: 'Material Science and Engineering Lab',
  ME241514: 'Design Lab (Solid Works)',
  ES105: 'Digital Fabrication/Workshop/Manufacturing Practices',
  PR241415: 'Micro Project (Skill Based)',
  SI241321: 'Social Internship',
  EP241513: 'Academic Internship',
};

/* -------------------------------------------------------------------------- */
/*                             PDF text parsing                               */
/* -------------------------------------------------------------------------- */

const CODE_SRC = '[A-Z]{2,3}\\d{3,6}[A-Z]?';
const CODE_RE = new RegExp(`^${CODE_SRC}$`);
const CODE_ANY_RE = new RegExp(CODE_SRC);
const TYPE_RE = /^(PCC|BSC|ESC|HSMC|AU|AC|MC|OE|PEC|SI|EEC|AEC|SEC|PR|IT|EP|VAC)$/;
const BODY_RE = new RegExp(
  `^\\s*(${CODE_SRC})\\s{2,}(.+?)\\s{2,}(\\d+)-(\\d+)-(\\d+)\\s{2,}(\\d+)\\s*$`,
);

const pdfTextCache = new Map();
function pdfText(file) {
  if (pdfTextCache.has(file)) return pdfTextCache.get(file);
  const full = path.join(PDF_DIR, file);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing PDF: ${full}`);
  }
  const text = execFileSync('pdftotext', ['-layout', full, '-'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  pdfTextCache.set(file, text);
  return text;
}

/** Course metadata printed at the top of each course section (full titles). */
function bodyMetadata(text) {
  const map = new Map();
  for (const line of text.split('\n')) {
    const m = BODY_RE.exec(line);
    if (!m) continue;
    map.set(m[1], {
      title: m[2].replace(/\s+/g, ' ').trim(),
      l: +m[3],
      t: +m[4],
      p: +m[5],
      c: +m[6],
    });
  }
  return map;
}

/**
 * Rows from the "Course Structure" table. Titles can be inline, split around
 * the code, or absent; L/T/P/C are always the numbers at the end of the row.
 */
function structureRows(text) {
  const lines = text.split('\n');
  const rows = [];

  const isRowLine = (line) => {
    if (!CODE_ANY_RE.test(line)) return false;
    if (/^\s*\d+\s{2,}/.test(line)) return true;

    // Rows whose serial number lives on the previous line (seen in the
    // first-year tables) still start with the category, then the code.
    const m = CODE_ANY_RE.exec(line);
    const before = line.slice(0, m.index).trim();
    if (before && !TYPE_RE.test(before) && !/^\d+$/.test(before)) return false;
    const after = line.slice(m.index).split(/\s{2,}/).map((s) => s.trim()).filter(Boolean);
    return after.length >= 5;
  };

  const isIndentedTitle = (line) => {
    if (isRowLine(line)) return false;
    if (/^(Sl|Course|Theory|Practical|TOTAL|Total|Semester|ASSAM|B\.\s*Tech|Department|L\s+T|\(From)/i.test(line.trim())) {
      return false;
    }
    const m = /^(\s*(?:\d+\s+)?)(\S.*)$/.exec(line);
    return !!m && m[1].length >= 25;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!isRowLine(line)) continue;

    const codeMatch = CODE_ANY_RE.exec(line);
    if (!codeMatch) continue;
    const code = codeMatch[0];

    const parts = line.split(/\s{2,}/).map((s) => s.trim()).filter(Boolean);
    const ci = parts.indexOf(code);
    if (ci < 0) continue;

    const rest = parts.slice(ci + 1);
    let type = '';
    if (rest.length && TYPE_RE.test(rest[0])) type = rest.shift();

    let title = '';
    if (rest.length && !/^(\d+|[-–])$/.test(rest[0])) title = rest.shift();

    const cells = rest.filter((t) =>
      /^(\d{1,2}|[-–]|\(PP\/NP\)|PP\/NP|\(P\/NP\)|P\/NP|\*)$/i.test(t),
    );
    const cols = [];
    for (const cell of cells.slice(0, 4)) cols.push(/^\d+$/.test(cell) ? +cell : null);
    if (cols.length < 3 || cols[0] == null) continue;

    if (!title) {
      // Title may be split across the line above and the line below.
      const prev = (lines[i - 1] || '').trim();
      const next = (lines[i + 1] || '').trim();
      const bits = [];
      if (isIndentedTitle(prev)) bits.push(prev);
      if (isIndentedTitle(next)) bits.push(next);
      title = bits.join(' ');
    }

    rows.push({
      code,
      type,
      title: title.replace(/\s+/g, ' ').replace(/\s+([,.)])/g, '$1').trim(),
      l: cols[0] ?? 0,
      t: cols[1] ?? 0,
      p: cols[2] ?? 0,
      c: cols[3] ?? 0,
    });
  }

  return rows;
}

function tableTotals(text) {
  const contact = /Total Contact Hours per week\s*:\s*(\d+)/i.exec(text);
  const credits = /Total Credits?\s*:\s*(\d+)/i.exec(text);
  return {
    contact: contact ? +contact[1] : null,
    credits: credits ? +credits[1] : null,
  };
}

/**
 * Complete list of table rows for a PDF, with the best title available:
 * body title -> inline table title -> title override.
 */
function courseRows(text) {
  const body = bodyMetadata(text);
  return structureRows(text).map((row) => {
    const b = body.get(row.code);
    const bodyTitle = b && b.title && b.title.length >= 3 ? b.title : '';
    const tableTitle = row.title && row.title.length >= 3 ? row.title : '';
    return {
      ...row,
      title: TITLE_OVERRIDES[row.code] || bodyTitle || tableTitle || row.code,
    };
  });
}

/* -------------------------------------------------------------------------- */
/*                          Extracted-content parsing                         */
/* -------------------------------------------------------------------------- */

const MODULE_HEADER_RE =
  /^\s*(?:MODULE|Module)\s*[:.]?\s*([0-9]+|[IVXl]+)\s*(?:\(([a-z])\))?\s*(?:[:.\-]\s*|\s+)/;
const MODULE_LINE_RE =
  /^\s*(?:MODULE|Module)\s*[:.]?\s*([0-9]+|[IVXl]+)\s*(?:\(([a-z])\))?\s*[:.\-]\s*(.+?)\s*$/;
const INLINE_MODULE_RE = /(?=\bModule\s+(?:\d+|[IVXl]+)\s*[:.\-])/i;
const ROMAN = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
  XI: 11,
  XII: 12,
  XIII: 13,
  XIV: 14,
};

function moduleNumber(token) {
  if (/^\d+$/.test(token)) return +token;
  const normalized = token.toUpperCase().replace(/L/g, 'I');
  return ROMAN[normalized] ?? 0;
}

/** First-year PDF body header: "BS203   Biology for Engineers   3L:0T:0P 3 Credits". */
const FY_BODY_RE = new RegExp(
  `^\\s*(${CODE_SRC})\\s{2,}(.+?)\\s{2,}(\\d+)L\\s*:\\s*(\\d+)T\\s*:\\s*(\\d+)P\\s+(\\d+)\\s+Credits?\\s*$`,
  'i',
);

/**
 * Module heading lines printed in the PDF. The extractor sometimes glues a
 * heading to its body text ("Module 1: Introduction Fundamental differences …"),
 * so these short heading lines are used to recover the real title.
 */
function moduleHeadings(text) {
  const map = new Map();
  let current = null;

  for (const line of text.split('\n')) {
    const meta = BODY_RE.exec(line) || FY_BODY_RE.exec(line);
    if (meta) {
      current = meta[1];
      continue;
    }
    if (!current) continue;

    const m = MODULE_LINE_RE.exec(line);
    if (!m) continue;

    const title = m[3].replace(/\s+/g, ' ').trim();
    if (title.length < 3 || title.length > 90) continue;
    if (/[,;]$/.test(title)) continue;

    if (!map.has(current)) map.set(current, []);
    map.get(current).push({ number: moduleNumber(m[1]), title });
  }

  return map;
}

/** Replaces a title that swallowed its body with the exact PDF heading. */
function snapModuleTitles(modules, headings) {
  if (!headings || headings.length === 0) return;

  for (const module of modules ?? []) {
    const match = /^Module (\d+): (.*)$/.exec(module.title);
    if (!match) continue;

    const number = +match[1];
    const heading = headings.find((h) => h.number === number);
    if (!heading) continue;

    const body = match[2];
    if (!body.toLowerCase().startsWith(heading.title.toLowerCase())) continue;

    module.title = `Module ${number}: ${heading.title}`;

    const leftover = body
      .slice(heading.title.length)
      .replace(/^[\s:.\-]+/, '')
      .trim();
    if (leftover.length < 4) continue;

    const existing = (module.topics ?? []).join(' ').toLowerCase();
    if (existing.includes(leftover.toLowerCase())) continue;
    module.topics = [leftover, ...(module.topics ?? [])];
  }
}

const FOOTER_RE = /Hours per week\s+Credit\s+Course Code\s+Course Title\s+L-T-P\s*/i;
const ANNEXURE_RE = /\bLIST OF EXIT COURSES\b|\bList of Exit Courses\b/;
const BOOKS_RE =
  /\b(Textbooks?\/References|Textbooks? and References|Text\s*Books?|Text Book|Suggested Books(?: and Other Study Materials)?|Books referred|Reference Books|Books and References|Suggested Readings?|References|Web References?|Online Resources?)\s*:?\s*/i;
const EXPERIMENTS_RE =
  /\b(List of Suggested Experiments|List of Experiments|Suggested Experiments|Experiments)\s*:?\s*/i;

function cleanText(value) {
  return value
    .replace(/\uF0B7/g, ' • ')
    // Per-section contact-hour markers ("(6 Hours)", "(3 lectures)") are
    // metadata, not syllabus content.
    .replace(/\(\s*[\d.]+\s*(?:Hours?|Lectures?|Hrs?)\s*\)/gi, ' ')
    .replace(/^[\s•●▪◦\-–—*]+/, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .trim();
}

function splitItems(text) {
  const value = cleanText(text);
  if (!value) return [];

  let parts;
  if (value.includes('•')) {
    parts = value.split(/\s*•\s*/);
  } else if (/\b\d+\.\s/.test(value)) {
    parts = value.split(/\s+(?=\d+\.\s)/).map((s) => s.replace(/^\d+\.\s*/, ''));
  } else if ((value.match(/\s+o\s+/g) ?? []).length >= 2) {
    // Word documents exported from the university often use a bare "o" as the
    // list marker instead of a bullet glyph.
    parts = value.split(/\s+o\s+/);
  } else if (value.includes(';')) {
    parts = value.split(/\s*;\s*/);
  } else if (value.length > 260) {
    parts = value.split(/(?<=\.)\s+(?=[A-Z(])/);
  } else {
    parts = [value];
  }

  const out = [];
  for (const part of parts) {
    const cleaned = cleanText(part)
      .replace(/(?<=[a-z.)])\s+\d{1,2}$/i, '')
      .replace(/\s+Syllabus$/, '')
      .replace(/[.·]+$/, '')
      .trim();
    if (cleaned.length < 3 || out.includes(cleaned)) continue;
    if (/^\(?teachers may choose/i.test(cleaned)) continue;
    if (/are only suggestive|other experiments of similar nature/i.test(cleaned)) continue;
    out.push(cleaned);
  }
  return out;
}

/**
 * Expands a topic that concatenated several modules (seen in labs where the
 * extractor joined "Module 1: … Module 2: …" into one string).
 */
function expandInlineModules(topics) {
  const out = [];
  for (const raw of topics ?? []) {
    const topic = String(raw ?? '').trim();
    if (!topic) continue;

    if (!MODULE_HEADER_RE.test(topic)) {
      out.push(topic);
      continue;
    }

    const chunks = topic.split(INLINE_MODULE_RE).map((s) => s.trim()).filter(Boolean);
    if (chunks.length > 1) out.push(...chunks);
    else out.push(topic);
  }
  return out;
}

/** Splits a subject's topics into segments whenever module numbering restarts. */
function splitSegments(topics) {
  const segments = [];
  let current = [];

  for (const topic of topics) {
    const m = MODULE_HEADER_RE.exec(topic);
    if (m && moduleNumber(m[1]) === 1 && current.length > 0) {
      segments.push(current);
      current = [];
    }
    current.push(topic);
  }
  if (current.length) segments.push(current);
  return segments;
}

/** Parses one module chunk into { title, bullets, experiments, books, web, hint }. */
function parseModuleChunk(chunk, headerOnly = false) {
  let text = chunk;
  let hint = '';

  const footer = FOOTER_RE.exec(text);
  if (footer) {
    hint = text.slice(footer.index + footer[0].length).trim().slice(0, 140);
    text = text.slice(0, footer.index);
  }

  // Semester annexures (exit courses, scheme tables) can get glued to the last
  // module of a subject by the PDF extractor.
  const annexure = ANNEXURE_RE.exec(text);
  if (annexure) text = text.slice(0, annexure.index);

  const m = MODULE_HEADER_RE.exec(text);
  const number = m ? moduleNumber(m[1]) : 0;
  let rest = m ? text.slice(m[0].length) : text;

  // Separate the module title from its body. The PDF extractor leaves a
  // private-use bullet glyph (U+F0B7) in place of list bullets.
  let title = '';
  let body = '';
  const normalized = rest.replace(/\uF0B7/g, ' • ');
  const hours = /\(([\d.]+)\s*(Hours?|Lectures?|Hrs?)\)/i.exec(normalized);
  const bullet = normalized.indexOf('•');
  const numbered = normalized.search(/\b1\.\s/);
  const lowerO =
    (normalized.match(/\s+o\s+/g) ?? []).length >= 2 ? normalized.search(/\s+o\s+/) : -1;
  const doubleSpace = normalized.search(/\s{2,}/);
  const colon = normalized.indexOf(':');

  const candidates = [
    hours ? hours.index : -1,
    bullet,
    numbered,
    lowerO,
    doubleSpace,
    colon > 0 && colon < 80 ? colon : -1,
  ].filter((index) => index > 0);

  if (headerOnly) {
    // The PDF printed "MODULE 1" on its own line. Use the body's opening
    // phrase as the title when it ends with a short "Heading:" prefix.
    const value = normalized.trim();
    const colonIndex = value.indexOf(':');
    const shortHeading =
      colonIndex > 0 && colonIndex < 60 && !value.slice(0, colonIndex).includes(';');
    title = shortHeading ? value.slice(0, colonIndex) : '';
    body = shortHeading ? value.slice(colonIndex + 1).trim() : value;
  } else if (candidates.length > 0) {
    const splitAt = Math.min(...candidates);
    title = normalized.slice(0, splitAt);
    body = normalized
      .slice(splitAt)
      .replace(/^\(?[\d.]+\s*(Hours?|Lectures?|Hrs?)\)?\s*/i, '')
      .replace(/^\s*•\s*/, '')
      .replace(/^\s*\d+\.\s*/, '')
      .replace(/^\s*o\s+/, '')
      .replace(/^:\s*/, '')
      .trim();
  } else {
    title = normalized;
    body = '';
  }

  title = cleanText(title).replace(/[.:]+$/, '').trim();

  let booksText = '';
  const books = BOOKS_RE.exec(body);
  if (books) {
    booksText = body.slice(books.index + books[0].length);
    body = body.slice(0, books.index);
  }

  let experimentsText = '';
  const experiments = EXPERIMENTS_RE.exec(body);
  if (experiments) {
    experimentsText = body.slice(experiments.index + experiments[0].length);
    body = body.slice(0, experiments.index);
  }

  const isWeb = books ? /web|online/i.test(books[1]) : false;
  const booksList = splitItems(booksText);
  const experimentList = splitItems(experimentsText);

  return {
    number,
    title:
      number > 0
        ? title
          ? `Module ${number}: ${title}`
          : `Module ${number}`
        : title || 'Syllabus',
    bullets: splitItems(body),
    experiments: experimentList,
    books: isWeb ? [] : booksList,
    web: isWeb ? booksList : [],
    hint,
  };
}

function parseSegment(topics, headerOnlyFlags = []) {
  const modules = [];
  const experiments = [];
  const books = [];
  const web = [];
  let hint = '';

  topics.forEach((topic, index) => {
    const parsed = parseModuleChunk(topic, headerOnlyFlags[index] === true);
    if (parsed.hint) hint = parsed.hint;
    modules.push({ title: parsed.title, topics: parsed.bullets });
    experiments.push(...parsed.experiments);
    books.push(...parsed.books);
    web.push(...parsed.web);
  });

  return {
    modules,
    experiments: [...new Set(experiments)],
    books: [...new Set(books)],
    web: [...new Set(web)],
    hint,
  };
}

function moduleTitles(segment) {
  return segment.map((topic) => {
    const parsed = parseModuleChunk(topic);
    return parsed.title.toLowerCase();
  });
}

/**
 * Body lines of one course section, from its printed header up to the next
 * course header. Used as a fallback when the extracted JSON has no topics.
 */
function sectionText(text, code) {
  const lines = text.split('\n');
  let start = -1;
  let end = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const m = BODY_RE.exec(lines[i]) || FY_BODY_RE.exec(lines[i]);
    if (!m) continue;
    if (start < 0) {
      if (m[1] === code) start = i;
      continue;
    }
    end = i;
    break;
  }

  if (start < 0) return null;

  // Cut the section at the next page's course header so the following course
  // does not bleed into this one.
  for (let i = start + 1; i < end; i++) {
    if (/^\s*(?:Hours per week\s+Credit|Course Code\s+Course Title|L-T-P\s+C\s*$)/i.test(lines[i])) {
      end = i;
      break;
    }
  }

  return lines.slice(start, end);
}

/** Groups numbered PDF lines (experiments, books) into single items. */
function numberedLines(lines) {
  const items = [];
  let current = '';

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^(Assam Science|Page \d+ of|Department of|Course Outcomes?)/i.test(line)) continue;
    if (/^(Sl\.?|No\.?|Experiment|CO\s*$)/i.test(line)) continue;

    if (/^\d+\s*[.)]\s+/.test(line) || /^\d+\s{2,}/.test(line)) {
      if (current) items.push(current);
      current = line.replace(/^\d+\s*[.)]?\s*/, '');
    } else if (current) {
      current = `${current} ${line}`;
    } else {
      current = line;
    }
  }
  if (current) items.push(current);

  return items
    .map((item) => cleanText(item))
    // Table columns for contact hours / the next section often land at the end
    // of the last cell in a row.
    .map((item) => item.split(/\b(?:Total Contact Hours|Contact hours|Textbooks?\/Reference|Suggested Books|Hours per week)\b/i)[0])
    .map((item) => item.replace(/^\s*(?:LIST OF EXPERIMENTS|List of Experiments)\s*:?\s*/i, ''))
    .map((item) => item.replace(/(?<=[a-z.)])\s+\d{1,2}$/i, '').trim())
    .filter((item) => item.length >= 4);
}

/** Fallback extraction straight from the PDF body for one course. */
function sectionContent(text, code) {
  const lines = sectionText(text, code);
  if (!lines) return null;

  const body = lines
    .join('\n')
    .replace(/^\s*Assam Science and Technology University.*$/gm, '')
    .replace(/^\s*Page \d+ of \d+\s*$/gm, '');

  const headerRe = new RegExp(MODULE_HEADER_RE.source, 'gm');
  const positions = [...body.matchAll(headerRe)].map((m) => m.index);
  const chunks = positions.map((start, i) =>
    body.slice(start, i + 1 < positions.length ? positions[i + 1] : body.length).trim(),
  );

  // "MODULE 1" printed without a title on the same line.
  const headerOnly = chunks.map((chunk) => {
    const firstLine = chunk.split('\n')[0];
    return /^\s*(?:MODULE|Module)\s*[:.]?\s*(?:[0-9]+|[IVXl]+)\s*(?:\([a-z]\))?\s*$/.test(
      firstLine,
    );
  });

  const parsed = parseSegment(chunks, headerOnly);

  const experiments = EXPERIMENTS_RE.exec(body);
  if (experiments) {
    let rest = body.slice(experiments.index + experiments[0].length);
    const booksInRest = BOOKS_RE.exec(rest);
    if (booksInRest) rest = rest.slice(0, booksInRest.index);
    parsed.experiments.push(...numberedLines(rest.split('\n')));
  }

  const books = BOOKS_RE.exec(body);
  if (books) {
    const rest = body.slice(books.index + books[0].length);
    const list = numberedLines(rest.split('\n'));
    if (/web|online/i.test(books[1])) parsed.web.push(...list);
    else parsed.books.push(...list);
  }

  parsed.experiments = [...new Set(parsed.experiments)];
  parsed.books = [...new Set(parsed.books)];
  parsed.web = [...new Set(parsed.web)];

  return parsed;
}

/** Short, stable signature used to detect repeated module headings. */
function segmentSignature(segment) {
  return moduleTitles(segment)
    .map((title) => title.split(/\s+/).slice(0, 5).join(' '))
    .join('|');
}

/* -------------------------------------------------------------------------- */
/*                              Build per branch                              */
/* -------------------------------------------------------------------------- */

const source = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));

const out = {};
const semesterInfoByKey = {};

const contactOf = (row) => (row.l ?? 0) + (row.t ?? 0) + (row.p ?? 0);

function typeOf(code, meta) {
  if (/^AU|^AC/.test(code) || meta.type === 'AU' || meta.type === 'AC') {
    return 'Mandatory Audit Course';
  }
  if (/^PR|^SI|^EP/.test(code) || meta.type === 'PR' || meta.type === 'EP') {
    return 'Practical';
  }
  if ((meta.p ?? 0) > 0 && (meta.l ?? 0) > 0) return 'Theory + Practical';
  if ((meta.p ?? 0) > 0) return 'Practical';
  return 'Theory';
}

function makeSubject(code, meta, content, extra) {
  const subject = {
    subject: meta.title || TITLE_OVERRIDES[code] || code,
    code,
    type: typeOf(code, meta),
    hoursPerWeek: `${meta.l ?? 0}-${meta.t ?? 0}-${meta.p ?? 0}`,
    credits: meta.c ?? 0,
  };

  const modules = content?.modules ?? [];
  if (modules.length > 0) subject.modules = modules;
  if (content?.experiments?.length) subject.experiments = content.experiments;
  if (content?.books?.length) subject.textbooks = content.books;
  if (content?.web?.length) subject.onlineResources = content.web;

  if (extra?.note) subject.note = extra.note;

  return subject;
}

function buildBranchSemester(branchName, semester, pdfFile, groupName) {
  const raw = source.branches[branchName];
  if (!raw) throw new Error(`Missing branch in source: ${branchName}`);
  const semData = raw[`semester_${semester}`];
  if (!semData) return null;

  const jsonSubjects = semData.subjects
    ? semData.subjects
    : semData[groupName ?? semData.applicable_group_for_branch]?.subjects ?? [];

  const text = pdfText(pdfFile);
  const rows = courseRows(text);
  const totals = tableTotals(text);
  const headings = moduleHeadings(text);

  const pdfCodes = rows.map((r) => r.code);
  const jsonCodes = new Set(jsonSubjects.map((s) => s.code));
  const missing = pdfCodes.filter((c) => !jsonCodes.has(c));

  const contentByCode = new Map();
  const assigned = new Set();

  for (const subject of jsonSubjects) {
    const topics = expandInlineModules(subject.topics);
    const segments = splitSegments(topics);
    if (segments.length === 0) continue;

    const ownIndex = pdfCodes.indexOf(subject.code);
    if (ownIndex < 0) continue; // subject is not in the official table

    const followingMissing = missing.filter((code) => pdfCodes.indexOf(code) > ownIndex);

    let first = true;
    let missingIndex = 0;
    let lastAssignedCode = null;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const parsed = parseSegment(segment);

      if (!first && segmentSignature(segment) === segmentSignature(segments[i - 1])) {
        // Same module headings repeated: the second block is the experiment list.
        const previous = contentByCode.get(lastAssignedCode);
        if (previous) {
          previous.experiments.push(...parsed.experiments, ...parsed.modules.flatMap((m) => m.topics));
        }
        continue;
      }

      const assignedCode = first ? subject.code : followingMissing[missingIndex++];
      first = false;
      if (!assignedCode) continue;
      lastAssignedCode = assignedCode;

      assigned.add(assignedCode);
      snapModuleTitles(parsed.modules, headings.get(assignedCode));
      contentByCode.set(assignedCode, parsed);
      if (!parsed.hint) parsed.hint = '';
      parsed.jsonTitle = subject.title;
    }
  }

  const subjects = [];
  for (const row of rows) {
    let content = contentByCode.get(row.code);
    if (!content || (content.modules.length === 0 && content.experiments.length === 0)) {
      content = sectionContent(text, row.code) ?? content;
      if (content) snapModuleTitles(content.modules, headings.get(row.code));
    }
    const meta = {
      ...row,
      title:
        row.title && row.title !== row.code
          ? row.title
          : content?.hint || TITLE_OVERRIDES[row.code] || row.code,
    };
    subjects.push(makeSubject(row.code, meta, content));
  }

  // Subjects in the extracted file that the table somehow missed.
  for (const subject of jsonSubjects) {
    if (subjects.some((s) => s.code === subject.code)) continue;
    const content = contentByCode.get(subject.code);
    if (!content) continue;
    subjects.push(
      makeSubject(
        subject.code,
        {
          title: TITLE_OVERRIDES[subject.code] || subject.title,
          l: 0,
          t: 0,
          p: 0,
          c: 0,
        },
        content,
      ),
    );
  }

  const key = `${BRANCHES.find((b) => b.name === branchName)?.key ?? ''}_${semester}`;
  const totalCredits = subjects.reduce((sum, s) => sum + (s.credits ?? 0), 0);
  const totalContact = rows.reduce((sum, row) => sum + contactOf(row), 0);

  return {
    key,
    subjects,
    info: {
      branch: BRANCH_LABEL[key.split('_')[0]],
      branchCode: key.split('_')[0],
      semester,
      university: UNIVERSITY,
      academicSession: ACADEMIC_SESSION,
      totalContactHoursPerWeek: totals.contact ?? totalContact,
      totalCredits: totals.credits ?? totalCredits,
    },
  };
}

/* -------------------------------- Semester 1 ------------------------------- */

const fyText = pdfText(FY_PDF);
const fyGroupA = fyText.split(/GROUP B/)[0];
const fyGroupB = `GROUP B${fyText.split(/GROUP B/).slice(1).join('GROUP B')}`;
const fyGroupASem1 = fyGroupA.split(/Semester 2/)[0];
const fyGroupBSem1 = fyGroupB.split(/Semester 2/)[0];

const groupRows = { group_a: courseRows(fyGroupASem1), group_b: courseRows(fyGroupBSem1) };
const fyHeadings = moduleHeadings(fyText);

for (const branch of BRANCHES) {
  const semData = source.branches[branch.name].semester_1;
  const group = semData.applicable_group_for_branch || 'group_a';
  const jsonSubjects = semData[group].subjects ?? [];
  const rows = groupRows[group] ?? [];

  const subjects = [];
  for (const row of rows) {
    const jsonSubject = jsonSubjects.find((s) => s.code === row.code);
    let content = jsonSubject ? parseSegment(expandInlineModules(jsonSubject.topics)) : null;
    if (!content || (content.modules.length === 0 && content.experiments.length === 0)) {
      content = sectionContent(fyText, row.code) ?? content;
    }
    if (content) snapModuleTitles(content.modules, fyHeadings.get(row.code));
    const meta = {
      ...row,
      title: row.title !== row.code ? row.title : TITLE_OVERRIDES[row.code] || row.code,
    };
    subjects.push(makeSubject(row.code, meta, content));
  }

  // Anything in the extracted file that is missing from the table.
  for (const jsonSubject of jsonSubjects) {
    if (subjects.some((s) => s.code === jsonSubject.code)) continue;
    const content = parseSegment(expandInlineModules(jsonSubject.topics));
    snapModuleTitles(content.modules, fyHeadings.get(jsonSubject.code));
    subjects.push(
      makeSubject(
        jsonSubject.code,
        { title: TITLE_OVERRIDES[jsonSubject.code] || jsonSubject.title, l: 0, t: 0, p: 0, c: 0 },
        content,
      ),
    );
  }

  const key = `${branch.key}_1`;
  out[key] = subjects;
  semesterInfoByKey[key] = {
    branch: BRANCH_LABEL[branch.key],
    branchCode: branch.key,
    semester: 1,
    university: UNIVERSITY,
    academicSession: ACADEMIC_SESSION,
    totalContactHoursPerWeek: rows.reduce((sum, row) => sum + contactOf(row), 0),
    totalCredits: subjects.reduce((sum, s) => sum + (s.credits ?? 0), 0),
  };
}

/* -------------------------------- Semester 2 ------------------------------- */

/** Strips extraction artefacts from the previously published semester-2 data. */
function normalizeCarriedSubject(subject) {
  const strip = (value) =>
    String(value ?? '')
      .replace(/\(\s*[\d.]+\s*(?:Hours?|Lectures?|Hrs?)\s*\)/gi, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;:])/g, '$1')
      .trim();
  const clean = (value) => strip(value).replace(/^[\s•●▪◦\-–—*]+/, '').trim();

  const normalized = {
    ...subject,
    subject: strip(subject.subject),
    modules: (subject.modules ?? []).map((module) => ({
      ...module,
      title: strip(module.title),
      topics: (module.topics ?? []).map(clean).filter(Boolean),
    })),
  };

  if (Array.isArray(subject.textbooks)) {
    normalized.textbooks = subject.textbooks.map(clean).filter(Boolean);
  }
  if (Array.isArray(subject.experiments)) {
    normalized.experiments = subject.experiments.map(clean).filter(Boolean);
  }

  return normalized;
}

for (const branch of BRANCHES) {
  const key = `${branch.key}_2`;
  const existing = base[key];
  if (!Array.isArray(existing)) continue;
  const carried = existing.map(normalizeCarriedSubject);
  out[key] = carried;
  semesterInfoByKey[key] = {
    branch: BRANCH_LABEL[branch.key],
    branchCode: branch.key,
    semester: 2,
    university: UNIVERSITY,
    academicSession: ACADEMIC_SESSION,
    totalContactHoursPerWeek: existing.reduce((sum, s) => {
      const [l, t, p] = String(s.hoursPerWeek ?? '0-0-0').split('-').map(Number);
      return sum + (l || 0) + (t || 0) + (p || 0);
    }, 0),
    totalCredits: existing.reduce((sum, s) => sum + (s.credits ?? 0), 0),
  };
}

/* ----------------------------- Semesters 3, 4, 5 --------------------------- */

for (const branch of BRANCHES) {
  for (const semester of [3, 4, 5]) {
    const built = buildBranchSemester(branch.name, semester, branch.pdfs[semester]);
    if (!built) continue;
    out[built.key] = built.subjects;
    semesterInfoByKey[built.key] = built.info;
  }
}

/* --------------------------------- Output ---------------------------------- */

const order = [];
for (const semester of [1, 2, 3, 4, 5]) {
  for (const branch of BRANCHES) {
    const key = `${branch.key}_${semester}`;
    if (out[key]) order.push(key);
  }
}

const payload = {};
for (const key of order) payload[key] = out[key];
payload.semesterInfo = semesterInfoByKey;

fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n');

/* --------------------------------- Report ---------------------------------- */

console.log(`Wrote ${OUT}`);
let subjects = 0;
let withModules = 0;
let modules = 0;
let emptyLabs = 0;
for (const key of order) {
  const list = payload[key];
  subjects += list.length;
  for (const subject of list) {
    if (subject.modules?.length) {
      withModules += 1;
      modules += subject.modules.length;
    } else if (subject.type === 'Practical' || subject.type === 'Theory + Practical') {
      emptyLabs += 1;
    }
  }
  console.log(
    `  ${key.padEnd(6)} ${String(list.length).padStart(3)} subjects  ` +
      `${String(list.filter((s) => s.modules?.length).length).padStart(3)} with modules  ` +
      `${payload.semesterInfo[key]?.totalCredits ?? '?'} credits`,
  );
}
console.log(
  `Total: ${subjects} subjects, ${withModules} with modules, ${modules} modules, ${emptyLabs} labs without experiments.`,
);

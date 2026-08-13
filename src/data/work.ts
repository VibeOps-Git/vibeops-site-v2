// src/data/work.ts
//
// Implementations we have delivered or have under way.
//
// This is the extensible slot in the architecture. Adding the twentieth
// implementation means appending one object here and tagging it to the jobs it
// serves — no new page types, no navigation change, no repositioning.
//
// RULES, because this file is published:
//   1. No client names unless that client has given written permission to be
//      named publicly. `client` is a description of the firm, not its name.
//   2. No commercial terms. Fees, pipeline and contract values stay private.
//   3. Nothing here should describe capability we have not actually built.

export type WorkItem = {
  id: string;
  /** What it is, in plain language. */
  title: string;
  /** Anonymised description of the client firm. */
  client: string;
  status: 'Delivered' | 'In build' | 'In discovery';
  /** Job ids from jobs.ts that this implementation serves. */
  jobs: string[];
  /** The situation before we were involved. */
  problem: string;
  /** What we built. Capability, not feature list. */
  built: string;
  /** Concrete detail that shows this was real work, not a case-study template. */
  detail: string[];
};

export const WORK: WorkItem[] = [
  {
    id: 'submittal-intelligence',
    title: 'Submittal intelligence platform',
    client: 'Civil construction management firm',
    status: 'In build',
    jobs: ['internal-tools', 'systems-integration', 'institutional-knowledge', 'ai-governance'],
    problem:
      'Every civil project needs a submittal register before construction can start, and it is built by hand from specification books that can run to thousands of pages. Requirements then multiply across each definable feature of work, and each one has to be tied to the schedule so procurement happens early enough to avoid delaying the job.',
    built:
      'A platform that ingests project documents, assists in identifying definable features of work, generates structured register line items for engineers to review and validate, links them to the construction schedule, and tracks the full review lifecycle through approval.',
    detail: [
      'Document management, extraction, submittal register, schedule integration, reviewer routing and approval tracking',
      'Chain-of-custody logging — user actions, timestamps and document ownership duration — so delay claims can be evidenced rather than reconstructed from email',
      'Extraction accuracy evaluated against verified human ground truth at a proof-of-concept gate before the build sprint began',
      'Delivered platform, workflows and documentation owned by the client on acceptance',
    ],
  },
  {
    id: 'report-generation',
    title: 'Firm-specific report generation',
    client: 'Engineering consultancy',
    status: 'Delivered',
    jobs: ['document-production', 'institutional-knowledge'],
    problem:
      'Technical reports assembled by hand from field data, photographs, tables and prior work — with the firm’s own formatting and language rebuilt from scratch on every project.',
    built:
      'A report production system running on the firm’s existing templates and approved wording, taking field inputs and project data through to a draft an engineer reviews and signs.',
    detail: [
      'Built around the firm’s existing document templates rather than requiring new ones',
      'Field data, tables and photographs placed into the structure the firm already uses',
      'Engineer reviews and validates every output before it leaves the firm',
    ],
  },
  {
    id: 'code-intelligence',
    title: 'Jurisdictional building code intelligence',
    client: 'Built as reusable capability across engagements',
    status: 'Delivered',
    jobs: ['institutional-knowledge', 'ai-governance', 'document-production'],
    problem:
      'North American projects sit under federal, provincial or state, and municipal codes simultaneously. Working out which apply to a given site, and citing them correctly, is repeated manual research on every project — and firms told us it is one of the easiest places for an error to reach a stamped deliverable.',
    built:
      'A code lookup capability that resolves the applicable code stack from a project location and surfaces the referenced standards, with citations traceable to source so a reviewer can verify them.',
    detail: [
      'Federal, provincial/state and municipal layers resolved together rather than searched separately',
      'Referenced standards surfaced alongside the codes that invoke them',
      'Every citation traceable to its source document — the reviewer checks, rather than trusts',
    ],
  },
];

export function getWork(id: string): WorkItem | undefined {
  return WORK.find((w) => w.id === id);
}

export function workForJob(jobId: string): WorkItem[] {
  return WORK.filter((w) => w.jobs.includes(jobId));
}

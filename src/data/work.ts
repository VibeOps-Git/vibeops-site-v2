// src/data/work.ts
//
// Engagements and capability. This is the extensible slot in the architecture:
// adding the twentieth implementation means appending one object and tagging it
// to the jobs it serves — no new page types, no navigation change, no
// repositioning.
//
// RULES, because this file is published:
//
//   1. `status` must be literally true on the day it is read. An engagement that
//      is under way is not "delivered". An engagement that has not started is
//      not evidence of anything having been built. If the state changes, this
//      field changes first.
//   2. No commercial terms. No contract values, pipeline figures, fees or
//      anything else that is not already public.
//   3. Client names only with that client's permission. Sense Engineering and
//      Civil-Connect are cleared; anyone else stays anonymised until they are.
//   4. Describe the class of problem we were trusted with. Do not claim
//      outcomes, savings or results we have not measured and published.

export type WorkStatus =
  /** Engagement is live and in progress. Not finished — do not imply otherwise. */
  | 'Active engagement'
  /** Scoped and agreed, work has not begun. Not proof of anything built. */
  | 'Upcoming engagement'
  /** Capability we built ourselves, not a client deliverable. */
  | 'Our own capability';

export type WorkItem = {
  id: string;
  title: string;
  /** Client name where permitted, otherwise an anonymised description. */
  client: string;
  status: WorkStatus;
  /** Job ids from jobs.ts that this work serves. */
  jobs: string[];
  /** The situation that led to the engagement. */
  problem: string;
  /** What the work involves. Present tense for active, future for upcoming. */
  scope: string;
  /** Specifics that show this is real. No outcome or savings claims. */
  detail: string[];
};

export const WORK: WorkItem[] = [
  {
    id: 'report-generation',
    title: 'Report production built on the firm’s own templates',
    client: 'Sense Engineering',
    status: 'Active engagement',
    jobs: ['document-production', 'institutional-knowledge'],
    problem:
      'Technical reports assembled by hand from field data, photographs, tables and prior work, with the firm’s own formatting and language rebuilt from scratch on every project.',
    scope:
      'We are building a report production system that runs on the firm’s existing templates and approved wording, taking field inputs and project data through to a draft an engineer reviews and signs. The engagement is under way.',
    detail: [
      'Built around the firm’s existing document templates rather than requiring new ones',
      'Field data, tables and photographs placed into the structure the firm already uses',
      'An engineer reviews and validates every output before it leaves the firm',
      'Delivered as software the firm operates, not a subscription they rent',
    ],
  },
  {
    id: 'submittal-intelligence',
    title: 'Submittal intelligence platform',
    client: 'Civil-Connect',
    status: 'Upcoming engagement',
    jobs: ['internal-tools', 'systems-integration', 'institutional-knowledge', 'ai-governance'],
    problem:
      'Every civil project needs a submittal register before construction can start, and it is built by hand from specification books that can run to thousands of pages. Requirements then multiply across each definable feature of work, and each has to be tied to the schedule so procurement happens early enough not to delay the job.',
    scope:
      'Scoped and agreed; work has not started. The engagement will begin with a structured discovery phase before any development, covering workflow documentation, a data governance and security plan, and an accuracy evaluation against real project material before the build is committed to.',
    detail: [
      'Planned scope: document management, extraction, submittal register, schedule integration, reviewer routing and approval tracking',
      'Chain-of-custody logging so delay claims can be evidenced rather than reconstructed from email',
      'Discovery deliverables approved in writing by the client before development begins',
      'On acceptance, the delivered platform, workflows and documentation are owned by the client',
    ],
  },
  {
    id: 'code-intelligence',
    title: 'Jurisdictional building code intelligence',
    client: 'Built in-house, available to engagements',
    status: 'Our own capability',
    jobs: ['institutional-knowledge', 'ai-governance', 'document-production'],
    problem:
      'North American projects sit under federal, state or provincial, and municipal codes simultaneously. Working out which apply to a given site, and citing them correctly, is repeated manual research on every project — and firms told us it is one of the easiest places for an error to reach a stamped deliverable.',
    scope:
      'A code lookup capability we built ourselves, which resolves the applicable code stack from a project location and surfaces the referenced standards, with citations traceable to source so a reviewer can verify them. We bring it to engagements where jurisdictional lookup is part of the problem.',
    detail: [
      'Federal, state/provincial and municipal layers resolved together rather than searched separately',
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

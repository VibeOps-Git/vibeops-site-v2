// src/data/work.ts
//
// Two separate things, deliberately kept apart because they carry different
// disclosure risk:
//
//   RELATIONSHIPS — who we are working with. Name and stage ONLY.
//   CAPABILITIES  — what we have built ourselves. Ours to describe in full.
//
// ─── THE RULE ────────────────────────────────────────────────────────────────
//
//   Client engagements are under NDA. We may say that a relationship exists and
//   what stage it is at. We may NOT publish what the project is, what problem it
//   solves, what we are building, its scope, its deliverables, its timeline, or
//   anything drawn from a proposal or statement of work.
//
//   Anonymising the client does NOT cure this. A description detailed enough to
//   be useful is detailed enough to identify the engagement.
//
//   If you are about to add a `problem`, `scope` or `detail` field to a client
//   entry, stop. Those fields exist on CAPABILITIES only, and only for work we
//   own outright.
//
//   No contract values, fees, pipeline figures or commercial terms, ever.
//
// ─────────────────────────────────────────────────────────────────────────────

export type RelationshipStage =
  /** Engagement is live. */
  | 'Working together'
  /** In conversation; nothing agreed or started. */
  | 'In discussion';

export type Relationship = {
  id: string;
  /** Client name — only with that client's permission. */
  client: string;
  stage: RelationshipStage;
  /** What kind of firm they are. Publicly known facts only, no project detail. */
  descriptor: string;
};

export const RELATIONSHIPS: Relationship[] = [
  {
    id: 'sense-engineering',
    client: 'Sense Engineering',
    stage: 'Working together',
    descriptor: 'Engineering consultancy',
  },
  {
    id: 'civil-connect',
    client: 'Civil-Connect',
    stage: 'In discussion',
    descriptor: 'Construction management',
  },
];

// ─── Capability we built ourselves ───────────────────────────────────────────
// Not client work, so it can be described properly. This is where a principal
// gets to see what we can actually do.

export type Capability = {
  id: string;
  title: string;
  /** Job ids from jobs.ts that this capability serves. */
  jobs: string[];
  problem: string;
  scope: string;
  detail: string[];
};

export const CAPABILITIES: Capability[] = [
  {
    id: 'code-intelligence',
    title: 'Jurisdictional building code intelligence',
    jobs: ['institutional-knowledge', 'ai-governance', 'document-production'],
    problem:
      'North American projects sit under federal, state or provincial, and municipal codes simultaneously. Working out which apply to a given site, and citing them correctly, is repeated manual research on every project — and firms told us it is one of the easiest places for an error to reach a stamped deliverable.',
    scope:
      'A code lookup capability we built ourselves. It resolves the applicable code stack from a project location and surfaces the referenced standards, with citations traceable to source so a reviewer can verify them. We bring it to engagements where jurisdictional lookup is part of the problem.',
    detail: [
      'Federal, state/provincial and municipal layers resolved together rather than searched separately',
      'Referenced standards surfaced alongside the codes that invoke them',
      'Every citation traceable to its source document — the reviewer checks, rather than trusts',
    ],
  },
];

export function capabilitiesForJob(jobId: string): Capability[] {
  return CAPABILITIES.filter((c) => c.jobs.includes(jobId));
}

// src/data/jobs.ts
//
// The six jobs AE firms hire VibeOps for.
//
// These are deliberately stated as problems firms already recognise, not as
// services we sell. They are abstractions about how an engineering firm
// operates, which is why they survive new work: every implementation we take
// on lands under one or more of them without the architecture changing.
//
// Grounded in documented discovery conversations with 100+ AE and construction
// professionals across 89 firms and direct customer correspondence. Nothing here
// draws on material covered by a client NDA. The `evidence` field on each
// job is a real thing a real person said. Keep it that way: if a claim here
// cannot be traced to a conversation, it does not belong on the site.

import {
  Lock, FileStack, Cable, Hammer, Library, ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

export type Job = {
  /** URL slug under /what-we-solve/ */
  id: string;
  /** The problem, phrased the way a firm would say it out loud. */
  headline: string;
  /** Short label for nav and cards. */
  navLabel: string;
  /** One line under the headline. */
  summary: string;
  icon: LucideIcon;

  /** Who inside the firm feels this most. */
  feltBy: string;

  /** SEO */
  seoTitle: string;
  seoDescription: string;

  /** The situation, in their terms. 2-3 paragraphs. */
  situation: string[];

  /** What it actually costs them. Specific, never "wasted time". */
  cost: string[];

  /** What we do about it. Capability statements, not product features. */
  whatWeDo: { title: string; detail: string }[];

  /** A real quote from discovery. Attributed by role + firm type, never named. */
  evidence: { quote: string; attribution: string };

  /** Related jobs, by id. Drives lateral internal linking. */
  related: string[];
};

export const JOBS: Job[] = [
  {
    id: 'secure-ai',
    navLabel: 'AI on confidential data',
    headline: 'We can’t put client data into AI.',
    summary:
      'Your project data is contractually confidential, and your IT department is right to block the public tools. We build AI that runs inside the environment your security team approves.',
    icon: Lock,
    feltBy: 'IT and security · Principals carrying client confidentiality obligations',
    seoTitle: 'Private & Secure AI for Engineering Firms',
    seoDescription:
      'Run AI on confidential project data without it leaving your environment. VibeOps builds private, IT-approvable AI deployments for architecture and engineering firms.',
    situation: [
      'Almost every firm we have spoken to has the same shape of problem. Engineers are already using AI on personal accounts, on personal devices, for work they cannot admit to. Meanwhile the firm has a blanket policy against putting project material into anything public, because old reports are client property and the contracts say so.',
      'So the firm ends up with a capability it cannot use on the work that matters. General-purpose assistants get approved for email and meeting notes, then stop dead at the boundary of actual project data, which is exactly where the value was.',
      'This is not a technology problem. It is an approvals problem, and it is won or lost inside the IT department.',
    ],
    cost: [
      'Your best people quietly work around policy, which is a bigger exposure than the tool would have been.',
      'Anything touching government, healthcare, defence, or regulated infrastructure work is off the table entirely.',
      'Champions get told no once and stop asking.',
    ],
    whatWeDo: [
      {
        title: 'Deploy where your data already lives',
        detail:
          'Your infrastructure, your tenancy, or a dedicated environment you control. We work to the residency and access rules your security team sets, rather than asking them to make an exception.',
      },
      {
        title: 'Answer IT before they have to ask',
        detail:
          'Every engagement produces a written data governance, security and usage plan covering where data sits, who can reach it, what is retained, and what is sent to a model provider. Your team reviews it before we build, not after.',
      },
      {
        title: 'Keep client material out of shared systems',
        detail:
          'No training on your project data. No pooling across clients. Confidential material stays inside the boundary you approved.',
      },
      {
        title: 'Make the approval reviewable',
        detail:
          'We hand an internal reviewer what they actually need: architecture, dependencies, data flow. Approving us should be a review, not a leap of faith.',
      },
    ],
    evidence: {
      quote:
        'Client data needs to be really safe. Security and the IT department need to be convinced at these firms.',
      attribution: 'Structural lead, global engineering consultancy',
    },
    related: ['ai-governance', 'systems-integration'],
  },

  {
    id: 'document-production',
    navLabel: 'Document production',
    headline: 'We produce the same documents over and over, and our standard is slipping.',
    summary:
      'The problem was never typing speed. It is that the firm’s standard erodes under deadline pressure. We build production systems that hold the standard instead of trading it away.',
    icon: FileStack,
    feltBy: 'Discipline leads · Anyone who reviews and signs work',
    seoTitle: 'Engineering Document & Report Production Systems',
    seoDescription:
      'Automate repetitive engineering documentation without lowering the standard your firm signs off on. Purpose-built production systems for AE firms.',
    situation: [
      'Reports, submittals, assessments, proposals, permits. The technical thinking is a fraction of the effort; the rest is assembly, formatting, cross-referencing and chasing consistency across documents that are 80% the same as the last one.',
      'The firms we talk to are blunt about where this ends up. One VP described a steady erosion in what counts as acceptable written work, the drive for accuracy quietly dropping off because there is never time. Generic AI assistants make that worse. They produce plausible text a reviewer then has to unpick line by line.',
      'For work that gets stamped, output nobody trusts is worse than no output at all.',
    ],
    cost: [
      'Senior engineers spend their week on assembly instead of engineering judgment.',
      'Consistency drifts between offices, disciplines and juniors.',
      'Reviewers become the bottleneck, and quality becomes a function of who happened to check it.',
    ],
    whatWeDo: [
      {
        title: 'Build on your templates and your language',
        detail:
          'Your formats, your section structure, your approved wording and house style. The output has to look like your firm produced it, because your firm did.',
      },
      {
        title: 'Draft generation, never autonomous decisions',
        detail:
          'We treat AI as a drafting and acceleration layer with a person in the loop, not an unchecked decision-maker. That distinction is written into how we scope every engagement.',
      },
      {
        title: 'Make every claim traceable',
        detail:
          'Content ties back to where it came from: field data, prior work, the referenced standard. A reviewer verifies it instead of redoing it.',
      },
      {
        title: 'Prove accuracy before you depend on it',
        detail:
          'We evaluate against real documents and verified human ground truth, and we document where it is weak, before anything reaches production.',
      },
    ],
    evidence: {
      quote:
        'There is a steady dumbing down of what is acceptable as far as written content. The drive for perfection in documentation has dropped off. You can give them that back.',
      attribution: 'Vice President, rail and transit consultancy',
    },
    related: ['institutional-knowledge', 'ai-governance'],
  },

  {
    id: 'systems-integration',
    navLabel: 'Systems that don’t talk',
    headline: 'Our software doesn’t talk to each other.',
    summary:
      'You have already bought the tools. They each hold part of the picture and none of them connect. We build the connective tissue between what you already run.',
    icon: Cable,
    feltBy: 'Digital / BIM leads · Operations · Project managers',
    seoTitle: 'Engineering Software Integration & Workflow Automation',
    seoDescription:
      'Connect the engineering software your firm already runs. Design tools, document systems, project and finance platforms, joined by custom integrations built by engineers.',
    situation: [
      'A structural principal told us the links between his modelling and analysis software simply do not work, so his team import and export by hand between three or four packages on every project. A utilities director described budgeting in one enterprise system, documents in another, and no path between them. A municipal consultancy runs whatever platform each city client already uses.',
      'The pattern repeats everywhere: firms have spent heavily on platforms, and the gaps between those platforms are filled by people, spreadsheets and email.',
      'Nobody sells the piece in the middle, because the piece in the middle is specific to you.',
    ],
    cost: [
      'Data gets re-keyed between systems, and every re-keying is a chance to be wrong.',
      'Expensive platforms sit largely unused. One construction manager estimated 90% of the features in their document system had never been touched.',
      'Nobody has a single view of a project, so status meetings become archaeology.',
    ],
    whatWeDo: [
      {
        title: 'Work with the stack you have',
        detail:
          'Design and modelling tools, document and drawing management, project controls, finance and CRM. We integrate what you run rather than proposing you replace it.',
      },
      {
        title: 'Move data, not just files',
        detail:
          'Extract the structured information trapped inside drawings, specifications and documents so it can flow into the systems that need it.',
      },
      {
        title: 'Map the workflow before writing code',
        detail:
          'Every engagement starts by documenting how work actually moves through your firm, including the parts that only live in someone’s head.',
      },
      {
        title: 'Build it to be handed over',
        detail:
          'Documented, tested and owned by you, so an integration does not become a dependency on us.',
      },
    ],
    evidence: {
      quote:
        'A lot of software provides a link between the model and the analysis package, but it does not work. There are many structural analysis tools and we need to integrate all of it. Import, export, import, export.',
      attribution: 'Principal structural engineer, specialist design firm',
    },
    related: ['internal-tools', 'institutional-knowledge'],
  },

  {
    id: 'internal-tools',
    navLabel: 'Tools that don’t exist',
    headline: 'The tool we need doesn’t exist, and we can’t staff to build it.',
    summary:
      'Some of what your firm needs nobody sells, because the market is you. We are the engineering team that builds it, without you hiring one.',
    icon: Hammer,
    feltBy: 'Principals · Operations directors · Anyone maintaining a critical spreadsheet',
    seoTitle: 'Custom Internal Software for Engineering Firms',
    seoDescription:
      'Custom dashboards, field tools, portals and internal platforms built for AE firms by engineers. The software your firm needs and nobody sells.',
    situation: [
      'Every firm has a list. A field capture app that would end double entry. A client-facing status portal. A dashboard that finally shows the whole portfolio. A tool that turns the master spreadsheet nobody else understands into something the whole team can use.',
      'The list never gets built, because building it means hiring software engineers into a firm whose business is engineering. We have watched firms attempt it and stall: one construction group told us they were weighing whether to spend capital building internally, and that so far the internal attempt had failed. A consultancy told us they had a software engineer five years ago and no longer do.',
      'Meanwhile the firms that do have internal teams are not obviously better off. An engineer at a global consultancy put it plainly: by the time the internal team delivers the tool, the moment for it has passed.',
    ],
    cost: [
      'Critical operations depend on a spreadsheet that one person maintains.',
      'The improvement everyone agrees on stays on the list for years.',
      'You are competing against firms who did build it.',
    ],
    whatWeDo: [
      {
        title: 'Scope it properly before quoting it',
        detail:
          'A structured discovery phase produces a technical plan, workflow documentation, a prioritised build backlog and a written risk register. You approve all of it before development starts.',
      },
      {
        title: 'Build to a fixed scope and fixed fee',
        detail:
          'Milestone-based, with defined acceptance criteria and structured revision periods. Not an open-ended hourly engagement.',
      },
      {
        title: 'Pilot inside your firm first',
        detail:
          'Real work, real users, before anyone commits further. It either holds up against your projects or it does not.',
      },
      {
        title: 'You own what we build',
        detail:
          'The delivered codebase, your workflows, configuration and documentation are yours on acceptance. We are a capability, not a hostage situation.',
      },
    ],
    evidence: {
      quote:
        'We don’t have a development team any more. We want you to come on as a long-term developer.',
      attribution: 'CEO, building data platform company',
    },
    related: ['systems-integration', 'secure-ai'],
  },

  {
    id: 'institutional-knowledge',
    navLabel: 'Knowledge locked in past work',
    headline: 'Everything we know is locked inside past projects.',
    summary:
      'Decades of solved problems sit in folders nobody can search. We turn your completed work into something the next project can actually use.',
    icon: Library,
    feltBy: 'Technical directors · Junior engineers · Proposal teams',
    seoTitle: 'Institutional Knowledge & Document Intelligence for AE Firms',
    seoDescription:
      'Turn decades of completed engineering projects into searchable, reusable institutional knowledge instead of folders nobody can find anything in.',
    situation: [
      'The most common way we saw people start a new document: find a similar old one and edit it. Not the master template. A specific past project someone happens to remember. That is institutional knowledge running at the speed of human memory.',
      'It fails in predictable ways. An engineer at a large consultancy described carrying specifications forward from project to project with no way to compare versions or see what had drifted. A construction partner described joint ventures spending millions on work plans, quality documents and templates that simply evaporate when the venture dissolves. The next job starts from zero.',
      'The firm knows an enormous amount. It just cannot get at it.',
    ],
    cost: [
      'Juniors reinvent answers the firm solved fifteen years ago.',
      'Errors propagate silently when an old document is carried forward without anyone spotting what changed.',
      'When someone experienced leaves, the knowledge leaves with them.',
    ],
    whatWeDo: [
      {
        title: 'Make completed work searchable',
        detail:
          'Reports, specifications, drawings, correspondence, all retrievable by what is in them rather than by who remembers the folder name.',
      },
      {
        title: 'Extract structure from documents',
        detail:
          'Pull the data trapped inside PDFs, drawings and scans into something queryable, including material from decades before anything was digital.',
      },
      {
        title: 'Surface drift and inconsistency',
        detail:
          'Compare versions, flag what changed between a carried-forward document and its source, and catch the divergence before it ships.',
      },
      {
        title: 'Keep it inside your boundary',
        detail:
          'Your archive is among the most sensitive material you hold. It stays in the environment your security team approved.',
      },
    ],
    evidence: {
      quote:
        'They take special provisions and copy them forward to new projects. Nobody uses tools to compare documents. They cannot see drift across versions.',
      attribution: 'Transportation engineer, multinational AE firm',
    },
    related: ['document-production', 'secure-ai'],
  },

  {
    id: 'ai-governance',
    navLabel: 'Oversight & governance',
    headline: 'We need oversight before this gets away from us.',
    summary:
      'More output means more to review, and someone still has to stamp it. We build the review, audit and governance layer that makes AI-assisted work defensible.',
    icon: ShieldCheck,
    feltBy: 'Principals who seal work · QA/QC leads · Risk and professional liability owners',
    seoTitle: 'AI Governance & Quality Oversight for Engineering Firms',
    seoDescription:
      'Review workflows, audit trails and governance for AI-assisted engineering work, so a licensed professional can still defensibly stamp what goes out the door.',
    situation: [
      'A senior vice-president at a 35,000-person consultancy told us the quality control portion is the single biggest headache in their business. Not production. Review.',
      'That pressure gets worse, not better, as firms adopt AI. A licensed professional engineer put it to us directly: the constraint in this industry is that licensed people must stamp and take responsibility for larger amounts of work, to a higher standard, and managers will need to examine and oversee far more of it than they do today.',
      'Firms are asking for the missing half. Several independently described wanting a second, more critical pass over the first draft. Others asked who is accountable when AI touched the deliverable. Nobody is selling them an answer.',
    ],
    cost: [
      'Review capacity, not production capacity, becomes the ceiling on what the firm can take on.',
      'Nobody can reconstruct how a deliverable was produced when it is challenged months later.',
      'Adoption stalls because the professional carrying the liability has no basis to get comfortable.',
    ],
    whatWeDo: [
      {
        title: 'Build review into the workflow',
        detail:
          'Structured checks against your standards and requirements, so the first pass over a deliverable is systematic rather than dependent on who picked it up.',
      },
      {
        title: 'Keep an audit trail',
        detail:
          'What was generated, from which source, reviewed by whom and when. A record that holds up when a deliverable is questioned months later.',
      },
      {
        title: 'Set the policy with you',
        detail:
          'Where AI is permitted, where it is not, what has to be checked by a human, and what gets recorded. Written down, so it is enforceable rather than assumed.',
      },
      {
        title: 'Keep the professional in charge',
        detail:
          'Everything we build assumes a licensed engineer reviews and signs. The system’s job is to make that review fast and evidenced, never to replace it.',
      },
    ],
    evidence: {
      quote:
        'Quality control is the biggest headache. Because you are dealing with new people all the time, you never know what their report review experience is.',
      attribution: 'Senior Vice-President, 35,000-person engineering consultancy',
    },
    related: ['document-production', 'secure-ai'],
  },
];

export function getJob(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id);
}

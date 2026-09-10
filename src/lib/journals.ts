export interface JournalEntry {
  name: string;
  publisher: string;
  impactFactor: number;
  discipline: 'Multidisciplinary' | 'Biomedicine' | 'Computer Science' | 'Clinical' | 'Physical Sciences' | 'Social Sciences';
  acceptanceRate: string;
  reviewSpeed: string;
  openAccess: 'Hybrid' | 'Gold OA' | 'Subscription';
  aimsAndScope: string;
  deskRejectHazards: string[];
  keyExpectations: string[];
}

export const JOURNAL_CATALOG: JournalEntry[] = [
  {
    name: "Nature",
    publisher: "Springer Nature",
    impactFactor: 64.8,
    discipline: "Multidisciplinary",
    acceptanceRate: "7-8%",
    reviewSpeed: "4-6 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes finest peer-reviewed research in all fields of science and technology on the basis of its originality, importance, interdisciplinary interest, timeliness, and elegance.",
    deskRejectHazards: [
      "Incremental advance over prior literature",
      "Specialized interest without broad conceptual significance",
      "Conclusions not supported by definitive mechanistic proof",
      "Lack of orthogonal validation experiments"
    ],
    keyExpectations: [
      "Transformative conceptual leap",
      "Broad implications beyond single subfield",
      "Exemplary data transparency and code availability"
    ]
  },
  {
    name: "Science",
    publisher: "AAAS",
    impactFactor: 56.9,
    discipline: "Multidisciplinary",
    acceptanceRate: "6-7%",
    reviewSpeed: "3-5 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes original scientific research, global science policy, and industry insights of broad scientific significance.",
    deskRejectHazards: [
      "Narrow field focus",
      "Overstating causal claims based on correlative data",
      "Incomplete replication or missing controls"
    ],
    keyExpectations: [
      "Clear, compelling narrative accessible to non-specialists",
      "Definitive causal resolution of long-standing questions"
    ]
  },
  {
    name: "Cell",
    publisher: "Cell Press / Elsevier",
    impactFactor: 66.8,
    discipline: "Biomedicine",
    acceptanceRate: "8-10%",
    reviewSpeed: "4-5 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes novel insights in molecular biology, biochemistry, cancer research, immunology, neuroscience, and translational medicine.",
    deskRejectHazards: [
      "Phenotypic observation without detailed molecular mechanism",
      "Single model system without in vivo or physiological validation",
      "ChIP-seq or CRISPR screens missing proper baseline controls"
    ],
    keyExpectations: [
      "Deep mechanistic insight from start to finish",
      "Rescue experiments and genetic perturbation proofs",
      "Standardized STAR Methods documentation"
    ]
  },
  {
    name: "The Lancet",
    publisher: "Elsevier",
    impactFactor: 98.4,
    discipline: "Clinical",
    acceptanceRate: "5%",
    reviewSpeed: "3-4 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes high-impact clinical trials, global health policy, and epidemiology with immediate practice-changing clinical implications.",
    deskRejectHazards: [
      "Observational studies without robust confounder adjustments",
      "Unregistered clinical trials or lack of prespecified primary endpoints",
      "Non-compliance with CONSORT, STROBE, or PRISMA guidelines"
    ],
    keyExpectations: [
      "Rigorous prospective randomized design",
      "Clear clinical endpoints directly altering patient management",
      "Global disease burden relevance"
    ]
  },
  {
    name: "Nature Communications",
    publisher: "Springer Nature",
    impactFactor: 16.6,
    discipline: "Multidisciplinary",
    acceptanceRate: "16-18%",
    reviewSpeed: "6-8 weeks to first decision",
    openAccess: "Gold OA",
    aimsAndScope: "Publishes high-quality research across all areas of the natural sciences with significant specialist interest.",
    deskRejectHazards: [
      "Methodological soundness questions (sample size, statistics)",
      "Unclear incremental value over established methods",
      "Missing raw data or open-source availability"
    ],
    keyExpectations: [
      "High technical rigor and thorough experimental execution",
      "Complete data availability statements and raw source data"
    ]
  },
  {
    name: "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)",
    publisher: "IEEE",
    impactFactor: 20.8,
    discipline: "Computer Science",
    acceptanceRate: "12-14%",
    reviewSpeed: "8-12 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes state-of-the-art work in computer vision, pattern recognition, machine learning, and artificial intelligence.",
    deskRejectHazards: [
      "Benchmark gains on single dataset without statistical significance",
      "Lack of mathematical proofs or theoretical bounds where claimed",
      "Omission of competitive baselines from recent top conferences (CVPR, NeurIPS)"
    ],
    keyExpectations: [
      "Comprehensive cross-dataset evaluations",
      "Extensive ablation studies isolating every proposed component",
      "Reproducible code release"
    ]
  },
  {
    name: "Nucleic Acids Research (NAR)",
    publisher: "Oxford University Press",
    impactFactor: 19.1,
    discipline: "Biomedicine",
    acceptanceRate: "18-20%",
    reviewSpeed: "4-5 weeks to first decision",
    openAccess: "Gold OA",
    aimsAndScope: "Publishes physical, chemical, biochemical, and biological aspects of nucleic acids and proteins involved in nucleic acid metabolism.",
    deskRejectHazards: [
      "Bioinformatic tools without experimental benchmarking or active maintenance",
      "Unclear biochemical validation of genomic predictions"
    ],
    keyExpectations: [
      "Rigorous computational tools with public web server or Docker container",
      "Clear mechanistic experiments supporting RNA/DNA interactions"
    ]
  },
  {
    name: "PLOS ONE",
    publisher: "Public Library of Science",
    impactFactor: 3.7,
    discipline: "Multidisciplinary",
    acceptanceRate: "45-50%",
    reviewSpeed: "6-10 weeks to first decision",
    openAccess: "Gold OA",
    aimsAndScope: "Publishes scientifically rigorous primary research across all disciplines without subjective assessments of perceived novelty or impact.",
    deskRejectHazards: [
      "Statistical errors or lack of ethical clearance",
      "Data availability restrictions without legal/ethical justification"
    ],
    keyExpectations: [
      "Sound scientific methodology and proper control conditions",
      "Full open data sharing"
    ]
  }
];

export function findMatchingJournals(title: string, abstract: string): {
  reach: JournalEntry;
  realistic: JournalEntry;
  fallback: JournalEntry;
  allMatches: { journal: JournalEntry; matchScore: number }[];
} {
  const combined = (title + " " + abstract).toLowerCase();

  // Score each journal based on keyword relevance
  const scored = JOURNAL_CATALOG.map(j => {
    let score = 50; // base score

    if (j.discipline === 'Biomedicine' && (combined.includes('cell') || combined.includes('protein') || combined.includes('gene') || combined.includes('cancer') || combined.includes('pathway'))) {
      score += 35;
    }
    if (j.discipline === 'Clinical' && (combined.includes('patient') || combined.includes('clinical') || combined.includes('trial') || combined.includes('cohort') || combined.includes('therapy'))) {
      score += 40;
    }
    if (j.discipline === 'Computer Science' && (combined.includes('model') || combined.includes('algorithm') || combined.includes('deep learning') || combined.includes('neural') || combined.includes('benchmark'))) {
      score += 45;
    }
    if (j.discipline === 'Multidisciplinary') {
      score += 25;
    }

    return { journal: j, matchScore: Math.min(score, 98) };
  });

  scored.sort((a, b) => b.journal.impactFactor - a.journal.impactFactor);

  // Group into Reach, Realistic, Fallback
  const reach = scored[0].journal;
  const realistic = scored.length > 4 ? scored[4].journal : scored[1].journal;
  const fallback = scored[scored.length - 1].journal;

  return {
    reach,
    realistic,
    fallback,
    allMatches: scored,
  };
}

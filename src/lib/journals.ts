export type Discipline =
  | 'Oncology'
  | 'Biomedicine'
  | 'Computer Science'
  | 'Clinical'
  | 'Neuroscience'
  | 'Operations Research & Management'
  | 'Environmental Science & Sustainability'
  | 'Multidisciplinary';

export interface JournalEntry {
  name: string;
  publisher: string;
  impactFactor: number;
  discipline: Discipline;
  acceptanceRate: string;
  reviewSpeed: string;
  openAccess: 'Hybrid' | 'Gold OA' | 'Subscription';
  aimsAndScope: string;
  deskRejectHazards: string[];
  keyExpectations: string[];
  isCrossDisciplinary?: boolean;
}

export const JOURNAL_CATALOG: JournalEntry[] = [
  // ==========================================
  // MULTIDISCIPLINARY
  // ==========================================
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
      "Narrow field focus without cross-disciplinary resonance",
      "Overstating causal claims based on correlative data",
      "Incomplete replication or missing controls"
    ],
    keyExpectations: [
      "Clear, compelling narrative accessible to non-specialists",
      "Definitive causal resolution of long-standing questions"
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
    aimsAndScope: "Publishes high-quality research across all areas of the natural sciences with significant specialist interest and high technical rigor.",
    deskRejectHazards: [
      "Methodological soundness questions (sample size, uncorrected statistics)",
      "Unclear incremental value over established methods",
      "Missing raw source data or open-source repository release"
    ],
    keyExpectations: [
      "High technical rigor and thorough experimental execution",
      "Complete data availability statements and raw source data"
    ]
  },
  {
    name: "Science Advances",
    publisher: "AAAS",
    impactFactor: 13.6,
    discipline: "Multidisciplinary",
    acceptanceRate: "14-16%",
    reviewSpeed: "6-8 weeks to first decision",
    openAccess: "Gold OA",
    aimsAndScope: "Publishes impactful research across all scientific domains, emphasizing rigorous execution, cross-field interest, and open science.",
    deskRejectHazards: [
      "Subfield specialization without broader conceptual advance",
      "Underpowered cohort statistics or missing replication assays"
    ],
    keyExpectations: [
      "Clear articulation of novelty and societal or fundamental impact",
      "Open data, complete methods, and reproducible protocols"
    ]
  },
  {
    name: "Proceedings of the National Academy of Sciences (PNAS)",
    publisher: "National Academy of Sciences",
    impactFactor: 9.4,
    discipline: "Multidisciplinary",
    acceptanceRate: "15-17%",
    reviewSpeed: "5-7 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes authoritative, peer-reviewed research spanning biological, physical, and social sciences with broad scientific significance.",
    deskRejectHazards: [
      "Overly specialized technical reports lacking conceptual breadth",
      "Omission of direct comparisons against established benchmarks"
    ],
    keyExpectations: [
      "Clear significance statement describing broader societal impact",
      "Sound scientific execution and peer validation"
    ]
  },
  {
    name: "PLOS ONE",
    publisher: "Public Library of Science",
    impactFactor: 3.7,
    discipline: "Multidisciplinary",
    acceptanceRate: "48-52%",
    reviewSpeed: "6-10 weeks to first decision",
    openAccess: "Gold OA",
    aimsAndScope: "Publishes scientifically rigorous primary research across all disciplines without subjective assessments of perceived novelty or impact.",
    deskRejectHazards: [
      "Statistical errors, missing ethical clearances, or consent disclosures",
      "Data availability restrictions without legal or ethical justification"
    ],
    keyExpectations: [
      "Sound scientific methodology and proper negative/positive control conditions",
      "Full open data sharing adhering to FAIR principles"
    ]
  },

  // ==========================================
  // ONCOLOGY & CANCER BIOLOGY
  // ==========================================
  {
    name: "Cancer Discovery",
    publisher: "American Association for Cancer Research (AACR)",
    impactFactor: 28.2,
    discipline: "Oncology",
    acceptanceRate: "8-10%",
    reviewSpeed: "4-5 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes major breakthroughs in cancer biology, translational discovery, clinical oncology trials, and drug resistance mechanisms.",
    deskRejectHazards: [
      "In vitro findings without in vivo animal models or patient biopsy verification",
      "Correlative target nomination lacking direct genetic rescue or degron assays",
      "Absence of clinical cohort survival or recurrence correlation"
    ],
    keyExpectations: [
      "Direct translational therapeutic implications for oncology patients",
      "Orthogonal genetic and pharmacologic target validation in patient-derived models"
    ]
  },
  {
    name: "Molecular Cancer",
    publisher: "BioMed Central / Springer Nature",
    impactFactor: 27.7,
    discipline: "Oncology",
    acceptanceRate: "12-14%",
    reviewSpeed: "4-6 weeks to first decision",
    openAccess: "Gold OA",
    aimsAndScope: "Publishes high-impact basic, translational, and clinical cancer research focusing on molecular signaling pathways and targeted therapy.",
    deskRejectHazards: [
      "Incomplete pathway dissection without functional perturbation assays",
      "Small unpowered sample cohorts without statistical correction"
    ],
    keyExpectations: [
      "Deep mechanistic elucidation of oncogenic transcriptional or metabolic rewiring",
      "Comprehensive validation across multiple independent cancer models"
    ]
  },
  {
    name: "Clinical Cancer Research",
    publisher: "American Association for Cancer Research (AACR)",
    impactFactor: 11.5,
    discipline: "Oncology",
    acceptanceRate: "15-18%",
    reviewSpeed: "5-6 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes innovative translational and clinical oncology research that directly informs clinical trial design and biomarker evaluation.",
    deskRejectHazards: [
      "Basic molecular mechanisms with no demonstrable clinical or translational bridge",
      "Uncharacterized patient cohort heterogeneity or missing clinical annotation"
    ],
    keyExpectations: [
      "Clinical cohort biomarker evaluation with rigorous receiver operating characteristic (ROC) curves",
      "Clear therapeutic window demonstration in preclinical models"
    ]
  },
  {
    name: "Oncogene",
    publisher: "Springer Nature",
    impactFactor: 6.9,
    discipline: "Oncology",
    acceptanceRate: "22-25%",
    reviewSpeed: "5-7 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes fundamental cellular and molecular mechanisms of oncogenesis, metastasis, chromatin regulation, and cancer cell death.",
    deskRejectHazards: [
      "Over-reliance on a single cell line without biological replicates",
      "Correlative knockdown assays lacking western blot or qPCR verification"
    ],
    keyExpectations: [
      "Solid cellular and molecular assays verifying pathway perturbation",
      "Appropriate negative and positive controls across experimental panels"
    ]
  },
  {
    name: "Cancer Letters",
    publisher: "Elsevier",
    impactFactor: 9.1,
    discipline: "Oncology",
    acceptanceRate: "20-23%",
    reviewSpeed: "4-6 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes broad basic, translational, and epidemiological cancer research with a focus on molecular genetics and targeted therapeutics.",
    deskRejectHazards: [
      "Descriptive expression profiles without mechanistic follow-up",
      "Lack of statistical power calculations in animal studies"
    ],
    keyExpectations: [
      "Clear experimental hypothesis with functional validation assays",
      "Detailed materials and methods supporting full reproducibility"
    ]
  },

  // ==========================================
  // BIOMEDICINE & GENETICS
  // ==========================================
  {
    name: "Cell",
    publisher: "Cell Press / Elsevier",
    impactFactor: 66.8,
    discipline: "Biomedicine",
    acceptanceRate: "8-10%",
    reviewSpeed: "4-5 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes landmark discoveries in molecular biology, biochemistry, cancer research, immunology, neuroscience, and cellular physiology.",
    deskRejectHazards: [
      "Phenotypic observation without complete mechanistic molecular elucidation",
      "Single model system without in vivo or physiological validation",
      "CRISPR screens or ChIP-seq missing orthogonal genetic rescue controls"
    ],
    keyExpectations: [
      "Comprehensive mechanistic narrative from molecular trigger to physiological consequence",
      "Full STAR Methods documentation with deposited raw datasets"
    ]
  },
  {
    name: "Nature Genetics",
    publisher: "Springer Nature",
    impactFactor: 31.7,
    discipline: "Biomedicine",
    acceptanceRate: "8-10%",
    reviewSpeed: "5-7 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes cutting-edge genetic and genomic research, including functional genomics, chromatin architecture, GWAS, and gene editing technologies.",
    deskRejectHazards: [
      "Genomic association without functional molecular experimental validation",
      "Uncorrected multiple hypothesis testing across high-throughput datasets"
    ],
    keyExpectations: [
      "Rigorous statistical FDR corrections across all genomic screens",
      "Functional experimental verification of nominated regulatory variants"
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
    aimsAndScope: "Publishes physical, chemical, biochemical, and biological aspects of nucleic acids, proteins involved in metabolism, and genomic tools.",
    deskRejectHazards: [
      "Computational tool without experimental benchmarking or public reproducible repository",
      "Unclear biochemical verification of nucleic acid binding predictions"
    ],
    keyExpectations: [
      "Rigorous computational tools with public web server or container",
      "Clear mechanistic assays supporting DNA/RNA interactions"
    ]
  },
  {
    name: "Cell Reports",
    publisher: "Cell Press / Elsevier",
    impactFactor: 8.8,
    discipline: "Biomedicine",
    acceptanceRate: "20-25%",
    reviewSpeed: "5-7 weeks to first decision",
    openAccess: "Gold OA",
    aimsAndScope: "Publishes high-quality, peer-reviewed primary research across life sciences, reporting focused mechanistic insights.",
    deskRejectHazards: [
      "Conclusions overreaching the scope of tested biological models",
      "Missing baseline control conditions or vehicle controls"
    ],
    keyExpectations: [
      "Single clear biological advance supported by solid experimental evidence",
      "Standardized STAR Methods with open dataset deposition"
    ]
  },
  {
    name: "The EMBO Journal",
    publisher: "EMBO Press / Springer Nature",
    impactFactor: 9.4,
    discipline: "Biomedicine",
    acceptanceRate: "12-15%",
    reviewSpeed: "4-6 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes research in molecular and cell biology with an emphasis on molecular mechanisms and physiological relevance.",
    deskRejectHazards: [
      "Descriptive catalogs lacking molecular mechanism",
      "Failure to provide uncropped blot source data"
    ],
    keyExpectations: [
      "Detailed molecular mechanism dissected at physiological expression levels",
      "Transparent source data publication for all figures"
    ]
  },

  // ==========================================
  // CLINICAL MEDICINE
  // ==========================================
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
    name: "The New England Journal of Medicine (NEJM)",
    publisher: "Massachusetts Medical Society",
    impactFactor: 96.2,
    discipline: "Clinical",
    acceptanceRate: "4-5%",
    reviewSpeed: "3-4 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes landmark clinical trial results and practice-defining clinical medicine reports altering patient outcomes worldwide.",
    deskRejectHazards: [
      "Surrogate endpoints without proven correlation to clinical survival",
      "Underpowered phase II studies without definitive prospective randomized controls"
    ],
    keyExpectations: [
      "Pivotal phase III randomized controlled trials or transformative clinical discoveries",
      "Strict compliance with ICMJE trial registration and clinical protocol deposit"
    ]
  },
  {
    name: "Nature Medicine",
    publisher: "Springer Nature",
    impactFactor: 58.7,
    discipline: "Clinical",
    acceptanceRate: "7-9%",
    reviewSpeed: "4-6 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes transformative translational and clinical research addressing major human diseases, digital health, and novel therapeutics.",
    deskRejectHazards: [
      "In vitro discoveries without translational patient cohort validation",
      "Lack of blind evaluation in diagnostic biomarker testing"
    ],
    keyExpectations: [
      "Compelling translational bridge from basic biology to clinical patient cohorts",
      "Comprehensive validation in multicenter patient cohorts"
    ]
  },
  {
    name: "Journal of Clinical Oncology (JCO)",
    publisher: "American Society of Clinical Oncology (ASCO)",
    impactFactor: 42.1,
    discipline: "Clinical",
    acceptanceRate: "10-12%",
    reviewSpeed: "4-5 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes original clinical oncology research, phase II/III trials, clinical biomarker studies, and precision oncology protocols.",
    deskRejectHazards: [
      "Retrospective single-institution cohorts without external validation",
      "Non-compliance with CONSORT reporting standards"
    ],
    keyExpectations: [
      "Rigorous multicenter clinical outcomes or prospective trial data",
      "Definitive statistical power justification and survival analysis"
    ]
  },
  {
    name: "Annals of Internal Medicine",
    publisher: "American College of Physicians",
    impactFactor: 19.6,
    discipline: "Clinical",
    acceptanceRate: "8-10%",
    reviewSpeed: "4-5 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes clinical trials, systematic reviews, and epidemiological studies promoting excellence in medical practice and healthcare policy.",
    deskRejectHazards: [
      "Methodological bias in observational design without sensitivity analysis",
      "Unadjusted confounding variables in clinical registry analyses"
    ],
    keyExpectations: [
      "Direct relevance to clinical practice in internal medicine",
      "Complete transparency in data sharing and study protocol"
    ]
  },

  // ==========================================
  // COMPUTER SCIENCE, AI & MACHINE LEARNING
  // ==========================================
  {
    name: "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)",
    publisher: "IEEE",
    impactFactor: 20.8,
    discipline: "Computer Science",
    acceptanceRate: "12-14%",
    reviewSpeed: "8-12 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes state-of-the-art research in computer vision, pattern recognition, machine learning algorithms, and artificial intelligence theory.",
    deskRejectHazards: [
      "Benchmark gains on a single dataset without statistical significance testing",
      "Lack of mathematical proofs or theoretical bounds where claimed",
      "Omission of competitive baselines from recent premier venues (CVPR, ICCV, NeurIPS)"
    ],
    keyExpectations: [
      "Comprehensive cross-dataset evaluations with multiple random seeds",
      "Extensive ablation studies isolating every architectural component",
      "Open-source reproducible code release"
    ]
  },
  {
    name: "Nature Machine Intelligence",
    publisher: "Springer Nature",
    impactFactor: 18.8,
    discipline: "Computer Science",
    acceptanceRate: "10-12%",
    reviewSpeed: "5-7 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes high-impact research on machine learning, robotics, and AI applications across scientific discovery, medicine, and society.",
    deskRejectHazards: [
      "Incremental neural network engineering without conceptual breakthrough",
      "Black-box models evaluated without interpretability, fairness, or robustness analysis"
    ],
    keyExpectations: [
      "Transformative conceptual leap in AI or novel application to complex scientific challenges",
      "Rigorous external generalization benchmarking and open code/weights release"
    ]
  },
  {
    name: "IEEE Transactions on Medical Imaging (TMI)",
    publisher: "IEEE",
    impactFactor: 10.6,
    discipline: "Computer Science",
    acceptanceRate: "15-18%",
    reviewSpeed: "6-8 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes mathematical, physical, and computational aspects of medical imaging, reconstruction, segmentation, and computer-aided diagnosis.",
    deskRejectHazards: [
      "Evaluation on single-institution imaging dataset without multicenter test splits",
      "Overstating diagnostic accuracy without radiologist or clinician benchmark comparison"
    ],
    keyExpectations: [
      "Multicenter dataset validation demonstrating robustness to domain shift",
      "Rigorous clinical metric reporting (Dice, HD95, Sensitivity/Specificity) with statistical testing"
    ]
  },
  {
    name: "Journal of Machine Learning Research (JMLR)",
    publisher: "Microtome Publishing",
    impactFactor: 5.6,
    discipline: "Computer Science",
    acceptanceRate: "15-20%",
    reviewSpeed: "12-16 weeks to first decision",
    openAccess: "Gold OA",
    aimsAndScope: "Publishes foundational machine learning research, including learning theory, optimization, probabilistic models, and core algorithms.",
    deskRejectHazards: [
      "Heuristic algorithms lacking theoretical convergence guarantees or formal proof",
      "Limited experimental verification on standard synthetic and real-world benchmarks"
    ],
    keyExpectations: [
      "Complete theoretical derivations and mathematical proofs in appendix",
      "Open access code release and comprehensive empirical benchmarking"
    ]
  },
  {
    name: "Pattern Recognition",
    publisher: "Elsevier",
    impactFactor: 7.5,
    discipline: "Computer Science",
    acceptanceRate: "18-22%",
    reviewSpeed: "6-10 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes developments in pattern recognition, computer vision, image processing, neural networks, and biometric identification.",
    deskRejectHazards: [
      "Superficial modifications to existing backbones without clear architectural rationale",
      "Missing error analysis and qualitative failure case discussions"
    ],
    keyExpectations: [
      "Systematic benchmark comparisons against contemporary peer-reviewed baselines",
      "Detailed computational complexity (FLOPs, parameters, inference latency) profiling"
    ]
  },

  // ==========================================
  // NEUROSCIENCE
  // ==========================================
  {
    name: "Nature Neuroscience",
    publisher: "Springer Nature",
    impactFactor: 21.2,
    discipline: "Neuroscience",
    acceptanceRate: "8-10%",
    reviewSpeed: "4-6 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes premier discoveries in molecular, cellular, systems, cognitive, and computational neuroscience.",
    deskRejectHazards: [
      "Correlative neural activity measurements without causal optogenetic or chemogenetic manipulation",
      "Behavioral assays lacking adequate controls for locomotion or sensory deficits"
    ],
    keyExpectations: [
      "Definitive causal link connecting circuit mechanics to behavioral output",
      "High-resolution neurophysiological or imaging verification"
    ]
  },
  {
    name: "Neuron",
    publisher: "Cell Press / Elsevier",
    impactFactor: 14.7,
    discipline: "Neuroscience",
    acceptanceRate: "10-12%",
    reviewSpeed: "4-6 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes influential discoveries across all neuroscience disciplines, with a focus on mechanistic insight and circuit function.",
    deskRejectHazards: [
      "Observation of neural phenotype without underlying molecular or synaptic mechanism",
      "Inadequate animal cohort sample sizes for behavioral metrics"
    ],
    keyExpectations: [
      "Rigorous mechanistic depth and multi-level experimental validation",
      "Standardized STAR Methods with open neurodata deposition"
    ]
  },
  {
    name: "The Journal of Neuroscience",
    publisher: "Society for Neuroscience (SfN)",
    impactFactor: 5.3,
    discipline: "Neuroscience",
    acceptanceRate: "25-30%",
    reviewSpeed: "4-6 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes rigorous, peer-reviewed empirical research covering all aspects of the nervous system and brain function.",
    deskRejectHazards: [
      "Statistical reporting lacking exact p-values, degrees of freedom, or normality tests",
      "Missing blinding during behavioral or histological analysis"
    ],
    keyExpectations: [
      "High methodological rigor, comprehensive statistical transparency, and proper controls"
    ]
  },
  // ==========================================
  // OPERATIONS RESEARCH & MANAGEMENT
  // ==========================================
  {
    name: "European Journal of Operational Research",
    publisher: "Elsevier",
    impactFactor: 6.4,
    discipline: "Operations Research & Management",
    acceptanceRate: "12-15%",
    reviewSpeed: "6-8 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes high-quality, original papers that contribute to the methodology of operational research (OR) and to the practice of decision making in management, economics, and engineering.",
    deskRejectHazards: [
      "Mathematical models without analytical proof of convexity or global optimality",
      "Absence of managerial insights or practical decision-support value",
      "Omission of realistic cost or emissions parameter benchmarking against recent literature"
    ],
    keyExpectations: [
      "Rigorous mathematical formulation with clear optimality conditions",
      "Thorough numerical experiments and sensitivity analysis under varying market conditions",
      "Substantive discussion of operational and policy implications"
    ]
  },
  {
    name: "Journal of Cleaner Production",
    publisher: "Elsevier",
    impactFactor: 11.1,
    discipline: "Operations Research & Management",
    acceptanceRate: "14-16%",
    reviewSpeed: "5-7 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Focuses on cleaner production, environmental and sustainability research, and supply chain closed-loop / circular economy systems.",
    deskRejectHazards: [
      "Theoretical modeling divorced from practical environmental regulation (carbon tax, cap-and-trade)",
      "Lack of life-cycle or multi-source emissions accounting in reverse logistics",
      "Incremental contribution over existing circular economy frameworks"
    ],
    keyExpectations: [
      "Clear articulation of environmental emissions reduction mechanisms",
      "Practical case study or multi-item numerical demonstration with policy insights",
      "Direct relevance to sustainable development goals and industrial practice"
    ]
  },
  {
    name: "Transportation Research Part E: Logistics and Transportation Review",
    publisher: "Elsevier",
    impactFactor: 10.6,
    discipline: "Operations Research & Management",
    acceptanceRate: "10-13%",
    reviewSpeed: "6-8 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes high-quality scholarly research in the fields of logistics, reverse supply chains, and freight transportation network optimization.",
    deskRejectHazards: [
      "Simplistic reverse logistics assumptions without closed-loop operational constraints",
      "Lack of computational algorithmic benchmarking or convergence analysis",
      "Insufficient comparison against recent supply chain carbon policy models"
    ],
    keyExpectations: [
      "Advanced optimization modeling for multi-echelon or reverse logistics networks",
      "Robust solution algorithms with proven computational efficiency",
      "Rigorous sensitivity testing on regulatory policy parameters"
    ]
  },
  {
    name: "International Journal of Production Economics",
    publisher: "Elsevier",
    impactFactor: 12.0,
    discipline: "Operations Research & Management",
    acceptanceRate: "10-12%",
    reviewSpeed: "6-9 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Focuses on the interface between engineering and management in manufacturing, inventory systems, sustainable production, and supply chain economics.",
    deskRejectHazards: [
      "Failure to model price-dependent demand or market equilibrium realistically",
      "Lack of budget constraint analysis on green technology investments",
      "Deterministic assumptions without sensitivity or robustness boundaries"
    ],
    keyExpectations: [
      "Methodological rigor integrating economic profitability and environmental compliance",
      "Comprehensive analytical derivations of decision variables",
      "Managerial guidelines for industrial decision-makers"
    ]
  },
  {
    name: "Annals of Operations Research",
    publisher: "Springer Nature",
    impactFactor: 4.8,
    discipline: "Operations Research & Management",
    acceptanceRate: "18-22%",
    reviewSpeed: "7-10 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes peer-reviewed original articles dealing with key aspects of operations research including theory, applications, and computational methods.",
    deskRejectHazards: [
      "Heuristic solution methods without optimality bounds or proofs",
      "Absence of structured step-by-step algorithms",
      "Superficial literature review omitting core foundational OR works"
    ],
    keyExpectations: [
      "Detailed analytical proofs (KKT conditions, Hessian matrix positive-definiteness)",
      "Structured algorithm presentation with pseudo-code and parameter tables",
      "Comparative numerical analysis"
    ]
  },
  {
    name: "Opsearch",
    publisher: "Springer (Operational Research Society of India)",
    impactFactor: 1.4,
    discipline: "Operations Research & Management",
    acceptanceRate: "20-25%",
    reviewSpeed: "6-8 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "The official journal of the Operational Research Society of India, publishing theoretical, computational, and applied developments across operations research, inventory theory, and optimization.",
    deskRejectHazards: [
      "Lack of sufficient mathematical rigor or missing second-order sufficiency conditions",
      "Unclear notation or undefined decision variables in model development",
      "Failure to benchmark against classic inventory and carbon policy literature"
    ],
    keyExpectations: [
      "Clear statement of assumptions and notation table",
      "Complete derivation of optimal decision variables and existence conditions",
      "Numerical illustrations demonstrating model tractability"
    ]
  },
  {
    name: "Computers & Operations Research",
    publisher: "Elsevier",
    impactFactor: 4.6,
    discipline: "Operations Research & Management",
    acceptanceRate: "15-18%",
    reviewSpeed: "6-8 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Provides an international forum for the application of computer science and operations research methods to problem solving in business, industry, and government.",
    deskRejectHazards: [
      "Optimization formulations without computational run-time or algorithmic complexity reporting",
      "Inadequate parameter sensitivity analysis",
      "Lack of reproducible implementation details (e.g., Python / SciPy numerical solvers)"
    ],
    keyExpectations: [
      "Algorithm design with computational complexity and runtime analysis",
      "Numerical validation across multiple item instances and regulatory scenarios",
      "Clear decision-support applicability for modern automated supply chains"
    ]
  },

  // ==========================================
  // ENVIRONMENTAL SCIENCE & SUSTAINABILITY
  // ==========================================
  {
    name: "Nature Climate Change",
    publisher: "Springer Nature",
    impactFactor: 29.6,
    discipline: "Environmental Science & Sustainability",
    acceptanceRate: "8-10%",
    reviewSpeed: "5-7 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Dedicated to publishing the most significant and cutting-edge research on the nature, underlying causes, and impacts of global climate change and its implications for the economy, policy, and the world at large.",
    deskRejectHazards: [
      "Local observational case study without global conceptual or mechanistic implications",
      "Insufficient climate model ensemble resolution or unquantified projection uncertainty",
      "Policy assertions disconnected from empirical carbon flux or socioeconomic modeling data"
    ],
    keyExpectations: [
      "Rigorous climate attribution or systemic ecological impact quantification",
      "Interdisciplinary resonance spanning physical, ecological, or socioeconomic dimensions",
      "Complete documentation of climate data sources, code pipelines, and scenario bounds"
    ]
  },
  {
    name: "Nature Sustainability",
    publisher: "Springer Nature",
    impactFactor: 25.7,
    discipline: "Environmental Science & Sustainability",
    acceptanceRate: "7-9%",
    reviewSpeed: "4-6 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Publishes significant research about sustainability, from natural sciences, social sciences, and engineering, addressing environmental degradation, sustainable development, and planetary boundaries.",
    deskRejectHazards: [
      "Technological assessments ignoring life-cycle environmental feedback or resource constraints",
      "Narrow disciplinary scope failing to address systemic sustainability trade-offs",
      "Unverified assumptions regarding adoption scale or policy implementation"
    ],
    keyExpectations: [
      "Integrative framework bridging environmental boundaries and human well-being",
      "Holistic life cycle impact assessment (LCA) and resource footprint analysis",
      "Robust sensitivity analysis across policy and behavioral adoption trajectories"
    ]
  },
  {
    name: "Environmental Science & Technology",
    publisher: "ACS Publications",
    impactFactor: 10.8,
    discipline: "Environmental Science & Sustainability",
    acceptanceRate: "18-22%",
    reviewSpeed: "4-6 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "An authoritative source of information for professionals in a wide range of environmental disciplines, publishing rigorous, high-impact research on complex environmental phenomena.",
    deskRejectHazards: [
      "Incomplete analytical characterization of chemical/environmental pathways",
      "Missing QA/QC controls, field blanks, or spike-recovery validation",
      "Lack of mechanistic environmental fate or transport modeling"
    ],
    keyExpectations: [
      "Exemplary analytical chemistry and environmental data quality assurance",
      "Clear delineation of biogeochemical mechanisms or pollutant mitigation efficiency",
      "Full deposition of raw spectroscopic, chromatographic, or environmental measurement data"
    ]
  },
  {
    name: "Journal of Cleaner Production",
    publisher: "Elsevier",
    impactFactor: 9.7,
    discipline: "Environmental Science & Sustainability",
    acceptanceRate: "20-25%",
    reviewSpeed: "6-8 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "Focuses on cleaner production, environmental, and sustainability research and practice, facilitating the transition toward sustainable societies.",
    deskRejectHazards: [
      "Generic sustainability claims without quantitative life-cycle metrics (e.g. ISO 14040/44)",
      "Failure to model circular economy material flows with empirical baseline comparison",
      "Superficial discussion of technological or economic feasibility"
    ],
    keyExpectations: [
      "Quantitative life-cycle assessment (LCA) or material flow analysis (MFA)",
      "Explicit technological and environmental trade-off evaluation",
      "Actionable recommendations for industrial or environmental policy adoption"
    ]
  },
  {
    name: "Environmental Research Letters",
    publisher: "IOP Publishing",
    impactFactor: 5.8,
    discipline: "Environmental Science & Sustainability",
    acceptanceRate: "25-30%",
    reviewSpeed: "4-6 weeks to first decision",
    openAccess: "Gold OA",
    aimsAndScope: "An open access journal covering environmental science, providing a forum for rapid publication of high-impact research across the full environmental science agenda.",
    deskRejectHazards: [
      "Excessive length exceeding letters format without succinct focus",
      "Uncalibrated remote sensing or spatial extrapolations without ground-truth validation",
      "Failure to address uncertainty intervals in ecological or emission estimates"
    ],
    keyExpectations: [
      "Concise, high-impact presentation of urgent environmental findings",
      "Defensible spatial-temporal validation with quantified uncertainty bounds",
      "Open access data and reproducible analysis code"
    ]
  },
  {
    name: "Science of The Total Environment",
    publisher: "Elsevier",
    impactFactor: 8.2,
    discipline: "Environmental Science & Sustainability",
    acceptanceRate: "24-28%",
    reviewSpeed: "5-7 weeks to first decision",
    openAccess: "Hybrid",
    aimsAndScope: "International journal for scientific research into the total environment, which interfaces the atmosphere, lithosphere, hydrosphere, biosphere, and anthroposphere.",
    deskRejectHazards: [
      "Routine monitoring data without novel environmental or geochemical insights",
      "Single-location field sampling without temporal or regional replication",
      "Omission of multivariate statistical significance and co-variate control"
    ],
    keyExpectations: [
      "Comprehensive multi-compartment environmental assessment",
      "Rigorous spatial and temporal sampling replication with robust statistics",
      "Clear explanation of environmental implications for ecosystems or public health"
    ]
  }
];

/**
 * Intelligent domain classifier to detect manuscript discipline
 */
export function detectDiscipline(title: string, abstract: string, targetJournal?: string): JournalEntry['discipline'] {
  const text = `${title} ${abstract} ${targetJournal || ''}`.toLowerCase();

  // Environmental Science & Sustainability
  const envTerms = [
    'climate change', 'sustainability', 'carbon footprint', 'greenhouse gas', 'biodiversity',
    'ecosystem', 'deforestation', 'renewable energy', 'life cycle assessment', 'lifecycle assessment',
    'environmental policy', 'water quality', 'ecological', 'conservation', 'carbon sequestration',
    'microplastics', 'pollution', 'sustainable development', 'planetary boundaries', 'circular economy',
    'carbon emissions', 'emissions reduction', 'air quality', 'soil degradation', 'environmental science'
  ];
  const envScore = envTerms.filter(t => text.includes(t)).length;

  // Operations Research, Supply Chain & Industrial Engineering
  const orTerms = [
    'supply chain', 'inventory model', 'reverse logistics', 'remanufacturing',
    'operations research', 'opsearch', 'eoq', 'holding cost', 'decision variable',
    'nonlinear optimization', 'sensitivity analysis', 'replenishment', 'refurbishment',
    'production planning', 'queueing', 'stochastic programming', 'vehicle routing',
    'facility location', 'integer programming', 'linear programming'
  ];
  const orScore = orTerms.filter(t => text.includes(t)).length;

  // Computer Science & AI
  const csTerms = [
    'neural network', 'deep learning', 'transformer', 'machine learning', 'computer vision',
    'segmentation', 'benchmark', 'classifier', 'algorithm', 'loss function', 'gpu',
    'reinforcement learning', 'llm', 'natural language', 'backbone', 'convolutional', 'tpami', 'ieee trans'
  ];
  const csScore = csTerms.filter(t => text.includes(t)).length;

  // Oncology / Cancer Biology
  const oncoTerms = [
    'cancer', 'tumor', 'tumour', 'carcinoma', 'oncology', 'oncogene', 'dll3', 'sclc', 'nsclc',
    'melanoma', 'chemotherapy', 'metastasis', 'pd-l1', 'organoid', 'immunotherapy', 'leukemia',
    'lymphoma', 'glioma', 'p53', 'kras', 'biomarker', 'pou2f1', 'crispr screen'
  ];
  const oncoScore = oncoTerms.filter(t => text.includes(t)).length;

  // Clinical Medicine
  const clinTerms = [
    'clinical trial', 'randomized controlled', 'randomised', 'placebo', 'cohort', 'patients',
    'phase 1', 'phase 2', 'phase 3', 'hospital', 'mortality', 'hazard ratio', 'survival rate',
    'epidemiology', 'prognosis', 'multicenter', 'consort', 'strobe', 'lancet', 'nejm', 'jama'
  ];
  const clinScore = clinTerms.filter(t => text.includes(t)).length;

  // Neuroscience
  const neuroTerms = [
    'neuron', 'neural circuit', 'synaptic', 'cortex', 'hippocampus', 'electrophysiology',
    'optogenetic', 'brain', 'cognitive', 'glial', 'astrocyte', 'neurodegenerative', 'parkinson', 'alzheimer'
  ];
  const neuroScore = neuroTerms.filter(t => text.includes(t)).length;

  // Biomedicine / Genetics
  const bioTerms = [
    'rna-seq', 'protein', 'crispr', 'chip-seq', 'pathway', 'gene expression', 'enzyme',
    'western blot', 'mutation', 'cell culture', 'phosphorylation', 'chromatin', 'promoter', 'enhancer'
  ];
  const bioScore = bioTerms.filter(t => text.includes(t)).length;

  // Evaluate scores with priority weighting
  // Require at least 2 distinct domain terms or weighted score > 2.5 to avoid false positives on single incidental words
  const scores = [
    { discipline: 'Environmental Science & Sustainability' as const, score: envScore >= 2 ? envScore * 2.2 : 0 },
    { discipline: 'Operations Research & Management' as const, score: orScore >= 2 ? orScore * 2.2 : 0 },
    { discipline: 'Computer Science' as const, score: csScore >= 2 ? csScore * 2.0 : 0 },
    { discipline: 'Oncology' as const, score: oncoScore >= 2 ? oncoScore * 2.2 : 0 },
    { discipline: 'Neuroscience' as const, score: neuroScore >= 2 ? neuroScore * 2.0 : 0 },
    { discipline: 'Clinical' as const, score: clinScore >= 2 ? clinScore * 1.8 : 0 },
    { discipline: 'Biomedicine' as const, score: bioScore >= 2 ? bioScore * 1.2 : 0 }
  ];

  scores.sort((a, b) => b.score - a.score);

  if (scores[0].score > 2.5) {
    return scores[0].discipline;
  }

  return 'Multidisciplinary';
}

/**
 * Genuine Journal Matching:
 * Strictly filters within the manuscript's detected domain, guarantees zero discipline crossover,
 * and benchmarks tiers relative to the study's scope.
 */
export function parseAcceptanceRate(rateStr: string): number {
  if (!rateStr) return 0;
  const m = rateStr.match(/(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?\s*%/);
  if (!m) return 0;
  if (m[2]) {
    return (parseFloat(m[1]) + parseFloat(m[2])) / 2;
  }
  return parseFloat(m[1]);
}

export function findMatchingJournals(
  title: string,
  abstract: string,
  targetJournal?: string
): {
  reach: JournalEntry;
  realistic: JournalEntry;
  fallback: JournalEntry;
  detectedDiscipline: JournalEntry['discipline'];
  allMatches: { journal: JournalEntry; matchScore: number }[];
  crossDisciplinary?: JournalEntry[];
} {
  const discipline = detectDiscipline(title, abstract, targetJournal);

  // Filter catalog strictly to matching discipline
  const domainJournals = JOURNAL_CATALOG.filter(j => j.discipline === discipline);
  const multiJournals = JOURNAL_CATALOG.filter(j => j.discipline === 'Multidisciplinary');

  // Sort domain journals by impact factor descending
  domainJournals.sort((a, b) => b.impactFactor - a.impactFactor);

  let reach: JournalEntry;
  let realistic: JournalEntry;
  let fallback: JournalEntry;

  if (domainJournals.length >= 3) {
    // Reach: highest in-discipline impact factor
    reach = domainJournals[0];

    // Fallback: in-discipline journal with the highest acceptance rate (most accessible)
    const nonReach = domainJournals.slice(1);
    const sortedByAR = [...nonReach].sort((a, b) => {
      const arDiff = parseAcceptanceRate(b.acceptanceRate) - parseAcceptanceRate(a.acceptanceRate);
      if (arDiff !== 0) return arDiff;
      return a.impactFactor - b.impactFactor;
    });
    fallback = sortedByAR[0];

    // Realistic: in-discipline journal nearest the median acceptance rate among remaining
    const remaining = domainJournals.filter(j => j.name !== reach.name && j.name !== fallback.name);
    const domainARs = domainJournals.map(j => parseAcceptanceRate(j.acceptanceRate)).sort((a, b) => a - b);
    const medianAR = domainARs[Math.floor(domainARs.length / 2)];

    remaining.sort((a, b) => {
      const distA = Math.abs(parseAcceptanceRate(a.acceptanceRate) - medianAR);
      const distB = Math.abs(parseAcceptanceRate(b.acceptanceRate) - medianAR);
      if (distA !== distB) return distA - distB;
      return b.impactFactor - a.impactFactor;
    });
    realistic = remaining[0] || nonReach[0];
  } else if (domainJournals.length === 2) {
    reach = domainJournals[0];
    fallback = domainJournals[1];
    realistic = domainJournals[1];
  } else if (domainJournals.length === 1) {
    reach = domainJournals[0];
    realistic = domainJournals[0];
    fallback = domainJournals[0];
  } else {
    reach = multiJournals[0];
    realistic = multiJournals[2] || multiJournals[1];
    fallback = multiJournals[multiJournals.length - 1];
  }

  // Cross-disciplinary journals (clearly marked, never disguised as in-discipline)
  const crossDisciplinary = discipline !== 'Multidisciplinary'
    ? multiJournals.map(j => ({ ...j, isCrossDisciplinary: true }))
    : [];

  const allScored = [
    ...domainJournals.map(j => ({ journal: j, matchScore: 90 })),
    ...crossDisciplinary.map(j => ({ journal: j, matchScore: 75 })),
  ];

  return {
    reach,
    realistic,
    fallback,
    detectedDiscipline: discipline,
    allMatches: allScored,
    crossDisciplinary: crossDisciplinary.length > 0 ? crossDisciplinary : undefined,
  };
}

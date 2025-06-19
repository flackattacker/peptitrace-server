const peptideSeedData = [
  {
    name: "BPC-157",
    peptide_sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    category: "Healing & Recovery",
    description: "A synthetic peptide with potent healing and regenerative properties",
    detailedDescription: "BPC-157 is a synthetic peptide derived from a protective protein found in gastric juice. It has shown remarkable healing properties for various tissues including tendons, muscles, and the gastrointestinal tract. Its mechanism involves promoting angiogenesis and tissue repair through growth factor modulation.",
    mechanism: "Promotes angiogenesis and tissue repair through growth factor modulation",
    commonDosage: "250-500 mcg",
    commonFrequency: "daily",
    commonEffects: [
      "Tissue repair",
      "Anti-inflammatory",
      "Gut healing",
      "Tendon repair",
      "Joint healing"
    ],
    sideEffects: [
      "Mild injection site reactions",
      "Rare allergic reactions"
    ],
    dosageRanges: {
      low: "250 mcg",
      medium: "500 mcg",
      high: "1000 mcg"
    },
    timeline: {
      onset: "1-2 days",
      peak: "2-3 weeks",
      duration: "4-6 weeks"
    }
  },
  {
    name: "TB-500",
    peptide_sequence: "Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Asp",
    category: "Healing & Recovery",
    description: "A synthetic peptide that promotes cell migration and tissue repair",
    detailedDescription: "TB-500 is a synthetic version of Thymosin Beta-4, a naturally occurring peptide that plays a crucial role in cell migration and tissue repair. It has shown significant potential in accelerating healing of various tissues and reducing inflammation.",
    mechanism: "Promotes cell migration and angiogenesis through actin binding",
    commonDosage: "2-5 mg",
    commonFrequency: "weekly",
    commonEffects: [
      "Tissue repair",
      "Wound healing",
      "Muscle recovery",
      "Joint healing",
      "Anti-inflammatory"
    ],
    sideEffects: [
      "Mild injection site reactions",
      "Rare allergic reactions"
    ],
    dosageRanges: {
      low: "2 mg",
      medium: "3.5 mg",
      high: "5 mg"
    },
    timeline: {
      onset: "2-3 days",
      peak: "3-4 weeks",
      duration: "6-8 weeks"
    }
  },
  {
    name: "CJC-1295",
    peptide_sequence: "Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Leu-Ser-Arg",
    category: "Growth Hormone",
    description: "A long-acting growth hormone releasing hormone analog",
    detailedDescription: "CJC-1295 is a synthetic analog of Growth Hormone Releasing Hormone (GHRH) that has been modified to have a longer half-life. It stimulates the natural production of growth hormone and IGF-1, leading to various anabolic and regenerative effects.",
    mechanism: "Growth hormone releasing hormone (GHRH) analog",
    commonDosage: "1-2 mg",
    commonFrequency: "weekly",
    commonEffects: [
      "Increased muscle mass",
      "Fat loss",
      "Improved sleep",
      "Enhanced recovery",
      "Anti-aging effects"
    ],
    sideEffects: [
      "Water retention",
      "Joint pain",
      "Carpal tunnel syndrome",
      "Insulin resistance"
    ],
    dosageRanges: {
      low: "1 mg",
      medium: "1.5 mg",
      high: "2 mg"
    },
    timeline: {
      onset: "1-2 weeks",
      peak: "4-6 weeks",
      duration: "8-12 weeks"
    }
  },
  {
    name: "Ipamorelin",
    peptide_sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH2",
    category: "Growth Hormone",
    description: "A selective growth hormone secretagogue",
    detailedDescription: "Ipamorelin is a pentapeptide that selectively stimulates growth hormone release without affecting other hormones like cortisol or prolactin. It's known for its clean profile and minimal side effects.",
    mechanism: "Growth hormone secretagogue",
    commonDosage: "200-1000 mcg",
    commonFrequency: "daily",
    commonEffects: [
      "Increased muscle mass",
      "Fat loss",
      "Improved sleep",
      "Enhanced recovery",
      "Anti-aging effects"
    ],
    sideEffects: [
      "Mild hunger",
      "Rare headaches",
      "Insulin resistance"
    ],
    dosageRanges: {
      low: "200 mcg",
      medium: "500 mcg",
      high: "1000 mcg"
    },
    timeline: {
      onset: "1-2 hours",
      peak: "2-3 hours",
      duration: "4-6 hours"
    }
  },
  {
    name: "GHK-Cu",
    peptide_sequence: "Gly-His-Lys-Cu",
    category: "Anti-Aging",
    description: "A copper peptide with tissue repair and anti-inflammatory properties",
    detailedDescription: "GHK-Cu is a naturally occurring copper peptide that has shown remarkable anti-aging and tissue repair properties. It's particularly effective for skin rejuvenation and wound healing.",
    mechanism: "Copper peptide with tissue repair and anti-inflammatory properties",
    commonDosage: "1-3 mg",
    commonFrequency: "daily",
    commonEffects: [
      "Skin rejuvenation",
      "Wound healing",
      "Anti-inflammatory",
      "Collagen synthesis",
      "Hair growth"
    ],
    sideEffects: [
      "Mild injection site reactions",
      "Rare allergic reactions"
    ],
    dosageRanges: {
      low: "1 mg",
      medium: "2 mg",
      high: "3 mg"
    },
    timeline: {
      onset: "1-2 weeks",
      peak: "4-6 weeks",
      duration: "8-12 weeks"
    }
  },
  {
    name: "PT-141",
    peptide_sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH2",
    category: "Performance & Enhancement",
    description: "A melanocortin receptor agonist for sexual function",
    detailedDescription: "PT-141 is a synthetic peptide that acts on melanocortin receptors to enhance sexual function. Unlike traditional treatments, it works through the central nervous system rather than affecting blood flow.",
    mechanism: "Melanocortin receptor agonist",
    commonDosage: "1-2 mg",
    commonFrequency: "as needed",
    commonEffects: [
      "Enhanced libido",
      "Improved sexual function",
      "Increased arousal"
    ],
    sideEffects: [
      "Nausea",
      "Flushing",
      "Headache",
      "Increased blood pressure"
    ],
    dosageRanges: {
      low: "1 mg",
      medium: "1.5 mg",
      high: "2 mg"
    },
    timeline: {
      onset: "30-60 minutes",
      peak: "2-3 hours",
      duration: "4-6 hours"
    }
  },
  {
    name: "DSIP",
    peptide_sequence: "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu",
    category: "Cognitive Enhancement",
    description: "A delta sleep-inducing peptide",
    detailedDescription: "DSIP (Delta Sleep-Inducing Peptide) is a naturally occurring peptide that helps regulate sleep patterns and stress response. It has shown potential in improving sleep quality and reducing stress.",
    mechanism: "Delta sleep-inducing peptide",
    commonDosage: "100-500 mcg",
    commonFrequency: "daily",
    commonEffects: [
      "Improved sleep quality",
      "Stress reduction",
      "Anti-anxiety",
      "Pain relief"
    ],
    sideEffects: [
      "Drowsiness",
      "Rare allergic reactions"
    ],
    dosageRanges: {
      low: "100 mcg",
      medium: "250 mcg",
      high: "500 mcg"
    },
    timeline: {
      onset: "30-60 minutes",
      peak: "2-3 hours",
      duration: "4-6 hours"
    }
  },
  {
    name: "Epitalon",
    peptide_sequence: "Ala-Glu-Asp-Gly",
    category: "Anti-Aging",
    description: "A telomerase-activating peptide",
    detailedDescription: "Epitalon is a synthetic peptide that has shown potential in activating telomerase and extending telomeres, which are associated with cellular aging. It has demonstrated various anti-aging effects in research.",
    mechanism: "Telomerase activation and anti-aging properties",
    commonDosage: "5-10 mg",
    commonFrequency: "daily",
    commonEffects: [
      "Anti-aging",
      "Improved sleep",
      "Enhanced longevity",
      "Cellular repair",
      "Immune support"
    ],
    sideEffects: [
      "Mild injection site reactions",
      "Rare allergic reactions"
    ],
    dosageRanges: {
      low: "5 mg",
      medium: "7.5 mg",
      high: "10 mg"
    },
    timeline: {
      onset: "2-3 weeks",
      peak: "4-6 weeks",
      duration: "8-12 weeks"
    }
  },
  {
    name: "Sermorelin",
    peptide_sequence: "Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg",
    category: "Growth Hormone",
    description: "A growth hormone releasing hormone",
    detailedDescription: "Sermorelin is a synthetic version of Growth Hormone Releasing Hormone (GHRH) that stimulates the natural production of growth hormone. It's often used as a safer alternative to direct growth hormone therapy.",
    mechanism: "Growth hormone releasing hormone (GHRH)",
    commonDosage: "100-300 mcg",
    commonFrequency: "daily",
    commonEffects: [
      "Increased muscle mass",
      "Fat loss",
      "Improved sleep",
      "Enhanced recovery",
      "Anti-aging effects"
    ],
    sideEffects: [
      "Water retention",
      "Joint pain",
      "Carpal tunnel syndrome",
      "Insulin resistance"
    ],
    dosageRanges: {
      low: "100 mcg",
      medium: "200 mcg",
      high: "300 mcg"
    },
    timeline: {
      onset: "1-2 weeks",
      peak: "4-6 weeks",
      duration: "8-12 weeks"
    }
  },
  {
    name: "Tesamorelin",
    peptide_sequence: "Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-NH2",
    category: "Growth Hormone",
    description: "A growth hormone releasing hormone analog for metabolic effects",
    detailedDescription: "Tesamorelin is a synthetic analog of GHRH that has been specifically developed for its metabolic effects. It's particularly effective in reducing visceral fat and improving metabolic parameters.",
    mechanism: "Growth hormone releasing hormone analog",
    commonDosage: "1-2 mg",
    commonFrequency: "daily",
    commonEffects: [
      "Reduced visceral fat",
      "Improved metabolic profile",
      "Enhanced body composition",
      "Increased IGF-1 levels"
    ],
    sideEffects: [
      "Joint pain",
      "Muscle pain",
      "Edema",
      "Insulin resistance"
    ],
    dosageRanges: {
      low: "1 mg",
      medium: "1.5 mg",
      high: "2 mg"
    },
    timeline: {
      onset: "2-3 weeks",
      peak: "6-8 weeks",
      duration: "12-16 weeks"
    }
  },
  {
    name: "Hexarelin",
    peptide_sequence: "His-D-2-Methyl-Trp-Ala-Trp-D-Phe-Lys-NH2",
    category: "Growth Hormone",
    description: "A potent growth hormone secretagogue",
    detailedDescription: "Hexarelin is a synthetic hexapeptide that strongly stimulates growth hormone release. It's known for its potent effects and relatively long duration of action.",
    mechanism: "Growth hormone secretagogue",
    commonDosage: "100-300 mcg",
    commonFrequency: "daily",
    commonEffects: [
      "Increased muscle mass",
      "Fat loss",
      "Enhanced recovery",
      "Improved sleep quality",
      "Anti-aging effects"
    ],
    sideEffects: [
      "Increased hunger",
      "Water retention",
      "Joint pain",
      "Insulin resistance"
    ],
    dosageRanges: {
      low: "100 mcg",
      medium: "200 mcg",
      high: "300 mcg"
    },
    timeline: {
      onset: "1-2 hours",
      peak: "2-3 hours",
      duration: "4-6 hours"
    }
  },
  {
    name: "Thymosin Alpha-1",
    peptide_sequence: "Ac-Ser-Asp-Ala-Ala-Val-Asp-Thr-Ser-Ser-Glu-Ile-Thr-Thr-Lys-Asp-Leu-Lys-Glu-Lys-Lys-Glu-Val-Val-Glu-Glu-Ala-Glu-Asn-OH",
    category: "Immune Support",
    description: "An immune-modulating peptide",
    detailedDescription: "Thymosin Alpha-1 is a naturally occurring peptide that plays a crucial role in immune system regulation. It has shown potential in enhancing immune function and fighting infections.",
    mechanism: "Immune system modulation",
    commonDosage: "1-2 mg",
    commonFrequency: "weekly",
    commonEffects: [
      "Enhanced immune function",
      "Anti-viral effects",
      "Anti-inflammatory",
      "Improved recovery",
      "Immune system balance"
    ],
    sideEffects: [
      "Mild injection site reactions",
      "Rare allergic reactions",
      "Temporary fatigue"
    ],
    dosageRanges: {
      low: "1 mg",
      medium: "1.5 mg",
      high: "2 mg"
    },
    timeline: {
      onset: "1-2 days",
      peak: "3-4 weeks",
      duration: "6-8 weeks"
    }
  },
  {
    name: "Thymosin Beta-4",
    peptide_sequence: "Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Asp",
    category: "Healing & Recovery",
    description: "A tissue repair and regeneration peptide",
    detailedDescription: "Thymosin Beta-4 is a naturally occurring peptide that plays a crucial role in tissue repair and regeneration. It's particularly effective for muscle, tendon, and skin healing.",
    mechanism: "Tissue repair and regeneration",
    commonDosage: "2-5 mg",
    commonFrequency: "weekly",
    commonEffects: [
      "Tissue repair",
      "Wound healing",
      "Muscle recovery",
      "Joint healing",
      "Anti-inflammatory"
    ],
    sideEffects: [
      "Mild injection site reactions",
      "Rare allergic reactions"
    ],
    dosageRanges: {
      low: "2 mg",
      medium: "3.5 mg",
      high: "5 mg"
    },
    timeline: {
      onset: "2-3 days",
      peak: "3-4 weeks",
      duration: "6-8 weeks"
    }
  },
  {
    name: "Selank",
    peptide_sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
    category: "Cognitive Enhancement",
    description: "An anxiolytic and nootropic peptide",
    detailedDescription: "Selank is a synthetic peptide with anxiolytic and nootropic properties. It has shown potential in reducing anxiety and improving cognitive function.",
    mechanism: "Anxiolytic and nootropic effects",
    commonDosage: "200-400 mcg",
    commonFrequency: "daily",
    commonEffects: [
      "Reduced anxiety",
      "Improved focus",
      "Enhanced memory",
      "Stress reduction",
      "Better sleep"
    ],
    sideEffects: [
      "Mild drowsiness",
      "Rare allergic reactions"
    ],
    dosageRanges: {
      low: "200 mcg",
      medium: "300 mcg",
      high: "400 mcg"
    },
    timeline: {
      onset: "30-60 minutes",
      peak: "2-3 hours",
      duration: "4-6 hours"
    }
  },
  {
    name: "Semax",
    peptide_sequence: "Met-Glu-His-Phe-Pro-Gly-Pro",
    category: "Cognitive Enhancement",
    description: "A nootropic peptide with neuroprotective properties",
    detailedDescription: "Semax is a synthetic peptide with potent nootropic and neuroprotective properties. It has shown potential in enhancing cognitive function and protecting against neurological damage.",
    mechanism: "Nootropic and neuroprotective effects",
    commonDosage: "200-600 mcg",
    commonFrequency: "daily",
    commonEffects: [
      "Enhanced focus",
      "Improved memory",
      "Neuroprotection",
      "Stress reduction",
      "Better mood"
    ],
    sideEffects: [
      "Mild headache",
      "Rare allergic reactions"
    ],
    dosageRanges: {
      low: "200 mcg",
      medium: "400 mcg",
      high: "600 mcg"
    },
    timeline: {
      onset: "15-30 minutes",
      peak: "1-2 hours",
      duration: "3-4 hours"
    }
  },
  {
    name: "AOD-9604",
    peptide_sequence: "Tyr-Leu-Arg-Ile-Val-Gln-Cys-Arg-Ser-Val-Asp-Gly-Ser-Cys-Gly-Phe",
    category: "Fat Loss",
    description: "A fat-reducing peptide fragment",
    detailedDescription: "AOD-9604 is a modified fragment of growth hormone that has been specifically developed for its fat-reducing properties. It works by stimulating fat metabolism without the side effects of full growth hormone.",
    mechanism: "Fat metabolism stimulation",
    commonDosage: "300-1000 mcg",
    commonFrequency: "daily",
    commonEffects: [
      "Fat loss",
      "Improved body composition",
      "Enhanced metabolism",
      "Reduced appetite"
    ],
    sideEffects: [
      "Mild injection site reactions",
      "Rare allergic reactions"
    ],
    dosageRanges: {
      low: "300 mcg",
      medium: "500 mcg",
      high: "1000 mcg"
    },
    timeline: {
      onset: "1-2 weeks",
      peak: "4-6 weeks",
      duration: "8-12 weeks"
    }
  },
  {
    name: "GHRP-6",
    peptide_sequence: "His-D-Trp-Ala-Trp-D-Phe-Lys-NH2",
    category: "Growth Hormone",
    description: "A growth hormone releasing peptide",
    detailedDescription: "GHRP-6 is a synthetic hexapeptide that stimulates growth hormone release. It's known for its ability to increase appetite and promote muscle growth.",
    mechanism: "Growth hormone secretagogue",
    commonDosage: "100-300 mcg",
    commonFrequency: "daily",
    commonEffects: [
      "Increased muscle mass",
      "Enhanced appetite",
      "Improved sleep",
      "Fat loss",
      "Enhanced recovery"
    ],
    sideEffects: [
      "Increased hunger",
      "Water retention",
      "Joint pain",
      "Insulin resistance"
    ],
    dosageRanges: {
      low: "100 mcg",
      medium: "200 mcg",
      high: "300 mcg"
    },
    timeline: {
      onset: "1-2 hours",
      peak: "2-3 hours",
      duration: "4-6 hours"
    }
  },
  {
    name: "GHRP-2",
    peptide_sequence: "D-Ala-D-2-Nal-Ala-Trp-D-Phe-Lys-NH2",
    category: "Growth Hormone",
    description: "A potent growth hormone releasing peptide",
    detailedDescription: "GHRP-2 is a synthetic hexapeptide that strongly stimulates growth hormone release. It's known for its potent effects and minimal side effects.",
    mechanism: "Growth hormone secretagogue",
    commonDosage: "100-300 mcg",
    commonFrequency: "daily",
    commonEffects: [
      "Increased muscle mass",
      "Fat loss",
      "Improved sleep",
      "Enhanced recovery",
      "Anti-aging effects"
    ],
    sideEffects: [
      "Mild hunger",
      "Water retention",
      "Joint pain",
      "Insulin resistance"
    ],
    dosageRanges: {
      low: "100 mcg",
      medium: "200 mcg",
      high: "300 mcg"
    },
    timeline: {
      onset: "1-2 hours",
      peak: "2-3 hours",
      duration: "4-6 hours"
    }
  },
  {
    name: "Semaglutide",
    peptide_sequence: "His-Ala-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu-Gly-Gln-Ala-Ala-Lys-Glu-Phe-Ile-Ala-Trp-Leu-Val-Lys-Gly-Arg-Gly",
    category: "GLP-1 Agonist",
    description: "A long-acting GLP-1 receptor agonist for metabolic control",
    detailedDescription: "Semaglutide is a GLP-1 receptor agonist that has been modified for extended duration of action. It's particularly effective for weight management and metabolic control, with effects lasting up to a week.",
    mechanism: "GLP-1 receptor agonist with extended half-life",
    commonDosage: "0.25-2.4 mg",
    commonFrequency: "weekly",
    commonEffects: [
      "Weight loss",
      "Improved glycemic control",
      "Reduced appetite",
      "Enhanced satiety",
      "Improved metabolic parameters"
    ],
    sideEffects: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Constipation",
      "Abdominal pain"
    ],
    dosageRanges: {
      low: "0.25 mg",
      medium: "1.0 mg",
      high: "2.4 mg"
    },
    timeline: {
      onset: "1-2 days",
      peak: "3-4 days",
      duration: "7 days"
    }
  },
  {
    name: "Tirzepatide",
    peptide_sequence: "His-Ala-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu-Gly-Gln-Ala-Ala-Lys-Glu-Phe-Ile-Ala-Trp-Leu-Val-Lys-Gly-Arg-Gly-Lys-Lys-Lys-Lys-Lys-Lys",
    category: "GLP-1/GIP Agonist",
    description: "A dual GLP-1 and GIP receptor agonist",
    detailedDescription: "Tirzepatide is a novel dual agonist that targets both GLP-1 and GIP receptors. It has shown superior efficacy in weight management and metabolic control compared to single GLP-1 agonists.",
    mechanism: "Dual GLP-1 and GIP receptor agonist",
    commonDosage: "2.5-15 mg",
    commonFrequency: "weekly",
    commonEffects: [
      "Significant weight loss",
      "Improved glycemic control",
      "Enhanced metabolic profile",
      "Reduced appetite",
      "Improved insulin sensitivity"
    ],
    sideEffects: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Constipation",
      "Abdominal pain"
    ],
    dosageRanges: {
      low: "2.5 mg",
      medium: "10 mg",
      high: "15 mg"
    },
    timeline: {
      onset: "1-2 days",
      peak: "3-4 days",
      duration: "7 days"
    }
  },
  {
    name: "Liraglutide",
    peptide_sequence: "His-Ala-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu-Gly-Gln-Ala-Ala-Lys-Glu-Phe-Ile-Ala-Trp-Leu-Val-Lys-Gly-Arg-Gly",
    category: "GLP-1 Agonist",
    description: "A long-acting GLP-1 receptor agonist",
    detailedDescription: "Liraglutide is a GLP-1 receptor agonist with a modified structure that provides extended duration of action. It's effective for both weight management and glycemic control.",
    mechanism: "GLP-1 receptor agonist with albumin binding",
    commonDosage: "0.6-3.0 mg",
    commonFrequency: "daily",
    commonEffects: [
      "Weight loss",
      "Improved glycemic control",
      "Reduced appetite",
      "Enhanced satiety",
      "Improved metabolic parameters"
    ],
    sideEffects: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Constipation",
      "Abdominal pain"
    ],
    dosageRanges: {
      low: "0.6 mg",
      medium: "1.8 mg",
      high: "3.0 mg"
    },
    timeline: {
      onset: "1-2 days",
      peak: "2-3 days",
      duration: "24 hours"
    }
  },
  {
    name: "Exenatide",
    peptide_sequence: "His-Gly-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Leu-Ser-Lys-Gln-Met-Glu-Glu-Glu-Ala-Val-Arg-Leu-Phe-Ile-Glu-Trp-Leu-Lys-Asn-Gly-Gly-Pro-Ser-Ser-Gly-Ala-Pro-Pro-Pro-Ser-NH2",
    category: "GLP-1 Agonist",
    description: "A GLP-1 receptor agonist derived from exendin-4",
    detailedDescription: "Exenatide is a synthetic version of exendin-4, a GLP-1 receptor agonist found in the saliva of the Gila monster. It has a longer duration of action than native GLP-1.",
    mechanism: "GLP-1 receptor agonist",
    commonDosage: "5-10 mcg",
    commonFrequency: "twice daily",
    commonEffects: [
      "Improved glycemic control",
      "Weight loss",
      "Reduced appetite",
      "Enhanced satiety",
      "Improved insulin sensitivity"
    ],
    sideEffects: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Constipation",
      "Abdominal pain"
    ],
    dosageRanges: {
      low: "5 mcg",
      medium: "7.5 mcg",
      high: "10 mcg"
    },
    timeline: {
      onset: "1-2 hours",
      peak: "2-3 hours",
      duration: "6-8 hours"
    }
  },
  {
    name: "Dulaglutide",
    peptide_sequence: "His-Ala-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu-Gly-Gln-Ala-Ala-Lys-Glu-Phe-Ile-Ala-Trp-Leu-Val-Lys-Gly-Arg-Gly",
    category: "GLP-1 Agonist",
    description: "A long-acting GLP-1 receptor agonist with Fc fusion",
    detailedDescription: "Dulaglutide is a GLP-1 receptor agonist fused to an Fc fragment, providing extended duration of action. It's administered weekly and has shown good efficacy in both weight management and glycemic control.",
    mechanism: "GLP-1 receptor agonist with Fc fusion",
    commonDosage: "0.75-4.5 mg",
    commonFrequency: "weekly",
    commonEffects: [
      "Weight loss",
      "Improved glycemic control",
      "Reduced appetite",
      "Enhanced satiety",
      "Improved metabolic parameters"
    ],
    sideEffects: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Constipation",
      "Abdominal pain"
    ],
    dosageRanges: {
      low: "0.75 mg",
      medium: "3.0 mg",
      high: "4.5 mg"
    },
    timeline: {
      onset: "1-2 days",
      peak: "3-4 days",
      duration: "7 days"
    }
  },
  {
    name: "Albiglutide",
    peptide_sequence: "His-Ala-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu-Gly-Gln-Ala-Ala-Lys-Glu-Phe-Ile-Ala-Trp-Leu-Val-Lys-Gly-Arg-Gly",
    category: "GLP-1 Agonist",
    description: "A long-acting GLP-1 receptor agonist with albumin fusion",
    detailedDescription: "Albiglutide is a GLP-1 receptor agonist fused to human albumin, providing extended duration of action. It's administered weekly and has shown efficacy in glycemic control.",
    mechanism: "GLP-1 receptor agonist with albumin fusion",
    commonDosage: "30-50 mg",
    commonFrequency: "weekly",
    commonEffects: [
      "Improved glycemic control",
      "Weight loss",
      "Reduced appetite",
      "Enhanced satiety",
      "Improved metabolic parameters"
    ],
    sideEffects: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Constipation",
      "Abdominal pain"
    ],
    dosageRanges: {
      low: "30 mg",
      medium: "40 mg",
      high: "50 mg"
    },
    timeline: {
      onset: "1-2 days",
      peak: "3-4 days",
      duration: "7 days"
    }
  },
  {
    name: "Lixisenatide",
    peptide_sequence: "His-Gly-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Leu-Ser-Lys-Gln-Met-Glu-Glu-Glu-Ala-Val-Arg-Leu-Phe-Ile-Glu-Trp-Leu-Lys-Asn-Gly-Gly-Pro-Ser-Ser-Gly-Ala-Pro-Pro-Pro-Ser-NH2",
    category: "GLP-1 Agonist",
    description: "A short-acting GLP-1 receptor agonist",
    detailedDescription: "Lixisenatide is a modified version of exendin-4 with a shorter duration of action. It's particularly effective for postprandial glucose control.",
    mechanism: "GLP-1 receptor agonist",
    commonDosage: "10-20 mcg",
    commonFrequency: "daily",
    commonEffects: [
      "Improved postprandial glucose control",
      "Weight loss",
      "Reduced appetite",
      "Enhanced satiety",
      "Improved insulin sensitivity"
    ],
    sideEffects: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Constipation",
      "Abdominal pain"
    ],
    dosageRanges: {
      low: "10 mcg",
      medium: "15 mcg",
      high: "20 mcg"
    },
    timeline: {
      onset: "1-2 hours",
      peak: "2-3 hours",
      duration: "4-6 hours"
    }
  },
  {
    name: "Retatrutide",
    peptide_sequence: "His-Ala-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu-Gly-Gln-Ala-Ala-Lys-Glu-Phe-Ile-Ala-Trp-Leu-Val-Lys-Gly-Arg-Gly-Lys-Lys-Lys-Lys-Lys-Lys-Lys-Lys-Lys",
    category: "GLP-1/GIP/Glucagon Agonist",
    description: "A triple agonist targeting GLP-1, GIP, and glucagon receptors",
    detailedDescription: "Retatrutide is a novel triple agonist that simultaneously targets GLP-1, GIP, and glucagon receptors. This unique mechanism provides enhanced metabolic effects, including superior weight loss and improved glycemic control compared to single or dual agonists.",
    mechanism: "Triple GLP-1, GIP, and glucagon receptor agonist",
    commonDosage: "1-12 mg",
    commonFrequency: "weekly",
    commonEffects: [
      "Significant weight loss",
      "Enhanced metabolic control",
      "Improved glycemic control",
      "Reduced appetite",
      "Enhanced energy expenditure",
      "Improved insulin sensitivity"
    ],
    sideEffects: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Constipation",
      "Abdominal pain",
      "Increased heart rate"
    ],
    dosageRanges: {
      low: "1 mg",
      medium: "6 mg",
      high: "12 mg"
    },
    timeline: {
      onset: "1-2 days",
      peak: "3-4 days",
      duration: "7 days"
    }
  }
];

module.exports = peptideSeedData; 
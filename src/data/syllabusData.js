// src/data/syllabusData.js
// Returns structured Units → Chapters → Concepts for Class 10
// Subjects supported: "Physics" | "Mathematics" | "Biology"
export const SUBJECT_KEYS = ["Physics", "Mathematics", "Biology"];

export function syllabusDataFor(subjectInput) {
  const key = normalize(subjectInput);
  switch (key) {
    case "physics":
      return PHYSICS_10;
    case "mathematics":
    case "maths":
      return MATHS_10;
    case "biology":
      return BIO_10;
    default:
      return PHYSICS_10;
  }
}

function normalize(s) {
  if (!s) return "physics";
  const x = typeof s === "string" ? s : s?.name || "physics";
  return x.trim().toLowerCase();
}

/* ------------------------------ PHYSICS ------------------------------ */
const PHYSICS_10 = {
  subjectKey: "physics",
  subjectTitle: "Physics",
  units: [
    {
      id: "phy-u1",
      name: "Unit I — Electricity & Magnetism",
      chapters: [
        {
          id: "phy-u1-ch1",
          name: "Electricity",
          concepts: [
            { id: "phy-u1-ch1-c1", name: "Electric current & charge flow" },
            { id: "phy-u1-ch1-c2", name: "Potential difference & EMF" },
            { id: "phy-u1-ch1-c3", name: "Ohm’s Law & V–I graphs" },
            { id: "phy-u1-ch1-c4", name: "Resistance & resistivity (factors)" },
            { id: "phy-u1-ch1-c5", name: "Series vs. parallel circuits" },
            { id: "phy-u1-ch1-c6", name: "Electric power & heating effect" },
            { id: "phy-u1-ch1-c7", name: "Household circuits, fuse, MCB, earthing" },
          ],
        },
        {
          id: "phy-u1-ch2",
          name: "Magnetic Effects of Electric Current",
          concepts: [
            { id: "phy-u1-ch2-c1", name: "Magnetic field & field lines" },
            { id: "phy-u1-ch2-c2", name: "Right-hand thumb rule" },
            { id: "phy-u1-ch2-c3", name: "Force on current-carrying conductor" },
            { id: "phy-u1-ch2-c4", name: "Electric motor (principle & parts)" },
            { id: "phy-u1-ch2-c5", name: "Electromagnetic induction" },
            { id: "phy-u1-ch2-c6", name: "AC generator (alternator)" },
          ],
        },
      ],
    },
    {
      id: "phy-u2",
      name: "Unit II — Optics",
      chapters: [
        {
          id: "phy-u2-ch1",
          name: "Light — Reflection & Refraction",
          concepts: [
            { id: "phy-u2-ch1-c1", name: "Laws of reflection" },
            { id: "phy-u2-ch1-c2", name: "Spherical mirrors & sign convention" },
            { id: "phy-u2-ch1-c3", name: "Mirror formula & magnification" },
            { id: "phy-u2-ch1-c4", name: "Refraction & refractive index" },
            { id: "phy-u2-ch1-c5", name: "Snell’s law" },
            { id: "phy-u2-ch1-c6", name: "Spherical lenses: lens formula" },
            { id: "phy-u2-ch1-c7", name: "Power of a lens" },
          ],
        },
        {
          id: "phy-u2-ch2",
          name: "Human Eye & the Colourful World",
          concepts: [
            { id: "phy-u2-ch2-c1", name: "Structure & accommodation of the eye" },
            { id: "phy-u2-ch2-c2", name: "Defects: myopia, hypermetropia, presbyopia" },
            { id: "phy-u2-ch2-c3", name: "Prism, dispersion & spectrum" },
            { id: "phy-u2-ch2-c4", name: "Atmospheric refraction & mirage" },
            { id: "phy-u2-ch2-c5", name: "Scattering of light, Tyndall effect, blue sky" },
            { id: "phy-u2-ch2-c6", name: "Rainbow formation (qualitative)" },
          ],
        },
      ],
    },
    {
      id: "phy-u3",
      name: "Unit III — Sources of Energy",
      chapters: [
        {
          id: "phy-u3-ch1",
          name: "Conventional & Non-conventional Sources",
          concepts: [
            { id: "phy-u3-ch1-c1", name: "Fossil fuels: formation & issues" },
            { id: "phy-u3-ch1-c2", name: "Thermal & hydro power" },
            { id: "phy-u3-ch1-c3", name: "Wind & solar energy basics" },
            { id: "phy-u3-ch1-c4", name: "Biomass & biogas" },
            { id: "phy-u3-ch1-c5", name: "Nuclear fission & safety" },
            { id: "phy-u3-ch1-c6", name: "Efficiency & environmental impact" },
          ],
        },
      ],
    },
  ],
};

/* --------------------------- MATHEMATICS --------------------------- */
const MATHS_10 = {
  subjectKey: "mathematics",
  subjectTitle: "Mathematics",
  units: [
    {
      id: "mat-u1",
      name: "Unit I — Number Systems & Algebra",
      chapters: [
        {
          id: "mat-u1-ch1",
          name: "Real Numbers",
          concepts: [
            { id: "mat-u1-ch1-c1", name: "Euclid’s division lemma" },
            { id: "mat-u1-ch1-c2", name: "Fundamental theorem of arithmetic" },
            { id: "mat-u1-ch1-c3", name: "HCF & LCM via prime factorization" },
            { id: "mat-u1-ch1-c4", name: "Irrational numbers & proofs" },
            { id: "mat-u1-ch1-c5", name: "Terminating/non-terminating decimals" },
          ],
        },
        {
          id: "mat-u1-ch2",
          name: "Polynomials",
          concepts: [
            { id: "mat-u1-ch2-c1", name: "Zeros of a polynomial" },
            { id: "mat-u1-ch2-c2", name: "Relationship: zeros & coefficients" },
            { id: "mat-u1-ch2-c3", name: "Division algorithm for polynomials" },
          ],
        },
        {
          id: "mat-u1-ch3",
          name: "Pair of Linear Equations in Two Variables",
          concepts: [
            { id: "mat-u1-ch3-c1", name: "Graphical solutions & consistency" },
            { id: "mat-u1-ch3-c2", name: "Substitution & elimination methods" },
            { id: "mat-u1-ch3-c3", name: "Cross-multiplication method" },
            { id: "mat-u1-ch3-c4", name: "Word problems (applications)" },
          ],
        },
        {
          id: "mat-u1-ch4",
          name: "Quadratic Equations",
          concepts: [
            { id: "mat-u1-ch4-c1", name: "Roots & factorization" },
            { id: "mat-u1-ch4-c2", name: "Completing the square" },
            { id: "mat-u1-ch4-c3", name: "Discriminant & nature of roots" },
            { id: "mat-u1-ch4-c4", name: "Applications & word problems" },
          ],
        },
        {
          id: "mat-u1-ch5",
          name: "Arithmetic Progressions",
          concepts: [
            { id: "mat-u1-ch5-c1", name: "nth term of an AP" },
            { id: "mat-u1-ch5-c2", name: "Sum of first n terms" },
            { id: "mat-u1-ch5-c3", name: "Applications in contexts" },
          ],
        },
      ],
    },
    {
      id: "mat-u2",
      name: "Unit II — Geometry",
      chapters: [
        {
          id: "mat-u2-ch1",
          name: "Triangles",
          concepts: [
            { id: "mat-u2-ch1-c1", name: "Similarity criteria (AAA, SAS, SSS)" },
            { id: "mat-u2-ch1-c2", name: "Basic Proportionality Theorem" },
            { id: "mat-u2-ch1-c3", name: "Pythagoras theorem & converse" },
            { id: "mat-u2-ch1-c4", name: "Areas & similarity ratios" },
          ],
        },
        {
          id: "mat-u2-ch2",
          name: "Circles",
          concepts: [
            { id: "mat-u2-ch2-c1", name: "Tangent properties" },
            { id: "mat-u2-ch2-c2", name: "Length of tangents" },
            { id: "mat-u2-ch2-c3", name: "Secant–tangent theorem" },
          ],
        },
        {
          id: "mat-u2-ch3",
          name: "Constructions",
          concepts: [
            { id: "mat-u2-ch3-c1", name: "Divide a line segment" },
            { id: "mat-u2-ch3-c2", name: "Tangents to a circle from a point" },
          ],
        },
      ],
    },
    {
      id: "mat-u3",
      name: "Unit III — Coordinate Geometry & Trigonometry",
      chapters: [
        {
          id: "mat-u3-ch1",
          name: "Coordinate Geometry",
          concepts: [
            { id: "mat-u3-ch1-c1", name: "Distance formula" },
            { id: "mat-u3-ch1-c2", name: "Section formula (internal)" },
            { id: "mat-u3-ch1-c3", name: "Area of a triangle" },
          ],
        },
        {
          id: "mat-u3-ch2",
          name: "Introduction to Trigonometry",
          concepts: [
            { id: "mat-u3-ch2-c1", name: "Trig ratios of acute angles" },
            { id: "mat-u3-ch2-c2", name: "Standard values (0°, 30°, 45°, 60°, 90°)" },
            { id: "mat-u3-ch2-c3", name: "Basic identities" },
          ],
        },
        {
          id: "mat-u3-ch3",
          name: "Applications of Trigonometry",
          concepts: [
            { id: "mat-u3-ch3-c1", name: "Heights & distances" },
            { id: "mat-u3-ch3-c2", name: "Angle of elevation/depression" },
          ],
        },
      ],
    },
    {
      id: "mat-u4",
      name: "Unit IV — Mensuration, Statistics & Probability",
      chapters: [
        {
          id: "mat-u4-ch1",
          name: "Areas Related to Circles",
          concepts: [
            { id: "mat-u4-ch1-c1", name: "Sector & segment area" },
            { id: "mat-u4-ch1-c2", name: "Combined figures with circles" },
          ],
        },
        {
          id: "mat-u4-ch2",
          name: "Surface Areas & Volumes",
          concepts: [
            { id: "mat-u4-ch2-c1", name: "Combination of solids" },
            { id: "mat-u4-ch2-c2", name: "Volume & surface area conversions" },
            { id: "mat-u4-ch2-c3", name: "Frustum of a cone (basics)" },
          ],
        },
        {
          id: "mat-u4-ch3",
          name: "Statistics",
          concepts: [
            { id: "mat-u4-ch3-c1", name: "Mean, median, mode (grouped data)" },
            { id: "mat-u4-ch3-c2", name: "Cumulative frequency & ogive (intro)" },
          ],
        },
        {
          id: "mat-u4-ch4",
          name: "Probability",
          concepts: [
            { id: "mat-u4-ch4-c1", name: "Empirical probability" },
            { id: "mat-u4-ch4-c2", name: "Simple events" },
          ],
        },
      ],
    },
  ],
};

/* ------------------------------ BIOLOGY ------------------------------ */
const BIO_10 = {
  subjectKey: "biology",
  subjectTitle: "Biology",
  units: [
    {
      id: "bio-u1",
      name: "Unit I — Life Processes",
      chapters: [
        {
          id: "bio-u1-ch1",
          name: "Life Processes",
          concepts: [
            { id: "bio-u1-ch1-c1", name: "Nutrition: autotrophic vs heterotrophic" },
            { id: "bio-u1-ch1-c2", name: "Respiration: aerobic & anaerobic" },
            { id: "bio-u1-ch1-c3", name: "Human circulatory system & transport" },
            { id: "bio-u1-ch1-c4", name: "Transport in plants (xylem/phloem)" },
            { id: "bio-u1-ch1-c5", name: "Excretion in humans & plants" },
          ],
        },
        {
          id: "bio-u1-ch2",
          name: "Control & Coordination",
          concepts: [
            { id: "bio-u1-ch2-c1", name: "Nervous system & reflex arc" },
            { id: "bio-u1-ch2-c2", name: "Parts of brain & functions" },
            { id: "bio-u1-ch2-c3", name: "Endocrine glands & hormones" },
            { id: "bio-u1-ch2-c4", name: "Plant hormones & tropic movements" },
          ],
        },
      ],
    },
    {
      id: "bio-u2",
      name: "Unit II — Reproduction & Heredity",
      chapters: [
        {
          id: "bio-u2-ch1",
          name: "How Do Organisms Reproduce?",
          concepts: [
            { id: "bio-u2-ch1-c1", name: "Asexual reproduction (fission, budding, spores)" },
            { id: "bio-u2-ch1-c2", name: "Sexual reproduction in plants" },
            { id: "bio-u2-ch1-c3", name: "Human reproductive systems" },
            { id: "bio-u2-ch1-c4", name: "Menstrual cycle & fertilization" },
            { id: "bio-u2-ch1-c5", name: "Reproductive health" },
          ],
        },
        {
          id: "bio-u2-ch2",
          name: "Heredity & Evolution (core heredity)",
          concepts: [
            { id: "bio-u2-ch2-c1", name: "Mendel’s laws & monohybrid/dihybrid crosses" },
            { id: "bio-u2-ch2-c2", name: "Traits: inherited vs acquired" },
            { id: "bio-u2-ch2-c3", name: "Sex determination (basics)" },
            { id: "bio-u2-ch2-c4", name: "Variation & natural selection (overview)" },
          ],
        },
      ],
    },
    {
      id: "bio-u3",
      name: "Unit III — Environment & Resources",
      chapters: [
        {
          id: "bio-u3-ch1",
          name: "Our Environment",
          concepts: [
            { id: "bio-u3-ch1-c1", name: "Ecosystems & components" },
            { id: "bio-u3-ch1-c2", name: "Food chains & food webs" },
            { id: "bio-u3-ch1-c3", name: "Trophic levels & biomagnification" },
            { id: "bio-u3-ch1-c4", name: "Ozone layer & its depletion" },
            { id: "bio-u3-ch1-c5", name: "Biodegradable vs non-biodegradable" },
          ],
        },
        {
          id: "bio-u3-ch2",
          name: "Sustainable Management of Natural Resources",
          concepts: [
            { id: "bio-u3-ch2-c1", name: "3Rs: Reduce, Reuse, Recycle" },
            { id: "bio-u3-ch2-c2", name: "Forest & wildlife conservation" },
            { id: "bio-u3-ch2-c3", name: "Water management & rainwater harvesting" },
            { id: "bio-u3-ch2-c4", name: "Coal & petroleum — judicious use" },
            { id: "bio-u3-ch2-c5", name: "Case studies & community action" },
          ],
        },
      ],
    },
  ],
};

export interface LegalCase {
  id: string;
  title: string;
  citation: string;
  year: number;
  court: string;
  summary: string;
  keyPoints: string[];
}

export const SUPREME_COURT_DATASET: LegalCase[] = [
  {
    id: "sc-1973-1",
    title: "Kesavananda Bharati v. State of Kerala",
    citation: "(1973) 4 SCC 225",
    year: 1973,
    court: "Supreme Court of India",
    summary: "Established the 'Basic Structure Doctrine', stating that while Parliament has wide powers to amend the Constitution, it cannot alter its basic structure.",
    keyPoints: ["Basic Structure Doctrine", "Article 368", "Constitutional Amendments"]
  },
  {
    id: "sc-1950-1",
    title: "A.K. Gopalan v. State of Madras",
    citation: "AIR 1950 SC 27",
    year: 1950,
    court: "Supreme Court of India",
    summary: "A landmark case on preventive detention and Article 21. The court took a narrow view of 'procedure established by law'.",
    keyPoints: ["Article 21", "Preventive Detention", "Personal Liberty"]
  },
  {
    id: "sc-1978-1",
    title: "Maneka Gandhi v. Union of India",
    citation: "AIR 1978 SC 597",
    year: 1978,
    court: "Supreme Court of India",
    summary: "Expanded the scope of Article 21, ruling that 'procedure established by law' must be just, fair, and reasonable (Due Process).",
    keyPoints: ["Article 21", "Right to Travel", "Natural Justice"]
  },
  {
    id: "sc-1992-1",
    title: "Indra Sawhney v. Union of India",
    citation: "AIR 1993 SC 477",
    year: 1992,
    court: "Supreme Court of India",
    summary: "The 'Mandal Commission' case. Upheld 27% reservation for OBCs but introduced the 'creamy layer' concept and 50% cap on total reservations.",
    keyPoints: ["Reservation", "OBC", "Creamy Layer", "Article 16(4)"]
  },
  {
    id: "sc-2017-1",
    title: "Justice K.S. Puttaswamy v. Union of India",
    citation: "(2017) 10 SCC 1",
    year: 2017,
    court: "Supreme Court of India",
    summary: "Declared the Right to Privacy as a fundamental right protected under Articles 14, 19, and 21 of the Constitution.",
    keyPoints: ["Right to Privacy", "Article 21", "Fundamental Rights"]
  },
  {
    id: "sc-1980-1",
    title: "Minerva Mills v. Union of India",
    citation: "AIR 1980 SC 1789",
    year: 1980,
    court: "Supreme Court of India",
    summary: "Strengthened the Basic Structure Doctrine by striking down clauses that gave Parliament unlimited power to amend the Constitution.",
    keyPoints: ["Basic Structure", "Judicial Review", "Article 31C"]
  },
  {
    id: "sc-1985-1",
    title: "Mohd. Ahmed Khan v. Shah Bano Begum",
    citation: "AIR 1985 SC 945",
    year: 1985,
    court: "Supreme Court of India",
    summary: "Dealt with the right to maintenance for a divorced Muslim woman under Section 125 of CrPC, sparking a major political controversy.",
    keyPoints: ["Maintenance", "Section 125 CrPC", "Personal Law"]
  },
  {
    id: "sc-1994-1",
    title: "S.R. Bommai v. Union of India",
    citation: "AIR 1994 SC 1918",
    year: 1994,
    court: "Supreme Court of India",
    summary: "Laid down guidelines against the arbitrary use of Article 356 (President's Rule) and declared secularism as part of the basic structure.",
    keyPoints: ["Article 356", "Federalism", "Secularism"]
  },
  {
    id: "sc-1997-1",
    title: "Vishaka v. State of Rajasthan",
    citation: "AIR 1997 SC 3011",
    year: 1997,
    court: "Supreme Court of India",
    summary: "Laid down guidelines to prevent sexual harassment of women at workplaces (Vishaka Guidelines).",
    keyPoints: ["Sexual Harassment", "Workplace Safety", "Article 14", "Article 21"]
  },
  {
    id: "sc-2018-1",
    title: "Navtej Singh Johar v. Union of India",
    citation: "AIR 2018 SC 4321",
    year: 2018,
    court: "Supreme Court of India",
    summary: "Decriminalized consensual homosexual acts between adults by reading down Section 377 of the IPC.",
    keyPoints: ["Section 377", "LGBTQ Rights", "Article 14", "Article 15"]
  }
];

export interface FacultyProfile {
  id: number;
  name: string;
  title: string;
  designation: string;
  image: string;
  shortBio: string;
  fullBio: string;
  qualifications: string[];
  expertise: string[];
  subjects: string[];
  achievements: string[];
  experience: string;
  email?: string;
}

export const facultyProfiles: FacultyProfile[] = [
  {
    id: 1,
    name: "Ms. Sadhana",
    title: "NTA-NET Qualified",
    designation: "Faculty – English Literature, LePearl Education",
    image: "/sadhana_faculty1.jpeg",
    shortBio: "NTA-NET, Faculty, LePearl Education",
    fullBio:
      "Ms. Sadhana is a highly dedicated educator with a passion for English Literature and Language studies. Having cleared the NTA-NET examination herself, she brings firsthand insight into the exam pattern, question types, and effective preparation strategies. Her teaching philosophy centers on building conceptual clarity and nurturing a genuine love for literature among students.",
    qualifications: [
      "NTA-NET Qualified – English",
      "M.A. English Literature",
      "B.Ed.",
    ],
    expertise: [
      "British Literature",
      "Literary Theory & Criticism",
      "Indian Writing in English",
      "Poetry Analysis",
      "NTA-NET Paper II (English)",
    ],
    subjects: [
      "English Literature (Paper II)",
      "Prose & Fiction",
      "Drama Studies",
      "Research Methodology",
    ],
    achievements: [
      "NTA-NET Qualified in English",
      "Mentored 100+ successful NET aspirants",
      "Developed structured study material for NTA-NET Paper II",
      "Conducted 50+ mock test series",
    ],
    experience: "5+ Years",
  },
  {
    id: 2,
    name: "Dr. Babli Mallick",
    title: "Ph.D. | Assistant Professor",
    designation: "Assistant Professor & Faculty – LePearl Education",
    image: "/babil_faculty2.jpeg",
    shortBio: "Assistant Professor, Faculty-LePearl Education",
    fullBio:
      "Dr. Babli Mallick is a distinguished academic with a Doctorate in English and extensive experience as an Assistant Professor in reputed institutions. She brings rigorous academic scholarship and a research-oriented approach to her classes. Her expertise in advanced literary theory and postcolonial studies has helped hundreds of students achieve top ranks in NET and other competitive examinations.",
    qualifications: [
      "Ph.D. – English Literature",
      "M.Phil. – English",
      "M.A. English (Gold Medalist)",
      "NTA-NET & JRF Qualified",
    ],
    expertise: [
      "Postcolonial Literature",
      "Feminist Theory",
      "Contemporary Fiction",
      "Literary Criticism",
      "Research & Thesis Writing",
    ],
    subjects: [
      "Advanced Literary Theory",
      "Postcolonial Studies",
      "Gender Studies in Literature",
      "NTA-NET Paper I & II",
    ],
    achievements: [
      "Ph.D. in English Literature",
      "Gold Medalist – M.A. English",
      "Published researcher with multiple peer-reviewed papers",
      "Former Assistant Professor at a Central University",
      "Guided 200+ NET/JRF successful candidates",
    ],
    experience: "10+ Years",
  },
  {
    id: 3,
    name: "Ms. Neelu Patel",
    title: "NET-JRF Qualified | Assistant Professor",
    designation:
      "NET-JRF Qualified, Assistant Professor & Faculty – LePearl Education",
    image: "/neelu_faculty3.jpeg",
    shortBio: "NET-JRF, Assistant Professor, Faculty-LePearl Education",
    fullBio:
      "Ms. Neelu Patel is a NET-JRF qualified educator who has also served as an Assistant Professor. Her dual achievement of clearing both NET and JRF makes her uniquely equipped to train students for the highest levels of competitive exams. She is known for her structured approach, clear explanations of complex topics, and her ability to break down syllabus in a simple, exam-focused manner.",
    qualifications: [
      "NET-JRF Qualified – English",
      "M.A. English Literature",
      "Assistant Professor (Qualified)",
    ],
    expertise: [
      "American Literature",
      "Modernist & Postmodernist Fiction",
      "Linguistics & Language Studies",
      "JRF-level Preparation",
      "Research Paper Writing",
    ],
    subjects: [
      "English Literature (All Periods)",
      "Language & Linguistics",
      "NTA-NET Paper I (General)",
      "JRF Advanced Preparation",
    ],
    achievements: [
      "Cleared NTA-NET with JRF – Top Rank",
      "Appointed as Assistant Professor",
      "Authored comprehensive study guides for NET-JRF aspirants",
      "Conducted workshops on research methodology",
      "Mentored 150+ JRF successful students",
    ],
    experience: "7+ Years",
  },
  {
    id: 4,
    name: "Dr. Harendra K Tripathi",
    title: "Ph.D. | General Studies Expert",
    designation: "GS Expert & Faculty – LePearl Education",
    image: "/harendra_faculty4.jpeg",
    shortBio: "GS Expert, Faculty-LePearl Education",
    fullBio:
      "Dr. Harendra K Tripathi is a seasoned General Studies expert with a Doctorate and years of experience coaching aspirants for competitive examinations. His command over General Paper I (NTA-NET) and allied general studies subjects is exceptional. He employs a data-driven, strategy-focused teaching style that helps students optimize their scores in the General Paper within minimum preparation time.",
    qualifications: [
      "Ph.D. – Social Sciences",
      "M.A. Political Science / Public Administration",
      "NTA-NET Qualified",
      "UGC Research Fellow",
    ],
    expertise: [
      "NTA-NET Paper I (General)",
      "Teaching Aptitude & Research Aptitude",
      "Logical Reasoning & Data Interpretation",
      "ICT & Higher Education",
      "Communication & Environment",
    ],
    subjects: [
      "NTA-NET Paper I (Complete)",
      "Teaching & Research Aptitude",
      "Reasoning & Comprehension",
      "Current Affairs & Higher Education",
    ],
    achievements: [
      "Ph.D. with UGC Research Fellowship",
      "Expert faculty for Paper I across multiple coaching institutes",
      "Developed shortcut-strategy modules for Paper I",
      "95%+ pass rate among enrolled students for NTA-NET Paper I",
      "Author of concise notes widely used by NET aspirants",
    ],
    experience: "12+ Years",
  },
];

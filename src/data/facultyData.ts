export interface FacultyProfile {
  id: number;
  name: string;
  title: string;
  designation: string;
  image: string;
  imagePosition?: string;
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
    title:
      "Assistant Professor (English) | UGC-NET Expert | Author | Competitive Exam Mentor",
    designation:
      "Assistant Professor (English) | UGC-NET Expert | Author | Competitive Exam Mentor",
    image: "/sadhana_faculty1.jpeg",
    shortBio:
      "Assistant Professor (English), UGC-NET Expert, Author, and Competitive Exam Mentor",
    fullBio:
      "Ms. Sadhana is a passionate educator and Assistant Professor of English with multidisciplinary knowledge and in-depth expertise in English Literature. She brings rich teaching experience and a proven track record of guiding students toward success in competitive examinations and academic pursuits. Ms. Sadhana has taught LT Grade students with excellent results and is currently a faculty member for NTA UGC-NET. She has also authored and published a collection of poetry. Her multidisciplinary approach combined with strong command over English Literature enables her to guide students effectively in both literature and competitive exam preparation. Ms. Sadhana's extensive qualifications, teaching experience, and authorship make her a valuable faculty member for courses on English Literature, research writing, thesis development, and UGC-NET preparation.",
    qualifications: [
      "M.A. in English Literature",
      "B.A. (Hons) English Literature from Delhi University (DU)",
      "UGC-NET Qualified (6 times)",
      "Qualified HPSC Assistant Professor Examination",
      "Qualified SSC Exams",
      "Qualified UPSC CDS (twice)",
      "40 WPM typing speed",
      "Excellent communication skills",
      "NLP Practitioner",
      "Creative writing",
      "Languages Known: English and Hindi",
      "M.A. English Literature",
    ],
    expertise: [
      "UGC-NET Preparation (English)",
      "English Literature",
      "Research Writing",
      "Thesis Development",
      "Competitive Exam Mentorship",
      "Creative Writing",
    ],
    subjects: [
      "English Literature",
      "UGC-NET (Paper II - English)",
      "Research Writing",
      "Thesis Development",
      "LT Grade Preparation",
    ],
    achievements: [
      "UGC-NET Qualified (6 times)",
      "Qualified HPSC Assistant Professor Examination",
      "Qualified SSC Exams",
      "Qualified UPSC CDS (twice)",
      "Published a collection of poetry",
      "Taught LT Grade students with excellent results",
      "Faculty member for NTA UGC-NET",
    ],
    experience: "5+ Years",
  },
  {
    id: 2,
    name: "Dr. Babli Mallick",
    title:
      "Assistant Professor (English) | Researcher | Research Paper Reviewer",
    designation:
      "Assistant Professor (English) | Researcher | Research Paper Reviewer",
    image: "/DrBablick.png",
    imagePosition: "center top",
    shortBio:
      "Assistant Professor of English with strong academic and research background",
    fullBio:
      "Dr. Babli Mallick is a dedicated Assistant Professor of English with a strong academic and research background. She combines deep subject expertise in English Literature with active involvement in scholarly writing, peer review, and student mentoring. Dr. Babli Mallick serves as Assistant Professor in English at Prime Minister College of Excellence Govt. P.G. College Sheopur, M.P.. She is actively engaged in academic research and has reviewed research papers for reputed journals. She has authored several scholarly research papers, books, and book chapters. She has successfully mentored and monitored numerous students, helping them achieve their academic and career targets. Dr. Babli Mallick's expertise in research writing, peer review, and student guidance makes her a valuable faculty member for programs on research paper writing, thesis writing, and academic skill development.",
    qualifications: [
      "B.A in English (Honours) - University of Calcutta",
      "M.A in English (Rank top 10) - Banaras Hindu University",
      "PhD - Banaras Hindu University",
      "Ph.D. in English",
      "Qualified UGC-NET",
    ],
    expertise: [
      "English Literature",
      "Research Writing",
      "Research Paper Review",
      "Thesis Writing",
      "Academic Skill Development",
      "Student Mentoring",
    ],
    subjects: [
      "Research Paper Writing",
      "Thesis Writing",
      "English Literature",
      "Academic Skill Development",
    ],
    achievements: [
      "Ph.D. in English",
      "Qualified UGC-NET",
      "Reviewed research papers for reputed journals",
      "Authored scholarly research papers, books, and book chapters",
      "Mentored and monitored numerous students for academic and career success",
    ],
    experience: "10+ Years",
  },
  {
    id: 3,
    name: "Neelu Patel",
    title: "Assistant Professor (English)",
    designation:
      "Educator | English Literature Expert | MPPSC AP & Competitive Exam Mentor",
    image: "/facultyneelunew.png",
    shortBio:
      "Educator and Assistant Professor of English with strong academic and competitive exam background",
    fullBio:
      "Neelu Patel is a dedicated educator and Assistant Professor of English with a strong academic and competitive examination background. She brings subject expertise in English Literature combined with practical experience in teaching, evaluation, and student mentoring. Her approach focuses on building conceptual clarity, effective communication, and exam-oriented skills for research scholars and aspirants. Neelu Patel is currently working as Assistant Professor at Government College, New Ramnagar, Maihar. She has conducted viva examinations at the college level and is actively involved in academic evaluation activities. She has also served as a mentor and guide for UGC-NET aspirants, helping students prepare effectively for national-level examinations. Neelu Patel's blend of academic pursuit, government college teaching experience, and mentorship for competitive exams makes her a valuable faculty member for programs focused on research paper writing, thesis writing, and academic skill development.",
    qualifications: [
      "Ph.D. in English (Pursuing)",
      "M.A. in English",
      "B.Sc.",
      "UGC-NET Qualified",
      "Junior Research Fellowship (JRF)",
      "State Eligibility Test (SET) MP Qualified",
      "Qualified MPPSC Assistant Professor Examination",
    ],
    expertise: [
      "English Literature",
      "Competitive Exam Mentoring",
      "UGC-NET Guidance",
      "Research Paper Writing",
      "Thesis Writing",
      "Academic Skill Development",
      "Excellent communication skills",
      "Effective time management",
      "Basic ICT skills (MS Word, PowerPoint)",
      "Languages Known: English and Hindi",
    ],
    subjects: [
      "English Literature",
      "UGC-NET Preparation",
      "Research Paper Writing",
      "Thesis Writing",
      "Academic Skill Development",
    ],
    achievements: [
      "UGC-NET Qualified",
      "Junior Research Fellowship (JRF)",
      "State Eligibility Test (SET) MP Qualified",
      "Qualified MPPSC Assistant Professor Examination",
      "Conducted viva examinations at college level",
      "Mentored UGC-NET aspirants for national-level examinations",
    ],
    experience: "7+ Years",
  },
];

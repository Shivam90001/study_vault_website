import { Course, Semester, Subject } from '../types';

export const INITIAL_COURSES: Course[] = [
  {

<a href="https://omg10.com/4/11922745" target="_blank"></a>

    id: 'btech',
    name: 'B.Tech - Bachelor of Technology',
    code: 'B.Tech',
    description: 'Engineering syllabus, handwritten notes, previous year question papers, and lab manuals.',
    durationYears: 4,
    totalSemesters: 8,
    category: 'Engineering',
    icon: 'Laptop'
  },
  {
    id: 'bca',
    name: 'BCA - Bachelor of Computer Applications',
    code: 'BCA',
    description: 'Core programming, database management, software engineering, and web development notes.',
    durationYears: 3,
    totalSemesters: 6,
    category: 'Computer Applications',
    icon: 'Code'
  },
  {
    id: 'mca',
    name: 'MCA - Master of Computer Applications',
    code: 'MCA',
    description: 'Postgraduate computer science, artificial intelligence, cloud architecture, and full stack notes.',
    durationYears: 2,
    totalSemesters: 4,
    category: 'Computer Applications',
    icon: 'Terminal'
  },
  {
    id: 'bba',
    name: 'BBA - Bachelor of Business Administration',
    code: 'BBA',
    description: 'Business management, organizational behavior, marketing, financial accounting, and business laws.',
    durationYears: 3,
    totalSemesters: 6,
    category: 'Management',
    icon: 'Briefcase'
  },
  {
    id: 'mba',
    name: 'MBA - Master of Business Administration',
    code: 'MBA',
    description: 'Strategic management, financial modeling, operations, human resources, and business analytics.',
    durationYears: 2,
    totalSemesters: 4,
    category: 'Management',
    icon: 'TrendingUp'
  },
  {
    id: 'dpharma',
    name: 'D.Pharma - Diploma in Pharmacy',
    code: 'D.Pharma',
    description: 'Pharmaceutics, pharmaceutical chemistry, pharmacognosy, human anatomy, and biochemistry.',
    durationYears: 2,
    totalSemesters: 4,
    category: 'Pharmacy',
    icon: 'Pill'
  },
  {
    id: 'bpharma',
    name: 'B.Pharma - Bachelor of Pharmacy',
    code: 'B.Pharma',
    description: 'Pharmacology, medicinal chemistry, biopharmaceutics, pharmaceutical engineering, and microbiology.',
    durationYears: 4,
    totalSemesters: 8,
    category: 'Pharmacy',
    icon: 'Stethoscope'
  }
];

// Semesters generation helper for all courses
export const INITIAL_SEMESTERS: Semester[] = [
  // B.Tech (8 Semesters)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `btech-sem${i + 1}`,
    courseId: 'btech',
    semesterNumber: i + 1,
    name: `Semester ${i + 1}`,
    academicYear: `Year ${Math.ceil((i + 1) / 2)}`
  })),

  // BCA (6 Semesters)
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `bca-sem${i + 1}`,
    courseId: 'bca',
    semesterNumber: i + 1,
    name: `Semester ${i + 1}`,
    academicYear: `Year ${Math.ceil((i + 1) / 2)}`
  })),

  // MCA (4 Semesters)
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `mca-sem${i + 1}`,
    courseId: 'mca',
    semesterNumber: i + 1,
    name: `Semester ${i + 1}`,
    academicYear: `Year ${Math.ceil((i + 1) / 2)}`
  })),

  // BBA (6 Semesters)
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `bba-sem${i + 1}`,
    courseId: 'bba',
    semesterNumber: i + 1,
    name: `Semester ${i + 1}`,
    academicYear: `Year ${Math.ceil((i + 1) / 2)}`
  })),

  // MBA (4 Semesters)
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `mba-sem${i + 1}`,
    courseId: 'mba',
    semesterNumber: i + 1,
    name: `Semester ${i + 1}`,
    academicYear: `Year ${Math.ceil((i + 1) / 2)}`
  })),

  // D.Pharma (4 Semesters / 2 Years)
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `dpharma-sem${i + 1}`,
    courseId: 'dpharma',
    semesterNumber: i + 1,
    name: `Semester ${i + 1}`,
    academicYear: `Year ${Math.ceil((i + 1) / 2)}`
  })),

  // B.Pharma (8 Semesters)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `bpharma-sem${i + 1}`,
    courseId: 'bpharma',
    semesterNumber: i + 1,
    name: `Semester ${i + 1}`,
    academicYear: `Year ${Math.ceil((i + 1) / 2)}`
  }))
];

export const INITIAL_SUBJECTS: Subject[] = [
  // B.Tech Semester 3
  {
    id: 'sub-btech-dsa',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    code: 'KCS-301',
    name: 'Data Structures & Algorithms',
    credits: 4,
    description: 'Arrays, Linked Lists, Stacks, Queues, Binary Trees, AVL Trees, Graphs, Sorting, Searching.',
    unitsCount: 5
  },
  {
    id: 'sub-btech-coa',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    code: 'KCS-302',
    name: 'Computer Organization & Architecture',
    credits: 4,
    description: 'Instruction cycles, ALU, memory hierarchy, cache mapping, pipeline architecture, and I/O interface.',
    unitsCount: 5
  },
  {
    id: 'sub-btech-dm',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    code: 'KCS-303',
    name: 'Discrete Mathematics',
    credits: 4,
    description: 'Set theory, Relations, Propositional logic, Combinatorics, Graph theory, and Algebraic structures.',
    unitsCount: 5
  },
  {
    id: 'sub-btech-oops',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    code: 'KCS-304',
    name: 'Object Oriented Programming',
    credits: 3,
    description: 'Classes, Objects, Inheritance, Polymorphism, Encapsulation, Exception handling, Collections.',
    unitsCount: 5
  },

  // B.Tech Semester 4
  {
    id: 'sub-btech-os',
    courseId: 'btech',
    semesterId: 'btech-sem4',
    code: 'KCS-401',
    name: 'Operating Systems',
    credits: 4,
    description: 'Processes, Threads, CPU scheduling, Deadlocks, Memory management, Paging, Virtual Memory.',
    unitsCount: 5
  },
  {
    id: 'sub-btech-toc',
    courseId: 'btech',
    semesterId: 'btech-sem4',
    code: 'KCS-402',
    name: 'Theory of Computation',
    credits: 4,
    description: 'DFA, NFA, Regular Expressions, Context-Free Grammars, Pushdown Automata, Turing Machines.',
    unitsCount: 5
  },
  {
    id: 'sub-btech-python',
    courseId: 'btech',
    semesterId: 'btech-sem4',
    code: 'KCS-403',
    name: 'Python Programming',
    credits: 3,
    description: 'Python syntax, data structures, OOP, file handling, NumPy, Pandas, and data science basics.',
    unitsCount: 5
  },

  // BCA Semester 1
  {
    id: 'sub-bca-c',
    courseId: 'bca',
    semesterId: 'bca-sem1',
    code: 'BCA-101',
    name: 'Programming Principles with C',
    credits: 4,
    description: 'Variables, loops, arrays, functions, pointers, structures, file I/O in ANSI C.',
    unitsCount: 5
  },
  {
    id: 'sub-bca-math',
    courseId: 'bca',
    semesterId: 'bca-sem1',
    code: 'BCA-102',
    name: 'Foundational Mathematics',
    credits: 4,
    description: 'Matrices, Determinants, Differential Calculus, Integration, and Limits.',
    unitsCount: 5
  },
  {
    id: 'sub-bca-it',
    courseId: 'bca',
    semesterId: 'bca-sem1',
    code: 'BCA-103',
    name: 'Information Technology Fundamentals',
    credits: 3,
    description: 'Computer hardware, software types, binary arithmetic, operating systems, and internet basics.',
    unitsCount: 5
  },

  // MCA Semester 1
  {
    id: 'sub-mca-advdsa',
    courseId: 'mca',
    semesterId: 'mca-sem1',
    code: 'MCA-101',
    name: 'Advanced Data Structures & Algorithms',
    credits: 4,
    description: 'Red-Black Trees, B-Trees, Dynamic Programming, NP-completeness, and graph algorithms.',
    unitsCount: 5
  },
  {
    id: 'sub-mca-dbms',
    courseId: 'mca',
    semesterId: 'mca-sem1',
    code: 'MCA-102',
    name: 'Advanced Database Management Systems',
    credits: 4,
    description: 'Query optimization, transaction management, NoSQL databases, and distributed databases.',
    unitsCount: 5
  },

  // BBA Semester 1
  {
    id: 'sub-bba-mgmt',
    courseId: 'bba',
    semesterId: 'bba-sem1',
    code: 'BBA-101',
    name: 'Principles & Practice of Management',
    credits: 4,
    description: 'Planning, organizing, staffing, directing, controlling, leadership, and decision making.',
    unitsCount: 5
  },
  {
    id: 'sub-bba-acc',
    courseId: 'bba',
    semesterId: 'bba-sem1',
    code: 'BBA-102',
    name: 'Financial Accounting for Managers',
    credits: 4,
    description: 'Journal, ledger, trial balance, final accounts, balance sheets, and depreciation.',
    unitsCount: 5
  },

  // MBA Semester 1
  {
    id: 'sub-mba-marketing',
    courseId: 'mba',
    semesterId: 'mba-sem1',
    code: 'MBA-101',
    name: 'Marketing Management',
    credits: 4,
    description: '4Ps of marketing, consumer behavior, market segmentation, targeting, and positioning.',
    unitsCount: 5
  },
  {
    id: 'sub-mba-org',
    courseId: 'mba',
    semesterId: 'mba-sem1',
    code: 'MBA-102',
    name: 'Organizational Behavior & Human Dynamics',
    credits: 4,
    description: 'Individual behavior, motivation theories, group dynamics, organizational culture and change.',
    unitsCount: 5
  },

  // D.Pharma Semester 1
  {
    id: 'sub-dpharm-ceutics',
    courseId: 'dpharma',
    semesterId: 'dpharma-sem1',
    code: 'ER20-11T',
    name: 'Pharmaceutics - I',
    credits: 4,
    description: 'Dosage forms, packaging materials, pharmaceutical aids, size reduction, mixing, and filtration.',
    unitsCount: 5
  },
  {
    id: 'sub-dpharm-chem',
    courseId: 'dpharma',
    semesterId: 'dpharma-sem1',
    code: 'ER20-12T',
    name: 'Pharmaceutical Chemistry',
    credits: 4,
    description: 'Inorganic pharmaceuticals, limit tests, dental products, gastrointestinal agents, and assays.',
    unitsCount: 5
  },
  {
    id: 'sub-dpharm-anatomy',
    courseId: 'dpharma',
    semesterId: 'dpharma-sem1',
    code: 'ER20-14T',
    name: 'Human Anatomy & Physiology',
    credits: 4,
    description: 'Cell structure, tissues, skeletal system, cardiovascular system, and central nervous system.',
    unitsCount: 5
  },

  // B.Pharma Semester 1
  {
    id: 'sub-bpharm-hap',
    courseId: 'bpharma',
    semesterId: 'bpharma-sem1',
    code: 'BP101T',
    name: 'Human Anatomy & Physiology - I',
    credits: 4,
    description: 'Integumentary system, skeletal system, joints, body fluids, lymphatic and peripheral nervous systems.',
    unitsCount: 5
  },
  {
    id: 'sub-bpharm-analysis',
    courseId: 'bpharma',
    semesterId: 'bpharma-sem1',
    code: 'BP102T',
    name: 'Pharmaceutical Analysis - I',
    credits: 4,
    description: 'Acid-base titrations, non-aqueous titrations, precipitation titrations, and complexometric titrations.',
    unitsCount: 5
  },
  {
    id: 'sub-bpharm-ceutics',
    courseId: 'bpharma',
    semesterId: 'bpharma-sem1',
    code: 'BP103T',
    name: 'Pharmaceutics - I',
    credits: 4,
    description: 'Historical background, prescription parts, posology, powders, liquid dosage forms, and suspensions.',
    unitsCount: 5
  }
];

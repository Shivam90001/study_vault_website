import { StudyDocument } from '../types';

export const INITIAL_DOCUMENTS: StudyDocument[] = [
  // --- B.TECH DSA (KCS-301) ---
  {
    id: 'doc-dsa-syllabus',
    title: 'Data Structures & Algorithms - Official Syllabus & Exam Pattern',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    subjectId: 'sub-btech-dsa',
    type: 'syllabus',
    unit: 'all',
    fileFormat: 'pdf',
    fileName: 'kcs301-dsa-syllabus.pdf',
    fileSize: '1.2 MB',
    pagesCount: 5,
    author: 'PTU & State Technical Board',
    viewsCount: 3890,
    uploadDate: '2026-01-10',
    tags: ['Syllabus', 'Marking Scheme', 'Unit Weightage', 'PTU'],
    summary: 'Official curriculum syllabus covering 5 Units: Unit 1 (Introduction & Arrays), Unit 2 (Stacks & Queues), Unit 3 (Trees & BST), Unit 4 (Graphs & Paths), and Unit 5 (Sorting, Searching & Hashing) with marks breakdown.',
    previewPages: [
      {
        pageNumber: 1,
        title: 'Syllabus & Course Outcomes (KCS-301)',
        content: [
          'Unit 1: Introduction to DSA, Asymptotic Notations, Arrays (1D, 2D address formulas), Linked Lists (Singly, Doubly, Circular).',
          'Unit 2: Stacks (Array & Linked implementation, Infix/Postfix/Prefix conversions), Queues (Linear, Circular, Deque, Priority).',
          'Unit 3: Trees, Binary Tree traversals (Inorder, Preorder, Postorder), Binary Search Trees, AVL Tree rotations (LL, RR, LR, RL).',
          'Unit 4: Graphs (Adjacency Matrix/List), BFS, DFS, Minimum Spanning Trees (Prim & Kruskal), Shortest Path (Dijkstra).',
          'Unit 5: Searching (Linear, Binary), Sorting (Bubble, Insertion, Quick, Merge, Heap), Hashing techniques and collision resolution.'
        ]
      }
    ]
  },
  {
    id: 'doc-dsa-u1-notes',
    title: 'Unit 1: Arrays, Address Calculation & Linked Lists (Handwritten Notes)',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    subjectId: 'sub-btech-dsa',
    type: 'notes',
    unit: 1,
    fileFormat: 'pdf',
    fileName: 'dsa-unit1-handwritten.pdf',
    fileSize: '4.8 MB',
    pagesCount: 28,
    author: 'Aman Verma (Topper)',
    viewsCount: 6120,
    uploadDate: '2026-01-18',
    tags: ['Row Major', 'Column Major', 'Singly Linked List', 'Big-O', 'Pointers'],
    summary: 'Detailed handwritten topper notes covering asymptotic analysis (Big-O, Omega, Theta), Row-major & Column-major 2D array formulas with solved numericals, and full Singly/Doubly Linked List C implementations.',
    previewPages: [
      {
        pageNumber: 1,
        title: '2D Array Address Mapping Formulas',
        content: [
          'Row-Major Order: Loc(A[i][j]) = Base_Address + [ (i - Lr) * C + (j - Lc) ] * w',
          'Column-Major Order: Loc(A[i][j]) = Base_Address + [ (j - Lc) * R + (i - Lr) ] * w',
          'Where R = total rows, C = total columns, w = element byte size, Lr/Lc = lower index bounds.'
        ],
        formula: 'Loc(A[i][j]) = B + [(i - L1)*N + (j - L2)] * sizeof(element)'
      },
      {
        pageNumber: 2,
        title: 'Singly Linked List Operations',
        content: [
          'struct Node { int data; struct Node *next; };',
          'Insert at Beginning: newNode->next = head; head = newNode; (Time: O(1))',
          'Insert at End: temp->next = newNode; (Time: O(n))',
          'Reversal of List: prev = NULL, curr = head; while(curr) { next = curr->next; curr->next = prev; prev = curr; curr = next; } head = prev;'
        ]
      }
    ]
  },
  {
    id: 'doc-dsa-u2-notes',
    title: 'Unit 2: Stacks, Queues & Polish Notations (Handwritten Notes)',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    subjectId: 'sub-btech-dsa',
    type: 'notes',
    unit: 2,
    fileFormat: 'docx',
    fileName: 'stacks-and-queues-notes.docx',
    fileSize: '4.2 MB',
    pagesCount: 24,
    author: 'Rohit Sharma (Faculty)',
    viewsCount: 4200,
    uploadDate: '2026-01-25',
    tags: ['Stack', 'Queue', 'Infix to Postfix', 'Recursion', 'Circular Queue'],
    summary: 'Clean handwritten notes on Stack LIFO operations, Infix to Postfix conversion operator priority table, Evaluation of postfix using stack, and Circular queue boundary conditions.',
    previewPages: [
      {
        pageNumber: 1,
        title: 'Infix to Postfix Algorithm & Circular Queue',
        content: [
          'Circular Queue Insertion: rear = (rear + 1) % MAX; queue[rear] = item;',
          'Circular Queue Deletion: item = queue[front]; front = (front + 1) % MAX;',
          'Queue Full Condition: (rear + 1) % MAX == front',
          'Queue Empty Condition: front == -1'
        ]
      }
    ]
  },
  {
    id: 'doc-dsa-pyq-2025',
    title: 'DSA End-Semester Exam Paper 2025 (Solved with Detailed Steps)',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    subjectId: 'sub-btech-dsa',
    type: 'pyq',
    unit: 'all',
    fileFormat: 'pdf',
    fileName: 'ptu-dsa-2025-solved.pdf',
    fileSize: '6.4 MB',
    pagesCount: 18,
    author: 'PTU Examination Solution Cell',
    viewsCount: 7800,
    uploadDate: '2026-02-02',
    tags: ['2025 Solved', 'PYQ', 'Section A B C', '100 Marks', 'PTU'],
    summary: 'Full 100-mark university question paper with answers for all Section A 2-mark theory questions, Section B 7-mark numericals, and Section C 10-mark full algorithms.',
    previewPages: [
      {
        pageNumber: 1,
        title: '2025 Solved Section A Short Questions',
        content: [
          'Q1(a): Differentiate between linear and non-linear data structures with examples.',
          'Answer: Linear structures store elements sequentially (Arrays, Linked Lists, Stacks, Queues). Non-linear structures store elements hierarchically or interconnected (Trees, Graphs).',
          'Q1(b): State the balance condition of AVL trees.',
          'Answer: |Height(Left Subtree) - Height(Right Subtree)| <= 1 for all nodes.'
        ]
      }
    ]
  },
  {
    id: 'doc-dsa-diagram',
    title: 'AVL Tree 4-Rotations & Tree Traversals Master Diagram',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    subjectId: 'sub-btech-dsa',
    type: 'photo',
    unit: 3,
    fileFormat: 'jpg',
    fileName: 'avl-tree-rotations.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1516116211227-bbc897b2ebbf?auto=format&fit=crop&w=1200&q=80',
    fileSize: '1.8 MB',
    pagesCount: 1,
    author: 'Prof. S. K. Gupta',
    viewsCount: 4500,
    uploadDate: '2026-02-10',
    tags: ['Diagram', 'AVL Rotations', 'LL RR LR RL', 'Visual Summary'],
    summary: 'High-resolution diagram illustrating LL (Single Right), RR (Single Left), LR (Left-Right Double), and RL (Right-Left Double) rotations with before-and-after tree states.'
  },

  // --- B.TECH OPERATING SYSTEMS (KCS-401) ---
  {
    id: 'doc-os-syllabus',
    title: 'Operating Systems - Official Syllabus & Marks Distribution',
    courseId: 'btech',
    semesterId: 'btech-sem4',
    subjectId: 'sub-btech-os',
    type: 'syllabus',
    unit: 'all',
    fileFormat: 'pdf',
    fileName: 'os-ptu-syllabus.pdf',
    fileSize: '1.1 MB',
    pagesCount: 4,
    author: 'PTU Curriculum Board',
    viewsCount: 2600,
    uploadDate: '2026-01-12',
    tags: ['Syllabus', 'OS', 'Schedules', 'Deadlocks'],
    summary: 'Official syllabus covering Process management, CPU scheduling, Synchronization, Semaphores, Deadlocks, Paging, Virtual Memory, and File systems.'
  },
  {
    id: 'doc-os-u1-notes',
    title: 'Unit 1 & 2: Process Scheduling & Gantt Chart Numericals (Handwritten)',
    courseId: 'btech',
    semesterId: 'btech-sem4',
    subjectId: 'sub-btech-os',
    type: 'notes',
    unit: 1,
    fileFormat: 'pdf',
    fileName: 'os-unit1-notes.pdf',
    fileSize: '5.1 MB',
    pagesCount: 26,
    author: 'Priya Bansal (Gold Medalist)',
    viewsCount: 5100,
    uploadDate: '2026-01-20',
    tags: ['FCFS', 'SJF', 'Round Robin', 'Gantt Chart', 'Turnaround Time'],
    summary: 'Complete solved numericals for FCFS, SJF Preemptive (SRTF), Priority, and Round Robin scheduling with Turnaround time and Waiting time calculation tables.',
    previewPages: [
      {
        pageNumber: 1,
        title: 'CPU Scheduling Formulas & Metrics',
        content: [
          'Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)',
          'Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT)',
          'Response Time (RT) = Time first allocated CPU - Arrival Time (AT)',
          'Average Waiting Time = (Sum of WT of all processes) / Total Processes'
        ]
      }
    ]
  },
  {
    id: 'doc-os-pyq',
    title: 'Operating Systems 3-Year Solved Question Papers (2022-2024)',
    courseId: 'btech',
    semesterId: 'btech-sem4',
    subjectId: 'sub-btech-os',
    type: 'pyq',
    unit: 'all',
    fileFormat: 'pdf',
    fileName: 'ptu-os-pyq-solved.pdf',
    fileSize: '7.2 MB',
    pagesCount: 22,
    author: 'PTU Exam Board Solved Cell',
    viewsCount: 6500,
    uploadDate: '2026-01-29',
    tags: ['Banker Algorithm', 'Page Replacement', 'FIFO LRU', 'Disk Scheduling'],
    summary: 'Solved university questions covering Banker Algorithm for deadlock safety, Page Replacement algorithms (FIFO, LRU, Optimal), and Disk Scheduling (SSTF, SCAN, C-SCAN).'
  },

  // --- BCA C PROGRAMMING (BCA-101) ---
  {
    id: 'doc-bca-syllabus',
    title: 'BCA-101: Programming in C - Official Syllabus & Practical List',
    courseId: 'bca',
    semesterId: 'bca-sem1',
    subjectId: 'sub-bca-c',
    type: 'syllabus',
    unit: 'all',
    fileFormat: 'pdf',
    fileName: 'bca101-syllabus.pdf',
    fileSize: '1.0 MB',
    pagesCount: 3,
    author: 'BCA Board of Studies',
    viewsCount: 3600,
    uploadDate: '2026-01-14',
    tags: ['BCA', 'Syllabus', 'C Language', 'Practical List'],
    summary: 'Official syllabus for 1st Semester BCA C Programming: Variables, Control Statements, Functions, Arrays, Pointers, Structures, Unions, File Handling and Lab experiment list.'
  },
  {
    id: 'doc-bca-c-notes',
    title: 'C Programming Handwritten Complete Notes (Unit 1 to 5)',
    courseId: 'bca',
    semesterId: 'bca-sem1',
    subjectId: 'sub-bca-c',
    type: 'notes',
    unit: 'all',
    fileFormat: 'pdf',
    fileName: 'c-programming-topper-notes.pdf',
    fileSize: '6.2 MB',
    pagesCount: 38,
    author: 'Neha Aggarwal',
    viewsCount: 8200,
    uploadDate: '2026-01-22',
    tags: ['C Lang', 'Pointers', 'Arrays', 'Structures', 'Files'],
    summary: 'Complete exam-oriented notes with syntax, dry run execution tables, pointer arithmetic, memory layout of structures, and 25 most repeated university exam programs.'
  },
  {
    id: 'doc-bca-c-pyq',
    title: 'BCA 1st Sem C Programming Solved 5-Year Question Papers',
    courseId: 'bca',
    semesterId: 'bca-sem1',
    subjectId: 'sub-bca-c',
    type: 'pyq',
    unit: 'all',
    fileFormat: 'pdf',
    fileName: 'bca-c-5yr-pyq.pdf',
    fileSize: '5.8 MB',
    pagesCount: 20,
    author: 'BCA Scholar Guild',
    viewsCount: 4900,
    uploadDate: '2026-01-30',
    tags: ['BCA PYQ', 'Solved', 'University Exam'],
    summary: 'Solved university papers of last 5 years covering dynamic memory allocation, string operations without library functions, recursion, and file copying programs.'
  },

  // --- D.PHARMA PHARMACEUTICS (ER20-11T) ---
  {
    id: 'doc-dpharm-syllabus',
    title: 'D.Pharma Pharmaceutics - Official PCI Syllabus',
    courseId: 'dpharma',
    semesterId: 'dpharma-sem1',
    subjectId: 'sub-dpharm-ceutics',
    type: 'syllabus',
    unit: 'all',
    fileFormat: 'pdf',
    fileName: 'pci-dpharma-ceutics.pdf',
    fileSize: '1.3 MB',
    pagesCount: 4,
    author: 'Pharmacy Council of India (PCI)',
    viewsCount: 3900,
    uploadDate: '2026-01-16',
    tags: ['PCI', 'Pharmaceutics', 'D.Pharma', 'Dosage Forms'],
    summary: 'Official PCI Syllabus covering History of pharmacy, Packaging materials, Size reduction, Filtration, Tablet manufacturing, Capsules, and Ointments.'
  },
  {
    id: 'doc-dpharm-notes',
    title: 'Pharmaceutics-I Comprehensive Topper Handwritten Notes',
    courseId: 'dpharma',
    semesterId: 'dpharma-sem1',
    subjectId: 'sub-dpharm-ceutics',
    type: 'notes',
    unit: 1,
    fileFormat: 'pdf',
    fileName: 'dpharma-ceutics-notes.pdf',
    fileSize: '5.4 MB',
    pagesCount: 32,
    author: 'Pooja Verma (B.Pharm/M.Pharm)',
    viewsCount: 5700,
    uploadDate: '2026-01-26',
    tags: ['Packaging Materials', 'Dosage Forms', 'Tablets', 'Syrups'],
    summary: 'Clean handwritten notes on classification of dosage forms, Indian Pharmacopoeia history, glass/plastic packaging materials, and Ball Mill / Hammer Mill working principles.'
  },
  {
    id: 'doc-dpharm-pyq',
    title: 'D.Pharma 1st Year Pharmaceutics Solved Papers (2021-2025)',
    courseId: 'dpharma',
    semesterId: 'dpharma-sem1',
    subjectId: 'sub-dpharm-ceutics',
    type: 'pyq',
    unit: 'all',
    fileFormat: 'pdf',
    fileName: 'dpharma-solved-papers.pdf',
    fileSize: '6.1 MB',
    pagesCount: 22,
    author: 'Pharmacy Exam Board',
    viewsCount: 6400,
    uploadDate: '2026-02-05',
    tags: ['D.Pharma PYQ', 'Solved Papers', 'PCI Scheme'],
    summary: 'Full solutions for Board of Technical Education Pharmacy exams with diagrams of Ball Mill, Fluid Energy Mill, and Seitz Filter.'
  },
  {
    id: 'doc-dpharm-photo',
    title: 'Pharmaceutical Equipment & Mills Working Flowcharts',
    courseId: 'dpharma',
    semesterId: 'dpharma-sem1',
    subjectId: 'sub-dpharm-ceutics',
    type: 'photo',
    unit: 2,
    fileFormat: 'png',
    fileName: 'mills-flowchart.png',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
    fileSize: '2.1 MB',
    pagesCount: 1,
    author: 'Lab Instructor',
    viewsCount: 3100,
    uploadDate: '2026-02-12',
    tags: ['Diagram', 'Ball Mill', 'Hammer Mill', 'Filter Press'],
    summary: 'Labelled photographic diagrams of Ball Mill, Hammer Mill, and Cyclone Separator required for pharmacy board exam questions.'
  },

  // --- B.PHARMA HAP (BP101T) ---
  {
    id: 'doc-bpharm-syllabus',
    title: 'B.Pharma Human Anatomy & Physiology - I (BP101T) Syllabus',
    courseId: 'bpharma',
    semesterId: 'bpharma-sem1',
    subjectId: 'sub-bpharm-hap',
    type: 'syllabus',
    unit: 'all',
    fileFormat: 'pdf',
    fileName: 'bp101t-syllabus.pdf',
    fileSize: '1.1 MB',
    pagesCount: 4,
    author: 'PCI Curriculum Cell',
    viewsCount: 2900,
    uploadDate: '2026-01-15',
    tags: ['B.Pharma', 'HAP', 'Syllabus', 'Anatomy'],
    summary: 'Official PCI Syllabus covering Introduction to Human Body, Cellular level, Tissue level, Integumentary system, Skeletal system, and Hemopoietic system.'
  },
  {
    id: 'doc-bpharm-notes',
    title: 'HAP-I Complete Handwritten Study Notes & Labelled Diagrams',
    courseId: 'bpharma',
    semesterId: 'bpharma-sem1',
    subjectId: 'sub-bpharm-hap',
    type: 'notes',
    unit: 1,
    fileFormat: 'pdf',
    fileName: 'bpharm-hap-notes.pdf',
    fileSize: '6.9 MB',
    pagesCount: 44,
    author: 'Deepak Joshi',
    viewsCount: 6200,
    uploadDate: '2026-01-28',
    tags: ['HAP Notes', 'Blood Coagulation', 'Bone Structure', 'Cell Organelles'],
    summary: 'Detailed medical drawings and handwritten notes on Cell anatomy, Active/Passive transport, Epithelial/Connective tissues, and Mechanism of Blood Coagulation cascade.'
  },

  // --- MBA MARKETING (MBA-101) ---
  {
    id: 'doc-mba-notes',
    title: 'Marketing Management Concept Notes & Case Studies',
    courseId: 'mba',
    semesterId: 'mba-sem1',
    subjectId: 'sub-mba-marketing',
    type: 'notes',
    unit: 'all',
    fileFormat: 'docx',
    fileName: 'mba-marketing-notes.docx',
    fileSize: '4.9 MB',
    pagesCount: 30,
    author: 'Prof. R. Singhania',
    viewsCount: 4100,
    uploadDate: '2026-01-24',
    tags: ['4Ps Marketing', 'STP Analysis', 'Consumer Behavior', 'Case Studies'],
    summary: 'Core MBA notes covering Philip Kotler marketing framework, Segmentation Targeting Positioning (STP), Product Life Cycle (PLC), and Pricing strategies with real Indian market case studies.'
  }
];

import { MCQQuestion } from '../types';

export const INITIAL_MCQS: MCQQuestion[] = [
  // DSA MCQs
  {
    id: 'mcq-dsa-1',
    subjectId: 'sub-btech-dsa',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    unit: 1,
    question: 'What is the worst-case time complexity of inserting an element at the beginning of a Singly Linked List?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctOptionIndex: 0,
    explanation: 'Inserting at the beginning only requires updating the new node’s next pointer to head, and head to new node, taking O(1) constant time.'
  },
  {
    id: 'mcq-dsa-2',
    subjectId: 'sub-btech-dsa',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    unit: 1,
    question: 'In a 2D array A[1..10][1..20] stored in Row-Major order, what is used to calculate the offset?',
    options: ['Number of Columns', 'Number of Rows', 'Total Elements Squared', 'Base Address Only'],
    correctOptionIndex: 0,
    explanation: 'Row-major addressing multiplies row index difference by the total number of columns in the matrix.'
  },
  {
    id: 'mcq-dsa-3',
    subjectId: 'sub-btech-dsa',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    unit: 2,
    question: 'Which data structure is primarily used for evaluating postfix arithmetic expressions?',
    options: ['Queue', 'Stack', 'Binary Tree', 'Priority Queue'],
    correctOptionIndex: 1,
    explanation: 'A Stack follows LIFO order, ideal for pushing operands and popping them whenever an operator is encountered.'
  },
  {
    id: 'mcq-dsa-4',
    subjectId: 'sub-btech-dsa',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    unit: 3,
    question: 'What is the balance factor condition for a valid AVL Tree node?',
    options: ['Must be 0 only', 'Must belong to {-1, 0, +1}', 'Must be greater than 1', 'Height(Left) must equal Height(Right)'],
    correctOptionIndex: 1,
    explanation: 'An AVL tree requires that the difference between left and right subtree heights (Balance Factor) must be -1, 0, or +1 for every node.'
  },
  {
    id: 'mcq-dsa-5',
    subjectId: 'sub-btech-dsa',
    courseId: 'btech',
    semesterId: 'btech-sem3',
    unit: 5,
    question: 'Which sorting algorithm has a worst-case time complexity of O(n log n) and is NOT in-place?',
    options: ['Heap Sort', 'Quick Sort', 'Merge Sort', 'Insertion Sort'],
    correctOptionIndex: 2,
    explanation: 'Merge Sort guarantees O(n log n) in all cases, but requires auxiliary O(n) memory to merge divided halves.'
  },

  // Operating Systems MCQs
  {
    id: 'mcq-os-1',
    subjectId: 'sub-btech-os',
    courseId: 'btech',
    semesterId: 'btech-sem4',
    unit: 1,
    question: 'Which scheduling algorithm is non-preemptive and assigns CPU to the process with the shortest burst time first?',
    options: ['Round Robin', 'Non-Preemptive SJF', 'SRTF', 'Priority Preemptive'],
    correctOptionIndex: 1,
    explanation: 'Shortest Job First (SJF) non-preemptive chooses the process with the smallest execution requirement and lets it run until completion.'
  },
  {
    id: 'mcq-os-2',
    subjectId: 'sub-btech-os',
    courseId: 'btech',
    semesterId: 'btech-sem4',
    unit: 3,
    question: 'Which of the following is NOT one of the 4 Coffman conditions for Deadlock?',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
    correctOptionIndex: 2,
    explanation: 'No Preemption is the necessary condition. If preemption is allowed, deadlock cannot occur.'
  },

  // BCA C Programming MCQs
  {
    id: 'mcq-bca-1',
    subjectId: 'sub-bca-c',
    courseId: 'bca',
    semesterId: 'bca-sem1',
    unit: 1,
    question: 'Which operator in C language is used to access the address of a variable?',
    options: ['*', '&', '->', '.'],
    correctOptionIndex: 1,
    explanation: 'The ampersand (&) is the address-of operator in C, returning the memory address of the operand.'
  },
  {
    id: 'mcq-bca-2',
    subjectId: 'sub-bca-c',
    courseId: 'bca',
    semesterId: 'bca-sem1',
    unit: 3,
    question: 'What is the return type of the malloc() function in C?',
    options: ['int *', 'void *', 'char *', 'float *'],
    correctOptionIndex: 1,
    explanation: 'malloc() allocates raw untyped memory and returns a generic pointer (void *).'
  },

  // Pharmacy MCQs (D.Pharma)
  {
    id: 'mcq-dpharm-1',
    subjectId: 'sub-dpharm-ceutics',
    courseId: 'dpharma',
    semesterId: 'dpharma-sem1',
    unit: 1,
    question: 'Which Indian Pharmacopoeia edition was published first in independent India?',
    options: ['1947', '1955', '1966', '1985'],
    correctOptionIndex: 1,
    explanation: 'The First Edition of the Indian Pharmacopoeia (IP) was officially published in 1955 under the chairmanship of Dr. B. N. Ghosh.'
  }
];

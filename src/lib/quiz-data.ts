export type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

export const questions: Question[] = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language",
    ],
    correctIndex: 0,
  },
  {
    id: 2,
    question: "Which CSS property changes text color?",
    options: ["font-size", "color", "background", "border"],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "Which function is used to display output in Python?",
    options: ["show()", "display()", "print()", "output()"],
    correctIndex: 2,
  },
  {
    id: 4,
    question: "Which data structure follows LIFO?",
    options: ["Queue", "Stack", "Array", "Tree"],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "What does AI stand for?",
    options: [
      "Artificial Intelligence",
      "Automated Information",
      "Advanced Internet",
      "Artificial Interface",
    ],
    correctIndex: 0,
  },
];

export const POINTS_PER_QUESTION = 20;

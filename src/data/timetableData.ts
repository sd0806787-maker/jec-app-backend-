export interface ClassSlot {
  time: string;
  subject: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Break';
  color: string;
}

export interface DaySchedule {
  day: string;
  classes: ClassSlot[];
}

const COLORS = {
  blue: '#60A5FA',
  green: '#34D399',
  pink: '#F472B6',
  purple: '#A78BFA',
  yellow: '#FBBF24',
  red: '#F87171',
  cyan: '#22D3EE',
  orange: '#FB923C',
  gray: '#9CA3AF',
};

const lecture = (
  time: string,
  subject: string,
  color: string,
  room = 'TBA'
): ClassSlot => ({
  time,
  subject,
  room,
  type: 'Lecture',
  color,
});

const lab = (
  time: string,
  subject: string,
  color: string,
  room = 'TBA'
): ClassSlot => ({
  time,
  subject,
  room,
  type: 'Lab',
  color,
});

const noClass = (time: string): ClassSlot => ({
  time,
  subject: 'No Class',
  room: '-',
  type: 'Break',
  color: COLORS.gray,
});

const minor = (time: string) =>
  lecture(time, 'Minor Subject', COLORS.gray);

export const timetableDatabase: Record<
  string,
  Record<string, DaySchedule[]>
> = {
  CSE: {
    // =========================
    // 3RD SEMESTER
    // =========================
    '3': [
      {
        day: 'Monday',
        classes: [
          minor('08:00 - 09:00'),
          lecture('09:00 - 10:00', 'Object-Oriented Programming', COLORS.pink),
          lecture('10:30 - 11:30', 'Software Engineering', COLORS.green),
          lecture('11:30 - 12:30', 'Mathematics III', COLORS.yellow),
          noClass('02:00 - 03:00'),
          lab('03:00 - 04:00', 'Data Structures and Algorithms Lab', COLORS.purple),
        ],
      },
      {
        day: 'Tuesday',
        classes: [
          minor('08:00 - 09:00'),
          lecture('09:00 - 10:00', 'Digital Systems', COLORS.cyan),
          lecture('10:30 - 11:30', 'Data Structures and Algorithms', COLORS.blue),
          lecture('11:30 - 12:30', 'Mathematics III', COLORS.yellow),
          noClass('02:00 - 03:00'),
          lab('03:00 - 04:00', 'Object-Oriented Programming Lab', COLORS.pink),
        ],
      },
      {
        day: 'Wednesday',
        classes: [
          minor('08:00 - 09:00'),
          lecture('09:00 - 10:00', 'No Class', COLORS.gray),
          lecture('10:30 - 11:30', 'Digital Systems', COLORS.cyan),
          lecture('11:30 - 12:30', 'Data Structures and Algorithms', COLORS.blue),
          noClass('02:00 - 03:00'),
          lab('03:00 - 04:00', 'Python Programming Lab', COLORS.orange),
        ],
      },
      {
        day: 'Thursday',
        classes: [
          minor('08:00 - 09:00'),
          lecture('09:00 - 10:00', 'Object-Oriented Programming', COLORS.pink),
          lecture('10:30 - 11:30', 'Digital Systems', COLORS.cyan),
          lecture('11:30 - 12:30', 'Data Structures and Algorithms', COLORS.blue),
          lecture('02:00 - 03:00', 'Indian Knowledge Systems', COLORS.yellow),
          lecture('03:00 - 04:00', 'Language Other Than MIL', COLORS.green),
        ],
      },
      {
        day: 'Friday',
        classes: [
          minor('08:00 - 09:00'),
          lecture('09:00 - 10:00', 'No Class', COLORS.gray),
          lecture('10:30 - 11:30', 'Software Engineering', COLORS.green),
          lecture('11:30 - 12:30', 'Object-Oriented Programming', COLORS.pink),
          lecture('02:00 - 03:00', 'Language Other Than MIL', COLORS.green),
          lecture('03:00 - 04:00', 'Indian Knowledge Systems', COLORS.yellow),
        ],
      },
      {
        day: 'Saturday',
        classes: [
          minor('08:00 - 09:00'),
          lecture('09:00 - 10:00', 'No Class', COLORS.gray),
          lecture('10:30 - 11:30', 'Software Engineering', COLORS.green),
          lecture('11:30 - 12:30', 'Mathematics III', COLORS.yellow),
          noClass('02:00 - 03:00'),
          noClass('03:00 - 04:00'),
        ],
      },
    ],

    // =========================
    // 5TH SEMESTER
    // =========================
    '5': [
      {
        day: 'Monday',
        classes: [
          lecture('08:00 - 09:00', 'Artificial Intelligence', COLORS.blue),
          lecture('09:00 - 10:00', 'Cybersecurity', COLORS.red),
          noClass('10:30 - 11:30'),
          noClass('11:30 - 12:30'),
          noClass('02:00 - 03:00'),
          lab('03:00 - 04:00', 'Software DevOps and Automation Lab', COLORS.purple),
        ],
      },
      {
        day: 'Tuesday',
        classes: [
          lecture('08:00 - 09:00', 'Computer Networks', COLORS.cyan),
          lecture('09:00 - 10:00', 'Artificial Intelligence', COLORS.blue),
          lecture('10:30 - 11:30', 'Entrepreneurship and Industrial Management / Formal Language and Automata Theory', COLORS.yellow),
          noClass('11:30 - 12:30'),
          lab('02:00 - 03:00', 'OS-Network Lab', COLORS.green),
          noClass('03:00 - 04:00'),
        ],
      },
      {
        day: 'Wednesday',
        classes: [
          lecture('08:00 - 09:00', 'Formal Language and Automata Theory', COLORS.purple),
          lecture('09:00 - 10:00', 'Operating Systems', COLORS.red),
          lecture('10:30 - 11:30', 'Artificial Intelligence', COLORS.blue),
          lecture('11:30 - 12:30', 'Operating Systems', COLORS.red),
          lecture('02:00 - 03:00', 'Formal Language and Automata Theory', COLORS.purple),
          noClass('03:00 - 04:00'),
        ],
      },
      {
        day: 'Thursday',
        classes: [
          lecture('08:00 - 09:00', 'Formal Language and Automata Theory', COLORS.purple),
          lecture('09:00 - 10:00', 'Cybersecurity', COLORS.red),
          lecture('10:30 - 11:30', 'Computer Networks', COLORS.cyan),
          noClass('11:30 - 12:30'),
          lab('02:00 - 03:00', 'AI-Augmented Software Engineering Lab', COLORS.orange),
          noClass('03:00 - 04:00'),
        ],
      },
      {
        day: 'Friday',
        classes: [
          lecture('08:00 - 09:00', 'Computer Networks', COLORS.cyan),
          lecture('09:00 - 10:00', 'Operating Systems', COLORS.red),
          noClass('10:30 - 11:30'),
          noClass('11:30 - 12:30'),
          lab('02:00 - 03:00', 'AI-Augmented Software Engineering Lab', COLORS.orange),
          noClass('03:00 - 04:00'),
        ],
      },
      {
        day: 'Saturday',
        classes: [
          lab('08:00 - 09:00', 'Software DevOps and Automation Lab', COLORS.purple),
          noClass('09:00 - 10:00'),
          lab('10:30 - 11:30', 'Software DevOps and Automation Lab', COLORS.purple),
          lecture('11:30 - 12:30', 'Cybersecurity', COLORS.red),
          noClass('02:00 - 03:00'),
          noClass('03:00 - 04:00'),
        ],
      },
    ],

    // =========================
    // 7TH SEMESTER
    // =========================
    '7': [
      {
        day: 'Monday',
        classes: [
          lecture('08:00 - 09:00', 'Principles of Management', COLORS.yellow),
          lecture('09:00 - 10:00', 'Machine Learning', COLORS.blue),
          lecture('10:30 - 11:30', 'Distributed Systems', COLORS.cyan),
          noClass('11:30 - 12:30'),
          noClass('02:00 - 03:00'),
          noClass('03:00 - 04:00'),
        ],
      },
      {
        day: 'Tuesday',
        classes: [
          lecture('08:00 - 09:00', 'No Class', COLORS.gray),
          lecture('09:00 - 10:00', 'Machine Learning', COLORS.blue),
          lecture('10:30 - 11:30', 'Principles of Programming Languages', COLORS.pink),
          noClass('11:30 - 12:30'),
          noClass('02:00 - 03:00'),
          noClass('03:00 - 04:00'),
        ],
      },
      {
        day: 'Wednesday',
        classes: [
          lecture('08:00 - 09:00', 'No Class', COLORS.gray),
          lecture('09:00 - 10:00', 'Principles of Management', COLORS.yellow),
          lecture('10:30 - 11:30', 'Principles of Programming Languages', COLORS.pink),
          noClass('11:30 - 12:30'),
          lecture('02:00 - 03:00', 'Project', COLORS.orange),
          noClass('03:00 - 04:00'),
        ],
      },
      {
        day: 'Thursday',
        classes: [
          lecture('08:00 - 09:00', 'No Class', COLORS.gray),
          lecture('09:00 - 10:00', 'Distributed Systems', COLORS.cyan),
          lecture('10:30 - 11:30', 'Machine Learning', COLORS.blue),
          noClass('11:30 - 12:30'),
          noClass('02:00 - 03:00'),
          noClass('03:00 - 04:00'),
        ],
      },
      {
        day: 'Friday',
        classes: [
          lecture('08:00 - 09:00', 'Distributed Systems', COLORS.cyan),
          noClass('09:00 - 10:00'),
          lecture('10:30 - 11:30', 'Principles of Programming Languages', COLORS.pink),
          noClass('11:30 - 12:30'),
          noClass('02:00 - 03:00'),
          noClass('03:00 - 04:00'),
        ],
      },
      {
        day: 'Saturday',
        classes: [
          lecture('08:00 - 09:00', 'No Class', COLORS.gray),
          noClass('09:00 - 10:00'),
          noClass('10:30 - 11:30'),
          noClass('11:30 - 12:30'),
          noClass('02:00 - 03:00'),
          noClass('03:00 - 04:00'),
        ],
      },
    ],
  },

  // Existing ETC mock data
  ETC: {
    '3': [
      {
        day: 'Monday',
        classes: [
          noClass('08:00 - 09:00'),
          lecture('09:00 - 10:00', 'Signals and Systems', COLORS.purple),
          lecture('10:30 - 11:30', 'Network Theory', COLORS.yellow),
          noClass('11:30 - 12:30'),
          noClass('02:00 - 03:00'),
          noClass('03:00 - 04:00'),
        ],
      },
    ],
  },
};

export const defaultTimetable: DaySchedule[] = [
  {
    day: 'Monday',
    classes: [
      lecture('08:00 - 09:00', 'General Class 1', COLORS.gray),
      lecture('09:00 - 10:00', 'General Class 2', COLORS.gray),
      noClass('10:30 - 11:30'),
      noClass('11:30 - 12:30'),
      noClass('02:00 - 03:00'),
      noClass('03:00 - 04:00'),
    ],
  },
];

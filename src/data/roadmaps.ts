/**
 * Skill roadmaps.
 *
 * Data lives in the app so the feature works offline and instantly. To add a
 * new skill, append a new entry to ROADMAPS — the search screen picks it up
 * automatically. `aliases` lets students find a roadmap with common spellings
 * and abbreviations (e.g. "ml", "cpp", "web dev").
 */

import { BRANCH_ROADMAPS } from './branchRoadmaps';

export type RoadmapLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface RoadmapResource {
  label: string;
  url: string;
}

export interface RoadmapStage {
  title: string;
  description: string;
  topics: string[];
  resources?: RoadmapResource[];
}

/** A topic expanded with an explanation and its own sub-nodes. */
export interface RoadmapTopic {
  name: string;
  summary: string;
  subtopics: string[];
}

export interface Roadmap {
  id: string;
  title: string;
  icon: string;
  color: string;
  level: RoadmapLevel;
  duration: string;
  description: string;
  aliases: string[];
  stages: RoadmapStage[];
}

export const POPULAR_SKILLS = [
  'Web Development',
  'Python',
  'Machine Learning',
  'DSA',
  'Cyber Security',
  'Android',
  'UI UX',
  'Cloud',
];

const CURATED_ROADMAPS: Roadmap[] = [
  {
    id: 'web-development',
    title: 'Frontend Web Development',
    icon: 'globe-outline',
    color: '#3B82F6',
    level: 'Beginner',
    duration: '4–6 months',
    description:
      'Build modern websites and web apps with HTML, CSS, JavaScript and React.',
    aliases: ['web dev', 'web development', 'frontend', 'html', 'css', 'javascript', 'js', 'react'],
    stages: [
      {
        title: 'How the Web Works',
        description: 'Understand what happens between a browser and a server.',
        topics: ['Internet basics', 'HTTP & HTTPS', 'DNS', 'Client vs server', 'Browser dev tools'],
        resources: [{ label: 'MDN — Learn Web Development', url: 'https://developer.mozilla.org/en-US/docs/Learn' }],
      },
      {
        title: 'HTML & CSS',
        description: 'Structure pages and style them responsively.',
        topics: ['Semantic HTML', 'Forms & inputs', 'Flexbox', 'CSS Grid', 'Responsive design', 'Accessibility'],
        resources: [{ label: 'MDN — HTML & CSS', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' }],
      },
      {
        title: 'JavaScript',
        description: 'Make pages interactive and talk to APIs.',
        topics: ['Syntax & types', 'Functions', 'DOM & events', 'ES6+ features', 'Fetch API', 'Async / await'],
        resources: [{ label: 'javascript.info', url: 'https://javascript.info/' }],
      },
      {
        title: 'Git & GitHub',
        description: 'Track changes and collaborate with others.',
        topics: ['Repositories', 'Commits', 'Branching', 'Merge & conflicts', 'Pull requests'],
        resources: [{ label: 'Git — The Simple Guide', url: 'https://rogerdudler.github.io/git-guide/' }],
      },
      {
        title: 'React',
        description: 'Build reusable UI with components and state.',
        topics: ['Components & JSX', 'Props', 'State', 'Hooks', 'Routing', 'Forms'],
        resources: [{ label: 'React Official Docs', url: 'https://react.dev/learn' }],
      },
      {
        title: 'Build & Deploy',
        description: 'Ship your project to the internet.',
        topics: ['npm & Vite', 'Environment variables', 'Build output', 'Netlify / Vercel', 'Custom domains'],
      },
      {
        title: 'Portfolio Project',
        description: 'Combine everything into a real project.',
        topics: ['Plan the UI', 'Build features', 'Consume an API', 'Deploy', 'Write a README'],
        resources: [{ label: 'Frontend Roadmap', url: 'https://roadmap.sh/frontend' }],
      },
    ],
  },
  {
    id: 'full-stack',
    title: 'Full Stack Development',
    icon: 'layers-outline',
    color: '#8B5CF6',
    level: 'Intermediate',
    duration: '6–9 months',
    description:
      'Master both the client and server side to build complete web applications.',
    aliases: ['fullstack', 'full stack', 'mern', 'mean', 'frontend backend'],
    stages: [
      {
        title: 'Frontend Foundations',
        description: 'HTML, CSS, JavaScript and one framework.',
        topics: ['HTML & CSS', 'JavaScript', 'React', 'Responsive UI', 'State management'],
        resources: [{ label: 'Full Stack Roadmap', url: 'https://roadmap.sh/full-stack' }],
      },
      {
        title: 'Backend Basics',
        description: 'Create servers and expose APIs.',
        topics: ['Node.js', 'Express', 'Routing', 'Middleware', 'REST principles'],
        resources: [{ label: 'Express Docs', url: 'https://expressjs.com/' }],
      },
      {
        title: 'Databases',
        description: 'Store and query application data.',
        topics: ['SQL basics', 'MongoDB', 'Schema design', 'ORMs', 'Migrations'],
      },
      {
        title: 'Auth & Security',
        description: 'Protect user accounts and data.',
        topics: ['Password hashing', 'JWT & sessions', 'CORS', 'Input validation', 'Rate limiting'],
      },
      {
        title: 'API Integration',
        description: 'Connect frontend and backend reliably.',
        topics: ['REST endpoints', 'Postman', 'Error handling', 'Loading states', 'Pagination'],
      },
      {
        title: 'Deployment & DevOps',
        description: 'Run the app in production.',
        topics: ['Environment config', 'Docker', 'CI/CD', 'Cloud hosting', 'Logging'],
      },
      {
        title: 'Capstone Project',
        description: 'Build and ship a complete product.',
        topics: ['Authentication flow', 'CRUD features', 'File uploads', 'Testing', 'Deployment'],
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    icon: 'server-outline',
    color: '#22C55E',
    level: 'Intermediate',
    duration: '4–6 months',
    description:
      'Design servers, APIs and databases that power real applications.',
    aliases: ['backend', 'server side', 'node', 'nodejs', 'express', 'api'],
    stages: [
      {
        title: 'Pick a Language',
        description: 'Learn one backend language well.',
        topics: ['JavaScript / Node.js', 'Python', 'Java', 'Syntax & OOP', 'Debugging'],
      },
      {
        title: 'Web Servers & APIs',
        description: 'Handle requests and return responses.',
        topics: ['HTTP methods', 'Express / FastAPI', 'Routing', 'Middleware', 'Status codes'],
        resources: [{ label: 'Backend Roadmap', url: 'https://roadmap.sh/backend' }],
      },
      {
        title: 'Databases',
        description: 'Persist and query data.',
        topics: ['SQL', 'MongoDB', 'Relationships', 'Indexes', 'Transactions'],
      },
      {
        title: 'REST API Design',
        description: 'Build clean and predictable endpoints.',
        topics: ['Resources & routes', 'Versioning', 'Validation', 'Pagination', 'Error format'],
      },
      {
        title: 'Auth & Security',
        description: 'Secure the API and its users.',
        topics: ['JWT', 'OAuth basics', 'Hashing', 'CORS', 'OWASP top 10'],
      },
      {
        title: 'Performance',
        description: 'Keep the server fast under load.',
        topics: ['Caching', 'Queues', 'Connection pooling', 'Rate limiting', 'Load testing'],
      },
      {
        title: 'Deploy & Monitor',
        description: 'Ship and observe the service.',
        topics: ['Docker', 'Cloud hosting', 'Logs & metrics', 'Health checks', 'CI/CD'],
      },
    ],
  },
  {
    id: 'android',
    title: 'Android Development',
    icon: 'phone-portrait-outline',
    color: '#34D399',
    level: 'Beginner',
    duration: '4–6 months',
    description:
      'Build native Android apps with Kotlin and Jetpack Compose.',
    aliases: ['android', 'kotlin', 'mobile app', 'android studio', 'jetpack compose'],
    stages: [
      {
        title: 'Kotlin Basics',
        description: 'Learn the language used for modern Android.',
        topics: ['Variables & types', 'Control flow', 'Functions', 'Classes & objects', 'Null safety'],
      },
      {
        title: 'Android Fundamentals',
        description: 'Understand the project and app lifecycle.',
        topics: ['Android Studio', 'Project structure', 'Activities', 'Manifest', 'Resources'],
        resources: [{ label: 'Android Developer Guides', url: 'https://developer.android.com/guide' }],
      },
      {
        title: 'UI with Jetpack Compose',
        description: 'Build screens declaratively.',
        topics: ['Composables', 'Layouts', 'Modifiers', 'Lists', 'Theming'],
        resources: [{ label: 'Jetpack Compose Tutorial', url: 'https://developer.android.com/jetpack/compose/tutorial' }],
      },
      {
        title: 'State & Navigation',
        description: 'Manage app data and move between screens.',
        topics: ['State hoisting', 'ViewModel', 'Navigation Compose', 'Arguments', 'Back stack'],
      },
      {
        title: 'Data & Networking',
        description: 'Fetch and store data.',
        topics: ['Retrofit', 'JSON parsing', 'Room database', 'Coroutines', 'Error handling'],
      },
      {
        title: 'Device Features',
        description: 'Use the capabilities of the phone.',
        topics: ['Permissions', 'Camera', 'Notifications', 'Background work', 'Storage'],
      },
      {
        title: 'Publish',
        description: 'Prepare and release the app.',
        topics: ['Signing', 'App icons', 'Play Console', 'Store listing', 'Testing tracks'],
      },
    ],
  },
  {
    id: 'react-native',
    title: 'React Native / Expo',
    icon: 'phone-portrait-outline',
    color: '#22D3EE',
    level: 'Intermediate',
    duration: '3–5 months',
    description:
      'Build cross-platform mobile apps for Android and iOS using React.',
    aliases: ['react native', 'reactnative', 'expo', 'cross platform', 'mobile'],
    stages: [
      {
        title: 'React Fundamentals',
        description: 'Components, props, state and hooks.',
        topics: ['JSX', 'Components', 'Props & state', 'Hooks', 'Lists & keys'],
        resources: [{ label: 'React Native Docs', url: 'https://reactnative.dev/docs/getting-started' }],
      },
      {
        title: 'React Native Basics',
        description: 'Core building blocks for mobile.',
        topics: ['View & Text', 'TextInput', 'Pressable', 'Image', 'FlatList'],
      },
      {
        title: 'Layout & Styling',
        description: 'Design responsive mobile screens.',
        topics: ['Flexbox', 'Dimensions', 'Safe areas', 'Platform differences', 'Theming'],
      },
      {
        title: 'Navigation',
        description: 'Move between screens and stacks.',
        topics: ['Expo Router', 'Stack navigation', 'Tabs', 'Route params', 'Deep links'],
        resources: [{ label: 'Expo Router Docs', url: 'https://docs.expo.dev/router/introduction/' }],
      },
      {
        title: 'Data & State',
        description: 'Connect to APIs and persist data.',
        topics: ['Fetch & axios', 'AsyncStorage', 'Context', 'Loading & error states', 'Offline handling'],
      },
      {
        title: 'Device & Native APIs',
        description: 'Access phone capabilities.',
        topics: ['Permissions', 'Camera', 'Notifications', 'Linking', 'App config'],
      },
      {
        title: 'Build & Release',
        description: 'Ship to the Play Store and App Store.',
        topics: ['EAS Build', 'App icons & splash', 'Versioning', 'Store listings', 'OTA updates'],
      },
    ],
  },
  {
    id: 'flutter',
    title: 'Flutter Development',
    icon: 'phone-portrait-outline',
    color: '#38BDF8',
    level: 'Beginner',
    duration: '3–5 months',
    description:
      'Create beautiful cross-platform apps with Flutter and Dart.',
    aliases: ['flutter', 'dart', 'cross platform mobile'],
    stages: [
      {
        title: 'Dart Basics',
        description: 'Learn the language behind Flutter.',
        topics: ['Variables & types', 'Control flow', 'Functions', 'Classes', 'Async / await'],
      },
      {
        title: 'Flutter Setup',
        description: 'Install the SDK and run your first app.',
        topics: ['Flutter SDK', 'Android Studio / VS Code', 'Emulators', 'Project structure'],
        resources: [{ label: 'Flutter Docs', url: 'https://docs.flutter.dev/get-started/install' }],
      },
      {
        title: 'Widgets & Layout',
        description: 'Compose UI from widgets.',
        topics: ['Stateless & stateful widgets', 'Rows & columns', 'Stack', 'Scrolling', 'Theming'],
      },
      {
        title: 'State Management',
        description: 'Keep the UI in sync with data.',
        topics: ['setState', 'Provider', 'Riverpod / Bloc', 'Forms & validation'],
      },
      {
        title: 'Navigation & Storage',
        description: 'Move between screens and persist data.',
        topics: ['Navigator', 'Named routes', 'Shared preferences', 'SQLite', 'Secure storage'],
      },
      {
        title: 'Networking',
        description: 'Fetch and display remote data.',
        topics: ['http package', 'JSON models', 'Error handling', 'Images & caching'],
      },
      {
        title: 'Build & Release',
        description: 'Publish to app stores.',
        topics: ['App signing', 'Release builds', 'Store listings', 'Testing'],
      },
    ],
  },
  {
    id: 'python',
    title: 'Python Programming',
    icon: 'code-slash-outline',
    color: '#FBBF24',
    level: 'Beginner',
    duration: '2–4 months',
    description:
      'Learn Python from scratch and use it for scripting, data and automation.',
    aliases: ['python', 'python3', 'scripting', 'automation'],
    stages: [
      {
        title: 'Getting Started',
        description: 'Install Python and write your first program.',
        topics: ['Install & setup', 'Variables', 'Input / output', 'Comments', 'Running scripts'],
        resources: [{ label: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial/' }],
      },
      {
        title: 'Core Syntax',
        description: 'Control the flow of a program.',
        topics: ['Numbers & strings', 'Lists & tuples', 'Dictionaries & sets', 'if/else', 'Loops'],
      },
      {
        title: 'Functions & Modules',
        description: 'Organize reusable code.',
        topics: ['Functions', 'Arguments', 'Scope', 'Importing modules', 'Virtual environments'],
      },
      {
        title: 'Object Oriented Python',
        description: 'Model real-world concepts with classes.',
        topics: ['Classes & objects', 'Inheritance', 'Magic methods', 'Dataclasses', 'Composition'],
      },
      {
        title: 'Files & Errors',
        description: 'Work with data and handle failures.',
        topics: ['File I/O', 'CSV & JSON', 'Exceptions', 'Context managers', 'Logging'],
      },
      {
        title: 'Libraries',
        description: 'Use the ecosystem to move faster.',
        topics: ['pip', 'requests', 'datetime', 'pathlib', 'Third-party packages'],
      },
      {
        title: 'Mini Projects',
        description: 'Practice with real scripts.',
        topics: ['File organizer', 'Web scraper', 'CLI tool', 'Data report', 'Automation script'],
      },
    ],
  },
  {
    id: 'java',
    title: 'Java Programming',
    icon: 'code-slash-outline',
    color: '#F97316',
    level: 'Beginner',
    duration: '3–5 months',
    description:
      'Learn object-oriented programming with Java and build backend skills.',
    aliases: ['java', 'jvm', 'oop', 'spring', 'spring boot'],
    stages: [
      {
        title: 'Getting Started',
        description: 'Set up the JDK and run Java code.',
        topics: ['JDK & JRE', 'IDE setup', 'Hello World', 'Variables', 'Data types'],
        resources: [{ label: 'Java Tutorial — Oracle', url: 'https://docs.oracle.com/javase/tutorial/' }],
      },
      {
        title: 'Control Flow',
        description: 'Write logic and loops.',
        topics: ['Operators', 'if/else & switch', 'Loops', 'Arrays', 'Methods'],
      },
      {
        title: 'Object Oriented Java',
        description: 'The core of Java development.',
        topics: ['Classes & objects', 'Inheritance', 'Interfaces', 'Polymorphism', 'Encapsulation'],
      },
      {
        title: 'Collections & Generics',
        description: 'Work with groups of data.',
        topics: ['List & Set', 'Map', 'Generics', 'Iterators', 'Streams'],
      },
      {
        title: 'Exceptions & I/O',
        description: 'Handle errors and files.',
        topics: ['try/catch', 'Custom exceptions', 'File I/O', 'Serialization', 'NIO'],
      },
      {
        title: 'Concurrency',
        description: 'Run work in parallel safely.',
        topics: ['Threads', 'Runnable', 'Executors', 'Synchronization', 'CompletableFuture'],
      },
      {
        title: 'Build & Spring Boot',
        description: 'Create a real backend service.',
        topics: ['Maven / Gradle', 'Spring Boot', 'REST controllers', 'JPA', 'Testing'],
      },
    ],
  },
  {
    id: 'cpp',
    title: 'C++ Programming',
    icon: 'code-outline',
    color: '#60A5FA',
    level: 'Beginner',
    duration: '3–5 months',
    description:
      'Master C++ for problem solving, competitive programming and systems work.',
    aliases: ['c++', 'cpp', 'c plus plus', 'stl'],
    stages: [
      {
        title: 'Getting Started',
        description: 'Compile and run C++ programs.',
        topics: ['Compiler setup', 'First program', 'Variables', 'Data types', 'Input / output'],
        resources: [{ label: 'Learn C++', url: 'https://www.learncpp.com/' }],
      },
      {
        title: 'Control Flow & Functions',
        description: 'Write reusable logic.',
        topics: ['if/else', 'Loops', 'Functions', 'Parameters', 'Recursion'],
      },
      {
        title: 'Arrays, Strings & Pointers',
        description: 'Understand memory and data.',
        topics: ['Arrays', 'C-strings', 'std::string', 'Pointers', 'References'],
      },
      {
        title: 'Object Oriented C++',
        description: 'Design with classes.',
        topics: ['Classes', 'Constructors', 'Inheritance', 'Virtual functions', 'Operator overloading'],
      },
      {
        title: 'STL',
        description: 'Use the standard library effectively.',
        topics: ['vector', 'map & set', 'algorithms', 'Iterators', 'Pairs & tuples'],
      },
      {
        title: 'Memory Management',
        description: 'Write safe and efficient code.',
        topics: ['Stack vs heap', 'new / delete', 'Smart pointers', 'RAII', 'Move semantics'],
      },
      {
        title: 'Projects & Practice',
        description: 'Apply your skills.',
        topics: ['DSA problems', 'Small games', 'File tools', 'Debugging', 'Optimization'],
      },
    ],
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    icon: 'git-branch-outline',
    color: '#A78BFA',
    level: 'Beginner',
    duration: '3–6 months',
    description:
      'Crack coding interviews and placements with strong DSA fundamentals.',
    aliases: ['dsa', 'data structures', 'algorithms', 'placement prep', 'interview prep'],
    stages: [
      {
        title: 'Complexity Analysis',
        description: 'Measure how fast and memory-friendly code is.',
        topics: ['Big O', 'Time complexity', 'Space complexity', 'Best / average / worst case'],
        resources: [{ label: 'DSA Roadmap', url: 'https://roadmap.sh/datastructures-and-algorithms' }],
      },
      {
        title: 'Arrays & Strings',
        description: 'Core techniques on linear data.',
        topics: ['Traversal', 'Two pointers', 'Sliding window', 'Prefix sums', 'String manipulation'],
      },
      {
        title: 'Linked Lists, Stacks & Queues',
        description: 'Pointer-based and LIFO/FIFO structures.',
        topics: ['Singly & doubly linked lists', 'Stacks', 'Queues', 'Deque', 'Monotonic stack'],
      },
      {
        title: 'Hashing',
        description: 'Fast lookups and frequency counting.',
        topics: ['Hash maps', 'Hash sets', 'Collision handling', 'Frequency problems'],
      },
      {
        title: 'Trees & BST',
        description: 'Hierarchical data and recursion.',
        topics: ['Binary trees', 'Traversals', 'BST operations', 'Heaps', 'Tries'],
      },
      {
        title: 'Graphs',
        description: 'Model networks and relationships.',
        topics: ['Representations', 'BFS & DFS', 'Topological sort', 'Shortest paths', 'Union find'],
      },
      {
        title: 'Sorting, Searching & DP',
        description: 'Advanced problem-solving patterns.',
        topics: ['Sorting algorithms', 'Binary search', 'Recursion & backtracking', 'Dynamic programming', 'Greedy'],
      },
      {
        title: 'Practice Plan',
        description: 'Turn knowledge into interview performance.',
        topics: ['Daily problems', 'Pattern notes', 'Mock interviews', 'Contest practice', 'Revision'],
      },
    ],
  },
  {
    id: 'competitive-programming',
    title: 'Competitive Programming',
    icon: 'trophy-outline',
    color: '#F59E0B',
    level: 'Intermediate',
    duration: '6–12 months',
    description:
      'Sharpen problem solving and speed for contests like Codeforces and ICPC.',
    aliases: ['cp', 'competitive coding', 'codeforces', 'icpc', 'contests'],
    stages: [
      {
        title: 'Language & Fast I/O',
        description: 'Get comfortable with fast implementations.',
        topics: ['C++ / Java', 'Fast input', 'STL / collections', 'Templates', 'Debugging'],
      },
      {
        title: 'Math & Number Theory',
        description: 'The math behind many problems.',
        topics: ['Modular arithmetic', 'GCD & LCM', 'Primes & sieve', 'Combinatorics', 'Bit manipulation'],
      },
      {
        title: 'Greedy & Sorting',
        description: 'Solve optimization problems.',
        topics: ['Greedy choice', 'Exchange argument', 'Sorting by keys', 'Custom comparators'],
      },
      {
        title: 'Binary Search',
        description: 'Search efficiently on answers and arrays.',
        topics: ['Lower / upper bound', 'Predicate search', 'Search on answer', 'Rotated arrays'],
      },
      {
        title: 'Prefix Sums & Two Pointers',
        description: 'Linear-time range techniques.',
        topics: ['Prefix arrays', 'Difference arrays', 'Two pointers', 'Sliding window'],
      },
      {
        title: 'Graphs & Trees',
        description: 'Traverse and query structures.',
        topics: ['BFS & DFS', 'DSU', 'Shortest paths', 'LCA', 'Segment trees'],
      },
      {
        title: 'Dynamic Programming',
        description: 'Break hard problems into states.',
        topics: ['Memoization', 'Tabulation', 'Knapsack', 'LIS', 'Bitmask DP'],
      },
      {
        title: 'Contest Routine',
        description: 'Improve rating consistently.',
        topics: ['Weekly contests', 'Upsolving', 'Editorials', 'Weak-topic review', 'Team practice'],
      },
    ],
  },
  {
    id: 'data-science',
    title: 'Data Science',
    icon: 'analytics-outline',
    color: '#F472B6',
    level: 'Beginner',
    duration: '5–8 months',
    description:
      'Turn raw data into insights with Python, statistics and machine learning.',
    aliases: ['data science', 'data scientist', 'pandas', 'numpy', 'eda'],
    stages: [
      {
        title: 'Python for Data',
        description: 'Learn the language and notebooks.',
        topics: ['Python basics', 'Jupyter', 'NumPy', 'Pandas', 'Virtual environments'],
        resources: [{ label: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' }],
      },
      {
        title: 'Math & Statistics',
        description: 'Understand data and uncertainty.',
        topics: ['Descriptive statistics', 'Probability', 'Distributions', 'Hypothesis testing', 'Correlation'],
      },
      {
        title: 'Data Wrangling',
        description: 'Clean and shape real datasets.',
        topics: ['Missing values', 'Filtering & grouping', 'Joins', 'Feature scaling', 'Encoding'],
      },
      {
        title: 'Visualization',
        description: 'Communicate findings clearly.',
        topics: ['Matplotlib', 'Seaborn', 'Chart selection', 'Storytelling', 'Dashboards'],
      },
      {
        title: 'SQL',
        description: 'Query data from databases.',
        topics: ['SELECT', 'Joins', 'Aggregations', 'Subqueries', 'Window functions'],
      },
      {
        title: 'Machine Learning Basics',
        description: 'Build your first predictive models.',
        topics: ['Train / test split', 'Regression', 'Classification', 'Model evaluation', 'Scikit-learn'],
      },
      {
        title: 'Capstone Project',
        description: 'Showcase an end-to-end analysis.',
        topics: ['Problem framing', 'EDA', 'Modeling', 'Insights', 'Presentation'],
      },
    ],
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning / AI',
    icon: 'hardware-chip-outline',
    color: '#8B5CF6',
    level: 'Intermediate',
    duration: '6–9 months',
    description:
      'Learn how machines learn and build intelligent applications.',
    aliases: ['ml', 'ai', 'artificial intelligence', 'machine learning', 'scikit learn'],
    stages: [
      {
        title: 'Python & Math',
        description: 'Build the required foundation.',
        topics: ['Python', 'NumPy & Pandas', 'Linear algebra', 'Probability', 'Calculus basics'],
      },
      {
        title: 'Data Preprocessing',
        description: 'Prepare data for models.',
        topics: ['Cleaning', 'Feature scaling', 'Encoding', 'Train / validation / test', 'Data leakage'],
      },
      {
        title: 'Supervised Learning',
        description: 'Learn from labelled data.',
        topics: ['Linear regression', 'Logistic regression', 'Decision trees', 'Random forest', 'SVM'],
        resources: [{ label: 'Machine Learning Roadmap', url: 'https://roadmap.sh/machine-learning' }],
      },
      {
        title: 'Unsupervised Learning',
        description: 'Find structure without labels.',
        topics: ['K-means', 'Hierarchical clustering', 'PCA', 'Anomaly detection'],
      },
      {
        title: 'Model Evaluation',
        description: 'Measure and improve performance.',
        topics: ['Confusion matrix', 'Precision & recall', 'ROC-AUC', 'Cross validation', 'Overfitting'],
      },
      {
        title: 'Feature Engineering',
        description: 'Help models learn better.',
        topics: ['Feature selection', 'Creation', 'Binning', 'Text features', 'Pipeline'],
      },
      {
        title: 'Deployment',
        description: 'Put models into production.',
        topics: ['Model serialization', 'FastAPI / Flask', 'Docker', 'Monitoring', 'MLOps basics'],
      },
    ],
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    icon: 'git-network-outline',
    color: '#EC4899',
    level: 'Advanced',
    duration: '6–9 months',
    description:
      'Build neural networks for vision and language with PyTorch or TensorFlow.',
    aliases: ['deep learning', 'neural networks', 'pytorch', 'tensorflow', 'cnn', 'transformers'],
    stages: [
      {
        title: 'ML Foundations',
        description: 'Make sure the basics are solid.',
        topics: ['Linear / logistic regression', 'Loss functions', 'Gradient descent', 'Evaluation metrics'],
      },
      {
        title: 'Neural Networks',
        description: 'Understand the building blocks.',
        topics: ['Perceptrons', 'Activation functions', 'Forward propagation', 'Backpropagation', 'Weight init'],
      },
      {
        title: 'Training & Optimization',
        description: 'Make networks learn reliably.',
        topics: ['Optimizers', 'Learning rate', 'Regularization', 'Batch normalization', 'Dropout'],
      },
      {
        title: 'Computer Vision',
        description: 'Work with images.',
        topics: ['CNNs', 'Pooling', 'Data augmentation', 'Transfer learning', 'Object detection'],
      },
      {
        title: 'NLP & Transformers',
        description: 'Work with text and sequences.',
        topics: ['RNNs & LSTMs', 'Embeddings', 'Attention', 'Transformers', 'Hugging Face'],
      },
      {
        title: 'Frameworks',
        description: 'Build models with real tools.',
        topics: ['PyTorch', 'TensorFlow', 'GPU training', 'Experiment tracking', 'Datasets'],
      },
      {
        title: 'Deployment & MLOps',
        description: 'Serve and maintain models.',
        topics: ['Model export', 'Inference APIs', 'Docker', 'Monitoring', 'CI/CD for ML'],
      },
    ],
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    icon: 'bar-chart-outline',
    color: '#FB923C',
    level: 'Beginner',
    duration: '3–5 months',
    description:
      'Analyze business data with Excel, SQL, Power BI and Tableau.',
    aliases: ['data analytics', 'business analyst', 'excel', 'power bi', 'tableau'],
    stages: [
      {
        title: 'Excel Basics',
        description: 'Start with spreadsheets.',
        topics: ['Formulas', 'Pivot tables', 'VLOOKUP / XLOOKUP', 'Charts', 'Data cleaning'],
      },
      {
        title: 'SQL for Analysts',
        description: 'Query real business data.',
        topics: ['SELECT & WHERE', 'Joins', 'GROUP BY', 'Subqueries', 'Window functions'],
      },
      {
        title: 'Statistics',
        description: 'Interpret data correctly.',
        topics: ['Mean & median', 'Variability', 'Distributions', 'Sampling', 'A/B testing'],
      },
      {
        title: 'Data Cleaning',
        description: 'Make datasets trustworthy.',
        topics: ['Duplicates', 'Missing values', 'Outliers', 'Data types', 'Validation'],
      },
      {
        title: 'Visualization',
        description: 'Build clear visuals.',
        topics: ['Power BI', 'Tableau', 'Chart selection', 'Filters', 'Data modeling'],
      },
      {
        title: 'Dashboards & Storytelling',
        description: 'Turn analysis into decisions.',
        topics: ['KPI dashboards', 'Layout', 'Insights', 'Audience', 'Presentation'],
      },
      {
        title: 'Portfolio',
        description: 'Prove your skills with projects.',
        topics: ['Business dataset', 'SQL analysis', 'Dashboard', 'Write-up', 'GitHub'],
      },
    ],
  },
  {
    id: 'sql',
    title: 'SQL & Databases',
    icon: 'server-outline',
    color: '#2DD4BF',
    level: 'Beginner',
    duration: '1–2 months',
    description:
      'Query, design and optimize relational databases with SQL.',
    aliases: ['sql', 'database', 'dbms', 'mysql', 'postgres', 'postgresql'],
    stages: [
      {
        title: 'Relational Model',
        description: 'Understand tables, keys and relations.',
        topics: ['Tables & rows', 'Primary keys', 'Foreign keys', 'Relationships', 'ER diagrams'],
      },
      {
        title: 'Basic Queries',
        description: 'Read data from tables.',
        topics: ['SELECT', 'WHERE', 'ORDER BY', 'LIMIT', 'DISTINCT'],
        resources: [{ label: 'SQLBolt', url: 'https://sqlbolt.com/' }],
      },
      {
        title: 'Joins',
        description: 'Combine data across tables.',
        topics: ['INNER JOIN', 'LEFT / RIGHT JOIN', 'FULL JOIN', 'Self join', 'Join conditions'],
      },
      {
        title: 'Aggregation',
        description: 'Summarize data.',
        topics: ['COUNT / SUM / AVG', 'GROUP BY', 'HAVING', 'Window functions'],
      },
      {
        title: 'Advanced Queries',
        description: 'Solve complex questions.',
        topics: ['Subqueries', 'CTEs', 'CASE', 'Views', 'Set operations'],
      },
      {
        title: 'Design & Performance',
        description: 'Build fast, reliable schemas.',
        topics: ['Normalization', 'Indexes', 'Constraints', 'Query plans', 'Transactions'],
      },
      {
        title: 'Practice',
        description: 'Build query confidence.',
        topics: ['LeetCode SQL', 'HackerRank', 'Real datasets', 'Query review', 'Optimization'],
      },
    ],
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security',
    icon: 'shield-checkmark-outline',
    color: '#EF4444',
    level: 'Beginner',
    duration: '5–8 months',
    description:
      'Protect systems, networks and applications from attacks.',
    aliases: ['cyber security', 'cybersecurity', 'infosec', 'security', 'soc'],
    stages: [
      {
        title: 'Networking Basics',
        description: 'Understand how systems communicate.',
        topics: ['OSI & TCP/IP', 'IP addressing', 'DNS & HTTP', 'Firewalls', 'Subnets'],
      },
      {
        title: 'Operating Systems & Linux',
        description: 'Work comfortably on servers.',
        topics: ['Linux commands', 'File permissions', 'Processes', 'Bash scripting', 'Users & groups'],
      },
      {
        title: 'Security Fundamentals',
        description: 'Learn the core principles.',
        topics: ['CIA triad', 'Threat models', 'Risk', 'Authentication', 'Least privilege'],
        resources: [{ label: 'Cyber Security Roadmap', url: 'https://roadmap.sh/cyber-security' }],
      },
      {
        title: 'Web Security',
        description: 'Secure web applications.',
        topics: ['OWASP Top 10', 'XSS', 'SQL injection', 'CSRF', 'Secure headers'],
      },
      {
        title: 'Cryptography',
        description: 'Protect data with math.',
        topics: ['Symmetric encryption', 'Asymmetric encryption', 'Hashing', 'TLS', 'Certificates'],
      },
      {
        title: 'Tools & Labs',
        description: 'Practice in safe environments.',
        topics: ['Wireshark', 'Nmap', 'Burp Suite', 'SIEM basics', 'TryHackMe'],
      },
      {
        title: 'Career Path',
        description: 'Choose a specialization.',
        topics: ['Blue team / SOC', 'Red team', 'GRC', 'Certifications', 'Home lab'],
      },
    ],
  },
  {
    id: 'ethical-hacking',
    title: 'Ethical Hacking',
    icon: 'bug-outline',
    color: '#DC2626',
    level: 'Intermediate',
    duration: '6–10 months',
    description:
      'Learn penetration testing to find and fix security weaknesses legally.',
    aliases: ['ethical hacking', 'penetration testing', 'pentest', 'hacking', 'red team'],
    stages: [
      {
        title: 'Networking & Linux',
        description: 'Build the necessary base.',
        topics: ['TCP/IP', 'Ports & protocols', 'Linux CLI', 'Bash', 'Virtual labs'],
      },
      {
        title: 'Reconnaissance',
        description: 'Gather information about a target.',
        topics: ['OSINT', 'DNS enumeration', 'Subdomain discovery', 'Google dorking', 'Footprinting'],
      },
      {
        title: 'Scanning & Enumeration',
        description: 'Map the attack surface.',
        topics: ['Nmap', 'Service detection', 'Vulnerability scanning', 'SMB / HTTP enumeration'],
      },
      {
        title: 'Exploitation Basics',
        description: 'Understand how vulnerabilities are used.',
        topics: ['Metasploit', 'Payloads', 'Privilege escalation', 'Password attacks', 'Reverse shells'],
      },
      {
        title: 'Web App Pentesting',
        description: 'Test web applications.',
        topics: ['Burp Suite', 'SQLi', 'XSS', 'Authentication flaws', 'API security'],
      },
      {
        title: 'Reporting',
        description: 'Communicate findings professionally.',
        topics: ['CVSS scoring', 'Evidence', 'Impact', 'Remediation', 'Report writing'],
      },
      {
        title: 'Legal & Labs',
        description: 'Practice ethically and legally.',
        topics: ['Rules of engagement', 'TryHackMe', 'Hack The Box', 'CTFs', 'Certifications'],
      },
    ],
  },
  {
    id: 'cloud-aws',
    title: 'Cloud Computing (AWS)',
    icon: 'cloud-outline',
    color: '#0EA5E9',
    level: 'Intermediate',
    duration: '4–6 months',
    description:
      'Deploy and manage applications on AWS and other cloud platforms.',
    aliases: ['cloud', 'cloud computing', 'aws', 'azure', 'gcp', 'amazon web services'],
    stages: [
      {
        title: 'Cloud Concepts',
        description: 'Understand the cloud model.',
        topics: ['IaaS / PaaS / SaaS', 'Regions & zones', 'Shared responsibility', 'Pricing', 'Well-architected'],
      },
      {
        title: 'AWS Core Services',
        description: 'Use the essential building blocks.',
        topics: ['EC2', 'S3', 'IAM', 'VPC basics', 'Lambda'],
        resources: [{ label: 'AWS Skill Builder', url: 'https://skillbuilder.aws/' }],
      },
      {
        title: 'Networking',
        description: 'Design secure cloud networks.',
        topics: ['VPC', 'Subnets', 'Route tables', 'Security groups', 'Load balancers'],
      },
      {
        title: 'Databases & Storage',
        description: 'Store application data.',
        topics: ['RDS', 'DynamoDB', 'EBS & EFS', 'Backups', 'Lifecycle policies'],
      },
      {
        title: 'Security & Monitoring',
        description: 'Operate safely.',
        topics: ['IAM policies', 'CloudTrail', 'CloudWatch', 'Encryption', 'Least privilege'],
      },
      {
        title: 'Infrastructure as Code',
        description: 'Automate infrastructure.',
        topics: ['CloudFormation', 'Terraform basics', 'Templates', 'Environments', 'CI/CD'],
      },
      {
        title: 'Certification Prep',
        description: 'Validate your skills.',
        topics: ['Solutions Architect', 'Practice exams', 'Hands-on labs', 'Cost optimization'],
      },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps Engineering',
    icon: 'infinite-outline',
    color: '#F59E0B',
    level: 'Intermediate',
    duration: '5–8 months',
    description:
      'Automate building, testing and deploying software with Docker, Kubernetes and CI/CD.',
    aliases: ['devops', 'ci cd', 'docker', 'kubernetes', 'terraform', 'sre'],
    stages: [
      {
        title: 'Linux & Networking',
        description: 'The base for every DevOps role.',
        topics: ['Linux CLI', 'Processes & services', 'Networking', 'SSH', 'Bash scripting'],
      },
      {
        title: 'Git & Scripting',
        description: 'Automate repetitive work.',
        topics: ['Git workflows', 'Python / Bash', 'APIs', 'YAML', 'Configuration'],
      },
      {
        title: 'Containers',
        description: 'Package applications consistently.',
        topics: ['Docker', 'Dockerfiles', 'Images & registries', 'Volumes', 'Compose'],
        resources: [{ label: 'DevOps Roadmap', url: 'https://roadmap.sh/devops' }],
      },
      {
        title: 'CI/CD',
        description: 'Automate the software pipeline.',
        topics: ['GitHub Actions', 'Build & test', 'Artifacts', 'Environments', 'Secrets'],
      },
      {
        title: 'Kubernetes',
        description: 'Orchestrate containers at scale.',
        topics: ['Pods', 'Deployments', 'Services', 'ConfigMaps & Secrets', 'Helm'],
      },
      {
        title: 'Cloud & IaC',
        description: 'Provision infrastructure with code.',
        topics: ['AWS / Azure / GCP', 'Terraform', 'Ansible', 'Networking', 'Costs'],
      },
      {
        title: 'Monitoring & Reliability',
        description: 'Keep systems healthy.',
        topics: ['Prometheus', 'Grafana', 'Logs', 'Alerting', 'Incident response'],
      },
    ],
  },
  {
    id: 'ui-ux',
    title: 'UI / UX Design',
    icon: 'color-palette-outline',
    color: '#F472B6',
    level: 'Beginner',
    duration: '3–5 months',
    description:
      'Design usable, beautiful digital products from research to prototype.',
    aliases: ['ui', 'ux', 'ui ux', 'design', 'figma', 'product design'],
    stages: [
      {
        title: 'Design Thinking',
        description: 'Start with the user and the problem.',
        topics: ['Empathy', 'Problem framing', 'Ideation', 'Journey maps', 'Design process'],
      },
      {
        title: 'User Research',
        description: 'Understand real user needs.',
        topics: ['Interviews', 'Surveys', 'Personas', 'Competitive analysis', 'Insights'],
      },
      {
        title: 'Wireframing',
        description: 'Sketch structure before visuals.',
        topics: ['User flows', 'Information architecture', 'Low-fi wireframes', 'Paper prototypes'],
      },
      {
        title: 'UI Principles',
        description: 'Make interfaces clear and attractive.',
        topics: ['Typography', 'Color', 'Spacing', 'Hierarchy', 'Accessibility'],
      },
      {
        title: 'Figma',
        description: 'Learn the industry design tool.',
        topics: ['Frames & components', 'Auto layout', 'Variants', 'Styles', 'Plugins'],
        resources: [{ label: 'Figma Learn', url: 'https://help.figma.com/hc/en-us/categories/360002051613' }],
      },
      {
        title: 'Prototyping & Testing',
        description: 'Validate designs with users.',
        topics: ['Interactive prototypes', 'Usability tests', 'Feedback', 'Iteration'],
      },
      {
        title: 'Portfolio',
        description: 'Show your design process.',
        topics: ['Case studies', 'Before / after', 'Behance / Dribbble', 'Personal site', 'Presentation'],
      },
    ],
  },
  {
    id: 'blockchain',
    title: 'Blockchain & Web3',
    icon: 'cube-outline',
    color: '#A855F7',
    level: 'Intermediate',
    duration: '5–8 months',
    description:
      'Build decentralized applications and smart contracts on Ethereum.',
    aliases: ['blockchain', 'web3', 'solidity', 'ethereum', 'smart contracts', 'crypto'],
    stages: [
      {
        title: 'Blockchain Basics',
        description: 'Understand how blockchains work.',
        topics: ['Blocks & hashes', 'Distributed ledgers', 'Wallets', 'Transactions', 'Public vs private chains'],
      },
      {
        title: 'Cryptography & Consensus',
        description: 'The security foundation.',
        topics: ['Hashing', 'Public / private keys', 'Signatures', 'Proof of work / stake', 'Merkle trees'],
      },
      {
        title: 'Ethereum & Smart Contracts',
        description: 'Program on the blockchain.',
        topics: ['EVM', 'Gas', 'Accounts', 'Contracts', 'Events'],
        resources: [{ label: 'Ethereum Developer Docs', url: 'https://ethereum.org/en/developers/' }],
      },
      {
        title: 'Solidity',
        description: 'Write smart contracts.',
        topics: ['Syntax', 'State & functions', 'Modifiers', 'Inheritance', 'Testing'],
      },
      {
        title: 'dApps & Web3',
        description: 'Connect frontends to contracts.',
        topics: ['ethers.js', 'Wallets', 'Contract calls', 'IPFS', 'The Graph'],
      },
      {
        title: 'Security',
        description: 'Avoid costly smart contract bugs.',
        topics: ['Reentrancy', 'Access control', 'Auditing', 'Common exploits', 'Best practices'],
      },
      {
        title: 'Deploy & Build',
        description: 'Launch on testnets and mainnet.',
        topics: ['Hardhat / Foundry', 'Testnets', 'Deployment', 'Verification', 'Projects'],
      },
    ],
  },
  {
    id: 'game-dev',
    title: 'Game Development',
    icon: 'game-controller-outline',
    color: '#8B5CF6',
    level: 'Intermediate',
    duration: '5–8 months',
    description:
      'Create 2D and 3D games with Unity or Unreal Engine.',
    aliases: ['game development', 'gamedev', 'unity', 'unreal', 'game design'],
    stages: [
      {
        title: 'Programming Foundations',
        description: 'Learn to code game logic.',
        topics: ['C# / C++', 'Variables & loops', 'Functions', 'OOP', 'Debugging'],
      },
      {
        title: 'Game Math & Physics',
        description: 'Understand movement and collisions.',
        topics: ['Vectors', 'Transforms', 'Forces', 'Collisions', 'Raycasting'],
      },
      {
        title: 'Game Engine',
        description: 'Pick Unity or Unreal and learn it.',
        topics: ['Editor', 'GameObjects / Actors', 'Scene management', 'Prefabs', 'Scripting'],
        resources: [{ label: 'Unity Learn', url: 'https://learn.unity.com/' }],
      },
      {
        title: 'Game Design',
        description: 'Make the game fun.',
        topics: ['Core loop', 'Level design', 'Difficulty', 'Game feel', 'Playtesting'],
      },
      {
        title: 'Assets & Animation',
        description: 'Bring the game to life.',
        topics: ['Sprites & models', 'Animation', 'Particles', 'Audio', 'UI'],
      },
      {
        title: 'Multiplayer & Performance',
        description: 'Polish and scale.',
        topics: ['Networking basics', 'Optimization', 'Object pooling', 'Profiling', 'Save systems'],
      },
      {
        title: 'Publish',
        description: 'Release your game.',
        topics: ['Builds', 'Play Store / Steam', 'Store page', 'Trailer', 'Marketing basics'],
      },
    ],
  },
  {
    id: 'system-design',
    title: 'System Design',
    icon: 'git-network-outline',
    color: '#3B82F6',
    level: 'Advanced',
    duration: '4–6 months',
    description:
      'Design scalable, reliable systems for interviews and real projects.',
    aliases: ['system design', 'architecture', 'scalability', 'hld', 'distributed systems'],
    stages: [
      {
        title: 'Fundamentals',
        description: 'Core ideas behind large systems.',
        topics: ['Scalability', 'Latency vs throughput', 'Availability', 'CAP theorem', 'Trade-offs'],
        resources: [{ label: 'System Design Roadmap', url: 'https://roadmap.sh/system-design' }],
      },
      {
        title: 'Networking & APIs',
        description: 'How services talk to each other.',
        topics: ['HTTP & REST', 'gRPC', 'WebSockets', 'Load balancers', 'API gateways'],
      },
      {
        title: 'Databases & Storage',
        description: 'Choose the right persistence layer.',
        topics: ['SQL vs NoSQL', 'Sharding', 'Replication', 'Indexes', 'Object storage'],
      },
      {
        title: 'Caching & Queues',
        description: 'Speed up and decouple systems.',
        topics: ['Redis', 'Cache patterns', 'Message queues', 'Kafka', 'Rate limiting'],
      },
      {
        title: 'Scalability Patterns',
        description: 'Grow without breaking.',
        topics: ['Horizontal scaling', 'Partitioning', 'Consistent hashing', 'CDNs', 'Stateless services'],
      },
      {
        title: 'Reliability',
        description: 'Design for failure.',
        topics: ['Redundancy', 'Circuit breakers', 'Retries', 'Monitoring', 'Disaster recovery'],
      },
      {
        title: 'Case Studies',
        description: 'Practice real interview problems.',
        topics: ['URL shortener', 'Chat app', 'News feed', 'E-commerce', 'Video streaming'],
      },
    ],
  },
  {
    id: 'iot',
    title: 'Internet of Things (IoT)',
    icon: 'hardware-chip-outline',
    color: '#10B981',
    level: 'Intermediate',
    duration: '4–6 months',
    description:
      'Connect sensors and devices to the internet with Arduino and ESP32.',
    aliases: ['iot', 'internet of things', 'embedded', 'arduino', 'esp32', 'raspberry pi'],
    stages: [
      {
        title: 'Electronics Basics',
        description: 'Understand circuits and components.',
        topics: ['Voltage & current', 'Resistors', 'Breadboarding', 'Sensors', 'Multimeter'],
      },
      {
        title: 'Microcontrollers',
        description: 'Program small devices.',
        topics: ['Arduino', 'ESP32', 'GPIO', 'Analog & digital I/O', 'C / C++ basics'],
        resources: [{ label: 'Arduino Docs', url: 'https://docs.arduino.cc/' }],
      },
      {
        title: 'Sensors & Actuators',
        description: 'Read the world and act on it.',
        topics: ['Temperature & motion', 'Displays', 'Relays & motors', 'Calibration', 'Power'],
      },
      {
        title: 'Communication Protocols',
        description: 'Connect devices reliably.',
        topics: ['UART', 'I2C', 'SPI', 'MQTT', 'WiFi & BLE'],
      },
      {
        title: 'IoT Platforms & Cloud',
        description: 'Send data to the cloud.',
        topics: ['MQTT brokers', 'Cloud IoT platforms', 'Dashboards', 'Time-series data', 'APIs'],
      },
      {
        title: 'Security',
        description: 'Protect connected devices.',
        topics: ['Device identity', 'Encryption', 'Firmware updates', 'Network security', 'Access control'],
      },
      {
        title: 'Project',
        description: 'Build an end-to-end device.',
        topics: ['Sensor node', 'Cloud dashboard', 'Alerts', 'Enclosure', 'Documentation'],
      },
    ],
  },
  {
    id: 'ar-vr',
    title: 'AR / VR Development',
    icon: 'scan-outline',
    color: '#8B5CF6',
    level: 'Advanced',
    duration: '5–8 months',
    description:
      'Build immersive augmented and virtual reality experiences.',
    aliases: ['ar', 'vr', 'xr', 'augmented reality', 'virtual reality', 'arkit', 'arcore'],
    stages: [
      {
        title: 'Programming & 3D Basics',
        description: 'Get comfortable in 3D space.',
        topics: ['C# / C++', 'Vectors & quaternions', 'Coordinate systems', '3D pipelines', 'Performance'],
      },
      {
        title: 'Game Engine',
        description: 'Use Unity or Unreal for XR.',
        topics: ['Unity XR', 'Scene setup', 'Cameras', 'Input', 'Lighting'],
        resources: [{ label: 'Unity XR Docs', url: 'https://docs.unity3d.com/Manual/XR.html' }],
      },
      {
        title: '3D Modeling',
        description: 'Create or import assets.',
        topics: ['Blender basics', 'Modeling', 'Texturing', 'Optimization', 'Importing'],
      },
      {
        title: 'AR Foundations',
        description: 'Overlay digital content on the real world.',
        topics: ['ARCore', 'ARKit', 'Plane detection', 'Image tracking', 'Anchors'],
      },
      {
        title: 'VR Development',
        description: 'Build immersive virtual spaces.',
        topics: ['VR headsets', 'Controllers', 'Locomotion', 'Comfort', 'Spatial audio'],
      },
      {
        title: 'Interaction Design',
        description: 'Make XR usable.',
        topics: ['Gaze & gestures', 'UI in 3D', 'Onboarding', 'Accessibility', 'Testing'],
      },
      {
        title: 'Build & Publish',
        description: 'Ship your experience.',
        topics: ['Device builds', 'Store requirements', 'Performance profiling', 'Demo video', 'Distribution'],
      },
    ],
  },
];

const normalizeTitle = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9+#.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Branch roadmaps are appended after the curated set, so the existing order is
 * unchanged. A branch entry that matches a curated roadmap by title or alias
 * (e.g. Python, C++ Programming, IoT) reuses that detailed path while keeping
 * its branch tag, so every branch can list the course.
 */
const curatedByTitle = new Map<string, Roadmap>();
for (const roadmap of CURATED_ROADMAPS) {
  curatedByTitle.set(normalizeTitle(roadmap.title), roadmap);
  for (const alias of roadmap.aliases) {
    const key = normalizeTitle(alias);
    if (!curatedByTitle.has(key)) curatedByTitle.set(key, roadmap);
  }
}

export const ROADMAPS: Roadmap[] = [
  ...CURATED_ROADMAPS,
  ...BRANCH_ROADMAPS.map((roadmap) => {
    const curated = curatedByTitle.get(normalizeTitle(roadmap.title));
    if (!curated) return roadmap;
    return {
      ...roadmap,
      description: curated.description,
      stages: curated.stages,
    };
  }),
];

/** Ranked search: title/alias matches first, then topic matches. */
export function searchRoadmaps(query: string): Roadmap[] {
  const q = query.trim().toLowerCase();
  if (!q) return ROADMAPS;

  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = ROADMAPS.map((roadmap) => {
    const title = roadmap.title.toLowerCase();
    const aliases = roadmap.aliases.map((a) => a.toLowerCase());
    const topics = roadmap.stages
      .flatMap((stage) => [stage.title, ...stage.topics])
      .join(' ')
      .toLowerCase();
    const description = roadmap.description.toLowerCase();

    let score = 0;
    for (const token of tokens) {
      if (title.includes(token)) score += 5;
      if (aliases.some((a) => a.includes(token))) score += 4;
      if (topics.includes(token)) score += 2;
      if (description.includes(token)) score += 1;
    }

    const matchesAll = tokens.every(
      (token) =>
        title.includes(token) ||
        aliases.some((a) => a.includes(token)) ||
        topics.includes(token) ||
        description.includes(token),
    );

    return { roadmap, score, matchesAll };
  });

  return scored
    .filter((item) => item.matchesAll && item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.roadmap);
}

export function getRoadmapById(id: string): Roadmap | undefined {
  return ROADMAPS.find((roadmap) => roadmap.id === id);
}

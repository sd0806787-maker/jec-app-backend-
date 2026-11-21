export interface ResourceItem {
  title: string;
  description: string;
  url: string;
  type: 'NPTEL' | 'Roadmap' | 'Documentation';
}

export const notesDatabase: Record<string, ResourceItem[]> = {
  CSE: [
    // Programming and DSA
    {
      title: 'NPTEL: Programming in Java',
      description: 'By Prof. Debasis Samanta (IIT Kharagpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Programming%20in%20Java',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Programming in Modern C++',
      description: 'By Prof. Partha Pratim Das (IIT Kharagpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Programming%20in%20Modern%20C%2B%2B',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Data Structures and Algorithms Design',
      description: 'By Prof. Nitin Saxena (IIT Kanpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Data%20Structures%20and%20Algorithms%20Design',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Programming, Data Structures and Algorithms using Python',
      description: 'By Prof. Madhavan Mukund (Chennai Mathematical Institute)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Programming%20Data%20Structures%20and%20Algorithms%20using%20Python',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Getting Started with Competitive Programming',
      description: 'By Prof. Neeldhara Misra (IIT Gandhinagar)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Getting%20Started%20with%20Competitive%20Programming',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Introduction to Programming in C',
      description: 'By Prof. Satyadev Nandakumar (IIT Kanpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Introduction%20to%20programming%20in%20C',
      type: 'NPTEL',
    },

    // Core Computer Science
    {
      title: 'NPTEL: Operating System Fundamentals',
      description: 'By Prof. Santanu Chattopadhyay (IIT Kharagpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Operating%20System%20Fundamentals',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Introduction to Operating Systems',
      description: 'By Prof. Chester Rebeiro (IIT Madras)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Introduction%20to%20Operating%20Systems',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Computer Networks',
      description: 'By Prof. Neminath Hubballi (IIT Indore)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Computer%20Networks',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Data Base Management System',
      description: 'By Prof. Partha Pratim Das and Prof. Samiran Chattopadhyay (IIT Kharagpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Data%20Base%20Management%20System',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Software Engineering',
      description: 'By Prof. Rajib Mall (IIT Kharagpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Software%20Engineering',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Theory of Computation',
      description: 'By Prof. Raghunath Tewari (IIT Kanpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Theory%20of%20Computation',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Computer Architecture',
      description: 'By Prof. Smruti Ranjan Sarangi (IIT Delhi)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Computer%20Architecture',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Compiler Design',
      description: 'By Prof. Sanjeev K. Aggarwal (IIT Kanpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Compiler%20Design',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Discrete Mathematics',
      description: 'By Prof. Sudarshan Iyengar (IIT Ropar)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Discrete%20Mathematics',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Design and Analysis of Algorithms',
      description: 'By Prof. Madhavan Mukund (Chennai Mathematical Institute)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Design%20and%20Analysis%20of%20Algorithms',
      type: 'NPTEL',
    },

    // AI, Machine Learning and Data Science
    {
      title: 'NPTEL: Introduction to Machine Learning',
      description: 'By Prof. Sudeshna Sarkar (IIT Kharagpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Introduction%20to%20Machine%20Learning',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Deep Learning',
      description: 'By Prof. Sudarshan Iyengar (IIT Ropar)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Deep%20Learning',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Natural Language Processing',
      description: 'By Prof. Pawan Goyal (IIT Kharagpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Natural%20Language%20Processing',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Data Science for Engineers',
      description: 'By Prof. Ragunathan Rengasamy and Prof. Shankar Narasimhan (IIT Madras)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Data%20Science%20for%20Engineers',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Computer Vision',
      description: 'By Prof. Jayanta Mukhopadhyay (IIT Kharagpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Computer%20Vision',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Reinforcement Learning',
      description: 'By Prof. Balaraman Ravindran (IIT Madras)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Reinforcement%20Learning',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Introduction to Large Language Models',
      description: 'By Prof. Soumen Chakraborti and Prof. Tanmoy Chakraborty',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Introduction%20to%20Large%20Language%20Models',
      type: 'NPTEL',
    },

    // Cloud, Security and Emerging Technologies
    {
      title: 'NPTEL: Cloud Computing',
      description: 'By Prof. Soumya Kanti Ghosh (IIT Kharagpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Cloud%20Computing',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Ethical Hacking',
      description: 'By Prof. Indranil Sengupta (IIT Kharagpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Ethical%20Hacking',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Cryptography and Network Security',
      description: 'By Prof. Debdeep Mukhopadhyay (IIT Kharagpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Cryptography%20and%20Network%20Security',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Introduction to Blockchain Technology and Applications',
      description: 'By Prof. Sandeep Shukla (IIT Kanpur)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Introduction%20to%20Blockchain%20Technology%20and%20Applications',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Distributed Systems',
      description: 'By Prof. Rajiv Misra (IIT Patna)',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Distributed%20Systems',
      type: 'NPTEL',
    },

    // Roadmaps
    {
      title: 'CSE Roadmap',
      description: 'A guide to computer science fundamentals and important topics.',
      url: 'https://roadmap.sh/computer-science',
      type: 'Roadmap',
    },
    {
      title: 'Backend Developer Roadmap',
      description: 'Learn server-side development, APIs, databases and deployment.',
      url: 'https://roadmap.sh/backend',
      type: 'Roadmap',
    },
    {
      title: 'Frontend Developer Roadmap',
      description: 'Learn HTML, CSS, JavaScript and frontend frameworks.',
      url: 'https://roadmap.sh/frontend',
      type: 'Roadmap',
    },
    {
      title: 'Java Developer Roadmap',
      description: 'A structured roadmap for Java development.',
      url: 'https://roadmap.sh/java',
      type: 'Roadmap',
    },

    // Official documentation
    {
      title: 'Python Official Documentation',
      description: 'Official documentation for Python 3.',
      url: 'https://docs.python.org/3/',
      type: 'Documentation',
    },
    {
      title: 'Java Documentation',
      description: 'Official Java platform documentation.',
      url: 'https://docs.oracle.com/en/java/',
      type: 'Documentation',
    },
    {
      title: 'MDN Web Docs',
      description: 'Documentation for HTML, CSS, JavaScript and web APIs.',
      url: 'https://developer.mozilla.org/',
      type: 'Documentation',
    },
    {
      title: 'React Documentation',
      description: 'Official guide to building user interfaces with React.',
      url: 'https://react.dev/',
      type: 'Documentation',
    },
    {
      title: 'Node.js Documentation',
      description: 'Official documentation for Node.js.',
      url: 'https://nodejs.org/docs/latest/api/',
      type: 'Documentation',
    },
    {
      title: 'PostgreSQL Documentation',
      description: 'Official documentation for PostgreSQL databases.',
      url: 'https://www.postgresql.org/docs/',
      type: 'Documentation',
    },
  ],

  ETC: [
    {
      title: 'NPTEL: Signals and Systems',
      description: 'Explore signals and systems courses on NPTEL.',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Signals%20and%20Systems',
      type: 'NPTEL',
    },
    {
      title: 'NPTEL: Digital Circuits',
      description: 'Explore digital circuit courses on NPTEL.',
      url: 'https://www.nptel.ac.in/courses?searchQuery=Digital%20Circuits',
      type: 'NPTEL',
    },
    {
      title: 'ETC Roadmap',
      description: 'Guide to electronics and communication fundamentals.',
      url: 'https://roadmap.sh/electronics',
      type: 'Roadmap',
    },
  ],

  OTHER: [
    {
      title: 'NPTEL General Courses',
      description: 'Explore courses across engineering and other disciplines.',
      url: 'https://www.nptel.ac.in/courses',
      type: 'NPTEL',
    },
    {
      title: 'General Engineering Roadmap',
      description: 'Explore learning roadmaps for different technical fields.',
      url: 'https://roadmap.sh/',
      type: 'Roadmap',
    },
  ],
  EE: [
  // Electrical Circuits and Fundamentals
  {
    title: 'NPTEL: Basic Electrical Circuits',
    description: 'Learn circuit laws, network theorems, and DC/AC circuit analysis.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Basic%20Electrical%20Circuits',
    type: 'NPTEL',
  },
  {
    title: 'NPTEL: Electric Circuits',
    description: 'Study circuit analysis, transient response, and network concepts.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Electric%20Circuits',
    type: 'NPTEL',
  },
  {
    title: 'NPTEL: Electrical Machines',
    description: 'Learn transformers, DC machines, induction motors, and synchronous machines.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Electrical%20Machines',
    type: 'NPTEL',
  },
  {
    title: 'NPTEL: Power System Engineering',
    description: 'Explore power generation, transmission, distribution, and protection.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Power%20System%20Engineering',
    type: 'NPTEL',
  },
  {
    title: 'NPTEL: Power Electronics',
    description: 'Study converters, rectifiers, inverters, and semiconductor switching devices.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Power%20Electronics',
    type: 'NPTEL',
  },
  {
    title: 'NPTEL: Electrical Measurements and Instrumentation',
    description: 'Learn measurement systems, sensors, bridges, and electrical instruments.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Electrical%20Measurements%20and%20Instrumentation',
    type: 'NPTEL',
  },

  // Control Systems and Signal Processing
  {
    title: 'NPTEL: Control Systems',
    description: 'Study feedback systems, stability, root locus, and frequency response.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Control%20Systems',
    type: 'NPTEL',
  },
  {
    title: 'NPTEL: Digital Control Systems',
    description: 'Learn digital controllers, discrete-time systems, and control design.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Digital%20Control%20Systems',
    type: 'NPTEL',
  },
  {
    title: 'NPTEL: Signals and Systems',
    description: 'Understand continuous and discrete signals, transforms, and system analysis.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Signals%20and%20Systems',
    type: 'NPTEL',
  },

  // Electronics and Embedded Systems
  {
    title: 'NPTEL: Analog Electronics',
    description: 'Learn diodes, transistors, amplifiers, and analog circuit design.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Analog%20Electronics',
    type: 'NPTEL',
  },
  {
    title: 'NPTEL: Digital Electronics',
    description: 'Study logic gates, Boolean algebra, combinational and sequential circuits.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Digital%20Electronics',
    type: 'NPTEL',
  },
  {
    title: 'NPTEL: Microprocessors and Microcontrollers',
    description: 'Explore processor architecture, interfacing, and embedded programming.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Microprocessors%20and%20Microcontrollers',
    type: 'NPTEL',
  },

  // Renewable Energy and Modern Power Systems
  {
    title: 'NPTEL: Renewable Energy Sources',
    description: 'Learn solar, wind, and other renewable energy technologies.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Renewable%20Energy%20Sources',
    type: 'NPTEL',
  },
  {
    title: 'NPTEL: Smart Grid',
    description: 'Explore smart-grid architecture, monitoring, and modern power distribution.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Smart%20Grid',
    type: 'NPTEL',
  },
  {
    title: 'NPTEL: Electric Vehicles',
    description: 'Study EV powertrains, electric motors, batteries, and charging systems.',
    url: 'https://www.nptel.ac.in/courses?searchQuery=Electric%20Vehicles',
    type: 'NPTEL',
  },

  // Roadmaps
  {
    title: 'Electrical Engineering Roadmap',
    description: 'Explore electrical engineering fundamentals and major subject areas.',
    url: 'https://roadmap.sh/',
    type: 'Roadmap',
  },

  // Documentation and Learning Resources
  {
    title: 'MATLAB Documentation',
    description: 'Official documentation for numerical computing, simulation, and control design.',
    url: 'https://www.mathworks.com/help/matlab/',
    type: 'Documentation',
  },
  {
    title: 'Simulink Documentation',
    description: 'Official guides for modeling and simulating dynamic systems.',
    url: 'https://www.mathworks.com/help/simulink/',
    type: 'Documentation',
  },
  {
    title: 'Arduino Documentation',
    description: 'Learn microcontroller programming, sensors, and embedded projects.',
    url: 'https://docs.arduino.cc/',
    type: 'Documentation',
  },
],
ME: [
  // Thermodynamics and Thermal Engineering
  {
    title: "Engineering Thermodynamics",
    description: "Learn thermodynamic laws, properties of substances, and energy conversion.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Engineering%20Thermodynamics",
    type: "NPTEL",
  },
  {
    title: "Applied Thermodynamics",
    description: "Study practical thermodynamic cycles, engines, and power systems.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Applied%20Thermodynamics",
    type: "NPTEL",
  },
  {
    title: "Heat Transfer",
    description: "Understand conduction, convection, radiation, and heat exchangers.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Heat%20Transfer",
    type: "NPTEL",
  },
  {
    title: "Refrigeration and Air Conditioning",
    description: "Learn refrigeration cycles, cooling systems, and air conditioning.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Refrigeration%20and%20Air%20Conditioning",
    type: "NPTEL",
  },

  // Fluid Mechanics
  {
    title: "Fluid Mechanics",
    description: "Study fluid properties, fluid statics, fluid flow, and governing equations.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Fluid%20Mechanics",
    type: "NPTEL",
  },
  {
    title: "Fluid Machines",
    description: "Learn pumps, turbines, and other fluid machinery.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Fluid%20Machines",
    type: "NPTEL",
  },
  {
    title: "Computational Fluid Dynamics",
    description: "Explore numerical techniques for simulating fluid flow and heat transfer.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Computational%20Fluid%20Dynamics",
    type: "NPTEL",
  },

  // Mechanics and Machine Design
  {
    title: "Engineering Mechanics",
    description: "Build fundamentals in forces, equilibrium, motion, and dynamics.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Engineering%20Mechanics",
    type: "NPTEL",
  },
  {
    title: "Strength of Materials",
    description: "Learn stress, strain, bending, torsion, and material strength.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Strength%20of%20Materials",
    type: "NPTEL",
  },
  {
    title: "Kinematics of Machines",
    description: "Understand mechanisms, motion analysis, and machine linkages.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Kinematics%20of%20Machines",
    type: "NPTEL",
  },
  {
    title: "Design of Machine Elements",
    description: "Learn how to design shafts, gears, bearings, and mechanical components.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Design%20of%20Machine%20Elements",
    type: "NPTEL",
  },
  {
    title: "Mechanical Vibrations",
    description: "Study free and forced vibrations, damping, and vibration analysis.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Mechanical%20Vibrations",
    type: "NPTEL",
  },

  // Manufacturing and Materials
  {
    title: "Manufacturing Processes",
    description: "Learn casting, welding, machining, forming, and production methods.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Manufacturing%20Processes",
    type: "NPTEL",
  },
  {
    title: "Advanced Machining Processes",
    description: "Explore conventional and non-traditional machining techniques.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Advanced%20Machining%20Processes",
    type: "NPTEL",
  },
  {
    title: "Engineering Materials",
    description: "Understand material properties, selection, and engineering applications.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Materials%20Science%20Mechanical%20Engineering",
    type: "NPTEL",
  },
  {
    title: "Additive Manufacturing",
    description: "Learn 3D printing technologies, materials, and manufacturing applications.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Additive%20Manufacturing",
    type: "NPTEL",
  },
  {
    title: "Finite Element Method",
    description: "Study numerical methods used for stress, structural, and thermal analysis.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Finite%20Element%20Method",
    type: "NPTEL",
  },

  // CAD, Robotics, and Mechatronics
  {
    title: "Computer Aided Design and Manufacturing",
    description: "Learn CAD/CAM concepts used in mechanical design and manufacturing.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Computer%20Aided%20Design%20and%20Manufacturing",
    type: "NPTEL",
  },
  {
    title: "Robotics",
    description: "Explore robot kinematics, mechanisms, control, and industrial applications.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Robotics",
    type: "NPTEL",
  },
  {
    title: "Design of Mechatronic Systems",
    description: "Understand the integration of mechanical systems, electronics, sensors, and control.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Design%20of%20Mechatronic%20Systems",
    type: "NPTEL",
  },

  // Documentation and learning tools
  {
    title: "FreeCAD Documentation",
    description: "Learn 3D parametric modeling for mechanical parts and assemblies.",
    url: "https://wiki.freecad.org/",
    type: "Documentation",
  },
  {
    title: "Onshape Learning Center",
    description: "Explore browser-based CAD tutorials and mechanical design workflows.",
    url: "https://learn.onshape.com/",
    type: "Documentation",
  },
  {
    title: "MATLAB Documentation",
    description: "Use MATLAB for numerical computation, modeling, and engineering analysis.",
    url: "https://www.mathworks.com/help/matlab/",
    type: "Documentation",
  },
  {
    title: "Simulink Documentation",
    description: "Learn block-diagram modeling and simulation of dynamic systems.",
    url: "https://www.mathworks.com/help/simulink/",
    type: "Documentation",
  },
  {
    title: "Engineering Drawing",
    description: "Study technical drawing, projections, and engineering graphics.",
    url: "https://www.nptel.ac.in/courses?searchQuery=Engineering%20Drawing",
    type: "NPTEL",
  },
],
CE: [
  {
    title: "Geotechnical Engineering",
    description: "Learn soil mechanics, soil properties, and geotechnical engineering fundamentals through NPTEL.",
    url: "https://nptel.ac.in/courses?search=Geotechnical%20Engineering",
    type: "NPTEL",
  },
  {
    title: "Environmental Geomechanics",
    description: "Study soil-environment interactions and environmental geotechnical engineering.",
    url: "https://nptel.ac.in/courses?search=Environmental%20Geomechanics",
    type: "NPTEL",
  },
  {
    title: "Remote Sensing and GIS",
    description: "Explore satellite imagery, GIS mapping, and applications in civil engineering.",
    url: "https://nptel.ac.in/courses?search=Remote%20Sensing%20and%20GIS",
    type: "NPTEL",
  },
  {
    title: "Structural Dynamics",
    description: "Understand structural vibration, dynamic loads, and structural response.",
    url: "https://nptel.ac.in/courses?search=Structural%20Dynamics",
    type: "NPTEL",
  },
  {
    title: "Fluid Mechanics",
    description: "Learn fluid properties, fluid flow, and engineering applications.",
    url: "https://nptel.ac.in/courses?search=Fluid%20Mechanics",
    type: "NPTEL",
  },
  {
    title: "River Engineering",
    description: "Study river flow, sediment transport, river training, and river management.",
    url: "https://nptel.ac.in/courses?search=River%20Engineering",
    type: "NPTEL",
  },
  {
    title: "Municipal Solid Waste Management",
    description: "Learn waste collection, treatment, disposal, and sustainable city waste management.",
    url: "https://nptel.ac.in/courses?search=Municipal%20Solid%20Waste%20Management",
    type: "NPTEL",
  },
  {
    title: "Mechanics of Solids",
    description: "Understand stress, strain, deformation, and the mechanical behavior of materials.",
    url: "https://nptel.ac.in/courses?search=Mechanics%20of%20Solids",
    type: "NPTEL",
  },
  {
    title: "Strength of Materials",
    description: "Study axial loading, bending, torsion, shear force, and bending moment.",
    url: "https://nptel.ac.in/courses?search=Strength%20of%20Materials",
    type: "NPTEL",
  },
  {
    title: "Design of Reinforced Concrete Structures",
    description: "Learn reinforced concrete design principles and structural member design.",
    url: "https://nptel.ac.in/courses?search=Design%20of%20Reinforced%20Concrete%20Structures",
    type: "NPTEL",
  },
  {
    title: "Design of Steel Structures",
    description: "Understand steel members, connections, and structural steel design.",
    url: "https://nptel.ac.in/courses?search=Design%20of%20Steel%20Structures",
    type: "NPTEL",
  },
  {
    title: "Foundation Engineering",
    description: "Learn shallow foundations, deep foundations, bearing capacity, and settlement.",
    url: "https://nptel.ac.in/courses?search=Foundation%20Engineering",
    type: "NPTEL",
  },
  {
    title: "Soil Mechanics",
    description: "Study soil classification, permeability, compaction, consolidation, and shear strength.",
    url: "https://nptel.ac.in/courses?search=Soil%20Mechanics",
    type: "NPTEL",
  },
  {
    title: "Earthquake Engineering",
    description: "Learn seismic forces, earthquake-resistant design, and structural response.",
    url: "https://nptel.ac.in/courses?search=Earthquake%20Engineering",
    type: "NPTEL",
  },
  {
    title: "Construction Planning and Management",
    description: "Explore construction scheduling, project planning, cost control, and management.",
    url: "https://nptel.ac.in/courses?search=Construction%20Planning%20and%20Management",
    type: "NPTEL",
  },
  {
    title: "Transportation Engineering",
    description: "Study highway engineering, traffic flow, pavement design, and transportation systems.",
    url: "https://nptel.ac.in/courses?search=Transportation%20Engineering",
    type: "NPTEL",
  },
  {
    title: "Water Resources Engineering",
    description: "Learn hydrology, water resource planning, irrigation, and water management.",
    url: "https://nptel.ac.in/courses?search=Water%20Resources%20Engineering",
    type: "NPTEL",
  },
  {
    title: "Environmental Engineering",
    description: "Study water treatment, wastewater management, pollution control, and sustainability.",
    url: "https://nptel.ac.in/courses?search=Environmental%20Engineering",
    type: "NPTEL",
  },
  {
    title: "Finite Element Analysis",
    description: "Understand numerical modeling and finite element methods for structural problems.",
    url: "https://nptel.ac.in/courses?search=Finite%20Element%20Analysis",
    type: "NPTEL",
  },
  {
    title: "Surveying and Geomatics",
    description: "Learn land surveying, GPS, digital mapping, and geospatial measurement techniques.",
    url: "https://nptel.ac.in/courses?search=Surveying",
    type: "NPTEL",
  },
  {
    title: "Engineering Geology",
    description: "Explore rocks, minerals, geological structures, and their importance in civil engineering.",
    url: "https://nptel.ac.in/courses?search=Engineering%20Geology",
    type: "NPTEL",
  },
  {
    title: "Bridge Engineering",
    description: "Learn bridge components, structural behavior, and bridge design fundamentals.",
    url: "https://nptel.ac.in/courses?search=Bridge%20Engineering",
    type: "NPTEL",
  },
  {
    title: "FreeCAD Documentation",
    description: "Learn free 3D CAD modeling for engineering components and construction projects.",
    url: "https://wiki.freecad.org/",
    type: "Documentation",
  },
  {
    title: "AutoCAD Learning Resources",
    description: "Explore official Autodesk tutorials for 2D drafting and 3D design.",
    url: "https://www.autodesk.com/learn",
    type: "Documentation",
  },
  {
    title: "QGIS Documentation",
    description: "Learn open-source GIS tools for mapping, spatial analysis, and geospatial projects.",
    url: "https://docs.qgis.org/",
    type: "Documentation",
  },
  {
    title: "OpenSees Documentation",
    description: "Explore structural and earthquake engineering simulation software.",
    url: "https://opensees.berkeley.edu/",
    type: "Documentation",
  },
],
'IN': [
    { title: 'NPTEL: Industrial Instrumentation', description: 'By Prof. A. Barua (IIT Kharagpur)', url: 'https://nptel.ac.in/courses/108105064', type: 'NPTEL' },
    { title: 'NPTEL: Process Control and Instrumentation', description: 'By Prof. S. Mukhopadhyay (IIT Kharagpur)', url: 'https://nptel.ac.in/courses/108105147', type: 'NPTEL' },
    { title: 'NPTEL: Sensors and Actuators', description: 'By Prof. Hardik J. Pandya (IISc Bangalore)', url: 'https://nptel.ac.in/courses/108108147', type: 'NPTEL' },
    { title: 'Instrumentation Roadmap', description: 'Guide to core instrumentation, control systems, and sensors.', url: 'https://roadmap.sh/electronics', type: 'Roadmap' },
    { title: 'ISA Standards', description: 'International Society of Automation standards.', url: 'https://www.isa.org/standards-and-publications/isa-standards', type: 'Documentation' },
  ],




};
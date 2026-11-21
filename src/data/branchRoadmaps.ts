/**
 * Roadmaps for the non-CSE branches.
 *
 * These entries are appended after the hand-written roadmaps in `roadmaps.ts`
 * so the existing UI, fonts and ordering stay unchanged. Skills already
 * covered by a curated roadmap are filtered out there by title/alias.
 *
 * Types are imported with `import type`, so this module has no runtime
 * dependency on `roadmaps.ts` (no circular import).
 */

import type { Roadmap, RoadmapLevel, RoadmapStage } from './roadmaps';

const s = (title: string, description: string, topics: string[]): RoadmapStage => ({
  title,
  description,
  topics,
});

// ─────────────────────────────────────────────────────────────
// Stage blueprints
// ─────────────────────────────────────────────────────────────

const PROGRAMMING: RoadmapStage[] = [
  s('Language Foundations', 'Learn syntax and how programs run.', ['Setup & tooling', 'Variables & data types', 'Operators', 'Input / output', 'Debugging']),
  s('Control Flow & Functions', 'Write logic and reusable code.', ['Conditions', 'Loops', 'Functions', 'Parameters & return values', 'Scope']),
  s('Data Handling', 'Work with real data.', ['Arrays & lists', 'Strings', 'Maps / dictionaries', 'Files', 'Error handling']),
  s('Structured Code', 'Organize larger programs.', ['Classes & objects', 'Modules', 'Interfaces', 'Code organization', 'Testing basics']),
  s('Tools & Collaboration', 'Use the professional workflow.', ['Git & GitHub', 'Package managers', 'Linters & formatters', 'Build tools', 'Documentation']),
  s('Projects & Practice', 'Apply the language.', ['Console app', 'Automation / API script', 'Problem set', 'Portfolio project', 'Code review']),
];

const CAD_DESIGN: RoadmapStage[] = [
  s('Learn the Tool', 'Get comfortable with the interface.', ['Interface', 'Navigation', 'Sketching', 'File management', 'Shortcuts']),
  s('2D Drafting', 'Create accurate technical drawings.', ['Drawing tools', 'Dimensions', 'Layers', 'Templates', 'Annotations']),
  s('3D Modelling', 'Build parts and assemblies.', ['Part modelling', 'Features', 'Assemblies', 'Constraints', 'Parametrics']),
  s('Detailing & Output', 'Produce industry-ready drawings.', ['Drawing sheets', 'BOM', 'Plotting', 'Title blocks', 'Standards']),
  s('Standards & GD&T', 'Apply tolerances and conventions.', ['GD&T symbols', 'Datums', 'Tolerance stack-up', 'Surface finish', 'ISO / ASME basics']),
  s('Project & Certification', 'Prove your skills.', ['Practice models', 'Portfolio', 'Certification', 'Real-world project', 'Review']),
];

const CORE_MECHANICAL: RoadmapStage[] = [
  s('Engineering Fundamentals', 'Build the core concepts.', ['Units & dimensions', 'Statics', 'Dynamics', 'Material behaviour', 'Core terminology']),
  s('Core Concepts', 'Master the laws and equations.', ['Key laws', 'Standard equations', 'Analysis methods', 'Boundary conditions', 'Reference standards']),
  s('Analysis & Calculations', 'Solve engineering problems.', ['Numerical problems', 'Design calculations', 'Parametric studies', 'Validation', 'Hand calculations']),
  s('Materials & Manufacturing', 'Connect design to production.', ['Material selection', 'Manufacturing processes', 'Joining', 'Failure modes', 'Standards']),
  s('Tools & Simulation', 'Use modern engineering software.', ['CAD', 'MATLAB', 'ANSYS / FEA', 'CFD basics', 'Documentation']),
  s('Projects & Specialization', 'Apply and extend your knowledge.', ['Mini project', 'Design report', 'Advanced topics', 'Internship prep', 'Portfolio']),
];

const MANUFACTURING: RoadmapStage[] = [
  s('Manufacturing Fundamentals', 'Understand how products are made.', ['Materials', 'Process selection', 'Machining basics', 'Joining', 'Metrology']),
  s('Processes', 'Learn core production methods.', ['Machining', 'Casting', 'Forming', 'Welding', 'Additive manufacturing']),
  s('Machines & Tools', 'Work with production equipment.', ['Machine tools', 'Tooling', 'Fixtures', 'Cutting parameters', 'Maintenance']),
  s('Production Planning', 'Plan efficient production.', ['Process planning', 'Scheduling', 'Inventory', 'Capacity', 'Layout']),
  s('Quality & Lean', 'Improve quality and reduce waste.', ['Quality control', 'Six Sigma', 'Lean tools', 'SPC', 'Root cause analysis']),
  s('Automation & Industry 4.0', 'Modernize production.', ['CNC / CAM', 'Robotics', 'Sensors', 'IIoT', 'Digital twin']),
  s('Projects', 'Apply manufacturing knowledge.', ['Process plan', 'CNC part', 'Quality study', 'Lean case study', 'Portfolio']),
];

const THERMAL_FLUIDS: RoadmapStage[] = [
  s('Fundamentals', 'Build the physical foundation.', ['Units & properties', 'System boundaries', 'Energy balance', 'Laws & equations', 'Reference tables']),
  s('Core Theory', 'Understand the governing principles.', ['Conduction / convection / radiation', 'Fluid statics', 'Flow regimes', 'Laminar & turbulent flow', 'Boundary layers']),
  s('Analysis & Calculations', 'Solve engineering problems.', ['Energy equations', 'Heat exchanger basics', 'Pipe flow', 'Pressure drop', 'Hand calculations']),
  s('Tools & Simulation', 'Use modern analysis software.', ['MATLAB', 'CFD basics', 'Simulation setup', 'Result validation', 'Documentation']),
  s('Equipment & Systems', 'Connect theory to real systems.', ['Pumps & fans', 'Heat exchangers', 'HVAC / refrigeration', 'Boilers & turbines', 'Efficiency']),
  s('Projects', 'Apply thermal and fluid knowledge.', ['System study', 'Design calculation', 'Simulation', 'Efficiency report', 'Portfolio']),
];

const SIMULATION: RoadmapStage[] = [
  s('Math & Mechanics', 'Prepare the analytical base.', ['Engineering math', 'Mechanics', 'Materials', 'Governing equations', 'Numerical methods']),
  s('Modelling', 'Prepare geometry for analysis.', ['CAD cleanup', 'Idealization', 'Meshing', 'Mesh quality', 'Boundary conditions']),
  s('Solver Setup', 'Run the analysis correctly.', ['Loads', 'Constraints', 'Solver selection', 'Convergence', 'Error checking']),
  s('Result Interpretation', 'Read and validate results.', ['Stress / strain', 'Deformation', 'Safety factor', 'Plots & contours', 'Validation']),
  s('Advanced Analysis', 'Go beyond the basics.', ['Dynamic analysis', 'Thermal analysis', 'CFD coupling', 'Optimization', 'Standards']),
  s('Projects', 'Prove your simulation skills.', ['Problem statement', 'Model', 'Study', 'Report', 'Portfolio']),
];

const AUTOMOTIVE: RoadmapStage[] = [
  s('Vehicle Fundamentals', 'Understand how vehicles work.', ['Vehicle systems', 'Chassis & suspension', 'Brakes', 'Transmission', 'Automotive terminology']),
  s('Powertrain & Systems', 'Learn the power path.', ['IC engines', 'Transmission', 'Driveline', 'Cooling', 'Emission systems']),
  s('Vehicle Dynamics', 'Understand motion and handling.', ['Forces & moments', 'Tires', 'Suspension geometry', 'Steering', 'Ride & handling']),
  s('Design & Simulation', 'Design and validate components.', ['CAD', 'FEA', 'CFD', 'Vehicle simulation', 'Standards']),
  s('Testing & Projects', 'Validate real-world performance.', ['Component testing', 'Vehicle testing', 'Safety standards', 'Project', 'Report']),
];

const EV_TECH: RoadmapStage[] = [
  s('EV Fundamentals', 'Understand electric mobility.', ['EV types', 'Architecture', 'Comparison with ICE', 'Standards', 'Safety']),
  s('Powertrain', 'Learn the electric drive path.', ['Motor types', 'Inverters', 'Gearbox', 'Torque control', 'Efficiency']),
  s('Battery Technology', 'Understand energy storage.', ['Cell chemistry', 'Pack design', 'Thermal management', 'Degradation', 'Testing']),
  s('Battery Management Systems', 'Manage packs safely.', ['BMS architecture', 'SOC / SOH', 'Balancing', 'Protection', 'Communication']),
  s('Charging Systems', 'Learn charging infrastructure.', ['AC / DC charging', 'Standards', 'Chargers', 'Grid interaction', 'Safety']),
  s('Power Electronics & Control', 'Control the drive.', ['Converters', 'PWM', 'Motor control', 'Regenerative braking', 'Simulation']),
  s('Projects', 'Build or simulate an EV system.', ['Pack model', 'BMS study', 'Motor control', 'Charging analysis', 'Report']),
];

const ADVANCED_ENGINEERING: RoadmapStage[] = [
  s('Math & Fundamentals', 'Build the analytical base.', ['Engineering math', 'Mechanics', 'Thermodynamics / fluids', 'Materials', 'Numerical methods']),
  s('Modelling & Simulation', 'Represent real systems virtually.', ['Geometry preparation', 'Boundary conditions', 'Meshing', 'Solver setup', 'Result interpretation']),
  s('Core Tools', 'Learn the industry software.', ['MATLAB', 'ANSYS', 'CAD / CAM', 'CFD / FEA', 'Automation scripts']),
  s('System Integration', 'Connect mechanical, electrical and software parts.', ['Sensors', 'Actuators', 'Control', 'Embedded systems', 'Communication']),
  s('Advanced Topics', 'Go deeper into specialization.', ['Optimization', 'Robotics', 'Digital twin', 'Industry 4.0', 'Research methods']),
  s('Capstone Project', 'Build a complete system.', ['Problem statement', 'Design', 'Simulation', 'Prototype', 'Documentation']),
];

const CAREER_ENGINEERING: RoadmapStage[] = [
  s('Domain Fundamentals', 'Know the engineering basics for the role.', ['Core theory', 'Codes & standards', 'Materials / systems', 'Safety', 'Terminology']),
  s('Role Skills', 'Learn what the job actually needs.', ['Daily responsibilities', 'Design / analysis', 'Documentation', 'Coordination', 'Problem solving']),
  s('Industry Tools', 'Use the software employers expect.', ['CAD / analysis tools', 'Excel / reporting', 'Project software', 'Data tools', 'Automation']),
  s('Site / Plant Practice', 'Understand real execution.', ['Installation', 'Testing & commissioning', 'Maintenance', 'Quality checks', 'Safety procedures']),
  s('Career Preparation', 'Get job-ready.', ['Resume', 'Portfolio', 'Interview questions', 'Certifications', 'Internships']),
];

const ELECTRICAL_CORE: RoadmapStage[] = [
  s('Electrical Fundamentals', 'Build the core theory.', ['Voltage & current', 'Power & energy', 'Circuit laws', 'AC / DC', 'Phasors']),
  s('Circuit Analysis', 'Analyze electrical networks.', ['Thevenin & Norton', 'Mesh & nodal analysis', 'Transients', 'Frequency response', 'Simulation']),
  s('Machines & Transformers', 'Understand electromechanical energy.', ['DC machines', 'Induction motors', 'Synchronous machines', 'Transformers', 'Losses & efficiency']),
  s('Power Systems', 'Learn generation, transmission and distribution.', ['Load flow', 'Protection', 'Switchgear', 'Earthing', 'Standards']),
  s('Control & Measurements', 'Measure and control systems.', ['Sensors', 'Instrumentation', 'Feedback', 'PID', 'PLCs']),
  s('Design & Projects', 'Apply electrical engineering.', ['Panel design', 'Simulation', 'Safety', 'Project', 'Report']),
];

const POWER: RoadmapStage[] = [
  s('Power System Basics', 'Understand the power grid.', ['Generation', 'Transmission', 'Distribution', 'Loads', 'Per-unit system']),
  s('Generation', 'Learn how power is produced.', ['Thermal', 'Hydro', 'Nuclear basics', 'Renewables', 'Grid code']),
  s('Transmission & Distribution', 'Move power efficiently.', ['Lines & cables', 'Substations', 'Voltage levels', 'Losses', 'Distribution planning']),
  s('Protection & Switchgear', 'Keep the grid safe.', ['Relays', 'Circuit breakers', 'Fault analysis', 'Coordination', 'Earthing']),
  s('Renewable Integration', 'Connect clean energy.', ['Solar', 'Wind', 'Inverters', 'Storage', 'Microgrids']),
  s('Smart Grid & Storage', 'Modernize the grid.', ['SCADA', 'Smart meters', 'Demand response', 'BESS', 'Power quality']),
  s('Projects', 'Apply power engineering.', ['Load flow study', 'Protection design', 'Solar project', 'Simulation', 'Report']),
];

const ELECTRONICS_EMBEDDED: RoadmapStage[] = [
  s('Electronics Fundamentals', 'Learn components and circuits.', ['Passive components', 'Diodes', 'Transistors', 'Amplifiers', 'Circuit simulation']),
  s('Analog & Digital', 'Master both domains.', ['Op-amps', 'Filters', 'Logic gates', 'Flip-flops', 'ADCs / DACs']),
  s('Microprocessors & Controllers', 'Program hardware.', ['Architecture', 'Memory', 'Timers', 'Interrupts', 'Arduino / ESP32 / Pi']),
  s('Embedded C', 'Write reliable firmware.', ['C basics', 'Registers', 'Peripherals', 'Interrupts', 'Debugging']),
  s('Peripherals & Interfaces', 'Connect devices.', ['UART', 'I2C', 'SPI', 'Sensors', 'Displays']),
  s('PCB & Prototyping', 'Build real hardware.', ['Schematic', 'PCB layout', 'Soldering', 'Testing', 'Enclosure']),
  s('Projects', 'Ship an embedded product.', ['Sensor node', 'Motor control', 'IoT device', 'Power design', 'Documentation']),
];

const AUTOMATION_CONTROL: RoadmapStage[] = [
  s('Automation Fundamentals', 'Understand automated systems.', ['Sensors', 'Actuators', 'Relays', 'Ladder logic', 'Safety']),
  s('PLC Programming', 'Program industrial controllers.', ['PLC architecture', 'Ladder logic', 'Timers & counters', 'Analog I/O', 'HMI integration']),
  s('HMI & SCADA', 'Supervise industrial processes.', ['HMI design', 'Tags', 'Alarms', 'Trends', 'SCADA architecture']),
  s('DCS & Networks', 'Work with plant-wide control.', ['DCS basics', 'Modbus', 'PROFIBUS', 'Industrial Ethernet', 'Redundancy']),
  s('Motion Control', 'Control motors and axes.', ['VFDs', 'Servo drives', 'Feedback', 'Positioning', 'Robotics basics']),
  s('Projects', 'Automate a real process.', ['Process selection', 'I/O list', 'PLC program', 'HMI screens', 'Commissioning']),
];

const ENGINEERING_SOFTWARE: RoadmapStage[] = [
  s('Tool Fundamentals', 'Learn the interface and workflow.', ['Setup', 'Interface', 'File types', 'Workspace', 'Shortcuts']),
  s('Modelling & Simulation', 'Build and analyze models.', ['Geometry / data', 'Boundary conditions', 'Solvers', 'Parameters', 'Validation']),
  s('Analysis & Results', 'Interpret outputs correctly.', ['Plots', 'Error checking', 'Convergence', 'Reporting', 'Standards']),
  s('Automation & Scripting', 'Work faster and reproducibly.', ['Scripts', 'Batch runs', 'Macros', 'Data export', 'Version control']),
  s('Projects', 'Apply the tool to a real problem.', ['Problem statement', 'Model', 'Study', 'Report', 'Portfolio']),
];

const CIVIL_CORE: RoadmapStage[] = [
  s('Engineering Fundamentals', 'Build the core civil concepts.', ['Engineering mechanics', 'Strength of materials', 'Units', 'Material behaviour', 'Standards']),
  s('Structural Analysis', 'Analyze structures safely.', ['Beams', 'Trusses', 'Frames', 'Deflection', 'Influence lines']),
  s('Concrete & Steel Design', 'Design structural members.', ['RCC design', 'Steel design', 'Load combinations', 'Detailing', 'Codes']),
  s('Geotechnical & Foundations', 'Understand soil and support.', ['Soil mechanics', 'Bearing capacity', 'Foundations', 'Slope stability', 'Retaining walls']),
  s('Hydraulics & Environment', 'Manage water systems.', ['Fluid flow', 'Open channels', 'Water supply', 'Wastewater', 'Environmental impact']),
  s('Surveying & Transportation', 'Plan and measure infrastructure.', ['Surveying', 'Levelling', 'Highway basics', 'Traffic', 'Alignment']),
  s('Projects', 'Apply civil engineering.', ['Structural analysis', 'Design report', 'Site study', 'Estimation', 'Portfolio']),
];

const CONSTRUCTION: RoadmapStage[] = [
  s('Construction Fundamentals', 'Understand project delivery.', ['Project phases', 'Stakeholders', 'Drawings', 'Materials', 'Safety basics']),
  s('Methods & Materials', 'Learn how structures are built.', ['Earthwork', 'Concrete', 'Steel', 'Masonry', 'Finishing']),
  s('Planning & Scheduling', 'Plan the work.', ['WBS', 'Gantt charts', 'CPM', 'Resources', 'Progress tracking']),
  s('Costing & Contracts', 'Control money and agreements.', ['Estimation', 'Rate analysis', 'BOQ', 'Contracts', 'Claims']),
  s('Safety & Quality', 'Deliver safely and correctly.', ['Safety plans', 'PPE', 'Quality checks', 'Testing', 'Audits']),
  s('Project Management', 'Coordinate people and work.', ['Communication', 'Procurement', 'Risk', 'Site meetings', 'Documentation']),
  s('Case Studies', 'Learn from real projects.', ['Site visit', 'Case study', 'Cost report', 'Schedule', 'Presentation']),
];

const BIM: RoadmapStage[] = [
  s('BIM Fundamentals', 'Understand BIM concepts.', ['What is BIM', 'Levels of detail', 'Standards', 'Roles', 'Workflow']),
  s('Modelling', 'Create coordinated models.', ['Revit / Civil 3D', 'Families', 'Parameters', 'Clash detection', 'Documentation']),
  s('Coordination', 'Work across disciplines.', ['Federated models', 'Clash detection', 'Model review', 'Issue tracking', 'Coordination meetings']),
  s('4D / 5D BIM', 'Link time and cost.', ['Schedules', 'Cost data', 'Simulation', 'Quantity take-off', 'Reporting']),
  s('Digital Construction', 'Connect BIM to the site.', ['Digital twin', 'Reality capture', 'Smart buildings', 'IoT', 'Data exchange']),
  s('Project', 'Deliver a BIM project.', ['Building model', 'Clash report', 'BOQ', 'Presentation', 'Portfolio']),
];

const INFRASTRUCTURE: RoadmapStage[] = [
  s('Infrastructure Planning', 'Start with feasibility and planning.', ['Demand', 'Alignment', 'Survey', 'Environment', 'Standards']),
  s('Highway & Transport', 'Design road infrastructure.', ['Geometrics', 'Pavements', 'Drainage', 'Traffic', 'Safety']),
  s('Railway & Airport', 'Learn transport facilities.', ['Rail geometry', 'Stations', 'Runways', 'Terminals', 'Operations']),
  s('Bridges & Tunnels', 'Design special structures.', ['Bridge types', 'Loads', 'Foundations', 'Tunnelling methods', 'Safety']),
  s('Water Resources', 'Manage water infrastructure.', ['Dams', 'Canals', 'Flood control', 'Irrigation', 'Hydrology']),
  s('Urban Planning', 'Plan cities and services.', ['Land use', 'Transport planning', 'Utilities', 'Sustainability', 'GIS']),
  s('Projects', 'Apply infrastructure knowledge.', ['Design project', 'Survey', 'Estimation', 'Case study', 'Report']),
];

const CIVIL_ADVANCED: RoadmapStage[] = [
  s('Advanced Structural Analysis', 'Go beyond basic analysis.', ['Matrix methods', 'Finite element basics', 'Dynamic analysis', 'Nonlinear behaviour', 'Software']),
  s('Earthquake Engineering', 'Design for seismic loads.', ['Seismic zones', 'Response spectra', 'Ductile detailing', 'Base isolation', 'Codes']),
  s('Sustainable Construction', 'Build responsibly.', ['Green materials', 'Energy efficiency', 'Life-cycle assessment', 'Waste reduction', 'Certifications']),
  s('GIS & Remote Sensing', 'Analyze spatial data.', ['GIS basics', 'Satellite data', 'Mapping', 'Spatial analysis', 'Applications']),
  s('Disaster Management', 'Plan for extreme events.', ['Hazard mapping', 'Risk assessment', 'Mitigation', 'Preparedness', 'Recovery']),
  s('Capstone Project', 'Solve an advanced problem.', ['Research', 'Analysis', 'Design', 'Report', 'Presentation']),
];

const INSTRUMENTATION_CORE: RoadmapStage[] = [
  s('Measurement Fundamentals', 'Understand measurement systems.', ['Units', 'Accuracy & precision', 'Errors', 'Calibration', 'Standards']),
  s('Sensors & Transducers', 'Choose the right sensor.', ['Temperature', 'Pressure', 'Flow', 'Level', 'Displacement']),
  s('Signal Conditioning', 'Prepare signals for processing.', ['Amplifiers', 'Filters', 'ADCs', 'Noise', 'Isolation']),
  s('Industrial Instrumentation', 'Work in process plants.', ['P&ID', 'Loop diagrams', 'Transmitters', 'Control valves', 'Hazardous areas']),
  s('Control Systems', 'Connect measurement to control.', ['Feedback', 'PID', 'Tuning', 'Actuators', 'Stability']),
  s('Calibration & Projects', 'Apply instrumentation skills.', ['Calibration lab', 'Loop checking', 'Commissioning', 'Project', 'Report']),
];

const CONTROL_SYSTEMS: RoadmapStage[] = [
  s('Control Fundamentals', 'Learn system behaviour.', ['Open / closed loop', 'Transfer functions', 'Stability', 'Time response', 'Frequency response']),
  s('Feedback & PID', 'Tune real controllers.', ['P / I / D actions', 'Tuning methods', 'Anti-windup', 'Cascade control', 'Simulation']),
  s('Process Control', 'Control industrial processes.', ['Flow', 'Level', 'Temperature', 'Pressure', 'Batch control']),
  s('Advanced Control', 'Go beyond PID.', ['State space', 'Model predictive control', 'Adaptive control', 'Fuzzy logic', 'Optimization']),
  s('DCS & SCADA', 'Use plant control systems.', ['DCS architecture', 'SCADA tags', 'Alarms', 'Trends', 'Historian']),
  s('Industrial Networks', 'Connect control systems.', ['Modbus', 'PROFIBUS', 'Industrial Ethernet', 'OPC', 'Cybersecurity basics']),
  s('Projects', 'Control a real process.', ['Process model', 'Controller design', 'Simulation', 'Implementation', 'Report']),
];

const INDUSTRIAL_SYSTEMS: RoadmapStage[] = [
  s('Industrial Systems Overview', 'Understand plant systems.', ['Processes', 'Utilities', 'Equipment', 'Safety', 'Standards']),
  s('Industrial Networking', 'Connect plant devices.', ['Topologies', 'Switches', 'Ethernet', 'Gateways', 'Redundancy']),
  s('Protocols', 'Work with industrial protocols.', ['Modbus', 'PROFIBUS', 'PROFINET', 'OPC UA', 'HART']),
  s('IIoT & Smart Sensors', 'Modernize data collection.', ['Sensors', 'Edge devices', 'Cloud', 'Dashboards', 'Analytics']),
  s('Industry 4.0', 'Learn smart manufacturing.', ['Digital twin', 'MES', 'Predictive maintenance', 'Cyber-physical systems', 'Data security']),
  s('Smart Manufacturing', 'Apply connected systems.', ['Automation', 'Robotics', 'Quality data', 'Optimization', 'Integration']),
  s('Integration Project', 'Build an end-to-end system.', ['I/O plan', 'Network design', 'Dashboard', 'Alarm logic', 'Documentation']),
];

const SPECIALIZED_INSTRUMENTATION: RoadmapStage[] = [
  s('Domain Fundamentals', 'Understand the application area.', ['Process basics', 'Safety requirements', 'Standards', 'Terminology', 'Environment']),
  s('Measurement Challenges', 'Handle difficult measurements.', ['Accuracy', 'Interference', 'Harsh conditions', 'Redundancy', 'Sampling']),
  s('Specialized Sensors', 'Choose domain-specific devices.', ['Biomedical', 'Chemical', 'Oil & gas', 'Power plant', 'Aerospace / automotive']),
  s('Safety & Standards', 'Design safe systems.', ['SIL / SIS', 'Hazardous areas', 'Isolation', 'Codes', 'Documentation']),
  s('System Integration', 'Connect instruments to control.', ['Signal wiring', 'PLC / DCS', 'Communication', 'Loop checks', 'Commissioning']),
  s('Calibration & Maintenance', 'Keep systems accurate.', ['Calibration', 'Preventive maintenance', 'Troubleshooting', 'Spares', 'Records']),
  s('Case Studies', 'Learn from real applications.', ['Biomedical case', 'Process plant case', 'Power plant case', 'Safety case', 'Report']),
];

// ─────────────────────────────────────────────────────────────
// Branch skill groups — order follows the pasted catalog
// ─────────────────────────────────────────────────────────────

interface BranchRoadmapSpec {
  branch: string;
  branchLabel: string;
  category: string;
  icon: string;
  color: string;
  level: RoadmapLevel;
  duration: string;
  blueprint: RoadmapStage[];
  skills: string[];
}

const SPECS: BranchRoadmapSpec[] = [
  // ── Mechanical Engineering ────────────────────────────────
  {
    branch: 'ME',
    branchLabel: 'Mechanical Engineering',
    category: 'CAD / Design',
    icon: 'cube-outline',
    color: '#3B82F6',
    level: 'Beginner',
    duration: '1–3 months',
    blueprint: CAD_DESIGN,
    skills: ['AutoCAD', 'SolidWorks', 'CATIA', 'Creo', 'Fusion 360', 'CAD Design', '3D Modeling', 'GD&T'],
  },
  {
    branch: 'ME',
    branchLabel: 'Mechanical Engineering',
    category: 'Machine Design',
    icon: 'settings-outline',
    color: '#F59E0B',
    level: 'Intermediate',
    duration: '3–5 months',
    blueprint: CORE_MECHANICAL,
    skills: ['Machine Design'],
  },
  {
    branch: 'ME',
    branchLabel: 'Mechanical Engineering',
    category: 'Manufacturing',
    icon: 'construct-outline',
    color: '#22C55E',
    level: 'Intermediate',
    duration: '2–4 months',
    blueprint: MANUFACTURING,
    skills: [
      'Manufacturing Engineering',
      'CNC Programming',
      'CAM',
      'Additive Manufacturing',
      'Industrial Engineering',
      'Production Engineering',
      'Quality Control',
      'Lean Manufacturing',
      'Six Sigma',
    ],
  },
  {
    branch: 'ME',
    branchLabel: 'Mechanical Engineering',
    category: 'Thermal & Fluids',
    icon: 'thermometer-outline',
    color: '#EF4444',
    level: 'Beginner',
    duration: '3–6 months',
    blueprint: THERMAL_FLUIDS,
    skills: ['Thermodynamics', 'Heat Transfer', 'Fluid Mechanics'],
  },
  {
    branch: 'ME',
    branchLabel: 'Mechanical Engineering',
    category: 'Simulation & Analysis',
    icon: 'analytics-outline',
    color: '#8B5CF6',
    level: 'Advanced',
    duration: '3–6 months',
    blueprint: SIMULATION,
    skills: ['CFD', 'FEA', 'ANSYS'],
  },
  {
    branch: 'ME',
    branchLabel: 'Mechanical Engineering',
    category: 'Engineering Tools',
    icon: 'laptop-outline',
    color: '#0EA5E9',
    level: 'Beginner',
    duration: '1–3 months',
    blueprint: ENGINEERING_SOFTWARE,
    skills: ['MATLAB'],
  },
  {
    branch: 'ME',
    branchLabel: 'Mechanical Engineering',
    category: 'Automotive',
    icon: 'car-sport-outline',
    color: '#EF4444',
    level: 'Intermediate',
    duration: '3–6 months',
    blueprint: AUTOMOTIVE,
    skills: ['Automobile Engineering', 'Electric Vehicle Technology'],
  },
  {
    branch: 'ME',
    branchLabel: 'Mechanical Engineering',
    category: 'EV & Battery',
    icon: 'battery-charging-outline',
    color: '#14B8A6',
    level: 'Intermediate',
    duration: '3–5 months',
    blueprint: EV_TECH,
    skills: ['Battery Technology'],
  },
  {
    branch: 'ME',
    branchLabel: 'Mechanical Engineering',
    category: 'Robotics & Automation',
    icon: 'hardware-chip-outline',
    color: '#8B5CF6',
    level: 'Advanced',
    duration: '4–8 months',
    blueprint: ADVANCED_ENGINEERING,
    skills: ['Robotics', 'Industrial Robotics', 'Mechatronics', 'Industrial Automation'],
  },
  {
    branch: 'ME',
    branchLabel: 'Mechanical Engineering',
    category: 'HVAC',
    icon: 'snow-outline',
    color: '#0EA5E9',
    level: 'Intermediate',
    duration: '3–5 months',
    blueprint: THERMAL_FLUIDS,
    skills: ['HVAC'],
  },
  {
    branch: 'ME',
    branchLabel: 'Mechanical Engineering',
    category: 'Career',
    icon: 'briefcase-outline',
    color: '#14B8A6',
    level: 'Intermediate',
    duration: '2–4 months',
    blueprint: CAREER_ENGINEERING,
    skills: ['Aerospace Engineering', 'Maintenance Engineering'],
  },
  {
    branch: 'ME',
    branchLabel: 'Mechanical Engineering',
    category: 'Industry 4.0',
    icon: 'git-network-outline',
    color: '#0EA5E9',
    level: 'Advanced',
    duration: '4–6 months',
    blueprint: ADVANCED_ENGINEERING,
    skills: ['Industry 4.0', 'Digital Twin'],
  },

  // ── Electrical Engineering ────────────────────────────────
  {
    branch: 'EE',
    branchLabel: 'Electrical Engineering',
    category: 'Core Electrical',
    icon: 'flash-outline',
    color: '#3B82F6',
    level: 'Beginner',
    duration: '3–6 months',
    blueprint: ELECTRICAL_CORE,
    skills: [
      'Circuit Analysis',
      'Electrical Machines',
      'Power Systems',
      'Power Electronics',
      'Control Systems',
      'Electrical Measurements',
      'Electrical Design',
    ],
  },
  {
    branch: 'EE',
    branchLabel: 'Electrical Engineering',
    category: 'Power',
    icon: 'power-outline',
    color: '#F59E0B',
    level: 'Intermediate',
    duration: '4–6 months',
    blueprint: POWER,
    skills: [
      'Power Generation',
      'Power Transmission',
      'Power Distribution',
      'Smart Grid',
      'High Voltage Engineering',
      'Renewable Energy',
      'Solar Energy',
      'Wind Energy',
    ],
  },
  {
    branch: 'EE',
    branchLabel: 'Electrical Engineering',
    category: 'EV & Storage',
    icon: 'car-sport-outline',
    color: '#14B8A6',
    level: 'Intermediate',
    duration: '4–6 months',
    blueprint: EV_TECH,
    skills: ['Electric Vehicle Technology', 'EV Powertrain', 'Battery Management System', 'Energy Storage'],
  },
  {
    branch: 'EE',
    branchLabel: 'Electrical Engineering',
    category: 'Electronics & Embedded',
    icon: 'hardware-chip-outline',
    color: '#8B5CF6',
    level: 'Beginner',
    duration: '3–6 months',
    blueprint: ELECTRONICS_EMBEDDED,
    skills: [
      'Embedded Systems',
      'Microcontrollers',
      'Arduino',
      'ESP32',
      'Raspberry Pi',
      'PCB Design',
      'Analog Electronics',
      'Digital Electronics',
    ],
  },
  {
    branch: 'EE',
    branchLabel: 'Electrical Engineering',
    category: 'Automation',
    icon: 'settings-outline',
    color: '#22C55E',
    level: 'Intermediate',
    duration: '3–6 months',
    blueprint: AUTOMATION_CONTROL,
    skills: ['PLC Programming', 'SCADA', 'Industrial Automation', 'Robotics', 'Motor Control'],
  },
  {
    branch: 'EE',
    branchLabel: 'Electrical Engineering',
    category: 'Software & Tools',
    icon: 'laptop-outline',
    color: '#0EA5E9',
    level: 'Beginner',
    duration: '2–4 months',
    blueprint: ENGINEERING_SOFTWARE,
    skills: ['MATLAB', 'Simulink', 'ETAP', 'AutoCAD Electrical', 'LabVIEW'],
  },
  {
    branch: 'EE',
    branchLabel: 'Electrical Engineering',
    category: 'IoT',
    icon: 'wifi-outline',
    color: '#8B5CF6',
    level: 'Intermediate',
    duration: '3–5 months',
    blueprint: INDUSTRIAL_SYSTEMS,
    skills: ['IoT', 'Industrial IoT'],
  },
  {
    branch: 'EE',
    branchLabel: 'Electrical Engineering',
    category: 'Advanced',
    icon: 'pulse-outline',
    color: '#EC4899',
    level: 'Advanced',
    duration: '3–5 months',
    blueprint: POWER,
    skills: ['Power Quality'],
  },

  // ── Civil Engineering ─────────────────────────────────────
  {
    branch: 'CIVIL',
    branchLabel: 'Civil Engineering',
    category: 'Software / Design',
    icon: 'cube-outline',
    color: '#3B82F6',
    level: 'Beginner',
    duration: '2–4 months',
    blueprint: CAD_DESIGN,
    skills: ['AutoCAD', 'Revit', 'Civil 3D', 'STAAD.Pro', 'ETABS', 'SAP2000', 'Tekla Structures', 'SketchUp'],
  },
  {
    branch: 'CIVIL',
    branchLabel: 'Civil Engineering',
    category: 'Core Civil',
    icon: 'business-outline',
    color: '#22C55E',
    level: 'Beginner',
    duration: '4–6 months',
    blueprint: CIVIL_CORE,
    skills: [
      'Structural Analysis',
      'Structural Design',
      'RCC Design',
      'Steel Structure Design',
      'Geotechnical Engineering',
      'Soil Mechanics',
      'Foundation Engineering',
      'Surveying',
      'Transportation Engineering',
      'Highway Engineering',
      'Railway Engineering',
      'Bridge Engineering',
      'Traffic Engineering',
      'Hydraulics',
      'Water Resources Engineering',
      'Environmental Engineering',
    ],
  },
  {
    branch: 'CIVIL',
    branchLabel: 'Civil Engineering',
    category: 'Construction & Management',
    icon: 'construct-outline',
    color: '#F59E0B',
    level: 'Intermediate',
    duration: '3–5 months',
    blueprint: CONSTRUCTION,
    skills: [
      'Construction Management',
      'Construction Planning',
      'Quantity Surveying',
      'Estimation & Costing',
      'Contract Management',
      'Project Management',
      'Building Construction',
    ],
  },
  {
    branch: 'CIVIL',
    branchLabel: 'Civil Engineering',
    category: 'BIM & Digital',
    icon: 'layers-outline',
    color: '#8B5CF6',
    level: 'Intermediate',
    duration: '3–6 months',
    blueprint: BIM,
    skills: ['BIM', 'BIM Coordination'],
  },
  {
    branch: 'CIVIL',
    branchLabel: 'Civil Engineering',
    category: 'Infrastructure & Planning',
    icon: 'map-outline',
    color: '#0EA5E9',
    level: 'Intermediate',
    duration: '3–6 months',
    blueprint: INFRASTRUCTURE,
    skills: ['GIS', 'Remote Sensing', 'Urban Planning', 'Smart Cities'],
  },
  {
    branch: 'CIVIL',
    branchLabel: 'Civil Engineering',
    category: 'Advanced',
    icon: 'analytics-outline',
    color: '#EC4899',
    level: 'Advanced',
    duration: '4–8 months',
    blueprint: CIVIL_ADVANCED,
    skills: ['Sustainable Construction', 'Green Building', 'Earthquake Engineering', 'Disaster Management'],
  },
  {
    branch: 'CIVIL',
    branchLabel: 'Civil Engineering',
    category: 'Quality & Safety',
    icon: 'shield-checkmark-outline',
    color: '#14B8A6',
    level: 'Intermediate',
    duration: '2–4 months',
    blueprint: CAREER_ENGINEERING,
    skills: ['Quality Control', 'Safety Engineering'],
  },

  // ── Instrumentation Engineering ───────────────────────────
  {
    branch: 'INSTRU',
    branchLabel: 'Instrumentation Engineering',
    category: 'Core Instrumentation',
    icon: 'speedometer-outline',
    color: '#EC4899',
    level: 'Beginner',
    duration: '3–6 months',
    blueprint: INSTRUMENTATION_CORE,
    skills: [
      'Instrumentation & Measurement',
      'Sensors & Transducers',
      'Industrial Instrumentation',
      'Process Instrumentation',
      'Control Systems',
    ],
  },
  {
    branch: 'INSTRU',
    branchLabel: 'Instrumentation Engineering',
    category: 'Control',
    icon: 'options-outline',
    color: '#8B5CF6',
    level: 'Intermediate',
    duration: '4–6 months',
    blueprint: CONTROL_SYSTEMS,
    skills: ['Process Control', 'PID Control', 'Feedback Control', 'Advanced Control Systems'],
  },
  {
    branch: 'INSTRU',
    branchLabel: 'Instrumentation Engineering',
    category: 'Automation',
    icon: 'settings-outline',
    color: '#22C55E',
    level: 'Intermediate',
    duration: '3–6 months',
    blueprint: AUTOMATION_CONTROL,
    skills: ['PLC Programming', 'SCADA', 'DCS', 'HMI', 'Industrial Automation', 'Industrial Robotics', 'Motion Control'],
  },
  {
    branch: 'INSTRU',
    branchLabel: 'Instrumentation Engineering',
    category: 'Electronics',
    icon: 'hardware-chip-outline',
    color: '#3B82F6',
    level: 'Beginner',
    duration: '3–6 months',
    blueprint: ELECTRONICS_EMBEDDED,
    skills: [
      'Industrial Electronics',
      'Analog Electronics',
      'Digital Electronics',
      'Microcontrollers',
      'Embedded Systems',
      'PCB Design',
    ],
  },
  {
    branch: 'INSTRU',
    branchLabel: 'Instrumentation Engineering',
    category: 'Programming',
    icon: 'code-slash-outline',
    color: '#FBBF24',
    level: 'Beginner',
    duration: '2–4 months',
    blueprint: PROGRAMMING,
    skills: ['C Programming', 'C++ Programming', 'Python'],
  },
  {
    branch: 'INSTRU',
    branchLabel: 'Instrumentation Engineering',
    category: 'Engineering Tools',
    icon: 'laptop-outline',
    color: '#0EA5E9',
    level: 'Beginner',
    duration: '1–3 months',
    blueprint: ENGINEERING_SOFTWARE,
    skills: ['MATLAB', 'Simulink', 'LabVIEW'],
  },
  {
    branch: 'INSTRU',
    branchLabel: 'Instrumentation Engineering',
    category: 'Industrial Systems',
    icon: 'git-network-outline',
    color: '#0EA5E9',
    level: 'Intermediate',
    duration: '3–6 months',
    blueprint: INDUSTRIAL_SYSTEMS,
    skills: [
      'Industrial Networking',
      'Modbus',
      'PROFIBUS',
      'Industrial Ethernet',
      'Industrial IoT',
      'Smart Sensors',
      'Smart Manufacturing',
      'Industry 4.0',
      'Process Automation',
    ],
  },
  {
    branch: 'INSTRU',
    branchLabel: 'Instrumentation Engineering',
    category: 'Specialized',
    icon: 'flask-outline',
    color: '#F97316',
    level: 'Advanced',
    duration: '4–8 months',
    blueprint: SPECIALIZED_INSTRUMENTATION,
    skills: [
      'Calibration & Metrology',
      'Safety Instrumented Systems',
      'Oil & Gas Instrumentation',
      'Power Plant Instrumentation',
      'Biomedical Instrumentation',
      'Automotive Instrumentation',
      'Aerospace Instrumentation',
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Generation
// ─────────────────────────────────────────────────────────────

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9+#.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9+#.]+/g, '-')
    .replace(/^-+|-+$/g, '');

// A skill can appear more than once inside one branch (e.g. SCADA under both
// Control and Automation). Keep the first occurrence per branch, but allow the
// same skill in different branches so every branch has its full course list.
const seen = new Set<string>();

export const BRANCH_ROADMAPS: Roadmap[] = SPECS.flatMap((spec) =>
  spec.skills.flatMap((skill) => {
    const key = `${spec.branch}|${normalize(skill)}`;
    if (seen.has(key)) return [];
    seen.add(key);

    return [
      {
        id: `branch:${spec.branch}:${slug(skill)}`,
        title: skill,
        icon: spec.icon,
        color: spec.color,
        level: spec.level,
        duration: spec.duration,
        description: `${spec.category} learning path for ${skill} — curated for ${spec.branchLabel}.`,
        aliases: [skill, spec.category, spec.branchLabel, spec.branch],
        stages: spec.blueprint.map((stage) => ({
          ...stage,
          topics: [...stage.topics],
        })),
      },
    ];
  }),
);

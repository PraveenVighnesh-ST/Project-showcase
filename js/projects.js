/* =============================================================================
   projects.js  —  Single source of truth for all portfolio content.

   HOW TO EDIT (no coding required):
   - Each object in PROJECTS is one card in the carousel + one detail window.
   - To swap a placeholder for your real render, drop the file into assets/img
     (or assets/video) and update the `poster` / `video` path below.
   - `video` loops in the card once the intro + guidance demo finish; projects
     with `posterHold` dissolve to their cover between passes. Set to null if
     the project has no video yet.
   - `sections` render as the Apple-style stacked blocks in the detail window.
   - `model` (optional) is a path to a .glb file shown in the interactive
     3D viewer. Leave it out (or null) to hide the viewer for that project.
   ========================================================================== */

// ALL_PROJECTS holds every project (incl. ones parked with `hidden: true` until
// they have a real render). The carousel/modal only ever see PROJECTS below —
// the visible set, in order — so parked projects are stored but not shown.
const ALL_PROJECTS = [
  {
    // Public stand-in for the master thesis: the 7-DOF thesis footage can't be
    // published, so this card shows the Cooka SCARA robot — same control
    // architecture, different kinematics.
    id: "robotic-arm",
    title: "Cooka SCARA Robot",
    tagline: "Custom SCARA — the control architecture of my master thesis",
    category: "Robotics / Mechatronics",
    year: "2026",
    accent: "#4da3ff",
    // Real photo of the built robot — the intro video shrinks onto this cover,
    // and the card loop dissolves back to it between passes.
    poster: "assets/img/robotic-arm-photo.jpg",
    // Same render as the startup video. Plays to the end, then the cover
    // holds for ~0.5 s (posterHold) before the loop restarts.
    video: "assets/video/intro-scara.mp4",
    posterHold: 500,
    model: "assets/models/Cooka.glb", // real GLB — shows in the modal's 3D viewer
    // starting camera for the 3D viewer (azimuth polar radius) — a 3/4 hero angle
    cameraOrbit: "25deg 74deg auto",
    hero:
      "A custom SCARA robot — two revolute joints and a linear axis that " +
      "clamps payloads through a custom adapter geometry. 2 kg capacity, " +
      "< 5 arcmin backlash, and the same CANopen / ROS 2 control " +
      "architecture as my 7-DOF master-thesis arm.",
    specs: [
      { label: "Configuration", value: "SCARA · 2 revolute + 1 linear" },
      { label: "Payload", value: "2 kg" },
      { label: "Backlash", value: "< 5 arcmin" },
      { label: "Control", value: "CANopen CiA 402" },
      { label: "Joint drives", value: "Nanotec PD4-C" },
      { label: "End effector", value: "Waveshare ST3215 servo" },
    ],
    tags: ["ROS 2", "CANopen", "Gazebo", "ros2_control", "STM32", "Fusion 360"],
    sections: [
      {
        title: "Clamps with geometry, not grip force",
        body:
          "The linear axis engages payloads through a custom adapter " +
          "geometry — a positive mechanical hold rather than friction — with " +
          "a Waveshare ST3215 servo driving the end effector.",
        image: null,
      },
      {
        title: "Synchronised multi-axis motion",
        body:
          "Nanotec PD4-C integrated servos under CANopen CiA 402 — " +
          "interpolated (mode 7) and cyclic-synchronous (mode 8) position " +
          "control, jerk-limited, every axis coordinated.",
        image: null,
      },
      {
        title: "The master-thesis architecture, downsized",
        body:
          "Everything above the joints — ROS 2 Jazzy, ros2_control, the " +
          "CANopen stack and auto-generated Xacro / launch config — is the " +
          "same architecture that runs my 7-DOF master-thesis arm, whose " +
          "footage stays in the lab.",
        image: null,
      },
    ],
  },

  {
    id: "generative-design",
    title: "Generative Design",
    tagline: "Load-driven topology optimization — lighter parts, print-ready",
    category: "Design Optimization / DfAM",
    year: "2025",
    accent: "#37d6a7",
    poster: "assets/img/generative-design-cover.jpg",
    // no `model` field -> the card window plays this video instead of a 3D viewer
    video: "assets/video/generative-design.mp4",
    hero:
      "FEA-driven topology optimization that grows the lightest structure a " +
      "load path allows — I use it to optimize the parts across my projects.",
    specs: [
      { label: "Method", value: "FEA topology optimization" },
      { label: "Optimized part", value: "21 g · 19,640 mm³ (ABS)" },
      { label: "Min safety factor", value: "2.24" },
      { label: "Max von Mises", value: "8.95 MPa" },
      { label: "Tool", value: "Fusion 360 · 34 iterations" },
    ],
    tags: ["Fusion 360", "Topology optimization", "DfAM", "3D printing", "FEA"],
    sections: [
      {
        title: "Prints with zero added supports",
        body:
          "The optimized legs carry their own support geometry, so the slicer " +
          "adds none — a full set prints in 2 h 35 m with barely any waste, " +
          "orientation-optimised for additive manufacturing.",
        image: "assets/img/generative-design-print.jpg",
      },
      {
        title: "Applied across every design",
        body:
          "Fusion's generative engine tests thousands of FEA-driven candidates " +
          "and keeps only the material the loads need — the same method that " +
          "takes industry brackets 40% lighter and 20% stronger.",
        image: null,
      },
    ],
  },

  {
    id: "spot",
    title: "Boston Dynamics Spot",
    tagline: "High-fidelity reconstruction from orthographic references",
    category: "CAD / Reverse Engineering",
    year: "2024",
    accent: "#9aa3b2",
    poster: "assets/img/spot-cover.jpg",
    video: "assets/video/spot.mp4",
    model: "assets/models/Spot.glb",
    cameraOrbit: "30deg 78deg auto",
    hero:
      "A high-fidelity CAD reconstruction of Boston Dynamics' Spot, built " +
      "purely from orthographic references — sketching, tolerance and how a " +
      "mechanism's parts actually interact.",
    specs: [
      { label: "Method", value: "Orthographic reconstruction" },
      { label: "Articulation", value: "4 legs × 3-DOF (12-DOF)" },
      { label: "Tool", value: "Fusion 360" },
      { label: "Reference platform", value: "14 kg payload · 1.6 m/s" },
    ],
    tags: ["Fusion 360", "Surface modelling", "Assembly design", "GD&T"],
    sections: [
      {
        title: "Flat views → working assembly",
        body:
          "Front / side / top references → fully-defined sketches → an assembly " +
          "whose legs articulate with correct clearances, not just a shell.",
        image: "assets/img/spot-2.png",
      },
      {
        title: "Tolerance-aware detailing",
        body:
          "Mating features modelled to real fits — parts that could plausibly " +
          "be manufactured and assembled, not merely intersect in CAD.",
        image: "assets/img/spot-front.png",
      },
    ],
  },

  {
    id: "poultry-farm",
    title: "Poultry Farm Design",
    tagline: "Internship · 41-ft Pratt truss for a 40,000 sq-ft poultry shed",
    category: "Structural Design / FEA",
    year: "2022",
    accent: "#d0584a",
    poster: "assets/img/poultry-farm-cover.jpg",
    // no `model` field -> the card window plays this render walkthrough in the
    // centre viewer instead of a 3D model.
    video: "assets/video/poultry-truss.mp4",
    // Card loop: play to the end, dissolve to the cover photo, hold ~1s, replay.
    posterHold: 1000,
    hero:
      "A 41-foot Pratt roof truss I designed and helped fabricate as a design " +
      "engineer at ISOLogic — sized in FEA, then cut, welded and machined with " +
      "the team into the steel frame of a 40,000 sq-ft poultry-farm shed.",
    specs: [
      { label: "Structure", value: "41-ft Pratt roof truss" },
      { label: "Material", value: "Mild steel · fy ≈ 207 MPa" },
      { label: "Max von Mises", value: "11.85 MPa" },
      { label: "Min safety factor", value: "≥ 15" },
      { label: "Peak deflection", value: "0.32 mm" },
      { label: "Analysis", value: "Autodesk Inventor FEA" },
    ],
    tags: ["Autodesk Inventor", "FEA", "Steel structures", "Welding", "GD&T"],
    sections: [
      {
        title: "Sized in FEA, then welded into place",
        body:
          "Static stress analysis under the full roof load held peak stress at " +
          "11.85 MPa — a safety factor above 15 with just 0.32 mm of deflection " +
          "across the span — before the frame was cut, welded and machined on site.",
        image: "assets/img/poultry-truss-cad.jpg",
      },
      {
        // RESERVED slot for the FEA stress-animation clip. When it's ready, drop
        // the file in assets/video and swap `placeholder` for:
        //   video: "assets/video/poultry-sim.mp4",
        title: "Structural FEA simulation",
        body:
          "An animated stress and displacement study of the truss under load — " +
          "showing where the frame carries, and sheds, the roof forces.",
        placeholder: "FEA simulation clip — coming soon",
      },
    ],
  },

  {
    id: "excavator",
    title: "Excavator Arm",
    tagline: "Hydraulic arm assembly — kinematics & mechanism design",
    category: "Mechanism Design",
    year: "2024",
    accent: "#ffb347",
    poster: "assets/img/excavator-cover.jpg",
    video: "assets/video/excavator-render.mp4",
    model: "assets/models/Escavator.glb",
    cameraOrbit: "-30deg 76deg auto",
    exposure: 0.4, // lighter (yellow) model — dim the viewer so it reads naturally
    hero:
      "A full hydraulic excavator arm — boom, stick and bucket — modelled as " +
      "a working linkage and animated through its complete range of motion.",
    specs: [
      { label: "Mechanism", value: "3-stage hydraulic linkage" },
      { label: "Motion", value: "3-DOF (boom · stick · bucket)" },
      { label: "Tool", value: "Fusion 360" },
      { label: "Output", value: "Motion study + drawings" },
    ],
    tags: ["Fusion 360", "Kinematics", "Linkage design", "Motion study"],
    sections: [
      {
        title: "A linkage that actually moves",
        body:
          "Jointed as a real hydraulic linkage so it sweeps the full working " +
          "envelope — the fastest way to catch interference and load paths.",
        image: "assets/img/excavator-2.jpg",
      },
      {
        title: "Documented for manufacture",
        body: "Taken through to dimensioned engineering drawings — concept to buildable.",
        image: "assets/img/excavator-blueprint.jpg",
      },
    ],
  },

  {
    id: "foot-gesture-hmi",
    hidden: true, // no real render yet — stored for later, not shown in the carousel
    title: "Foot-Gesture HMI",
    tagline: "Hands-free robot control through computer vision",
    category: "Computer Vision / Controls",
    year: "2025",
    accent: "#37d6a7",
    poster: "assets/img/foot-gesture-hmi.svg",
    video: null,
    hero:
      "A hands-free human–machine interface for a medical robot that turns " +
      "foot gestures into real-time control commands — so a surgeon's hands " +
      "never have to leave the task.",
    specs: [
      { label: "Input", value: "Foot gestures (vision)" },
      { label: "Logic", value: "Finite state machine" },
      { label: "Stack", value: "Python · OpenCV · ROS 2" },
      { label: "Comms", value: "UDP" },
    ],
    tags: ["OpenCV", "Python", "ROS 2", "FSM", "Real-time CV"],
    sections: [
      {
        title: "Reliable under fast motion and occlusion",
        body:
          "The recognition pipeline is a finite state machine with temporal " +
          "filtering, baseline calibration and tracking-loss tolerance. That " +
          "combination keeps gesture recognition dependable even when the foot " +
          "moves quickly or is partially hidden — the difference between a demo " +
          "and something usable in an operating room.",
        image: null,
      },
      {
        title: "Designed as a control interface, not a toy",
        body:
          "Gestures map to discrete robot commands over UDP, with calibration " +
          "that adapts to each user's neutral pose so the system feels " +
          "predictable rather than twitchy.",
        image: null,
      },
    ],
  },

  {
    id: "robot-hand",
    title: "Anthropomorphic Hand",
    tagline: "Under-actuated fingers that grasp like a human hand",
    category: "Mechanism Design",
    year: "2024",
    accent: "#ff8a5b",
    poster: "assets/img/hand-cover.jpg",
    video: "assets/video/hand.mp4",
    model: "assets/models/humanoid-hand.glb",
    cameraOrbit: "15deg 78deg auto",
    exposure: 0.4,
    hero:
      "An anthropomorphic hand whose fingers trace a human-like grasp — one " +
      "motor driving an under-actuated linkage.",
    specs: [
      { label: "Mechanism", value: "Dual four-bar linkage" },
      { label: "Actuation", value: "Under-actuated · 1 linear motor" },
      { label: "Coupling", value: "MCP → PIP → DIP" },
      { label: "Tool", value: "Fusion 360" },
    ],
    tags: ["Fusion 360", "Under-actuation", "Four-bar linkage", "Biomechanics"],
    sections: [
      {
        title: "One input, human-like motion",
        body:
          "Each finger is a pair of four-bars: driving the MCP curls PIP and " +
          "DIP dependently, so a single motor traces a natural, compliant " +
          "grasp — no motor per joint.",
        image: null,
      },
    ],
  },

  {
    id: "traction-motor",
    hidden: true, // no real render yet — stored for later, not shown in the carousel
    title: "E-Traction Motor",
    tagline: "Modular electric motor housing — parametric CAD + FEA",
    category: "Electromobility / FEA",
    year: "2024",
    accent: "#c07bff",
    poster: "assets/img/traction-motor.svg",
    video: null,
    hero:
      "A modular electric traction-motor housing, built parametrically so one " +
      "model scales across motor sizes, then validated and lightened with " +
      "structural FEA.",
    specs: [
      { label: "Tools", value: "Creo · ANSYS Mechanical" },
      { label: "Approach", value: "Parametric modelling" },
      { label: "Mass saved", value: "≈ 10–15%" },
      { label: "Domain", value: "Electromobility" },
    ],
    tags: ["Creo", "ANSYS", "FEA", "Parametric CAD", "Lightweighting"],
    sections: [
      {
        title: "One model, many motor sizes",
        body:
          "The housing, stator support and mounting fixtures are fully " +
          "parametric, so a change in motor size ripples through the geometry " +
          "automatically. That makes design iteration a matter of numbers, not " +
          "remodelling.",
        image: null,
      },
      {
        title: "Lighter, without losing the safety factor",
        body:
          "Static strength analysis under torque-induced loads pinpointed the " +
          "stress-critical regions. Targeted geometry optimisation cut roughly " +
          "10–15% of the mass while keeping the safety factors intact and " +
          "improving manufacturability.",
        image: null,
      },
    ],
  },

  {
    id: "lockheed",
    title: "Lockheed L-1011 TriStar",
    tagline: "Structural surface model of a wide-body airframe",
    category: "Surface Modelling",
    year: "2024",
    accent: "#5fb0d8",
    poster: "assets/img/lockheed-cover.jpg",
    video: "assets/video/lockheed-tristar.mp4",
    model: "assets/models/Lockheed.glb", // Draco-compressed (62MB -> 3MB) for web
    cameraOrbit: "35deg 68deg auto",
    exposure: 0.4,
    hero:
      "A structural surface model of the Lockheed L-1011 TriStar — " +
      "constraint-based modelling of the real wing / fuselage / tail joinery.",
    specs: [
      { label: "Method", value: "Surface modelling" },
      { label: "Reference", value: "L-1011 TriStar (trijet)" },
      { label: "Span · length", value: "47 m · 54 m" },
      { label: "Powerplant", value: "3 × Rolls-Royce RB211" },
    ],
    tags: ["Surface modelling", "Assembly design", "Aerostructures"],
    sections: [
      {
        title: "Where the surfaces meet",
        body:
          "Constraint-based modelling of the real joinery — how the wing roots " +
          "into the fuselage and the empennage attaches — not one approximated skin.",
        image: "assets/img/lockheed-2.png",
      },
      {
        title: "Documented as drawings",
        body: "Taken through to dimensioned engineering drawings.",
        image: "assets/img/lockheed-drawing.jpg",
      },
    ],
  },

  {
    id: "beverage-machine",
    hidden: true, // no real render yet — stored for later, not shown in the carousel
    title: "Beverage Automation",
    tagline: "Project Thesis · Mechatronic subsystems, built and validated",
    category: "Mechatronics",
    year: "2025",
    accent: "#ffd24d",
    poster: "assets/img/beverage-machine.svg",
    video: null,
    hero:
      "An automated beverage-mixing machine where I designed, built and " +
      "validated the mechatronic subsystems end to end — and halved both the " +
      "cost and the debug time along the way.",
    specs: [
      { label: "Cost", value: "5000€ → 3000€ (−40%)" },
      { label: "Print time", value: "13 h → 6 h" },
      { label: "Actuator speed", value: "30 → 72 mm/s" },
      { label: "Dispensing force", value: "10 N sustained" },
      { label: "Control", value: "Raspberry Pi · Python" },
    ],
    tags: ["Mechatronics", "Raspberry Pi", "DFM/DFA", "Sheet metal", "Perfboard"],
    sections: [
      {
        title: "A linkage that multiplies speed",
        body:
          "A grasshopper-linkage speed multiplier raised the actuator's output " +
          "speed from 30 to 72 mm/s while still sustaining the 10 N force needed " +
          "to dispense — buying speed from geometry instead of a bigger, " +
          "costlier motor.",
        image: null,
      },
      {
        title: "Modular, Lego-style parts",
        body:
          "Designing components with Lego-style fitment enabled rapid part " +
          "swaps and design iteration. Optimised geometry removed the need for " +
          "print supports, cutting print time from 13 to 6 hours and slashing " +
          "material waste.",
        image: null,
      },
      {
        title: "Half the wiring headaches",
        body:
          "A custom perfboard control circuit streamlined the wiring and cut " +
          "testing and debugging time by 50%. Drawing the full electrical " +
          "schematic before procurement kept sourcing efficient and the project " +
          "on schedule.",
        image: null,
      },
    ],
  },
];

// The visible carousel = only projects that have real media (not `hidden`).
const PROJECTS = ALL_PROJECTS.filter((p) => !p.hidden);

/* ---- Timeline: education + experience (newest first) --------------------- */
const TIMELINE = [
  {
    period: "03/2026 — Present",
    title: "Master Thesis — 7-DOF Robotic Arm",
    org: "Factory Automation & Production Systems, Nürnberg",
    kind: "work",
    note:
      "Building a custom 7-DOF, 10 kg-payload robotic system (< 20 arcmin " +
      "backlash) — CANopen CiA 402 control, Gazebo torque sizing, ROS 2 " +
      "workflow automated with Claude Code.",
  },
  {
    period: "06/2025 — 01/2026",
    title: "Project Thesis — Beverage Automation",
    org: "Factory Automation & Production Systems, Nürnberg",
    kind: "work",
    note:
      "Designed and validated mechatronic subsystems; −40% cost, −50% debug " +
      "time, grasshopper speed-multiplier linkage.",
  },
  {
    period: "10/2023 — Present",
    title: "M.Sc. Electromobility",
    org: "FAU Erlangen, Germany",
    kind: "edu",
    note: "Focus on robotics, product design and electric drivetrains.",
  },
  {
    period: "08/2022 — 12/2022",
    title: "Design Engineer",
    org: "ISOLogic Automation, Tiruppur",
    kind: "work",
    note:
      "Designed and manufactured a 41-ft Pratt truss for a 40,000 sq-ft " +
      "industrial shed — cutting, welding, machining, post-processing.",
  },
  {
    period: "02/2022 — 07/2022",
    title: "Programmer Analyst Trainee",
    org: "Cognizant Technology Solutions, Chennai",
    kind: "work",
    note:
      "Automated testing with Selenium & TestNG; cut post-release defects " +
      "by 15%.",
  },
  {
    period: "07/2018 — 06/2022",
    title: "B.Tech. Mechanical Engineering",
    org: "VIT, Vellore",
    kind: "edu",
    note:
      "Bachelor thesis: autonomous navigation retrofit for medical " +
      "wheelchairs (ROS, Gazebo, SLAM).",
  },
];

/* ---- About ---------------------------------------------------------------- */
const ABOUT = {
  name: "Praveen Vighnesh S T",
  role: "Mechatronics & Robotics Engineer",
  location: "Nuremberg, Germany",
  email: "praveenthamilarasu@gmail.com",
  linkedin: "https://www.linkedin.com/", // TODO: replace with your LinkedIn URL
  blurb:
    "I design actuated robotic hardware and bring it up in ROS 2 and Gazebo — " +
    "hands-on across the full stack: mechanical design, motion control, " +
    "embedded integration and real-time computer vision. I'm finishing an " +
    "M.Sc. in Electromobility at FAU Erlangen, and I'm drawn to the place " +
    "where robotics and electromobility meet.",
  skills: [
    { group: "Robotics", items: "ROS 2 (Jazzy) · ros2_control · MoveIt 2 · Gazebo · Isaac Sim · OpenCV" },
    { group: "Electronics", items: "KiCad · Altium · Arduino · Raspberry Pi 5 · UART · PID/PLC" },
    { group: "CAD & Sim", items: "Fusion 360 · SolidWorks · Siemens NX · CREO · CATIA · Ansys · Simulink" },
    { group: "Fabrication", items: "3D printing · sheet metal · laser cutting · CNC · welding · soldering" },
    { group: "Code", items: "Python · C++ · PyTorch · Claude Code · Git" },
  ],
  languages: "German (B1) · English (C1) · Tamil (C2, native)",
  resumes: [
    { label: "Résumé", href: "assets/resume/Praveen-Vighnesh-Robotics-CV.pdf" },
  ],
  // shown after the Résumé button, in this order
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/praveen-vighnesh-s-t-5497421aa/", icon: "linkedin" },
    { label: "GitHub", href: "https://github.com/PraveenVighnesh-ST", icon: "github" },
    { label: "GrabCAD", href: "https://grabcad.com/praveen.vighnesh.s.t-1", icon: "grabcad" },
    { label: "YouTube", href: "https://www.youtube.com/@praveenvigheshst", icon: "youtube" },
    { label: "Instagram", href: "https://www.instagram.com/graphite_with_life/", icon: "instagram" },
  ],
};

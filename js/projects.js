/* =============================================================================
   projects.js  —  Single source of truth for all portfolio content.

   HOW TO EDIT (no coding required):
   - Each object in PROJECTS is one card in the carousel + one detail window.
   - To swap a placeholder for your real render, drop the file into assets/img
     (or assets/video) and update the `poster` / `video` path below.
   - `video` plays on hover and freezes to `poster` on mouse-out. Set to null
     if the project has no video yet.
   - `sections` render as the Apple-style stacked blocks in the detail window.
   - `model` (optional) is a path to a .glb file shown in the interactive
     3D viewer. Leave it out (or null) to hide the viewer for that project.
   ========================================================================== */

const PROJECTS = [
  {
    id: "robotic-arm",
    title: "7-DOF Robotic Arm",
    tagline: "Master Thesis · Custom actuated hardware, brought up in ROS 2",
    category: "Robotics / Mechatronics",
    year: "2026",
    accent: "#4da3ff",
    poster: "assets/img/robotic-arm.png",
    // Real alpha render (VP9/WebM, transparent) tried first; excavator.mp4 is
    // a placeholder fallback for the rare browser that can't decode VP9 alpha.
    video: ["assets/video/robot.webm", "assets/video/excavator.mp4"],
    model: "assets/models/robotic-arm.glb", // drop your GLB here to enable 3D viewer
    hero:
      "A ground-up 7-DOF robotic system with a 10 kg payload, engineered for " +
      "under 20 arcmin of backlash — designed mechanically, sized from " +
      "simulated joint torques, and brought up as a full ROS 2 stack.",
    specs: [
      { label: "Degrees of freedom", value: "7-DOF" },
      { label: "Payload", value: "10 kg" },
      { label: "Backlash target", value: "< 20 arcmin" },
      { label: "Control", value: "CANopen CiA 402" },
      { label: "Stack", value: "ROS 2 Jazzy · ros2_control" },
      { label: "Simulation", value: "Gazebo" },
    ],
    tags: ["ROS 2", "CANopen", "Gazebo", "ros2_control", "STM32", "Fusion 360"],
    sections: [
      {
        title: "Sizing the joints from physics, not guesswork",
        body:
          "I simulated dynamic joint motion in Gazebo with ros2_control, " +
          "assigning realistic link masses and inertias to quantify the peak " +
          "torque demand at each joint under load. Those numbers drove the " +
          "motor and bearing sizing calculations directly — the mechanics are " +
          "dimensioned to the loads they actually see, not to a safety-factor " +
          "guess.",
        image: null,
      },
      {
        title: "Smooth multi-axis motion over CANopen",
        body:
          "Motor control uses the CANopen CiA 402 profile in interpolated " +
          "position (mode 7) and cyclic synchronous position (mode 8) modes, " +
          "so every axis moves in a synchronized, jerk-limited trajectory " +
          "rather than fighting each other point-to-point.",
        image: null,
      },
      {
        title: "Automating the boring half of ROS 2",
        body:
          "I used Claude Code to programmatically generate the repetitive parts " +
          "of the ROS 2 workflow — Xacro, launch files, and package " +
          "configuration. That cut simulation setup time sharply and made the " +
          "debug loop fast enough to actually iterate on the hard problems.",
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
    poster: "assets/img/spot.png",
    video: null,
    hero:
      "A high-fidelity CAD reconstruction of Boston Dynamics' Spot, modelled " +
      "purely from orthographic reference drawings — an exercise in disciplined " +
      "sketching, tolerance, and how a mechanism's parts truly interact.",
    specs: [
      { label: "Method", value: "Orthographic reconstruction" },
      { label: "Tool", value: "Fusion 360" },
      { label: "Focus", value: "Joint articulation · tolerance" },
      { label: "Legs", value: "4 × 3-DOF" },
    ],
    tags: ["Fusion 360", "Surface modelling", "Assembly design", "GD&T"],
    sections: [
      {
        title: "From flat views to a working assembly",
        body:
          "Starting from front, side and top reference images, I built simple, " +
          "fully-defined sketches and reconstructed each body so the legs " +
          "articulate correctly. The goal wasn't just a pretty shell — it was " +
          "an assembly whose joints, clearances and part interactions behave " +
          "like the real machine.",
        image: "assets/img/spot-2.png",
      },
      {
        title: "Tolerance-aware detailing",
        body:
          "Every mating feature was modelled with real tolerances and fits in " +
          "mind, so the components could plausibly be manufactured and " +
          "assembled rather than merely intersecting in CAD.",
        image: "assets/img/spot-front.png",
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
    poster: "assets/img/excavator.jpg",
    video: "assets/video/excavator.mp4",
    hero:
      "A full hydraulic excavator arm assembly — boom, stick and bucket — " +
      "modelled as a working linkage and animated through its complete range " +
      "of motion to study the mechanism's kinematics.",
    specs: [
      { label: "Type", value: "3-stage hydraulic linkage" },
      { label: "Tool", value: "Fusion 360" },
      { label: "Output", value: "Motion study + blueprint" },
    ],
    tags: ["Fusion 360", "Kinematics", "Linkage design", "Motion study"],
    sections: [
      {
        title: "A linkage that actually moves",
        body:
          "The boom, stick and bucket are jointed as a real hydraulic linkage " +
          "so the assembly sweeps through its full working envelope. Watching " +
          "the mechanism move is the fastest way to catch interference and " +
          "understand where the forces concentrate.",
        image: "assets/img/excavator-2.jpg",
      },
      {
        title: "Documented for manufacture",
        body:
          "Alongside the 3D model I produced dimensioned engineering drawings, " +
          "closing the loop from concept to a set of documents someone could " +
          "actually build from.",
        image: "assets/img/excavator-blueprint.jpg",
      },
    ],
  },

  {
    id: "foot-gesture-hmi",
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
    poster: "assets/img/robot-hand.svg",
    video: null,
    hero:
      "An anthropomorphic robotic hand whose fingers reproduce a human-like " +
      "grasping trajectory — using a clever under-actuated linkage driven by a " +
      "single motor.",
    specs: [
      { label: "Mechanism", value: "Dual four-bar linkage" },
      { label: "Actuation", value: "Under-actuated, 1 linear motor" },
      { label: "Joints", value: "MCP → PIP → DIP coupled" },
      { label: "Tool", value: "Fusion 360" },
    ],
    tags: ["Fusion 360", "Under-actuation", "Four-bar linkage", "Biomechanics"],
    sections: [
      {
        title: "One input, human-like motion",
        body:
          "Each finger is a pair of four-bar linkages. Driving the MCP joint " +
          "moves the PIP and DIP joints dependently, so a single linear motor " +
          "traces the same curling trajectory a human finger follows before it " +
          "touches an object. Under-actuation buys natural, compliant grasping " +
          "without a motor per joint.",
        image: null,
      },
    ],
  },

  {
    id: "traction-motor",
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
    poster: "assets/img/lockheed.png",
    video: null,
    hero:
      "A structural surface model of the Lockheed L-1011 TriStar, using " +
      "parametric, constraint-based modelling to reproduce realistic joints " +
      "between wing, fuselage and tail.",
    specs: [
      { label: "Method", value: "Surface modelling" },
      { label: "Focus", value: "Structural assembly" },
      { label: "Domain", value: "Aerodynamics" },
    ],
    tags: ["Surface modelling", "Assembly design", "Aerostructures"],
    sections: [
      {
        title: "Where the surfaces meet",
        body:
          "The interesting engineering in an airframe is the joinery — how the " +
          "wing roots into the fuselage, how the empennage attaches. I used " +
          "constraint-based modelling to replicate those junctions realistically " +
          "rather than approximating them as a single skin.",
        image: "assets/img/lockheed-2.png",
      },
      {
        title: "Documented as drawings",
        body:
          "The model was taken through to engineering drawings, keeping the " +
          "work grounded in something buildable and dimensioned.",
        image: "assets/img/lockheed-drawing.jpg",
      },
    ],
  },

  {
    id: "beverage-machine",
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
  socials: [
    { label: "GitHub", href: "https://github.com/PraveenVighnesh-ST", icon: "github" },
    { label: "GrabCAD", href: "https://grabcad.com/praveen.vighnesh.s.t-1", icon: "grabcad" },
    { label: "YouTube", href: "https://www.youtube.com/@praveenvigheshst", icon: "youtube" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/praveen-vighnesh-s-t-5497421aa/", icon: "linkedin" },
  ],
};

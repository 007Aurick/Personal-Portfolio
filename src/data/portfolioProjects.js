/**
 * Grid project cards + detail pages.
 * Add your YouTube video ID or full URL to `youtubeVideoId` for each project.
 * Text sections (description, overview, etc.) use bullet arrays for detail pages.
 */
import { parseYouTubeId } from '../utils/youtube';

const rawProjects = [
  {
    id: 16,
    slug: 'magnusbot',
    title: 'MagnusBot - Cal Hacks 13.0',
    category: 'ROBOTICS',
    year: '2026',
    projectType: 'Hackathon Project',
    description:
      'Turns a Chess.com game into over-the-board chess: vision reads your moves, and two robot arms play the opponent back on a real board.',
    image: '/Chess.jpg',
    imageObjectPosition: 'center 62%',
    youtubeVideoId: 'https://www.youtube.com/watch?v=v8jfX0UGEMg',
    technologies: [
      'LeRobot',
      'RF-DETR',
      'Roboflow',
      'OpenCV',
      'Next.js',
      'React',
      'TypeScript',
      'Claude',
    ],
    projectUrl: 'https://devpost.com/software/magnusbot',
    ctaLabel: 'View Devpost',
    secondaryLabel: 'View GitHub',
    secondaryUrl: 'https://github.com/MightyTMZ/magnus_bot',
    overview: [
      'Built at Cal Hacks 13.0 so a Chess.com game can be played on a physical board and still count toward rating.',
      'You sit at a real board and move real pieces. A vision model records the move and plays it on Chess.com, then two robot arms play the opponent’s reply.',
      'Chose Chess.com after asking 80 players at the hackathon which site they use. 71 said Chess.com.',
    ],
    challenge: [
      'The vision model is the whole system. A missed piece or a wrong square becomes a bad move, a bad arm path, and a broken game.',
      'Neither SO-101 arm can reach the full board, so moves that cross the middle have to be handed from one arm to the other.',
      'Chess.com renders the board in the client, so the live game cannot be read from a simple response.',
    ],
    solution: [
      'Trained an RF-DETR detector in Roboflow on 436 images, including frames where pieces in view are off the board and should stay unlabeled. Ran the weights locally.',
      'Calibrated the four corners with OpenCV, projected a square grid, and recorded a move from the piece that left a square and the piece that arrived.',
      'Split the board between two SO-101 arms in LeRobot, with analytic inverse kinematics and a hand-off zone. Each arm was camera-calibrated from a green fingertip, with a grasp angle and grip strength per piece.',
      'Screenshotted the Chess.com board and skipped unchanged frames with a 0.1% byte difference. When the board changed, Claude Vision read the new move, or the page coordinates of the square to click.',
      'Added a jump back to the same Chess.com game, so the player can finish in the browser if the clock is low or an arm misses.',
    ],
    technical: [
      'Two SO-101 arms on LeRobot, with closed-form inverse kinematics and a hand-off region because each arm only covers half the board.',
      'RF-DETR trained in Roboflow on about 450 images and run locally from downloaded weights: 98.3% mAP, 97.9% precision, and 99.1% recall.',
      'OpenCV corner calibration and a projected grid turn a before-and-after detection into a chess move.',
      'A Next.js app screenshots the board about once a second. A raw buffer compare at a 0.1% byte threshold drops unchanged frames before they reach Claude Vision.',
      'Used classical motion planning instead of reinforcement learning, so each arm path stays explainable inside a hackathon.',
    ],
    outcomes: [
      'Played Chess.com on a physical board: vision in, arms out, and a path back to the same game in the browser.',
      'Local weights removed the latency of running detection in the cloud.',
      'A cheap pixel diff kept vision calls to frames that actually changed.',
      'Next step is one longer arm so cross-board moves do not need a hand-off, plus tighter calibration and faster servos.',
    ],
  },
  {
    id: 14,
    slug: 'nl-robot',
    title: 'NL-Robot - Hack the North 2026',
    category: 'ROBOTICS',
    year: '2026',
    projectType: 'Hackathon Project',
    description:
      'Upload your URDF file and tell the robot what to do in plain English, and watch it execute the plan in a 3D simulation.',
    image: '/NLRobot.jpg',
    youtubeVideoId: 'https://www.youtube.com/watch?v=3C0IwcF55WU',
    technologies: [
      'ROS 2 Humble',
      'Gazebo Fortress',
      'Next.js',
      'React',
      'Three.js',
      'TypeScript',
      'FastAPI',
      'Python',
      'Anthropic API',
      'Docker',
    ],
    projectUrl: 'https://github.com/007Aurick/NL-ROBOT',
    ctaLabel: 'View GitHub',
    overview: [
      'Built an end-to-end robot testing workspace that replaces hand-written ros2 topic commands with a natural-language command box.',
      'Combined a Next.js and Three.js viewport, a FastAPI bridge, and a real ROS 2 graph so plans run on the same interfaces used on hardware.',
      'Designed it as a port from an earlier PyBullet simulator onto ROS 2 Humble and Gazebo Fortress, so a plan that works here maps onto real robots.',
    ],
    challenge: [
      'Turning free-form English into motions a robot can actually run without letting the model write code or touch physics.',
      'Keeping the web UI in sync with a live simulator while leaving the ROS graph inside one container, so DDS never crosses the WSL2 boundary.',
      'Driving a diff-drive base and a 4-DOF arm through genuine topics and actions (/cmd_vel, /odom, /scan, FollowJointTrajectory) from a headless Gazebo process.',
      'Sensing obstacles without a GPU lidar, which would publish nothing in a container with no display.',
      'Picking up objects when Gazebo Fortress cannot attach a joint at runtime to models spawned after the robot.',
    ],
    solution: [
      'Connected a browser workspace to a FastAPI and rclpy bridge over HTTP and one WebSocket snapshot at about 30 Hz.',
      'Used Claude, with an Ollama fallback and a regex parser, to return a structured plan of skills and optional world edits.',
      'Validated every step before execution: resolve object names, match joints, drop skills the robot cannot do, and surface warnings.',
      'Ran skills on a 20 Hz executor that publishes velocity commands, sends joint trajectories, and closes motion on odometry.',
      'Streamed pose, joints, lidar, and the planned path into a Three.js viewport loaded from the robot URDF, with orbit, pan, and drag-to-edit tools.',
      'Synthesized a 360° LaserScan by raycasting live Gazebo poses, and carried grasped objects kinematically when a physics attach was not available.',
    ],
    technical: [
      'Developed in TypeScript and Python using Next.js 15, React 19, Three.js, FastAPI, rclpy, ros2_control, ros_gz_bridge, and Gazebo Fortress.',
      'Packaged Gazebo, the ROS graph, and the backend in one Docker container; the frontend runs on the host at port 3000 and talks only to port 8000.',
      'Modeled a TurtleBot3 with an OpenMANIPULATOR-X and a custom nlbot URDF: differential-drive base, arm, and gripper.',
      'Implemented skills for drive, turn, go-to, face, obstacle avoidance, joint goals, inverse kinematics, grasp and release, plus wait, stop, and repeat.',
      'Solved arm placement with closed-form forward and inverse kinematics, then sent the result as a FollowJointTrajectory goal.',
      'Added a map mode so the planner only edits the world (maze, warehouse, court) and a console that logs live ROS commands and telemetry.',
    ],
    outcomes: [
      'Built a working path from a sentence to motion: language, plan validation, ROS execution, and a live 3D view.',
      'Strengthened experience with robotics software, simulation, and the split between real ROS interfaces and approximations that keep a headless sim usable.',
      'Gained hands-on practice connecting a web product to /cmd_vel, odometry, joint control, and lidar without leaving the simulator.',
      'Created a base for later work in Nav2 localization, real GPU lidar, effort control, and sim-to-real transfer onto hardware that already speaks these topics.',
    ],
  },
  {
    id: 1,
    slug: 'autonomous-self-driving-carla',
    title: 'Autonomous Self-Driving Vehicle with CARLA',
    category: 'Computer Vision',
    year: '2026',
    description: 'Developing an autonomous driving dashboard in CARLA that performs real-time object detection and decision making.',
    image: '/SelfDriving.png',
    youtubeVideoId: 'https://www.youtube.com/watch?v=ueAmlV6UAzs',
    technologies: ['CARLA', 'YOLOv11', 'PyTorch', 'OpenCV', 'NumPy', 'Pandas'],
    projectUrl: 'https://github.com/AurickAnwar/Autonomous-Self-Driving-Vehicle',
    overview: [
      'Built an autonomous vehicle simulation using the CARLA simulator to replicate a self-driving vehicle workflow in a virtual environment.',
      'Combined computer vision, real-time vehicle telemetry, and machine learning to simulate perception and driving decision analysis.',
      'Designed to explore how autonomous systems connect simulation, perception, and control in robotics.',
    ],
    challenge: [
      'Running real-time object detection while keeping the CARLA simulation responsive.',
      'Synchronizing camera sensor input with vehicle movement and prediction logic.',
      'Collecting reliable driving telemetry for machine learning training.',
      'Spawning vehicles safely without collisions and maintaining stable simulation state.',
      'Processing perception and control outputs simultaneously without interrupting the simulator.',
    ],
    solution: [
      'Connected a CARLA simulation environment with a Tesla Model 3 ego vehicle and attached RGB camera sensors.',
      'Used YOLOv11 to detect surrounding objects directly from the live camera feed.',
      'Collected vehicle telemetry including speed, acceleration, steering, throttle, and braking into a structured CSV dataset.',
      'Trained a PyTorch neural network to classify driving direction probabilities (idle, left, right, forward, reverse).',
      'Displayed live telemetry and prediction probabilities directly on the camera stream for real-time monitoring and debugging.',
    ],
    technical: [
      'Developed in Python using CARLA, OpenCV, Ultralytics YOLOv11, PyTorch, NumPy, and Pandas.',
      'Spawned and controlled vehicles dynamically using CARLA’s blueprint library and try_spawn_actor().',
      'Attached an RGB camera sensor and streamed frames from CARLA into OpenCV.',
      'Ran YOLO object detection on each frame and overlaid detections visually in real time.',
      'Trained a feedforward neural network using vehicle telemetry data with CrossEntropyLoss and Adam optimization.',
      'Generated softmax probabilities for predicted driving direction and displayed them live.',
      'Implemented a spectator-follow camera for third-person simulation debugging.',
      'Logged control data continuously to CSV for future training and analysis.',
    ],
    outcomes: [
      'Built a working end-to-end autonomous vehicle simulation pipeline from perception to decision prediction.',
      'Strengthened experience with robotics software, simulation environments, and real-time machine learning inference.',
      'Gained hands-on experience integrating computer vision with vehicle telemetry and autonomous system workflows.',
      'Created a foundation for future work in ROS2, SLAM localization, reinforcement learning, and sim-to-real robotics development.',
    ],
  },
  {
    id: 15,
    slug: 'stockfish-irl',
    title: 'Stockfish IRL',
    category: 'COMPUTER VISION',
    year: '2026',
    projectType: 'Solo Project',
    description:
      'Built a real-time CV system that tracks moves on a physical chessboard and calls out blunders using Stockfish.',
    image: '/Stockfish.png',
    youtubeVideoId: 'https://www.youtube.com/watch?v=bBJPEaXB1-M',
    technologies: [
      'Roboflow (RF-DETR)',
      'OpenCV',
      'python-chess',
      'Stockfish',
      'FastAPI',
      'React',
    ],
    projectUrl: 'https://github.com/007Aurick/Stockfish-IRL',
    ctaLabel: 'View GitHub',
    overview: [
      'Built a live over-the-board chess analysis system that turns a phone camera pointed at a real board into a chess.com-style game review.',
      'Combined object detection, perspective geometry, chess-rule reasoning, and engine analysis into a single real-time pipeline.',
      'Designed to explore how computer vision can be made reliable in messy real-world conditions by pairing an imperfect model with domain logic.',
    ],
    challenge: [
      'Training a detector to recognize small chess pieces from an angled camera, where pieces block each other and back-rank pieces are partly hidden.',
      'An initial model trained mostly on a public dataset of a different board and piece set failed on the real board, predicting the same class for almost every piece.',
      'Mapping detections from a tilted camera view onto the correct squares of an 8×8 board.',
      'Reliably detecting moves despite hands over the board, flickering detections, and occasionally mislabeled pieces.',
    ],
    solution: [
      'Rebuilt the dataset from videos of games on my own board, extracting frames at 1 FPS and auto-labeling them on Roboflow, then trained an RF-DETR model that reached 93.5% mAP.',
      'Calibrated the board with a 4-corner homography, warping the camera view into a top-down grid and mapping each piece’s base to its square.',
      'Designed move detection around chess logic instead of trusting class labels: the system keeps the true game state in memory and finds the legal move that best explains the observed board.',
      'Integrated Stockfish to rate every move by centipawn loss and announce blunders, checks, and checkmate by voice.',
    ],
    technical: [
      'Developed in Python using Roboflow (RF-DETR), Supervision, OpenCV, python-chess, Stockfish, and FastAPI, with a React dashboard.',
      'Trained RF-DETR Medium on 223 images of my own board (537 after augmentation), with brightness, exposure, blur, and noise augmentations at 1024 resolution.',
      'Computed a perspective transform with cv2.getPerspectiveTransform from calibrated corners, mapping each detection’s bottom-center point to a square name (e.g. “e4”).',
      'Reduced each frame to a white/black occupancy map and scored every legal move by how many squares mismatched the camera, selecting the lowest-mismatch move only when it beat the “no move” baseline.',
      'Added a stability filter requiring 3 identical readings (~1.5s) before accepting a move, filtering out hands, mid-move pieces, and detection flicker.',
      'Rated moves by evaluating each position with Stockfish before and after the move, converting scores to the mover’s perspective, and classifying the drop as an inaccuracy, mistake, or blunder.',
      'Built a FastAPI backend that runs the vision pipeline in a background thread, streams the annotated feed as MJPEG (/video), and exposes game state (/state) and new-game control (/reset).',
      'Organized the system into modular scripts: calibrate.py, board.py, moves.py, engine.py, camera.py, and Server.py.',
    ],
    outcomes: [
      'Built a working end-to-end system that tracked a full game on a physical board, flagged the losing blunder, and announced checkmate in real time.',
      'Improved detection from a model that failed on the real board to 93.5% mAP, 94.1% precision, and 85.1% recall by fixing the data rather than the architecture.',
      'Strengthened experience with computer vision, camera calibration, real-time pipelines, and backend development with FastAPI.',
      'Learned to design around model limitations, using domain constraints to correct for missed and mislabeled detections.',
      'Created a foundation for future work, including automatic board detection, a robotic arm that plays the engine’s moves, and a full game-review dashboard with evaluation graphs.',
    ],
  },
  {
    id: 10,
    slug: 'breast-cancer-cell-detection',
    title: 'Breast Cancer Cell Detection',
    category: 'Machine Learning',
    year: '2026',
    projectType: 'Solo Project',
    description:
      'Building a medical AI pipeline that detects breast cancer tumors using YOLO and predicts with Grad-CAM heatmaps.',
    image: '/CellDetection2.png',
    imageObjectPosition: 'left top',
    imageFocusLeft: true,
    detailImages: [
      {
        src: '/CellDetection1.png',
        alt: 'Benign classification with Grad-CAM heatmap',
        caption: 'Benign · 86.35%',
      },
      {
        src: '/BreastCancerYOLO.png',
        alt: 'YOLO tumor detection on mammogram',
        caption: 'YOLO detection',
      },
    ],
    technologies: ['PyTorch', 'Grad-CAM', 'CNNs', 'YOLOv11'],
    projectUrl: 'https://github.com/AurickAnwar/Cancer-Cell-Detection',
    overview: [
      'Built a medical imaging pipeline that detects and classifies breast cancer regions in mammography images using a two-stage deep learning approach.',
      'Combined object detection, custom CNN classification, and explainability visualization to simulate a real-world computer-aided diagnosis workflow.',
      'Designed to explore how explainable AI can bridge the gap between model predictions and clinical interpretability in medical imaging.',
    ],
    challenge: [
      'Training a YOLO model to localize tumor regions in grayscale mammography images with limited annotated data.',
      'Building a CNN classifier from scratch and integrating it as a second-stage classifier on YOLO-detected crops.',
      'Hooking Grad-CAM into a custom CNN architecture to generate meaningful heatmaps without using pretrained models.',
      'Connecting multiple models into a single real-time inference pipeline without breaking gradient flow for explainability.',
    ],
    solution: [
      'Fine-tuned YOLOv11 on 5,400 annotated breast cancer images from Roboflow to detect and localize tumor regions with bounding boxes.',
      'Built a custom CNN classifier in PyTorch trained on YOLO-cropped regions to independently classify each detection as benign or malignant.',
      'Applied pytorch-grad-cam to the final convolutional layer of the CNN to generate spatial heatmaps explaining which regions influenced each prediction.',
      'Displayed original crop and Grad-CAM heatmap side by side with confidence scores for each detection.',
    ],
    technical: [
      'Developed in Python using PyTorch, Ultralytics YOLOv11, OpenCV, pytorch-grad-cam, and Pillow.',
      'Fine-tuned YOLOv11m on a Roboflow breast cancer dataset with YOLO-format annotations and a custom data.yaml config.',
      'Built a 3-layer CNN with Conv2d, ReLU, and MaxPool2d blocks followed by fully connected layers outputting benign/malignant probabilities.',
      'Trained the CNN using CrossEntropyLoss and Adam optimization on YOLO-cropped cell regions.',
      'Applied softmax to CNN outputs to convert raw logits into calibrated confidence percentages.',
      'Used GradCAM targeting conv3 to generate grayscale activation maps and overlaid them using cv2.applyColorMap and cv2.addWeighted.',
      'Built a modular pipeline across four scripts — train.py, crop_dataset.py, cnn_train.py, and BreastCellDetection.py.',
    ],
    outcomes: [
      'Built a working end-to-end explainable medical AI pipeline from tumor detection to visual decision explanation.',
      'Achieved 95.31% CNN confidence on malignant detections with visually meaningful Grad-CAM activation maps.',
      'Strengthened experience with computer vision, custom neural network design, and explainable AI in a medical context.',
      'Gained hands-on experience connecting multiple deep learning models into a unified real-time inference pipeline.',
      'Created a foundation for future work in medical imaging, transfer learning with ResNet/EfficientNet, and multi-class tumor grading.',
    ],
  },
  {
    id: 12,
    slug: 'telearm',
    title: 'TeleARM',
    category: 'ROBOTICS',
    year: '2026',
    projectType: 'Solo Project',
    description:
      'Warehouse autonomous forklift that wanders with lidar, picks colored boxes, and delivers each one to the matching drop pad.',
    image: '/TeleARM.png',
    youtubeVideoId: 'https://www.youtube.com/watch?v=wBmdwQ1g708',
    technologies: ['ROS2', 'Gazebo', 'Python', 'ros2_control', 'SLAM', 'Nav2', 'RViz2', 'Linux'],
    projectUrl: 'https://github.com/007Aurick/TeleARM',
    ctaLabel: 'View GitHub',
    overview: [
      'Built a fully autonomous warehouse forklift simulation in ROS 2 Humble and Gazebo Classic — no keyboard teleop required for the main mission.',
      'The robot wanders open space with lidar obstacle avoidance, detects colored boxes, picks them with a front claw, and delivers each box to a matching color drop pad.',
      'Primary control path is a custom mission state machine (`mission.py`), with optional slam_toolbox and Nav2 launches for mapping and navigation experiments.',
    ],
    challenge: [
      'Coordinating wander, approach, grip, delivery, and drop into one reliable mission loop without fighting the differential-drive controller.',
      'Avoiding walls and racks with lidar while still driving close enough to seat a box in the fork pocket.',
      'Keeping carried boxes from looking like obstacles and preventing drop pads from being confused with the boxes themselves.',
      'Making the demo stable on WSL2, where Gazebo GUI FPS and RGB camera plugins can be unreliable.',
    ],
    solution: [
      'Used `/gazebo/model_states` for reliable box and robot pose lookup instead of depending on flaky RGB detection for the main mission path.',
      'Implemented a full FSM: searching → approaching → gripping → delivering → dropping, then resume wander until the warehouse is cleared.',
      'Closed the claw after aligning into the fork pocket, carried each box to its color pad, planted it on a drop grid, then reversed and resumed search.',
      'Gave cubes black edge frames and used on-pad drop slots so boxes stay visually distinct from pad markers.',
    ],
    technical: [
      'Middleware and sim: ROS 2 Humble, Gazebo Classic (`gazebo_ros`), URDF/Xacro forklift with STL meshes, and RViz2 for inspection.',
      'Control: `ros2_control` with `diff_drive_controller` plus a gripper position controller for open/close claw commands.',
      'Autonomy nodes: `diff_drive_publisher.py` for lidar wander, `mission.py` for sequencing, and `gripper_publisher.py` for claw actuation.',
      'Perception and sensing: `/scan` for avoidance; `/gazebo/model_states` for box selection by FOV and range; optional RGB `box_detector` path kept as an experiment.',
      'Navigation extras: optional `slam_toolbox` online mapping and Nav2 bringup with `cmd_vel_relay` for Twist → TwistStamped handoff.',
      'Warehouse world includes racks, orange/blue/green/red boxes, and corner color pads with fixed world poses for delivery.',
    ],
    outcomes: [
      'Shipped a working end-to-end autonomous pick-and-sort mission: wander, detect, pick, deliver, and repeat.',
      'Strengthened ROS 2 skills across robot description, controllers, lidar avoidance, mission FSMs, and simulation tooling.',
      'Documented a WSL2-friendly workflow (headless Gazebo when needed) and published a full demo walkthrough.',
      'Created a reusable mobile-manipulator foundation for harder physics-only grasps and richer Nav2 delivery paths.',
    ],
  },
  {
    id: 13,
    slug: 'robot-basketball-shooter',
    title: 'Robot Basketball Shooter',
    category: 'ROBOTICS',
    year: '2026',
    projectType: 'Solo Project',
    description:
      'MuJoCo sim where a Unitree G1 humanoid sinks free throws and straight-on shots from the top of the key using projectile-motion.',
    image: '/RobotBallShooter.png',
    youtubeVideoId: 'https://www.youtube.com/watch?v=xAtxTEY-L5U',
    technologies: ['MuJoCo', 'Python', 'NumPy', 'Unitree G1'],
    projectUrl: 'https://github.com/007Aurick/Robot-Basketball-Shooter',
    ctaLabel: 'View GitHub',
    overview: [
      'Built a basketball shooting simulation in MuJoCo with a Unitree G1 humanoid, ball, hoop, backboard, and court.',
      'Uses projectile motion to compute release angle and velocity, then drives the robot through a throw and release so the ball goes through the hoop.',
      'Currently supports free throws and straight-on shots from the top of the key — a simple baseline before adding richer court geometry.',
    ],
    challenge: [
      'Translating a textbook projectile-motion solution into joint motion that actually releases the ball at the right time in physics sim.',
      'Keeping the G1 humanoid motion stable enough that release point and velocity stay close to what the solver predicts.',
      'Supporting multiple straight-line spots (free throw line, top of the key) without hard-coding a separate motion for every distance.',
      'Balancing simplicity now with a path toward arbitrary court positions and release angles later.',
    ],
    solution: [
      'Modeled the court, hoop, and Unitree G1 in MuJoCo and solved release angle and initial velocity from fixed distance and hoop height.',
      'Scripted a throwing motion in Python that brings the arms through a release pose and lets go at the computed instant.',
      'Parameterized straight-on shot positions along the lane so the same solver works for free throws and top-of-the-key attempts.',
      'Kept the stack lightweight: pure MuJoCo + Python + NumPy, no ROS middleware for this version.',
    ],
    technical: [
      'Simulation built in MuJoCo with a Unitree G1 humanoid from MuJoCo Menagerie, basketball, hoop, backboard, and court geometry.',
      'Implemented in Python with NumPy for projectile-motion calculations (release angle, velocity, and timing).',
      'Drives joint targets through the throw sequence and releases the ball at the computed point in the sim loop.',
      'Supports free-throw distance and top-of-the-key positions along a straight line to the basket.',
      'Demo recorded in sim — see the YouTube walkthrough for made shots from multiple straight-on spots.',
    ],
    outcomes: [
      'Shipped a working MuJoCo demo where the G1 humanoid makes free throws and top-of-the-key shots on a straight line.',
      'Validated that analytical release planning can be paired with a full humanoid throw motion in simulation.',
      'Built a clean Python-only foundation without ROS overhead for fast iteration on shot mechanics.',
      'Clear next step: heavier math for arbitrary court positions, lateral offset, and release angles beyond straight-on shots.',
    ],
  },
  {
    id: 11,
    slug: 'vent-buddy',
    title: 'Vent Buddy',
    category: 'LLM Applications',
    year: '2026',
    projectType: 'Solo Project',
    description:
      'A voice-first AI assistant that listens without judgment, offers supportive guidance, and turns each conversation into a clear next-step report.',
    image: '/VentBuddy.png',
    imageZoomIn: true,
    technologies: ['LangChain', 'Ollama', 'FastAPI', 'SpeechRecognition', 'Python', 'OpenAI Whisper'],
    projectUrl: 'https://vent-buddy.vercel.app/',
    ctaLabel: 'View Project',
    secondaryLabel: 'View GitHub',
    secondaryUrl: 'https://github.com/007Aurick/Vent-Buddy',
    youtubeVideoId: 'https://www.youtube.com/watch?v=vsgJC1_OcGw',
    overview: [
      'Built a voice-controlled AI companion that gives users a private space to talk through frustration and difficult moments.',
      'Combined speech recognition, conversational AI, and structured report generation into one end-to-end experience.',
      'Designed the interface to feel calm, focused, and free of judgment.',
    ],
    challenge: [
      'Creating a natural voice-first flow from recording through transcription and response generation.',
      'Keeping conversational guidance useful while avoiding a generic chatbot experience.',
      'Converting an unstructured conversation into practical, organized next steps.',
    ],
    solution: [
      'Used Whisper-based transcription and speech recognition to capture spoken input.',
      'Built the conversational workflow with LangChain, Ollama, and FastAPI.',
      'Generated a structured follow-up report that summarizes the conversation and suggests actionable next steps.',
    ],
    technical: [
      'Implemented the backend in Python and FastAPI.',
      'Integrated LangChain and Ollama for conversational AI orchestration.',
      'Added speech recognition and OpenAI Whisper for voice transcription.',
      'Deployed the completed application as a live web project.',
    ],
    outcomes: [
      'Completed and deployed a working voice-first AI assistant.',
      'Created a focused user experience that turns conversation into useful follow-up actions.',
      'Strengthened experience with speech AI, LLM workflows, API development, and deployment.',
    ],
  },
  {
    id: 3,
    slug: 'hand-gesture-computer-control',
    title: 'Hand Gesture Computer Control',
    category: 'COMPUTER VISION',
    year: '2026',
    description: 'Enables touchless cursor and system controls by mapping hand landmarks to real-time gesture commands.',
    image: '/HandGestureControl.jpg',
    youtubeVideoId: 'https://www.youtube.com/watch?v=87QTKgbuSko',
    technologies: ['MediaPipe', 'OpenCV', 'PyAutoGUI', 'Python'],
    projectUrl: 'https://github.com/AurickAnwar/Real-Time-Hand-Gesture-Controller',
    overview: [
      'Built a real-time hand gesture controller that allows users to control mouse movement and media actions using a webcam.',
      'Combined computer vision and gesture recognition to translate hand movements into desktop controls.',
      'Designed as a touchless human-computer interaction project using real-time landmark tracking.',
    ],
    challenge: [
      'Detecting hand landmarks reliably in real time under different lighting and background conditions.',
      'Mapping finger positions into distinct gestures without accidental overlap.',
      'Reducing repeated or unintended inputs from continuous gesture detection.',
      'Translating webcam coordinates smoothly into screen movement for cursor control.',
      'Keeping gesture recognition responsive while processing live video frames.',
    ],
    solution: [
      'Used MediaPipe Hands to detect and track hand landmarks from a webcam feed.',
      'Created gesture logic using finger landmark positions to identify actions such as clicking, play/pause, mute, and media controls.',
      'Mapped the index fingertip to screen coordinates for live mouse movement.',
      'Used thumb–index pinch distance to adjust volume dynamically.',
      'Added gesture cooldown timers to reduce accidental repeated actions.',
      'Included keyboard shortcuts to open instructions or save a live camera frame.',
    ],
    technical: [
      'Developed in Python using OpenCV, MediaPipe, PyAutoGUI, and math utilities.',
      'Captured webcam frames and processed them with MediaPipe’s hand landmark detection model.',
      'Calculated finger states by comparing landmark coordinates for thumb and fingertips.',
      'Mapped index finger coordinates to desktop mouse position with PyAutoGUI.',
      'Triggered system-level actions such as click, media play/pause, mute, volume, and arrow keys based on detected gestures.',
      'Added on-screen overlays for FPS, number of detected hands, and usage instructions.',
    ],
    outcomes: [
      'Built a working touchless gesture-control system for desktop interaction.',
      'Strengthened experience with computer vision, real-time landmark detection, and event-driven software.',
      'Learned how perception systems can translate visual input into physical device control.',
      'Created a strong foundation for future gesture-based robotics controls and human-machine interaction projects.',
    ],
  },
];

export const portfolioProjects = rawProjects.map((project) => ({
  ...project,
  youtubeVideoId: parseYouTubeId(project.youtubeVideoId),
}));

export function getProjectBySlug(slug) {
  return portfolioProjects.find((p) => p.slug === slug) ?? null;
}

/** Single-line summary for project cards on the grid. */
export function getProjectCardDescription(project) {
  if (Array.isArray(project.description)) {
    return project.description.join(' ');
  }
  return project.description ?? '';
}

/** Header image plus stacked gallery frames for detail views. */
export function getProjectMediaImages(project) {
  if (!project.detailImages?.length) return null;

  const headerCaption =
    project.slug === 'breast-cancer-cell-detection' ? 'Malignant · 95.31%' : null;

  return [
    {
      src: project.image,
      alt: project.title,
      caption: headerCaption,
    },
    ...project.detailImages,
  ];
}

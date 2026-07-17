require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Project = require('../models/Project');
const Workshop = require('../models/Workshop');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/technest';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding.');

    // 1. Seed Admin
    await Admin.deleteMany({});
    const defaultAdmin = new Admin({
      name: 'TechNest Admin',
      email: 'admin@technestprojects.com',
      password: 'Admin@123', // Will be hashed by the model pre-save hook
      role: 'admin'
    });
    await defaultAdmin.save();
    console.log('✓ Seeded Default Admin (admin@technestprojects.com / Admin@123)');

    // 2. Seed Projects
    await Project.deleteMany({});
    const sampleProjects = [
      {
        title: 'AI-Powered Smart Traffic Management System',
        description: 'An intelligent traffic optimization framework using OpenCV, YOLO v8 object detection, and reinforcement learning for dynamic signal timing.',
        category: 'AI',
        techUsed: ['Python', 'YOLO v8', 'OpenCV', 'TensorFlow', 'Flask'],
        difficulty: 'Advanced',
        imageUrl: '/project_ai_traffic.jpg',
        brochureUrl: '/brochure_ai_traffic.pdf'
      },
      {
        title: 'IoT Enabled Smart Agriculture Grid',
        description: 'Precision farming system equipped with NPK soil sensors, ESP32 microcontrollers, solar charging tracking, and automated cloud hydration triggers.',
        category: 'IoT',
        techUsed: ['C++', 'Arduino IDE', 'ESP32', 'ThingsSpeak', 'MQTT'],
        difficulty: 'Intermediate',
        imageUrl: '/project_iot_agri.jpg',
        brochureUrl: '/brochure_iot_agri.pdf'
      },
      {
        title: 'Blockchain Based Secure Medical Record Storage',
        description: 'Decentralized electronic health record management system ensuring data integrity, patient consent governance, and IPFS image hosting.',
        category: 'Computer Science',
        techUsed: ['React.js', 'Solidity', 'Web3.js', 'Ethereum', 'IPFS'],
        difficulty: 'Advanced',
        imageUrl: '/project_blockchain_health.jpg',
        brochureUrl: '/brochure_blockchain_health.pdf'
      },
      {
        title: 'Smart Power Grid Grid Monitoring System',
        description: 'Electrical load dispatch optimization using current-voltage transformers, GSM status reports, and microcontroller relay breakers.',
        category: 'Electrical',
        techUsed: ['Embedded C', 'PIC Microcontroller', 'GSM Module', 'LCD Display'],
        difficulty: 'Intermediate',
        imageUrl: '/project_smart_grid.jpg',
        brochureUrl: '/brochure_smart_grid.pdf'
      },
      {
        title: 'Wearable Health Monitor for Industrial Labors',
        description: 'An embedded safety collar tracing ambient gas toxins, temperature, fall detection (accelerometer), and transmitting live alerts.',
        category: 'Electronics',
        techUsed: ['Arduino', 'ADXL345', 'MQ2 Gas Sensor', 'LoRa module'],
        difficulty: 'Intermediate',
        imageUrl: '/project_wearable_health.jpg',
        brochureUrl: '/brochure_wearable_health.pdf'
      },
      {
        title: 'Hybrid Solar-Wind Power Converter',
        description: 'An electronics controller stabilizing outputs from wind turbines and solar cells using buck-boost converters and charge regulators.',
        category: 'Electronics',
        techUsed: ['MATLAB', 'Simulink', 'Power Electronics', 'MPPT Algorithm'],
        difficulty: 'Advanced',
        imageUrl: '/project_hybrid_energy.jpg',
        brochureUrl: '/brochure_hybrid_energy.pdf'
      },
      {
        title: 'Automatic Pneumatic Bumper & Brake Control',
        description: 'A mechanical safety assembly for automobiles that uses ultrasonic range sensing to trigger automatic pneumatic braking.',
        category: 'Mechanical',
        techUsed: ['Pneumatic Cylinders', 'Solenoid Valves', 'Arduino Nano', 'Ultrasonic Sensors'],
        difficulty: 'Intermediate',
        imageUrl: '/project_pneumatic_bumper.jpg',
        brochureUrl: '/brochure_pneumatic_bumper.pdf'
      },
      {
        title: 'Sustainable Green Concrete using Glass Aggregates',
        description: 'Structural concrete mixture analysis replacing fine aggregates with recycled pulverized waste glass to test tensile strength.',
        category: 'Civil',
        techUsed: ['Concrete Mix Design', 'Compression Testing', 'UTM Machine', 'Lab Testing'],
        difficulty: 'Beginner',
        imageUrl: '/project_green_concrete.jpg',
        brochureUrl: '/brochure_green_concrete.pdf'
      },
      {
        title: 'Sales Forecasting Dashboard',
        description: 'A predictive application loaded with ARIMA and Prophet models analyzing historical store metrics to forecast regional item demands.',
        category: 'Python',
        techUsed: ['Python', 'Pandas', 'Streamlit', 'Statsmodels', 'Prophet'],
        difficulty: 'Intermediate',
        imageUrl: '/project_sales_forecast.jpg',
        brochureUrl: '/brochure_sales_forecast.pdf'
      },
      {
        title: 'Enterprise ERP System with Microservice Architecture',
        description: 'Scalable internal business portal tracing inventory, human resources, and sales billing with RabbitMQ messaging logs.',
        category: 'Java',
        techUsed: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'RabbitMQ'],
        difficulty: 'Advanced',
        imageUrl: '/project_enterprise_erp.jpg',
        brochureUrl: '/brochure_enterprise_erp.pdf'
      }
    ];
    await Project.insertMany(sampleProjects);
    console.log(`✓ Seeded ${sampleProjects.length} Projects`);

    // 3. Seed Workshops
    await Workshop.deleteMany({});
    const sampleWorkshops = [
      {
        title: 'Hands-on IoT and Robotics Bootcamp',
        description: 'A comprehensive 2-day workshop detailing ESP32 connectivity, IoT clouds, and building autonomous sensor networks.',
        date: '2026-07-15',
        time: '10:00 AM - 04:00 PM',
        venue: 'TechNest Lab Hub & Live Zoom',
        fee: 499,
        imageUrl: '/workshop_iot.jpg',
        status: 'Upcoming',
        category: 'Internet of Things',
        duration: '2 Days',
        benefits: ['Certificate of Participation', 'Hardware Kit Provided (Local Only)', 'Access to Recorded Sessions', 'Source Code & Schematics']
      },
      {
        title: 'Full-Stack Web Development BootCamp with Next.js',
        description: 'Master React, Next.js, and server-side deployment to build premium SaaS sites with Tailwind and MongoDB.',
        date: '2026-08-01',
        time: '09:00 AM - 01:00 PM',
        venue: 'Online Webex Portal',
        fee: 299,
        imageUrl: '/workshop_web.jpg',
        status: 'Upcoming',
        category: 'Web Development',
        duration: '3 Days',
        benefits: ['Certificate of BootCamp Completion', '1-on-1 Mentorship', 'Live Project Deployment Support', 'Git Repository Review']
      },
      {
        title: 'Introduction to AI & Deep Learning Models',
        description: 'A structural overview of convolutional networks, data wrangling with pandas, and training models with TensorFlow.',
        date: '2026-05-10',
        time: '10:00 AM - 03:00 PM',
        venue: 'SIT Seminar Hall',
        fee: 199,
        imageUrl: '/workshop_ai_intro.jpg',
        status: 'Previous',
        category: 'Artificial Intelligence',
        duration: '1 Day',
        benefits: ['E-Certificate of Completion', 'Jupyter Notebook Resources', 'Resume Screening Tips']
      },
      {
        title: 'Embedded C Programming for Microcontrollers',
        description: 'Deep dive into registers, interrupts, timers, and peripheral interfaces on PIC and AVR microchips.',
        date: '2026-04-18',
        time: '09:30 AM - 04:30 PM',
        venue: 'Online Meet Portal',
        fee: 0,
        imageUrl: '/workshop_embedded.jpg',
        status: 'Previous',
        category: 'Embedded Systems',
        duration: '1 Day',
        benefits: ['Free E-Certificate', 'PDF Booklets & Cheat Sheets', 'Code Sandboxes access']
      }
    ];
    await Workshop.insertMany(sampleWorkshops);
    console.log(`✓ Seeded ${sampleWorkshops.length} Workshops`);

    // 4. Seed Testimonials
    await Testimonial.deleteMany({});
    const sampleTestimonials = [
      {
        name: 'Rohan Sharma',
        college: 'R.V. College of Engineering, Bangalore',
        projectTitle: 'IoT Crop Protection Grid',
        rating: 5,
        comment: 'TechNest Projects helped me bring my final year project to life. The source code was well-written, and their hardware debugging support was top-notch!',
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        name: 'Ananya Hegde',
        college: 'Siddaganga Institute of Technology, Tumkur',
        projectTitle: 'AI Lung Disease Predictor',
        rating: 5,
        comment: 'I learned more in their 3-day Next.js and AI workshops than in an entire semester. The project report and PPT files were fully detailed and ready to submit.',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        name: 'Praveen Kumar',
        college: 'PES University, Bangalore',
        projectTitle: 'Android App Development Internship',
        rating: 4,
        comment: 'The internship program was well structured. Regular reviews and live mentoring helped me complete my project easily and score outstanding grades.',
        avatarUrl: 'https://randomuser.me/api/portraits/men/81.jpg'
      },
      {
        name: 'Sneha Patel',
        college: 'Nitte Meenakshi Institute of Tech',
        projectTitle: 'Smart Power Breaker Grid',
        rating: 5,
        comment: 'Highly professional. The explanation videos provided for my project presentation were so clear. The project panel external examiners were very impressed.',
        avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg'
      }
    ];
    await Testimonial.insertMany(sampleTestimonials);
    console.log(`✓ Seeded ${sampleTestimonials.length} Testimonials`);

    // 5. Seed Gallery
    await Gallery.deleteMany({});
    const sampleGallery = [
      {
        title: 'SIT College Workshop Group Photo',
        type: 'College Event',
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        caption: 'Over 150+ computer science engineering students attending our Cloud Computing seminar.'
      },
      {
        title: 'IoT Project Setup Board Showcase',
        type: 'Project',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        caption: 'ESP32 microchip testing board hooked up with environmental air sensors.'
      },
      {
        title: 'Online React JS Live Session Screen',
        type: 'Workshop',
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
        caption: 'Explaining state and component lifecycle hooks during React masterclass.'
      },
      {
        title: 'Sample Academic Excellence Certificate Layout',
        type: 'Certificate',
        url: 'https://images.unsplash.com/photo-1589330694653-ded6df53f6ee?w=800',
        caption: 'Premium generated E-Certificate style awarded to workshop candidates.'
      },
      {
        title: 'Civil Concrete Structural Testing Lab',
        type: 'College Event',
        url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
        caption: 'Compressive test validation of glass-aggregate green concrete.'
      },
      {
        title: 'TechNest Embedded Workshop Demo',
        type: 'Workshop',
        url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800',
        caption: 'Hardware debugging session with DSO and Logic Analyzer.'
      }
    ];
    await Gallery.insertMany(sampleGallery);
    console.log(`✓ Seeded ${sampleGallery.length} Gallery items`);

    console.log('Seeding process complete! Database is ready to use.');
    mongoose.disconnect();
  } catch (error) {
    console.error('Seeding Failed:', error.message);
    process.exit(1);
  }
};

seedData();

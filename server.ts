import express from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'ebenezer-db.json');

interface DBShape {
  courses: any[];
  admissions: any[];
  orders: any[];
  leads: any[];
  bookings: any[];
  testimonials: any[];
  gallery: any[];
  articles: any[];
  promo: {
    headline: string;
    subtext: string;
    targetDateISO: string;
    badgeText: string;
    active: boolean;
  };
  settings: {
    phoneDisplay: string;
    whatsappIntl: string;
    email: string;
    locationLine: string;
    hoursWeekdays: string;
    hoursSaturday: string;
    mpesaPaybillOrTill: string;
    mpesaAccountName: string;
    googleReviewsUrl: string;
    whatsappChannelUrl: string;
    adminPin: string;
  };
}

function getDefaultTargetDateISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

function createSeedData(): DBShape {
  const now = new Date().toISOString();
  const today = new Date().toISOString().slice(0, 10);
  return {
    courses: [
      {
        id: 'comp-basics',
        category: 'computer',
        title: 'Computer Skills: Beginner to Intermediate',
        level: 'Beginner',
        duration: '4 Weeks',
        schedule: 'Mon–Fri · Morning or Afternoon',
        fee: 'KSh 3,500',
        highlights: ['Typing & mouse mastery', 'Windows file organisation', 'Email, internet & safe browsing', 'Everyday cyber services'],
        active: true,
      },
      {
        id: 'comp-office',
        category: 'computer',
        title: 'Office Productivity (Word, Excel, PowerPoint, Access)',
        level: 'Intermediate to Advanced',
        duration: '6 Weeks',
        schedule: 'Mon–Sat · 4-Seat Practical Lab',
        fee: 'KSh 5,500',
        highlights: ['MS Word formatting & CVs', 'MS Excel formulas & budgets', 'PowerPoint presentations', 'MS Access databases'],
        active: true,
      },
      {
        id: 'comp-digital',
        category: 'computer',
        title: 'Internet, eCitizen & Digital Workplace Essentials',
        level: 'All Levels',
        duration: '2 Weeks',
        schedule: 'Flexible · Individual or Small Group',
        fee: 'KSh 2,500',
        highlights: ['Online forms & applications', 'Cloud documents & Google Drive', 'Digital communication etiquette', 'Certificate upon completion'],
        active: true,
      },
      {
        id: 'tuit-cbc',
        category: 'tuition',
        title: 'Primary & CBC Homework / KPSEA Support',
        level: 'Primary (Grade 1–6)',
        duration: 'Monthly / Termly',
        schedule: 'After School & Saturdays',
        fee: 'KSh 1,500 / month',
        highlights: ['CBC project & homework support', 'KPSEA foundational revision', 'Reading & numeracy confidence', 'Parent progress updates'],
        active: true,
      },
      {
        id: 'tuit-jss',
        category: 'tuition',
        title: 'Junior Secondary (JSS) & KJSEA Coaching',
        level: 'Grade 7–9',
        duration: 'Monthly / Holiday Bootcamp',
        schedule: 'After School & School Holidays',
        fee: 'KSh 2,000 / month',
        highlights: ['Integrated Science & Maths', 'KJSEA assessment readiness', 'Guided past-paper practice', 'Small-group attention'],
        active: true,
      },
      {
        id: 'tuit-kcse',
        category: 'tuition',
        title: 'Secondary School Tuition & KCSE Preparation',
        level: 'Form 1–4',
        duration: 'Monthly / Holiday Intensive',
        schedule: 'Evenings, Saturdays & Holidays',
        fee: 'KSh 2,500 / month',
        highlights: ['KCSE exam technique & timing', 'Sciences, Mathematics & English', 'Structured revision plans', 'Drop-in homework help (KSh 200/session)'],
        active: true,
      },
      {
        id: 'read-kids',
        category: 'reading',
        title: 'Reading & Comprehension Confidence',
        level: 'Primary & JSS',
        duration: 'Monthly',
        schedule: '3 Sessions Weekly',
        fee: 'KSh 1,500 / month',
        highlights: ['Phonics & fluency building', 'Passage comprehension', 'Vocabulary expansion', 'Reading aloud with confidence'],
        active: true,
      },
      {
        id: 'read-adult',
        category: 'reading',
        title: 'Adult English & Everyday Communication',
        level: 'Youth & Adults',
        duration: '6 Weeks / Monthly',
        schedule: 'Morning or Late Afternoon',
        fee: 'KSh 2,000 / month',
        highlights: ['Practical spoken English', 'Reading notices, forms & messages', 'Business & customer conversation', 'Supportive, private pace'],
        active: true,
      },
      {
        id: 'cont-yt',
        category: 'content',
        title: 'YouTube, Podcast & Audio-Video Creation',
        level: 'Beginner to Creator',
        duration: '4 Weeks',
        schedule: 'Tue, Thu & Sat Sessions',
        fee: 'KSh 4,500',
        highlights: ['Microphone & camera setup', 'Recording clear voice & video', 'Podcast & YouTube channel launch', 'Storytelling & scripting'],
        active: true,
      },
      {
        id: 'cont-edit',
        category: 'content',
        title: 'Practical Video & Audio Editing Lab',
        level: 'Intermediate',
        duration: '3 Weeks',
        schedule: 'Flexible 4-Seat Lab',
        fee: 'KSh 3,500',
        highlights: ['Cutting, captions & audio cleanup', 'Thumbnail & poster graphics', 'Reels, TikTok & YouTube export', 'Portfolio piece completed'],
        active: true,
      },
      {
        id: 'ent-youth',
        category: 'enterprise',
        title: 'Ngama Youth Online-Earning & Virtual Assistant Track',
        level: 'Youth & School Leavers',
        duration: '4 Weeks',
        schedule: 'Mon–Fri · Practical Lab',
        fee: 'KSh 3,500',
        highlights: ['Virtual assistant & data-entry workflows', 'Online profile & client proposal writing', 'Digital bookkeeping & Canva design', 'Safe online earning & scam awareness'],
        active: true,
      },
      {
        id: 'ent-biz',
        category: 'enterprise',
        title: 'Small Business Digital & Print Branding Starter',
        level: 'Entrepreneurs & Groups',
        duration: '2 Weeks',
        schedule: 'Custom / By Appointment',
        fee: 'Contact for price',
        highlights: ['Business flyers & price list design', 'WhatsApp Business catalogue setup', 'Basic Excel sales tracker', 'Receipt & invoice templates'],
        active: true,
      },
    ],
    admissions: [
      {
        id: 'adm-seed-1',
        admissionNo: 'EBZ-ADM-2026-1001',
        submittedAt: now,
        intakeTerm: 'November / Holiday Intake',
        fullName: 'Daniel Lekishon',
        dateOfBirth: '2006-05-14',
        gender: 'Male',
        idOrBirthCert: '40129384',
        phone: '0722 310492',
        email: '',
        address: 'Ngama Centre',
        townArea: 'Ngama',
        schoolOrOccupation: 'Form 4 Leaver',
        highestLevel: 'KCSE',
        programmes: ['Computer Training (Intermediate)', 'Enterprise & Youth Online Skills'],
        specificCourse: 'Office Productivity & Online-Earning Track',
        preferredStartDate: today,
        preferredDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        preferredTime: 'Morning',
        trainingMode: 'Group',
        expectedDuration: '6 Weeks',
        isMinor: false,
        guardianName: '',
        guardianRelationship: '',
        guardianPhone: '',
        guardianEmail: '',
        guardianAddress: '',
        guardianAltContact: '',
        declarationAccepted: true,
        privacyAccepted: true,
        status: 'Accepted',
        paymentStatus: 'Deposit Paid',
      },
    ],
    orders: [
      {
        ref: 'EBZ-PRT-1042',
        createdAt: now,
        updatedAt: now,
        customerType: 'Church',
        institutionOrName: 'Ngama Community Fellowship',
        contactPerson: 'Pastor Moses Kimani',
        phone: '0712 884210',
        email: '',
        serviceType: 'Church Event Programmes (A5 Folded)',
        isPartnerJob: false,
        size: 'A5 Folded',
        quantity: 120,
        colourMode: 'Full Colour',
        paperType: '130gsm Gloss',
        finishing: 'Creased & Folded',
        needsDesignLayout: true,
        fileName: 'Sunday_Service_Programme_Draft.docx',
        notes: 'Include gold header and choir schedule.',
        requiredDate: today,
        deliveryLocation: 'Collect at Ngama Centre',
        estimatedTotal: 'KSh 4,800 (Confirmed)',
        status: 'Printing',
      },
      {
        ref: 'EBZ-PRT-1043',
        createdAt: now,
        updatedAt: now,
        customerType: 'School',
        institutionOrName: 'Illasit Mixed Day Secondary',
        contactPerson: 'Deputy Principal',
        phone: '0723 551019',
        email: '',
        serviceType: 'Revision Worksheets & Term Notices',
        isPartnerJob: false,
        size: 'A4',
        quantity: 250,
        colourMode: 'Black & White',
        paperType: '80gsm Bond',
        finishing: 'Stapled Sets',
        needsDesignLayout: false,
        fileName: 'Form4_Math_Revision.pdf',
        notes: 'Double-sided A4 sets sorted by stream.',
        requiredDate: today,
        deliveryLocation: 'Illasit Stage Drop-off',
        estimatedTotal: 'KSh 2,500',
        status: 'In design',
      },
      {
        ref: 'EBZ-PRT-1044',
        createdAt: now,
        updatedAt: now,
        customerType: 'Individual',
        institutionOrName: 'Grace Naipanoi',
        contactPerson: 'Grace Naipanoi',
        phone: '0719 402115',
        email: '',
        serviceType: 'CV Typing, Layout & 10 Copies',
        isPartnerJob: false,
        size: 'A4',
        quantity: 10,
        colourMode: 'Black & White',
        paperType: '80gsm Bond',
        finishing: 'Laminated Cover Sheet',
        needsDesignLayout: true,
        fileName: 'Handwritten_CV_Photo.jpg',
        notes: 'Ready for collection at reception.',
        requiredDate: today,
        deliveryLocation: 'Ngama Centre',
        estimatedTotal: 'KSh 450',
        status: 'Ready',
      },
      {
        ref: 'EBZ-PRT-1041',
        createdAt: now,
        updatedAt: now,
        customerType: 'Health Facility',
        institutionOrName: 'Ngama Health Dispensary',
        contactPerson: 'Facility Administrator',
        phone: '0701 992341',
        email: '',
        serviceType: 'Patient Record Forms & Signage Banner',
        isPartnerJob: true,
        size: 'A4 + 4ft x 2ft Banner',
        quantity: 300,
        colourMode: 'Full Colour',
        paperType: '80gsm + PVC Vinyl',
        finishing: 'Eyelets on Banner (Partner Arranged)',
        needsDesignLayout: true,
        fileName: 'Clinic_Signage_Brief.txt',
        notes: 'Banner arranged through external production partner.',
        requiredDate: today,
        deliveryLocation: 'Ngama Dispensary',
        estimatedTotal: 'Contact for confirmed partner quote',
        status: 'Received',
      },
    ],
    leads: [
      {
        id: 'lead-seed-1',
        createdAt: now,
        name: 'Josephat M.',
        phone: '0711 234567',
        offerType: 'Free First Lesson',
        interestArea: 'Computer Training',
        referralCode: 'EBZ-JOS42',
      },
    ],
    bookings: [
      {
        id: 'bk-seed-1',
        createdAt: now,
        date: today,
        session: 'Morning',
        learnerName: 'Mercy W.',
        phone: '0720 112233',
        topic: 'MS Excel Practice',
      },
      {
        id: 'bk-seed-2',
        createdAt: now,
        date: today,
        session: 'Morning',
        learnerName: 'Brian K.',
        phone: '0718 445566',
        topic: 'Free Trial Computer Lesson',
      },
    ],
    testimonials: [
      {
        id: 'rev-1',
        name: 'Beatrice Naisenya',
        role: 'Parent & Trader',
        organisation: 'Ngama Market',
        quote: 'My son struggled with reading confidence in Grade 5. After two months of afternoon reading and CBC support at Ebenezer, he reads aloud in class without fear.',
        outcome: 'Improved Grade 5 English fluency in 8 weeks',
        rating: 5,
        createdAt: now,
      },
      {
        id: 'rev-2',
        name: 'Rev. Samuel Mwathe',
        role: 'Senior Pastor',
        organisation: 'Illasit Gospel Chapel',
        quote: 'We used to travel all the way to Loitokitok for church programmes and funeral booklets. Ebenezer designed and delivered 150 clean copies on time.',
        outcome: 'Saved travel time across 3 church events',
        rating: 5,
        createdAt: now,
      },
      {
        id: 'rev-3',
        name: 'Kelvin Omondi',
        role: 'Youth Graduate',
        organisation: 'Kimana / Ngama',
        quote: 'Having only 4 seats in the lab meant the instructor checked my Word and Excel work step by step. I typed my own CV and got an internship interview.',
        outcome: 'Completed Office Suite in 6 weeks & secured placement',
        rating: 5,
        createdAt: now,
      },
    ],
    gallery: [
      {
        id: 'gal-1',
        title: 'Ebenezer Services Overview Flyer',
        category: 'Training & Services',
        caption: 'Colour-coded training programmes and document services offered at our Ngama centre.',
        imageUrl: '/assets/aistudio/ChatGPT_Image_Oct_5__2026__02_02_30_PM_41fe253b.png',
        isPlaceholderFlyer: true,
      },
      {
        id: 'gal-2',
        title: 'Institutional Printing & Outreach Brochure',
        category: 'Schools, Churches & NGOs',
        caption: 'Dedicated document, exam worksheet, programme, and partner-arranged banner solutions across Ngama, Illasit, Kimana, Loitokitok & Tarakea.',
        imageUrl: '/assets/aistudio/Ebenezer_Skills_Centre_Institutional_Brochure__3__f5eb2c58.png',
        isPlaceholderFlyer: true,
      },
      {
        id: 'gal-3',
        title: 'Official Admission & Registration Form',
        category: 'Admissions',
        caption: 'Our structured learner intake form capturing course preferences, schedule, and minor guardian contacts.',
        imageUrl: '/assets/aistudio/ChatGPT_Image_Oct_5__2026__02_16_06_PM_17c5aa0c.png',
        isPlaceholderFlyer: true,
      },
      {
        id: 'gal-4',
        title: 'Community Training & Exam Support Poster',
        category: 'Student Tuition & English',
        caption: 'Primary, JSS, KCSE revision, and adult English literacy programmes.',
        imageUrl: '/assets/aistudio/Ebenezer_Technology_and_Skills_Centre_Banner_d176f1a4.png',
        isPlaceholderFlyer: true,
      },
    ],
    articles: [
      {
        id: 'art-1',
        slug: 'how-to-write-a-cv-kenya',
        title: 'How to Write a Clean, Job-Ready CV in Kajiado County',
        category: 'Career & Documents',
        readTime: '3 min read',
        summary: 'Avoid common formatting mistakes and highlight practical skills employers in NGOs, schools, and businesses actually look for.',
        content: [
          'Keep your CV to 1–2 pages with a clear name header, working phone/WhatsApp number, and email address.',
          'List your recent experience or community volunteering first, using action words (e.g., Coordinated, Typed, Managed, Assisted) rather than long paragraphs.',
          'Always save and send your final CV as a PDF so margins do not shift on another person’s phone or laptop.',
          'Need help? Bring your handwritten notes to Ebenezer in Ngama or claim a Free CV Check right on this website.',
        ],
      },
      {
        id: 'art-2',
        slug: 'free-va-skills-youth',
        title: '5 Practical Digital Skills Youth in Ngama Can Use to Earn Online',
        category: 'Enterprise & Youth',
        readTime: '4 min read',
        summary: 'From spreadsheet cleanup and document formatting to social media flyers and audio editing, learn what real remote clients pay for.',
        content: [
          'Online earning starts with dependable office skills—not shortcuts. Employers and remote teams hire people who format Word reports cleanly, organise Excel sheets accurately, and reply professionally.',
          'Basic graphic design for church, school, and shop flyers is a steady local and online skill.',
          'In our 4-seat lab, learners build real portfolio samples before applying for Virtual Assistant or freelance tasks.',
        ],
      },
      {
        id: 'art-3',
        slug: 'cbc-kjsea-kcse-revision-guide',
        title: 'Supporting Your Child Through CBC, KJSEA, and KCSE Revision',
        category: 'Student Tuition',
        readTime: '3 min read',
        summary: 'How small-group afternoon tuition and structured reading practice build steady confidence before national assessments.',
        content: [
          'Kenya’s CBC pathway now spans Primary (KPSEA), Junior Secondary (KJSEA), and Senior Secondary alongside KCSE cohorts.',
          'Consistent 45-minute focused practice three times a week outperforms last-minute cramming.',
          'Our tuition sessions combine homework verification, reading comprehension, and past-paper walkthroughs with regular feedback to parents.',
        ],
      },
    ],
    promo: {
      headline: 'School-Holiday & New Intake Registration Open',
      subtext: 'Limited 4-seat computer lab slots · Claim a Free First Lesson or Free CV Check before intake closes.',
      targetDateISO: getDefaultTargetDateISO(),
      badgeText: 'Next Intake',
      active: true,
    },
    settings: {
      phoneDisplay: '0714 490545',
      whatsappIntl: '254714490545',
      email: 'ebenezer_ngama@gmail.com',
      locationLine: 'Ngama, Kajiado County · Near the Kenya–Tanzania Border',
      hoursWeekdays: 'Mon–Fri: 8:00 AM – 7:00 PM',
      hoursSaturday: 'Saturday: 9:00 AM – 5:00 PM',
      mpesaPaybillOrTill: 'Confirm Till / Paybill via 0714 490545 before payment',
      mpesaAccountName: 'Ebenezer Technology & Skills Centre',
      googleReviewsUrl: 'https://www.google.com/search?q=Ebenezer+Technology+and+Skills+Centre+Ngama+Kajiado',
      whatsappChannelUrl: 'https://wa.me/254714490545?text=Hello%20Ebenezer%2C%20please%20add%20me%20to%20your%20WhatsApp%20Channel%20and%20course%20updates.',
      adminPin: '2026',
    },
  };
}

function loadDB(): DBShape {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {recursive: true});
  }
  if (!fs.existsSync(DB_PATH)) {
    const seed = createSeedData();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw) as DBShape;
  } catch {
    const seed = createSeedData();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  }
}

function saveDB(db: DBShape): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {recursive: true});
  }
  const tmpPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tmpPath, DB_PATH);
}

function sanitizeStr(val: unknown, max = 300): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, max);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({limit: '4mb'}));

  // Public site payload
  app.get('/api/public-data', (_req, res) => {
    const db = loadDB();
    const {adminPin: _hiddenPin, ...safeSettings} = db.settings;
    res.json({
      courses: db.courses.filter((c) => c.active !== false),
      allCoursesCount: db.courses.length,
      promo: db.promo,
      testimonials: db.testimonials,
      gallery: db.gallery,
      articles: db.articles,
      settings: safeSettings,
      counters: {
        learnersTrained: 185 + db.admissions.length,
        coursesOffered: db.courses.filter((c) => c.active !== false).length,
        documentsPrinted: 4200 + db.orders.length * 45,
        partnerInstitutions: 28,
      },
    });
  });

  // 4-seat lab availability
  app.get('/api/bookings', (req, res) => {
    const date = sanitizeStr(req.query.date, 20) || new Date().toISOString().slice(0, 10);
    const db = loadDB();
    const sessions = ['Morning', 'Afternoon', 'Evening'] as const;
    const capacity = 4;
    const availability = sessions.map((session) => {
      const bookedCount = db.bookings.filter((b) => b.date === date && b.session === session).length;
      return {
        session,
        capacity,
        booked: bookedCount,
        remaining: Math.max(0, capacity - bookedCount),
      };
    });
    res.json({date, capacity, availability});
  });

  app.post('/api/bookings', (req, res) => {
    const date = sanitizeStr(req.body?.date, 20);
    const session = sanitizeStr(req.body?.session, 20);
    const learnerName = sanitizeStr(req.body?.learnerName, 100);
    const phone = sanitizeStr(req.body?.phone, 30);
    const topic = sanitizeStr(req.body?.topic, 120) || 'Practical Lab Session';

    if (!date || !['Morning', 'Afternoon', 'Evening'].includes(session) || !learnerName || phone.length < 7) {
      return res.status(400).json({error: 'Please enter a valid date, session, name, and phone number.'});
    }

    const db = loadDB();
    const existingCount = db.bookings.filter((b) => b.date === date && b.session === session).length;
    if (existingCount >= 4) {
      return res.status(409).json({error: `The ${session} session on ${date} is full (4/4 seats booked). Please choose another time.`});
    }

    const booking = {
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString(),
      date,
      session,
      learnerName,
      phone,
      topic,
    };
    db.bookings.unshift(booking);
    saveDB(db);
    res.status(201).json({booking});
  });

  // Online Admission & Registration Form
  app.post('/api/admissions', (req, res) => {
    const b = req.body || {};
    const fullName = sanitizeStr(b.fullName, 120);
    const phone = sanitizeStr(b.phone, 30);
    const programmes = Array.isArray(b.programmes) ? b.programmes.map((p: unknown) => sanitizeStr(p, 80)).filter(Boolean) : [];
    const isMinor = Boolean(b.isMinor);

    if (!fullName || phone.length < 7 || programmes.length === 0) {
      return res.status(400).json({error: 'Full name, phone/WhatsApp number, and at least one programme are required.'});
    }
    if (!b.declarationAccepted || !b.privacyAccepted) {
      return res.status(400).json({error: 'Please accept the Student/Parent declaration and Kenya Data Protection Act privacy notice.'});
    }
    if (isMinor && (!sanitizeStr(b.guardianName, 100) || sanitizeStr(b.guardianPhone, 30).length < 7)) {
      return res.status(400).json({error: 'Parent/Guardian name and phone number are required for learners under 18.'});
    }

    const db = loadDB();
    const seq = 1001 + db.admissions.length;
    const admissionNo = `EBZ-ADM-2026-${seq}`;
    const record = {
      id: `adm-${Date.now()}`,
      admissionNo,
      submittedAt: new Date().toISOString(),
      intakeTerm: sanitizeStr(b.intakeTerm, 60) || 'Current Intake',
      fullName,
      dateOfBirth: sanitizeStr(b.dateOfBirth, 20),
      gender: ['Male', 'Female', 'Other'].includes(b.gender) ? b.gender : 'Other',
      idOrBirthCert: sanitizeStr(b.idOrBirthCert, 40),
      phone,
      email: sanitizeStr(b.email, 100),
      address: sanitizeStr(b.address, 150),
      townArea: sanitizeStr(b.townArea, 80) || 'Ngama',
      schoolOrOccupation: sanitizeStr(b.schoolOrOccupation, 120),
      highestLevel: sanitizeStr(b.highestLevel, 60),
      programmes,
      specificCourse: sanitizeStr(b.specificCourse, 120),
      preferredStartDate: sanitizeStr(b.preferredStartDate, 20),
      preferredDays: Array.isArray(b.preferredDays) ? b.preferredDays.slice(0, 6) : [],
      preferredTime: ['Morning', 'Afternoon', 'Evening'].includes(b.preferredTime) ? b.preferredTime : 'Morning',
      trainingMode: ['Individual', 'Group', 'Holiday/Short Course'].includes(b.trainingMode) ? b.trainingMode : 'Group',
      expectedDuration: sanitizeStr(b.expectedDuration, 60),
      isMinor,
      guardianName: sanitizeStr(b.guardianName, 100),
      guardianRelationship: sanitizeStr(b.guardianRelationship, 60),
      guardianPhone: sanitizeStr(b.guardianPhone, 30),
      guardianEmail: sanitizeStr(b.guardianEmail, 100),
      guardianAddress: sanitizeStr(b.guardianAddress, 150),
      guardianAltContact: sanitizeStr(b.guardianAltContact, 60),
      declarationAccepted: true,
      privacyAccepted: true,
      status: 'Pending',
      paymentStatus: 'Unpaid',
    };

    db.admissions.unshift(record);
    saveDB(db);
    res.status(201).json({admission: record});
  });

  // 5-Step Quote & Print Order
  app.post('/api/quotes', (req, res) => {
    const b = req.body || {};
    const contactPerson = sanitizeStr(b.contactPerson, 100);
    const phone = sanitizeStr(b.phone, 30);
    const serviceType = sanitizeStr(b.serviceType, 120);

    if (!contactPerson || phone.length < 7 || !serviceType) {
      return res.status(400).json({error: 'Contact person, phone number, and service required are mandatory.'});
    }

    const db = loadDB();
    const refNum = 1045 + db.orders.length;
    const ref = `EBZ-PRT-${refNum}`;
    const now = new Date().toISOString();
    const order = {
      ref,
      createdAt: now,
      updatedAt: now,
      customerType: sanitizeStr(b.customerType, 40) || 'Individual',
      institutionOrName: sanitizeStr(b.institutionOrName, 120) || contactPerson,
      contactPerson,
      phone,
      email: sanitizeStr(b.email, 100),
      serviceType,
      isPartnerJob: Boolean(b.isPartnerJob),
      size: sanitizeStr(b.size, 40) || 'A4',
      quantity: Math.max(1, Number(b.quantity) || 1),
      colourMode: b.colourMode === 'Full Colour' ? 'Full Colour' : 'Black & White',
      paperType: sanitizeStr(b.paperType, 60) || '80gsm Standard',
      finishing: sanitizeStr(b.finishing, 80) || 'Standard Trim',
      needsDesignLayout: Boolean(b.needsDesignLayout),
      fileName: sanitizeStr(b.fileName, 120),
      notes: sanitizeStr(b.notes, 500),
      requiredDate: sanitizeStr(b.requiredDate, 30),
      deliveryLocation: sanitizeStr(b.deliveryLocation, 120) || 'Ngama Centre Pickup',
      estimatedTotal: sanitizeStr(b.estimatedTotal, 80) || 'Pending quotation',
      status: 'Received',
    };

    db.orders.unshift(order);
    saveDB(db);
    res.status(201).json({order});
  });

  // Order Tracking by Reference
  app.get('/api/orders/:ref', (req, res) => {
    const ref = sanitizeStr(req.params.ref, 40).toUpperCase();
    const db = loadDB();
    const order = db.orders.find((o) => o.ref.toUpperCase() === ref);
    if (!order) {
      return res.status(404).json({error: `No print or design order found for reference "${ref}".`});
    }
    res.json({order});
  });

  // Lead Capture & Referral Generator
  app.post('/api/leads', (req, res) => {
    const name = sanitizeStr(req.body?.name, 100);
    const phone = sanitizeStr(req.body?.phone, 30);
    const offerType = sanitizeStr(req.body?.offerType, 50) || 'Free Consultation';
    const interestArea = sanitizeStr(req.body?.interestArea, 80) || 'General';
    const referredByCode = sanitizeStr(req.body?.referredByCode, 30);

    if (!name || phone.length < 7) {
      return res.status(400).json({error: 'Please provide your name and a valid phone/WhatsApp number.'});
    }

    const db = loadDB();
    const codePrefix = name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'EBZ';
    const referralCode = `EBZ-${codePrefix}${Math.floor(10 + Math.random() * 89)}`;
    const lead = {
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name,
      phone,
      offerType,
      interestArea,
      referralCode,
      referredByCode,
    };
    db.leads.unshift(lead);
    saveDB(db);
    res.status(201).json({lead});
  });

  // Submit Review / Testimonial
  app.post('/api/reviews', (req, res) => {
    const name = sanitizeStr(req.body?.name, 80);
    const role = sanitizeStr(req.body?.role, 80) || 'Learner / Client';
    const organisation = sanitizeStr(req.body?.organisation, 100) || 'Ngama Community';
    const quote = sanitizeStr(req.body?.quote, 360);
    const outcome = sanitizeStr(req.body?.outcome, 120) || 'Verified community review';
    const rating = Math.min(5, Math.max(1, Number(req.body?.rating) || 5));

    if (!name || quote.length < 10) {
      return res.status(400).json({error: 'Please enter your name and a short review.'});
    }

    const db = loadDB();
    const item = {
      id: `rev-${Date.now()}`,
      name,
      role,
      organisation,
      quote,
      outcome,
      rating,
      createdAt: new Date().toISOString(),
    };
    db.testimonials.unshift(item);
    saveDB(db);
    res.status(201).json({testimonial: item});
  });

  // Simple PIN-protected Admin Routes
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const db = loadDB();
    const pin = sanitizeStr(req.header('x-admin-pin') || req.query.pin, 20);
    if (pin !== db.settings.adminPin) {
      return res.status(401).json({error: 'Invalid Admin PIN.'});
    }
    next();
  };

  app.get('/api/admin/dashboard', requireAdmin, (_req, res) => {
    const db = loadDB();
    res.json({
      admissions: db.admissions,
      orders: db.orders,
      leads: db.leads,
      bookings: db.bookings,
      courses: db.courses,
      promo: db.promo,
      gallery: db.gallery,
    });
  });

  app.patch('/api/admin/orders/:ref', requireAdmin, (req, res) => {
    const ref = sanitizeStr(req.params.ref, 40).toUpperCase();
    const status = sanitizeStr(req.body?.status, 30);
    const estimatedTotal = sanitizeStr(req.body?.estimatedTotal, 80);
    const db = loadDB();
    const order = db.orders.find((o) => o.ref.toUpperCase() === ref);
    if (!order) return res.status(404).json({error: 'Order not found'});
    if (['Received', 'In design', 'Printing', 'Ready'].includes(status)) {
      order.status = status;
    }
    if (estimatedTotal) order.estimatedTotal = estimatedTotal;
    order.updatedAt = new Date().toISOString();
    saveDB(db);
    res.json({order});
  });

  app.patch('/api/admin/admissions/:id', requireAdmin, (req, res) => {
    const id = sanitizeStr(req.params.id, 60);
    const db = loadDB();
    const adm = db.admissions.find((a) => a.id === id);
    if (!adm) return res.status(404).json({error: 'Admission not found'});
    if (['Pending', 'Accepted'].includes(req.body?.status)) adm.status = req.body.status;
    if (['Unpaid', 'Deposit Paid', 'Paid'].includes(req.body?.paymentStatus)) adm.paymentStatus = req.body.paymentStatus;
    saveDB(db);
    res.json({admission: adm});
  });

  app.put('/api/admin/courses/:id', requireAdmin, (req, res) => {
    const id = sanitizeStr(req.params.id, 60);
    const db = loadDB();
    const course = db.courses.find((c) => c.id === id);
    if (!course) return res.status(404).json({error: 'Course not found'});
    if (req.body?.title) course.title = sanitizeStr(req.body.title, 120);
    if (req.body?.fee) course.fee = sanitizeStr(req.body.fee, 60);
    if (req.body?.duration) course.duration = sanitizeStr(req.body.duration, 60);
    if (req.body?.schedule) course.schedule = sanitizeStr(req.body.schedule, 100);
    if (typeof req.body?.active === 'boolean') course.active = req.body.active;
    saveDB(db);
    res.json({course});
  });

  app.post('/api/admin/courses', requireAdmin, (req, res) => {
    const title = sanitizeStr(req.body?.title, 120);
    const category = sanitizeStr(req.body?.category, 30) || 'computer';
    const fee = sanitizeStr(req.body?.fee, 60) || 'Contact for price';
    if (!title) return res.status(400).json({error: 'Course title is required.'});
    const db = loadDB();
    const course = {
      id: `course-${Date.now()}`,
      category,
      title,
      level: sanitizeStr(req.body?.level, 50) || 'All Levels',
      duration: sanitizeStr(req.body?.duration, 50) || '4 Weeks',
      schedule: sanitizeStr(req.body?.schedule, 80) || 'Flexible',
      fee,
      highlights: Array.isArray(req.body?.highlights) ? req.body.highlights.slice(0, 5) : ['Practical training', 'Personal support'],
      active: true,
    };
    db.courses.push(course);
    saveDB(db);
    res.status(201).json({course});
  });

  app.put('/api/admin/promo', requireAdmin, (req, res) => {
    const db = loadDB();
    if (req.body?.headline) db.promo.headline = sanitizeStr(req.body.headline, 140);
    if (req.body?.subtext) db.promo.subtext = sanitizeStr(req.body.subtext, 220);
    if (req.body?.targetDateISO) db.promo.targetDateISO = sanitizeStr(req.body.targetDateISO, 40);
    if (typeof req.body?.active === 'boolean') db.promo.active = req.body.active;
    saveDB(db);
    res.json({promo: db.promo});
  });

  app.post('/api/admin/gallery', requireAdmin, (req, res) => {
    const title = sanitizeStr(req.body?.title, 100);
    const category = sanitizeStr(req.body?.category, 60) || 'Centre & Work';
    const caption = sanitizeStr(req.body?.caption, 200);
    const imageUrl = sanitizeStr(req.body?.imageUrl, 300) || '/assets/aistudio/Ebenezer_Technology_Logo_on_Cream_Texture_9898ff89.png';
    if (!title) return res.status(400).json({error: 'Title is required.'});
    const db = loadDB();
    const item = {id: `gal-${Date.now()}`, title, category, caption, imageUrl, isPlaceholderFlyer: false};
    db.gallery.unshift(item);
    saveDB(db);
    res.status(201).json({item});
  });

  app.delete('/api/admin/gallery/:id', requireAdmin, (req, res) => {
    const id = sanitizeStr(req.params.id, 60);
    const db = loadDB();
    db.gallery = db.gallery.filter((g) => g.id !== id);
    saveDB(db);
    res.json({ok: true});
  });

  // SEO XML Sitemap & Robots.txt
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const pages = ['', '/?view=programs', '/?view=printing', '/?view=institutions', '/?view=admissions', '/?view=stories'];
    const urls = pages
      .map(
        (p) =>
          `<url><loc>${baseUrl}${p}</loc><changefreq>weekly</changefreq><priority>${p === '' ? '1.0' : '0.8'}</priority></url>`
      )
      .join('');
    res.type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
    );
  });

  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`);
  });

  // Vite Dev vs Production Static
  const distDir = path.join(__dirname, 'dist');
  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(distDir);

  if (isProd) {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ebenezer Technology and Skills Centre running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

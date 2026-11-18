export type ServiceCategory =
  | 'computer'
  | 'tuition'
  | 'reading'
  | 'content'
  | 'printing'
  | 'enterprise';

export type OrderStage = 'Received' | 'In design' | 'Printing' | 'Ready';

export interface CourseItem {
  id: string;
  category: ServiceCategory;
  title: string;
  level: string;
  duration: string;
  schedule: string;
  fee: string;
  highlights: string[];
  active: boolean;
}

export interface AdmissionRecord {
  id: string;
  admissionNo: string;
  submittedAt: string;
  intakeTerm: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  idOrBirthCert: string;
  phone: string;
  email: string;
  address: string;
  townArea: string;
  schoolOrOccupation: string;
  highestLevel: string;
  programmes: string[];
  specificCourse: string;
  preferredStartDate: string;
  preferredDays: string[];
  preferredTime: 'Morning' | 'Afternoon' | 'Evening';
  trainingMode: 'Individual' | 'Group' | 'Holiday/Short Course';
  expectedDuration: string;
  isMinor: boolean;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianAddress: string;
  guardianAltContact: string;
  declarationAccepted: boolean;
  privacyAccepted: boolean;
  status: 'Pending' | 'Accepted';
  paymentStatus: 'Unpaid' | 'Deposit Paid' | 'Paid';
}

export interface PrintQuoteOrder {
  ref: string;
  createdAt: string;
  updatedAt: string;
  customerType: 'Individual' | 'School' | 'Church' | 'Health Facility' | 'NGO' | 'Business';
  institutionOrName: string;
  contactPerson: string;
  phone: string;
  email: string;
  serviceType: string;
  isPartnerJob: boolean;
  size: string;
  quantity: number;
  colourMode: 'Black & White' | 'Full Colour';
  paperType: string;
  finishing: string;
  needsDesignLayout: boolean;
  fileName?: string;
  notes: string;
  requiredDate: string;
  deliveryLocation: string;
  estimatedTotal: string;
  status: OrderStage;
}

export interface LeadRecord {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  offerType: 'Free Consultation' | 'Free CV Check' | 'Free First Lesson' | 'WhatsApp Broadcast' | 'Referral';
  interestArea: string;
  referralCode?: string;
  referredByCode?: string;
}

export interface SeatBooking {
  id: string;
  createdAt: string;
  date: string;
  session: 'Morning' | 'Afternoon' | 'Evening';
  learnerName: string;
  phone: string;
  topic: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  organisation: string;
  quote: string;
  outcome: string;
  rating: number;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  caption: string;
  imageUrl: string;
  isPlaceholderFlyer?: boolean;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
}

export interface PromoOffer {
  headline: string;
  subtext: string;
  targetDateISO: string;
  badgeText: string;
  active: boolean;
}

export interface CentreSettings {
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
}

export interface PublicSiteData {
  courses: CourseItem[];
  promo: PromoOffer;
  testimonials: TestimonialItem[];
  gallery: GalleryItem[];
  articles: BlogArticle[];
  settings: CentreSettings;
  counters: {
    learnersTrained: number;
    coursesOffered: number;
    documentsPrinted: number;
    partnerInstitutions: number;
  };
}

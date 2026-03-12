export type NavItem = {
  label: string;
  href: string;
  submenu?: {
    label: string;
    href: string;
  }[];
};

export type BannerItem = {
  title: string;
  tag: string;
};

export type PyqItem = {
  title: string;
  subtitle: string;
  href: string;
};

export type VideoItem = {
  title: string;
  embedUrl: string;
};

export type FacultyItem = {
  name: string;
  role: string;
};

export type FeatureItem = {
  title: string;
  description: string;
};

export type TeamDetail = {
  name: string;
  profile: string;
};

export type BookItem = {
  title: string;
  description: string;
  amazonUrl: string;
};

export type FaqItem = {
  question: string;
};

export type SiteContent = {
  brandName: string;
  brandSubtitle: string;
  navItems: NavItem[];
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  courses: BannerItem[];
  pyqTitle: string;
  pyqDescription: string;
  pyqs: PyqItem[];
  videosTitle: string;
  videosDescription: string;
  videos: VideoItem[];
  missionTitle: string;
  missionDescription: string;
  qualifications: string[];
  missionImageUrl: string;
  facultyTitle: string;
  facultyDescription: string;
  faculty: FacultyItem[];
  whyTitle: string;
  whyDescription: string;
  features: FeatureItem[];
  teamTitle: string;
  teamDescription: string;
  teamDetails: TeamDetail[];
  booksTitle: string;
  booksDescription: string;
  books: BookItem[];
  mockTitle: string;
  mockDescription: string;
  mockTests: BannerItem[];
  footerTitle: string;
  footerDescription: string;
  faqs: FaqItem[];
  calendarText: string;
  copyrightText: string;
};

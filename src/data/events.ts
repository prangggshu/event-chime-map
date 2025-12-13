export type EventCategory = 'technical' | 'cultural' | 'sports' | 'academic';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  society: string;
  category: EventCategory;
  posterUrl: string;
  interestedCount: number;
}

export const events: Event[] = [
  {
    id: '1',
    title: 'HackABot 2025',
    description: '7-hour hackathon bringing together the brightest minds to solve real-world problems. Build, innovate, and compete for amazing prizes!',
    date: '2025-12-13',
    time: '10:00 AM',
    venue: 'Campus 25',
    society: 'USC KIIT',
    category: 'technical',
    posterUrl: 'https://images.unsplash.com/photo-1632910121591-29e2484c0259?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    interestedCount: 234,
  },
  {
    id: '2',
    title: 'KIIT FEST 2026',
    description: 'Three days of music, dance, art, and celebration! Join us for performances, competitions, and unforgettable memories.',
    date: '2026-02-14',
    time: '05:00 PM',
    venue: 'KSAC Ground',
    society: 'KIITFEST OC',
    category: 'cultural',
    posterUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
    interestedCount: 567,
  },
  {
    id: '3',
    title: 'Inter-College Basketball Tournament',
    description: 'Watch the best college teams compete! Exciting matches, skilled players, and thrilling moments await basketball fans.',
    date: '2025-12-20',
    time: '02:00 PM',
    venue: 'KSAC Indoor Games',
    society: 'KSAC Sports Club',
    category: 'sports',
    posterUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
    interestedCount: 189,
  },
  {
    id: '4',
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop covering the fundamentals of AI and ML. Perfect for beginners!',
    date: '2025-12-15',
    time: '10:00 AM',
    venue: 'CS Lab, Campus 25',
    society: 'AISOC',
    category: 'technical',
    posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
    interestedCount: 156,
  },
  {
    id: '5',
    title: 'Guest Lecture: Future of Sustainable Energy',
    description: 'Distinguished Professor Dr. Sarah Chen discusses breakthrough technologies in renewable energy and their impact on our future.',
    date: '2025-12-16',
    time: '11:00 AM',
    venue: 'Campus 6 Hall',
    society: 'Environmental Society',
    category: 'academic',
    posterUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&h=400&fit=crop',
    interestedCount: 98,
  },
  {
    id: '6',
    title: 'Research Symposium 2025',
    description: 'Undergraduate and graduate students present their research projects. Network with faculty and industry professionals.',
    date: '2025-12-21',
    time: '09:00 AM',
    venue: 'Conference Center',
    society: 'IEEE Student Branch',
    category: 'academic',
    posterUrl: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=600&h=400&fit=crop',
    interestedCount: 145,
  },
  {
    id: '7',
    title: 'Orphanage Visit',
    description: 'Join us for a day of giving back! Spend time with children at the local orphanage, participate in fun activities, and spread joy.',
    date: '2025-12-23',
    time: '03:00 PM',
    venue: 'Asha Kiran Orphanage',
    society: 'NSS SCE',
    category: 'cultural',
    posterUrl: 'https://images.unsplash.com/photo-1617878227827-8360231f7f03?q=80&w=1256&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    interestedCount: 423,
  },
];

export const categoryColors: Record<EventCategory, string> = {
  technical: 'bg-category-technical',
  cultural: 'bg-category-cultural',
  sports: 'bg-category-sports',
  academic: 'bg-category-academic',
};

export const categoryLabels: Record<EventCategory, string> = {
  technical: 'Technical',
  cultural: 'Cultural',
  sports: 'Sports',
  academic: 'Academic',
};

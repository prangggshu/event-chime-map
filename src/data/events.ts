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
    title: 'HackCampus 2024',
    description: '24-hour hackathon bringing together the brightest minds to solve real-world problems. Build, innovate, and compete for amazing prizes!',
    date: '2024-12-20',
    time: '09:00 AM',
    venue: 'Main Auditorium',
    society: 'Tech Society',
    category: 'technical',
    posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
    interestedCount: 234,
  },
  {
    id: '2',
    title: 'Annual Cultural Fest',
    description: 'Three days of music, dance, art, and celebration! Join us for performances, competitions, and unforgettable memories.',
    date: '2024-12-22',
    time: '05:00 PM',
    venue: 'Open Air Theatre',
    society: 'Cultural Committee',
    category: 'cultural',
    posterUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
    interestedCount: 567,
  },
  {
    id: '3',
    title: 'Inter-College Basketball Tournament',
    description: 'Watch the best college teams compete for glory. Cheer for your favorites and witness incredible athleticism!',
    date: '2024-12-18',
    time: '02:00 PM',
    venue: 'Sports Complex',
    society: 'Sports Club',
    category: 'sports',
    posterUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
    interestedCount: 189,
  },
  {
    id: '4',
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop covering the fundamentals of AI and ML. Perfect for beginners looking to dive into the world of artificial intelligence.',
    date: '2024-12-15',
    time: '10:00 AM',
    venue: 'Computer Science Lab',
    society: 'AI Club',
    category: 'technical',
    posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
    interestedCount: 156,
  },
  {
    id: '5',
    title: 'Guest Lecture: Future of Sustainable Energy',
    description: 'Distinguished Professor Dr. Sarah Chen discusses breakthrough technologies in renewable energy and their impact on our future.',
    date: '2024-12-16',
    time: '11:00 AM',
    venue: 'Lecture Hall A',
    society: 'Environmental Society',
    category: 'academic',
    posterUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&h=400&fit=crop',
    interestedCount: 98,
  },
  {
    id: '6',
    title: 'Dance Competition: Rhythm Night',
    description: 'Solo and group dance performances across various genres. Show off your moves and win exciting prizes!',
    date: '2024-12-19',
    time: '06:00 PM',
    venue: 'Student Center',
    society: 'Dance Club',
    category: 'cultural',
    posterUrl: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600&h=400&fit=crop',
    interestedCount: 312,
  },
  {
    id: '7',
    title: 'Research Symposium 2024',
    description: 'Undergraduate and graduate students present their research projects. Network with faculty and industry professionals.',
    date: '2024-12-21',
    time: '09:00 AM',
    venue: 'Conference Center',
    society: 'Research Council',
    category: 'academic',
    posterUrl: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=600&h=400&fit=crop',
    interestedCount: 145,
  },
  {
    id: '8',
    title: 'Cricket Premier League Finals',
    description: 'The ultimate showdown! Watch the top two teams battle it out for the championship title.',
    date: '2024-12-23',
    time: '03:00 PM',
    venue: 'Cricket Ground',
    society: 'Cricket Club',
    category: 'sports',
    posterUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop',
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

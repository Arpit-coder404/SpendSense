import { CampusInsight } from '../types/finance';

export interface CampusAggregates {
  averageMonthlySpend: number;
  averageDailySpend: number;
  totalStudentsSampled: number;
  topCategory: string;
  upiPaymentSharePercentage: number;
  canteenVsDeliveryRatio: string;
  weekendSpikePercentage: number;
  campusName: string;
  lastUpdated: string;
}

export const CAMPUS_OVERVIEW: CampusAggregates = {
  averageMonthlySpend: 9420,
  averageDailySpend: 314,
  totalStudentsSampled: 1420,
  topCategory: 'Food & Cafes (44%)',
  upiPaymentSharePercentage: 86,
  canteenVsDeliveryRatio: '68% Canteen / 32% Zomato',
  weekendSpikePercentage: 38,
  campusName: 'North Campus & Tech Cluster',
  lastUpdated: 'Updated 2 hours ago (Anonymous Aggregation)',
};

export const CAMPUS_CATEGORY_BREAKDOWN = [
  { category: 'Food & Cafes', campusAvg: 4140, percentage: 44, color: '#38C98A', yourAvg: 3680 },
  { category: 'Shopping & Apparel', campusAvg: 1680, percentage: 18, color: '#F17E69', yourAvg: 2760 },
  { category: 'Transport & Metro', campusAvg: 1250, percentage: 13, color: '#F3D66B', yourAvg: 855 },
  { category: 'Entertainment & Outings', campusAvg: 980, percentage: 10, color: '#A78BFA', yourAvg: 800 },
  { category: 'Subscriptions & Software', campusAvg: 490, percentage: 5, color: '#60A5FA', yourAvg: 358 },
  { category: 'Academics & Printing', campusAvg: 480, percentage: 5, color: '#FBBF24', yourAvg: 490 },
  { category: 'Utilities & Misc', campusAvg: 400, percentage: 5, color: '#9CA3AF', yourAvg: 590 },
];

export const CAMPUS_TIME_TRENDS = [
  { day: 'Mon', campusAvg: 210, yourAvg: 180, note: 'Lectures start, low spend' },
  { day: 'Tue', campusAvg: 240, yourAvg: 260, note: 'Midweek canteen hangouts' },
  { day: 'Wed', campusAvg: 280, yourAvg: 310, note: 'Library study sessions & snacks' },
  { day: 'Thu', campusAvg: 295, yourAvg: 220, note: 'Evening campus walks' },
  { day: 'Fri', campusAvg: 460, yourAvg: 540, note: 'Friday night treat spike 🍟' },
  { day: 'Sat', campusAvg: 520, yourAvg: 490, note: 'Weekend movies & mall trips' },
  { day: 'Sun', campusAvg: 390, yourAvg: 350, note: 'Hostel mess dinners & grocery prep' },
];

export const CAMPUS_EDITORIAL_INSIGHTS: CampusInsight[] = [
  {
    id: 'ci_1',
    title: 'The Great Chai & Canteen Economy',
    category: 'Food',
    period: 'October 2026',
    averageStudentSpend: 4140,
    campusMedian: 3850,
    studentSharePercentage: 44,
    trendPercentage: 6.2,
    sampleSize: 1420,
    narrative: 'Food remains the undisputed heartbeat of campus life. 68% of food transactions occur under ₹100 — driven by quick cutting-chais, samosas, and post-lecture buns.',
    sourceType: 'simulated_campus_aggregate',
  },
  {
    id: 'ci_2',
    title: 'Metro Passes Beat Cabs 4-to-1',
    category: 'Transport',
    period: 'October 2026',
    averageStudentSpend: 1250,
    campusMedian: 1100,
    studentSharePercentage: 13,
    trendPercentage: -3.8,
    sampleSize: 1180,
    narrative: 'Thanks to student metro card passes and bike-taxis, students keep transport lean. Only 8% of students spent more than ₹2,000 on cabs this month.',
    sourceType: 'simulated_campus_aggregate',
  },
  {
    id: 'ci_3',
    title: 'The Friday Night Outing Index',
    category: 'Entertainment',
    period: 'October 2026',
    averageStudentSpend: 980,
    campusMedian: 850,
    studentSharePercentage: 10,
    trendPercentage: 14.5,
    sampleSize: 940,
    narrative: 'Between 7:00 PM and 11:30 PM on Fridays, average student transaction volume jumps by 185%. Group bill-splitting is most active right before midnight.',
    sourceType: 'simulated_campus_aggregate',
  },
  {
    id: 'ci_4',
    title: 'Semester-Break Travel Warchests',
    category: 'Other',
    period: 'October 2026',
    averageStudentSpend: 3200,
    campusMedian: 2500,
    studentSharePercentage: 22,
    trendPercentage: 28.0,
    sampleSize: 850,
    narrative: 'Over 62% of students currently have at least one active savings goal earmarked for semester-break trips (Goa, Himachal, and Pondicherry leading the charts).',
    sourceType: 'simulated_campus_aggregate',
  },
];


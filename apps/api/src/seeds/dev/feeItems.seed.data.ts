import { genUuid } from '../helper/generateUuid';
import { studentSeedData } from './actors';

export const feesSeedData = {
  student1_semester1: {
    id: genUuid('student1_semester1'),
    studentId: studentSeedData.student1.id,
    name: 'Semester 1 Fees 2025-2026',
    startDate: '2025-09-01',
    endDate: '2026-01-01',
  },
  student1_semester2: {
    id: genUuid('student1_semester2'),
    studentId: studentSeedData.student1.id,
    name: 'Semester 2 Fees 2025-2026',
    startDate: '2026-01-01',
    endDate: '2026-05-01',
  },
  student2_month1: {
    id: genUuid('student2_month1'),
    studentId: studentSeedData.student2.id,
    name: 'Month 1 Fees 2025-2026',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
  },
  student2_month2: {
    id: genUuid('student2_month2'),
    studentId: studentSeedData.student2.id,
    name: 'Month 2 Fees 2025-2026',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
  },
  student2_month3: {
    id: genUuid('student2_month3'),
    studentId: studentSeedData.student2.id,
    name: 'Month 3 Fees 2025-2026',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
  },
  student2_month4: {
    id: genUuid('student2_month4'),
    studentId: studentSeedData.student2.id,
    name: 'Month 4 Fees 2025-2026',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
  },
  student2_month5: {
    id: genUuid('student2_month5'),
    studentId: studentSeedData.student2.id,
    name: 'Month 5 Fees 2025-2026',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
  },
  student2_month6: {
    id: genUuid('student2_month6'),
    studentId: studentSeedData.student2.id,
    name: 'Month 6 Fees 2025-2026',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
  },
  student2_month7: {
    id: genUuid('student2_month7'),
    studentId: studentSeedData.student2.id,
    name: 'Month 7 Fees 2025-2026',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
  },
  student2_month8: {
    id: genUuid('student2_month8'),
    studentId: studentSeedData.student2.id,
    name: 'Month 8 Fees 2025-2026',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
  },
};

const month = ['september', 'october', 'november', 'december', 'january', 'february', 'march', 'april', 'may'];

export const feeItemsSeedData = {
  student1_semester1_Items: [
    {
      id: genUuid('student1_semester1_tranche1_tuition'),
      feeId: feesSeedData.student1_semester1.id,
      title: 'Tranche Tuition',
      description: 'First payment for the 2025-2026 academic year',
      amount: 250,
    },
  ],
  student1_semester2_Items: [
    {
      id: genUuid('student1_semester2_tranche1_tuition'),
      feeId: feesSeedData.student1_semester2.id,
      title: 'Tranche Tuition',
      description: 'Second payment for the 2025-2026 academic year',
      amount: 250,
    },
  ],
};

month.map((m) => {
  feeItemsSeedData.student1_semester1_Items.push({
    id: genUuid(`student1_semester1_tranche1_etude_mat_${m}`),
    feeId: feesSeedData.student1_semester1.id,
    title: 'Etude Mat',
    description: `Mois de ${m}`,
    amount: 70,
  });
});

month.map((m) => {
  feeItemsSeedData.student1_semester1_Items.push({
    id: genUuid(`student1_semester1_tranche1_etude_english_${m}`),
    feeId: feesSeedData.student1_semester1.id,
    title: 'Etude English',
    description: `Mois de ${m}`,
    amount: 70,
  });
});

month.map((m) => {
  feeItemsSeedData.student1_semester1_Items.push({
    id: genUuid(`student1_semester1_tranche1_club_art_${m}`),
    feeId: feesSeedData.student1_semester1.id,
    title: 'Art Club',
    description: `Mois de ${m}`,
    amount: 50,
  });
});

month.map((m) => {
  feeItemsSeedData.student1_semester2_Items.push({
    id: genUuid(`student1_semester2_tranche1_etude_mat_${m}`),
    feeId: feesSeedData.student1_semester2.id,
    title: 'Etude Mat',
    description: `Mois de ${m}`,
    amount: 70,
  });
});

month.map((m) => {
  feeItemsSeedData.student1_semester2_Items.push({
    id: genUuid(`student1_semester2_tranche1_etude_english_${m}`),
    feeId: feesSeedData.student1_semester2.id,
    title: 'Etude English',
    description: `Mois de ${m}`,
    amount: 70,
  });
});

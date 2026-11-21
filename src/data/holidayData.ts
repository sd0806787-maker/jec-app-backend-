export interface Holiday {
  id: string;
  name: string;
  date: string;
  day: string;
  type: 'National Holiday' | 'Public Holiday' | 'Restricted Holiday' | 'Special Casual Leave' | 'Half Holiday';
}

// Helper function to format the date strings into "DD MMM YYYY" and Day of week
const createHoliday = (id: string, dateStr: string, name: string, type: any): Holiday => {
  const dateObj = new Date(dateStr);
  const day = dateObj.toLocaleDateString('en-GB', { day: '2-digit' });
  const month = dateObj.toLocaleDateString('en-GB', { month: 'short' });
  const year = dateObj.toLocaleDateString('en-GB', { year: 'numeric' });
  const dayOfWeek = dateObj.toLocaleDateString('en-GB', { weekday: 'long' });

  return {
    id,
    name,
    date: `${day} ${month} ${year}`,
    day: dayOfWeek,
    type,
  };
};

export const mockHolidays: Holiday[] = [
  // January
  createHoliday('1', '2026-01-01', "New Year's Day", 'Restricted Holiday'),
  createHoliday('2', '2026-01-13', 'Uruka of Magh Bihu', 'Restricted Holiday'),
  createHoliday('3', '2026-01-14', 'Magh Bihu & Tusu Puja', 'Public Holiday'),
  createHoliday('4', '2026-01-15', 'Magh Bihu', 'Public Holiday'),
  createHoliday('5', '2026-01-23', "Netaji's Birthday", 'Public Holiday'),
  createHoliday('6', '2026-01-26', 'Republic Day', 'National Holiday'),
  createHoliday('7', '2026-01-27', 'Gwthar Bathou San', 'Public Holiday'),
  createHoliday('8', '2026-01-31', 'Me-Dam-Me-Phi', 'Public Holiday'),

  // February
  createHoliday('9', '2026-02-01', 'Bir Chilaray Divas', 'Public Holiday'),
  createHoliday('10', '2026-02-04', 'Shab-E-Barat', 'Restricted Holiday'),
  createHoliday('11', '2026-02-15', 'Sivaratri', 'Restricted Holiday'),
  createHoliday('12', '2026-02-18', 'Ali Aye Ligang', 'Restricted Holiday'),

  // March
  createHoliday('13', '2026-03-03', 'Dol Jatra', 'Public Holiday'),
  createHoliday('14', '2026-03-17', 'Lailatur Qadar', 'Restricted Holiday'),
  createHoliday('15', '2026-03-21', 'Id-Ul-Fitr', 'Public Holiday'),
  createHoliday('16', '2026-03-31', 'Mahabir Jayanti', 'Restricted Holiday'),

  // April
  createHoliday('17', '2026-04-03', 'Good Friday', 'Public Holiday'),
  createHoliday('18', '2026-04-14', 'Bohag Bihu', 'Public Holiday'),
  createHoliday('19', '2026-04-15', 'Bohag Bihu', 'Public Holiday'),
  createHoliday('20', '2026-04-16', 'Bohag Bihu', 'Public Holiday'),
  createHoliday('21', '2026-04-18', 'Tithi of Damodar Deva', 'Public Holiday'),
  createHoliday('22', '2026-04-21', 'Sati Sadhini Divas', 'Public Holiday'),

  // May
  createHoliday('23', '2026-05-01', 'May Day & Buddha Purnima', 'Public Holiday'),
  createHoliday('24', '2026-05-27', 'Id-ul-Zuha', 'Public Holiday'),

  // June
  createHoliday('25', '2026-06-01', 'Janmotsav of Sri Sri Madhabdeva', 'Public Holiday'),
  createHoliday('26', '2026-06-20', 'Death Anniversary of Bishnu Prasad Rabha', 'Restricted Holiday'),

  // July
  createHoliday('27', '2026-07-09', 'Matri Pitri Vandana', 'Special Casual Leave'),
  createHoliday('28', '2026-07-10', 'Matri Pitri Vandana', 'Special Casual Leave'),
  createHoliday('29', '2026-07-23', 'Matri Pitri Vandana', 'Special Casual Leave'),
  createHoliday('30', '2026-07-24', 'Matri Pitri Vandana', 'Special Casual Leave'),

  // August
  createHoliday('31', '2026-08-15', 'Independence Day', 'National Holiday'),
  createHoliday('32', '2026-08-26', 'Fateha-e-Dwazdaham', 'Restricted Holiday'),

  // September
  createHoliday('33', '2026-09-01', 'Tirubhav Tithi of Sri Sri Madhabdeva', 'Public Holiday'),
  createHoliday('34', '2026-09-04', 'Janmashtami', 'Public Holiday'),
  createHoliday('35', '2026-09-12', 'Tirubhav Tithi of Srimanta Sankardeva', 'Public Holiday'),
  createHoliday('36', '2026-09-15', 'Naukhai Festival', 'Restricted Holiday'),
  createHoliday('37', '2026-09-21', 'Janmotsav of Srimanta Sankardeva', 'Public Holiday'),
  createHoliday('38', '2026-09-22', 'Karam Puja', 'Public Holiday'),

  // October
  createHoliday('39', '2026-10-02', 'Birthday of Mahatma Gandhi', 'National Holiday'),
  createHoliday('40', '2026-10-18', 'Kati Bihu & Durga Puja', 'Public Holiday'),
  createHoliday('41', '2026-10-19', 'Durga Puja & Vijaya Dashami', 'Public Holiday'),
  createHoliday('42', '2026-10-20', 'Durga Puja', 'Public Holiday'),
  createHoliday('43', '2026-10-21', 'Durga Puja', 'Public Holiday'),
  createHoliday('44', '2026-10-25', 'Lakshmi Puja (Half Holiday)', 'Half Holiday'),

  // November
  createHoliday('45', '2026-11-08', 'Kali Puja & Diwali', 'Public Holiday'),
  createHoliday('46', '2026-11-11', 'Bhatri Dwitiya', 'Public Holiday'),
  createHoliday('47', '2026-11-15', 'Chhath Puja', 'Public Holiday'),
  createHoliday('48', '2026-11-24', "Guru Nanak's Birthday & Lachit Divas", 'Public Holiday'),

  // December
  createHoliday('49', '2026-12-02', 'Asom Divas (Su-Ka-Pha Divas)', 'Public Holiday'),
  createHoliday('50', '2026-12-25', 'Christmas Day', 'Public Holiday'),
];

export const recurringHolidays2026 = {
  weekly: ["Sunday"],
  secondAndFourthSaturdays: true,
  bankAnnualClosing: "2026-04-01"
};
export interface WordEntry {
    thai: string;
    phonetic: string;
    zhTW: string;
    note: string;
}

export interface Lesson {
    id: string;
    letter: string;
    letterLabel: string;
    letterClass: string;
    emoji: string;
    svgPath: string;
    pathLength: number;
    startPoint: { cx: number; cy: number };
    street: WordEntry;
    faith: WordEntry;
}

export const LESSONS: Lesson[] = [
    {
        id: 'pho-phung',
        letter: 'พ',
        letterLabel: '圓頭字母',
        letterClass: '低聲調類',
        emoji: '🐝',
        svgPath: 'M 18,35 A 8,8 0 1 1 34,35 A 8,8 0 1 1 18,35 M 34,35 L 34,85 L 50,55 L 66,85 L 66,15',
        pathLength: 280,
        startPoint: { cx: 26, cy: 35 },
        street: {
            thai: 'พริก',
            phonetic: 'phrik',
            zhTW: '辣椒',
            note: '北泰料理必備。Nam Prik Num 辣醬的主角，清邁人的靈魂食材。',
        },
        faith: {
            thai: 'พระเจ้า',
            phonetic: 'phrá jâo',
            zhTW: '上帝',
            note: '「พระ」有尊貴、神聖之意，用於神聖稱謂與禱告中。',
        },
    },
    {
        id: 'ko-kai',
        letter: 'ก',
        letterLabel: '雞形字母',
        letterClass: '中聲調類',
        emoji: '🐔',
        svgPath: 'M 20,85 L 20,45 C 20,15 45,15 50,30 C 55,15 80,15 80,45 L 80,85',
        pathLength: 180,
        startPoint: { cx: 20, cy: 85 },
        street: {
            thai: 'ไก่',
            phonetic: 'gài',
            zhTW: '雞',
            note: '泰國常見食材。烤雞（ไก่ย่าง）是北泰夜市的招牌美食。',
        },
        faith: {
            thai: 'กราบ',
            phonetic: 'grâap',
            zhTW: '跪拜',
            note: '向佛或神明表達最高敬意的行禮方式，也用於教會。',
        },
    },
    {
        id: 'mo-ma',
        letter: 'ม',
        letterLabel: '馬形字母',
        letterClass: '低聲調類',
        emoji: '🐴',
        svgPath: 'M 20,35 A 8,8 0 1 1 36,35 A 8,8 0 1 1 20,35 M 36,35 L 36,75 A 10,10 0 1 1 16,75 L 80,75',
        pathLength: 220,
        startPoint: { cx: 28, cy: 35 },
        street: {
            thai: 'มะม่วง',
            phonetic: 'má mûang',
            zhTW: '芒果',
            note: '泰國最受歡迎的熱帶水果。',
        },
        faith: {
            thai: 'มงคล',
            phonetic: 'mong khon',
            zhTW: '聖福',
            note: '用於祝福禱告。',
        },
    },
    {
        id: 'no-nu',
        letter: 'น',
        letterLabel: '鼠形字母',
        letterClass: '低聲調類',
        emoji: '🐭',
        svgPath: 'M 20,35 A 8,8 0 1 1 36,35 A 8,8 0 1 1 20,35 M 36,35 L 36,70 L 70,70 A 10,10 0 1 0 70,50 L 70,15',
        pathLength: 200,
        startPoint: { cx: 28, cy: 35 },
        street: {
            thai: 'น้ำ',
            phonetic: 'náam',
            zhTW: '水',
            note: '基础單詞。',
        },
        faith: {
            thai: 'นมัสการ',
            phonetic: 'ná mát sà gaan',
            zhTW: '敬拜',
            note: '教會禮拜活動用語。',
        },
    },
    {
        id: 'kho-khai',
        letter: 'ข',
        letterLabel: '蛋形字母',
        letterClass: '高聲調類',
        emoji: '🥚',
        svgPath: 'M 30,25 A 6,6 0 1 1 42,25 A 6,6 0 1 1 30,25 M 30,25 L 20,25 L 20,85 L 60,85',
        pathLength: 160,
        startPoint: { cx: 36, cy: 25 },
        street: { thai: 'ไข่', phonetic: 'khài', zhTW: '蛋', note: '清邁早市常見。' },
        faith: { thai: 'ขอบคุณ', phonetic: 'khòp khun', zhTW: '感謝', note: '凡事謝恩。' },
    },
    {
        id: 'ngo-ngu',
        letter: 'ง',
        letterLabel: '蛇形字母',
        letterClass: '低聲調類',
        emoji: '🐍',
        svgPath: 'M 40,30 A 8,8 0 1 1 56,30 A 8,8 0 1 1 40,30 M 48,38 L 48,75 L 20,95',
        pathLength: 120,
        startPoint: { cx: 48, cy: 30 },
        street: { thai: 'เงิน', phonetic: 'nguen', zhTW: '錢', note: '泰銖。' },
        faith: { thai: 'โง่', phonetic: 'ngôo', zhTW: '愚拙', note: '求主賜智慧。' },
    },
    {
        id: 'sara-a',
        letter: 'ะ',
        letterLabel: '短元音 A',
        letterClass: '元音',
        emoji: '🫧',
        svgPath: 'M 30,40 A 6,6 0 1 1 42,40 A 6,6 0 1 1 30,40 M 42,40 C 55,40 55,70 35,70',
        pathLength: 100,
        startPoint: { cx: 36, cy: 40 },
        street: { thai: 'กระทะ', phonetic: 'grà-thá', zhTW: '平底鍋', note: '熱炒。' },
        faith: { thai: 'ธรรมะ', phonetic: 'tham-má', zhTW: '真理', note: '指佛法或公義。' },
    },
];

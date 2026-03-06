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
    nameThai: string; // 字母全名（例如 กอ ไก่）
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
        id: 'ko-kai',
        letter: 'ก',
        letterLabel: '雞形字母',
        nameThai: 'กอ ไก่',
        letterClass: '中聲調類',
        emoji: '🐔',
        svgPath: 'M 20,85 L 20,45 C 20,15 45,15 50,30 C 55,15 80,15 80,45 L 80,85',
        pathLength: 180,
        startPoint: { cx: 20, cy: 85 },
        street: { thai: 'ไก่', phonetic: 'gài', zhTW: '雞', note: '泰國常見食材。烤雞（ไก่ย่าง）是北泰夜市的招牌美食。' },
        faith: { thai: 'กราบ', phonetic: 'grâap', zhTW: '跪拜', note: '向佛或神明表達最高敬意的行禮方式，也用於教會。' },
    },
    {
        id: 'pho-phung',
        letter: 'พ',
        letterLabel: '蜜蜂字母',
        nameThai: 'พอ ผึ้ง',
        letterClass: '低聲調類',
        emoji: '🐝',
        svgPath: 'M 26,35 a 8,8 0 1 0 0,-16 a 8,8 0 1 0 0,16 L 26,85 L 50,55 L 74,85 L 74,15',
        pathLength: 280,
        startPoint: { cx: 26, cy: 35 },
        street: { thai: 'พริก', phonetic: 'phrík', zhTW: '辣椒', note: '北泰料理必備。Nam Prik Num 辣醬的主角。' },
        faith: { thai: 'พระเจ้า', phonetic: 'phrá jâo', zhTW: '上帝', note: '「พระ」有尊貴、神聖之意，用於神聖稱謂與禱告中。' },
    },
    {
        id: 'kho-khai',
        letter: 'ข',
        letterLabel: '蛋形字母',
        nameThai: 'ขอ ไข่',
        letterClass: '高聲調類',
        emoji: '🥚',
        svgPath: 'M 36,31 a 8,8 0 1 0 0,-16 a 8,8 0 1 0 0,16 c 0,10 -16,5 -16,20 L 20,85 L 70,85',
        pathLength: 200,
        startPoint: { cx: 36, cy: 31 },
        street: { thai: 'ไข่', phonetic: 'khài', zhTW: '蛋', note: '清邁早市常見。' },
        faith: { thai: 'ขอบคุณ', phonetic: 'khòop khun', zhTW: '感謝', note: '凡事謝恩。' },
    },
    {
        id: 'mo-ma',
        letter: 'ม',
        letterLabel: '馬形字母',
        nameThai: 'มอ ม้า',
        letterClass: '低聲調類',
        emoji: '🐴',
        svgPath: 'M 28,35 a 8,8 0 1 0 0,-16 a 8,8 0 1 0 0,16 L 28,70 a 8,8 0 1 0 -16,0 A 10,10 0 0 0 20,80 L 80,80 L 80,15',
        pathLength: 280,
        startPoint: { cx: 28, cy: 35 },
        street: { thai: 'มะม่วง', phonetic: 'má mûang', zhTW: '芒果', note: '泰國最受歡迎的熱帶水果。' },
        faith: { thai: 'มงคล', phonetic: 'mong khon', zhTW: '聖福', note: '用於祝福禱告。' },
    },
    {
        id: 'no-nu',
        letter: 'น',
        letterLabel: '鼠形字母',
        nameThai: 'นอ หนู',
        letterClass: '低聲調類',
        emoji: '🐭',
        svgPath: 'M 28,35 a 8,8 0 1 0 0,-16 a 8,8 0 1 0 0,16 L 28,80 L 60,80 a 8,8 0 1 0 0,-16 A 10,10 0 0 0 70,80 L 70,15',
        pathLength: 280,
        startPoint: { cx: 28, cy: 35 },
        street: { thai: 'น้ำ', phonetic: 'náam', zhTW: '水', note: '基础單詞。' },
        faith: { thai: 'นมัสการ', phonetic: 'ná mát sà gaan', zhTW: '敬拜', note: '教會禮拜活動用語。' },
    },
    {
        id: 'ngo-ngu',
        letter: 'ง',
        letterLabel: '蛇形字母',
        nameThai: 'งอ งู',
        letterClass: '低聲調類',
        emoji: '🐍',
        svgPath: 'M 48,32 a 8,8 0 1 0 0,-16 a 8,8 0 1 0 0,16 L 48,75 L 20,95',
        pathLength: 150,
        startPoint: { cx: 48, cy: 32 },
        street: { thai: 'เงิน', phonetic: 'nguen', zhTW: '錢', note: '泰銖。' },
        faith: { thai: 'โง่', phonetic: 'ngôo', zhTW: '愚拙', note: '求主賜智慧。' },
    },
    {
        id: 'cho-chang',
        letter: 'ช',
        letterLabel: '象形字母',
        nameThai: 'ชอ ช้าง',
        letterClass: '低聲調類',
        emoji: '🐘',
        svgPath: 'M 36,31 a 8,8 0 1 0 0,-16 a 8,8 0 1 0 0,16 c 0,10 -16,5 -16,20 L 20,85 L 70,85 L 70,40 a 8,8 0 1 1 16,-8 c 0,10 -10,35 -5,55',
        pathLength: 350,
        startPoint: { cx: 36, cy: 31 },
        street: { thai: 'ช้าง', phonetic: 'cháang', zhTW: '大象', note: '泰國的象徵動物。' },
        faith: { thai: 'ชีวิต', phonetic: 'chii wít', zhTW: '生命', note: '耶穌說：我就是道路、真理、生命。' },
    },
    {
        id: 'sara-a',
        letter: 'ะ',
        letterLabel: '短元音 A',
        nameThai: 'สระ อะ',
        letterClass: '元音',
        emoji: '🫧',
        svgPath: 'M 35,40 a 6,6 0 1 0 0,-12 a 6,6 0 1 0 0,12 C 55,40 55,70 30,75',
        pathLength: 100,
        startPoint: { cx: 35, cy: 40 },
        street: { thai: 'กระทะ', phonetic: 'grà-thá', zhTW: '平底鍋', note: '熱炒。' },
        faith: { thai: 'ธรรมะ', phonetic: 'tham-má', zhTW: '真理', note: '指佛法或公義。' },
    },
];

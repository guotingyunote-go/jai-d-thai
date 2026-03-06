export interface SentencePart {
    thai: string;
    phonetic: string;
    zhTW: string;
    category?: 'street' | 'faith' | 'both';
}

export const PRONOUNS: SentencePart[] = [
    { thai: 'ผม', phonetic: 'pǒm', zhTW: '我 (男)', category: 'both' },
    { thai: 'ฉัน', phonetic: 'chǎn', zhTW: '我 (女)', category: 'both' },
    { thai: 'เรา', phonetic: 'rao', zhTW: '我們', category: 'both' },
    { thai: 'คุณ', phonetic: 'khun', zhTW: '你', category: 'both' },
    { thai: 'เขา', phonetic: 'khǎo', zhTW: '他/她', category: 'both' },
    { thai: 'พระเจ้า', phonetic: 'phrá-jâo', zhTW: '上帝', category: 'faith' },
    { thai: 'ลูก', phonetic: 'lûuk', zhTW: '孩子 (對神自稱)', category: 'faith' },
];

export const VERBS: SentencePart[] = [
    // ── 基礎/生活 ──
    { thai: 'ไม่', phonetic: 'mâi', zhTW: '不 (否定)', category: 'both' },
    { thai: 'เป็น', phonetic: 'pen', zhTW: '是', category: 'both' },
    { thai: 'มาจาก', phonetic: 'maa-jàak', zhTW: '來自', category: 'both' },
    { thai: 'อยู่', phonetic: 'yùu', zhTW: '住在/在', category: 'both' },
    { thai: 'พูด', phonetic: 'phûut', zhTW: '說', category: 'both' },
    { thai: 'ไป', phonetic: 'bpai', zhTW: '去', category: 'both' },
    { thai: 'มา', phonetic: 'maa', zhTW: '來', category: 'both' },
    { thai: 'มี', phonetic: 'mii', zhTW: '有', category: 'both' },
    { thai: 'อยาก', phonetic: 'yàak', zhTW: '想要', category: 'both' },
    { thai: 'ต้องการ', phonetic: 'dtông-gaan', zhTW: '需要', category: 'both' },
    { thai: 'ชอบ', phonetic: 'chôop', zhTW: '喜歡', category: 'street' },
    { thai: 'ทำ', phonetic: 'tham', zhTW: '做', category: 'street' },
    { thai: 'ซื้อ', phonetic: 'sʉ́ʉ', zhTW: '買', category: 'street' },
    { thai: 'กิน', phonetic: 'gin', zhTW: '吃', category: 'street' },
    { thai: 'เรียน', phonetic: 'riian', zhTW: '學習', category: 'street' },
    { thai: 'นอน', phonetic: 'noon', zhTW: '睡覺', category: 'street' },
    { thai: 'ช่วย', phonetic: 'chûay', zhTW: '幫助', category: 'both' },
    { thai: 'รู้จัก', phonetic: 'rúu-jàk', zhTW: '認識', category: 'both' },
    // ── 信仰 ──
    { thai: 'รัก', phonetic: 'rák', zhTW: '愛', category: 'both' },
    { thai: 'เชื่อ', phonetic: 'chûea', zhTW: '相信', category: 'faith' },
    { thai: 'โหยหา', phonetic: 'yǒi-hǎa', zhTW: '渴慕', category: 'faith' },
    { thai: 'อธิษฐาน', phonetic: 'at-ti-thǎan', zhTW: '禱告', category: 'faith' },
    { thai: 'อธิษฐานเผื่อ', phonetic: 'at-ti-thǎan phùea', zhTW: '為…禱告', category: 'faith' },
    { thai: 'อวยพร', phonetic: 'uay-phon', zhTW: '祝福', category: 'faith' },
    { thai: 'แบ่งปัน', phonetic: 'bàeng-pan', zhTW: '分享', category: 'faith' },
    { thai: 'นมัสการ', phonetic: 'na-mát-sa-gaan', zhTW: '敬拜', category: 'faith' },
    { thai: 'สรรเสริญ', phonetic: 'sǎn-sə̌ən', zhTW: '讚美', category: 'faith' },
    { thai: 'ยกย่อง', phonetic: 'yók-yông', zhTW: '高舉', category: 'faith' },
    { thai: 'ยอม', phonetic: 'yoom', zhTW: '降服/願意', category: 'faith' },
    { thai: 'วางใจ', phonetic: 'waang-jai', zhTW: '信靠', category: 'faith' },
    { thai: 'ติดตาม', phonetic: 'dtìt-dtaam', zhTW: '跟隨', category: 'faith' },
    { thai: 'ถวาย', phonetic: 'thà-waai', zhTW: '獻上', category: 'faith' },
    { thai: 'ขอบพระคุณ', phonetic: 'khòop phrá-khun', zhTW: '感謝', category: 'faith' },
];

// NOTE: key 統一用 zhTW（中文），lookup 順序為 zhTW → thai
export const LOGICAL_OBJECTS: Record<string, SentencePart[]> = {
    // ── 否定 ──
    '不 (否定)': [
        { thai: 'เผ็ด', phonetic: 'phèt', zhTW: '辣', category: 'street' },
        { thai: 'ไป', phonetic: 'bpai', zhTW: '去', category: 'street' },
        { thai: 'กิน', phonetic: 'gin', zhTW: '吃', category: 'street' },
        { thai: 'แพง', phonetic: 'phaeng', zhTW: '貴', category: 'street' },
        { thai: 'กลัว', phonetic: 'glua', zhTW: '怕', category: 'both' },
        { thai: 'เป็นไร', phonetic: 'pen-rai', zhTW: '要緊（沒事）', category: 'both' },
    ],
    // ── 自我介紹 ──
    '是': [
        { thai: 'คนไต้หวัน', phonetic: 'khon-dtâi-waan', zhTW: '台灣人', category: 'both' },
        { thai: 'คริสเตียน', phonetic: 'khrit-dtian', zhTW: '基督徒', category: 'faith' },
        { thai: 'ครู', phonetic: 'khruu', zhTW: '老師', category: 'both' },
        { thai: 'เพื่อน', phonetic: 'phûean', zhTW: '朋友', category: 'both' },
        { thai: 'นักเรียน', phonetic: 'nák-riian', zhTW: '學生', category: 'both' },
    ],
    '來自': [
        { thai: 'ไต้หวัน', phonetic: 'dtâi-waan', zhTW: '台灣', category: 'both' },
        { thai: 'ต่างประเทศ', phonetic: 'dtàang-bprà-thêet', zhTW: '外國', category: 'both' },
    ],
    '住在/在': [
        { thai: 'เชียงใหม่', phonetic: 'chiiang-mài', zhTW: '清邁', category: 'both' },
        { thai: 'หมู่บ้าน', phonetic: 'mùu-bâan', zhTW: '村莊', category: 'both' },
        { thai: 'ที่นี่', phonetic: 'tîi-nîi', zhTW: '這裡', category: 'both' },
    ],
    '說': [
        { thai: 'ภาษาไทย', phonetic: 'paa-sǎa thai', zhTW: '泰語', category: 'both' },
        { thai: 'ภาษาอังกฤษ', phonetic: 'paa-sǎa ang-grìt', zhTW: '英語', category: 'both' },
        { thai: 'นิดหน่อย', phonetic: 'nít-nòi', zhTW: '一點點', category: 'both' },
        { thai: 'ภาษาเหนือ', phonetic: 'paa-sǎa nǔea', zhTW: '北泰話', category: 'street' },
    ],
    // ── 移動 ──
    '去': [
        { thai: 'กาด', phonetic: 'gàat', zhTW: '市場(泰北)', category: 'street' },
        { thai: 'ตลาด', phonetic: 'dta-làat', zhTW: '市場(泰語)', category: 'street' },
        { thai: 'ห้องน้ำ', phonetic: 'hông-náam', zhTW: '廁所', category: 'both' },
        { thai: 'โบสถ์', phonetic: 'bòot', zhTW: '教會', category: 'faith' },
        { thai: 'โรงเรียน', phonetic: 'roong-riian', zhTW: '學校', category: 'street' },
        { thai: 'โรงพยาบาล', phonetic: 'roong-phá-yaa-baan', zhTW: '醫院', category: 'both' },
        { thai: 'หมู่บ้าน', phonetic: 'mùu-bâan', zhTW: '村莊', category: 'both' },
        { thai: 'ดอย', phonetic: 'doi', zhTW: '山區(doi)', category: 'street' },
    ],
    '來': [
        { thai: 'ที่นี่', phonetic: 'tîi-nîi', zhTW: '這裡', category: 'both' },
        { thai: 'โบสถ์', phonetic: 'bòot', zhTW: '教會', category: 'faith' },
        { thai: 'จากไต้หวัน', phonetic: 'jàak dtâi-waan', zhTW: '從台灣', category: 'both' },
        { thai: 'หมู่บ้าน', phonetic: 'mùu-bâan', zhTW: '村莊', category: 'both' },
    ],
    // ── 持有 ──
    '有': [
        { thai: 'เงิน', phonetic: 'nguen', zhTW: '錢', category: 'street' },
        { thai: 'ความเชื่อ', phonetic: 'kwaam-chuea', zhTW: '信心', category: 'faith' },
        { thai: 'ความรัก', phonetic: 'kwaam-rák', zhTW: '愛心', category: 'both' },
        { thai: 'สันติสุข', phonetic: 'sǎn-ti-sùk', zhTW: '平安', category: 'faith' },
        { thai: 'ความหวัง', phonetic: 'kwaam-wǎng', zhTW: '盼望', category: 'faith' },
    ],
    // ── 慾望/需求 ──
    '想要': [
        { thai: 'อันนี้', phonetic: 'an-níi', zhTW: '這個', category: 'street' },
        { thai: 'อันนั้น', phonetic: 'an-nán', zhTW: '那個', category: 'street' },
        { thai: 'กินข้าว', phonetic: 'gin-khâaw', zhTW: '吃飯', category: 'street' },
        { thai: 'นอน', phonetic: 'noon', zhTW: '睡覺', category: 'street' },
        { thai: 'เรียนภาษาไทย', phonetic: 'riian paa-sǎa thai', zhTW: '學泰語', category: 'street' },
        { thai: 'ช่วย', phonetic: 'chûay', zhTW: '幫忙', category: 'both' },
    ],
    '需要': [
        { thai: 'ห้องน้ำ', phonetic: 'hông-náam', zhTW: '廁所', category: 'both' },
        { thai: 'พระคุณ', phonetic: 'phrá-khun', zhTW: '恩典', category: 'faith' },
        { thai: 'พระพร', phonetic: 'phrá-phon', zhTW: '祝福', category: 'faith' },
        { thai: 'เงิน', phonetic: 'nguen', zhTW: '錢', category: 'street' },
        { thai: 'นอน', phonetic: 'noon', zhTW: '睡覺', category: 'street' },
        { thai: 'อธิษฐาน', phonetic: 'at-ti-thǎan', zhTW: '禱告', category: 'faith' },
        { thai: 'ความช่วยเหลือ', phonetic: 'kwaam-chûay-lǔea', zhTW: '幫助', category: 'both' },
    ],
    // ── 生活動詞 ──
    '喜歡': [
        { thai: 'คุณ', phonetic: 'khun', zhTW: '你', category: 'both' },
        { thai: 'พระเจ้า', phonetic: 'phrá-jâo', zhTW: '上帝', category: 'faith' },
        { thai: 'กาด', phonetic: 'gàat', zhTW: '市場', category: 'street' },
        { thai: 'กินข้าวเหนียว', phonetic: 'gin khâaw-nǐaw', zhTW: '吃糯米飯', category: 'street' },
        { thai: 'เชียงใหม่', phonetic: 'chiiang-mài', zhTW: '清邁', category: 'street' },
    ],
    '做': [
        { thai: 'กับข้าว', phonetic: 'gàp-khâaw', zhTW: '做飯', category: 'street' },
        { thai: 'งาน', phonetic: 'ngaan', zhTW: '工作', category: 'street' },
        { thai: 'ดี', phonetic: 'dii', zhTW: '好事', category: 'both' },
    ],
    '買': [
        { thai: 'อันนี้', phonetic: 'an-níi', zhTW: '這個', category: 'street' },
        { thai: 'อันนั้น', phonetic: 'an-nán', zhTW: '那個', category: 'street' },
        { thai: 'ของ', phonetic: 'khǒong', zhTW: '東西', category: 'street' },
        { thai: 'ข้าวเหนียว', phonetic: 'khâaw-nǐaw', zhTW: '糯米', category: 'street' },
    ],
    '吃': [
        { thai: 'ข้าวเหนียว', phonetic: 'khâaw-nǐaw', zhTW: '糯米', category: 'street' },
        { thai: 'ก๋วยเตี๋ยว', phonetic: 'gǔay-dtǐaw', zhTW: '粿條', category: 'street' },
        { thai: 'พริก', phonetic: 'phrík', zhTW: '辣椒', category: 'street' },
        { thai: 'ข้าว', phonetic: 'khâaw', zhTW: '飯', category: 'street' },
    ],
    '學習': [
        { thai: 'ภาษาไทย', phonetic: 'paa-sǎa thai', zhTW: '泰語', category: 'street' },
        { thai: 'ภาษาเหนือ', phonetic: 'paa-sǎa nǔea', zhTW: '北泰話', category: 'street' },
        { thai: 'พระคัมภีร์', phonetic: 'phrá-kham-phii', zhTW: '聖經', category: 'faith' },
    ],
    '睡覺': [
        { thai: 'ที่นี่', phonetic: 'tîi-nîi', zhTW: '這裡', category: 'street' },
    ],
    // ── 服事/宣教 ──
    '幫助': [
        { thai: 'คุณ', phonetic: 'khun', zhTW: '你', category: 'both' },
        { thai: 'เด็กๆ', phonetic: 'dèk-dèk', zhTW: '孩子們', category: 'both' },
        { thai: 'ชุมชน', phonetic: 'chum-chon', zhTW: '社區', category: 'both' },
        { thai: 'ครอบครัว', phonetic: 'krôop-krua', zhTW: '家人', category: 'both' },
        { thai: 'คนป่วย', phonetic: 'khon-bpùay', zhTW: '病人', category: 'both' },
    ],
    '認識': [
        { thai: 'พระเยซู', phonetic: 'phrá-yee-suu', zhTW: '耶穌', category: 'faith' },
        { thai: 'พระเจ้า', phonetic: 'phrá-jâo', zhTW: '上帝', category: 'faith' },
        { thai: 'คุณ', phonetic: 'khun', zhTW: '你', category: 'both' },
        { thai: 'กัน', phonetic: 'gan', zhTW: '彼此', category: 'both' },
    ],
    '分享': [
        { thai: 'ข่าวดี', phonetic: 'khàao-dii', zhTW: '好消息/福音', category: 'faith' },
        { thai: 'พระคุณ', phonetic: 'phrá-khun', zhTW: '恩典', category: 'faith' },
        { thai: 'ชีวิต', phonetic: 'chii-wít', zhTW: '生命', category: 'faith' },
        { thai: 'ความรัก', phonetic: 'kwaam-rák', zhTW: '愛', category: 'faith' },
    ],
    // ── 信仰動詞 ──
    '愛': [
        { thai: 'พระเจ้า', phonetic: 'phrá-jâo', zhTW: '上帝', category: 'faith' },
        { thai: 'ครอบครัว', phonetic: 'krôop-krua', zhTW: '家人', category: 'both' },
        { thai: 'คุณ', phonetic: 'khun', zhTW: '你', category: 'both' },
        { thai: 'ทุกคน', phonetic: 'thúk-khon', zhTW: '所有人', category: 'faith' },
    ],
    '相信': [
        { thai: 'พระเจ้า', phonetic: 'phrá-jâo', zhTW: '上帝', category: 'faith' },
        { thai: 'พระเยซู', phonetic: 'phrá-yee-suu', zhTW: '耶穌', category: 'faith' },
        { thai: 'พระสัญญา', phonetic: 'phrá-sǎn-yaa', zhTW: '應許', category: 'faith' },
    ],
    '渴慕': [
        { thai: 'พระเจ้า', phonetic: 'phrá-jâo', zhTW: '上帝', category: 'faith' },
        { thai: 'พระวิญญาณ', phonetic: 'phrá-win-yaan', zhTW: '聖靈', category: 'faith' },
        { thai: 'ความจริง', phonetic: 'kwaam-jing', zhTW: '真理', category: 'faith' },
    ],
    '禱告': [
        { thai: 'ต่อพระเจ้า', phonetic: 'dtòo phrá-jâo', zhTW: '向上帝', category: 'faith' },
        { thai: 'ในโบสถ์', phonetic: 'nai bòot', zhTW: '在教會', category: 'faith' },
        { thai: 'ด้วยกัน', phonetic: 'dûay-gan', zhTW: '一起', category: 'faith' },
    ],
    '為…禱告': [
        { thai: 'คุณ', phonetic: 'khun', zhTW: '你', category: 'faith' },
        { thai: 'ครอบครัว', phonetic: 'krôop-krua', zhTW: '家人', category: 'faith' },
        { thai: 'พี่น้อง', phonetic: 'phîi-nóong', zhTW: '弟兄姊妹', category: 'faith' },
        { thai: 'เรา', phonetic: 'rao', zhTW: '我們', category: 'faith' },
        { thai: 'คนป่วย', phonetic: 'khon-bpùay', zhTW: '病人', category: 'faith' },
        { thai: 'หมู่บ้าน', phonetic: 'mùu-bâan', zhTW: '這個村', category: 'faith' },
    ],
    '祝福': [
        { thai: 'คุณ', phonetic: 'khun', zhTW: '你', category: 'both' },
        { thai: 'ครอบครัว', phonetic: 'krôop-krua', zhTW: '家人', category: 'both' },
        { thai: 'เรา', phonetic: 'rao', zhTW: '我們', category: 'both' },
        { thai: 'หมู่บ้าน', phonetic: 'mùu-bâan', zhTW: '這個村', category: 'faith' },
    ],
    '敬拜': [
        { thai: 'พระเจ้า', phonetic: 'phrá-jâo', zhTW: '上帝', category: 'faith' },
        { thai: 'พระเยซู', phonetic: 'phrá-yee-suu', zhTW: '耶穌', category: 'faith' },
        { thai: 'พระบิดา', phonetic: 'phrá-bi-daa', zhTW: '天父', category: 'faith' },
        { thai: 'จอมราชา', phonetic: 'jom-raa-chaa', zhTW: '萬王之王', category: 'faith' },
    ],
    '讚美': [
        { thai: 'พระเจ้า', phonetic: 'phrá-jâo', zhTW: '上帝', category: 'faith' },
        { thai: 'พระเยซู', phonetic: 'phrá-yee-suu', zhTW: '耶穌', category: 'faith' },
        { thai: 'จอมราชา', phonetic: 'jom-raa-chaa', zhTW: '萬王之王', category: 'faith' },
        { thai: 'พระนาม', phonetic: 'phrá-naam', zhTW: '聖名', category: 'faith' },
    ],
    '高舉': [
        { thai: 'พระนามพระเจ้า', phonetic: 'phrá-naam phrá-jâo', zhTW: '上帝的名', category: 'faith' },
        { thai: 'พระเยซู', phonetic: 'phrá-yee-suu', zhTW: '耶穌', category: 'faith' },
        { thai: 'พระสิริ', phonetic: 'phrá-sì-rí', zhTW: '榮耀', category: 'faith' },
    ],
    '降服/願意': [
        { thai: 'ต่อพระองค์', phonetic: 'dtòo phrá-ong', zhTW: '向主', category: 'faith' },
        { thai: 'หมดหัวใจ', phonetic: 'mòt hǔa-jai', zhTW: '全心', category: 'faith' },
    ],
    '信靠': [
        { thai: 'พระเจ้า', phonetic: 'phrá-jâo', zhTW: '上帝', category: 'faith' },
        { thai: 'พระสัญญา', phonetic: 'phrá-sǎn-yaa', zhTW: '應許', category: 'faith' },
    ],
    '跟隨': [
        { thai: 'พระเยซู', phonetic: 'phrá-yee-suu', zhTW: '耶穌', category: 'faith' },
        { thai: 'ความจริง', phonetic: 'kwaam-jing', zhTW: '真理', category: 'faith' },
        { thai: 'ความสว่าง', phonetic: 'kwaam-sa-wàang', zhTW: '光', category: 'faith' },
    ],
    '獻上': [
        { thai: 'ชีวิต', phonetic: 'chii-wít', zhTW: '生命', category: 'faith' },
        { thai: 'หัวใจ', phonetic: 'hǔa-jai', zhTW: '心', category: 'faith' },
        { thai: 'คำสรรเสริญ', phonetic: 'kham sǎn-sə̌ən', zhTW: '讚美', category: 'faith' },
    ],
    '感謝': [
        { thai: 'พระเจ้า', phonetic: 'phrá-jâo', zhTW: '上帝', category: 'faith' },
        { thai: 'พระคุณ', phonetic: 'phrá-khun', zhTW: '恩典', category: 'faith' },
        { thai: 'ความรัก', phonetic: 'kwaam-rák', zhTW: '愛', category: 'faith' },
    ],
};

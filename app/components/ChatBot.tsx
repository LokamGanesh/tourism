'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, X, Globe, Volume2, VolumeX, Bot, User, Mic, MicOff } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  language: string
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isTyping, setIsTyping] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' }
  ]

  // Comprehensive Jharkhand knowledge base
  const jharkhnadKnowledge = {
    districts: {
      ranchi: { capital: true, population: '1,073,440', area: '5,097 km²', attractions: ['Hundru Falls', 'Jagannath Temple', 'Ranchi Lake'] },
      dhanbad: { coalMining: true, population: '1,195,298', attractions: ['Maithon Dam', 'Topchanchi Lake'] },
      jamshedpur: { steelCity: true, population: '1,337,131', attractions: ['Jubilee Park', 'Tata Steel Zoological Park'] },
      bokaro: { steelPlant: true, population: '2,062,330', attractions: ['Bokaro Steel Plant', 'Garga Dam'] },
      deoghar: { religious: true, population: '1,492,073', attractions: ['Baidyanath Temple', 'Nandan Pahar'] },
      hazaribagh: { wildlife: true, population: '1,734,495', attractions: ['Hazaribagh Wildlife Sanctuary', 'Canary Hill'] },
      giridih: { mining: true, population: '2,445,474', attractions: ['Parasnath Hill', 'Usri Falls'] },
      palamu: { tiger: true, population: '1,939,869', attractions: ['Betla National Park', 'Palamau Tiger Reserve'] },
      gumla: { tribal: true, population: '1,025,213', attractions: ['Nagfeni', 'Hapamuni'] },
      lohardaga: { tribal: true, population: '461,790', attractions: ['Palkot Wildlife Sanctuary'] },
      simdega: { tribal: true, population: '599,578', attractions: ['Koel River'] },
      westSinghbhum: { mining: true, population: '1,502,338', attractions: ['Chaibasa'] },
      eastSinghbhum: { industrial: true, population: '2,293,919', attractions: ['Jamshedpur', 'Dalma Wildlife Sanctuary'] },
      saraikela: { tribal: true, population: '1,065,056', attractions: ['Saraikela Palace'] },
      khunti: { tribal: true, population: '531,885', attractions: ['Birsa Munda Museum'] },
      ramgarh: { cantonment: true, population: '949,443', attractions: ['Patratu Valley'] },
      latehar: { forest: true, population: '726,978', attractions: ['Netarhat', 'Betla National Park'] },
      chatra: { agricultural: true, population: '1,042,886', attractions: ['Kunda Cave'] },
      koderma: { mica: true, population: '716,259', attractions: ['Tilaiya Dam'] },
      jamtara: { rural: true, population: '791,042', attractions: ['Simultala Hill Station'] },
      dumka: { tribal: true, population: '1,321,442', attractions: ['Massanjore Dam'] },
      pakur: { border: true, population: '900,422', attractions: ['Pakur'] },
      godda: { agricultural: true, population: '1,313,551', attractions: ['Godda'] },
      sahibganj: { river: true, population: '1,150,567', attractions: ['Rajmahal Hills'] }
    },
    culture: {
      tribes: ['Santhal', 'Munda', 'Oraon', 'Ho', 'Kharia', 'Bhumij', 'Kharwar', 'Lohra', 'Mahli', 'Mal Paharia'],
      languages: ['Hindi', 'Santali', 'Mundari', 'Ho', 'Kurukh', 'Kharia', 'Nagpuri', 'Khortha', 'Kurmali', 'Panchpargania'],
      festivals: ['Sarhul', 'Karma', 'Sohrai', 'Bandna', 'Tusu', 'Jitiya', 'Chhath Puja', 'Durga Puja', 'Kali Puja'],
      dances: ['Santhal Dance', 'Mundari Dance', 'Oraon Dance', 'Chhau Dance', 'Paika Dance', 'Jhumar Dance'],
      music: ['Santhal Folk Songs', 'Mundari Songs', 'Nagpuri Songs', 'Khortha Songs'],
      crafts: ['Dokra Art', 'Bamboo Crafts', 'Wood Carving', 'Stone Carving', 'Tribal Paintings', 'Handloom Textiles']
    },
    economy: {
      minerals: ['Coal', 'Iron Ore', 'Copper', 'Mica', 'Bauxite', 'Limestone', 'Dolomite', 'Quartzite'],
      industries: ['Steel', 'Coal Mining', 'Heavy Engineering', 'Fertilizers', 'Cement', 'Paper'],
      agriculture: ['Rice', 'Wheat', 'Maize', 'Pulses', 'Oilseeds', 'Sugarcane', 'Potato', 'Vegetables'],
      employment: 'Agriculture (45%), Industry (25%), Services (30%)'
    },
    geography: {
      area: '79,716 km²',
      population: '33,057,315',
      density: '414/km²',
      literacy: '67.63%',
      rivers: ['Damodar', 'Koel', 'Subarnarekha', 'Brahmani', 'Ajay', 'Barakar', 'Mayurakshi'],
      climate: 'Tropical monsoon climate with hot summers, mild winters, and heavy monsoon rains',
      forests: '29.61% forest cover',
      wildlife: ['Tigers', 'Elephants', 'Leopards', 'Sloth Bears', 'Wild Boars', 'Sambars', 'Chitals']
    },
    history: {
      formation: 'November 15, 2000 (carved out of Bihar)',
      ancientHistory: 'Part of Magadha Empire, Mauryan Empire, Gupta Empire',
      medievalHistory: 'Under Delhi Sultanate, Mughal Empire',
      colonialHistory: 'British rule, tribal revolts led by Birsa Munda',
      freedom: 'Active participation in Indian independence movement',
      modernHistory: 'Industrial development post-independence, state formation in 2000'
    }
  }

  // Enhanced responses with comprehensive knowledge
  const responses = {
    en: {
      welcome: "Hello! I'm your comprehensive Jharkhand assistant. I can help you with tourism, culture, history, geography, economy, districts, tribes, festivals, and much more about Jharkhand. What would you like to know?",
      places: "Jharkhand has 24 districts with unique attractions. Popular destinations include Betla National Park (wildlife), Hundru Falls (98m waterfall), Netarhat (Queen of Chotanagpur), Deoghar Temple (Jyotirlinga), Parasnath Hill (highest peak), and Jamshedpur (planned city). Which area interests you?",
      hotels: "Accommodation options vary by district. Ranchi and Jamshedpur have luxury hotels (₹3000-8000/night), mid-range hotels (₹1500-3000/night), and budget options (₹500-1500/night). Deoghar has dharamshalas and guest houses. Which city are you visiting?",
      restaurants: "Jharkhand cuisine includes tribal specialties like Handia (rice beer), Dhuska (fried rice pancake), Rugra (mushroom curry), Bamboo shoot curry, and Pitha (rice cakes). Each district has unique dishes. Which cuisine type interests you?",
      budget: "Budget varies by district and season. Ranchi/Jamshedpur: ₹2500-4000/day, Deoghar: ₹1500-2500/day, Rural areas: ₹1000-2000/day. Includes accommodation, meals, transport, and entry fees. Need specific district breakdown?",
      culture: "Jharkhand has 32 tribal communities including Santhal, Munda, Oraon, Ho. Major festivals: Sarhul (spring), Karma (monsoon), Sohrai (harvest). Traditional arts: Dokra metalwork, Paitkar paintings, bamboo crafts. Which aspect interests you?",
      history: "Jharkhand formed on Nov 15, 2000. Rich history from Magadha Empire to British rule. Famous for tribal hero Birsa Munda's revolt (1899-1900). Archaeological sites include Isko and Hazaribagh rock paintings. Want specific historical period details?",
      geography: "Area: 79,716 km², 24 districts, population 3.3 crore. Chota Nagpur Plateau region with 29.61% forest cover. Major rivers: Damodar, Subarnarekha, Koel. Tropical monsoon climate. Rich in minerals - coal, iron ore, copper. Need specific geographic details?",
      districts: "24 districts: Ranchi (capital), Jamshedpur (steel city), Dhanbad (coal), Deoghar (religious), Hazaribagh (wildlife), Bokaro (steel), Giridih (mica), and 17 others. Each has unique features and attractions. Which district information do you need?",
      festivals: "Major festivals: Sarhul (Sal tree worship), Karma (prosperity), Sohrai (cattle worship), Bandna (harvest), Tusu (winter), plus Durga Puja, Chhath Puja, Kali Puja. Each has unique rituals and significance. Want details about specific festivals?",
      tribes: "32 tribal communities: Santhal (largest), Munda, Oraon, Ho, Kharia, Bhumij, Kharwar. Each has distinct language, culture, traditions. Santhal Pargana region has highest tribal population. Want information about specific tribes?",
      economy: "Economy based on mining (coal, iron ore), steel production, agriculture. Major companies: Tata Steel, SAIL, CIL. Agriculture employs 45% population. Per capita income ₹43,000. Industrial growth focused on steel, mining, power generation.",
      transport: "Well connected by rail, road, air. Ranchi airport connects major cities. NH-33, NH-23 are major highways. Railway network covers all districts. Local transport includes buses, auto-rickshaws, taxis. Which transport information do you need?",
      default: "I have comprehensive knowledge about Jharkhand including tourism, culture, history, geography, districts, tribes, festivals, economy, and more. Please ask me anything specific about Jharkhand!"
    },
    hi: {
      welcome: "नमस्ते! मैं आपका व्यापक झारखंड सहायक हूं। मैं पर्यटन, संस्कृति, इतिहास, भूगोल, अर्थव्यवस्था, जिले, जनजातियां, त्योहार और झारखंड के बारे में बहुत कुछ बता सकता हूं। आप क्या जानना चाहते हैं?",
      places: "झारखंड में 24 जिले हैं जिनमें अनूठे आकर्षण हैं। लोकप्रिय स्थल: बेतला राष्ट्रीय उद्यान (वन्यजीव), हुंडरू जलप्रपात (98 मीटर), नेतरहाट (छोटानागपुर की रानी), देवघर मंदिर (ज्योतिर्लिंग), पारसनाथ पहाड़ी (सबसे ऊंची चोटी)। कौन सा क्षेत्र दिलचस्प है?",
      culture: "झारखंड में 32 आदिवासी समुदाय हैं जिनमें संथाल, मुंडा, उरांव, हो शामिल हैं। मुख्य त्योहार: सरहुल (वसंत), कर्मा (मानसून), सोहराई (फसल)। पारंपरिक कलाएं: डोकरा धातु कार्य, पैतकर चित्रकारी। कौन सा पहलू दिलचस्प है?",
      default: "मेरे पास झारखंड के बारे में व्यापक जानकारी है जिसमें पर्यटन, संस्कृति, इतिहास, भूगोल, जिले, जनजातियां, त्योहार, अर्थव्यवस्था शामिल है। झारखंड के बारे में कुछ भी पूछें!"
    },
    bn: {
      welcome: "হ্যালো! আমি আপনার ঝাড়খণ্ড সহকারী। পর্যটন, সংস্কৃতি, ইতিহাস, ভূগোল, অর্থনীতি, জেলা, উপজাতি ও আরও অনেক বিষয়ে সাহায্য করতে পারি। আপনি কী জানতে চান?",
      default: "আমার কাছে ঝাড়খণ্ড সম্পর্কে বিস্তৃত তথ্য আছে — পর্যটন, সংস্কৃতি, ইতিহাস, ভূগোল, জেলা, উপজাতি, উৎসব, অর্থনীতি ইত্যাদি। ঝাড়খণ্ড সম্পর্কে যেকোনো প্রশ্ন করুন!"
    },
    or: {
      welcome: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ଝାରଖଣ୍ଡ ସହାୟକ। ପର୍ଯ୍ୟଟନ, ସଂସ୍କୃତି, ଇତିହାସ, ଭୂଗୋଳ, ଅର୍ଥନୀତି, ଜିଲ୍ଲା, ଜନଜାତି ଇତ୍ୟାଦି ବିଷୟରେ ସାହାଯ୍ୟ କରିପାରିବି। କଣ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି?",
      default: "ମୋ ପାଖରେ ଝାରଖଣ୍ଡ ସମ୍ବନ୍ଧୀୟ ବିସ୍ତୃତ ତଥ୍ୟ ଅଛି — ପର୍ଯ୍ୟଟନ, ସଂସ୍କୃତି, ଇତିହାସ, ଭୂଗୋଳ, ଜିଲ୍ଲା, ଜନଜାତି, ପର୍ବପର୍ବାଣି, ଅର୍ଥନୀତି ଇତ୍ୟାଦି। ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ!"
    },
    ur: {
      welcome: "السلام علیکم! میں آپ کا جھارکھنڈ اسسٹنٹ ہوں۔ سیاحت، ثقافت، تاریخ، جغرافیہ، معیشت، اضلاع اور قبائل کے بارے میں مدد کر سکتا ہوں۔ آپ کیا جاننا چاہتے ہیں؟",
      default: "میرے پاس جھارکھنڈ کے بارے میں جامع معلومات ہیں — سیاحت، ثقافت، تاریخ، جغرافیہ، اضلاع، قبائل، تہوار، معیشت وغیرہ۔ جھارکھنڈ کے بارے میں جو چاہیں پوچھیں!"
    }
  }

  // District alias map for robust matching across common spellings
  const districtAliases: Record<string, string[]> = {
    ranchi: ['ranchi', 'रांची', 'رانچی'],
    dhanbad: ['dhanbad', 'धनबाद', 'دھنباد'],
    jamshedpur: ['jamshedpur', 'जमशेदपुर', 'जमशेदपूर', 'جمشیدپور', 'east singhbhum'],
    bokaro: ['bokaro', 'बोकारो', 'بوکارو'],
    deoghar: ['deoghar', 'देवघर', 'دیوگھر'],
    hazaribagh: ['hazaribagh', 'हजारीबाग', 'ہزاریباغ'],
    giridih: ['giridih', 'गिरिडीह', 'گِریڈیہ'],
    palamu: ['palamu', 'palamau', 'पालामू', 'پلامو'],
    gumla: ['gumla', 'गुमला'],
    lohardaga: ['lohardaga', 'लोहदग्गा', 'लोहरदगा'],
    simdega: ['simdega', 'सिमडेगा'],
    westSinghbhum: ['west singhbhum', 'chaibasa', 'पश्चिम सिंहभूम', 'چائباسا'],
    eastSinghbhum: ['east singhbhum', 'जमशेदपुर', 'east'],
    saraikela: ['saraikela', 'seraikela', 'seraikela kharsawan', 'सरायकेला'],
    khunti: ['khunti', 'खूँटी', 'खूंटी'],
    ramgarh: ['ramgarh', 'रामगढ़'],
    latehar: ['latehar', 'लातेहार'],
    chatra: ['chatra', 'चतरा'],
    koderma: ['koderma', 'कोडरमा', 'kodarma'],
    jamtara: ['jamtara', 'जामताड़ा'],
    dumka: ['dumka', 'दुमका'],
    pakur: ['pakur', 'पाकुड़'],
    godda: ['godda', 'गोड्डा'],
    sahibganj: ['sahibganj', 'sahebganj', 'साहिबगंज']
  }

  const getDistrictFromMessage = (message: string): string | null => {
    const text = message.toLowerCase()
    for (const [key, aliases] of Object.entries(districtAliases)) {
      if (aliases.some(a => text.includes(a))) return key
    }
    return null
  }

  const formatDistrictResponse = (districtKey: string): string => {
    const d: any = (jharkhnadKnowledge as any).districts[districtKey]
    if (!d) return responses[currentLanguage]?.default || responses.en.default
    const name = districtKey
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, c => c.toUpperCase())
    if (currentLanguage === 'hi') {
      return `${name} जिले की जानकारी:\n• जनसंख्या: ${d.population || '—'}\n• क्षेत्रफल: ${d.area || '—'}\n• विशेषताएं: ${Object.keys(d).filter(k => typeof d[k] === 'boolean' && d[k]).join(', ') || '—'}\n• प्रमुख आकर्षण: ${(d.attractions || []).join(', ') || '—'}\nऔर क्या जानना चाहेंगे?`
    }
    // Default English response
    return `${name} district details:\n• Population: ${d.population || '—'}\n• Area: ${d.area || '—'}\n• Highlights: ${Object.keys(d).filter(k => typeof d[k] === 'boolean' && d[k]).join(', ') || '—'}\n• Top attractions: ${(d.attractions || []).join(', ') || '—'}\nWhat else would you like to know?`
  }

  const searchKnowledge = (message: string): string | null => {
    const m = message.toLowerCase()
    const k = jharkhnadKnowledge
    const join = (arr: any[]) => (arr && arr.length ? arr.join(', ') : '—')

    if (/(tribe|tribal|जनजात|उपजात|قبائل)/.test(m)) {
      return currentLanguage === 'hi'
        ? `मुख्य जनजातियां: ${join(k.culture.tribes)}`
        : `Major tribes: ${join(k.culture.tribes)}`
    }
    if (/(festival|त्योहार|پھوار|تہوار|sarhul|karma|sohrai)/.test(m)) {
      return currentLanguage === 'hi'
        ? `प्रमुख त्योहार: ${join(k.culture.festivals)}`
        : `Major festivals: ${join(k.culture.festivals)}`
    }
    if (/(language|भाषा|زبان)/.test(m)) {
      return currentLanguage === 'hi'
        ? `प्रमुख भाषाएं: ${join(k.culture.languages)}`
        : `Languages spoken: ${join(k.culture.languages)}`
    }
    if (/(river|नदी|دریا)/.test(m)) {
      return currentLanguage === 'hi'
        ? `मुख्य नदियाँ: ${join(k.geography.rivers)}`
        : `Major rivers: ${join(k.geography.rivers)}`
    }
    if (/(wildlife|जानवर|वन्यजीव|حیات)/.test(m)) {
      return currentLanguage === 'hi'
        ? `वन्यजीव: ${join(k.geography.wildlife)}`
        : `Wildlife: ${join(k.geography.wildlife)}`
    }
    if (/(mineral|खनिज|minerals|coal|iron|mica)/.test(m)) {
      return currentLanguage === 'hi'
        ? `खनिज संसाधन: ${join(k.economy.minerals)}`
        : `Mineral resources: ${join(k.economy.minerals)}`
    }
    if (/(industry|उद्योग|کاروبار|steel|mining)/.test(m)) {
      return currentLanguage === 'hi'
        ? `मुख्य उद्योग: ${join(k.economy.industries)}`
        : `Key industries: ${join(k.economy.industries)}`
    }
    if (/(agri|agriculture|कृषि)/.test(m)) {
      return currentLanguage === 'hi'
        ? `कृषि फसलें: ${join(k.economy.agriculture)}`
        : `Agricultural crops: ${join(k.economy.agriculture)}`
    }
    if (/(area|population|literacy|forest|climate|भूगोल|जलवायु|क्षेत्रफल|जनसंख्या)/.test(m)) {
      return currentLanguage === 'hi'
        ? `भूगोल: क्षेत्रफल ${k.geography.area}, जनसंख्या ${k.geography.population}, घनत्व ${k.geography.density}, साक्षरता ${k.geography.literacy}, वन आवरण ${k.geography.forests}`
        : `Geography: Area ${k.geography.area}, Population ${k.geography.population}, Density ${k.geography.density}, Literacy ${k.geography.literacy}, Forest cover ${k.geography.forests}`
    }
    return null
  }

  const quickSuggestions = {
    en: [
      "Tell me about Jharkhand's history",
      "What are the major tribes in Jharkhand?",
      "Best tourist places in Jharkhand",
      "Jharkhand's culture and festivals",
      "Districts of Jharkhand",
      "Economy and industries of Jharkhand",
      "Geography and climate of Jharkhand",
      "Traditional crafts and arts",
      "Languages spoken in Jharkhand",
      "Transportation in Jharkhand"
    ],
    hi: [
      "झारखंड का इतिहास बताएं",
      "झारखंड की प्रमुख जनजातियां कौन सी हैं?",
      "झारखंड के सर्वोत्तम पर्यटन स्थल",
      "झारखंड की संस्कृति और त्योहार",
      "झारखंड के जिले",
      "झारखंड की अर्थव्यवस्था और उद्योग",
      "झारखंड का भूगोल और जलवायु",
      "पारंपरिक शिल्प और कलाएं",
      "झारखंड में बोली जाने वाली भाषाएं",
      "झारखंड में परिवहन"
    ],
    bn: [
      "ঝাড়খণ্ডের ইতিহাস বলুন",
      "ঝাড়খণ্ডের প্রধান উপজাতি",
      "ঝাড়খণ্ডের সেরা পর্যটন স্থান",
      "ঝাড়খণ্ডের সংস্কৃতি ও উৎসব",
      "ঝাড়খণ্ডের জেলাগুলি"
    ],
    or: [
      "ଝାରଖଣ୍ଡର ଇତିହାସ",
      "ଝାରଖଣ୍ଡର ପ୍ରମୁଖ ଜନଜାତି",
      "ସର୍ବଶ୍ରେଷ୍ଠ ପର୍ଯ୍ୟଟନ ସ୍ଥଳ",
      "ସଂସ୍କୃତି ଓ ପର୍ବପର୍ବାଣି",
      "ଜିଲ୍ଲା ସୂଚନା"
    ],
    ur: [
      "جھارکھنڈ کی تاریخ بتائیں",
      "جھارکھنڈ کی اہم قبائل",
      "بہترین سیاحتی مقامات",
      "ثقافت اور تہوار",
      "اضلاع کی معلومات"
    ]
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: responses[currentLanguage]?.welcome || responses.en.welcome,
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, currentLanguage])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    const currentResponses = responses[currentLanguage] || responses.en

    // Tourism and Places
    if (message.includes('place') || message.includes('visit') || message.includes('destination') || message.includes('tourist')) {
      return currentResponses.places
    }
    // Accommodation
    else if (message.includes('hotel') || message.includes('accommodation') || message.includes('stay') || message.includes('lodge')) {
      return currentResponses.hotels
    }
    // Food and Restaurants
    else if (message.includes('restaurant') || message.includes('food') || message.includes('eat') || message.includes('cuisine') || message.includes('dish')) {
      return currentResponses.restaurants
    }
    // Budget and Cost
    else if (message.includes('budget') || message.includes('cost') || message.includes('price') || message.includes('money') || message.includes('expense')) {
      return currentResponses.budget
    }
    // Culture and Tribes
    else if (message.includes('culture') || message.includes('tribe') || message.includes('tribal') || message.includes('tradition') || message.includes('folk') || message.includes('art') || message.includes('craft')) {
      return currentResponses.culture || currentResponses.default
    }
    // History
    else if (message.includes('history') || message.includes('historical') || message.includes('ancient') || message.includes('birsa') || message.includes('munda') || message.includes('revolt')) {
      return currentResponses.history || currentResponses.default
    }
    // Geography and Climate
    else if (message.includes('geography') || message.includes('climate') || message.includes('weather') || message.includes('river') || message.includes('mountain') || message.includes('forest')) {
      return currentResponses.geography || currentResponses.default
    }
    // Districts
    else if (message.includes('district') || message.includes('ranchi') || message.includes('jamshedpur') || message.includes('dhanbad') || message.includes('deoghar') || message.includes('bokaro')) {
      return currentResponses.districts || currentResponses.default
    }
    // Festivals
    else if (message.includes('festival') || message.includes('sarhul') || message.includes('karma') || message.includes('sohrai') || message.includes('celebration')) {
      return currentResponses.festivals || currentResponses.default
    }
    // Economy and Industry
    else if (message.includes('economy') || message.includes('industry') || message.includes('mining') || message.includes('coal') || message.includes('steel') || message.includes('agriculture')) {
      return currentResponses.economy || currentResponses.default
    }
    // Transport
    else if (message.includes('transport') || message.includes('travel') || message.includes('bus') || message.includes('train') || message.includes('flight') || message.includes('airport')) {
      return currentResponses.transport || currentResponses.default
    }
    // Specific district queries
    else if (message.includes('capital')) {
      return currentLanguage === 'hi' ? 'झारखंड की राजधानी रांची है। यह राज्य का सबसे बड़ा शहर भी है।' : 'The capital of Jharkhand is Ranchi. It is also the largest city in the state.'
    }
    else if (message.includes('population')) {
      return currentLanguage === 'hi' ? 'झारखंड की जनसंख्या लगभग 3.3 करोड़ है। जनसंख्या घनत्व 414 व्यक्ति प्रति वर्ग किमी है।' : 'Jharkhand has a population of approximately 3.3 crore. Population density is 414 people per sq km.'
    }
    else if (message.includes('language')) {
      return currentLanguage === 'hi' ? 'झारखंड में हिंदी मुख्य भाषा है। आदिवासी भाषाओं में संथाली, मुंडारी, हो, कुरुख, खड़िया शामिल हैं। नागपुरी, खोरठा भी बोली जाती हैं।' : 'Hindi is the main language in Jharkhand. Tribal languages include Santali, Mundari, Ho, Kurukh, Kharia. Nagpuri and Khortha are also spoken.'
    }
    else if (message.includes('formation') || message.includes('created') || message.includes('established')) {
      return currentLanguage === 'hi' ? 'झारखंड राज्य 15 नवंबर 2000 को बिहार से अलग होकर बना था। यह भारत का 28वां राज्य है।' : 'Jharkhand state was formed on November 15, 2000, carved out of Bihar. It is the 28th state of India.'
    }
    // District specific details
    const districtKey = getDistrictFromMessage(message)
    if (districtKey) {
      return formatDistrictResponse(districtKey)
    }

    // Knowledge lookup across categories
    const lookedUp = searchKnowledge(message)
    if (lookedUp) return lookedUp

    // Comprehensive summary fallback
    if (currentLanguage === 'hi') {
      return `झारखंड के बारे में संक्षेप:\n• भूगोल: क्षेत्रफल ${jharkhnadKnowledge.geography.area}, नदियाँ: ${jharkhnadKnowledge.geography.rivers.slice(0,5).join(', ')}\n• जनसंख्या: ${jharkhnadKnowledge.geography.population}, साक्षरता: ${jharkhnadKnowledge.geography.literacy}\n• अर्थव्यवस्था: खनिज ${jharkhnadKnowledge.economy.minerals.slice(0,6).join(', ')}, उद्योग ${jharkhnadKnowledge.economy.industries.slice(0,5).join(', ')}\n• संस्कृति: जनजातियां ${jharkhnadKnowledge.culture.tribes.slice(0,6).join(', ')}, त्योहार ${jharkhnadKnowledge.culture.festivals.slice(0,6).join(', ')}\n• इतिहास: गठन ${jharkhnadKnowledge.history.formation}.\nकृपया बताएं कि किस विषय पर विस्तृत जानकारी चाहिए?`
    }
    return `About Jharkhand:\n• Geography: Area ${jharkhnadKnowledge.geography.area}; Rivers: ${jharkhnadKnowledge.geography.rivers.slice(0,5).join(', ')}\n• Population: ${jharkhnadKnowledge.geography.population}; Literacy: ${jharkhnadKnowledge.geography.literacy}\n• Economy: Minerals ${jharkhnadKnowledge.economy.minerals.slice(0,6).join(', ')}; Industries ${jharkhnadKnowledge.economy.industries.slice(0,5).join(', ')}\n• Culture: Tribes ${jharkhnadKnowledge.culture.tribes.slice(0,6).join(', ')}; Festivals ${jharkhnadKnowledge.culture.festivals.slice(0,6).join(', ')}\n• History: Formed ${jharkhnadKnowledge.history.formation}.\nTell me which topic you want in detail.`
  }

  // Map UI language to speech synthesis/recognition locale
  const languageToLocale = (code: string) => {
    switch (code) {
      case 'hi':
        return 'hi-IN'
      case 'bn':
        return 'bn-IN'
      case 'or':
        return 'or-IN'
      case 'ur':
        return 'ur-IN'
      default:
        return 'en-US'
    }
  }

  // Initialize SpeechRecognition when needed
  const ensureRecognition = () => {
    if (typeof window === 'undefined') return null
    const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return null
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.maxAlternatives = 1
    }
    recognitionRef.current.lang = languageToLocale(currentLanguage)
    return recognitionRef.current
  }

  const startListening = () => {
    const recognition = ensureRecognition()
    if (!recognition) return
    setIsListening(true)
    let finalTranscript = ''
    recognition.onresult = (event: any) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) finalTranscript += transcript
        else interim += transcript
      }
      setInputText(finalTranscript || interim)
    }
    recognition.onerror = () => {
      setIsListening(false)
    }
    recognition.onend = () => {
      setIsListening(false)
    }
    recognition.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
    }
    setIsListening(false)
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)

      // Text-to-speech if enabled
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(botResponse.text)
        utterance.lang = languageToLocale(currentLanguage)
        speechSynthesis.speak(utterance)
      }
    }, 1500)
  }

  const handleQuickSuggestion = (suggestion: string) => {
    setInputText(suggestion)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all transform hover:scale-110 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Tourism Assistant</h3>
              <p className="text-xs text-primary-100">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="bg-white/20 text-white text-xs rounded px-2 py-1 border-none focus:ring-2 focus:ring-white/50"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-gray-900">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            {/* Voice Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="p-1 rounded hover:bg-white/20 transition-colors"
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-primary-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-900 rounded-bl-sm'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'bot' && (
                  <Bot className="h-4 w-4 mt-1 text-primary-600" />
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-primary-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
          <div className="space-y-1">
            {(quickSuggestions[currentLanguage] || quickSuggestions.en).slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              currentLanguage === 'hi' ? 'अपना संदेश टाइप करें...' :
              currentLanguage === 'bn' ? 'আপনার বার্তা লিখুন...' :
              currentLanguage === 'or' ? 'ଆପଣଙ୍କ ବାର୍ତ୍ତା ଟାଇପ କରନ୍ତୁ...' :
              currentLanguage === 'ur' ? 'اپنا پیغام لکھیں...' :
              'Type your message...'
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
          <button
            onClick={() => (isListening ? stopListening() : startListening())}
            className={`p-2 rounded-full border ${isListening ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-300 text-gray-600'} hover:bg-gray-50 transition-colors`}
            title={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

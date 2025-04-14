
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  text: string;
  translation?: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  audio?: string | null;
}

interface TopicData {
  responses: string[];
  translations: Record<string, string>;
  keywords?: Record<string, string[]>;
}

// Enhanced Arabic responses based on topics with more vocabulary
const topicData: Record<string, TopicData> = {
  greetings: {
    responses: [
      "مرحباً! كيف حالك اليوم؟",
      "أهلاً بك! اسمي هو المساعد العربي، ما هو اسمك؟",
      "السلام عليكم! سعيد بلقائك.",
      "صباح الخير! هل أنت جديد في تعلم اللغة العربية؟",
      "مساء الخير! كيف كان يومك؟",
      "أهلاً وسهلاً! أنا سعيد برؤيتك.",
      "تشرفت بمعرفتك! من أين أنت؟",
      "مرحبا بك في دروس اللغة العربية!",
      "أنا سعيد بالتحدث معك بالعربية.",
      "هل تريد أن تتعلم كلمات جديدة اليوم؟"
    ],
    translations: {
      "مرحباً! كيف حالك اليوم؟": "Hello! How are you today?",
      "أهلاً بك! اسمي هو المساعد العربي، ما هو اسمك؟": "Welcome! My name is the Arabic assistant, what's your name?",
      "السلام عليكم! سعيد بلقائك.": "Peace be upon you! Nice to meet you.",
      "صباح الخير! هل أنت جديد في تعلم اللغة العربية؟": "Good morning! Are you new to learning Arabic?",
      "مساء الخير! كيف كان يومك؟": "Good evening! How was your day?",
      "أهلاً وسهلاً! أنا سعيد برؤيتك.": "Welcome! I'm happy to see you.",
      "تشرفت بمعرفتك! من أين أنت؟": "Pleased to meet you! Where are you from?",
      "مرحبا بك في دروس اللغة العربية!": "Welcome to Arabic language lessons!",
      "أنا سعيد بالتحدث معك بالعربية.": "I'm happy to speak with you in Arabic.",
      "هل تريد أن تتعلم كلمات جديدة اليوم؟": "Would you like to learn new words today?"
    },
    keywords: {
      "مرحباً! كيف حالك اليوم؟": ["hello", "hi", "how are you", "how", "day"],
      "أهلاً بك! اسمي هو المساعد العربي، ما هو اسمك؟": ["name", "what", "your", "call", "i am"],
      "السلام عليكم! سعيد بلقائك.": ["peace", "nice", "meet", "greeting", "salam"],
      "صباح الخير! هل أنت جديد في تعلم اللغة العربية؟": ["morning", "good", "new", "learn", "beginner"],
      "مساء الخير! كيف كان يومك؟": ["evening", "how", "your", "day", "was"],
      "أهلاً وسهلاً! أنا سعيد برؤيتك.": ["welcome", "happy", "see", "you", "glad"],
      "تشرفت بمعرفتك! من أين أنت؟": ["meet", "pleased", "where", "from", "country"],
      "مرحبا بك في دروس اللغة العربية!": ["welcome", "lesson", "arabic", "language", "class"],
      "أنا سعيد بالتحدث معك بالعربية.": ["happy", "speak", "talk", "arabic", "conversation"],
      "هل تريد أن تتعلم كلمات جديدة اليوم؟": ["learn", "new", "words", "today", "vocabulary"]
    }
  },
  daily: {
    responses: [
      "ماذا تفعل عادة في الصباح؟",
      "متى تستيقظ عادة؟",
      "هل تحب القهوة في الصباح؟",
      "ما هي خططك لهذا اليوم؟",
      "أنا أستيقظ في الساعة السادسة كل يوم.",
      "أفضل تناول الإفطار قبل الذهاب إلى العمل.",
      "ما هو روتينك اليومي؟",
      "أحب ممارسة الرياضة بعد العمل.",
      "هل تشاهد التلفاز في المساء؟",
      "متى تذهب إلى النوم عادة؟",
      "أذهب إلى العمل بالحافلة كل صباح.",
      "أحب المشي في الحديقة بعد العشاء.",
      "هل تتناول الغداء في المنزل أم في المطعم؟",
      "أستمع إلى الأخبار أثناء القيادة إلى العمل.",
      "كم ساعة تنام في الليل؟"
    ],
    translations: {
      "ماذا تفعل عادة في الصباح؟": "What do you usually do in the morning?",
      "متى تستيقظ عادة؟": "When do you usually wake up?",
      "هل تحب القهوة في الصباح؟": "Do you like coffee in the morning?",
      "ما هي خططك لهذا اليوم؟": "What are your plans for today?",
      "أنا أستيقظ في الساعة السادسة كل يوم.": "I wake up at six o'clock every day.",
      "أفضل تناول الإفطار قبل الذهاب إلى العمل.": "I prefer to have breakfast before going to work.",
      "ما هو روتينك اليومي؟": "What is your daily routine?",
      "أحب ممارسة الرياضة بعد العمل.": "I like to exercise after work.",
      "هل تشاهد التلفاز في المساء؟": "Do you watch TV in the evening?",
      "متى تذهب إلى النوم عادة؟": "When do you usually go to sleep?",
      "أذهب إلى العمل بالحافلة كل صباح.": "I go to work by bus every morning.",
      "أحب المشي في الحديقة بعد العشاء.": "I like to walk in the park after dinner.",
      "هل تتناول الغداء في المنزل أم في المطعم؟": "Do you have lunch at home or at a restaurant?",
      "أستمع إلى الأخبار أثناء القيادة إلى العمل.": "I listen to the news while driving to work.",
      "كم ساعة تنام في الليل؟": "How many hours do you sleep at night?"
    },
    keywords: {
      "ماذا تفعل عادة في الصباح؟": ["do", "morning", "usually", "what", "routine"],
      "متى تستيقظ عادة؟": ["wake", "up", "when", "time", "morning"],
      "هل تحب القهوة في الصباح؟": ["coffee", "like", "morning", "drink", "tea"],
      "ما هي خططك لهذا اليوم؟": ["plan", "today", "what", "doing", "schedule"],
      "أنا أستيقظ في الساعة السادسة كل يوم.": ["wake", "six", "clock", "every", "day"],
      "أفضل تناول الإفطار قبل الذهاب إلى العمل.": ["breakfast", "before", "work", "eat", "morning"],
      "ما هو روتينك اليومي؟": ["routine", "daily", "what", "schedule", "habit"],
      "أحب ممارسة الرياضة بعد العمل.": ["exercise", "after", "work", "sport", "gym"],
      "هل تشاهد التلفاز في المساء؟": ["watch", "tv", "evening", "television", "night"],
      "متى تذهب إلى النوم عادة؟": ["sleep", "bed", "when", "night", "time"],
      "أذهب إلى العمل بالحافلة كل صباح.": ["bus", "work", "morning", "go", "transport"],
      "أحب المشي في الحديقة بعد العشاء.": ["walk", "park", "after", "dinner", "evening"],
      "هل تتناول الغداء في المنزل أم في المطعم؟": ["lunch", "home", "restaurant", "eat", "where"],
      "أستمع إلى الأخبار أثناء القيادة إلى العمل.": ["listen", "news", "driving", "work", "radio"],
      "كم ساعة تنام في الليل؟": ["how many", "hours", "sleep", "night", "rest"]
    }
  },
  food: {
    responses: [
      "ما هو طعامك العربي المفضل؟",
      "هل جربت الكوشري من قبل؟",
      "هل تفضل الحلويات العربية؟",
      "أنا أحب الفلافل والحمص، وأنت؟",
      "الشاورما هي وجبة شهيرة في العالم العربي.",
      "هل تعرف كيف تطبخ المنسف؟",
      "هل جربت البابا غنوج؟ إنه طبق لذيذ من الباذنجان.",
      "التبولة سلطة منعشة مصنوعة من البقدونس والبرغل.",
      "الكنافة من أشهر الحلويات العربية.",
      "هل تحب الأطعمة الحارة؟",
      "المقلوبة طبق فلسطيني شهير باللحم والباذنجان والأرز.",
      "الكبة هي كرات من اللحم والبرغل، مشهورة في سوريا ولبنان.",
      "هل جربت المجدرة؟ إنها وجبة من الأرز والعدس.",
      "الملوخية حساء أخضر شهير في مصر، يُقدم مع الأرز.",
      "البقلاوة من أشهر الحلويات في الشرق الأوسط."
    ],
    translations: {
      "ما هو طعامك العربي المفضل؟": "What is your favorite Arabic food?",
      "هل جربت الكوشري من قبل؟": "Have you tried Koshari before?",
      "هل تفضل الحلويات العربية؟": "Do you prefer Arabic sweets?",
      "أنا أحب الفلافل والحمص، وأنت؟": "I like falafel and hummus, what about you?",
      "الشاورما هي وجبة شهيرة في العالم العربي.": "Shawarma is a famous dish in the Arab world.",
      "هل تعرف كيف تطبخ المنسف؟": "Do you know how to cook Mansaf?",
      "هل جربت البابا غنوج؟ إنه طبق لذيذ من الباذنجان.": "Have you tried Baba Ghanoush? It's a delicious eggplant dish.",
      "التبولة سلطة منعشة مصنوعة من البقدونس والبرغل.": "Tabbouleh is a refreshing salad made of parsley and bulgur.",
      "الكنافة من أشهر الحلويات العربية.": "Kunafa is one of the most famous Arabic sweets.",
      "هل تحب الأطعمة الحارة؟": "Do you like spicy food?",
      "المقلوبة طبق فلسطيني شهير باللحم والباذنجان والأرز.": "Maqluba is a famous Palestinian dish with meat, eggplant, and rice.",
      "الكبة هي كرات من اللحم والبرغل، مشهورة في سوريا ولبنان.": "Kibbeh is meat and bulgur balls, famous in Syria and Lebanon.",
      "هل جربت المجدرة؟ إنها وجبة من الأرز والعدس.": "Have you tried Mujadara? It's a dish of rice and lentils.",
      "الملوخية حساء أخضر شهير في مصر، يُقدم مع الأرز.": "Molokhia is a famous green soup in Egypt, served with rice.",
      "البقلاوة من أشهر الحلويات في الشرق الأوسط.": "Baklava is one of the most famous sweets in the Middle East."
    },
    keywords: {
      "ما هو طعامك العربي المفضل؟": ["favorite", "food", "arabic", "like", "best"],
      "هل جربت الكوشري من قبل؟": ["try", "koshari", "ever", "before", "egyptian"],
      "هل تفضل الحلويات العربية؟": ["sweet", "dessert", "prefer", "arabic", "baklava"],
      "أنا أحب الفلافل والحمص، وأنت؟": ["falafel", "hummus", "like", "about", "you"],
      "الشاورما هي وجبة شهيرة في العالم العربي.": ["shawarma", "famous", "dish", "arab", "world"],
      "هل تعرف كيف تطبخ المنسف؟": ["cook", "mansaf", "how", "know", "recipe"],
      "هل جربت البابا غنوج؟ إنه طبق لذيذ من الباذنجان.": ["baba", "ghanoush", "eggplant", "tried", "delicious"],
      "التبولة سلطة منعشة مصنوعة من البقدونس والبرغل.": ["tabbouleh", "salad", "parsley", "bulgur", "refreshing"],
      "الكنافة من أشهر الحلويات العربية.": ["kunafa", "kanafeh", "sweet", "dessert", "famous"],
      "هل تحب الأطعمة الحارة؟": ["spicy", "food", "like", "hot", "chili"],
      "المقلوبة طبق فلسطيني شهير باللحم والباذنجان والأرز.": ["maqluba", "palestinian", "dish", "eggplant", "rice"],
      "الكبة هي كرات من اللحم والبرغل، مشهورة في سوريا ولبنان.": ["kibbeh", "meat", "balls", "syria", "lebanon"],
      "هل جربت المجدرة؟ إنها وجبة من الأرز والعدس.": ["mujadara", "rice", "lentils", "dish", "tried"],
      "الملوخية حساء أخضر شهير في مصر، يُقدم مع الأرز.": ["molokhia", "soup", "green", "egypt", "rice"],
      "البقلاوة من أشهر الحلويات في الشرق الأوسط.": ["baklava", "sweet", "dessert", "middle", "east"]
    }
  },
  travel: {
    responses: [
      "هل زرت أي دولة عربية من قبل؟",
      "أين تود السفر في العالم العربي؟",
      "كيف يمكنني الوصول إلى المتحف؟",
      "هل تستطيع إرشادي إلى أقرب محطة مترو؟",
      "مصر لديها الكثير من المعالم الأثرية الرائعة.",
      "دبي مدينة حديثة وجميلة في الإمارات العربية المتحدة.",
      "المغرب له ثقافة غنية وطعام لذيذ.",
      "كم تكلفة تذكرة الطائرة إلى عمّان؟",
      "أين أفضل مكان للإقامة في بيروت؟",
      "هل تحتاج إلى تأشيرة لزيارة تونس؟",
      "الأردن بلد جميل، فيه البتراء وهي إحدى عجائب الدنيا.",
      "فندق خمس نجوم أم شقة مفروشة، ماذا تفضل؟",
      "أحب زيارة الأسواق المحلية عندما أسافر.",
      "أفضل وقت لزيارة المغرب هو في الربيع أو الخريف.",
      "هل تتحدث العربية عندما تسافر إلى البلدان العربية؟"
    ],
    translations: {
      "هل زرت أي دولة عربية من قبل؟": "Have you visited any Arab country before?",
      "أين تود السفر في العالم العربي؟": "Where would you like to travel in the Arab world?",
      "كيف يمكنني الوصول إلى المتحف؟": "How can I get to the museum?",
      "هل تستطيع إرشادي إلى أقرب محطة مترو؟": "Can you guide me to the nearest metro station?",
      "مصر لديها الكثير من المعالم الأثرية الرائعة.": "Egypt has many wonderful archaeological sites.",
      "دبي مدينة حديثة وجميلة في الإمارات العربية المتحدة.": "Dubai is a modern and beautiful city in the UAE.",
      "المغرب له ثقافة غنية وطعام لذيذ.": "Morocco has a rich culture and delicious food.",
      "كم تكلفة تذكرة الطائرة إلى عمّان؟": "How much does a plane ticket to Amman cost?",
      "أين أفضل مكان للإقامة في بيروت؟": "Where is the best place to stay in Beirut?",
      "هل تحتاج إلى تأشيرة لزيارة تونس؟": "Do you need a visa to visit Tunisia?",
      "الأردن بلد جميل، فيه البتراء وهي إحدى عجائب الدنيا.": "Jordan is a beautiful country, it has Petra which is one of the wonders of the world.",
      "فندق خمس نجوم أم شقة مفروشة، ماذا تفضل؟": "Five-star hotel or furnished apartment, which do you prefer?",
      "أحب زيارة الأسواق المحلية عندما أسافر.": "I like to visit local markets when I travel.",
      "أفضل وقت لزيارة المغرب هو في الربيع أو الخريف.": "The best time to visit Morocco is in spring or autumn.",
      "هل تتحدث العربية عندما تسافر إلى البلدان العربية؟": "Do you speak Arabic when you travel to Arab countries?"
    },
    keywords: {
      "هل زرت أي دولة عربية من قبل؟": ["visited", "arab", "country", "before", "ever"],
      "أين تود السفر في العالم العربي؟": ["travel", "arab", "world", "where", "like"],
      "كيف يمكنني الوصول إلى المتحف؟": ["get", "museum", "how", "reach", "directions"],
      "هل تستطيع إرشادي إلى أقرب محطة مترو؟": ["guide", "metro", "station", "nearest", "direction"],
      "مصر لديها الكثير من المعالم الأثرية الرائعة.": ["egypt", "archaeological", "sites", "pyramids", "ancient"],
      "دبي مدينة حديثة وجميلة في الإمارات العربية المتحدة.": ["dubai", "uae", "modern", "city", "emirates"],
      "المغرب له ثقافة غنية وطعام لذيذ.": ["morocco", "culture", "food", "rich", "delicious"],
      "كم تكلفة تذكرة الطائرة إلى عمّان؟": ["cost", "ticket", "plane", "amman", "how much"],
      "أين أفضل مكان للإقامة في بيروت؟": ["stay", "beirut", "best", "place", "hotel"],
      "هل تحتاج إلى تأشيرة لزيارة تونس؟": ["visa", "tunisia", "need", "visit", "travel"],
      "الأردن بلد جميل، فيه البتراء وهي إحدى عجائب الدنيا.": ["jordan", "petra", "wonder", "world", "beautiful"],
      "فندق خمس نجوم أم شقة مفروشة، ماذا تفضل؟": ["hotel", "apartment", "prefer", "stay", "accommodation"],
      "أحب زيارة الأسواق المحلية عندما أسافر.": ["markets", "local", "visit", "travel", "shopping"],
      "أفضل وقت لزيارة المغرب هو في الربيع أو الخريف.": ["best", "time", "morocco", "spring", "autumn"],
      "هل تتحدث العربية عندما تسافر إلى البلدان العربية؟": ["speak", "arabic", "travel", "countries", "language"]
    }
  },
  shopping: {
    responses: [
      "هل تحب التسوق في الأسواق التقليدية؟",
      "بكم هذا؟ هل يمكن الحصول على سعر أفضل؟",
      "أبحث عن هدية تذكارية جميلة، هل لديك اقتراحات؟",
      "هل تقبلون بطاقات الائتمان؟",
      "أين يمكنني شراء ملابس تقليدية؟",
      "هل يمكنني تجربة هذا؟",
      "هل لديكم مقاس أكبر؟",
      "هل هذا مصنوع يدويًا؟",
      "أريد شراء بعض التوابل العربية.",
      "متى يفتح السوق ويغلق؟",
      "هذا جميل جدًا، هل يمكنني رؤية لون آخر؟",
      "أبحث عن شيء غير مكلف لأخذه كهدية.",
      "هل لديك شيء مميز من هذه المنطقة؟",
      "هل يمكنني الحصول على إيصال؟",
      "هل تستطيع تغليف هذا كهدية؟"
    ],
    translations: {
      "هل تحب التسوق في الأسواق التقليدية؟": "Do you like shopping in traditional markets?",
      "بكم هذا؟ هل يمكن الحصول على سعر أفضل؟": "How much is this? Can I get a better price?",
      "أبحث عن هدية تذكارية جميلة، هل لديك اقتراحات؟": "I'm looking for a nice souvenir, do you have suggestions?",
      "هل تقبلون بطاقات الائتمان؟": "Do you accept credit cards?",
      "أين يمكنني شراء ملابس تقليدية؟": "Where can I buy traditional clothes?",
      "هل يمكنني تجربة هذا؟": "Can I try this on?",
      "هل لديكم مقاس أكبر؟": "Do you have a larger size?",
      "هل هذا مصنوع يدويًا؟": "Is this handmade?",
      "أريد شراء بعض التوابل العربية.": "I want to buy some Arabic spices.",
      "متى يفتح السوق ويغلق؟": "When does the market open and close?",
      "هذا جميل جدًا، هل يمكنني رؤية لون آخر؟": "This is very beautiful, can I see another color?",
      "أبحث عن شيء غير مكلف لأخذه كهدية.": "I'm looking for something inexpensive to take as a gift.",
      "هل لديك شيء مميز من هذه المنطقة؟": "Do you have something special from this region?",
      "هل يمكنني الحصول على إيصال؟": "Can I get a receipt?",
      "هل تستطيع تغليف هذا كهدية؟": "Can you wrap this as a gift?"
    },
    keywords: {
      "هل تحب التسوق في الأسواق التقليدية؟": ["shopping", "market", "traditional", "souk", "bazaar"],
      "بكم هذا؟ هل يمكن الحصول على سعر أفضل؟": ["price", "much", "better", "discount", "bargain"],
      "أبحث عن هدية تذكارية جميلة، هل لديك اقتراحات؟": ["souvenir", "gift", "suggestion", "looking", "recommendation"],
      "هل تقبلون بطاقات الائتمان؟": ["credit", "card", "pay", "accept", "cash"],
      "أين يمكنني شراء ملابس تقليدية؟": ["buy", "clothes", "traditional", "where", "dress"],
      "هل يمكنني تجربة هذا؟": ["try", "this", "on", "fitting", "room"],
      "هل لديكم مقاس أكبر؟": ["size", "larger", "bigger", "have", "small"],
      "هل هذا مصنوع يدويًا؟": ["handmade", "made", "craft", "artisan", "authentic"],
      "أريد شراء بعض التوابل العربية.": ["spices", "buy", "arabic", "want", "herbs"],
      "متى يفتح السوق ويغلق؟": ["open", "close", "hours", "market", "when"],
      "هذا جميل جدًا، هل يمكنني رؤية لون آخر؟": ["beautiful", "color", "another", "see", "different"],
      "أبحث عن شيء غير مكلف لأخذه كهدية.": ["inexpensive", "cheap", "gift", "looking", "affordable"],
      "هل لديك شيء مميز من هذه المنطقة؟": ["special", "region", "local", "unique", "area"],
      "هل يمكنني الحصول على إيصال؟": ["receipt", "get", "invoice", "proof", "purchase"],
      "هل تستطيع تغليف هذا كهدية؟": ["wrap", "gift", "package", "present", "box"]
    }
  },
  weather: {
    responses: [
      "كيف الطقس اليوم؟",
      "هل تتوقع أن تمطر غدًا؟",
      "الجو مشمس ودافئ اليوم.",
      "الجو بارد جدًا هذا الصباح.",
      "هل تفضل الطقس الحار أم البارد؟",
      "أتمنى أن يتحسن الطقس قريبًا.",
      "ما هي درجة الحرارة اليوم؟",
      "الصيف حار جدًا في الشرق الأوسط.",
      "هل تحب فصل الشتاء؟",
      "الخريف هو فصلي المفضل.",
      "الطقس متقلب هذا الأسبوع.",
      "يجب أن تأخذ مظلة معك، قد تمطر.",
      "السماء صافية والهواء منعش.",
      "أحب الطقس المعتدل في الربيع.",
      "هل تعتقد أن الطقس سيكون جيدًا لرحلتنا؟"
    ],
    translations: {
      "كيف الطقس اليوم؟": "How is the weather today?",
      "هل تتوقع أن تمطر غدًا؟": "Do you expect it to rain tomorrow?",
      "الجو مشمس ودافئ اليوم.": "The weather is sunny and warm today.",
      "الجو بارد جدًا هذا الصباح.": "It's very cold this morning.",
      "هل تفضل الطقس الحار أم البارد؟": "Do you prefer hot or cold weather?",
      "أتمنى أن يتحسن الطقس قريبًا.": "I hope the weather improves soon.",
      "ما هي درجة الحرارة اليوم؟": "What is the temperature today?",
      "الصيف حار جدًا في الشرق الأوسط.": "Summer is very hot in the Middle East.",
      "هل تحب فصل الشتاء؟": "Do you like winter?",
      "الخريف هو فصلي المفضل.": "Autumn is my favorite season.",
      "الطقس متقلب هذا الأسبوع.": "The weather is changeable this week.",
      "يجب أن تأخذ مظلة معك، قد تمطر.": "You should take an umbrella with you, it might rain.",
      "السماء صافية والهواء منعش.": "The sky is clear and the air is refreshing.",
      "أحب الطقس المعتدل في الربيع.": "I love the moderate weather in spring.",
      "هل تعتقد أن الطقس سيكون جيدًا لرحلتنا؟": "Do you think the weather will be good for our trip?"
    },
    keywords: {
      "كيف الطقس اليوم؟": ["weather", "today", "how", "forecast", "outside"],
      "هل تتوقع أن تمطر غدًا؟": ["rain", "tomorrow", "expect", "forecast", "umbrella"],
      "الجو مشمس ودافئ اليوم.": ["sunny", "warm", "today", "nice", "weather"],
      "الجو بارد جدًا هذا الصباح.": ["cold", "very", "morning", "chilly", "freezing"],
      "هل تفضل الطقس الحار أم البارد؟": ["prefer", "hot", "cold", "weather", "like"],
      "أتمنى أن يتحسن الطقس قريبًا.": ["hope", "improve", "better", "soon", "change"],
      "ما هي درجة الحرارة اليوم؟": ["temperature", "today", "degrees", "what", "celsius"],
      "الصيف حار جدًا في الشرق الأوسط.": ["summer", "hot", "middle east", "very", "heat"],
      "هل تحب فصل الشتاء؟": ["like", "winter", "season", "snow", "cold"],
      "الخريف هو فصلي المفضل.": ["autumn", "fall", "favorite", "season", "prefer"],
      "الطقس متقلب هذا الأسبوع.": ["changeable", "weather", "week", "unpredictable", "variable"],
      "يجب أن تأخذ مظلة معك، قد تمطر.": ["umbrella", "rain", "take", "might", "should"],
      "السماء صافية والهواء منعش.": ["sky", "clear", "air", "refreshing", "fresh"],
      "أحب الطقس المعتدل في الربيع.": ["moderate", "weather", "spring", "love", "mild"],
      "هل تعتقد أن الطقس سيكون جيدًا لرحلتنا؟": ["think", "weather", "good", "trip", "forecast"]
    }
  },
  family: {
    responses: [
      "كم عدد أفراد عائلتك؟",
      "هل لديك إخوة أو أخوات؟",
      "أين يعيش والداك؟",
      "هل أنت متزوج/متزوجة؟",
      "ما اسم ابنك/ابنتك؟",
      "عائلتي صغيرة، لدي أخ واحد وأخت واحدة.",
      "جدي وجدتي يعيشان في القرية.",
      "عمي طبيب وعمتي مدرسة.",
      "خالي يعمل في شركة كبيرة.",
      "أحب قضاء الوقت مع عائلتي في عطلة نهاية الأسبوع.",
      "والدي مهندس ووالدتي محامية.",
      "لدي ثلاثة أبناء وابنة واحدة.",
      "أختي الكبرى تعيش في الخارج منذ خمس سنوات.",
      "هل لديك أبناء عم أو أبناء خال؟",
      "ما هي المناسبات التي تجتمع فيها العائلة عادة؟"
    ],
    translations: {
      "كم عدد أفراد عائلتك؟": "How many members are in your family?",
      "هل لديك إخوة أو أخوات؟": "Do you have brothers or sisters?",
      "أين يعيش والداك؟": "Where do your parents live?",
      "هل أنت متزوج/متزوجة؟": "Are you married?",
      "ما اسم ابنك/ابنتك؟": "What is your son's/daughter's name?",
      "عائلتي صغيرة، لدي أخ واحد وأخت واحدة.": "My family is small, I have one brother and one sister.",
      "جدي وجدتي يعيشان في القرية.": "My grandparents live in the village.",
      "عمي طبيب وعمتي مدرسة.": "My uncle is a doctor and my aunt is a teacher.",
      "خالي يعمل في شركة كبيرة.": "My maternal uncle works in a big company.",
      "أحب قضاء الوقت مع عائلتي في عطلة نهاية الأسبوع.": "I like to spend time with my family on the weekend.",
      "والدي مهندس ووالدتي محامية.": "My father is an engineer and my mother is a lawyer.",
      "لدي ثلاثة أبناء وابنة واحدة.": "I have three sons and one daughter.",
      "أختي الكبرى تعيش في الخارج منذ خمس سنوات.": "My older sister has been living abroad for five years.",
      "هل لديك أبناء عم أو أبناء خال؟": "Do you have cousins?",
      "ما هي المناسبات التي تجتمع فيها العائلة عادة؟": "What are the occasions when the family usually gathers?"
    },
    keywords: {
      "كم عدد أفراد عائلتك؟": ["family", "members", "how many", "size", "people"],
      "هل لديك إخوة أو أخوات؟": ["brothers", "sisters", "siblings", "have", "any"],
      "أين يعيش والداك؟": ["parents", "live", "where", "mother", "father"],
      "هل أنت متزوج/متزوجة؟": ["married", "single", "wife", "husband", "spouse"],
      "ما اسم ابنك/ابنتك؟": ["name", "son", "daughter", "child", "what"],
      "عائلتي صغيرة، لدي أخ واحد وأخت واحدة.": ["small", "family", "brother", "sister", "one"],
      "جدي وجدتي يعيشان في القرية.": ["grandparents", "grandfather", "grandmother", "village", "live"],
      "عمي طبيب وعمتي مدرسة.": ["uncle", "doctor", "aunt", "teacher", "profession"],
      "خالي يعمل في شركة كبيرة.": ["uncle", "work", "company", "job", "big"],
      "أحب قضاء الوقت مع عائلتي في عطلة نهاية الأسبوع.": ["spend", "time", "family", "weekend", "like"],
      "والدي مهندس ووالدتي محامية.": ["father", "engineer", "mother", "lawyer", "profession"],
      "لدي ثلاثة أبناء وابنة واحدة.": ["three", "sons", "daughter", "children", "have"],
      "أختي الكبرى تعيش في الخارج منذ خمس سنوات.": ["sister", "older", "abroad", "years", "living"],
      "هل لديك أبناء عم أو أبناء خال؟": ["cousins", "have", "relatives", "family", "extended"],
      "ما هي المناسبات التي تجتمع فيها العائلة عادة؟": ["occasions", "gather", "family", "usually", "celebrations"]
    }
  },
  hobbies: {
    responses: [
      "ما هي هواياتك المفضلة؟",
      "هل تحب القراءة؟ ما هو كتابك المفضل؟",
      "أنا أحب مشاهدة الأفلام في وقت فراغي.",
      "هل تمارس أي رياضة؟",
      "هل تعزف على أي آلة موسيقية؟",
      "أحب الطبخ والتجربة وصفات جديدة.",
      "هل تحب السفر؟ ما هو أفضل مكان زرته؟",
      "هل تستمتع بالتصوير الفوتوغرافي؟",
      "أستمتع بالمشي في الطبيعة في عطلة نهاية الأسبوع.",
      "ما هو برنامجك التلفزيوني المفضل؟",
      "هل تمارس اليوغا أو التأمل؟",
      "أنا أحب الرسم والفنون التشكيلية.",
      "هل تستمع إلى الموسيقى العربية؟",
      "أهتم بالبستنة وزراعة النباتات.",
      "هل تجمع أي شيء كهواية؟"
    ],
    translations: {
      "ما هي هواياتك المفضلة؟": "What are your favorite hobbies?",
      "هل تحب القراءة؟ ما هو كتابك المفضل؟": "Do you like reading? What is your favorite book?",
      "أنا أحب مشاهدة الأفلام في وقت فراغي.": "I like watching movies in my free time.",
      "هل تمارس أي رياضة؟": "Do you play any sports?",
      "هل تعزف على أي آلة موسيقية؟": "Do you play any musical instruments?",
      "أحب الطبخ والتجربة وصفات جديدة.": "I like cooking and trying new recipes.",
      "هل تحب السفر؟ ما هو أفضل مكان زرته؟": "Do you like traveling? What is the best place you've visited?",
      "هل تستمتع بالتصوير الفوتوغرافي؟": "Do you enjoy photography?",
      "أستمتع بالمشي في الطبيعة في عطلة نهاية الأسبوع.": "I enjoy walking in nature on the weekend.",
      "ما هو برنامجك التلفزيوني المفضل؟": "What is your favorite TV show?",
      "هل تمارس اليوغا أو التأمل؟": "Do you practice yoga or meditation?",
      "أنا أحب الرسم والفنون التشكيلية.": "I love drawing and visual arts.",
      "هل تستمع إلى الموسيقى العربية؟": "Do you listen to Arabic music?",
      "أهتم بالبستنة وزراعة النباتات.": "I'm interested in gardening and growing plants.",
      "هل تجمع أي شيء كهواية؟": "Do you collect anything as a hobby?"
    },
    keywords: {
      "ما هي هواياتك المفضلة؟": ["hobbies", "favorite", "interests", "like", "free time"],
      "هل تحب القراءة؟ ما هو كتابك المفضل؟": ["reading", "book", "favorite", "like", "novels"],
      "أنا أحب مشاهدة الأفلام في وقت فراغي.": ["movies", "watch", "films", "free time", "cinema"],
      "هل تمارس أي رياضة؟": ["sports", "play", "exercise", "football", "basketball"],
      "هل تعزف على أي آلة موسيقية؟": ["instrument", "music", "play", "musical", "piano"],
      "أحب الطبخ والتجربة وصفات جديدة.": ["cooking", "recipes", "food", "kitchen", "baking"],
      "هل تحب السفر؟ ما هو أفضل مكان زرته؟": ["travel", "place", "visited", "country", "tourism"],
      "هل تستمتع بالتصوير الفوتوغرافي؟": ["photography", "photos", "camera", "pictures", "taking"],
      "أستمتع بالمشي في الطبيعة في عطلة نهاية الأسبوع.": ["walking", "nature", "weekend", "hiking", "outdoors"],
      "ما هو برنامجك التلفزيوني المفضل؟": ["tv", "show", "favorite", "series", "watch"],
      "هل تمارس اليوغا أو التأمل؟": ["yoga", "meditation", "practice", "mindfulness", "exercise"],
      "أنا أحب الرسم والفنون التشكيلية.": ["drawing", "art", "painting", "visual", "creative"],
      "هل تستمع إلى الموسيقى العربية؟": ["music", "arabic", "listen", "songs", "traditional"],
      "أهتم بالبستنة وزراعة النباتات.": ["gardening", "plants", "growing", "flowers", "garden"],
      "هل تجمع أي شيء كهواية؟": ["collect", "hobby", "collection", "stamps", "coins"]
    }
  }
};

// Improved function to get a relevant response based on user input and the current topic
export const getRelevantResponse = (userInput: string, currentTopic: string): Message => {
  const topicContent = topicData[currentTopic] || topicData.greetings;
  
  // If no matching response found, fall back to random
  if (!userInput.trim()) {
    return getRandomResponse(currentTopic);
  }
  
  // Convert user input to lowercase for better matching
  const inputLower = userInput.toLowerCase();
  
  // Calculate the best matching response based on keywords
  let bestMatch: { response: string; score: number } = { response: '', score: 0 };
  
  if (topicContent.keywords) {
    Object.entries(topicContent.keywords).forEach(([response, keywords]) => {
      let score = 0;
      
      // Check how many keywords are present in the user input
      keywords.forEach(keyword => {
        if (inputLower.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });
      
      if (score > bestMatch.score) {
        bestMatch = { response, score };
      }
    });
  }
  
  // If we found a match with a score > 0, use it, otherwise get a random response
  const responseText = bestMatch.score > 0 
    ? bestMatch.response 
    : topicContent.responses[Math.floor(Math.random() * topicContent.responses.length)];
  
  return {
    id: Date.now().toString(),
    text: responseText,
    translation: topicContent.translations[responseText] || "Translation not available",
    sender: 'assistant',
    timestamp: new Date(),
  };
};

// Function to get a random response for the current topic
export const getRandomResponse = (currentTopic: string): Message => {
  const topicContent = topicData[currentTopic] || topicData.greetings;
  const randomIndex = Math.floor(Math.random() * topicContent.responses.length);
  const text = topicContent.responses[randomIndex];
  
  return {
    id: Date.now().toString(),
    text,
    translation: topicContent.translations[text] || "Translation not available",
    sender: 'assistant',
    timestamp: new Date(),
  };
};

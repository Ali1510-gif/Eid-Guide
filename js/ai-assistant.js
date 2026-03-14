/**
 * AI Sunnah Assistant V2
 * Upgraded with premium UI, typing simulation, and deep grounding.
 */

const AISunnahAssistant = {
    chatContainerId: 'ai-chat-container',
    bubbleId: 'ai-chat-bubble',
    windowId: 'ai-chat-window',
    messagesId: 'ai-chat-messages',
    inputId: 'ai-chat-input',
    sendBtnId: 'ai-chat-send',
    isTyping: false,
    
    // Knowledge base extracted from guide content
    knowledgeBase: {
        en: {
            greetings: ["hello", "hi", "salam", "assalam", "morning", "hey", "greeting"],
            topics: {
                "eid prayer": "Eid prayer is Wajib (obligatory). It consists of 2 Rak'ahs with 6 additional Takbeers. It should be performed after sunrise and before noon. No Azan or Iqamah is called for it.",
                "sadaqat-ul-fitr": "Sadaqat-ul-fitr (Fitrana) is mandatory for every Muslim who has enough for one day. It must be paid before the Eid prayer so the poor can also celebrate.",
                "morning sunnah": "Eid morning Sunnahs include: taking a Ghusl, wearing your best available clothes (preferably new), eating an odd number of dates (like 3 or 5) before going to prayer, using Miswak, and applying Attar (perfume).",
                "takbeer": "The Takbeer should be recited out loud when leaving for the Eidgah: 'Allahu Akbar, Allahu Akbar, La ilaha illallahu Wallahu Akbar, Allahu Akbar Wa lillahil Hamd'. Recite it until you reach the Eidgah.",
                "rules": "It is forbidden (Haram) to fast on the day of Eid-ul-Fitr. It is also Sunnah to take a different route when returning from the Eid prayer ground.",
                "etiquette": "Eid etiquette includes: showing joy, visiting family and friends, giving Eidi to children, being kind to the needy, and greeting others with 'Taqabbalallahu Minna wa Minkum'.",
                "chand raat": "Chand Raat is a night of great blessings. It is the 'Night of Reward' where Allah forgives those who fasted sincerely. Spend it in Dua and preparation.",
                "clothes": "It is Sunnah to wear your best clothes on Eid. If possible, buy new ones, but even clean old ones are great.",
                "eating": "On Eid-ul-Fitr, it is a Sunnah to eat something sweet (like dates) before heading out for the Eid prayer.",
                "eidgah": "Eid prayer is preferably offered in an open area (Eidgah) rather than inside a regular mosque, unless there is an excuse like rain.",
                "women": "Women are also encouraged to attend the Eid gathering, provided they follow proper hijab and specific prayer area arrangements are made.",
                "fasting": "Fasting is strictly prohibited on the day of Eid-ul-Fitr. It's a day of eating and celebration!",
                "certificate": "You can earn your Sunnah Companion certificate by visiting all 22 pages of this guide, completing the checklist, and passing the quiz on the final page!"
            }
        },
        ur: {
            greetings: ["سلام", "ہیلو", "ہیلو", "صبح", "کیسے"],
            topics: {
                "عید کی نماز": "نماز عید واجب ہے۔ یہ 6 زائد تکبیروں کے ساتھ 2 رکعتوں پر مشتمل ہے۔ یہ طلوع آفتاب کے بعد اور ظہر سے پہلے ادا کی جانی چاہیے۔ اس کے لیے کوئی اذان یا اقامت نہیں ہوتی۔",
                "صدقہ فطر": "صدقہ فطر (فطرانہ) ہر اس مسلمان پر فرض ہے جس کے پاس ایک دن کے لیے کافی ہو۔ اسے عید کی نماز سے پہلے ادا کرنا ضروری ہے تاکہ غریب بھی خوشیوں میں شریک ہو سکیں۔",
                "صبح کی سنت": "عید کی صبح کی سنتوں میں شامل ہے: غسل کرنا، بہترین لباس پہننا، نماز کے لیے جانے سے پہلے طاق عدد کھجوریں کھانا، مسواک کرنا اور خوشبو لگانا۔",
                "تکبیر": "عید گاہ کے لیے نکلتے وقت بلند آواز سے تکبیر پڑھنی چاہیے: 'اللہ اکبر، اللہ اکبر، لا الہ الا اللہ واللہ اکبر، اللہ اکبر وللہ الحمد'۔ اسے عید گاہ پہنچنے تک پڑھتے رہیں۔",
                "قوانین": "عید الفطر کے دن روزہ رکھنا حرام ہے۔ عید کی نماز سے واپسی پر دوسرا راستہ اختیار کرنا بھی سنت ہے۔",
                "آداب": "عید کے آداب میں شامل ہیں: خوشی کا اظہار کرنا، خاندان اور دوستوں سے ملنا، بچوں کو عیدی دینا، اور 'تقبل اللہ منا ومنکم' کے الفاظ میں مبارکباد دینا۔",
                "چاند رات": "چاند رات برکتوں والی رات ہے۔ یہ 'انعام کی رات' ہے جب اللہ ان لوگوں کو معاف کر دیتا ہے جنہوں نے اخلاص کے ساتھ روزے رکھے۔",
                "لباس": "عید پر بہترین لباس پہننا سنت ہے۔ اگر ممکن ہو تو نئے خریدیں، ورنہ صاف ستھرے پرانے بھی بہترین ہیں۔",
                "کھانا": "عید الفطر پر عید کی نماز کے لیے نکلنے سے پہلے کچھ میٹھا (جیسے کھجوریں) کھانا سنت ہے۔",
                "عید گاہ": "عید کی نماز مساجد کے بجائے کھلی جگہ (عید گاہ) میں ادا کرنا افضل ہے، الا یہ کہ کوئی مجبوری ہو جیسے بارش۔",
                "سرٹیفکیٹ": "آپ عید گائیڈ کے تمام 22 صفحات پڑھ کر، چیک لسٹ مکمل کر کے اور آخری صفحے پر کوئز پاس کر کے 'سنت ساتھی' سرٹیفکیٹ حاصل کر سکتے ہیں!"
            }
        },
        hi: {
            greetings: ["hello", "hi", "salam", "assalam", "namaste", "hey"],
            topics: {
                "eid namaz": "Eid ki namaz Wajib hai. Ismein 2 Rakate aur 6 extra Takbeerein hoti hain. Ise suraj nikalne ke baad aur zawal se pehle parha jata hai. Iske liye Azan nahi hoti.",
                "fitrana": "Sadaqat-ul-fitr (Fitrana) har Muslim par wajib hai jis ke paas ek din ka khana ho. Ise Eid ki namaz se pehle dena chahiye taaki gareeb bhi Eid mana sakein.",
                "morning sunnah": "Eid ki subah ki Sunnatein: Ghusl karna, ache kapre pehnna, namaz se pehle Taaq adad khajoorein khana, Miswak karna aur Ittar (perfume) lagana.",
                "takbeer": "Eidgah jaate waqt Takbeer zor se parhni chahiye: 'Allahu Akbar, Allahu Akbar, La ilaha illallahu Wallahu Akbar, Allahu Akbar Wa lillahil Hamd'.",
                "rules": "Eid-ul-Fitr ke din roza rakhna Haram hai. Eid ki namaz se rasta badal kar wapas ana bhi Sunnat hai.",
                "etiquette": "Eid ke adab: Khushi zahir karna, rishtedaron se milna, bacchon ko Eidi dena, aur 'Taqabbalallahu Minna wa Minkum' kehna.",
                "chand raat": "Chand Raat inaam ki raat hai. Allah ne is raat ko apne bandon ke liye maghfirat ki raat banaya hai. Is mein khoob Dua karein.",
                "clothes": "Eid par sabse ache kapre pehnna Sunnat hai. Naye kapre hon to behtar hai, warna purane saf-sutre kapre bhi chaleinge.",
                "eating": "Eid-ul-Fitr ki namaz ke liye jaane se pehle kuch meetha khana (jaise khajoorein) Sunnat hai.",
                "certificate": "Aap is guide ke saare 22 pages parhne ke baad, checklist poori kar ke aur quiz pass kar ke apna certificate le sakte hain!"
            }
        }
    },

    init() {
        if (location.protocol === 'file:' && !confirm("Warning: AI Assistant needs a server to load fonts/icons correctly. Continue anyway?")) return;
        if (document.getElementById(this.chatContainerId)) return;
        this.injectUI();
        this.bindEvents();
    },

    getTranslation(key, fallback) {
        if (window.LanguageManager && window.LanguageManager.currentLangData) {
            const translation = window.LanguageManager.getValueFromPath(window.LanguageManager.currentLangData, `ai_assistant.${key}`);
            if (translation) return translation;
        }
        return fallback;
    },

    injectUI() {
        const container = document.createElement('div');
        container.id = this.chatContainerId;
        container.className = 'ai-chat-wrapper';
        
        const calloutText = this.getTranslation('callout', 'Ask about Sunnah!');
        const headerText = this.getTranslation('header', 'Sunnah Assistant');
        const initialMsg = this.getTranslation('initial_message', 'Assalamu Alaikum! I am your Sunnah Assistant. How can I help you today?');
        const placeholderText = this.getTranslation('placeholder', 'Ask about Sunnah...');

        container.innerHTML = `
            <div id="${this.bubbleId}" class="ai-chat-bubble pulse-animation">
                <div class="bubble-inner">
                    <i class="fa-solid fa-kaaba"></i>
                </div>
                <div class="ai-chat-callout">${calloutText}</div>
            </div>
            <div id="${this.windowId}" class="ai-chat-window d-none glass-card shadow-lg">
                <div class="ai-chat-header bg-primary-theme text-white p-3 d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <div class="header-icon-box me-3">
                            <i class="fa-solid fa-kaaba text-gradient-gold"></i>
                        </div>
                        <div>
                            <span class="fw-bold d-block ai-header-title">${headerText}</span>
                            <span class="small opacity-75 d-block">Online</span>
                        </div>
                    </div>
                    <button class="btn-close btn-close-white btn-sm" onclick="AISunnahAssistant.toggleChat()"></button>
                </div>
                <div id="${this.messagesId}" class="ai-chat-messages p-3">
                    <div class="message system-message">
                        ${initialMsg}
                    </div>
                </div>
                <!-- Typing Indicator -->
                <div id="ai-typing" class="ai-typing d-none px-3 py-2 small text-muted italic">
                    <div class="typing-dots"><span>.</span><span>.</span><span>.</span></div>
                </div>
                <div class="ai-chat-input-area p-3 border-top">
                    <div class="input-group-premium-chat">
                        <input type="text" id="${this.inputId}" class="form-control-minimal-chat" placeholder="${placeholderText}">
                        <button id="${this.sendBtnId}" class="btn-chat-send">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                .ai-chat-wrapper {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 9999;
                    font-family: 'Inter', sans-serif;
                }
                .ai-chat-bubble {
                    width: 65px;
                    height: 65px;
                    background: var(--green-gradient);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
                    position: relative;
                    transition: all 0.3s var(--curve);
                }
                .ai-chat-bubble:hover {
                    transform: scale(1.1) rotate(5deg);
                }
                .bubble-inner {
                    font-size: 1.5rem;
                    color: white;
                }
                .ai-chat-callout {
                    position: absolute;
                    right: 80px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: var(--surface-glass);
                    backdrop-filter: blur(10px);
                    padding: 8px 16px;
                    border-radius: 12px;
                    border: 1px solid var(--glass-border);
                    white-space: nowrap;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-dark);
                    box-shadow: var(--shadow-soft);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                .ai-chat-bubble:hover .ai-chat-callout {
                    opacity: 1;
                    visibility: visible;
                    right: 75px;
                }
                .ai-chat-window {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 350px;
                    height: 500px;
                    background: var(--surface-glass);
                    backdrop-filter: blur(25px);
                    border-radius: 24px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid var(--glass-border);
                    animation: windowSlide 0.4s var(--curve);
                }
                @keyframes windowSlide {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .ai-chat-header {
                    background: var(--green-gradient) !important;
                }
                .header-icon-box {
                    width: 36px;
                    height: 36px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }
                .ai-chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .message {
                    max-width: 85%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    position: relative;
                }
                .system-message {
                    background: var(--surface-elevated);
                    color: var(--text-dark);
                    border-bottom-left-radius: 4px;
                    align-self: flex-start;
                    border: 1px solid var(--glass-border);
                }
                .user-message {
                    background: var(--primary-color);
                    color: white;
                    border-bottom-right-radius: 4px;
                    align-self: flex-end;
                    box-shadow: 0 5px 15px rgba(16, 185, 129, 0.2);
                }
                .input-group-premium-chat {
                    background: var(--surface-elevated);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                    padding: 8px 12px;
                    display: flex;
                    align-items: center;
                }
                .form-control-minimal-chat {
                    border: none;
                    background: transparent;
                    flex: 1;
                    padding: 4px;
                    color: var(--text-dark);
                    font-size: 0.9rem;
                }
                .form-control-minimal-chat:focus {
                    outline: none;
                }
                .btn-chat-send {
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s ease;
                }
                .btn-chat-send:hover {
                    transform: scale(1.1);
                }
                .ai-typing {
                    font-size: 0.75rem;
                    opacity: 0.8;
                }
                .typing-dots span {
                    animation: blink 1.4s infinite both;
                }
                .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes blink {
                    0% { opacity: 0.2; }
                    20% { opacity: 1; }
                    100% { opacity: 0.2; }
                }
                [data-theme="dark"] .ai-chat-window {
                    background: rgba(5, 46, 36, 0.85);
                }
            </style>
        `;
        
        document.body.appendChild(container);
    },

    bindEvents() {
        const bubble = document.getElementById(this.bubbleId);
        const input = document.getElementById(this.inputId);
        const sendBtn = document.getElementById(this.sendBtnId);

        bubble.addEventListener('click', () => this.toggleChat());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });

        sendBtn.addEventListener('click', () => this.handleSend());

        document.addEventListener('languageChanged', () => this.updateUILabels());
    },

    updateUILabels() {
        const callout = document.querySelector('.ai-chat-callout');
        const header = document.querySelector('.ai-header-title');
        const input = document.getElementById(this.inputId);
        
        if (callout) callout.textContent = this.getTranslation('callout', 'Ask about Sunnah!');
        if (header) header.textContent = this.getTranslation('header', 'Sunnah Assistant');
        if (input) input.placeholder = this.getTranslation('placeholder', 'Ask about Sunnah...');
    },

    toggleChat() {
        const chatWindow = document.getElementById(this.windowId);
        chatWindow.classList.toggle('d-none');
        if (!chatWindow.classList.contains('d-none')) {
            document.getElementById(this.inputId).focus();
        }
    },

    handleSend() {
        if (this.isTyping) return;
        const input = document.getElementById(this.inputId);
        const text = input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        input.value = '';
        
        this.showTyping(true);
        setTimeout(() => this.generateResponse(text), 1200);
    },

    showTyping(show) {
        this.isTyping = show;
        const indicator = document.getElementById('ai-typing');
        if (indicator) {
            if (show) indicator.classList.remove('d-none');
            else indicator.classList.add('d-none');
        }
    },

    generateResponse(userInput) {
        const lowerInput = userInput.toLowerCase();
        const lang = window.LanguageManager ? window.LanguageManager.currentLang : 'english';
        const langKey = lang === 'urdu' ? 'ur' : (lang === 'hinglish' ? 'hi' : 'en');
        const knowledge = this.knowledgeBase[langKey];
        
        let response = "";

        if (knowledge.greetings.some(g => lowerInput.includes(g))) {
            response = langKey === 'ur' ? "وعلیکم السلام! میں عید کے آداب کے بارے میں آپ کی کیا مدد کر سکتا ہوں؟" : 
                       (langKey === 'hi' ? "Walaikum Assalam! Main Eid ke Sunnat aur adab ke bare mein aapki kaise madad kar sakta hoon?" : 
                       "Walaikum Assalam! How can I help you learn more about Eid etiquette and Sunnahs today?");
        } else {
            const matchedTopic = Object.keys(knowledge.topics).find(topic => {
                const words = topic.split(' ');
                return words.every(word => lowerInput.includes(word)) || lowerInput.includes(topic);
            });

            if (matchedTopic) response = knowledge.topics[matchedTopic];
            else {
                const secondChance = Object.keys(knowledge.topics).find(topic => {
                    const words = topic.split(' ');
                    return words.some(word => word.length > 3 && lowerInput.includes(word));
                });
                if (secondChance) response = knowledge.topics[secondChance];
                else {
                    response = langKey === 'ur' ? "معذرت، میں اس بارے میں یقین سے نہیں کہہ سکتا۔ کیا آپ عید کی نماز، فطرانہ، چاند رات، یا عید کی سنتوں کے بارے میں پوچھنا چاہیں گے؟" :
                               (langKey === 'hi' ? "Maaf karein, mujhe iska sahi pata nahi hai. Kya aap Eid ki namaz, fitrana, chand raat ya subah ki sunnaton ke bare mein poochna chahengi?" :
                               "I'm sorry, I'm not familiar with that specific question. Try asking about 'Eid prayer', 'Fitrana', 'Chand Raat', or 'Morning Sunnahs'.");
                }
            }
        }

        this.showTyping(false);
        this.addMessage(response, 'system');
    },

    addMessage(text, type) {
        const messagesDiv = document.getElementById(this.messagesId);
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}-message`;
        messageEl.textContent = text;
        messagesDiv.appendChild(messageEl);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
};

if (typeof document !== 'undefined') {
    AISunnahAssistant.init();
}

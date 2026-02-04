/* ============================================
   ECS Smart AI Chatbot - Enhanced Version
   ============================================ */

class ECSSmartChatbot {
    constructor() {
        this.whatsappNumber = '201153611556';
        this.conversationHistory = [];
        this.userContext = {
            name: null,
            interests: [],
            lastTopic: null,
            visitCount: this.getVisitCount()
        };
        this.responses = this.initResponses();
        this.init();
    }

    getVisitCount() {
        let count = localStorage.getItem('ecs_visit_count') || 0;
        count = parseInt(count) + 1;
        localStorage.setItem('ecs_visit_count', count);
        return count;
    }

    initResponses() {
        return {
            // ردود ذكية بناءً على السياق
            smartGreetings: () => {
                const hour = new Date().getHours();
                const { visitCount, name } = this.userContext;
                
                let timeGreeting = hour < 12 ? 'صباح الخير' : hour < 18 ? 'مساء الخير' : 'مساء الخير';
                let personalGreeting = name ? `أهلاً ${name}! ` : 'أهلاً بك! ';
                let visitGreeting = visitCount > 1 ? `سعيد بعودتك للمرة ${this.toArabicNumber(visitCount)}! ` : 'أهلاً بك لأول مرة معنا! ';
                
                return `${timeGreeting} 👋
${personalGreeting}${visitGreeting}

أنا مساعدك الذكي في ECS. كيف أقدر أساعدك النهارده؟

💡 **أقدر أساعدك في:**
• معلومات عن الكورسات والتدريب 📚
• أسعار وتفاصيل الأجهزة 🛠️
• حجز فريق مساحي 👷
• تحميل البرامج الهندسية 💻
• الاستفسارات العامة ❓`;
            },

            // تحليل ذكي للأسئلة
            intelligentResponse: (userMessage) => {
                const message = userMessage.toLowerCase();
                
                // التعرف على الاسم
                const nameMatch = message.match(/اسمي|انا|أنا\s+(\S+)/);
                if (nameMatch && nameMatch[1]) {
                    this.userContext.name = nameMatch[1];
                    return `تشرفنا ${this.userContext.name}! 😊 
دلوقتي أقدر أتواصل معاك بشكل شخصي أكتر. 
إيه اللي تحب تعرفه عن ECS؟`;
                }

                // أسئلة الأسعار الذكية
                if (this.containsAny(message, ['سعر', 'كام', 'تكلفة', 'فلوس', 'ثمن', 'price', 'cost'])) {
                    if (this.containsAny(message, ['كورس', 'دورة', 'تدريب', 'course'])) {
                        return this.getCoursesPricing();
                    } else if (this.containsAny(message, ['جهاز', 'total', 'gps', 'معدات', 'ايجار'])) {
                        return this.getEquipmentPricing();
                    } else if (this.containsAny(message, ['فريق', 'مهندس', 'عمال'])) {
                        return this.getTeamPricing();
                    } else {
                        return `عايز تعرف سعر إيه بالظبط؟ 🤔

اختار من دول:
1️⃣ أسعار الكورسات
2️⃣ أسعار إيجار الأجهزة
3️⃣ أسعار الفرق المساحية
4️⃣ أسعار البرامج

اكتب رقم الاختيار أو اسأل مباشرة!`;
                    }
                }

                // أسئلة الكورسات المتقدمة
                if (this.containsAny(message, ['كورس', 'دورة', 'تدريب', 'تعليم', 'course', 'دراسة'])) {
                    this.userContext.lastTopic = 'courses';
                    if (this.containsAny(message, ['autocad', 'اوتوكاد', 'رسم'])) {
                        return this.getAutocadCourseDetails();
                    } else if (this.containsAny(message, ['civil', 'سيفيل', 'طرق'])) {
                        return this.getCivil3DCourseDetails();
                    } else if (this.containsAny(message, ['revit', 'ريفيت', 'bim'])) {
                        return this.getRevitCourseDetails();
                    } else {
                        return this.getAllCoursesInfo();
                    }
                }

                // أسئلة المشاريع
                if (this.containsAny(message, ['مشروع', 'شغل', 'عايز اشتغل', 'محتاج'])) {
                    return this.getProjectsInfo();
                }

                // أسئلة التوظيف
                if (this.containsAny(message, ['وظيفة', 'توظيف', 'شغل عندكم', 'محتاج شغل', 'job'])) {
                    return this.getJobsInfo();
                }

                // أسئلة عن الشركة
                if (this.containsAny(message, ['من انتم', 'مين انتم', 'ايه هي', 'عن الشركة', 'about'])) {
                    return this.getCompanyInfo();
                }

                // رد تلقائي ذكي
                return this.getSmartFallback(message);
            },

            // معلومات الكورسات
            getAllCoursesInfo: () => {
                return `📚 **الكورسات التدريبية المتاحة:**

🎯 **1. AutoCAD المتقدم**
   💰 السعر: 2,500 جنيه
   ⏱️ المدة: 3 شهور
   📊 المستوى: من المبتدئ للاحتراف
   ⭐ التقييم: 4.8/5 (523 تقييم)
   
🎯 **2. Civil 3D للطرق**
   💰 السعر: 3,000 جنيه
   ⏱️ المدة: 4 شهور
   📊 المستوى: متوسط - متقدم
   ⭐ التقييم: 4.9/5 (387 تقييم)

🎯 **3. Revit Architecture**
   💰 السعر: 3,500 جنيه
   ⏱️ المدة: 4 شهور
   📊 المستوى: متوسط
   ⭐ التقييم: 4.7/5 (298 تقييم)

🎯 **4. GIS & Mapping**
   💰 السعر: 2,800 جنيه
   ⏱️ المدة: 3 شهور
   📊 المستوى: متوسط
   
🎯 **5. مساحة Total Station**
   💰 السعر: 2,000 جنيه
   ⏱️ المدة: شهرين
   📊 المستوى: عملي

✨ **مميزات جميع الكورسات:**
✅ شهادة معتمدة من ECS
✅ تدريب عملي على المشاريع
✅ دعم فني مستمر
✅ وصول مدى الحياة للمحتوى
✅ مجموعات دراسية
✅ ملفات تدريبية شاملة

عايز تفاصيل أكتر عن كورس معين؟ 🎓`;
            },

            getAutocadCourseDetails: () => {
                return `📐 **كورس AutoCAD المتقدم - التفاصيل الكاملة**

💰 **السعر:** 2,500 جنيه (بدلاً من 3,500)
⏱️ **المدة:** 3 شهور
📅 **موعد البدء:** كل يوم أحد
⏰ **المواعيد المتاحة:**
   • صباحي: 10 ص - 1 ظهراً
   • مسائي: 6 م - 9 م

📚 **المحتوى التدريبي (52 درس):**

**القسم 1: الأساسيات** (8 دروس)
• واجهة البرنامج
• نظام الإحداثيات
• أوامر الرسم الأساسية

**القسم 2: الرسم المتقدم** (12 درس)
• Polyline & Spline
• أوامر التعديل
• Blocks & Attributes

**القسم 3: المشاريع العملية** (10 دروس)
• رسم مخططات معمارية
• رسم مخططات إنشائية
• مشروع تخرج متكامل

**القسم 4: الطباعة والإخراج** (6 دروس)
• Layouts & Viewports
• Plot Styles
• PDF Export

🎁 **هتحصل على:**
✅ 15+ ساعة فيديو HD
✅ 50+ ملف تدريبي
✅ شهادة معتمدة
✅ كتاب إلكتروني شامل
✅ دعم فني 24/7

👨‍🏫 **المدرب:** م. أحمد محمود
   • 8+ سنوات خبرة
   • Autodesk Certified
   • 15,000+ طالب

💳 **طرق الدفع:**
• فودافون كاش
• نقداً بالمقر
• تقسيط على 3 شهور

عايز تسجل دلوقتي؟ 🎯`;
            },

            getCivil3DCourseDetails: () => {
                return `🛣️ **كورس Civil 3D للطرق - التفاصيل الكاملة**

💰 **السعر:** 3,000 جنيه
⏱️ **المدة:** 4 شهور
🎯 **المستوى:** متوسط - متقدم

📚 **المحتوى (60+ درس):**

**Module 1: مقدمة Civil 3D**
• Points & Point Groups
• Surfaces من Survey Data
• Grading & Feature Lines

**Module 2: تصميم الطرق**
• Alignments
• Profiles & Profile Views
• Assemblies & Corridors

**Module 3: المشاريع العملية**
• تصميم طريق سريع
• تصميم تقاطع
• حساب الكميات

**Module 4: الإخراج النهائي**
• Sheets & Plan Production
• Reports & Quantities
• Integration with InfraWorks

🎁 **المميزات:**
✅ 20+ ساعة تدريب
✅ 10+ مشروع عملي
✅ ملفات CAD جاهزة
✅ Templates & Standards
✅ نماذج امتحانات Autodesk

👨‍🏫 **المدرب:** م. خالد حسن
   • خبير Civil 3D
   • مشاريع مع وزارة النقل
   • 5,000+ طالب

الكورس ده مناسب ليك لو:
✓ عندك خبرة في AutoCAD
✓ مهندس مدني أو طرق
✓ عايز تشتغل في شركات المقاولات

جاهز تبدأ؟ 🚀`;
            },

            getRevitCourseDetails: () => {
                return `🏗️ **كورس Revit Architecture - BIM الاحترافي**

💰 **السعر:** 3,500 جنيه
⏱️ **المدة:** 4 شهور
🎖️ **شهادة:** Autodesk Certified User

📚 **المنهج الشامل:**

**Level 1: BIM Basics**
• مقدمة في BIM
• واجهة Revit
• Walls, Floors, Roofs
• Doors & Windows

**Level 2: Advanced Modeling**
• Stairs & Railings
• Families Creation
• Schedules & Tags
• Rendering

**Level 3: Documentation**
• Sheets & Views
• Dimensions & Annotations
• Details & Callouts

**Level 4: Real Projects**
• مشروع فيلا سكنية
• مشروع عمارة
• Teamwork & Worksharing

🎁 **مع الكورس:**
✅ 25+ ساعة فيديو
✅ 100+ Revit Family
✅ Project Templates
✅ مكتبة Materials
✅ امتحانات Autodesk

👨‍🏫 **المدربة:** م. سارة أحمد
   • BIM Manager
   • Autodesk Expert Elite
   • مشاريع دولية

💼 **فرص العمل بعد الكورس:**
• BIM Modeler
• Revit Technician
• BIM Coordinator
• Freelancing

مستعد تدخل عالم BIM؟ 🎯`;
            },

            getCoursesPricing: () => {
                return `💰 **أسعار الكورسات - عروض خاصة!**

📚 **الكورسات الفردية:**
1. AutoCAD: 2,500 ج (بدلاً من 3,500)
2. Civil 3D: 3,000 ج (بدلاً من 4,000)
3. Revit: 3,500 ج (بدلاً من 4,500)
4. GIS: 2,800 ج
5. Total Station: 2,000 ج

🎁 **الباقات (وفر أكثر!):**

**📦 باقة المهندس المعماري**
AutoCAD + Revit = 5,500 ج فقط!
(وفر 1,500 جنيه)

**📦 باقة المهندس المدني**
AutoCAD + Civil 3D = 5,000 ج فقط!
(وفر 1,500 جنيه)

**📦 الباقة الشاملة**
جميع الكورسات = 12,000 ج فقط!
(وفر 4,300 جنيه)

💳 **تسهيلات الدفع:**
• خصم 10% للدفع النقدي
• تقسيط على 3 شهور بدون فوائد
• خصم 15% للمجموعات (3+)
• خصم 20% للطلبة

🎓 **عرض خاص:** 
سجل في كورسين واحصل على الثالث بنصف السعر!

عايز تستفيد من العروض دي؟ 🎉`;
            },

            getEquipmentPricing: () => {
                return `🛠️ **أسعار إيجار الأجهزة - أفضل العروض!**

📡 **Total Stations:**

**Premium Devices:**
• Leica TS16: 1,200 ج/يوم | 30,000 ج/شهر
• Trimble S9: 1,000 ج/يوم | 25,000 ج/شهر

**Standard Devices:**
• Topcon ES-105: 700 ج/يوم | 18,000 ج/شهر
• Sokkia CX-105: 600 ج/يوم | 15,000 ج/شهر

🛰️ **GPS/GNSS:**
• Leica GS18: 1,500 ج/يوم | 35,000 ج/شهر
• Trimble R12: 1,300 ج/يوم | 32,000 ج/شهر
• Hi-Target V90+: 800 ج/يوم | 20,000 ج/شهر

📏 **أجهزة إضافية:**
• Laser Distance: 150 ج/يوم
• Digital Level: 300 ج/يوم
• Prism Set: 100 ج/يوم

🎁 **العروض الخاصة:**
✅ إيجار أسبوع = احصل على يوم مجاناً
✅ إيجار شهر = احصل على 3 أيام مجاناً
✅ باقة كاملة (جهاز + برنامج) خصم 15%

📦 **الإيجار يشمل:**
• توصيل مجاني داخل القاهرة
• تدريب مجاني على الاستخدام
• دعم فني طوال فترة الإيجار
• صيانة مجانية
• تأمين شامل ضد الأعطال

💡 **ملحوظة مهمة:**
نوفر خدمة إيجار + مهندس مدرب
(الجهاز + المهندس = 2,000 ج/يوم)

عايز تحجز دلوقتي؟ 📞`;
            },

            getTeamPricing: () => {
                return `👷 **أسعار الفرق المساحية - خدمة متكاملة**

**🔹 الفريق الأساسي (2-3 أفراد):**
• مهندس + فني + عامل
• 3,500 ج/يوم
• مناسب للمشاريع الصغيرة

**🔹 الفريق المتوسط (4-5 أفراد):**
• 2 مهندس + 2 فني + عامل
• 6,000 ج/يوم
• مناسب للمشاريع المتوسطة

**🔹 الفريق الكامل (6+ أفراد):**
• 3 مهندس + 3 فني + 2 عامل
• 10,000 ج/يوم
• للمشاريع الكبيرة والمعقدة

📊 **الأسعار الشهرية (وفر أكثر!):**
• فريق أساسي: 80,000 ج/شهر
• فريق متوسط: 140,000 ج/شهر
• فريق كامل: 230,000 ج/شهر

🎁 **العرض يشمل:**
✅ جميع الأجهزة والمعدات
✅ البرامج المساحية
✅ المواصلات داخل المحافظة
✅ تأمين شامل
✅ إشراف هندسي
✅ تسليم الرسومات النهائية

💼 **خدمات إضافية:**
• Drone Survey: +2,000 ج/يوم
• 3D Scanning: +3,000 ج/يوم
• تحليل البيانات: حسب المشروع

📍 **نغطي جميع المحافظات!**
(قد تضاف تكاليف انتقال للمحافظات البعيدة)

محتاج تبدأ مشروعك؟ 🚀`;
            },

            getProjectsInfo: () => {
                return `🏗️ **مشاريعنا ونطاق عملنا**

✨ **أنواع المشاريع اللي نقدر نخدمك فيها:**

**1️⃣ مشاريع حكومية:**
• المحطة النووية بالضبعة
• قلعة صلاح الدين الأيوبي
• العاصمة الإدارية الجديدة
• محور المحمودية

**2️⃣ مشاريع سكنية:**
• مخططات الأراضي
• التسجيل العقاري
• المساحة القانونية
• رفع مساحي للفلل والعمارات

**3️⃣ مشاريع الطرق:**
• الطرق السريعة
• الكباري والأنفاق
• شبكات الصرف
• الأرصفة

**4️⃣ مشاريع صناعية:**
• المصانع والورش
• خطوط الإنتاج
• المستودعات
• المناطق اللوجستية

📊 **الخدمات المساحية المتاحة:**
✅ المساحة الأرضية بالـ Total Station
✅ المساحة الجوية بالـ Drone
✅ GPS/GNSS Surveys
✅ 3D Laser Scanning
✅ Bathymetric Surveys
✅ Topographic Surveys
✅ As-Built Drawings

💼 **نموذج العمل:**
1. زيارة الموقع + معاينة
2. عرض سعر مفصل
3. التعاقد وبدء العمل
4. تسليم تقارير وخرائط رقمية
5. متابعة ما بعد التسليم

📞 **عايز تبدأ مشروع؟**
احكيلي عن المشروع بتاعك وهساعدك! 🎯`;
            },

            getJobsInfo: () => {
                return `💼 **فرص العمل في ECS**

نحن دائماً نبحث عن المواهب! 🌟

**الوظائف المتاحة حالياً:**

**1️⃣ مهندس مساحة (خبرة 2-5 سنوات)**
• الراتب: 8,000 - 12,000 ج
• المؤهلات: هندسة مدنية/مساحة
• الخبرة: Total Station, GPS

**2️⃣ مدرب AutoCAD/Civil 3D**
• الراتب: 10,000 - 15,000 ج
• المؤهلات: خبرة تدريس
• Autodesk Certified فضلاً

**3️⃣ فني مساحة**
• الراتب: 4,000 - 6,000 ج
• الخبرة: سنة على الأقل
• استعداد للسفر

**4️⃣ BIM Specialist**
• الراتب: 12,000 - 18,000 ج
• الخبرة: Revit, Navisworks
• مشاريع BIM سابقة

**5️⃣ مبيعات تقنية**
• الراتب: 6,000 + عمولة
• مهارات تواصل ممتازة
• خلفية هندسية

📋 **المميزات:**
✅ تأمينات اجتماعية
✅ بدل مواصلات
✅ حوافز شهرية
✅ كورسات مجانية
✅ بيئة عمل احترافية
✅ فرص ترقي واضحة

📧 **للتقديم:**
أرسل CV على:
careers@ecs-egypt.com

أو اتصل: ${this.whatsappNumber}

عندك الخبرة؟ قدم دلوقتي! 🚀`;
            },

            getCompanyInfo: () => {
                return `🏢 **نبذة عن ECS**

**Egyptian Company for Contracting & Surveying**
الشركة المصرية للمقاولات والمساحة

📅 **تأسست:** 2015
👥 **الفريق:** 50+ مهندس وفني
🏆 **المشاريع:** 500+ مشروع ناجح
⭐ **التقييم:** 4.9/5

**🎯 رؤيتنا:**
أن نكون الشركة الرائدة في مجال المساحة والتكنولوجيا الهندسية في مصر والشرق الأوسط.

**💡 رسالتنا:**
تقديم حلول مساحية وهندسية متكاملة بأعلى معايير الجودة والدقة باستخدام أحدث التقنيات العالمية.

**✨ قيمنا:**
• الدقة والجودة
• الالتزام بالمواعيد
• الابتكار والتطوير
• رضا العملاء
• التدريب المستمر

**🏅 إنجازاتنا:**
✅ شريك معتمد لـ Autodesk
✅ وكيل Leica في مصر
✅ 15,000+ طالب مدرب
✅ عضو في نقابة المساحين
✅ ISO 9001 معتمدون

**📍 فروعنا:**
• المقر الرئيسي: القاهرة
• فرع الإسكندرية
• فرع المنصورة
• فرع أسيوط

**📞 تواصل معانا:**
📱 واتساب: ${this.whatsappNumber}
📧 info@ecs-egypt.com
🌐 www.ecs-egypt.com

فخورين نخدمك! 🌟`;
            }
        };
    }

    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    toArabicNumber(num) {
        const arabicNumbers = ['', 'الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة'];
        return arabicNumbers[num] || `الـ${num}`;
    }

    getSmartFallback(message) {
        // تحليل ذكي للرسالة
        const suggestions = [];
        
        if (message.includes('؟') || message.includes('?')) {
            suggestions.push('سؤالك مش واضح تماماً. ممكن توضح أكتر؟');
        }
        
        const responses = [
            `آسف، مش فاهم سؤالك كويس 😅

ممكن تعيد صياغة السؤال؟ أو جرب تسألني عن:
• الكورسات المتاحة 📚
• أسعار الأجهزة 🛠️
• حجز فريق مساحي 👷
• المشاريع السابقة 🏗️
• فرص العمل 💼

أو اكتب "مساعدة" لمعرفة كل اللي أقدر أساعدك فيه!`,

            `مش متأكد إني فهمتك صح 🤔

تقدر تسأل بطريقة تانية؟
مثلاً:
• "عايز أعرف عن كورس AutoCAD"
• "كام سعر إيجار Total Station"
• "محتاج فريق مساحي"

أنا هنا عشان أساعدك! 😊`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    init() {
        this.createChatInterface();
        this.attachEventListeners();
        this.addInitialMessage();
    }

    createChatInterface() {
        const chatHTML = `
            <button class="chatbot-toggle" id="chatbotToggle">
                <i class="fas fa-comments"></i>
                <span class="chat-badge">1</span>
            </button>
            
            <div class="chatbot-container" id="chatbotContainer">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="bot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div>
                            <h3>ECS Smart Assistant</h3>
                            <span class="online-status">
                                <span class="status-dot"></span>
                                متاح الآن - يرد فوراً
                            </span>
                        </div>
                    </div>
                    <button class="chat-close" id="chatClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chat-messages" id="chatMessages"></div>
                
                <div class="chat-suggestions" id="chatSuggestions">
                    <button class="suggestion-btn" data-msg="عايز أعرف عن الكورسات">
                        📚 الكورسات
                    </button>
                    <button class="suggestion-btn" data-msg="كام أسعار الأجهزة؟">
                        💰 الأسعار
                    </button>
                    <button class="suggestion-btn" data-msg="عايز أحجز فريق">
                        👷 حجز فريق
                    </button>
                    <button class="suggestion-btn" data-msg="فيه وظائف متاحة؟">
                        💼 وظائف
                    </button>
                </div>
                
                <div class="chat-input-container">
                    <button class="attach-btn" title="إرسال ملف">
                        <i class="fas fa-paperclip"></i>
                    </button>
                    <input type="text" 
                           class="chat-input" 
                           id="chatInput" 
                           placeholder="اكتب رسالتك هنا..."
                           autocomplete="off">
                    <button class="send-btn" id="sendBtn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                
                <div class="chat-footer">
                    <button class="whatsapp-btn" onclick="window.open('https://wa.me/${this.whatsappNumber}', '_blank')">
                        <i class="fab fa-whatsapp"></i>
                        تواصل عبر واتساب
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    attachEventListeners() {
        const toggle = document.getElementById('chatbotToggle');
        const close = document.getElementById('chatClose');
        const sendBtn = document.getElementById('sendBtn');
        const input = document.getElementById('chatInput');
        const container = document.getElementById('chatbotContainer');

        toggle.addEventListener('click', () => {
            container.classList.toggle('active');
            toggle.classList.toggle('active');
            document.querySelector('.chat-badge').style.display = 'none';
            if (container.classList.contains('active')) {
                input.focus();
            }
        });

        close.addEventListener('click', () => {
            container.classList.remove('active');
            toggle.classList.remove('active');
        });

        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-msg');
                document.getElementById('chatInput').value = message;
                this.sendMessage();
            });
        });
    }

    addInitialMessage() {
        setTimeout(() => {
            this.addBotMessage(this.responses.smartGreetings());
        }, 500);
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        this.addUserMessage(message);
        input.value = '';

        this.conversationHistory.push({ role: 'user', message });

        setTimeout(() => {
            const response = this.responses.intelligentResponse(message);
            this.addBotMessage(response);
            this.conversationHistory.push({ role: 'bot', message: response });
        }, 800);
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageHTML = `
            <div class="message user-message">
                <div class="message-content">${this.escapeHtml(message)}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        
        // Show typing indicator
        const typingHTML = `
            <div class="message bot-message typing-indicator" id="typing">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();

        setTimeout(() => {
            document.getElementById('typing')?.remove();
            
            const messageHTML = `
                <div class="message bot-message">
                    <div class="message-content">${this.formatMessage(message)}</div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            `;
            messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
            this.scrollToBottom();
        }, 1000);
    }

    formatMessage(message) {
        // Format markdown-style messages
        message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        message = message.replace(/\n/g, '<br>');
        return message;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ECSSmartChatbot();
});

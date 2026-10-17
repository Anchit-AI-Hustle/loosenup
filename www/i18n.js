/* LoosenUp Hindi (हिन्दी) translations.
   English is the source language. tr() maps a rendered English string to Hindi:
   exact match first, then sentence patterns with numbers and names, then lists
   and sentence by sentence. Brand words (LoosenUp, Seeds, Calm gain, Sunny days,
   Full Bloom, Golden hour, Sunbeam, levels and technique names) stay in English. */
(function () {
  'use strict';

  var HI = {
    /* ---- Core words ---- */
    'Back': 'वापस', 'Next': 'आगे', 'Close': 'बंद करें', 'Save': 'सेव करें', 'Edit': 'बदलें', 'Begin': 'शुरू करें',
    'Pause': 'रुकें', 'Resume': 'फिर शुरू करें', 'Stop': 'रोकें', 'Done': 'पूरा हुआ', 'Finish': 'पूरा करें', 'Unlock': 'खोलें',
    'Free': 'मुफ़्त', 'Always free': 'हमेशा मुफ़्त', 'Off': 'बंद', 'on': 'चालू', 'off': 'बंद', 'None': 'कोई नहीं', 'or': 'या',
    'left': 'बाकी', 'Name': 'नाम', 'Phone': 'फ़ोन', 'Email': 'ईमेल', 'Role': 'भूमिका', 'Call': 'कॉल करें',
    'Today': 'आज', 'Play': 'खेलें', 'Garden': 'बगीचा', 'Week': 'हफ़्ता', 'Me': 'मैं', 'Learn': 'सीखें',
    'Level': 'स्तर', 'Level progress': 'स्तर की प्रगति', 'Breaks': 'ब्रेक', 'Break': 'ब्रेक', 'Badges': 'बैज',
    'Read': 'पढ़ लिया', 'Swipe': 'स्वाइप', 'Popular': 'लोकप्रिय', 'Best value': 'सबसे किफ़ायती', 'Subscription': 'सदस्यता',
    'Skip to content': 'सीधे मुख्य भाग पर जाएँ', 'Main': 'मुख्य', 'Saved.': 'सेव हो गया।', 'Restored.': 'वापस आ गया।',
    'Welcome back': 'फिर से स्वागत है', 'Welcome back.': 'फिर से स्वागत है।', 'Okay': 'ठीक', 'Emergency': 'आपातकाल',
    'Govt. of India': 'भारत सरकार', 'Doctor': 'डॉक्टर', 'Therapist': 'थेरेपिस्ट', 'Counsellor': 'काउंसलर',
    'Psychiatrist': 'मनोचिकित्सक', 'Psychologist': 'मनोवैज्ञानिक', 'Clinical psychologist': 'क्लिनिकल मनोवैज्ञानिक',
    'Counsellor or psychotherapist': 'काउंसलर या साइकोथेरेपिस्ट', 'Low-cost hospital OPD': 'कम खर्च वाली अस्पताल OPD',
    'Outside India:': 'भारत के बाहर:', 'For you,': 'आपके लिए,', 'You have': 'आपके पास', 'a head start': 'एक अच्छी शुरुआत',
    'for guided breaks': 'गाइडेड ब्रेक के लिए', 'Full Bloom, monthly': 'Full Bloom, मासिक',
    'Sun': 'रवि', 'Mon': 'सोम', 'Tue': 'मंगल', 'Wed': 'बुध', 'Thu': 'गुरु', 'Fri': 'शुक्र', 'Sat': 'शनि',
    'Mornings': 'सुबह', 'Afternoons': 'दोपहर', 'Evenings': 'शाम', 'Quiet nights': 'शांत रातें',

    /* ---- Welcome, gift, check-in ---- */
    'Welcome. Take a breath.': 'स्वागत है। एक साँस लें।',
    'Two calm minutes to loosen up and feel lighter. Ease a tense workday, soften a heavy mood, and watch your Calm gain grow into a garden.':
      'ढीला होने और हल्का महसूस करने के लिए दो शांत मिनट। खिंचे हुए कामकाजी दिन को आसान बनाएँ, भारी मूड को नरम करें, और अपने Calm gain को बगीचे में बदलते देखें।',
    'What should we call you?': 'हम आपको क्या कहकर बुलाएँ?', 'Your first name': 'आपका पहला नाम',
    "Let's begin": 'चलिए शुरू करें', 'A welcome gift': 'स्वागत का तोहफ़ा', 'Start my first break': 'मेरा पहला ब्रेक शुरू करें',
    'Seeds. Each guided break plants 1 Seed.': 'Seeds। हर गाइडेड ब्रेक 1 Seed लगाता है।',
    'Made on your device, works offline': 'आपके डिवाइस पर बना, बिना इंटरनेट चलता है',
    'Everything stays on this device.': 'सब कुछ इसी डिवाइस पर रहता है।',
    'A wellbeing companion, not medical care.': 'मन की भलाई का साथी, चिकित्सा देखभाल नहीं।',
    'LoosenUp is a wellbeing companion, not medical care.': 'LoosenUp मन की भलाई का साथी है, चिकित्सा देखभाल नहीं।',
    'LoosenUp is a wellbeing companion, not medical care. Nothing you write in Let it out is ever saved.':
      'LoosenUp मन की भलाई का साथी है, चिकित्सा देखभाल नहीं। Let it out में आप जो भी लिखते हैं, वह कभी सेव नहीं होता।',
    'Daily check-in': 'रोज़ का हाल', 'What is going on?': 'क्या चल रहा है?', 'Caught a Sunbeam surprise': 'एक Sunbeam सरप्राइज़ मिला', 'What are you carrying?': 'आप मन में क्या लिए हुए हैं?',
    'Pick all that apply, from any space.': 'जो भी लागू हों, सब चुनें, किसी भी स्पेस से।',
    'Picked feelings': 'चुनी गई भावनाएँ', 'Spaces': 'स्पेस',
    'How calm do you feel right now?': 'इस पल आप कितना शांत महसूस करते हैं?',
    'How calm do you feel now?': 'अब आप कितना शांत महसूस करते हैं?',
    'Calm right now, 1 to 10': 'इस पल कितना शांत, 1 से 10', 'Calm now, 1 to 10': 'अब कितना शांत, 1 से 10',
    'A bit tangled': 'थोड़ा उलझा', 'A little tense': 'थोड़ा खिंचा', 'Somewhere in the middle': 'बीच में कहीं',
    'Fairly settled': 'काफ़ी सहज', 'Fairly calm': 'काफ़ी शांत', 'Calm': 'शांत', 'Very calm': 'बहुत शांत', 'Wonderfully calm': 'बेहद शांत',

    /* ---- Spaces and feelings ---- */
    'Everyday': 'रोज़मर्रा', 'Work': 'काम', 'Relationships': 'रिश्ते', 'Low days': 'उदास दिन', 'Sleep': 'नींद',
    'Busy mind': 'मन में बहुत कुछ', 'Tight shoulders': 'जकड़े कंधे', 'Big moment ahead': 'आगे कोई बड़ा पल',
    'Hard to focus': 'ध्यान लगाना मुश्किल', 'Just a quick lift': 'बस एक छोटी सी राहत', 'Work pile-up': 'काम का ढेर',
    'Before a meeting': 'मीटिंग से पहले', 'After a tough call': 'मुश्किल कॉल के बाद', 'Hard to switch off': 'मन बंद नहीं होता',
    'Tense with someone': 'किसी से खिंचाव', 'After a disagreement': 'अनबन के बाद', 'Before a hard talk': 'मुश्किल बात से पहले',
    'Feeling disconnected': 'अकेलापन सा', 'Feeling low': 'मन उदास', 'Low energy': 'कम ऊर्जा', 'Hard on myself': 'खुद पर सख़्ती',
    'Winding down': 'दिन का अंत', 'Mind racing at night': 'रात को दौड़ता मन',
    'Meetings, pile-ups, tough calls': 'मीटिंग, काम का ढेर, मुश्किल कॉल', 'When things feel tense': 'जब माहौल खिंचा हुआ लगे',
    'Gentle lifts for heavy days': 'भारी दिनों के लिए हल्की राहत', 'Wind down, quiet a racing mind': 'धीमे हों, दौड़ते मन को शांत करें',
    'Open the Work space': 'काम वाला स्पेस खोलें',

    /* ---- Pick and session ---- */
    'Your break for right now': 'इस पल के लिए आपका ब्रेक', 'Why this one': 'यह क्यों', 'Or choose another': 'या कोई और चुनें',
    'Another idea': 'कोई और सुझाव', 'Begin (Full Bloom)': 'शुरू करें (Full Bloom)', 'Begin (add Seeds)': 'शुरू करें (Seeds जोड़ें)',
    'Quick breeze instead, 60s, always free': 'इसकी जगह Quick breeze, 60 सेकंड, हमेशा मुफ़्त',
    'Quick breeze · 60s, always free': 'Quick breeze · 60 सेकंड, हमेशा मुफ़्त',
    'All your Seeds are planted. Add a few more, or take a free Quick breeze.': 'आपके सारे Seeds लग चुके हैं। कुछ और जोड़ें, या मुफ़्त Quick breeze लें।',
    'Guided break': 'गाइडेड ब्रेक', 'Finish early': 'जल्दी पूरा करें', 'Voice on': 'आवाज़ चालू', 'Voice off': 'आवाज़ बंद',
    'Voice is on': 'आवाज़ चालू है', 'Voice is off': 'आवाज़ बंद है', 'Audio guide': 'ऑडियो गाइड', 'Voice guide': 'आवाज़ गाइड',
    'Voice': 'आवाज़', 'Chimes': 'घंटी', 'Background sound': 'पीछे की आवाज़', 'Rain': 'बारिश', 'Ocean': 'समुद्र',
    'Your device voice can read the breathing cues.': 'आपके डिवाइस की आवाज़ साँसों के संकेत पढ़ सकती है।',
    'Voice guide on.': 'आवाज़ गाइड चालू है।',
    'Voice guide is not available on this device, the on-screen cues will guide you.': 'इस डिवाइस पर आवाज़ गाइड उपलब्ध नहीं है, स्क्रीन पर दिखते संकेत आपका साथ देंगे।',
    'Breathe in': 'साँस लें', 'Breathe out': 'साँस छोड़ें', 'A little more': 'थोड़ा और', 'Long breath out': 'लंबी साँस छोड़ें',
    'Hold gently': 'धीरे से रोकें', 'Rest': 'आराम', 'Breathing in...': 'साँस ले रहे हैं...',
    'Let it out here...': 'यहाँ मन की बात लिखें...',
    'Type whatever is on your mind. It is never saved, and it clears when you finish.': 'मन में जो भी है लिख दें। यह कभी सेव नहीं होता, और पूरा होने पर मिट जाता है।',
    'Let us begin. Sit comfortably, let your shoulders drop, and follow the sun as it opens and closes.':
      'चलिए शुरू करें। आराम से बैठें, कंधे ढीले छोड़ दें, और सूरज के खुलने और सिमटने के साथ चलें।',
    'Let us begin. Take your time with each step. There is no rush.': 'चलिए शुरू करें। हर कदम पर अपना समय लें। कोई जल्दी नहीं है।',
    'Let us begin. Type whatever is on your mind. Nothing is saved.': 'चलिए शुरू करें। मन में जो भी है लिख दें। कुछ भी सेव नहीं होता।',
    'Lovely. Take a moment to notice how you feel now.': 'बहुत बढ़िया। एक पल रुककर देखें कि अब आप कैसा महसूस करते हैं।',

    /* ---- Techniques ---- */
    'Two easy breaths in through the nose, then one long, slow breath out.': 'नाक से दो आसान साँसें लें, फिर एक लंबी, धीमी साँस छोड़ें।',
    'Soft, even breathing. In for five, out for five, like a slow breeze.': 'कोमल, एक जैसी साँसें। पाँच तक लें, पाँच तक छोड़ें, धीमी हवा की तरह।',
    'Gently notice the world around you, one sense at a time.': 'धीरे से अपने आसपास की दुनिया को महसूस करें, एक बार में एक इंद्रिय।',
    'Look around and name 5 things you can see.': 'चारों ओर देखें और 5 चीज़ों के नाम लें जो आपको दिख रही हैं।',
    'Notice 4 things you can feel, like your feet or your sleeves.': '4 चीज़ें महसूस करें, जैसे अपने पैर या अपनी आस्तीनें।',
    'Listen for 3 sounds, near or far.': '3 आवाज़ें सुनें, पास की या दूर की।',
    'Find 2 things you can smell, or 2 favourite scents.': '2 चीज़ें खोजें जिनकी खुशबू आ रही हो, या 2 पसंदीदा खुशबुएँ याद करें।',
    'Notice 1 taste, or take a sip of water.': '1 स्वाद पर ध्यान दें, या पानी का एक घूँट लें।',
    'Tense each area for a breath, then let it go soft, from shoulders to toes.': 'कंधों से पैरों की उँगलियों तक, हर हिस्से को एक साँस तक कसें, फिर ढीला छोड़ दें।',
    'Lift your shoulders up to your ears. Hold. Let them drop.': 'कंधों को कानों तक उठाएँ। रोकें। फिर नीचे गिरने दें।',
    'Make two fists. Squeeze. Open your hands wide and soft.': 'दोनों मुट्ठियाँ बाँधें। कसें। हाथ खोलकर चौड़े और ढीले करें।',
    'Scrunch your face. Then let your jaw hang loose.': 'चेहरा सिकोड़ें। फिर जबड़े को ढीला लटकने दें।',
    'Press your feet into the floor. Then let them rest.': 'पैरों को ज़मीन पर दबाएँ। फिर उन्हें आराम करने दें।',
    'Take one long breath and feel your whole body settle.': 'एक लंबी साँस लें और पूरे शरीर को शांत होते महसूस करें।',
    'Two minutes to type whatever is on your mind. Nothing is saved.': 'मन में जो भी है, लिखने के लिए दो मिनट। कुछ भी सेव नहीं होता।',
    'A gentle self-compassion break for when your inner voice feels harsh.': 'जब भीतर की आवाज़ कठोर लगे, तब खुद पर दया का एक कोमल ब्रेक।',
    'Place a hand on your heart or your cheek. Feel its warmth.': 'एक हाथ दिल या गाल पर रखें। उसकी गरमाहट महसूस करें।',
    'Name it softly: this is a hard moment.': 'धीरे से कहें: यह एक मुश्किल पल है।',
    'Remember: everyone has hard moments. You are not alone in this.': 'याद रखें: मुश्किल पल सबके आते हैं। इसमें आप अकेले नहीं हैं।',
    'Say to yourself: may I be kind to myself right now.': 'खुद से कहें: इस पल मैं खुद के प्रति दयालु रहूँ।',
    'Ask: what would I say to a dear friend who felt this way? Say it to you.': 'पूछें: अगर कोई प्यारा दोस्त ऐसा महसूस करता, तो मैं उससे क्या कहता या कहती? वही खुद से कहें।',
    'Release the workday from your body without leaving your chair.': 'कुर्सी छोड़े बिना, शरीर से काम के दिन को हल्का करें।',
    'Roll your shoulders back slowly, five times.': 'कंधों को धीरे से पाँच बार पीछे की ओर घुमाएँ।',
    'Tilt one ear toward your shoulder, then the other.': 'एक कान को कंधे की ओर झुकाएँ, फिर दूसरा।',
    'Press your palms together for a breath, then let them go soft.': 'एक साँस तक हथेलियों को आपस में दबाएँ, फिर ढीला छोड़ दें।',
    'Look at something far away for twenty seconds.': 'बीस सेकंड तक किसी दूर की चीज़ को देखें।',
    'Sit tall, feet flat, and take one long breath out.': 'सीधे बैठें, पैर ज़मीन पर टिकाएँ, और एक लंबी साँस छोड़ें।',
    'Box breathing: in for four, hold for four, out for four, rest for four.': 'बॉक्स ब्रीदिंग: चार तक साँस लें, चार तक रोकें, चार तक छोड़ें, चार तक आराम।',
    'A few calm steps so you can answer from care, not from heat.': 'कुछ शांत कदम, ताकि आप गुस्से से नहीं, परवाह से जवाब दे सकें।',
    'Take one slow breath before you say anything.': 'कुछ भी कहने से पहले एक धीमी साँस लें।',
    'Name the feeling in one word.': 'भावना को एक शब्द में नाम दें।',
    'Ask yourself: what do I need right now?': 'खुद से पूछें: इस पल मुझे क्या चाहिए?',
    'Ask: what might they be feeling?': 'पूछें: वे क्या महसूस कर रहे होंगे?',
    'Choose one kind, honest sentence to begin with.': 'शुरुआत के लिए एक नरम, सच्चा वाक्य चुनें।',
    'Long breaths out that help your body settle after a disagreement.': 'लंबी साँसें छोड़ना, जो अनबन के बाद शरीर को शांत होने में मदद करती हैं।',
    'Send kind wishes to someone you love, someone you feel tense with, and yourself.': 'किसी अपने को, जिससे खिंचाव है उसे, और खुद को शुभकामनाएँ भेजें।',
    'Picture someone you care about and smile at them in your mind.': 'किसी अपने की कल्पना करें और मन ही मन उन्हें देखकर मुस्कुराएँ।',
    'Wish them: may you feel safe and at ease.': 'उन्हें दुआ दें: तुम सुरक्षित और सहज रहो।',
    'Now picture the person you feel tense with.': 'अब उस व्यक्ति की कल्पना करें जिससे आपको खिंचाव महसूस होता है।',
    'Wish them: may you find some ease too.': 'उन्हें दुआ दें: तुम्हें भी कुछ सुकून मिले।',
    'Wish yourself the same: may I feel at ease.': 'खुद को भी यही दुआ दें: मुझे सुकून मिले।',
    'Sixty seconds of slow, easy breathing. Always free.': 'साठ सेकंड की धीमी, आसान साँसें। हमेशा मुफ़्त।',

    /* ---- Why this one ---- */
    'Putting thoughts into words can make a busy mind feel roomier.': 'विचारों को शब्दों में लिखने से भरे हुए मन में जगह बन सकती है।',
    'Noticing what is around you gently brings a busy mind back to now.': 'आसपास की चीज़ों पर ध्यान देना भागते मन को धीरे से इस पल में लौटा लाता है।',
    'Tensing and softening helps shoulders let go.': 'कसना और ढीला छोड़ना कंधों को हल्का करता है।',
    'A long breath out is a quick way to soften tight shoulders.': 'लंबी साँस छोड़ना जकड़े कंधों को नरम करने का एक जल्दी तरीका है।',
    'A couple of long breaths out can help you feel steady before a big moment.': 'किसी बड़े पल से पहले दो लंबी साँसें छोड़ना आपको स्थिर महसूस करा सकता है।',
    'Slow, even breathing gives your attention a calm rhythm to follow.': 'धीमी, एक जैसी साँसें आपके ध्यान को एक शांत लय देती हैं।',
    'Letting each muscle go soft is a lovely way to wind down.': 'हर मांसपेशी को ढीला छोड़ना दिन खत्म करने का एक प्यारा तरीका है।',
    'Slow breathing is a gentle way to wind down.': 'धीमी साँसें दिन खत्म करने का एक कोमल तरीका हैं।',
    'A Sigh of relief is the quickest lift we know.': 'Sigh of relief हमारी जानी सबसे जल्दी राहत है।',
    'A steady square breath helps you take one thing at a time.': 'स्थिर चौकोर साँस आपको एक बार में एक काम करने में मदद करती है।',
    'Four calm counts in, hold, out and rest help you walk in steady.': 'चार शांत गिनती में साँस लेना, रोकना, छोड़ना और आराम, आपको स्थिर कदमों से अंदर जाने में मदद करते हैं।',
    'A quick desk reset helps your body let go of the last call.': 'एक छोटा Desk reset पिछली कॉल का बोझ शरीर से उतारने में मदद करता है।',
    'Softening each muscle tells your body the workday is done.': 'हर मांसपेशी को ढीला करना शरीर को बताता है कि काम का दिन पूरा हुआ।',
    'Slow breathing helps you move from work mode to you mode.': 'धीमी साँसें आपको काम के मूड से अपने मूड में लाने में मदद करती हैं।',
    'A pause before replying helps you answer from calm.': 'जवाब से पहले का ठहराव आपको शांति से जवाब देने में मदद करता है।',
    'Long breaths out help your body settle after a disagreement.': 'लंबी साँसें छोड़ना अनबन के बाद शरीर को शांत होने में मदद करता है।',
    'Steady breaths help you begin a hard talk feeling grounded.': 'स्थिर साँसें मुश्किल बातचीत को ज़मीन से जुड़े मन से शुरू करने में मदद करती हैं।',
    'Sending warm wishes can help you feel closer to the people you care about.': 'शुभकामनाएँ भेजना आपको अपनों के और करीब महसूस करा सकता है।',
    'Kind words to yourself can soften a heavy day.': 'खुद से कहे प्यारे शब्द भारी दिन को नरम कर सकते हैं।',
    'Gently noticing the world around you can bring a small lift.': 'आसपास की दुनिया पर धीरे से ध्यान देना थोड़ी राहत ला सकता है।',
    'Speak to yourself the way you would speak to a dear friend.': 'खुद से वैसे बात करें जैसे किसी प्यारे दोस्त से करते हैं।',
    'Putting thoughts on the page can help a racing mind settle.': 'विचारों को लिख देना दौड़ते मन को शांत करने में मदद कर सकता है।',
    'Softening the body can help a racing mind slow down.': 'शरीर को ढीला करना दौड़ते मन को धीमा करने में मदद कर सकता है।',
    'Slow breathing helps a racing mind ease toward sleep.': 'धीमी साँसें दौड़ते मन को धीरे से नींद की ओर ले जाती हैं।',
    'Demo only, nothing is charged.': 'सिर्फ़ डेमो, कोई पैसा नहीं लिया जाता।',

    /* ---- After and result ---- */
    'How heavy does it feel right now?': 'इस पल यह कितना भारी लगता है?', 'How heavy does it feel now?': 'अब यह कितना भारी लगता है?',
    'How heavy it feels, 1 to 10': 'कितना भारी, 1 से 10', 'How heavy it feels now, 1 to 10': 'अब कितना भारी, 1 से 10',
    'See my result': 'मेरा नतीजा देखें', 'See my Calm gain': 'मेरा Calm gain देखें',
    'You showed up, and that counts.': 'आपने अपने लिए समय निकाला, और यही मायने रखता है।',
    'You made time for yourself today, and that is what matters most.': 'आज आपने अपने लिए समय निकाला, और यही सबसे ज़रूरी है।',
    'You showed up: +1 Seed': 'आपने समय निकाला: +1 Seed', 'Milestone badge earned.': 'पड़ाव का बैज मिला।',
    'A Sunbeam surprise!': 'एक Sunbeam सरप्राइज़!', '+5 bonus XP': '+5 बोनस XP',
    'A Rain day kept your Sunny days going.': 'एक Rain day ने आपके Sunny days जारी रखे।',
    'A fresh run of Sunny days starts today.': 'आज से Sunny days की एक नई लड़ी शुरू होती है।',
    'Two minutes for you is never small.': 'आपके लिए दो मिनट कभी छोटे नहीं होते।',
    'Your calm is a skill, and you just practised it.': 'आपकी शांति एक हुनर है, और आपने अभी उसका अभ्यास किया।',
    'However today goes, you made a little room for yourself.': 'आज का दिन जैसा भी जाए, आपने अपने लिए थोड़ी जगह बनाई।',
    'Small breaks, bright days.': 'छोटे ब्रेक, उजले दिन।', 'You gave your mind a soft place to land.': 'आपने अपने मन को टिकने के लिए एक नरम जगह दी।',
    'Every break plants something good.': 'हर ब्रेक कुछ अच्छा बोता है।', 'Keep my garden': 'मेरा बगीचा रखें',
    'Back to Today': 'आज पर वापस', 'Take this with you': 'इसे साथ ले जाएँ',

    /* ---- Today ---- */
    'Start a calm break': 'एक शांत ब्रेक शुरू करें', 'Take a Quick breeze': 'एक Quick breeze लें',
    'Two calm minutes': 'दो शांत मिनट', 'Two calm minutes, whenever you like.': 'दो शांत मिनट, जब भी आप चाहें।',
    'Two calm minutes are here for you whenever you like.': 'दो शांत मिनट हमेशा आपके लिए हैं, जब भी आप चाहें।',
    'Mood today': 'आज का मूड', 'How are you feeling?': 'आप कैसा महसूस कर रहे हैं?',
    'Heavy': 'भारी', 'Very heavy': 'बहुत भारी', 'Light': 'हल्का', 'Bright': 'उजला',
    'Thank you for telling us.': 'हमें बताने के लिए धन्यवाद।',
    'Heavy days happen. Kind words or a Small step can help a little.': 'भारी दिन आते हैं। Kind words या एक छोटा कदम थोड़ी मदद कर सकता है।',
    'Okay is okay. A Small step could add a little lift.': 'ठीक होना भी ठीक है। एक छोटा कदम थोड़ी राहत दे सकता है।',
    'Light today. A calm break can keep the good going.': 'आज मन हल्का है। एक शांत ब्रेक इस अच्छे पल को बनाए रख सकता है।',
    'Bright today. Lovely! Maybe share a Sunbeam and pass it on.': 'आज उजला दिन है। बहुत बढ़िया! चाहें तो एक Sunbeam शेयर करके आगे बढ़ाएँ।',
    'Thank you for being honest. Kind words or a Small step are here for you, and so is SOS.': 'सच बताने के लिए धन्यवाद। Kind words या एक छोटा कदम आपके लिए यहाँ है, और SOS भी।',
    'It has been a heavy few days. You do not have to carry it alone.': 'पिछले कुछ दिन भारी रहे हैं। आपको यह अकेले नहीं उठाना है।',
    'Talk to someone now': 'अभी किसी से बात करें', 'Try Kind words': 'Kind words आज़माएँ', 'Try one Small step': 'एक छोटा कदम आज़माएँ',
    'Check in with your mood each day and your trend will appear here as a coral line.': 'हर दिन अपना मूड दर्ज करें, और आपका रुझान यहाँ एक कोरल रेखा की तरह दिखेगा।',
    'Little lifts': 'छोटी राहतें', 'Small step': 'छोटा कदम', 'Take a Small step': 'एक छोटा कदम उठाएँ',
    'Good things jar': 'अच्छी बातों का जार', 'Add a good thing': 'एक अच्छी बात जोड़ें', 'A good thing from today': 'आज की एक अच्छी बात',
    'Something that felt good today...': 'आज कुछ जो अच्छा लगा...', 'Save to my jar': 'मेरे जार में सेव करें',
    'It can be tiny: a warm cup, a kind word, a moment of sun.': 'यह छोटी सी भी हो सकती है: एक गरम प्याला, एक प्यारा शब्द, धूप का एक पल।',
    "Your jar is ready. Today's first good thing can be tiny.": 'आपका जार तैयार है। आज की पहली अच्छी बात छोटी सी भी हो सकती है।',
    'Write a word or two first.': 'पहले एक दो शब्द लिखें।', 'Saved in your jar. +2 XP': 'आपके जार में सेव हो गया। +2 XP', 'Saved in your jar.': 'आपके जार में सेव हो गया।',
    'Tiny actions count. Each one plants a sprout in your garden.': 'छोटे काम भी गिने जाते हैं। हर एक आपके बगीचे में एक अंकुर लगाता है।',
    'Each one plants a sprout.': 'हर एक, एक अंकुर लगाता है।', 'I did it': 'मैंने कर लिया',
    'Lovely. A sprout joins your garden. +3 XP': 'बहुत बढ़िया। आपके बगीचे में एक अंकुर जुड़ गया। +3 XP',
    'Lovely. A sprout joins your garden.': 'बहुत बढ़िया। आपके बगीचे में एक अंकुर जुड़ गया।',
    'Step outside or by a window for two minutes of daylight.': 'दो मिनट की धूप के लिए बाहर या खिड़की के पास जाएँ।',
    'Drink a full glass of water, slowly.': 'धीरे धीरे एक पूरा गिलास पानी पिएँ।',
    'Stretch your arms up high, then let them float down.': 'बाँहों को ऊपर तक फैलाएँ, फिर धीरे से नीचे आने दें।',
    'Send a short hello to someone you trust.': 'किसी भरोसेमंद को एक छोटा सा नमस्ते भेजें।',
    'Tidy one small thing near you.': 'अपने पास की एक छोटी चीज़ सँवार दें।',
    'Play one song you love and let yourself enjoy it.': 'अपना पसंदीदा एक गाना चलाएँ और उसका मज़ा लें।',
    'Wash your face or hands with cool water.': 'ठंडे पानी से चेहरा या हाथ धोएँ।',
    'Eat something nourishing, even something small.': 'कुछ पौष्टिक खाएँ, चाहे थोड़ा सा ही।',
    'Open a window and take three easy breaths.': 'खिड़की खोलें और तीन आसान साँसें लें।',
    'Walk to the end of the street and back.': 'गली के आख़िर तक टहलकर वापस आएँ।',
    'Write one kind line to tomorrow you.': 'आने वाले कल के अपने लिए एक प्यारी पंक्ति लिखें।',
    'Change into something comfortable.': 'कुछ आरामदायक पहन लें।',
    'Give yourself a small smile in the mirror.': 'आईने में खुद को एक छोटी सी मुस्कान दें।',
    'Water a plant, or look at something green for a minute.': 'किसी पौधे को पानी दें, या एक मिनट किसी हरी चीज़ को देखें।',
    'Your toolkit': 'आपका टूलकिट', 'Find support': 'सहायता खोजें', 'Therapists, psychiatrists, helplines': 'थेरेपिस्ट, मनोचिकित्सक, हेल्पलाइन',
    'Safety plan': 'सुरक्षा योजना', 'Your steps for hard moments': 'मुश्किल पलों के लिए आपके कदम',
    'Reframe a thought': 'एक विचार को नए नज़रिए से देखें', 'Find a kinder, truer view': 'एक नरम, सच्चा नज़रिया खोजें',
    'Calm sounds': 'शांत आवाज़ें', 'Rain, ocean, sleep timer': 'बारिश, समुद्र, नींद टाइमर',
    'One-minute lessons': 'एक मिनट के पाठ', 'Wellbeing check': 'मन की जाँच', 'Track how you are really doing': 'देखें कि आप सच में कैसे हैं',
    'Two-week wellbeing check': 'दो हफ़्ते की मन की जाँच', 'Take the check': 'जाँच शुरू करें',
    'Two weeks of heavy days is a good reason to reach out.': 'दो हफ़्ते के भारी दिन, मदद माँगने का अच्छा कारण हैं।',
    'Your progress': 'आपकी प्रगति', 'Your first break': 'आपका पहला ब्रेक', 'Your first break will bloom here.': 'आपका पहला ब्रेक यहाँ खिलेगा।',
    'Your first flower is one break away': 'आपका पहला फूल बस एक ब्रेक दूर है', 'Starts today': 'आज से शुरू',
    'Your meadow is in full glow': 'आपका Meadow पूरी तरह चमक रहा है', 'Recent breaks': 'हाल के ब्रेक',
    "This week's Rain day is already watering your streak.": 'इस हफ़्ते का Rain day पहले से आपकी लड़ी को सींच रहा है।',
    'One Rain day is ready this week if you take a day off.': 'अगर आप एक दिन छुट्टी लें, तो इस हफ़्ते एक Rain day तैयार है।',
    'SOS: get support now': 'SOS: अभी मदद पाएँ', 'Open SOS and helplines': 'SOS और हेल्पलाइन खोलें',

    /* ---- Support sheet (SOS) ---- */
    'You are not alone. Help is here.': 'आप अकेले नहीं हैं। मदद यहाँ है।', 'We are here with you': 'हम आपके साथ हैं',
    'Trained people are ready to help. Every number here was checked against its official source.': 'प्रशिक्षित लोग मदद के लिए तैयार हैं। यहाँ हर नंबर उसके आधिकारिक स्रोत से जाँचा गया है।',
    'Call Tele-MANAS 14416 (India, free, 24x7)': 'Tele-MANAS 14416 पर कॉल करें (भारत, मुफ़्त, 24x7)',
    'Call 14416': '14416 पर कॉल करें', 'Call 112': '112 पर कॉल करें', 'Emergency: call 112': 'आपातकाल: 112 पर कॉल करें',
    '24x7, free, English and 20 Indian languages. Can connect you to a psychiatrist.': '24x7, मुफ़्त, अंग्रेज़ी और 20 भारतीय भाषाओं में। आपको मनोचिकित्सक से जोड़ सकते हैं।',
    '24x7, free, call or WhatsApp.': '24x7, मुफ़्त, कॉल या WhatsApp।',
    'Mon to Sat, 8am to 9pm, free counselling by phone and email.': 'सोम से शनि, सुबह 8 से रात 9 बजे, फ़ोन और ईमेल पर मुफ़्त काउंसलिंग।',
    'Find a helpline anywhere: findahelpline.com': 'कहीं भी हेल्पलाइन खोजें: findahelpline.com',
    'If you might act on thoughts of ending your life, please call 112 now. Kind, trained people are ready to listen, any time.':
      'अगर आपको लगता है कि आप अपनी जान लेने के विचार पर अमल कर सकते हैं, तो कृपया अभी 112 पर कॉल करें। दयालु, प्रशिक्षित लोग किसी भी समय सुनने के लिए तैयार हैं।',
    'If you might act on thoughts of ending your life.': 'अगर आप अपनी जान लेने के विचार पर अमल कर सकते हैं।',
    'Message my trusted person': 'मेरे भरोसेमंद व्यक्ति को संदेश भेजें', 'Open my safety plan': 'मेरी सुरक्षा योजना खोलें',
    'Find a therapist or psychiatrist': 'थेरेपिस्ट या मनोचिकित्सक खोजें', 'Set up my trusted person': 'मेरा भरोसेमंद व्यक्ति सेट करें',
    'Add a trusted person': 'एक भरोसेमंद व्यक्ति जोड़ें', 'Change trusted person': 'भरोसेमंद व्यक्ति बदलें', 'Change my trusted person': 'मेरा भरोसेमंद व्यक्ति बदलें',
    'Add a trusted person so SOS can message them in one tap.': 'एक भरोसेमंद व्यक्ति जोड़ें, ताकि SOS एक टैप में उन्हें संदेश भेज सके।',
    'Someone you would want by your side on a hard day. Saved only on this device.': 'कोई जिसे आप मुश्किल दिन पर अपने पास चाहेंगे। सिर्फ़ इसी डिवाइस पर सेव होता है।',
    'Their name': 'उनका नाम', 'Their phone number': 'उनका फ़ोन नंबर', 'Save trusted person': 'भरोसेमंद व्यक्ति सेव करें',
    'For example, Meera': 'जैसे, मीरा', 'For example, Dr. Rao': 'जैसे, डॉ. राव',
    'Opens your maps app. LoosenUp never sees or stores your location.': 'आपका मैप ऐप खुलता है। LoosenUp आपकी लोकेशन न देखता है, न सेव करता है।',
    'Add their phone number, with the country code if you can.': 'उनका फ़ोन नंबर जोड़ें, हो सके तो देश के कोड के साथ।',
    'Add their name first.': 'पहले उनका नाम जोड़ें।', 'SOS can message them in one tap.': 'SOS एक टैप में उन्हें संदेश भेज सकता है।',
    'my trusted person': 'मेरे भरोसेमंद व्यक्ति',
    'Heavy days are real, and you deserve support. Can we gently ask you something important?': 'भारी दिन सच होते हैं, और आप सहारे के हक़दार हैं। क्या हम धीरे से एक ज़रूरी बात पूछ सकते हैं?',
    'Are you having thoughts of ending your life or hurting yourself?': 'क्या आपके मन में अपनी जान लेने या खुद को चोट पहुँचाने के विचार आ रहे हैं?',
    'Yes, or I am not sure': 'हाँ, या पक्का नहीं पता', 'No, not right now': 'नहीं, अभी नहीं',
    'You deserve support': 'आप सहारे के हक़दार हैं',
    'Talking to someone you trust, or a free helpline, can make a real difference.': 'किसी भरोसेमंद व्यक्ति से, या किसी मुफ़्त हेल्पलाइन से बात करना सच में फ़र्क ला सकता है।',
    'See helplines and support': 'हेल्पलाइन और सहायता देखें', 'Back to LoosenUp': 'LoosenUp पर वापस',
    'I am having a really hard time and could really use you right now.': 'मेरा समय बहुत मुश्किल चल रहा है और इस पल मुझे सच में तुम्हारी ज़रूरत है।',
    'Can you call me or come be with me?': 'क्या तुम मुझे कॉल कर सकते हो या मेरे पास आ सकते हो?',

    /* ---- Find support ---- */
    'Find a professional near you': 'अपने पास कोई विशेषज्ञ खोजें', 'Which professional do I need?': 'मुझे किस विशेषज्ञ की ज़रूरत है?',
    'A psychiatrist is a doctor who can assess and prescribe. A psychologist or counsellor offers talk therapy. Tele-MANAS (14416) can help you decide, for free.':
      'मनोचिकित्सक एक डॉक्टर होते हैं जो जाँच कर दवा लिख सकते हैं। मनोवैज्ञानिक या काउंसलर बातचीत से थेरेपी देते हैं। Tele-MANAS (14416) मुफ़्त में तय करने में मदद कर सकता है।',
    'A medical doctor (MBBS plus MD in psychiatry, registered with the NMC). Can assess, diagnose and prescribe medicine. A good first step if heavy days have lasted more than two weeks, if sleep, eating or work are badly affected, or if you have thoughts of harming yourself.':
      'एक मेडिकल डॉक्टर (MBBS और मनोचिकित्सा में MD, NMC में पंजीकृत)। जाँच, निदान और दवा लिख सकते हैं। अगर भारी दिन दो हफ़्ते से ज़्यादा चले हों, नींद, खाना या काम बहुत प्रभावित हो, या खुद को नुकसान पहुँचाने के विचार आते हों, तो यह एक अच्छा पहला कदम है।',
    'Trained in talk therapies such as CBT and in assessments. In India, look for registration with the Rehabilitation Council of India (RCI).':
      'CBT जैसी बातचीत वाली थेरेपी और जाँच में प्रशिक्षित। भारत में भारतीय पुनर्वास परिषद (RCI) में पंजीकरण देखें।',
    'Talk support for everyday challenges: work, relationships, grief, changes in life. Ask about their training and supervision.':
      'रोज़मर्रा की चुनौतियों के लिए बातचीत से सहारा: काम, रिश्ते, दुख, जीवन के बदलाव। उनके प्रशिक्षण और निगरानी के बारे में पूछें।',
    'Not sure? Start with Tele-MANAS. They listen first and can connect you with the right professional, free.':
      'पक्का नहीं पता? Tele-MANAS से शुरू करें। वे पहले सुनते हैं और मुफ़्त में सही विशेषज्ञ से जोड़ सकते हैं।',
    'When to talk to a professional': 'विशेषज्ञ से कब बात करें',
    'Everyone has heavy days. It is a good time to talk to a professional if low moods last more than two weeks, if sleep, eating or work are clearly affected, or if you have thoughts of hurting yourself.':
      'भारी दिन सबके आते हैं। अगर उदास मन दो हफ़्ते से ज़्यादा रहे, नींद, खाना या काम साफ़ तौर पर प्रभावित हो, या खुद को चोट पहुँचाने के विचार आएँ, तो किसी विशेषज्ञ से बात करने का यह अच्छा समय है।',
    'Reaching out early is a strength. Many people feel lighter after just the first conversation.': 'जल्दी मदद माँगना एक ताकत है। कई लोग पहली बातचीत के बाद ही हल्का महसूस करते हैं।',
    'Your first call': 'आपकी पहली कॉल', 'Copy this script': 'यह संदेश कॉपी करें',
    'Hi, I would like to book a first appointment. I have been feeling low and tense for a few weeks and it is affecting my sleep and work. Do you have time this week, do you offer online sessions, and what is the fee?':
      'नमस्ते, मैं पहली अपॉइंटमेंट बुक करना चाहता या चाहती हूँ। कुछ हफ़्तों से मेरा मन उदास और भारी है, और इसका असर मेरी नींद और काम पर पड़ रहा है। क्या इस हफ़्ते आपके पास समय है, क्या आप ऑनलाइन सेशन देते हैं, और फ़ीस कितनी है?',
    'Good questions to ask': 'पूछने लायक अच्छे सवाल',
    'Are you registered with the RCI (psychologists) or the NMC (psychiatrists)?': 'क्या आप RCI (मनोवैज्ञानिक) या NMC (मनोचिकित्सक) में पंजीकृत हैं?',
    'What kind of therapy do you use, and how many sessions is usual?': 'आप किस तरह की थेरेपी करते हैं, और आमतौर पर कितने सेशन होते हैं?',
    'What is the fee, and is there a reduced fee option?': 'फ़ीस कितनी है, और क्या कम फ़ीस का विकल्प है?',
    'Do you offer online or phone sessions?': 'क्या आप ऑनलाइन या फ़ोन पर सेशन देते हैं?',
    'How do you keep what I share private?': 'मेरी बातें आप निजी कैसे रखते हैं?',
    'My care team': 'मेरी देखभाल टीम', 'Keep your therapist or doctor handy. Saved only on this device.': 'अपने थेरेपिस्ट या डॉक्टर की जानकारी पास रखें। सिर्फ़ इसी डिवाइस पर सेव होती है।',
    'Next session (optional)': 'अगला सेशन (वैकल्पिक)', 'Save to my care team': 'मेरी देखभाल टीम में सेव करें',
    'No session booked yet.': 'अभी कोई सेशन बुक नहीं है।', 'Saved to your care team.': 'आपकी देखभाल टीम में सेव हो गया।',
    'Your session is in an hour': 'आपका सेशन एक घंटे में है', 'You are doing something kind for yourself.': 'आप अपने लिए कुछ अच्छा कर रहे हैं।',
    'Copied. Paste it into a message or keep it handy for the call.': 'कॉपी हो गया। इसे किसी संदेश में चिपकाएँ या कॉल के लिए पास रखें।',
    'Hold to select the text and copy it.': 'टेक्स्ट चुनने के लिए दबाकर रखें और कॉपी करें।',

    /* ---- Safety plan ---- */
    'My safety plan': 'मेरी सुरक्षा योजना',
    'Write this on a calmer day, so it is ready when you need it. Saved only on this device. Based on the Stanley-Brown safety plan used by clinicians.':
      'इसे किसी शांत दिन लिखें, ताकि ज़रूरत पड़ने पर यह तैयार रहे। सिर्फ़ इसी डिवाइस पर सेव होता है। विशेषज्ञों द्वारा इस्तेमाल होने वाली Stanley-Brown सुरक्षा योजना पर आधारित।',
    'My warning signs': 'मेरे चेतावनी संकेत', 'Things I can do on my own': 'जो मैं खुद कर सकता या सकती हूँ',
    'People and places that lift me': 'लोग और जगहें जो मुझे सहारा देती हैं', 'People I can ask for help': 'लोग जिनसे मैं मदद माँग सकता या सकती हूँ',
    'Professionals and helplines': 'विशेषज्ञ और हेल्पलाइन', 'Making my space safer': 'अपनी जगह को और सुरक्षित बनाना',
    'What matters most to me': 'मेरे लिए सबसे ज़रूरी क्या है',
    'Thoughts, feelings or situations that tell me a hard moment may be starting': 'विचार, भावनाएँ या हालात जो बताते हैं कि मुश्किल पल शुरू हो सकता है',
    'A walk, a Sigh of relief break, music, a shower': 'टहलना, Sigh of relief ब्रेक, संगीत, नहाना',
    "A friend's home, a temple, the park, a cafe": 'किसी दोस्त का घर, मंदिर, पार्क, कैफ़े',
    'Names and phone numbers': 'नाम और फ़ोन नंबर',
    'Ways to keep things I could use to hurt myself out of reach': 'खुद को चोट पहुँचाने वाली चीज़ों को पहुँच से दूर रखने के तरीके',
    'People, pets, plans, places I love': 'मेरे प्यारे लोग, पालतू, योजनाएँ और जगहें',
    'Save my safety plan': 'मेरी सुरक्षा योजना सेव करें', 'Your safety plan is saved.': 'आपकी सुरक्षा योजना सेव हो गई।',
    'Saved on this device.': 'इस डिवाइस पर सेव हो गया।', 'Saved on this device. It is one tap away from SOS.': 'इस डिवाइस पर सेव हो गया। यह SOS से बस एक टैप दूर है।',
    'Nothing is saved until you tap Save.': 'जब तक आप सेव नहीं दबाते, कुछ भी सेव नहीं होता।',
    'Saved only on this device, and only when you tap Save.': 'सिर्फ़ इसी डिवाइस पर सेव होता है, और तभी जब आप सेव दबाएँ।',

    /* ---- Reframe ---- */
    'Notice the thought, then look for a kinder, truer version.': 'विचार को पहचानें, फिर उसका एक नरम, सच्चा रूप खोजें।',
    'What thought showed up?': 'कौन सा विचार आया?', 'For example: I always mess things up': 'जैसे: मुझसे हमेशा सब बिगड़ जाता है',
    'What happened?': 'क्या हुआ?', 'Just the facts, in a line or two': 'बस तथ्य, एक दो पंक्तियों में',
    'What tells you the thought is not the whole story?': 'क्या बताता है कि यह विचार पूरी कहानी नहीं है?',
    'If a dear friend had this thought, what would you tell them?': 'अगर किसी प्यारे दोस्त के मन में यह विचार होता, तो आप उनसे क्या कहते?',
    'A kinder, balanced thought': 'एक नरम, संतुलित विचार',
    'For example: I made one mistake, and I also got a lot right today': 'जैसे: मुझसे एक गलती हुई, और आज मैंने बहुत कुछ सही भी किया',
    'Keep the kinder thought in my jar': 'नरम विचार मेरे जार में रखें',
    'Only the kinder thought is ever saved, and only if you choose to keep it.': 'सिर्फ़ नरम विचार ही सेव होता है, और वह भी तभी जब आप उसे रखना चुनें।',
    'Write a few words first. Any words are welcome.': 'पहले कुछ शब्द लिखें। कोई भी शब्द चलेंगे।',
    'That is a real shift, and you made it.': 'यह एक असली बदलाव है, और यह आपने किया।',
    'Some thoughts take a few tries. You did the work, and that counts.': 'कुछ विचारों में कुछ कोशिशें लगती हैं। आपने मेहनत की, और यही मायने रखता है।',
    'Kept in your Good things jar.': 'आपके अच्छी बातों के जार में रख दिया।',

    /* ---- Sounds ---- */
    'Play a calm sound': 'एक शांत आवाज़ चलाएँ', 'Tap a sound to begin. Keep LoosenUp open while it plays.': 'शुरू करने के लिए किसी आवाज़ पर टैप करें। चलते समय LoosenUp खुला रखें।',
    'Slow waves': 'धीमी लहरें', 'Warm brown noise': 'गरम ब्राउन नॉइज़', 'Deep hush': 'गहरी शांति', 'Breeze': 'हवा', 'Gentle airflow': 'हल्की हवा',
    'Soft and steady': 'कोमल और स्थिर', 'Volume': 'आवाज़ का स्तर', 'Sleep timer': 'नींद टाइमर',
    'Sounds are not available on this device.': 'इस डिवाइस पर आवाज़ें उपलब्ध नहीं हैं।',
    'Playing. Keep LoosenUp open while it plays.': 'चल रहा है। चलते समय LoosenUp खुला रखें।',
    'Stopped. Tap a sound to begin again.': 'रुक गया। फिर शुरू करने के लिए किसी आवाज़ पर टैप करें।',
    'Same wake time, a softer last hour, and a calm sound if you need it.': 'जागने का एक ही समय, सोने से पहले का आख़िरी घंटा धीमा, और ज़रूरत हो तो एक शांत आवाज़।',

    /* ---- Wellbeing (WHO-5) ---- */
    'Five quick questions that show how your days have really been going.': 'पाँच छोटे सवाल, जो दिखाते हैं कि आपके दिन सच में कैसे बीत रहे हैं।',
    'Over the last two weeks, how often has each of these been true? This is a check-in, not a diagnosis.':
      'पिछले दो हफ़्तों में, इनमें से हर बात कितनी बार सच रही? यह बस हाल जानने के लिए है, कोई निदान नहीं।',
    '0 = at no time, 5 = all of the time': '0 = कभी नहीं, 5 = हर समय',
    'I have felt cheerful and in good spirits': 'मैंने खुशी और अच्छा मन महसूस किया है',
    'I have felt calm and relaxed': 'मैंने शांत और सहज महसूस किया है',
    'I have felt active and full of energy': 'मैंने खुद को सक्रिय और ऊर्जा से भरा महसूस किया है',
    'I woke up feeling fresh and rested': 'जागने पर मैंने ताज़गी और आराम महसूस किया है',
    'My daily life has been filled with things that interest me': 'मेरा रोज़ का जीवन उन चीज़ों से भरा रहा है जो मुझे दिलचस्प लगती हैं',
    'At no time': 'कभी नहीं', 'Some of the time': 'कुछ समय', 'Less than half of the time': 'आधे से कम समय',
    'More than half of the time': 'आधे से ज़्यादा समय', 'Most of the time': 'ज़्यादातर समय', 'All of the time': 'हर समय',
    'Wellbeing out of 100': 'मन की भलाई, 100 में से', 'Your first check will appear here.': 'आपकी पहली जाँच यहाँ दिखेगी।',
    'Every two weeks': 'हर दो हफ़्ते', 'Uses the WHO-5 Wellbeing Index (World Health Organization).': 'WHO-5 वेलबीइंग इंडेक्स (विश्व स्वास्थ्य संगठन) पर आधारित।',
    'Answer all five. Every answer is welcome.': 'पाँचों का जवाब दें। हर जवाब का स्वागत है।',
    'One tap is enough. Every answer is welcome here.': 'एक टैप काफ़ी है। यहाँ हर जवाब का स्वागत है।',
    'Your wellbeing looks bright. Keep the small habits that got you here.': 'आपकी मन की भलाई उजली दिख रही है। वे छोटी आदतें जारी रखें जो आपको यहाँ तक लाईं।',
    'Steady. Calm breaks and Small steps help keep it that way.': 'स्थिर। शांत ब्रेक और छोटे कदम इसे ऐसा ही बनाए रखने में मदद करते हैं।',
    'Your wellbeing has been lower than usual. Talking to a professional can really help, and reaching out early makes a difference.':
      'आपकी मन की भलाई आम दिनों से कम रही है। किसी विशेषज्ञ से बात करना सच में मदद कर सकता है, और जल्दी मदद माँगने से फ़र्क पड़ता है।',
    'These two weeks have been really heavy. Please consider talking to a professional soon. Tele-MANAS (14416) is free and open 24x7.':
      'ये दो हफ़्ते सच में बहुत भारी रहे हैं। कृपया जल्दी किसी विशेषज्ञ से बात करने के बारे में सोचें। Tele-MANAS (14416) मुफ़्त है और 24x7 खुला है।',

    /* ---- Learn ---- */
    'Short, kind lessons on why the breaks work, and what helps on heavy days.': 'छोटे, प्यारे पाठ: ब्रेक क्यों काम करते हैं, और भारी दिनों में क्या मदद करता है।',
    'One minute each': 'हर एक, एक मिनट का', 'Back to lessons': 'पाठों पर वापस', 'Next step': 'अगला कदम',
    'Why a long breath out helps': 'लंबी साँस छोड़ना क्यों मदद करता है',
    'When your breath out is slower than your breath in, your body gets a quiet signal that it is safe to slow down.':
      'जब आपकी साँस छोड़ना, साँस लेने से धीमा होता है, तो शरीर को एक शांत संकेत मिलता है कि अब धीमा होना सुरक्षित है।',
    'Many people notice their heartbeat ease a little and their shoulders drop after a few long breaths out. That is why Sigh of relief and Cool down stretch the out-breath.':
      'कई लोग महसूस करते हैं कि कुछ लंबी साँसें छोड़ने के बाद उनकी धड़कन थोड़ी धीमी होती है और कंधे ढीले पड़ते हैं। इसीलिए Sigh of relief और Cool down में साँस छोड़ना लंबा होता है।',
    'You can use this anywhere: in a meeting, in traffic, before a hard talk. Nobody needs to know.':
      'आप इसे कहीं भी इस्तेमाल कर सकते हैं: मीटिंग में, ट्रैफ़िक में, मुश्किल बात से पहले। किसी को पता चलने की ज़रूरत नहीं।',
    'Make the out-breath longer than the in-breath.': 'साँस छोड़ना, साँस लेने से लंबा रखें।',
    'Thoughts are guesses, not facts': 'विचार अनुमान हैं, तथ्य नहीं',
    'A thought like "I always mess things up" can feel completely true in the moment. It is really a guess your mind makes, often on a tired or heavy day.':
      'एक विचार जैसे "मुझसे हमेशा सब बिगड़ जाता है" उस पल पूरी तरह सच लग सकता है। असल में यह मन का एक अनुमान होता है, अक्सर थके या भारी दिन पर।',
    'Thoughts, feelings and actions move together. When you look at a thought from a little distance, the feeling often softens too.':
      'विचार, भावनाएँ और काम साथ चलते हैं। जब आप किसी विचार को थोड़ी दूरी से देखते हैं, तो भावना भी अक्सर नरम हो जाती है।',
    'Ask: what would I tell a dear friend who had this thought? Then try saying it to yourself.':
      'पूछें: अगर किसी प्यारे दोस्त के मन में यह विचार होता, तो मैं उनसे क्या कहता या कहती? फिर वही बात खुद से कहें।',
    'On heavy days, action comes first': 'भारी दिनों में पहले कदम, फिर मन',
    'When energy is low, it is natural to wait until you feel like doing something. Often the feeling follows the action instead.':
      'जब ऊर्जा कम हो, तो कुछ करने का मन होने तक रुकना स्वाभाविक है। पर अक्सर मन, काम के बाद आता है।',
    'Tiny actions count: a glass of water, two minutes of daylight, a hello to someone you trust. Each one is a small vote for yourself.':
      'छोटे काम भी मायने रखते हैं: एक गिलास पानी, दो मिनट की धूप, किसी भरोसेमंद को एक नमस्ते। हर एक आपके अपने पक्ष में एक छोटा वोट है।',
    'Pick something so small it feels almost too easy. Then notice how you feel afterwards.':
      'इतना छोटा कुछ चुनें कि वह लगभग बहुत आसान लगे। फिर देखें कि बाद में आपको कैसा लगता है।',
    'Start tiny. The lift often comes after the step.': 'छोटे से शुरू करें। राहत अक्सर कदम के बाद आती है।',
    'A gentle runway to sleep': 'नींद की ओर एक कोमल राह',
    'Sleep comes more easily when the hour before bed slows down. Dim the lights, put the phone face down, and keep the room cool and quiet.':
      'जब सोने से पहले का घंटा धीमा होता है, तो नींद आसानी से आती है। रोशनी कम करें, फ़ोन उल्टा रखें, और कमरा ठंडा और शांत रखें।',
    'Waking at about the same time each day, even on weekends, helps your body know when to feel sleepy.':
      'हर दिन लगभग एक ही समय पर जागना, छुट्टी वाले दिन भी, शरीर को बताता है कि नींद कब आनी चाहिए।',
    'If your mind races in bed, write the thoughts down or play a soft sound, then return to slow breathing.':
      'अगर बिस्तर में मन दौड़ता है, तो विचार लिख लें या कोई धीमी आवाज़ चलाएँ, फिर धीमी साँसों पर लौट आएँ।',
    'Talk to yourself like a friend': 'खुद से दोस्त की तरह बात करें',
    'Many of us speak to ourselves more harshly than we would ever speak to anyone we love.':
      'हम में से कई लोग खुद से उससे कहीं ज़्यादा कठोरता से बात करते हैं, जितनी किसी अपने से कभी नहीं करेंगे।',
    'Try a hand on your heart and the words: this is a hard moment, I am not alone, may I be kind to myself.':
      'दिल पर हाथ रखकर ये शब्द कहें: यह एक मुश्किल पल है, मैं अकेले नहीं हूँ, मैं खुद के प्रति दयालु रहूँ।',
    'Self-kindness is not letting yourself off the hook. It is the steady voice that helps you try again.':
      'खुद पर दया का मतलब खुद को छूट देना नहीं है। यह वह स्थिर आवाज़ है जो आपको फिर से कोशिश करने में मदद करती है।',
    'Use the voice you would use for a dear friend.': 'वही आवाज़ इस्तेमाल करें जो आप किसी प्यारे दोस्त के लिए करते हैं।',
    'Boundaries that protect your energy at work': 'सीमाएँ जो काम पर आपकी ऊर्जा बचाती हैं',
    'Energy at work comes back in small pieces: a two-minute pause between meetings, one task at a time, a real lunch away from the screen.':
      'काम पर ऊर्जा छोटे टुकड़ों में लौटती है: मीटिंग के बीच दो मिनट का ठहराव, एक बार में एक काम, स्क्रीन से दूर असली लंच।',
    'Saying "I can do this by Friday" is clearer and kinder than saying yes to everything today.':
      '"मैं यह शुक्रवार तक कर दूँगा या दूँगी" कहना, आज हर बात पर हाँ कहने से ज़्यादा साफ़ और नरम है।',
    'End the day with a small ritual, like closing the laptop and three slow breaths, so your mind knows work is done.':
      'दिन का अंत एक छोटी आदत से करें, जैसे लैपटॉप बंद करना और तीन धीमी साँसें, ताकि मन जान ले कि काम हो गया।',
    'Small pauses and clear limits keep you steady through the week.': 'छोटे ठहराव और साफ़ सीमाएँ पूरे हफ़्ते आपको स्थिर रखती हैं।',
    'Repair after a disagreement': 'अनबन के बाद रिश्ता सँवारना',
    'Disagreements happen in every close relationship. What matters most is the repair afterwards.': 'हर करीबी रिश्ते में अनबन होती है। सबसे ज़रूरी है उसके बाद रिश्ता सँवारना।',
    'Wait until both of you feel calmer. Start with "I felt" rather than "You always". Listen to understand, not to reply.':
      'जब तक आप दोनों शांत न हो जाएँ, रुकें। "तुम हमेशा" के बजाय "मुझे लगा" से शुरू करें। जवाब देने के लिए नहीं, समझने के लिए सुनें।',
    'Owning your part, even a small part, often opens the door for the other person to do the same.':
      'अपना हिस्सा मान लेना, चाहे छोटा सा ही, अक्सर दूसरे व्यक्ति के लिए भी वैसा करने का रास्ता खोल देता है।',
    'Calm down first, speak from "I", and repair early.': 'पहले शांत हों, "मैं" से बात शुरू करें, और जल्दी रिश्ता सँवारें।',
    'Supporting a friend who is struggling': 'मुश्किल में किसी दोस्त का साथ देना',
    'Listening without fixing is one of the kindest things you can offer. Try: "That sounds really hard. I am here."':
      'बिना हल सुझाए सुनना सबसे प्यारी चीज़ों में से एक है जो आप दे सकते हैं। कहकर देखें: "यह सच में बहुत मुश्किल लगता है। मैं यहाँ हूँ।"',
    'If you are worried about them, ask directly: "Are you thinking about ending your life?" Asking does not put the idea in their head, and it can be a huge relief.':
      'अगर आपको उनकी फ़िक्र है, तो सीधे पूछें: "क्या तुम अपनी जान लेने के बारे में सोच रहे हो?" पूछने से यह विचार उनके मन में नहीं आता, और इससे उन्हें बहुत राहत मिल सकती है।',
    'If they say yes, stay with them and call Tele-MANAS on 14416 together, or 112 in an emergency.':
      'अगर वे हाँ कहें, तो उनके साथ रहें और मिलकर Tele-MANAS को 14416 पर कॉल करें, या आपातकाल में 112 पर।',
    'Listen, ask directly, and connect them to support.': 'सुनें, सीधे पूछें, और उन्हें मदद से जोड़ें।',
    'Not sure where to start? Tele-MANAS is free, kind and open 24x7.': 'पता नहीं कहाँ से शुरू करें? Tele-MANAS मुफ़्त, दयालु और 24x7 खुला है।',

    /* ---- Calm screen: Breathe, Games, Sounds ---- */
    'Breathe, play, listen': 'साँस लें, खेलें, सुनें', 'Breathe': 'साँस', 'Games': 'खेल', 'Sounds': 'आवाज़ें',
    'Breathing': 'साँस के अभ्यास', 'Body and mind': 'तन और मन', 'You picked this one yourself.': 'यह आपने खुद चुना।',
    'Pick any exercise. You rate how you feel before and after, so your Calm gain keeps growing.':
      'कोई भी अभ्यास चुनें। आप पहले और बाद में बताते हैं कि कैसा लग रहा है, ताकि आपका Calm gain बढ़ता रहे।',
    'Made on your device, works offline. Keep LoosenUp open while a sound plays.':
      'आपके डिवाइस पर बनी, बिना इंटरनेट चलती हैं। आवाज़ चलते समय LoosenUp खुला रखें।',

    /* ---- Play ---- */
    'Calm little games': 'शांत छोटे खेल',
    'Gentle games with nothing to rush. Each one adds a little XP, up to 3 games a day.': 'कोमल खेल, बिना किसी जल्दी के। हर खेल थोड़ा XP जोड़ता है, दिन में 3 खेल तक।',
    'Turn the cards and match the flowers.': 'कार्ड पलटें और फूलों के जोड़े मिलाएँ।',
    'Turn two cards at a time. Matching flowers stay open. Take all the time you like.': 'एक बार में दो कार्ड पलटें। मिलते फूल खुले रहते हैं। जितना चाहें उतना समय लें।',
    'Tap drifting sunbeams into your jar.': 'तैरती Sunbeams पर टैप करके उन्हें अपने जार में डालें।',
    'Tap the sunbeams and petals as they drift by. Every catch fills your jar.': 'तैरती Sunbeams और पंखुड़ियों पर टैप करें। हर पकड़ आपका जार भरती है।',
    'Breathe with me for 60 seconds': 'मेरे साथ 60 सेकंड साँस लें',
    'Press and hold while the ring grows to breathe in. Let go as it shrinks to breathe out. Six breaths, six flowers.':
      'जब घेरा बड़ा हो, दबाकर रखें और साँस लें। जब छोटा हो, छोड़ दें और साँस छोड़ें। छह साँसें, छह फूल।',
    'Press and hold to begin': 'शुरू करने के लिए दबाकर रखें', 'Hold to breathe in': 'साँस लेने के लिए दबाकर रखें',
    'Hold to breathe in, let go to breathe out.': 'साँस लेने के लिए दबाकर रखें, छोड़ने के लिए उँगली हटा लें।',
    'Catch a petal': 'एक पंखुड़ी पकड़ें', 'Catch a sunbeam': 'एक Sunbeam पकड़ें',
    'All pairs bloomed': 'सारे जोड़े खिल गए', 'Your jar is glowing': 'आपका जार चमक रहा है', 'Six breaths, six blooms': 'छह साँसें, छह फूल',
    'Every breath counted.': 'हर साँस मायने रखती थी।', 'Play again': 'फिर से खेलें', 'Back to Play': 'खेल पर वापस',
    'You have gathered today\'s game XP. Play on just for the joy of it.': 'आज का गेम XP मिल चुका है। अब बस मज़े के लिए खेलें।',
    "Today's game XP is all gathered, so this round was just for fun.": 'आज का पूरा गेम XP मिल चुका है, इसलिए यह राउंड बस मज़े के लिए था।',
    'Sunflower': 'सूरजमुखी', 'Peach rose': 'आड़ू गुलाब', 'Fern bell': 'फ़र्न बेल', 'Sky poppy': 'आसमानी पोस्त', 'Lilac': 'बकायन', 'Blush daisy': 'गुलाबी डेज़ी',

    /* ---- Garden and badges ---- */
    'Your garden': 'आपका बगीचा', 'Grows with every break': 'हर ब्रेक के साथ बढ़ता है', 'Every break plants a flower here.': 'हर ब्रेक यहाँ एक फूल लगाता है।',
    'Your garden grows with every break and stays in bloom.': 'आपका बगीचा हर ब्रेक के साथ बढ़ता है और खिला रहता है।',
    'Each break gives 10 XP, plus 2 for every point of Calm gain.': 'हर ब्रेक 10 XP देता है, और Calm gain के हर अंक पर 2 और।',
    'You have reached Meadow. Everything keeps growing.': 'आप Meadow तक पहुँच गए हैं। सब कुछ बढ़ता रहता है।',
    'You are already halfway to Sprout.': 'आप Sprout तक आधा रास्ता तय कर चुके हैं।',
    'First light': 'पहली किरण', 'Explorer': 'खोजी', 'Playful': 'चंचल', 'Ten breaks': 'दस ब्रेक', 'Big lift': 'बड़ी राहत',
    'Sunbeam sharer': 'Sunbeam बाँटने वाले', 'Steady week': 'स्थिर हफ़्ता', 'Full glow': 'पूरी चमक', 'Month of light': 'रोशनी का महीना',
    'Three days in a row': 'लगातार तीन दिन', 'Seven days in a row': 'लगातार सात दिन', 'A habit in full bloom': 'पूरी तरह खिली एक आदत',
    'A whole month of light': 'रोशनी से भरा पूरा महीना', 'Ten calm moments': 'दस शांत पल', 'A Calm gain of +5 or more': '+5 या उससे ज़्यादा Calm gain',
    'Tried every technique': 'हर तकनीक आज़माई', 'Shared LoosenUp': 'LoosenUp शेयर किया', 'Set a daily time': 'रोज़ का समय तय किया',
    'Played a calm game': 'एक शांत खेल खेला', 'Flowers bloomed': 'खिले फूल', 'Avg Calm gain': 'औसत Calm gain',

    /* ---- Week ---- */
    'Your Sunny week': 'आपका Sunny week', 'The last 7 days': 'पिछले 7 दिन', 'Calm gain for the last 7 days': 'पिछले 7 दिनों का Calm gain',
    'Your trend': 'आपका रुझान', 'What lifts you most': 'आपको सबसे ज़्यादा क्या राहत देता है', 'Your breaks': 'आपके ब्रेक',
    'Your days have been getting lighter this week. Lovely to see.': 'इस हफ़्ते आपके दिन हल्के होते जा रहे हैं। देखकर बहुत अच्छा लगा।',
    'This week has felt heavier. Small steps, Kind words and SOS are all here for you.': 'यह हफ़्ता भारी लगा है। छोटे कदम, Kind words और SOS सब आपके लिए यहाँ हैं।',
    'Your mood has been steady this week. Small breaks keep it that way.': 'इस हफ़्ते आपका मूड स्थिर रहा है। छोटे ब्रेक इसे ऐसा ही रखते हैं।',
    'Take a break or two and we will show you what lifts you most.': 'एक दो ब्रेक लें, और हम दिखाएँगे कि आपको सबसे ज़्यादा क्या राहत देता है।',

    /* ---- Me ---- */
    'Your corner': 'आपका कोना', 'Settings and plan': 'सेटिंग और प्लान', 'Seeds and plan': 'Seeds और प्लान',
    'Free plan. Quick breeze is always free.': 'मुफ़्त प्लान। Quick breeze हमेशा मुफ़्त है।',
    'Full Bloom plan (demo): guided breaks use no Seeds.': 'Full Bloom प्लान (डेमो): गाइडेड ब्रेक में Seeds नहीं लगते।',
    'Visit the Seed shop': 'Seed दुकान पर जाएँ', 'Seed shop': 'Seed दुकान',
    'Golden hour time': 'Golden hour का समय', 'Golden hour is here.': 'Golden hour आ गया है।', 'Turn off Golden hour': 'Golden hour बंद करें',
    'Pick a daily time for a gentle reminder.': 'कोमल रिमाइंडर के लिए रोज़ का एक समय चुनें।',
    'Pick a daily time for one gentle reminder.': 'एक कोमल रिमाइंडर के लिए रोज़ का एक समय चुनें।',
    'Pick a daily time and a gentle note will appear in the app. The phone apps can send one daily reminder.':
      'रोज़ का एक समय चुनें, उस समय ऐप में एक कोमल संदेश दिखेगा। फ़ोन ऐप रोज़ एक रिमाइंडर भेज सकते हैं।',
    'One gentle reminder arrives each day.': 'हर दिन एक कोमल रिमाइंडर आता है।',
    'A gentle note appears in the app from that time.': 'उस समय से ऐप में एक कोमल संदेश दिखता है।',
    'Reminders are off in your settings. The in-app note still works.': 'आपकी सेटिंग में रिमाइंडर बंद हैं। ऐप के अंदर का संदेश अब भी काम करता है।',
    'Pick a time first.': 'पहले एक समय चुनें।', 'Golden hour is off. You can set it again any time.': 'Golden hour बंद है। आप इसे कभी भी फिर से सेट कर सकते हैं।',
    'Share a Sunbeam': 'एक Sunbeam शेयर करें',
    'Invite a friend to LoosenUp. Sharing earns you a Seed (up to 2 free Seeds a week).': 'किसी दोस्त को LoosenUp पर बुलाएँ। शेयर करने पर आपको एक Seed मिलता है (हफ़्ते में 2 मुफ़्त Seeds तक)।',
    'Thanks for sharing a Sunbeam!': 'Sunbeam शेयर करने के लिए धन्यवाद!', 'Thanks for sharing a Sunbeam! +1 Seed': 'Sunbeam शेयर करने के लिए धन्यवाद! +1 Seed',
    'Thanks for sharing a Sunbeam! Your free Seeds for this week are all gathered.': 'Sunbeam शेयर करने के लिए धन्यवाद! इस हफ़्ते के आपके मुफ़्त Seeds मिल चुके हैं।',
    'Link copied. Share it anywhere you like.': 'लिंक कॉपी हो गया। इसे कहीं भी शेयर करें।',
    'Install LoosenUp': 'LoosenUp इंस्टॉल करें', 'Install app': 'ऐप इंस्टॉल करें', 'Install on iPhone:': 'iPhone पर इंस्टॉल करें:',
    'Android app download and iPhone steps': 'Android ऐप डाउनलोड और iPhone के चरण',
    'On Android: open the Chrome menu, then Install app. On iPhone: Safari Share, then Add to Home Screen.':
      'Android पर: Chrome मेनू खोलें, फिर Install app। iPhone पर: Safari में Share, फिर Add to Home Screen।',
    'tap Share, then Add to Home Screen. LoosenUp then opens like an app and works offline.': 'Share पर टैप करें, फिर Add to Home Screen। तब LoosenUp एक ऐप की तरह खुलता है और बिना इंटरनेट चलता है।',
    'LoosenUp is installed. Lovely to have you here.': 'LoosenUp इंस्टॉल हो गया है। आपका यहाँ होना बहुत अच्छा लगा।',
    'Add LoosenUp to your home screen for quick, offline breaks.': 'जल्दी, बिना इंटरनेट वाले ब्रेक के लिए LoosenUp को होम स्क्रीन पर जोड़ें।',
    'On iPhone: open loosenup-ios.anchit-tandon.com in Safari, tap Share, then Add to Home Screen.': 'iPhone पर: Safari में loosenup-ios.anchit-tandon.com खोलें, Share पर टैप करें, फिर Add to Home Screen।',
    'LoosenUp is on your home screen.': 'LoosenUp आपकी होम स्क्रीन पर है।',
    'SOS and support': 'SOS और सहायता',
    'App lock': 'ऐप लॉक', 'Keep your notes private with a PIN.': 'PIN से अपने नोट्स निजी रखें।', 'Set a PIN': 'PIN सेट करें',
    'New PIN (4 to 6 digits)': 'नया PIN (4 से 6 अंक)', 'Type it again': 'फिर से लिखें', 'Current PIN': 'मौजूदा PIN',
    'Turn on app lock': 'ऐप लॉक चालू करें', 'Turn off app lock': 'ऐप लॉक बंद करें', 'Use Face ID or fingerprint': 'Face ID या फ़िंगरप्रिंट इस्तेमाल करें',
    'Use 4 to 6 digits.': '4 से 6 अंक इस्तेमाल करें।', 'The two PINs did not match.': 'दोनों PIN एक जैसे नहीं थे।',
    'App lock is on.': 'ऐप लॉक चालू है।', 'App lock is off.': 'ऐप लॉक बंद है।', 'That PIN did not match.': 'वह PIN मेल नहीं खाया।',
    'App lock is on. LoosenUp asks for your PIN when it opens.': 'ऐप लॉक चालू है। LoosenUp खुलने पर आपका PIN माँगता है।',
    'Face ID or fingerprint is not set up on this phone.': 'इस फ़ोन पर Face ID या फ़िंगरप्रिंट सेट नहीं है।',
    'Face ID or fingerprint is not available.': 'Face ID या फ़िंगरप्रिंट उपलब्ध नहीं है।',
    'Unlock LoosenUp': 'LoosenUp खोलें', 'Your notes stay private': 'आपके नोट्स निजी रहते हैं', 'Enter your PIN to open LoosenUp.': 'LoosenUp खोलने के लिए अपना PIN डालें।',
    'PIN': 'PIN', 'Forgot PIN?': 'PIN भूल गए?', 'Use your PIN instead.': 'इसकी जगह अपना PIN इस्तेमाल करें।',
    'For your privacy, the PIN cannot be recovered. You can restore a backup after starting fresh.': 'आपकी निजता के लिए PIN वापस नहीं मिल सकता। नई शुरुआत के बाद आप बैकअप वापस ला सकते हैं।',
    'That PIN did not match. Try again.': 'वह PIN मेल नहीं खाया। फिर से कोशिश करें।',
    'Take a breath. You can try again in a few seconds.': 'एक साँस लें। आप कुछ सेकंड में फिर कोशिश कर सकते हैं।',
    'Too many tries. Pause for 30 seconds, then try again.': 'बहुत बार कोशिश हुई। 30 सेकंड रुकें, फिर कोशिश करें।',
    'Appearance': 'दिखावट', 'Theme': 'थीम', 'Auto': 'अपने आप', 'Dark': 'गहरा',
    'Auto follows your phone, so LoosenUp turns gentle and dark at night.': '"अपने आप" आपके फ़ोन के हिसाब से चलता है, ताकि रात में LoosenUp कोमल और गहरा हो जाए।',
    'Language': 'भाषा', 'Hindi voice uses your phone\'s Hindi voice when it has one.': 'हिन्दी आवाज़ के लिए आपके फ़ोन की हिन्दी आवाज़ इस्तेमाल होती है, अगर उपलब्ध हो।',
    'Backup and restore': 'बैकअप और वापसी', 'Save a backup file': 'बैकअप फ़ाइल सेव करें', 'Restore from a backup file': 'बैकअप फ़ाइल से वापस लाएँ',
    'Your data lives only on this device.': 'आपका डेटा सिर्फ़ इसी डिवाइस पर रहता है।',
    'Your data lives only on this device. Save a backup file before changing phones.': 'आपका डेटा सिर्फ़ इसी डिवाइस पर रहता है। फ़ोन बदलने से पहले बैकअप फ़ाइल सेव करें।',
    'Keep it somewhere safe.': 'इसे किसी सुरक्षित जगह रखें।', 'Could not create the file on this device.': 'इस डिवाइस पर फ़ाइल नहीं बन सकी।',
    'That file is not a LoosenUp backup.': 'वह फ़ाइल LoosenUp का बैकअप नहीं है।',
    'Start fresh': 'नई शुरुआत', 'Start fresh?': 'नई शुरुआत करें?', 'Erase and start fresh': 'सब मिटाकर नई शुरुआत करें', 'Yes, start fresh': 'हाँ, नई शुरुआत करें',
    'This clears your garden, Seeds and history on this device so you can begin again.': 'इससे इस डिवाइस से आपका बगीचा, Seeds और इतिहास साफ़ हो जाता है, ताकि आप फिर से शुरू कर सकें।',
    'A fresh start. You can restore a backup from Me.': 'एक नई शुरुआत। आप "मैं" टैब से बैकअप वापस ला सकते हैं।',
    'A fresh start. Welcome back.': 'एक नई शुरुआत। फिर से स्वागत है।', 'Not now': 'अभी नहीं',
    'A fresh LoosenUp update is ready. It opens next time you launch the app.': 'LoosenUp का नया अपडेट तैयार है। अगली बार ऐप खोलने पर यह दिखेगा।',

    /* ---- Shop ---- */
    'Every guided break with no Seeds needed, every technique as it opens.': 'हर गाइडेड ब्रेक बिना Seeds के, हर तकनीक खुलते ही।',
    'Choose Full Bloom (demo)': 'Full Bloom चुनें (डेमो)', 'Quick breeze is always free. Prices are placeholders while LoosenUp is in preview.':
      'Quick breeze हमेशा मुफ़्त है। LoosenUp के प्रीव्यू तक कीमतें अस्थायी हैं।',
    'DEMO checkout': 'डेमो चेकआउट', 'DEMO checkout. Nothing is charged.': 'डेमो चेकआउट। कोई पैसा नहीं लिया जाता।',
    'This is a demo. Nothing is charged and no payment details are asked for.': 'यह एक डेमो है। कोई पैसा नहीं लिया जाता और भुगतान की कोई जानकारी नहीं माँगी जाती।',
    'Complete demo purchase': 'डेमो खरीद पूरी करें', 'Welcome to Full Bloom (demo). Enjoy every break.': 'Full Bloom (डेमो) में स्वागत है। हर ब्रेक का आनंद लें।',
    'Your choice. Enjoy it.': 'आपकी पसंद। आनंद लें।', 'Thank you. We are glad you are here.': 'धन्यवाद। हमें खुशी है कि आप यहाँ हैं।',
    'For hard moments': 'मुश्किल पलों के लिए'
  };

  /* Lower-case index, for strings such as "Still growing: shared loosenup". */
  var LOWER = {};
  Object.keys(HI).forEach(function (k) { LOWER[k.toLowerCase()] = HI[k]; });

  var CALM_LOWER = { 'a bit tangled': 'थोड़ा उलझा', 'very calm': 'बहुत शांत' };

  function list(s) {
    // "A, B and C" -> "A, B और C"
    var parts = s.split(/, | and /);
    var out = parts.map(function (p) { return look(p) || p; });
    if (out.length < 2) return out[0];
    return out.slice(0, -1).join(', ') + ' और ' + out[out.length - 1];
  }
  function look(s) {
    if (Object.prototype.hasOwnProperty.call(HI, s)) return HI[s];
    var l = s.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(LOWER, l)) return LOWER[l];
    return null;
  }
  function t(s) { var r = trCore(s); return r === null ? s : r; }

  var PATTERNS = [
    [/^Picked from your own breaks: (.+) averages ([+\-]?[\d.]+) Calm gain for "(.+)"\.$/, function (m) { return 'आपके अपने ब्रेक से चुना गया: "' + t(m[3]) + '" के लिए ' + m[1] + ' का औसत Calm gain ' + m[2] + ' है।'; }],
    [/^Picked for (.+), and it suits (.+) best\.$/, function (m) { return list(m[1]) + ' के लिए चुना गया, और यह ' + list(m[2]) + ' के लिए सबसे अच्छा है।'; }],
    [/^Picked for ([^.!?]+)\.$/, function (m) { return list(m[1]) + ' के लिए चुना गया।'; }],
    [/^(\d+) Seeds(, Full Bloom plan)?\. Open the Seed shop$/, function (m) { return m[1] + ' Seeds' + (m[2] ? ', Full Bloom प्लान' : '') + '। Seed दुकान खोलें'; }],
    [/^\+(\d+) Seeds added \(demo\)\.$/, function (m) { return '+' + m[1] + ' Seeds जोड़े गए (डेमो)।'; }],
    [/^(₹[\d,]+(?:\/mo)?) or (USD [\d.]+(?:\/mo)?)$/, function (m) { return (m[1] + ' या ' + m[2]).replace(/\/mo/g, '/माह'); }],
    [/^(₹[\d,]+|USD [\d.]+)\/mo$/, function (m) { return m[1] + '/माह'; }],
    [/^Step (\d+) of (\d+)$/, function (m) { return 'चरण ' + m[1] + ' / ' + m[2]; }],
    [/^Lesson (\d+) of (\d+)$/, function (m) { return 'पाठ ' + m[1] + ' / ' + m[2]; }],
    [/^Remove (.+)$/, function (m) { return t(m[1]) + ' हटाएँ'; }],
    [/^(.+?)\s+×$/, function (m) { return t(m[1]) + '  ×'; }],
    [/^(\d+) picked$/, function (m) { return m[1] + ' चुने गए'; }],
    [/^(\d+) (?:minutes|min)$/, function (m) { return m[1] + ' मिनट'; }],
    [/^Opens in (\d+) more breaks?$/, function (m) { return m[1] + ' और ब्रेक के बाद खुलेगा'; }],
    [/^Begin \(uses 1 of (\d+) Seeds?\)$/, function (m) { return 'शुरू करें (' + m[1] + ' Seeds में से 1 लगेगा)'; }],
    [/^Lovely, (.+)!$/, function (m) { return 'बहुत बढ़िया, ' + m[1] + '!'; }],
    [/^You showed up, ([^.!?]+)\.$/, function (m) { return m[1] + ', आपने अपने लिए समय निकाला।'; }],
    [/^(\d+) Seeds? left$/, function (m) { return m[1] + ' Seeds बाकी'; }],
    [/^You grew into a (.+)!$/, function (m) { return 'आप बढ़कर ' + m[1] + ' बन गए!'; }],
    [/^([^.!?]+) is now open for you\.$/, function (m) { return m[1] + ' अब आपके लिए खुल गया है।'; }],
    [/^Badge: (.+)$/, function (m) { return 'बैज: ' + t(m[1]); }],
    [/^(\d+) flowers?$/, function (m) { return m[1] + ' फूल'; }],
    [/^(\d+) flowers?\.$/, function (m) { return m[1] + ' फूल।'; }],
    [/^\+(\d+) flowers?$/, function (m) { return '+' + m[1] + ' फूल'; }],
    [/^(\d+)% of the way to (.+)$/, function (m) { return m[2] + ' तक ' + m[1] + '% रास्ता तय'; }],
    [/^(.+) progress$/, function (m) { return /^(Seedling|Sprout|Bud|Bloom|Meadow)$/.test(m[1]) ? m[1] + ' प्रगति' : null; }],
    [/^From your Good things jar: "([\s\S]*)"$/, function (m) { return 'आपके अच्छी बातों के जार से: "' + m[1] + '"'; }],
    [/^(\d+) small steps? today\.$/, function (m) { return 'आज ' + m[1] + (m[1] === '1' ? ' छोटा कदम।' : ' छोटे कदम।'); }],
    [/^(\d+) good things? saved in your jar\.$/, function (m) { return 'आपके जार में ' + m[1] + (m[1] === '1' ? ' अच्छी बात सेव है।' : ' अच्छी बातें सेव हैं।'); }],
    [/^Hi ([^,]+), it is me\.$/, function (m) { return 'नमस्ते ' + m[1] + ', मैं हूँ।'; }],
    [/^Hi ([^,]+), it is ([^.!?]+)\.$/, function (m) { return 'नमस्ते ' + m[1] + ', मैं ' + m[2] + ' हूँ।'; }],
    [/^I am here: (\S+)$/, function (m) { return 'मैं यहाँ हूँ: ' + m[1]; }],
    [/^Add my location to the message: (on|off)$/, function (m) { return 'संदेश में मेरी लोकेशन जोड़ें: ' + (m[1] === 'on' ? 'चालू' : 'बंद'); }],
    [/^SOS can now message (.+) in one tap\.$/, function (m) { return 'अब SOS एक टैप में ' + t(m[1]) + ' को संदेश भेज सकता है।'; }],
    [/^Message (.+) now$/, function (m) { return 'अभी ' + t(m[1]) + ' को संदेश भेजें'; }],
    [/^Your garden with (\d+) flowers?, level (.+)$/, function (m) { return 'आपका बगीचा, ' + m[1] + ' फूल, स्तर ' + m[2]; }],
    [/^(\d+) XP to ([^.!?]+)\.$/, function (m) { return m[2] + ' तक ' + m[1] + ' XP।'; }],
    [/^Still growing: (.+)$/, function (m) { return 'अभी बढ़ रहा है: ' + t(m[1]); }],
    [/^Calm gain for the last 7 days: (.+)$/, function (m) {
      return 'पिछले 7 दिनों का Calm gain: ' + m[1].split(', ').map(function (d) { var p = d.split(' '); return t(p[0]) + ' ' + p.slice(1).join(' '); }).join(', ');
    }],
    [/^([^.!?]+) lifts you most, with an average Calm gain of ([+\-]?[\d.]+)\.$/, function (m) { return m[1] + ' आपको सबसे ज़्यादा राहत देता है, औसत Calm gain ' + m[2] + ' के साथ।'; }],
    [/^([^.!?]+) are your brightest time for a break\.$/, function (m) { return t(m[1]) + ' ब्रेक के लिए आपका सबसे उजला समय है।'; }],
    [/^(.+)'s corner$/, function (m) { return m[1] + ' का कोना'; }],
    [/^Golden hour is set for ([\d:]+)\.$/, function (m) { return 'Golden hour ' + m[1] + ' पर सेट है।'; }],
    [/^Golden hour set for ([\d:]+)\.$/, function (m) { return 'Golden hour ' + m[1] + ' पर सेट हो गया।'; }],
    [/^Trusted person: ([^.!?]+)\.$/, function (m) { return 'भरोसेमंद व्यक्ति: ' + m[1] + '।'; }],
    [/^Share this link: (.+)$/, function (m) { return 'यह लिंक शेयर करें: ' + m[1]; }],
    [/^Game XP today: (\d+) of (\d+)\.$/, function (m) { return 'आज का गेम XP: ' + m[2] + ' में से ' + m[1] + '।'; }],
    [/^\+(\d+) XP for your garden\.$/, function (m) { return '+' + m[1] + ' XP आपके बगीचे के लिए।'; }],
    [/^You matched 6 pairs in (\d+) moves?(, your best yet!|\.)$/, function (m) { return 'आपने ' + m[1] + ' चालों में 6 जोड़े मिलाए' + (m[2] === '.' ? '।' : ', अब तक का सबसे अच्छा!'); }],
    [/^You caught (\d+) sunbeams?(, your brightest jar yet!|\.)$/, function (m) { return 'आपने ' + m[1] + ' Sunbeams पकड़ीं' + (m[2] === '.' ? '।' : ', अब तक का सबसे चमकीला जार!'); }],
    [/^You moved with the ring (\d+)% of the time\.$/, function (m) { return 'आप ' + m[1] + '% समय घेरे के साथ चले।'; }],
    [/^Card (\d+), face down$/, function (m) { return 'कार्ड ' + m[1] + ', उल्टा'; }],
    [/^Card (\d+), (.+?)(, matched)?$/, function (m) { return 'कार्ड ' + m[1] + ', ' + t(m[2]) + (m[3] ? ', मिल गया' : ''); }],
    [/^(\d+) of 6 pairs$/, function (m) { return '6 में से ' + m[1] + ' जोड़े'; }],
    [/^(\d+) of (\d+) blooms$/, function (m) { return m[2] + ' में से ' + m[1] + ' फूल'; }],
    [/^In your jar: (\d+)(\s+[\d:]+)?$/, function (m) { return 'आपके जार में: ' + m[1] + (m[2] || ''); }],
    [/^(\d+) sunbeams?$/, function (m) { return m[1] + ' Sunbeams'; }],
    [/^Next session: (.+)$/, function (m) { return 'अगला सेशन: ' + m[1]; }],
    [/^(.+?) at (\d\d:\d\d)\.$/, function (m) { return m[1] + ', ' + m[2] + ' बजे।'; }],
    [/^From (\d+) to (\d+)\.$/, function (m) { return m[1] + ' से ' + m[2] + ' तक।'; }],
    [/^Kinder thought: ([\s\S]+)$/, function (m) { return 'नरम विचार: ' + m[1]; }],
    [/^(\d+)\. (.+)$/, function (m) { var r = look(m[2]); return r ? m[1] + '. ' + r : null; }],
    [/^(\d+) (a bit tangled|very calm)$/, function (m) { return m[1] + ' ' + CALM_LOWER[m[2]]; }],
    [/^Backup saved as (\S+)\.$/, function (m) { return 'बैकअप ' + m[1] + ' नाम से सेव हुआ।'; }],
    [/^Welcome back, ([^.!?]+)\.$/, function (m) { return 'फिर से स्वागत है, ' + m[1] + '।'; }],
    [/^Use Face ID or fingerprint: (on|off)$/, function (m) { return 'Face ID या फ़िंगरप्रिंट: ' + (m[1] === 'on' ? 'चालू' : 'बंद'); }],
    [/^From your lesson: ([^.!?]+)\.$/, function (m) { return 'आपके पाठ से: ' + t(m[1]) + '।'; }],
    [/^Try (.+)$/, function (m) { return /^(Sigh of relief|Slow breeze|Here and now|Soft release|Let it out|Kind words|Desk reset|Steady square|Pause before replying|Cool down|Warm wishes|Quick breeze)$/.test(m[1]) ? m[1] + ' आज़माएँ' : null; }],
    [/^Good morning, (.+)$/, function (m) { return 'सुप्रभात, ' + m[1]; }],
    [/^Good afternoon, (.+)$/, function (m) { return 'नमस्ते, ' + m[1]; }],
    [/^Good evening, (.+)$/, function (m) { return 'शुभ संध्या, ' + m[1]; }],
    [/^Quiet night, (.+)$/, function (m) { return 'शांत रात, ' + m[1]; }]
  ];

  // Strings that need no translation: numbers, brand names and their combinations.
  var KEEP = /^[\s\d+\-.,:%×·!()]*$|^[+\-]?\d+ (Calm gain|XP|Seeds?|Sunny days?)[!.]?$|^(LoosenUp|SOS|PIN|XP|Tele-MANAS|WhatsApp|Full Bloom|Calm gain|Seeds?|Sunny days?|Sunny week|Rain day|Golden hour|Sunbeams?|Seedling|Sprout|Bud|Bloom|Meadow|Breath Bloom|Petal Pairs|Sunbeam Catch|Sigh of relief|Slow breeze|Here and now|Soft release|Let it out|Kind words|Desk reset|Steady square|Pause before replying|Cool down|Warm wishes|Quick breeze|findahelpline\.com|Vandrevala Foundation|iCall \(TISS\)|USD [\d.]+)( \d+%)?$/;

  function trCore(s) {
    if (look(s) !== null) return look(s);
    if (KEEP.test(s)) return s;
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = PATTERNS[i][0].exec(s);
      if (m) { var r = PATTERNS[i][1](m); if (r !== null) return r; }
    }
    // Lists such as "Everyday · 2" or "Here and now, Busy mind + Tight shoulders".
    var seps = [' · ', ' + ', ', '];
    for (var j = 0; j < seps.length; j++) {
      if (s.indexOf(seps[j]) === -1) continue;
      var parts = s.split(seps[j]), ok = true;
      var out = parts.map(function (p) { var r = trCore(p); if (r === null) ok = false; return r; });
      if (ok) return out.join(seps[j]);
    }
    // Several sentences joined together.
    var sentences = s.replace(/\bDr\. /g, 'Dr.\u0001').replace(/([.!?])\s+(?=[A-Z+"₹])/g, '$1\u0000').split('\u0000')
      .map(function (p) { return p.replace(/\u0001/g, ' '); });
    if (sentences.length > 1) {
      var good = true;
      var hi = sentences.map(function (p) {
        var r = trCore(p);
        if (r === null && /\.$/.test(p)) { r = trCore(p.slice(0, -1)); if (r !== null) r += '।'; }
        if (r === null) good = false;
        return r;
      });
      if (good) return hi.join(' ');
    }
    return null;
  }

  function tr(s) {
    if (s == null) return s;
    var str = String(s);
    var m = /^(\s*)([\s\S]*?)(\s*)$/.exec(str);
    if (!m[2]) return str;
    var r = trCore(m[2]);
    return r === null ? str : m[1] + r + m[3];
  }

  /* Hindi and Hinglish phrases that open SOS. JS word boundaries do not work with
     Devanagari, so those patterns match on the phrase itself. */
  var CRISIS_HI = [
    /आत्महत्या/, /ख़?ुदकुशी/, /खुदकुशी/, /मरना\s*चाह(ता|ती|ते)/, /मर\s*जाना\s*चाह(ता|ती|ते)/, /मर\s*जाऊँ|मर\s*जाऊं/,
    /जीना\s*नहीं\s*चाह(ता|ती|ते)/, /जीने\s*का\s*(मन|दिल)\s*नहीं/, /खुद\s*को\s*(नुकसान|चोट|ख़त्म|खत्म|मार)/,
    /अपनी\s*जान\s*(ले|दे)/, /जान\s*दे\s*(दूँ|दूं|दूँगा|दूंगा|दूँगी|दूंगी)/, /(ज़िंदगी|जिंदगी|ज़िन्दगी|जिन्दगी)\s*(ख़त्म|खत्म)/,
    /\bkhudkush[ie]\b/i, /\ba{1,2}tma?hatya\b/i, /\bmarna\s+chaht[aie]\b/i, /\bmar\s+jaa?na\s+(chaht|hai)/i, /\bmar\s+jaa?u+n?\b/i,
    /\bjeena\s+nahi+n?\s+chaht/i, /\bjeene\s+ka\s+(mann?|dil)\s+nahi/i, /\bkhud\s+ko\s+(nuksa+n|chot|khatam|khatm|maar)/i,
    /\bapni\s+jaan\s+(le|de)/i, /\b(zindagi|jindagi)\s+(khatam|khatm)\b/i, /\bjaan\s+de\s+du+n?g?[aie]?\b/i
  ];

  window.LoosenUpI18n = { hi: HI, tr: tr, crisis: CRISIS_HI, languages: { en: 'English', hi: 'हिन्दी' } };
})();

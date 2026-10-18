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

    /* ---- Programmes ---- */
    'Programmes': 'प्रोग्राम', 'Programme': 'प्रोग्राम', 'Your programme': 'आपका प्रोग्राम', 'Sleep, exams, burnout': 'नींद, परीक्षा, थकान',
    'A little each day': 'रोज़ थोड़ा सा', 'Your days': 'आपके दिन', 'Completed': 'पूरा हुआ', 'Start again': 'फिर से शुरू करें',
    'Start day 1': 'दिन 1 शुरू करें', "Start today's practice": 'आज का अभ्यास शुरू करें', 'Unlock with Full Bloom': 'Full Bloom से खोलें',
    'Done for today.': 'आज का पूरा हुआ।', 'first 3 free': 'पहले 3 मुफ़्त',
    'Short daily plans with one tip and one exercise a day. The first 3 days of each are free; Full Bloom opens the rest.':
      'रोज़ के छोटे प्लान, हर दिन एक सुझाव और एक अभ्यास। हर प्लान के पहले 3 दिन मुफ़्त हैं, बाकी Full Bloom में खुलते हैं।',
    'Days 1 to 3 are free. Day 4 onwards is part of Full Bloom.': 'दिन 1 से 3 मुफ़्त हैं। दिन 4 से आगे Full Bloom का हिस्सा है।',
    'Day 4 onwards of every programme is part of Full Bloom.': 'हर प्रोग्राम का दिन 4 से आगे का हिस्सा Full Bloom में है।',
    'Keep the habits that helped. You can start again any time.': 'जो आदतें काम आईं, उन्हें जारी रखें। आप कभी भी फिर से शुरू कर सकते हैं।',
    'Every guided programme, all days: Better sleep in 21 days, Exam calm, Recovering from burnout': 'हर गाइडेड प्रोग्राम, सारे दिन: 21 दिनों में बेहतर नींद, परीक्षा में शांति, थकान से उबरना',
    'Every guided break with no Seeds needed': 'हर गाइडेड ब्रेक, बिना Seeds के', 'Every technique as it opens': 'हर तकनीक, खुलते ही',
    'Choose monthly (demo)': 'मासिक चुनें (डेमो)', 'Choose yearly (demo)': 'वार्षिक चुनें (डेमो)', 'Save 55%': '55% बचत',
    'Full Bloom, yearly': 'Full Bloom, वार्षिक', 'Finisher': 'पूरा करने वाले', 'Finished a guided programme': 'एक गाइडेड प्रोग्राम पूरा किया',
    'A gentle 21 day plan for falling asleep more easily and waking up fresher.': '21 दिन का एक कोमल प्लान, आसानी से सोने और ताज़ा जागने के लिए।',
    'Two weeks of focus, steady breathing and kind self-talk for students.': 'छात्रों के लिए दो हफ़्ते का ध्यान, स्थिर साँसें और खुद से प्यारी बातें।',
    'Three weeks to rebuild your energy, set clear limits and rest well.': 'तीन हफ़्ते, अपनी ऊर्जा फिर से बनाने, साफ़ सीमाएँ तय करने और अच्छे से आराम करने के लिए।',
    'Set your anchor': 'अपना लंगर तय करें', 'Pick one wake time and keep it all week, even on weekends. Tonight, just notice when you feel sleepy.': 'जागने का एक समय चुनें और पूरे हफ़्ते उसे रखें, छुट्टी के दिन भी। आज रात बस देखें कि नींद कब आती है।',
    'Dim the last hour': 'आख़िरी घंटा धीमा करें', 'One hour before bed, lower the lights and the screen brightness. Dim light tells your body it is time to rest.': 'सोने से एक घंटा पहले रोशनी और स्क्रीन की चमक कम करें। धीमी रोशनी शरीर को बताती है कि आराम का समय है।',
    'Park your thoughts': 'विचारों को किनारे रखें', "Write tomorrow's top three tasks on paper before bed, so your mind can set them down.": 'सोने से पहले कल के तीन सबसे ज़रूरी काम कागज़ पर लिख लें, ताकि मन उन्हें छोड़ सके।',
    'A cool, quiet room': 'ठंडा, शांत कमरा', 'Make the room a little cooler and darker tonight. Small changes add up.': 'आज रात कमरे को थोड़ा ठंडा और अँधेरा रखें। छोटे बदलाव जुड़ते जाते हैं।',
    'Long breaths out': 'लंबी साँसें छोड़ें', 'In bed, breathe out for longer than you breathe in, for a few slow rounds.': 'बिस्तर में कुछ धीमे दौर तक, साँस लेने से ज़्यादा लंबी साँस छोड़ें।',
    'Tea and coffee earlier': 'चाय और कॉफ़ी जल्दी', 'Try no tea or coffee after 2pm today and notice how the evening feels.': 'आज दोपहर 2 बजे के बाद चाय या कॉफ़ी न लें, और देखें कि शाम कैसी लगती है।',
    'Look back kindly': 'प्यार से पीछे देखें', 'Notice one night this week that went a little better. What helped?': 'इस हफ़्ते की एक रात याद करें जो थोड़ी बेहतर रही। किस चीज़ ने मदद की?',
    'Morning light': 'सुबह की रोशनी', 'Get ten minutes of daylight soon after waking. It helps set your body clock.': 'जागने के बाद जल्दी दस मिनट धूप लें। इससे शरीर की घड़ी सही होती है।',
    'The bed is for sleep': 'बिस्तर नींद के लिए है', 'If you have been awake in bed for a long while, get up and do something calm in dim light, then return.': 'अगर आप बहुत समय तक बिस्तर में जागते रहे हैं, तो उठकर धीमी रोशनी में कुछ शांत करें, फिर लौटें।',
    'Soften the body': 'शरीर को ढीला करें', 'Relax each part of the body, from shoulders to toes, as you lie down.': 'लेटते समय कंधों से पैरों की उँगलियों तक, शरीर के हर हिस्से को ढीला छोड़ें।',
    'Screens down': 'स्क्रीन दूर', 'Put the phone to charge out of reach of the bed tonight.': 'आज रात फ़ोन को बिस्तर की पहुँच से दूर चार्ज पर लगाएँ।',
    'A worry window': 'फ़िक्र का समय', 'Give your thoughts ten minutes on paper in the early evening, so they are not saved for bedtime.': 'शाम को जल्दी दस मिनट अपने विचार कागज़ पर लिखें, ताकि वे सोने के समय के लिए न बचें।',
    'Gentle movement': 'हल्की हलचल', 'A short walk or stretch during the day can make sleep come more easily.': 'दिन में थोड़ा टहलना या स्ट्रेच करना नींद को आसान बना सकता है।',
    'Halfway there': 'आधा रास्ता', 'Two weeks in. Notice what has changed, even slightly.': 'दो हफ़्ते हो गए। देखें कि क्या बदला है, चाहे थोड़ा सा ही।',
    'Same time, every day': 'हर दिन एक ही समय', 'Keep the wake time steady, even after a short night. Your body learns the rhythm.': 'छोटी रात के बाद भी जागने का समय एक जैसा रखें। शरीर लय सीख जाता है।',
    'Lighter dinners': 'हल्का रात का खाना', 'Try finishing dinner two to three hours before bed.': 'सोने से दो तीन घंटे पहले रात का खाना खत्म करने की कोशिश करें।',
    'A wind down ritual': 'सोने से पहले की आदत', 'Choose three calm steps for every night, like washing up, a soft sound and slow breathing.': 'हर रात के लिए तीन शांत कदम चुनें, जैसे हाथ मुँह धोना, कोई धीमी आवाज़ और धीमी साँसें।',
    'If you wake at night': 'अगर रात में नींद खुले', 'Keep the lights low, skip the clock, and return to slow breathing.': 'रोशनी कम रखें, घड़ी न देखें, और धीमी साँसों पर लौट आएँ।',
    'Naps with care': 'सोच समझकर झपकी', 'If you nap, keep it short and before mid afternoon.': 'अगर झपकी लें, तो छोटी रखें और दोपहर के बीच से पहले लें।',
    'Kind words at night': 'रात को प्यारे शब्द', 'Speak to yourself gently tonight, the way you would to a tired friend.': 'आज रात खुद से नरमी से बात करें, जैसे किसी थके दोस्त से करते हैं।',
    'Your sleep plan': 'आपका नींद का प्लान', 'Pick the three habits that helped most and keep them. You did this.': 'तीन सबसे मददगार आदतें चुनें और उन्हें जारी रखें। यह आपने किया।',
    'Map the next two weeks': 'अगले दो हफ़्तों का नक्शा', 'Write every exam date and topic on one page, so it lives on paper, not in your head.': 'हर परीक्षा की तारीख और विषय एक पन्ने पर लिखें, ताकि वह दिमाग में नहीं, कागज़ पर रहे।',
    'Study in rounds': 'दौर में पढ़ाई', 'Try 25 minutes of focus, then a 5 minute break away from the screen.': '25 मिनट ध्यान से पढ़ें, फिर स्क्रीन से दूर 5 मिनट का ब्रेक लें।',
    'Breathe before you start': 'शुरू करने से पहले साँस', 'Before each study round, take one steady square breath.': 'हर पढ़ाई के दौर से पहले एक स्थिर चौकोर साँस लें।',
    'Sleep is study time': 'नींद भी पढ़ाई का समय है', 'Your memory sorts what you learned while you sleep. Protect at least seven hours.': 'सोते समय आपकी याददाश्त सीखी हुई चीज़ें सँभालती है। कम से कम सात घंटे की नींद बचाएँ।',
    'One topic at a time': 'एक बार में एक विषय', 'When the list feels long, pick only the next small topic.': 'जब सूची लंबी लगे, तो बस अगला छोटा विषय चुनें।',
    'Move a little': 'थोड़ा चलें', 'A ten minute walk between study rounds can refresh your focus.': 'पढ़ाई के दौर के बीच दस मिनट टहलना ध्यान को ताज़ा कर सकता है।',
    'Talk to yourself kindly': 'खुद से प्यार से बात करें', 'Swap "I will never get this" for "I am still learning this."': '"यह मुझसे कभी नहीं होगा" की जगह कहें "मैं अभी यह सीख रहा या रही हूँ।"',
    'Practise like the real thing': 'असली परीक्षा की तरह अभ्यास', 'Do one past paper with a timer, then rest.': 'टाइमर लगाकर एक पुराना पेपर करें, फिर आराम करें।',
    'Fuel and water': 'खाना और पानी', 'Keep water nearby and eat regular meals. Your brain runs on them.': 'पानी पास रखें और समय पर खाना खाएँ। दिमाग इन्हीं से चलता है।',
    'When your mind goes blank': 'जब दिमाग खाली हो जाए', 'Put the pen down, take a long breath out, and read the question again slowly.': 'पेन नीचे रखें, एक लंबी साँस छोड़ें, और सवाल फिर से धीरे पढ़ें।',
    'Ask for help early': 'जल्दी मदद माँगें', 'Message a teacher or a friend about one topic you are unsure of.': 'जिस विषय पर पक्का नहीं हैं, उसके बारे में किसी शिक्षक या दोस्त को संदेश भेजें।',
    'Phone in another room': 'फ़ोन दूसरे कमरे में', 'Keep the phone out of the room during study rounds.': 'पढ़ाई के दौर में फ़ोन कमरे से बाहर रखें।',
    'The night before': 'परीक्षा से पहले की रात', 'Light revision only, pack your things, and wind down early.': 'बस हल्का दोहराना, अपना सामान रख लें, और जल्दी आराम करें।',
    'Exam morning': 'परीक्षा की सुबह', 'Eat something, reach the hall with time to spare, and take three slow breaths before you begin.': 'कुछ खा लें, समय रहते हॉल पहुँचें, और शुरू करने से पहले तीन धीमी साँसें लें।',
    'Name what drains you': 'पहचानें कि क्या थकाता है', 'Write down the three things that take the most energy from you right now.': 'वे तीन चीज़ें लिखें जो इस समय आपकी सबसे ज़्यादा ऊर्जा लेती हैं।',
    'One real break': 'एक असली ब्रेक', 'Take one break today away from all screens, even for five minutes.': 'आज सारी स्क्रीन से दूर एक ब्रेक लें, चाहे पाँच मिनट का ही।',
    'A clear end to the day': 'दिन का साफ़ अंत', 'Choose a time to stop work today, and close the laptop then.': 'आज काम रोकने का एक समय चुनें, और तब लैपटॉप बंद कर दें।',
    'Sleep first': 'पहले नींद', 'Protect your sleep tonight. Recovery starts there.': 'आज रात अपनी नींद बचाएँ। सुधार वहीं से शुरू होता है।',
    'Say no to one thing': 'एक चीज़ को ना कहें', 'Turn down or postpone one task that can wait.': 'एक काम जो रुक सकता है, उसे मना करें या आगे बढ़ाएँ।',
    'Move your body': 'शरीर को चलाएँ', 'Ten minutes of walking or stretching today.': 'आज दस मिनट टहलें या स्ट्रेच करें।',
    'Notice the small wins': 'छोटी जीतें देखें', 'Write one thing you handled well this week.': 'इस हफ़्ते की एक चीज़ लिखें जो आपने अच्छे से सँभाली।',
    'One task at a time': 'एक बार में एक काम', 'Work on one task for an hour with notifications off.': 'नोटिफ़िकेशन बंद करके एक घंटे तक एक ही काम करें।',
    'Lunch away from the desk': 'डेस्क से दूर लंच', 'Eat one meal today without a screen.': 'आज एक बार का खाना बिना स्क्रीन के खाएँ।',
    'Ask for what you need': 'जो चाहिए, वह माँगें', 'Tell your manager or a colleague one thing that would help.': 'अपने मैनेजर या किसी साथी को एक चीज़ बताएँ जिससे मदद मिलेगी।',
    'Reconnect': 'फिर से जुड़ें', 'Spend time with someone who leaves you feeling lighter.': 'किसी ऐसे व्यक्ति के साथ समय बिताएँ जिसके साथ आप हल्का महसूस करते हैं।',
    'Your energy map': 'आपकी ऊर्जा का नक्शा', 'Notice the hours when you feel most awake, and plan focused work there.': 'देखें कि किन घंटों में आप सबसे ज़्यादा चुस्त रहते हैं, और ध्यान वाला काम तभी रखें।',
    'Slow mornings': 'धीमी सुबह', 'Start the day without email for the first 30 minutes.': 'दिन के पहले 30 मिनट बिना ईमेल के शुरू करें।',
    'Halfway check': 'आधे रास्ते की जाँच', 'Compare today with day one. What feels a little lighter?': 'आज की तुलना पहले दिन से करें। क्या थोड़ा हल्का लगता है?',
    'Limits in writing': 'सीमाएँ लिखकर', 'Put your working hours on your calendar and your status.': 'अपने काम के घंटे कैलेंडर और स्टेटस में लिख दें।',
    'Something just for you': 'कुछ सिर्फ़ आपके लिए', 'Do one thing today purely because you enjoy it.': 'आज एक काम सिर्फ़ इसलिए करें क्योंकि वह आपको अच्छा लगता है।',
    'Let your shoulders and jaw go soft a few times today.': 'आज कुछ बार अपने कंधों और जबड़े को ढीला छोड़ें।',
    'Rest is part of the work': 'आराम भी काम का हिस्सा है', 'Treat rest as part of your job, not a reward for finishing it.': 'आराम को अपने काम का हिस्सा मानें, काम खत्म करने का इनाम नहीं।',
    'Talk it through': 'बात करके देखें', 'If heavy days keep coming, talking to a counsellor can really help. Find support lists real options.': 'अगर भारी दिन आते रहें, तो किसी काउंसलर से बात करना सच में मदद कर सकता है। सहायता खोजें में असली विकल्प हैं।',
    'Plan next week': 'अगले हफ़्ते की योजना', "Put two short breaks a day into next week's calendar.": 'अगले हफ़्ते के कैलेंडर में रोज़ दो छोटे ब्रेक रखें।',
    'Keep what works': 'जो काम करे, उसे रखें', 'Choose three habits from these weeks to keep going.': 'इन हफ़्तों की तीन आदतें चुनें और उन्हें जारी रखें।',
    'Better sleep in 21 days': '21 दिनों में बेहतर नींद', 'Exam calm': 'परीक्षा में शांति', 'Recovering from burnout': 'थकान से उबरना',

    /* ---- Organisations ---- */
    'Your organisation': 'आपका संगठन', 'Join code': 'जॉइन कोड', 'Join': 'जुड़ें', 'Set up LoosenUp for your organisation': 'अपने संगठन के लिए LoosenUp सेट करें',
    'If your college or company uses LoosenUp, add its join code. Your notes and breaks stay on this phone.': 'अगर आपका कॉलेज या कंपनी LoosenUp इस्तेमाल करती है, तो उसका जॉइन कोड डालें। आपके नोट्स और ब्रेक इसी फ़ोन पर रहते हैं।',
    'For example, LUAB12CD': 'जैसे, LUAB12CD',
    'The pulse is only weekly averages: mood, Calm gain, number of breaks and your top feelings. No names, no notes, nothing about SOS. Your organisation sees a week only when 5 or more people share.':
      'पल्स में सिर्फ़ हफ़्ते के औसत होते हैं: मूड, Calm gain, ब्रेक की गिनती और आपकी मुख्य भावनाएँ। कोई नाम नहीं, कोई नोट्स नहीं, SOS के बारे में कुछ नहीं। आपका संगठन कोई हफ़्ता तभी देखता है जब 5 या ज़्यादा लोग शेयर करें।',
    'Leave this organisation': 'यह संगठन छोड़ें', 'You left the organisation.': 'आपने संगठन छोड़ दिया।',
    'Add the join code from your organisation.': 'अपने संगठन का जॉइन कोड डालें।', 'Checking the code...': 'कोड जाँच रहे हैं...',
    'Connect to the internet to join.': 'जुड़ने के लिए इंटरनेट से कनेक्ट करें।', 'That code was not found. Check it with your organisation.': 'यह कोड नहीं मिला। अपने संगठन से जाँच लें।',

    /* ---- Real services ---- */
    'Book a session online': 'ऑनलाइन सेशन बुक करें', 'Real services you can book today, by video, phone or chat. Prices are as listed on their sites.': 'असली सेवाएँ, जिन्हें आप आज ही वीडियो, फ़ोन या चैट से बुक कर सकते हैं। कीमतें उनकी साइट पर दी गई हैं।',
    'All': 'सभी', 'Therapy': 'थेरेपी', 'Psychiatry': 'मनोचिकित्सा', 'Hindi': 'हिन्दी', 'Show': 'दिखाएँ',
    'In person, in your city': 'आपके शहर में, आमने सामने', 'Government hospitals with low-cost psychiatry OPDs, plus trusted clinics and NGOs.': 'कम खर्च वाली मनोचिकित्सा OPD वाले सरकारी अस्पताल, और भरोसेमंद क्लिनिक और NGO।',
    'Use my location': 'मेरी लोकेशन इस्तेमाल करें', 'Or choose a city': 'या कोई शहर चुनें', 'Choose a city': 'शहर चुनें',
    'Open their site': 'उनकी साइट खोलें', 'Book on their site': 'उनकी साइट पर बुक करें', 'Directions': 'रास्ता', 'Website': 'वेबसाइट',
    'Nothing matches that filter yet.': 'इस फ़िल्टर से अभी कुछ नहीं मिला।', 'Finding places near you...': 'आपके पास की जगहें खोज रहे हैं...',
    'Location is not available here. Choose a city instead.': 'यहाँ लोकेशन उपलब्ध नहीं है। इसकी जगह कोई शहर चुनें।', 'Location is off. Choose a city instead.': 'लोकेशन बंद है। इसकी जगह कोई शहर चुनें।',
    'No listed city is close by yet. The map search below finds options near you.': 'अभी कोई सूचीबद्ध शहर पास नहीं है। नीचे दी गई मैप खोज आपके पास के विकल्प ढूँढती है।',
    'Free helpline': 'मुफ़्त हेल्पलाइन', 'Psychology and psychiatry': 'मनोविज्ञान और मनोचिकित्सा', 'Psychology': 'मनोविज्ञान', 'Counselling and psychiatry': 'काउंसलिंग और मनोचिकित्सा',
    'AI self help plus human coaches': 'AI से खुद की मदद, और इंसानी कोच', 'Government hospital': 'सरकारी अस्पताल', 'Private hospital': 'निजी अस्पताल', 'Clinic': 'क्लिनिक', 'NGO': 'NGO',
    'Low-cost OPD': 'कम खर्च वाली OPD', 'Paid': 'शुल्क सहित',
    'Phone': 'फ़ोन', 'Video': 'वीडियो', 'Chat': 'चैट', 'In person': 'आमने सामने',
    'English': 'अंग्रेज़ी', 'Marathi': 'मराठी', 'Gujarati': 'गुजराती', 'Punjabi': 'पंजाबी', 'Bengali': 'बांग्ला', 'Tamil': 'तमिल', 'Telugu': 'तेलुगु',
    'Malayalam': 'मलयालम', 'Konkani': 'कोंकणी', 'Assamese': 'असमिया', 'Kannada': 'कन्नड़', 'Urdu': 'उर्दू',
    '18 more Indian languages': '18 और भारतीय भाषाएँ', 'More Indian languages': 'और भारतीय भाषाएँ', 'Other Indian languages on calls by request': 'कॉल पर, माँगने पर दूसरी भारतीय भाषाएँ',
    'Delhi': 'दिल्ली', 'Mumbai': 'मुंबई', 'Bengaluru': 'बेंगलुरु', 'Chennai': 'चेन्नई', 'Kolkata': 'कोलकाता', 'Hyderabad': 'हैदराबाद', 'Pune': 'पुणे',
    'Ahmedabad': 'अहमदाबाद', 'Jaipur': 'जयपुर', 'Lucknow': 'लखनऊ', 'Chandigarh': 'चंडीगढ़', 'Kochi': 'कोच्चि',
    'Free national mental health helpline, open 24x7. Dial 14416 or 1-800-891-4416 to talk to a trained counsellor, with referral to a specialist when needed.': 'राष्ट्रीय मुफ़्त मानसिक स्वास्थ्य हेल्पलाइन, 24x7 खुली। प्रशिक्षित काउंसलर से बात करने के लिए 14416 या 1-800-891-4416 डायल करें, ज़रूरत पड़ने पर विशेषज्ञ के पास भेजा जाता है।',
    'Free counselling by phone, email and chat from the Tata Institute of Social Sciences. Call 9152987821, Monday to Saturday, 8 am to 9 pm.': 'टाटा इंस्टिट्यूट ऑफ़ सोशल साइंसेज़ की ओर से फ़ोन, ईमेल और चैट पर मुफ़्त काउंसलिंग। सोमवार से शनिवार, सुबह 8 से रात 9 बजे, 9152987821 पर कॉल करें।',
    'Free helpline open 24x7 by call or WhatsApp on +91 9999 666 555, plus paid video or phone sessions with a counsellor you choose.': '+91 9999 666 555 पर कॉल या WhatsApp से 24x7 मुफ़्त हेल्पलाइन, साथ ही अपने चुने काउंसलर के साथ शुल्क वाले वीडियो या फ़ोन सेशन।',
    'Free toll free helpline open 24x7 on 1800-120-820050, run by Mpower (Aditya Birla Education Trust) with the BMC and the Government of Maharashtra.': '1800-120-820050 पर 24x7 मुफ़्त टोल फ़्री हेल्पलाइन, Mpower (आदित्य बिड़ला एजुकेशन ट्रस्ट) द्वारा BMC और महाराष्ट्र सरकार के साथ।',
    'Book a therapist or psychiatrist online, or visit an Amaha centre in Bengaluru, Mumbai or Delhi NCR.': 'थेरेपिस्ट या मनोचिकित्सक को ऑनलाइन बुक करें, या बेंगलुरु, मुंबई या दिल्ली NCR में Amaha सेंटर जाएँ।',
    'Pick a counselling or clinical psychologist from listed profiles and book a 60 minute online session.': 'सूची में से कोई काउंसलिंग या क्लिनिकल मनोवैज्ञानिक चुनें और 60 मिनट का ऑनलाइन सेशन बुक करें।',
    'Online therapy and psychiatry by video or chat with an in house team of psychologists and psychiatrists.': 'उनकी अपनी मनोवैज्ञानिकों और मनोचिकित्सकों की टीम के साथ वीडियो या चैट पर ऑनलाइन थेरेपी और मनोचिकित्सा।',
    'Online counselling by video, call or chat with one price across all counsellors, plus psychiatrist sessions.': 'वीडियो, कॉल या चैट पर ऑनलाइन काउंसलिंग, सभी काउंसलर के लिए एक ही कीमत, साथ ही मनोचिकित्सक के सेशन।',
    'Online therapy by chat, call or video, with prime and essential plans and combined psychiatry packages.': 'चैट, कॉल या वीडियो पर ऑनलाइन थेरेपी, प्राइम और एसेंशियल प्लान और मनोचिकित्सा वाले पैकेज के साथ।',
    'Consult a psychiatrist online by audio or video call, with a digital prescription and a free follow up within 7 days.': 'ऑडियो या वीडियो कॉल पर मनोचिकित्सक से ऑनलाइन सलाह लें, डिजिटल पर्चे और 7 दिन में एक मुफ़्त फ़ॉलो अप के साथ।',
    'AI chat companion for everyday wellbeing that is free to use, with paid human coach sessions in the premium plan. It is not therapy.': 'रोज़ की भलाई के लिए AI चैट साथी, जो मुफ़्त है, और प्रीमियम प्लान में शुल्क वाले इंसानी कोच सेशन। यह थेरेपी नहीं है।',
    'Free (usual call charges apply)': 'मुफ़्त (सामान्य कॉल शुल्क लगता है)', 'Free helpline; paid sessions from ₹750 per session': 'मुफ़्त हेल्पलाइन; शुल्क वाले सेशन ₹750 प्रति सेशन से',
    '₹1,700 to ₹4,400 per 50 minute therapy session (listed therapists)': '50 मिनट के थेरेपी सेशन के ₹1,700 से ₹4,400 (सूचीबद्ध थेरेपिस्ट)',
    '₹900 to ₹2,400 per 60 minute session (listed therapists)': '60 मिनट के सेशन के ₹900 से ₹2,400 (सूचीबद्ध थेरेपिस्ट)',
    '₹1,000 to ₹3,950 per session (listed experts)': 'प्रति सेशन ₹1,000 से ₹3,950 (सूचीबद्ध विशेषज्ञ)',
    '₹969 to ₹1,299 per 45 minute session, depending on plan size': '45 मिनट के सेशन के ₹969 से ₹1,299, प्लान के आकार के हिसाब से',
    '₹1,000 to ₹1,799 per session, depending on plan': 'प्रति सेशन ₹1,000 से ₹1,799, प्लान के हिसाब से',
    'From ₹799 per psychiatry consult': 'मनोचिकित्सा सलाह ₹799 से', 'AI chat free; human coaching at extra cost (See site)': 'AI चैट मुफ़्त; इंसानी कोचिंग अलग शुल्क पर (साइट देखें)',

    'A calm human voice guides each break, in English or Hindi.': 'एक शांत इंसानी आवाज़ हर ब्रेक में साथ देती है, अंग्रेज़ी या हिन्दी में।',
    "The voice is Anchit, the maker of LoosenUp, recreated from Anchit's own recording with an open AI voice model. Lines not yet recorded use your device voice.":
      'यह आवाज़ LoosenUp बनाने वाले Anchit की है, जिसे Anchit की अपनी रिकॉर्डिंग से एक ओपन AI वॉइस मॉडल से बनाया गया है। जो पंक्तियाँ अभी रिकॉर्ड नहीं हुईं, वे आपके डिवाइस की आवाज़ में सुनाई देती हैं।',

    /* ---- 2.0: plain wellbeing wording ---- */
    'Bright sun': 'सूरज', 'Moon': 'चाँद', 'Cloud': 'बादल', 'Wave': 'लहर', 'Star': 'तारा', 'Heart': 'दिल',
    'Two calm minutes to loosen up and feel lighter. Ease a tense workday, soften a heavy mood, and see your Calm gain grow over the weeks.':
      'ढीला होने और हल्का महसूस करने के लिए दो शांत मिनट। खिंचे हुए कामकाजी दिन को आसान बनाएँ, भारी मूड को नरम करें, और हफ़्तों में अपना Calm gain बढ़ते देखें।',
    'How LoosenUp helps': 'LoosenUp कैसे मदद करता है', 'Hi': 'नमस्ते', ', here is how it works': ', यह ऐसे काम करता है',
    'Notice how you feel': 'देखें कि आप कैसा महसूस करते हैं', 'Rate your calm from 1 to 10. It takes a second.': 'अपनी शांति को 1 से 10 में आँकें। बस एक पल लगता है।',
    'Take two calm minutes': 'दो शांत मिनट लें', 'A guided exercise picked for what you are carrying.': 'आप जो मन में लिए हैं, उसके लिए चुना गया एक गाइडेड अभ्यास।',
    'See your Calm gain': 'अपना Calm gain देखें', 'Rate again, and watch what really helps you over the weeks.': 'फिर से आँकें, और हफ़्तों में देखें कि सच में क्या मदद करता है।',
    'Every break, tool and SOS is free, always. Nothing leaves your phone.': 'हर ब्रेक, टूल और SOS हमेशा मुफ़्त है। कुछ भी आपके फ़ोन से बाहर नहीं जाता।',
    'Streak': 'लगातार दिन', 'This week': 'इस हफ़्ते', 'Your average': 'आपका औसत', 'Your daily reminder.': 'आपका रोज़ का रिमाइंडर।',
    'How is your mood today?': 'आज आपका मूड कैसा है?', 'Crying': 'रोना आ रहा है', 'Sad': 'उदास', 'Decent': 'ठीक ठाक अच्छा', 'Happy': 'खुश',
    'Day streak': 'लगातार दिन', 'Gentle games with nothing to rush.': 'कोमल खेल, बिना किसी जल्दी के।', 'Calm Pairs': 'Calm Pairs', 'Breathing Ring': 'Breathing Ring',
    'Turn the cards and find the pairs.': 'कार्ड पलटें और जोड़े खोजें।', 'How you are really doing': 'आप सच में कैसे हैं',
    'Calm breaks': 'शांत ब्रेक', 'Average Calm gain': 'औसत Calm gain', 'Wellbeing': 'मन की भलाई', 'What helps you most': 'आपको सबसे ज़्यादा क्या मदद करता है',
    'Take the wellbeing check': 'मन की जाँच करें', 'Milestones': 'पड़ाव', 'Your plan': 'आपका प्लान', 'See LoosenUp Plus': 'LoosenUp Plus देखें',
    'Daily reminder': 'रोज़ का रिमाइंडर', 'Reminder time': 'रिमाइंडर का समय', 'Turn off the reminder': 'रिमाइंडर बंद करें',
    'Know someone who could use two calm minutes? Send them LoosenUp.': 'किसी को जानते हैं जिसे दो शांत मिनट चाहिए? उन्हें LoosenUp भेजें।',
    'Progress': 'प्रगति', 'Your progress': 'आपकी प्रगति', 'LoosenUp Plus': 'LoosenUp Plus',
    'Every guided programme, every day: Better sleep in 21 days, Exam calm, Recovering from burnout': 'हर गाइडेड प्रोग्राम, हर दिन: 21 दिनों में बेहतर नींद, परीक्षा में शांति, थकान से उबरना',
    'New programmes as they arrive': 'नए प्रोग्राम, जैसे ही आएँ', 'Supports free calm breaks and SOS for everyone': 'सबके लिए मुफ़्त शांत ब्रेक और SOS को सहारा देता है',
    'Every calm break, tool and SOS stays free. Prices are placeholders while LoosenUp is in preview.': 'हर शांत ब्रेक, टूल और SOS मुफ़्त रहता है। LoosenUp के प्रीव्यू तक कीमतें अस्थायी हैं।',
    'This clears your history and settings on this device so you can begin again.': 'इससे इस डिवाइस से आपका इतिहास और सेटिंग साफ़ हो जाती हैं, ताकि आप फिर से शुरू कर सकें।',
    'Keep my data': 'मेरा डेटा रखें', 'Tiny actions count, and each one lifts your day a little.': 'छोटे काम भी मायने रखते हैं, और हर एक आपके दिन को थोड़ा बेहतर बनाता है।',
    'One rest day a week keeps your streak going.': 'हफ़्ते में एक आराम का दिन आपके लगातार दिनों को जारी रखता है।',
    "This week's rest day is already used.": 'इस हफ़्ते का आराम का दिन इस्तेमाल हो चुका है।',
    'Short, gentle games for a busy mind.': 'भरे हुए मन के लिए छोटे, कोमल खेल।', 'Play as long as you like. There is nothing to rush.': 'जितना चाहें खेलें। कोई जल्दी नहीं है।',
    'Not yet': 'अभी नहीं', 'Take the two-week check below.': 'नीचे दो हफ़्ते की जाँच करें।',
    'First break': 'पहला ब्रेक', 'Your first calm break': 'आपका पहला शांत ब्रेक', 'Three days of practice in a row': 'लगातार तीन दिन अभ्यास',
    'A full week of practice': 'पूरे एक हफ़्ते का अभ्यास', 'Three weeks: a real habit': 'तीन हफ़्ते: एक सच्ची आदत', 'A whole month of practice': 'पूरे एक महीने का अभ्यास',
    'Ten calm breaks taken': 'दस शांत ब्रेक लिए', 'Tried every exercise': 'हर अभ्यास आज़माया', 'Shared LoosenUp with someone': 'किसी के साथ LoosenUp शेयर किया',
    'Set a daily reminder': 'रोज़ का रिमाइंडर सेट किया', 'Shared LoosenUp': 'LoosenUp शेयर किया',
    'Free: every calm break, tool and SOS, always.': 'मुफ़्त: हर शांत ब्रेक, टूल और SOS, हमेशा।', 'LoosenUp Plus (demo): every programme, every day.': 'LoosenUp Plus (डेमो): हर प्रोग्राम, हर दिन।',
    'Turn two cards at a time. Matching pairs stay open. Take all the time you like.': 'एक बार में दो कार्ड पलटें। मिलते जोड़े खुले रहते हैं। जितना चाहें उतना समय लें।',
    'All pairs matched': 'सारे जोड़े मिल गए', 'Six slow breaths': 'छह धीमी साँसें',
    'Press and hold while the ring grows to breathe in. Let go as it shrinks to breathe out. Six slow breaths.': 'जब घेरा बड़ा हो, दबाकर रखें और साँस लें। जब छोटा हो, छोड़ दें और साँस छोड़ें। छह धीमी साँसें।',
    'Thank you for being honest. It is okay to cry. Kind words or a Small step are here for you, and so is SOS.': 'सच बताने के लिए धन्यवाद। रोना ठीक है। Kind words या एक छोटा कदम आपके लिए यहाँ है, और SOS भी।',
    'Sad days happen. Kind words or a Small step can help a little.': 'उदास दिन आते हैं। Kind words या एक छोटा कदम थोड़ी मदद कर सकता है।',
    'A decent day. A calm break can keep the good going.': 'ठीक ठाक अच्छा दिन। एक शांत ब्रेक इस अच्छे को बनाए रख सकता है।',
    'Happy today. Lovely! Maybe share LoosenUp with someone who could use it.': 'आज खुश हैं। बहुत बढ़िया! चाहें तो LoosenUp किसी ऐसे के साथ शेयर करें जिसे इसकी ज़रूरत हो।',
    'Lovely. That small step counts.': 'बहुत बढ़िया। यह छोटा कदम मायने रखता है।', 'Thank you for sharing LoosenUp.': 'LoosenUp शेयर करने के लिए धन्यवाद।',
    'Welcome to LoosenUp Plus (demo). Every programme is open.': 'LoosenUp Plus (डेमो) में स्वागत है। हर प्रोग्राम खुला है।',
    'Daily reminder is off. You can set it again any time.': 'रोज़ का रिमाइंडर बंद है। आप इसे कभी भी फिर से सेट कर सकते हैं।',
    'You showed up, and that counts.': 'आपने अपने लिए समय निकाला, और यही मायने रखता है।', 'A rest day kept your streak going.': 'एक आराम के दिन ने आपके लगातार दिन जारी रखे।',
    'A fresh streak starts today.': 'आज से लगातार दिनों की नई गिनती शुरू होती है।', 'Small breaks add up to steadier days.': 'छोटे ब्रेक मिलकर दिनों को स्थिर बनाते हैं।',
    'Your breaks will appear here.': 'आपके ब्रेक यहाँ दिखेंगे।', 'Your first break is two minutes away': 'आपका पहला ब्रेक बस दो मिनट दूर है',

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
    'On iPhone: open loosenup.anchit-tandon.com in Safari, tap Share, then Add to Home Screen.': 'iPhone पर: Safari में loosenup.anchit-tandon.com खोलें, Share पर टैप करें, फिर Add to Home Screen।',
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
    [/^(₹[\d,]+(?:\/mo|\/yr)?) or (USD [\d.]+(?:\/mo|\/yr)?)$/, function (m) { return (m[1] + ' या ' + m[2]).replace(/\/mo/g, '/माह').replace(/\/yr/g, '/वर्ष'); }],
    [/^(₹[\d,]+|USD [\d.]+)\/mo$/, function (m) { return m[1] + '/माह'; }],
    [/^Day (\d+) of (\d+): (.+)$/, function (m) { return 'दिन ' + m[1] + ' / ' + m[2] + ': ' + t(m[3]); }],
    [/^Day (\d+) of (\d+) done\. See you tomorrow\.$/, function (m) { return 'दिन ' + m[1] + ' / ' + m[2] + ' पूरा। कल मिलते हैं।'; }],
    [/^Day (\d+) of (\d+) done\.$/, function (m) { return 'दिन ' + m[1] + ' / ' + m[2] + ' पूरा।'; }],
    [/^Day (\d+) of ([A-Z].+)\.$/, function (m) { return t(m[2]) + ' का दिन ' + m[1] + '।'; }],
    [/^Day (\d+) of (\d+)$/, function (m) { return 'दिन ' + m[1] + ' / ' + m[2]; }],
    [/^Day (\d+)(?:, (today|done|Full Bloom))?$/, function (m) { return 'दिन ' + m[1] + (m[2] ? ', ' + ({ today: 'आज', done: 'पूरा', 'Full Bloom': 'Full Bloom' })[m[2]] : ''); }],
    [/^Day (\d+) opens tomorrow\.$/, function (m) { return 'दिन ' + m[1] + ' कल खुलेगा।'; }],
    [/^All (\d+) days done$/, function (m) { return 'सारे ' + m[1] + ' दिन पूरे'; }],
    [/^You finished (.+?)!?$/, function (m) { return 'आपने ' + t(m[1]) + ' पूरा किया!'; }],
    [/^(\d+) days$/, function (m) { return m[1] + ' दिन'; }],
    [/^Today's practice: (.+)$/, function (m) { return 'आज का अभ्यास: ' + m[1]; }],
    [/^(₹[\d,]+|USD [\d.]+)\/yr$/, function (m) { return m[1] + '/वर्ष'; }],
    [/^Share an anonymous weekly pulse: (on|off)$/, function (m) { return 'हफ़्ते की गुमनाम पल्स शेयर करें: ' + (m[1] === 'on' ? 'चालू' : 'बंद'); }],
    [/^You joined (.+)\.$/, function (m) { return 'आप ' + m[1] + ' से जुड़ गए।'; }],
    [/^Call (.+) \((\+?[\d ]+)\)$/, function (m) { return m[1] + ' को कॉल करें (' + m[2] + ')'; }],
    [/^Showing (.+), nearest first\.$/, function (m) { return t(m[1]) + ' दिखा रहे हैं, सबसे पास वाले पहले।'; }],
    [/^([\d.]+) km away$/, function (m) { return m[1] + ' किमी दूर'; }],
    [/^LoosenUp is not paid by these services\. Details were checked on their official sites on ([\d-]+); confirm prices before you book\.$/, function (m) { return 'LoosenUp को इन सेवाओं से कोई पैसा नहीं मिलता। जानकारी ' + m[1] + ' को उनकी आधिकारिक साइट पर जाँची गई; बुक करने से पहले कीमत पक्की कर लें।'; }],
    [/^From (\d+) to (\d+) out of 10$/, function (m) { return '10 में से ' + m[1] + ' से ' + m[2] + ' तक'; }],
    [/^(\d+) days? in a row$/, function (m) { return 'लगातार ' + m[1] + ' दिन'; }],
    [/^(\d+) days? in a row! Milestone reached\.$/, function (m) { return 'लगातार ' + m[1] + ' दिन! पड़ाव पूरा।'; }],
    [/^(\d+) breaks? this week$/, function (m) { return 'इस हफ़्ते ' + m[1] + ' ब्रेक'; }],
    [/^(\d+) breaks?$/, function (m) { return m[1] + ' ब्रेक'; }],
    [/^([+\-]?[\d.]+) average Calm gain$/, function (m) { return 'औसत Calm gain ' + m[1]; }],
    [/^Milestone: (.+)$/, function (m) { return 'पड़ाव: ' + t(m[1]); }],
    [/^Not yet: (.+)$/, function (m) { return 'अभी नहीं: ' + t(m[1]); }],
    [/^Best: (\d+) days?$/, function (m) { return 'सबसे ज़्यादा: ' + m[1] + ' दिन'; }],
    [/^Daily reminder set for ([\d:]+)\.$/, function (m) { return 'रोज़ का रिमाइंडर ' + m[1] + ' पर सेट है।'; }],
    [/^Day (\d+), LoosenUp Plus$/, function (m) { return 'दिन ' + m[1] + ', LoosenUp Plus'; }],
    [/^(\d+) of (\d+) breaths$/, function (m) { return m[2] + ' में से ' + m[1] + ' साँसें'; }],
    [/^Days 1 to 3 are free\. Day 4 onwards is part of LoosenUp Plus\.$/, function () { return 'दिन 1 से 3 मुफ़्त हैं। दिन 4 से आगे LoosenUp Plus का हिस्सा है।'; }],
    [/^Short daily plans with one tip and one exercise a day\. The first 3 days of each are free; LoosenUp Plus opens the rest\.$/, function () { return 'रोज़ के छोटे प्लान, हर दिन एक सुझाव और एक अभ्यास। हर प्लान के पहले 3 दिन मुफ़्त हैं, बाकी LoosenUp Plus में खुलते हैं।'; }],
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

/* LoosenUp sleep space: guided wind-down sessions in English and Hindi.
   Each line is [English, seconds of quiet after it, Hindi]. The player speaks each line in the
   recorded voice when a clip exists (www/voice), otherwise in the device voice, with a soft
   background sound underneath and a gentle fade at the end. */
(function () {
  'use strict';
  var S = [
    {
      id: 'scan', kind: 'Body scan', mins: 10, sound: 'brown',
      title: ['Body scan for sleep', 'नींद के लिए बॉडी स्कैन'],
      desc: ['Move your attention slowly through the body, letting each part grow heavy and warm.', 'ध्यान को धीरे धीरे पूरे शरीर में ले जाएँ, हर हिस्से को भारी और गरम होने दें।'],
      lines: [
        ['Lie down comfortably and let your arms rest by your sides.', 14, 'आराम से लेट जाएँ और बाँहों को शरीर के पास टिका दें।'],
        ['Let your eyes close, or soften your gaze.', 12, 'आँखें बंद कर लें, या नज़र को नरम कर लें।'],
        ['Take three slow breaths, longer on the way out.', 20, 'तीन धीमी साँसें लें, छोड़ते समय थोड़ी लंबी।'],
        ['Bring your attention to the top of your head.', 16, 'अपना ध्यान सिर के ऊपरी हिस्से पर लाएँ।'],
        ['Let your forehead smooth out, and your eyebrows rest.', 18, 'माथे को ढीला होने दें, और भौंहों को आराम करने दें।'],
        ['Let your eyes grow heavy in their sockets.', 16, 'आँखों को भारी होने दें।'],
        ['Let your jaw loosen. Your teeth can part a little.', 18, 'जबड़े को ढीला छोड़ें। दाँत थोड़े अलग हो सकते हैं।'],
        ['Feel your neck soften into the pillow.', 18, 'गर्दन को तकिये में नरमी से टिकते महसूस करें।'],
        ['Let your shoulders drop, a little more with each breath out.', 20, 'हर साँस छोड़ते हुए कंधों को थोड़ा और नीचे गिरने दें।'],
        ['Feel the weight of your upper arms, then your elbows, then your forearms.', 20, 'ऊपरी बाँहों का भार महसूस करें, फिर कोहनियों का, फिर कलाइयों तक।'],
        ['Let your hands rest open. Notice any warmth in your palms.', 20, 'हाथों को खुला टिकने दें। हथेलियों में गरमाहट महसूस करें।'],
        ['Bring your attention to your chest, rising and falling on its own.', 22, 'ध्यान छाती पर लाएँ, जो अपने आप ऊपर नीचे हो रही है।'],
        ['Let your belly be soft. There is nothing to hold in.', 22, 'पेट को नरम रहने दें। कुछ भी रोककर रखने की ज़रूरत नहीं।'],
        ['Feel your back supported by the bed, all the way down.', 20, 'पूरी पीठ को बिस्तर पर टिका हुआ महसूस करें।'],
        ['Let your hips grow heavy.', 18, 'कूल्हों को भारी होने दें।'],
        ['Feel your thighs, then your knees, soften.', 20, 'जाँघों को, फिर घुटनों को ढीला होते महसूस करें।'],
        ['Let your calves relax, and your ankles.', 20, 'पिंडलियों और टखनों को आराम करने दें।'],
        ['Notice your feet. Let your toes uncurl.', 20, 'पैरों पर ध्यान दें। उँगलियों को खुलने दें।'],
        ['Now feel your whole body at once, heavy and warm.', 24, 'अब पूरे शरीर को एक साथ महसूस करें, भारी और गरम।'],
        ['If a thought comes, let it pass like a cloud, and come back to the body.', 26, 'अगर कोई विचार आए, तो उसे बादल की तरह गुज़रने दें, और शरीर पर लौट आएँ।'],
        ['With each breath out, sink a little deeper into rest.', 30, 'हर साँस छोड़ते हुए आराम में थोड़ा और गहरे उतरें।'],
        ['There is nothing more to do now.', 30, 'अब और कुछ करने की ज़रूरत नहीं है।'],
        ['Rest here, and let sleep come when it is ready.', 40, 'यहीं आराम करें, और नींद को अपने समय पर आने दें।']
      ]
    },
    {
      id: 'nidra', kind: 'Yoga nidra', mins: 15, sound: 'ocean',
      title: ['Yoga nidra', 'योग निद्रा'],
      desc: ['A traditional guided rest: an intention, a journey of attention through the body, and deep stillness.', 'एक पारंपरिक गाइडेड आराम: एक संकल्प, शरीर में ध्यान की यात्रा, और गहरी शांति।'],
      lines: [
        ['Lie on your back in a comfortable position, palms facing up.', 14, 'पीठ के बल आराम से लेट जाएँ, हथेलियाँ ऊपर की ओर।'],
        ['Let your body be still. This is a time to rest, not to sleep yet.', 16, 'शरीर को स्थिर रहने दें। यह आराम का समय है, अभी सोने का नहीं।'],
        ['Notice the sounds around you, far away and close by. Just listen.', 24, 'आसपास की आवाज़ें सुनें, दूर की और पास की। बस सुनें।'],
        ['Now notice your body lying here, and the places it touches the bed.', 20, 'अब अपने लेटे हुए शरीर को महसूस करें, और जहाँ वह बिस्तर को छूता है।'],
        ['Say to yourself: I am going to practise yoga nidra. I will stay aware.', 14, 'खुद से कहें: मैं योग निद्रा का अभ्यास करने जा रहा या रही हूँ। मैं सजग रहूँगा या रहूँगी।'],
        ['Now choose a short, kind intention, a sankalpa. For example: I am at peace.', 16, 'अब एक छोटा, प्यारा संकल्प चुनें। जैसे: मैं शांत हूँ।'],
        ['Repeat your sankalpa three times in your mind, with feeling.', 24, 'अपने संकल्प को मन में भाव के साथ तीन बार दोहराएँ।'],
        ['Now we move awareness through the body. Just feel each place as it is named.', 10, 'अब हम ध्यान को शरीर में घुमाएँगे। हर नाम पर बस उस हिस्से को महसूस करें।'],
        ['Right hand thumb. Second finger. Third finger. Fourth finger. Little finger.', 10, 'दाएँ हाथ का अंगूठा। दूसरी उँगली। तीसरी उँगली। चौथी उँगली। छोटी उँगली।'],
        ['Palm of the right hand. Back of the hand. Wrist. Elbow. Shoulder.', 10, 'दाईं हथेली। हाथ का पिछला हिस्सा। कलाई। कोहनी। कंधा।'],
        ['Right side of the chest. Right hip. Right thigh. Knee. Calf. Ankle.', 10, 'छाती का दायाँ हिस्सा। दायाँ कूल्हा। दाईं जाँघ। घुटना। पिंडली। टखना।'],
        ['Right heel. Sole of the right foot. All the toes of the right foot.', 12, 'दाईं एड़ी। दाएँ पैर का तलवा। दाएँ पैर की सारी उँगलियाँ।'],
        ['Left hand thumb. Second finger. Third finger. Fourth finger. Little finger.', 10, 'बाएँ हाथ का अंगूठा। दूसरी उँगली। तीसरी उँगली। चौथी उँगली। छोटी उँगली।'],
        ['Palm of the left hand. Back of the hand. Wrist. Elbow. Shoulder.', 10, 'बाईं हथेली। हाथ का पिछला हिस्सा। कलाई। कोहनी। कंधा।'],
        ['Left side of the chest. Left hip. Left thigh. Knee. Calf. Ankle.', 10, 'छाती का बायाँ हिस्सा। बायाँ कूल्हा। बाईं जाँघ। घुटना। पिंडली। टखना।'],
        ['Left heel. Sole of the left foot. All the toes of the left foot.', 12, 'बाईं एड़ी। बाएँ पैर का तलवा। बाएँ पैर की सारी उँगलियाँ।'],
        ['The back of the head. The forehead. Both eyebrows. The space between the eyebrows.', 12, 'सिर का पिछला हिस्सा। माथा। दोनों भौंहें। भौंहों के बीच की जगह।'],
        ['Both eyes. Both ears. The nose. The lips. The chin. The throat.', 12, 'दोनों आँखें। दोनों कान। नाक। होंठ। ठोड़ी। गला।'],
        ['The whole right side of the body. The whole left side. The whole body together.', 20, 'शरीर का पूरा दायाँ हिस्सा। पूरा बायाँ हिस्सा। पूरा शरीर एक साथ।'],
        ['Now notice the natural breath, without changing it.', 20, 'अब स्वाभाविक साँस पर ध्यान दें, उसे बदले बिना।'],
        ['Count each breath backwards from twenty-seven. Breathing in, twenty-seven. Breathing out, twenty-seven.', 60, 'हर साँस को सत्ताईस से उल्टा गिनें। साँस लेते हुए सत्ताईस। साँस छोड़ते हुए सत्ताईस।'],
        ['If the count slips away, gently begin again. There is no hurry.', 40, 'अगर गिनती छूट जाए, तो धीरे से फिर शुरू करें। कोई जल्दी नहीं है।'],
        ['Now picture a calm lake at dawn, the water perfectly still.', 24, 'अब भोर में एक शांत झील की कल्पना करें, पानी बिल्कुल स्थिर।'],
        ['A soft light rises over the hills and touches the water.', 24, 'पहाड़ियों के ऊपर एक कोमल रोशनी उठती है और पानी को छूती है।'],
        ['Feel that same stillness inside you.', 30, 'वही शांति अपने भीतर महसूस करें।'],
        ['Now remember your sankalpa, and repeat it three times, with feeling.', 26, 'अब अपना संकल्प याद करें, और भाव के साथ तीन बार दोहराएँ।'],
        ['Rest in this stillness. If sleep comes now, welcome it.', 60, 'इस शांति में आराम करें। अगर अब नींद आए, तो उसका स्वागत करें।']
      ]
    },
    {
      id: 'train', kind: 'Sleep story', mins: 8, sound: 'rain',
      title: ['The slow train to the hills', 'पहाड़ों की ओर धीमी रेल'],
      desc: ['A night journey on a quiet train, climbing gently into the hills.', 'एक शांत रेल में रात का सफ़र, धीरे धीरे पहाड़ों पर चढ़ते हुए।'],
      lines: [
        ['It is evening, and the little station is almost empty.', 12, 'शाम हो गई है, और छोटा सा स्टेशन लगभग खाली है।'],
        ['A slow train waits at the platform, its windows glowing warm and yellow.', 14, 'एक धीमी रेल प्लेटफ़ॉर्म पर खड़ी है, उसकी खिड़कियाँ गरम पीली रोशनी से चमक रही हैं।'],
        ['You find a seat by the window. The cushion is soft and a little worn.', 14, 'आपको खिड़की के पास एक सीट मिलती है। गद्दी नरम है और थोड़ी पुरानी।'],
        ['A tea seller passes by, and you take a small cup of sweet, milky chai.', 16, 'एक चाय वाला गुज़रता है, और आप मीठी दूध वाली चाय का छोटा कुल्हड़ लेते हैं।'],
        ['The whistle sounds once, long and low, and the train begins to move.', 16, 'सीटी एक बार बजती है, लंबी और धीमी, और रेल चलने लगती है।'],
        ['The wheels find their rhythm. Clack, clack. Clack, clack.', 18, 'पहियों को अपनी लय मिल जाती है। खट खट। खट खट।'],
        ['Outside, the town lights thin out, one by one, until there are only fields.', 18, 'बाहर शहर की बत्तियाँ एक एक करके कम होती जाती हैं, जब तक सिर्फ़ खेत रह जाते हैं।'],
        ['The fields are silver under a half moon.', 18, 'आधे चाँद के नीचे खेत चाँदी जैसे चमक रहे हैं।'],
        ['The air coming in through the window grows cooler.', 18, 'खिड़की से आती हवा ठंडी होती जाती है।'],
        ['The train begins to climb, slowly, curving around the first hill.', 20, 'रेल धीरे धीरे चढ़ने लगती है, पहली पहाड़ी के चारों ओर मुड़ते हुए।'],
        ['Pine trees stand along the track, dark and quiet.', 20, 'पटरी के किनारे चीड़ के पेड़ खड़े हैं, गहरे और शांत।'],
        ['Somewhere below, a stream runs over smooth stones.', 22, 'कहीं नीचे, एक झरना चिकने पत्थरों पर बह रहा है।'],
        ['Your cup is empty now. You set it down and lean back.', 20, 'आपका कुल्हड़ अब खाली है। आप उसे रख देते हैं और पीछे टिक जाते हैं।'],
        ['The carriage sways gently, like a cradle.', 24, 'डिब्बा धीरे धीरे झूलता है, जैसे पालना।'],
        ['Small houses appear on the hillside, one lamp still lit in a window.', 24, 'पहाड़ी पर छोटे घर दिखते हैं, एक खिड़की में अब भी एक दीया जल रहा है।'],
        ['The train passes through a short tunnel, and the sound grows soft and round.', 24, 'रेल एक छोटी सुरंग से गुज़रती है, और आवाज़ नरम और गोल हो जाती है।'],
        ['On the other side, the sky is full of stars.', 26, 'दूसरी ओर, आसमान तारों से भरा है।'],
        ['There is nowhere you need to be. The train knows the way.', 28, 'आपको कहीं पहुँचने की ज़रूरत नहीं है। रेल रास्ता जानती है।'],
        ['Clack, clack. Clack, clack. Slower now.', 30, 'खट खट। खट खट। अब और धीमे।'],
        ['Your eyes grow heavy, and the hills hold you as you drift.', 40, 'आपकी आँखें भारी हो जाती हैं, और पहाड़ आपको थामे रहते हैं जब आप नींद में उतरते हैं।']
      ]
    },
    {
      id: 'monsoon', kind: 'Sleep story', mins: 8, sound: 'rain',
      title: ['Monsoon evening on the verandah', 'बरामदे में मानसून की शाम'],
      desc: ['Rain on the roof, a warm blanket, and nowhere to be.', 'छत पर बारिश, एक गरम कंबल, और कहीं जाने की ज़रूरत नहीं।'],
      lines: [
        ['The first rain of the monsoon arrived this afternoon.', 12, 'मानसून की पहली बारिश आज दोपहर आई।'],
        ['Now it is evening, and you are sitting on a wide, old verandah.', 14, 'अब शाम है, और आप एक चौड़े, पुराने बरामदे में बैठे हैं।'],
        ['A soft blanket is around your shoulders.', 14, 'आपके कंधों पर एक नरम कंबल है।'],
        ['The air smells of wet earth, that sweet smell the first rain brings.', 18, 'हवा में गीली मिट्टी की खुशबू है, वही मीठी खुशबू जो पहली बारिश लाती है।'],
        ['Rain falls steadily on the tin roof above you.', 18, 'आपके ऊपर टीन की छत पर बारिश लगातार गिर रही है।'],
        ['Drops gather at the edge of the roof and fall, one after another.', 20, 'बूँदें छत के किनारे जमा होती हैं और एक के बाद एक गिरती हैं।'],
        ['In the garden, the leaves of the mango tree shine in the lamplight.', 20, 'आँगन में, आम के पेड़ की पत्तियाँ दीये की रोशनी में चमक रही हैं।'],
        ['Somewhere a frog begins to sing, and then another answers.', 20, 'कहीं एक मेंढक गाने लगता है, और फिर दूसरा जवाब देता है।'],
        ['Someone in the kitchen is making pakoras. You can hear the gentle sizzle.', 20, 'रसोई में कोई पकौड़े बना रहा है। आप हल्की सी छनछनाहट सुन सकते हैं।'],
        ['A plate is set beside you, still warm, and a glass of ginger tea.', 22, 'आपके पास एक प्लेट रखी जाती है, अब भी गरम, और अदरक की चाय का गिलास।'],
        ['You eat slowly, and watch the rain.', 22, 'आप धीरे धीरे खाते हैं, और बारिश को देखते हैं।'],
        ['The street outside is quiet. Everyone has gone in.', 24, 'बाहर गली शांत है। सब अंदर चले गए हैं।'],
        ['The rain softens to a gentle patter.', 24, 'बारिश धीमी होकर हल्की टपटप में बदल जाती है।'],
        ['You pull the blanket a little closer and lean back in the chair.', 24, 'आप कंबल को थोड़ा और करीब खींचते हैं और कुर्सी में पीछे टिक जाते हैं।'],
        ['The lamp flickers, warm and steady.', 26, 'दीया टिमटिमाता है, गरम और स्थिर।'],
        ['Each drop on the roof feels like a small, kind word.', 28, 'छत पर हर बूँद एक छोटे, प्यारे शब्द जैसी लगती है।'],
        ['There is nothing to do tonight but listen.', 30, 'आज रात सुनने के सिवा कुछ नहीं करना है।'],
        ['Your breathing slows to match the rain.', 32, 'आपकी साँसें बारिश की लय में धीमी हो जाती हैं।'],
        ['Let the sound of the rain carry you gently into sleep.', 40, 'बारिश की आवाज़ को आपको धीरे से नींद में ले जाने दें।']
      ]
    }
  ];
  // Hindi for every line goes into the shared dictionary, so the voice and screen follow the language.
  if (window.LoosenUpI18n && window.LoosenUpI18n.hi) {
    var hi = window.LoosenUpI18n.hi;
    S.forEach(function (s) {
      hi[s.title[0]] = s.title[1];
      hi[s.desc[0]] = s.desc[1];
      s.lines.forEach(function (l) { hi[l[0]] = l[2]; });
    });
    hi['Body scan'] = 'बॉडी स्कैन'; hi['Yoga nidra'] = 'योग निद्रा'; hi['Sleep story'] = 'नींद की कहानी';
  }
  window.LoosenUpSleep = S;
})();

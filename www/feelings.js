/* LoosenUp feelings: what a feeling needs, in the order that tends to bring relief.
   Each plan follows the same shape: acknowledge first, settle the body (or lift it gently when
   energy is low), shift attention or meaning, then end on a small win and notice the change.
   Sources behind each choice are listed in README, Feelings. A step is one of:
     tech:<id>  a guided exercise      game:<id>  a calm game      more:trace  Trace the square
     step       today's Small step     jar        the Good things jar          sos  SOS support
   "never" lists games that tend to work against that feeling, so they are not suggested. */
(function () {
  'use strict';

  var F = {
    /* ---------- Heavier feelings ---------- */
    angry: {
      hear: ['That sounds really unfair. Of course you are angry.',
        'Your anger is telling you something mattered. We can listen to it once your body cools a little.',
        'You do not have to be calm yet. Let us just take the heat down one notch.'],
      plan: [['tech:cooldown', 'Long breaths out slow your heart and take the heat down first.'],
        ['tech:release', 'Squeeze, then let go. Your body gets an outlet that ends in letting go.'],
        ['game:pairs', 'A steady game gives your mind a break from replaying it.']],
      alt: [['tech:pause', 'A few calm steps before you reply to anyone, so you can answer from care.'],
        ['game:pop', 'Pop the bubbles slowly, one by one.']],
      close: 'You cooled it down yourself. What happened still matters, and now you get to choose what to do about it.',
      games: ['pairs', 'pop', 'bloom'], never: ['catch']
    },
    worried: {
      hear: ['Worry is your mind trying to protect you. It is working overtime right now.',
        'You do not have to solve it this minute.',
        'It makes sense to feel this way when something important is uncertain.'],
      plan: [['tech:sigh', 'Two breaths in, then one long breath out. No holding, just a slow way to help your body settle.'],
        ['tech:name', 'Putting the feeling into words can make it feel smaller.'],
        ['tech:park', 'Write it down and give it a time, so your mind can stop holding it.']],
      alt: [['game:pairs', 'A gentle matching game gives the worried pictures in your mind something else to do.'],
        ['tech:breeze', 'Soft, even breathing with no holds.']],
      close: 'It is written down and it can wait. For now, you have done enough.',
      games: ['pairs', 'bloom', 'pop'], never: ['catch']
    },
    sad: {
      hear: ['That sounds really heavy. It is okay to feel sad about this.',
        'Sadness usually means something mattered to you.',
        'No need to cheer up. We can just sit with it for a bit.'],
      plan: [['tech:kind', 'A hand on your heart and a few kind words, with nothing to fix.'],
        ['game:bloom', 'Slow breaths with the ring, at your own pace.'],
        ['step', 'When you are ready, one tiny kind thing for yourself.']],
      alt: [['tech:letitout', 'Type whatever is there. Nothing is saved.'],
        ['tech:reach', 'Think of someone kind, and maybe send a small hello.']],
      close: 'You let yourself feel it, and you are still here. That takes strength.',
      games: ['bloom', 'pairs', 'pop'], never: ['catch']
    },
    crying: {
      hear: ['It is okay to cry. You do not need to stop.',
        'I am here with you. Take all the time you need.',
        'You do not have to explain anything right now.'],
      plan: [['tech:wave', 'Very slow breaths with a hand on your heart. Cry if you need to.'],
        ['tech:kind', 'Gentle words for a hard moment.'],
        ['tech:reach', 'If it would help, one person you could talk to or be near.']],
      alt: [['tech:letitout', 'Type whatever is there. Nothing is saved.'],
        ['sos', 'Talk to someone now. Tele-MANAS is free, any time, on 14416.']],
      close: 'You got through that wave. That was hard, and you did it.',
      games: ['bloom'], never: ['catch', 'pairs', 'pop']
    },
    tired: {
      hear: ['You have been carrying a lot. Of course you are tired.',
        'Rest is allowed, even when the list is not done.',
        'Let us do something gentle, not something that asks more of you.'],
      plan: [['tech:release', 'Rest first. Let each part of your body go heavy and soft.'],
        ['game:bloom', 'Six slow breaths with the ring, eyes soft.']],
      alt: [['tech:lift', 'Or a small lift: a little daylight, a stretch and some water.'],
        ['game:catch', 'A light, easy game to wake your attention gently.']],
      close: 'You gave yourself a few minutes. That counts.',
      games: ['bloom', 'pop', 'pairs'], never: []
    },
    lonely: {
      hear: ['Feeling alone is one of the hardest feelings. Thank you for telling me.',
        'Wanting to feel close to people is deeply human, not a weakness.',
        'Lots of people feel this way, even with people around them.'],
      plan: [['tech:kind', 'Many people feel this too, right now. You are not the only one.'],
        ['tech:reach', 'One small hello to someone who was kind to you.']],
      alt: [['tech:warmth', 'Send warm wishes to the people in your life.'],
        ['tech:letitout', 'Type what you would tell someone who understood. Nothing is saved.']],
      close: 'You reached toward someone. Even a small hello connects you.',
      games: ['pairs', 'bloom', 'pop'], never: []
    },
    overwhelmed: {
      hear: ['That is a lot to carry at once. No wonder it feels like too much.',
        'You do not have to do it all now. Just the next small thing.',
        'Let us get it out of your head so it can stop spinning.'],
      plan: [['tech:sigh', 'A minute of long breaths out first, so your body can settle.'],
        ['tech:park', 'Get it out of your head, then pick just one piece.'],
        ['game:pop', 'Finish one small thing, bubble by bubble, and see it done.']],
      alt: [['tech:here', 'Come back to one thing at a time, one sense at a time.'],
        ['game:pairs', 'A calm game with one simple thing to do.']],
      close: 'It is out of your head and on the page. One piece is done, and you can see it.',
      games: ['pop', 'pairs', 'bloom'], never: ['catch']
    },
    frustrated: {
      hear: ['It is so annoying when you are trying hard and it will not move.',
        'Your effort is real, even if the result is not there yet.',
        'A short break is not giving up. It is often how stuck things get unstuck.'],
      plan: [['tech:release', 'Squeeze your hands and jaw, then let them go soft.'],
        ['game:pop', 'A small thing you are sure to finish, so one thing goes right.']],
      alt: [['tech:cooldown', 'Long breaths out to let the heat go.'],
        ['game:pairs', 'A calm game you can finish at your own pace.']],
      close: 'You finished something. When you go back, start with the smallest piece.',
      games: ['pop', 'pairs', 'bloom'], never: ['catch']
    },
    restless: {
      hear: ['Your body feels wound up. Let us give that energy somewhere to go.',
        'Feeling jittery is your body asking to move, not something to fight.',
        'We will move first, then slow down.'],
      plan: [['tech:shake', 'Shake it out and press it out, so the energy has somewhere to go.'],
        ['more:trace', 'Follow the dot round the square. A steady rhythm helps your body find its pace.'],
        ['tech:breeze', 'Then soft, even breathing to settle.']],
      alt: [['tech:release', 'Tense each area, then let it go soft.'],
        ['game:pop', 'Pop the bubbles one by one, in a steady rhythm.']],
      close: 'Your body let some of that go. Notice your shoulders now.',
      games: ['pop', 'bloom', 'pairs'], never: ['catch']
    },
    harsh: {
      hear: ['You are being really hard on yourself right now. That voice sounds harsh.',
        'Making a mistake does not make you a mistake.',
        'Would you talk to a friend this way? You deserve the same kindness.'],
      plan: [['tech:kind', 'This is hard, others feel it too, and you can be kind to yourself.'],
        ['tech:friend', 'Look at the facts, then speak to yourself like a good friend would.']],
      alt: [['tech:letitout', 'Write what a kind friend would say to you. Nothing is saved.'],
        ['game:bloom', 'Slow breaths with the ring, with nothing to prove.']],
      close: 'You just spoke to yourself the way a good friend would. That kind voice is yours too.',
      games: ['bloom', 'pairs', 'pop'], never: []
    },
    flat: {
      hear: ['Feeling flat is uncomfortable, even if it seems small.',
        'Sometimes flat means you need something that matters to you.',
        'Let us find one small thing that feels a bit more alive.'],
      plan: [['tech:lift', 'Move a little and find some daylight. It wakes the body gently.'],
        ['game:catch', 'A lively game to get your attention moving.'],
        ['step', 'One small thing you would be glad you did.']],
      alt: [['game:pairs', 'A memory game to give your mind something to do.'],
        ['tech:hope', 'Picture something you are looking forward to.']],
      close: 'Notice that little spark. You made it happen.',
      games: ['catch', 'pairs', 'pop'], never: []
    },
    racing: {
      hear: ['Your mind is still busy from the day. That is really common.',
        'You do not need to solve anything tonight.',
        'Let us put tomorrow somewhere safe so your mind can rest.'],
      plan: [['tech:tomorrow', 'Write down what tomorrow needs, so you do not have to hold it.'],
        ['tech:release', 'Let your body go heavy, from shoulders to toes.']],
      alt: [['tech:cooldown', 'Long, slow breaths out.'],
        ['more:sleep', 'A guided sleep session to drift off with.']],
      close: 'Tomorrow is written down. It can wait there until morning.',
      games: ['bloom'], never: ['catch', 'pairs', 'pop']
    },

    /* ---------- Good feelings: savour them and make them last ---------- */
    calm: {
      hear: ['This feels peaceful. Let us stay here a moment.',
        'Calm is worth noticing. Your body knows how to do this.',
        'Nothing to fix right now. Just enjoy it.'],
      plan: [['tech:savour', 'Notice it with your senses, so you can find it again.'],
        ['jar', 'Save what helped you get here in your Good things jar.']],
      alt: [['game:bloom', 'Six slow breaths to stay in it.']],
      close: 'Saved. You can come back to this feeling.',
      games: ['bloom', 'pairs', 'pop'], never: []
    },
    happy: {
      hear: ['That is lovely! What made today good?',
        'Happy looks good on you. Let us make it last a little longer.',
        'Enjoy it. You do not have to do anything with it.'],
      plan: [['tech:savour', 'Replay the best moment slowly, like a favourite song.'],
        ['jar', 'Keep it in your Good things jar for a heavier day.']],
      alt: [['game:catch', 'A playful game while you are feeling bright.'],
        ['tech:reach', 'Tell someone who would be glad for you.']],
      close: 'Want to tell someone who would be glad for you? Good news feels even better when it is shared.',
      games: ['catch', 'pairs', 'pop'], never: []
    },
    grateful: {
      hear: ['What a nice thing to notice. Who or what made it happen?',
        'Gratitude is a warm feeling. Let us stay with it a moment.',
        'One good thing, noticed properly, is plenty.'],
      plan: [['jar', 'Write down the one thing, and who made it happen.'],
        ['tech:warmth', 'Send a warm wish to them.']],
      alt: [['tech:reach', 'Send them a quick thank you.']],
      close: 'Want to send them a quick thank you? It can make their day too.',
      games: ['pairs', 'bloom', 'catch'], never: []
    },
    hopeful: {
      hear: ['Hold onto that hope. What would it look like if it went well?',
        'Hope is worth taking seriously.',
        'Let us give that hope a small first step.'],
      plan: [['tech:hope', 'Picture it going well, plan for one bump in the road, and choose one first step.']],
      alt: [['tech:savour', 'Stay with the hopeful feeling a little longer.']],
      close: 'Hope plus a small plan is a strong pair.',
      games: ['catch', 'pairs', 'pop'], never: []
    },
    loved: {
      hear: ['That warmth is real. Let it sink in for a moment.',
        'Feeling loved is a gift. Notice where you feel it.',
        'Let us keep this one.'],
      plan: [['tech:savour', 'Let it sink in: where do you feel it in your body?'],
        ['jar', 'Save who made you feel this way.']],
      alt: [['tech:warmth', 'Send warm wishes back to them.']],
      close: 'Saved. You can come back to this feeling any time.',
      games: ['bloom', 'pairs', 'pop'], never: []
    },
    energetic: {
      hear: ['You have got energy today! Let us use it on something you care about.',
        'Lovely energy. Let us put it somewhere good.',
        'This is a good moment for a small step you would be proud of.'],
      plan: [['game:catch', 'A lively game that matches your energy.'],
        ['step', 'One small step you would be glad you did.']],
      alt: [['tech:lift', 'Move around a little and enjoy it.']],
      close: 'You put that energy somewhere good.',
      games: ['catch', 'pairs', 'pop'], never: []
    },

    /* ---------- No strong feeling picked: a gentle suggestion by the time of day ---------- */
    okay: {
      hear: ['Okay is okay. Here is something small to make the day a little lighter.'],
      close: 'A small break, done. Notice how you feel now.',
      games: ['pairs', 'pop', 'catch'], never: []
    },
    unknown: {
      hear: ['How are you, really? Tap a face below, or start with this.'],
      close: 'A small break, done. Notice how you feel now.',
      games: ['pairs', 'pop', 'catch'], never: []
    }
  };

  // Time-of-day plans for "okay" and "unknown".
  var BY_TIME = {
    Mornings: [['tech:breeze', 'Slow, even breathing to start the day steady.'], ['game:catch', 'A bright little game to wake up your attention.']],
    Afternoons: [['tech:desk', 'Let the morning go from your shoulders without leaving your chair.'], ['game:pairs', 'A calm memory game for a short break.']],
    Evenings: [['tech:cooldown', 'Long breaths out help the day settle.'], ['game:bloom', 'Six slow breaths with the ring.']],
    'Quiet nights': [['tech:sigh', 'Long breaths out tell your body it is time to rest.'], ['game:bloom', 'Six slow breaths with the ring.']]
  };

  // When several feelings are picked at the same strength, the one listed first leads:
  // high-energy feelings first, because the body needs settling before anything else helps.
  var ORDER = ['angry', 'worried', 'overwhelmed', 'racing', 'restless', 'frustrated', 'harsh', 'sad', 'lonely', 'tired', 'flat',
    'loved', 'grateful', 'hopeful', 'happy', 'calm', 'energetic'];

  // At night, a worried, overwhelmed or restless mind is usually a racing mind.
  var NIGHT_AS_RACING = ['worried', 'overwhelmed', 'restless'];

  window.LoosenUpFeelings = { feelings: F, byTime: BY_TIME, order: ORDER, nightAsRacing: NIGHT_AS_RACING };
})();

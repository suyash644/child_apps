-- Seed data: badges and one sample story for local development
-- Run after migrations: supabase db reset (which runs migrations then this file)

-- ── Badges ────────────────────────────────────────────────────────────────────
INSERT INTO badges (name, description, image_url, condition_type, condition_value) VALUES
  (
    '{"hi": "पहली कहानी", "en": "First Story"}',
    '{"hi": "पहली कहानी पूरी की!", "en": "You completed your first story!"}',
    'badges/first_story.png', 'stories_completed', 1
  ),
  (
    '{"hi": "कहानी प्रेमी", "en": "Story Lover"}',
    '{"hi": "5 कहानियाँ पूरी कीं", "en": "Completed 5 stories"}',
    'badges/story_lover.png', 'stories_completed', 5
  ),
  (
    '{"hi": "श्लोक विद्यार्थी", "en": "Shloka Student"}',
    '{"hi": "पहला श्लोक सीखा", "en": "Learned your first shloka"}',
    'badges/first_shloka.png', 'shlokas_learned', 1
  ),
  (
    '{"hi": "ज्ञान योद्धा", "en": "Knowledge Warrior"}',
    '{"hi": "3 प्रश्नोत्तरी पास कीं", "en": "Passed 3 quizzes"}',
    'badges/quiz_warrior.png', 'quizzes_passed', 3
  ),
  (
    '{"hi": "नियमित भक्त", "en": "Daily Devotee"}',
    '{"hi": "7 दिन लगातार", "en": "7 day streak!"}',
    'badges/streak_7.png', 'streak_days', 7
  ),
  (
    '{"hi": "धर्म सेवक", "en": "Dharma Sevak"}',
    '{"hi": "500 XP अर्जित किए", "en": "Earned 500 XP"}',
    'badges/xp_500.png', 'xp_total', 500
  );

-- ── Sample Story: Ganesha (Phase 1 free content) ──────────────────────────────
-- Note: audio_urls and word_timestamps populated by generate-audio.js after publishing

WITH story AS (
  INSERT INTO stories (category, age_group, title, description, is_premium, status, display_order)
  VALUES (
    'ganesha',
    'tiny_devotee',
    '{"hi": "गणेश जी का जन्म", "en": "Birth of Ganesha"}',
    '{"hi": "जानो कैसे हुआ गणेश जी का जन्म", "en": "Learn how Lord Ganesha was born"}',
    FALSE,
    'published',
    1
  )
  RETURNING id
)
INSERT INTO story_slides (story_id, slide_index, content, image_url)
SELECT
  story.id,
  slides.slide_index,
  slides.content,
  slides.image_url
FROM story, (VALUES
  (
    0,
    '{"hi": "बहुत समय पहले, माता पार्वती ने स्नान करते हुए एक पुतला बनाया।", "en": "Long ago, Goddess Parvati created a figure while bathing."}',
    'slides/ganesha_birth_01.png'
  ),
  (
    1,
    '{"hi": "उन्होंने पुतले में जान डाली और उसे अपना पुत्र बनाया।", "en": "She breathed life into it and made him her son."}',
    'slides/ganesha_birth_02.png'
  ),
  (
    2,
    '{"hi": "माता ने कहा — तुम द्वार पर खड़े रहो, किसी को भी अंदर मत आने देना।", "en": "Parvati said — Stand at the door, do not let anyone enter."}',
    'slides/ganesha_birth_03.png'
  ),
  (
    3,
    '{"hi": "भगवान शिव आए, पर गणेश जी ने उन्हें रोक दिया!", "en": "Lord Shiva arrived, but Ganesha stopped him!"}',
    'slides/ganesha_birth_04.png'
  ),
  (
    4,
    '{"hi": "अंत में शिव जी ने गणेश को हाथी का सिर दिया और उन्हें देवताओं में सबसे पहले पूजे जाने का वरदान दिया।", "en": "Finally, Shiva gave Ganesha an elephant head and blessed him to be worshipped first among all gods."}',
    'slides/ganesha_birth_05.png'
  )
) AS slides(slide_index, content, image_url);

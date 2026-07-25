/**
 * Golden-ticket memory verses — World English Bible (WEB).
 * WEB is public domain (https://worldenglish.bible/). Not copyrighted.
 * Korean aliases remain for matching user-entered scripture refs only.
 */

export type MemoryVerse = {
  /** Display reference (English, WEB book names) */
  reference: string;
  /** Scripture text (WEB) */
  text: string;
  /** Matching keys incl. Korean abbreviations */
  aliases?: string[];
};

export const SCRIPTURE_SOURCE = "World English Bible (WEB)" as const;

export const MEMORY_VERSES: MemoryVerse[] = [
  {
    reference: "Psalm 23:1",
    text: "Yahweh is my shepherd: I shall lack nothing.",
    aliases: ["시편 23:1", "시편 23:1-3", "시 23:1", "psalm 23:1"],
  },
  {
    reference: "Psalm 119:105",
    text: "Your word is a lamp to my feet, and a light for my path.",
    aliases: ["시편 119:105", "시 119:105"],
  },
  {
    reference: "Proverbs 3:5-6",
    text: "Trust in Yahweh with all your heart, and don't lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.",
    aliases: ["잠언 3:5-6", "잠 3:5-6", "잠언 3:5", "proverbs 3:5"],
  },
  {
    reference: "John 3:16",
    text: "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.",
    aliases: ["요한복음 3:16", "요 3:16", "요한 3:16"],
  },
  {
    reference: "John 14:6",
    text: "Jesus said to him, “I am the way, the truth, and the life. No one comes to the Father, except through me.”",
    aliases: ["요한복음 14:6", "요 14:6", "요한 14:6"],
  },
  {
    reference: "John 15:5",
    text: "I am the vine. You are the branches. He who remains in me and I in him bears much fruit, for apart from me you can do nothing.",
    aliases: ["요한복음 15:5", "요 15:5", "요한 15:5"],
  },
  {
    reference: "Matthew 5:14",
    text: "You are the light of the world. A city located on a hill can't be hidden.",
    aliases: ["마태복음 5:14", "마 5:14", "마태 5:14"],
  },
  {
    reference: "Matthew 6:33",
    text: "But seek first God's Kingdom and his righteousness; and all these things will be given to you as well.",
    aliases: ["마태복음 6:33", "마 6:33", "마태 6:33"],
  },
  {
    reference: "Matthew 11:28",
    text: "Come to me, all you who labor and are heavily burdened, and I will give you rest.",
    aliases: ["마태복음 11:28", "마 11:28", "마태 11:28"],
  },
  {
    reference: "Romans 8:28",
    text: "We know that all things work together for good for those who love God, for those who are called according to his purpose.",
    aliases: ["로마서 8:28", "롬 8:28"],
  },
  {
    reference: "Romans 12:2",
    text: "Don't be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what is the good, well-pleasing, and perfect will of God.",
    aliases: ["로마서 12:2", "롬 12:2"],
  },
  {
    reference: "Philippians 4:6-7",
    text: "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.",
    aliases: ["빌립보서 4:6-7", "빌 4:6-7", "빌립보서 4:6", "빌 4:6"],
  },
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ who strengthens me.",
    aliases: ["빌립보서 4:13", "빌 4:13"],
  },
  {
    reference: "Isaiah 40:31",
    text: "But those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.",
    aliases: ["이사야 40:31", "사 40:31"],
  },
  {
    reference: "Isaiah 41:10",
    text: "Don't you be afraid, for I am with you. Don't be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.",
    aliases: ["이사야 41:10", "사 41:10"],
  },
  {
    reference: "Joshua 1:9",
    text: "Haven't I commanded you? Be strong and courageous. Don't be afraid. Don't be dismayed, for Yahweh your God is with you wherever you go.",
    aliases: ["여호수아 1:9", "수 1:9"],
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the thoughts that I think toward you,” says Yahweh, “thoughts of peace, and not of evil, to give you hope and a future.",
    aliases: ["예레미야 29:11", "렘 29:11"],
  },
  {
    reference: "Micah 6:8",
    text: "He has shown you, O man, what is good. What does Yahweh require of you, but to act justly, to love mercy, and to walk humbly with your God?",
    aliases: ["미가 6:8", "미 6:8"],
  },
  {
    reference: "1 Corinthians 13:4-5",
    text: "Love is patient and is kind. Love doesn't envy. Love doesn't brag, is not proud, doesn't behave itself inappropriately, doesn't seek its own way, is not provoked, takes no account of evil.",
    aliases: ["고린도전서 13:4-5", "고전 13:4-5", "고린도전서 13:4"],
  },
  {
    reference: "1 Corinthians 16:14",
    text: "Let all that you do be done in love.",
    aliases: ["고린도전서 16:14", "고전 16:14"],
  },
  {
    reference: "Galatians 5:22-23",
    text: "But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faith, gentleness, and self-control. Against such things there is no law.",
    aliases: ["갈라디아서 5:22-23", "갈 5:22-23", "갈라디아서 5:22"],
  },
  {
    reference: "Ephesians 2:8-9",
    text: "for by grace you have been saved through faith, and that not of yourselves; it is the gift of God, not of works, that no one would boast.",
    aliases: ["에베소서 2:8-9", "엡 2:8-9", "에베소서 2:8"],
  },
  {
    reference: "Colossians 3:23",
    text: "And whatever you do, work heartily, as for the Lord and not for men,",
    aliases: ["골로새서 3:23", "골 3:23"],
  },
  {
    reference: "1 Thessalonians 5:16-18",
    text: "Always rejoice. Pray without ceasing. In everything give thanks, for this is the will of God in Christ Jesus toward you.",
    aliases: ["데살로니가전서 5:16-18", "살전 5:16-18", "데살로니가전서 5:16"],
  },
  {
    reference: "Hebrews 11:1",
    text: "Now faith is assurance of things hoped for, proof of things not seen.",
    aliases: ["히브리서 11:1", "히 11:1"],
  },
  {
    reference: "James 1:17",
    text: "Every good gift and every perfect gift is from above, coming down from the Father of lights, with whom can be no variation nor turning shadow.",
    aliases: ["야고보서 1:17", "약 1:17"],
  },
  {
    reference: "1 Peter 5:7",
    text: "casting all your worries on him, because he cares for you.",
    aliases: ["베드로전서 5:7", "벧전 5:7"],
  },
  {
    reference: "1 John 4:19",
    text: "We love him, because he first loved us.",
    aliases: ["요한일서 4:19", "요일 4:19"],
  },
  {
    reference: "Revelation 21:4",
    text: "He will wipe away every tear from their eyes. Death will be no more; neither will there be mourning, nor crying, nor pain any more. The first things have passed away.",
    aliases: ["요한계시록 21:4", "계 21:4", "계시록 21:4"],
  },
  {
    reference: "Acts 2:42",
    text: "They continued steadfastly in the apostles' teaching and fellowship, in the breaking of bread, and prayer.",
    aliases: ["사도행전 2:42", "행 2:42"],
  },
  {
    reference: "Acts 2:46-47",
    text: "Day by day, continuing steadfastly with one accord in the temple, and breaking bread at home, they took their food with gladness and singleness of heart, praising God and having favor with all the people. The Lord added to the assembly day by day those who were being saved.",
    aliases: ["사도행전 2:46-47", "행 2:46-47", "사도행전 2:46"],
  },
  {
    reference: "Hebrews 10:24-25",
    text: "Let's consider how to provoke one another to love and good works, not forsaking our own assembling together, as the custom of some is, but exhorting one another, and so much the more as you see the Day approaching.",
    aliases: ["히브리서 10:24-25", "히 10:24-25", "히브리서 10:24"],
  },
  {
    reference: "John 13:34-35",
    text: "A new commandment I give to you, that you love one another. Just as I have loved you, you also love one another. By this everyone will know that you are my disciples, if you have love for one another.",
    aliases: ["요한복음 13:34-35", "요 13:34-35", "요한복음 13:34"],
  },
  {
    reference: "1 John 4:11-12",
    text: "Beloved, if God loved us in this way, we also ought to love one another. No one has seen God at any time. If we love one another, God remains in us, and his love has been perfected in us.",
    aliases: ["요한일서 4:11-12", "요일 4:11-12", "요한일서 4:11"],
  },
  {
    reference: "Romans 12:10",
    text: "In love of the brothers be tenderly affectionate to one another; in honor prefer one another,",
    aliases: ["로마서 12:10", "롬 12:10"],
  },
  {
    reference: "Romans 12:15-16",
    text: "Rejoice with those who rejoice. Weep with those who weep. Be of the same mind one toward another. Don't set your mind on high things, but associate with the humble. Don't be wise in your own conceits.",
    aliases: ["로마서 12:15-16", "롬 12:15-16", "로마서 12:15"],
  },
  {
    reference: "Romans 15:5-7",
    text: "Now the God of perseverance and of encouragement grant you to be of the same mind with one another according to Christ Jesus, that with one accord you may with one mouth glorify the God and Father of our Lord Jesus Christ. Therefore accept one another, even as Christ also accepted you, to the glory of God.",
    aliases: ["로마서 15:5-7", "롬 15:5-7", "로마서 15:7"],
  },
  {
    reference: "1 Corinthians 12:12",
    text: "For as the body is one and has many members, and all the members of the body, being many, are one body; so also is Christ.",
    aliases: ["고린도전서 12:12", "고전 12:12"],
  },
  {
    reference: "1 Corinthians 12:26",
    text: "When one member suffers, all the members suffer with it. When one member is honored, all the members rejoice with it.",
    aliases: ["고린도전서 12:26", "고전 12:26"],
  },
  {
    reference: "Ephesians 4:2-3",
    text: "with all lowliness and humility, with patience, bearing with one another in love, being eager to keep the unity of the Spirit in the bond of peace.",
    aliases: ["에베소서 4:2-3", "엡 4:2-3", "에베소서 4:3"],
  },
  {
    reference: "Ephesians 4:15-16",
    text: "but speaking truth in love, we may grow up in all things into him who is the head, Christ, from whom all the body, being fitted and knit together through that which every joint supplies, according to the working in measure of each individual part, makes the body increase to the building up of itself in love.",
    aliases: ["에베소서 4:15-16", "엡 4:15-16", "에베소서 4:16"],
  },
  {
    reference: "Colossians 3:12-14",
    text: "Put on therefore, as God's chosen ones, holy and beloved, a heart of compassion, kindness, lowliness, humility, and perseverance; bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do. Above all these things, walk in love, which is the bond of perfection.",
    aliases: ["골로새서 3:12-14", "골 3:12-14", "골로새서 3:14"],
  },
  {
    reference: "Galatians 6:2",
    text: "Bear one another's burdens, and so fulfill the law of Christ.",
    aliases: ["갈라디아서 6:2", "갈 6:2"],
  },
  {
    reference: "Philippians 2:3-4",
    text: "doing nothing through rivalry or through conceit, but in humility, each counting others better than himself; each of you not just looking to his own things, but each of you also to the things of others.",
    aliases: ["빌립보서 2:3-4", "빌 2:3-4", "빌립보서 2:3"],
  },
  {
    reference: "1 Thessalonians 5:11",
    text: "Therefore exhort one another, and build each other up, even as you also do.",
    aliases: ["데살로니가전서 5:11", "살전 5:11"],
  },
  {
    reference: "1 Peter 4:8-10",
    text: "And above all things be earnest in your love among yourselves, for love covers a multitude of sins. Be hospitable to one another without grumbling. As each has received a gift, employ it in serving one another, as good managers of the grace of God in its various forms.",
    aliases: ["베드로전서 4:8-10", "벧전 4:8-10", "베드로전서 4:8"],
  },
  {
    reference: "James 5:16",
    text: "Confess your sins to one another and pray for one another, that you may be healed. The insistent prayer of a righteous person is powerfully effective.",
    aliases: ["야고보서 5:16", "약 5:16"],
  },
  {
    reference: "Proverbs 27:17",
    text: "Iron sharpens iron; so a man sharpens his friend's countenance.",
    aliases: ["잠언 27:17", "잠 27:17"],
  },
  {
    reference: "Ecclesiastes 4:9-10",
    text: "Two are better than one, because they have a good reward for their labor. For if they fall, the one will lift up his fellow; but woe to him who is alone when he falls, and doesn't have another to lift him up.",
    aliases: ["전도서 4:9-10", "전 4:9-10", "전도서 4:9"],
  },
  {
    reference: "Psalm 133:1",
    text: "See how good and how pleasant it is for brothers to live together in unity!",
    aliases: ["시편 133:1", "시 133:1"],
  },
  {
    reference: "Matthew 18:20",
    text: "For where two or three are gathered together in my name, there I am in the middle of them.",
    aliases: ["마태복음 18:20", "마 18:20", "마태 18:20"],
  },
  {
    reference: "Matthew 16:18",
    text: "I also tell you that you are Peter, and on this rock I will build my assembly, and the gates of Hades will not prevail against it.",
    aliases: ["마태복음 16:18", "마 16:18", "마태 16:18"],
  },
  {
    reference: "Ephesians 2:19-22",
    text: "So then you are no longer strangers and foreigners, but you are fellow citizens with the saints and of the household of God, being built on the foundation of the apostles and prophets, Christ Jesus himself being the chief cornerstone; in whom the whole building, fitted together, grows into a holy temple in the Lord; in whom you also are built together for a habitation of God in the Spirit.",
    aliases: ["에베소서 2:19-22", "엡 2:19-22", "에베소서 2:20"],
  },
  {
    reference: "Ephesians 4:11-13",
    text: "He gave some to be apostles; and some, prophets; and some, evangelists; and some, shepherds and teachers; for the perfecting of the saints, to the work of serving, to the building up of the body of Christ, until we all attain to the unity of the faith and of the knowledge of the Son of God, to a full grown man, to the measure of the stature of the fullness of Christ,",
    aliases: ["에베소서 4:11-13", "엡 4:11-13", "에베소서 4:12"],
  },
  {
    reference: "1 Corinthians 3:9-11",
    text: "For we are God's fellow workers. You are God's farming, God's building. According to the grace of God which was given to me, as a wise master builder I laid a foundation, and another builds on it. But let each man be careful how he builds on it. For no one can lay any other foundation than that which has been laid, which is Jesus Christ.",
    aliases: ["고린도전서 3:9-11", "고전 3:9-11", "고린도전서 3:11"],
  },
  {
    reference: "1 Corinthians 14:26",
    text: "What is it then, brothers? When you come together, each one of you has a psalm, has a teaching, has a revelation, has another language, or has an interpretation. Let all things be done to build each other up.",
    aliases: ["고린도전서 14:26", "고전 14:26"],
  },
  {
    reference: "1 Peter 2:5",
    text: "You also as living stones are built up as a spiritual house, to be a holy priesthood, to offer up spiritual sacrifices, acceptable to God through Jesus Christ.",
    aliases: ["베드로전서 2:5", "벧전 2:5"],
  },
  {
    reference: "1 Peter 2:9",
    text: "But you are a chosen race, a royal priesthood, a holy nation, a people for God's own possession, that you may proclaim the excellence of him who called you out of darkness into his marvelous light.",
    aliases: ["베드로전서 2:9", "벧전 2:9"],
  },
  {
    reference: "1 Timothy 3:15",
    text: "but if I wait long, that you may know how men ought to behave themselves in God's house, which is the assembly of the living God, the pillar and ground of the truth.",
    aliases: ["디모데전서 3:15", "딤전 3:15"],
  },
  {
    reference: "1 Corinthians 1:10",
    text: "Now I beg you, brothers, through the name of our Lord, Jesus Christ, that you all speak the same thing, and that there be no divisions among you, but that you be perfected together in the same mind and in the same judgment.",
    aliases: ["고린도전서 1:10", "고전 1:10"],
  },
  {
    reference: "Matthew 28:19-20",
    text: "Go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all things that I commanded you. Behold, I am with you always, even to the end of the age. Amen.",
    aliases: ["마태복음 28:19-20", "마 28:19-20", "마태 28:19", "지상명령"],
  },
  {
    reference: "Matthew 4:19",
    text: "He said to them, “Come after me, and I will make you fishers for men.”",
    aliases: ["마태복음 4:19", "마 4:19", "마태 4:19"],
  },
  {
    reference: "Matthew 16:24",
    text: "Then Jesus said to his disciples, “If anyone desires to come after me, let him deny himself, take up his cross, and follow me.",
    aliases: ["마태복음 16:24", "마 16:24", "마태 16:24"],
  },
  {
    reference: "Luke 9:23",
    text: "He said to all, “If anyone desires to come after me, let him deny himself, take up his cross, and follow me.",
    aliases: ["누가복음 9:23", "눅 9:23"],
  },
  {
    reference: "John 8:31-32",
    text: "Jesus therefore said to those Jews who had believed him, “If you remain in my word, then you are truly my disciples. You will know the truth, and the truth will make you free.”",
    aliases: ["요한복음 8:31-32", "요 8:31-32", "요한 8:31"],
  },
  {
    reference: "John 15:8",
    text: "In this my Father is glorified, that you bear much fruit; and so you will be my disciples.",
    aliases: ["요한복음 15:8", "요 15:8", "요한 15:8"],
  },
  {
    reference: "John 17:20-21",
    text: "Not for these only do I pray, but for those also who will believe in me through their word, that they may all be one; even as you, Father, are in me, and I in you, that they also may be one in us; that the world may believe that you sent me.",
    aliases: ["요한복음 17:20-21", "요 17:20-21", "요한 17:21"],
  },
  {
    reference: "2 Timothy 2:2",
    text: "The things which you have heard from me among many witnesses, commit the same things to faithful men who will be able to teach others also.",
    aliases: ["디모데후서 2:2", "딤후 2:2"],
  },
  {
    reference: "Colossians 1:28-29",
    text: "We proclaim him, admonishing every man and teaching every man in all wisdom, that we may present every man perfect in Christ Jesus; for which I also labor, striving according to his working, which works in me mightily.",
    aliases: ["골로새서 1:28-29", "골 1:28-29", "골로새서 1:28"],
  },
  {
    reference: "Philippians 1:27",
    text: "Only let your way of life be worthy of the Good News of Christ, that whether I come and see you or am absent, I may hear of your state, that you stand firm in one spirit, with one soul striving for the faith of the Good News;",
    aliases: ["빌립보서 1:27", "빌 1:27"],
  },
  {
    reference: "Matthew 5:16",
    text: "Even so, let your light shine before men, that they may see your good works and glorify your Father who is in heaven.",
    aliases: ["마태복음 5:16", "마 5:16", "마태 5:16"],
  },
  {
    reference: "Mark 10:43-45",
    text: "But it shall not be so among you, but whoever wants to become great among you shall be your servant. Whoever of you wants to become first among you shall be bondservant of all. For the Son of Man also came not to be served but to serve, and to give his life as a ransom for many.",
    aliases: ["마가복음 10:43-45", "막 10:43-45", "마가 10:45"],
  },
];

function normalizeRef(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[–—]/g, "-");
}

function verseMatches(verse: MemoryVerse, scripture: string): boolean {
  const target = normalizeRef(scripture);
  if (!target) return false;
  const keys = [verse.reference, ...(verse.aliases ?? [])].map(normalizeRef);
  return keys.some(
    (k) => target === k || target.startsWith(k) || k.startsWith(target),
  );
}

/** Match this week's scripture reference to a memory verse, or null */
export function findMemoryVerse(scripture: string | null | undefined) {
  if (!scripture?.trim()) return null;
  return MEMORY_VERSES.find((v) => verseMatches(v, scripture)) ?? null;
}

/** Resolve verse body from the in-app catalog by reference (never from DB). */
export function resolveScriptureText(
  scripture: string | null | undefined,
): string | null {
  return findMemoryVerse(scripture)?.text ?? null;
}

/** Search catalog by reference, alias, or verse text */
export function searchMemoryVerses(query: string, limit = 12): MemoryVerse[] {
  const q = query.trim().toLowerCase();
  if (!q) return MEMORY_VERSES.slice(0, limit);
  const scored = MEMORY_VERSES.map((v) => {
    const hay = [
      v.reference,
      v.text,
      ...(v.aliases ?? []),
    ]
      .join(" ")
      .toLowerCase();
    const idx = hay.indexOf(q);
    return { v, score: idx < 0 ? Infinity : idx };
  })
    .filter((x) => x.score !== Infinity)
    .sort((a, b) => a.score - b.score);
  return scored.slice(0, limit).map((x) => x.v);
}

/** Stable pick for the week (same week → same verse) */
export function pickMemoryVerseForWeek(weekKey: string): MemoryVerse {
  let hash = 0;
  for (let i = 0; i < weekKey.length; i++) {
    hash = (hash * 31 + weekKey.charCodeAt(i)) >>> 0;
  }
  return MEMORY_VERSES[hash % MEMORY_VERSES.length];
}

/**
 * Golden-ticket verse.
 * 1) Match this week's scripture ref when possible
 * 2) Else a fixed weekly pick (never use private briefPoint text)
 */
export function resolveGoldenVerse(
  scripture: string | null | undefined,
  weekKey: string,
): MemoryVerse {
  return findMemoryVerse(scripture) ?? pickMemoryVerseForWeek(weekKey);
}

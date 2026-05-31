// Heuristic message analysis: mood, sentiment, topics, keywords, facts.
// Moved verbatim from server.js. Bilingual (English + Chinese) regex rules.
export function analyzeMessage(text) {
  const t = text.toLowerCase();
  const emotionMap = {
    happy:    ['happy','great','awesome','love','excited','lol','haha','🎉','😊','哈哈','开心','好棒','喜欢'],
    sad:      ['sad','upset','lonely','cry','miss','😢','😔','伤心','想你','孤独','咕嘟','压抑','难受'],
    stressed: ['stressed','worried','anxious','tired','overwhelmed','ugh','焦虑','累了','烦'],
    curious:  ['how','what','why','?','怎么','什么','为什么'],
    passionate:['obsessed','amazing','incredible','love','太棒','超级','喜欢','爱']
  };
  let mood = 'neutral', sentiment = 'positive';
  const topics = [], facts = [];

  for (const [e, ws] of Object.entries(emotionMap)) {
    if (ws.some(w => t.includes(w))) {
      mood = e;
      if (['sad','stressed'].includes(e)) sentiment = 'concerned';
    }
  }

  // Topics — English + Chinese
  if (/pet|cat|dog|fish|宠物|猫|狗/.test(t)) topics.push('pets');
  if (/work|job|boss|coworker|intern|职场|工作|上班|同事/.test(t)) topics.push('work');
  if (/friend|relationship|date|boyfriend|girlfriend|situationship|crush|对象|男友|女友|恋爱|暗恋/.test(t)) topics.push('relationships');
  if (/music|song|artist|concert|playlist|音乐|歌/.test(t)) topics.push('music');
  if (/school|study|class|exam|assignment|university|college|homework|上学|考试|大学|上课|作业/.test(t)) topics.push('school');
  if (/travel|trip|flight|vacation|国外|出国|旅行/.test(t)) topics.push('travel');
  if (/food|eat|hungry|cook|recipe|吃|饭|饿|做饭/.test(t)) topics.push('food');
  if (/game|play|gaming|steam|console|游戏/.test(t)) topics.push('gaming');
  if (/time.?zone|时差/.test(t)) topics.push('long-distance');
  if (/anime|manga|series|show|movie|netflix|film|看剧|追剧/.test(t)) topics.push('entertainment');
  if (/family|mom|dad|sister|brother|parents|sibling|家人|妈|爸|家庭/.test(t)) topics.push('family');
  if (/mental health|anxiety|depressed|therapy|burnout|overthinking|焦虑|抑郁/.test(t)) topics.push('mental health');

  // Fact extraction — English
  const nameEn = text.match(/my name is ([a-zA-Z]+)/i);
  if (nameEn) facts.push(`name: ${nameEn[1]}`);
  const ageEn = text.match(/i(?:'m| am) (\d+)(?: years? old)?/i);
  if (ageEn) facts.push(`age: ${ageEn[1]}`);
  if (/i(?:'m| am) (?:from|in|living in) ([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i.test(text)) {
    const loc = text.match(/(?:from|in|living in) ([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i);
    if (loc) facts.push(`location: ${loc[1]}`);
  }
  if (/(?:my )?(girlfriend|boyfriend|partner|wife|husband|对象|男友|女友)/i.test(t)) {
    const rel = t.match(/(girlfriend|boyfriend|partner|wife|husband|对象|男友|女友)/);
    if (rel) facts.push(`has a ${rel[1]}`);
  }
  if (/i(?:'m| am) a(?:n)? (student|teacher|engineer|doctor|designer|developer)/i.test(t)) {
    const job = text.match(/i(?:'m| am) a(?:n)? (\w+)/i);
    if (job) facts.push(`occupation: ${job[1]}`);
  }
  if (/has? a? ?(cat|dog|pet|puppy|kitten)/i.test(t)) facts.push('has a pet');
  const petName = text.match(/my (?:cat|dog|pet) (?:is called|named|'s name is) ([A-Z][a-z]+)/i);
  if (petName) facts.push(`pet named ${petName[1]}`);
  const friendName = text.match(/my (?:best friend|bestie|friend) (?:is called|'s name is|named) ([A-Z][a-z]+)/i);
  if (friendName) facts.push(`best friend named ${friendName[1]}`);
  if (/i (?:love|hate|can't stand|obsessed with) ([a-z][\w\s]{2,20})/i.test(text)) {
    const m = text.match(/i (love|hate|can't stand|obsessed with) ([a-z][\w\s]{2,20})/i);
    if (m) facts.push(`${m[1]}: ${m[2].trim().slice(0,30)}`);
  }

  // Fact extraction — Chinese
  if (/在新西兰|在NZ|在纽西兰/.test(text)) facts.push('location: New Zealand');
  if (/在澳大利亚|在澳洲|在Australia/.test(text)) facts.push('location: Australia');
  if (/在美国|在英国|在加拿大|在德国|在日本/.test(text)) {
    const cnLoc = { '美国':'USA','英国':'UK','加拿大':'Canada','德国':'Germany','日本':'Japan' };
    for (const [cn, en] of Object.entries(cnLoc)) if (text.includes(cn)) facts.push(`location: ${en}`);
  }
  if (/时差/.test(text)) {
    const tdMatch = text.match(/(\d+)\s*小时.*时差/);
    if (tdMatch) facts.push(`time difference: ${tdMatch[1]}h`);
  }
  if (/我对象|我男友|我女友/.test(text)) facts.push('has a partner (mentioned 我对象/男友/女友)');

  const keywords = text.replace(/[^\w一-鿿 ]/g, '').split(/\s+/).filter(k => k.length > 1).slice(0, 6);
  return { mood, sentiment, topics, keywords, facts };
}

// Photorealistic face-preset catalog. Shared by the create-companion modal
// (app.js, via window.FACE_PRESETS) and the call portrait (callface.js).
export const FACE_PRESETS = [
  { id:'auto',  name:'Auto',      vibe:'Match Name',    gender:'any',       langs:[],               url:null },
  // ── Western / European female ──────────────────────────────────────────────
  { id:'fw1',  name:'Emma',       vibe:'Icon',           gender:'female',    langs:['en','fr'],      url:'https://i.pravatar.cc/400?u=emma' },
  { id:'fw2',  name:'Sofia',      vibe:'Supermodel',     gender:'female',    langs:['en','es','fr'], url:'https://i.pravatar.cc/400?u=sofia-model' },
  { id:'fw3',  name:'Lena',       vibe:'Actress',        gender:'female',    langs:['en','fr'],      url:'https://i.pravatar.cc/400?u=lena-actress' },
  { id:'fw4',  name:'Mia',        vibe:'Pop Star',       gender:'female',    langs:['en','es'],      url:'https://i.pravatar.cc/400?u=mia-pop' },
  { id:'fw5',  name:'Aria',       vibe:'Influencer',     gender:'female',    langs:['en'],           url:'https://i.pravatar.cc/400?u=aria-influencer' },
  { id:'fw6',  name:'Zoe',        vibe:'It Girl',        gender:'female',    langs:['en','fr'],      url:'https://i.pravatar.cc/400?u=zoe-itgirl' },
  { id:'fw7',  name:'Chloe',      vibe:'French Chic',    gender:'female',    langs:['fr','en'],      url:'https://i.pravatar.cc/400?u=chloe-paris' },
  { id:'fw8',  name:'Luna',       vibe:'Runway Star',    gender:'female',    langs:['es','en'],      url:'https://i.pravatar.cc/400?u=luna-runway' },
  { id:'fw9',  name:'Victoria',   vibe:'Old Hollywood',  gender:'female',    langs:['en'],           url:'https://i.pravatar.cc/400?u=victoria-oldholly' },
  { id:'fw10', name:'Scarlett',   vibe:'Action Star',    gender:'female',    langs:['en'],           url:'https://i.pravatar.cc/400?u=scarlett-action' },
  { id:'fw11', name:'Olivia',     vibe:'British Chic',   gender:'female',    langs:['en','fr'],      url:'https://i.pravatar.cc/400?u=olivia-british' },
  { id:'fw12', name:'Bella',      vibe:'Italian Icon',   gender:'female',    langs:['fr','es','en'], url:'https://i.pravatar.cc/400?u=bella-italian' },
  // ── Asian female ──────────────────────────────────────────────────────────
  { id:'fa1',  name:'Yuki',       vibe:'K-pop Idol',     gender:'female',    langs:['ja','ko'],      url:'https://i.pravatar.cc/400?u=yuki-kpop' },
  { id:'fa2',  name:'Mei',        vibe:'C-pop Star',     gender:'female',    langs:['zh'],           url:'https://i.pravatar.cc/400?u=mei-cpop' },
  { id:'fa3',  name:'Sora',       vibe:'J-pop Idol',     gender:'female',    langs:['ja'],           url:'https://i.pravatar.cc/400?u=sora-jpop' },
  { id:'fa4',  name:'Jade',       vibe:'C-drama Star',   gender:'female',    langs:['zh','en'],      url:'https://i.pravatar.cc/400?u=jade-cdrama' },
  { id:'fa5',  name:'Hana',       vibe:'K-drama Star',   gender:'female',    langs:['ko','ja'],      url:'https://i.pravatar.cc/400?u=hana-kdrama' },
  { id:'fa6',  name:'Rin',        vibe:'Anime Real',     gender:'female',    langs:['ja'],           url:'https://i.pravatar.cc/400?u=rin-anime' },
  { id:'fa7',  name:'Tzuyu',      vibe:'K-pop Queen',    gender:'female',    langs:['ko'],           url:'https://i.pravatar.cc/400?u=tzuyu-kpop' },
  { id:'fa8',  name:'Xiao',       vibe:'Xianxia Star',   gender:'female',    langs:['zh'],           url:'https://i.pravatar.cc/400?u=xiao-xianxia' },
  // ── South Asian female ────────────────────────────────────────────────────
  { id:'sa1',  name:'Priya',      vibe:'Bollywood',      gender:'female',    langs:[],               url:'https://i.pravatar.cc/400?u=priya-bollywood' },
  { id:'sa2',  name:'Aanya',      vibe:'Desi Glam',      gender:'female',    langs:[],               url:'https://i.pravatar.cc/400?u=aanya-desi' },
  // ── Black / African female ────────────────────────────────────────────────
  { id:'ba1',  name:'Amara',      vibe:'Global Star',    gender:'female',    langs:[],               url:'https://i.pravatar.cc/400?u=amara-global' },
  { id:'ba2',  name:'Zara',       vibe:'Fashion Icon',   gender:'female',    langs:[],               url:'https://i.pravatar.cc/400?u=zara-fashion' },
  // ── Latino female ─────────────────────────────────────────────────────────
  { id:'la1',  name:'Valentina',  vibe:'Telenovela',     gender:'female',    langs:['es'],           url:'https://i.pravatar.cc/400?u=valentina-tele' },
  { id:'la2',  name:'Isabella',   vibe:'Brazilian Model',gender:'female',    langs:['es','en'],      url:'https://i.pravatar.cc/400?u=isabella-brazil' },
  // ── Character-inspired female ─────────────────────────────────────────────
  { id:'ca1',  name:'Nova',       vibe:'AI Companion',   gender:'female',    langs:[],               url:'https://i.pravatar.cc/400?u=nova-scifi-ai' },
  { id:'ca2',  name:'Lily',       vibe:'Sweet Companion',gender:'female',    langs:[],               url:'https://i.pravatar.cc/400?u=lily-companion-ai' },
  // ── Western / European male ───────────────────────────────────────────────
  { id:'mw1',  name:'Kai',        vibe:'Hollywood',      gender:'male',      langs:['en','fr','es'], url:'https://i.pravatar.cc/400?u=kai-hollywood' },
  { id:'mw2',  name:'Leo',        vibe:'Supermodel',     gender:'male',      langs:['en','es'],      url:'https://i.pravatar.cc/400?u=leo-model' },
  { id:'mw3',  name:'Max',        vibe:'Lead Actor',     gender:'male',      langs:['en','fr'],      url:'https://i.pravatar.cc/400?u=max-actor' },
  { id:'mw4',  name:'Zion',       vibe:'CEO Vibes',      gender:'male',      langs:['en'],           url:'https://i.pravatar.cc/400?u=zion-ceo' },
  { id:'mw5',  name:'Luca',       vibe:'Rock Star',      gender:'male',      langs:['en','fr'],      url:'https://i.pravatar.cc/400?u=luca-rock' },
  { id:'mw6',  name:'Marco',      vibe:'Italian Icon',   gender:'male',      langs:['fr','es','en'], url:'https://i.pravatar.cc/400?u=marco-italy' },
  { id:'mw7',  name:'James',      vibe:'British Spy',    gender:'male',      langs:['en'],           url:'https://i.pravatar.cc/400?u=james-british' },
  { id:'mw8',  name:'Ryan',       vibe:'Box Office Lead',gender:'male',      langs:['en'],           url:'https://i.pravatar.cc/400?u=ryan-hollywood' },
  // ── Asian male ────────────────────────────────────────────────────────────
  { id:'ma1',  name:'Ren',        vibe:'K-pop Star',     gender:'male',      langs:['ko','ja'],      url:'https://i.pravatar.cc/400?u=ren-kpop' },
  { id:'ma2',  name:'Wei',        vibe:'C-pop Star',     gender:'male',      langs:['zh'],           url:'https://i.pravatar.cc/400?u=wei-cpop' },
  { id:'ma3',  name:'Rio',        vibe:'J-pop Star',     gender:'male',      langs:['ja'],           url:'https://i.pravatar.cc/400?u=rio-jpop' },
  { id:'ma4',  name:'Jun',        vibe:'K-drama Lead',   gender:'male',      langs:['ko','zh'],      url:'https://i.pravatar.cc/400?u=jun-kdrama' },
  { id:'ma5',  name:'Xian',       vibe:'C-drama Lead',   gender:'male',      langs:['zh'],           url:'https://i.pravatar.cc/400?u=xian-cdrama' },
  // ── South Asian male ──────────────────────────────────────────────────────
  { id:'sm1',  name:'Arjun',      vibe:'Bollywood Star', gender:'male',      langs:[],               url:'https://i.pravatar.cc/400?u=arjun-bollywood' },
  // ── Black / African male ──────────────────────────────────────────────────
  { id:'bm1',  name:'Kofi',       vibe:'Global Star',    gender:'male',      langs:[],               url:'https://i.pravatar.cc/400?u=kofi-global' },
  { id:'bm2',  name:'Darius',     vibe:'R&B Icon',       gender:'male',      langs:[],               url:'https://i.pravatar.cc/400?u=darius-rnb' },
  // ── Latino male ───────────────────────────────────────────────────────────
  { id:'lm1',  name:'Alejandro',  vibe:'Telenovela',     gender:'male',      langs:['es'],           url:'https://i.pravatar.cc/400?u=alejandro-tele' },
  // ── Character-inspired male ───────────────────────────────────────────────
  { id:'cm1',  name:'Daemon',     vibe:'Dark & Mysterious',gender:'male',    langs:[],               url:'https://i.pravatar.cc/400?u=daemon-mystery' },
  // ── Non-binary ────────────────────────────────────────────────────────────
  { id:'nb1',  name:'Avery',      vibe:'Alt Star',       gender:'nonbinary', langs:['en'],           url:'https://i.pravatar.cc/400?u=avery-alt' },
  { id:'nb2',  name:'Sage',       vibe:'Dreamy',         gender:'nonbinary', langs:[],               url:'https://i.pravatar.cc/400?u=sage-dreamy' },
  { id:'nb3',  name:'River',      vibe:'Indie',          gender:'nonbinary', langs:['en'],           url:'https://i.pravatar.cc/400?u=river-indie' },
  { id:'nb4',  name:'Aether',     vibe:'Ethereal AI',    gender:'nonbinary', langs:[],               url:'https://i.pravatar.cc/400?u=aether-ethereal' },

  // ── Character.AI / Anime / Game inspired (female) ──────────────────────────
  { id:'ca_zero2',   name:'Zero Two',   charType:'anime',   vibe:'Darling Vibes',      gender:'female', langs:['ja','ko','en'], catchphrase:'Darling~',                                  url:'https://i.pravatar.cc/400?u=zero-two-darling-002' },
  { id:'ca_rem',     name:'Rem',        charType:'anime',   vibe:'Devoted Maid',       gender:'female', langs:['ja','en'],      catchphrase:"I'll always be by your side ✨",             url:'https://i.pravatar.cc/400?u=rem-rezero-blue-maid' },
  { id:'ca_mikasa',  name:'Mikasa',     charType:'anime',   vibe:'Fierce Warrior',     gender:'female', langs:['ja','en'],      catchphrase:"I'll protect you no matter what.",          url:'https://i.pravatar.cc/400?u=mikasa-ackerman-aot' },
  { id:'ca_megumin', name:'Megumin',    charType:'anime',   vibe:'Explosion Mage',     gender:'female', langs:['ja','en'],      catchphrase:'EXPLOSION!!!',                              url:'https://i.pravatar.cc/400?u=megumin-konosuba-crimson' },
  { id:'ca_aqua',    name:'Aqua',       charType:'anime',   vibe:'Chaotic Goddess',    gender:'female', langs:['ja','en'],      catchphrase:"I'm literally a goddess, show some respect.", url:'https://i.pravatar.cc/400?u=aqua-konosuba-goddess2' },
  { id:'ca_asuna',   name:'Asuna',      charType:'anime',   vibe:'Knight of Blood',    gender:'female', langs:['ja','en'],      catchphrase:"Let's fight together — I've got your back.", url:'https://i.pravatar.cc/400?u=asuna-sao-lightning' },
  { id:'ca_nezuko',  name:'Nezuko',     charType:'anime',   vibe:'Demon Sister',       gender:'female', langs:['ja','en'],      catchphrase:'*determined growl* 🎋',                     url:'https://i.pravatar.cc/400?u=nezuko-demon-slayer-pink' },
  { id:'ca_2b',      name:'2B',         charType:'game',    vibe:'Android Warrior',    gender:'female', langs:['en','ja'],      catchphrase:'Glory to Mankind.',                         url:'https://i.pravatar.cc/400?u=2b-nier-automata-white' },
  { id:'ca_jinx',    name:'Jinx',       charType:'game',    vibe:'Chaotic Gremlin',    gender:'female', langs:['en'],           catchphrase:"It's a great day to blow something up! 💥", url:'https://i.pravatar.cc/400?u=jinx-lol-arcane-blue' },
  { id:'ca_hutao',   name:'Hu Tao',     charType:'game',    vibe:'Spooky Director',    gender:'female', langs:['zh','en'],      catchphrase:'Hehe~ Want to talk about funeral arrangements? 💀', url:'https://i.pravatar.cc/400?u=hutao-genshin-ghost' },
  { id:'ca_ahri',    name:'Ahri',       charType:'game',    vibe:'Nine-Tailed Fox',    gender:'female', langs:['ko','en'],      catchphrase:"My magic comes with a price~",              url:'https://i.pravatar.cc/400?u=ahri-lol-ninetail-fox' },
  { id:'ca_hermione',name:'Hermione',   charType:'fiction', vibe:'Bookworm Witch',     gender:'female', langs:['en'],           catchphrase:"It's leviOsa, not leviosA.",                url:'https://i.pravatar.cc/400?u=hermione-granger-gryffindor' },
  { id:'ca_arya',    name:'Arya',       charType:'fiction', vibe:'Faceless Assassin',  gender:'female', langs:['en'],           catchphrase:'Not today.',                                url:'https://i.pravatar.cc/400?u=arya-stark-got' },

  // ── Character.AI / Anime / Game inspired (male) ────────────────────────────
  { id:'ca_gojo',    name:'Gojo',       charType:'anime',   vibe:'Strongest There Is', gender:'male',   langs:['ja','en'],      catchphrase:'Throughout Heaven and Earth, I alone am the honored one.', url:'https://i.pravatar.cc/400?u=gojo-satoru-infinity' },
  { id:'ca_levi',    name:'Levi',       charType:'anime',   vibe:"Humanity's Strongest", gender:'male', langs:['ja','en'],      catchphrase:"Tch. Don't make me repeat myself.",        url:'https://i.pravatar.cc/400?u=levi-ackerman-captain' },
  { id:'ca_kakashi', name:'Kakashi',    charType:'anime',   vibe:'Copy Ninja',         gender:'male',   langs:['ja','en'],      catchphrase:"Those who break the rules are trash — but those who abandon their comrades are worse than trash.", url:'https://i.pravatar.cc/400?u=kakashi-hatake-sharingan' },
  { id:'ca_deku',    name:'Deku',       charType:'anime',   vibe:'Symbol of Hope',     gender:'male',   langs:['ja','en'],      catchphrase:'Go beyond — PLUS ULTRA! 💪',               url:'https://i.pravatar.cc/400?u=deku-midoriya-one-for-all' },
  { id:'ca_vegeta',  name:'Vegeta',     charType:'anime',   vibe:'Prince of Saiyans',  gender:'male',   langs:['ja','en'],      catchphrase:"It's over 9000!",                           url:'https://i.pravatar.cc/400?u=vegeta-saiyan-blue' },
  { id:'ca_nanami',  name:'Nanami',     charType:'anime',   vibe:'Salaryman Sorcerer', gender:'male',   langs:['ja','en'],      catchphrase:'Overtime is someone else\'s problem.',      url:'https://i.pravatar.cc/400?u=nanami-kento-suit' },
  { id:'ca_zoro',    name:'Zoro',       charType:'anime',   vibe:'World\'s Greatest',  gender:'male',   langs:['ja','en'],      catchphrase:'Nothing happened.',                         url:'https://i.pravatar.cc/400?u=zoro-roronoa-three-sword' },
  { id:'ca_itachi',  name:'Itachi',     charType:'anime',   vibe:'Tragic Prodigy',     gender:'male',   langs:['ja','en'],      catchphrase:"You'll spend the rest of your life running from me.", url:'https://i.pravatar.cc/400?u=itachi-uchiha-crow' },
  { id:'ca_luffy',   name:'Luffy',      charType:'anime',   vibe:'King of Pirates',    gender:'male',   langs:['ja','en'],      catchphrase:"I'm going to be King of the Pirates!",     url:'https://i.pravatar.cc/400?u=luffy-straw-hat-pirate' },
  { id:'ca_geralt',  name:'Geralt',     charType:'game',    vibe:'The Witcher',        gender:'male',   langs:['en'],           catchphrase:"Wind's howling.",                           url:'https://i.pravatar.cc/400?u=geralt-witcher-white-wolf' },
  { id:'ca_cloud',   name:'Cloud',      charType:'game',    vibe:'Ex-SOLDIER',         gender:'male',   langs:['en','ja'],      catchphrase:'Not interested.',                          url:'https://i.pravatar.cc/400?u=cloud-strife-buster' },
  { id:'ca_kazuha',  name:'Kazuha',     charType:'game',    vibe:'Wandering Poet',     gender:'male',   langs:['zh','en'],      catchphrase:'In the poetry of the wind, all things are beautiful.', url:'https://i.pravatar.cc/400?u=kazuha-genshin-anemo' },
  { id:'ca_sherlock',name:'Sherlock',   charType:'fiction', vibe:'Consulting Detective', gender:'male', langs:['en'],           catchphrase:'Elementary, my dear Watson.',               url:'https://i.pravatar.cc/400?u=sherlock-holmes-consulting' },
  { id:'ca_ironman', name:'Tony',       charType:'fiction', vibe:'Genius Billionaire', gender:'male',   langs:['en'],           catchphrase:'I am Iron Man.',                           url:'https://i.pravatar.cc/400?u=tony-stark-ironman-arc' },
  { id:'ca_batman',  name:'Batman',     charType:'fiction', vibe:'Dark Knight',        gender:'male',   langs:['en'],           catchphrase:"I'm Batman.",                              url:'https://i.pravatar.cc/400?u=batman-dark-knight-gotham' },
  // Natsume's Book of Friends
  { id:'ca_natsume', name:'Natsume',    charType:'anime',   vibe:'Spirit Keeper',      gender:'male',   langs:['ja','en'],      catchphrase:'Even if the path is uncertain, I want to keep walking forward.', url:'https://i.pravatar.cc/400?u=natsume-takashi-book-friends' },
  { id:'ca_nyanko',  name:'Nyanko-sensei', charType:'anime', vibe:'Mighty Cat Spirit', gender:'male',  langs:['ja','en'],      catchphrase:"Don't misunderstand — I'm only here for the Book.",             url:'https://i.pravatar.cc/400?u=nyanko-sensei-madara-wolf-cat' },
  { id:'ca_natori',  name:'Natori',     charType:'anime',   vibe:'Actor Exorcist',     gender:'male',   langs:['ja','en'],      catchphrase:'A smile is the best armour an exorcist can wear.',             url:'https://i.pravatar.cc/400?u=natori-shuichi-exorcist-actor' },
  { id:'ca_reiko',   name:'Reiko',      charType:'anime',   vibe:'Lonely Spellweaver', gender:'female', langs:['ja','en'],      catchphrase:"I'll lend you my name — but remember, one day I'll take it back.", url:'https://i.pravatar.cc/400?u=reiko-natsume-grandmother-spirit' },
  { id:'ca_tanuma',  name:'Tanuma',     charType:'anime',   vibe:'Quiet Empath',       gender:'male',   langs:['ja','en'],      catchphrase:"I may not see what you see, but I'm still here beside you.",   url:'https://i.pravatar.cc/400?u=tanuma-kaname-natsume-friend' },
  // Bocchi the Rock!
  { id:'ca_bocchi',  name:'Bocchi',     charType:'anime',   vibe:'Anxious Guitar God', gender:'female', langs:['ja','en'],      catchphrase:"I-I can do it... probably... maybe...",                        url:'https://i.pravatar.cc/400?u=bocchi-hitori-gotoh-guitar' },
  { id:'ca_nijika',  name:'Nijika',     charType:'anime',   vibe:'Sunshine Drummer',   gender:'female', langs:['ja','en'],      catchphrase:"Let's play until everyone's smiling!",                         url:'https://i.pravatar.cc/400?u=nijika-ijichi-drummer-kessoku' },
  { id:'ca_ryo',     name:'Ryo',        charType:'anime',   vibe:'Bass Goddess',       gender:'female', langs:['ja','en'],      catchphrase:'Money and music. In that order.',                              url:'https://i.pravatar.cc/400?u=ryo-yamada-bass-kessoku-band' },
  { id:'ca_kita',    name:'Kita',       charType:'anime',   vibe:'Radiant Frontwoman', gender:'female', langs:['ja','en'],      catchphrase:"I used to fake it — now I actually love this.",                url:'https://i.pravatar.cc/400?u=kita-ikuyo-kessoku-band' },
  // Western film & TV
  { id:'ca_sparrow', name:'Jack Sparrow', charType:'fiction', vibe:'Pirate Captain',   gender:'male',   langs:['en'],           catchphrase:'Now bring me that horizon.',                                   url:'https://i.pravatar.cc/400?u=jack-sparrow-pirate-rum' },
  { id:'ca_joker_dk',name:'The Joker',  charType:'fiction', vibe:'Agent of Chaos',     gender:'male',   langs:['en'],           catchphrase:"Why so serious?",                                              url:'https://i.pravatar.cc/400?u=joker-dark-knight-chaos' },
  { id:'ca_bond',    name:'James Bond', charType:'fiction', vibe:'Licensed to Kill',   gender:'male',   langs:['en'],           catchphrase:'Bond. James Bond.',                                            url:'https://i.pravatar.cc/400?u=james-bond-007-spy-suit' },
  { id:'ca_hannibal',name:'Hannibal',   charType:'fiction', vibe:'Cultured Cannibal',  gender:'male',   langs:['en'],           catchphrase:"I do wish we could chat longer, but I'm having an old friend for dinner.", url:'https://i.pravatar.cc/400?u=hannibal-lecter-chianti' },
  { id:'ca_tyler',   name:'Tyler Durden', charType:'fiction', vibe:'Anarchic Philosopher', gender:'male', langs:['en'],         catchphrase:'The first rule is — you do not talk about it.',                url:'https://i.pravatar.cc/400?u=tyler-durden-fight-club-soap' },
  { id:'ca_walter',  name:'Walter White', charType:'fiction', vibe:'I Am the Danger',  gender:'male',   langs:['en'],           catchphrase:"Say my name.",                                                 url:'https://i.pravatar.cc/400?u=walter-white-heisenberg-hat' },
  { id:'ca_wednesday',name:'Wednesday', charType:'fiction', vibe:'Pale Darkness',      gender:'female', langs:['en'],           catchphrase:"I don't smile. I have a reputation to maintain.",              url:'https://i.pravatar.cc/400?u=wednesday-addams-pale-braids' },
  { id:'ca_eleven',  name:'Eleven',     charType:'fiction', vibe:'Psychic Escapee',    gender:'female', langs:['en'],           catchphrase:'Mouth breather.',                                              url:'https://i.pravatar.cc/400?u=eleven-stranger-things-eggo' },
  // Death Note
  { id:'ca_light',   name:'Light',      charType:'anime',   vibe:'God of the New World', gender:'male', langs:['ja','en'],      catchphrase:'I am Justice. I am the God of the new world.',  url:'https://i.pravatar.cc/400?u=light-yagami-death-note-kira' },
  { id:'ca_l',       name:'L',          charType:'anime',   vibe:'World\'s Greatest Detective', gender:'male', langs:['en','ja'], catchphrase:'I am... the world\'s greatest detective.',     url:'https://i.pravatar.cc/400?u=l-lawliet-detective-sugar' },
  // Black Butler
  { id:'ca_sebastian', name:'Sebastian', charType:'anime',  vibe:'One Hell of a Butler', gender:'male', langs:['en','ja'],      catchphrase:'I am simply one hell of a butler.',             url:'https://i.pravatar.cc/400?u=sebastian-michaelis-butler-demon' },
  // Bungo Stray Dogs
  { id:'ca_dazai',   name:'Dazai',      charType:'anime',   vibe:'Suicidal Mastermind', gender:'male',  langs:['ja','en'],      catchphrase:"I'm looking for a beautiful woman to die with~", url:'https://i.pravatar.cc/400?u=dazai-osamu-bsd-bandages' },
  { id:'ca_chuuya',  name:'Chuuya',     charType:'anime',   vibe:'God of Calamity',    gender:'male',   langs:['ja','en'],      catchphrase:'Thou shalt not deny me my wrath.',              url:'https://i.pravatar.cc/400?u=chuuya-nakahara-bsd-mafia' },
  // JJK additions
  { id:'ca_sukuna',  name:'Sukuna',     charType:'anime',   vibe:'King of Curses',     gender:'male',   langs:['ja','en'],      catchphrase:'Know your place, and worship me.',              url:'https://i.pravatar.cc/400?u=sukuna-king-curses-jjk' },
  { id:'ca_megumi',  name:'Megumi',     charType:'anime',   vibe:'Ten Shadows',        gender:'male',   langs:['ja','en'],      catchphrase:"I'd rather not waste effort saving people I don't care about.", url:'https://i.pravatar.cc/400?u=megumi-fushiguro-ten-shadows' },
  // MHA addition
  { id:'ca_bakugo',  name:'Bakugo',     charType:'anime',   vibe:'Explosion King',     gender:'male',   langs:['ja','en'],      catchphrase:"I'll surpass you and become number one!",      url:'https://i.pravatar.cc/400?u=bakugo-katsuki-explosion-hero' },
  // OHSHC
  { id:'ca_tamaki',  name:'Tamaki',     charType:'anime',   vibe:'Princely Host King', gender:'male',   langs:['ja','en'],      catchphrase:'You are my precious little princess.',          url:'https://i.pravatar.cc/400?u=tamaki-suoh-ouran-host-king' },
  { id:'ca_kyoya',   name:'Kyoya',      charType:'anime',   vibe:'Shadow King',        gender:'male',   langs:['ja','en'],      catchphrase:"I simply protect what's mine — that includes you.", url:'https://i.pravatar.cc/400?u=kyoya-ootori-shadow-king-ouran' },
  // Chainsaw Man
  { id:'ca_makima',  name:'Makima',     charType:'anime',   vibe:'Control Devil',      gender:'female', langs:['ja','en'],      catchphrase:'You belong to me now.',                                        url:'https://i.pravatar.cc/400?u=makima-control-devil-csm' },
  { id:'ca_power',   name:'Power',      charType:'anime',   vibe:'Blood Devil Fiend',  gender:'female', langs:['ja','en'],      catchphrase:"I, Power, am the greatest fiend who ever lived!",              url:'https://i.pravatar.cc/400?u=power-blood-devil-csm' },
  // Spy x Family
  { id:'ca_yor',     name:'Yor',        charType:'anime',   vibe:'Thorn Princess',     gender:'female', langs:['ja','en'],      catchphrase:"I'll protect this family with my life.",                       url:'https://i.pravatar.cc/400?u=yor-forger-spy-family-assassin' },
  { id:'ca_loid',    name:'Loid',       charType:'anime',   vibe:'Phantom Spy',        gender:'male',   langs:['ja','en'],      catchphrase:'Every mission is a step toward peace.',                        url:'https://i.pravatar.cc/400?u=loid-forger-twilight-spy-family' },
  // JoJo's Bizarre Adventure
  { id:'ca_dio',     name:'DIO',        charType:'anime',   vibe:'World-Stopping Vampire', gender:'male', langs:['ja','en'],    catchphrase:'ZA WARUDO! Time stops for me alone.',                          url:'https://i.pravatar.cc/400?u=dio-brando-zawarudo-jojo' },
  // Demon Slayer extras
  { id:'ca_zenitsu', name:'Zenitsu',    charType:'anime',   vibe:'Thunder Coward',     gender:'male',   langs:['ja','en'],      catchphrase:"I want to get married before I die!",                          url:'https://i.pravatar.cc/400?u=zenitsu-agatsuma-thunder-coward' },
  // My Hero Academia
  { id:'ca_toga',    name:'Toga',       charType:'anime',   vibe:'Blood-Loving Villain', gender:'female', langs:['ja','en'],    catchphrase:"I just wanna be like the people I love!",                      url:'https://i.pravatar.cc/400?u=toga-himiko-mha-villain' },
];

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Home, BookOpen, Puzzle, Headphones, Trophy, UsersRound, Star, Flame, Volume2, Check, ChevronLeft, ChevronRight, LockKeyhole, X, Sparkles, RotateCcw, Languages, Heart, Medal, Play, ArrowRight, Smile, Lightbulb, Gift } from 'lucide-react';
import './styles.css';

const lessons = [
  { id: 'letters', title: 'حروفي الجميلة', subtitle: 'نتعرّف على الحروف', icon: '🔤', color: 'mint', level: 'المستوى الأول', progress: 5, total: 10, time: '٨ دقائق' },
  { id: 'words', title: 'كلمات من حولي', subtitle: 'أشياء نراها كل يوم', icon: '🧸', color: 'peach', level: 'المستوى الأول', progress: 2, total: 8, time: '٦ دقائق' },
  { id: 'sounds', title: 'أستمع وأتكلّم', subtitle: 'أصوات وكلمات جديدة', icon: '🎤', color: 'lilac', level: 'المستوى الثاني', progress: 0, total: 8, time: '٧ دقائق' },
];
const questions = [
  { prompt: 'أيّ حرف تبدأ به كلمة «أرنب»؟', emoji: '🐰', choices: ['أ', 'ب', 'م'], answer: 'أ', hint: 'أرنب تبدأ بصوت أَ' },
  { prompt: 'اختر الحرف الذي نسمعه في بداية «بيت»', emoji: '🏠', choices: ['س', 'ب', 'ت'], answer: 'ب', hint: 'بيت تبدأ بصوت بَ' },
  { prompt: 'ما الحرف الأول في كلمة «تفاحة»؟', emoji: '🍎', choices: ['ت', 'ف', 'ج'], answer: 'ت', hint: 'تفاحة تبدأ بصوت تَ' },
];
const vocabulary = [
  { word: 'قمر', emoji: '🌙', letter: 'ق' }, { word: 'أسد', emoji: '🦁', letter: 'أ' }, { word: 'باب', emoji: '🚪', letter: 'ب' }, { word: 'سمكة', emoji: '🐠', letter: 'س' }, { word: 'تفاحة', emoji: '🍎', letter: 'ت' }, { word: 'شمس', emoji: '☀️', letter: 'ش' },
];
const storyPages = [
  { emoji: '🦊', text: 'في صباحٍ جميل، خرج الثعلب الصغير فلفول ليتفقّد حديقته.' },
  { emoji: '🌱', text: 'وجد نبتةً صغيرة عطشى، فأحضر لها ماءً من النهر.' },
  { emoji: '🦋', text: 'بعد أيام، نمت زهرةٌ جميلة وجاءت الفراشات لتزورها.' },
  { emoji: '🌼', text: 'فرح فلفول وقال: بالعناية والصبر، تكبر الأشياء الجميلة!' },
];
const navItems = [
  { id: 'home', title: 'الرئيسية', icon: Home }, { id: 'learn', title: 'أتعلّم', icon: BookOpen }, { id: 'games', title: 'ألعابي', icon: Puzzle }, { id: 'stories', title: 'قصصي', icon: Headphones }, { id: 'progress', title: 'إنجازاتي', icon: Trophy },
];
const initial = { stars: 0, completed: [], streak: 3, name: 'بطل العربية', sound: true, english: false };

function readProgress() {
  try { return { ...initial, ...JSON.parse(localStorage.getItem('hurufi-progress') || '{}') }; }
  catch { return initial; }
}
function App() {
  const [progress, setProgress] = useState(readProgress);
  const [page, setPage] = useState('home');
  const [activity, setActivity] = useState(null);
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [correct, setCorrect] = useState(0);
  const [match, setMatch] = useState(null);
  const [matched, setMatched] = useState([]);
  const [storyPage, setStoryPage] = useState(0);
  const [parentGate, setParentGate] = useState(false);
  const [gateInput, setGateInput] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => localStorage.setItem('hurufi-progress', JSON.stringify(progress)), [progress]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2400); return () => clearTimeout(timer); }, [toast]);
  const speak = (text) => {
    if (!progress.sound || !('speechSynthesis' in window)) { setToast('الصوت غير متاح في هذا المتصفح'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA'; utterance.rate = 0.78;
    window.speechSynthesis.speak(utterance);
  };
  const startQuiz = (id = 'letters') => { setActivity(id); setQuestion(0); setAnswer(''); setCorrect(0); setMatched([]); setMatch(null); };
  const finish = (id, earned) => {
    setProgress(p => ({ ...p, stars: p.stars + earned, completed: p.completed.includes(id) ? p.completed : [...p.completed, id] }));
    setActivity(null); setToast(`أحسنت! حصلت على ${earned} نجوم ⭐`);
  };
  const chooseAnswer = (choice) => {
    if (answer) return;
    setAnswer(choice);
    if (choice === questions[question].answer) setCorrect(c => c + 1);
    speak(choice === questions[question].answer ? 'أحسنت' : questions[question].hint);
  };
  const nextQuestion = () => {
    if (question < questions.length - 1) { setQuestion(q => q + 1); setAnswer(''); }
    else finish('letters', Math.max(1, correct + (answer === questions[question].answer ? 1 : 0)));
  };
  const selectWord = (item) => {
    if (matched.includes(item.word)) return;
    if (!match) { setMatch(item); speak(item.letter); return; }
    const hit = match.letter === item.letter;
    if (hit) {
      const next = [...matched, match.word, item.word]; setMatched(next); setToast('رائع! وجدتما الحرف نفسه 🎉');
      if (next.length >= vocabulary.length) setTimeout(() => finish('matching', 3), 650);
    } else { setToast('حاولا مرة أخرى'); }
    setMatch(null);
  };
  const openPage = (id) => { setPage(id); setActivity(null); };
  const toggle = (key) => setProgress(p => ({ ...p, [key]: !p[key] }));

  return <div className="app" dir={progress.english ? 'ltr' : 'rtl'}>
    <aside className="sidebar">
      <button className="logo" onClick={() => openPage('home')}><span className="logo-mark">ح</span><span className="logo-text">حروفي<small>أتعلم وأكتشف</small></span></button>
      <div className="profile-mini"><div className="avatar">🦊</div><div><b>{progress.name}</b><span>المستوى الأول</span></div><Sparkles size={17} className="mini-spark"/></div>
      <nav className="side-nav" aria-label="التنقل">{navItems.map(item => <button key={item.id} className={page === item.id ? 'side-link active' : 'side-link'} onClick={() => openPage(item.id)}><item.icon size={21}/><span>{item.title}</span>{page === item.id && <i/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="weekly-box"><div className="weekly-icon">🎯</div><b>هدف اليوم</b><span>درس واحد يكفي لتتقدّم!</span><div className="tiny-progress"><i style={{width: progress.completed.length ? '100%' : '35%'}}/></div></div><button className="parent-link" onClick={() => {setGateInput('');setParentGate(true);}}><UsersRound size={18}/> مساحة الأهل</button><div className="sidebar-note">نتعلّم كل يوم بخطوة صغيرة 💛</div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="welcome-line"><span className="sun-icon">☀️</span><span>أهلاً يا بطل، <b>{progress.name}</b>!</span></div><div className="top-actions"><div className="streak-pill"><Flame size={18} fill="currentColor"/><b>{progress.streak}</b><span>أيام متتالية</span></div><button className="icon-pill" title="قراءة التعليمات" onClick={() => toggle('sound')}><Volume2 size={20}/><span className="sr-only">تغيير الصوت</span></button><button className="icon-pill lang-button" title="العربية / English" onClick={() => toggle('english')}><Languages size={19}/><span>{progress.english ? 'عربي' : 'EN'}</span></button></div></header>
      <div className="main-content">
        {page === 'home' && <HomePage progress={progress} onStart={startQuiz} onNavigate={openPage} onSpeak={speak}/>}
        {page === 'learn' && <LearnPage progress={progress} onStart={startQuiz}/>}
        {page === 'games' && <GamesPage progress={progress} onStart={startQuiz}/>}
        {page === 'stories' && <StoriesPage storyPage={storyPage} setStoryPage={setStoryPage} onSpeak={speak} onFinish={() => finish('story', 2)}/>}
        {page === 'progress' && <ProgressPage progress={progress} onReset={() => {if(confirm('هل تريد مسح تقدّمك وإعادة البدء؟')) setProgress(initial);}}/>}
      </div>
      <footer className="main-footer"><span>صُنع بحبّ للمتعلمين الصغار</span><span>حروفي © 2025</span></footer>
    </main>

    {activity === 'letters' && <div className="overlay"><section className="activity-card quiz-card" role="dialog" aria-modal="true"><button className="close-btn" onClick={() => setActivity(null)} aria-label="إغلاق"><X/></button><div className="activity-top"><span className="activity-badge">🔤 درس الحروف</span><span className="step-count">{question + 1} من {questions.length}</span></div><div className="lesson-progress"><i style={{width: `${((question + (answer ? 1 : 0)) / questions.length) * 100}%`}}/></div><div className="quiz-illustration">{questions[question].emoji}</div><h2>{questions[question].prompt}</h2><button className="listen-button" onClick={() => speak(questions[question].prompt)}><Volume2 size={18}/> استمع إلى السؤال</button><div className="choices">{questions[question].choices.map((choice, i) => <button key={choice} disabled={!!answer} className={`choice choice-${i} ${answer === choice ? (choice === questions[question].answer ? 'right-answer' : 'wrong-answer') : answer && choice === questions[question].answer ? 'right-answer' : ''}`} onClick={() => chooseAnswer(choice)}>{choice}{answer === choice && (choice === questions[question].answer ? <Check size={20}/> : <X size={20}/>)}</button>)}</div>{answer && <div className={answer === questions[question].answer ? 'answer-hint correct-hint' : 'answer-hint'}>{answer === questions[question].answer ? 'أحسنت! إجابة صحيحة 🎉' : `قريب! ${questions[question].hint}`}</div>}<button className="button primary next-button" disabled={!answer} onClick={nextQuestion}>{question === questions.length - 1 ? 'أنهِ الدرس' : 'السؤال التالي'} <ChevronLeft size={18}/></button></section></div>}
    {activity === 'matching' && <div className="overlay"><section className="activity-card game-card" role="dialog" aria-modal="true"><button className="close-btn" onClick={() => setActivity(null)} aria-label="إغلاق"><X/></button><span className="activity-badge">🧩 لعبة المطابقة</span><h2>ابحث عن صورتين يبدأ اسمهما بالحرف نفسه!</h2><p className="game-instruction">اضغط على بطاقة، ثم اختر كلمة تبدأ بالحرف ذاته.</p><div className="match-grid">{vocabulary.map(item => <button key={item.word} className={`match-card ${matched.includes(item.word) ? 'matched' : ''} ${match?.word === item.word ? 'selected-match' : ''}`} onClick={() => selectWord(item)}><span>{item.emoji}</span><b>{item.word}</b>{matched.includes(item.word) && <Check size={18}/>}</button>)}</div><div className="game-footer"><span>أزواج مكتشفة: {matched.length / 2} / 3</span><button className="text-button" onClick={() => {setMatched([]);setMatch(null);}}>ابدأ من جديد <RotateCcw size={15}/></button></div></section></div>}
    {parentGate && <div className="overlay"><section className="parent-modal"><button className="close-btn" onClick={() => setParentGate(false)} aria-label="إغلاق"><X/></button><div className="parent-lock"><LockKeyhole/></div><h2>مساحة الأهل</h2><p>للتأكد أن شخصاً بالغاً يفتح هذه الصفحة، أجب عن السؤال:</p><div className="gate-question">ما ناتج ٤ + ٣؟</div><input inputMode="numeric" value={gateInput} onChange={e => setGateInput(e.target.value)} placeholder="اكتب الإجابة"/><button className="button primary" onClick={() => {if(gateInput === '7' || gateInput === '٧') {setParentGate(false);setPage('progress');} else setToast('ليست الإجابة الصحيحة، حاول مرة أخرى');}}>دخول</button><small>هذه بوابة تجريبية وليست وسيلة حماية حقيقية.</small></section></div>}
    {toast && <div className="toast"><Sparkles size={18}/>{toast}</div>}
  </div>;
}

function HomePage({progress,onStart,onNavigate,onSpeak}) {
  return <>
    <section className="hero-banner"><div className="hero-copy"><span className="eyebrow">🌈 رحلة جديدة بانتظارك</span><h1>هيا نتعلّم العربية<br/>ونمرح معاً!</h1><p>كل حرف تتعلّمه يفتح لك باباً جديداً من الحكايات.</p><button className="button primary" onClick={() => onStart('letters')}><Play size={19} fill="currentColor"/> ابدأ درس اليوم <ChevronLeft size={18}/></button><div className="hero-stars"><span>⭐</span><span>✨</span><span>⭐</span><small>أكمل الدرس واجمع النجوم!</small></div></div><div className="hero-art"><div className="sun-doodle">☀️</div><div className="cloud cloud-one">☁️</div><div className="cloud cloud-two">☁️</div><div className="rainbow">🌈</div><div className="hero-character">🦊</div><div className="floating-letter">أ</div><div className="hero-ground"/></div></section>
    <section className="stats-row"><div className="stat-card stars-stat"><span className="stat-icon">⭐</span><div><strong>{progress.stars}</strong><small>نجمة جمعتها</small></div><span className="stat-decoration">✦</span></div><div className="stat-card lesson-stat"><span className="stat-icon">📚</span><div><strong>{progress.completed.length}</strong><small>درس أكملته</small></div><span className="stat-decoration">✦</span></div><div className="stat-card badge-stat"><span className="stat-icon">🏅</span><div><strong>{progress.streak}</strong><small>أيام من التعلّم</small></div><span className="stat-decoration">✦</span></div></section>
    <div className="section-title-row"><div><span className="section-eyebrow">خطوتك القادمة</span><h2>اختر مغامرتك!</h2></div><button className="see-all" onClick={() => onNavigate('learn')}>كل الدروس <ChevronLeft size={17}/></button></div>
    <section className="lesson-cards">{lessons.map((lesson,i)=><LessonCard key={lesson.id} lesson={lesson} index={i} onClick={() => onStart(lesson.id === 'words' ? 'matching' : 'letters')} completed={progress.completed.includes(lesson.id)}/>)}</section>
    <section className="daily-story"><div className="story-icon">📖</div><div className="daily-story-copy"><span className="section-eyebrow">قصة اليوم</span><h3>فلفول والزهرة الصغيرة</h3><p>قصة لطيفة عن العناية بالأصدقاء والنباتات.</p></div><div className="story-preview">🦊🌼</div><button className="circle-arrow" aria-label="افتح القصة" onClick={() => onNavigate('stories')}><ChevronLeft/></button></section>
  </>;
}
function LessonCard({lesson,index,onClick,completed}) { return <button className={`lesson-card ${lesson.color}`} onClick={onClick}><div className="lesson-card-top"><span className="lesson-emoji">{lesson.icon}</span><span className="lesson-time">◷ {lesson.time}</span></div><span className="lesson-level">{lesson.level}</span><h3>{lesson.title}</h3><p>{lesson.subtitle}</p><div className="lesson-progress-row"><div className="lesson-bar"><i style={{width:`${completed ? 100 : (lesson.progress/lesson.total)*100}%`}}/></div><span>{completed ? 'مكتمل!' : `${lesson.progress}/${lesson.total}`}</span></div><span className="lesson-arrow"><ChevronLeft size={18}/></span></button>; }
function LearnPage({progress,onStart}) { return <><PageHeader eyebrow="خطوة خطوة" title="دروسي التعليمية" description="اختر درساً جديداً، وتعلّم على راحتك."/><div className="path-banner"><div className="path-illustration">🧭</div><div><b>مسار المستكشف الصغير</b><p>ابدأ بالحروف، ثم اكتشف الكلمات والجمل.</p></div><span className="path-level">المستوى ١</span></div><div className="lesson-list">{lessons.map((l,i)=><div className="lesson-list-item" key={l.id}><div className={`list-emoji ${l.color}`}>{l.icon}</div><div className="list-info"><span>{l.level} · الدرس {i+1}</span><h3>{l.title}</h3><div className="lesson-bar"><i style={{width:progress.completed.includes(l.id)?'100%':`${l.progress/l.total*100}%`}}/></div></div><span className="list-time">{l.time}</span><button className="button small-button" onClick={()=>onStart(l.id==='words'?'matching':'letters')}>{progress.completed.includes(l.id)?'أعد الدرس':'ابدأ'} <ChevronLeft size={16}/></button></div>)}</div><div className="tip-box"><Lightbulb/><span><b>نصيحة صغيرة:</b> تكرار الدرس يساعدك على تذكّر الحروف بسهولة.</span></div></>; }
function GamesPage({progress,onStart}) { return <><PageHeader eyebrow="اللعب يعلّمنا" title="ألعابي الممتعة" description="فكّر، طابق، واكتشف كلمات جديدة!"/><div className="games-grid"><button className="game-tile game-match" onClick={()=>onStart('matching')}><span className="game-emoji">🧩</span><span className="game-label">لعبة الحروف</span><h2>لعبة المطابقة</h2><p>اجمع الكلمات التي تبدأ بالحرف نفسه.</p><span className="game-action">العب الآن <ChevronLeft size={18}/></span></button><button className="game-tile game-quiz" onClick={()=>onStart('letters')}><span className="game-emoji">🎯</span><span className="game-label">تحدٍّ صغير</span><h2>صائد الحروف</h2><p>استمع للسؤال واختر الحرف الصحيح.</p><span className="game-action">ابدأ التحدي <ChevronLeft size={18}/></span></button><div className="game-tile game-coming"><span className="game-emoji">🧱</span><span className="game-label">قريباً</span><h2>ابنِ كلمتك</h2><p>رتّب الحروف لتصنع كلمات جديدة.</p><span className="game-action">قريباً <LockKeyhole size={15}/></span></div></div><div className="tip-box"><Gift/><span>كل لعبة تكملها تمنحك نجومًا جديدة لتزيّن بها رحلتك!</span></div></>; }
function StoriesPage({storyPage,setStoryPage,onSpeak,onFinish}) { const story=storyPages[storyPage]; return <><PageHeader eyebrow="حكاية قبل المغامرة" title="قصصي الجميلة" description="استمع إلى قصة فلفول والزهرة الصغيرة."/><section className="storybook"><div className="book-top"><span>قصة قصيرة · {storyPage+1} من {storyPages.length}</span><button className="listen-button" onClick={()=>onSpeak(story.text)}><Volume2 size={18}/> استمع</button></div><div className="story-scene"><div className="story-sun">☀️</div><span className="story-character">{story.emoji}</span><span className="story-flower">🌷</span><span className="story-butterfly">🦋</span><div className="story-hill"/></div><div className="story-text"><span className="section-eyebrow">فلفول والزهرة الصغيرة</span><p>{story.text}</p></div><div className="story-controls"><button className="round-control" disabled={storyPage===0} onClick={()=>setStoryPage(p=>p-1)} aria-label="السابق"><ChevronRight/></button><div className="story-dots">{storyPages.map((_,i)=><i key={i} className={i===storyPage?'current':''}/>)}</div>{storyPage<storyPages.length-1?<button className="button primary" onClick={()=>setStoryPage(p=>p+1)}>الصفحة التالية <ChevronLeft size={17}/></button>:<button className="button primary" onClick={onFinish}><Check size={17}/> أنهيت القصة</button>}</div></section></>; }
function ProgressPage({progress,onReset}) { const done=progress.completed.length; return <><PageHeader eyebrow="يا لك من بطل!" title="إنجازاتي" description="كل خطوة صغيرة تقرّبك من هدفك."/><section className="achievement-hero"><div className="trophy-art">🏆</div><div><span>مجموع نجومك</span><strong>{progress.stars} ⭐</strong><p>استمرّ في التعلّم، فالمعرفة كنز!</p></div><div className="confetti">✨</div></section><div className="progress-cards"><div className="progress-card"><span>📘</span><b>{done}</b><small>دروس مكتملة</small></div><div className="progress-card"><span>🔥</span><b>{progress.streak}</b><small>أيام متتالية</small></div><div className="progress-card"><span>🌟</span><b>{progress.stars}</b><small>نجمة مكتسبة</small></div></div><h2 className="subheading">شاراتي الجميلة</h2><div className="badges-grid"><div className="badge-item"><span className="badge-medal">🔤</span><b>صديق الحروف</b><small>{progress.completed.includes('letters')?'تم الحصول عليها':'أكمل درس الحروف'}</small></div><div className="badge-item"><span className="badge-medal">🧩</span><b>بطل المطابقة</b><small>{progress.completed.includes('matching')?'تم الحصول عليها':'أكمل لعبة المطابقة'}</small></div><div className="badge-item"><span className="badge-medal">📖</span><b>محبّ القصص</b><small>{progress.completed.includes('story')?'تم الحصول عليها':'أكمل قصة'}</small></div><div className="badge-item"><span className="badge-medal">🔥</span><b>مثابر صغير</b><small>تعلّم ثلاثة أيام متتالية</small></div></div><button className="reset-button" onClick={onReset}><RotateCcw size={16}/> إعادة ضبط بيانات التقدّم على هذا الجهاز</button></>; }
function PageHeader({eyebrow,title,description}) { return <div className="page-header"><span className="section-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>; }

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);

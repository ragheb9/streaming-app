import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ChevronLeft, Headphones, Heart, Menu, Play, Puzzle, Sparkles, Star, Volume2, X } from 'lucide-react';
import './styles.css';

const lessons = [
  { icon: '🔤', title: 'عالم الحروف', tag: 'الحروف العربية', description: 'تعرّف على الحروف وأصواتها من خلال صور وألعاب صغيرة.', color: 'mint', level: 'المستوى الأول', duration: '٨ دقائق' },
  { icon: '🧸', title: 'كلمات من حولي', tag: 'مفردات', description: 'اكتشف أسماء الأشياء والحيوانات والألوان في حياتك.', color: 'peach', level: 'المستوى الأول', duration: '٦ دقائق' },
  { icon: '🎤', title: 'أستمع وأتكلّم', tag: 'استماع ومحادثة', description: 'استمع إلى كلمات عربية وجرّب نطقها بصوتك.', color: 'lilac', level: 'المستوى الثاني', duration: '٧ دقائق' },
];
const words = [
  { word: 'أرنب', emoji: '🐰', letter: 'أ' }, { word: 'بيت', emoji: '🏠', letter: 'ب' },
  { word: 'تفاحة', emoji: '🍎', letter: 'ت' }, { word: 'قمر', emoji: '🌙', letter: 'ق' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [toast, setToast] = useState('');
  const announce = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2400); };
  const speak = (text) => {
    if (!('speechSynthesis' in window)) return announce('ميزة الصوت غير متاحة في هذا المتصفح.');
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(text); voice.lang = 'ar-SA'; voice.rate = 0.8;
    window.speechSynthesis.speak(voice);
  };
  const answer = (item) => {
    if (selected) return;
    setSelected(item.word);
    if (item.letter === 'أ') setScore(1);
  };
  const closeDemo = () => { setDemoOpen(false); setSelected(''); setScore(0); };
  return <div className="site" dir="rtl">
    <header className="header">
      <a className="brand" href="#home" aria-label="حروفي - الرئيسية"><span className="brand-mark">ح</span><span>حروفي<small>أتعلم وأكتشف</small></span></a>
      <button className="menu-toggle" aria-label="فتح القائمة" onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? 'navigation open' : 'navigation'}>
        <a href="#home" onClick={() => setMenuOpen(false)}>الرئيسية</a><a href="#learning" onClick={() => setMenuOpen(false)}>ماذا سنتعلّم؟</a><a href="#try" onClick={() => setMenuOpen(false)}>جرّب بنفسك</a><a href="#parents" onClick={() => setMenuOpen(false)}>للأهل</a>
      </nav>
      <a className="header-cta" href="#learning">اكتشف الرحلة <ChevronLeft size={17}/></a>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-bg-dot dot-one"/><div className="hero-bg-dot dot-two"/>
        <div className="hero-copy"><span className="eyebrow"><Sparkles size={15}/> رحلة ممتعة إلى عالم العربية</span><h1>كل حرفٍ حكاية،<br/><em>وكل كلمة اكتشاف!</em></h1><p>مساحة تعليمية مرحة تساعد الأطفال على اكتشاف العربية خطوةً بخطوة، باللعب والاستماع والقصص.</p><div className="hero-actions"><button className="button primary" onClick={() => setDemoOpen(true)}><Play size={17} fill="currentColor"/> جرّب درساً تفاعلياً</button><a className="button secondary" href="#learning">اكتشف المحتوى <ArrowDown size={16}/></a></div><div className="hero-proof"><div className="proof-avatars"><span>🦊</span><span>🐻</span><span>🐼</span></div><span>تعلّم ممتع للصغار في كل يوم</span><span className="proof-stars"><Star size={14} fill="currentColor"/> <b>خطوة صغيرة، إنجاز كبير</b></span></div></div>
        <div className="hero-visual" aria-label="رسوم مرحة لتعلم الحروف"><div className="sun">☀️</div><div className="cloud cloud-a">☁️</div><div className="cloud cloud-b">☁️</div><div className="hero-card card-letter"><span>حرف اليوم</span><b>أ</b><small>أَسَد 🦁</small></div><div className="hero-card card-word"><span>كلمة جديدة</span><b>🌙</b><small>قمر</small></div><div className="rainbow">🌈</div><div className="hero-fox">🦊</div><div className="hero-hill"/><div className="visual-caption"><span className="caption-icon">✦</span><span><b>نتعلّم باللعب</b><small>على مهل وبابتسامة</small></span></div></div>
        <a className="scroll-hint" href="#learning">مرّر لاكتشاف الرحلة <ArrowDown size={15}/></a>
      </section>

      <section className="benefits wrap" aria-label="مميزات حروفي"><div className="benefit"><span className="benefit-icon green"><BookOpen/></span><div><b>تعلّم تدريجي</b><small>من الحرف إلى الكلمة</small></div></div><div className="benefit"><span className="benefit-icon orange"><Headphones/></span><div><b>استمع وردّد</b><small>أصوات عربية واضحة</small></div></div><div className="benefit"><span className="benefit-icon purple"><Puzzle/></span><div><b>العب واكتشف</b><small>أنشطة تفاعلية بسيطة</small></div></div><div className="benefit"><span className="benefit-icon pink"><Heart/></span><div><b>بأمان ومرح</b><small>تجربة مناسبة للصغار</small></div></div></section>

      <section className="learning-section wrap" id="learning"><div className="section-heading"><div><span className="eyebrow">مغامرات تعليمية قصيرة</span><h2>ماذا سنتعلّم اليوم؟</h2><p>أنشطة بسيطة، مصممة لتشجّع الفضول وتبني الثقة.</p></div><button className="text-link" onClick={() => setDemoOpen(true)}>ابدأ تجربة <ChevronLeft size={17}/></button></div><div className="lesson-grid">{lessons.map((lesson,i)=><article className={`lesson-card ${lesson.color}`} key={lesson.title}><div className="lesson-art"><span>{lesson.icon}</span><small>{lesson.duration}</small><i>٠{i+1}</i></div><div className="lesson-copy"><span className="lesson-tag">{lesson.tag}</span><h3>{lesson.title}</h3><p>{lesson.description}</p><div className="lesson-bottom"><span>{lesson.level}</span><button aria-label={`استمع إلى ${lesson.title}`} onClick={() => speak(lesson.title)}><Volume2 size={17}/> استمع</button></div></div></article>)}</div></section>

      <section className="try-section" id="try"><div className="try-wrap wrap"><div className="try-copy"><span className="eyebrow"><Sparkles size={15}/> هيا نجرّب معاً</span><h2>هل تعرف الحرف<br/>الذي تبدأ به «أرنب»؟</h2><p>اضغط على بطاقة الإجابة الصحيحة، واستمع إلى نطق الكلمة.</p><button className="button primary" onClick={() => setDemoOpen(true)}>ابدأ اللعبة <Play size={16} fill="currentColor"/></button></div><div className="try-board"><div className="board-top"><span>🎯 تحدّي الحروف</span><span>سؤال ١ من ١</span></div><div className="board-question"><span>🐰</span><div><b>أرنب</b><small>ما الحرف الأول؟</small></div><button aria-label="استمع إلى أرنب" onClick={() => speak('أرنب')}><Volume2/></button></div><div className="letter-options">{['أ','ب','م'].map((letter,i)=><button key={letter} onClick={() => { if(letter==='أ') announce('أحسنت! الألف هو الحرف الأول في أرنب 🥳'); else announce('جرّب مرة أخرى، استمع إلى الكلمة.'); }} className={`letter-option option-${i}`}>{letter}</button>)}</div><div className="board-foot"><span>اختر الإجابة المناسبة</span><span>⭐ اجمع النجوم بالتعلّم!</span></div></div></div></section>

      <section className="story-section wrap"><div className="story-illustration"><div className="story-sky">☀️</div><span className="story-fox">🦊</span><span className="story-flower">🌼</span><span className="story-butterfly">🦋</span><div className="story-hill"/></div><div className="story-copy"><span className="eyebrow">📖 حكاية اليوم</span><h2>فلفول والزهرة الصغيرة</h2><p>في صباحٍ جميل، وجد فلفول نبتةً صغيرة عطشى. أحضر لها الماء، وبعد أيام نمت زهرة جميلة!</p><div className="story-actions"><button className="button primary" onClick={() => announce('القصة الكاملة ستكون متاحة قريباً!')}>اقرأ القصة <BookOpen size={17}/></button><button className="sound-link" onClick={() => speak('في صباح جميل، وجد فلفول نبتة صغيرة عطشى. أحضر لها الماء، وبعد أيام نمت زهرة جميلة!')}><Volume2 size={18}/> استمع للقصة</button></div></div></section>

      <section className="parent-section" id="parents"><div className="parent-inner wrap"><div className="parent-icon">🌱</div><div><span className="eyebrow">للأهل والمربين</span><h2>خطوات صغيرة تصنع فرقاً كبيراً.</h2><p>شجّع طفلك على تخصيص دقائق قليلة كل يوم للاستماع، اللعب، واكتشاف كلمات عربية جديدة.</p></div><button className="button parent-button" onClick={() => announce('ستتوفر أدوات متابعة التعلّم قريباً.')}>عن طريقة التعلّم <ArrowLeft size={17}/></button></div></section>
    </main>

    <footer className="footer wrap"><a className="brand" href="#home"><span className="brand-mark">ح</span><span>حروفي<small>أتعلم وأكتشف</small></span></a><p>نتعلّم العربية بمحبة، كلمةً بعد كلمة.</p><div className="footer-links"><a href="#learning">الأنشطة</a><a href="#parents">للأهل</a><button onClick={() => announce('حروفي — مشروع تعليمي تجريبي مستقل.')}>عن حروفي</button></div><span className="copyright">© 2026 حروفي</span></footer>

    {demoOpen && <div className="modal-backdrop" onClick={closeDemo}><section className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-title" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={closeDemo} aria-label="إغلاق"><X/></button><div className="demo-top"><span>🔤 تجربة تفاعلية</span><span>سؤال ١ من ١</span></div><div className="demo-progress"><i style={{width: selected ? '100%' : '42%'}}/></div><div className="demo-emoji">🐰</div><h2 id="demo-title">ما الحرف الأول في كلمة «أرنب»؟</h2><button className="listen-button" onClick={() => speak('أرنب')}><Volume2 size={17}/> استمع إلى الكلمة</button><div className="demo-options">{words.slice(0,3).map((item,i)=><button disabled={!!selected} key={item.word} className={`demo-option demo-${i} ${selected===item.word ? (item.letter==='أ'?'correct':'incorrect') : selected && item.letter==='أ'?'correct':''}`} onClick={() => answer(item)}>{item.letter}{selected===item.word && (item.letter==='أ'?<Check size={18}/>:<X size={18}/>)}</button>)}</div>{selected && <div className={selected==='أرنب'?'feedback good':'feedback'}>{selected==='أرنب'?'أحسنت! أرنب تبدأ بحرف الألف ⭐':'قريب! استمع مرة أخرى إلى كلمة أرنب.'}</div>}<div className="modal-bottom"><span>⭐ نجومك: {score}</span>{selected && <button className="button primary" onClick={closeDemo}>انتهيت <Check size={16}/></button>}</div></section></div>}
    {toast && <div className="toast"><Sparkles size={17}/>{toast}</div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);

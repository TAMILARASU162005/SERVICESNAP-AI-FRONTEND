import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import {
  Activity, AlertTriangle, ArrowRight, Bell, CalendarCheck, Camera, CheckCircle2, ChevronDown,
  Clock3, Cpu, DollarSign, Download, FileText, Headphones, HelpCircle, History, ImagePlus,
  Languages, LogIn, LogOut, MapPin, Menu, MessageCircle, Mic, Navigation,
  Phone, RefreshCw, Search, Send, Settings, ShieldCheck, Share2, Sparkles,
  SlidersHorizontal, Star, Tag, Upload, UserRound, Wrench, X, Zap
} from 'lucide-react';

const districts = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram',
  'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam',
  'Kanniyakumari', 'Namakkal', 'Perambalur', 'Pudukkottai', 'Ramanathapuram',
  'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
  'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur',
  'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
  'Viluppuram', 'Virudhunagar', 'The Nilgiris'
];
const devices = ['Washing Machine', 'Refrigerator', 'Air Conditioner (AC)', 'Television (LED/OLED)', 'Smartphone / Tablet', 'Laptop / PC'];
const districtProfile = {
  Ariyalur: 'Central Tamil Nadu',
  Chengalpattu: 'North Tamil Nadu',
  Chennai: 'North Tamil Nadu',
  Coimbatore: 'Western Tamil Nadu',
  Cuddalore: 'Eastern Tamil Nadu',
  Dharmapuri: 'North-West Tamil Nadu',
  Dindigul: 'South-Central Tamil Nadu',
  Erode: 'Western Tamil Nadu',
  Kallakurichi: 'North-East Tamil Nadu',
  Kancheepuram: 'North Tamil Nadu',
  Karur: 'Central Tamil Nadu',
  Krishnagiri: 'North-West Tamil Nadu',
  Madurai: 'South Tamil Nadu',
  Mayiladuthurai: 'Cauvery Delta',
  Nagapattinam: 'Cauvery Delta',
  Kanniyakumari: 'South Tamil Nadu',
  Namakkal: 'Central Tamil Nadu',
  Perambalur: 'Central Tamil Nadu',
  Pudukkottai: 'Central Tamil Nadu',
  Ramanathapuram: 'South-East Tamil Nadu',
  Ranipet: 'North Tamil Nadu',
  Salem: 'North-West Tamil Nadu',
  Sivaganga: 'South Tamil Nadu',
  Tenkasi: 'South Tamil Nadu',
  Thanjavur: 'Cauvery Delta',
  Theni: 'South Tamil Nadu',
  Thoothukudi: 'South-East Tamil Nadu',
  Tiruchirappalli: 'Central Tamil Nadu',
  Tirunelveli: 'South Tamil Nadu',
  Tirupathur: 'North Tamil Nadu',
  Tiruppur: 'Western Tamil Nadu',
  Tiruvallur: 'North Tamil Nadu',
  Tiruvannamalai: 'North Tamil Nadu',
  Tiruvarur: 'Cauvery Delta',
  Vellore: 'North Tamil Nadu',
  Viluppuram: 'North-East Tamil Nadu',
  Virudhunagar: 'South Tamil Nadu',
  'The Nilgiris': 'Western Tamil Nadu'
};

const copy = {
  en: {
    navHome: 'Overview', navScan: 'New diagnosis', navHistory: 'My reports', navRates: 'Rate card',
    greeting: 'Good day', heroTitle: 'Fix it before it gets worse.', heroText: 'Upload a photo and get a practical diagnosis, a fair price range, and trusted technicians near you.',
    start: 'Start a diagnosis', upload: 'Upload device photo', recent: 'Recent reports', nearby: 'Nearby help',
    signIn: 'Sign in', analyze: 'Run AI diagnosis', selectDevice: 'What needs attention?', chooseCity: 'Service location',
    model: 'Brand or model (optional)', scanTitle: 'Visual diagnosis', scanHint: 'Clear photos give better results. You can upload JPG, PNG or WEBP up to 10MB.',
    noReport: 'Your next report will appear here', book: 'Book a visit', share: 'Share report', support: 'Need help?', supportText: 'Ask our repair guide about cost, urgency or what to check next.',
  },
  ta: {
    navHome: 'முகப்பு', navScan: 'புதிய பரிசோதனை', navHistory: 'என் அறிக்கைகள்', navRates: 'விலை விவரம்',
    greeting: 'வணக்கம்', heroTitle: 'பிரச்சனை பெரிதாகும் முன் சரி செய்யுங்கள்.', heroText: 'படத்தை பதிவேற்றி பிரச்சனை, சரியான விலை மற்றும் அருகிலுள்ள நம்பகமான டெக்னீஷியனைப் பெறுங்கள்.',
    start: 'பரிசோதனையை தொடங்கு', upload: 'சாதன படத்தை பதிவேற்று', recent: 'சமீபத்திய அறிக்கைகள்', nearby: 'அருகிலுள்ள உதவி',
    signIn: 'உள்நுழை', analyze: 'AI பரிசோதனை செய்', selectDevice: 'எதில் பிரச்சனை?', chooseCity: 'சேவை இடம்',
    model: 'பிராண்ட் அல்லது மாடல் (விருப்பம்)', scanTitle: 'பட பரிசோதனை', scanHint: 'தெளிவான JPG, PNG அல்லது WEBP படத்தை பதிவேற்றவும் (10MB வரை).',
    noReport: 'உங்கள் அடுத்த அறிக்கை இங்கே தோன்றும்', book: 'வீட்டு சேவை முன்பதிவு', share: 'அறிக்கையை பகிர்', support: 'உதவி வேண்டுமா?', supportText: 'விலை, அவசரம் அல்லது அடுத்த படி பற்றி கேளுங்கள்.',
  }
};

function App() {
  const [language, setLanguage] = useState('en');
  const t = copy[language];
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [theme, setTheme] = useState('violet');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [gmail, setGmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [deviceType, setDeviceType] = useState('Washing Machine');
  const [city, setCity] = useState('Coimbatore');
  const [model, setModel] = useState('');
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [reports, setReports] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'Hi! I can help you understand repair urgency, costs and next steps.' }
  ]);
  const [audioScanning, setAudioScanning] = useState(false);
  const [audioResult, setAudioResult] = useState(null);
  const [deviceAge, setDeviceAge] = useState(3);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [shopFilter, setShopFilter] = useState('all');
  const [completedChecks, setCompletedChecks] = useState([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const [complaint, setComplaint] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);

  const palettes = {
    violet: { accent: 'from-violet-500 to-indigo-500', soft: 'bg-violet-500/10', text: 'text-violet-300', border: 'border-violet-400/25', ring: 'ring-violet-400/30' },
    ocean: { accent: 'from-cyan-500 to-blue-600', soft: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-400/25', ring: 'ring-cyan-400/30' },
    sunset: { accent: 'from-amber-400 to-rose-500', soft: 'bg-amber-500/10', text: 'text-amber-200', border: 'border-amber-400/25', ring: 'ring-amber-400/30' }
  };
  const palette = palettes[theme];

  useEffect(() => {
    try { setReports(JSON.parse(localStorage.getItem('servicesnap-reports') || '[]')); } catch { setReports([]); }
    try { setComplaints(JSON.parse(localStorage.getItem('servicesnap-complaints') || '[]')); } catch { setComplaints([]); }
    try { setReviews(JSON.parse(localStorage.getItem('servicesnap-reviews') || '[]')); } catch { setReviews([]); }
  }, []);

  useEffect(() => () => cameraStreamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const saveReport = (nextResult) => {
    const next = [{ id: Date.now(), device: deviceType, city, issue: nextResult.detected_issue, date: new Date().toLocaleDateString('en-IN'), result: nextResult }, ...reports].slice(0, 5);
    setReports(next);
    localStorage.setItem('servicesnap-reports', JSON.stringify(next));
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      alert('Please choose an image smaller than 10MB.');
      return;
    }
    setImage(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => setBase64Image(String(reader.result).replace(/^data:.+;base64,/, ''));
    reader.readAsDataURL(file);
  };

  const openCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      cameraStreamRef.current = stream;
      setCameraOpen(true);
      requestAnimationFrame(() => { if (videoRef.current) videoRef.current.srcObject = stream; });
    } catch {
      setCameraError('Camera permission denied or camera is unavailable. Please upload a photo instead.');
    }
  };

  const closeCamera = () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImage(dataUrl);
    setBase64Image(dataUrl.replace(/^data:.+;base64,/, ''));
    closeCamera();
  };

  const submitComplaint = (event) => {
    event.preventDefault();
    if (!complaint.trim()) return;
    const next = [{ id: Date.now(), text: complaint.trim(), date: new Date().toLocaleDateString('en-IN'), status: 'Received' }, ...complaints].slice(0, 10);
    setComplaints(next);
    localStorage.setItem('servicesnap-complaints', JSON.stringify(next));
    setComplaint('');
  };

  const submitReview = (event) => {
    event.preventDefault();
    if (!reviewRating) return;
    const next = [{ id: Date.now(), rating: reviewRating, text: reviewText.trim(), date: new Date().toLocaleDateString('en-IN') }, ...reviews].slice(0, 10);
    setReviews(next);
    localStorage.setItem('servicesnap-reviews', JSON.stringify(next));
    setReviewRating(0);
    setReviewText('');
  };

  const login = async (email = gmail) => {
    if (!email || !email.includes('@')) { setAuthError('Enter a valid email address'); return; }
    try {
      const response = await axios.post('https://servicesnap-ai-backend-pllz.onrender.com/api/auth/google-login', { email, name: email.split('@')[0] });
      if (response.data.success) { setUser(response.data.user); setShowLogin(false); setAuthError(''); setGmail(''); }
    } catch { setAuthError('Login service is unavailable. Please try again.'); }
  };

  const analyze = async () => {
    if (!user) { setShowLogin(true); return; }
    if (!base64Image) { alert('Upload a device photo first.'); return; }
    setLoading(true);
    try {
      const response = await axios.post('https://servicesnap-ai-backend-pllz.onrender.com/api/repair/analyze', { base64Image, deviceType, customBrandModel: model, city });
      if (response.data.success) { setResult(response.data.data); saveReport(response.data.data); setActiveView('overview'); }
    } catch { alert('Could not complete diagnosis. Check that the backend is running.'); }
    finally { setLoading(false); }
  };

  const runInstantDemo = () => {
    const demoResult = {
      detected_issue: `${deviceType} Service Recommendation`,
      issue_description: `Demo scan completed for ${deviceType}${model ? ` (${model})` : ''}. Upload a real photo for a more specific visual diagnosis.`,
      estimated_cost_inr: { min: 650, max: 2400 },
      estimated_repair_time: '45 Mins - 2 Hours',
      all_google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${deviceType} repair service center in ${city} Tamil Nadu`)}`,
      parts_required: ['Inspection and diagnosis', 'Genuine replacement part if required', 'Service labour'],
      repair_centers: [{
        name: `${city} Live Repair Directory`,
        address: `${city}, Tamil Nadu`,
        rating: 'Live Google Maps listings',
        tag: 'District-wide discovery',
        map_only: true,
        map_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${deviceType} repair service center in ${city} Tamil Nadu`)}`
      }]
    };
    setResult(demoResult);
    saveReport(demoResult);
    setActiveView('overview');
  };

  const shareReport = (shop) => {
    if (!result) return;
    const text = shop
      ? `ServiceSnap AI: ${shop.name}, ${shop.phone}, ${shop.address}. Issue: ${result.detected_issue}.`
      : `ServiceSnap AI report: ${result.detected_issue} for ${deviceType} in ${city}. Estimate: ₹${result.estimated_cost_inr?.min}-${result.estimated_cost_inr?.max}.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    if (navigator.share && !shop) navigator.share({ title: 'ServiceSnap AI report', text }).catch(() => window.open(url, '_blank'));
    else window.open(url, '_blank');
  };

  const downloadReport = () => {
    if (!result) return;
    const reportText = [
      'SERVICESNAP AI - REPAIR REPORT',
      `District: ${city}, Tamil Nadu`,
      `Device: ${deviceType}${model ? ` (${model})` : ''}`,
      `Issue: ${result.detected_issue}`,
      `Details: ${result.issue_description}`,
      `Estimated cost: ₹${result.estimated_cost_inr?.min || 0} - ₹${result.estimated_cost_inr?.max || 0}`,
      `Estimated time: ${result.estimated_repair_time || 'To confirm'}`,
      `Parts: ${(result.parts_required || []).join(', ')}`,
      '',
      'Please confirm final quote, part warranty and service terms before approval.'
    ].join('\n');
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `servicesnap-${city.toLowerCase()}-repair-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const startAudio = () => {
    setAudioScanning(true); setAudioResult(null);
    setTimeout(() => { setAudioScanning(false); setAudioResult({ db: '85 dB', cause: 'Bearing assembly wear / motor vibration', action: 'Book an inspection within 7 days.' }); }, 1800);
  };

  const sendChat = () => {
    const question = chatInput.trim();
    if (!question) return;
    setChatMessages((messages) => [...messages, { from: 'user', text: question }, { from: 'bot', text: 'Based on your device, avoid repeated use if you smell burning or hear grinding. A technician inspection is the safest next step.' }]);
    setChatInput('');
  };

  const nav = [
    { id: 'overview', label: t.navHome, icon: Activity },
    { id: 'scan', label: t.navScan, icon: Camera },
    { id: 'history', label: t.navHistory, icon: History },
    { id: 'rates', label: t.navRates, icon: Tag }
  ];
  const health = Math.max(15, 100 - deviceAge * 8);
  const latestShop = result?.repair_centers?.[0];
  const summary = useMemo(() => result ? {
    issue: result.detected_issue,
    cost: `₹${result.estimated_cost_inr?.min || 0} - ₹${result.estimated_cost_inr?.max || 0}`,
    time: result.estimated_repair_time || 'Same day'
  } : null, [result]);

  return (
    <div className="futuristic-ui relative min-h-screen overflow-hidden bg-[#050816] text-slate-100 selection:bg-cyan-400/30">
      <div className="pointer-events-none fixed inset-0 opacity-[0.13]" style={{ backgroundImage: 'linear-gradient(rgba(56,189,248,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.22) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
      <div className={`pointer-events-none fixed -left-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br ${palette.accent} opacity-20 blur-3xl`} />
      <div className="pointer-events-none fixed -bottom-20 right-0 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-3xl" />

      <header className="sticky top-0 z-40 border-b border-cyan-400/15 bg-[#050816]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenu(!mobileMenu)} className="rounded-xl p-2 text-slate-500 lg:hidden"><Menu className="h-5 w-5" /></button>
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${palette.accent} text-white shadow-[0_0_30px_rgba(34,211,238,.3)]`}><Wrench className="h-5 w-5" /></div>
            <div><p className="text-base font-black tracking-tight text-white">SERVICE<span className="text-cyan-300">SNAP</span> <span className="text-fuchsia-300">// AI</span></p><p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:block">Repair intelligence platform · v5.0</p></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')} className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-bold text-slate-300 hover:border-cyan-400/50"><Languages className="h-4 w-4" /> {language === 'en' ? 'தமிழ்' : 'English'}</button>
            <button className="relative rounded-xl border border-slate-700 bg-slate-900/70 p-2.5 text-slate-400 hover:text-cyan-300"><Bell className="h-5 w-5" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" /></button>
            {user ? <button onClick={() => setUser(null)} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-2 py-1.5 text-xs font-bold"><span className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${palette.accent} text-white`}>{user.name[0].toUpperCase()}</span><span className="hidden max-w-24 truncate sm:block">{user.name}</span><LogOut className="h-4 w-4 text-slate-400" /></button> : <button onClick={() => setShowLogin(true)} className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${palette.accent} px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_22px_rgba(34,211,238,.22)]`}><LogIn className="h-4 w-4" /> {t.signIn}</button>}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        <aside className={`${mobileMenu ? 'fixed inset-y-20 left-0 z-30 flex' : 'hidden'} w-64 shrink-0 flex-col border-r border-cyan-400/10 bg-[#080d20]/95 px-4 py-6 backdrop-blur-xl lg:sticky lg:top-20 lg:flex lg:h-[calc(100vh-5rem)]`}>
          <div className="mb-8 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4"><div className="flex items-center gap-2 text-xs font-bold text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> SYSTEM OPERATIONAL</div><p className="mt-2 text-[11px] leading-relaxed text-slate-400">AI diagnostics and repair discovery across all 38 Tamil Nadu districts.</p></div>
          <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Command center</p>
          <nav className="space-y-1">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setActiveView(id); setMobileMenu(false); }} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm font-bold transition ${activeView === id ? `border-cyan-400/20 ${palette.soft} ${palette.text} shadow-[inset_3px_0_0_#22d3ee]` : 'border-transparent text-slate-500 hover:border-slate-700 hover:bg-slate-900/70 hover:text-slate-200'}`}><Icon className="h-4 w-4" />{label}{id === 'history' && reports.length > 0 && <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-[10px]">{reports.length}</span>}</button>)}</nav>
          <div className="mt-auto space-y-2"><p className="px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Accent protocol</p><div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 p-2.5"><span className="flex items-center gap-2 text-xs font-bold text-slate-400"><Settings className="h-4 w-4" /> Theme</span><div className="flex gap-1.5">{Object.keys(palettes).map((key) => <button key={key} onClick={() => setTheme(key)} className={`h-4 w-4 rounded-full ${key === 'violet' ? 'bg-violet-500' : key === 'ocean' ? 'bg-cyan-500' : 'bg-amber-500'} ${theme === key ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white' : ''}`} />)}</div></div></div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl">
            {activeView === 'overview' && <Overview t={t} palette={palette} user={user} city={city} result={result} summary={summary} latestShop={latestShop} reports={reports} setActiveView={setActiveView} shareReport={shareReport} downloadReport={downloadReport} runInstantDemo={runInstantDemo} setShowBooking={setShowBooking} emergencyMode={emergencyMode} setEmergencyMode={setEmergencyMode} shopFilter={shopFilter} setShopFilter={setShopFilter} completedChecks={completedChecks} setCompletedChecks={setCompletedChecks} reviewRating={reviewRating} setReviewRating={setReviewRating} reviewText={reviewText} setReviewText={setReviewText} submitReview={submitReview} reviews={reviews} complaint={complaint} setComplaint={setComplaint} submitComplaint={submitComplaint} complaints={complaints} />}
            {activeView === 'scan' && <Scan t={t} palette={palette} city={city} setCity={setCity} deviceType={deviceType} setDeviceType={setDeviceType} model={model} setModel={setModel} image={image} handleImage={handleImage} openCamera={openCamera} cameraOpen={cameraOpen} videoRef={videoRef} capturePhoto={capturePhoto} closeCamera={closeCamera} cameraError={cameraError} analyze={analyze} runInstantDemo={runInstantDemo} loading={loading} startAudio={startAudio} audioScanning={audioScanning} audioResult={audioResult} complaint={complaint} setComplaint={setComplaint} submitComplaint={submitComplaint} complaints={complaints} />}
            {activeView === 'history' && <HistoryView t={t} reports={reports} setResult={setResult} setActiveView={setActiveView} />}
            {activeView === 'rates' && <Rates t={t} palette={palette} deviceAge={deviceAge} setDeviceAge={setDeviceAge} health={health} />}
          </div>
        </main>
      </div>

      <button onClick={() => setShowChat(true)} className={`fixed bottom-6 right-5 z-20 flex items-center gap-2 rounded-full bg-gradient-to-r ${palette.accent} px-4 py-3 text-xs font-black text-white shadow-xl shadow-violet-300/30`}><MessageCircle className="h-4 w-4" /> {t.support}</button>
      {showChat && <ChatPanel t={t} messages={chatMessages} input={chatInput} setInput={setChatInput} send={sendChat} close={() => setShowChat(false)} />}
      {showBooking && <BookingModal t={t} shop={latestShop} done={bookingDone} setDone={setBookingDone} close={() => { setShowBooking(false); setBookingDone(false); }} />}
      {showLogin && <LoginModal t={t} gmail={gmail} setGmail={setGmail} error={authError} login={login} close={() => setShowLogin(false)} palette={palette} />}

      {activeView === 'overview' && <button onClick={() => setActiveView('scan')} className="sr-only">Start</button>}
    </div>
  );
}

function Overview({ t, palette, user, city, result, summary, latestShop, reports, setActiveView, shareReport, downloadReport, runInstantDemo, setShowBooking, emergencyMode, setEmergencyMode, shopFilter, setShopFilter, completedChecks, setCompletedChecks, reviewRating, setReviewRating, reviewText, setReviewText, submitReview, reviews, complaint, setComplaint, submitComplaint, complaints }) {
  return <div className="space-y-8">
    <section className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${palette.accent} p-6 text-white shadow-xl sm:p-10`}>
      <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full border-[28px] border-white/10" /><div className="absolute bottom-[-100px] right-32 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="relative max-w-2xl"><div className="mb-4 flex items-center gap-2 text-xs font-bold text-white/75"><Sparkles className="h-4 w-4" /> PERSONAL REPAIR COMMAND CENTER</div><h1 className="max-w-xl text-3xl font-black tracking-tight sm:text-5xl">{t.heroTitle}</h1><p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">{t.heroText}</p><div className="mt-7 flex flex-wrap gap-3"><button onClick={() => setActiveView('scan')} className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black text-slate-900 shadow-lg">{t.start}<ArrowRight className="h-4 w-4" /></button><button onClick={runInstantDemo} className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-xs font-black text-white hover:bg-white/20"><Zap className="h-4 w-4" /> Try instant demo</button><div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold"><ShieldCheck className="h-4 w-4" /> Verified technicians</div></div></div>
    </section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{ icon: Activity, label: 'AI confidence', value: result ? '92%' : '--', tone: 'text-violet-600' }, { icon: FileText, label: 'Saved reports', value: reports.length, tone: 'text-blue-600' }, { icon: MapPin, label: 'Active district', value: 'TN', tone: 'text-emerald-600' }, { icon: Clock3, label: 'Avg. response', value: '< 2 min', tone: 'text-amber-600' }].map(({ icon: Icon, label, value, tone }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Icon className={`h-5 w-5 ${tone}`} /><p className="mt-4 text-2xl font-black tracking-tight">{value}</p><p className="mt-1 text-xs font-semibold text-slate-400">{label}</p></div>)}</section>
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Latest intelligence</p><h2 className="mt-1 text-lg font-black">Your repair snapshot</h2></div>{result && <button onClick={() => shareReport()} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600"><Share2 className="h-3.5 w-3.5" /> {t.share}</button>}</div>{summary ? <><div className="rounded-2xl bg-slate-50 p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-black text-rose-600">ATTENTION RECOMMENDED</span><h3 className="mt-3 text-lg font-black">{summary.issue}</h3></div><div className="rounded-xl bg-white px-4 py-3 text-right shadow-sm"><p className="text-[10px] font-bold text-slate-400">Estimated cost</p><p className="text-sm font-black text-emerald-600">{summary.cost}</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><Info label="Service time" value={summary.time} icon={Clock3} /><Info label="Confidence" value="92% reliable" icon={CheckCircle2} /><Info label="Parts" value={`${result?.parts_required?.length || 3} likely parts`} icon={Cpu} /></div></div><div className="mt-5 flex flex-wrap gap-3">{latestShop && <button onClick={() => setShowBooking(true)} className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${palette.accent} px-4 py-3 text-xs font-black text-white`}><CalendarCheck className="h-4 w-4" /> {t.book}</button>}<button onClick={() => setActiveView('scan')} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-600"><RefreshCw className="h-4 w-4" /> New scan</button></div></> : <EmptyState t={t} setActiveView={setActiveView} />}</section>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Recommended next</p><h2 className="mt-1 text-lg font-black">{t.nearby}</h2></div><Navigation className="h-5 w-5 text-violet-500" /></div>{latestShop ? <div className="mt-5 rounded-2xl border border-slate-100 p-4"><div className="flex items-start justify-between"><div><h3 className="font-black">{latestShop.name}</h3><p className="mt-1 text-xs text-emerald-600">{latestShop.rating}</p></div><Star className="h-4 w-4 fill-amber-400 text-amber-400" /></div><p className="mt-4 flex gap-2 text-xs leading-5 text-slate-500"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />{latestShop.address}</p><div className="mt-4 flex gap-2">{latestShop.phone ? <a href={`tel:${latestShop.phone}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-black text-white"><Phone className="h-3.5 w-3.5" /> Call</a> : <a href={latestShop.map_url} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-black text-white"><Search className="h-3.5 w-3.5" /> Find centers</a>}<a href={latestShop.map_url} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black text-slate-600">Directions</a></div></div> : <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-500">Run a diagnosis to see the best-rated repair centers, live directions and contact options.</div>}<div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700"><ShieldCheck className="h-4 w-4" /> All 38 Tamil Nadu districts are supported.</div></section>
    </div>
    {result && <DiagnosticDetails result={result} city={city} palette={palette} shareReport={shareReport} downloadReport={downloadReport} setShowBooking={setShowBooking} emergencyMode={emergencyMode} setEmergencyMode={setEmergencyMode} shopFilter={shopFilter} setShopFilter={setShopFilter} completedChecks={completedChecks} setCompletedChecks={setCompletedChecks} />}
    <div className="grid gap-6 lg:grid-cols-2">
      <ComplaintPanel complaint={complaint} setComplaint={setComplaint} submitComplaint={submitComplaint} complaints={complaints} />
      <ReviewPanel reviewRating={reviewRating} setReviewRating={setReviewRating} reviewText={reviewText} setReviewText={setReviewText} submitReview={submitReview} reviews={reviews} />
    </div>
  </div>;
}

function DiagnosticDetails({ result, city, palette, shareReport, downloadReport, setShowBooking, emergencyMode, setEmergencyMode, shopFilter, setShopFilter, completedChecks, setCompletedChecks }) {
  const profile = districtProfile[city] || 'Tamil Nadu';
  const mapUrl = result.all_google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${result.detected_issue} repair service in ${city}, Tamil Nadu`)}`;
  const risk = /burn|leak|short|smoke|gas|compressor/i.test(`${result.detected_issue} ${result.issue_description}`) ? 'High attention' : 'Routine service';
  const replacementAdvice = result.estimated_cost_inr?.max > 3000 ? 'Compare repair cost with a replacement before approving expensive parts.' : 'Repair is likely more economical than replacement.';
  const checks = ['Switch off the device if it smells burnt or leaks.', 'Take a photo of the model / serial label.', 'Ask for a written quote and warranty.', 'Confirm visit fee before technician arrival.'];
  const filteredCenters = (result.repair_centers || []).filter((center) => {
    if (shopFilter === 'phone') return Boolean(center.phone);
    if (shopFilter === 'rated') return String(center.rating || '').startsWith('5');
    return true;
  });
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className={`bg-gradient-to-r ${palette.accent} p-5 text-white sm:p-7`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/75"><Sparkles className="h-4 w-4" /> Complete service report</p>
            <h2 className="mt-2 text-2xl font-black">Repair options in {city}</h2>
            <p className="mt-1 text-xs text-white/75">{profile} · All nearby options are searched for your selected district.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={mapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-slate-900 shadow-lg"><MapPin className="h-4 w-4" /> Open live map</a>
            <button onClick={downloadReport} className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-3 text-xs font-black text-white"><Download className="h-4 w-4" /> Export report</button>
          </div>
        </div>
      </div>
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <div className={`rounded-2xl border p-5 ${risk === 'High attention' ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}>
            <div className="flex items-start gap-3">
              {risk === 'High attention' ? <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" /> : <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500" />}
              <div><p className={`text-xs font-black ${risk === 'High attention' ? 'text-rose-700' : 'text-emerald-700'}`}>{risk}</p><p className="mt-1 text-xs leading-5 text-slate-600">{risk === 'High attention' ? 'Stop using the appliance until it is inspected by a qualified technician.' : 'The issue looks suitable for a planned service visit.'}</p></div>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">What the scan found</p>
            <h3 className="mt-2 text-lg font-black text-slate-900">{result.detected_issue}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{result.issue_description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Info label="Estimated range" value={`₹${result.estimated_cost_inr?.min || 0} - ₹${result.estimated_cost_inr?.max || 0}`} icon={DollarSign} />
            <Info label="Repair time" value={result.estimated_repair_time || 'To confirm'} icon={Clock3} />
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="flex items-center gap-2 text-sm font-black"><Tag className="h-4 w-4 text-violet-500" /> Likely parts</h3>
            <div className="mt-3 flex flex-wrap gap-2">{(result.parts_required || []).map((part) => <span key={part} className="rounded-lg bg-violet-50 px-2.5 py-1.5 text-[11px] font-bold text-violet-700">{part}</span>)}</div>
            <p className="mt-4 flex gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" /> Confirm part brand, warranty and final quote before approving repair.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="flex items-center gap-2 text-sm font-black"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Before you book</h3>
            <div className="mt-3 space-y-2">{checks.map((check, index) => <label key={check} className="flex items-start gap-2 text-xs leading-5 text-slate-600"><input type="checkbox" checked={completedChecks.includes(index)} onChange={() => setCompletedChecks(completedChecks.includes(index) ? completedChecks.filter((item) => item !== index) : [...completedChecks, index])} className="mt-1 accent-violet-500" />{check}</label>)}</div>
            <p className="mt-4 rounded-lg bg-slate-50 p-3 text-[11px] font-bold text-slate-500">{replacementAdvice}</p>
          </div>
        </div>
        <div>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Service directory</p><h3 className="mt-1 text-lg font-black">All repair options in {city}</h3><p className="mt-1 text-xs text-slate-500">Verified contacts plus every live listing available for this district.</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">{filteredCenters.length} cards</span></div>
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-2"><SlidersHorizontal className="ml-1 h-4 w-4 text-slate-400" />{[['all', 'All options'], ['phone', 'Phone available'], ['rated', 'Top rated']].map(([value, label]) => <button key={value} onClick={() => setShopFilter(value)} className={`rounded-lg px-3 py-2 text-[11px] font-black ${shopFilter === value ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-white'}`}>{label}</button>)}<label className="ml-auto flex items-center gap-2 text-[11px] font-bold text-rose-600"><input type="checkbox" checked={emergencyMode} onChange={(event) => setEmergencyMode(event.target.checked)} className="accent-rose-500" /> Urgent repair</label></div>
          <div className="space-y-3">{filteredCenters.map((center, index) => <div key={`${center.name}-${index}`} className={`rounded-2xl border p-4 transition hover:border-violet-300 hover:shadow-sm ${center.map_only ? 'border-violet-200 bg-violet-50/40' : emergencyMode ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200'}`}><div className="flex items-start justify-between gap-3"><div><h4 className="text-sm font-black">{center.name}</h4><p className="mt-1 text-xs text-emerald-600">{center.rating}</p></div><span className="rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-violet-600">{center.map_only ? 'All live listings' : emergencyMode ? 'Priority callback' : center.tag}</span></div><p className="mt-3 flex gap-2 text-xs leading-5 text-slate-500"><MapPin className="h-4 w-4 shrink-0 text-slate-400" />{center.address}</p>{center.map_only && <p className="mt-3 rounded-xl bg-white/80 p-3 text-[11px] leading-5 text-slate-500">Google Maps will show every currently available repair shop, rating, route and open/closed status in {city}.</p>}<div className="mt-3 flex flex-wrap gap-2">{center.phone ? <a href={`tel:${center.phone}`} className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-[11px] font-black text-white"><Phone className="h-3.5 w-3.5" /> {center.phone}</a> : <a href={center.map_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-[11px] font-black text-white"><Search className="h-3.5 w-3.5" /> View all shops</a>}<a href={center.map_url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-black text-slate-600">Directions</a>{!center.map_only && <button onClick={() => shareReport(center)} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-black text-slate-600"><Share2 className="h-3.5 w-3.5" /> Share</button>}</div></div>)}</div>
          <div className="mt-4 flex flex-wrap gap-3"><button onClick={() => setShowBooking(true)} className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${palette.accent} px-4 py-3 text-xs font-black text-white`}><CalendarCheck className="h-4 w-4" /> Request technician callback</button><button onClick={() => shareReport()} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-600"><Share2 className="h-4 w-4" /> Share full report</button></div>
        </div>
      </div>
    </section>
  );
}

function Scan({ t, palette, city, setCity, deviceType, setDeviceType, model, setModel, image, handleImage, openCamera, cameraOpen, videoRef, capturePhoto, closeCamera, cameraError, analyze, runInstantDemo, loading, startAudio, audioScanning, audioResult, complaint, setComplaint, submitComplaint, complaints }) {
  return <div className="space-y-6"><div><p className={`text-xs font-black uppercase tracking-[0.18em] ${palette.text}`}>Step 1 of 3</p><h1 className="mt-2 text-3xl font-black tracking-tight">{t.scanTitle}</h1><p className="mt-2 max-w-xl text-sm text-slate-500">{t.scanHint}</p></div><div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]"><section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="grid gap-4 sm:grid-cols-2"><Field label={t.selectDevice}><select value={deviceType} onChange={(e) => setDeviceType(e.target.value)} className="input">{devices.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label={t.chooseCity}><select value={city} onChange={(e) => setCity(e.target.value)} className="input">{districts.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label={t.model} full><input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Samsung 8kg / IFB 7kg" className="input" /></Field></div><label className={`mt-6 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed ${image ? 'border-violet-300 bg-violet-50/30' : 'border-slate-200 bg-slate-50 hover:border-violet-300'} p-4 text-center transition`}>{image ? <img src={image} alt="Selected device" className="max-h-56 rounded-xl object-contain shadow-sm" /> : <><div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${palette.soft}`}><ImagePlus className={`h-7 w-7 ${palette.text}`} /></div><p className="text-sm font-black text-slate-700">{t.upload}</p><p className="mt-1 text-xs text-slate-400">Drag & drop or browse from your device</p></>}<input type="file" accept="image/*" onChange={handleImage} className="hidden" /></label><div className="mt-3 flex gap-2"><button type="button" onClick={openCamera} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-300 bg-cyan-50 py-3 text-xs font-black text-cyan-700"><Camera className="h-4 w-4" /> Take live photo</button><label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-black text-slate-600"><Upload className="h-4 w-4" /> Choose file<input type="file" accept="image/*" onChange={handleImage} className="hidden" /></label></div>{cameraError && <p className="mt-2 text-xs font-bold text-rose-600">{cameraError}</p>}{cameraOpen && <div className="mt-3 rounded-2xl bg-slate-950 p-3"><video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" /><div className="mt-3 flex gap-2"><button type="button" onClick={capturePhoto} className="flex-1 rounded-xl bg-emerald-500 py-3 text-xs font-black text-white">Capture photo</button><button type="button" onClick={closeCamera} className="rounded-xl border border-slate-600 px-4 py-3 text-xs font-black text-slate-300">Cancel</button></div></div>}<button onClick={analyze} disabled={loading} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${palette.accent} py-4 text-sm font-black text-white shadow-lg disabled:opacity-60`}>{loading ? <><RefreshCw className="h-4 w-4 animate-spin" /> Reading image patterns...</> : <><Sparkles className="h-4 w-4" /> {t.analyze}</>}</button><button onClick={runInstantDemo} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 py-3 text-xs font-black text-violet-700"><Zap className="h-4 w-4" /> No photo? Try instant demo</button></section><section className="space-y-4"><div className="rounded-3xl bg-slate-900 p-6 text-white shadow-lg"><div className="flex items-center gap-2 text-xs font-bold text-violet-300"><ShieldCheck className="h-4 w-4" /> SAFE DIAGNOSTICS</div><h2 className="mt-4 text-xl font-black">What happens next?</h2>{['AI reads visible damage patterns', 'We estimate parts, time and cost', 'You choose a verified technician'].map((item, index) => <div key={item} className="mt-5 flex gap-3"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${palette.accent} text-xs font-black`}>{index + 1}</span><p className="text-sm text-slate-300">{item}</p></div>)}</div><div className="rounded-3xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-2"><Mic className="h-5 w-5 text-rose-500" /><h2 className="font-black">Acoustic shortcut</h2></div><p className="mt-2 text-xs leading-5 text-slate-500">Is your machine making a new noise? Start a quick sound check before booking.</p><button onClick={startAudio} disabled={audioScanning} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-black text-slate-600 disabled:opacity-50"><Headphones className="h-4 w-4" /> {audioScanning ? 'Listening...' : 'Start sound check'}</button>{audioResult && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs leading-5 text-slate-600"><p><strong>Noise:</strong> {audioResult.db}</p><p><strong>Likely cause:</strong> {audioResult.cause}</p><p className="mt-1 font-bold text-rose-600">{audioResult.action}</p></div>}</div><ComplaintPanel complaint={complaint} setComplaint={setComplaint} submitComplaint={submitComplaint} complaints={complaints} /></section></div></div>;
}

function ComplaintPanel({ complaint, setComplaint, submitComplaint, complaints }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-rose-500" /><h2 className="font-black">Complaint box</h2></div><p className="mt-2 text-xs leading-5 text-slate-500">Tell us what went wrong. Your complaint is saved and marked for follow-up.</p><form onSubmit={submitComplaint} className="mt-4"><textarea value={complaint} onChange={(event) => setComplaint(event.target.value)} className="input min-h-24 resize-y" placeholder="Describe your service issue..." /><button className="mt-3 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black text-white"><Send className="h-4 w-4" /> Submit complaint</button></form>{complaints.slice(0, 2).map((item) => <div key={item.id} className="mt-3 rounded-xl bg-slate-50 p-3 text-xs"><p className="font-bold text-slate-700">{item.text}</p><p className="mt-1 text-emerald-600">{item.status} · {item.date}</p></div>)}</section>;
}

function ReviewPanel({ reviewRating, setReviewRating, reviewText, setReviewText, submitReview, reviews }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><Star className="h-5 w-5 fill-amber-400 text-amber-400" /><h2 className="font-black">Review the experience</h2></div><p className="mt-2 text-xs leading-5 text-slate-500">Rate your diagnosis or technician experience.</p><form onSubmit={submitReview} className="mt-4"><div className="flex gap-1">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} onClick={() => setReviewRating(value)} aria-label={`${value} stars`}><Star className={`h-6 w-6 ${value <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} /></button>)}</div><textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} className="input mt-3 min-h-20 resize-y" placeholder="Write a short review (optional)" /><button disabled={!reviewRating} className="mt-3 rounded-xl bg-amber-500 px-4 py-3 text-xs font-black text-white disabled:opacity-50">Submit review</button></form>{reviews.slice(0, 2).map((item) => <div key={item.id} className="mt-3 rounded-xl bg-slate-50 p-3 text-xs"><p className="font-bold text-amber-600">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</p>{item.text && <p className="mt-1 text-slate-600">{item.text}</p>}</div>)}</section>;
}

function HistoryView({ t, reports, setResult, setActiveView }) {
  return <div className="space-y-6"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-violet-500">{t.recent}</p><h1 className="mt-2 text-3xl font-black">Your repair timeline</h1></div>{reports.length ? <div className="grid gap-4 md:grid-cols-2">{reports.map((report) => <button key={report.id} onClick={() => { setResult(report.result); setActiveView('overview'); }} className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center justify-between"><span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black text-violet-600">{report.date}</span><ArrowRight className="h-4 w-4 text-slate-300" /></div><h2 className="mt-4 font-black">{report.device}</h2><p className="mt-1 text-sm text-slate-500">{report.issue}</p><p className="mt-4 text-xs font-bold text-slate-400"><MapPin className="mr-1 inline h-3.5 w-3.5" />{report.city}</p></button>)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center"><History className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 font-black">{t.noReport}</h2><p className="mt-2 text-sm text-slate-500">Complete your first photo diagnosis to build a useful service history.</p><button onClick={() => setActiveView('scan')} className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-xs font-black text-white">{t.start}</button></div>}</div>;
}

function Rates({ t, palette, deviceAge, setDeviceAge, health }) {
  return <div className="space-y-6"><div><p className={`text-xs font-black uppercase tracking-[0.18em] ${palette.text}`}>{t.navRates}</p><h1 className="mt-2 text-3xl font-black">Plan the smarter repair</h1><p className="mt-2 text-sm text-slate-500">Understand common service rates and your appliance health before spending.</p></div><div className="grid gap-6 lg:grid-cols-2"><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 font-black"><DollarSign className="h-5 w-5 text-emerald-500" /> Typical service rates</h2><div className="mt-5 space-y-3">{[['Inspection / visiting fee', '₹150 - ₹200'], ['AC inverter jet service', '₹500 - ₹700'], ['Washing machine drum clean', '₹350 - ₹500'], ['Fridge gas refill', '₹1,200 - ₹1,800'], ['Display replacement labour', '₹300 - ₹800']].map(([name, price]) => <div key={name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs"><span className="font-semibold text-slate-600">{name}</span><strong className="text-slate-900">{price}</strong></div>)}</div><p className="mt-4 text-[11px] text-slate-400">Rates are indicative. Ask for a written quote before approving parts.</p></section><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 font-black"><Activity className="h-5 w-5 text-violet-500" /> Appliance health check</h2><label className="mt-6 block text-sm font-bold text-slate-600">Device age: {deviceAge} years<input type="range" min="1" max="12" value={deviceAge} onChange={(e) => setDeviceAge(Number(e.target.value))} className="mt-5 w-full accent-violet-500" /></label><div className="mt-7 flex items-center gap-5"><div className="relative flex h-28 w-28 items-center justify-center rounded-full" style={{ background: `conic-gradient(#8b5cf6 ${health}%, #e2e8f0 0)` }}><div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-xl font-black">{health}%</div></div><div><p className="font-black">{health > 65 ? 'Healthy condition' : health > 35 ? 'Service soon' : 'Plan replacement'}</p><p className="mt-2 text-xs leading-5 text-slate-500">{health > 65 ? 'Normal maintenance should keep it reliable.' : 'A preventive inspection may reduce future cost.'}</p></div></div></section></div></div>;
}

function Info({ label, value, icon: Icon }) { return <div className="flex items-center gap-2 rounded-xl bg-white p-3"><Icon className="h-4 w-4 text-slate-400" /><div><p className="text-[10px] font-bold text-slate-400">{label}</p><p className="mt-0.5 text-xs font-black text-slate-700">{value}</p></div></div>; }
function Field({ label, children, full }) { return <label className={`block ${full ? 'sm:col-span-2' : ''}`}><span className="mb-2 block text-xs font-black text-slate-600">{label}</span>{children}</label>; }
function EmptyState({ t, setActiveView }) { return <div className="py-12 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50"><Camera className="h-7 w-7 text-violet-500" /></div><h3 className="mt-4 font-black">{t.noReport}</h3><p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">Upload a device photo and our AI will prepare a repair-ready summary.</p><button onClick={() => setActiveView('scan')} className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-xs font-black text-white">{t.start}</button></div>; }

function LoginModal({ t, gmail, setGmail, error, login, close, palette }) { return <Modal close={close}><div className="text-center"><div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${palette.accent} text-white`}><UserRound className="h-6 w-6" /></div><h2 className="mt-4 text-xl font-black">Welcome to ServiceSnap</h2><p className="mt-2 text-sm text-slate-500">Sign in to save reports and contact technicians.</p></div><button onClick={() => login('demo.user@gmail.com')} className={`mt-6 w-full rounded-xl bg-gradient-to-r ${palette.accent} py-3 text-xs font-black text-white`}>Continue with demo account</button><div className="my-5 flex items-center gap-3 text-[10px] font-bold uppercase text-slate-400"><span className="h-px flex-1 bg-slate-200" /> or use email <span className="h-px flex-1 bg-slate-200" /></div><input value={gmail} onChange={(e) => setGmail(e.target.value)} placeholder="you@gmail.com" className="input" />{error && <p className="mt-2 text-xs text-rose-500">{error}</p>}<button onClick={() => login()} className="mt-3 w-full rounded-xl border border-slate-200 py-3 text-xs font-black text-slate-700">Sign in securely</button></Modal>; }
function BookingModal({ t, shop, done, setDone, close }) {
  return (
    <Modal close={close}>
      {done ? (
        <div className="py-6 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h2 className="mt-4 text-xl font-black">Request received</h2>
          <p className="mt-2 text-sm text-slate-500">The technician will contact you shortly to confirm your visit.</p>
          <button onClick={close} className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-xs font-black text-white">Done</button>
        </div>
      ) : (
        <>
          <p className="text-xs font-black uppercase tracking-widest text-violet-500">Quick booking</p>
          <h2 className="mt-2 text-2xl font-black">{t.book}</h2>
          <p className="mt-2 text-sm text-slate-500">{shop?.name || 'Verified technician'} will call you to confirm availability.</p>
          <input placeholder="Your name" className="input mt-6" />
          <input placeholder="Phone number" className="input mt-3" />
          <select className="input mt-3">
            <option>Preferred time: Morning</option>
            <option>Preferred time: Afternoon</option>
            <option>Preferred time: Evening</option>
          </select>
          <button onClick={() => setDone(true)} className="mt-5 w-full rounded-xl bg-emerald-500 py-3.5 text-xs font-black text-white">Request a callback</button>
        </>
      )}
    </Modal>
  );
}
function ChatPanel({ t, messages, input, setInput, send, close }) { return <div className="fixed bottom-20 right-4 z-30 w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"><div className="flex items-center justify-between bg-slate-900 px-5 py-4 text-white"><div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-violet-300" /><span className="text-sm font-black">{t.support}</span></div><button onClick={close}><X className="h-4 w-4" /></button></div><div className="h-64 space-y-3 overflow-y-auto p-4">{messages.map((message, index) => <div key={index} className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-5 ${message.from === 'user' ? 'ml-auto bg-violet-100 text-violet-900' : 'bg-slate-100 text-slate-600'}`}>{message.text}</div>)}</div><div className="flex gap-2 border-t border-slate-100 p-3"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Ask about your repair..." className="min-w-0 flex-1 rounded-xl bg-slate-100 px-3 py-2 text-xs outline-none" /><button onClick={send} className="rounded-xl bg-slate-900 p-2 text-white"><Send className="h-4 w-4" /></button></div></div>; }
function Modal({ children, close }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"><div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><button onClick={close} className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>{children}</div></div>; }

export default App;

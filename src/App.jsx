import React, { useState } from 'react';
import logoMain from './assets/logo1.jpg';
import { 
  Calendar as ViewCalendarIcon,
  Users as UsersIcon,
  User as UserIcon,
  LogOut as LogOutIcon,
  Clock as ClockIcon,
  Check as CheckIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Star as StarIcon,
  Briefcase as BriefcaseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Flame as FlameIcon,
  Zap as ZapIcon,
  Sparkles as SparklesIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  Megaphone as MegaphoneIcon,
  Shield as ShieldIcon,
  MessageSquare as MessageSquareIcon,
  Send as SendIcon,
  ShoppingCart as ShoppingCartIcon,
  Tag as TagIcon,
  Package as PackageIcon,
  Trash2 as Trash2Icon,
  Info as InfoIcon,
  Heart as HeartIcon,
  Activity as ActivityIcon,
  Target as TargetIcon,
  ArrowRight as ArrowRightIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Trophy as TrophyIcon
} from 'lucide-react';

const logoTeacher = 'https://placehold.co/400x200/e0e7ff/4f46e5?text=Teacher+Logo';
const logoAdmin = 'https://placehold.co/400x200/e0e7ff/4f46e5?text=Admin+Logo';
const logoContact = 'https://placehold.co/800x400/0f172a/ffffff?text=Rebuild+Training+Lab';
const logoShop = 'https://placehold.co/400x200/fff7ed/ea580c?text=Shop+Logo';

const MAX_CAPACITY = 4;

// --- 定義 5 大分類的 Tag 常數庫 ---
const INITIAL_TAG_CATEGORIES = {
  bodyParts: {
    label: '困擾部位 / 想改善的地方',
    options: ['肩頸緊繃', '下背 / 腰椎僵硬', '脊椎排列與活動度', '上肢 / 投擲與揮拍不適', '肩膀活動受限', '下肢 / 跑跳卡卡', '髖膝踝舊傷卡關']
  },
  strategies: {
    label: '防護與恢復策略',
    options: ['深層筋膜釋放', '日常體態校正', '姿勢重置', '生物力學優化', '軟拔罐筋膜減壓']
  },
  trainings: {
    label: '動作控制與強化',
    options: ['無痛肌力建構', '功能性核心控制', '禪柔運動', '動物流', '運動專項動力鏈訓練']
  },
  intensity: {
    label: '體感偏好',
    options: ['溫和舒緩', '適中解壓', '深層強效']
  },
  lifestyles: {
    label: '生活型態',
    options: ['樂活銀髮族', '久坐辦公族', '運動愛好者', '發育期體態與運動防護']
  }
};

export default function ZhudongBookingApp() {
  // --- State Management ---
  const [view, setView] = useState('customer');
  
  const [tagCategories, setTagCategories] = useState(INITIAL_TAG_CATEGORIES);
  const [newTagInputs, setNewTagInputs] = useState({});
  const [editingGlobalTag, setEditingGlobalTag] = useState({ catKey: null, oldTag: null, value: '' });

  const [availabilities, setAvailabilities] = useState([
    { id: 'a1', date: '2026-11-10', startTime: '09:00', endTime: '18:00', teacherName: '馭琳' },
    { id: 'a2', date: '2026-11-10', startTime: '10:00', endTime: '20:00', teacherName: '金澤' },
  ]);
  const [appointments, setAppointments] = useState([
    { id: 'ap1', date: '2026-11-10', startTime: '10:00', endTime: '11:30', duration: 90, teacherName: '馭琳', studentName: '王小明', attended: false }
  ]);

  const [toastMessage, setToastMessage] = useState(''); 
  const [selectedTeacher, setSelectedTeacher] = useState('all');

  const [currentMonth, setCurrentMonth] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  });

  const [activeTeacher, setActiveTeacher] = useState(null); 
  const [adminSelectedDate, setAdminSelectedDate] = useState(null); 
  const [adminSelectedTeacher, setAdminSelectedTeacher] = useState('all'); 

  const [editModal, setEditModal] = useState({ isOpen: false, type: '', data: null });
  const [editingProfileName, setEditingProfileName] = useState(''); 
  const [uploadedPhoto, setUploadedPhoto] = useState('');

  const [bookingDuration, setBookingDuration] = useState(90); 
  const [bookingStartTime, setBookingStartTime] = useState('10:00');
  const [hasMedicalCondition, setHasMedicalCondition] = useState(false);
  
  // 約課與兩步篩選法狀態
  const [bookingFlowType, setBookingFlowType] = useState('guided'); // 'guided' (導引配對) 或 'direct' (直接指定)
  const [bookingIntent, setBookingIntent] = useState(null); // 'relax' 或 'train'
  const [selectedTags, setSelectedTags] = useState([]);

  // 微型檢測狀態
  const [assessments, setAssessments] = useState([
    {
      id: 'ass2',
      appointmentId: 'ap_mock_2',
      date: '2026-11-10',
      teacherName: '馭琳',
      studentName: '辰晞媽媽',
      phone: '0987654321',
      metrics: { 
        gender: 'female', birthDate: '1985-05-15', height: 162, weight: 54.8, 
        restingHR: 68, sRPE: 5, 
        gripLeft: 24.0, gripRight: 26.5, 
        shoulderLeft: 165, shoulderRight: 170,
        rotationLeft: 45, rotationRight: 50,
        plank: 75, sidePlankLeft: 40, sidePlankRight: 35, 
        ktwLeft: 10.5, ktwRight: 9.5, 
        slsLeft: 15, slsRight: 12,
        jumpHeight: 32.5, jumpAccel: 2.1
      },
      coachNotes: '今天右側胸椎有點緊繃，幫您做了深層筋膜放鬆。這兩天辦公室坐久了，記得起來做我們今天教的『坐姿胸椎伸展』喔！下次見！'
    },
    {
      id: 'ass1',
      appointmentId: 'ap_mock_1',
      date: '2026-11-03',
      teacherName: '馭琳',
      studentName: '辰晞媽媽',
      phone: '0987654321', 
      metrics: { 
        gender: 'female', birthDate: '1985-05-15', height: 162, weight: 55.2, 
        restingHR: 72, sRPE: 7, 
        gripLeft: 22.5, gripRight: 25.0, 
        shoulderLeft: 150, shoulderRight: 160,
        rotationLeft: 35, rotationRight: 45,
        plank: 45, sidePlankLeft: 25, sidePlankRight: 15, 
        ktwLeft: 9.0, ktwRight: 7.0, 
        slsLeft: 12, slsRight: 8,
        jumpHeight: 28.0, jumpAccel: 1.8 
      },
      coachNotes: '右側腳踝活動度明顯受限，今天已利用筋膜放鬆介入，建議回家多做小腿伸展喔！這兩天辦公室坐久了，記得起來活動一下！'
    }
  ]);
  const [assessmentModal, setAssessmentModal] = useState({ isOpen: false, data: null });
  const [progressPhone, setProgressPhone] = useState('');
  const [myProgress, setMyProgress] = useState(null);
  const [selectedProgressIndex, setSelectedProgressIndex] = useState(0); 

  const [adminTab, setAdminTab] = useState('courses'); 
  const [contactRequests, setContactRequests] = useState([
    { id: 'c1', companyName: '示範科技股份有限公司', contactName: '王經理', phone: '0912-345-678', email: 'hr@example.com', serviceType: 'speech', eventDate: '2026-12-15', details: '希望舉辦一場兩小時的員工肩頸放鬆與體適能講座。', status: 'pending', createdAt: '2026-11-05' }
  ]);

  const [aboutContent, setAboutContent] = useState({
    heroTitle: '讓健康成為日常',
    heroSubtitle: '健康不是短暫的結果，是一段需要持續累積的過程',
    heroDescription: '來築動，讓運動防護師陪伴您＃讓健康成為日常',
    heroImage: logoMain
  });
  const [aboutUploadedPhoto, setAboutUploadedPhoto] = useState('');

  const [recentEvents, setRecentEvents] = useState([
    { id: 'e1', title: '2026 企業健康防護講座', date: '2026-10-15', description: '受邀至科技公司進行肩頸放鬆與正確坐姿指導，超過百人參與，獲得熱烈迴響。', photo: 'https://placehold.co/600x400/e0e7ff/4f46e5?text=Corporate+Event' }
  ]);
  const [editingEventId, setEditingEventId] = useState('');
  const [eventUploadedPhoto, setEventUploadedPhoto] = useState('');

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [myAppointments, setMyAppointments] = useState(null);

  // 教練專長資料 (導入 Tag 架構)
  const [teacherProfiles, setTeacherProfiles] = useState({
    '馭琳': { 
      tags: {
        bodyParts: ['肩頸緊繃', '下背 / 腰椎僵硬'],
        strategies: ['深層筋膜釋放', '日常體態校正'],
        trainings: ['功能性核心控制', '禪柔運動'],
        intensity: ['深層強效'],
        lifestyles: ['久坐辦公族']
      },
      description: '擁有豐富的臨床防護經驗，專長於深層組織放鬆與姿態調整。', 
      type: 'fulltime', 
      hireDate: '2022-05-01',
      quote: '讓健康成為日常，從呼吸開始。',
      photo: 'https://api.dicebear.com/9.x/avataaars/svg?seed=馭琳&backgroundColor=c0aede'
    },
    '金澤': { 
      tags: {
        bodyParts: ['上肢 / 投擲與揮拍不適', '下肢 / 跑跳卡卡'],
        strategies: ['生物力學優化', '軟拔罐筋膜減壓'],
        trainings: ['無痛肌力建構', '動物流'],
        intensity: ['適中解壓'],
        lifestyles: ['運動愛好者']
      },
      description: '專注於生物力學優化與功能性訓練，幫助業餘賽事愛好者突破瓶頸。', 
      type: 'contractor', 
      hireDate: '2025-02-15',
      quote: '運動不該伴隨疼痛，讓我幫你解鎖身體潛能。',
      photo: 'https://api.dicebear.com/9.x/avataaars/svg?seed=金澤&backgroundColor=ffdfbf'
    }
  });

  const [products, setProducts] = useState([
    { id: 'p1', name: '築動花生球', price: 350, description: '專為深層筋膜放鬆設計，精準按壓激痛點。極致耐用，適合肩頸、脊椎兩側舒緩。', photo: 'https://placehold.co/400x300/e0e7ff/4f46e5?text=築動花生球' },
    { id: 'p2', name: '築動小滾筒', price: 500, description: '輕巧好攜帶，隨時隨地放鬆緊繃肌肉。適合小腿、手臂等局部肌群舒緩。', photo: 'https://placehold.co/400x300/ffedd5/ea580c?text=築動小滾筒' }
  ]);
  const [editingProductId, setEditingProductId] = useState('');
  const [productUploadedPhoto, setProductUploadedPhoto] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const timeToMins = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const minsToTime = (m) => {
    const h = Math.floor(m / 60) % 24;
    const mm = m % 60;
    return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };

  const availableTimeSlots = [];
  for (let h = 8; h <= 21; h++) {
    if (h === 8) availableTimeSlots.push("08:30");
    else if (h === 21) availableTimeSlots.push("21:00");
    else {
      const hr = String(h).padStart(2, '0');
      availableTimeSlots.push(`${hr}:00`);
      availableTimeSlots.push(`${hr}:30`);
    }
  }

  const checkTimeSlotAvailable = (timeStr, duration, date, teacher) => {
    if (!teacher) return false;
    const reqStartMins = timeToMins(timeStr);
    const reqEndMins = reqStartMins + duration;

    const overlappingApts = appointments.filter(ap =>
      ap.date === date && timeToMins(ap.startTime) < reqEndMins && timeToMins(ap.endTime) > reqStartMins
    );
    let maxConcurrent = 0;
    const events = [];
    events.push({ time: reqStartMins, type: 1 });
    events.push({ time: reqEndMins, type: -1 });
    overlappingApts.forEach(ap => {
        events.push({ time: Math.max(timeToMins(ap.startTime), reqStartMins), type: 1 });
        events.push({ time: Math.min(timeToMins(ap.endTime), reqEndMins), type: -1 });
    });
    events.sort((a, b) => a.time - b.time || a.type - b.type);
    let current = 0;
    for (let ev of events) {
        current += ev.type;
        if (current > maxConcurrent) maxConcurrent = current;
    }
    if (maxConcurrent >= MAX_CAPACITY) return false;

    if (teacher === 'all') {
      const availableTeachers = [...new Set(availabilities.filter(a => a.date === date && timeToMins(a.startTime) <= reqStartMins && timeToMins(a.endTime) >= reqEndMins).map(a => a.teacherName))];
      for (let t of availableTeachers) {
          const teacherConflict = appointments.some(ap => ap.teacherName === t && ap.date === date && timeToMins(ap.startTime) < reqEndMins && timeToMins(ap.endTime) > reqStartMins);
          if (!teacherConflict) return true; 
      }
      return false;
    } else {
      const isAvail = availabilities.some(a => 
        a.teacherName === teacher && a.date === date && timeToMins(a.startTime) <= reqStartMins && timeToMins(a.endTime) >= reqEndMins
      );
      if (!isAvail) return false;
      const teacherConflict = appointments.some(ap => 
        ap.teacherName === teacher && ap.date === date && timeToMins(ap.startTime) < reqEndMins && timeToMins(ap.endTime) > reqStartMins
      );
      if (teacherConflict) return false;
      return true;
    }
  };

  const handleAddAvailability = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const date = formData.get('date');
    const startTime = formData.get('startTime');
    const endTime = formData.get('endTime');
    const teacherName = formData.get('teacherName');
    if (timeToMins(startTime) >= timeToMins(endTime)) {
      showToast('結束時間必須晚於開始時間！'); return;
    }
    const newAvail = { id: Date.now().toString(), date, startTime, endTime, teacherName };
    setAvailabilities(prev => [...prev, newAvail].sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`)));
    e.target.reset();
    showToast('成功新增開放時段！');
  };

  const handleDeleteAvailability = (id) => {
    setAvailabilities(prev => prev.filter(a => a.id !== id));
    showToast('已刪除開放時段');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === '16121') {
      setIsAdminAuthenticated(true);
      setAdminPasswordInput('');
      showToast('✅ 登入成功，老闆歡迎回來！');
    } else {
      showToast('❌ 密碼錯誤！請重新輸入。');
      setAdminPasswordInput('');
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (editModal.type === 'availability') {
      const date = formData.get('date');
      const startTime = formData.get('startTime');
      const endTime = formData.get('endTime');
      if (timeToMins(startTime) >= timeToMins(endTime)) { showToast('結束時間必須晚於開始時間！'); return; }
      setAvailabilities(prev => prev.map(a => a.id === editModal.data.id ? { ...a, date, startTime, endTime } : a));
      showToast('已成功修改開放時段！');
    } else if (editModal.type === 'appointment') {
      const date = formData.get('date');
      const startTime = formData.get('startTime');
      const duration = parseInt(formData.get('duration'), 10);
      const studentName = formData.get('studentName');
      const endTime = minsToTime(timeToMins(startTime) + duration);
      const referral = formData.get('referral') || '';
      const concern = formData.get('concern') || '';
      const hasMedical = formData.get('hasMedical') === 'on';
      const medicalDetails = formData.get('medicalDetails') || '';
      setAppointments(prev => prev.map(ap => ap.id === editModal.data.id ? { ...ap, date, startTime, endTime, duration, studentName, referral, concern, hasMedical, medicalDetails } : ap));
      showToast('已成功修改預約資料！');
    } else if (editModal.type === 'profile') {
      const name = editModal.data.name;
      const profile = editModal.data.profile;

      const tags = { bodyParts: [], strategies: [], trainings: [], intensity: [], lifestyles: [] };
      for (let [key, value] of formData.entries()) {
        if (key.startsWith('tags.')) {
           const cat = key.split('.')[1];
           if(tags[cat]) tags[cat].push(value);
        }
      }
      const customTraining = formData.get('customTraining');
      if (customTraining && customTraining.trim()) tags.trainings.push(customTraining.trim());

      const description = formData.get('description');
      const quote = formData.get('quote');
      const type = profile.type;
      const hireDate = profile.hireDate;
      let photo = uploadedPhoto || profile.photo;

      setTeacherProfiles(prev => ({
        ...prev,
        [name]: { tags, description, type, hireDate, quote, photo }
      }));
      
      setUploadedPhoto('');
      showToast('已成功更新您的專長與個人檔案！');
    }
    setEditModal({ isOpen: false, type: '', data: null });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setUploadedPhoto(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const loadProfileForEdit = (name) => {
    setEditingProfileName(name);
    setUploadedPhoto(teacherProfiles[name].photo || '');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); 
  };

  const cancelProfileEdit = () => {
    setEditingProfileName('');
    setUploadedPhoto('');
  };

  const calculateSeniority = (hireDate) => {
    if (!hireDate) return { text: '新進', leaveDays: 0 };
    const hire = new Date(hireDate);
    const now = new Date();
    let totalMonths = (now.getFullYear() - hire.getFullYear()) * 12 + (now.getMonth() - hire.getMonth());
    if (now.getDate() < hire.getDate()) totalMonths--;
    const years = Math.max(0, Math.floor(totalMonths / 12));
    let leaveDays = 0;
    if (years >= 10) leaveDays = Math.min(30, 15 + (years - 9));
    else if (years >= 5) leaveDays = 15;
    else if (years >= 3) leaveDays = 14;
    else if (years >= 2) leaveDays = 10;
    else if (years >= 1) leaveDays = 7;
    else if (totalMonths >= 6) leaveDays = 3;
    return { text: years > 0 ? `${years} 年` : (totalMonths > 0 ? `${totalMonths} 個月` : '新進'), leaveDays };
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('profileName');
    const description = formData.get('description');
    const type = formData.get('type') || 'contractor';
    const hireDate = formData.get('hireDate') || new Date().toISOString().split('T')[0];
    const quote = formData.get('quote') || '';
    
    // 收集所有打勾的 tags
    const tags = { bodyParts: [], strategies: [], trainings: [], intensity: [], lifestyles: [] };
    for (let [key, value] of formData.entries()) {
      if (key.startsWith('tags.')) {
         const cat = key.split('.')[1];
         if(tags[cat]) tags[cat].push(value);
      }
    }
    const customTraining = formData.get('customTraining');
    if (customTraining && customTraining.trim()) tags.trainings.push(customTraining.trim());

    let photo = uploadedPhoto || formData.get('photoUrl') || '';
    if (!photo && !editingProfileName) {
        photo = `https://api.dicebear.com/9.x/avataaars/svg?seed=${name}&backgroundColor=e2e8f0`;
    }

    if (!name) return;
    setTeacherProfiles(prev => {
      const newProfiles = { ...prev };
      if (editingProfileName && editingProfileName !== name) delete newProfiles[editingProfileName];
      newProfiles[name] = { tags, description, type, hireDate, quote, photo };
      return newProfiles;
    });
    
    e.target.reset();
    setEditingProfileName('');
    setUploadedPhoto('');
    showToast(`已成功儲存 ${name} 的專長介紹！`);
  };

  const getPrimarySpecialty = (profile) => {
    if(!profile || !profile.tags) return '尚未填寫專長';
    const allTags = Object.values(profile.tags).flat();
    return allTags.slice(0, 2).join(' / ') || '尚未填寫專長';
  };

  const handleProductPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setProductUploadedPhoto(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const price = parseInt(formData.get('price'), 10);
    const description = formData.get('description');
    let photo = productUploadedPhoto || formData.get('photoUrl') || '';
    if (!photo) photo = `https://placehold.co/400x300/f1f5f9/64748b?text=${name}`;
    if (editingProductId) {
       setProducts(prev => prev.map(p => p.id === editingProductId ? { ...p, name, price, description, photo } : p));
       showToast('已成功更新產品資訊！');
    } else {
       const newP = { id: Date.now().toString(), name, price, description, photo };
       setProducts(prev => [...prev, newP]);
       showToast('已成功上架新產品！');
    }
    e.target.reset();
    setEditingProductId('');
    setProductUploadedPhoto('');
  };

  const handleEditProduct = (p) => { setEditingProductId(p.id); setProductUploadedPhoto(p.photo || ''); };
  const handleDeleteProduct = (id) => { setProducts(prev => prev.filter(p => p.id !== id)); showToast('已刪除該產品！'); };
  const cancelProductEdit = () => { setEditingProductId(''); setProductUploadedPhoto(''); };

  const handleAddNewTag = (catKey) => {
    const newTag = newTagInputs[catKey]?.trim();
    if (!newTag) return;
    if (tagCategories[catKey].options.includes(newTag)) {
      showToast('此標籤已存在！');
      return;
    }
    setTagCategories(prev => ({
      ...prev,
      [catKey]: { ...prev[catKey], options: [...prev[catKey].options, newTag] }
    }));
    setNewTagInputs(prev => ({ ...prev, [catKey]: '' }));
    showToast(`已成功新增技能標籤：${newTag}`);
  };

  const handleSaveEditTag = () => {
    if (!editingGlobalTag.value.trim() || editingGlobalTag.value === editingGlobalTag.oldTag) {
        setEditingGlobalTag({ catKey: null, oldTag: null, value: '' });
        return;
    }
    const { catKey, oldTag, value } = editingGlobalTag;
    const newTag = value.trim();

    if (tagCategories[catKey].options.includes(newTag)) {
        showToast('此標籤已存在！');
        return;
    }

    // 更新分類清單中的標籤
    setTagCategories(prev => ({
        ...prev,
        [catKey]: {
            ...prev[catKey],
            options: prev[catKey].options.map(opt => opt === oldTag ? newTag : opt)
        }
    }));
    
    // 同步更新所有教練檔案內已勾選的標籤
    setTeacherProfiles(prev => {
        const newProfiles = { ...prev };
        Object.keys(newProfiles).forEach(name => {
            if (newProfiles[name].tags && newProfiles[name].tags[catKey]) {
                newProfiles[name].tags[catKey] = newProfiles[name].tags[catKey].map(t => t === oldTag ? newTag : t);
            }
        });
        return newProfiles;
    });

    // 如果目前開啟著編輯彈窗，也要同步更新裡面的狀態，確保勾選不會消失
    setEditModal(prev => {
        if (prev.isOpen && prev.type === 'profile' && prev.data) {
            const newData = { ...prev.data };
            if (newData.profile.tags && newData.profile.tags[catKey]) {
                newData.profile.tags[catKey] = newData.profile.tags[catKey].map(t => t === oldTag ? newTag : t);
            }
            return { ...prev, data: newData };
        }
        return prev;
    });

    showToast(`已成功將標籤更新為：${newTag}`);
    setEditingGlobalTag({ catKey: null, oldTag: null, value: '' });
  };

  const handleDeleteGlobalTag = (catKey, tagToDelete) => {
    // 刪除分類清單中的標籤
    setTagCategories(prev => ({
        ...prev,
        [catKey]: {
            ...prev[catKey],
            options: prev[catKey].options.filter(opt => opt !== tagToDelete)
        }
    }));

    // 同步移除所有教練檔案內的該標籤
    setTeacherProfiles(prev => {
        const newProfiles = { ...prev };
        Object.keys(newProfiles).forEach(name => {
            if (newProfiles[name].tags && newProfiles[name].tags[catKey]) {
                newProfiles[name].tags[catKey] = newProfiles[name].tags[catKey].filter(t => t !== tagToDelete);
            }
        });
        return newProfiles;
    });

    // 如果目前開啟著編輯彈窗，也要同步移除狀態
    setEditModal(prev => {
        if (prev.isOpen && prev.type === 'profile' && prev.data) {
            const newData = { ...prev.data };
            if (newData.profile.tags && newData.profile.tags[catKey]) {
                newData.profile.tags[catKey] = newData.profile.tags[catKey].filter(t => t !== tagToDelete);
            }
            return { ...prev, data: newData };
        }
        return prev;
    });

    showToast(`已成功刪除標籤：${tagToDelete}`);
  };

  const handleAboutPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAboutUploadedPhoto(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAboutContent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setAboutContent({
      heroTitle: formData.get('heroTitle'),
      heroSubtitle: formData.get('heroSubtitle'),
      heroDescription: formData.get('heroDescription'),
      heroImage: aboutUploadedPhoto || aboutContent.heroImage
    });
    showToast('品牌介紹與主視覺更新成功！');
  };

  const handleEventPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setEventUploadedPhoto(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const date = formData.get('date');
    const description = formData.get('description');
    let photo = eventUploadedPhoto || formData.get('photoUrl') || '';
    if (!photo && !editingEventId) photo = `https://placehold.co/600x400/f8fafc/64748b?text=${title}`;
    if (editingEventId) {
       setRecentEvents(prev => prev.map(ev => ev.id === editingEventId ? { ...ev, title, date, description, photo: photo || ev.photo } : ev));
       showToast('活動紀錄更新成功！');
    } else {
       const newEv = { id: Date.now().toString(), title, date, description, photo };
       setRecentEvents(prev => [newEv, ...prev]);
       showToast('已成功新增活動紀錄！');
    }
    e.target.reset();
    setEditingEventId('');
    setEventUploadedPhoto('');
  };

  const handleEditEvent = (ev) => { setEditingEventId(ev.id); setEventUploadedPhoto(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleDeleteEvent = (id) => { setRecentEvents(prev => prev.filter(ev => ev.id !== id)); showToast('已刪除該筆活動紀錄！'); };
  const cancelEventEdit = () => { setEditingEventId(''); setEventUploadedPhoto(''); };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('customerName');
    const phone = formData.get('phone'); 
    const reqStartTime = formData.get('startTime');
    const duration = parseInt(formData.get('duration'), 10);
    const targetTeacher = formData.get('targetTeacher');
    const referral = formData.get('referral') || '';
    const concern = formData.get('concern') || '';
    const hasMedical = formData.get('hasMedical') === 'on';
    const medicalDetails = formData.get('medicalDetails') || '';
    
    if (!name.trim() || !phone.trim()) { showToast('請輸入真實姓名與聯絡電話才能預約喔！'); return; }
    if (!duration || isNaN(duration)) { showToast('請選擇課程長度！'); return; }

    const reqStartMins = timeToMins(reqStartTime);
    const reqEndMins = reqStartMins + duration;
    const reqEndTime = minsToTime(reqEndMins);

    const overlappingApts = appointments.filter(ap =>
       ap.date === selectedDate && timeToMins(ap.startTime) < reqEndMins && timeToMins(ap.endTime) > reqStartMins
    );
    let maxConcurrent = 0;
    const events = [];
    events.push({ time: reqStartMins, type: 1 });
    events.push({ time: reqEndMins, type: -1 });
    overlappingApts.forEach(ap => {
        events.push({ time: Math.max(timeToMins(ap.startTime), reqStartMins), type: 1 });
        events.push({ time: Math.min(timeToMins(ap.endTime), reqEndMins), type: -1 });
    });
    events.sort((a, b) => a.time - b.time || a.type - b.type);
    let current = 0;
    for (let ev of events) {
        current += ev.type;
        if (current > maxConcurrent) maxConcurrent = current;
    }
    if (maxConcurrent >= MAX_CAPACITY) { showToast('該時段教室已滿（超過 4 組客人），無法再預約！'); return; }

    let finalTeacher = targetTeacher;
    if (targetTeacher === 'all') {
        const availableTeachers = [...new Set(availabilities.filter(a => a.date === selectedDate && timeToMins(a.startTime) <= reqStartMins && timeToMins(a.endTime) >= reqEndMins).map(a => a.teacherName))];
        const freeTeachers = availableTeachers.filter(t => !appointments.some(ap => ap.teacherName === t && ap.date === selectedDate && timeToMins(ap.startTime) < reqEndMins && timeToMins(ap.endTime) > reqStartMins));
        if (freeTeachers.length === 0) { showToast('該時段目前無可安排的教練！'); return; }
        finalTeacher = '由系統安排'; 
    } else {
        const isAvail = availabilities.some(a => a.teacherName === targetTeacher && a.date === selectedDate && timeToMins(a.startTime) <= reqStartMins && timeToMins(a.endTime) >= reqEndMins);
        if (!isAvail) { showToast('預約時間不在該教練的開放時段內，或跨越了下班時間！'); return; }
        const teacherConflict = appointments.some(ap => ap.teacherName === targetTeacher && ap.date === selectedDate && timeToMins(ap.startTime) < reqEndMins && timeToMins(ap.endTime) > reqStartMins);
        if (teacherConflict) { showToast('教練在該時段已有其他預約，請選擇其他時間！'); return; }
    }

    const newAp = {
       id: Date.now().toString(), date: selectedDate, startTime: reqStartTime, endTime: reqEndTime, duration,
       teacherName: finalTeacher, studentName: name, phone: phone, referral, concern, hasMedical, medicalDetails, attended: false
    };
    
    setAppointments(prev => [...prev, newAp].sort((a, b) => timeToMins(a.startTime) - timeToMins(b.startTime)));
    showToast('預約成功！期待您的到來。');
    setBookingDuration(90); setBookingStartTime('10:00'); setHasMedicalCondition(false);
    e.target.reset();
  };

  const handleCancelAppointment = (id) => { setAppointments(prev => prev.filter(ap => ap.id !== id)); showToast('已取消該筆預約。'); };
  const handleToggleAttendance = (id) => { setAppointments(prev => prev.map(ap => ap.id === id ? { ...ap, attended: !ap.attended } : ap)); showToast('已更新學員報到狀態！'); };

  const handleSearchBookings = (e) => {
    e.preventDefault();
    if (!searchPhone.trim()) { showToast('請輸入聯絡電話！'); return; }
    const results = appointments.filter(ap => ap.phone === searchPhone).sort((a, b) => new Date(`${b.date}T${b.startTime}`) - new Date(`${a.date}T${a.startTime}`));
    setMyAppointments(results);
  };
  const handleCancelMyAppointment = (id) => {
     setAppointments(prev => prev.filter(ap => ap.id !== id));
     setMyAppointments(prev => prev.filter(ap => ap.id !== id));
     showToast('已成功取消您的預約！');
  };

  const handleSaveAssessment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAss = {
      id: Date.now().toString(),
      appointmentId: assessmentModal.data.id,
      date: assessmentModal.data.date,
      teacherName: assessmentModal.data.teacherName,
      studentName: assessmentModal.data.studentName,
      phone: assessmentModal.data.phone,
      metrics: {
        gender: formData.get('gender'),
        birthDate: formData.get('birthDate'),
        height: formData.get('height') ? parseFloat(formData.get('height')) : null,
        weight: formData.get('weight') ? parseFloat(formData.get('weight')) : null,
        restingHR: formData.get('restingHR') ? parseInt(formData.get('restingHR')) : null,
        sRPE: formData.get('sRPE') ? parseInt(formData.get('sRPE')) : null,
        gripLeft: formData.get('gripLeft') ? parseFloat(formData.get('gripLeft')) : null,
        gripRight: formData.get('gripRight') ? parseFloat(formData.get('gripRight')) : null,
        shoulderLeft: formData.get('shoulderLeft') ? parseFloat(formData.get('shoulderLeft')) : null,
        shoulderRight: formData.get('shoulderRight') ? parseFloat(formData.get('shoulderRight')) : null,
        rotationLeft: formData.get('rotationLeft') ? parseFloat(formData.get('rotationLeft')) : null,
        rotationRight: formData.get('rotationRight') ? parseFloat(formData.get('rotationRight')) : null,
        plank: formData.get('plank') ? parseInt(formData.get('plank')) : null,
        sidePlankLeft: formData.get('sidePlankLeft') ? parseInt(formData.get('sidePlankLeft')) : null,
        sidePlankRight: formData.get('sidePlankRight') ? parseInt(formData.get('sidePlankRight')) : null,
        ktwLeft: formData.get('ktwLeft') ? parseFloat(formData.get('ktwLeft')) : null,
        ktwRight: formData.get('ktwRight') ? parseFloat(formData.get('ktwRight')) : null,
        slsLeft: formData.get('slsLeft') ? parseInt(formData.get('slsLeft')) : null,
        slsRight: formData.get('slsRight') ? parseInt(formData.get('slsRight')) : null,
        jumpHeight: formData.get('jumpHeight') ? parseFloat(formData.get('jumpHeight')) : null,
        jumpAccel: formData.get('jumpAccel') ? parseFloat(formData.get('jumpAccel')) : null,
      },
      coachNotes: formData.get('coachNotes')
    };
    setAssessments(prev => {
      const filtered = prev.filter(a => a.appointmentId !== newAss.appointmentId);
      return [...filtered, newAss].sort((a, b) => new Date(b.date) - new Date(a.date));
    });
    showToast('✅ 檢測數據與教練悄悄話已成功儲存！');
    setAssessmentModal({ isOpen: false, data: null });
  };

  const handleSearchProgress = (e) => {
    e.preventDefault();
    if (!progressPhone.trim()) { showToast('請輸入聯絡電話！'); return; }
    const results = assessments.filter(ass => ass.phone === progressPhone).sort((a, b) => new Date(b.date) - new Date(a.date));
    setMyProgress(results);
    setSelectedProgressIndex(0); // 新增這行：每次搜尋後重置回最新一筆
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRequest = {
      id: Date.now().toString(), companyName: formData.get('companyName'), contactName: formData.get('contactName'),
      phone: formData.get('phone'), email: formData.get('email'), serviceType: formData.get('serviceType'),
      eventDate: formData.get('eventDate'), details: formData.get('details'), status: 'pending', createdAt: new Date().toISOString().split('T')[0]
    };
    setContactRequests(prev => [newRequest, ...prev]);
    showToast('✅ 已經收到您的合作需求！我們將盡快安排專人與您聯繫。');
    e.target.reset();
  };
  const handleUpdateContactStatus = (id, newStatus) => { setContactRequests(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c)); showToast('已更新接洽案件狀態！'); };
  const handleDeleteContact = (id) => { setContactRequests(prev => prev.filter(c => c.id !== id)); showToast('已刪除該筆接洽紀錄。'); };

  const handleExportCSV = () => {
    let csvContent = '\uFEFF'; 
    csvContent += "日期,開始時間,結束時間,教練名稱,學員姓名,報到狀態\n";
    appointments.forEach(ap => { csvContent += `${ap.date},${ap.startTime},${ap.endTime},${ap.teacherName},${ap.studentName},${ap.attended ? '已報到' : '未報到'}\n`; });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `築動約課報表_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    showToast('已成功匯出 Excel (CSV) 報表！');
  };
  const handleExportJSON = () => {
    const data = JSON.stringify({ availabilities, appointments, teacherProfiles, products, contactRequests, aboutContent, recentEvents, tagCategories }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `築動系統備份檔_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    showToast('已成功匯出系統備份 (JSON)！');
  };
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.availabilities) setAvailabilities(parsed.availabilities);
        if (parsed.appointments) setAppointments(parsed.appointments);
        if (parsed.teacherProfiles) setTeacherProfiles(parsed.teacherProfiles);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.contactRequests) setContactRequests(parsed.contactRequests);
        if (parsed.aboutContent) setAboutContent(parsed.aboutContent);
        if (parsed.recentEvents) setRecentEvents(parsed.recentEvents);
        if (parsed.tagCategories) setTagCategories(parsed.tagCategories);
        showToast('成功匯入歷史資料！');
      } catch (error) { showToast('檔案格式錯誤，匯入失敗。'); }
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  const calculateScheduledHours = (teacherName) => {
    const currentM = currentMonth.getMonth() + 1;
    const currentY = currentMonth.getFullYear();
    let totalMins = 0;
    availabilities.forEach(a => {
       if (a.teacherName !== teacherName) return;
       const aDate = new Date(a.date);
       if (aDate.getMonth() + 1 === currentM && aDate.getFullYear() === currentY) totalMins += (timeToMins(a.endTime) - timeToMins(a.startTime));
    });
    return Math.round(totalMins / 60);
  };

  // --- 教練過濾與排序 (包含 Tag 過濾) ---
  const filteredUniqueTeachers = Object.keys(teacherProfiles).filter(name => {
    if (selectedTags.length === 0) return true;
    const tTags = Object.values(teacherProfiles[name]?.tags || {}).flat();
    // 兩步篩選：教練必須具備「所有」顧客選中的 Tag 才顯示 (AND 邏輯)
    return selectedTags.every(st => tTags.includes(st));
  }).sort((a, b) => {
    const profileA = teacherProfiles[a];
    const profileB = teacherProfiles[b];
    if (profileA.type === 'fulltime' && profileB.type !== 'fulltime') return -1;
    if (profileA.type !== 'fulltime' && profileB.type === 'fulltime') return 1;
    const dateA = new Date(profileA.hireDate || '9999-12-31').getTime();
    const dateB = new Date(profileB.hireDate || '9999-12-31').getTime();
    return dateA - dateB;
  });

  const uniqueTeachersAll = Object.keys(teacherProfiles).sort((a,b) => {
      if (teacherProfiles[a].type === 'fulltime' && teacherProfiles[b].type !== 'fulltime') return -1;
      if (teacherProfiles[a].type !== 'fulltime' && teacherProfiles[b].type === 'fulltime') return 1;
      return 0;
  });

  const displayTeachers = bookingFlowType === 'direct' ? uniqueTeachersAll : filteredUniqueTeachers;

  const adminFilteredApts = adminSelectedTeacher === 'all' ? appointments : appointments.filter(ap => ap.teacherName === adminSelectedTeacher);

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const startDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null); 
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`);
    }
    return days;
  };

  // --- 進步亮點卡片 (Before vs After) ---
  const renderAchievementCard = (progressList) => {
    if (progressList.length < 2) return null;
    const latest = progressList[0].metrics;
    const first = progressList[progressList.length - 1].metrics;

    // 尋找最大進步的項目 (簡單邏輯：棒式秒數 或 活動度)
    let bestImprovement = null;
    
    const plankDiff = (latest.plank || 0) - (first.plank || 0);
    const ktwDiff = (((latest.ktwLeft||0) + (latest.ktwRight||0))/2) - (((first.ktwLeft||0) + (first.ktwRight||0))/2);
    
    if (plankDiff > 0 && plankDiff >= ktwDiff * 5) {
       bestImprovement = { 
         title: '核心耐力大突破', 
         icon: '🛡️', 
         metric: '棒式秒數', 
         oldVal: first.plank, 
         newVal: latest.plank, 
         unit: '秒',
         benefit: '這代表你的腰椎現在能承受更大的壓力，久坐辦公、搬重物時不容易再腰痠背痛了！'
       };
    } else if (ktwDiff > 0) {
       bestImprovement = { 
         title: '下肢活動度解鎖', 
         icon: '🦵', 
         metric: '腳踝活動度', 
         oldVal: (((first.ktwLeft||0) + (first.ktwRight||0))/2).toFixed(1), 
         newVal: (((latest.ktwLeft||0) + (latest.ktwRight||0))/2).toFixed(1), 
         unit: 'cm',
         benefit: '這代表你的腳踝變靈活了，深蹲或上下樓梯時，膝蓋的壓力會大幅減輕喔！'
       };
    }

    if (!bestImprovement) return null;

    return (
      <div className="bg-gradient-to-br from-amber-400 to-[#c1955b] p-1 rounded-3xl shadow-lg mx-4 my-6 animate-fade-in transform hover:scale-[1.02] transition-transform">
        <div className="bg-white rounded-[22px] p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-amber-100 opacity-50"><TrophyIcon size={120} /></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[#b08853] font-black text-sm mb-1 tracking-widest">
              <SparklesIcon size={16} /> 專屬進步里程碑
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-4">{bestImprovement.icon} {bestImprovement.title}</h3>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                 <div className="text-xs text-slate-400 font-bold mb-1">初次上課</div>
                 <div className="text-xl font-black text-slate-600">{bestImprovement.oldVal} <span className="text-xs">{bestImprovement.unit}</span></div>
              </div>
              <ArrowRightIcon className="text-amber-500 shrink-0" />
              <div className="flex-1 bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                 <div className="text-xs text-amber-600 font-bold mb-1">目前狀態</div>
                 <div className="text-2xl font-black text-[#b08853]">{bestImprovement.newVal} <span className="text-xs">{bestImprovement.unit}</span></div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-3 items-start">
               <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-black mt-0.5">!</div>
               <div>
                 <div className="text-xs font-black text-slate-700 mb-1">這對你的生活有什麼好處？</div>
                 <div className="text-sm text-slate-600 font-medium leading-relaxed">{bestImprovement.benefit}</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- 趨勢折線圖 (Sparkline) 加上生活翻譯 ---
  const renderSparkline = (data, metricExtractor, colorClass, title, unit, isReverseGood = false, showSDBands = false, explanation = '') => {
    const validData = data.filter(d => metricExtractor(d) !== null && !isNaN(metricExtractor(d)));
    if (validData.length < 2) {
      return (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm h-full flex flex-col justify-center items-center text-center w-full min-h-[200px]">
           <h4 className="text-sm font-bold text-slate-700 mb-2">{title}</h4>
           <p className="text-xs text-slate-400">累積兩次紀錄即可顯示趨勢圖表喔！</p>
        </div>
      );
    }

    const values = validData.map(d => metricExtractor(d));
    let rawMin = Math.min(...values);
    let rawMax = Math.max(...values);
    let mean = 0, sd = 0, calcMin = rawMin, calcMax = rawMax;
    
    if (showSDBands) {
      mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      sd = Math.max(Math.sqrt(variance), 1.5); 
      calcMin = Math.min(rawMin, mean - 2.5 * sd);
      calcMax = Math.max(rawMax, mean + 2.5 * sd);
    }
    const range = calcMax - calcMin || 1; 
    const getY = (val) => 100 - ((val - calcMin) / range) * 80 - 10;
    const latestValue = values[values.length - 1];
    const previousValue = values[values.length - 2];
    const diff = latestValue - previousValue;
    const isImproved = isReverseGood ? diff < 0 : diff > 0;
    const isNeutral = diff === 0;

    return (
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="text-sm font-black text-slate-700">{title}</h4>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-3xl font-black ${colorClass.text}`}>{latestValue.toFixed(1).replace('.0', '')}</span>
              <span className="text-xs text-slate-400 font-bold">{unit}</span>
            </div>
          </div>
          {!isNeutral && (
             <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${isImproved ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
               {isImproved ? <TrendingUpIcon size={14} className={isReverseGood ? 'rotate-180' : ''} /> : <TrendingDownIcon size={14} className={isReverseGood ? 'rotate-180' : ''} />}
               {Math.abs(diff).toFixed(1).replace('.0', '')}
             </div>
          )}
        </div>
        
        <div className="relative h-20 w-full mt-1 mb-2">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            {showSDBands && (
              <>
                <rect x="0" y={0} width="100" height={Math.max(0, getY(mean + 2*sd))} fill="#fee2e2" opacity="0.6" />
                <rect x="0" y={getY(mean + 2*sd)} width="100" height={Math.max(0, getY(mean + sd) - getY(mean + 2*sd))} fill="#fef08a" opacity="0.4" />
                <rect x="0" y={getY(mean + sd)} width="100" height={Math.max(0, getY(mean - sd) - getY(mean + sd))} fill="#dcfce3" opacity="0.6" />
                <rect x="0" y={getY(mean - sd)} width="100" height={Math.max(0, 100 - getY(mean - sd))} fill="#e0e7ff" opacity="0.5" />
                <line x1="0" y1={getY(mean)} x2="100" y2={getY(mean)} stroke="#64748b" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.8" />
              </>
            )}
            <polyline 
              fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              className={colorClass.stroke}
              points={validData.map((d, i) => `${(i / (validData.length - 1)) * 100},${getY(metricExtractor(d))}`).join(' ')} 
            />
            {validData.map((d, i) => (
              <circle 
                key={i} cx={(i / (validData.length - 1)) * 100} cy={getY(metricExtractor(d))} r="4.5" fill="white"
                stroke="currentColor" strokeWidth="2.5" className={colorClass.stroke}
              />
            ))}
          </svg>
        </div>
        <div className="flex justify-between text-[10px] font-bold text-slate-300 border-b border-slate-50 pb-2 mb-2">
          <span>最初紀錄</span>
          <span>最新紀錄</span>
        </div>
        {explanation && (
          <div className="bg-slate-50 rounded-xl p-3 flex gap-2 items-start mt-auto border border-slate-100">
            <span className="text-lg">💡</span>
            <div>
               <div className="text-[10px] font-black text-slate-500 mb-0.5">你的生活改變：</div>
               <div className="text-xs text-slate-700 font-medium leading-relaxed">{explanation}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSharedCalendar = (mode) => {
    const currentSelDate = mode === 'admin' ? adminSelectedDate : selectedDate;
    const onSelect = (dStr) => {
       if (mode === 'admin') setAdminSelectedDate(currentSelDate === dStr ? null : dStr);
       else setSelectedDate(dStr);
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ChevronLeftIcon />
          </button>
          <h3 className="text-lg font-bold text-slate-800">
            {currentMonth.getFullYear()} 年 {currentMonth.getMonth() + 1} 月
          </h3>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ChevronRightIcon />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-slate-400 py-2">{day}</div>
          ))}
          {generateCalendarDays().map((dateStr, index) => {
            if (!dateStr) return <div key={`empty-${index}`} className="p-2"></div>;
            const dayNum = new Date(dateStr).getDate();
            const isSelected = currentSelDate === dateStr;
            let hasData = false, badgeCount = 0;
            if (mode === 'customer') {
               hasData = availabilities.filter(a => a.date === dateStr && (selectedTeacher === 'all' || a.teacherName === selectedTeacher)).length > 0;
            } else if (mode === 'teacher') {
               const teacherApts = appointments.filter(a => a.date === dateStr && a.teacherName === activeTeacher);
               hasData = availabilities.some(a => a.date === dateStr && a.teacherName === activeTeacher) || teacherApts.length > 0;
               badgeCount = teacherApts.length; 
            } else if (mode === 'admin') {
               const adminApts = appointments.filter(a => a.date === dateStr && (adminSelectedTeacher === 'all' || a.teacherName === adminSelectedTeacher));
               hasData = adminApts.length > 0;
               badgeCount = adminApts.length;
            }
            return (
              <button
                key={dateStr} onClick={() => onSelect(dateStr)}
                className={`relative p-2 md:p-3 flex flex-col items-center justify-center rounded-xl transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-700'}`}
              >
                <span className={`text-sm md:text-base font-bold ${isSelected ? 'text-white' : ''}`}>{dayNum}</span>
                <div className="flex gap-1 mt-1 min-h-[4px]">
                  {hasData && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-400'}`}></span>}
                </div>
                {badgeCount > 0 && !isSelected && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col xl:flex-row items-center justify-between gap-4 xl:gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full xl:w-auto">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setView('customer')}>
              <img src={logoMain} alt="築動 Rebuild Logo" className="h-12 md:h-14 object-contain mix-blend-multiply" />
              <div className="hidden sm:block text-left">
                <h1 className="font-black text-xl md:text-2xl tracking-tight text-slate-900 leading-tight">築動預約與服務中心</h1>
                <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">Rebuild Training Lab</p>
              </div>
            </div>
            <nav className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl items-center flex-wrap justify-center border border-slate-100 shadow-inner">
              <button onClick={() => setView('customer')} className={`px-5 py-2.5 rounded-xl text-base font-black transition-all transform shadow-sm ${view === 'customer' ? 'bg-[#1E293B] text-white shadow-md scale-105' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>
                ✨ 我要約課
              </button>
              <button onClick={() => setView('progress')} className={`px-5 py-2.5 rounded-xl text-base font-black transition-all transform shadow-sm ${view === 'progress' ? 'bg-[#1E293B] text-white shadow-md scale-105' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>
                📈 進步軌跡
              </button>
              <button onClick={() => setView('about')} className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all transform shadow-sm ${view === 'about' ? 'bg-blue-500 text-white shadow-md scale-105' : 'bg-white text-blue-500 hover:bg-blue-50 border border-blue-100'}`}>
                📖 認識築動
              </button>
              <button onClick={() => setView('shop')} className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all transform shadow-sm ${view === 'shop' ? 'bg-orange-500 text-white shadow-md scale-105' : 'bg-white text-orange-500 hover:bg-orange-50 border border-orange-100'}`}>
                🛒 產品選購
              </button>
              <button onClick={() => setView('contact')} className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all transform shadow-sm ${view === 'contact' ? 'bg-emerald-600 text-white shadow-md scale-105' : 'bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-100'}`}>
                🤝 合作接洽
              </button>
            </nav>
          </div>
          <nav className="flex gap-2 items-center w-full xl:w-auto justify-center xl:justify-end border-t xl:border-t-0 xl:border-l border-slate-100 pt-3 xl:pt-0 xl:pl-6">
            <div className="text-xs font-bold text-slate-400 mr-2 hidden sm:block">內部管理區</div>
            <button onClick={() => setView('teacher')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${view === 'teacher' ? 'bg-slate-800 text-white shadow-md scale-105' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 shadow-sm'}`}>
              💪 老師排排課
            </button>
            <button onClick={() => setView('admin')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${view === 'admin' ? 'bg-slate-800 text-white shadow-md scale-105' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 shadow-sm'}`}>
              👑 JD
            </button>
          </nav>
        </div>
      </header>

      {/* 修改資料彈出視窗 */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <EditIcon className="w-5 h-5 text-indigo-600" /> 修改 {editModal.type === 'availability' ? '開放時段' : editModal.type === 'appointment' ? '預約資料' : '個人專長與檔案'}
            </h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              {editModal.type === 'availability' && (
                <>
                  <div>
                    <label className="text-sm font-bold text-slate-600 block mb-1">日期</label>
                    <input type="date" name="date" defaultValue={editModal.data.date} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-bold text-slate-600 block mb-1">開始時間</label>
                      <input type="time" name="startTime" defaultValue={editModal.data.startTime} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-600 block mb-1">結束時間</label>
                      <input type="time" name="endTime" defaultValue={editModal.data.endTime} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                  </div>
                </>
              )}
              {editModal.type === 'appointment' && (
                <>
                  <div>
                    <label className="text-sm font-bold text-slate-600 block mb-1">學員姓名</label>
                    <input type="text" name="studentName" defaultValue={editModal.data.studentName} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-600 block mb-1">日期</label>
                    <input type="date" name="date" defaultValue={editModal.data.date} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-bold text-slate-600 block mb-1">開始時間</label>
                      <input type="time" name="startTime" defaultValue={editModal.data.startTime} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-600 block mb-1">長度 (分鐘)</label>
                      <select name="duration" defaultValue={editModal.data.duration} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="60">60 分鐘</option>
                        <option value="90">90 分鐘</option>
                        <option value="120">120 分鐘</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                     <p className="text-xs font-bold text-slate-500">客人的填寫備註 (選填項目)</p>
                     <input type="text" name="referral" defaultValue={editModal.data.referral} placeholder="介紹人" className="w-full px-3 py-1.5 rounded border border-slate-200 text-sm" />
                     <input type="text" name="concern" defaultValue={editModal.data.concern} placeholder="困擾的問題" className="w-full px-3 py-1.5 rounded border border-slate-200 text-sm" />
                     <div className="flex items-center gap-2">
                        <input type="checkbox" name="hasMedical" defaultChecked={editModal.data.hasMedical} className="w-3 h-3" />
                        <span className="text-xs text-slate-600">有受傷/懷孕狀況</span>
                     </div>
                     <input type="text" name="medicalDetails" defaultValue={editModal.data.medicalDetails} placeholder="受傷狀況說明" className="w-full px-3 py-1.5 rounded border border-slate-200 text-sm" />
                  </div>
                </>
              )}
              {editModal.type === 'profile' && (
                <>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-4 max-h-[40vh] overflow-y-auto shadow-inner mb-4">
                     <h5 className="text-xs font-black text-indigo-700 sticky top-0 bg-slate-50 pb-2 border-b border-slate-200 z-10">勾選專長標籤 (讓客人更容易找到您)</h5>
                     {Object.entries(tagCategories).map(([catKey, cat]) => (
                        <div key={catKey} className="space-y-2">
                          <div className="flex items-center justify-between bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                             <label className="text-xs font-bold text-slate-600">{cat.label}</label>
                             <div className="flex items-center gap-1">
                                <input type="text" value={newTagInputs[catKey] || ''} onChange={e => setNewTagInputs(prev => ({...prev, [catKey]: e.target.value}))} placeholder="自訂標籤..." className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 outline-none w-20 bg-slate-50 focus:bg-white" />
                                <button type="button" onClick={() => handleAddNewTag(catKey)} className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold hover:bg-indigo-200 transition-colors">新增</button>
                             </div>
                          </div>
                          <div className="flex flex-wrap gap-2 pl-1">
                            {cat.options.map(opt => {
                               const isChecked = editModal.data.profile.tags?.[catKey]?.includes(opt) || false;
                               const isEditing = editingGlobalTag.catKey === catKey && editingGlobalTag.oldTag === opt;
                               return (
                                 <div key={opt} className="flex items-center gap-1.5 w-full group py-0.5">
                                    {isEditing ? (
                                        <div className="flex flex-1 items-center gap-1">
                                            <input 
                                                type="text" 
                                                value={editingGlobalTag.value} 
                                                onChange={e => setEditingGlobalTag(prev => ({ ...prev, value: e.target.value }))}
                                                className="flex-1 text-xs px-2 py-0.5 border border-indigo-400 rounded outline-none"
                                                autoFocus
                                            />
                                            <button type="button" onClick={handleSaveEditTag} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">儲存</button>
                                            <button type="button" onClick={() => setEditingGlobalTag({catKey: null, oldTag: null, value: ''})} className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">取消</button>
                                        </div>
                                    ) : (
                                        <>
                                            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer flex-1">
                                               <input type="checkbox" name={`tags.${catKey}`} value={opt} defaultChecked={isChecked} className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                               {opt}
                                            </label>
                                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                               <button type="button" onClick={() => setEditingGlobalTag({catKey, oldTag: opt, value: opt})} className="text-slate-400 hover:text-indigo-600 p-0.5 bg-slate-100 rounded" title="修改"><EditIcon size={12}/></button>
                                               <button type="button" onClick={() => handleDeleteGlobalTag(catKey, opt)} className="text-slate-400 hover:text-rose-500 p-0.5 bg-slate-100 rounded" title="刪除"><Trash2Icon size={12}/></button>
                                            </div>
                                        </>
                                    )}
                                 </div>
                               );
                            })}
                          </div>
                        </div>
                     ))}
                     <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-100 block">其他特色訓練 (自填)</label>
                       <input type="text" name="customTraining" placeholder="例如：孕婦訓練" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500" />
                     </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      <label className="text-xs font-bold text-indigo-600 flex items-center gap-1 mb-2"><ImageIcon size={14}/> 更新教練照片</label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                           {uploadedPhoto || editModal.data.profile.photo ? <img src={uploadedPhoto || editModal.data.profile.photo} alt="預覽" className="w-full h-full object-cover" /> : <UserIcon className="text-slate-400" />}
                        </div>
                        <label className="flex-1 text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors border border-indigo-100">
                          上傳照片<input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">給客戶的話 (引言)</label>
                      <input type="text" name="quote" defaultValue={editModal.data.profile.quote || ''} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">詳細介紹</label>
                      <textarea name="description" defaultValue={editModal.data.profile.description || ''} rows="3" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none resize-none text-sm focus:ring-2 focus:ring-indigo-500" required></textarea>
                    </div>
                  </div>
                </>
              )}
              <div className="flex gap-3 mt-6 pt-2">
                <button type="button" onClick={() => setEditModal({isOpen: false, type: '', data: null})} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors">取消</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors shadow-sm">確認儲存</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 微型檢測填寫 Modal (老師端用) */}
      {assessmentModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2"><ActivityIcon className="w-6 h-6 text-indigo-600" /> 學員檢測紀錄表</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">紀錄 {assessmentModal.data.studentName} 在 {assessmentModal.data.date} 的身體數據</p>
            <form onSubmit={handleSaveAssessment} className="space-y-6">
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <h4 className="text-sm font-black text-slate-700 flex items-center gap-2 mb-2">🧑 客戶基本資料</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                     <label className="text-xs font-bold text-slate-500 block mb-1">性別</label>
                     <select name="gender" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm bg-white">
                        <option value="female">女性</option>
                        <option value="male">男性</option>
                        <option value="other">其他</option>
                     </select>
                  </div>
                  <div><label className="text-xs font-bold text-slate-500 block mb-1">生日</label><input type="date" name="birthDate" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm" /></div>
                  <div><label className="text-xs font-bold text-slate-500 block mb-1">身高 (cm)</label><input type="number" step="0.1" name="height" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm" /></div>
                  <div><label className="text-xs font-bold text-slate-500 block mb-1">體重 (kg)</label><input type="number" step="0.1" name="weight" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm" /></div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <h4 className="text-sm font-black text-slate-700 flex items-center gap-2 mb-2">❤️ 狀態與心肺指標</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-bold text-slate-500 block mb-1">安靜心率 (bpm)</label><input type="number" name="restingHR" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm" /></div>
                  <div><label className="text-xs font-bold text-slate-500 block mb-1">疲勞指數 (1-10)</label><input type="number" name="sRPE" min="1" max="10" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm" /></div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <h4 className="text-sm font-black text-slate-700 flex items-center gap-2 mb-2">💪 上肢檢測</h4>
                <div className="grid grid-cols-2 gap-4 items-center bg-white p-3 rounded-xl border border-slate-100">
                  <div className="col-span-2 text-xs font-bold text-slate-500">肩關節：雙手過頭舉 (度)</div>
                  <div><input type="number" step="1" name="shoulderLeft" placeholder="左手" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" /></div>
                  <div><input type="number" step="1" name="shoulderRight" placeholder="右手" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center bg-white p-3 rounded-xl border border-slate-100">
                  <div className="col-span-2 text-xs font-bold text-slate-500">神經：數位握力測試 (kg)</div>
                  <div><input type="number" step="0.1" name="gripLeft" placeholder="左手" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" /></div>
                  <div><input type="number" step="0.1" name="gripRight" placeholder="右手" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" /></div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <h4 className="text-sm font-black text-slate-700 flex items-center gap-2 mb-2">🧘 軀幹核心檢測</h4>
                <div className="grid grid-cols-2 gap-4 items-center bg-white p-3 rounded-xl border border-slate-100">
                  <div className="col-span-2 text-xs font-bold text-slate-500">胸椎轉體測試 (度)</div>
                  <div><input type="number" step="1" name="rotationLeft" placeholder="左轉" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" /></div>
                  <div><input type="number" step="1" name="rotationRight" placeholder="右轉" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center bg-white p-3 rounded-xl border border-slate-100">
                  <div className="col-span-2 text-xs font-bold text-slate-500">棒式 (秒)</div>
                  <div className="col-span-2"><input type="number" name="plank" placeholder="撐體時間" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center bg-white p-3 rounded-xl border border-slate-100">
                  <div className="col-span-2 text-xs font-bold text-slate-500">側棒式 (秒)</div>
                  <div><input type="number" name="sidePlankLeft" placeholder="左側" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" /></div>
                  <div><input type="number" name="sidePlankRight" placeholder="右側" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" /></div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <h4 className="text-sm font-black text-slate-700 flex items-center gap-2 mb-2">🦵 下肢檢測</h4>
                <div className="grid grid-cols-2 gap-4 items-center bg-white p-3 rounded-xl border border-slate-100">
                  <div className="col-span-2 text-xs font-bold text-slate-500">腳踝：膝牆距測試 KTW (cm)</div>
                  <div><input type="number" step="0.1" name="ktwLeft" placeholder="左腳" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" /></div>
                  <div><input type="number" step="0.1" name="ktwRight" placeholder="右腳" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center bg-white p-3 rounded-xl border border-slate-100">
                  <div className="col-span-2 text-xs font-bold text-slate-500">爆發力：VBT 垂直跳測試</div>
                  <div><input type="number" step="0.1" name="jumpHeight" placeholder="高度(cm)" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" /></div>
                  <div><input type="number" step="0.01" name="jumpAccel" placeholder="加速度(m/s²)" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" /></div>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-indigo-700 flex items-center gap-2 mb-2"><MessageSquareIcon size={16} /> 課後悄悄話 (專屬處方籤)</label>
                <textarea name="coachNotes" placeholder="給學員的貼心叮嚀..." rows="3" className="w-full px-4 py-3 rounded-xl border border-indigo-200 outline-none resize-none text-sm bg-indigo-50/30"></textarea>
              </div>

              <div className="flex gap-3 mt-6 pt-2">
                <button type="button" onClick={() => setAssessmentModal({isOpen: false, data: null})} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold">取消</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2"><CheckIcon size={18} /> 儲存數據</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 查詢預約 Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><SearchIcon className="w-6 h-6 text-indigo-600" /> 查詢我的預約</h3>
              <button onClick={() => { setSearchModalOpen(false); setMyAppointments(null); setSearchPhone(''); }} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSearchBookings} className="flex gap-2 mb-6 shrink-0">
              <input type="tel" placeholder="請輸入聯絡電話" value={searchPhone} onChange={e => setSearchPhone(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50 focus:bg-white" required />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm">查詢</button>
            </form>

            <div className="overflow-y-auto flex-1 pr-2 space-y-4 scrollbar-hide">
               {!myAppointments && <div className="text-center py-10 text-slate-400 text-sm font-medium">請輸入電話號碼以查詢您的預約紀錄。</div>}
               {myAppointments && myAppointments.length === 0 && <div className="text-center py-10 text-slate-500 text-sm font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">找不到符合此電話的預約紀錄 🥺</div>}
               {myAppointments && myAppointments.length > 0 && myAppointments.map(ap => {
                  const isPast = new Date(`${ap.date}T${ap.startTime}`) < new Date();
                  return (
                    <div key={ap.id} className={`p-4 rounded-xl border transition-all ${isPast ? 'bg-slate-50 border-slate-100 opacity-80' : 'bg-white border-indigo-100 shadow-sm'}`}>
                       <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-slate-800 flex items-center gap-2"><ViewCalendarIcon size={16} className={isPast ? 'text-slate-400' : 'text-indigo-600'} />{ap.date}</div>
                          {isPast ? <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">已結束</span> : <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">即將到來</span>}
                       </div>
                       <div className="text-sm font-medium text-slate-600 space-y-1 mb-3">
                          <div className="flex items-center gap-2"><ClockIcon size={14} className="text-slate-400" /> 時間：{ap.startTime} - {ap.endTime} ({ap.duration}分鐘)</div>
                          <div className="flex items-center gap-2"><UserIcon size={14} className="text-slate-400" /> 教練：{ap.teacherName}</div>
                       </div>
                       {!isPast && (
                          <div className="pt-3 border-t border-slate-100 flex justify-end">
                             <button onClick={() => handleCancelMyAppointment(ap.id)} className="text-xs font-bold text-rose-500 hover:text-white border border-rose-200 hover:bg-rose-500 px-3 py-1.5 rounded-lg transition-colors">取消此預約</button>
                          </div>
                       )}
                    </div>
                  )
               })}
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium flex items-center gap-2"><CheckIcon /> {toastMessage}</div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 mt-8 mb-12">
        
        {/* ================= ABOUT VIEW ================= */}
        {view === 'about' && (
          <div className="space-y-12 animate-fade-in py-6">
            <div className="text-center max-w-3xl mx-auto">
              <img src={aboutContent.heroImage} alt="築動 Rebuild Logo" className="h-28 md:h-40 object-contain mx-auto mb-6 mix-blend-multiply" />
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-6 leading-tight">
                {aboutContent.heroTitle}<br/>
                <span className="text-indigo-600 text-2xl md:text-4xl">{aboutContent.heroSubtitle}</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{aboutContent.heroDescription}</p>
            </div>

            <div className="space-y-6">
              <div className="text-center mb-8">
                <span className="bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-full text-sm font-black tracking-widest">CORE SERVICES</span>
                <h3 className="text-2xl font-bold text-slate-800 mt-4">我們的三大核心服務</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform shadow-sm"><HeartIcon size={32} /></div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">運動按摩</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">透過專業的手法放鬆深層筋膜，精準解除激痛點。適合長期的肌肉緊繃、運動後的疲勞恢復，以及改善因代償產生的痠痛問題。</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                  <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform shadow-sm"><TargetIcon size={32} /></div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">運動訓練</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">不是盲目舉重，而是建立正確發力與身體張力。強化核心與肌力，提升運動表現並預防受傷，為身體打下最穩固的基礎。</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform shadow-sm"><ActivityIcon size={32} /></div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">機能重建</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">專為受傷後、開刀後或長期姿勢不良者設計。循序漸進地找回關節活動度與神經控制力，安全地重返正常生活與運動場。</p>
                </div>
              </div>
            </div>

            {recentEvents.length > 0 && (
              <div className="space-y-6 pt-6">
                <div className="text-center mb-8">
                  <span className="bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-black tracking-widest">RECENT EVENTS</span>
                  <h3 className="text-2xl font-bold text-slate-800 mt-4">近期活動與參與紀錄</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentEvents.map(ev => (
                    <div key={ev.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                      <div className="w-full h-48 bg-slate-50 overflow-hidden relative">
                        <img src={ev.photo} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5"><ViewCalendarIcon size={14} /> {ev.date}</div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-bold text-slate-800 mb-3">{ev.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{ev.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TEACHER VIEW ================= */}
        {view === 'teacher' && !activeTeacher && (
          <div className="animate-fade-in py-10">
            <div className="text-center mb-10">
              <img src={logoTeacher} alt="JD Rebuild Action" className="h-28 md:h-36 object-contain mx-auto mb-6 mix-blend-multiply opacity-80" />
              <h2 className="text-3xl font-extrabold text-slate-800 mb-2">請選擇您的教練身分</h2>
              <p className="text-slate-500">點擊您的頭像即可進入專屬排課表</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {uniqueTeachersAll.map(name => (
                <button key={name} onClick={() => setActiveTeacher(name)} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all flex flex-col items-center gap-3 active:scale-95">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center overflow-hidden border border-indigo-100">
                    {teacherProfiles[name]?.photo ? <img src={teacherProfiles[name].photo} alt={name} className="w-full h-full object-cover" /> : <UserIcon />}
                  </div>
                  <div>
                    <span className="block font-bold text-slate-700">{name}</span>
                    <span className="text-[10px] text-slate-400">{teacherProfiles[name].type === 'fulltime' ? '正職人員' : '承攬人員'}</span>
                  </div>
                </button>
              ))}
              {uniqueTeachersAll.length === 0 && <p className="col-span-full text-center text-slate-500 bg-white p-8 rounded-2xl border border-dashed">尚無建立任何教練檔案，請先由老闆端新增。</p>}
            </div>
          </div>
        )}

        {view === 'teacher' && activeTeacher && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
               <div className="flex flex-wrap items-center gap-3">
                 <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0"><UserIcon /></div>
                    {activeTeacher} 的專屬排課表
                 </h2>
                 <button onClick={() => {
                    setUploadedPhoto('');
                    setEditModal({ isOpen: true, type: 'profile', data: { name: activeTeacher, profile: teacherProfiles[activeTeacher] } });
                 }} className="text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors border border-indigo-100 shadow-sm">
                    <EditIcon size={16} /> 設定專長與檔案
                 </button>
               </div>
               <button onClick={() => setActiveTeacher(null)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-all self-start md:self-auto"><LogOutIcon /> 登出切換身分</button>
            </div>

            {teacherProfiles[activeTeacher]?.type === 'fulltime' && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                 <div>
                    <h3 className="font-bold text-indigo-900 flex items-center gap-2 text-lg"><BriefcaseIcon /> 正職排班狀況 ({currentMonth.getMonth() + 1}月)</h3>
                    <p className="text-sm text-indigo-700 mt-2 leading-relaxed">
                      依勞基法，全職人員月排班基準約為 160 小時。<br/>
                      目前年資：<span className="font-bold">{calculateSeniority(teacherProfiles[activeTeacher]?.hireDate).text}</span>，今年享有 <span className="font-bold text-indigo-800">{calculateSeniority(teacherProfiles[activeTeacher]?.hireDate).leaveDays} 天</span> 特休
                    </p>
                 </div>
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-indigo-100 text-center shrink-0">
                       <span className="block text-xs text-slate-500 font-bold mb-1">本月已排班</span>
                       <span className="block text-2xl font-black text-indigo-600">{calculateScheduledHours(activeTeacher)} <span className="text-sm font-medium">小時</span></span>
                    </div>
                    {calculateScheduledHours(activeTeacher) >= 160 ? (
                       <div className="bg-emerald-100/80 text-emerald-700 px-5 py-4 rounded-xl shadow-sm text-sm font-bold flex-1 md:flex-none text-center leading-relaxed">已達 160h！<br/>符合基本排班目標</div>
                    ) : (
                       <div className="bg-amber-100/80 text-amber-700 px-5 py-4 rounded-xl shadow-sm text-sm font-bold flex-1 md:flex-none text-center flex items-center justify-center">距 160h 尚缺 {160 - calculateScheduledHours(activeTeacher)} 小時</div>
                    )}
                 </div>
              </div>
            )}

            {renderSharedCalendar('teacher')}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit sticky top-24">
                 <h3 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">開放 {selectedDate} 供預約</h3>
                 <form onSubmit={handleAddAvailability} className="space-y-4">
                    <input type="hidden" name="teacherName" value={activeTeacher} />
                    <input type="hidden" name="date" value={selectedDate} />
                    <div className="space-y-1.5"><label className="text-sm font-bold text-slate-600">開放開始時間</label><input type="time" name="startTime" defaultValue="09:00" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 outline-none font-medium" required /></div>
                    <div className="space-y-1.5"><label className="text-sm font-bold text-slate-600">開放結束時間</label><input type="time" name="endTime" defaultValue="18:00" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 outline-none font-medium" required /></div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors shadow-sm active:scale-[0.98] mt-2">+ 新增開放時段</button>
                 </form>
               </div>

               <div className="md:col-span-2">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">{selectedDate} 開放時段與預約名單</h3>
                 <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2"><ClockIcon /> 您開放的時間區間</h4>
                    <div className="flex flex-wrap gap-3">
                       {availabilities.filter(a => a.teacherName === activeTeacher && a.date === selectedDate).length === 0 ? (
                          <div className="text-sm text-slate-400">當日尚未開放時間</div>
                       ) : (
                          availabilities.filter(a => a.teacherName === activeTeacher && a.date === selectedDate).map(avail => (
                             <div key={avail.id} className="bg-indigo-50 border border-indigo-100 text-indigo-800 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-sm group">
                                {avail.startTime} - {avail.endTime}
                                <button onClick={() => setEditModal({ isOpen: true, type: 'availability', data: avail })} className="text-indigo-400 hover:text-indigo-600 ml-1 p-1"><EditIcon size={14} /></button>
                                <button onClick={() => handleDeleteAvailability(avail.id)} className="text-indigo-400 hover:text-red-500 p-1">✕</button>
                             </div>
                          ))
                       )}
                    </div>
                 </div>

                 <div>
                    <h4 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2"><UserIcon /> 學生預約名單</h4>
                    <div className="space-y-3">
                      {appointments.filter(ap => ap.teacherName === activeTeacher && ap.date === selectedDate).length === 0 ? (
                          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed text-slate-400 text-sm font-medium">尚未有學生預約</div>
                      ) : (
                          appointments.filter(ap => ap.teacherName === activeTeacher && ap.date === selectedDate).map(ap => (
                            <div key={ap.id} className="p-5 rounded-2xl border bg-white border-slate-200 transition-all hover:shadow-md flex flex-col md:flex-row justify-between gap-5">
                              <div className="space-y-2">
                                <div className="text-slate-800 font-bold flex items-center gap-2">
                                  <ClockIcon /> {ap.startTime} - {ap.endTime} ({ap.duration} 分鐘)
                                  <button onClick={() => setEditModal({ isOpen: true, type: 'appointment', data: ap })} className="text-slate-400 hover:text-indigo-600 ml-2"><EditIcon size={16} /></button>
                                </div>
                                <div className="text-slate-600 flex items-center gap-2 font-medium"><UserIcon /> 學生姓名：{ap.studentName}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button onClick={() => setAssessmentModal({ isOpen: true, data: ap })} className="px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100">📝 檢測數據</button>
                                <button onClick={() => handleToggleAttendance(ap.id)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm ${ap.attended ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                  {ap.attended ? '已報到 ✓' : '點擊報到'}
                                </button>
                                <button onClick={() => handleCancelAppointment(ap.id)} className="text-sm text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 px-3 py-2 rounded-xl font-bold transition-colors">取消預約</button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* ================= CUSTOMER VIEW ================= */}
        {view === 'customer' && (
          <div className="space-y-6 animate-fade-in">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">預約課程</h2>
                <p className="text-slate-500 mt-2">尋找您的專屬防護師，踏上「讓健康成為日常」的旅程。</p>
              </div>
              <button 
                onClick={() => { setSearchModalOpen(true); setMyAppointments(null); setSearchPhone(''); }}
                className="bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 shrink-0"
              >
                <SearchIcon size={18} /> 查詢 / 取消 我的預約
              </button>
            </div>

            {/* 新增：切換 約課模式 (導引配對 vs 直接指定) */}
            <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-4 w-full sm:w-fit shadow-inner">
              <button 
                onClick={() => { setBookingFlowType('guided'); setSelectedTeacher('all'); setBookingIntent(null); setSelectedTags([]); }}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-all ${bookingFlowType === 'guided' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                🔍 依需求找教練 (新客推薦)
              </button>
              <button 
                onClick={() => { setBookingFlowType('direct'); setSelectedTeacher('all'); setBookingIntent(null); setSelectedTags([]); }}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-all ${bookingFlowType === 'direct' ? 'bg-white text-[#c1955b] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                ⚡ 直接指定教練 (老客戶)
              </button>
            </div>

            {/* 兩步篩選法 UI (僅在 Guided 模式下顯示) */}
            {bookingFlowType === 'guided' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
                <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><TargetIcon className="text-indigo-600" /> 第一步：您今天想解決什麼需求？</h3>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <button 
                    onClick={() => { setBookingIntent('relax'); setSelectedTags([]); setSelectedTeacher('all'); }}
                    className={`flex-1 py-5 rounded-2xl font-black text-lg transition-all border-2 flex items-center justify-center gap-3 ${bookingIntent === 'relax' ? 'border-[#1E293B] bg-slate-50 text-[#1E293B] shadow-md' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}
                  >
                    <span className="text-2xl">💆‍♂️</span> 我要解痛放鬆
                  </button>
                  <button 
                    onClick={() => { setBookingIntent('train'); setSelectedTags([]); setSelectedTeacher('all'); }}
                    className={`flex-1 py-5 rounded-2xl font-black text-lg transition-all border-2 flex items-center justify-center gap-3 ${bookingIntent === 'train' ? 'border-[#c1955b] bg-amber-50 text-[#9b7342] shadow-md' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}
                  >
                    <span className="text-2xl">🏋️‍♀️</span> 我要強化身體
                  </button>
                </div>

                {bookingIntent && (
                  <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-slate-100 animate-fade-in space-y-5">
                    <h4 className="text-sm font-bold text-slate-500">第二步：選擇您的偏好與狀態 (可複選)</h4>
                    
                    {/* 根據 Intent 顯示不同分類 */}
                    {[...(bookingIntent === 'relax' ? ['bodyParts', 'intensity'] : ['lifestyles', 'trainings'])].map(catKey => {
                       const cat = tagCategories[catKey];
                       return (
                         <div key={catKey}>
                            <div className="text-xs font-black text-slate-700 mb-2">{cat.label}</div>
                            <div className="flex flex-wrap gap-2">
                               {cat.options.map(opt => {
                                  const isSelected = selectedTags.includes(opt);
                                  return (
                                    <button
                                      key={opt}
                                      onClick={() => setSelectedTags(prev => prev.includes(opt) ? prev.filter(t => t !== opt) : [...prev, opt])}
                                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                        isSelected ? (bookingIntent === 'relax' ? 'bg-[#1E293B] text-white border-[#1E293B]' : 'bg-[#c1955b] text-white border-[#c1955b]') 
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                               })}
                            </div>
                         </div>
                       );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 教練展示列表 */}
            {(bookingIntent || bookingFlowType === 'direct') && (
              <div className="mb-6 animate-fade-in space-y-4">
                <h3 className="text-lg font-black text-slate-800 flex items-center justify-between">
                  <span>{bookingFlowType === 'direct' ? '選擇您的專屬防護師' : '推薦的防護師 / 教練'}</span>
                  <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">符合條件：{displayTeachers.length} 位</span>
                </h3>
                
                {displayTeachers.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium">
                    目前沒有符合所有所選標籤的教練 🥺<br/>請嘗試減少一些篩選條件！
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayTeachers.map(name => {
                      const profile = teacherProfiles[name];
                      const isSelected = selectedTeacher === name;
                      // 取得所有 Hashtags 扁平陣列
                      const hashtags = Object.values(profile.tags || {}).flat();

                      return (
                        <div 
                          key={name} 
                          onClick={() => {
                            setSelectedTeacher(name);
                            setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 150);
                          }}
                          className={`bg-white rounded-3xl p-5 border-2 flex flex-col gap-3 transition-all cursor-pointer group ${isSelected ? (bookingFlowType === 'direct' ? 'border-[#c1955b] shadow-md ring-4 ring-amber-50' : (bookingIntent === 'relax' ? 'border-[#1E293B] shadow-md ring-4 ring-slate-100' : 'border-[#c1955b] shadow-md ring-4 ring-amber-50')) : 'border-slate-100 hover:shadow-md hover:border-slate-300'}`}
                        >
                          <div className="flex gap-4 items-start">
                            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm border-2 border-white mt-1">
                              {profile.photo ? <img src={profile.photo} alt={name} className="w-full h-full object-cover" /> : <UserIcon size={24} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-xl text-slate-800">{name}</h3>
                                {isSelected && <span className={`text-xs font-black px-2 py-1 rounded-full shadow-sm ${bookingFlowType === 'direct' ? 'bg-[#c1955b] text-white' : (bookingIntent === 'relax' ? 'bg-[#1E293B] text-white' : 'bg-[#c1955b] text-white')}`}>已選擇 ✓</span>}
                              </div>
                              {profile.quote && <div className="text-sm font-bold text-[#c1955b] mb-2">「{profile.quote}」</div>}
                              <p className="text-sm text-slate-600 font-medium leading-relaxed mb-3 whitespace-pre-wrap">{profile.description}</p>
                            </div>
                          </div>
                          {/* 顯示 Hashtags 與點擊提示 */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                            <div className="flex flex-wrap gap-1.5">
                              {hashtags.map(tag => (
                                <span key={tag} className={`text-[10px] px-2 py-1 rounded font-bold ${selectedTags.includes(tag) ? (bookingIntent === 'relax' ? 'bg-[#1E293B] text-white' : 'bg-[#c1955b] text-white') : 'bg-slate-100 text-slate-500'}`}>
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            {!isSelected && (
                              <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors ml-2 shrink-0">
                                點擊選擇 ➔
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {selectedTeacher !== 'all' && (
              <div className="animate-fade-in mt-10">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-bold text-slate-800">
                    預約 {selectedTeacher} 的課程
                  </h3>
                </div>
                {renderSharedCalendar('customer')}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">自 {selectedDate} 起 7 天內開放時段</h3>
                      {(() => {
                         const next7Days = [];
                         const startD = new Date(selectedDate);
                         for(let i=0; i<7; i++){
                            const d = new Date(startD);
                            d.setDate(startD.getDate() + i);
                            next7Days.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
                         }
                         
                         const hasAny = next7Days.some(dateStr => availabilities.some(a => a.teacherName === selectedTeacher && a.date === dateStr));

                         if (!hasAny) return <div className="text-slate-400 text-sm text-center py-8 bg-slate-50 rounded-xl border border-dashed">近七天教練暫未開放預約時間 🥺</div>;

                         return (
                           <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-hide">
                             {next7Days.map(dateStr => {
                                const dayAvails = availabilities.filter(a => a.teacherName === selectedTeacher && a.date === dateStr).sort((a,b) => timeToMins(a.startTime) - timeToMins(b.startTime));
                                if (dayAvails.length === 0) return null;
                                return (
                                   <div key={dateStr} className="space-y-2">
                                      <div className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md inline-block">📅 {dateStr}</div>
                                      <div className="space-y-2">
                                         {dayAvails.map(a => (
                                            <button 
                                              key={a.id} 
                                              type="button" 
                                              onClick={() => { setSelectedDate(dateStr); setBookingStartTime(a.startTime); }} 
                                              className="w-full text-left bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 p-3 rounded-xl font-bold border border-slate-100 hover:border-indigo-200 transition-colors flex items-center justify-between gap-3 group shadow-sm"
                                            >
                                               <span className="flex items-center gap-2"><ClockIcon className="text-slate-400 group-hover:text-indigo-400 transition-colors" size={16} /> {a.startTime} ~ {a.endTime}</span>
                                               <span className="text-[10px] text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-100 px-2 py-0.5 rounded">帶入時間 ➔</span>
                                            </button>
                                         ))}
                                      </div>
                                   </div>
                                );
                             })}
                           </div>
                         );
                      })()}
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">填寫您的預約資訊</h3>
                      <form onSubmit={handleBookAppointment} className="space-y-5">
                        <input type="hidden" name="targetTeacher" value={selectedTeacher} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-600 flex items-center gap-1">您的姓名 <span className="text-[10px] text-rose-500">(必填)</span></label>
                            <input type="text" name="customerName" placeholder="請輸入真實姓名" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 outline-none bg-slate-50 focus:bg-white" required />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-600 flex items-center gap-1">聯絡電話 <span className="text-[10px] text-rose-500">(必填)</span></label>
                            <input type="tel" name="phone" placeholder="例如：0912345678" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 outline-none bg-slate-50 focus:bg-white" required />
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                          <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">✨ 讓我們更了解您 <span className="text-[10px] text-slate-400 font-normal">(選填)</span></h4>
                          <div>
                            <label className="text-xs font-bold text-slate-600 mb-1 block">介紹人 (若有)</label>
                            <input type="text" name="referral" placeholder="請輸入介紹人姓名" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm bg-white" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-600 mb-1 block">目前最困擾的問題</label>
                            <textarea name="concern" placeholder="想改善駝背、長期腰痛、想減脂..." className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm resize-none bg-white" rows="2" />
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer w-fit">
                                <input type="checkbox" name="hasMedical" checked={hasMedicalCondition} onChange={e => setHasMedicalCondition(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
                                近期是否有懷孕、開刀、或受傷情況？
                            </label>
                            {hasMedicalCondition && (
                                <input type="text" name="medicalDetails" placeholder="請簡述您的狀況，讓我們為您安排最安全的課程..." className="w-full px-3 py-2 rounded-lg border border-amber-200 outline-none text-sm bg-amber-50" />
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 flex items-center gap-1"><ClockIcon size={16} className="text-indigo-500" /> 想預約的開始時間 <span className="text-[10px] text-rose-500">(必選)</span></label>
                            <input type="hidden" name="startTime" value={bookingStartTime} />
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 -mx-1 scrollbar-hide">
                              {availableTimeSlots.map(time => {
                                const isAvailable = checkTimeSlotAvailable(time, bookingDuration, selectedDate, selectedTeacher);
                                return (
                                  <button
                                    key={time} type="button" disabled={!isAvailable} onClick={() => setBookingStartTime(time)}
                                    className={`py-2 rounded-lg text-sm font-bold transition-all border ${!isAvailable ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-60' : bookingStartTime === time ? 'bg-[#1E293B] text-white border-[#1E293B] shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                                  >
                                    {time}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          
                          <div className="space-y-2 pt-2">
                            <label className="text-sm font-bold text-slate-600 flex items-center gap-1">選擇課程長度 <span className="text-[10px] text-rose-500">(必選)</span></label>
                            <input type="hidden" name="duration" value={bookingDuration} />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <button type="button" onClick={() => setBookingDuration(60)} className={`p-4 rounded-xl border-2 text-left transition-all duration-300 flex flex-col justify-center ${bookingDuration === 60 ? 'border-slate-800 bg-slate-50 shadow-sm scale-[1.02]' : 'border-slate-100 bg-white hover:bg-slate-50'}`}>
                                <div className={`flex items-center gap-2 font-bold text-lg ${bookingDuration === 60 ? 'text-slate-800' : 'text-slate-600'}`}>60 分鐘</div>
                                <div className={`text-xs mt-1 font-medium ${bookingDuration === 60 ? 'text-slate-600' : 'text-slate-400'}`}>局部處理</div>
                              </button>
                              <button type="button" onClick={() => setBookingDuration(90)} className={`p-4 rounded-xl border-2 text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-center ${bookingDuration === 90 ? 'border-[#c1955b] bg-amber-50 shadow-md scale-[1.05] z-10' : 'border-slate-100 bg-white hover:bg-slate-50'}`}>
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-[#c1955b] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm">標準推薦</div>
                                <div className={`flex items-center gap-2 font-bold text-lg mt-1 ${bookingDuration === 90 ? 'text-[#9b7342]' : 'text-slate-600'}`}>90 分鐘</div>
                                <div className={`text-xs mt-1 font-medium ${bookingDuration === 90 ? 'text-[#b08853]' : 'text-slate-400'}`}>完整課程體驗</div>
                              </button>
                              <button type="button" onClick={() => setBookingDuration(120)} className={`p-4 rounded-xl border-2 text-left transition-all duration-300 flex flex-col justify-center ${bookingDuration === 120 ? 'border-slate-800 bg-slate-50 shadow-sm scale-[1.02]' : 'border-slate-100 bg-white hover:bg-slate-50'}`}>
                                <div className={`flex items-center gap-2 font-bold text-lg ${bookingDuration === 120 ? 'text-slate-800' : 'text-slate-600'}`}>120 分鐘</div>
                                <div className={`text-xs mt-1 font-medium ${bookingDuration === 120 ? 'text-slate-600' : 'text-slate-400'}`}>全身深度調整</div>
                              </button>
                            </div>
                          </div>

                          <button type="submit" className="w-full bg-[#1E293B] hover:bg-black text-white py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98] mt-4 text-lg">
                            ✨ 確認預約
                          </button>
                      </form>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= PROGRESS VIEW (我的進步軌跡) ================= */}
        {view === 'progress' && (
          <div className="animate-fade-in py-6">
            {!myProgress ? (
              <div className="flex flex-col items-center justify-center py-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-slate-100 text-[#1E293B] rounded-full flex items-center justify-center mb-6 shadow-sm"><ActivityIcon size={36} /></div>
                <h2 className="text-2xl font-extrabold text-[#1E293B] mb-3 tracking-tight">我的進步軌跡</h2>
                <p className="text-sm text-slate-500 mb-8 text-center leading-relaxed">輸入您的聯絡電話，查看教練為您記錄的專屬生理數據與課後叮嚀，見證每一次的成長。</p>
                <form onSubmit={handleSearchProgress} className="w-full space-y-4">
                  <input type="tel" placeholder="請輸入聯絡電話 (如: 0987654321)" value={progressPhone} onChange={e => setProgressPhone(e.target.value)} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 outline-none text-center font-bold tracking-widest text-lg bg-white" required />
                  <button type="submit" className="w-full bg-[#1E293B] hover:bg-black text-white py-4 rounded-2xl font-bold shadow-md text-lg flex items-center justify-center gap-2">
                    <SearchIcon size={20} /> 查詢我的紀錄
                  </button>
                </form>
                <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl w-full text-center">
                  <p className="text-xs text-slate-500 font-medium">💡 測試用資料：輸入 <span className="font-black bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">0987654321</span> 即可體驗。</p>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto space-y-8 bg-[#FAF9F6] pb-10">
                
                {/* 1. 頂端歡迎區塊 */}
                {myProgress.length > 0 && (
                  <div className="text-center pt-4">
                    <h2 className="text-2xl font-black text-[#1E293B] mb-2 leading-tight">
                      Hi {myProgress[0].studentName}！
                    </h2>
                    <p className="text-slate-600 text-sm font-bold mb-4 bg-slate-100 inline-block px-4 py-1.5 rounded-full border border-slate-200 mt-2">
                      這是您在築動努力的第 <span className="text-[#c1955b] text-lg font-black">{myProgress.length}</span> 堂課 🎉
                    </p>
                  </div>
                )}

                {myProgress.length === 0 && (
                  <div className="text-center py-16 text-slate-500 font-medium bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm mx-4">
                    目前教練還沒有為您建立檢測數據喔！🥺<br/>下次上課時可以提醒教練幫您記錄。
                  </div>
                )}

                {myProgress.length > 0 && (
                  <div className="space-y-8">

                    {/* NEW: 專屬進步亮點卡片 (Before vs After) */}
                    {renderAchievementCard(myProgress)}
                    
                    {/* 2. 核心視覺：五大要素雷達圖 (Radar Chart) */}
                    {(() => {
                        const latest = myProgress[0].metrics;
                        const first = myProgress[myProgress.length - 1].metrics;
                        
                        // 轉換數值為 0-100 (純視覺展示用)
                        const getScores = (m) => {
                          const plank = Math.min((m.plank || 0) / 120 * 100, 100);
                          const shoulder = Math.min((((m.shoulderLeft||0) + (m.shoulderRight||0))/2) / 180 * 100, 100);
                          const ktw = Math.min((((m.ktwLeft||0) + (m.ktwRight||0))/2) / 15 * 100, 100);
                          const grip = Math.min((((m.gripLeft||0) + (m.gripRight||0))/2) / 60 * 100, 100);
                          // 疲勞管理: sRPE 越低越好，或心跳越低越好
                          const hr = Math.max(0, 100 - ((m.restingHR || 70) - 50) / 40 * 100);
                          return [plank, shoulder, ktw, grip, hr];
                        };
                        const firstScores = getScores(first);
                        const latestScores = getScores(latest);
                        
                        // 雷達圖 SVG 幾何計算
                        const getPoint = (value, angle) => {
                           const r = (value / 100) * 40;
                           const rad = angle * (Math.PI / 180);
                           return `${50 + r * Math.cos(rad)},${50 + r * Math.sin(rad)}`;
                        };
                        const angles = [-90, -18, 54, 126, 198]; // 5點分佈
                        const labels = ['核心防護力', '上肢靈活度', '下肢穩定度', '神經發力', '心肺復甦'];
                        const labelOffsets = [
                           {x: 50, y: 5}, {x: 95, y: 40}, {x: 85, y: 95}, {x: 15, y: 95}, {x: 5, y: 40}
                        ];

                        return (
                          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mx-4">
                             <div className="flex items-center justify-between mb-4">
                               <h3 className="font-bold text-slate-800 flex items-center gap-2"><TargetIcon className="text-indigo-600" size={20}/> 整體能力雷達圖</h3>
                               <div className="flex gap-3 text-[10px] font-bold">
                                 <div className="flex items-center gap-1"><span className="w-3 h-0.5 bg-slate-300 block"></span>初評</div>
                                 <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#1E293B] block rounded-sm opacity-80"></span>最新</div>
                               </div>
                             </div>
                             <div className="relative w-full aspect-square max-w-[260px] mx-auto mb-2">
                                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                                   {/* 背景蜘蛛網 */}
                                   {[20, 40, 60, 80, 100].map(level => (
                                      <polygon key={level} points={angles.map(a => getPoint(level, a)).join(' ')} fill="none" stroke="#f1f5f9" strokeWidth="0.5" />
                                   ))}
                                   {/* 軸線 */}
                                   {angles.map((a, i) => (
                                      <line key={`axis-${i}`} x1="50" y1="50" x2={getPoint(100, a).split(',')[0]} y2={getPoint(100, a).split(',')[1]} stroke="#e2e8f0" strokeWidth="0.5" />
                                   ))}
                                   {/* 首次數據 (灰色虛線) */}
                                   <polygon points={angles.map((a, i) => getPoint(firstScores[i], a)).join(' ')} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
                                   {/* 最新數據 (深藍實心) */}
                                   <polygon points={angles.map((a, i) => getPoint(latestScores[i], a)).join(' ')} fill="#1E293B" fillOpacity="0.2" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
                                   {angles.map((a, i) => (
                                      <circle key={`dot-${i}`} cx={getPoint(latestScores[i], a).split(',')[0]} cy={getPoint(latestScores[i], a).split(',')[1]} r="2" fill="#1E293B" />
                                   ))}
                                   {/* 標籤 */}
                                   {labels.map((lbl, i) => (
                                      <text key={lbl} x={labelOffsets[i].x} y={labelOffsets[i].y} fontSize="4" fontWeight="bold" fill="#64748b" textAnchor="middle">{lbl}</text>
                                   ))}
                                </svg>
                             </div>
                             <div className="text-center mt-4 text-xs font-bold text-[#c1955b]">
                                💡 面積越來越大，代表身體整體能力越好喔！
                             </div>
                          </div>
                        );
                    })()}

                    {/* 3. 分類趨勢：內在表現 (Internal) */}
                    <div>
                      <h3 className="text-lg font-black text-slate-800 mb-3 px-6 flex items-center gap-2">
                         <ActivityIcon className="text-rose-500" size={20} /> 內在表現 (心跳、恢復與身體組成)
                      </h3>
                      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 scrollbar-hide px-6">
                        
                        {/* 卡片 1: 心跳與疲勞 */}
                        <div className="snap-center shrink-0 w-[85vw] max-w-[320px]">
                           {renderSparkline(
                             [...myProgress].reverse(), d => d.metrics.restingHR, 
                             { text: 'text-rose-600', stroke: 'text-rose-500' }, 
                             '❤️ 安靜心跳 (體能與疲勞)', 'bpm', true, true, 
                             myProgress[0].metrics.restingHR <= 70 ? '🎯 心肺功能極佳 (達運動員水準)！持續保持！' : '落於一般健康區間 (60-100)，代表身體無過度疲勞。'
                           )}
                        </div>

                        {/* 卡片 2: 體重變化 */}
                        <div className="snap-center shrink-0 w-[85vw] max-w-[320px]">
                           {renderSparkline(
                             [...myProgress].reverse(), d => d.metrics.weight, 
                             { text: 'text-cyan-600', stroke: 'text-cyan-500' }, 
                             '⚖️ 體重變化', 'kg', false, false, 
                             '體重變化會受飲食與水分影響，建議搭配體態與肌肉量綜合評估長期趨勢！'
                           )}
                        </div>

                      </div>
                    </div>

                    {/* 4. 分類趨勢：外在能力 (External) */}
                    <div>
                      <h3 className="text-lg font-black text-slate-800 mb-3 px-6 flex items-center gap-2">
                         <FlameIcon className="text-orange-500" size={20} /> 外在能力 (肌力、耐力與活動度)
                      </h3>
                      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 scrollbar-hide px-6">
                        
                        {/* 卡片 1: 棒式 (核心耐力) */}
                        <div className="snap-center shrink-0 w-[85vw] max-w-[320px]">
                           {renderSparkline(
                             [...myProgress].reverse(), d => d.metrics.plank, 
                             { text: 'text-emerald-600', stroke: 'text-emerald-500' }, 
                             '🛡️ 軀幹核心耐力 (棒式)', '秒', false, false, 
                             myProgress[0].metrics.plank >= 60 ? '🎯 已達標一般健康標準 (60秒)！核心非常穩定。' : '💪 尚低於基礎標準 (60秒)，我們繼續加強核心控制！'
                           )}
                        </div>

                        {/* 卡片 2: 握力 (神經與肌力) */}
                        <div className="snap-center shrink-0 w-[85vw] max-w-[320px]">
                           {renderSparkline(
                             [...myProgress].reverse(), d => (d.metrics.gripLeft && d.metrics.gripRight) ? ((d.metrics.gripLeft + d.metrics.gripRight)/2) : null, 
                             { text: 'text-indigo-600', stroke: 'text-indigo-500' }, 
                             '💪 平均握力 (中樞神經)', 'kg', false, false, 
                             myProgress[0].metrics.gender === 'female' 
                                ? ( (myProgress[0].metrics.gripLeft + myProgress[0].metrics.gripRight)/2 >= 25 ? '🎉 已超過同齡女性平均標準 (25kg)！' : '持續訓練朝同齡女性平均 (25kg) 邁進！' )
                                : ( (myProgress[0].metrics.gripLeft + myProgress[0].metrics.gripRight)/2 >= 43 ? '🎉 已超過同齡男性平均標準 (43kg)！' : '持續訓練朝同齡男性平均 (43kg) 邁進！' )
                           )}
                        </div>

                        {/* 卡片 3: 活動度長條圖 */}
                        <div className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-full relative">
                           <div className="flex justify-between items-start mb-4">
                             <h4 className="text-sm font-bold text-slate-600">🦵 腳踝活動度 (KTW)</h4>
                             {myProgress.length >= 2 && myProgress[0].metrics.ktwRight > myProgress[1].metrics.ktwRight && (
                               <div className="bg-amber-50 text-[#c1955b] text-[10px] font-black px-2 py-1 rounded">
                                 右腳進步 {(myProgress[0].metrics.ktwRight - myProgress[1].metrics.ktwRight).toFixed(1)} cm!
                               </div>
                             )}
                           </div>
                           <div className="flex justify-center gap-10 items-end flex-1 pb-4">
                              <div className="flex flex-col items-center gap-2 relative">
                                 <span className="text-lg font-black text-slate-700">{myProgress[0].metrics.ktwLeft || 0}</span>
                                 <div className="w-12 bg-[#e5d5c1] rounded-t-xl transition-all" style={{ height: `${(myProgress[0].metrics.ktwLeft || 0) * 8}px`, maxHeight: '100px' }}></div>
                                 <span className="text-xs font-bold text-slate-500">左腳</span>
                              </div>
                              <div className="flex flex-col items-center gap-2 relative">
                                 <span className="text-lg font-black text-slate-700">{myProgress[0].metrics.ktwRight || 0}</span>
                                 <div className="w-12 bg-[#c1955b] rounded-t-xl transition-all" style={{ height: `${(myProgress[0].metrics.ktwRight || 0) * 8}px`, maxHeight: '100px' }}></div>
                                 <span className="text-xs font-bold text-slate-500">右腳</span>
                              </div>
                           </div>
                           <div className="text-[11px] text-slate-500 font-medium text-center bg-slate-50 p-2 rounded-lg mt-2">
                             🎯 標準活動度為 10cm 以上。提升活動度能減少深蹲膝蓋壓力！
                           </div>
                        </div>

                      </div>
                    </div>

                    {/* 5. 歷次紀錄與專屬處方籤 (取代原本的 最新一筆) */}
                    <div className="px-4 mb-8">
                      <h3 className="text-lg font-bold text-slate-800 mb-3 px-2">📝 歷次上課紀錄與叮嚀</h3>
                      
                      {/* 橫向滑動的日期選擇器 */}
                      <div className="flex overflow-x-auto gap-3 pb-4 snap-x scrollbar-hide px-2">
                        {myProgress.map((prog, idx) => {
                          const isSelected = selectedProgressIndex === idx;
                          return (
                            <button
                              key={prog.id}
                              onClick={() => setSelectedProgressIndex(idx)}
                              className={`snap-start shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${isSelected ? 'bg-[#1E293B] text-white border-[#1E293B] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                            >
                              {prog.date}
                            </button>
                          );
                        })}
                      </div>

                      {/* 顯示選中日期的教練悄悄話與摘要 */}
                      {myProgress[selectedProgressIndex] && (
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative mt-2 animate-fade-in mx-2">
                           <div className="flex items-start gap-4">
                              <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 shrink-0 border-2 border-white shadow-sm mt-1">
                                 {teacherProfiles[myProgress[selectedProgressIndex].teacherName]?.photo ? (
                                   <img src={teacherProfiles[myProgress[selectedProgressIndex].teacherName].photo} alt={myProgress[selectedProgressIndex].teacherName} className="w-full h-full object-cover" />
                                 ) : (
                                   <UserIcon className="w-full h-full p-2 text-slate-400" />
                                 )}
                              </div>
                              <div className="flex-1 bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 relative">
                                 <div className="absolute -left-2 top-0 text-slate-50">
                                   <svg width="12" height="12" viewBox="0 0 12 12"><path d="M12 0L0 0L12 12V0Z" fill="currentColor"/></svg>
                                 </div>
                                 <div className="text-xs font-black text-indigo-700 mb-1 flex items-center gap-1">
                                   <MessageSquareIcon size={14}/> 專屬處方籤
                                 </div>
                                 {myProgress[selectedProgressIndex].coachNotes ? (
                                    <p className="text-sm text-slate-700 leading-relaxed font-bold whitespace-pre-wrap">
                                      {myProgress[selectedProgressIndex].coachNotes}
                                    </p>
                                 ) : (
                                    <p className="text-sm text-slate-400 font-medium italic">本次課程教練尚未填寫悄悄話</p>
                                 )}
                                 
                                 <div className="text-right text-[11px] text-slate-400 font-bold mt-3 border-t border-slate-200 pt-3">
                                   來自教練 {myProgress[selectedProgressIndex].teacherName}
                                 </div>
                              </div>
                           </div>
                        </div>
                      )}
                    </div>
                    
                    {/* 5. 趁勝追擊 CTA */}
                    <div className="px-4">
                       <button 
                         onClick={() => setView('customer')} 
                         className="w-full bg-[#1E293B] hover:bg-black text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2 animate-bounce-subtle"
                       >
                         🔥 趁勝追擊，預約下一次進步！
                       </button>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= ADMIN VIEW ================= */}
        {view === 'admin' && !isAdminAuthenticated && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-slate-800 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ShieldIcon size={28} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">JD 管理中心</h2>
              <p className="text-sm text-slate-500 mb-6">請輸入專屬密碼以進入後台</p>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input type="password" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} placeholder="輸入密碼" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-center font-bold tracking-widest text-lg bg-slate-50 focus:bg-white transition-colors" required autoFocus />
                <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98]">驗證並進入後台</button>
              </form>
            </div>
          </div>
        )}

        {view === 'admin' && isAdminAuthenticated && (
          <div className="space-y-6 animate-fade-in">
            <div className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                  <img src={logoAdmin} alt="JD Rebuild" className="h-10 md:h-12 object-contain mix-blend-multiply" />老闆管理中心
                </h2>
                <p className="text-slate-500 mt-2">JD，歡迎回來！請選擇要管理的業務板塊。</p>
              </div>
              <button onClick={() => setIsAdminAuthenticated(false)} className="text-sm font-bold text-slate-500 hover:text-slate-800 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-2 self-start md:self-auto">
                <LogOutIcon size={16} /> 鎖定後台並登出
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto border-b-2 border-slate-100 pb-px scrollbar-hide">
              <button onClick={() => setAdminTab('courses')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-2 ${adminTab === 'courses' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'}`}>🗓️ 約課與教練管理</button>
              <button onClick={() => setAdminTab('cooperations')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-2 ${adminTab === 'cooperations' ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'}`}>🤝 接洽管理</button>
              <button onClick={() => setAdminTab('products')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-2 ${adminTab === 'products' ? 'border-orange-500 text-orange-600 bg-orange-50/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'}`}>🛒 產品管理</button>
              <button onClick={() => setAdminTab('brand')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-2 ${adminTab === 'brand' ? 'border-pink-500 text-pink-600 bg-pink-50/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'}`}>📖 品牌與活動</button>
              <button onClick={() => setAdminTab('system')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-2 ${adminTab === 'system' ? 'border-slate-800 text-slate-800 bg-slate-100/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'}`}>⚙️ 系統資料</button>
            </div>

            {adminTab === 'courses' && (
              <div className="space-y-6 animate-fade-in pt-2">
                <div className="flex flex-wrap gap-3 mb-4">
                  <button onClick={() => setAdminSelectedTeacher('all')} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${adminSelectedTeacher === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>整間教室 (全部教練)</button>
                  {uniqueTeachersAll.map(teacher => (
                    <button key={teacher} onClick={() => setAdminSelectedTeacher(teacher)} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${adminSelectedTeacher === teacher ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>{teacher} 個人排課</button>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><h3 className="text-slate-500 text-sm font-medium">總預約堂數</h3><p className="text-3xl font-bold text-slate-800 mt-2">{adminFilteredApts.length}</p></div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><h3 className="text-slate-500 text-sm font-medium">已報到人次</h3><p className="text-3xl font-bold text-indigo-600 mt-2">{adminFilteredApts.filter(ap => ap.attended).length}</p></div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><h3 className="text-slate-500 text-sm font-medium">未報到人次</h3><p className="text-3xl font-bold text-amber-500 mt-2">{adminFilteredApts.filter(ap => !ap.attended).length}</p></div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><h3 className="text-slate-500 text-sm font-medium">整體出席率</h3><p className="text-3xl font-bold text-emerald-500 mt-2">{adminFilteredApts.length > 0 ? Math.round((adminFilteredApts.filter(ap => ap.attended).length / adminFilteredApts.length) * 100) : 0}%</p></div>
                </div>

                <div className="mt-8">
                   <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><ViewCalendarIcon /> {adminSelectedTeacher === 'all' ? '整間教室' : `${adminSelectedTeacher} 個別`}排課與報表總覽</h3>
                   {renderSharedCalendar('admin')}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-sm font-medium text-slate-500">日期與時間</th><th className="p-4 text-sm font-medium text-slate-500">教練名稱</th><th className="p-4 text-sm font-medium text-slate-500">學員姓名</th><th className="p-4 text-sm font-medium text-slate-500">報到狀態</th><th className="p-4 text-sm font-medium text-slate-500">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {adminFilteredApts.filter(ap => adminSelectedDate ? ap.date === adminSelectedDate : true).map(ap => (
                        <tr key={ap.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 text-sm text-slate-800 font-bold">{ap.date} {ap.startTime}-{ap.endTime} ({ap.duration}m)</td>
                          <td className="p-4 text-sm text-slate-800 font-medium">{ap.teacherName}</td>
                          <td className="p-4 text-sm font-bold text-slate-700">{ap.studentName}<div className="text-xs font-normal text-slate-400 mt-1 flex items-center gap-1">📞 {ap.phone || '未提供'}</div></td>
                          <td className="p-4 text-sm text-slate-600"><span className={`px-3 py-1 rounded-md text-xs font-bold border ${ap.attended ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>{ap.attended ? '已報到 ✓' : '未報到'}</span></td>
                          <td className="p-4 text-sm text-slate-600 flex gap-2">
                            <button onClick={() => setEditModal({ isOpen: true, type: 'appointment', data: ap })} className="bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 px-2 py-1.5 rounded text-xs font-bold transition-colors">修改</button>
                            <button onClick={() => handleCancelAppointment(ap.id)} className="bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 px-2 py-1.5 rounded text-xs font-bold transition-colors">取消</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><StarIcon /> 教練檔案總管 (Tag 架構設定)</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`lg:col-span-1 p-5 rounded-xl border transition-colors ${editingProfileName ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-700">{editingProfileName ? `✏️ 編輯 ${editingProfileName}` : '✨ 新增教練'}</h4>
                        {editingProfileName && <button onClick={cancelProfileEdit} className="text-xs font-bold text-slate-500 hover:text-red-500 bg-white px-2 py-1 rounded shadow-sm">取消編輯</button>}
                      </div>
                      <form key={editingProfileName || 'new'} onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">教練名稱 (識別欄位)</label>
                          <input type="text" name="profileName" defaultValue={editingProfileName} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-medium" required />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">聘僱屬性</label>
                            <select name="type" defaultValue={teacherProfiles[editingProfileName]?.type || 'contractor'} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none font-medium"><option value="contractor">承攬人員</option><option value="fulltime">正職人員</option></select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">入職日期</label>
                            <input type="date" name="hireDate" defaultValue={teacherProfiles[editingProfileName]?.hireDate || new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none font-medium" required />
                          </div>
                        </div>

                        {/* Tag 設定區 (取代原本的 Specialty 文字框) */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-4 h-64 overflow-y-auto shadow-inner">
                           <h5 className="text-xs font-black text-indigo-700 sticky top-0 bg-white pb-2 border-b border-slate-100 z-10">勾選專長標籤 (對應客人篩選)</h5>
                           {Object.entries(tagCategories).map(([catKey, cat]) => (
                              <div key={catKey} className="space-y-2">
                                <div className="flex items-center justify-between bg-slate-100 px-2 py-1 rounded">
                                   <label className="text-xs font-bold text-slate-600 block">{cat.label}</label>
                                   <div className="flex items-center gap-1">
                                      <input type="text" value={newTagInputs[catKey] || ''} onChange={e => setNewTagInputs(prev => ({...prev, [catKey]: e.target.value}))} placeholder="自訂新標籤..." className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 outline-none w-20 bg-white focus:ring-1 focus:ring-indigo-400" />
                                      <button type="button" onClick={() => handleAddNewTag(catKey)} className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-bold hover:bg-indigo-300 transition-colors">新增</button>
                                   </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-1">
                                  {cat.options.map(opt => {
                                     const isChecked = teacherProfiles[editingProfileName]?.tags?.[catKey]?.includes(opt) || false;
                                     const isEditing = editingGlobalTag.catKey === catKey && editingGlobalTag.oldTag === opt;
                                     return (
                                       <div key={opt} className="flex items-center gap-1.5 w-full group py-0.5">
                                          {isEditing ? (
                                              <div className="flex flex-1 items-center gap-1">
                                                  <input 
                                                      type="text" 
                                                      value={editingGlobalTag.value} 
                                                      onChange={e => setEditingGlobalTag(prev => ({ ...prev, value: e.target.value }))}
                                                      className="flex-1 text-xs px-2 py-0.5 border border-indigo-400 rounded outline-none"
                                                      autoFocus
                                                  />
                                                  <button type="button" onClick={handleSaveEditTag} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">儲存</button>
                                                  <button type="button" onClick={() => setEditingGlobalTag({catKey: null, oldTag: null, value: ''})} className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">取消</button>
                                              </div>
                                          ) : (
                                              <>
                                                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer flex-1">
                                                     <input type="checkbox" name={`tags.${catKey}`} value={opt} defaultChecked={isChecked} className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                                     {opt}
                                                  </label>
                                                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                                     <button type="button" onClick={() => setEditingGlobalTag({catKey, oldTag: opt, value: opt})} className="text-slate-400 hover:text-indigo-600 p-0.5 bg-slate-100 rounded" title="修改"><EditIcon size={12}/></button>
                                                     <button type="button" onClick={() => handleDeleteGlobalTag(catKey, opt)} className="text-slate-400 hover:text-rose-500 p-0.5 bg-slate-100 rounded" title="刪除"><Trash2Icon size={12}/></button>
                                                  </div>
                                              </>
                                          )}
                                       </div>
                                     );
                                  })}
                                </div>
                              </div>
                           ))}
                           <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded block">其他特色訓練 (自填)</label>
                             <input type="text" name="customTraining" placeholder="例如：孕婦訓練" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                           </div>
                        </div>

                        <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                          <label className="text-xs font-bold text-indigo-600 flex items-center gap-1 mb-2"><ImageIcon size={14}/> 教練照片</label>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                               {uploadedPhoto || teacherProfiles[editingProfileName]?.photo ? <img src={uploadedPhoto || teacherProfiles[editingProfileName]?.photo} alt="預覽" className="w-full h-full object-cover" /> : <UserIcon className="text-slate-400" />}
                            </div>
                            <label className="flex-1 text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors border border-indigo-100">
                              上傳照片<input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                            </label>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">給客戶的話 (預約首頁引言)</label>
                          <input type="text" name="quote" defaultValue={teacherProfiles[editingProfileName]?.quote || ''} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">詳細介紹</label>
                          <textarea name="description" defaultValue={teacherProfiles[editingProfileName]?.description || ''} rows="2" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none resize-none text-sm font-medium" required></textarea>
                        </div>
                        <button type="submit" className={`w-full text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm mt-2 ${editingProfileName ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800 hover:bg-slate-900'}`}>{editingProfileName ? '💾 儲存修改' : '✨ 新增教練'}</button>
                      </form>
                    </div>

                    <div className="lg:col-span-2">
                      <h4 className="font-bold text-slate-700 mb-4">已建檔教練 ({uniqueTeachersAll.length})</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {uniqueTeachersAll.map(name => {
                          const profile = teacherProfiles[name];
                          return (
                            <div key={name} className={`p-4 rounded-xl border bg-white shadow-sm flex flex-col gap-3 transition-all relative ${editingProfileName === name ? 'border-indigo-400 ring-2 ring-indigo-50' : 'border-slate-100'}`}>
                              <div className="absolute top-4 right-4 flex gap-2">
                                 <button onClick={() => loadProfileForEdit(name)} className="bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 p-1 rounded-md transition-colors"><EditIcon size={14} /></button>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                   {profile.photo ? <img src={profile.photo} alt={name} className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-2 text-slate-400" />}
                                </div>
                                <div className="flex flex-col pr-6">
                                  <span className="font-bold text-slate-800 break-all">{name}</span>
                                  <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold w-fit mt-1">{getPrimarySpecialty(profile)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Admin Tabs Omitted for Brevity in Diff - Will just render the existing content perfectly */}
            {adminTab === 'cooperations' && (
              <div className="space-y-6 animate-fade-in pt-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><MegaphoneIcon /> 企業接洽管理</h3>
                  {contactRequests.map(req => (
                     <div key={req.id} className="p-4 border rounded-xl mb-4 bg-slate-50">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold">{req.companyName} ({req.contactName})</h4>
                           <button onClick={() => handleDeleteContact(req.id)} className="text-red-500"><Trash2Icon size={14}/></button>
                        </div>
                        <p className="text-sm">電話: {req.phone} | 信箱: {req.email}</p>
                        <p className="text-sm mt-2">{req.details}</p>
                     </div>
                  ))}
                </div>
              </div>
            )}
            
            {adminTab === 'products' && (
              <div className="space-y-6 animate-fade-in pt-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><PackageIcon /> 產品與周邊管理</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className={`lg:col-span-1 p-5 rounded-2xl border transition-colors ${editingProductId ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-700">{editingProductId ? '✏️ 編輯產品' : '✨ 新增產品'}</h4>
                        {editingProductId && <button onClick={cancelProductEdit} className="text-xs font-bold text-slate-500 hover:text-red-500 bg-white px-2 py-1 rounded shadow-sm">取消編輯</button>}
                      </div>
                      <form key={editingProductId || 'new'} onSubmit={handleUpdateProduct} className="space-y-4">
                        <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-4">
                          <label className="text-xs font-bold text-orange-600 flex items-center gap-1 mb-2"><ImageIcon size={14}/> 產品圖片</label>
                          <div className="flex flex-col gap-3">
                            <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                               {productUploadedPhoto || (editingProductId && products.find(p=>p.id===editingProductId)?.photo) ? <img src={productUploadedPhoto || products.find(p=>p.id===editingProductId)?.photo} alt="預覽" className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-400 w-8 h-8" />}
                            </div>
                            <label className="text-center bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors border border-orange-100">
                              上傳新圖片<input type="file" accept="image/*" onChange={handleProductPhotoUpload} className="hidden" />
                            </label>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">產品名稱</label>
                          <input type="text" name="name" defaultValue={editingProductId ? products.find(p=>p.id===editingProductId).name : ''} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-medium" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">售價 (NT$)</label>
                          <input type="number" name="price" defaultValue={editingProductId ? products.find(p=>p.id===editingProductId).price : ''} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-medium" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">產品介紹</label>
                          <textarea name="description" defaultValue={editingProductId ? products.find(p=>p.id===editingProductId).description : ''} rows="3" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none resize-none text-sm font-medium" required></textarea>
                        </div>
                        <button type="submit" className={`w-full text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm mt-2 ${editingProductId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-800 hover:bg-slate-900'}`}>{editingProductId ? '💾 儲存修改' : '✨ 上架產品'}</button>
                      </form>
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                      {products.map(p => (
                        <div key={p.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm items-start sm:items-center">
                          <img src={p.photo} alt={p.name} className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-xl border border-slate-100 shrink-0" />
                          <div className="flex-1 w-full">
                            <h4 className="font-bold text-slate-800">{p.name}</h4>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                            <span className="text-orange-600 font-black text-sm mt-2 block">NT$ {p.price}</span>
                          </div>
                          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                             <button onClick={() => handleEditProduct(p)} className="bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-600 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-colors flex-1 sm:flex-none">編輯</button>
                             <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-50 hover:bg-red-100 text-red-500 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-colors flex-1 sm:flex-none">刪除</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'brand' && (
              <div className="space-y-6 animate-fade-in pt-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><MegaphoneIcon /> 品牌首頁內容管理</h3>
                  <form onSubmit={handleSaveAboutContent} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <label className="text-xs font-medium text-slate-500">主標題</label>
                           <input type="text" name="heroTitle" defaultValue={aboutContent.heroTitle} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none font-bold text-slate-800" required />
                        </div>
                        <div className="space-y-1">
                           <label className="text-xs font-medium text-slate-500">副標題</label>
                           <input type="text" name="heroSubtitle" defaultValue={aboutContent.heroSubtitle} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm text-slate-600" required />
                        </div>
                        <div className="space-y-1">
                           <label className="text-xs font-medium text-slate-500">品牌介紹內文</label>
                           <textarea name="heroDescription" defaultValue={aboutContent.heroDescription} rows="5" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none resize-none text-sm text-slate-600 leading-relaxed" required></textarea>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-xs font-medium text-slate-500 block">品牌主視覺 (Hero Image)</label>
                        <div className="w-full h-48 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                           {aboutUploadedPhoto || aboutContent.heroImage ? (
                             <img src={aboutUploadedPhoto || aboutContent.heroImage} alt="Brand Hero" className="w-full h-full object-contain mix-blend-multiply" />
                           ) : (
                             <ImageIcon className="text-slate-300 w-12 h-12 mb-2" />
                           )}
                           <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <label className="bg-white text-slate-800 px-4 py-2 rounded-lg font-bold text-sm cursor-pointer shadow-lg hover:scale-105 transition-transform">
                               更換圖片 <input type="file" accept="image/*" onChange={handleAboutPhotoUpload} className="hidden" />
                             </label>
                           </div>
                        </div>
                        <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-md transition-transform active:scale-[0.98]">💾 儲存品牌設定</button>
                     </div>
                  </form>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><SparklesIcon /> 近期活動紀錄</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className={`lg:col-span-1 p-5 rounded-2xl border transition-colors ${editingEventId ? 'bg-pink-50 border-pink-200' : 'bg-slate-50 border-slate-100'}`}>
                       <div className="flex justify-between items-center mb-4">
                         <h4 className="font-bold text-slate-700">{editingEventId ? '✏️ 編輯活動' : '✨ 新增活動'}</h4>
                         {editingEventId && <button onClick={cancelEventEdit} className="text-xs font-bold text-slate-500 hover:text-red-500 bg-white px-2 py-1 rounded shadow-sm">取消</button>}
                       </div>
                       <form key={editingEventId || 'new_event'} onSubmit={handleUpdateEvent} className="space-y-4">
                          <div className="space-y-1">
                             <label className="text-xs font-medium text-slate-500">活動標題</label>
                             <input type="text" name="title" defaultValue={editingEventId ? recentEvents.find(e=>e.id===editingEventId).title : ''} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-medium" required />
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-medium text-slate-500">活動日期</label>
                             <input type="date" name="date" defaultValue={editingEventId ? recentEvents.find(e=>e.id===editingEventId).date : new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-medium" required />
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-medium text-slate-500">活動內容</label>
                             <textarea name="description" defaultValue={editingEventId ? recentEvents.find(e=>e.id===editingEventId).description : ''} rows="3" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-medium resize-none" required></textarea>
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-medium text-slate-500 block mb-1">活動照片</label>
                             <div className="flex items-center gap-3">
                               <div className="w-16 h-12 bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center">
                                 {eventUploadedPhoto || (editingEventId && recentEvents.find(e=>e.id===editingEventId)?.photo) ? <img src={eventUploadedPhoto || recentEvents.find(e=>e.id===editingEventId)?.photo} className="w-full h-full object-cover" alt="preview"/> : <ImageIcon className="text-slate-400 w-5 h-5"/>}
                               </div>
                               <label className="flex-1 text-center bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold py-2 rounded-lg cursor-pointer border border-pink-100 transition-colors">
                                 上傳照片 <input type="file" accept="image/*" onChange={handleEventPhotoUpload} className="hidden" />
                               </label>
                             </div>
                          </div>
                          <button type="submit" className={`w-full text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm mt-2 ${editingEventId ? 'bg-pink-500 hover:bg-pink-600' : 'bg-slate-800 hover:bg-slate-900'}`}>{editingEventId ? '💾 儲存修改' : '✨ 建立紀錄'}</button>
                       </form>
                     </div>
                     <div className="lg:col-span-2 space-y-4">
                        {recentEvents.map(ev => (
                           <div key={ev.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                              <img src={ev.photo} alt={ev.title} className="w-full sm:w-32 h-40 sm:h-32 object-cover rounded-xl border border-slate-100 shrink-0" />
                              <div className="flex-1 flex flex-col justify-between">
                                 <div>
                                   <div className="flex justify-between items-start">
                                      <h4 className="font-bold text-slate-800 text-lg">{ev.title}</h4>
                                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{ev.date}</span>
                                   </div>
                                   <p className="text-sm text-slate-600 mt-2 line-clamp-2">{ev.description}</p>
                                 </div>
                                 <div className="flex gap-2 mt-3 justify-end">
                                    <button onClick={() => handleEditEvent(ev)} className="bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-pink-600 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">編輯</button>
                                    <button onClick={() => handleDeleteEvent(ev.id)} className="bg-red-50 hover:bg-red-100 text-red-500 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">刪除</button>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'system' && (
              <div className="space-y-6 animate-fade-in pt-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 max-w-3xl mx-auto text-center">
                  <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center justify-center gap-3"><DownloadIcon className="text-indigo-600" /> 系統資料備份與還原</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><DownloadIcon size={28} /></div>
                        <div>
                           <h4 className="font-bold text-slate-800 mb-1">匯出 Excel 報表</h4>
                           <p className="text-xs text-slate-500">將目前所有的預約名單與出席狀態匯出為 CSV 檔案，方便會計結算。</p>
                        </div>
                        <button onClick={handleExportCSV} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-sm transition-colors mt-auto">下載 CSV</button>
                     </div>

                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><DownloadIcon size={28} /></div>
                        <div>
                           <h4 className="font-bold text-slate-800 mb-1">完整系統備份</h4>
                           <p className="text-xs text-slate-500">將系統設定、教練檔案、預約資料完整匯出為 JSON，避免資料遺失。</p>
                        </div>
                        <button onClick={handleExportJSON} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-sm transition-colors mt-auto">下載 JSON 備份</button>
                     </div>

                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center gap-4 hover:shadow-md transition-shadow md:col-span-2">
                        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center"><UploadIcon size={28} /></div>
                        <div className="max-w-md">
                           <h4 className="font-bold text-slate-800 mb-1">還原歷史資料</h4>
                           <p className="text-xs text-slate-500 mb-4">上傳過去備份的 JSON 檔案，系統將直接覆蓋現有資料（請謹慎操作）。</p>
                           <label className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 px-6 rounded-xl font-bold shadow-sm transition-colors cursor-pointer inline-block">
                              選擇備份檔上傳
                              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                           </label>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= SHOP VIEW ================= */}
        {view === 'shop' && (
          <div className="space-y-8 animate-fade-in py-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-4 flex items-center justify-center gap-3">
                <ShoppingCartIcon className="text-orange-500" size={36} /> 築動嚴選產品
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col">
                  <div className="w-full h-56 bg-slate-50 overflow-hidden relative">
                    <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-orange-600 px-3 py-1.5 rounded-full text-sm font-black shadow-sm flex items-center gap-1"><TagIcon size={14} /> NT$ {p.price}</div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{p.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">{p.description}</p>
                    <button onClick={() => showToast(`已將 ${p.name} 加入意願清單，請於下次上課時洽詢櫃台購買喔！`)} className="w-full bg-orange-50 text-orange-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2"><ShoppingCartIcon size={18} /> 預約購買</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CONTACT VIEW ================= */}
        {view === 'contact' && (
          <div className="space-y-8 animate-fade-in py-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-4">企業與活動合作接洽</h2>
              <p className="text-slate-600 leading-relaxed">除了個人課程，我們也提供專業的外派服務。無論是企業健康講座、校園研習，還是各類運動賽事的現場防護站，築動專業團隊都能為您量身打造最合適的方案！</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><SendIcon className="text-emerald-500" /> 填寫合作需求單</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="text-sm font-bold text-slate-600 block">單位 / 公司名稱 *</label><input type="text" name="companyName" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-slate-50 focus:bg-white" /></div>
                  <div><label className="text-sm font-bold text-slate-600 block">聯絡人姓名 *</label><input type="text" name="contactName" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-slate-50 focus:bg-white" /></div>
                  <div><label className="text-sm font-bold text-slate-600 block">聯絡電話 *</label><input type="tel" name="phone" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-slate-50 focus:bg-white" /></div>
                  <div><label className="text-sm font-bold text-slate-600 block">電子信箱 *</label><input type="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-slate-50 focus:bg-white" /></div>
                </div>
                <div><label className="text-sm font-bold text-slate-600 block">需求詳情說明 *</label><textarea name="details" required rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none resize-none bg-slate-50 focus:bg-white"></textarea></div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg">送出合作需求</button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
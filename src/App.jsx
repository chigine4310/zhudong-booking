import React, { useState } from 'react';
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
  ArrowRight as ArrowRightIcon
} from 'lucide-react';

const logoTeacher = 'https://placehold.co/400x200/e0e7ff/4f46e5?text=Teacher+Logo';
const logoAdmin = 'https://placehold.co/400x200/e0e7ff/4f46e5?text=Admin+Logo';
const logoContact = 'https://placehold.co/800x400/0f172a/ffffff?text=Rebuild+Training+Lab';
const logoShop = 'https://placehold.co/400x200/fff7ed/ea580c?text=Shop+Logo';
const logoMain = 'https://placehold.co/400x200/ffffff/000000?text=Main+Logo';

const MAX_CAPACITY = 4;

export default function ZhudongBookingApp() {
  // --- State Management ---
  // view 狀態用來切換 老師(teacher) 或 客人(customer) 或 老闆(admin) 視角
  const [view, setView] = useState('customer');
  
  // 更新為：老師開放時段 (availabilities) 與 實際預約 (appointments)
  const [availabilities, setAvailabilities] = useState([
    { id: 'a1', date: '2026-11-10', startTime: '09:00', endTime: '18:00', teacherName: '李教練' },
  ]);
  const [appointments, setAppointments] = useState([
    { id: 'ap1', date: '2026-11-10', startTime: '10:00', endTime: '11:30', duration: 90, teacherName: '李教練', studentName: '王小明', attended: false }
  ]);

  // UI 互動狀態
  const [toastMessage, setToastMessage] = useState(''); // 提示訊息
  const [selectedTeacher, setSelectedTeacher] = useState('all'); // 客人端選擇的教練篩選

  // 月曆與列表模式切換
  const [customerViewMode, setCustomerViewMode] = useState('calendar'); // 'list' 或 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date()); // 月曆當前顯示月份
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  });

  // --- 新增：老師與老闆專用狀態 ---
  const [activeTeacher, setActiveTeacher] = useState(null); // 老師端：目前排班的教練
  const [adminSelectedDate, setAdminSelectedDate] = useState(null); // 老闆端：選中的日期過濾
  const [adminSelectedTeacher, setAdminSelectedTeacher] = useState('all'); // 老闆端：選中的教練過濾

  // --- 新增：資料修改與相片上傳狀態 ---
  const [editModal, setEditModal] = useState({ isOpen: false, type: '', data: null });
  const [editingProfileName, setEditingProfileName] = useState(''); 
  const [uploadedPhoto, setUploadedPhoto] = useState('');

  // 客人端預約狀態：記錄選中的課程長度，預設 90 分鐘
  const [bookingDuration, setBookingDuration] = useState(90); 
  // 新增：客製化開始時間狀態，預設 10:00
  const [bookingStartTime, setBookingStartTime] = useState('10:00');
  // 新增：身體狀況勾選狀態
  const [hasMedicalCondition, setHasMedicalCondition] = useState(false);

  // --- 新增：老闆端業務分頁狀態 與 合作接洽資料狀態 ---
  const [adminTab, setAdminTab] = useState('courses'); // 'courses', 'cooperations', 'products', 'system'
  const [contactRequests, setContactRequests] = useState([
    { id: 'c1', companyName: '示範科技股份有限公司', contactName: '王經理', phone: '0912-345-678', email: 'hr@example.com', serviceType: 'speech', eventDate: '2026-12-15', details: '希望舉辦一場兩小時的員工肩頸放鬆與體適能講座。', status: 'pending', createdAt: '2026-11-05' }
  ]);

  // --- 新增：老闆端登入狀態 ---
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  // 教練專長資料 (擴充正職/承攬屬性)
  const [teacherProfiles, setTeacherProfiles] = useState({
    '李教練': { 
      specialty: '重量訓練、體態雕塑', 
      description: '5年教學經驗，專注於新手入門與科學化增肌減脂。', 
      type: 'fulltime', 
      hireDate: '2022-05-01',
      quote: '健身是一場與自己的對話，我會陪你走到最後。',
      photo: 'https://api.dicebear.com/9.x/avataaars/svg?seed=李教練&backgroundColor=c0aede'
    },
    '張教練': { 
      specialty: '瑜珈、皮拉提斯', 
      description: '注重身心靈平衡，幫助改善姿勢與強化核心力量。', 
      type: 'contractor', 
      hireDate: '2025-02-15',
      quote: '在呼吸之間，找回身体的平靜與力量。',
      photo: 'https://api.dicebear.com/9.x/avataaars/svg?seed=張教練&backgroundColor=ffdfbf'
    }
  });

  // --- 新增：產品管理狀態 ---
  const [products, setProducts] = useState([
    { id: 'p1', name: '築動花生球', price: 350, description: '專為深層筋膜放鬆設計，精準按壓激痛點。極致耐用，適合肩頸、脊椎兩側舒緩。', photo: 'https://placehold.co/400x300/e0e7ff/4f46e5?text=築動花生球' },
    { id: 'p2', name: '築動小滾筒', price: 500, description: '輕巧好攜帶，隨時隨地放鬆緊繃肌肉。適合小腿、手臂等局部肌群舒緩。', photo: 'https://placehold.co/400x300/ffedd5/ea580c?text=築動小滾筒' }
  ]);
  const [editingProductId, setEditingProductId] = useState('');
  const [productUploadedPhoto, setProductUploadedPhoto] = useState('');

  // 顯示提示訊息
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // --- 時間處理 Helpers ---
  const timeToMins = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const minsToTime = (m) => {
    const h = Math.floor(m / 60) % 24;
    const mm = m % 60;
    return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };

  // 產生 08:30 ~ 21:00 的時間選項方塊
  const availableTimeSlots = [];
  for (let h = 8; h <= 21; h++) {
    if (h === 8) {
      availableTimeSlots.push("08:30");
    } else if (h === 21) {
      availableTimeSlots.push("21:00");
    } else {
      const hr = String(h).padStart(2, '0');
      availableTimeSlots.push(`${hr}:00`);
      availableTimeSlots.push(`${hr}:30`);
    }
  }

  // 檢查特定時段是否可預約 (判斷老師空堂、不衝堂、教室未滿)
  const checkTimeSlotAvailable = (timeStr, duration, date, teacher) => {
    if (!teacher) return false;
    const reqStartMins = timeToMins(timeStr);
    const reqEndMins = reqStartMins + duration;

    // 3. 教室容留人數是否達標 (最多 4 組)
    const overlappingApts = appointments.filter(ap =>
      ap.date === date &&
      timeToMins(ap.startTime) < reqEndMins && timeToMins(ap.endTime) > reqStartMins
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
      // 不指定教練：檢查是否「至少有一位教練」在該時段有空
      const availableTeachers = [...new Set(availabilities.filter(a => a.date === date && timeToMins(a.startTime) <= reqStartMins && timeToMins(a.endTime) >= reqEndMins).map(a => a.teacherName))];
      for (let t of availableTeachers) {
          const teacherConflict = appointments.some(ap => ap.teacherName === t && ap.date === date && timeToMins(ap.startTime) < reqEndMins && timeToMins(ap.endTime) > reqStartMins);
          if (!teacherConflict) return true; // 只要有一位教練可以就亮起
      }
      return false;
    } else {
      // 1. 教練是否開放此時段
      const isAvail = availabilities.some(a => 
        a.teacherName === teacher && a.date === date &&
        timeToMins(a.startTime) <= reqStartMins && timeToMins(a.endTime) >= reqEndMins
      );
      if (!isAvail) return false;

      // 2. 教練是否已被預約
      const teacherConflict = appointments.some(ap => 
        ap.teacherName === teacher && ap.date === date &&
        timeToMins(ap.startTime) < reqEndMins && timeToMins(ap.endTime) > reqStartMins
      );
      if (teacherConflict) return false;

      return true;
    }
  };

  // --- Teacher Functions ---
  const handleAddAvailability = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const date = formData.get('date');
    const startTime = formData.get('startTime');
    const endTime = formData.get('endTime');
    const teacherName = formData.get('teacherName');

    if (timeToMins(startTime) >= timeToMins(endTime)) {
      showToast('結束時間必須晚於開始時間！');
      return;
    }

    const newAvail = { id: Date.now().toString(), date, startTime, endTime, teacherName };
    setAvailabilities(prev => [...prev, newAvail].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA - dateB;
    }));
    e.target.reset();
    showToast('成功新增開放時段！');
  };

  const handleDeleteAvailability = (id) => {
    setAvailabilities(prev => prev.filter(a => a.id !== id));
    showToast('已刪除開放時段');
  };

  // --- 新增：老闆端登入驗證 ---
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

  // --- 新增：通用儲存修改功能 (彈出視窗用) ---
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (editModal.type === 'availability') {
      const date = formData.get('date');
      const startTime = formData.get('startTime');
      const endTime = formData.get('endTime');
      if (timeToMins(startTime) >= timeToMins(endTime)) {
        showToast('結束時間必須晚於開始時間！'); return;
      }
      setAvailabilities(prev => prev.map(a => a.id === editModal.data.id ? { ...a, date, startTime, endTime } : a));
      showToast('已成功修改開放時段！');
      
    } else if (editModal.type === 'appointment') {
      const date = formData.get('date');
      const startTime = formData.get('startTime');
      const duration = parseInt(formData.get('duration'), 10);
      const studentName = formData.get('studentName');
      const endTime = minsToTime(timeToMins(startTime) + duration);
      // 取出問卷資料
      const referral = formData.get('referral') || '';
      const concern = formData.get('concern') || '';
      const hasMedical = formData.get('hasMedical') === 'on';
      const medicalDetails = formData.get('medicalDetails') || '';

      setAppointments(prev => prev.map(ap => ap.id === editModal.data.id ? { ...ap, date, startTime, endTime, duration, studentName, referral, concern, hasMedical, medicalDetails } : ap));
      showToast('已成功修改預約資料！');
    }
    
    setEditModal({ isOpen: false, type: '', data: null });
  };

  // --- 新增：處理相片上傳 (轉為 Base64) ---
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
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // 自動捲動到表單
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
    if (now.getDate() < hire.getDate()) {
      totalMonths--;
    }
    
    const years = Math.max(0, Math.floor(totalMonths / 12));
    
    // 依據勞基法計算特休日數
    let leaveDays = 0;
    if (years >= 10) leaveDays = Math.min(30, 15 + (years - 9));
    else if (years >= 5) leaveDays = 15;
    else if (years >= 3) leaveDays = 14;
    else if (years >= 2) leaveDays = 10;
    else if (years >= 1) leaveDays = 7;
    else if (totalMonths >= 6) leaveDays = 3;

    return {
      text: years > 0 ? `${years} 年` : (totalMonths > 0 ? `${totalMonths} 個月` : '新進'),
      leaveDays
    };
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('profileName');
    const specialty = formData.get('specialty');
    const description = formData.get('description');
    const type = formData.get('type') || 'contractor';
    const hireDate = formData.get('hireDate') || new Date().toISOString().split('T')[0];
    const quote = formData.get('quote') || '';
    
    // 若有上傳照片優先使用上傳的，否則使用網址，最後採用預設
    let photo = uploadedPhoto || formData.get('photoUrl') || '';
    if (!photo && !editingProfileName) {
        photo = `https://api.dicebear.com/9.x/avataaars/svg?seed=${name}&backgroundColor=e2e8f0`;
    }

    if (!name) return;

    setTeacherProfiles(prev => {
      const newProfiles = { ...prev };
      // 如果改了名字，舊的名字要刪掉（避免重複建立）
      if (editingProfileName && editingProfileName !== name) {
        delete newProfiles[editingProfileName];
      }
      newProfiles[name] = { specialty, description, type, hireDate, quote, photo };
      return newProfiles;
    });
    
    e.target.reset();
    setEditingProfileName('');
    setUploadedPhoto('');
    showToast(`已成功儲存 ${name} 的專長介紹！`);
  };

  // --- 新增：產品管理 Functions ---
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
    if (!photo) {
       photo = `https://placehold.co/400x300/f1f5f9/64748b?text=${name}`;
    }

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

  const handleEditProduct = (p) => {
    setEditingProductId(p.id);
    setProductUploadedPhoto(p.photo || '');
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('已刪除該產品！');
  };

  const cancelProductEdit = () => {
    setEditingProductId('');
    setProductUploadedPhoto('');
  };

  // --- Customer Functions ---
  const handleBookAppointment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('customerName');
    const phone = formData.get('phone'); // 取得電話
    const reqStartTime = formData.get('startTime');
    const duration = parseInt(formData.get('duration'), 10);
    const targetTeacher = formData.get('targetTeacher');
    
    // 取得新增的問卷資料
    const referral = formData.get('referral') || '';
    const concern = formData.get('concern') || '';
    const hasMedical = formData.get('hasMedical') === 'on';
    const medicalDetails = formData.get('medicalDetails') || '';
    
    if (!name.trim() || !phone.trim()) {
       showToast('請輸入真實姓名與聯絡電話才能預約喔！'); return;
    }

    if (!duration || isNaN(duration)) {
       showToast('請選擇課程長度！'); return;
    }

    const reqStartMins = timeToMins(reqStartTime);
    const reqEndMins = reqStartMins + duration;
    const reqEndTime = minsToTime(reqEndMins);

    // 教室總容量檢查
    const overlappingApts = appointments.filter(ap =>
       ap.date === selectedDate &&
       timeToMins(ap.startTime) < reqEndMins && timeToMins(ap.endTime) > reqStartMins
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

    if (maxConcurrent >= MAX_CAPACITY) {
       showToast('該時段教室已滿（超過 4 組客人），無法再預約！'); return;
    }

    let finalTeacher = targetTeacher;

    if (targetTeacher === 'all') {
        const availableTeachers = [...new Set(availabilities.filter(a => a.date === selectedDate && timeToMins(a.startTime) <= reqStartMins && timeToMins(a.endTime) >= reqEndMins).map(a => a.teacherName))];
        const freeTeachers = availableTeachers.filter(t => !appointments.some(ap => ap.teacherName === t && ap.date === selectedDate && timeToMins(ap.startTime) < reqEndMins && timeToMins(ap.endTime) > reqStartMins));
        if (freeTeachers.length === 0) {
            showToast('該時段目前無可安排的教練！'); return;
        }
        finalTeacher = '由系統安排'; // 設定為系統安排
    } else {
        // 1. 檢查是否在教練的開放時間內
        const isAvail = availabilities.some(a => 
           a.teacherName === targetTeacher && a.date === selectedDate &&
           timeToMins(a.startTime) <= reqStartMins && timeToMins(a.endTime) >= reqEndMins
        );
        if (!isAvail) {
           showToast('預約時間不在該教練的開放時段內，或跨越了下班時間！'); return;
        }

        // 2. 檢查教練是否已被預約
        const teacherConflict = appointments.some(ap => 
           ap.teacherName === targetTeacher && ap.date === selectedDate &&
           timeToMins(ap.startTime) < reqEndMins && timeToMins(ap.endTime) > reqStartMins
        );
        if (teacherConflict) {
           showToast('教練在該時段已有其他預約，請選擇其他時間！'); return;
        }
    }

    const newAp = {
       id: Date.now().toString(),
       date: selectedDate,
       startTime: reqStartTime,
       endTime: reqEndTime,
       duration,
       teacherName: finalTeacher,
       studentName: name,
       phone: phone, // 存入電話資料
       referral,
       concern,
       hasMedical,
       medicalDetails,
       attended: false
    };
    
    setAppointments(prev => [...prev, newAp].sort((a, b) => timeToMins(a.startTime) - timeToMins(b.startTime)));
    showToast('預約成功！期待您的到來。');
    setBookingDuration(90); // 預約成功後重置為最火選擇
    setBookingStartTime('10:00'); // 重置時間
    setHasMedicalCondition(false);
    e.target.reset();
  };

  const handleCancelAppointment = (id) => {
    setAppointments(prev => prev.filter(ap => ap.id !== id));
    showToast('已取消該筆預約。');
  };

  const handleToggleAttendance = (id) => {
    setAppointments(prev => prev.map(ap => 
      ap.id === id ? { ...ap, attended: !ap.attended } : ap
    ));
    showToast('已更新學員報到狀態！');
  };

  // --- 更新：合作接洽表單送出連動 ---
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRequest = {
      id: Date.now().toString(),
      companyName: formData.get('companyName'),
      contactName: formData.get('contactName'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      serviceType: formData.get('serviceType'),
      eventDate: formData.get('eventDate'),
      details: formData.get('details'),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setContactRequests(prev => [newRequest, ...prev]);
    showToast('✅ 已經收到您的合作需求！我們將盡快安排專人與您聯繫。');
    e.target.reset();
  };

  const handleUpdateContactStatus = (id, newStatus) => {
    setContactRequests(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    showToast('已更新接洽案件狀態！');
  };
  
  const handleDeleteContact = (id) => {
    setContactRequests(prev => prev.filter(c => c.id !== id));
    showToast('已刪除該筆接洽紀錄。');
  };

  // --- 更新：資料匯出與匯入 Functions (加入接洽資料) ---
  const handleExportCSV = () => {
    let csvContent = '\uFEFF'; 
    csvContent += "日期,開始時間,結束時間,教練名稱,學員姓名,報到狀態\n";
    
    appointments.forEach(ap => {
      csvContent += `${ap.date},${ap.startTime},${ap.endTime},${ap.teacherName},${ap.studentName},${ap.attended ? '已報到' : '未報到'}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `築動約課報表_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    showToast('已成功匯出 Excel (CSV) 報表！');
  };

  const handleExportJSON = () => {
    const data = JSON.stringify({ availabilities, appointments, teacherProfiles, products, contactRequests }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
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
        showToast('成功匯入歷史資料！');
      } catch (error) {
        showToast('檔案格式錯誤，匯入失敗。');
      }
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  // --- 老師排班時數計算 (依開放時段計算) ---
  const calculateScheduledHours = (teacherName) => {
    const currentM = currentMonth.getMonth() + 1;
    const currentY = currentMonth.getFullYear();
    
    let totalMins = 0;
    availabilities.forEach(a => {
       if (a.teacherName !== teacherName) return;
       const aDate = new Date(a.date);
       if (aDate.getMonth() + 1 === currentM && aDate.getFullYear() === currentY) {
          // 計算老師開放可排課的總時間
          totalMins += (timeToMins(a.endTime) - timeToMins(a.startTime));
       }
    });
    return Math.round(totalMins / 60);
  };

  // --- Render Helpers ---
  // 取得不重複的教練名單 (包含所有有檔案的教練)，並依據正職優先、年資優先進行排序
  const uniqueTeachers = Object.keys(teacherProfiles).sort((a, b) => {
    const profileA = teacherProfiles[a];
    const profileB = teacherProfiles[b];

    // 1. 優先判斷屬性：正職 (fulltime) 優先於 承攬 (contractor)
    if (profileA.type === 'fulltime' && profileB.type !== 'fulltime') return -1;
    if (profileA.type !== 'fulltime' && profileB.type === 'fulltime') return 1;

    // 2. 次要判斷：入職日期 (早的在前面)
    const dateA = new Date(profileA.hireDate || '9999-12-31').getTime();
    const dateB = new Date(profileB.hireDate || '9999-12-31').getTime();
    return dateA - dateB;
  });
  
  // 老闆端過濾預約
  const adminFilteredApts = adminSelectedTeacher === 'all' 
    ? appointments 
    : appointments.filter(ap => ap.teacherName === adminSelectedTeacher);

  // --- 月曆產生邏輯 (三端共用) ---
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const startDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null); // 填充空白天數
    for (let i = 1; i <= daysInMonth; i++) {
      const dString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push(dString);
    }
    return days;
  };

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const renderSharedCalendar = (mode) => {
    const currentSelDate = mode === 'admin' ? adminSelectedDate : selectedDate;
    
    const onSelect = (dStr) => {
       if (mode === 'admin') setAdminSelectedDate(currentSelDate === dStr ? null : dStr);
       else setSelectedDate(dStr);
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ChevronLeftIcon />
          </button>
          <h3 className="text-lg font-bold text-slate-800">
            {currentMonth.getFullYear()} 年 {currentMonth.getMonth() + 1} 月
          </h3>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ChevronRightIcon />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-slate-400 py-2">
              {day}
            </div>
          ))}
          
          {generateCalendarDays().map((dateStr, index) => {
            if (!dateStr) return <div key={`empty-${index}`} className="p-2"></div>;
            
            const dayNum = new Date(dateStr).getDate();
            const isSelected = currentSelDate === dateStr;
            
            let hasData = false;
            let badgeCount = 0;

            if (mode === 'customer') {
               const teacherAvails = availabilities.filter(a => a.date === dateStr && (selectedTeacher === 'all' || a.teacherName === selectedTeacher));
               hasData = teacherAvails.length > 0;
            } else if (mode === 'teacher') {
               const teacherAvails = availabilities.filter(a => a.date === dateStr && a.teacherName === activeTeacher);
               const teacherApts = appointments.filter(a => a.date === dateStr && a.teacherName === activeTeacher);
               hasData = teacherAvails.length > 0 || teacherApts.length > 0;
               badgeCount = teacherApts.length; 
            } else if (mode === 'admin') {
               const adminApts = appointments.filter(a => a.date === dateStr && (adminSelectedTeacher === 'all' || a.teacherName === adminSelectedTeacher));
               hasData = adminApts.length > 0;
               badgeCount = adminApts.length;
            }
            
            return (
              <button
                key={dateStr}
                onClick={() => onSelect(dateStr)}
                className={`relative p-2 md:p-3 flex flex-col items-center justify-center rounded-xl transition-all ${
                  isSelected ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-700'
                }`}
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col xl:flex-row items-center justify-between gap-4 xl:gap-8">
          
          {/* 左側區域：Logo + 客戶服務 */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full xl:w-auto">
            {/* Logo & 新系統名稱 */}
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setView('customer')}>
              <img src={logoMain} alt="築動 Rebuild Logo" className="h-12 md:h-14 object-contain mix-blend-multiply" />
              <div className="hidden sm:block text-left">
                <h1 className="font-black text-xl md:text-2xl tracking-tight text-slate-900 leading-tight">築動預約與服務中心</h1>
                <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">Rebuild Training Lab</p>
              </div>
            </div>

            {/* 客戶服務導覽列 */}
            <nav className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl items-center flex-wrap justify-center border border-slate-100 shadow-inner">
              <button 
                onClick={() => setView('customer')}
                className={`px-5 py-2.5 rounded-xl text-base font-black transition-all transform shadow-sm ${
                  view === 'customer' 
                    ? 'bg-indigo-600 text-white shadow-md scale-105' 
                    : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-100'
                }`}
              >
                ✨ 我要約課
              </button>
              <button 
                onClick={() => setView('about')}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all transform shadow-sm ${
                  view === 'about' 
                    ? 'bg-blue-500 text-white shadow-md scale-105' 
                    : 'bg-white text-blue-500 hover:bg-blue-50 border border-blue-100'
                }`}
              >
                📖 認識築動
              </button>
              <button 
                onClick={() => setView('shop')}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all transform shadow-sm ${
                  view === 'shop' 
                    ? 'bg-orange-500 text-white shadow-md scale-105' 
                    : 'bg-white text-orange-500 hover:bg-orange-50 border border-orange-100'
                }`}
              >
                🛒 產品選購
              </button>
              <button 
                onClick={() => setView('contact')}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all transform shadow-sm ${
                  view === 'contact' 
                    ? 'bg-emerald-600 text-white shadow-md scale-105' 
                    : 'bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-100'
                }`}
              >
                🤝 合作接洽
              </button>
            </nav>
          </div>

          {/* 右側區域：內部人員管理 */}
          <nav className="flex gap-2 items-center w-full xl:w-auto justify-center xl:justify-end border-t xl:border-t-0 xl:border-l border-slate-100 pt-3 xl:pt-0 xl:pl-6">
            <div className="text-xs font-bold text-slate-400 mr-2 hidden sm:block">內部管理區</div>
            <button 
              onClick={() => setView('teacher')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${view === 'teacher' ? 'bg-slate-800 text-white shadow-md scale-105' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 shadow-sm'}`}
            >
              💪 老師排排課
            </button>
            <button 
              onClick={() => setView('admin')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${view === 'admin' ? 'bg-slate-800 text-white shadow-md scale-105' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 shadow-sm'}`}
            >
              👑 JD
            </button>
          </nav>
        </div>
      </header>

      {/* 修改資料彈出視窗 (Modal) */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <EditIcon className="w-5 h-5 text-indigo-600" /> 
              修改 {editModal.type === 'availability' ? '開放時段' : '預約資料'}
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
                  {/* 老闆端修改預約時，也可以看到客人的備註 */}
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

              <div className="flex gap-3 mt-6 pt-2">
                <button type="button" onClick={() => setEditModal({isOpen: false, type: '', data: null})} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors">
                  取消
                </button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors shadow-sm">
                  確認儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium flex items-center gap-2">
            <CheckIcon /> {toastMessage}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8 mb-12">
        
        {/* ================= ABOUT VIEW (認識築動) ================= */}
        {view === 'about' && (
          <div className="space-y-12 animate-fade-in py-6">
            
            {/* 品牌主視覺與精神 */}
            <div className="text-center max-w-3xl mx-auto">
              <img src={logoMain} alt="築動 Rebuild Logo" className="h-24 md:h-32 object-contain mx-auto mb-6 mix-blend-multiply" />
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-6 leading-tight">
                重塑身體的最佳狀態<br/>
                <span className="text-indigo-600 text-2xl md:text-4xl">Rebuild Training Lab</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                我們致力於結合「運動防護」與「體適能訓練」的專業，幫助您找回身體的控制力，遠離疼痛，並在日常生活與運動表現中突破自我。
              </p>
            </div>

            {/* 三大核心服務 */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <span className="bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-full text-sm font-black tracking-widest">CORE SERVICES</span>
                <h3 className="text-2xl font-bold text-slate-800 mt-4">我們的三大核心服務</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform shadow-sm">
                    <HeartIcon size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">運動按摩</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    透過專業的手法放鬆深層筋膜，精準解除激痛點。適合長期的肌肉緊繃、運動後的疲勞恢復，以及改善因代償產生的痠痛問題。
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                  <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform shadow-sm">
                    <TargetIcon size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">運動訓練</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    不是盲目舉重，而是建立正確發力與身體張力。強化核心與肌力，提升運動表現並預防受傷，為身體打下最穩固的基礎。
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform shadow-sm">
                    <ActivityIcon size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">機能重建</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    專為受傷後、開刀後或長期姿勢不良者設計。循序漸進地找回關節活動度與神經控制力，安全地重返正常生活與運動場。
                  </p>
                </div>
              </div>
            </div>

            {/* 客戶痛點共鳴 */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-800 rounded-3xl p-8 md:p-12 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ShieldIcon size={200} />
              </div>
              <div className="relative z-10 max-w-2xl">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                  <SparklesIcon className="text-amber-400" /> 這些困擾，我們都懂
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckIcon className="text-emerald-400 shrink-0 mt-1" />
                    <span className="text-slate-200 leading-relaxed">久坐辦公室，長期肩頸僵硬、滑鼠手、腰痠背痛找不到原因。</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="text-emerald-400 shrink-0 mt-1" />
                    <span className="text-slate-200 leading-relaxed">熱愛運動，但總是卡關、越練越痛，或是需要賽前賽後的專業恢復。</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="text-emerald-400 shrink-0 mt-1" />
                    <span className="text-slate-200 leading-relaxed">曾受傷或開刀，不敢貿然運動，需要專業教練評估並循序漸進引導。</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="text-emerald-400 shrink-0 mt-1" />
                    <span className="text-slate-200 leading-relaxed">想改善體態（如圓肩、駝背、骨盆前傾），卻不知道從何練起。</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 導航按鈕 (Call to Action) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-slate-100">
              <button 
                onClick={() => setView('customer')}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                開始改變，立即約課 <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setView('contact')}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                企業與賽事合作接洽
              </button>
            </div>

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
              {uniqueTeachers.map(name => (
                <button
                  key={name}
                  onClick={() => setActiveTeacher(name)}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all flex flex-col items-center gap-3 active:scale-95"
                >
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center overflow-hidden border border-indigo-100">
                    {teacherProfiles[name]?.photo ? <img src={teacherProfiles[name].photo} alt={name} className="w-full h-full object-cover" /> : <UserIcon />}
                  </div>
                  <div>
                    <span className="block font-bold text-slate-700">{name}</span>
                    <span className="text-[10px] text-slate-400">{teacherProfiles[name].type === 'fulltime' ? '正職人員' : '承攬人員'}</span>
                  </div>
                </button>
              ))}
              {uniqueTeachers.length === 0 && (
                 <p className="col-span-full text-center text-slate-500 bg-white p-8 rounded-2xl border border-dashed">尚無建立任何教練檔案，請先由老闆端新增。</p>
              )}
            </div>
          </div>
        )}

        {view === 'teacher' && activeTeacher && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
               <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                    <UserIcon />
                  </div>
                  {activeTeacher} 的專屬排課表
               </h2>
               <button onClick={() => setActiveTeacher(null)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-all self-start md:self-auto">
                  <LogOutIcon /> 登出切換身分
               </button>
            </div>

            {/* 勞基法工時提示 (正職專用) */}
            {teacherProfiles[activeTeacher]?.type === 'fulltime' && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                 <div>
                    <h3 className="font-bold text-indigo-900 flex items-center gap-2 text-lg">
                       <BriefcaseIcon /> 正職排班狀況 ({currentMonth.getMonth() + 1}月)
                    </h3>
                    <p className="text-sm text-indigo-700 mt-2 leading-relaxed">
                      依勞基法，全職人員月排班基準約為 160 小時。<br/>
                      目前年資：<span className="font-bold">{calculateSeniority(teacherProfiles[activeTeacher]?.hireDate).text}</span>
                      ，今年享有 <span className="font-bold text-indigo-800">{calculateSeniority(teacherProfiles[activeTeacher]?.hireDate).leaveDays} 天</span> 特休<br/>
                      <span className="text-xs opacity-80">(若當月有使用特休或遇國定假日，請自行扣抵目標時數)</span>
                    </p>
                 </div>
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-indigo-100 text-center shrink-0">
                       <span className="block text-xs text-slate-500 font-bold mb-1">本月已排班</span>
                       <span className="block text-2xl font-black text-indigo-600">{calculateScheduledHours(activeTeacher)} <span className="text-sm font-medium">小時</span></span>
                    </div>
                    {calculateScheduledHours(activeTeacher) >= 160 ? (
                       <div className="bg-emerald-100/80 text-emerald-700 px-5 py-4 rounded-xl shadow-sm text-sm font-bold flex-1 md:flex-none text-center leading-relaxed">
                         已達 160h！<br/>符合基本排班目標
                       </div>
                    ) : (
                       <div className="bg-amber-100/80 text-amber-700 px-5 py-4 rounded-xl shadow-sm text-sm font-bold flex-1 md:flex-none text-center flex items-center justify-center">
                         距 160h 尚缺 {160 - calculateScheduledHours(activeTeacher)} 小時
                       </div>
                    )}
                 </div>
              </div>
            )}

            {renderSharedCalendar('teacher')}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* 左側：快速新增開放時段 */}
               <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit sticky top-24">
                 <h3 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">
                   開放 {selectedDate} 供預約
                 </h3>
                 <form onSubmit={handleAddAvailability} className="space-y-4">
                    <input type="hidden" name="teacherName" value={activeTeacher} />
                    <input type="hidden" name="date" value={selectedDate} />
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-600">開放開始時間</label>
                      <input type="time" name="startTime" defaultValue="09:00" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-600">開放結束時間</label>
                      <input type="time" name="endTime" defaultValue="18:00" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" required />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors shadow-sm active:scale-[0.98] mt-2">
                      + 新增開放時段
                    </button>
                 </form>
               </div>

               {/* 右側：當日課程總覽與點名 */}
               <div className="md:col-span-2">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">{selectedDate} 開放時段與預約名單</h3>
                 
                 {/* 教練當日開放時段 */}
                 <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2"><ClockIcon /> 您開放的時間區間</h4>
                    <div className="flex flex-wrap gap-3">
                       {availabilities.filter(a => a.teacherName === activeTeacher && a.date === selectedDate).length === 0 ? (
                          <div className="text-sm text-slate-400">當日尚未開放時間</div>
                       ) : (
                          availabilities.filter(a => a.teacherName === activeTeacher && a.date === selectedDate).map(avail => (
                             <div key={avail.id} className="bg-indigo-50 border border-indigo-100 text-indigo-800 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-sm group">
                                {avail.startTime} - {avail.endTime}
                                <button onClick={() => setEditModal({ isOpen: true, type: 'availability', data: avail })} className="text-indigo-400 hover:text-indigo-600 ml-1 p-1" title="修改時間"><EditIcon size={14} /></button>
                                <button onClick={() => handleDeleteAvailability(avail.id)} className="text-indigo-400 hover:text-red-500 p-1" title="刪除">✕</button>
                             </div>
                          ))
                       )}
                    </div>
                 </div>

                 {/* 教練當日實際預約 */}
                 <div>
                    <h4 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2"><UserIcon /> 學生預約名單</h4>
                    <div className="space-y-3">
                      {appointments.filter(ap => ap.teacherName === activeTeacher && ap.date === selectedDate).length === 0 ? (
                          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed text-slate-400 text-sm font-medium">
                            尚未有學生預約
                          </div>
                      ) : (
                          appointments.filter(ap => ap.teacherName === activeTeacher && ap.date === selectedDate).map(ap => (
                            <div key={ap.id} className="p-5 rounded-2xl border bg-white border-slate-200 transition-all hover:shadow-md flex flex-col md:flex-row justify-between gap-5">
                              <div className="space-y-2">
                                <div className="text-slate-800 font-bold flex items-center gap-2">
                                  <ClockIcon /> {ap.startTime} - {ap.endTime} ({ap.duration} 分鐘)
                                  <button onClick={() => setEditModal({ isOpen: true, type: 'appointment', data: ap })} className="text-slate-400 hover:text-indigo-600 ml-2" title="修改預約"><EditIcon size={16} /></button>
                                </div>
                                <div className="text-slate-600 flex items-center gap-2 font-medium">
                                  <UserIcon /> 學生姓名：{ap.studentName}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => handleToggleAttendance(ap.id)}
                                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm ${
                                    ap.attended ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {ap.attended ? '已報到 ✓' : '點擊報到'}
                                </button>
                                <button onClick={() => handleCancelAppointment(ap.id)} className="text-sm text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 px-3 py-2 rounded-xl font-bold transition-colors">
                                  取消預約
                                </button>
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
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">預約課程</h2>
                <p className="text-slate-500 mt-2">教室最多同時容納 {MAX_CAPACITY} 組客人。請選擇教練與日期，並輸入您想上課的時間。</p>
              </div>
            </div>

            {/* 教練篩選列 */}
            {uniqueTeachers.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={() => setSelectedTeacher('all')}
                  className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${selectedTeacher === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                >
                  全部教練
                </button>
                {uniqueTeachers.map(teacher => (
                  <button
                    key={teacher}
                    onClick={() => setSelectedTeacher(teacher)}
                    className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${selectedTeacher === teacher ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                  >
                    {teacher}
                  </button>
                ))}
              </div>
            )}

            {/* 教練介紹 */}
            {uniqueTeachers.length > 0 && (
              <div className="mb-6 animate-fade-in">
                {selectedTeacher === 'all' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uniqueTeachers.map(name => {
                      const profile = teacherProfiles[name] || { specialty: '尚未填寫', description: '這位教練很神秘，還沒有填寫介紹喔！', quote: '', photo: '' };
                      return (
                        <div key={name} className="bg-indigo-50/60 rounded-2xl p-5 border border-indigo-100/50 flex flex-col gap-3 transition-all hover:bg-indigo-50 hover:shadow-sm hover:border-indigo-200 cursor-pointer group" onClick={() => setSelectedTeacher(name)}>
                          <div className="flex gap-4 items-start">
                            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm border-2 border-white group-hover:scale-105 transition-transform">
                              {profile.photo ? <img src={profile.photo} alt={name} className="w-full h-full object-cover" /> : <UserIcon size={24} />}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-800 flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-lg">{name}</span> 
                                <span className="text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full font-black shadow-sm flex items-center gap-1">
                                  <StarIcon size={12} className="text-orange-500 fill-orange-500"/>
                                  {profile.specialty}
                                </span>
                              </h3>
                              {profile.quote && (
                                <p className="text-sm font-bold text-indigo-600 italic mb-2">「{profile.quote}」</p>
                              )}
                            </div>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed bg-white/60 p-3 rounded-xl">{profile.description}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-6 border border-indigo-100/80 shadow-sm flex flex-col md:flex-row gap-6 items-start transition-all">
                    <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-md border-4 border-white">
                      {teacherProfiles[selectedTeacher]?.photo ? <img src={teacherProfiles[selectedTeacher].photo} alt={selectedTeacher} className="w-full h-full object-cover" /> : <UserIcon size={36} />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-2xl text-slate-800 flex flex-wrap items-center gap-3 mb-3">
                        {selectedTeacher} 
                        <span className="text-sm bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1.5 rounded-full font-black shadow-md flex items-center gap-1.5 border border-orange-400">
                          <StarIcon size={16} className="text-white fill-white"/>
                          {teacherProfiles[selectedTeacher]?.specialty || '尚未填寫專長'}
                        </span>
                      </h3>
                      {teacherProfiles[selectedTeacher]?.quote && (
                        <div className="inline-block bg-indigo-600 text-white text-sm font-bold px-4 py-1.5 rounded-b-xl rounded-tr-xl mb-4 relative shadow-sm">
                          「{teacherProfiles[selectedTeacher].quote}」
                        </div>
                      )}
                      <p className="text-slate-600 text-sm leading-relaxed max-w-2xl bg-white p-4 rounded-xl border border-slate-50 shadow-sm">
                        {teacherProfiles[selectedTeacher]?.description || '這位教練很神秘，還沒有填寫介紹喔！'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {renderSharedCalendar('customer')}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 顯示教練當日開放時段 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    {selectedDate} {selectedTeacher === 'all' ? '所有教練' : selectedTeacher} 的開放時段
                  </h3>
                  {availabilities.filter(a => (selectedTeacher === 'all' || a.teacherName === selectedTeacher) && a.date === selectedDate).length === 0 ? (
                    <div className="text-slate-400 text-sm text-center py-8">當日未開放預約時間</div>
                  ) : (
                    <div className="space-y-3">
                        {availabilities.filter(a => (selectedTeacher === 'all' || a.teacherName === selectedTeacher) && a.date === selectedDate).map(a => (
                          <div key={a.id} className="bg-indigo-50 text-indigo-800 p-4 rounded-xl font-bold border border-indigo-100 flex items-center justify-between gap-3">
                              <span className="flex items-center gap-2"><ClockIcon /> {a.startTime} ~ {a.endTime}</span>
                              {selectedTeacher === 'all' && <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded-md">{a.teacherName}</span>}
                          </div>
                        ))}
                    </div>
                  )}
              </div>

              {/* 自由預約表單 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">填寫您的預約資訊</h3>
                  <form onSubmit={handleBookAppointment} className="space-y-5">
                    <input type="hidden" name="targetTeacher" value={selectedTeacher} />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-600 flex items-center gap-1">
                            <UserIcon size={16} className="text-indigo-500" /> 您的姓名 <span className="text-[10px] text-rose-500">(必填真實姓名)</span>
                        </label>
                        <input type="text" name="customerName" placeholder="請輸入真實姓名" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-600 flex items-center gap-1">
                            📞 聯絡電話 <span className="text-[10px] text-rose-500">(必填)</span>
                        </label>
                        <input type="tel" name="phone" placeholder="例如：0912345678" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white" required />
                      </div>
                    </div>

                    {/* 新增：貼心問卷區 (選填) */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                      <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        ✨ 讓我們更了解您 <span className="text-[10px] text-slate-400 font-normal">(選填，但建議填寫)</span>
                      </h4>
                      
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">介紹人 (若有)</label>
                        <input type="text" name="referral" placeholder="請輸入介紹人姓名" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all bg-white" />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">目前最困擾的問題</label>
                        <textarea name="concern" placeholder="例如：想改善駝背、長期腰痛、想減脂... 我們可以協助您找到最適合的老師！" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all resize-none bg-white" rows="2" />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer w-fit">
                            <input type="checkbox" name="hasMedical" checked={hasMedicalCondition} onChange={e => setHasMedicalCondition(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
                            近期是否有懷孕、開刀、或受傷情況？
                        </label>
                        {hasMedicalCondition && (
                            <input type="text" name="medicalDetails" placeholder="請簡述您的狀況，讓我們為您安排最安全的課程..." className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-all bg-amber-50" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600 flex items-center gap-1">
                           <ClockIcon size={16} className="text-indigo-500" /> 
                           {selectedTeacher === 'all' ? '想預約的開始時間 (由系統為您媒合教練)' : '想預約的開始時間'} 
                           <span className="text-[10px] text-rose-500">(必選)</span>
                        </label>
                        <input type="hidden" name="startTime" value={bookingStartTime} />
                        
                        {/* 升級版：直覺的時間選擇方塊 */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 -mx-1 scrollbar-hide">
                          {availableTimeSlots.map(time => {
                            const isAvailable = checkTimeSlotAvailable(time, bookingDuration, selectedDate, selectedTeacher);
                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={!isAvailable}
                                onClick={() => setBookingStartTime(time)}
                                className={`py-2 rounded-lg text-sm font-bold transition-all border ${
                                  !isAvailable
                                    ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-60'
                                    : bookingStartTime === time
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* 升級版：互動式課程長度選擇卡片 */}
                      <div className="space-y-2 pt-2">
                        <label className="text-sm font-bold text-slate-600 flex items-center gap-1">
                          選擇課程長度 <span className="text-[10px] text-rose-500">(必選)</span>
                        </label>
                        <input type="hidden" name="duration" value={bookingDuration} />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* 60 分鐘 */}
                          <button
                            type="button"
                            onClick={() => setBookingDuration(60)}
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 relative flex flex-col justify-center
                              ${bookingDuration === 60 
                                ? 'border-indigo-600 bg-indigo-50/80 shadow-sm scale-[1.02]' 
                                : 'border-slate-100 hover:border-indigo-200 bg-white hover:bg-slate-50'}`}
                          >
                            <div className={`flex items-center gap-2 font-bold text-lg ${bookingDuration === 60 ? 'text-indigo-700' : 'text-slate-700'}`}>
                              60 分鐘 <ZapIcon className={`w-4 h-4 ${bookingDuration === 60 ? 'text-indigo-500' : 'text-slate-300'}`} />
                            </div>
                            <div className={`text-xs mt-1 font-medium ${bookingDuration === 60 ? 'text-indigo-600' : 'text-slate-500'}`}>
                              快速解決<br className="hidden sm:block"/> (非得必要)
                            </div>
                          </button>

                          {/* 90 分鐘 (主推) */}
                          <button
                            type="button"
                            onClick={() => setBookingDuration(90)}
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-center
                              ${bookingDuration === 90 
                                ? 'border-orange-500 bg-orange-50 shadow-md scale-[1.05] z-10' 
                                : 'border-slate-100 hover:border-orange-200 bg-white hover:bg-slate-50'}`}
                          >
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm flex items-center gap-1">
                              <FlameIcon className="w-3 h-3" /> 最火選擇
                            </div>
                            <div className={`flex items-center gap-2 font-bold text-lg mt-1 ${bookingDuration === 90 ? 'text-orange-700' : 'text-slate-700'}`}>
                              90 分鐘
                            </div>
                            <div className={`text-xs mt-1 font-medium ${bookingDuration === 90 ? 'text-orange-600' : 'text-slate-500'}`}>
                              完整課程<br className="hidden sm:block"/> (推薦配置)
                            </div>
                          </button>

                          {/* 120 分鐘 */}
                          <button
                            type="button"
                            onClick={() => setBookingDuration(120)}
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 relative flex flex-col justify-center
                              ${bookingDuration === 120 
                                ? 'border-indigo-600 bg-indigo-50/80 shadow-sm scale-[1.02]' 
                                : 'border-slate-100 hover:border-indigo-200 bg-white hover:bg-slate-50'}`}
                          >
                            <div className={`flex items-center gap-2 font-bold text-lg ${bookingDuration === 120 ? 'text-indigo-700' : 'text-slate-700'}`}>
                              120 分鐘 <SparklesIcon className={`w-4 h-4 ${bookingDuration === 120 ? 'text-indigo-500' : 'text-slate-300'}`} />
                            </div>
                            <div className={`text-xs mt-1 font-medium ${bookingDuration === 120 ? 'text-indigo-600' : 'text-slate-500'}`}>
                              好好檢視<br className="hidden sm:block"/> (值得考慮)
                            </div>
                          </button>
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98] mt-4 text-lg">
                        {selectedTeacher === 'all' ? '✨ 送出預約 (由系統安排適合教練)' : '✨ 立即預約送出'}
                      </button>
                  </form>
              </div>
            </div>
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
                <input
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="輸入密碼"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-800 outline-none text-center font-bold tracking-widest text-lg bg-slate-50 focus:bg-white transition-colors"
                  required
                  autoFocus
                />
                <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                  驗證並進入後台
                </button>
              </form>
            </div>
          </div>
        )}

        {view === 'admin' && isAdminAuthenticated && (
          <div className="space-y-6 animate-fade-in">
            <div className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                  <img src={logoAdmin} alt="JD Rebuild" className="h-10 md:h-12 object-contain mix-blend-multiply" />
                  老闆管理中心
                </h2>
                <p className="text-slate-500 mt-2">JD，歡迎回來！請選擇要管理的業務板塊。</p>
              </div>
              <button 
                onClick={() => setIsAdminAuthenticated(false)} 
                className="text-sm font-bold text-slate-500 hover:text-slate-800 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-2 self-start md:self-auto"
              >
                <LogOutIcon size={16} /> 鎖定後台並登出
              </button>
            </div>

            {/* 老闆端業務分頁導覽列 */}
            <div className="flex gap-2 overflow-x-auto border-b-2 border-slate-100 pb-px scrollbar-hide">
              <button onClick={() => setAdminTab('courses')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-2 ${adminTab === 'courses' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'}`}>
                🗓️ 約課與教練管理
              </button>
              <button onClick={() => setAdminTab('cooperations')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-2 ${adminTab === 'cooperations' ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'}`}>
                🤝 合作接洽管理
                {contactRequests.filter(c => c.status === 'pending').length > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">{contactRequests.filter(c => c.status === 'pending').length}</span>
                )}
              </button>
              <button onClick={() => setAdminTab('products')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-2 ${adminTab === 'products' ? 'border-orange-500 text-orange-600 bg-orange-50/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'}`}>
                🛒 產品上架管理
              </button>
              <button onClick={() => setAdminTab('system')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-2 ${adminTab === 'system' ? 'border-slate-800 text-slate-800 bg-slate-100/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'}`}>
                ⚙️ 系統資料管理
              </button>
            </div>

            {/* 1. 約課與教練管理板塊 */}
            {adminTab === 'courses' && (
              <div className="space-y-6 animate-fade-in pt-2">
                {/* 新增老闆端教練篩選器 */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    onClick={() => setAdminSelectedTeacher('all')}
                    className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${adminSelectedTeacher === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                  >
                    整間教室 (全部教練)
                  </button>
                  {uniqueTeachers.map(teacher => (
                    <button
                      key={teacher}
                      onClick={() => setAdminSelectedTeacher(teacher)}
                      className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${adminSelectedTeacher === teacher ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                    >
                      {teacher} 個人排課
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                     <h3 className="text-slate-500 text-sm font-medium">總預約堂數</h3>
                     <p className="text-3xl font-bold text-slate-800 mt-2">{adminFilteredApts.length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                     <h3 className="text-slate-500 text-sm font-medium">已報到人次</h3>
                     <p className="text-3xl font-bold text-indigo-600 mt-2">
                       {adminFilteredApts.filter(ap => ap.attended).length}
                     </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                     <h3 className="text-slate-500 text-sm font-medium">未報到人次</h3>
                     <p className="text-3xl font-bold text-amber-500 mt-2">
                       {adminFilteredApts.filter(ap => !ap.attended).length}
                     </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                     <h3 className="text-slate-500 text-sm font-medium">整體出席率</h3>
                     <p className="text-3xl font-bold text-emerald-500 mt-2">
                       {adminFilteredApts.length > 0 ? Math.round((adminFilteredApts.filter(ap => ap.attended).length / adminFilteredApts.length) * 100) : 0}%
                     </p>
                  </div>
                </div>

                {/* 老闆端月曆報表過濾 */}
                <div className="mt-8">
                   <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <ViewCalendarIcon /> {adminSelectedTeacher === 'all' ? '整間教室' : `${adminSelectedTeacher} 個別`}排課與報表總覽
                   </h3>
                   {renderSharedCalendar('admin')}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
                  {adminSelectedDate && (
                    <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-indigo-800">目前正在檢視 {adminSelectedDate} {adminSelectedTeacher !== 'all' ? `(${adminSelectedTeacher})` : ''} 的課程</span>
                      <button onClick={() => setAdminSelectedDate(null)} className="text-xs font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-md shadow-sm border border-indigo-200">取消日期過濾</button>
                    </div>
                  )}
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-sm font-medium text-slate-500">日期與時間</th>
                        <th className="p-4 text-sm font-medium text-slate-500">教練名稱</th>
                        <th className="p-4 text-sm font-medium text-slate-500">學員姓名</th>
                        <th className="p-4 text-sm font-medium text-slate-500">報到狀態</th>
                        <th className="p-4 text-sm font-medium text-slate-500">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {adminFilteredApts
                        .filter(ap => adminSelectedDate ? ap.date === adminSelectedDate : true)
                        .map(ap => (
                        <tr key={ap.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 text-sm text-slate-800 font-bold">
                            {ap.date} {ap.startTime}-{ap.endTime} ({ap.duration}m)
                          </td>
                          <td className="p-4 text-sm text-slate-800 font-medium">
                            {ap.teacherName}
                            <span className="ml-2 text-[10px] text-slate-400 font-normal">
                              ({teacherProfiles[ap.teacherName]?.type === 'fulltime' ? '正職' : '承攬'})
                            </span>
                          </td>
                          <td className="p-4 text-sm font-bold text-slate-700">
                            {ap.studentName}
                            <div className="text-xs font-normal text-slate-400 mt-1 flex items-center gap-1">
                               📞 {ap.phone || '未提供'}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-slate-600">
                             <span className={`px-3 py-1 rounded-md text-xs font-bold border ${
                               ap.attended 
                                 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' 
                                 : 'bg-slate-50 text-slate-500 border-slate-200'
                             }`}>
                               {ap.attended ? '已報到 ✓' : '未報到'}
                             </span>
                          </td>
                          <td className="p-4 text-sm text-slate-600 flex gap-2">
                            <button onClick={() => setEditModal({ isOpen: true, type: 'appointment', data: ap })} className="bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 px-2 py-1.5 rounded text-xs font-bold transition-colors">修改</button>
                            <button onClick={() => handleCancelAppointment(ap.id)} className="bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 px-2 py-1.5 rounded text-xs font-bold transition-colors">取消</button>
                          </td>
                        </tr>
                      ))}
                      {adminFilteredApts.filter(ap => adminSelectedDate ? ap.date === adminSelectedDate : true).length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-slate-400 font-medium bg-slate-50/50">
                            {adminSelectedDate ? '該日期尚無預約資料' : '目前尚無預約資料'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 教練檔案總管 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <StarIcon /> 教練檔案總管 (設定正職/承攬)
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className={`lg:col-span-1 p-5 rounded-xl border transition-colors ${editingProfileName ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-700">{editingProfileName ? `✏️ 編輯 ${editingProfileName} 的資料` : '✨ 新增教練資料'}</h4>
                        {editingProfileName && (
                           <button onClick={cancelProfileEdit} className="text-xs font-bold text-slate-500 hover:text-red-500 bg-white px-2 py-1 rounded shadow-sm">取消編輯</button>
                        )}
                      </div>
                      {/* 使用 key 屬性讓 React 在切換編輯對象時強制重置 form 的 defaultValue */}
                      <form key={editingProfileName || 'new'} onSubmit={handleUpdateProfile} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">教練名稱 (識別欄位)</label>
                          <input type="text" name="profileName" defaultValue={editingProfileName} placeholder="例如：李教練" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-sm outline-none font-medium" required />
                        </div>
                        
                        {/* 新增屬性選擇 */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">聘僱屬性</label>
                            <select name="type" defaultValue={teacherProfiles[editingProfileName]?.type || 'contractor'} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none font-medium">
                              <option value="contractor">承攬人員</option>
                              <option value="fulltime">正職人員</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">入職日期</label>
                            <input type="date" name="hireDate" defaultValue={teacherProfiles[editingProfileName]?.hireDate || new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none font-medium" required />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">主要專長</label>
                          <input type="text" name="specialty" defaultValue={teacherProfiles[editingProfileName]?.specialty || ''} placeholder="例如：重量訓練" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-sm outline-none font-medium" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">給客戶的話 (顯示在預約首頁)</label>
                          <input type="text" name="quote" defaultValue={teacherProfiles[editingProfileName]?.quote || ''} placeholder="例如：我會陪你走到最後！" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-sm outline-none font-medium" />
                        </div>
                        
                        {/* 照片上傳區塊 */}
                        <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                          <label className="text-xs font-bold text-indigo-600 flex items-center gap-1 mb-2"><ImageIcon size={14}/> 教練照片設定</label>
                          
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center">
                               {uploadedPhoto || teacherProfiles[editingProfileName]?.photo ? <img src={uploadedPhoto || teacherProfiles[editingProfileName]?.photo} alt="預覽" className="w-full h-full object-cover" /> : <UserIcon className="text-slate-400" />}
                            </div>
                            <label className="flex-1 text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors border border-indigo-100">
                              上傳照片檔案
                              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                            </label>
                          </div>
                          
                          <input type="url" name="photoUrl" defaultValue={teacherProfiles[editingProfileName]?.photo || ''} placeholder="或輸入照片網址 (https://...)" className="w-full px-3 py-1.5 rounded-md border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-xs outline-none text-slate-500" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">詳細介紹</label>
                          <textarea name="description" defaultValue={teacherProfiles[editingProfileName]?.description || ''} placeholder="輸入教練背景..." rows="2" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-sm outline-none resize-none font-medium" required></textarea>
                        </div>
                        <button type="submit" className={`w-full text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm mt-2 ${editingProfileName ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800 hover:bg-slate-900'}`}>
                          {editingProfileName ? '💾 儲存修改' : '✨ 新增教練'}
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2">
                      <h4 className="font-bold text-slate-700 mb-4">已建檔教練 ({uniqueTeachers.length})</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {uniqueTeachers.map(name => {
                          const profile = teacherProfiles[name];
                          return (
                            <div key={name} className={`p-4 rounded-xl border bg-white shadow-sm flex flex-col gap-3 transition-all relative ${editingProfileName === name ? 'border-indigo-400 ring-2 ring-indigo-50' : 'border-slate-100 hover:shadow-md hover:border-indigo-100'}`}>
                              <div className="absolute top-4 right-4 flex gap-2">
                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${profile.type === 'fulltime' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                   {profile.type === 'fulltime' ? '正職' : '承攬'} ({calculateSeniority(profile.hireDate).text})
                                 </span>
                                 <button onClick={() => loadProfileForEdit(name)} className="bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 p-1 rounded-md transition-colors" title="編輯此教練">
                                   <EditIcon size={14} />
                                 </button>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                   {profile.photo ? <img src={profile.photo} alt={name} className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-2 text-slate-400" />}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-800 break-all">{name}</span>
                                  <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold w-fit mt-1">
                                    {profile.specialty}
                                  </span>
                                </div>
                              </div>
                              {profile.quote && (
                                 <div className="text-xs font-bold text-indigo-600 italic bg-indigo-50/50 p-2 rounded-lg">「{profile.quote}」</div>
                              )}
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 bg-slate-50 p-2 rounded-lg">
                                {profile.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* 2. 合作接洽管理板塊 */}
            {adminTab === 'cooperations' && (
              <div className="space-y-6 animate-fade-in pt-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <MegaphoneIcon /> 企業與活動合作接洽訂單
                  </h3>
                  
                  <div className="space-y-4">
                    {contactRequests.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 font-medium">
                        目前尚無合作接洽案件
                      </div>
                    ) : (
                      contactRequests.map(req => (
                        <div key={req.id} className={`p-5 rounded-2xl border transition-all relative ${
                          req.status === 'pending' ? 'bg-white border-emerald-200 shadow-md ring-1 ring-emerald-50' : 
                          req.status === 'contacted' ? 'bg-slate-50 border-slate-200' : 'bg-slate-100 border-slate-200 opacity-70'
                        }`}>
                          
                          <div className="absolute top-5 right-5 flex items-center gap-2">
                            <select 
                              value={req.status}
                              onChange={(e) => handleUpdateContactStatus(req.id, e.target.value)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none ${
                                req.status === 'pending' ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                                req.status === 'contacted' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 
                                'bg-slate-200 text-slate-600 border-slate-300'
                              }`}
                            >
                              <option value="pending">🔴 待處理</option>
                              <option value="contacted">🔵 已聯繫</option>
                              <option value="completed">⚫ 已結案</option>
                            </select>
                            <button onClick={() => handleDeleteContact(req.id)} className="bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 p-1.5 rounded-md border border-slate-200 shadow-sm transition-colors" title="刪除紀錄">
                              <Trash2Icon size={14} />
                            </button>
                          </div>

                          <div className="flex flex-col md:flex-row gap-5">
                            <div className="md:w-1/3 space-y-2">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-bold">{req.createdAt} 填表</span>
                                 <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
                                   {req.serviceType === 'speech' ? '演講與授課' : req.serviceType === 'sports' ? '賽事防護' : '其他活動'}
                                 </span>
                               </div>
                               <h4 className="font-extrabold text-lg text-slate-800 break-all">{req.companyName}</h4>
                               <p className="text-sm font-bold text-slate-600 flex items-center gap-1">
                                 <UserIcon size={14} /> {req.contactName}
                               </p>
                               <p className="text-sm text-slate-500 font-medium break-all flex flex-col gap-1 mt-2 bg-white p-2 rounded-lg border border-slate-100">
                                 <span>📞 {req.phone}</span>
                                 <span>✉️ {req.email}</span>
                               </p>
                            </div>
                            
                            <div className="md:w-2/3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                               <p className="text-xs font-bold text-slate-500 mb-1 border-b border-slate-100 pb-2 flex items-center gap-2">
                                 <ViewCalendarIcon size={14} className="text-emerald-500"/> 預計活動日期：{req.eventDate || '未提供'}
                               </p>
                               <div className="mt-2 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap flex-1">
                                 {req.details}
                               </div>
                            </div>
                          </div>

                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. 產品上架管理板塊 */}
            {adminTab === 'products' && (
              <div className="space-y-6 animate-fade-in pt-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <PackageIcon /> 產品上架管理
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* 左側：產品表單 */}
                    <div className={`lg:col-span-1 p-5 rounded-xl border transition-colors ${editingProductId ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-700">{editingProductId ? `✏️ 編輯產品` : '✨ 新增產品'}</h4>
                        {editingProductId && (
                           <button onClick={cancelProductEdit} className="text-xs font-bold text-slate-500 hover:text-red-500 bg-white px-2 py-1 rounded shadow-sm">取消編輯</button>
                        )}
                      </div>
                      <form key={editingProductId || 'new-product'} onSubmit={handleUpdateProduct} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">產品名稱</label>
                          <input type="text" name="name" defaultValue={products.find(p=>p.id===editingProductId)?.name || ''} placeholder="例如：築動花生球" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 text-sm outline-none font-medium" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">售價 (NTD)</label>
                          <input type="number" name="price" defaultValue={products.find(p=>p.id===editingProductId)?.price || ''} placeholder="例如：350" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 text-sm outline-none font-medium" required min="0" />
                        </div>
                        
                        <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                          <label className="text-xs font-bold text-orange-600 flex items-center gap-1 mb-2"><ImageIcon size={14}/> 產品圖片設定</label>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center">
                               {(productUploadedPhoto || products.find(p=>p.id===editingProductId)?.photo) ? <img src={productUploadedPhoto || products.find(p=>p.id===editingProductId)?.photo} alt="預覽" className="w-full h-full object-cover" /> : <PackageIcon className="text-slate-400" />}
                            </div>
                            <label className="flex-1 text-center bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors border border-orange-100">
                              上傳圖片檔案
                              <input type="file" accept="image/*" onChange={handleProductPhotoUpload} className="hidden" />
                            </label>
                          </div>
                          <input type="url" name="photoUrl" defaultValue={products.find(p=>p.id===editingProductId)?.photo || ''} placeholder="或輸入圖片網址 (選填)" className="w-full px-3 py-1.5 rounded-md border border-slate-200 focus:ring-2 focus:ring-orange-500 text-xs outline-none text-slate-500" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">產品介紹</label>
                          <textarea name="description" defaultValue={products.find(p=>p.id===editingProductId)?.description || ''} placeholder="輸入產品特色與適用部位..." rows="3" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 text-sm outline-none resize-none font-medium" required></textarea>
                        </div>
                        <button type="submit" className={`w-full text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm mt-2 ${editingProductId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-800 hover:bg-slate-900'}`}>
                          {editingProductId ? '💾 儲存產品' : '✨ 上架新產品'}
                        </button>
                      </form>
                    </div>

                    {/* 右側：產品列表 */}
                    <div className="lg:col-span-2">
                      <h4 className="font-bold text-slate-700 mb-4">已上架產品 ({products.length})</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map(p => (
                          <div key={p.id} className={`p-4 rounded-xl border bg-white shadow-sm flex flex-col gap-3 transition-all relative ${editingProductId === p.id ? 'border-orange-400 ring-2 ring-orange-50' : 'border-slate-100 hover:shadow-md'}`}>
                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                               <button onClick={() => handleEditProduct(p)} className="bg-white hover:bg-orange-50 text-slate-500 hover:text-orange-600 p-1.5 rounded-md shadow-sm border border-slate-200 transition-colors" title="編輯產品">
                                 <EditIcon size={14} />
                               </button>
                               <button onClick={() => handleDeleteProduct(p.id)} className="bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 p-1.5 rounded-md shadow-sm border border-slate-200 transition-colors" title="刪除產品">
                                 <Trash2Icon size={14} />
                               </button>
                            </div>
                            <div className="w-full h-32 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                              <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="flex justify-between items-start mb-1">
                                <h5 className="font-bold text-slate-800 pr-14">{p.name}</h5>
                                <span className="text-sm font-black text-orange-600 shrink-0">NT$ {p.price}</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                {p.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* 4. 系統資料管理板塊 */}
            {adminTab === 'system' && (
              <div className="space-y-6 animate-fade-in pt-2">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <DownloadIcon /> 系統資料管理 (匯入 / 匯出)
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">定期備份系統資料，包含排課、學員名單、教練檔案、產品資訊與合作接洽紀錄，以防資料遺失。</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={handleExportCSV}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-colors text-sm shadow-sm"
                    >
                      <DownloadIcon size={18} /> 匯出排課點名表 (Excel/CSV)
                    </button>
                    
                    <button 
                      onClick={handleExportJSON}
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold transition-colors text-sm shadow-sm"
                    >
                      <DownloadIcon size={18} /> 備份全系統資料 (JSON)
                    </button>

                    <label className="flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-bold transition-colors text-sm shadow-sm cursor-pointer">
                      <UploadIcon size={18} /> 還原歷史備份 (JSON)
                      <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= SHOP VIEW (產品選購) ================= */}
        {view === 'shop' && (
          <div className="space-y-8 animate-fade-in py-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="flex justify-center mb-6">
                <img src={logoShop} alt="築動 Rebuild" className="h-16 md:h-20 object-contain mix-blend-multiply opacity-90" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-4 flex items-center justify-center gap-3">
                <ShoppingCartIcon className="text-orange-500" size={36} /> 築動嚴選產品
              </h2>
              <p className="text-slate-600 leading-relaxed">
                我們精選了最適合居家放鬆與自主訓練的實用工具。搭配教練的專業指導，讓您的身體隨時保持在最佳狀態！
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                  <div className="w-full h-56 bg-slate-50 overflow-hidden relative">
                    <img src={p.photo} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-orange-600 px-3 py-1.5 rounded-full text-sm font-black shadow-sm flex items-center gap-1">
                      <TagIcon size={14} /> NT$ {p.price}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{p.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
                      {p.description}
                    </p>
                    <button onClick={() => showToast(`已將 ${p.name} 加入意願清單，請於下次上課時洽詢櫃台購買喔！`)} className="w-full bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-500 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                      <ShoppingCartIcon size={18} /> 預約購買
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-400 font-medium bg-white rounded-3xl border border-dashed border-slate-200">
                  目前尚未上架任何產品
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= CONTACT VIEW (合作接洽) ================= */}
        {view === 'contact' && (
          <div className="space-y-8 animate-fade-in py-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <img src={logoContact} alt="築動 Rebuild Training Lab" className="w-full max-w-lg mx-auto rounded-3xl shadow-lg mb-8 border border-slate-100" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
                企業與活動合作接洽
              </h2>
              <p className="text-slate-600 leading-relaxed">
                除了個人課程，我們也提供專業的外派服務。無論是企業健康講座、校園研習，還是各類運動賽事的現場防護站，築動專業團隊都能為您量身打造最合適的方案！
              </p>
            </div>

            {/* 服務項目卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-200 transition-colors shadow-sm text-center group">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MegaphoneIcon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">演講與授課</h3>
                <p className="text-sm text-slate-500 font-medium">企業健康講座、校園體適能研習、正確姿勢與防護觀念推廣等知識型授課。</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-200 transition-colors shadow-sm text-center group">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ShieldIcon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">運動賽事防護</h3>
                <p className="text-sm text-slate-500 font-medium">馬拉松、球類聯賽、競技賽事之現場防護站設立，提供賽前貼紮與急性傷害處置。</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-amber-200 transition-colors shadow-sm text-center group">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquareIcon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">其他防護活動</h3>
                <p className="text-sm text-slate-500 font-medium">劇組拍攝隨隊防護、大型戶外活動醫療支援、或其他客製化防護需求。</p>
              </div>
            </div>

            {/* 聯絡表單 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-3xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-indigo-500 to-emerald-400"></div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <SendIcon className="text-emerald-500" /> 填寫合作需求單
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-600 block">單位 / 公司名稱 <span className="text-rose-500">*</span></label>
                    <input type="text" name="companyName" required placeholder="例如：某某科技股份有限公司" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-600 block">聯絡人姓名 <span className="text-rose-500">*</span></label>
                    <input type="text" name="contactName" required placeholder="例如：陳先生" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-600 block">聯絡電話 <span className="text-rose-500">*</span></label>
                    <input type="tel" name="phone" required placeholder="例如：0912-345-678" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-600 block">電子信箱 <span className="text-rose-500">*</span></label>
                    <input type="email" name="email" required placeholder="例如：example@email.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-600 block">需求服務類型 <span className="text-rose-500">*</span></label>
                    <select name="serviceType" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white text-slate-700">
                      <option value="">請選擇...</option>
                      <option value="speech">演講與授課</option>
                      <option value="sports">運動賽事防護</option>
                      <option value="other">其他防護活動</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-600 block">預計活動日期 (選填)</label>
                    <input type="date" name="eventDate" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white text-slate-700" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-600 block">需求詳情說明 <span className="text-rose-500">*</span></label>
                  <textarea name="details" required rows="4" placeholder="請簡述您的活動規模、預計人數、所需時數或任何特殊需求，我們會盡快評估並與您聯繫！" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium resize-none bg-slate-50 focus:bg-white"></textarea>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98] text-lg">
                  送出合作需求
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
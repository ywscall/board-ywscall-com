import { useState } from 'react';
import { SquarePen as PenSquare, Trash2, User, Calendar, Search, Inbox, X, Pin } from 'lucide-react';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Select, SelectItem } from './components/ui/select';
import { cn } from './lib/utils';

const initialNotices = [
  {
    id: '1',
    title: '2024년 하반기 워크샵 일정 안내',
    content: '안녕하세요. 2024년 하반기 팀 워크샵 일정을 안내드립니다. 일시는 11월 15일(금) 오후 2시부터이며, 장소는 별도 공지 예정입니다. 모든 팀원의 참석을 부탁드립니다.',
    author: '김민준',
    createdAt: '2024-10-01T09:00:00.000Z',
    isPinned: true,
    category: '공지',
  },
  {
    id: '2',
    title: '10월 업무 보고서 제출 기한 안내',
    content: '10월 업무 보고서를 10월 31일까지 제출해주시기 바랍니다. 양식은 공유 드라이브의 2024_보고서_양식.xlsx를 사용해 주세요.',
    author: '이서연',
    createdAt: '2024-10-05T14:30:00.000Z',
    isPinned: false,
    category: '업무',
  },
  {
    id: '3',
    title: '사내 카페테리아 메뉴 변경 안내',
    content: '11월부터 카페테리아 메뉴가 일부 변경됩니다. 변경된 메뉴는 다음 주부터 사내 게시판에서 확인하실 수 있습니다.',
    author: '박지호',
    createdAt: '2024-10-08T10:15:00.000Z',
    isPinned: false,
    category: '기타',
  },
  {
    id: '4',
    title: '신규 보안 정책 적용 안내 — 필독',
    content: '전사 보안 강화를 위해 신규 비밀번호 정책이 적용됩니다. 모든 계정의 비밀번호를 10월 20일까지 변경해주시기 바랍니다. 변경하지 않으면 계정이 잠길 수 있습니다.',
    author: '최수아',
    createdAt: '2024-10-10T08:00:00.000Z',
    isPinned: true,
    category: '공지',
  },
  {
    id: '5',
    title: '팀 회식 장소 투표 참여 요청',
    content: '이번 달 팀 회식 장소 선정을 위한 투표에 참여해 주세요. 링크는 팀 채팅방에 공유드렸으며 투표 기한은 10월 14일입니다.',
    author: '정하늘',
    createdAt: '2024-10-12T11:45:00.000Z',
    isPinned: false,
    category: '기타',
  },
];

const CATEGORIES = ['전체', '공지', '업무', '기타'];

const CATEGORY_COLORS = {
  '공지': 'default',
  '업무': 'success',
  '기타': 'secondary',
  '일반': 'secondary',
  '긴급': 'destructive',
};

const FORM_CATEGORIES = ['일반', '긴급', '업무', '공지'];

const INITIAL_FORM = { title: '', author: '', category: '일반', content: '', isPinned: false };
const INITIAL_ERRORS = {};

function formatDate(iso) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function NoticeListPage({ onNavigate }) {
  const [notices, setNotices] = useState(initialNotices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);

  const openModal = () => {
    setIsModalOpen(true);
    requestAnimationFrame(() => setIsModalVisible(true));
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setFormData(INITIAL_FORM);
      setErrors(INITIAL_ERRORS);
    }, 150);
  };

  const handleDelete = (id) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = '제목을 입력해주세요';
    if (!formData.author.trim()) newErrors.author = '작성자를 입력해주세요';
    if (!formData.content.trim()) newErrors.content = '내용을 입력해주세요';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const newNotice = {
      id: String(Date.now()),
      title: formData.title,
      content: formData.content,
      author: formData.author,
      category: formData.category,
      createdAt: new Date().toISOString(),
      isPinned: formData.isPinned,
    };
    setNotices((prev) => [newNotice, ...prev]);
    closeModal();
  };

  const filtered = notices
    .filter((n) => selectedCategory === '전체' || n.category === selectedCategory)
    .filter((n) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.author.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">팀 공지사항</h1>
            <p className="text-sm text-gray-500 mt-0.5">총 {notices.length}개의 공지사항</p>
          </div>
          <Button onClick={openModal}>
            <PenSquare size={16} />
            새 공지 작성
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 shadow-sm">
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="제목 또는 작성자 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-150',
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notice List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Inbox size={48} strokeWidth={1.5} className="mb-3" />
              <p className="text-base font-medium">검색 결과가 없습니다</p>
              <p className="text-sm mt-1">다른 검색어나 카테고리를 선택해보세요</p>
            </div>
          ) : (
            filtered.map((notice) => (
              <div
                key={notice.id}
                className={cn(
                  'rounded-xl border p-5 transition-shadow duration-200 hover:shadow-md cursor-default',
                  notice.isPinned
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-white border-gray-100'
                )}
              >
                <div className="flex items-start gap-2 mb-2 flex-wrap">
                  {notice.isPinned && (
                    <Badge variant="warning" className="shrink-0">
                      <Pin size={10} />
                      고정
                    </Badge>
                  )}
                  <Badge variant={CATEGORY_COLORS[notice.category] || 'secondary'}>
                    {notice.category}
                  </Badge>
                </div>
                <h3
                  className="text-base font-semibold text-gray-900 mb-1.5 cursor-pointer hover:text-blue-600 transition-colors duration-150"
                  onClick={() => onNavigate?.('detail', notice.id)}
                >
                  {notice.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                  {notice.content.length > 80 ? notice.content.slice(0, 80) + '...' : notice.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User size={13} />
                      {notice.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {formatDate(notice.createdAt)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors duration-150 p-1 rounded-md hover:bg-red-50"
                    aria-label="삭제"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center transition-all duration-200',
            isModalVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Box */}
          <div
            className={cn(
              'relative z-10 flex flex-col bg-white rounded-2xl shadow-2xl transition-all duration-200',
              'w-[66vw] min-w-[480px] max-w-[860px]',
              'h-[75vh]',
              isModalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h2 className="text-base font-semibold text-gray-900">새 공지 작성</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700 transition-colors duration-150 p-1 rounded-md hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  제목 <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="공지 제목을 입력하세요"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  error={!!errors.title}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">카테고리</label>
                <Select
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                >
                  {FORM_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  작성자 <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="작성자 이름"
                  value={formData.author}
                  onChange={(e) => handleFieldChange('author', e.target.value)}
                  error={!!errors.author}
                />
                {errors.author && (
                  <p className="text-xs text-red-500 mt-1">{errors.author}</p>
                )}
              </div>

              {/* Pin Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.isPinned}
                  onClick={() => handleFieldChange('isPinned', !formData.isPinned)}
                  className={cn(
                    'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    formData.isPinned ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                      formData.isPinned ? 'translate-x-4' : 'translate-x-0'
                    )}
                  />
                </button>
                <label className="text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleFieldChange('isPinned', !formData.isPinned)}>
                  <Pin size={13} className="inline mr-1 text-amber-500" />
                  상단 고정
                </label>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  내용 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="공지 내용을 입력하세요"
                  rows={6}
                  value={formData.content}
                  onChange={(e) => handleFieldChange('content', e.target.value)}
                  error={!!errors.content}
                />
                {errors.content && (
                  <p className="text-xs text-red-500 mt-1">{errors.content}</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200 shrink-0">
              <Button variant="outline" onClick={closeModal}>
                취소
              </Button>
              <Button onClick={handleSubmit}>
                <PenSquare size={15} />
                등록
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticeListPage;

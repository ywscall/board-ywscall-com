import { useState } from 'react';
import NoticeListPage from './NoticeListPage';

function App() {
  const [page, setPage] = useState('list');
  const [selectedId, setSelectedId] = useState(null);

  const handleNavigate = (targetPage, id) => {
    setPage(targetPage);
    setSelectedId(id || null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {page === 'list' && <NoticeListPage onNavigate={handleNavigate} />}
      {page === 'detail' && (
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            onClick={() => handleNavigate('list')}
            className="text-sm text-blue-600 hover:underline mb-4 block"
          >
            ← 목록으로 돌아가기
          </button>
          <p className="text-gray-500">상세 페이지 준비 중 (ID: {selectedId})</p>
        </div>
      )}
    </div>
  );
}

export default App;

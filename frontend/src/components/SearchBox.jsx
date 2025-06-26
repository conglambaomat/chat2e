import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

export default function SearchBox({ onClose }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const selectedUser = useChatStore((s) => s.selectedUser);
  const searchMessages = useChatStore((s) => s.searchMessages);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await searchMessages(query);
      setResults(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">✕</button>
        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <input
            className="flex-1 border border-gray-300 rounded px-3 py-2 outline-none"
            placeholder="Nhập từ khóa tìm kiếm..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded">Tìm</button>
        </form>
        {loading && <div className="text-center">Đang tìm kiếm...</div>}
        {!loading && results.length > 0 && (
          <ul className="max-h-60 overflow-y-auto">
            {results.map(msg => (
              <li key={msg._id} className="p-2 border-b cursor-pointer hover:bg-sky-100" onClick={() => {
                document.getElementById(`msg-${msg._id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                onClose();
              }}>
                <span className="font-semibold">{msg.senderId === selectedUser._id ? selectedUser.fullName : "Bạn"}:</span> {msg.plainContent || "[Không giải mã được]"}
              </li>
            ))}
          </ul>
        )}
        {!loading && results.length === 0 && query && <div className="text-center text-gray-500">Không tìm thấy tin nhắn phù hợp.</div>}
      </div>
    </div>
  );
}

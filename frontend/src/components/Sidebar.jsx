import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);


  // Modal state
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [showRequests, setShowRequests] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Lấy lời mời kết bạn khi mở modal
  const fetchRequests = async () => {
    if (showRequests) return;
    setShowRequests(true);
    try {
      const res = await fetch("/api/users/friend-requests", { credentials: "include" });
      const data = await res.json();
      setFriendRequests(data);
    } catch {
      setFriendRequests([]);
    }
  };

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-gray-600 flex flex-col transition-all duration-200 bg-gray-300/90">
      <style>
        {`
          .hover-scale:hover { transform: scale(1.02); transition: transform 0.2s ease; }
        `}
      </style>
      <div className="border-b border-gray-600 w-full p-6 relative">
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <Users className="size-8 text-gray-800 drop-shadow-[2px_2px_1px_#00000080]" />
            <span className="font-medium pixel-font text-gray-800 text-3xl">Bạn bè</span>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
              title="Kết bạn mới"
              onClick={() => setShowAddFriend(true)}
            >
              <span style={{ fontSize: 22, fontWeight: "bold" }}>+</span>
            </button>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center relative"
              title="Lời mời kết bạn"
              onClick={fetchRequests}
            >
              <span style={{ fontSize: 18, fontWeight: "bold" }}>!</span>
              {friendRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">{friendRequests.length}</span>
              )}
            </button>
          </div>
        </div>
        <div className="mt-4 hidden lg:flex items-center gap-3">
          <label className="cursor-pointer flex items-center gap-3">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="w-6 h-6 rounded border-gray-600 bg-gray-500 shadow-[inset_0_0_0_1px_#00000030]"
            />
            <span className="pixel-font text-gray-800 text-xl drop-shadow-[1px_1px_1px_#00000080]">
              Show online only
            </span>
          </label>
          <span className="pixel-font text-gray-800 text-lg drop-shadow-[1px_1px_1px_#00000080]">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-4 flex-1">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-4 flex items-center gap-4 transition-colors hover-scale
              ${selectedUser?._id === user._id ? "bg-gray-500/20 ring-2 ring-gray-800/50" : "hover:bg-gray-500/10"}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                // image of users.
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-10 object-cover rounded border-2 border-gray-600 shadow-[2px_2px_0_#00000080]"
                style={{ imageRendering: "pixelated" }}
              />
              {onlineUsers.includes(user._id) && (
                <span
                  // Green circle to indicate online users.
                  className="absolute bottom-0 right-0 size-4 bg-green-600 \
                  rounded-full ring-2 ring-gray-500 shadow-[1px_1px_0_#00000080]"
                />
              )}
              {user.unreadCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-600 text-white text-xs flex items-center justify-center rounded-full z-10 font-bold px-1"
                  style={{ fontFamily: "monospace" }}
                >
                  {user.unreadCount}
                </span>
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium truncate pixel-font text-gray-800 text-2xl drop-shadow-[1px_1px_1px_#00000080]">
                {user.fullName}
              </div>
              <div className="pixel-font text-gray-800 text-xl drop-shadow-[1px_1px_1px_#00000080]">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center pixel-font text-gray-800 text-2xl py-6 drop-shadow-[1px_1px_1px_#00000080]">
            Không có bạn bè nào
          </div>
        )}
      </div>

      {/* Modal kết bạn */}
      {showAddFriend && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg flex flex-col gap-4">
            <h3 className="text-xl font-bold mb-2">Kết bạn mới</h3>
            <input
              type="email"
              placeholder="Nhập email bạn muốn kết bạn"
              value={addEmail}
              onChange={e => setAddEmail(e.target.value)}
              className="border p-2 rounded"
            />
            <div className="flex gap-2 justify-end">
              <button
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={() => setShowAddFriend(false)}
              >Đóng</button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={async () => {
                  if (!addEmail) return;
                  await useChatStore.getState().sendFriendRequest(addEmail);
                  setAddEmail("");
                  setShowAddFriend(false);
                }}
              >Gửi lời mời</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal lời mời kết bạn */}
      {showRequests && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-2">Lời mời kết bạn</h3>
            {friendRequests.length === 0 ? (
              <div>Không có lời mời nào.</div>
            ) : (
              friendRequests.map(fr => (
                <div key={fr._id} className="flex items-center gap-3 border-b py-2">
                  <img src={fr.profilePic || "/avatar.png"} alt="avatar" className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <div className="font-semibold">{fr.fullName}</div>
                    <div className="text-xs text-gray-500">{fr.email}</div>
                  </div>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                    onClick={async () => {
                      await useChatStore.getState().acceptFriendRequest(fr._id);
                      setFriendRequests(friendRequests.filter(f => f._id !== fr._id));
                    }}
                  >Đồng ý</button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={async () => {
                      await useChatStore.getState().declineFriendRequest(fr._id);
                      setFriendRequests(friendRequests.filter(f => f._id !== fr._id));
                    }}
                  >Từ chối</button>
                </div>
              ))
            )}
            <div className="flex justify-end mt-2">
              <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setShowRequests(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
export default Sidebar;
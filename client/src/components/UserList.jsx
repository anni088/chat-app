export default function UserList({ users=[] }) {
  const userList = Array.isArray(users) ? users : [];

  return (
    <div className="user-list">
      <h3>Online ({userList.length})</h3>
      <ul>
        {userList.map((u) => (
          <li key={u}>{u}</li>
        ))}
      </ul>
    </div>
  );
}
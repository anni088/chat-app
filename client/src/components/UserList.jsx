export default function UserList({ users }) {
  return (
    <div className="user-list">
      <h3>Online ({users.length})</h3>
      <ul>
        {users.map((u) => (
          <li key={u}>{u}</li>
        ))}
      </ul>
    </div>
  );
}
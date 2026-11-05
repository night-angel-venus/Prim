import { useNavigate, Link } from "react-router-dom"

function Dashboard() {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user')
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate('/')
    }


  return (
    <div>
        <h1>Dashboard</h1>

        <h1>hello, {user?.name}</h1>

        <div>
            <Link to="/employees">Employees</Link>
        </div>

        <button onClick={handleLogout}>Log out</button>
    </div>
  )
}

export default Dashboard
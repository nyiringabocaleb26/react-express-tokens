// import SideBar from "./mongodb/side"
// import Toppest from "./mongodb/topest"
// import "./mongodb/css/first.css";
import {useState} from 'react';
import axios from 'axios';

function App() {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const handleSubmit = async(e) =>{
    e.preventDefault();
    try {
      let data = {
        'username':username,
        'password':password
      }
      const response = await axios.post('http://localhost:4000/login',data);
      localStorage.setItem('token',response.data.token);
      alert('Login successfully');
    } catch (error) {
      console.error('Login failed',error);
    }

  };
  return(
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input className='border-2 border-slate-300 rounded-md px-4 py-2 outline-dashed' type='username' placeholder='Username' onChange={(e) => setUsername(e.target.value)}/>
      <input className='border-2 border-slate-300 rounded-md px-4 py-2 outline-dashed' type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
      <button type='submit'>Login</button>
    </form>
  ); 
}

export default App;

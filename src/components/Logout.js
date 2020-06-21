import Cookies from "js-cookie";
import axios from "axios";

export default function Logout() {
    if(Cookies.get('token')){
        console.log("hello");
        axios.get("http://localhost:8000/users/me/logout",
            {headers: {'Authorization': 'Bearer ' + Cookies.get('token')}}
        ).then((response) => {
            Cookies.remove('user');
            Cookies.remove('token');
            window.location.replace('/');
        });
    } else window.location.replace('/');
    return null;
}

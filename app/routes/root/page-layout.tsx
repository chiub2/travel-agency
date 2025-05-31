import {Outlet, redirect, useNavigate} from "react-router";
import {getExistingUser, logoutUser, storeUserData} from "~/appwrite/auth";
import {account} from "~/appwrite/client";


export async function clientLoader() {
    try {
        const user = await account.get();

        if(!user.$id) return redirect('/sign-in');

        const existingUser = await getExistingUser(user.$id);
        return existingUser?.$id ? existingUser : await storeUserData();
    } catch (e) {
        console.log('Error fetching user', e)
        return redirect('/sign-in')
    }
}

const PageLayout = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/sign-in');
        
    }
    return (
        <div>
            <button onClick = {handleLogout}
                className="cursor-pointer"
                >
                    <img src = '/assets/icons/logout.svg' 
                    alt = "logout" 
                    className="size-6"
                    />
                </button>
                <button onClick={() => {navigate('/dashboard')}}>
                    dashboard
                </button>
        </div>
    )
}
export default PageLayout
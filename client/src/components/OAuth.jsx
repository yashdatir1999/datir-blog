import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signinSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';


const OAuth = () => {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigation = useNavigate()
    const GoogleHandlerClick = async ()=>{
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({prompt: 'select_account'})
        try {
            const resultsFromGoogle = await signInWithPopup(auth , provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL
                }),
            })
            const data = await res.json()
            if(res.ok){
                dispatch(signinSuccess(data))
                navigation('/')
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={GoogleHandlerClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-3'/>
        Continue with Google
    </Button>
  )
}

export default OAuth
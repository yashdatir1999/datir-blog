import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import 'react-circular-progressbar/dist/styles.css';
import { updateStart , updateSuccess , updateFailure , deleteUserStart , deleteUserSuccess , deleteUserFailure , signoutSuccess} from '../redux/user/userSlice.js'
import {Link} from 'react-router-dom'

const DashProfile = () => {
    const { currentUser , error , loading} = useSelector(state => state.user)
    const [imageFile, setimageFile] = useState(null)
    const [imagefileUrl, setimagefileUrl] = useState(null)
    const [imageFileUploadingProgress, setimageFileUploadingProgress] = useState(null)
    const [ImageFileUploadError, setImageFileUploadError] = useState(null)
    const [imageFileUploading, setimageFileUploading] = useState(false)
    const [updateUserSuccess, setupdateUserSuccess] = useState(null)
    const [updateUserError, setupdateUserError] = useState(null)
    const [showModel, setshowModel] = useState(false)
    const [formData, setformData] = useState({})
    // console.log(imageFileUploadingProgress, ImageFileUploadError)
    const filePickerRef = useRef()
    const dispatch = useDispatch()
    const ImageChangeHandler = (e) => {
        const file = e.target.files[0]
        if (file) {
            setimageFile(file)
            setimagefileUrl(URL.createObjectURL(file))
        }
    }
    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile])
    const uploadImage = async () => {

        // service firebase.storage 
        // {
        //     match /b/{bucket}/o {
        //       match /{allPaths=**} {
        //         allow read;
        //         allow write: if 
        //         request.resource.size < 2 * 1024 * 1024 && 
        //         request.resource.contentType.matches("image/.*");
        //       }
        //     }
        //   }
        setimageFileUploading(true)
        setImageFileUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setimageFileUploadingProgress(progress.toFixed(0))
            },
            (error) => {
                setImageFileUploadError(
                    'Could not upload image (File must be less than 2MB)')
                setimageFileUploadingProgress(null)     
                setimageFile(null)
                setimagefileUrl(null)   
                setimageFileUploading(false)
            },

            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setimagefileUrl(downloadURL)
                    setformData({...formData , profilePicture: downloadURL})
                    setimageFileUploading(false)
                })
            }
        )
    }

    const changeHandler = (e)=>{
        setformData({...formData , [e.target.id]: e.target.value})
    }

    const submitHandler = async (e)=>{
        e.preventDefault()
        setupdateUserError(null)
        if(Object.keys(formData).length === 0){
            setupdateUserError('No Changes made!')
            return
        }
        if(imageFileUploading){
            setupdateUserError('Please wait for image to uploade')
            return
        }
        try {
            dispatch(updateStart())
                const res = await fetch(`/api/user/update/${currentUser._id}` , {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formData)
                })
                const data = await res.json()
                if(!res.ok){
                    dispatch(updateFailure(data.message))
                    setupdateUserError(data.message)
                }else{
                    dispatch(updateSuccess(data))
                    setupdateUserSuccess("User's profile updated successfully")
                }
        } catch (error) {
            dispatch(updateFailure(error.message))
            setupdateUserError(error.message)
        }
    }

    const DeleteUserHandel = async ()=>{
        setshowModel(false)
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`,{
                method: 'DELETE',
            })
            const data = await res.json()
            if(!res.ok){
                dispatch(deleteUserFailure(error.message))
            }else{
                dispatch(deleteUserSuccess(data))
            }
        } catch (error) {
         dispatch(deleteUserFailure(error.message))   
        }
    }
    const signoutHandler = async ()=> {
        try {
            const res = await fetch('/api/user/signout'  , {
                method: "POST"
            })
            const data = await res.json()
            if(!res.ok){
                console.log(data.message)
            }else{
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form onSubmit={submitHandler} className='flex flex-col gap-4'>
                <input type="file" accept='image/*' onChange={ImageChangeHandler} ref={filePickerRef} hidden />
                <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
                    {imageFileUploadingProgress && (
                        <CircularProgressbar value={imageFileUploadingProgress || 0 } text={`${imageFileUploadingProgress}%`} 
                        strokeWidth={5}
                        styles={{
                            root:{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            },
                            path:{
                                stroke: `rgba(62, 152, 199, ${imageFileUploadingProgress / 100})`
                            }
                        }}
                        />
                    )
                    }
                    <img src={imagefileUrl || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadingProgress && imageFileUploadingProgress < 100 && 'opacity-60'}`} />
                </div>

                {ImageFileUploadError && <Alert color='failure'> {ImageFileUploadError} </Alert>}

                <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={changeHandler}/>

                <TextInput type='email' id='email' placeholder='E-mail' defaultValue={currentUser.email} onChange={changeHandler}/>

                <TextInput type='password' id='password' placeholder='Password' onChange={changeHandler}/>

                <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading || imageFileUploading}>
                    {loading ? 'Loading...' : 'Update'}
                </Button>
                {
                    currentUser.isAdmin && (
                        <Link to={'/create-post'}>
                        <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>
                            Create a post
                        </Button>
                        </Link>
                    )
                }
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span onClick={()=>setshowModel(true)} className='cursor-pointer'>Delete Account</span>
                <span onClick={signoutHandler} className='cursor-pointer'>Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert color='success' className='mt-5'>
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color='failure' className='mt-5'>
                    {updateUserError}
                </Alert>
            )}            
            {error && (
                <Alert color='failure' className='mt-5'>
                    {error}
                </Alert>
            )}

            <Modal show={showModel} onClose={()=> setshowModel(false)} popup size='md'>
                <Modal.Header  />
                <Modal.Body>
                    <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure want to delete your account?</h3>
                    <div className='flex justify-center gap-4'>
                        <Button color='failure' onClick={DeleteUserHandel} >Yes, I'm  sure</Button>
                        <Button color='gray' onClick={()=> setshowModel(false)}>No, cancel</Button>
                    </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DashProfile

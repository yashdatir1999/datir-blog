import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart , updateSuccess , updateFailure } from '../redux/user/userSlice.js'


const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user)
    const [imageFile, setimageFile] = useState(null)
    const [imagefileUrl, setimagefileUrl] = useState(null)
    const [imageFileUploadingProgress, setimageFileUploadingProgress] = useState(null)
    const [ImageFileUploadError, setImageFileUploadError] = useState(null)
    const [imageFileUploading, setimageFileUploading] = useState(false)
    const [updateUserSuccess, setupdateUserSuccess] = useState(null)
    const [updateUserError, setupdateUserError] = useState(null)
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

                <Button type='submit' gradientDuoTone='purpleToBlue' outline>Update</Button>
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
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
        </div>
    )
}

export default DashProfile


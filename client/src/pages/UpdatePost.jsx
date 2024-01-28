import React, { useEffect, useState } from 'react'
import {Alert, Button, FileInput, Select, TextInput} from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {useNavigate, useParams} from 'react-router-dom'
import { useSelector } from 'react-redux';

const UpdatePost = () => {
    const [file, setfile] = useState(null)
    const [imageUploadProgress, setimageUploadProgress] = useState(null)
    const [imageUploadError, setimageUploadError] = useState(null)
    const [formData, setformData] = useState({})
    const [publishError, setpublishError] = useState(null)
    const {postId} = useParams()

    const navigate = useNavigate()
    const {currentUser} = useSelector((state)=> state.user)

    useEffect(()=>{
        try {
            const fetchPost = async ()=> {
                const res = await fetch(`/api/post/getposts?postId=${postId}`)
                const data = await res.json()
                if(!res.ok){
                    console.log(data.message)
                    setpublishError(data.message)
                    return
                }
                if(res.ok){
                    setpublishError(null)
                    setformData(data.posts[0])
                }
            }
            fetchPost()

        } catch (error) {
            console.log(error)
        }
    },[postId])
    const uploadImageHandler = async ()=>{
        try {
            if(!file){
                setimageUploadError('Please select an image')
                return
            }
            setimageUploadError(null)
            const storage = getStorage(app)
            const fileName = new Date().getTime()+'-'+file.name
            const storageRef = ref(storage , fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = 
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setimageUploadProgress(progress.toFixed(0))
                },
                (error) => {
                    setimageUploadError('Image upload failed')
                    setimageUploadProgress(null)
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downLoadURL)=> {
                        setimageUploadProgress(null)
                        setimageUploadError(null)
                        setformData({...formData, image: downLoadURL})
                    })
                }
            )
        } catch (error) {
            setimageUploadError('Image upload failed')
            setimageUploadProgress(null)
            console.log(error)
        }
    }
    const submitHandler = async (e) =>{
        e.preventDefault()
        try {
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}` , {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if(!res.ok){
                setpublishError(data.message)
                return
            }
            if(res.ok){
                setpublishError(null)
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            setpublishError('Somthing went wrong')
        }
    }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
        <form className='flex flex-col gap-4' onSubmit={submitHandler}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={(e)=>setformData({...formData , title: e.target.value})} value={formData.title}/>
                <Select onChange={(e)=> setformData({...formData, category: e.target.value})} value={formData.category}>
                    <option value="uncategorized">Select a category</option>
                    <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option>
                    <option value="nextjs">Next.js</option>
                </Select>
            </div>
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <FileInput type='file' accept='image/*' onChange={(e)=> setfile(e.target.files[0])}/>
                    <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={uploadImageHandler} disabled={imageUploadProgress}>
                        {
                            imageUploadProgress ? 
                            <div className='w-16 h-16'>
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                            </div> : 'Upload Image'
                        }
                    </Button>
                </div>
                {imageUploadError && (
                    <Alert color='failure' > {imageUploadError} </Alert>)}
                    {formData.image && (
                        <img src={formData.image} alt="upload" className='w-full h-72  object-cover' />
                    )}
                <ReactQuill value={formData.content} theme='snow' placeholder='Write Somthing...' className='h-72 mb-12 ' required onChange={(value)=> setformData({...formData , content: value})}/>
                <Button type='submit' gradientDuoTone='purpleToPink'>Update post </Button>
                {
                    publishError && <Alert color='failure' className='mt-5'>{publishError}</Alert>
                }
        </form>
    </div>
  )
}

export default UpdatePost
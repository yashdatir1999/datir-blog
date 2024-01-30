import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from 'react-redux';
import {Button, Textarea} from 'flowbite-react'

const Comment = ({comment , onLike , onEdit}) => {
    const [user, setuser] = useState({})
    const [isEditing, setisEditing] = useState(false)
    const [editedContent, seteditedContent] = useState(comment.content)
    const {currentUser} = useSelector((state)=> state.user)
    useEffect(()=>{
        const getUser = async ()=>{
            try {
                const res = await fetch(`/api/user/${comment.userId}`)
                const data = await res.json()
                if(res.ok){
                    setuser(data)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        getUser()
    },[comment])

    const editHandler = ()=>{
        setisEditing(true)
        seteditedContent(comment.content)
    }

    const saveHandler = async() => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}` , {
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                    content: editedContent
                })
            })
            if(res.ok){
                setisEditing(false)
                onEdit(comment , editedContent)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
        <div className='flex-shrink-0 mr-3'>
            <img className='w-10 h-10 rounded-full bg-gray-200 ' src={user.profilePicture} alt={user.username} />
        </div>
        <div className='flex-1'>
            <div className="flex items-center mb-1">
                <span className='font-bolt mr-1 text-xs trancate'>{user ? `@${user.username}`: "anonymous user"}</span>
                <span className='text-gray-500 text-sm'>
                    {moment(comment.createdAt).fromNow()}
                </span>
            </div>
            {isEditing ? (
                <>
                <Textarea className='mb-2' value={editedContent} onChange={(e)=> seteditedContent(e.target.value)}/>
                <div className="flex justify-end gap-2 text-xm">
                    <Button gradientDuoTone='purpleToBlue' size='sm' type='button' onClick={saveHandler}>
                        Save
                    </Button>
                    <Button gradientDuoTone='purpleToBlue' size='sm' type='button' outline onClick={()=> setisEditing(false)}>
                        Cancle
                    </Button>
                </div>
                </>
            ):(
                <>
                
                <p className='text-gray-500 pb-2'>{comment.content}</p>
            <div className="flex items-center pt-2 text-sm border-t dark:border-gray-700 max-w-fit gap-2">
                <button type='button' onClick={()=>onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}><FaThumbsUp className='text-sm'/></button>
                <p className='text-gray-400'>{comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")}</p>
                {
                    currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                        <button type='button' onClick={editHandler} className='text-gray-400 hover:text-blue-500'>
                            Edit
                        </button>
                    )
                }
            </div>
            </>
            )}
        </div>
    </div>
  )
}

export default Comment
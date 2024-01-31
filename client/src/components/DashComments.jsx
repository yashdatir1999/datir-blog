import { Button, Modal, Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { FaCheck, FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom'


const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [comments, setcomments] = useState([])
  const [showMore, setshowMore] = useState(true)
  const [showModel, setshowModel] = useState(false)
  const [commentIdToDelete, setcommentIdToDelete] = useState('')

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments`)
        const data = await res.json()
        if (res.ok) {
          setcomments(data.comments)
          if (data.comments.length < 9) {
            setshowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if (currentUser.isAdmin) {
      fetchComments()
    }
  }, [currentUser._id])

  const showMoreHandler = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      console.log(data)
      if (res.ok) {
        setcomments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setshowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const DeleteCommentHandel = async () =>{
    setshowModel(false)
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`,{
        method: 'DELETE',
      })
      const data = await res.json()
      if(res.ok){
        setcomments((prev)=> prev.filter((comment)=> comment._id !== commentIdToDelete))
        setshowModel(false)
      }else{
        console.log(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar  
     scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
    dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className='divide-y' key={comment._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    {comment.content}
                  </Table.Cell>
                  <Table.Cell>
                    {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>
                    {comment.userId}  
                  </Table.Cell>
                  <Table.Cell>
                    <span onClick={() => {
                      setshowModel(true)
                      setcommentIdToDelete(comment._id)
                    }} className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                  </Table.Cell>
                  
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button onClick={showMoreHandler} className='w-full text-teal-500 self-center text-sm py-7'>
                Show More
              </button>
            )
          }
        </>
      ) : (
        <p>You have no comments yet!</p>
      )}

      <Modal show={showModel} onClose={() => setshowModel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure want to delete this comment?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={DeleteCommentHandel} >Yes, I'm  sure</Button>
              <Button color='gray' onClick={() => setshowModel(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}

export default DashComments

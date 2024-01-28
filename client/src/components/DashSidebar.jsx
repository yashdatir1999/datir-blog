import React, { useEffect, useState } from 'react'
import {Sidebar, SidebarItem} from 'flowbite-react'
import { HiUser , HiArrowSmRight, HiDocumentText, HiOutlineUserGroup} from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const DashSidebar = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const {currentUser} = useSelector(state => state.user)
    const [tab, settab] = useState("")
    useEffect(()=>{
      const urlParams = new URLSearchParams(location.search)
      const tabFromUrl = urlParams.get('tab')
      if(tabFromUrl){
        settab(tabFromUrl)
      }
    },[location.search])
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
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to='/dashboard?tab=profile'>
                <SidebarItem active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin? 'Admin' : 'User'} labelColor='dark' as='div'>
                    Profile
                </SidebarItem>
                </Link>
                {currentUser.isAdmin && 
                <Link to='/dashboard?tab=posts'>
                    <SidebarItem active={tab === 'posts'} icon={HiDocumentText} as='div'>
                        Posts
                    </SidebarItem>
                </Link>
                }
                {currentUser.isAdmin && 
                <Link to='/dashboard?tab=users'>
                    <SidebarItem active={tab === 'users'} icon={HiOutlineUserGroup} as='div'>
                        Users
                    </SidebarItem>
                </Link>
                }
                <SidebarItem icon={HiArrowSmRight} classname='cursor-pointer' onClick={signoutHandler}>
                    Sign Out
                </SidebarItem>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
)
}

export default DashSidebar
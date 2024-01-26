import React, { useEffect, useState } from 'react'
import {Sidebar, SidebarItem} from 'flowbite-react'
import { HiUser , HiArrowSmRight} from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

const DashSidebar = () => {
    const location = useLocation()
    const [tab, settab] = useState("")
    const dispatch = useDispatch()
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
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                <SidebarItem active={tab === 'profile'} icon={HiUser} label={"User"} labelColor='dark' as='div'>
                    Profile
                </SidebarItem>
                </Link>
                <SidebarItem icon={HiArrowSmRight} classname='cursor-pointer' onClick={signoutHandler}>
                    Sign Out
                </SidebarItem>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
)
}

export default DashSidebar
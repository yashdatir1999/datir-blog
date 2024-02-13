import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashPosts from '../components/DashPosts'
import DashUsers from '../components/DashUsers'
import DashComments from '../components/DashComments'
import Dashboardcomp from '../components/DashboardComp'
const Dashboard = () => {
  const location = useLocation()
  const [tab, settab] = useState("")
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl){
      settab(tabFromUrl)
    }
  },[location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Dashboard - Sidebar */}
        <DashSidebar />
      </div>
      {/* Dashboard - profile */}
      {tab === 'profile' && <DashProfile />}
      {/* Dashboard - posts */}
      {tab === 'posts' && <DashPosts />}
      {/* Dashboard - users */}
      {tab === 'users' && <DashUsers />}
      {/* commente */}
      {tab === 'comments' && <DashComments />}
      {/* dashboard comp*/}
      {tab === 'dash' && <Dashboardcomp />}

    </div>
  )
}

export default Dashboard
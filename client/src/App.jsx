import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignUp from './pages/Signup'
import SignIn from './pages/Signin'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRought from './components/PrivateRought'
import OnlyAdminPrivateRought from './components/OnlyAdminPrivateRought'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'

const App = () => {
  return (
    <div>
    <Header />
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/about' element={<About />}/>
      <Route path='/about' element={<About />}/>
      <Route path='/sign-in' element={<SignIn />}/>
      <Route path='/sign-up' element={<SignUp />}/>
      <Route element={<PrivateRought/>} >
      <Route path='/dashboard' element={<Dashboard />}/>
      </Route>
      <Route element={<OnlyAdminPrivateRought/>} >
      <Route path='/create-post' element={<CreatePost />}/>
      <Route path='/update-post/:postId' element={<UpdatePost />}/>
      </Route>
      <Route path='/projects' element={<Projects />}/>
      <Route path='/post/:postSlug' element={<PostPage />}/>
    </Routes>
    <Footer />
    </div>

  )
}

export default App

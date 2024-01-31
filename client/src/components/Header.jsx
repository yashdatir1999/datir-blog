import React, { Children, useEffect, useState } from 'react'
import {Navbar, TextInput , Button, Dropdown, Avatar, DropdownHeader, DropdownItem} from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon , FaSun } from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux'
import { toggleTheam } from '../redux/theam/theamSlice';
import { signoutSuccess } from '../redux/user/userSlice';

const Header = () => {
    const path = useLocation().pathname
    const dispatch = useDispatch()
    const {currentUser} = useSelector(state => state.user)
    const {theam} = useSelector((state)=> state.theam)
    const [searchTerm, setsearchTerm] = useState('')
    const location = useLocation()
    const navigate = useNavigate()
    

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTearm')
        if(searchTermFromUrl){
            setsearchTerm(searchTermFromUrl)
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
    const submitHandler = (e)=>{
        e.preventDefault()
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm' , searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }
    return (
        <Navbar className='border-b-2'>
            <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Datir's</span>Blog
            </Link>
            <form onSubmit={submitHandler}>
                <TextInput 
                    type='text'
                    placeholder='Search...'
                    value={searchTerm}
                    onChange={(e)=>setsearchTerm(e.target.value)}
                    rightIcon={AiOutlineSearch }
                    className='hidden lg:inline'
                />
            </form>
                <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                    <AiOutlineSearch/>
                </Button>
                <div className='flex gap-2 md:order-2'>
                    <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={()=>dispatch(toggleTheam())}>
                        {theam === 'light' ? <FaMoon /> : <FaSun />}
                    </Button>
                    {currentUser ? (

                        <Dropdown 
                         arrowIcon={false} 
                         inline label={
                            <Avatar alt='user' img={currentUser.profilePicture} rounded />
                        }>
                            <DropdownHeader>
                                <span className='block text-sm'>@{currentUser.username}</span>
                                <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                            </DropdownHeader>
                            <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={signoutHandler}>Sign Out</Dropdown.Item>
                        </Dropdown>

                    ) : (
                        <Link to="/sign-in">
                            <Button gradientDuoTone='purpleToBlue' outline>Sign In</Button>
                        </Link>

                    )}
                    <Navbar.Toggle />
                </div>
                    <Navbar.Collapse>
                        <Navbar.Link active={path === "/"} as={'div'}>
                            <Link to="/">Home</Link>
                        </Navbar.Link>
                        <Navbar.Link active={path === "/about"} as={'div'}>
                            <Link to="/about">About</Link>
                        </Navbar.Link>
                        <Navbar.Link active={path === "/projects"} as={'div'}>
                            <Link to="/projects">Projects</Link>
                        </Navbar.Link>
                    </Navbar.Collapse>
        </Navbar>
    )
}

export default Header


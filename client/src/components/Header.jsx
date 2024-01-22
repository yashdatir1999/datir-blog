import React from 'react'
import {Navbar, TextInput} from 'flowbite-react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
        <Navbar className='border-b-2'>
            <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Datir's</span>Blog
            </Link>
            <form>
                <TextInput 
                    type='text'
                    placeholder='Search'
                />
            </form>
        </Navbar>
    )
}

export default Header
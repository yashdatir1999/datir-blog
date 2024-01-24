import { Footer } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsGithub, BsInstagram , BsLinkedin } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

const FooterComp = () => {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
        <div className='w-full max-w-7xl mx-auto'>
            <div className='grid w-full justify-between sm:flex md:grid-col-1'>
                <div className='mt-5'>
                <Link to="/" className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Datir's</span>Blog
            </Link>
                </div>
                <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                    <div>
                    <Footer.Title title='About' />
                    <Footer.LinkGroup col>
                        <Footer.Link
                          href='https://github.com/yashdatir1999?tab=repositories' 
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                            Projects
                        </Footer.Link>
                    </Footer.LinkGroup>
                    <Footer.LinkGroup col>
                        <Footer.Link
                          href='/about' 
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                            Datir's Blog
                        </Footer.Link>
                    </Footer.LinkGroup>
                    </div>
                    <div>
                    <Footer.Title title='Follow Us' />
                    <Footer.LinkGroup col>
                        <Footer.Link
                          href='https://github.com/yashdatir1999' 
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                            GitHub
                        </Footer.Link>
                    </Footer.LinkGroup>
                    <Footer.LinkGroup col>
                        <Footer.Link
                          href='https://www.linkedin.com/in/yashdatir/' 
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                            Linkedin
                        </Footer.Link>
                    </Footer.LinkGroup>
                    </div>
                    <div>
                    <Footer.Title title='Legal' />
                    <Footer.LinkGroup col>
                        <Footer.Link
                          href='#' 
                        >
                            Privacy Policy
                        </Footer.Link>
                    </Footer.LinkGroup>
                    <Footer.LinkGroup col>
                        <Footer.Link
                          href='#' 
                        >
                            Terms &amp; Condition
                        </Footer.Link>
                    </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider />
            <div className='w-full sm:flex sm:items-center sm:justify-between '>
                <Footer.Copyright href='#' by="Datir's Blog" year={new Date().getFullYear()}/>
            <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
                <Footer.Icon href='' icon={BsFacebook}/>
                <Footer.Icon href='' icon={BsInstagram  }/>
                <Footer.Icon href='' icon={BsLinkedin}/>
                <Footer.Icon href='' icon={BsGithub}/>
                <Footer.Icon href='' icon={MdEmail}/>
            </div>
            </div>
        </div>
    </Footer>
  )
}

export default FooterComp
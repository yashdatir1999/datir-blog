import React from 'react'

const About = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className='text-3xl font-semibold text-center my-7'>About Datir's Blog</h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
            Welcome to Datir's Blog! This blog was created by Yash Datir as a personal project to share his thoughts and ideas with the world, Datir is a passionate developer who loves to write about technology, coding, and everything in between  
            </p>
            <p>
            On this blog, you'll and weekly articles and topics on topics such as web developmet and progrianthaing languages. Datir is always learning and exploring new technologies, so be sure to check track often for new content
            </p>
            <p>
            We encourage you to leave comments on our posts and engage with other readers. You can like other people's comments and reply to them as well. We believe that a community of learners can help each other grow and improve
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
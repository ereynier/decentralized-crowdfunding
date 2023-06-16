import React from 'react'
import Project from './Project'

const List = () => {

  const tmp = [
    {
      name: "Project 1",
      description: "This is my awesome project. I need money to make it real. Please help me !",
      goal: 1000,
      deadline: 1692189712,
      owner: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      raised: 504
    },
    {
      name: "Project 2",
      description: "This is my awesome project. I need money to make it real. Please help me !",
      goal: 1000,
      deadline: 1692189712,
      owner: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      raised: 504
    },
    {
      name: "Project 3",
      description: "This is my awesome project. I need money to make it real. Please help me !",
      goal: 1000,
      deadline: 1692189712,
      owner: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      raised: 504
    },
  ]


  return (
    <div className='flex flex-col gap2 w-full'>
      <ul>
        {tmp.map((project, index) => (
          <Project key={index} project={project} />
        ))}
      </ul>
    </div>
  )
}

export default List
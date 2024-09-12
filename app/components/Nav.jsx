import React from 'react'
import Link from 'next/link'

const Nav = () => {
  return (
    <div>
      <nav className="bg-nav p-4">
        <ul className="flex justify-center space-x-4 text-secondary">
          <li>
            <Link className="font-bold hover:text-accent transition duration-300" href="/">CLASSIFICAÇÃO</Link>
          </li>
          <li>
            <Link className="font-bold hover:text-accent transition duration-300" href="/stats">STATS</Link>
          </li>
          <li>
            <Link className="font-bold hover:text-accent transition duration-300" href="/jogos">JOGOS</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Nav

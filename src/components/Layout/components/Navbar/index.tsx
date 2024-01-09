import {
  ClipboardDocumentIcon,
  TagIcon,
  Bars3Icon,
} from '@heroicons/react/24/solid'
import { useState } from 'react'

import './styles.css'
import { AppPath } from 'routes/AppRoutes.types'
import { Link, useLocation } from 'react-router-dom'

enum MenuType {
  Home = 'Home',
  POS = 'PoS',
  Products = 'Products',
  Settings = 'Settings',
}

const Navbar = () => {
  const location = useLocation()
  const buttons = [
    {
      name: MenuType.Products,
      icon: <TagIcon className="Navbar_ButtonIcon" />,
      path: AppPath.Products,
    },
    {
      name: MenuType.Settings,
      icon: <Bars3Icon className="Navbar_ButtonIcon" />,
      path: AppPath.Settings,
    },
  ]

  const defaultActiveButton =
    buttons.find((button) => button.path === location.pathname)?.name ??
    MenuType.Products

  const [activeButton, setActiveButton] = useState(defaultActiveButton)

  return (
    <nav className="Navbar">
      <div className="Navbar_ButtonContainer">
        <a
          href={import.meta.env.VITE_POS_APP_URL}
          className={`Navbar_Button btn`}
        >
          <ClipboardDocumentIcon className="Navbar_ButtonIcon" />
          <p className="text-neautral text-center text-[10px] font-light">
            PoS
          </p>
        </a>
      </div>
      {buttons.map((button) => (
        <div className="Navbar_ButtonContainer" key={button.name}>
          <Link
            to={button.path}
            key={button.name}
            className={`Navbar_Button btn  ${
              activeButton === button.name ? 'Navbar_Button___active' : ''
            }`}
            onClick={() => setActiveButton(button.name)}
          >
            {button.icon}
            <p className="text-neautral text-center text-[10px] font-light">
              {button.name}
            </p>
          </Link>
        </div>
      ))}
    </nav>
  )
}

export default Navbar

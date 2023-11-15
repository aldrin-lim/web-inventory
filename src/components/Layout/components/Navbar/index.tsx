import {
  ClipboardDocumentIcon,
  HomeIcon,
  TagIcon,
} from '@heroicons/react/24/solid'
import { useState } from 'react'

import './styles.css'
import { AppPath } from 'routes/AppRoutes.types'
import { Link } from 'react-router-dom'

enum MenuType {
  Home = 'Home',
  Orders = 'Orders',
  Products = 'Products',
}

const Navbar = () => {
  const buttons = [
    {
      name: MenuType.Home,
      icon: <HomeIcon className="Navbar_ButtonIcon" />,
      path: AppPath.Home,
    },
    {
      name: MenuType.Orders,
      icon: <ClipboardDocumentIcon className="Navbar_ButtonIcon" />,
      path: AppPath.Orders,
    },
    {
      name: MenuType.Products,
      icon: <TagIcon className="Navbar_ButtonIcon" />,
      path: AppPath.Products,
    },
  ]

  const [activeButton, setActiveButton] = useState(MenuType.Products)

  return (
    <nav className="Navbar">
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

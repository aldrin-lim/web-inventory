import { useState } from 'react'
import StaffList from './StaffList'
import SlidingTransition from 'components/SlidingTransition'
import AddStaff from './AddStaff'

enum ActiveScreen {
  None = 'none',
  AddStaff = 'addStaff',
}

const Staff = () => {
  const [screen, setScreen] = useState(ActiveScreen.None)

  const closeScreens = () => {
    setScreen(ActiveScreen.None)
  }

  const onAddStaff = () => {
    setScreen(ActiveScreen.AddStaff)
  }

  return (
    <>
      <StaffList onAddStaff={onAddStaff} />
      <SlidingTransition
        direction="right"
        isVisible={screen === ActiveScreen.AddStaff}
        zIndex={10}
      >
        <AddStaff onClose={closeScreens} />
      </SlidingTransition>
    </>
  )
}

export default Staff

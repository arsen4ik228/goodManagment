import React, { useState } from 'react'
import Header from './Header.jsx'
import icon from '../icon/icon _ delete _ red.svg'

export default function Test() {

    const [openModal, setOpneModal] = useState(false)

    const click = () => {
        setOpneModal(true)
    }
    return (
        <div>
            <Header
                title={'политики'}
                avatar={icon}

                leftIconClick={click}
            >
                Чаты
            </Header>

            {openModal && (
                <div>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam corporis quidem assumenda deleniti impedit, qui vitae repellat aspernatur inventore natus illum facilis autem necessitatibus beatae, voluptas omnis asperiores. Rem, voluptates.
                </div>
            )}

        </div>
    )
}

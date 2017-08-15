import left_1 from './overlay_1_left.png'
import right_1 from './overlay_1_right.png'
import left_2 from './overlay_2_left.png'
import right_3 from './overlay_3_right.png'
import right_4 from './overlay_4_right.png'

const overlayImages = {
    set_1: {
        left: left_1,
        leftStyle: {
            bottom: '-20rem',
            height: '124%'
        },
        right: right_1,
        rightStyle: {
            bottom: '-10rem',
            height: '124%'
        }
    },
    set_2: {
        left: left_2
    },
    set_3: {
        right: right_3,
        rightStyle: {
            right: '-20rem',
            bottom: '-5rem',
            height: '110%'
        }
    },
    set_4: {
        right: right_4,
        rightStyle: {
            right: '-10rem'
        }
    }
}

export default overlayImages

import left_1 from './overlay_1_left.png'
import right_1 from './overlay_1_right.png'
import left_2 from './overlay_2_left.png'
import right_3 from './overlay_3_right.png'
import right_4 from './overlay_4_right.png'
import left_5 from './overlay_5_left.png'
import right_5 from './overlay_5_right.png'
import right_6 from './overlay_6_right.png'
import center_7 from './overlay_7.png'

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
            bottom: '-5rem',
            height: '110%'
        }
    },
    set_4: {
        right: right_4
    },
    set_5: {
        left: left_5,
        leftStyle: {
            left: '7rem',
            bottom: '-8rem',
            height: '110%'
        },
        right: right_5,
        rightStyle: {
            right: '0'
        }
    },
    set_6: {
        right: right_6,
        rightStyle: {
            right: '-10rem',
            height: '95%'
        }
    },
    set_7: {
        center: center_7
    }
}

export default overlayImages

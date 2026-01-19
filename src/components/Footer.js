import React from 'react'
import PropTypes from 'prop-types'

import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import version from '../version.js'

const Footer = (props) => {
    return (
        <Box sx={props.sx}>
            { /* Made in Germany :D */}
            <Box sx={{ mx: 'auto', mt: 0 }}>
                <Typography
                align='center'
                display='block'>
                由 <Link href='https://github.com/cc999g' target='_blank' underline='hover' color='inherit'>Ycccc</Link> 倾情打造 ❤️
                </Typography>
            </Box>

            { /* 版本号 */}
            <Typography
                variant='caption'
                align='center'
                display='block'
                sx={{ color: '#ddd' }}>
                <Link href=https://github.com/cc999g/espwebtool' target='_blank' underline='hover' color='inherit'>{version.name}</Link>
            </Typography>
        </Box>
    )
}

Footer.propTypes = {
    sx: PropTypes.object,
}

export default Footer

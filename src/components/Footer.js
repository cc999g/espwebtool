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
                {/* 【修改1】替换文本为"给我点个star"，链接改为目标GitHub项目地址，并添加悬浮高亮样式 */}
                <Link 
                    href='https://github.com/cc999g/espwebtool' 
                    target='_blank' 
                    underline='hover' 
                    sx={{ 
                        color: 'inherit',
                        '&:hover': { 
                            color: '#165DFF', // 悬浮时变为蓝色高亮
                            fontWeight: 'bold' // 悬浮时加粗
                        } 
                    }}
                >
                    给我点个star
                </Link> ❤️
                </Typography>
            </Box>

            { /* 版本号 */}
            <Typography
                variant='caption'
                align='center'
                display='block'
                sx={{ color: '#ddd' }}>
                {/* 【修改2】修正原代码缺失的左引号语法错误 */}
                <Link href='https://github.com/cc999g/espwebtool' target='_blank' underline='hover' color='inherit'>{version.name}</Link>
            </Typography>
        </Box>
    )
}

Footer.propTypes = {
    sx: PropTypes.object,
}

export default Footer

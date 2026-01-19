import React from 'react'
import PropTypes from 'prop-types'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import UploadIcon from '@mui/icons-material/Upload'
import HelpIcon from '@mui/icons-material/Help'
import StarIcon from '@mui/icons-material/Star' // 引入星星图标

const Header = (props) => {
    return (
        <AppBar
            position='static'
            sx={{
                ...props.sx,
                background: '#0276aa',
            }}
        >
            <Toolbar>
                <UploadIcon />

                <Typography
                    variant='h6'
                    component='h1'
                    noWrap
                    sx={{ 
                        flexGrow: 1,
                        fontFamily: 'Bungee',
                    }}
                >
                    &nbsp;&nbsp;ESP网页烧录工具
                </Typography>

                <Button
                    sx={{ color: '#fff', mx: 0.5 }}
                    href='https://blog.spacehuhn.com/espcomm'
                    target='_blank'
                    endIcon={<HelpIcon />}>
                    帮助
                </Button>

                <Button
                    sx={{ color: '#fff', mx: 0.5 }}
                    href='https://github.com/cc999g'
                    target='_blank'
                    endIcon={<OpenInNewIcon />}>
                    更多工具
                </Button>

                {/* 新增的 Star 按钮 - 调整了间距和样式 */}
                <Button
                    sx={{ 
                        color: '#fff', 
                        mx: 0.5,
                        border: '1px solid #fff', // 加边框突出按钮
                        borderRadius: 1,
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)' // 鼠标悬浮浅背景
                        }
                    }}
                    href='https://github.com/cc999g/espwebtool'
                    target='_blank'
                    endIcon={<StarIcon />}>
                    给我点个star
                </Button>
            </Toolbar>
        </AppBar>
    )
}

Header.propTypes = {
    sx: PropTypes.object,
}

export default Header

import React from 'react'
import PropTypes from 'prop-types'

import Box from '@mui/material/Grid'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import ChromeIcon from '../icons/Chrome'
import EdgeIcon from '../icons/Edge'
import OperaIcon from '../icons/Opera'
import SettingsIcon from '@mui/icons-material/Settings'

const Home = (props) => {
    return (
        <Grid
            container
            spacing={0}
            direction='column'
            alignItems='center'
            justifyContent='center'
        >
            <Grid item xs={3}>

                {props.supported() ?
                    <Box align='center'>
                        <Box>
                            <Button variant='contained' color='success' size='large' onClick={props.connect} sx={{ m: 1 }}>
                                连接
                            </Button>
                        </Box>

                        <Box>
                            <Button size='large' onClick={props.openSettings} sx={{ m: 1, color:'#bebebe' }}>
                                <SettingsIcon />
                            </Button>
                        </Box>

                        <Alert severity='info' align='left'>
                            1. 点击 连接 按钮<br />
                            2. 插入你的 ESP 设备并选择对应的端口<br />
                            3. 添加 .bin 固件文件并设置烧录地址<br />
                            4. 点击 烧录 按钮开始烧录 😊<br />
                        </Alert>
                    </Box>

                    :

                    <Alert severity='warning'>
                        <AlertTitle>你的浏览器不支持网页串口功能 😭</AlertTitle>
                        请尝试使用&nbsp;
                        <a href='https://www.google.com/chrome/' target='blank'>
                            <ChromeIcon fontSize='inherit' /> <b>谷歌浏览器</b>
                        </a>
                        、&nbsp;
                        <a href='https://www.microsoft.com/en-us/edge' target='blank'>
                            <EdgeIcon fontSize='inherit' /> <b>微软浏览器</b>
                        </a>
                        或&nbsp;
                        <a href='https://www.opera.com/' target='blank'>
                            <OperaIcon fontSize='inherit' /> <b>欧朋浏览器</b>
                        </a>
                        <br />
                        （苹果iOS 与 安卓系统的浏览器暂不支持）
                        <br />
                        <br />
                        了解更多关于&nbsp;
                        <a href='https://developer.mozilla.org/en-US/docs/Web/API/Serial#browser_compatibility' target='blank'>
                            浏览器兼容性
                        </a>
                        的内容
                    </Alert>
                }
            </Grid>

        </Grid>
    )
}

Home.propTypes = {
    connect: PropTypes.func,
    supported: PropTypes.func,
    openSettings: PropTypes.func,
}

export default Home

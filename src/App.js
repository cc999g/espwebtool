import React, { useEffect } from 'react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Header from './components/Header'
import Home from './components/Home'
import FileList from './components/FileList'
import Output from './components/Output'
import Buttons from './components/Buttons'
import Settings from './components/Settings'
import ConfirmWindow from './components/ConfirmWindow'
import Footer from './components/Footer'

import { connectESP, formatMacAddr, sleep, loadFiles, supported } from './lib/esp'
import { loadSettings, defaultSettings } from './lib/settings'

const App = () => {
  const [connected, setConnected] = React.useState(false) // 连接状态
  const [connecting, setConnecting] = React.useState(false)
  const [output, setOutput] = React.useState({ time: new Date(), value: '点击“连接设备”开始\n' }) // 串口输出
  const [espStub, setEspStub] = React.useState(undefined) // ESP 烧录器相关
  const [uploads, setUploads] = React.useState([]) // 已上传的文件
  const [settingsOpen, setSettingsOpen] = React.useState(false) // 设置窗口
  const [settings, setSettings] = React.useState({ ...defaultSettings }) // 设置
  const [confirmErase, setConfirmErase] = React.useState(false) // 确认擦除窗口
  const [confirmProgram, setConfirmProgram] = React.useState(false) // 确认烧录窗口
  const [flashing, setFlashing] = React.useState(false) // 按钮启用/禁用状态
  const [chipName, setChipName] = React.useState('') // ESP8266 或 ESP32

  useEffect(() => {
    setSettings(loadSettings())
  }, [])

  // 添加新消息到输出区域
  const addOutput = (msg) => {
    setOutput({
      time: new Date(),
      value: `${msg}\n`,
    })
  }

  // 连接 ESP 并初始化烧录器
  const clickConnect = async () => {
    if (espStub) {
      await espStub.disconnect()
      await espStub.port.close()
      setEspStub(undefined)
      return
    }

    const esploader = await connectESP({
      log: (...args) => addOutput(`${args[0]}`),
      debug: (...args) => console.debug(...args),
      error: (...args) => console.error(...args),
      baudRate: parseInt(settings.baudRate),
    })

    try {
      toast.info('正在连接…', {
        position: 'top-center',
        autoClose: false,
        toastId: 'connecting'
      })
      toast.update('connecting', {
        render: '正在连接…',
        type: toast.TYPE.INFO,
        autoClose: false
      })

      setConnecting(true)

      await esploader.initialize()

      addOutput(`已连接到 ${esploader.chipName}`)
      addOutput(`MAC 地址：${formatMacAddr(esploader.macAddr())}`)

      const newEspStub = await esploader.runStub()

      setConnected(true)
      toast.update('connecting', {
        render: '已连接 🚀',
        type: toast.TYPE.SUCCESS,
        autoClose: 3000
      })

      newEspStub.port.addEventListener('disconnect', () => {
        setConnected(false)
        setEspStub(undefined)
        toast.warning('已断开连接 💔', { position: 'top-center', autoClose: 3000, toastId: 'settings' })
        addOutput(`------------------------------------------------------------`)
      })

      setEspStub(newEspStub)
      setUploads(await loadFiles(esploader.chipName))
      setChipName(esploader.chipName)
    } catch (err) {
      const shortErrMsg = `${err}`.replace('Error: ', '')

      toast.update('connecting', {
        render: shortErrMsg,
        type: toast.TYPE.ERROR,
        autoClose: 3000
      })

      addOutput(`${err}`)

      await esploader.port.close()
      await esploader.disconnect()
    } finally {
      setConnecting(false)
    }
  }

  // 擦除 ESP 闪存
  const erase = async () => {
    setConfirmErase(false)
    setFlashing(true)
    toast(`正在擦除闪存，请稍候…`, { position: 'top-center', toastId: 'erase', autoClose: false })

    try {
      const stamp = Date.now()

      addOutput(`开始擦除`)
      const interval = setInterval(() => {
        addOutput(`正在擦除闪存，请稍候…`)
      }, 3000)

      await espStub.eraseFlash()

      clearInterval(interval)
      addOutput(`完成。耗时 ${Date.now() - stamp} 毫秒。`)
      toast.update('erase', { render: '闪存擦除完成。', type: toast.TYPE.INFO, autoClose: 3000 })
    } catch (e) {
      addOutput(`错误！\n${e}`)
      toast.update('erase', { render: `错误！\n${e}`, type: toast.TYPE.ERROR, autoClose: 3000 })
      console.error(e)
    } finally {
      setFlashing(false)
    }
  }

  // 烧录固件
  const program = async () => {
    setConfirmProgram(false)
    setFlashing(true)

    let success = false

    const toArrayBuffer = (inputFile) => {
      const reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort();
          reject(new DOMException('解析输入文件时出错。'));
        }

        reader.onload = () => {
          resolve(reader.result);
        }
        reader.readAsArrayBuffer(inputFile)
      })
    }

    for (const file of uploads) {
      if (!file.fileName || !file.obj) continue
      success = true

      toast(`正在上传 ${file.fileName.substring(0, 28)}…`, { position: 'top-center', progress: 0, toastId: 'upload' })

      try {
        const contents = await toArrayBuffer(file.obj)

        await espStub.flashData(
          contents,
          (bytesWritten, totalBytes) => {
            const progress = (bytesWritten / totalBytes)
            const percentage = Math.floor(progress * 100)

            toast.update('upload', { progress: progress })

            addOutput(`烧录中… ${percentage}%`)
          },
          parseInt(file.offset, 16)
        )

        await sleep(100)
      } catch (e) {
        addOutput(`错误！`)
        addOutput(`${e}`)
        console.error(e)
      }
    }

    if (success) {
      addOutput(`完成！`)
      addOutput(`请重启设备以运行新固件。`)

      toast.success('烧录完成！请重启 ESP 以运行新固件。', { position: 'top-center', toastId: 'uploaded', autoClose: 3000 })
    } else {
      addOutput(`请添加一个 .bin 固件文件`)

      toast.info('请添加一个 .bin 固件文件', { position: 'top-center', toastId: 'uploaded', autoClose: 3000 })
    }

    setFlashing(false)
  }

  return (
    <Box sx={{ minWidth: '25rem' }}>
      <Header sx={{ mb: '1rem' }} />

      <Grid container spacing={1} direction='column' justifyContent='space-around' alignItems='center' sx={{ minHeight: 'calc(100vh - 116px)' }}>

        {/* 首页（未连接） */}
        {!connected && !connecting &&
          <Grid item>
            <Home
              connect={clickConnect}
              supported={supported}
              openSettings={() => setSettingsOpen(true)}
            />
          </Grid>
        }

        {/* 连接中 */}
        {!connected && connecting &&
          <Grid item>
            <Typography variant='h3' component='h2' sx={{ color: '#aaa' }}>
              正在连接…
            </Typography>
          </Grid>
        }

        {/* 文件上传页面（已连接） */}
        {connected &&
          <Grid item>
            <FileList
              uploads={uploads}
              setUploads={setUploads}
              chipName={chipName}
            />
          </Grid>
        }

        {/* 擦除与烧录按钮 */}
        {connected &&
          <Grid item>
            <Buttons
              erase={() => setConfirmErase(true)}
              program={() => setConfirmProgram(true)}
              disabled={flashing}
            />
          </Grid>
        }

        {/* 串口输出 */}
        {supported() &&
          <Grid item>
            <Output received={output} />
          </Grid>
        }
      </Grid>

      {/* 设置窗口 */}
      <Settings
        open={settingsOpen}
        close={() => setSettingsOpen(false)}
        setSettings={setSettings}
        settings={settings}
        connected={connected}
      />

      {/* 确认擦除窗口 */}
      <ConfirmWindow
        open={confirmErase}
        text={'此操作将擦除 ESP 设备的全部闪存内容。'}
        onOk={erase}
        onCancel={() => setConfirmErase(false)}
      />

      {/* 确认烧录窗口 */}
      <ConfirmWindow
        open={confirmProgram}
        text={'烧录新固件将覆盖当前固件。'}
        onOk={program}
        onCancel={() => setConfirmProgram(false)}
      />

      {/* 提示框容器 */}
      <ToastContainer />

      {/* 页脚 */}
      <Footer sx={{ mt: 'auto' }} />
    </Box>
  )
}

export default App

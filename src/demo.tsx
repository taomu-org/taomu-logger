import React from 'react'
import { messageBox, TaomuApp } from 'taomu-ui'

import { Logger, LoggerData } from '../lib'

export interface DemoProps {}

function upload(message: LoggerData) {
  console.log('upload:' + message.message)
}

const logger = new Logger('logger-id', 'warn', upload, {
  info: messageBox.info,
  success: messageBox.success,
  warn: messageBox.warning,
  error: messageBox.error,
})

const Demo: React.FC<DemoProps> = () => {
  return (
    <TaomuApp>
      <div>
        <div className="flex row center-v gap-12">
          <button onClick={() => logger.log('log message')}>log</button>
          <button onClick={() => logger.info('info message')}>info</button>
          <button onClick={() => logger.warn('warn message')}>warn</button>
          <button onClick={() => logger.error('error message')}>error</button>
        </div>

        <p>弹出toast</p>
        <div className="flex row center-v gap-12">
          <button onClick={() => logger.infoToast('info message')}>info</button>
          <button onClick={() => logger.successToast('success message')}>
            log
          </button>
          <button onClick={() => logger.warnToast('warn message')}>warn</button>
          <button onClick={() => logger.errorToast('error message')}>
            error
          </button>
        </div>

        <p>throw Error</p>
        <div className="flex row center-v gap-12">
          <button
            onClick={() => {
              throw logger.errorToast('error message')
            }}
          >
            error
          </button>
        </div>
      </div>
    </TaomuApp>
  )
}

export default Demo

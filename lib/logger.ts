/**
 * 日志记录器
 */

export type LevelType = 'log' | 'info' | 'warn' | 'error'

export enum LEVEL_ENUM {
  off = 0,
  log = 1,
  info = 2,
  warn = 3,
  error = 4,
}

export interface ConsoleTagOptions {
  level?: LevelType
  label?: string
  labelBackground?: string
  labelColor?: string
  value?: string
  valueBackground?: string
  valueColor?: string
}

export type LoggerTrait = {
  [key in LevelType]: (...args: any[]) => void
}

export interface DataActionsOptions {
  level: LevelType
  message?: string
  detail?: any
  stack?: string
}

export interface LoggerData {
  level: LevelType
  /** 错误消息 */
  message?: string
  /** 调用栈 */
  stack?: string
  /** 详细信息，内容不宜过多 */
  detail?: any
  /** 时间戳 */
  time?: number
}

export class Logger implements LoggerTrait {
  constructor(
    /** 应用标识 */
    public appId: string,
    /** 上传等级 */
    public uploadLevel: LevelType | 'off' = 'error',
    /** 上报回调 */
    public onUpload?: (data: LoggerData) => any,
    /** toast */
    public toast?: {
      info?: (message: string) => void
      success?: (message: string) => void
      warn?: (message: string) => void
      error?: (message: string) => void
    }
  ) {}

  log = (message?: string, ...args: any[]): void => {
    this.baseLog('log', message, ...args)
  }

  info = (message?: string, ...args: any[]): void => {
    this.baseLog('info', message, ...args)
  }
  infoToast = (message?: string, ...args: any[]) => {
    if (message) this.toast?.info?.(message)
    return this.info(message, ...args)
  }
  successToast = (message?: string, ...args: any[]) => {
    if (message) this.toast?.success?.(message)
    return this.info(message, ...args)
  }

  warn = (message?: string, ...args: any[]): Error => {
    this.baseLog('warn', message, ...args)
    return new Error(message)
  }
  warnToast = (message?: string, ...args: any[]) => {
    if (message) this.toast?.warn?.(message)
    return this.warn(message, ...args)
  }

  error = (message?: string, ...args: any[]): Error => {
    this.baseLog('error', message, ...args)
    return new Error(message)
  }
  errorToast = (message?: string, ...args: any[]) => {
    if (message) this.toast?.error?.(message)
    return this.error(message, ...args)
  }

  baseLog = (level: LevelType, message?: string, ...detail: any[]) => {
    console[level].call(this, message, ...detail)
    this.dataActions({ level, message, detail })
  }

  dataActions = ({ level, message, detail, stack }: DataActionsOptions) => {
    if (this.uploadLevel === 'off' || !this.onUpload) return

    const data: LoggerData = {
      level,
      message,
      detail: typeof detail === 'object' ? JSON.stringify(detail) : detail,
      time: Date.now(),
    }

    if (LEVEL_ENUM[level] >= LEVEL_ENUM.error) {
      data.stack = stack || new Error().stack || '未捕获的异常'
    }

    if (LEVEL_ENUM[level] >= LEVEL_ENUM[this.uploadLevel]) {
      this.onUpload(data)
    }
  }

  ////////////////////////////////////////////////////////////////

  /** 在控制台打印一个标签 */
  tag = (options: ConsoleTagOptions | ConsoleTagOptions[], ...args: any[]) => {
    if (!console.log) return
    const opts = Array.isArray(options) ? options : [options]

    let level: LevelType = 'log'
    let template = ''
    const arr: string[] = []

    opts.forEach((option) => {
      const {
        level: levelInput,
        label: key,
        labelColor: keyColor = '#fff',
        labelBackground = '#35495e',
        value,
        valueColor = '#fff',
        valueBackground = '#1970b6',
      } = option

      if (levelInput) {
        level = levelInput
      }

      template += `%c${key}%c${value}`

      arr.push(
        `background:${labelBackground}; padding: 2px 9px 2px 8px; border-radius: 3px 0 0 3px; color: ${keyColor};`,
        `background:${valueBackground}; padding: 2px 8px; border-radius: 0 3px 3px 0; color: ${valueColor};margin-left: -1px; margin-right: 4px;`
      )
    })

    this[level](template, ...arr, ...args)
  }

  private ENV_COLOR_MAP: Record<string, string> = {
    dev: '#f08e43',
    daily: '#5fb553',
    gray: '#999999',
    prod: '#1970b6',
  }

  loadAppTag = (appName: string, appVersion: string, buildEnv: string) => {
    this.tag([
      {
        level: 'info',
        label: appName.toUpperCase(),
        value: 'v' + appVersion + ' | ' + buildEnv.toUpperCase(),
        valueBackground:
          this.ENV_COLOR_MAP[buildEnv!] || this.ENV_COLOR_MAP.daily,
      },
    ])
  }
}

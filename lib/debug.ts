type LogLevel = "info" | "warn" | "error"

interface DebugOptions {
  module: string
  level?: LogLevel
}

export function debugLog(message: string, data: any, options: DebugOptions): void {
  const { module, level = "info" } = options
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] [${module}] [${level.toUpperCase()}]: ${message}`

  switch (level) {
    case "warn":
      console.warn(logMessage, data)
      break
    case "error":
      console.error(logMessage, data)
      break
    default:
      console.log(logMessage, data)
  }
}


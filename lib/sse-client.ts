export class SSEClient {
  private eventSource: EventSource | null = null

  constructor(private url: string) {}

  connect(onMessage: (data: any) => void, onError?: (error: Event) => void) {
    this.eventSource = new EventSource(this.url)

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onMessage(data)
    }

    if (onError) {
      this.eventSource.onerror = onError
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  }
}


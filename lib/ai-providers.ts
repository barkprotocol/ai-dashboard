// Placeholder for AI providers
export const DefaultToolResultRenderer = ({ result }: { result: unknown }) => {
  return <div>Tool Result: {JSON.stringify(result)}</div>
}

export const getToolConfig = (toolName: string) => {
  return {
    isCollapsible: true,
    isExpandedByDefault: false,
    render: undefined,
  }
}


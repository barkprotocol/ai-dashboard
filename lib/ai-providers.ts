// Placeholder for AI providers
export const DefaultToolResultRenderer = ({ result }: { result: unknown }) => {
  return { type: "div", props: { children: `Tool Result: ${JSON.stringify(result)}` } }
}

export const getToolConfig = (toolName: string) => {
  return {
    isCollapsible: true,
    isExpandedByDefault: false,
    render: undefined,
  }
}


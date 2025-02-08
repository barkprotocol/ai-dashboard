"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

interface SavedPrompt {
  id: string
  title: string
  content: string
}

interface SavedPromptsModalProps {
  isOpen: boolean
  onClose: () => void
  savedPrompts: SavedPrompt[]
  setSavedPrompts: (prompts: SavedPrompt[]) => void
}

export function SavedPromptsModal({ isOpen, onClose, savedPrompts, setSavedPrompts }: SavedPromptsModalProps) {
  const [newPromptTitle, setNewPromptTitle] = useState("")
  const [newPromptContent, setNewPromptContent] = useState("")

  const handleSavePrompt = () => {
    if (!newPromptTitle || !newPromptContent) {
      toast.error("Please fill in both title and content")
      return
    }

    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      title: newPromptTitle,
      content: newPromptContent,
    }

    setSavedPrompts([...savedPrompts, newPrompt])
    setNewPromptTitle("")
    setNewPromptContent("")
    toast.success("Prompt saved successfully")
  }

  const handleDeletePrompt = (id: string) => {
    setSavedPrompts(savedPrompts.filter((prompt) => prompt.id !== id))
    toast.success("Prompt deleted successfully")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Saved Prompts</DialogTitle>
          <DialogDescription>
            View and manage your saved prompts. You can add new prompts or delete existing ones.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ScrollArea className="h-[200px] pr-4">
            {savedPrompts.map((prompt) => (
              <div key={prompt.id} className="mb-4 flex items-center justify-between rounded-lg border p-3">
                <div>
                  <h4 className="font-medium">{prompt.title}</h4>
                  <p className="text-sm text-muted-foreground">{prompt.content}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDeletePrompt(prompt.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </ScrollArea>
          <div className="grid gap-2">
            <Input
              placeholder="Prompt Title"
              value={newPromptTitle}
              onChange={(e) => setNewPromptTitle(e.target.value)}
            />
            <Input
              placeholder="Prompt Content"
              value={newPromptContent}
              onChange={(e) => setNewPromptContent(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSavePrompt}>Save Prompt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


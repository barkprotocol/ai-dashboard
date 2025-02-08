"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Star, Pencil, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@/hooks/use-user"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface SavedPrompt {
  id: string
  title: string
  content: string
  is_favorite: boolean
}

interface SavedPromptsSidebarProps {
  onSelectPrompt: (content: string) => void
}

export function SavedPromptsSidebar({ onSelectPrompt }: SavedPromptsSidebarProps) {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([])
  const [search, setSearch] = useState("")
  const { user, isLoading } = useUser()

  useEffect(() => {
    if (user) {
      fetchPrompts()
    }
  }, [user])

  async function fetchPrompts() {
    if (!user) return

    const { data, error } = await supabase
      .from("saved_prompts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching prompts:", error)
      toast.error("Failed to fetch prompts")
    } else {
      setPrompts(data)
    }
  }

  async function handleAddPrompt() {
    if (!user) return

    const { data, error } = await supabase
      .from("saved_prompts")
      .insert({ user_id: user.id, title: "New Prompt", content: "" })
      .single()

    if (error) {
      console.error("Error adding prompt:", error)
      toast.error("Failed to add prompt")
    } else {
      fetchPrompts()
      toast.success("New prompt added")
    }
  }

  async function handleDeletePrompt(id: string) {
    const { error } = await supabase.from("saved_prompts").delete().eq("id", id)

    if (error) {
      console.error("Error deleting prompt:", error)
      toast.error("Failed to delete prompt")
    } else {
      fetchPrompts()
      toast.success("Prompt deleted")
    }
  }

  async function handleToggleFavorite(id: string, isFavorite: boolean) {
    const { error } = await supabase.from("saved_prompts").update({ is_favorite: !isFavorite }).eq("id", id)

    if (error) {
      console.error("Error updating favorite status:", error)
      toast.error("Failed to update favorite status")
    } else {
      fetchPrompts()
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites")
    }
  }

  const filteredPrompts = prompts.filter((prompt) => prompt.title.toLowerCase().includes(search.toLowerCase()))

  if (isLoading) {
    return <div className="w-64 border-r bg-background flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return (
      <div className="w-64 border-r bg-background flex items-center justify-center">
        Please log in to view saved prompts.
      </div>
    )
  }

  return (
    <div className="w-64 border-r bg-background flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Saved Prompts</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {filteredPrompts.map((prompt) => (
          <div key={prompt.id} className="p-2 hover:bg-muted/50 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-medium">{prompt.title}</span>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(prompt.id, prompt.is_favorite)}>
                  <Star className={prompt.is_favorite ? "text-yellow-400 fill-yellow-400" : ""} size={16} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Pencil size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeletePrompt(prompt.id)}>
                  <Trash size={16} />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground truncate mt-1" onClick={() => onSelectPrompt(prompt.content)}>
              {prompt.content}
            </p>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <Button onClick={handleAddPrompt} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> New Prompt
        </Button>
      </div>
    </div>
  )
}


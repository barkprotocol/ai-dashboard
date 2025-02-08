import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Repeat } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface Tweet {
  id: string
  author: {
    name: string
    username: string
    avatar: string
  }
  content: string
  createdAt: string
  likes: number
  retweets: number
}

export const mockTweets: Tweet[] = [
  {
    id: "1",
    author: {
      name: "BARK",
      username: "bark_protocol",
      avatar: "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp",
    },
    content: "Excited to announce our new BARK token on the Solana blockchain! 🚀 #BARKToken #Solana",
    createdAt: "2025-01-29T10:00:00Z",
    likes: 1500,
    retweets: 500,
  },
  {
    id: "2",
    author: {
      name: "Solana",
      username: "solana",
      avatar: "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/solana.webp",
    },
    content: "Welcome BARK AI to the Solana ecosystem! Looking forward to seeing what you build. 🌟 #Solana #Web3",
    createdAt: "2025-01-15T11:30:00Z",
    likes: 2000,
    retweets: 750,
  },
]

function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <div className="border-b border-border last:border-b-0 py-4">
      <div className="flex items-start space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={tweet.author.avatar} alt={tweet.author.name} />
          <AvatarFallback>{tweet.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <p className="text-sm font-semibold">{tweet.author.name}</p>
            <p className="text-sm text-muted-foreground">@{tweet.author.username}</p>
            <span className="text-sm text-muted-foreground">·</span>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
            </p>
          </div>
          <p className="text-sm mt-1">{tweet.content}</p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">Reply</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Repeat className="h-4 w-4" />
              <span className="text-xs">{tweet.retweets}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span className="text-xs">{tweet.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TweetFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Tweets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


import { useEffect, useState } from 'react';
import { MessageCircle, Repeat2, Heart, Bookmark, Share, ChartNoAxesColumn, BadgeCheck, Ellipsis } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { auth } from '@/lib/firebase';

// Define TypeScript interface for the component props
interface TweetCardProps {
  name?: string;
  username?: string;
  tweet?: string;
  images?: string[];
}

// Sample templates for empty tweets
const tweetTemplates = [
  "Just another day in the digital world...",
  "Thinking out loud about tech and possibilities...",
  "Hot take: the future of AI is collaborative, not competitive.",
  "Working on something exciting. Stay tuned! Hello there",
  "What's your favorite programming language and why?",
  "Sometimes the best code is the one you don't write.",
  "Unpopular opinion: dark mode should be the default everywhere.",
  "Coding in silence is my therapy. What's yours?",
  "AI's evolving fast—ready for the next leap?",
  "Bug hunting: the ultimate treasure chase!",
  "Dreaming in binary tonight... 💾",
  "What's one tech trend you can't ignore?",
  "Less code, more impact. Who's with me?",
  "Coffee + keyboard = endless possibilities.",
  "Just pushed a commit. Feels like victory!",
  "Tech's future is open-source. Agree?",
  "One line of code can change everything."
];

export default function TweetCard({ name, username, tweet, images = [] }: TweetCardProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activity, setActivity] = useState(false);
  const [likeCount, setLikeCount] = useState(647);

  // State for user info
  const [displayName, setDisplayName] = useState(name || '');
  const [displayUsername, setDisplayUsername] = useState(username || '');
  const [tweetContent, setTweetContent] = useState(tweet || '');

  useEffect(() => {
    // If name or username is not provided, try to get user info from Firebase
    if (!name || !username) {
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        // Extract email name (part before @) for fallback
        const emailName = currentUser.email ? currentUser.email.split('@')[0] : '';
        
        // Set display name if not provided
        if (!name) {
          // Use Firebase displayName if available, otherwise use email name
          setDisplayName(currentUser.displayName || emailName);
        }
        
        // Set username if not provided
        if (!username) {
          setDisplayUsername(emailName);
        }
      } else {
        // Default fallbacks if not logged in
        if (!name) setDisplayName('Mr. Awesome');
        if (!username) setDisplayUsername('CoolGuy123');
      }
    }
    
    // Set a template tweet if none provided
    if (!tweet) {
      const randomIndex = Math.floor(Math.random() * tweetTemplates.length);
      setTweetContent(tweetTemplates[randomIndex]);
    }
  }, [name, username, tweet]);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleActivity = () => {
    setActivity(!activity);
  }

  // Function to render image grid based on number of images
  const renderImageGrid = () => {
    if (images.length === 0) return null;

    return (
      <div className={`mt-3 rounded-lg overflow-hidden grid ${getGridConfig(images.length)}`}>
        {images.slice(0, 4).map((src, index) => (
          <div 
            key={index} 
            className={`${getAspectRatio(images.length, index)} bg-gray-800 overflow-hidden`}
          >
            <img 
              src={src} 
              alt={`Tweet image ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  // Helper function to determine grid configuration based on image count
  const getGridConfig = (count: number) => {
    switch (count) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2 gap-1";
      case 3: return "grid-cols-2 gap-1";
      case 4: return "grid-cols-2 grid-rows-2 gap-1";
      default: return "grid-cols-2 grid-rows-2 gap-1"; // For more than 4, we'll just show first 4
    }
  }

  // Helper function to determine aspect ratio for each image position
  const getAspectRatio = (count: number, index: number) => {
    if (count === 1) return "aspect-video";
    if (count === 3 && index === 0) return "row-span-2 aspect-square";
    return "aspect-square";
  }

  return (
    <div className="max-w-xl mx-auto bg-black text-white rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4">
        <div className="flex items-start">
          {/* Avatar */}
          <div className="flex-shrink-0 mr-3">
            <div className="w-12 h-12 rounded-full bg-blue-400 overflow-hidden">
              <Avatar className="w-full h-full object-cover" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center">
              <div className="flex items-center flex-1">
                <span className="font-bold h-5 text-white text-xl">{displayName}</span>
                <BadgeCheck className="ml-1 w-4 h-4 text-blue-400" />
                <span className="text-gray-500 ml-1 truncate">@{displayUsername}</span>
                <span className="text-gray-500 mx-1">·</span>
                <span className="text-gray-500">7h</span>
              </div>
              <button className="ml-4 text-gray-500 hover:text-gray-300">
                <Ellipsis />
              </button>
            </div>
            
            {/* Tweet content */}
            <p className="mt-1 text-white text-base">{tweetContent}</p>
            
            {/* Tweet Images */}
            {renderImageGrid()}
            
            {/* Footer - Interaction buttons */}
            <div className="mt-3 flex justify-between text-gray-500">
              <button className="flex items-center group">
                <div className="p-2 rounded-full group-hover:bg-gray-800 group-hover:text-blue-400">
                  <MessageCircle size={18} />
                </div>
                <span className="-ml-1 text-sm group-hover:text-blue-400">118</span>
              </button>
              
              <button className="flex items-center group">
                <div className="p-2 rounded-full group-hover:bg-gray-800 group-hover:text-green-400">
                  <Repeat2 size={18} />
                </div>
                <span className="-ml-1 text-sm group-hover:text-green-400">27</span>
              </button>
              
              <button 
                className={`flex items-center group ${liked ? 'text-pink-600' : ''}`}
                onClick={handleLike}
              >
                <div className={`p-2 rounded-full ${liked ? 'text-pink-600' : 'group-hover:bg-gray-800 group-hover:text-pink-600'}`}>
                  <Heart size={18} fill={liked ? "currentColor" : "none"} />
                </div>
                <span className={`-ml-1 text-sm ${liked ? 'text-pink-600' : 'group-hover:text-pink-600'}`}>
                  {likeCount}
                </span>
              </button>
              
              <button 
                className={`flex items-center group ${activity ? 'text-blue-400' : ''}`}
                onClick={handleActivity}
              >
                <div className={`p-2 rounded-full ${activity ? 'text-blue-400' : 'group-hover:bg-gray-800 group-hover:text-blue-400'}`}>
                  <ChartNoAxesColumn size={18} fill={activity ? "currentColor" : "none"} />
                </div>
                <span className={`-ml-1 text-sm ${activity ? 'text-blue-400' : 'group-hover:text-blue-400'}`}> 47K </span>
              </button>

              <div className="flex space-x-1">
                <button 
                  className={`flex items-center group ${bookmarked ? 'text-blue-400' : ''}`}
                  onClick={handleBookmark}
                >
                  <div className={`p-2 rounded-full ${bookmarked ? 'text-blue-400' : 'group-hover:bg-gray-800 group-hover:text-blue-400'}`}>
                    <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
                  </div>
                </button>
                
                <button className="flex items-center group">
                  <div className="p-2 rounded-full group-hover:bg-gray-800 group-hover:text-blue-400">
                    <Share size={18} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


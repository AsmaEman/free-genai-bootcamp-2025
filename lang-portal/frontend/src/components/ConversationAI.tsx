
import { useState, useEffect } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  translation?: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  audio?: string | null;
}

interface ConversationAIProps {
  topic: string;
  onMessageReceived: (message: Message) => void;
}

interface TopicData {
  responses: string[];
  translations: Record<string, string>;
}

// Sample Arabic responses based on topics
const topicData: Record<string, TopicData> = {
  greetings: {
    responses: [
      "مرحباً! كيف حالك اليوم؟",
      "أهلاً بك! اسمي هو المساعد العربي، ما هو اسمك؟",
      "السلام عليكم! سعيد بلقائك.",
      "صباح الخير! هل أنت جديد في تعلم اللغة العربية؟",
    ],
    translations: {
      "مرحباً! كيف حالك اليوم؟": "Hello! How are you today?",
      "أهلاً بك! اسمي هو المساعد العربي، ما هو اسمك؟": "Welcome! My name is the Arabic assistant, what's your name?",
      "السلام عليكم! سعيد بلقائك.": "Peace be upon you! Nice to meet you.",
      "صباح الخير! هل أنت جديد في تعلم اللغة العربية؟": "Good morning! Are you new to learning Arabic?",
    }
  },
  daily: {
    responses: [
      "ماذا تفعل عادة في الصباح؟",
      "متى تستيقظ عادة؟",
      "هل تحب القهوة في الصباح؟",
      "ما هي خططك لهذا اليوم؟",
    ],
    translations: {
      "ماذا تفعل عادة في الصباح؟": "What do you usually do in the morning?",
      "متى تستيقظ عادة؟": "When do you usually wake up?",
      "هل تحب القهوة في الصباح؟": "Do you like coffee in the morning?",
      "ما هي خططك لهذا اليوم؟": "What are your plans for today?",
    }
  },
  food: {
    responses: [
      "ما هو طعامك العربي المفضل؟",
      "هل جربت الكوشري من قبل؟",
      "هل تفضل الحلويات العربية؟",
      "أنا أحب الفلافل والحمص، وأنت؟",
    ],
    translations: {
      "ما هو طعامك العربي المفضل؟": "What is your favorite Arabic food?",
      "هل جربت الكوشري من قبل؟": "Have you tried Koshari before?",
      "هل تفضل الحلويات العربية؟": "Do you prefer Arabic sweets?",
      "أنا أحب الفلافل والحمص، وأنت؟": "I like falafel and hummus, what about you?",
    }
  },
  travel: {
    responses: [
      "هل زرت أي دولة عربية من قبل؟",
      "أين تود السفر في العالم العربي؟",
      "كيف يمكنني الوصول إلى المتحف؟",
      "هل تستطيع إرشادي إلى أقرب محطة مترو؟",
    ],
    translations: {
      "هل زرت أي دولة عربية من قبل؟": "Have you visited any Arab country before?",
      "أين تود السفر في العالم العربي؟": "Where would you like to travel in the Arab world?",
      "كيف يمكنني الوصول إلى المتحف؟": "How can I get to the museum?",
      "هل تستطيع إرشادي إلى أقرب محطة مترو؟": "Can you guide me to the nearest metro station?",
    }
  },
};

export const ConversationAI = ({ topic, onMessageReceived }: ConversationAIProps) => {
  const { toast } = useToast();

  // Function to get a random response for the current topic
  const getRandomResponse = (): Message => {
    const currentTopic = topicData[topic] || topicData.greetings;
    const randomIndex = Math.floor(Math.random() * currentTopic.responses.length);
    const text = currentTopic.responses[randomIndex];
    
    return {
      id: Date.now().toString(),
      text,
      translation: currentTopic.translations[text] || "Translation not available",
      sender: 'assistant',
      timestamp: new Date(),
    };
  };

  // Simulate AI response to a user message
  const generateResponse = (userMessage: string): void => {
    // Here you would normally send the user message to an API
    // For now, we'll just return a random response
    
    // Simulate processing delay
    setTimeout(() => {
      const response = getRandomResponse();
      onMessageReceived(response);
    }, 1000);
  };

  return null; // This is a utility component, no UI to render
};

export default ConversationAI;

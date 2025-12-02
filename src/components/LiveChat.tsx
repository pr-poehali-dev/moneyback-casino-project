import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface LiveChatProps {
  username: string;
}

export default function LiveChat({ username }: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      username: 'Игрок_7834',
      text: 'Только что выиграл 5000₽ на Dice! 🎉',
      timestamp: '14:23',
      isOwn: false
    },
    {
      id: '2',
      username: 'VIP_Андрей',
      text: 'Кто играет в Mines? Делимся стратегиями',
      timestamp: '14:25',
      isOwn: false
    },
    {
      id: '3',
      username: 'Lucky_Girl',
      text: 'Рулетка огонь сегодня! Все на красное 🔥',
      timestamp: '14:27',
      isOwn: false
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      username,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const botMessages = [
        'Только что сорвал куш! 💰',
        'Кто-нибудь пробовал стратегию Мартингейла?',
        'Mines сегодня щедрые, проверено!',
        'Активировал промокод START100, работает! 🎁',
        'Уже 15 уровень, иду к Diamond VIP! 💎',
        'Dice с множителем x5 зашел отлично'
      ];

      const botUsernames = [
        'Игрок_' + Math.floor(Math.random() * 10000),
        'VIP_Player',
        'GoldenBet',
        'CasinoKing',
        'LuckyWinner',
        'ProGamer'
      ];

      const botMessage: Message = {
        id: Date.now().toString(),
        username: botUsernames[Math.floor(Math.random() * botUsernames.length)],
        text: botMessages[Math.floor(Math.random() * botMessages.length)],
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isOwn: false
      };

      setMessages(prev => [...prev.slice(-20), botMessage]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="p-4 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="MessageSquare" size={20} className="text-primary" />
          <h3 className="font-semibold">Живой чат</h3>
        </div>
        <Badge variant="outline" className="gap-1">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          {Math.floor(Math.random() * 500) + 200} онлайн
        </Badge>
      </div>

      <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  msg.isOwn
                    ? 'bg-primary/20 rounded-2xl rounded-br-sm'
                    : 'bg-secondary/50 rounded-2xl rounded-bl-sm'
                } p-3`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold ${msg.isOwn ? 'text-primary' : 'text-foreground'}`}>
                    {msg.username}
                  </span>
                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          placeholder="Написать сообщение..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="gradient-primary"
        >
          <Icon name="Send" size={18} />
        </Button>
      </div>
    </Card>
  );
}

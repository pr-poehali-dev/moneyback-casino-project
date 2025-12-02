import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [balance, setBalance] = useState(5000);
  const [level, setLevel] = useState(12);
  const [xp, setXp] = useState(3450);
  const [vipTier, setVipTier] = useState('Gold');
  
  const [diceTarget, setDiceTarget] = useState(50);
  const [diceBet, setDiceBet] = useState(100);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [diceWin, setDiceWin] = useState<boolean | null>(null);
  
  const [minesBet, setMinesBet] = useState(100);
  const [minesCount, setMinesCount] = useState(3);
  const [minesGrid, setMinesGrid] = useState<(boolean | null)[]>(Array(25).fill(null));
  const [minesGameActive, setMinesGameActive] = useState(false);
  const [minesProfit, setMinesProfit] = useState(0);
  
  const [dailyLimit, setDailyLimit] = useState(10000);
  const [withdrawLimit, setWithdrawLimit] = useState(5000);
  const [todayBets, setTodayBets] = useState(2340);
  
  const [promoCode, setPromoCode] = useState('');

  const playDice = () => {
    if (diceBet > balance) return;
    
    const result = Math.floor(Math.random() * 100) + 1;
    const won = result > diceTarget;
    
    setDiceResult(result);
    setDiceWin(won);
    
    if (won) {
      const multiplier = 100 / (100 - diceTarget);
      const profit = Math.floor(diceBet * multiplier);
      setBalance(balance + profit - diceBet);
      setXp(xp + 10);
    } else {
      setBalance(balance - diceBet);
      setXp(xp + 5);
    }
    
    setTodayBets(todayBets + diceBet);
  };

  const startMines = () => {
    if (minesBet > balance) return;
    setBalance(balance - minesBet);
    setMinesGameActive(true);
    setMinesGrid(Array(25).fill(null));
    setMinesProfit(0);
  };

  const clickMinesTile = (index: number) => {
    if (!minesGameActive || minesGrid[index] !== null) return;
    
    const isMine = Math.random() < (minesCount / (25 - minesGrid.filter(x => x !== null).length));
    const newGrid = [...minesGrid];
    newGrid[index] = !isMine;
    setMinesGrid(newGrid);
    
    if (isMine) {
      setMinesGameActive(false);
      setMinesProfit(0);
    } else {
      const revealed = newGrid.filter(x => x === true).length;
      const multiplier = Math.pow(1.3, revealed);
      setMinesProfit(Math.floor(minesBet * multiplier));
    }
  };

  const cashoutMines = () => {
    setBalance(balance + minesProfit);
    setXp(xp + 15);
    setMinesGameActive(false);
    setTodayBets(todayBets + minesBet);
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'START100') {
      setBalance(balance + 100);
      setPromoCode('');
      alert('Промокод активирован! +100₽ на баланс');
    } else {
      alert('Неверный промокод');
    }
  };

  const renderNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
      <div className="max-w-6xl mx-auto flex justify-around items-center">
        {[
          { id: 'home', icon: 'Home', label: 'Главная' },
          { id: 'games', icon: 'Gamepad2', label: 'Игры' },
          { id: 'wallet', icon: 'Wallet', label: 'Кошелек' },
          { id: 'profile', icon: 'User', label: 'Профиль' },
          { id: 'support', icon: 'MessageCircle', label: 'Поддержка' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === item.id 
                ? 'text-primary scale-110' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={item.icon} size={24} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="space-y-6 pb-24 animate-fade-in">
      <div className="gradient-primary p-6 rounded-2xl glow-primary">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm">Баланс счета</p>
            <h1 className="text-4xl font-bold text-white">{balance.toLocaleString()}₽</h1>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
            <Icon name="TrendingUp" size={32} className="text-white" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-white text-primary hover:bg-white/90"
            onClick={() => setActiveTab('wallet')}
          >
            <Icon name="Plus" size={18} />
            Пополнить
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20"
            onClick={() => setActiveTab('wallet')}
          >
            <Icon name="ArrowDown" size={18} />
            Вывести
          </Button>
        </div>
      </div>

      <Card className="p-6 gradient-card border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">VIP статус: {vipTier}</h3>
            <p className="text-sm text-muted-foreground">Уровень {level}</p>
          </div>
          <Badge className="gradient-gold text-white border-0 px-4 py-2">
            <Icon name="Crown" size={16} />
            VIP
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Прогресс</span>
            <span className="font-medium">{xp} / 5000 XP</span>
          </div>
          <Progress value={(xp / 5000) * 100} className="h-3" />
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-4">Популярные игры</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="p-6 cursor-pointer hover:scale-105 transition-transform gradient-card border-primary/20"
            onClick={() => setActiveTab('games')}
          >
            <div className="bg-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Icon name="Dices" size={32} className="text-primary" />
            </div>
            <h3 className="font-semibold text-center">Dice</h3>
            <p className="text-xs text-muted-foreground text-center mt-1">Классика</p>
          </Card>
          
          <Card 
            className="p-6 cursor-pointer hover:scale-105 transition-transform gradient-card border-primary/20"
            onClick={() => setActiveTab('games')}
          >
            <div className="bg-destructive/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Icon name="Bomb" size={32} className="text-destructive" />
            </div>
            <h3 className="font-semibold text-center">Mines</h3>
            <p className="text-xs text-muted-foreground text-center mt-1">Сапёр</p>
          </Card>
        </div>
      </div>

      <Card className="p-6 gradient-card border-accent/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-accent/20 p-3 rounded-xl">
            <Icon name="Gift" size={24} className="text-accent" />
          </div>
          <div>
            <h3 className="font-semibold">Промокод START100</h3>
            <p className="text-sm text-muted-foreground">Бонус 100₽ для новых игроков</p>
          </div>
        </div>
        <Button 
          className="w-full gradient-success text-white border-0"
          onClick={() => setActiveTab('profile')}
        >
          Активировать
        </Button>
      </Card>
    </div>
  );

  const renderGames = () => (
    <div className="space-y-6 pb-24 animate-fade-in">
      <h1 className="text-3xl font-bold">Игры</h1>
      
      <Tabs defaultValue="dice" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="dice" className="data-[state=active]:glow-primary">
            <Icon name="Dices" size={18} />
            Dice
          </TabsTrigger>
          <TabsTrigger value="mines" className="data-[state=active]:glow-danger">
            <Icon name="Bomb" size={18} />
            Mines
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dice" className="space-y-4">
          <Card className="p-6 gradient-card border-primary/20">
            <h3 className="text-xl font-bold mb-4">🎲 Dice Game</h3>
            
            <div className="space-y-6">
              <div>
                <Label className="text-sm mb-2 block">Ставка</Label>
                <Input
                  type="number"
                  value={diceBet}
                  onChange={(e) => setDiceBet(Number(e.target.value))}
                  className="text-lg font-semibold"
                  min={10}
                  max={balance}
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Цель: выше {diceTarget}</Label>
                <Slider
                  value={[diceTarget]}
                  onValueChange={([value]) => setDiceTarget(value)}
                  min={1}
                  max={99}
                  step={1}
                  className="my-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1</span>
                  <span className="text-primary font-semibold">{diceTarget}</span>
                  <span>99</span>
                </div>
              </div>

              <div className="bg-secondary/50 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Шанс победы</span>
                  <span className="font-semibold">{100 - diceTarget}%</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Множитель</span>
                  <span className="font-semibold text-primary">x{(100 / (100 - diceTarget)).toFixed(2)}</span>
                </div>
              </div>

              {diceResult !== null && (
                <Card className={`p-6 text-center ${diceWin ? 'bg-accent/20 border-accent' : 'bg-destructive/20 border-destructive'}`}>
                  <div className="text-6xl font-bold mb-2">{diceResult}</div>
                  <div className={`text-xl font-semibold ${diceWin ? 'text-accent' : 'text-destructive'}`}>
                    {diceWin ? '🎉 Победа!' : '💔 Проигрыш'}
                  </div>
                </Card>
              )}

              <Button 
                onClick={playDice}
                className="w-full h-14 text-lg font-bold gradient-primary glow-primary"
                disabled={diceBet > balance || diceBet < 10}
              >
                <Icon name="Play" size={24} />
                Играть
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="mines" className="space-y-4">
          <Card className="p-6 gradient-card border-destructive/20">
            <h3 className="text-xl font-bold mb-4">💣 Mines Game</h3>
            
            {!minesGameActive ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm mb-2 block">Ставка</Label>
                  <Input
                    type="number"
                    value={minesBet}
                    onChange={(e) => setMinesBet(Number(e.target.value))}
                    className="text-lg font-semibold"
                    min={10}
                    max={balance}
                  />
                </div>

                <div>
                  <Label className="text-sm mb-2 block">Количество мин: {minesCount}</Label>
                  <Slider
                    value={[minesCount]}
                    onValueChange={([value]) => setMinesCount(value)}
                    min={1}
                    max={10}
                    step={1}
                    className="my-4"
                  />
                </div>

                <Button 
                  onClick={startMines}
                  className="w-full h-14 text-lg font-bold bg-destructive hover:bg-destructive/90 glow-danger"
                  disabled={minesBet > balance || minesBet < 10}
                >
                  <Icon name="Play" size={24} />
                  Начать игру
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-secondary/50 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Текущий профит</span>
                    <span className="text-2xl font-bold text-accent">+{minesProfit}₽</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {minesGrid.map((tile, idx) => (
                    <button
                      key={idx}
                      onClick={() => clickMinesTile(idx)}
                      disabled={tile !== null}
                      className={`aspect-square rounded-lg font-bold text-2xl transition-all ${
                        tile === null 
                          ? 'bg-secondary hover:bg-secondary/70 hover:scale-105' 
                          : tile === true
                          ? 'bg-accent/20 border-2 border-accent scale-95'
                          : 'bg-destructive/20 border-2 border-destructive scale-95'
                      }`}
                    >
                      {tile === true && '💎'}
                      {tile === false && '💣'}
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={cashoutMines}
                  className="w-full h-14 text-lg font-bold gradient-success"
                  disabled={minesProfit === 0}
                >
                  <Icon name="DollarSign" size={24} />
                  Забрать {minesProfit}₽
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-6 pb-24 animate-fade-in">
      <h1 className="text-3xl font-bold">Кошелек</h1>

      <Card className="p-6 gradient-primary glow-primary">
        <div className="text-center">
          <p className="text-white/80 text-sm mb-2">Доступно</p>
          <h2 className="text-5xl font-bold text-white mb-6">{balance.toLocaleString()}₽</h2>
          
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl mb-4">
            <div className="flex items-center gap-3">
              <Icon name="CreditCard" size={24} className="text-white" />
              <div className="text-left flex-1">
                <p className="text-white text-sm font-medium">Виртуальная карта</p>
                <p className="text-white/70 text-xs">**** **** **** 8492</p>
              </div>
              <Badge className="bg-white/20 text-white border-0">Active</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 gradient-card border-accent/20">
          <div className="text-center">
            <div className="bg-accent/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Icon name="ArrowDown" size={28} className="text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Пополнить</h3>
            <Button className="w-full gradient-success">
              <Icon name="Plus" size={18} />
              Внести
            </Button>
          </div>
        </Card>

        <Card className="p-6 gradient-card border-primary/20">
          <div className="text-center">
            <div className="bg-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Icon name="ArrowUp" size={28} className="text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Вывести</h3>
            <Button className="w-full gradient-primary">
              <Icon name="Send" size={18} />
              Вывод
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Icon name="History" size={20} />
          История транзакций
        </h3>
        <div className="space-y-3">
          {[
            { type: 'win', amount: 450, game: 'Dice', time: '10:45' },
            { type: 'loss', amount: -200, game: 'Mines', time: '10:32' },
            { type: 'win', amount: 680, game: 'Dice', time: '10:15' },
            { type: 'deposit', amount: 5000, game: 'Пополнение', time: '09:30' }
          ].map((tx, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  tx.type === 'win' ? 'bg-accent/20' : 
                  tx.type === 'deposit' ? 'bg-primary/20' : 'bg-destructive/20'
                }`}>
                  <Icon 
                    name={tx.type === 'win' ? 'TrendingUp' : tx.type === 'deposit' ? 'ArrowDown' : 'TrendingDown'} 
                    size={20}
                    className={
                      tx.type === 'win' ? 'text-accent' : 
                      tx.type === 'deposit' ? 'text-primary' : 'text-destructive'
                    }
                  />
                </div>
                <div>
                  <p className="font-medium">{tx.game}</p>
                  <p className="text-xs text-muted-foreground">{tx.time}</p>
                </div>
              </div>
              <span className={`font-semibold ${
                tx.amount > 0 ? 'text-accent' : 'text-destructive'
              }`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}₽
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6 pb-24 animate-fade-in">
      <Card className="p-6 gradient-card border-primary/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-3xl font-bold text-white glow-primary">
            {level}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Игрок #{Math.floor(Math.random() * 10000)}</h2>
            <Badge className="gradient-gold text-white border-0 mt-2">
              <Icon name="Crown" size={14} />
              {vipTier} VIP
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Уровень</span>
            <span className="font-semibold">{level}</span>
          </div>
          <Progress value={(xp / 5000) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">{xp} / 5000 XP до уровня {level + 1}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          Статистика
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/50 p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-accent">156</p>
            <p className="text-sm text-muted-foreground mt-1">Побед</p>
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-destructive">89</p>
            <p className="text-sm text-muted-foreground mt-1">Проигрышей</p>
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-primary">64%</p>
            <p className="text-sm text-muted-foreground mt-1">Win Rate</p>
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-accent">+12.4K</p>
            <p className="text-sm text-muted-foreground mt-1">Профит</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Icon name="Users" size={20} />
          Реферальная программа
        </h3>
        <div className="bg-secondary/50 p-4 rounded-xl mb-4">
          <p className="text-sm text-muted-foreground mb-2">Ваша реферальная ссылка</p>
          <div className="flex gap-2">
            <Input 
              value="moneyback.casino/ref/AB12CD" 
              readOnly 
              className="flex-1"
            />
            <Button variant="outline">
              <Icon name="Copy" size={18} />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">8</p>
            <p className="text-xs text-muted-foreground">Рефералов</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">+2,450₽</p>
            <p className="text-xs text-muted-foreground">Заработано</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Icon name="Gift" size={20} />
          Промокод
        </h3>
        <div className="space-y-3">
          <Input
            placeholder="Введите промокод"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="text-center text-lg font-semibold"
          />
          <Button 
            onClick={applyPromo}
            className="w-full gradient-success"
            disabled={!promoCode}
          >
            Активировать промокод
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            💡 Попробуйте: START100
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} />
          Лимиты и безопасность
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label>Дневной лимит ставок</Label>
              <span className="font-semibold">{dailyLimit}₽</span>
            </div>
            <Slider
              value={[dailyLimit]}
              onValueChange={([value]) => setDailyLimit(value)}
              min={1000}
              max={50000}
              step={1000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Сегодня поставлено: {todayBets}₽ / {dailyLimit}₽
            </p>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between mb-2">
              <Label>Лимит вывода в день</Label>
              <span className="font-semibold">{withdrawLimit}₽</span>
            </div>
            <Slider
              value={[withdrawLimit]}
              onValueChange={([value]) => setWithdrawLimit(value)}
              min={1000}
              max={25000}
              step={1000}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Двухфакторная аутентификация</Label>
              <p className="text-xs text-muted-foreground">Дополнительная защита</p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6 pb-24 animate-fade-in">
      <h1 className="text-3xl font-bold">Поддержка</h1>

      <Card className="p-6 gradient-card border-primary/20">
        <div className="text-center">
          <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Icon name="Headphones" size={40} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Онлайн поддержка 24/7</h3>
          <p className="text-muted-foreground mb-4">Мы всегда готовы помочь вам</p>
          <Button className="w-full gradient-primary glow-primary">
            <Icon name="MessageCircle" size={18} />
            Начать чат
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center hover:scale-105 transition-transform cursor-pointer">
          <Icon name="Mail" size={32} className="text-primary mx-auto mb-2" />
          <p className="text-sm font-medium">Email</p>
          <p className="text-xs text-muted-foreground mt-1">support@moneyback.casino</p>
        </Card>
        
        <Card className="p-4 text-center hover:scale-105 transition-transform cursor-pointer">
          <Icon name="Send" size={32} className="text-primary mx-auto mb-2" />
          <p className="text-sm font-medium">Telegram</p>
          <p className="text-xs text-muted-foreground mt-1">@moneyback_bot</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Часто задаваемые вопросы</h3>
        <div className="space-y-3">
          {[
            { q: 'Как пополнить баланс?', a: 'Перейдите в раздел Кошелек и нажмите Пополнить' },
            { q: 'Как вывести средства?', a: 'Минимальная сумма вывода - 100₽' },
            { q: 'Как работает VIP программа?', a: 'Играйте и получайте XP для повышения уровня' },
            { q: 'Безопасно ли это?', a: 'Да, все данные защищены SSL шифрованием' }
          ].map((faq, idx) => (
            <Card key={idx} className="p-4 bg-secondary/30">
              <p className="font-medium mb-1">{faq.q}</p>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary p-3 rounded-2xl glow-primary">
              <Icon name="Sparkles" size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">MONEY-BACK</h1>
              <p className="text-sm text-muted-foreground">Online Casino</p>
            </div>
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Icon name="Bell" size={20} />
          </Button>
        </div>

        {activeTab === 'home' && renderHome()}
        {activeTab === 'games' && renderGames()}
        {activeTab === 'wallet' && renderWallet()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'support' && renderSupport()}
      </div>

      {renderNavigation()}
    </div>
  );
}
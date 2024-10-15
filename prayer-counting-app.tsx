import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, HelpCircle, LogIn, LogOut, UserPlus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const PrayerCountingApp = () => {
  const [prayerCount, setPrayerCount] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsLoggedIn(true);
      loadPrayerCount(JSON.parse(user).username);
    }
  }, []);

  const loadPrayerCount = (username) => {
    const userData = localStorage.getItem(username);
    if (userData) {
      setPrayerCount(JSON.parse(userData).prayerCount);
    } else {
      setPrayerCount(0);
    }
  };

  const savePrayerCount = () => {
    if (currentUser) {
      localStorage.setItem(currentUser.username, JSON.stringify({ ...currentUser, prayerCount }));
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      savePrayerCount();
    }
  }, [prayerCount, isLoggedIn]);

  const addPrayer = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setPrayerCount(prev => prev + 1);
      setIsFlipping(false);
    }, 300);
  };

  const usePrayer = () => {
    if (prayerCount > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setPrayerCount(prev => prev - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handleLogin = () => {
    const userData = localStorage.getItem(username);
    if (userData) {
      const user = JSON.parse(userData);
      if (user.password === password) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        loadPrayerCount(username);
        setError('');
      } else {
        setError('Incorrect password');
      }
    } else {
      setError('User not found');
    }
  };

  const handleSignup = () => {
    if (username && password) {
      if (!localStorage.getItem(username)) {
        const newUser = { username, password, prayerCount: 0 };
        localStorage.setItem(username, JSON.stringify(newUser));
        setCurrentUser(newUser);
        setIsLoggedIn(true);
        setPrayerCount(0);
        setError('');
      } else {
        setError('Username already exists');
      }
    } else {
      setError('Please enter both username and password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPrayerCount(0);
    setUsername('');
    setPassword('');
    localStorage.removeItem('currentUser');
  };

  const resetAllData = () => {
    localStorage.clear();
    handleLogout();
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-yellow-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-yellow-800">Prayer Counter</CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoggedIn ? (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex space-x-2">
                <Button onClick={handleLogin} className="flex-1">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
                <Button onClick={handleSignup} className="flex-1">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Button>
              </div>
              {error && <Alert variant="destructive">{error}</Alert>}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <div className="text-lg font-semibold">Welcome, {currentUser.username}!</div>
              <div className={`text-6xl font-bold text-yellow-600 transition-all duration-300 ${isFlipping ? 'transform rotate-y-180' : ''}`}>
                {prayerCount}
              </div>
              <div className="flex space-x-4">
                <Button onClick={addPrayer} className="bg-green-500 hover:bg-green-600">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Prayer
                </Button>
                <Button onClick={usePrayer} className="bg-blue-500 hover:bg-blue-600">
                  <MinusCircle className="mr-2 h-4 w-4" /> Use Prayer
                </Button>
              </div>
              <Button onClick={() => setShowInstructions(!showInstructions)} variant="outline" className="mt-4">
                <HelpCircle className="mr-2 h-4 w-4" /> How to Use
              </Button>
              {showInstructions && (
                <Alert>
                  <AlertTitle>Instructions</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      <li>Click "Add Prayer" to increase your prayer count by one.</li>
                      <li>Click "Use Prayer" to decrease your prayer count by one.</li>
                      <li>Your prayer count is automatically saved to your account.</li>
                      <li>Enjoy the flip animation when adding or using prayers!</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex space-x-2">
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Reset All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all user accounts and prayer data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={resetAllData}>Reset All Data</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrayerCountingApp;

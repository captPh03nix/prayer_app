import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';

const PrayerCountingApp = () => {
  const [prayerCount, setPrayerCount] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const rotation = new Animated.Value(0);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await AsyncStorage.getItem('currentUser');
      if (user) {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
        setIsLoggedIn(true);
        loadPrayerCount(parsedUser.username);
      }
    } catch (e) {
      console.error('Failed to load user', e);
    }
  };

  const loadPrayerCount = async (username) => {
    try {
      const userData = await AsyncStorage.getItem(username);
      if (userData) {
        setPrayerCount(JSON.parse(userData).prayerCount);
      } else {
        setPrayerCount(0);
      }
    } catch (e) {
      console.error('Failed to load prayer count', e);
    }
  };

  const savePrayerCount = async () => {
    if (currentUser) {
      try {
        await AsyncStorage.setItem(currentUser.username, JSON.stringify({ ...currentUser, prayerCount }));
      } catch (e) {
        console.error('Failed to save prayer count', e);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      savePrayerCount();
    }
  }, [prayerCount, isLoggedIn]);

  const flipAnimation = () => {
    Animated.sequence([
      Animated.timing(rotation, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(rotation, { toValue: 0, duration: 150, useNativeDriver: true })
    ]).start();
  };

  const addPrayer = () => {
    flipAnimation();
    setPrayerCount(prev => prev + 1);
  };

  const usePrayer = () => {
    if (prayerCount > 0) {
      flipAnimation();
      setPrayerCount(prev => prev - 1);
    }
  };

  const handleLogin = async () => {
    try {
      const userData = await AsyncStorage.getItem(username);
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
    } catch (e) {
      console.error('Login failed', e);
      setError('Login failed');
    }
  };

  const handleSignup = async () => {
    if (username && password) {
      try {
        const existingUser = await AsyncStorage.getItem(username);
        if (!existingUser) {
          const newUser = { username, password, prayerCount: 0 };
          await AsyncStorage.setItem(username, JSON.stringify(newUser));
          setCurrentUser(newUser);
          setIsLoggedIn(true);
          setPrayerCount(0);
          setError('');
        } else {
          setError('Username already exists');
        }
      } catch (e) {
        console.error('Signup failed', e);
        setError('Signup failed');
      }
    } else {
      setError('Please enter both username and password');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      setIsLoggedIn(false);
      setCurrentUser(null);
      setPrayerCount(0);
      setUsername('');
      setPassword('');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const resetAllData = async () => {
    Alert.alert(
      "Reset All Data",
      "Are you sure? This will delete all user accounts and prayer data.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "OK", 
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              handleLogout();
            } catch (e) {
              console.error('Reset failed', e);
            }
          }
        }
      ]
    );
  };

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Prayer Counter</Text>
      {!isLoggedIn ? (
        <View style={styles.authContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Icon name="log-in" size={20} color="#fff" />
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Icon name="user-plus" size={20} color="#fff" />
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      ) : (
        <View style={styles.loggedInContainer}>
          <Text style={styles.welcomeText}>Welcome, {currentUser.username}!</Text>
          <Animated.Text style={[styles.prayerCount, { transform: [{ rotateY: spin }] }]}>
            {prayerCount}
          </Animated.Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={addPrayer}>
              <Icon name="plus-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Add Prayer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.useButton]} onPress={usePrayer}>
              <Icon name="minus-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Use Prayer</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={[styles.button, styles.instructionsButton]} 
            onPress={() => setShowInstructions(!showInstructions)}
          >
            <Icon name="help-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>How to Use</Text>
          </TouchableOpacity>
          {showInstructions && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>• Click "Add Prayer" to increase your count</Text>
              <Text style={styles.instructionsText}>• Click "Use Prayer" to decrease your count</Text>
              <Text style={styles.instructionsText}>• Your count is automatically saved</Text>
              <Text style={styles.instructionsText}>• Enjoy the flip animation!</Text>
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
              <Icon name="log-out" size={20} color="#fff" />
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetAllData}>
              <Icon name="trash-2" size={20} color="#fff" />
              <Text style={styles.buttonText}>Reset All Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#854d0e',
    marginBottom: 20,
  },
  authContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#d97706',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d97706',
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  loggedInContainer: {
    width: '100%',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  prayerCount: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#b45309',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#22c55e',
  },
  useButton: {
    backgroundColor: '#3b82f6',
  },
  instructionsButton: {
    backgroundColor: '#8b5cf6',
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#6b7280',
  },
  resetButton: {
    backgroundColor: '#ef4444',
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default PrayerCountingApp;

import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';

export default function MatchTracker() {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  const [nomA, setNomA] = useState('PSG');
  const [nomB, setNomB] = useState('BARÇA');

  const [coachA, setCoachA] = useState('Luis Enrique');
  const [coachB, setCoachB] = useState('Hansi Flick');

  const [buts, setButs] = useState([]);
  const [cartonsA, setCartonsA] = useState([]);
  const [cartonsB, setCartonsB] = useState([]);

  const [temps, setTemps] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState('Configuration');

  // Logos des équipes (URLs officielles haute qualité)
  const logoA = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1pKgSs6sXCCUeKdgZYn5Hza7EsyYgtow7A&s';
  const logoB = 'https://upload.wikimedia.org/wikipedia/fr/thumb/a/a1/Logo_FC_Barcelona.svg/1280px-Logo_FC_Barcelona.svg.png';

  useEffect(() => {
    let timer;
    if (running) timer = setInterval(() => setTemps(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);

  const minutes = String(Math.floor(temps / 60)).padStart(2, '0');
  const secondes = String(temps % 60).padStart(2, '0');

  const playSound = async (type) => {
    let url = '';
    if (type === 'but') url = 'https://www.soundjay.com/soccer/sounds/soccer-crowd-cheer-01.mp3';
    if (type === 'jaune') url = 'https://www.soundjay.com/button/sounds/button-10.mp3';
    if (type === 'rouge') url = 'https://www.soundjay.com/button/sounds/button-4.mp3';

    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { volume: 1.0, shouldPlay: true }
    );

    await sound.playAsync();
  };

  const ajouterBut = (equipe) => {
    if (equipe === 'A') setScoreA(s => s + 1);
    else setScoreB(s => s + 1);

    Vibration.vibrate(120);
    playSound('but');

    setButs(prev => [
      ...prev,
      {
        type: 'but',
        equipe,
        minute: `${minutes}:${secondes}`,
        nom: equipe === 'A' ? nomA : nomB,
      },
    ]);
  };

  const ajouterCarton = (equipe, type) => {
    if (type === 'jaune') playSound('jaune');
    if (type === 'rouge') playSound('rouge');

    const event = { type, minute: `${minutes}:${secondes}` };

    if (equipe === 'A') setCartonsA(prev => [...prev, event]);
    else setCartonsB(prev => [...prev, event]);
  };

  const historique = [
    ...buts,
    ...cartonsA.map(c => ({ ...c, nom: nomA })),
    ...cartonsB.map(c => ({ ...c, nom: nomB })),
  ];

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>⚽ MATCH LIVE</Text>
      <Text style={styles.live}>🔴 {phase}</Text>
      <Text style={styles.referee}>Arbitre : Clément Turpin</Text>

      {/* BLOC SCORE AVEC LOGOS */}
      <View style={styles.scoreBox}>

        {/* Équipe A */}
        <View style={styles.teamBlock}>
          <Image
            source={{ uri: logoA }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.teamBig}>{nomA}</Text>
          <Text style={styles.coachText}>{coachA}</Text>
        </View>

        {/* Score + Chrono */}
        <View style={styles.centerBlock}>
          <Text style={styles.score}>{scoreA} - {scoreB}</Text>
          <Text style={styles.timer}>{minutes}:{secondes}</Text>
        </View>

        {/* Équipe B */}
        <View style={styles.teamBlock}>
          <Image
            source={{ uri: logoB }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.teamBig}>{nomB}</Text>
          <Text style={styles.coachText}>{coachB}</Text>
        </View>

      </View>

      {/* BOUTONS CHRONO */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.blackBtn} onPress={() => { setRunning(true); setPhase('1ère MT'); }}>
          <Text style={styles.btnText}>START</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.blackBtn} onPress={() => { setRunning(false); setPhase('Pause'); }}>
          <Text style={styles.btnText}>PAUSE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.blackBtn} onPress={() => { setRunning(true); setPhase('2ème MT'); }}>
          <Text style={styles.btnText}>2MT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.blackBtn} onPress={() => { setRunning(false); setPhase('Terminé'); }}>
          <Text style={styles.btnText}>FIN</Text>
        </TouchableOpacity>
      </View>

      {/* BUTS */}
      <Text style={styles.sectionTitle}>⚽ Buts</Text>
      <View style={styles.goalButtons}>
        <TouchableOpacity style={styles.goalBtn} onPress={() => ajouterBut('A')}>
          <Image source={{ uri: logoA }} style={styles.btnLogo} resizeMode="contain" />
          <Text style={styles.btnText}>But {nomA}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.goalBtn} onPress={() => ajouterBut('B')}>
          <Image source={{ uri: logoB }} style={styles.btnLogo} resizeMode="contain" />
          <Text style={styles.btnText}>But {nomB}</Text>
        </TouchableOpacity>
      </View>

      {/* CARTONS PSG */}
      <Text style={styles.sectionTitle}>🟨🟥 Cartons {nomA}</Text>
      <View style={styles.goalButtons}>
        <TouchableOpacity style={styles.goalBtn} onPress={() => ajouterCarton('A', 'jaune')}>
          <Text style={{ color: '#000', fontWeight: 'bold' }}>🟨 {nomA}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.goalBtn} onPress={() => ajouterCarton('A', 'rouge')}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>🟥 {nomA}</Text>
        </TouchableOpacity>
      </View>

      {/* CARTONS BARÇA */}
      <Text style={styles.sectionTitle}>🟨🟥 Cartons {nomB}</Text>
      <View style={styles.goalButtons}>
        <TouchableOpacity style={styles.goalBtn} onPress={() => ajouterCarton('B', 'jaune')}>
          <Text style={{ color: '#000', fontWeight: 'bold' }}>🟨 {nomB}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.goalBtn} onPress={() => ajouterCarton('B', 'rouge')}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>🟥 {nomB}</Text>
        </TouchableOpacity>
      </View>

      {/* HISTORIQUE */}
      <Text style={styles.sectionTitle}>📋 Historique</Text>
      <View style={styles.historyBox}>
        {historique.length === 0 && (
          <Text style={styles.historyEmpty}>Aucun événement pour le moment.</Text>
        )}
        {historique.map((event, i) => (
          <Text key={i} style={styles.historyText}>
            {event.type === 'but'
              ? `⚽ ${event.nom} - ${event.minute}`
              : event.type === 'jaune'
              ? `🟨 ${event.nom} - ${event.minute}`
              : `🟥 ${event.nom} - ${event.minute}`}
          </Text>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', padding: 15, paddingTop: 60 },

  title: { color: '#39FF14', fontSize: 30, fontWeight: 'bold', textAlign: 'center' },

  live: { color: 'red', textAlign: 'center', marginBottom: 5 },

  referee: { color: '#aaa', textAlign: 'center', marginBottom: 10 },

  /* Score box : logo + nom + score côte à côte */
  scoreBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0d0d0d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#39FF14',
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginVertical: 15,
  },

  teamBlock: {
    alignItems: 'center',
    flex: 1,
  },

  logo: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },

  teamBig: {
    color: '#39FF14',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },

  coachText: {
    color: '#888',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 3,
  },

  centerBlock: {
    alignItems: 'center',
    flex: 1,
  },

  score: {
    color: '#39FF14',
    fontSize: 40,
    fontWeight: 'bold',
  },

  timer: { color: '#fff', marginTop: 6, fontSize: 14 },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },

  blackBtn: {
    backgroundColor: '#000',
    padding: 10,
    width: '23%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#39FF14',
  },

  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },

  sectionTitle: { color: '#39FF14', marginTop: 15, fontSize: 18 },

  goalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    gap: 8,
  },

  goalBtn: {
    backgroundColor: '#0d0d0d',
    borderColor: '#39FF14',
    borderWidth: 1,
    padding: 10,
    width: '48%',
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },

  btnLogo: {
    width: 22,
    height: 22,
  },

  historyBox: {
    backgroundColor: '#0d0d0d',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },

  historyText: { color: '#ddd', marginBottom: 4 },

  historyEmpty: { color: '#555', fontStyle: 'italic' },
});
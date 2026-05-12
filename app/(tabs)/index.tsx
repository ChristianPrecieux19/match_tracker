import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MatchTracker() {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  const [nomA, setNomA] = useState('PSG');
  const [nomB, setNomB] = useState('Barcelone');

  const [coachA, setCoachA] = useState('Luis Enrique');
  const [coachB, setCoachB] = useState('Hans Dieter Flick');

  const [buts, setButs] = useState([]);
  const [cartons, setCartons] = useState([]);

  // TEMPS EN SECONDES
  const [temps, setTemps] = useState(0);

  const [running, setRunning] = useState(false);

  const [phase, setPhase] = useState('Configuration');

  // CHRONO
  useEffect(() => {
    let timer;

    if (running) {
      timer = setInterval(() => {
        setTemps((t) => t + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [running]);

  // FORMAT 00:00
  const minutes = Math.floor(temps / 60)
    .toString()
    .padStart(2, '0');

  const secondes = (temps % 60)
    .toString()
    .padStart(2, '0');

  const ajouterBut = useCallback(
    (equipe) => {
      if (equipe === 'A') {
        setScoreA((s) => s + 1);
      } else {
        setScoreB((s) => s + 1);
      }

      setButs((b) => [
        ...b,
        {
          type: 'but',
          equipe,
          minute: `${minutes}:${secondes}`,
          nom: equipe === 'A' ? nomA : nomB,
        },
      ]);
    },
    [minutes, secondes, nomA, nomB]
  );

  const ajouterCarton = useCallback(
    (equipe, type) => {
      setCartons((c) => [
        ...c,
        {
          equipe,
          type,
          minute: `${minutes}:${secondes}`,
          nom: equipe === 'A' ? nomA : nomB,
        },
      ]);
    },
    [minutes, secondes, nomA, nomB]
  );

  const demarrerMatch = () => {
    setRunning(true);
    setPhase('1ère Mi-temps');
  };

  const miTemps = () => {
    setRunning(false);
    setPhase('Mi-temps');
  };

  const deuxiemeMiTemps = () => {
    setRunning(true);
    setPhase('2ème Mi-temps');
  };

  const finMatch = () => {
    setRunning(false);
    setPhase('Terminé');
  };

  const resetMatch = () => {
    setScoreA(0);
    setScoreB(0);

    setButs([]);
    setCartons([]);

    setTemps(0);

    setRunning(false);

    setPhase('Configuration');
  };

  const cartonsJaunesA = cartons.filter(
    (c) => c.equipe === 'A' && c.type === 'jaune'
  ).length;

  const cartonsJaunesB = cartons.filter(
    (c) => c.equipe === 'B' && c.type === 'jaune'
  ).length;

  const cartonsRougesA = cartons.filter(
    (c) => c.equipe === 'A' && c.type === 'rouge'
  ).length;

  const cartonsRougesB = cartons.filter(
    (c) => c.equipe === 'B' && c.type === 'rouge'
  ).length;

  const historique = [...buts, ...cartons];

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <Text style={styles.title}>⚽ MATCH TRACKER</Text>
      <Text style={styles.phase}>{phase}</Text>

      {/* EQUIPES */}
      <View style={styles.teamsContainer}>
        {/* PSG */}
        <View style={styles.teamCard}>
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
            }}
            style={styles.logo}
          />

          <TextInput
            value={nomA}
            onChangeText={setNomA}
            style={styles.teamInput}
          />

          <Text style={styles.coach}>Coach</Text>

          <TextInput
            value={coachA}
            onChangeText={setCoachA}
            style={styles.coachInput}
          />
        </View>

        {/* CENTRE */}
        <View style={styles.middleSection}>
          <Text style={styles.vs}>VS</Text>

          <Text style={styles.score}>
            {scoreA} - {scoreB}
          </Text>

          {/* CHRONO 00:00 */}
          <Text style={styles.timer}>
            ⏱ {minutes}:{secondes}
          </Text>
        </View>

        {/* BARCA */}
        <View style={styles.teamCard}>
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
            }}
            style={styles.logo}
          />

          <TextInput
            value={nomB}
            onChangeText={setNomB}
            style={styles.teamInput}
          />

          <Text style={styles.coach}>Coach</Text>

          <TextInput
            value={coachB}
            onChangeText={setCoachB}
            style={styles.coachInput}
          />
        </View>
      </View>

      {/* BOUTONS */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.greenBtn} onPress={demarrerMatch}>
          <Text style={styles.btnText}>▶ Démarrer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.orangeBtn} onPress={miTemps}>
          <Text style={styles.btnText}>⏸ Mi-temps</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.blueBtn} onPress={deuxiemeMiTemps}>
          <Text style={styles.btnText}>▶ 2ème MT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.redBtn} onPress={finMatch}>
          <Text style={styles.btnText}>⏹ Fin</Text>
        </TouchableOpacity>
      </View>

      {/* RESET */}
      <TouchableOpacity style={styles.resetBtn} onPress={resetMatch}>
        <Text style={styles.resetText}>🔄 Réinitialiser le match</Text>
      </TouchableOpacity>

      {/* BUTS */}
      <Text style={styles.sectionTitle}>⚽ Buts</Text>

      <View style={styles.goalButtons}>
        <TouchableOpacity
          style={styles.goalBtn}
          onPress={() => ajouterBut('A')}
        >
          <Text style={styles.btnText}>⚽ But PSG</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.goalBtn}
          onPress={() => ajouterBut('B')}
        >
          <Text style={styles.btnText}>⚽ But Barça</Text>
        </TouchableOpacity>
      </View>

      {/* CARTONS */}
      <Text style={styles.sectionTitle}>🟨 Cartons</Text>

      <View style={styles.cardsContainer}>
        <View style={styles.cardBox}>
          <Text style={styles.teamName}>PSG</Text>

          <View style={styles.cardButtons}>
            <TouchableOpacity
              style={styles.yellowBtn}
              onPress={() => ajouterCarton('A', 'jaune')}
            >
              <Text style={styles.blackText}>🟨 {cartonsJaunesA}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.redCardBtn}
              onPress={() => ajouterCarton('A', 'rouge')}
            >
              <Text style={styles.btnText}>🟥 {cartonsRougesA}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardBox}>
          <Text style={styles.teamName}>Barcelone</Text>

          <View style={styles.cardButtons}>
            <TouchableOpacity
              style={styles.yellowBtn}
              onPress={() => ajouterCarton('B', 'jaune')}
            >
              <Text style={styles.blackText}>🟨 {cartonsJaunesB}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.redCardBtn}
              onPress={() => ajouterCarton('B', 'rouge')}
            >
              <Text style={styles.btnText}>🟥 {cartonsRougesB}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* STATS */}
      <Text style={styles.sectionTitle}>📊 Statistiques</Text>

      <View style={styles.statsBox}>
        <View style={styles.statRow}>
          <Text style={styles.statValue}>{scoreA}</Text>
          <Text style={styles.statLabel}>Buts</Text>
          <Text style={styles.statValue}>{scoreB}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statValue}>{cartonsJaunesA}</Text>
          <Text style={styles.statLabel}>🟨 Jaunes</Text>
          <Text style={styles.statValue}>{cartonsJaunesB}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statValue}>{cartonsRougesA}</Text>
          <Text style={styles.statLabel}>🟥 Rouges</Text>
          <Text style={styles.statValue}>{cartonsRougesB}</Text>
        </View>
      </View>

      {/* HISTORIQUE */}
      <Text style={styles.sectionTitle}>📋 Historique</Text>

      <View style={styles.historyBox}>
        {historique.map((event, index) => (
          <Text key={index} style={styles.historyText}>
            {event.type === 'but'
              ? `⚽ ${event.nom} - ${event.minute}`
              : `${event.type === 'jaune' ? '🟨' : '🟥'} ${
                  event.nom
                } - ${event.minute}`}
          </Text>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    paddingTop: 55,
    paddingHorizontal: 20,
  },

  title: {
    color: '#39FF14',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },

  phase: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
    fontSize: 16,
    fontWeight: 'bold',
  },

  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  teamCard: {
    width: '32%',
    backgroundColor: '#101010',
    borderWidth: 1.5,
    borderColor: '#39FF14',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
  },

  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  teamInput: {
    color: '#39FF14',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },

  coach: {
    color: '#999',
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
  },

  coachInput: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
    width: '100%',
  },

  middleSection: {
    alignItems: 'center',
  },

  vs: {
    color: '#39FF14',
    fontSize: 22,
    fontWeight: 'bold',
  },

  score: {
    color: '#39FF14',
    fontSize: 42,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  timer: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },

  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  greenBtn: {
    backgroundColor: '#00c853',
    width: '48%',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },

  orangeBtn: {
    backgroundColor: '#ff9800',
    width: '48%',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },

  blueBtn: {
    backgroundColor: '#2979ff',
    width: '48%',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  redBtn: {
    backgroundColor: '#ff1744',
    width: '48%',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  resetBtn: {
    backgroundColor: '#39FF14',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 25,
  },

  resetText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },

  sectionTitle: {
    color: '#39FF14',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  goalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  goalBtn: {
    width: '48%',
    backgroundColor: '#101010',
    borderColor: '#39FF14',
    borderWidth: 1.5,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  cardBox: {
    width: '48%',
    backgroundColor: '#101010',
    borderColor: '#39FF14',
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
  },

  teamName: {
    color: '#39FF14',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 12,
  },

  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  yellowBtn: {
    width: '48%',
    backgroundColor: '#ffd600',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  redCardBtn: {
    width: '48%',
    backgroundColor: '#d50000',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  blackText: {
    color: '#000',
    fontWeight: 'bold',
  },

  statsBox: {
    backgroundColor: '#101010',
    borderColor: '#39FF14',
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    marginBottom: 25,
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    alignItems: 'center',
  },

  statLabel: {
    color: '#aaa',
    flex: 1,
    textAlign: 'center',
  },

  statValue: {
    color: '#39FF14',
    fontSize: 22,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },

  historyBox: {
    backgroundColor: '#101010',
    borderColor: '#39FF14',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },

  historyText: {
    color: '#ddd',
    marginBottom: 8,
    fontSize: 15,
  },
});
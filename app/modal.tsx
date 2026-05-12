import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MatchTracker() {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [temps, setTemps] = useState(0);
  const [phase] = useState('1ère Mi-temps');

  useEffect(() => {
    const timer = setInterval(() => {
      setTemps(t => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(temps / 60)).padStart(2, '0');
  const secondes = String(temps % 60).padStart(2, '0');

  const psgTitulaire = [
    'Donnarumma', 'Hakimi', 'Marquinhos', 'Lucas Hernández', 'Nuno Mendes',
    'Vitinha', 'Ugarte', 'Zaïre-Emery',
    'Dembélé', 'Mbappé', 'Kolo Muani'
  ];

  const psgRemplaçants = [
    'Skriniar', 'Asensio', 'Barcola', 'Danilo', 'Ramos'
  ];

  const barcaTitulaire = [
    'Ter Stegen', 'Koundé', 'Araujo', 'Christensen', 'Balde',
    'De Jong', 'Pedri', 'Gündogan',
    'Yamal', 'Lewandowski', 'Raphinha'
  ];

  const barcaRemplaçants = [
    'Ferran Torres', 'Fermin Lopez', 'Romeu', 'Inigo Martinez', 'Pena'
  ];

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>⚽ PSG vs BARÇA</Text>
      <Text style={styles.phase}>{phase}</Text>

      <Text style={styles.info}>🏟 Parc des Princes</Text>
      <Text style={styles.info}>👨‍⚖️ Arbitre : Clément Turpin</Text>

      <View style={styles.scoreBox}>
        <Text style={styles.score}>{scoreA} - {scoreB}</Text>
        <Text style={styles.timer}>{minutes}:{secondes}</Text>
      </View>

      <Text style={styles.section}>🔴 PSG TITULAIRES</Text>
      {psgTitulaire.map((j, i) => (
        <Text key={i} style={styles.player}>{j}</Text>
      ))}

      <Text style={styles.section}>🔁 PSG REMPLAÇANTS</Text>
      {psgRemplaçants.map((j, i) => (
        <Text key={i} style={styles.sub}>{j}</Text>
      ))}

      <Text style={styles.section}>🔵 BARÇA TITULAIRES</Text>
      {barcaTitulaire.map((j, i) => (
        <Text key={i} style={styles.player}>{j}</Text>
      ))}

      <Text style={styles.section}>🔁 BARÇA REMPLAÇANTS</Text>
      {barcaRemplaçants.map((j, i) => (
        <Text key={i} style={styles.sub}>{j}</Text>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20
  },
  title: {
    color: '#00ff66',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  phase: {
    color: '#00ff66',
    textAlign: 'center',
    marginBottom: 10
  },
  info: {
    color: '#aaa',
    textAlign: 'center'
  },
  scoreBox: {
    alignItems: 'center',
    marginVertical: 20
  },
  score: {
    color: '#00ff66',
    fontSize: 50,
    fontWeight: 'bold'
  },
  timer: {
    color: '#fff',
    fontSize: 20
  },
  section: {
    color: '#00ff66',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 5
  },
  player: {
    color: '#fff',
    paddingVertical: 2
  },
  sub: {
    color: '#888',
    paddingVertical: 2
  }
});
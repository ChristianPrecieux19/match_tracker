import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const JOUEURS_PSG = [
  'Donnarumma', 'Hakimi', 'Marquinhos', 'Pacho', 'Nuno Mendes',
  'Vitinha', 'Joao Neves', 'Fabian Ruiz', 'Dembélé', 'Barcola', 'Ramos'
];
const REMPLACANTS_PSG = [
  'Safonov', 'Zaire-Emery', 'Kolo Muani', 'Lee Kang-In', 'Hernandez', 'Beraldo'
];
const JOUEURS_BARCA = [
  'Szczesny', 'Koundé', 'Cubarsi', 'Martinez', 'Balde',
  'Pedri', 'Casado', 'De Jong', 'Yamal', 'Raphinha', 'Lewandowski'
];
const REMPLACANTS_BARCA = [
  'Pena', 'Olmo', 'Ferran Torres', 'Christensen', 'Eric Garcia', 'Ansu Fati'
];

export default function MatchTracker() {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [nomA] = useState('PSG');
  const [nomB] = useState('Barcelone');
  const [coachA] = useState('Luis Enrique');
  const [coachB] = useState('Hansi Flick');
  const [buts, setButs] = useState([]);
  const [cartons, setCartons] = useState([]);
  const [secondes, setSecondes] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState('Configuration');
  const [onglet, setOnglet] = useState('match');

  useEffect(() => {
    let timer;
    if (running) {
      timer = setInterval(() => setSecondes(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  const formatTemps = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const minute = Math.floor(secondes / 60);

  const ajouterBut = (equipe, joueur) => {
    if (equipe === 'A') setScoreA(s => s + 1);
    else setScoreB(s => s + 1);
    setButs(b => [...b, { equipe, minute, joueur, nom: equipe === 'A' ? nomA : nomB }]);
  };

  const ajouterCarton = (equipe, type, joueur) => {
    setCartons(c => [...c, { equipe, type, minute, joueur, nom: equipe === 'A' ? nomA : nomB }]);
  };

  const demarrerMatch = () => { setRunning(true); setPhase('1ère Mi-temps'); };
  const miTemps = () => { setRunning(false); setPhase('Mi-temps'); };
  const deuxiemeMiTemps = () => { setRunning(true); setPhase('2ème Mi-temps'); };
  const finMatch = () => { setRunning(false); setPhase('Terminé ⚽'); };

  const cartonsJaunesA = cartons.filter(c => c.equipe === 'A' && c.type === 'jaune').length;
  const cartonsJaunesB = cartons.filter(c => c.equipe === 'B' && c.type === 'jaune').length;
  const cartonsRougesA = cartons.filter(c => c.equipe === 'A' && c.type === 'rouge').length;
  const cartonsRougesB = cartons.filter(c => c.equipe === 'B' && c.type === 'rouge').length;

  const LogoEquipe = ({ equipe, couleur1, couleur2, initiale }) => (
    <View style={[styles.logo, { borderColor: couleur1 }]}>
      <View style={[styles.logoMoitie, { backgroundColor: couleur1 }]}>
        <Text style={styles.logoTexte}>{initiale[0]}</Text>
      </View>
      <View style={[styles.logoMoitie, { backgroundColor: couleur2 }]}>
        <Text style={styles.logoTexte}>{initiale[1]}</Text>
      </View>
    </View>
  );

  const renderJoueurs = (joueurs, remplacants, equipe) => (
    <View style={styles.joueursContainer}>
      <Text style={styles.sousTitre}>⬛ Titulaires</Text>
      {joueurs.map((j, i) => (
        <View key={i} style={styles.joueurRow}>
          <Text style={styles.joueurNum}>{i + 1}</Text>
          <Text style={styles.joueurNom}>{j}</Text>
          <TouchableOpacity style={styles.btnMiniVert} onPress={() => ajouterBut(equipe, j)}>
            <Text style={styles.btnMiniTexte}>⚽</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnMiniJaune} onPress={() => ajouterCarton(equipe, 'jaune', j)}>
            <Text style={styles.btnMiniTexte}>🟨</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnMiniRouge} onPress={() => ajouterCarton(equipe, 'rouge', j)}>
            <Text style={styles.btnMiniTexte}>🟥</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Text style={[styles.sousTitre, { marginTop: 10 }]}>🔄 Remplaçants</Text>
      {remplacants.map((j, i) => (
        <View key={i} style={[styles.joueurRow, { opacity: 0.7 }]}>
          <Text style={styles.joueurNum}>R{i + 1}</Text>
          <Text style={styles.joueurNom}>{j}</Text>
          <TouchableOpacity style={styles.btnMiniVert} onPress={() => ajouterBut(equipe, j)}>
            <Text style={styles.btnMiniTexte}>⚽</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnMiniJaune} onPress={() => ajouterCarton(equipe, 'jaune', j)}>
            <Text style={styles.btnMiniTexte}>🟨</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnMiniRouge} onPress={() => ajouterCarton(equipe, 'rouge', j)}>
            <Text style={styles.btnMiniTexte}>🟥</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.titre}>⚽ Match Tracker</Text>
      <Text style={styles.phase}>{phase}</Text>

      {/* Logos + Score */}
      <View style={styles.scoreContainer}>
        <View style={styles.equipeBlock}>
          <LogoEquipe equipe="A" couleur1="#003087" couleur2="#ED2939" initiale="PS" />
          <Text style={styles.nomEquipe}>{nomA}</Text>
          <Text style={styles.coachTexte}>👨‍💼 {coachA}</Text>
        </View>
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreTexte}>{scoreA} - {scoreB}</Text>
          <Text style={styles.chrono}>{formatTemps(secondes)}</Text>
        </View>
        <View style={styles.equipeBlock}>
          <LogoEquipe equipe="B" couleur1="#A50044" couleur2="#004D98" initiale="BC" />
          <Text style={styles.nomEquipe}>{nomB}</Text>
          <Text style={styles.coachTexte}>👨‍💼 {coachB}</Text>
        </View>
      </View>

      {/* Boutons match */}
      <View style={styles.matchBoutons}>
        <TouchableOpacity style={styles.btnPrimaire} onPress={demarrerMatch}>
          <Text style={styles.btnTexte}>▶ Démarrer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondaire} onPress={miTemps}>
          <Text style={styles.btnTexteSecondaire}>⏸ Mi-temps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondaire} onPress={deuxiemeMiTemps}>
          <Text style={styles.btnTexteSecondaire}>▶ 2ème MT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondaire} onPress={finMatch}>
          <Text style={styles.btnTexteSecondaire}>⏹ Fin</Text>
        </TouchableOpacity>
      </View>

      {/* Onglets */}
      <View style={styles.onglets}>
        {['match', 'psg', 'barca', 'stats'].map(o => (
          <TouchableOpacity key={o} style={[styles.onglet, onglet === o && styles.ongletActif]} onPress={() => setOnglet(o)}>
            <Text style={[styles.ongletTexte, onglet === o && styles.ongletTexteActif]}>
              {o === 'match' ? '📋' : o === 'psg' ? 'PSG' : o === 'barca' ? 'FCB' : '📊'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenu onglets */}
      {onglet === 'match' && (
        <View>
          <Text style={styles.sectionTitre}>⚽ Buts</Text>
          <View style={styles.butsBoutons}>
            <TouchableOpacity style={styles.btnPrimaire} onPress={() => ajouterBut('A', '?')}>
              <Text style={styles.btnTexte}>⚽ But {nomA}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimaire} onPress={() => ajouterBut('B', '?')}>
              <Text style={styles.btnTexte}>⚽ But {nomB}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitre}>🟨 Cartons</Text>
          <View style={styles.cartonsContainer}>
            <View style={styles.cartonEquipe}>
              <Text style={styles.nomEquipeStat}>{nomA}</Text>
              <View style={styles.cartonBoutons}>
                <TouchableOpacity style={styles.btnCarton} onPress={() => ajouterCarton('A', 'jaune', '?')}>
                  <Text style={styles.btnTexteSecondaire}>🟨 {cartonsJaunesA}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnCarton} onPress={() => ajouterCarton('A', 'rouge', '?')}>
                  <Text style={styles.btnTexteSecondaire}>🟥 {cartonsRougesA}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.cartonEquipe}>
              <Text style={styles.nomEquipeStat}>{nomB}</Text>
              <View style={styles.cartonBoutons}>
                <TouchableOpacity style={styles.btnCarton} onPress={() => ajouterCarton('B', 'jaune', '?')}>
                  <Text style={styles.btnTexteSecondaire}>🟨 {cartonsJaunesB}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnCarton} onPress={() => ajouterCarton('B', 'rouge', '?')}>
                  <Text style={styles.btnTexteSecondaire}>🟥 {cartonsRougesB}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitre}>📋 Historique</Text>
          {[...buts, ...cartons].sort((a, b) => a.minute - b.minute).map((e, i) => (
            <Text key={i} style={styles.evenement}>
              {e.joueur ? `⚽ ${e.joueur} (${e.nom}) - ${e.minute}'` : `${e.type === 'jaune' ? '🟨' : '🟥'} ${e.joueur} (${e.nom}) - ${e.minute}'`}
            </Text>
          ))}
        </View>
      )}

      {onglet === 'psg' && (
        <View>
          <Text style={styles.sectionTitre}>🔵 Joueurs PSG</Text>
          {renderJoueurs(JOUEURS_PSG, REMPLACANTS_PSG, 'A')}
        </View>
      )}

      {onglet === 'barca' && (
        <View>
          <Text style={styles.sectionTitre}>🔴 Joueurs Barcelone</Text>
          {renderJoueurs(JOUEURS_BARCA, REMPLACANTS_BARCA, 'B')}
        </View>
      )}

      {onglet === 'stats' && (
        <View style={styles.stats}>
          <View style={styles.statRow}>
            <Text style={styles.statVal}>{scoreA}</Text>
            <Text style={styles.statLabel}>Buts</Text>
            <Text style={styles.statVal}>{scoreB}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statVal}>{cartonsJaunesA}</Text>
            <Text style={styles.statLabel}>🟨 Jaunes</Text>
            <Text style={styles.statVal}>{cartonsJaunesB}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statVal}>{cartonsRougesA}</Text>
            <Text style={styles.statLabel}>🟥 Rouges</Text>
            <Text style={styles.statVal}>{cartonsRougesB}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statVal}>{buts.filter(b => b.equipe === 'A').length}</Text>
            <Text style={styles.statLabel}>⚽ Buts marqués</Text>
            <Text style={styles.statVal}>{buts.filter(b => b.equipe === 'B').length}</Text>
          </View>
        </View>
      )}

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, paddingTop: 60 },
  titre: { fontSize: 32, fontWeight: 'bold', color: '#00ff66', textAlign: 'center', marginBottom: 5 },
  phase: { fontSize: 16, color: '#00ff66', textAlign: 'center', marginBottom: 15, fontWeight: 'bold' },
  scoreContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', padding: 20, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#00ff66' },
  equipeBlock: { alignItems: 'center', flex: 1 },
  scoreBlock: { alignItems: 'center', flex: 1 },
  logo: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, overflow: 'hidden', flexDirection: 'row', marginBottom: 8 },
  logoMoitie: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoTexte: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  nomEquipe: { color: '#00ff66', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  coachTexte: { color: '#555', fontSize: 11, fontStyle: 'italic', textAlign: 'center' },
  scoreTexte: { fontSize: 45, color: '#fff', fontWeight: 'bold' },
  chrono: { fontSize: 22, color: '#00ff66', fontWeight: 'bold', marginTop: 5 },
  matchBoutons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  btnPrimaire: { backgroundColor: '#00ff66', padding: 12, borderRadius: 10, width: '48%', alignItems: 'center', marginBottom: 8 },
  btnSecondaire: { backgroundColor: '#111', padding: 12, borderRadius: 10, width: '48%', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#00ff66' },
  btnTexte: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  btnTexteSecondaire: { color: '#00ff66', fontWeight: 'bold', fontSize: 14 },
  onglets: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  onglet: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#111', marginHorizontal: 2, borderRadius: 10, borderWidth: 1, borderColor: '#333' },
  ongletActif: { backgroundColor: '#00ff66', borderColor: '#00ff66' },
  ongletTexte: { color: '#555', fontWeight: 'bold' },
  ongletTexteActif: { color: '#000' },
  sectionTitre: { fontSize: 20, color: '#00ff66', fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  butsBoutons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cartonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cartonEquipe: { width: '48%', backgroundColor: '#111', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#333' },
  nomEquipeStat: { color: '#00ff66', fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  cartonBoutons: { flexDirection: 'row', justifyContent: 'space-between' },
  btnCarton: { backgroundColor: '#222', padding: 10, borderRadius: 8, width: '48%', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  stats: { backgroundColor: '#111', padding: 20, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  statLabel: { color: '#555', fontSize: 15, textAlign: 'center', flex: 1 },
  statVal: { color: '#00ff66', fontSize: 22, fontWeight: 'bold', width: 40, textAlign: 'center' },
  evenement: { color: '#555', fontSize: 14, marginBottom: 6 },
  joueursContainer: { backgroundColor: '#111', borderRadius: 15, padding: 15, borderWidth: 1, borderColor: '#333' },
  sousTitre: { color: '#00ff66', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  joueurRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#222' },
  joueurNum: { color: '#555', width: 30, fontSize: 13 },
  joueurNom: { color: '#fff', flex: 1, fontSize: 14 },
  btnMiniVert: { backgroundColor: '#00ff66', padding: 5, borderRadius: 6, marginLeft: 4 },
  btnMiniJaune: { backgroundColor: '#222', padding: 5, borderRadius: 6, marginLeft: 4, borderWidth: 1, borderColor: '#555' },
  btnMiniRouge: { backgroundColor: '#222', padding: 5, borderRadius: 6, marginLeft: 4, borderWidth: 1, borderColor: '#555' },
  btnMiniTexte: { fontSize: 12 },
});
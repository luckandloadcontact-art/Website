// Statisk spilleliste for "Slot Wheel"-funksjonen på forsiden. Legg til flere spill her etter
// hvert -- rekkefølgen spiller ingen rolle, spinnet velger tilfeldig blant alle.

export interface WheelGame {
  id: string
  name: string
  provider: string
  /** Portrett cover art (public/wheel/). */
  image: string
  /**
   * De fleste bildene er hentet direkte fra Hype.bet sin egen
   * custom-game-miniatures-CDN (hype.bet/s3/custom-game-miniatures/{leverandørkode}_{spillnavn}.webp)
   * og har allerede tittel + leverandør pent innebygd i bildet. Et fåtall spill sin eksakte
   * URL på den CDN-en er ikke funnet ennå -- for de bruker vi et beskåret utsnitt uten
   * innebygd tekst, og setter needsLabel:true for å vise tittel/leverandør som overlay i UI-et.
   */
  needsLabel?: boolean
}

export const WHEEL_GAMES: WheelGame[] = [
  { id: 'wanted', name: 'Wanted Dead or a Wild', provider: 'Hacksaw Gaming', image: '/wheel/wanted.jpg' },
  { id: 'banana-farm', name: 'Banana Farm', provider: 'Hacksaw Gaming', image: '/wheel/banana-farm.jpg' },
  { id: 'le-bandit', name: 'Le Bandit', provider: 'Hacksaw Gaming', image: '/wheel/le-bandit.jpg' },
  { id: 'shogun', name: 'Shogun Skylord: Jade Empress', provider: 'Just Slots', image: '/wheel/shogun.jpg' },
  { id: 'mental2', name: 'Mental 2', provider: 'Nolimit City', image: '/wheel/mental2.jpg' },
  { id: 'frkn-bananas', name: 'FRKN Bananas', provider: 'Hacksaw Gaming', image: '/wheel/frkn-bananas.jpg' },
  { id: 'fist', name: 'Fist of Destruction', provider: 'Hacksaw Gaming', image: '/wheel/fist.jpg' },
  { id: 'ripcity', name: 'RIP City', provider: 'Hacksaw Gaming', image: '/wheel/ripcity.jpg' },
  { id: 'anubis', name: 'Hand of Anubis', provider: 'Hacksaw Gaming', image: '/wheel/anubis.jpg' },
  { id: 'dorkunit', name: 'Dork Unit', provider: 'Hacksaw Gaming', image: '/wheel/dorkunit.jpg' },
  { id: 'jawsofjustice', name: 'Jaws of Justice', provider: 'Hacksaw Gaming', image: '/wheel/jawsofjustice.jpg' },
  { id: 'lifeanddeath', name: 'Life and Death', provider: 'Hacksaw Gaming', image: '/wheel/lifeanddeath.jpg' },
  { id: 'duckhuntershh', name: 'Duck Hunters: Happy Hour', provider: 'Nolimit City', image: '/wheel/duckhuntershh.jpg' },
  { id: 'juicyfruits', name: 'Juicy Fruits', provider: 'Pragmatic Play', image: '/wheel/juicyfruits.jpg' },
  { id: 'sunprincess', name: 'Sun Princess', provider: 'Hacksaw Gaming', image: '/wheel/sunprincess.jpg' },
  { id: 'bookofpower', name: 'Book of Power', provider: 'Relax Gaming', image: '/wheel/bookofpower.jpg' },
  { id: 'armyofares', name: 'Army of Ares', provider: 'Hacksaw Gaming', image: '/wheel/armyofares.jpg' },
  { id: 'crazyexgf', name: "Crazy Ex-Girlfriend", provider: 'Nolimit City', image: '/wheel/crazyexgf.jpg' },
  { id: 'seamen', name: 'Seamen', provider: 'Nolimit City', image: '/wheel/seamen.jpg' },
  { id: 'mayanstackways', name: 'Mayan Stackways', provider: 'Hacksaw Gaming', image: '/wheel/mayanstackways.jpg' },
  { id: 'rainandruin', name: 'Rain and Ruin', provider: 'Just Slots', image: '/wheel/rainandruin.jpg' },
  { id: 'demonsgate', name: "Demon's Gate", provider: 'Slotmill', image: '/wheel/demonsgate.jpg' },
]

/** Alle spill spilles under vårt Hype.bet-partnerlink -- ingen per-spill dyplenke tilgjengelig. */
export const HYPE_PLAY_URL = 'https://hype.bet/LuckAndLoad'

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
  { id: 'duckhunters', name: 'Duck Hunters', provider: 'Nolimit City', image: '/wheel/duckhunters.jpg' },
  { id: 'zeusvshades', name: 'Zeus vs Hades: Gods of War', provider: 'Pragmatic Play', image: '/wheel/zeusvshades.jpg' },
  { id: 'leking', name: 'Le King', provider: 'Hacksaw Gaming', image: '/wheel/leking.jpg' },
  { id: 'flightmode', name: 'Flight Mode', provider: 'Nolimit City', image: '/wheel/flightmode.jpg' },
  { id: 'le-prechaun', name: 'Le Prechaun', provider: 'Hacksaw Gaming', image: '/wheel/leprechaun.jpg' },
  { id: 'houndsofhell', name: 'Hounds of Hell', provider: 'Hacksaw Gaming', image: '/wheel/houndsofhell.jpg' },
  { id: 'outsourced', name: 'Outsourced', provider: 'Nolimit City', image: '/wheel/outsourced.jpg' },
  { id: 'crystalrobot', name: 'Crystal Robot', provider: 'Backseat Gaming', image: '/wheel/crystalrobot.jpg' },
  { id: 'jellyexpress', name: 'Jelly Express', provider: 'Pragmatic Play', image: '/wheel/jellyexpress.jpg' },
  { id: 'wildwoodcurse', name: 'The Wildwood Curse', provider: 'Hacksaw Gaming', image: '/wheel/wildwoodcurse.jpg' },
  { id: 'doghouse1000', name: 'The Dog House Megaways 1000', provider: 'Pragmatic Play', image: '/wheel/doghouse1000.jpg' },
  { id: 'chocolaterocket', name: 'Chocolate Rocket', provider: 'Hacksaw Gaming', image: '/wheel/chocolaterocket.jpg' },
  { id: 'fighterpit', name: 'Fighter Pit', provider: 'Hacksaw Gaming', image: '/wheel/fighterpit.jpg' },
  { id: 'soakedbyseamen', name: 'Soaked by Seamen', provider: 'Nolimit City', image: '/wheel/soakedbyseamen.jpg' },
  { id: 'puglife', name: 'Pug Life', provider: 'Hacksaw Gaming', image: '/wheel/puglife.jpg' },
  { id: '2wild2die', name: '2 Wild 2 Die', provider: 'Hacksaw Gaming', image: '/wheel/2wild2die.jpg' },
  { id: 'dasxbootzwei', name: 'Das xBoot Zwei', provider: 'Nolimit City', image: '/wheel/dasxboot2wei.jpg' },
  { id: 'dorksofthedeep', name: 'Dorks of the Deep', provider: 'Hacksaw Gaming', image: '/wheel/dorksofthedeep.jpg' },
  { id: 'goldenshower', name: 'Golden Shower', provider: 'Nolimit City', image: '/wheel/goldenshower.jpg' },
  { id: 'aztecmagicmegaways', name: 'Aztec Magic Megaways', provider: 'BGaming', image: '/wheel/aztecmagicmegaways.jpg' },
  { id: 'piratebonanza2', name: 'Pirate Bonanza 2', provider: 'Backseat Gaming', image: '/wheel/piratebonanza2.jpg' },
  { id: 'chaoscrewii', name: 'Chaos Crew II', provider: 'Hacksaw Gaming', image: '/wheel/chaoscrewii.jpg', needsLabel: true },
  { id: 'wildwestduels', name: 'Wild West Duels', provider: 'Pragmatic Play', image: '/wheel/wildwestduels.jpg' },
  { id: 'angelvssinner', name: 'Angel vs Sinner', provider: 'Pragmatic Play', image: '/wheel/angelvssinner.jpg' },
  { id: 'reelrampage', name: 'Reel Rampage', provider: 'Slotmill', image: '/wheel/reelrampage.jpg' },
  { id: 'duckhunters2', name: 'Duck Hunters 2', provider: 'Nolimit City', image: '/wheel/duckhunters2.jpg' },
  { id: 'nitronights', name: 'Nitro Nights', provider: 'Hacksaw Gaming', image: '/wheel/nitronights.jpg' },
  { id: 'roninstackways', name: 'Ronin Stackways', provider: 'Hacksaw Gaming', image: '/wheel/roninstackways.jpg' },
  { id: 'ultimateslotofamerica', name: 'Ultimate Slot of America', provider: 'Hacksaw Gaming', image: '/wheel/ultimateslotofamerica.jpg' },
]

/** Alle spill spilles under vårt Hype.bet-partnerlink -- ingen per-spill dyplenke tilgjengelig. */
export const HYPE_PLAY_URL = 'https://hype.bet/LuckAndLoad'

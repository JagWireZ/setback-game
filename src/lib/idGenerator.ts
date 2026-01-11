const ADJECTIVES = [
  "able","active","agile","alert","airy","amber","ample","basic","bold","brave",
  "breezy","bright","brisk","calm","candid","caring","certain","cheerful","clever",
  "close","cool","crisp","cute","daily","daring","decent","deep","early","easy",
  "earthy","eager","equal","even","fair","fast","firm","fit","fixed","fresh",
  "friendly","full","funny","gentle","giant","glad","glowing","golden","good",
  "grand","great","green","handy","happy","hardy","harsh","heavy","honest",
  "humble","hungry","icy","ideal","idle","jolly","joyful","keen","kind","large",
  "lasting","late","light","lively","lone","lucky","major","mellow","merry",
  "mighty","mild","minor","model","modest","neat","nimble","noble","normal",
  "open","orange","orderly","outer","patient","perfect","plain","polite","proud",
  "quick","quiet","rapid","ready","real","right","rosy","round","safe","sharp",
  "short","shy","simple","single","slick","slim","slow","small","smart","smooth",
  "soft","solid","spare","square","steady","still","strong","sure","sweet",
  "swift","tall","tender","tidy","tiny","true","vast","vivid","warm","wary",
  "wild","willing","wise","young"
];

const ANIMALS = [
  "adder","alpaca","ant","aphid","auk","badger","bass","bat","bear","beaver",
  "bee","beetle","bison","bobcat","bug","buffalo","camel","carp","cat","cheetah",
  "chimp","cobra","cod","cougar","cow","crab","crane","cricket","crow","deer",
  "dingo","dog","donkey","dove","duck","eagle","eel","egret","falcon","ferret",
  "finch","flea","fly","flounder","fox","frog","gazelle","gecko","gator","gnat",
  "goat","goose","grub","gull","guppy","hamster","hawk","hedgehog","heron",
  "horse","hyena","iguana","jackal","jaguar","jellyfish","kangaroo","kiwi",
  "koala","koi","ladybug","lark","lemur","leopard","lion","lizard","llama",
  "lobster","magpie","marlin","meerkat","mink","mole","monkey","moose","mouse",
  "moth","muskrat","octopus","opossum","orca","ostrich","otter","owl","panda",
  "parrot","penguin","perch","pike","pig","pony","porcupine","puffin","python",
  "quail","rabbit","raccoon","rat","raven","reindeer","robin","roach","salamander",
  "salmon","sardine","seal","shark","sheep","shrimp","skink","skunk","sloth",
  "snake","spider","sparrow","squid","stork","stingray","swan","swift","tapir",
  "termite","tiger","toad","trout","turkey","tuna","turtle","vulture","walrus",
  "wasp","weasel","whale","wolf","worm","wombat","wren","yak","zebra"
];

export const createGameId = (random = Math.random) => {
  const adj = ADJECTIVES[Math.floor(random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(random() * ANIMALS.length)];
  return `${adj}_${animal}`;
}

export const createPlayerId = () => {
  const id: string = crypto.randomUUID();
  return id.slice(0,7);
}

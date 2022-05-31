const { default: axios } = require("axios");
const QUERY = "https://mach-eight.uc.r.appspot.com/";

/* istanbul ignore next */
/**
 * This function is responsible to read the input data and deal with it distributing tasks
 */
const readInput = async () => {
  try {
    const inputIndex = process.argv.indexOf("--i");
    const input = process.argv[inputIndex + 1];

    let correctInput = validateInput(input);
    if (correctInput.valid) {
      let nbaPlayers = await getNBAPlayers(QUERY);
      let pairs = getPairsOfNBAPlayers(nbaPlayers, correctInput.number);
      if (pairs.length > 0) {
        delete pairs.length;
        for (pair in pairs) {
          console.log(pair);
        }
      } else {
        console.log("No matches found");
      }
    } else {
      console.log("The input is not a valid integer");
    }
  } catch (error) {
    console.log("There is an error querying the data:", error.message);
  }
};

/**
 *
 * @param {*} input input received from terminal
 * @returns An object which indicates if the input is an Integer in the form {number, valid}
 */
let validateInput = (input) => {
  let number = parseInt(input);
  return { number, valid: !isNaN(number) };
};

/**
 *
 * @param {*} query Query to make the call to the api
 * @returns An array that contains nbaPlayers
 * @throws Error if data does not bring values field or there is an error with the api
 */
let getNBAPlayers = async (query) => {
  let nbaPlayer = await axios
    .get(query)
    .then((response) => {
      if (response.data.values) {
        return response.data.values;
      } else {
        throw Error("data did not return values");
      }
    })
    .catch((error) => {
      throw Error(error.message);
    });
  return nbaPlayer;
};

/**
 *
 * @param {*} players NBA players which contain info about heights
 * @param {*} input Integer input required to calculate pair of players which their heights adds up the input
 * @returns An object that contains pair of players tha accomplish the condition
 */
const getPairsOfNBAPlayers = (players, input) => {
  let container = {};
  let pairs = { length: 0 };

  players.forEach((player1) => {
    if (parseInt(player1.h_in) < input) {
      if (!container[player1.h_in]) {
        container[player1.h_in] = [player1];
      } else {
        container[player1.h_in] = [...container[player1.h_in], player1];
      }
      let difference = "" + (input - parseInt(player1.h_in));
      if (container[difference]) {
        container[difference].forEach((player2) => {
          addPairOfPlayers(player1, player2, pairs);
        });
      }
    }
  });

  return pairs;
};

/**
 *
 * @param {*} player1 NBA player 1 to compare with player 2
 * @param {*} player2 NBA player 2 to compare with player 1
 * @param {*} pairs An object that contains pair of players tha accomplish the condition
 * @returns An object that contains pair of players tha accomplish the condition
 */
const addPairOfPlayers = (player1, player2, pairs) => {
  let fullNamePlayer1 = `${player1.first_name} ${player1.last_name}`;
  let fullNamePlayer2 = `${player2.first_name} ${player2.last_name}`;
  let pairName = `${fullNamePlayer1}         ${fullNamePlayer2}`;
  let pairNameReverse = `${fullNamePlayer2}         ${fullNamePlayer1}`;
  if (
    !pairs[pairName] &&
    !pairs[pairNameReverse] &&
    fullNamePlayer1 !== fullNamePlayer2
  ) {
    pairs[pairNameReverse] = { player2: player2.h_in, player1: player1.h_in };
    pairs.length++;
  }
  return pairs;
};

module.exports = {
  validateInput,
  getNBAPlayers,
  getPairsOfNBAPlayers,
  addPairOfPlayers,
  readInput,
};

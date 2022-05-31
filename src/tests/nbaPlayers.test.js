const nbaPlayers = require("../controller/nbaPlayers");
describe("This test is focus on functions needed to get pair of nba players according with an integer input", () => {
  const QUERY = "https://mach-eight.uc.r.appspot.com/";
  test("validate integer input", () => {
    expect(nbaPlayers.validateInput("139").valid).toBe(true);
    expect(nbaPlayers.validateInput("139").number).toBe(139);
    expect(nbaPlayers.validateInput("sas").valid).toBe(false);
    expect(nbaPlayers.validateInput("sas").number).toBeNaN();
    expect(nbaPlayers.validateInput("12.7").number).toBe(12);
  });

  test("validate if the data returned by the query to get nba players info is an array", async () => {
    let promise = new Promise(async (resolve, reject) => {
      let players = await nbaPlayers.getNBAPlayers(QUERY);
      resolve(Array.isArray(players));
    });
    await expect(promise).resolves.toBe(true);
  });

  test("validate if the query is the correct one", async () => {
    await expect(nbaPlayers.getNBAPlayers(QUERY + "hello")).rejects.toThrow(
      "Request failed with status code 404"
    );
  });

  test("validate if the the output for the input 139 is the correct one", async () => {
    let players = await nbaPlayers.getNBAPlayers(QUERY);
    let input = "139";
    //Players height are inverted
    expect(nbaPlayers.getPairsOfNBAPlayers(players, input)).toEqual({
      "Brevin Knight         Nate Robinson": {
        player1: "69",
        player2: "70",
      },
      "Nate Robinson         Mike Wilks": {
        player1: "70",
        player2: "69",
      },
      length: 2,
    });
  });

  test("validate if the the output for the input 2 is empty", async () => {
    let players = await nbaPlayers.getNBAPlayers(QUERY);
    let input = "2";
    //Players height are inverted
    expect(nbaPlayers.getPairsOfNBAPlayers(players, input)).toEqual({
      length: 0,
    });
  });

  test("validate if the addition of new correct ones is correct", async () => {
    let players = [
      {
        first_name: "Arron",
        h_in: "77",
        h_meters: "1.96",
        last_name: "Afflalo",
      },
      {
        first_name: "Maurice",
        h_in: "77",
        h_meters: "1.96",
        last_name: "Ager",
      },
      {
        first_name: "Alexis",
        h_in: "84",
        h_meters: "2.13",
        last_name: "Ajinca",
      },
      {
        first_name: "LaMarcus",
        h_in: "83",
        h_meters: "2.11",
        last_name: "Aldridge",
      },
      {
        first_name: "Joe",
        h_in: "80",
        h_meters: "2.03",
        last_name: "Alexander",
      },
      {
        first_name: "Malik",
        h_in: "82",
        h_meters: "2.08",
        last_name: "Allen",
      },
      {
        first_name: "Ray",
        h_in: "77",
        h_meters: "1.96",
        last_name: "Allen",
      },
    ];

    const pairs = {
      "Arron Afflalo         Maurice Ager": { player2: "77", player1: "77" },
    };

    expect(nbaPlayers.addPairOfPlayers(players[0], players[1], pairs)).toEqual(
      pairs
    );

    expect(nbaPlayers.addPairOfPlayers(players[6], players[1], pairs)).toEqual({
      ...pairs,
      "Maurice Ager         Ray Allen": { player2: "77", player1: "77" },
    });
  });
});

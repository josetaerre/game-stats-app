// const cds = require("@sap/cds");

// // ============================================================================
// // DEFINITION: Service Class & Fiori Handlers
// // ============================================================================
// class StatsService extends cds.ApplicationService {
//   async init() {
//     const { LineupPlans, LineupPlayers } = this.entities;

//     // 1. Handler for the Lineups Tab (Returns the two plan rows)
//     this.on("READ", LineupPlans, async (req) => {
//       const categoryID = extractFilterValue(req, 'categoryID');
//       if (!categoryID) return [];

//       return [
//         {
//           planID: 'MONEYBALL',
//           categoryID: categoryID,
//           name: 'Moneyball Optimization',
//           description: 'Prioritizes On-Base Percentage (OBP) and Slugging (OPS).'
//         },
//         {
//           planID: 'GRINDER',
//           categoryID: categoryID,
//           name: 'Grinder Lineup',
//           description: 'Prioritizes high contact and Quality At-Bats (QAB).'
//         }
//       ];
//     });

//     // 2. Handler for clicking into a specific Lineup (Returns the 9 players)
//     this.on("READ", LineupPlayers, async (req) => {
//       const categoryID = extractFilterValue(req, 'categoryID');
//       const planID = extractFilterValue(req, 'planID');
//       if (!categoryID || !planID) return [];

//       // Run your Sabermetrics engine for this specific Category!
//       const lineups = await generateLineups(categoryID);

//       // Pick the correct roster based on what the user clicked
//       const selectedLineup = planID === 'MONEYBALL' ? lineups.moneyball : lineups.grinder;

//       // Format the output exactly how the Fiori UI expects it
//       const result = selectedLineup.map((p, index) => {
//         return {
//           playerID: p.playerID,
//           planID: planID,
//           categoryID: categoryID,
//           battingOrder: index + 1,
//           name: p.name,
//           OPS: p.OPS,
//           OBP: p.OBP,
//           SLG: p.SLG,
//           QAB_PCT: p.QAB_PCT,
//           PA: p.PA
//         };
//       });

//       result.$count = result.length; // Required by Fiori to draw the table
//       return result;
//     });

//     return super.init();
//   }
// }

// // Helper to extract IDs from Fiori's URL requests
// function extractFilterValue(req, paramName) {
//     let val = null;
//     if (req.query.SELECT && req.query.SELECT.where) {
//          req.query.SELECT.where.forEach((token, i, arr) => {
//              if (token.ref && token.ref[0] === paramName) val = arr[i+2].val;
//          });
//     }
//     return val;
// }



// const cds = require("@sap/cds");

// // ============================================================================
// // DEFINITION: Service Class & Fiori Handlers
// // ============================================================================
// class StatsService extends cds.ApplicationService {
//   async init() {
//     const { LineupPlans, LineupPlayers } = this.entities;

//     // 1. Handler for the Lineups Tab & Object Page Header
//     this.on("READ", LineupPlans, async (req) => {
//       let categoryID = extractFilterValue(req, "categoryID");
//       let planID = extractFilterValue(req, "planID"); // Fiori sends this when opening the Object Page!

//       // If Fiori asked for a SPECIFIC category
//       if (categoryID) {
//         let plans = generatePlanRows(categoryID);

//         // If Fiori is opening the Object Page, it only wants the specific plan for the header
//         if (planID) {
//           plans = plans.filter((p) => p.planID === planID);
//         }

//         plans.$count = plans.length;
//         return plans;
//       }

//       // If testing in the browser without a filter...
//       const allCategories = await SELECT.from("game.Category").columns("ID");
//       let allPlans = [];
//       for (const cat of allCategories) {
//         allPlans.push(...generatePlanRows(cat.ID));
//       }

//       allPlans.$count = allPlans.length;
//       return allPlans;
//     });

//     // 2. Handler for clicking into a specific Lineup (Returns the 9 players)
//     this.on("READ", LineupPlayers, async (req) => {
//       const categoryID = extractFilterValue(req, "categoryID");
//       const planID = extractFilterValue(req, "planID");

//       if (!categoryID || !planID) return [];

//       // Run your Sabermetrics engine for this specific Category!
//       const lineups = await generateLineups(categoryID);

//       // Pick the correct roster based on what the user clicked
//       const selectedLineup =
//         planID === "MONEYBALL" ? lineups.moneyball : lineups.grinder;

//       // Format the output exactly how the Fiori UI expects it
//       const result = selectedLineup.map((p, index) => {
//         return {
//           playerID: p.playerID,
//           planID: planID,
//           categoryID: categoryID,
//           battingOrder: index + 1,
//           name: p.name,
//           OPS: p.OPS,
//           OBP: p.OBP,
//           SLG: p.SLG,
//           QAB_PCT: p.QAB_PCT,
//           PA: p.PA,
//         };
//       });

//       result.$count = result.length;
//       return result;
//     });

//     return super.init();
//   }
// }

// // Helper to generate the static rows for any given category
// function generatePlanRows(catID) {
//   return [
//     {
//       planID: "MONEYBALL",
//       categoryID: catID,
//       name: "Moneyball Optimization",
//       description: "Prioritizes On-Base Percentage (OBP) and Slugging (OPS).",
//     },
//     {
//       planID: "GRINDER",
//       categoryID: catID,
//       name: "Grinder Lineup",
//       description: "Prioritizes high contact and Quality At-Bats (QAB).",
//     },
//   ];
// }

// // Helper to extract IDs from Fiori's URL requests (Upgraded for Deep Navigation)
// function extractFilterValue(req, paramName) {
//   // 1. Fiori Deep Navigation (CAP stores URL keys in req.params)
//   if (req.params && req.params.length > 0) {
//     for (const param of req.params) {
//       if (param && param[paramName] !== undefined) {
//         return param[paramName];
//       }
//     }
//   }

//   // 2. Standard Query Parameters
//   if (req.data && req.data[paramName] !== undefined) {
//     return req.data[paramName];
//   }

//   // 3. Fallback for raw WHERE clauses
//   let val = null;
//   if (req.query && req.query.SELECT && req.query.SELECT.where) {
//     req.query.SELECT.where.forEach((token, i, arr) => {
//       if (token.ref && token.ref.includes(paramName)) {
//         if (arr[i + 2] && arr[i + 2].val !== undefined) {
//           val = arr[i + 2].val;
//         }
//       }
//     });
//   }
//   return val;
// }

// // ============================================================================
// // IMPLEMENTATION: The Sabermetrics Engine
// // ============================================================================
// async function generateLineups(categoryID) {
//   try {
//     console.log(`⚙️  Starting Lineup Engine for Category: ${categoryID}`);

//     const db = await cds.connect.to("db");
//     const { Offense } = db.entities("game");

//     // Fetch live data filtered strictly to the requested Category
//     const rawStats = await SELECT.from(Offense)
//       .columns((o) => {
//         (o.player_ID,
//           o.outcome_code,
//           o.pitchesSeen,
//           o.hardContact,
//           o.player((p) => p.name));
//       })
//       .where({ "game.category_ID": categoryID }); // Crucial filter for Fiori

//     console.log(`✅ Fetched ${rawStats.length} offensive records.`);

//     const players = {};
//     for (const stat of rawStats) {
//       const pid = stat.player_ID;
//       if (!players[pid]) {
//         const pName =
//           stat.player && stat.player.name ? stat.player.name : "Unknown Player";
//         players[pid] = {
//           playerID: pid, // Save the ID for Fiori mapping
//           name: pName,
//           PA: 0,
//           AB: 0,
//           H: 0,
//           BB: 0,
//           TB: 0,
//           QAB: 0,
//         };
//       }

//       const p = players[pid];
//       p.PA += 1;
//       const outcome = stat.outcome_code;

//       // DYNAMIC QUALITY AT-BAT (QAB) CALCULATOR
//       let isQAB = false;
//       if (
//         ["S", "D", "T", "HR", "BB", "HBP", "SACF", "SACB"].includes(outcome)
//       ) {
//         isQAB = true;
//       } else if (
//         stat.hardContact === true ||
//         stat.hardContact === "true" ||
//         stat.hardContact === 1
//       ) {
//         isQAB = true;
//       } else if (stat.pitchesSeen >= 6) {
//         isQAB = true;
//       }
//       if (isQAB) p.QAB += 1;

//       // Standard stats
//       if (["BB", "HBP"].includes(outcome)) p.BB += 1;
//       else if (!["SACF", "SACB", "CI"].includes(outcome)) p.AB += 1;

//       if (outcome === "S") {
//         p.H += 1;
//         p.TB += 1;
//       }
//       if (outcome === "D") {
//         p.H += 1;
//         p.TB += 2;
//       }
//       if (outcome === "T") {
//         p.H += 1;
//         p.TB += 3;
//       }
//       if (outcome === "HR") {
//         p.H += 1;
//         p.TB += 4;
//       }
//     }

//     let roster = Object.values(players)
//       .filter((p) => p.PA >= 1)
//       .map((p) => {
//         p.OBP = p.PA > 0 ? (p.H + p.BB) / p.PA : 0;
//         p.SLG = p.AB > 0 ? p.TB / p.AB : 0;
//         p.OPS = p.OBP + p.SLG;
//         p.QAB_PCT = p.PA > 0 ? p.QAB / p.PA : 0;

//         return {
//           playerID: p.playerID,
//           name: p.name,
//           PA: p.PA,
//           OBP: parseFloat(p.OBP.toFixed(3)),
//           SLG: parseFloat(p.SLG.toFixed(3)),
//           OPS: parseFloat(p.OPS.toFixed(3)),
//           QAB_PCT: parseFloat(p.QAB_PCT.toFixed(3)),
//         };
//       });

//     if (roster.length < 9) {
//       console.log("⚠️ Not enough players for a full lineup.");
//       return { moneyball: [], grinder: [] };
//     }

//     // const lineupSize = Math.min(roster.length, 10);

//     // Build Lineup 1: The "Moneyball"
//     const moneyball = [];
//     let available = [...roster];

//     let top5 = available.slice(0, 5).sort((a, b) => b.OBP - a.OBP);
//     moneyball[0] = top5[0];
//     available = available.filter((p) => p.name !== moneyball[0].name);

//     available.sort((a, b) => b.OPS - a.OPS);
//     moneyball[1] = available[0];
//     available.shift();

//     available.sort((a, b) => b.SLG - a.SLG);
//     moneyball[3] = available[0];
//     available.shift();

//     available.sort((a, b) => b.OPS - a.OPS);
//     moneyball[2] = available[0];
//     available.shift();

//     moneyball[4] = available.shift();
//     moneyball[5] = available.shift();

//     available.sort((a, b) => b.OBP - a.OBP);
//     while (moneyball.length < lineupSize && available.length > 0) {
//       moneyball.push(available.shift());
//     }

//     // Build Lineup 2: The "Grinder"
//     const grinder = [...roster]
//       .sort((a, b) => b.QAB_PCT - a.QAB_PCT)
//       .slice(0, lineupSize);

//     return { moneyball: moneyball, grinder: grinder };
//   } catch (error) {
//     console.error("❌ ERROR IN LINEUP ENGINE:", error);
//     throw error;
//   }
// }

// module.exports = StatsService;



const cds = require("@sap/cds");

// ============================================================================
// DEFINITION: Service Class & Fiori Handlers
// ============================================================================
class StatsService extends cds.ApplicationService {
  async init() {
    const { LineupPlans, LineupPlayers } = this.entities;

    // 1. Handler for the Lineups Tab & Object Page Header
    this.on("READ", LineupPlans, async (req) => {
      let categoryID = extractFilterValue(req, "categoryID");
      let planID = extractFilterValue(req, "planID"); // Fiori sends this when opening the Object Page!

      // If Fiori asked for a SPECIFIC category
      if (categoryID) {
        let plans = generatePlanRows(categoryID);

        // If Fiori is opening the Object Page, it only wants the specific plan for the header
        if (planID) {
          plans = plans.filter((p) => p.planID === planID);
        }

        plans.$count = plans.length;
        return plans;
      }

      // If testing in the browser without a filter...
      const allCategories = await SELECT.from("game.Category").columns("ID");
      let allPlans = [];
      for (const cat of allCategories) {
        allPlans.push(...generatePlanRows(cat.ID));
      }

      allPlans.$count = allPlans.length;
      return allPlans;
    });

    // 2. Handler for clicking into a specific Lineup (Returns the full roster)
    this.on("READ", LineupPlayers, async (req) => {
      const categoryID = extractFilterValue(req, "categoryID");
      const planID = extractFilterValue(req, "planID");

      if (!categoryID || !planID) return [];

      // Run your Sabermetrics engine for this specific Category!
      const lineups = await generateLineups(categoryID);

      // Pick the correct roster based on what the user clicked
      const selectedLineup =
        planID === "MONEYBALL" ? lineups.moneyball : lineups.grinder;

      // Format the output exactly how the Fiori UI expects it
      const result = selectedLineup.map((p, index) => {
        return {
          playerID: p.playerID,
          planID: planID,
          categoryID: categoryID,
          battingOrder: index + 1,
          name: p.name,
          OPS: p.OPS,
          OBP: p.OBP,
          SLG: p.SLG,
          QAB_PCT: p.QAB_PCT,
          PA: p.PA,
        };
      });

      result.$count = result.length;
      return result;
    });

    return super.init();
  }
}

// Helper to generate the static rows for any given category
function generatePlanRows(catID) {
  return [
    {
      planID: "MONEYBALL",
      categoryID: catID,
      name: "Moneyball Optimization",
      description: "Prioritizes On-Base Percentage (OBP) and Slugging (OPS).",
    },
    {
      planID: "GRINDER",
      categoryID: catID,
      name: "Grinder Lineup",
      description: "Prioritizes high contact and Quality At-Bats (QAB).",
    },
  ];
}

// Helper to extract IDs from Fiori's URL requests (Upgraded for Deep Navigation)
function extractFilterValue(req, paramName) {
  // 1. Fiori Deep Navigation (CAP stores URL keys in req.params)
  if (req.params && req.params.length > 0) {
    for (const param of req.params) {
      if (param && param[paramName] !== undefined) {
        return param[paramName];
      }
    }
  }

  // 2. Standard Query Parameters
  if (req.data && req.data[paramName] !== undefined) {
    return req.data[paramName];
  }

  // 3. Fallback for raw WHERE clauses
  let val = null;
  if (req.query && req.query.SELECT && req.query.SELECT.where) {
    req.query.SELECT.where.forEach((token, i, arr) => {
      if (token.ref && token.ref.includes(paramName)) {
        if (arr[i + 2] && arr[i + 2].val !== undefined) {
          val = arr[i + 2].val;
        }
      }
    });
  }
  return val;
}

// ============================================================================
// IMPLEMENTATION: The Sabermetrics Engine
// ============================================================================
async function generateLineups(categoryID) {
  try {
    console.log(`⚙️  Starting Lineup Engine for Category: ${categoryID}`);

    const db = await cds.connect.to("db");
    const { Offense } = db.entities("game");

    // Fetch live data filtered strictly to the requested Category
    const rawStats = await SELECT.from(Offense)
      .columns((o) => {
        (o.player_ID,
          o.outcome_code,
          o.pitchesSeen,
          o.hardContact,
          o.player((p) => p.name));
      })
      .where({ "game.category_ID": categoryID }); // Crucial filter for Fiori

    console.log(`✅ Fetched ${rawStats.length} offensive records.`);

    const players = {};
    for (const stat of rawStats) {
      const pid = stat.player_ID;
      if (!players[pid]) {
        const pName =
          stat.player && stat.player.name ? stat.player.name : "Unknown Player";
        players[pid] = {
          playerID: pid, // Save the ID for Fiori mapping
          name: pName,
          PA: 0,
          AB: 0,
          H: 0,
          BB: 0,
          TB: 0,
          QAB: 0,
        };
      }

      const p = players[pid];
      p.PA += 1;
      const outcome = stat.outcome_code;

      // DYNAMIC QUALITY AT-BAT (QAB) CALCULATOR
      let isQAB = false;
      if (
        ["S", "D", "T", "HR", "BB", "HBP", "SACF", "SACB"].includes(outcome)
      ) {
        isQAB = true;
      } else if (
        stat.hardContact === true ||
        stat.hardContact === "true" ||
        stat.hardContact === 1
      ) {
        isQAB = true;
      } else if (stat.pitchesSeen >= 6) {
        isQAB = true;
      }
      if (isQAB) p.QAB += 1;

      // Standard stats
      if (["BB", "HBP"].includes(outcome)) p.BB += 1;
      else if (!["SACF", "SACB", "CI"].includes(outcome)) p.AB += 1;

      if (outcome === "S") {
        p.H += 1;
        p.TB += 1;
      }
      if (outcome === "D") {
        p.H += 1;
        p.TB += 2;
      }
      if (outcome === "T") {
        p.H += 1;
        p.TB += 3;
      }
      if (outcome === "HR") {
        p.H += 1;
        p.TB += 4;
      }
    }

    let roster = Object.values(players)
      .filter((p) => p.PA >= 1)
      .map((p) => {
        p.OBP = p.PA > 0 ? (p.H + p.BB) / p.PA : 0;
        p.SLG = p.AB > 0 ? p.TB / p.AB : 0;
        p.OPS = p.OBP + p.SLG;
        p.QAB_PCT = p.PA > 0 ? p.QAB / p.PA : 0;

        return {
          playerID: p.playerID,
          name: p.name,
          PA: p.PA,
          OBP: parseFloat(p.OBP.toFixed(3)),
          SLG: parseFloat(p.SLG.toFixed(3)),
          OPS: parseFloat(p.OPS.toFixed(3)),
          QAB_PCT: parseFloat(p.QAB_PCT.toFixed(3)),
        };
      });

    if (roster.length < 9) {
      console.log("⚠️ Not enough players for a standard starting 9.");
    }

    // Build Lineup 1: The "Moneyball"
    const moneyball = [];
    let available = [...roster];

    // Safely assign top 6 hitters
    if (available.length > 0) {
      let top5 = available.slice(0, 5).sort((a, b) => b.OBP - a.OBP);
      moneyball[0] = top5[0];
      available = available.filter((p) => p.name !== moneyball[0].name);
    }
    if (available.length > 0) {
      available.sort((a, b) => b.OPS - a.OPS);
      moneyball[1] = available.shift();
    }
    if (available.length > 0) {
      available.sort((a, b) => b.SLG - a.SLG);
      moneyball[3] = available.shift();
    }
    if (available.length > 0) {
      available.sort((a, b) => b.OPS - a.OPS);
      moneyball[2] = available.shift();
    }
    if (available.length > 0) moneyball[4] = available.shift();
    if (available.length > 0) moneyball[5] = available.shift();

    // Fill the REST of the roster sorted by OBP
    available.sort((a, b) => b.OBP - a.OBP);
    while (available.length > 0) {
      moneyball.push(available.shift());
    }

    // Clean up any empty slots just in case
    const cleanMoneyball = moneyball.filter((p) => p !== undefined);

    // Build Lineup 2: The "Grinder"
    // Takes EVERYONE, sorted strictly by QAB%
    const grinder = [...roster].sort((a, b) => b.QAB_PCT - a.QAB_PCT);

    return { moneyball: cleanMoneyball, grinder: grinder };
  } catch (error) {
    console.error("❌ ERROR IN LINEUP ENGINE:", error);
    throw error;
  }
}

module.exports = StatsService;

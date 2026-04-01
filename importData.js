const xlsx = require("xlsx");
const fs = require("fs");
const crypto = require("crypto");
const uuidv4 = () => crypto.randomUUID();

// 1. Load the Workbook
const workbook = xlsx.readFile("./UploadStats.xlsx");

// Output Arrays
let games = [];
let offense = [];
let defense = [];
let pitchers = [];

const outcomeMap = { S: "S", D: "D", T: "T", HR: "HR", K: "K", BB: "BB", HBP: "HBP", ROE: "ROE", FC: "FC", OUT: "OUT", DP: "DP" };

// ------------------------------------------------------------------
// STEP 1: Load Existing Players
// ------------------------------------------------------------------
const playerMap = {};
try {
    const playerCsv = fs.readFileSync("./db/data/game-Player.csv", "utf-8");
    const lines = playerCsv.split("\n");
    const headers = lines[0].split(",");
    const idIdx = headers.indexOf("ID");
    const jerseyIdx = headers.indexOf("jerseyNumber");

    lines.slice(1).forEach(line => {
        if (!line.trim()) return;
        const cols = line.split(",");
        if (cols[jerseyIdx] && cols[idIdx]) {
            const jNum = cols[jerseyIdx].replace(/"/g, '').trim();
            const pId = cols[idIdx].replace(/"/g, '').trim();
            playerMap[jNum] = pId;
        }
    });
    console.log(`✅ Linked to ${Object.keys(playerMap).length} players in your database.`);
} catch (err) {
    console.error("❌ ERROR: Could not read ./db/data/game-Player.csv.");
    process.exit(1);
}

// ------------------------------------------------------------------
// STEP 2: Process General Sheet
// ------------------------------------------------------------------
const generalRaw = xlsx.utils.sheet_to_json(workbook.Sheets["General"], { header: 1 });
let currentGameId = uuidv4(); 
let currentSection = "";
let headers = [];

generalRaw.forEach(row => {
    const firstCell = String(row[1] || row[0] || "").trim();
    
    if (firstCell === "GAME") { currentSection = "GAME"; return; }
    if (firstCell === "PITCHERS") { currentSection = "PITCHERS"; return; }
    if (firstCell === "CATCHERS") { currentSection = "CATCHERS"; return; }

    if (firstCell === "date" || firstCell === "jerseyNumber") {
        headers = row;
        return;
    }

    if (row.length > 0 && row.some(c => c !== null && c !== undefined)) {
        const rowData = {};
        headers.forEach((h, i) => { if (h) rowData[String(h).trim()] = row[i]; });

        if (currentSection === "GAME" && rowData.date) {
            games.push({
                ID: currentGameId,
                date: rowData.date,
                category_ID: rowData.category || uuidv4(),
                opponent: rowData.opponent || "Opponent",
                finalTeamScore: rowData.finalTeamScore || 0,
                finalOpponentScore: rowData.finalOpponentScore || 0
            });
        }

        if (currentSection === "PITCHERS" && rowData.jerseyNumber) {
            const jNum = String(rowData.jerseyNumber).trim();
            if (playerMap[jNum]) {
                pitchers.push({
                    ID: uuidv4(),
                    game_ID: currentGameId,
                    player_ID: playerMap[jNum],
                    outsRecorded: rowData.outsRecorded || 0,
                    numberOfPitches: rowData.numberOfPitches || 0,
                    firstPitchStrikes: rowData.firstPitchStrikes || 0,
                    hitsReceived: rowData.hitsReceived || 0,
                    strikeOuts: rowData.strikeOuts || 0,
                    walks: rowData.walks || 0,
                    earnedRuns: rowData.earnedRuns || 0
                });
            }
        }

        if (currentSection === "CATCHERS" && rowData.jerseyNumber) {
            const jNum = String(rowData.jerseyNumber).trim();
            if (playerMap[jNum]) {
                defense.push({
                    ID: uuidv4(),
                    game_ID: currentGameId,
                    player_ID: playerMap[jNum],
                    positionPlayed_code: 2, 
                    outsPlayed: rowData.outsPlayed || 0,
                    involvedInPlays: 0,
                    completedPlays: 0,
                    errors: 0,
                    passedBalls: rowData.passedBalls || 0,
                    stolenBasesAllowed: rowData.stolenBasesAllowed || 0,
                    caughtStealing: rowData.caughtStealing || 0,
                    notes: rowData.passedBalls > 0 ? "PB" : ""
                });
            }
        }
    }
});

// ------------------------------------------------------------------
// STEP 3: Process Offense 
// ------------------------------------------------------------------
const offenseRaw = xlsx.utils.sheet_to_json(workbook.Sheets["Offense"], { header: 1 });
let offHeaders = [];
offenseRaw.forEach(row => {
    if (row.includes("jerseyNumber")) {
        offHeaders = row;
        return;
    }
    if (offHeaders.length > 0 && row.length > 0 && row.some(c => c !== null && c !== undefined)) {
        const rowData = {};
        offHeaders.forEach((h, i) => { if (h) rowData[String(h).trim()] = row[i]; });
        
        const jNum = String(rowData.jerseyNumber).trim();
        if (jNum && playerMap[jNum]) {
            offense.push({
                ID: uuidv4(),
                game_ID: currentGameId,
                player_ID: playerMap[jNum],
                inning: rowData.inning || 1,
                plateAppearanceInGame: rowData.battingOrder || 1,
                outcome_code: outcomeMap[String(rowData.outcome).toUpperCase()] || "OUT",
                runsScored: rowData.runsScored || 0,
                rbis: rowData.rbi || 0,
                firstPitchSwing: rowData.firstPitchSwing ? "true" : "false",
                pitchesSeen: rowData.pitchesSeen || 1,
                hardContact: rowData.hardContact ? "true" : "false"
                // qualityAtBat successfully removed!
            });
        }
    }
});

// ------------------------------------------------------------------
// STEP 4: Process General Defense
// ------------------------------------------------------------------
const defenseRaw = xlsx.utils.sheet_to_json(workbook.Sheets["Defense"], { header: 1 });
let defHeaders = [];
defenseRaw.forEach(row => {
    if (row.includes("jerseyNumber")) {
        defHeaders = row;
        return;
    }
    if (defHeaders.length > 0 && row.length > 0 && row.some(c => c !== null && c !== undefined)) {
        const rowData = {};
        defHeaders.forEach((h, i) => { if (h) rowData[String(h).trim()] = row[i]; });
        
        const jNum = String(rowData.jerseyNumber).trim();
        if (jNum && playerMap[jNum]) {
            defense.push({
                ID: uuidv4(),
                game_ID: currentGameId,
                player_ID: playerMap[jNum],
                positionPlayed_code: rowData.positionPlayed || 1,
                outsPlayed: rowData.outsPlayed || 0,
                involvedInPlays: rowData.involvedInPlays || 0,
                completedPlays: rowData.completedPlays || 0,
                errors: rowData.errors || 0,
                passedBalls: 0,
                stolenBasesAllowed: 0,
                caughtStealing: 0,
                notes: ""
            });
        }
    }
});

// ------------------------------------------------------------------
// STEP 5: Export to CSV (Append Mode)
// ------------------------------------------------------------------
const appendCsv = (name, data) => {
    if (data.length === 0) return;
    const filePath = `./db/data/game-${name}.csv`;
    
    // Ensure the order of keys is always uniform by extracting headers from the first object
    const headersArray = Object.keys(data[0]);
    
    const rows = data.map(obj => {
        // Map strictly using the headersArray to guarantee column order
        return headersArray.map(key => {
            const val = obj[key];
            return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(",");
    }).join("\n");
    
    if (fs.existsSync(filePath)) {
        fs.appendFileSync(filePath, "\n" + rows);
        console.log(`✅ Appended ${data.length} records to ${name}`);
    } else {
        const headerStr = headersArray.join(",");
        fs.writeFileSync(filePath, `${headerStr}\n${rows}`);
        console.log(`✅ Created ${name} with ${data.length} records`);
    }
};

appendCsv("Game", games);
appendCsv("Offense", offense);
appendCsv("Pitcher", pitchers);
appendCsv("Defense", defense);

console.log("🔥 Success: Stats successfully injected into your database!");
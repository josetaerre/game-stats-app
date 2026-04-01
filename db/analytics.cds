// namespace game.analytics;

// using {game as db} from './schema';

// define view PlayerOffenseBase as
//     select from db.Offense {
//         player.ID          as playerID,
//         player.name        as playerName,
//         game.category.ID   as categoryID,
//         game.category.name as categoryName,

//         // Raw Aggregations
//         count(ID)          as PA,
//         sum(case
//                 when outcome.code in (
//                          'S', 'D', 'T', 'HR', 'K', 'ROE', 'FC', 'OUT', 'DP'
//                      )
//                      then 1
//                 else 0
//             end)           as AB,
//         sum(case
//                 when outcome.code in (
//                          'S', 'D', 'T', 'HR'
//                      )
//                      then 1
//                 else 0
//             end)           as H,
//         sum(case
//                 when outcome.code = 'S'
//                      then 1
//                 else 0
//             end)           as Singles,
//         sum(case
//                 when outcome.code = 'D'
//                      then 2
//                 else 0
//             end)           as Doubles_Bases,
//         sum(case
//                 when outcome.code = 'T'
//                      then 3
//                 else 0
//             end)           as Triples_Bases,
//         sum(case
//                 when outcome.code = 'HR'
//                      then 4
//                 else 0
//             end)           as HR_Bases,
//         sum(rbis)          as RBI,
//         sum(case
//                 when outcome.code in (
//                          'BB', 'HBP', 'CI'
//                      )
//                      then 1
//                 else 0
//             end)           as WalkHBP
//     }
//     group by
//         player.ID,
//         player.name,
//         game.category.ID,
//         game.category.name;

// define view PitcherBase as
//     select from db.Pitcher {
//         player.ID              as playerID,
//         player.name            as playerName,
//         game.category.ID       as categoryID,
//         game.category.name     as categoryName,

//         // Raw Aggregations
//         sum(outsRecorded)      as totalOuts,
//         sum(numberOfPitches)   as totalPitches,
//         sum(firstPitchStrikes) as totalFPS,
//         sum(hitsReceived)      as totalHits,
//         sum(strikeOuts)        as totalK,
//         sum(walks)             as totalBB,
//         sum(runsReceived)      as totalRuns,
//         sum(hittersFaced)      as totalTBF
//     }
//     group by
//         player.ID,
//         player.name,
//         game.category.ID,
//         game.category.name;

// // Add to db/analytics.cds
// define view CatcherBase as
//     select from db.Defense {
//         player.ID            as playerID,
//         player.name          as playerName,
//         game.category.ID     as categoryID,

//         // Aggregations specific to catchers
//         sum(involvedInPlays) as totalChances,
//         sum(completedPlays)  as totalSuccess,
//         sum(errors)          as totalErrors,
//         // We can pull Passed Balls if you added that field to the Defense entity
//         sum(case
//                 when notes like '%PB%'
//                      then 1
//                 else 0
//             end)             as passedBalls
//     }
//     where
//         positionPlayed.code = 2 // Hardcoded to Catcher
//     group by
//         player.ID,
//         player.name,
//         game.category.ID;



namespace game.analytics;

using {game as db} from './schema';

// ============================================================================
// 1. EXTEND CATEGORY FOR FIORI TABS
// ============================================================================
extend db.Category with {
    // Links the Category directly to your views so the tabs populate automatically
    playerStats  : Association to many PlayerOffenseBase on playerStats.categoryID = $self.ID;
    pitcherStats : Association to many PitcherBase on pitcherStats.categoryID = $self.ID;
    catcherStats : Association to many CatcherBase on catcherStats.categoryID = $self.ID;
}

// ============================================================================
// 2. FIORI-READY BASE VIEWS (Restored for services.cds)
// ============================================================================
define view PlayerOffenseBase as
    select from db.Offense {
        key player.ID          as playerID,
        key game.category.ID   as categoryID,

        // Required for Fiori UI navigation
        player,
        game.category          as category,

        player.name        as playerName,
        game.category.name as categoryName,

        // Raw Aggregations
        count(ID)          as PA,
        sum(case
                when outcome.code in ('S', 'D', 'T', 'HR', 'K', 'ROE', 'FC', 'OUT', 'DP') then 1
                else 0
            end)           as AB,
        sum(case
                when outcome.code in ('S', 'D', 'T', 'HR') then 1
                else 0
            end)           as H,
        sum(case when outcome.code = 'S' then 1 else 0 end) as Singles,
        sum(case when outcome.code = 'D' then 2 else 0 end) as Doubles_Bases,
        sum(case when outcome.code = 'T' then 3 else 0 end) as Triples_Bases,
        sum(case when outcome.code = 'HR' then 4 else 0 end) as HR_Bases,
        sum(rbis)          as RBI,
        sum(case
                when outcome.code in ('BB', 'HBP', 'CI') then 1
                else 0
            end)           as WalkHBP
    }
    group by
        player.ID,
        player.name,
        game.category.ID,
        game.category.name;


define view PitcherBase as
    select from db.Pitcher {
        key player.ID              as playerID,
        key game.category.ID       as categoryID,

        player,
        game.category          as category,

        player.name            as playerName,
        game.category.name     as categoryName,

        sum(outsRecorded)      as totalOuts,
        sum(numberOfPitches)   as totalPitches,
        sum(firstPitchStrikes) as totalFPS,
        sum(hitsReceived)      as totalHits,
        sum(strikeOuts)        as totalK,
        sum(walks)             as totalBB,
        sum(runsReceived)      as totalRuns,
        sum(hittersFaced)      as totalTBF
    }
    group by
        player.ID,
        player.name,
        game.category.ID,
        game.category.name;


define view CatcherBase as
    select from db.Defense {
        key player.ID            as playerID,
        key game.category.ID     as categoryID,

        player,
        game.category          as category,

        player.name          as playerName,

        sum(involvedInPlays) as totalChances,
        sum(completedPlays)  as totalSuccess,
        sum(errors)          as totalErrors,
        sum(passedBalls)     as passedBalls
    }
    where
        positionPlayed.code = 2 // Hardcoded to Catcher
    group by
        player.ID,
        player.name,
        game.category.ID;
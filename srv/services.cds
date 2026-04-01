using {game as db} from '../db/schema';
using {game.analytics as analytics} from '../db/analytics';

@path: '/coach/dashboard'
service StatsService {

    @readonly
    entity Categories        as
        select from db.Category {
            ID,
            name,
            ageMin,
            ageMax,
            offenseStats  : Association to many PlayerStats
                                on offenseStats.categoryID = ID,
            pitchingStats : Association to many PitcherStats
                                on pitchingStats.categoryID = ID,
            fieldingStats : Association to many FieldingAnalytics
                                on fieldingStats.categoryID = ID,
            catcherStats  : Association to many CatcherAnalytics
                                on catcherStats.categoryID = ID,
            lineups       : Composition of many LineupPlans
                                on lineups.categoryID = ID
        };

    @readonly
    entity PlayerStats       as
        select from analytics.PlayerOffenseBase {
                // 1. Explicitly define keys for the service entity
            key playerID,
            key categoryID,
                playerName,
                categoryName,

                // 2. Explicitly type the aggregated columns
                PA            : Integer,
                AB            : Integer,
                H             : Integer,
                Singles       : Integer,
                Doubles_Bases : Integer,
                Triples_Bases : Integer,
                HR_Bases      : Integer,
                RBI           : Integer,
                WalkHBP       : Integer,

                // 3. Final KPI Calculation
                case
                    when AB > 0
                         then cast ( H as Decimal(5, 3)) / AB
                    else cast(
                             0 as Decimal(5, 3)
                         )
                end as AVG    : Decimal(5, 3)
        };


    @readonly
    entity PitcherStats      as
        select from analytics.PitcherBase {
            key playerID,
            key categoryID,
                playerName,
                categoryName,
                totalPitches     : Integer,
                totalOuts        : Integer,
                totalK           : Integer,
                totalBB          : Integer,
                totalRuns        : Integer,

                // KPI: Strike Percentage (Command)
                case
                    when totalPitches > 0
                         then cast ( totalFPS as Decimal(5, 3)) / totalTBF
                    else cast(
                             0 as Decimal(5, 3)
                         )
                end as FPSRate   : Decimal(5, 3),

                // KPI: WHIP (Effectiveness)
                // Formula: (Walks + Hits) / (Outs / 3)
                case
                    when totalOuts > 0
                         then cast ( (
                                  totalBB + totalHits
                              ) as Decimal(5, 3)) / (
                                  cast ( totalOuts as Decimal(5, 3)) / 3
                              )
                    else cast(
                             0 as Decimal(5, 3)
                         )
                end as WHIP      : Decimal(5, 3),

                // KPI: K/BB Ratio
                case
                    when totalBB > 0
                         then cast ( totalK as Decimal(5, 3)) / totalBB
                    else cast(
                             totalK as Decimal(5, 3)
                         ) // If 0 walks, ratio is just the K count
                end as KBB_Ratio : Decimal(5, 2)
        };


    // 3. Fielding Analytics Drill-down
    @readonly
    entity FieldingAnalytics as
        select from db.Defense {
            key player.ID            as playerID,
            key game.category.ID     as categoryID,
                player.name,
                // Explicitly define the types for aggregated sums
                sum(involvedInPlays) as totalChances : Integer,
                sum(completedPlays)  as totalSuccess : Integer,
                sum(errors)          as totalErrors  : Integer,

                // Calculation for Fielding Percentage
                case
                    when sum(involvedInPlays) > 0
                         then cast ( sum(completedPlays) as Decimal(5, 3)) / sum(involvedInPlays)
                    else cast(
                             0 as Decimal(5, 3)
                         )
                end                  as fieldingPct  : Decimal(5, 3)
        }
        group by
            player.ID,
            game.category.ID,
            player.name;

    // 4. Catcher Specific Analytics
    @readonly
    entity CatcherAnalytics  as
        select from analytics.CatcherBase {
            key playerID,
            key categoryID,
                playerName,
                // Explicitly define types coming from the CatcherBase view
                totalChances       : Integer,
                passedBalls        : Integer,

                case
                    when totalChances > 0
                         then cast ( totalSuccess as Decimal(5, 3)) / totalChances
                    else cast(
                             0 as Decimal(5, 3)
                         )
                end as fieldingPct : Decimal(5, 3)
        };

    // The "Header" - This represents the Lineup types (Moneyball, Grinder)
    @readonly
    entity LineupPlans {
        key planID      : String; // e.g., 'MONEYBALL', 'GRINDER'
        key categoryID  : UUID; // Links back to the Category
            name        : String; // e.g., 'Moneyball Optimization'
            description : String;
            // This allows the drill-down into the actual players!
            players     : Composition of many LineupPlayers
                              on  players.planID     = planID
                              and players.categoryID = categoryID;
    }

    // The "Items" - The actual players inside that specific lineup
    @readonly
    entity LineupPlayers {
        key playerID     : UUID;
        key planID       : String;
        key categoryID   : UUID;
            battingOrder : Integer; // Helps sort them 1 through 9
            name         : String;
            OPS          : Double;
            OBP          : Double;
            SLG          : Double;
            QAB_PCT      : Double;
            PA           : Integer;
    }

}

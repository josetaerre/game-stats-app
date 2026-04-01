using StatsService as service from '../../srv/services';

// ==========================================
// 1. CATEGORIES (The Main Page & Tabs)
// ==========================================
annotate service.Categories with @(
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Label: 'Category Name',
            Value: name
        },
        {
            $Type: 'UI.DataField',
            Label: 'Min Age',
            Value: ageMin
        },
        {
            $Type: 'UI.DataField',
            Label: 'Max Age',
            Value: ageMax
        }
    ],

    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'Category Name',
                Value: name
            },
            {
                $Type: 'UI.DataField',
                Label: 'Min Age',
                Value: ageMin
            },
            {
                $Type: 'UI.DataField',
                Label: 'Max Age',
                Value: ageMax
            }
        ]
    },

    UI.Facets                    : [
        // Tab 1: General Info
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet1',
            Label : 'General Information',
            Target: '@UI.FieldGroup#GeneratedGroup',
        },
        // Tab 2: Offense
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'OffenseFacet',
            Label : 'Player Offense',
            Target: 'offenseStats/@UI.LineItem',
        },
        // Tab 3: Pitching
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'PitchingFacet',
            Label : 'Pitching Stats',
            Target: 'pitchingStats/@UI.LineItem',
        },
        // Tab 4: Fielding
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'FieldingFacet',
            Label : 'Fielding Analytics',
            Target: 'fieldingStats/@UI.LineItem',
        },
        // Tab 5: Catchers
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'CatcherFacet',
            Label : 'Catcher Analytics',
            Target: 'catcherStats/@UI.LineItem',
        },
        // Tab 6: Lineups
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'LineupFacet',
            Label : 'Lineup Recommendations',
            Target: 'lineups/@UI.LineItem',
        }
    ]
);

// ==========================================
// 2. THE TABS (Columns for each Association)
// ==========================================

annotate service.PlayerStats with @(UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Label: 'Player',
        Value: playerName
    },
    {
        $Type: 'UI.DataField',
        Label: 'PA',
        Value: PA
    },
    {
        $Type: 'UI.DataField',
        Label: 'AB',
        Value: AB
    },
    {
        $Type: 'UI.DataField',
        Label: 'Hits',
        Value: H
    },
    {
        $Type: 'UI.DataField',
        Label: 'AVG',
        Value: AVG
    }
]);

annotate service.PitcherStats with @(UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Label: 'Pitcher',
        Value: playerName
    },
    {
        $Type: 'UI.DataField',
        Label: 'Pitches',
        Value: totalPitches
    },
    {
        $Type: 'UI.DataField',
        Label: 'First Pitch Strike %',
        Value: FPSRate
    },
    {
        $Type: 'UI.DataField',
        Label: 'WHIP',
        Value: WHIP
    },
    {
        $Type: 'UI.DataField',
        Label: 'K/BB',
        Value: KBB_Ratio
    }
]);

annotate service.FieldingAnalytics with @(UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Label: 'Player',
        Value: name
    },
    {
        $Type: 'UI.DataField',
        Label: 'Total Chances',
        Value: totalChances
    },
    {
        $Type: 'UI.DataField',
        Label: 'Errors',
        Value: totalErrors
    },
    {
        $Type: 'UI.DataField',
        Label: 'Fielding %',
        Value: fieldingPct
    }
]);

annotate service.CatcherAnalytics with @(UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Label: 'Catcher',
        Value: playerName
    },
    {
        $Type: 'UI.DataField',
        Label: 'Chances',
        Value: totalChances
    },
    {
        $Type: 'UI.DataField',
        Label: 'Passed Balls',
        Value: passedBalls
    },
    {
        $Type: 'UI.DataField',
        Label: 'Fielding %',
        Value: fieldingPct
    }
]);

// ==========================================
// 3. LINEUPS DRILL-DOWN NAVIGATION
// ==========================================

// 3A. What you see on the Category "Lineups" Tab
annotate service.LineupPlans with @(

    UI.HeaderInfo: {
        TypeName: 'Lineup',
        TypeNamePlural: 'Lineups',
        Title: { $Type: 'UI.DataField', Value: name },
        Description: { $Type: 'UI.DataField', Value: description }
    },

    UI.LineItem: [
        {
            $Type: 'UI.DataField',
            Label: 'Lineup Type',
            Value: name
        },
        {
            $Type: 'UI.DataField',
            Label: 'Description',
            Value: description
        }
    ],
    // This facet allows us to click a lineup row and see the players inside it
    UI.Facets  : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'LineupPlayersFacet',
        Label : 'Roster',
        Target: 'players/@UI.LineItem',
    }]
);

// 3B. What you see when you click into a specific Lineup
annotate service.LineupPlayers with @(UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Label: 'Order',
        Value: battingOrder
    },
    {
        $Type: 'UI.DataField',
        Label: 'Player',
        Value: name
    },
    {
        $Type: 'UI.DataField',
        Label: 'OPS',
        Value: OPS
    },
    {
        $Type: 'UI.DataField',
        Label: 'OBP',
        Value: OBP
    },
    {
        $Type: 'UI.DataField',
        Label: 'QAB %',
        Value: QAB_PCT
    }
]);

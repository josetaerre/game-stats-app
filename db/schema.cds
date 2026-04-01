namespace game;

using {cuid} from '@sap/cds/common';
using sap.common.CodeList;

type fieldPositionCode : Integer enum {
    Pitcher = 1;
    Catcher = 2;
    FirstBase = 3;
    SecondBase = 4;
    ThirdBase = 5;
    ShortStop = 6;
    LeftField = 7;
    CenterField = 8;
    RightField = 9
};

type outcomeCode       : String enum {
    Single = 'S';
    Double = 'D';
    Triple = 'T';
    HR = 'HR';
    Strikeout = 'K';
    BaseOnBalls = 'BB';
    HitByPitch = 'HBP';
    ReachedOnError = 'ROE';
    FieldersChoice = 'FC';
    SacFly = 'SACF';
    SacBunt = 'SACB';
    CatcherInterference = 'CI';
    GeneralOut = 'OUT';
    DoublePlay = 'DP';
};

entity FieldPosition : CodeList {
    key code : fieldPositionCode;
        name : String;
}

entity Outcome : CodeList {
    key code : outcomeCode;
        name : String;
}

entity Category : cuid {
    name         : String;
    ageMin       : Integer;
    ageMax       : Integer;
    gameDuration : Integer;
    notes        : String;

    
}

entity Player : cuid {
    jerseyNumber : Integer;
    name         : String;
    notes        : String;
    offense      : Association to many Offense
                       on offense.player = $self;
    defense      : Association to many Defense
                       on defense.player = $self;
    pitching     : Association to many Pitcher
                       on pitching.player = $self;
}

entity Coach : cuid {
    name        : String;
    isLeadCoach : Boolean;
}

entity Game : cuid {
    date               : Date;
    gameStart          : Time;
    gameEnd            : Time;
    category           : Association to Category;
    isHomeClub         : Boolean;
    opponent           : String;
    finalTeamScore     : Integer;
    finalOpponentScore : Integer;
    notes              : String;
    headCoach          : Association to Coach;
    assistantCoach     : Association to Coach;
    offenseLineup      : Composition of many Offense
                             on offenseLineup.game = $self;
    defenseLineup      : Composition of many Defense
                             on defenseLineup.game = $self;
    pitchers           : Composition of many Pitcher
                             on pitchers.game = $self;
}

entity Offense : cuid {
    game                  : Association to Game;
    player                : Association to Player;
    inning                : Integer;
    plateAppearanceInGame : Integer;
    outcome               : Association to Outcome;
    runsScored            : Integer;
    rbis                  : Integer;
    firstPitchSwing       : Boolean;
    pitchesSeen           : Integer;
    hardContact           : Boolean;
    stealingAttempts      : Integer;
    stolenBases           : Integer;
    notes                 : String;
}

entity Defense : cuid {
    game               : Association to Game;
    player             : Association to Player;
    positionPlayed     : Association to FieldPosition;
    outsPlayed         : Integer;
    involvedInPlays    : Integer;
    completedPlays     : Integer;
    errors             : Integer;
    passedBalls        : Integer;
    stolenBasesAllowed : Integer;
    caughtStealing     : Integer;
    notes              : String;
}

entity Pitcher : cuid {
    game              : Association to Game;
    player            : Association to Player;
    outsRecorded      : Integer;
    numberOfPitches   : Integer;
    firstPitchStrikes : Integer;
    hitsReceived      : Integer;
    strikeOuts        : Integer;
    walks             : Integer;
    earnedRuns        : Integer;
    hitByPitch        : Integer;
    wildPitches       : Integer;
    runsReceived      : Integer;
    hittersFaced      : Integer;
    balks             : Integer;
}

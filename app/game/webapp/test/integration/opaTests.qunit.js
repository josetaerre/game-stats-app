sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'game/test/integration/FirstJourney',
		'game/test/integration/pages/CategoriesList',
		'game/test/integration/pages/CategoriesObjectPage',
		'game/test/integration/pages/PlayerStatsObjectPage'
    ],
    function(JourneyRunner, opaJourney, CategoriesList, CategoriesObjectPage, PlayerStatsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('game') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheCategoriesList: CategoriesList,
					onTheCategoriesObjectPage: CategoriesObjectPage,
					onThePlayerStatsObjectPage: PlayerStatsObjectPage
                }
            },
            opaJourney.run
        );
    }
);
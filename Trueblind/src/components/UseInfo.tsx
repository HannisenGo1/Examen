export const Anvandarpolicy = ({ onClose, onAccept }: { onClose: () => void, onAccept: () => void }) => {
    return (
        <> 
            <div className="policy-container">
                <button className="close-button" onClick={onClose}> ❌ </button>
                <p className="policy-intro">
                    Användarvillkor för TrueBlind
                    Välkommen till TrueBlind! För att använda vår tjänst och 
                    hitta potentiella partners, 
                    måste du godkänna följande användarvillkor.
                </p>

                <div className="policy-section">
                    <h2 className="policy-title">1. Åldersgräns</h2>
                    <p className="policy-text">
                        För att använda TrueBlind måste du vara minst 18 år gammal. 
                        Om du inte uppfyller ålderskravet kommer ditt konto att stängas av omedelbart.
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="policy-title">2. Användning av appen</h2>
                    <p className="policy-text">
                        Denna app är avsedd för personer som söker seriösa partners. 
                        Vi tillhandahåller en plattform för att matcha med andra människor baserat på intressen, 
                        preferenser och värderingar. 
                        Du förbinder dig att använda appen på ett respektfullt och ansvarsfullt sätt.
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="policy-title">3. Förbjudet innehåll</h2>
                    <p className="policy-text">
                        Vi tolererar inte innehåll som är sexuellt explicit, 
                        diskriminerande eller på något sätt olämpligt. 
                        Innehåll som bryter mot våra riktlinjer kommer att leda till 
                        avstängning eller permanent borttagning från appen. Mobbning, 
                        trakasserier eller annat skadligt beteende är inte tillåtet.
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="policy-title">4. Ingen hantering av bilder</h2>
                    <p className="policy-text">
                        Vi hjälper dig att hitta äkta förbindelser baserat på känslor och 
                        gemensamma värderingar, utan att döma utifrån yttre faktorer. 
                        Därför hanterar vi inga bilder på vår plattform. 
                        Vi uppmuntrar dig att öppna ditt hjärta och låta känslorna 
                        leda dig till din sanna match.
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="policy-title">5. KÖP av VIP och krediter</h2>
                    <p className="policy-text">
                        För att få tillgång till VIP-funktioner och köpa krediter 
                        till kontot krävs betalning via Swish. 
                        Genom att genomföra betalningar bekräftar 
                        du att du har rätt att använda den betalningsmetoden och att 
                        du accepterar de aktuella betalningsvillkoren.
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="policy-title">6. Ansvar för din information</h2>
                    <p className="policy-text">
                        Du ansvarar för att den information du anger i appen är sann och korrekt. 
                        Du får inte ljuga om din ålder, identitet eller andra viktiga uppgifter 
                        som kan påverka andra användares upplevelse av appen. 
                        Att lämna falsk information kan leda till att ditt konto stängs av.
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="policy-title">7. Avstängning och blockerad åtkomst</h2>
                    <p className="policy-text">
                        Om du bryter mot dessa användarvillkor, 
                        inklusive att skriva olämpligt eller falskt innehåll, 
                        kommer ditt konto att stängas av, 
                        och du kommer inte att kunna använda appen igen.
                    </p>
                </div>

                <div className="policy-section">
                    <h2 className="policy-title">8. Ändringar av användarvillkoren</h2>
                    <p className="policy-text">
                        Vi förbehåller oss rätten att ändra dessa användarvillkor när som helst.
                        Om vi gör några ändringar kommer vi att meddela dig genom att uppdatera
                        villkoren på den här sidan. 
                        Genom att fortsätta använda appen efter ändringarna, 
                        godkänner du de nya villkoren.
                    </p>
                </div>

                <div className="accept-button-container">
                    <button onClick={onAccept} className="accept-button">
                        Jag godkänner
                    </button>
                </div>
            </div>
        </>
    );
};

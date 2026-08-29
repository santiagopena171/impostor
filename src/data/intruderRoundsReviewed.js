// Importado de rondas revisadas.xlsx.
const replacements = {
    '?Qui?n': '¿Quién', 'jug?': 'jugó', 'gan?': 'ganó', 'marc?': 'marcó', 'lleg?': 'llegó', 'represent?': 'representó',
    'm?s': 'más', 'm?ximo': 'máximo', 'm?ximos': 'máximos', 'pa?s': 'país', 'pa?ses': 'países', 'campe?n': 'campeón', 'capit?n': 'capitán',
    'Ag?ero': 'Agüero', 'Alc?ntara': 'Alcântara', 'Am?rica': 'América', 'Andr?s': 'Andrés', 'Atl?tico': 'Atlético', 'Aur?lien': 'Aurélien',
    'Bal?n': 'Balón', 'C?sar': 'César', 'Eto?o': "Eto'o", 'F?bregas': 'Fàbregas', 'F?lix': 'Félix', 'Fern?ndez': 'Fernández', 'God?n': 'Godín',
    'Ham??k': 'Hamšík', 'Hern?n': 'Hernán', 'Higua?n': 'Higuaín', 'Ibrahimovi?': 'Ibrahimović', 'J?r?me': 'Jérôme', 'Jap?n': 'Japón',
    'Jes?s': 'Jesús', 'Jo?o': 'João', 'Juli?n': 'Julián', 'Kak?': 'Kaká', 'Kant?': 'Kanté', 'Kound?': 'Koundé', 'M?ller': 'Müller',
    'Man?': 'Mané', 'Mar?a': 'María', 'Mart?nez': 'Martínez', 'Mati?': 'Matić', 'Mbapp?': 'Mbappé', 'Modri?': 'Modrić', 'N?Golo': "N'Golo",
    'Naz?rio': 'Nazário', 'P?rez': 'Pérez', 'Pjani?': 'Pjanić', 'Pusk?s': 'Puskás', 'R?diger': 'Rüdiger', 'Ra?l': 'Raúl', 'Rakiti?': 'Rakitić',
    'Rapha?l': 'Raphaël', 'Rodr?guez': 'Rodríguez', 'Rom?n': 'Román', 'S?nchez': 'Sánchez', 'San?': 'Sané', 'St?fano': 'Stéfano',
    'Su?rez': 'Suárez', 'T?vez': 'Tévez', 'Tchouam?ni': 'Tchouaméni', 'Tiemou?': 'Tiemoué', 'Vin?cius': 'Vinícius', '?lvaro': 'Álvaro',
    '?ngel': 'Ángel', '?degaard': 'Ødegaard', '?zil': 'Özil', '?ahin': 'Şahin'
};

const normalizeText = (value) => Object.entries(replacements).reduce(
    (text, [damaged, corrected]) => text.replaceAll(damaged, corrected),
    value
);

export const normalizeIntruderRound = (round) => ({
    ...round,
    question: normalizeText(round.question),
    players: round.players.map(normalizeText),
    intruder: normalizeText(round.intruder),
    explanation: normalizeText(round.explanation)
});

const intruderRoundsReviewed = [
    {
        "question": "?Qui?n NO jug? en Barcelona y Juventus?",
        "players": [
            "Dani Alves",
            "Zlatan Ibrahimovi?",
            "Miralem Pjani?",
            "Arthur Melo",
            "Luis Su?rez"
        ],
        "intruder": "Luis Su?rez",
        "explanation": "Alves, Ibrahimovi?, Pjani? y Arthur jugaron en Barcelona y Juventus. Su?rez no jug? en Juventus."
    },
    {
        "question": "?Qui?n NO jug? en Real Madrid y Manchester United?",
        "players": [
            "Cesc F?bregas",
            "Pedro",
            "Samuel Eto?o",
            "Deco",
            "John Terry"
        ],
        "intruder": "John Terry",
        "explanation": "F?bregas, Pedro, Eto?o y Deco jugaron en Barcelona y Chelsea. Terry no jug? en Barcelona."
    },
    {
        "question": "?Qui?n NO jug? en Liverpool y Barcelona?",
        "players": [
            "Luis Su?rez",
            "Javier Mascherano",
            "Philippe Coutinho",
            "Thiago Alc?ntara",
            "Steven Gerrard"
        ],
        "intruder": "Steven Gerrard",
        "explanation": "Su?rez, Mascherano, Coutinho y Thiago jugaron en Liverpool y Barcelona. Gerrard no jug? en Barcelona."
    },
    {
        "question": "?Qui?n NO jug? en Inter y Juventus?",
        "players": [
            "Zlatan Ibrahimovi?",
            "Arturo Vidal",
            "Hern?n Crespo",
            "Fabio Cannavaro",
            "Paolo Maldini"
        ],
        "intruder": "Paolo Maldini",
        "explanation": "Ibrahimovi?, Vidal, Crespo y Cannavaro jugaron en Inter y Juventus. Maldini no jug? en Juventus."
    },
    {
        "question": "?Qui?n NO jug? en Arsenal y Real Madrid?",
        "players": [
            "Mesut ?zil",
            "Nicolas Anelka",
            "Dani Ceballos",
            "Martin ?degaard",
            "Thierry Henry"
        ],
        "intruder": "Thierry Henry",
        "explanation": "?zil, Anelka, Ceballos y ?degaard jugaron en Arsenal y Real Madrid. Henry no jug? en Real Madrid."
    },
    {
        "question": "?Qui?n NO jug? en Bayern y Manchester City?",
        "players": [
            "Leroy San?",
            "Jo?o Cancelo",
            "J?r?me Boateng",
            "Claudio Pizarro",
            "Thomas M?ller"
        ],
        "intruder": "Thomas M?ller",
        "explanation": "San?, Cancelo, Boateng y Pizarro jugaron en Bayern y Manchester City. M?ller no jug? en City."
    },
    {
        "question": "?Qui?n NO jug? en PSG y Milan?",
        "players": [
            "Zlatan Ibrahimovi?",
            "Thiago Silva",
            "Gianluigi Donnarumma",
            "George Weah",
            "Marco Verratti"
        ],
        "intruder": "Marco Verratti",
        "explanation": "Ibrahimovi?, Thiago Silva, Donnarumma y Weah jugaron en PSG y Milan. Verratti no jug? en Milan."
    },
    {
        "question": "?Qui?n NO jug? en Roma y Chelsea?",
        "players": [
            "Antonio R?diger",
            "Tammy Abraham",
            "Ashley Cole",
            "Mohamed Salah",
            "Francesco Totti"
        ],
        "intruder": "Francesco Totti",
        "explanation": "R?diger, Abraham, Cole y Salah jugaron en Roma y Chelsea. Totti no jug? en Chelsea."
    },
    {
        "question": "?Qui?n NO jug? en Atl?tico de Madrid y Chelsea?",
        "players": [
            "?lvaro Morata",
            "Diego Costa",
            "Thibaut Courtois",
            "Jo?o F?lix",
            "Eden Hazard"
        ],
        "intruder": "Eden Hazard",
        "explanation": "Morata, Costa, Courtois y Jo?o F?lix jugaron en Atl?tico y Chelsea. Hazard no jug? en Atl?tico."
    },
    {
        "question": "?Qui?n NO jug? en Sevilla y Barcelona?",
        "players": [
            "Dani Alves",
            "Ivan Rakiti?",
            "Jules Kound?",
            "Luuk de Jong",
            "Jes?s Navas"
        ],
        "intruder": "Jes?s Navas",
        "explanation": "Alves, Rakiti?, Kound? y De Jong jugaron en Sevilla y Barcelona. Navas no jug? en Barcelona."
    },
    {
        "question": "?Qui?n NO jug? en Valencia y Real Madrid?",
        "players": [
            "David Alaba",
            "Ra?l Albiol",
            "?lvaro Negredo",
            "Ezequiel Garay",
            "David Villa"
        ],
        "intruder": "David Villa",
        "explanation": "Alaba, Albiol, Negredo y Garay jugaron en Valencia y Real Madrid. Villa no jug? en Real Madrid."
    },
    {
        "question": "?Qui?n NO jug? en Napoli y Chelsea?",
        "players": [
            "Jorginho",
            "Tiemou? Bakayoko",
            "Gonzalo Higua?n",
            "Juan Mata",
            "Marek Ham??k"
        ],
        "intruder": "Marek Ham??k",
        "explanation": "Jorginho, Bakayoko, Higua?n y Mata jugaron en Napoli y Chelsea. Ham??k no jug? en Chelsea."
    },
    {
        "question": "?Qui?n NO jug? en Borussia Dortmund y Real Madrid?",
        "players": [
            "Jude Bellingham",
            "Achraf Hakimi",
            "Nuri ?ahin",
            "Antonio R?diger",
            "Marco Reus"
        ],
        "intruder": "Marco Reus",
        "explanation": "Bellingham, Hakimi, ?ahin y R?diger jugaron en Dortmund y Real Madrid. Reus no jug? en Real Madrid."
    },
    {
        "question": "?Qui?n NO jug? en Benfica y Chelsea?",
        "players": [
            "David Luiz",
            "Nemanja Mati?",
            "Enzo Fern?ndez",
            "Jo?o F?lix",
            "Rui Costa"
        ],
        "intruder": "Rui Costa",
        "explanation": "David Luiz, Mati?, Enzo y Jo?o F?lix jugaron en Benfica y Chelsea. Rui Costa no jug? en Chelsea."
    },
    {
        "question": "?Qui?n NO jug? en Ajax y Manchester United?",
        "players": [
            "Edwin van der Sar",
            "Daley Blind",
            "Antony",
            "Lisandro Mart?nez",
            "Johan Cruyff"
        ],
        "intruder": "Johan Cruyff",
        "explanation": "Van der Sar, Blind, Antony y Lisandro jugaron en Ajax y Manchester United. Cruyff no jug? en United."
    },
    {
        "question": "?Qui?n NO jug? en Porto y Chelsea?",
        "players": [
            "Ricardo Carvalho",
            "Deco",
            "Ra?l Meireles",
            "Danilo Pereira",
            "Hulk"
        ],
        "intruder": "Hulk",
        "explanation": "Carvalho, Deco, Meireles y Danilo Pereira jugaron en Porto y Chelsea. Hulk no jug? en Chelsea."
    },
    {
        "question": "?Qui?n NO jug? en Lyon y Barcelona?",
        "players": [
            "Eric Abidal",
            "Memphis Depay",
            "Samuel Umtiti",
            "Thierry Henry",
            "Juninho"
        ],
        "intruder": "Juninho",
        "explanation": "Abidal, Depay, Umtiti y Henry jugaron en Lyon y Barcelona. Juninho no jug? en Barcelona."
    },
    {
        "question": "?Qui?n NO jug? en Monaco y Real Madrid?",
        "players": [
            "Kylian Mbapp?",
            "Aur?lien Tchouam?ni",
            "James Rodr?guez",
            "Emmanuel Adebayor",
            "Radamel Falcao"
        ],
        "intruder": "Radamel Falcao",
        "explanation": "Mbapp?, Tchouam?ni, James y Adebayor jugaron en Monaco y Real Madrid. Falcao no jug? en Real Madrid."
    },
    {
        "question": "?Qui?n NO jug? en Santos y Real Madrid?",
        "players": [
            "Robinho",
            "Rodrygo",
            "Danilo",
            "Endrick",
            "Neymar"
        ],
        "intruder": "Neymar",
        "explanation": "Robinho, Rodrygo, Danilo y Endrick jugaron en Santos y Real Madrid. Neymar no jug? en Real Madrid."
    },
    {
        "question": "?Qui?n NO jug? en River Plate y Real Madrid?",
        "players": [
            "Gonzalo Higua?n",
            "Javier Saviola",
            "Esteban Cambiasso",
            "Juli?n ?lvarez",
            "Enzo P?rez"
        ],
        "intruder": "Enzo P?rez",
        "explanation": "Higua?n, Saviola, Cambiasso y Juli?n ?lvarez jugaron en River y Real Madrid. Enzo P?rez no jug? en Real Madrid."
    },
    {
        "question": "?Qui?n NO jug? en Boca Juniors y Juventus?",
        "players": [
            "Carlos T?vez",
            "Rodrigo Bentancur",
            "Paulo Dybala",
            "Gonzalo Higua?n",
            "Juan Rom?n Riquelme"
        ],
        "intruder": "Juan Rom?n Riquelme",
        "explanation": "T?vez, Bentancur, Dybala e Higua?n jugaron en Boca y Juventus. Riquelme no jug? en Juventus."
    },
    {
        "question": "?Qui?n NO jug? en Flamengo y Inter?",
        "players": [
            "Gabriel Barbosa",
            "Julio C?sar",
            "Adriano",
            "Felipe Melo",
            "Zico"
        ],
        "intruder": "Zico",
        "explanation": "Gabigol, Julio C?sar, Adriano y Felipe Melo jugaron en Flamengo e Inter. Zico no jug? en Inter."
    },
    {
        "question": "?Qui?n NO jug? en Real Madrid y PSG?",
        "players": [
            "Sergio Ramos",
            "?ngel Di Mar?a",
            "Keylor Navas",
            "Achraf Hakimi",
            "Toni Kroos"
        ],
        "intruder": "Toni Kroos",
        "explanation": "Ramos, Di Mar?a, Navas y Hakimi jugaron en Real Madrid y PSG. Kroos no jug? en PSG."
    },
    {
        "question": "?Qui?n NO gan? una Copa del Mundo?",
        "players": [
            "Lionel Messi",
            "Kylian Mbapp?",
            "Antoine Griezmann",
            "N?Golo Kant?",
            "Erling Haaland"
        ],
        "intruder": "Erling Haaland",
        "explanation": "Messi, Mbapp?, Griezmann y Kant? ganaron un Mundial. Haaland no lo gan?."
    },
    {
        "question": "?Qui?n NO gan? la Eurocopa?",
        "players": [
            "Cristiano Ronaldo",
            "Andr?s Iniesta",
            "Gianluigi Donnarumma",
            "Antoine Griezmann",
            "Zlatan Ibrahimovi?"
        ],
        "intruder": "Zlatan Ibrahimovi?",
        "explanation": "Cristiano, Iniesta, Donnarumma y Griezmann ganaron la Eurocopa. Ibrahimovi? no la gan?."
    },
    {
        "question": "?Qui?n NO gan? la Copa Am?rica?",
        "players": [
            "Lionel Messi",
            "Luis Su?rez",
            "Alexis S?nchez",
            "Dani Alves",
            "Radamel Falcao"
        ],
        "intruder": "Radamel Falcao",
        "explanation": "Messi, Su?rez, Alexis y Dani Alves ganaron Copa Am?rica. Falcao no la gan?."
    },
    {
        "question": "?Qui?n NO gan? la Champions League?",
        "players": [
            "Lionel Messi",
            "Karim Benzema",
            "Kevin De Bruyne",
            "N?Golo Kant?",
            "Francesco Totti"
        ],
        "intruder": "Francesco Totti",
        "explanation": "Messi, Benzema, De Bruyne y Kant? ganaron la Champions. Totti no la gan?."
    },
    {
        "question": "?Qui?n NO gan? la Copa Libertadores?",
        "players": [
            "Neymar",
            "Carlos T?vez",
            "Juli?n ?lvarez",
            "Enzo Fern?ndez",
            "Cristiano Ronaldo"
        ],
        "intruder": "Cristiano Ronaldo",
        "explanation": "Neymar, T?vez, Juli?n ?lvarez y Enzo Fern?ndez ganaron la Libertadores. Cristiano no la gan?."
    },
    {
        "question": "?Qui?n NO gan? el Bal?n de Oro?",
        "players": [
            "Ronaldinho",
            "Rivaldo",
            "George Weah",
            "Michael Owen",
            "Thierry Henry"
        ],
        "intruder": "Thierry Henry",
        "explanation": "Ronaldinho, Rivaldo, Weah y Owen ganaron el Bal?n de Oro. Henry no lo gan?."
    },
    {
        "question": "?Qui?n NO gan? el premio The Best?",
        "players": [
            "Lionel Messi",
            "Robert Lewandowski",
            "Luka Modri?",
            "Karim Benzema",
            "Neymar"
        ],
        "intruder": "Neymar",
        "explanation": "Messi, Lewandowski, Modri? y Benzema ganaron The Best. Neymar no lo gan?."
    },
    {
        "question": "?Qui?n NO gan? una Champions League con Bayern?",
        "players": [
            "Manuel Neuer",
            "Thomas M?ller",
            "Robert Lewandowski",
            "Arjen Robben",
            "Harry Kane"
        ],
        "intruder": "Harry Kane",
        "explanation": "Neuer, M?ller, Lewandowski y Robben ganaron la Champions con Bayern. Kane no la gan?."
    },
    {
        "question": "?Qui?n NO gan? la Premier League?",
        "players": [
            "Sergio Ag?ero",
            "Kevin De Bruyne",
            "N?Golo Kant?",
            "Mohamed Salah",
            "Harry Kane"
        ],
        "intruder": "Harry Kane",
        "explanation": "Ag?ero, De Bruyne, Kant? y Salah ganaron la Premier League. Kane no la gan?."
    },
    {
        "question": "?Qui?n NO gan? La Liga?",
        "players": [
            "Lionel Messi",
            "Cristiano Ronaldo",
            "Luka Modri?",
            "Antoine Griezmann",
            "Sergio Ag?ero"
        ],
        "intruder": "Sergio Ag?ero",
        "explanation": "Messi, Cristiano, Modri? y Griezmann ganaron La Liga. Ag?ero no la gan?."
    },
    {
        "question": "?Qui?n NO fue m?ximo goleador de un Mundial?",
        "players": [
            "Ronaldo Naz?rio",
            "Miroslav Klose",
            "Thomas M?ller",
            "Harry Kane",
            "Cristiano Ronaldo"
        ],
        "intruder": "Cristiano Ronaldo",
        "explanation": "Ronaldo, Klose, M?ller y Kane fueron m?ximos goleadores de un Mundial. Cristiano no lo fue."
    },
    {
        "question": "?Qui?n NO gan? el Guante de Oro del Mundial?",
        "players": [
            "Oliver Kahn",
            "Iker Casillas",
            "Manuel Neuer",
            "Emiliano Mart?nez",
            "Gianluigi Buffon"
        ],
        "intruder": "Gianluigi Buffon",
        "explanation": "Kahn, Casillas, Neuer y Mart?nez ganaron el Guante de Oro del Mundial. Buffon no lo gan?."
    },
    {
        "question": "?Qui?n NO marc? en una final de Champions League?",
        "players": [
            "Lionel Messi",
            "Cristiano Ronaldo",
            "Gareth Bale",
            "Didier Drogba",
            "Zlatan Ibrahimovi?"
        ],
        "intruder": "Zlatan Ibrahimovi?",
        "explanation": "Messi, Cristiano, Bale y Drogba marcaron en finales de Champions. Ibrahimovi? no."
    },
    {
        "question": "?Qui?n NO jug? en m?s de un continente?",
        "players": [
            "David Beckham",
            "Zlatan Ibrahimovi?",
            "Thierry Henry",
            "Andr?s Iniesta",
            "Francesco Totti"
        ],
        "intruder": "Francesco Totti",
        "explanation": "Beckham, Ibrahimovi?, Henry e Iniesta jugaron en m?s de un continente. Totti jug? profesionalmente solo en Europa."
    },
    {
        "question": "?Qui?n NO jug? en Arabia Saudita?",
        "players": [
            "Cristiano Ronaldo",
            "Karim Benzema",
            "Neymar",
            "Sadio Man?",
            "Lionel Messi"
        ],
        "intruder": "Lionel Messi",
        "explanation": "Cristiano, Benzema, Neymar y Man? jugaron en Arabia Saudita. Messi no."
    },
    {
        "question": "?Qui?n NO jug? en Jap?n?",
        "players": [
            "Andr?s Iniesta",
            "David Villa",
            "Fernando Torres",
            "Lukas Podolski",
            "Lionel Messi"
        ],
        "intruder": "Lionel Messi",
        "explanation": "Iniesta, Villa, Torres y Podolski jugaron en Jap?n. Messi no."
    },
    {
        "question": "?Qui?n NO gan? una Europa League?",
        "players": [
            "Antoine Griezmann",
            "Radamel Falcao",
            "Fernando Torres",
            "Eden Hazard",
            "Lionel Messi"
        ],
        "intruder": "Lionel Messi",
        "explanation": "Griezmann, Falcao, Torres y Hazard ganaron la Europa League. Messi no."
    },
    {
        "question": "?Qui?n NO gan? la Copa del Rey?",
        "players": [
            "Lionel Messi",
            "Cristiano Ronaldo",
            "Karim Benzema",
            "Sergio Ramos",
            "David Beckham"
        ],
        "intruder": "David Beckham",
        "explanation": "Messi, Cristiano, Benzema y Ramos ganaron la Copa del Rey. Beckham no la gan?."
    },
    {
        "question": "?Qui?n NO gan? el Mundial de Clubes?",
        "players": [
            "Lionel Messi",
            "Cristiano Ronaldo",
            "Toni Kroos",
            "Karim Benzema",
            "Harry Kane"
        ],
        "intruder": "Harry Kane",
        "explanation": "Messi, Cristiano, Kroos y Benzema ganaron el Mundial de Clubes. Kane no."
    },
    {
        "question": "?Qui?n NO fue entrenado por Pep Guardiola?",
        "players": [
            "Lionel Messi",
            "Kevin De Bruyne",
            "Robert Lewandowski",
            "Erling Haaland",
            "Cristiano Ronaldo"
        ],
        "intruder": "Cristiano Ronaldo",
        "explanation": "Messi, De Bruyne, Lewandowski y Haaland fueron entrenados por Guardiola. Cristiano no."
    },
    {
        "question": "?Qui?n NO fue entrenado por Jos? Mourinho?",
        "players": [
            "Cristiano Ronaldo",
            "Didier Drogba",
            "Zlatan Ibrahimovi?",
            "Samuel Eto?o",
            "Lionel Messi"
        ],
        "intruder": "Lionel Messi",
        "explanation": "Cristiano, Drogba, Ibrahimovi? y Eto?o fueron entrenados por Mourinho. Messi no."
    },
    {
        "question": "?Qui?n NO fue entrenado por Carlo Ancelotti?",
        "players": [
            "Cristiano Ronaldo",
            "Kak?",
            "Luka Modri?",
            "Vin?cius Jr",
            "Lionel Messi"
        ],
        "intruder": "Lionel Messi",
        "explanation": "Cristiano, Kak?, Modri? y Vin?cius fueron entrenados por Ancelotti. Messi no."
    },
    {
        "question": "?Qui?n NO lleg? a una final de Copa del Mundo?",
        "players": [
            "Ronaldo Naz?rio",
            "Zinedine Zidane",
            "Andr?s Iniesta",
            "Luka Modri?",
            "Erling Haaland"
        ],
        "intruder": "Erling Haaland",
        "explanation": "Ronaldo, Zidane, Iniesta y Modri? llegaron a una final mundialista. Haaland no."
    },
    {
        "question": "?Qui?n NO gan? el premio Pusk?s?",
        "players": [
            "Cristiano Ronaldo",
            "Neymar",
            "Zlatan Ibrahimovi?",
            "Mohamed Salah",
            "Lionel Messi"
        ],
        "intruder": "Lionel Messi",
        "explanation": "Cristiano, Neymar, Ibrahimovi? y Salah ganaron el Pusk?s. Messi no lo gan?."
    },
    {
        "question": "?Qui?n NO fue ganador del Golden Boy?",
        "players": [
            "Lionel Messi",
            "Wayne Rooney",
            "Kylian Mbapp?",
            "Erling Haaland",
            "Neymar"
        ],
        "intruder": "Neymar",
        "explanation": "Messi, Rooney, Mbapp? y Haaland ganaron el Golden Boy. Neymar no."
    },
    {
        "question": "?Qui?n NO gan? la Bota de Oro europea?",
        "players": [
            "Lionel Messi",
            "Cristiano Ronaldo",
            "Luis Su?rez",
            "Robert Lewandowski",
            "Neymar"
        ],
        "intruder": "Neymar",
        "explanation": "Messi, Cristiano, Su?rez y Lewandowski ganaron la Bota de Oro europea. Neymar no."
    },
    {
        "question": "?Qui?n NO gan? la Copa Am?rica como capit?n?",
        "players": [
            "Lionel Messi",
            "Diego God?n",
            "Dani Alves",
            "Claudio Bravo",
            "Luis Su?rez"
        ],
        "intruder": "Luis Su?rez",
        "explanation": "Messi, God?n, Dani Alves y Claudio Bravo levantaron Copa Am?rica como capitanes. Su?rez no fue capit?n campe?n."
    },
    {
        "question": "?Qui?n NO gan? la Eurocopa como capit?n?",
        "players": [
            "Cristiano Ronaldo",
            "Iker Casillas",
            "Gianluigi Donnarumma",
            "Didier Deschamps",
            "Zinedine Zidane"
        ],
        "intruder": "Zinedine Zidane",
        "explanation": "Cristiano, Casillas, Donnarumma y Deschamps fueron capitanes campeones de Eurocopa. Zidane no."
    },
    {
        "question": "?Qui?n NO gan? el Mundial con dos pa?ses?",
        "players": [
            "Alfredo Di St?fano",
            "Ferenc Pusk?s",
            "Thiago Motta",
            "Diego Costa",
            "Miroslav Klose"
        ],
        "intruder": "Miroslav Klose",
        "explanation": "Di St?fano, Pusk?s, Motta y Diego Costa representaron a m?s de un pa?s. Klose solo represent? a Alemania."
    },
    {
        "question": "?Qui?n NO jug? para un club de la Premier League?",
        "players": [
            "Lionel Messi",
            "Thierry Henry",
            "Zlatan Ibrahimovi?",
            "?ngel Di Mar?a",
            "Kylian Mbapp?"
        ],
        "intruder": "Kylian Mbapp?",
        "explanation": "Messi, Henry, Ibrahimovi? y Di Mar?a jugaron en la Premier League. Mbapp? no."
    },
    {
        "question": "?Qui?n NO jug? para un club de la Serie A?",
        "players": [
            "Cristiano Ronaldo",
            "Zlatan Ibrahimovi?",
            "Luka Modri?",
            "Paulo Dybala",
            "Lionel Messi"
        ],
        "intruder": "Lionel Messi",
        "explanation": "Cristiano, Ibrahimovi?, Modri? y Dybala jugaron en Serie A. Messi no."
    },
    {
        "question": "?Qui?n NO jug? para un club de La Liga?",
        "players": [
            "Lionel Messi",
            "Cristiano Ronaldo",
            "Neymar",
            "Luis Su?rez",
            "Erling Haaland"
        ],
        "intruder": "Erling Haaland",
        "explanation": "Messi, Cristiano, Neymar y Su?rez jugaron en La Liga. Haaland no."
    }
];

export default intruderRoundsReviewed.map(normalizeIntruderRound);

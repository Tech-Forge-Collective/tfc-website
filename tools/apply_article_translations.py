from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LANGS = ["nl", "pl", "de", "es", "fr"]


ARTICLE = {
    "Why GPT Is Not Enough for Complex Engineering Organisations": {
        "nl": "Waarom GPT niet genoeg is voor complexe engineeringorganisaties",
        "pl": "Dlaczego GPT nie wystarcza zlozonym organizacjom inzynierskim",
        "de": "Warum GPT fuer komplexe Engineering-Organisationen nicht ausreicht",
        "es": "Por que GPT no basta para organizaciones de ingenieria complejas",
        "fr": "Pourquoi GPT ne suffit pas aux organisations d’ingenierie complexes",
    },
    "A TFC engineering article on why complex engineering organisations need more than chat.": {
        "nl": "Een TFC-engineeringartikel over waarom complexe engineeringorganisaties meer nodig hebben dan chat.",
        "pl": "Artykul inzynierski TFC o tym, dlaczego zlozone organizacje inzynierskie potrzebuja wiecej niz czatu.",
        "de": "Ein TFC-Engineering-Artikel darueber, warum komplexe Engineering-Organisationen mehr brauchen als Chat.",
        "es": "Un articulo de ingenieria de TFC sobre por que las organizaciones de ingenieria complejas necesitan mas que chat.",
        "fr": "Un article d’ingenierie TFC sur les raisons pour lesquelles les organisations d’ingenierie complexes ont besoin de plus qu’un chat.",
    },
    "Engineering organisations need deterministic calculations, traceability, standards, evidence, decisions, and long-term engineering memory alongside AI.": {
        "nl": "Engineeringorganisaties hebben naast AI deterministische berekeningen, traceerbaarheid, normen, bewijs, besluiten en langetermijn-engineeringgeheugen nodig.",
        "pl": "Organizacje inzynierskie potrzebuja obok AI deterministycznych obliczen, identyfikowalnosci, standardow, dowodow, decyzji i dlugoterminowej pamieci inzynierskiej.",
        "de": "Engineering-Organisationen brauchen neben AI deterministische Berechnungen, Rueckverfolgbarkeit, Standards, Nachweise, Entscheidungen und langfristiges Engineering-Gedaechtnis.",
        "es": "Las organizaciones de ingenieria necesitan, junto con AI, calculos deterministas, trazabilidad, normas, evidencia, decisiones y memoria de ingenieria a largo plazo.",
        "fr": "Les organisations d’ingenierie ont besoin, en plus de l’AI, de calculs deterministes, de tracabilite, de standards, de preuves, de decisions et d’une memoire d’ingenierie durable.",
    },
    "Language models are useful engineering assistants, but complex engineering organisations need structured systems for calculation, evidence, memory, standards, decisions, and governance.": {
        "nl": "Taalmodellen zijn nuttige engineeringassistenten, maar complexe engineeringorganisaties hebben gestructureerde systemen nodig voor berekening, bewijs, geheugen, normen, besluiten en governance.",
        "pl": "Modele jezykowe sa przydatnymi asystentami inzynierskimi, ale zlozone organizacje inzynierskie potrzebuja uporzadkowanych systemow do obliczen, dowodow, pamieci, standardow, decyzji i nadzoru.",
        "de": "Sprachmodelle sind nuetzliche Engineering-Assistenten, aber komplexe Engineering-Organisationen brauchen strukturierte Systeme fuer Berechnung, Nachweis, Gedaechtnis, Standards, Entscheidungen und Governance.",
        "es": "Los modelos de lenguaje son asistentes utiles para ingenieria, pero las organizaciones de ingenieria complejas necesitan sistemas estructurados para calculo, evidencia, memoria, normas, decisiones y gobernanza.",
        "fr": "Les modeles de langage sont des assistants d’ingenierie utiles, mais les organisations d’ingenierie complexes ont besoin de systemes structures pour le calcul, les preuves, la memoire, les standards, les decisions et la gouvernance.",
    },
    "Author": {"nl": "Auteur", "pl": "Autor", "de": "Autor", "es": "Autor", "fr": "Auteur"},
    "Published": {"nl": "Gepubliceerd", "pl": "Opublikowano", "de": "Veroeffentlicht", "es": "Publicado", "fr": "Publie"},
    "Updated": {"nl": "Bijgewerkt", "pl": "Zaktualizowano", "de": "Aktualisiert", "es": "Actualizado", "fr": "Mis a jour"},
    "Reading time": {"nl": "Leestijd", "pl": "Czas czytania", "de": "Lesezeit", "es": "Tiempo de lectura", "fr": "Temps de lecture"},
    "12 min": {"nl": "12 min", "pl": "12 min", "de": "12 Min.", "es": "12 min", "fr": "12 min"},
    "Tags": {"nl": "Tags", "pl": "Tagi", "de": "Tags", "es": "Etiquetas", "fr": "Tags"},
    "Contents": {"nl": "Inhoud", "pl": "Spis tresci", "de": "Inhalt", "es": "Contenido", "fr": "Contenu"},
    "Engineering is not general knowledge work": {
        "nl": "Engineering is geen algemeen kenniswerk",
        "pl": "Inzynieria nie jest ogolna praca z wiedza",
        "de": "Engineering ist keine allgemeine Wissensarbeit",
        "es": "La ingenieria no es trabajo general de conocimiento",
        "fr": "L’ingenierie n’est pas un travail general de connaissance",
    },
    "Why one model cannot own complexity": {
        "nl": "Waarom een model complexiteit niet kan dragen",
        "pl": "Dlaczego jeden model nie moze zarzadzac zlozonoscia",
        "de": "Warum ein Modell Komplexitaet nicht allein tragen kann",
        "es": "Por que un solo modelo no puede controlar la complejidad",
        "fr": "Pourquoi un seul modele ne peut pas porter la complexite",
    },
    "Deterministic calculations still matter": {
        "nl": "Deterministische berekeningen blijven belangrijk",
        "pl": "Deterministyczne obliczenia nadal maja znaczenie",
        "de": "Deterministische Berechnungen bleiben wichtig",
        "es": "Los calculos deterministas siguen importando",
        "fr": "Les calculs deterministes restent essentiels",
    },
    "Traceability, standards, and evidence": {
        "nl": "Traceerbaarheid, normen en bewijs",
        "pl": "Identyfikowalnosc, standardy i dowody",
        "de": "Rueckverfolgbarkeit, Standards und Nachweise",
        "es": "Trazabilidad, normas y evidencia",
        "fr": "Tracabilite, standards et preuves",
    },
    "Engineering memory and Engineering DNA": {
        "nl": "Engineeringgeheugen en Engineering DNA",
        "pl": "Pamiec inzynierska i Engineering DNA",
        "de": "Engineering-Gedaechtnis und Engineering DNA",
        "es": "Memoria de ingenieria y Engineering DNA",
        "fr": "Memoire d’ingenierie et Engineering DNA",
    },
    "Why readiness matters": {
        "nl": "Waarom readiness belangrijk is",
        "pl": "Dlaczego gotowosc ma znaczenie",
        "de": "Warum Readiness wichtig ist",
        "es": "Por que importa la readiness",
        "fr": "Pourquoi la readiness compte",
    },
    "Why Engineering Readiness matters": {
        "nl": "Waarom Engineering Readiness belangrijk is",
        "pl": "Dlaczego Engineering Readiness ma znaczenie",
        "de": "Warum Engineering Readiness wichtig ist",
        "es": "Por que importa Engineering Readiness",
        "fr": "Pourquoi Engineering Readiness compte",
    },
    "Why ProjecTile combines systems with AI": {
        "nl": "Waarom ProjecTile systemen combineert met AI",
        "pl": "Dlaczego ProjecTile laczy systemy z AI",
        "de": "Warum ProjecTile Systeme mit AI kombiniert",
        "es": "Por que ProjecTile combina sistemas con AI",
        "fr": "Pourquoi ProjecTile combine systemes et AI",
    },
    "Engineering organisations do not operate only through conversation. They work through requirements, specifications, drawings, calculations, inspection records, risk assessments, vendor documentation, standards, commissioning notes, operating experience, and formal decisions.": {
        "nl": "Engineeringorganisaties werken niet alleen via gesprekken. Ze werken met eisen, specificaties, tekeningen, berekeningen, inspectieregisters, risicobeoordelingen, leveranciersdocumentatie, normen, commissioning-notities, operationele ervaring en formele besluiten.",
        "pl": "Organizacje inzynierskie nie dzialaja wylacznie przez rozmowy. Pracuja na wymaganiach, specyfikacjach, rysunkach, obliczeniach, zapisach inspekcji, ocenach ryzyka, dokumentacji dostawcow, standardach, notatkach z uruchomien, doswiadczeniu operacyjnym i formalnych decyzjach.",
        "de": "Engineering-Organisationen arbeiten nicht nur ueber Gespraeche. Sie arbeiten mit Anforderungen, Spezifikationen, Zeichnungen, Berechnungen, Inspektionsaufzeichnungen, Risikobewertungen, Lieferantendokumentation, Standards, Inbetriebnahme-Notizen, Betriebserfahrung und formalen Entscheidungen.",
        "es": "Las organizaciones de ingenieria no operan solo mediante conversacion. Trabajan con requisitos, especificaciones, planos, calculos, registros de inspeccion, evaluaciones de riesgo, documentacion de proveedores, normas, notas de puesta en marcha, experiencia operativa y decisiones formales.",
        "fr": "Les organisations d’ingenierie ne fonctionnent pas seulement par conversation. Elles travaillent avec exigences, specifications, plans, calculs, dossiers d’inspection, analyses de risque, documentation fournisseur, standards, notes de mise en service, experience operationnelle et decisions formelles.",
    },
    "A general assistant can summarize a document or draft an explanation. That is useful, but it does not create an engineering operating model. Engineering work depends on knowing what has been verified, what is assumed, what is missing, what standard applies, and what decision was made under which constraints.": {
        "nl": "Een algemene assistent kan een document samenvatten of een uitleg opstellen. Dat is nuttig, maar het vormt geen engineering operating model. Engineeringwerk hangt af van weten wat is geverifieerd, wat is aangenomen, wat ontbreekt, welke norm geldt en welk besluit onder welke randvoorwaarden is genomen.",
        "pl": "Ogolny asystent moze strescic dokument albo przygotowac wyjasnienie. To jest przydatne, ale nie tworzy modelu operacyjnego inzynierii. Praca inzynierska zalezy od wiedzy, co zweryfikowano, co zalozono, czego brakuje, jaki standard obowiazuje i jaka decyzje podjeto przy jakich ograniczeniach.",
        "de": "Ein allgemeiner Assistent kann ein Dokument zusammenfassen oder eine Erklaerung entwerfen. Das ist nuetzlich, schafft aber kein Engineering-Betriebsmodell. Engineering-Arbeit haengt davon ab zu wissen, was verifiziert wurde, was angenommen wird, was fehlt, welcher Standard gilt und welche Entscheidung unter welchen Randbedingungen getroffen wurde.",
        "es": "Un asistente general puede resumir un documento o redactar una explicacion. Eso es util, pero no crea un modelo operativo de ingenieria. El trabajo de ingenieria depende de saber que se ha verificado, que se asume, que falta, que norma aplica y que decision se tomo bajo que restricciones.",
        "fr": "Un assistant general peut resumer un document ou rediger une explication. C’est utile, mais cela ne cree pas un modele operationnel d’ingenierie. Le travail d’ingenierie depend de ce qui a ete verifie, de ce qui est suppose, de ce qui manque, du standard applicable et de la decision prise sous quelles contraintes.",
    },
    "For an industrial example, a robot battery design is not only a runtime question. It touches power balance, fuse selection, duty cycle, temperature, charging, mission profile, maintenance access, failure modes, and operational risk. A chat answer may help start the work, but the engineering system must preserve the evidence chain.": {
        "nl": "Als industrieel voorbeeld is een robotbatterijontwerp niet alleen een runtime-vraag. Het raakt vermogensbalans, zekeringselectie, duty cycle, temperatuur, laden, missieprofiel, onderhoudstoegang, faalmodi en operationeel risico. Een chatantwoord kan helpen om te starten, maar het engineeringsysteem moet de bewijsketen bewaren.",
        "pl": "Jako przyklad przemyslowy: projekt baterii robota nie jest tylko pytaniem o czas pracy. Dotyczy bilansu mocy, doboru bezpiecznikow, cyklu pracy, temperatury, ladowania, profilu misji, dostepu serwisowego, trybow awarii i ryzyka operacyjnego. Odpowiedz czatu moze pomoc zaczac, ale system inzynierski musi zachowac lancuch dowodowy.",
        "de": "Als industrielles Beispiel ist ein Roboter-Batteriedesign nicht nur eine Laufzeitfrage. Es betrifft Leistungsbilanz, Sicherungsauswahl, Duty Cycle, Temperatur, Laden, Missionsprofil, Wartungszugang, Fehlermodi und Betriebsrisiko. Eine Chat-Antwort kann den Einstieg erleichtern, aber das Engineering-System muss die Nachweiskette erhalten.",
        "es": "Como ejemplo industrial, el diseno de una bateria de robot no es solo una pregunta de autonomia. Afecta al balance de potencia, seleccion de fusibles, ciclo de trabajo, temperatura, carga, perfil de mision, acceso de mantenimiento, modos de fallo y riesgo operativo. Una respuesta de chat puede iniciar el trabajo, pero el sistema de ingenieria debe preservar la cadena de evidencia.",
        "fr": "Comme exemple industriel, la conception d’une batterie de robot n’est pas seulement une question d’autonomie. Elle touche le bilan de puissance, le choix des fusibles, le cycle de service, la temperature, la charge, le profil de mission, l’acces maintenance, les modes de defaillance et le risque operationnel. Une reponse de chat peut aider a demarrer, mais le systeme d’ingenierie doit conserver la chaine de preuves.",
    },
    "A single large language model can reason over text, but it does not automatically become a project memory, calculation engine, standards register, approval system, or engineering quality process. Complex engineering needs separation of responsibilities.": {
        "nl": "Een enkel groot taalmodel kan over tekst redeneren, maar wordt niet automatisch projectgeheugen, rekenengine, normenregister, goedkeuringssysteem of engineeringkwaliteitsproces. Complexe engineering vraagt scheiding van verantwoordelijkheden.",
        "pl": "Jeden duzy model jezykowy moze rozumowac na tekscie, ale nie staje sie automatycznie pamiecia projektu, silnikiem obliczen, rejestrem standardow, systemem zatwierdzania ani procesem jakosci inzynierskiej. Zlozona inzynieria wymaga podzialu odpowiedzialnosci.",
        "de": "Ein einzelnes grosses Sprachmodell kann ueber Text reasoning leisten, wird aber nicht automatisch zu Projektgedaechtnis, Berechnungsengine, Standardregister, Freigabesystem oder Engineering-Qualitaetsprozess. Komplexes Engineering braucht getrennte Verantwortlichkeiten.",
        "es": "Un unico modelo de lenguaje grande puede razonar sobre texto, pero no se convierte automaticamente en memoria de proyecto, motor de calculo, registro de normas, sistema de aprobacion o proceso de calidad de ingenieria. La ingenieria compleja necesita separacion de responsabilidades.",
        "fr": "Un seul grand modele de langage peut raisonner sur du texte, mais il ne devient pas automatiquement une memoire de projet, un moteur de calcul, un registre de standards, un systeme d’approbation ou un processus qualite d’ingenierie. L’ingenierie complexe exige une separation des responsabilites.",
    },
    'In ProjecTile, the target pattern is not "ask one model everything." The pattern is closer to an Engineering Director coordinating specialists, deterministic tools, knowledge packs, reports, source citations, and quality review.': {
        "nl": 'In ProjecTile is het doelpatroon niet "vraag alles aan een model". Het patroon lijkt meer op een Engineering Director die specialisten, deterministische tools, knowledge packs, rapporten, broncitaten en kwaliteitsreview coordineert.',
        "pl": 'W ProjecTile wzorzec docelowy to nie "zapytaj jeden model o wszystko". Wzorzec jest blizszy Engineering Director, ktory koordynuje specjalistow, deterministyczne narzedzia, knowledge packs, raporty, cytowania zrodel i przeglad jakosci.',
        "de": 'In ProjecTile ist das Zielmuster nicht "ein Modell alles fragen". Das Muster entspricht eher einem Engineering Director, der Spezialisten, deterministische Werkzeuge, Knowledge Packs, Berichte, Quellenzitate und Qualitaetsreview koordiniert.',
        "es": 'En ProjecTile, el patron objetivo no es "preguntar todo a un modelo". El patron se parece mas a un Engineering Director que coordina especialistas, herramientas deterministas, knowledge packs, informes, citas de fuentes y revision de calidad.',
        "fr": 'Dans ProjecTile, le modele cible n’est pas "tout demander a un seul modele". Il ressemble davantage a un Engineering Director qui coordonne specialistes, outils deterministes, knowledge packs, rapports, citations de sources et revue qualite.',
    },
    "Engineering intelligence should coordinate engineering work. It should not hide uncertainty behind fluent language.": {
        "nl": "Engineering intelligence moet engineeringwerk coordineren. Het mag onzekerheid niet verbergen achter vloeiende taal.",
        "pl": "Engineering intelligence powinna koordynowac prace inzynierska. Nie powinna ukrywac niepewnosci za plynna mowa.",
        "de": "Engineering intelligence sollte Engineering-Arbeit koordinieren. Sie sollte Unsicherheit nicht hinter fluessiger Sprache verbergen.",
        "es": "Engineering intelligence debe coordinar el trabajo de ingenieria. No debe ocultar la incertidumbre detras de lenguaje fluido.",
        "fr": "Engineering intelligence doit coordonner le travail d’ingenierie. Elle ne doit pas cacher l’incertitude derriere un langage fluide.",
    },
    "When a deterministic method exists, the platform should use it. A battery runtime estimate, DC power balance, voltage drop, torque conversion, or OEE calculation should not be invented by a probabilistic model each time the question is asked.": {
        "nl": "Wanneer een deterministische methode bestaat, moet het platform die gebruiken. Een batterij-runtime-inschatting, DC-vermogensbalans, spanningsval, koppelconversie of OEE-berekening mag niet telkens opnieuw door een probabilistisch model worden verzonnen.",
        "pl": "Gdy istnieje metoda deterministyczna, platforma powinna jej uzyc. Szacunek czasu pracy baterii, bilans mocy DC, spadek napiecia, konwersja momentu albo obliczenie OEE nie powinny byc za kazdym razem wymyslane przez model probabilistyczny.",
        "de": "Wenn eine deterministische Methode existiert, sollte die Plattform sie nutzen. Eine Batterielaufzeit-Schaetzung, DC-Leistungsbilanz, Spannungsfall-, Drehmomentumrechnung oder OEE-Berechnung sollte nicht jedes Mal von einem probabilistischen Modell erfunden werden.",
        "es": "Cuando existe un metodo determinista, la plataforma debe usarlo. Una estimacion de autonomia de bateria, balance de potencia DC, caida de tension, conversion de par o calculo OEE no debe ser inventado por un modelo probabilistico cada vez que se pregunta.",
        "fr": "Lorsqu’une methode deterministe existe, la plateforme doit l’utiliser. Une estimation d’autonomie batterie, un bilan de puissance DC, une chute de tension, une conversion de couple ou un calcul OEE ne doivent pas etre inventes par un modele probabiliste a chaque demande.",
    },
    "This does not reduce the value of AI. It makes AI safer and more useful. The model can identify missing inputs, explain trade-offs, and assemble the report, while the calculation remains auditable.": {
        "nl": "Dit vermindert de waarde van AI niet. Het maakt AI veiliger en nuttiger. Het model kan ontbrekende invoer herkennen, trade-offs uitleggen en het rapport samenstellen, terwijl de berekening auditeerbaar blijft.",
        "pl": "To nie zmniejsza wartosci AI. Sprawia, ze AI jest bezpieczniejsza i bardziej uzyteczna. Model moze wskazac brakujace dane, wyjasnic kompromisy i zlozyc raport, podczas gdy obliczenie pozostaje audytowalne.",
        "de": "Das verringert den Wert von AI nicht. Es macht AI sicherer und nuetzlicher. Das Modell kann fehlende Eingaben erkennen, Trade-offs erklaeren und den Bericht zusammenstellen, waehrend die Berechnung auditierbar bleibt.",
        "es": "Esto no reduce el valor de AI. Hace que AI sea mas segura y util. El modelo puede identificar entradas faltantes, explicar compromisos y montar el informe, mientras el calculo sigue siendo auditable.",
        "fr": "Cela ne reduit pas la valeur de l’AI. Cela la rend plus sure et plus utile. Le modele peut identifier les entrees manquantes, expliquer les compromis et assembler le rapport, tandis que le calcul reste auditable.",
    },
    "AI augments engineering work. Engineering governance still requires systems.": {
        "nl": "AI versterkt engineeringwerk. Engineering governance vereist nog steeds systemen.",
        "pl": "AI wzmacnia prace inzynierska. Governance inzynierski nadal wymaga systemow.",
        "de": "AI erweitert Engineering-Arbeit. Engineering-Governance braucht weiterhin Systeme.",
        "es": "AI aumenta el trabajo de ingenieria. La gobernanza de ingenieria sigue requiriendo sistemas.",
        "fr": "L’AI augmente le travail d’ingenierie. La gouvernance d’ingenierie exige toujours des systemes.",
    },
    "Engineering organisations need to know where a claim came from. Was it from a standard, a manual, a calculation, a vendor drawing, a test, a site observation, or an engineer's judgement? Without that distinction, engineering knowledge becomes difficult to trust.": {
        "nl": "Engineeringorganisaties moeten weten waar een claim vandaan komt. Kwam die uit een norm, handleiding, berekening, leverancierstekening, test, site-observatie of het oordeel van een engineer? Zonder dat onderscheid wordt engineeringkennis moeilijk te vertrouwen.",
        "pl": "Organizacje inzynierskie musza wiedziec, skad pochodzi twierdzenie. Czy pochodzi ze standardu, instrukcji, obliczenia, rysunku dostawcy, testu, obserwacji na miejscu czy osadu inzyniera? Bez tego rozroznienia wiedzy inzynierskiej trudno zaufac.",
        "de": "Engineering-Organisationen muessen wissen, woher eine Aussage stammt. Kam sie aus einem Standard, einem Handbuch, einer Berechnung, einer Lieferantenzeichnung, einem Test, einer Vor-Ort-Beobachtung oder dem Urteil eines Engineers? Ohne diese Unterscheidung wird Engineering-Wissen schwer vertrauenswuerdig.",
        "es": "Las organizaciones de ingenieria necesitan saber de donde proviene una afirmacion. Viene de una norma, un manual, un calculo, un plano de proveedor, una prueba, una observacion en sitio o el criterio de un ingeniero? Sin esa distincion, el conocimiento de ingenieria se vuelve dificil de confiar.",
        "fr": "Les organisations d’ingenierie doivent savoir d’ou vient une affirmation. Provient-elle d’un standard, d’un manuel, d’un calcul, d’un plan fournisseur, d’un essai, d’une observation terrain ou du jugement d’un ingenieur? Sans cette distinction, la connaissance d’ingenierie devient difficile a fiabiliser.",
    },
    "Traceability is especially important when projects are long lived. A decision made during concept design may affect procurement, commissioning, maintenance, and future upgrades. ProjecTile treats sources, reports, decisions, and calculations as evidence objects that can be linked and reviewed.": {
        "nl": "Traceerbaarheid is extra belangrijk bij langlopende projecten. Een besluit tijdens conceptontwerp kan inkoop, commissioning, onderhoud en toekomstige upgrades beinvloeden. ProjecTile behandelt bronnen, rapporten, besluiten en berekeningen als bewijsobjecten die gekoppeld en beoordeeld kunnen worden.",
        "pl": "Identyfikowalnosc jest szczegolnie wazna w projektach dlugotrwalych. Decyzja z etapu koncepcji moze wplynac na zakupy, uruchomienie, utrzymanie i przyszle modernizacje. ProjecTile traktuje zrodla, raporty, decyzje i obliczenia jako obiekty dowodowe, ktore mozna laczyc i przegladac.",
        "de": "Rueckverfolgbarkeit ist besonders wichtig bei langlebigen Projekten. Eine Entscheidung im Konzeptdesign kann Beschaffung, Inbetriebnahme, Wartung und spaetere Upgrades beeinflussen. ProjecTile behandelt Quellen, Berichte, Entscheidungen und Berechnungen als Nachweisobjekte, die verknuepft und geprueft werden koennen.",
        "es": "La trazabilidad es especialmente importante en proyectos de larga vida. Una decision tomada durante el diseno conceptual puede afectar compras, puesta en marcha, mantenimiento y futuras actualizaciones. ProjecTile trata fuentes, informes, decisiones y calculos como objetos de evidencia que pueden enlazarse y revisarse.",
        "fr": "La tracabilite est particulierement importante pour les projets de longue duree. Une decision prise en conception conceptuelle peut influencer les achats, la mise en service, la maintenance et les futures evolutions. ProjecTile traite sources, rapports, decisions et calculs comme des objets de preuve pouvant etre relies et revus.",
    },
    "Engineering memory is the durable record of what a team learned. Engineering DNA is the promoted layer: reusable lessons, decisions, patterns, workflows, templates, and capability evidence that should survive beyond one project.": {
        "nl": "Engineeringgeheugen is het duurzame verslag van wat een team heeft geleerd. Engineering DNA is de gepromoveerde laag: herbruikbare lessen, besluiten, patronen, workflows, templates en capability-bewijs dat langer moet meegaan dan een project.",
        "pl": "Pamiec inzynierska to trwaly zapis tego, czego nauczyl sie zespol. Engineering DNA to warstwa promowana: wielokrotnego uzycia lekcje, decyzje, wzorce, workflowy, szablony i dowody zdolnosci, ktore powinny przetrwac jeden projekt.",
        "de": "Engineering-Gedaechtnis ist die dauerhafte Aufzeichnung dessen, was ein Team gelernt hat. Engineering DNA ist die promovierte Ebene: wiederverwendbare Lessons Learned, Entscheidungen, Muster, Workflows, Templates und Faehigkeitsnachweise, die ueber ein Projekt hinaus bestehen sollten.",
        "es": "La memoria de ingenieria es el registro duradero de lo que aprendio un equipo. Engineering DNA es la capa promovida: lecciones, decisiones, patrones, workflows, plantillas y evidencia de capacidad reutilizables que deben sobrevivir mas alla de un proyecto.",
        "fr": "La memoire d’ingenierie est l’enregistrement durable de ce qu’une equipe a appris. Engineering DNA est la couche promue: lecons, decisions, modeles, workflows, templates et preuves de capacite reutilisables qui doivent survivre a un projet.",
    },
    "This matters because organisations repeatedly lose knowledge when documents are scattered, people move roles, or project context disappears. A model can answer a question today, but a system must preserve what was learned so the next project starts from a stronger baseline.": {
        "nl": "Dit is belangrijk omdat organisaties herhaaldelijk kennis verliezen wanneer documenten verspreid raken, mensen van rol veranderen of projectcontext verdwijnt. Een model kan vandaag een vraag beantwoorden, maar een systeem moet bewaren wat is geleerd zodat het volgende project vanaf een sterkere basis start.",
        "pl": "To ma znaczenie, bo organizacje wielokrotnie traca wiedze, gdy dokumenty sa rozproszone, ludzie zmieniaja role albo znika kontekst projektu. Model moze odpowiedziec na pytanie dzisiaj, ale system musi zachowac to, czego sie nauczono, aby nastepny projekt startowal z mocniejszej bazy.",
        "de": "Das ist wichtig, weil Organisationen Wissen wiederholt verlieren, wenn Dokumente verstreut sind, Menschen Rollen wechseln oder Projektkontext verschwindet. Ein Modell kann heute eine Frage beantworten, aber ein System muss das Gelernte bewahren, damit das naechste Projekt von einer staerkeren Basis startet.",
        "es": "Esto importa porque las organizaciones pierden conocimiento repetidamente cuando los documentos estan dispersos, las personas cambian de rol o desaparece el contexto del proyecto. Un modelo puede responder una pregunta hoy, pero un sistema debe preservar lo aprendido para que el siguiente proyecto empiece desde una base mas fuerte.",
        "fr": "C’est important parce que les organisations perdent regulierement de la connaissance lorsque les documents sont disperses, que les personnes changent de role ou que le contexte projet disparait. Un modele peut repondre aujourd’hui, mais un systeme doit conserver ce qui a ete appris pour que le projet suivant parte d’une base plus solide.",
    },
    "Engineering readiness is a way to make capability visible. It asks whether the organisation has implemented tools, validation, documentation, evidence, workflow integration, and production checks. It separates \"we built a feature\" from \"we can rely on this capability.\"": {
        "nl": "Engineering readiness maakt capability zichtbaar. Het vraagt of de organisatie tools, validatie, documentatie, bewijs, workflow-integratie en productiechecks heeft geimplementeerd. Het scheidt \"we hebben een feature gebouwd\" van \"we kunnen op deze capability vertrouwen\".",
        "pl": "Engineering readiness to sposob na uwidocznienie zdolnosci. Pyta, czy organizacja wdrozyla narzedzia, walidacje, dokumentacje, dowody, integracje workflow i kontrole produkcyjne. Oddziela \"zbudowalismy funkcje\" od \"mozemy polegac na tej zdolnosci\".",
        "de": "Engineering Readiness macht Faehigkeit sichtbar. Sie fragt, ob die Organisation Werkzeuge, Validierung, Dokumentation, Nachweise, Workflow-Integration und Produktionspruefungen umgesetzt hat. Sie trennt \"wir haben ein Feature gebaut\" von \"wir koennen uns auf diese Faehigkeit verlassen\".",
        "es": "Engineering readiness es una forma de hacer visible la capacidad. Pregunta si la organizacion ha implementado herramientas, validacion, documentacion, evidencia, integracion de workflow y controles de produccion. Separa \"construimos una funcionalidad\" de \"podemos confiar en esta capacidad\".",
        "fr": "Engineering readiness rend la capacite visible. Elle demande si l’organisation a mis en place outils, validation, documentation, preuves, integration workflow et controles de production. Elle distingue \"nous avons construit une fonctionnalite\" de \"nous pouvons compter sur cette capacite\".",
    },
    "For ProjecTile, readiness also prevents false confidence. A feature with limited tests, weak evidence, or poor citations should not be treated the same as a validated engineering workflow with reports, deterministic calculations, quality review, and source traceability.": {
        "nl": "Voor ProjecTile voorkomt readiness ook vals vertrouwen. Een feature met beperkte tests, zwak bewijs of slechte citaties mag niet hetzelfde worden behandeld als een gevalideerde engineeringworkflow met rapporten, deterministische berekeningen, kwaliteitsreview en brontraceerbaarheid.",
        "pl": "Dla ProjecTile readiness zapobiega tez falszywej pewnosci. Funkcja z ograniczonymi testami, slabymi dowodami albo slabymi cytowaniami nie powinna byc traktowana tak samo jak zwalidowany workflow inzynierski z raportami, deterministycznymi obliczeniami, przegladem jakosci i traceability zrodel.",
        "de": "Fuer ProjecTile verhindert Readiness auch falsches Vertrauen. Ein Feature mit begrenzten Tests, schwachen Nachweisen oder schlechten Zitaten sollte nicht wie ein validierter Engineering-Workflow mit Berichten, deterministischen Berechnungen, Qualitaetsreview und Quellenrueckverfolgbarkeit behandelt werden.",
        "es": "Para ProjecTile, la readiness tambien evita falsa confianza. Una funcionalidad con pruebas limitadas, evidencia debil o malas citas no debe tratarse igual que un workflow de ingenieria validado con informes, calculos deterministas, revision de calidad y trazabilidad de fuentes.",
        "fr": "Pour ProjecTile, la readiness evite aussi la fausse confiance. Une fonctionnalite avec peu de tests, des preuves faibles ou de mauvaises citations ne doit pas etre traitee comme un workflow d’ingenierie valide avec rapports, calculs deterministes, revue qualite et tracabilite des sources.",
    },
    "ProjecTile is being built as an Engineering Operating System. The goal is to combine AI assistance with structured engineering systems: deterministic toolboxes, knowledge graph relationships, Engineering DNA, readiness scoring, reports, and review workflows.": {
        "nl": "ProjecTile wordt gebouwd als Engineering Operating System. Het doel is AI-assistentie te combineren met gestructureerde engineeringsystemen: deterministische toolboxes, knowledge graph-relaties, Engineering DNA, readiness-scoring, rapporten en reviewworkflows.",
        "pl": "ProjecTile jest budowany jako Engineering Operating System. Celem jest polaczenie asysty AI ze strukturalnymi systemami inzynierskimi: deterministycznymi toolboxami, relacjami Knowledge Graph, Engineering DNA, ocena readiness, raportami i workflowami przegladu.",
        "de": "ProjecTile wird als Engineering Operating System aufgebaut. Ziel ist, AI-Unterstuetzung mit strukturierten Engineering-Systemen zu kombinieren: deterministische Toolboxes, Knowledge-Graph-Beziehungen, Engineering DNA, Readiness-Scoring, Berichte und Review-Workflows.",
        "es": "ProjecTile se construye como Engineering Operating System. El objetivo es combinar asistencia AI con sistemas de ingenieria estructurados: toolboxes deterministas, relaciones de Knowledge Graph, Engineering DNA, puntuacion de readiness, informes y workflows de revision.",
        "fr": "ProjecTile est construit comme Engineering Operating System. L’objectif est de combiner assistance AI et systemes d’ingenierie structures: toolboxes deterministes, relations Knowledge Graph, Engineering DNA, scoring de readiness, rapports et workflows de revue.",
    },
    "The point is not to replace engineers. Engineers remain responsible for engineering decisions. The platform should help them find context, structure reasoning, preserve evidence, identify missing information, and produce reviewable deliverables.": {
        "nl": "Het doel is niet engineers te vervangen. Engineers blijven verantwoordelijk voor engineeringbesluiten. Het platform moet hen helpen context te vinden, redenering te structureren, bewijs te bewaren, ontbrekende informatie te herkennen en reviewbare deliverables te produceren.",
        "pl": "Celem nie jest zastapienie inzynierow. Inzynierowie pozostaja odpowiedzialni za decyzje inzynierskie. Platforma ma pomagac im znajdowac kontekst, strukturyzowac rozumowanie, zachowywac dowody, identyfikowac brakujace informacje i tworzyc deliverables gotowe do przegladu.",
        "de": "Ziel ist nicht, Engineers zu ersetzen. Engineers bleiben fuer Engineering-Entscheidungen verantwortlich. Die Plattform soll helfen, Kontext zu finden, reasoning zu strukturieren, Nachweise zu bewahren, fehlende Informationen zu erkennen und pruefbare Deliverables zu erstellen.",
        "es": "El objetivo no es reemplazar a los ingenieros. Los ingenieros siguen siendo responsables de las decisiones de ingenieria. La plataforma debe ayudarles a encontrar contexto, estructurar razonamiento, preservar evidencia, identificar informacion faltante y producir entregables revisables.",
        "fr": "Le but n’est pas de remplacer les ingenieurs. Les ingenieurs restent responsables des decisions d’ingenierie. La plateforme doit les aider a trouver le contexte, structurer le raisonnement, conserver les preuves, identifier les informations manquantes et produire des livrables revisables.",
    },
}

EXTRA = {
    "Related": {"nl": "Gerelateerd", "pl": "Powiazane", "de": "Verwandt", "es": "Relacionado", "fr": "Lie"},
    "Why deterministic engineering calculations still matter in the age of AI": {
        "nl": "Waarom deterministische engineeringberekeningen belangrijk blijven in het tijdperk van AI",
        "pl": "Dlaczego deterministyczne obliczenia inzynierskie nadal maja znaczenie w erze AI",
        "de": "Warum deterministische Engineering-Berechnungen im Zeitalter von AI wichtig bleiben",
        "es": "Por que los calculos deterministas de ingenieria siguen importando en la era de AI",
        "fr": "Pourquoi les calculs d’ingenierie deterministes restent importants a l’ere de l’AI",
    },
    "Engineering Intelligence technology principles": {
        "nl": "Technologieprincipes voor Engineering Intelligence",
        "pl": "Zasady technologii Engineering Intelligence",
        "de": "Technologieprinzipien fuer Engineering Intelligence",
        "es": "Principios tecnologicos de Engineering Intelligence",
        "fr": "Principes technologiques d’Engineering Intelligence",
    },
    "Previous: Engineering Journal": {"nl": "Vorige: Engineering Journal", "pl": "Poprzednie: Engineering Journal", "de": "Zurueck: Engineering Journal", "es": "Anterior: Engineering Journal", "fr": "Precedent: Engineering Journal"},
    "Next: Deterministic calculations": {"nl": "Volgende: deterministische berekeningen", "pl": "Nastepne: obliczenia deterministyczne", "de": "Weiter: deterministische Berechnungen", "es": "Siguiente: calculos deterministas", "fr": "Suivant: calculs deterministes"},
    "Home": {"nl": "Home", "pl": "Start", "de": "Start", "es": "Inicio", "fr": "Accueil"},
    "Why GPT Is Not Enough": {"nl": "Waarom GPT niet genoeg is", "pl": "Dlaczego GPT nie wystarcza", "de": "Warum GPT nicht ausreicht", "es": "Por que GPT no basta", "fr": "Pourquoi GPT ne suffit pas"},
}


def main() -> None:
    phrases = {**ARTICLE, **EXTRA}
    for lang in LANGS:
        path = ROOT / "i18n" / f"{lang}.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        strings = data.setdefault("strings", {})
        for source, translations in phrases.items():
            strings[source] = translations[lang]
        data["seo"]["articleTitle"] = (
            ARTICLE["Why GPT Is Not Enough for Complex Engineering Organisations"][lang]
            + " | Tech Forge Collective"
        )
        data["seo"]["articleDescription"] = ARTICLE[
            "A TFC engineering article on why complex engineering organisations need more than chat."
        ][lang]
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
